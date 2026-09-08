import json
import math
import os
import queue
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import wave
from array import array
from dataclasses import dataclass
from datetime import date, datetime, timezone
from statistics import median
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from .analyzer_backend import analyzer_command, resolve_backend, stem_command
from .config import DATA_AUDIO_DIR, DATA_DIR, DATA_RESULTS_DIR, DATA_STEMS_DIR, DATA_VIDEO_DIR, DATA_WORK_DIR, DEVICE_SYNC_STATE_FILE, FOLDERS_FILE, MANIFEST_FILE, PUBLIC_AUDIO_DIR, PUBLIC_DIR, PUBLIC_RESULTS_DIR, PUBLIC_STEMS_DIR, PUBLIC_VIDEO_DIR, SOURCE_ROOT, default_wsl_python
from .cloud_storage import build_r2_session_assets, configure_bucket_cors, delete_session_assets, get_r2_config, upload_file, upload_folders, upload_manifest, upload_session_assets, upload_static_app
from .cloud_sync import sync_cloud_incremental
from .device_sync import record_session_deletions
from .source_media import download_video, extract_wav_from_video, get_title, normalize_analysis_range, source_media_cache_paths, trim_audio_range, trim_video_range
from .optional_features import mac_analysis_runtime_executable, windows_cpu_runtime_executable
from .process_manager import job_process_context, run_process, running_process, start_process, terminate_process, unregister_process
from .storage import STEM_NAMES, attach_session_assets, build_manifest_entry, export_static_assets, load_manifest, save_json, update_manifest
from .timing import normalize_section_bar_ranges, normalize_tempo_grid
from .timing_corrections import apply_timing_correction
from .loudness import measure_stem_gain

REPO_ROOT = SOURCE_ROOT
ANALYZE_SCRIPT = SOURCE_ROOT / "scripts" / "analyze_audio.py"
SPLIT_STEMS_SCRIPT = SOURCE_ROOT / "scripts" / "split_stems.py"
WSL_PYTHON = default_wsl_python()
JOB_LOCK = threading.Lock()
JOBS: dict[str, dict] = {}
JOB_QUEUE: queue.Queue["QueuedJob"] = queue.Queue()
CLOUD_JOB_QUEUE: queue.Queue["QueuedJob"] = queue.Queue()
JOB_WORKERS_STARTED: set[str] = set()
JOB_STORE_FILE = DATA_DIR / "jobs.json"
JOB_STORE_LOADED = False
class JobCanceledError(RuntimeError):
    pass


@dataclass(frozen=True)
class QueuedJob:
    id: str
    description: str
    func: object
    cleanup: object | None = None


@dataclass(frozen=True)
class AnalyzerRuntimeConfig:
    timeout_seconds: int
    no_output_timeout_seconds: int | None
    heartbeat_seconds: int
    device: str


def get_analyzer_runtime_config() -> AnalyzerRuntimeConfig:
    timeout_seconds = int(os.environ.get("ANALYZER_TIMEOUT_SECONDS", "1800"))
    no_output_timeout_seconds = int(os.environ.get("ANALYZER_NO_OUTPUT_TIMEOUT_SECONDS", "0"))
    heartbeat_seconds = int(os.environ.get("ANALYZER_HEARTBEAT_SECONDS", "30"))
    return AnalyzerRuntimeConfig(
        timeout_seconds=timeout_seconds,
        no_output_timeout_seconds=no_output_timeout_seconds if no_output_timeout_seconds > 0 else None,
        heartbeat_seconds=max(1, heartbeat_seconds),
        device=os.environ.get("ANALYZER_DEVICE", "auto").strip().lower() or "auto",
    )


def cli_log(video_id: str, message: str) -> None:
    timestamp = time.strftime("%H:%M:%S")
    line = f"[{timestamp}] [{video_id}] {message}"
    encoding = getattr(sys.stdout, "encoding", None) or "utf-8"
    safe_line = line.encode(encoding, errors="backslashreplace").decode(encoding)
    print(safe_line, flush=True)


def persist_jobs_locked() -> None:
    JOB_STORE_FILE.parent.mkdir(parents=True, exist_ok=True)
    temporary = JOB_STORE_FILE.with_suffix(".json.tmp")
    payload = sorted(JOBS.values(), key=lambda item: item.get("updated_at", 0), reverse=True)[:200]
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(JOB_STORE_FILE)


def initialize_job_store() -> None:
    global JOB_STORE_LOADED
    with JOB_LOCK:
        if JOB_STORE_LOADED:
            return
        JOB_STORE_LOADED = True
        if not JOB_STORE_FILE.exists():
            return
        try:
            payload = json.loads(JOB_STORE_FILE.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return
        if not isinstance(payload, list):
            return
        now = time.time()
        for item in payload:
            if not isinstance(item, dict) or not isinstance(item.get("id"), str):
                continue
            job = dict(item)
            if job.get("archived"):
                # Archived attempts belong in history only. They must never be
                # offered as separate resumable work after another restart.
                job["resumable"] = False
            elif not job.get("done"):
                job.update(
                    {
                        "stage": "interrupted",
                        "message": "Application restarted; resume when ready",
                        "done": True,
                        "error": None,
                        "interrupted": True,
                        "resumable": isinstance(job.get("spec"), dict),
                        "cancel_requested": False,
                        "updated_at": now,
                        "finished_at": now,
                    }
                )
            elif not job.get("finished_at") and job.get("updated_at"):
                # Older PracticeLab versions only stored updated_at. For a
                # completed job that timestamp is the best available finish.
                job["finished_at"] = job["updated_at"]
            if not job.get("display_title"):
                spec = job.get("spec") if isinstance(job.get("spec"), dict) else {}
                target_id = spec.get("videoId")
                if not isinstance(target_id, str):
                    target_id = str(job["id"]).split(":history:", 1)[0].split(":", 1)[0]
                result_files = [DATA_RESULTS_DIR / f"{target_id}.json"]
                source_id = target_id.split("-clip-", 1)[0]
                if source_id and source_id == target_id:
                    result_files.extend(sorted(DATA_RESULTS_DIR.glob(f"{source_id}-clip-*.json")))
                title = None
                for result_file in result_files:
                    try:
                        title = json.loads(result_file.read_text(encoding="utf-8")).get("title")
                    except (OSError, json.JSONDecodeError):
                        continue
                    if title:
                        break
                if title:
                    job["display_title"] = str(title)[:300]
                elif spec.get("type") == "analyze_file" and spec.get("title"):
                    job["display_title"] = str(spec["title"])[:300]
            JOBS[job["id"]] = job
        persist_jobs_locked()


def list_job_statuses(*, recoverable_only: bool = False) -> list[dict]:
    with JOB_LOCK:
        values = [dict(job) for job in JOBS.values()]
    if recoverable_only:
        values = [
            job for job in values
            if job.get("interrupted") and job.get("resumable") and not job.get("archived")
        ]
    return sorted(values, key=lambda item: item.get("updated_at", 0), reverse=True)


def list_job_history() -> list[dict]:
    history = []
    for job in list_job_statuses():
        started_at = job.get("started_at")
        finished_at = job.get("finished_at") or (job.get("updated_at") if job.get("done") else None)
        summary = {key: value for key, value in job.items() if key not in {"result", "spec"}}
        summary["finished_at"] = finished_at
        summary["duration_seconds"] = (
            max(0.0, float(finished_at) - float(started_at))
            if started_at is not None and finished_at is not None
            else None
        )
        history.append(summary)
    return history


def get_resumable_job_spec(job_id: str) -> dict:
    with JOB_LOCK:
        job = JOBS.get(job_id)
        if not job or not job.get("interrupted") or not job.get("resumable"):
            raise ValueError("再開できる中断ジョブがありません")
        spec = job.get("spec")
        if not isinstance(spec, dict):
            raise ValueError("ジョブの再開情報がありません")
        return dict(spec)


def cancel_interrupted_job(job_id: str) -> dict:
    with JOB_LOCK:
        job = JOBS.get(job_id)
        if not job:
            raise ValueError("job not found")
        if not job.get("interrupted") or not job.get("done") or not job.get("resumable"):
            raise ValueError("再開待ちの処理だけをキャンセルできます")
        now = time.time()
        job.update({
            "stage": "canceled",
            "message": "Canceled",
            "done": True,
            "error": None,
            "canceled": True,
            "cancel_requested": True,
            "interrupted": False,
            "resumable": False,
            "updated_at": now,
            "finished_at": now,
        })
        # A canceled interrupted job must not retain enough information to be
        # accidentally resumed by a future version.
        job.pop("spec", None)
        persist_jobs_locked()
        return dict(job)


def set_job_status(video_id: str, stage: str, message: str, *, done: bool = False, error: str | None = None) -> None:
    now = time.time()
    with JOB_LOCK:
        current = JOBS.get(video_id, {"id": video_id, "started_at": now})
        previous_stage = current.get("stage")
        previous_message = current.get("message")
        previous_error = current.get("error")
        current.update(
            {
                "stage": stage,
                "message": message,
                "done": done,
                "error": error,
                "updated_at": now,
            }
        )
        if done:
            current["finished_at"] = now
        current.setdefault("started_at", now)
        JOBS[video_id] = current
        persist_jobs_locked()
    if (stage, message, error) != (previous_stage, previous_message, previous_error):
        cli_log(video_id, error or message)


def set_job_display_title(job_id: str, title: str) -> None:
    clean_title = str(title or "").strip()[:300]
    if not clean_title:
        return
    with JOB_LOCK:
        current = JOBS.get(job_id)
        if not current:
            return
        current["display_title"] = clean_title
        current["updated_at"] = time.time()
        persist_jobs_locked()


def get_job_status(video_id: str) -> dict | None:
    with JOB_LOCK:
        job = JOBS.get(video_id)
        return dict(job) if job else None


def complete_job_status(video_id: str, message: str, result: dict) -> None:
    now = time.time()
    with JOB_LOCK:
        current = JOBS.get(video_id, {"id": video_id, "started_at": now})
        current.update(
            {
                "stage": "done",
                "message": message,
                "done": True,
                "error": None,
                "result": result,
                "updated_at": now,
                "finished_at": now,
            }
        )
        current.setdefault("started_at", now)
        JOBS[video_id] = current
        persist_jobs_locked()
    cli_log(video_id, message)


def is_job_cancel_requested(job_id: str) -> bool:
    with JOB_LOCK:
        return bool(JOBS.get(job_id, {}).get("cancel_requested"))


def raise_if_job_canceled(job_id: str) -> None:
    if is_job_cancel_requested(job_id):
        raise JobCanceledError("Canceled")


def mark_job_canceled(job_id: str) -> None:
    now = time.time()
    with JOB_LOCK:
        current = JOBS.get(job_id, {"id": job_id, "started_at": now})
        current.update(
            {
                "stage": "canceled",
                "message": "Canceled",
                "done": True,
                "error": None,
                "canceled": True,
                "cancel_requested": True,
                "updated_at": now,
                "finished_at": now,
            }
        )
        current.setdefault("started_at", now)
        JOBS[job_id] = current
        persist_jobs_locked()
    cli_log(job_id, "Canceled")


def cancel_job(job_id: str) -> dict:
    process = None
    with JOB_LOCK:
        current = JOBS.get(job_id)
        if not current:
            raise ValueError("job not found")
        if current.get("done"):
            current.setdefault("canceled", current.get("stage") == "canceled")
            return dict(current)
        current["cancel_requested"] = True
        current["message"] = "Cancel requested"
        current["updated_at"] = time.time()
        process = running_process(job_id)
        queued = current.get("stage") == "queued"
        persist_jobs_locked()
    if process is not None:
        terminate_process(process)
    if queued:
        mark_job_canceled(job_id)
    return get_job_status(job_id) or {"id": job_id, "stage": "canceled", "done": True, "canceled": True}


def queued_job_worker(job_queue: queue.Queue["QueuedJob"]) -> None:
    while True:
        job = job_queue.get()
        try:
            if is_job_cancel_requested(job.id):
                mark_job_canceled(job.id)
                continue
            set_job_status(job.id, "running", job.description)
            raise_if_job_canceled(job.id)
            with job_process_context(job.id):
                result = job.func()
            raise_if_job_canceled(job.id)
            complete_job_status(job.id, "Complete", result)
        except JobCanceledError:
            if job.cleanup:
                job.cleanup()
            mark_job_canceled(job.id)
        except Exception as exc:
            if is_job_cancel_requested(job.id):
                if job.cleanup:
                    job.cleanup()
                mark_job_canceled(job.id)
            else:
                set_job_status(job.id, "error", str(exc), done=True, error=str(exc))
        finally:
            job_queue.task_done()


def ensure_job_worker(lane: str = "compute") -> None:
    job_queue = CLOUD_JOB_QUEUE if lane == "cloud" else JOB_QUEUE
    with JOB_LOCK:
        if lane in JOB_WORKERS_STARTED:
            return
        JOB_WORKERS_STARTED.add(lane)
    thread = threading.Thread(
        target=queued_job_worker,
        args=(job_queue,),
        name=f"practice-lab-{lane}-job-worker",
        daemon=True,
    )
    thread.start()


def submit_queued_job(job_id: str, description: str, func, cleanup=None, *, spec: dict | None = None, kind: str | None = None) -> dict:
    lane = "cloud" if kind == "cloud-sync" else "compute"
    ensure_job_worker(lane)
    job_queue = CLOUD_JOB_QUEUE if lane == "cloud" else JOB_QUEUE
    now = time.time()
    with JOB_LOCK:
        existing = JOBS.get(job_id)
        if existing and not existing.get("done"):
            return {
                "jobId": job_id,
                "stage": existing.get("stage", "queued"),
                "message": existing.get("message", description),
            }
        if existing and existing.get("done"):
            # Repeated operations intentionally reuse a stable polling id.
            # Archive the previous run before replacing it so the history UI
            # keeps every execution rather than only the latest one.
            archive_id = f"{job_id}:history:{int(float(existing.get('started_at', now)) * 1000)}"
            archived = dict(existing)
            archived.update({"id": archive_id, "source_job_id": job_id, "archived": True})
            JOBS[archive_id] = archived
        # A job id is intentionally reused for repeated work on the same video.
        # Build a fresh record instead of updating the completed one: otherwise
        # cancel_requested from an earlier run poisons every later submission.
        JOBS[job_id] = {
            "id": job_id,
            "stage": "queued",
            "message": description,
            "done": False,
            "error": None,
            "canceled": False,
            "cancel_requested": False,
            "started_at": now,
            "updated_at": now,
            "description": description,
            "kind": kind,
            "spec": spec,
            "resumable": False,
            "interrupted": False,
        }
        persist_jobs_locked()
    cli_log(job_id, description)
    job_queue.put(QueuedJob(job_id, description, func, cleanup))
    return {"jobId": job_id, "stage": "queued", "message": description}


def extract_video_id(url: str) -> str | None:
    try:
        parsed = urlparse(url)
        if parsed.hostname == "youtu.be":
            return parsed.path.lstrip("/").split("?")[0]
        if parsed.hostname in ("www.youtube.com", "youtube.com", "m.youtube.com"):
            return parse_qs(parsed.query).get("v", [None])[0]
    except Exception:
        return None
    return None


def build_analysis_session_id(
    video_id: str, start_sec: float | None, end_sec: float | None
) -> str:
    start, end = normalize_analysis_range(start_sec, end_sec)
    if start is None and end is None:
        return video_id
    start_ms = round((start or 0) * 1000)
    end_part = "end" if end is None else str(round(end * 1000))
    return f"{video_id}-clip-{start_ms}-{end_part}"


def format_seconds(value: float) -> str:
    total = max(0, round(value))
    hours, remainder = divmod(total, 3600)
    minutes, seconds = divmod(remainder, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"


def publish_video(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and os.path.samefile(source, destination):
        return
    if destination.exists() and source.stat().st_mtime_ns == destination.stat().st_mtime_ns:
        return
    with tempfile.NamedTemporaryFile(prefix=f".{destination.name}-", dir=destination.parent, delete=False) as temporary:
        temporary_path = Path(temporary.name)
    temporary_path.unlink(missing_ok=True)
    try:
        try:
            os.link(source, temporary_path)
        except OSError:
            shutil.copy2(source, temporary_path)
        temporary_path.replace(destination)
    finally:
        temporary_path.unlink(missing_ok=True)


def convert_wav_to_mp3(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    analysis_filter = "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json"
    analysis = run_process(
        [
            "ffmpeg",
            "-i",
            str(source),
            "-af",
            analysis_filter,
            "-f",
            "null",
            "-",
            "-y",
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=True,
    )
    match = re.search(r"(\{\s*\"input_i\".*?\})", analysis.stderr, re.DOTALL)
    if not match:
        raise RuntimeError("ffmpeg loudnorm analysis output not found")

    measured = json.loads(match.group(1))
    normalize_filter = (
        "loudnorm=I=-16:TP=-1.5:LRA=11:"
        f"measured_I={measured['input_i']}:"
        f"measured_LRA={measured['input_lra']}:"
        f"measured_TP={measured['input_tp']}:"
        f"measured_thresh={measured['input_thresh']}:"
        f"offset={measured['target_offset']}:"
        "linear=true:print_format=summary"
    )
    run_process(
        [
            "ffmpeg",
            "-i",
            str(source),
            "-af",
            normalize_filter,
            "-c:a",
            "libmp3lame",
            "-b:a",
            "128k",
            str(destination),
            "-y",
        ],
        capture_output=True,
        check=True,
    )


def convert_audio_to_wav(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    run_process(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-vn",
            "-acodec",
            "pcm_s16le",
            "-ar",
            "44100",
            "-y",
            str(destination),
        ],
        capture_output=True,
        text=True,
        check=True,
    )


def convert_stem_wav_to_mp3(source: Path, destination: Path, *, gain_db: float = 0.0) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    run_process(
        [
            "ffmpeg",
            "-i",
            str(source),
            "-af",
            f"volume={gain_db:.6f}dB",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "192k",
            str(destination),
            "-y",
        ],
        capture_output=True,
        check=True,
    )


def export_stem_mix(
    video_id: str,
    stem_volumes: dict[str, float],
    *,
    start_sec: float | None = None,
    end_sec: float | None = None,
    click_times: list[float] | None = None,
    click_volume: float = 0,
) -> Path:
    """Render the enabled stems and their current volume levels to a temporary MP3."""
    active_stems: list[tuple[str, float]] = []
    for stem in STEM_NAMES:
        volume = float(stem_volumes.get(stem, 0))
        if not 0 <= volume <= 100:
            raise ValueError(f"Invalid volume for {stem}")
        if volume > 0:
            active_stems.append((stem, volume / 100))
    if not active_stems:
        raise ValueError("At least one stem must be enabled")
    if (start_sec is None) != (end_sec is None):
        raise ValueError("Both start and end are required for a range export")
    if start_sec is not None and end_sec is not None and end_sec <= start_sec:
        raise ValueError("Export range must have a positive duration")
    click_times = sorted(float(value) for value in (click_times or []))
    if len(click_times) > 10000 or any(not math.isfinite(value) or value < 0 for value in click_times):
        raise ValueError("Invalid click times")
    if not 0 <= click_volume <= 100:
        raise ValueError("Invalid click volume")

    stem_dir = (PUBLIC_STEMS_DIR / video_id).resolve()
    if PUBLIC_STEMS_DIR.resolve() not in stem_dir.parents:
        raise ValueError("Invalid video id")
    inputs = [(stem, volume, stem_dir / f"{stem}.mp3") for stem, volume in active_stems]
    missing = [path.name for _, _, path in inputs if not path.is_file()]
    if missing:
        raise FileNotFoundError(f"Missing stem files: {', '.join(missing)}")

    DATA_WORK_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        prefix=f"{video_id}-stem-mix-", suffix=".mp3", dir=DATA_WORK_DIR, delete=False
    ) as temporary:
        output_path = Path(temporary.name)

    command = ["ffmpeg", "-hide_banner", "-loglevel", "error"]
    for _, _, path in inputs:
        if start_sec is not None and end_sec is not None:
            command.extend(["-ss", f"{start_sec:.6f}", "-t", f"{end_sec - start_sec:.6f}"])
        command.extend(["-i", str(path)])

    click_path = None
    if click_times and click_volume > 0:
        click_path = create_export_click_track(click_times, click_volume)
        command.extend(["-i", str(click_path)])

    filters = []
    mix_inputs = []
    for index, (_, volume, _) in enumerate(inputs):
        label = f"stem{index}"
        filters.append(f"[{index}:a]volume={volume:.6f}[{label}]")
        mix_inputs.append(f"[{label}]")
    if click_path:
        click_index = len(inputs)
        filters.append(f"[{click_index}:a]anull[click]")
        mix_inputs.append("[click]")
    filters.append(
        f"{''.join(mix_inputs)}amix=inputs={len(mix_inputs)}:duration=longest:normalize=0,"
        "alimiter=limit=0.98[out]"
    )
    command.extend([
        "-filter_complex", ";".join(filters),
        "-map", "[out]",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        "-y", str(output_path),
    ])
    try:
        run_process(command, capture_output=True, check=True)
    except Exception:
        output_path.unlink(missing_ok=True)
        raise
    finally:
        if click_path:
            click_path.unlink(missing_ok=True)
    return output_path


def create_export_click_track(click_times: list[float], volume: float) -> Path:
    sample_rate = 44100
    click_duration = 0.055
    total_frames = max(1, math.ceil((click_times[-1] + click_duration) * sample_rate))
    samples = array("h", [0]) * total_frames
    click_frames = math.ceil(click_duration * sample_rate)
    peak = 32767 * (volume / 100) * 0.72
    for click_time in click_times:
        start_frame = round(click_time * sample_rate)
        for offset in range(click_frames):
            frame = start_frame + offset
            if frame >= total_frames:
                break
            elapsed = offset / sample_rate
            envelope = math.exp(-elapsed * 75)
            square = 1 if (offset * 3600 // sample_rate) % 2 == 0 else -1
            value = samples[frame] + round(peak * envelope * square)
            samples[frame] = max(-32768, min(32767, value))
    with tempfile.NamedTemporaryFile(
        prefix="stem-export-click-", suffix=".wav", dir=DATA_WORK_DIR, delete=False
    ) as temporary:
        output_path = Path(temporary.name)
    with wave.open(str(output_path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(samples.tobytes())
    return output_path


def create_stem_mix_export(
    video_id: str,
    export_id: str,
    stem_volumes: dict[str, float],
    *,
    start_sec: float | None = None,
    end_sec: float | None = None,
    click_times: list[float] | None = None,
    click_volume: float = 0,
    output_filename: str = "stem-mix.mp3",
    job_id: str,
) -> dict:
    set_job_status(job_id, "exporting", "Rendering stem mix")
    temporary_path = export_stem_mix(
        video_id,
        stem_volumes,
        start_sec=start_sec,
        end_sec=end_sec,
        click_times=click_times,
        click_volume=click_volume,
    )
    export_dir = DATA_WORK_DIR / "stem-exports"
    export_dir.mkdir(parents=True, exist_ok=True)
    cleanup_old_stem_mix_exports(export_dir)
    output_path = export_dir / f"{export_id}.mp3"
    temporary_path.replace(output_path)
    safe_filename = re.sub(r'[\\/:*?"<>|\r\n]+', " ", output_filename).strip()[:160]
    if not safe_filename.lower().endswith(".mp3"):
        safe_filename = f"{safe_filename or 'stem-mix'}.mp3"
    return {
        "exportId": export_id,
        "downloadUrl": f"/jobs/{job_id}/download",
        "filename": safe_filename,
    }


def cleanup_old_stem_mix_exports(export_dir: Path, *, max_age_seconds: int = 86400) -> None:
    cutoff = time.time() - max_age_seconds
    for path in export_dir.glob("*.mp3"):
        try:
            if path.stat().st_mtime < cutoff:
                path.unlink()
        except FileNotFoundError:
            pass


def cleanup_stem_mix_export(export_id: str) -> None:
    (DATA_WORK_DIR / "stem-exports" / f"{export_id}.mp3").unlink(missing_ok=True)


def infer_stage(line: str) -> tuple[str, str] | None:
    normalized = line.strip()
    if not normalized:
        return None
    if normalized.startswith("Separated tracks will be stored"):
        return ("demixing", "Preparing source separation")
    if normalized.startswith("Separating track "):
        return ("demixing", "Separating stems")
    if "tracks already demixed" in normalized:
        return ("demixing", normalized.replace("=> ", ""))
    if "spectrograms already extracted" in normalized:
        return ("extracting", normalized.replace("=> ", ""))
    if normalized.startswith("Extracting spectrograms"):
        return ("extracting", "Extracting spectrograms")
    if normalized.startswith("Analyzing "):
        return ("inferencing", normalized)
    if "tracks already analyzed" in normalized:
        return ("inferencing", normalized.replace("=> ", ""))
    if normalized.startswith("[INFO] CUDA backend is unavailable"):
        return ("inferencing", normalized)
    if normalized.startswith("[INFO] Starting all-in-one-fix analysis"):
        return ("inferencing", normalized)
    if normalized.startswith("[INFO] Finished all-in-one-fix analysis"):
        return ("inferencing", normalized)
    return None


def cleanup_analysis_workdir(video_id: str) -> None:
    work_dir = DATA_WORK_DIR / video_id
    if work_dir.exists():
        shutil.rmtree(work_dir)


def cleanup_canceled_analysis(video_id: str) -> None:
    cleanup_analysis_workdir(video_id)
    if (DATA_RESULTS_DIR / f"{video_id}.json").exists():
        return
    for path in (
        DATA_AUDIO_DIR / f"{video_id}.wav",
        DATA_VIDEO_DIR / f"{video_id}.mp4",
        PUBLIC_AUDIO_DIR / f"{video_id}.mp3",
        PUBLIC_VIDEO_DIR / f"{video_id}.mp4",
    ):
        if path.exists():
            path.unlink()


def save_uploaded_audio(source, destination: Path, *, max_bytes: int = 500 * 1024 * 1024) -> int:
    destination.parent.mkdir(parents=True, exist_ok=True)
    total = 0
    try:
        with destination.open("wb") as output:
            while chunk := source.read(1024 * 1024):
                total += len(chunk)
                if total > max_bytes:
                    raise ValueError("音声ファイルは500MB以下にしてください")
                output.write(chunk)
        if total == 0:
            raise ValueError("音声ファイルが空です")
        return total
    except Exception:
        destination.unlink(missing_ok=True)
        raise


def cleanup_uploaded_analysis(session_id: str, source_path: Path) -> None:
    source_path.unlink(missing_ok=True)
    cleanup_canceled_analysis(session_id)


def cleanup_canceled_stems(video_id: str) -> None:
    # Published stems may belong to a previous successful generation. Cancel
    # only disposable working data, never the currently playable version.
    for path in (DATA_STEMS_DIR / video_id, DATA_WORK_DIR / video_id / "stems"):
        if path.exists():
            shutil.rmtree(path)
    export_static_assets()


def run_analyzer(audio_path: Path, video_id: str, job_id: str | None = None) -> dict:
    job_id = job_id or video_id
    work_dir = DATA_WORK_DIR / video_id
    work_dir.mkdir(parents=True, exist_ok=True)
    runtime_config = get_analyzer_runtime_config()
    backend = resolve_backend(wsl_python=WSL_PYTHON)
    native_executable = (
        windows_cpu_runtime_executable()
        if sys.platform == "win32" and backend.device == "cpu"
        else mac_analysis_runtime_executable() if sys.platform == "darwin" else None
    )
    if native_executable is not None and not native_executable.is_file():
        raise RuntimeError("解析機能が未インストールです。設定の「追加機能」から追加してください")
    command, process_cwd = analyzer_command(
        backend,
        script=ANALYZE_SCRIPT,
        audio_path=audio_path,
        work_dir=work_dir,
        wsl_python=WSL_PYTHON,
        native_executable=native_executable,
    )
    process = start_process(
        command,
        job_id=job_id,
        cwd=process_cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        stdin=subprocess.DEVNULL,
        text=True,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
    )
    json_line = ""
    output_lines: list[str] = []
    output_queue: queue.Queue[str] = queue.Queue()

    def read_output() -> None:
        assert process.stdout is not None
        for raw_line in process.stdout:
            output_queue.put(raw_line)

    reader = threading.Thread(target=read_output, daemon=True)
    reader.start()
    set_job_status(job_id, "inferencing", f"Starting analyzer on {backend.label}")

    try:
        analyzer_started_at = time.monotonic()
        deadline = analyzer_started_at + runtime_config.timeout_seconds
        last_output_at = analyzer_started_at
        last_heartbeat_at = last_output_at
        while process.poll() is None:
            if is_job_cancel_requested(job_id):
                terminate_process(process)
                raise JobCanceledError("Canceled")
            now = time.monotonic()
            if now >= deadline:
                raise subprocess.TimeoutExpired(command, runtime_config.timeout_seconds)
            silence_seconds = int(now - last_output_at)
            if (
                runtime_config.no_output_timeout_seconds is not None
                and silence_seconds >= runtime_config.no_output_timeout_seconds
            ):
                raise subprocess.TimeoutExpired(command, runtime_config.no_output_timeout_seconds)
            if now - last_heartbeat_at >= runtime_config.heartbeat_seconds:
                set_job_status(
                    job_id,
                    "inferencing",
                    f"Analyzer running for {int(now - analyzer_started_at)}s",
                )
                last_heartbeat_at = now
            try:
                raw_line = output_queue.get(timeout=0.2)
            except queue.Empty:
                continue
            last_output_at = time.monotonic()
            last_heartbeat_at = last_output_at
            line = raw_line.strip()
            if not line:
                continue
            output_lines.append(line)
            if line.startswith("{") and "\"bpm\"" in line:
                json_line = line
                continue
            progress = infer_stage(line)
            if progress:
                stage, message = progress
                set_job_status(job_id, stage, message)

        reader.join(timeout=2)
        while True:
            try:
                raw_line = output_queue.get_nowait()
            except queue.Empty:
                break
            line = raw_line.strip()
            if not line:
                continue
            output_lines.append(line)
            if line.startswith("{") and "\"bpm\"" in line:
                json_line = line
                continue
            progress = infer_stage(line)
            if progress:
                stage, message = progress
                set_job_status(job_id, stage, message)
    except subprocess.TimeoutExpired as exc:
        terminate_process(process)
        reader.join(timeout=2)
        set_job_status(job_id, "error", "Analysis timed out", done=True, error="Analysis timed out")
        raise RuntimeError("解析タイムアウト") from exc
    finally:
        unregister_process(job_id, process)
        if process.stdout is not None:
            process.stdout.close()
    if process.returncode != 0:
        raise_if_job_canceled(job_id)
        message = "\n".join(output_lines[-12:]).strip() or "all-in-one-fix failed"
        set_job_status(job_id, "error", message, done=True, error=message)
        raise RuntimeError(message)
    try:
        return json.loads(json_line)
    except json.JSONDecodeError as exc:
        message = "\n".join(output_lines[-12:]).strip() or "invalid analyzer output"
        set_job_status(job_id, "error", message, done=True, error=message)
        raise RuntimeError(message) from exc


def run_stem_splitter(audio_path: Path, video_id: str, job_id: str | None = None) -> Path:
    job_id = job_id or f"{video_id}:stems"
    work_dir = DATA_WORK_DIR / video_id / "stems"
    if work_dir.exists():
        shutil.rmtree(work_dir)
    work_dir.mkdir(parents=True, exist_ok=True)
    backend = resolve_backend(purpose="stems", wsl_python=WSL_PYTHON)
    native_executable = (
        windows_cpu_runtime_executable()
        if sys.platform == "win32" and backend.device == "cpu"
        else mac_analysis_runtime_executable() if sys.platform == "darwin" else None
    )
    if native_executable is not None and not native_executable.is_file():
        raise RuntimeError("解析機能が未インストールです。設定の「追加機能」から追加してください")
    output_dir = DATA_STEMS_DIR / video_id
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    command, process_cwd = stem_command(
        backend,
        script=SPLIT_STEMS_SCRIPT,
        audio_path=audio_path,
        output_dir=output_dir,
        work_dir=work_dir,
        wsl_python=WSL_PYTHON,
        native_executable=native_executable,
    )
    set_job_status(job_id, "stems", f"Separating stems on {backend.label}")
    process = start_process(
        command,
        job_id=job_id,
        cwd=process_cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        stdin=subprocess.DEVNULL,
        text=True,
        encoding="utf-8",
        errors="replace",
        bufsize=1,
    )
    output_lines: list[str] = []
    output_queue: queue.Queue[str] = queue.Queue()

    def read_output() -> None:
        assert process.stdout is not None
        for raw_line in process.stdout:
            output_queue.put(raw_line)

    reader = threading.Thread(target=read_output, daemon=True)
    reader.start()
    try:
        started_at = time.monotonic()
        deadline = started_at + float(os.environ.get("STEM_TIMEOUT_SECONDS", "3600"))
        silence_limit = float(os.environ.get("STEM_NO_OUTPUT_TIMEOUT_SECONDS", "600"))
        last_output_at = started_at
        while process.poll() is None:
            if is_job_cancel_requested(job_id):
                terminate_process(process)
                raise JobCanceledError("Canceled")
            now = time.monotonic()
            if now >= deadline or silence_limit > 0 and now - last_output_at >= silence_limit:
                terminate_process(process)
                raise RuntimeError("ステム分離がタイムアウトしました")
            try:
                raw_line = output_queue.get(timeout=0.2)
            except queue.Empty:
                continue
            last_output_at = time.monotonic()
            line = raw_line.strip()
            if not line:
                continue
            output_lines.append(line)
            progress = infer_stage(line)
            if progress:
                stage, message = progress
                set_job_status(job_id, stage, message)
        reader.join(timeout=2)
        while True:
            try:
                raw_line = output_queue.get_nowait()
            except queue.Empty:
                break
            line = raw_line.strip()
            if line:
                output_lines.append(line)
    finally:
        unregister_process(job_id, process)
        reader.join(timeout=2)
        if process.stdout is not None:
            process.stdout.close()
    if process.returncode != 0:
        raise_if_job_canceled(job_id)
        message = "\n".join(output_lines[-12:]).strip() or "stem separation failed"
        set_job_status(job_id, "error", message, done=True, error=message)
        raise RuntimeError(message)

    stem_dir = output_dir / "htdemucs"
    missing = [stem for stem in STEM_NAMES if not (stem_dir / f"{stem}.wav").exists()]
    if missing:
        raise RuntimeError(f"ステム生成に失敗しました: {', '.join(missing)}")
    return stem_dir


def adjust_bar_value(value: int, factor: float) -> int:
    return max(1, round(value * factor))


def adjust_bar_range(start_bar: int, end_bar: int, factor: float) -> tuple[int, int, int]:
    start = max(1, round((start_bar - 1) * factor) + 1)
    end = max(start, round(end_bar * factor))
    return start, end, end - start + 1


def apply_bpm_factor_to_result(data: dict, factor: float) -> dict:
    if factor <= 0:
        raise ValueError("BPM補正係数が不正です")

    adjusted = dict(data)
    adjusted["bpm"] = round(float(data.get("bpm", 0.0)) * factor, 1)
    adjusted["total_bars"] = adjust_bar_value(int(data.get("total_bars", 0)), factor)

    beats = list(data.get("beats") or [])
    if factor == 1:
        adjusted_beats = beats
    else:
        adjusted_beats = beats[:]
        working_factor = factor
        while working_factor > 1:
            expanded = []
            for index, beat in enumerate(adjusted_beats):
                expanded.append(beat)
                next_beat = adjusted_beats[index + 1] if index + 1 < len(adjusted_beats) else None
                if next_beat is not None:
                    expanded.append(round((beat + next_beat) / 2, 3))
            adjusted_beats = expanded
            working_factor /= 2
        while working_factor < 1:
            adjusted_beats = [beat for index, beat in enumerate(adjusted_beats) if index % 2 == 0]
            working_factor *= 2
    adjusted["beats"] = adjusted_beats
    adjusted["downbeats"] = [beat for index, beat in enumerate(adjusted_beats) if index % 4 == 0]

    sections = []
    for section in data.get("sections") or []:
        start_bar, end_bar, bar_count = adjust_bar_range(
            int(section["start_bar"]),
            int(section["end_bar"]),
            factor,
        )
        updated = dict(section)
        updated["start_bar"] = start_bar
        updated["end_bar"] = end_bar
        updated["bar_count"] = bar_count
        sections.append(updated)
    adjusted["sections"] = sections
    return adjusted


def find_downbeat_offset(beats: list[float], downbeats: list[float]) -> int:
    if not beats or not downbeats:
        return 0
    first_downbeat = downbeats[0]
    closest_index = min(range(len(beats)), key=lambda index: abs(beats[index] - first_downbeat))
    return closest_index % 4


def bars_from_sections(sections: list[dict], downbeats: list[float]) -> list[dict]:
    def time_to_bar(value: float) -> int:
        for index, downbeat in enumerate(downbeats):
            if downbeat >= value - 0.1:
                return index + 1
        return len(downbeats)

    adjusted_sections = []
    for section in sections:
        start_bar = time_to_bar(float(section.get("start_time", 0.0)))
        end_bar = max(start_bar, time_to_bar(float(section.get("end_time", 0.0))) - 1)
        adjusted = dict(section)
        adjusted["start_bar"] = start_bar
        adjusted["end_bar"] = end_bar
        adjusted["bar_count"] = end_bar - start_bar + 1
        adjusted_sections.append(adjusted)
    return normalize_section_bar_ranges(adjusted_sections, len(downbeats))


def repair_double_time_beats(data: dict) -> dict:
    beats = [float(beat) for beat in data.get("beats") or []]
    if len(beats) < 12:
        return data

    intervals = [beats[index + 1] - beats[index] for index in range(len(beats) - 1)]
    baseline_size = max(8, min(128, len(intervals) // 2))
    expected_interval = median(intervals[:baseline_size])
    if expected_interval <= 0:
        return data

    window_size = 8
    transition_index = None
    for index in range(0, len(intervals) - window_size + 1):
        window = intervals[index : index + window_size]
        if median(window) < expected_interval * 0.65:
            transition_index = index
            break
    if transition_index is None:
        return data

    repaired_beats = beats[: transition_index + 1]
    last_beat = repaired_beats[-1]
    for beat in beats[transition_index + 1 :]:
        if beat - last_beat >= expected_interval * 0.75:
            repaired_beats.append(round(beat, 3))
            last_beat = beat

    if len(repaired_beats) == len(beats):
        return data

    downbeat_offset = find_downbeat_offset(beats, [float(value) for value in data.get("downbeats") or []])
    repaired_downbeats = [
        round(beat, 3)
        for index, beat in enumerate(repaired_beats)
        if index % 4 == downbeat_offset
    ]

    adjusted = dict(data)
    adjusted["beats"] = [round(beat, 3) for beat in repaired_beats]
    adjusted["downbeats"] = repaired_downbeats
    adjusted["total_bars"] = len(repaired_downbeats)
    adjusted["sections"] = bars_from_sections(list(data.get("sections") or []), repaired_downbeats)
    return adjusted


def analyze_url(
    url: str,
    force: bool = False,
    job_id: str | None = None,
    *,
    start_sec: float | None = None,
    end_sec: float | None = None,
) -> dict:
    source_video_id = extract_video_id(url)
    if not source_video_id:
        raise ValueError("動画IDを取得できませんでした")
    start_sec, end_sec = normalize_analysis_range(start_sec, end_sec)
    video_id = build_analysis_session_id(source_video_id, start_sec, end_sec)
    job_id = job_id or video_id
    raise_if_job_canceled(job_id)
    set_job_status(job_id, "queued", "Queued")

    result_file = DATA_RESULTS_DIR / f"{video_id}.json"
    audio_file = DATA_AUDIO_DIR / f"{video_id}.wav"
    video_file = DATA_VIDEO_DIR / f"{video_id}.mp4"
    public_audio_file = PUBLIC_AUDIO_DIR / f"{video_id}.mp3"
    public_video_file = PUBLIC_VIDEO_DIR / f"{video_id}.mp4"
    # Cache one full-quality source per YouTube video. Session-specific clips
    # are derived below, locally, so range selection never controls stream quality.
    source_audio_file, source_video_file = source_media_cache_paths(source_video_id, DATA_WORK_DIR)

    if not force and result_file.exists() and audio_file.exists() and public_audio_file.exists() and public_video_file.exists():
        data = attach_session_assets(json.loads(result_file.read_text(encoding="utf-8")))
        data["cached"] = True
        set_job_status(job_id, "done", "Loaded from cache", done=True)
        return data

    # Capture reviewed anchors before force reanalysis removes its cached result.
    timing_correction = (json.loads(result_file.read_text(encoding="utf-8")).get("timingCorrection")
                         if result_file.exists() else None)
    raise_if_job_canceled(job_id)
    if force:
        for path in (
            result_file,
            audio_file,
            video_file,
            public_audio_file,
            public_video_file,
            source_audio_file,
            source_video_file,
        ):
            path.unlink(missing_ok=True)

    set_job_status(job_id, "downloading", "Fetching title")
    title = get_title(url, source_video_id)
    set_job_display_title(job_id, title)

    if not source_video_file.exists():
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Downloading full-quality source video")
        source_video_file.parent.mkdir(parents=True, exist_ok=True)
        download_video(url, source_video_file)
    else:
        set_job_status(job_id, "downloading", "Using cached source video")

    audio_needs_refresh = (
        not source_audio_file.exists()
        or source_audio_file.stat().st_mtime_ns < source_video_file.stat().st_mtime_ns
    )
    if audio_needs_refresh:
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Extracting synchronized source audio")
        extract_wav_from_video(source_video_file, source_audio_file)
    else:
        set_job_status(job_id, "downloading", "Using cached source audio")

    if not audio_file.exists():
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Preparing analysis audio locally")
        trim_audio_range(source_audio_file, audio_file, start_sec, end_sec)

    if not video_file.exists():
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Trimming playback video locally")
        trim_video_range(source_video_file, video_file, start_sec, end_sec)

    if not public_audio_file.exists() or force:
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Preparing playback mp3")
        convert_wav_to_mp3(audio_file, public_audio_file)

    if not public_video_file.exists() or force:
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Preparing playback video")
        publish_video(video_file, public_video_file)

    raise_if_job_canceled(job_id)
    analysis = normalize_tempo_grid(run_analyzer(audio_file, video_id, job_id=job_id))
    if timing_correction:
        analysis = apply_timing_correction(analysis, timing_correction)
    analysis.pop("device", None)
    raise_if_job_canceled(job_id)
    set_job_status(job_id, "saving", "Saving results")
    if start_sec is not None or end_sec is not None:
        start_label = format_seconds(start_sec or 0)
        end_label = "末尾" if end_sec is None else format_seconds(end_sec)
        title = f"{title} ({start_label}–{end_label})"
    data = attach_session_assets({
        "id": video_id,
        "title": title,
        "sourceType": "youtube",
        "sourceVideoId": source_video_id,
        "analysisStartSec": start_sec,
        "analysisEndSec": end_sec,
        **analysis,
    })
    save_json(result_file, data)
    update_manifest(build_manifest_entry(data, entry_date=date.today().isoformat()))
    export_static_assets()
    publish_session_to_cloud(video_id, data, result_file, public_audio_file, public_video_file)
    cleanup_analysis_workdir(video_id)
    set_job_status(job_id, "done", "Analysis complete", done=True)
    return data


def analyze_local_audio(
    source_path: Path,
    session_id: str,
    title: str,
    *,
    original_filename: str,
    job_id: str | None = None,
) -> dict:
    job_id = job_id or session_id
    result_file = DATA_RESULTS_DIR / f"{session_id}.json"
    audio_file = DATA_AUDIO_DIR / f"{session_id}.wav"
    public_audio_file = PUBLIC_AUDIO_DIR / f"{session_id}.mp3"
    try:
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Preparing uploaded audio")
        convert_audio_to_wav(source_path, audio_file)
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "downloading", "Preparing playback mp3")
        convert_wav_to_mp3(audio_file, public_audio_file)
        raise_if_job_canceled(job_id)
        analysis = normalize_tempo_grid(run_analyzer(audio_file, session_id, job_id=job_id))
        analysis.pop("device", None)
        raise_if_job_canceled(job_id)
        set_job_status(job_id, "saving", "Saving results")
        data = attach_session_assets(
            {
                "id": session_id,
                "title": title,
                "sourceType": "local_audio",
                "originalFilename": original_filename,
                "assets": {"video": None},
                **analysis,
            }
        )
        save_json(result_file, data)
        update_manifest(build_manifest_entry(data, entry_date=date.today().isoformat()))
        export_static_assets()
        publish_session_to_cloud(session_id, data, result_file, public_audio_file, None)
        cleanup_analysis_workdir(session_id)
        set_job_status(job_id, "done", "Analysis complete", done=True)
        return data
    except Exception:
        cleanup_canceled_analysis(session_id)
        raise
    finally:
        source_path.unlink(missing_ok=True)


def publish_session_to_cloud(video_id: str, data: dict, result_file: Path, audio_file: Path, video_file: Path | None) -> None:
    if os.environ.get("R2_AUTO_PUBLISH") != "1":
        return
    config = get_r2_config()
    if config is None:
        return

    include_video = video_file is not None and video_file.exists()
    cloud_assets = build_r2_session_assets(video_id, config, include_video=include_video)
    set_job_status(video_id, "uploading", "Uploading session assets to R2")
    try:
        with tempfile.TemporaryDirectory(prefix="practice-lab-r2-metadata-") as temp_dir:
            remote_result = Path(temp_dir) / "session.json"
            remote_manifest = Path(temp_dir) / "manifest.json"
            remote_data = {**data, "assets": {**data.get("assets", {}), **cloud_assets}}
            save_json(remote_result, remote_data)
            manifest = []
            for item in load_manifest():
                manifest.append(
                    build_manifest_entry(remote_data, entry_date=item.get("date") or date.today().isoformat())
                    if item.get("id") == video_id
                    else item
                )
            save_json(remote_manifest, manifest)
            upload_session_assets(
                video_id,
                result_file=remote_result,
                audio_file=audio_file,
                video_file=video_file if include_video else None,
                config=config,
            )
            upload_manifest(config, remote_manifest)
            upload_folders(config, FOLDERS_FILE)
    except Exception as exc:
        if config.required:
            raise
        cli_log(video_id, f"R2 upload skipped after failure: {exc}")


def create_stems(video_id: str, job_id: str | None = None) -> dict:
    job_id = job_id or f"{video_id}:stems"
    result_file = DATA_RESULTS_DIR / f"{video_id}.json"
    audio_file = DATA_AUDIO_DIR / f"{video_id}.wav"
    if not result_file.exists():
        raise ValueError("解析データが見つかりません")
    if not audio_file.exists():
        raise ValueError("元音声が見つかりません。再解析してください")

    raise_if_job_canceled(job_id)
    set_job_status(job_id, "queued", "Queued stem separation")
    stem_wav_dir = run_stem_splitter(audio_file, video_id, job_id=job_id)
    raise_if_job_canceled(job_id)
    set_job_status(job_id, "stems", "Matching playback loudness")
    gain_db = measure_stem_gain([stem_wav_dir / f"{stem}.wav" for stem in STEM_NAMES])
    raise_if_job_canceled(job_id)
    public_stem_dir = PUBLIC_STEMS_DIR / video_id
    PUBLIC_STEMS_DIR.mkdir(parents=True, exist_ok=True)
    # Stage on the same filesystem so a failed encode/cancel cannot remove the
    # previous mix. Keep a rollback copy until the directory swap succeeds.
    with tempfile.TemporaryDirectory(prefix=f".{video_id}-staging-", dir=PUBLIC_STEMS_DIR) as temporary:
        stage = Path(temporary) / "new"
        backup = Path(temporary) / "previous"
        stage.mkdir()
        for stem in STEM_NAMES:
            raise_if_job_canceled(job_id)
            set_job_status(job_id, "stems", f"Encoding {stem}")
            destination = stage / f"{stem}.mp3"
            convert_stem_wav_to_mp3(stem_wav_dir / f"{stem}.wav", destination, gain_db=gain_db)
            if not destination.is_file() or destination.stat().st_size == 0:
                raise RuntimeError(f"パート音源の変換に失敗しました: {stem}")
        raise_if_job_canceled(job_id)
        if public_stem_dir.exists():
            public_stem_dir.rename(backup)
        try:
            stage.rename(public_stem_dir)
        except Exception:
            if backup.exists():
                backup.rename(public_stem_dir)
            raise

    data = attach_session_assets(json.loads(result_file.read_text(encoding="utf-8")))
    save_json(result_file, data)
    update_manifest(build_manifest_entry(data, entry_date=date.today().isoformat()))
    export_static_assets()
    publish_session_to_cloud(
        video_id,
        data,
        result_file,
        PUBLIC_AUDIO_DIR / f"{video_id}.mp3",
        PUBLIC_VIDEO_DIR / f"{video_id}.mp4",
    )
    set_job_status(job_id, "done", "Stems ready", done=True)
    return data


def publish_folders_to_cloud() -> None:
    if os.environ.get("R2_AUTO_PUBLISH") != "1":
        return
    config = get_r2_config()
    if config is None or not FOLDERS_FILE.exists():
        return
    try:
        upload_folders(config, FOLDERS_FILE)
    except Exception:
        if config.required:
            raise


def sync_cloud_library(job_id: str = "cloud:sync") -> dict:
    config = get_r2_config()
    if config is None:
        raise RuntimeError("R2_ENABLED=1 と R2接続設定が必要です")

    set_job_status(job_id, "exporting", "公開ライブラリを準備しています")
    result = sync_cloud_incremental(
        config,
        progress=lambda message: set_job_status(job_id, "uploading", message),
        check_canceled=lambda: raise_if_job_canceled(job_id),
    )
    return result


def save_bpm_correction(video_id: str, factor: float) -> dict:
    if factor <= 0:
        raise ValueError("BPM補正係数が不正です")

    result_file = DATA_RESULTS_DIR / f"{video_id}.json"
    if not result_file.exists():
        raise ValueError("解析データが見つかりません")

    data = json.loads(result_file.read_text(encoding="utf-8"))
    adjusted = attach_session_assets(apply_bpm_factor_to_result(data, factor))
    save_json(result_file, adjusted)
    update_manifest(build_manifest_entry(adjusted, entry_date=date.today().isoformat()))
    export_static_assets()
    publish_session_to_cloud(
        video_id,
        adjusted,
        result_file,
        PUBLIC_AUDIO_DIR / f"{video_id}.mp3",
        PUBLIC_VIDEO_DIR / f"{video_id}.mp4",
    )
    return adjusted


def replace_manifest_entry_preserving_order(entry: dict) -> None:
    entry = attach_session_assets(entry)
    manifest = load_manifest()
    replaced = False
    next_manifest = []
    for item in manifest:
        if item.get("id") == entry["id"]:
            next_manifest.append(entry)
            replaced = True
        else:
            next_manifest.append(item)
    if not replaced:
        next_manifest.insert(0, entry)
    save_json(MANIFEST_FILE, next_manifest)


def rename_result(video_id: str, title: str) -> dict:
    title = title.strip()
    if not title:
        raise ValueError("タイトルが空です")

    result_file = DATA_RESULTS_DIR / f"{video_id}.json"
    if not result_file.exists():
        raise ValueError("解析データが見つかりません")

    data = json.loads(result_file.read_text(encoding="utf-8"))
    data["title"] = title
    renamed = attach_session_assets(data)
    save_json(result_file, renamed)
    entry_date = next((item.get("date") for item in load_manifest() if item.get("id") == video_id), date.today().isoformat())
    replace_manifest_entry_preserving_order(build_manifest_entry(renamed, entry_date=entry_date))
    export_static_assets()
    config = get_r2_config() if os.environ.get("R2_AUTO_PUBLISH") == "1" else None
    if config is not None:
        cloud_assets = build_r2_session_assets(video_id, config)
        if cloud_assets:
            renamed["assets"] = {**renamed.get("assets", {}), **cloud_assets}
            save_json(result_file, renamed)
            replace_manifest_entry_preserving_order(build_manifest_entry(renamed, entry_date=entry_date))
            export_static_assets()
        try:
            upload_file(config, result_file, f"{config.prefix}/{video_id}/session.json")
            upload_manifest(config, MANIFEST_FILE)
            upload_folders(config, FOLDERS_FILE)
        except Exception:
            if config.required:
                raise
    return renamed


def update_library_metadata(video_id: str, *, tags: list[str] | None = None, opened: bool = False) -> dict:
    if Path(video_id).name != video_id:
        raise ValueError("セッションIDが不正です")
    result_file = DATA_RESULTS_DIR / f"{video_id}.json"
    if not result_file.exists():
        raise ValueError("解析データが見つかりません")

    data = json.loads(result_file.read_text(encoding="utf-8"))
    if tags is not None:
        normalized = []
        seen = set()
        for raw_tag in tags:
            tag = str(raw_tag).strip()[:40]
            key = tag.casefold()
            if not tag or key in seen:
                continue
            normalized.append(tag)
            seen.add(key)
        data["tags"] = normalized[:20]
    if opened:
        data["lastOpenedAt"] = datetime.now(timezone.utc).isoformat()

    updated = attach_session_assets(data)
    save_json(result_file, updated)
    entry_date = next(
        (item.get("date") for item in load_manifest() if item.get("id") == video_id),
        date.today().isoformat(),
    )
    replace_manifest_entry_preserving_order(build_manifest_entry(updated, entry_date=entry_date))
    export_static_assets()
    return updated


def _section_time(data: dict, bar_number: int, *, end: bool = False) -> float:
    downbeats = [float(value) for value in data.get("downbeats", [])]
    index = bar_number if end else bar_number - 1
    if 0 <= index < len(downbeats):
        return downbeats[index]
    return float(data.get("duration") or (downbeats[-1] if downbeats else 0))


def save_sections(video_id: str, sections: list[dict], *, restore_automatic: bool = False) -> dict:
    if Path(video_id).name != video_id:
        raise ValueError("セッションIDが不正です")
    result_file = DATA_RESULTS_DIR / f"{video_id}.json"
    if not result_file.exists():
        raise ValueError("解析データが見つかりません")
    data = json.loads(result_file.read_text(encoding="utf-8"))

    if restore_automatic:
        automatic = data.get("automaticSections")
        if not isinstance(automatic, list) or not automatic:
            raise ValueError("復元できる自動解析結果がありません")
        data["sections"] = automatic
        data.pop("automaticSections", None)
        data.pop("sectionsEditedAt", None)
    else:
        total_bars = int(data.get("total_bars") or 0)
        if total_bars < 1:
            raise ValueError("小節情報がないため編集できません")
        ordered = sorted(sections, key=lambda item: int(item["startBar"]))
        expected_start = 1
        normalized = []
        for item in ordered:
            label = str(item["label"]).strip()
            start_bar = int(item["startBar"])
            end_bar = int(item["endBar"])
            if not label:
                raise ValueError("セクション名が空です")
            if start_bar != expected_start or end_bar < start_bar or end_bar > total_bars:
                raise ValueError("セクションは1小節目から重複や空白なく並べてください")
            start_time = _section_time(data, start_bar)
            end_time = _section_time(data, end_bar, end=True)
            normalized.append(
                {
                    "label": label[:80],
                    "start_bar": start_bar,
                    "end_bar": end_bar,
                    "bar_count": end_bar - start_bar + 1,
                    "start_time": round(start_time, 2),
                    "end_time": round(max(start_time, end_time), 2),
                    "start_time_str": f"{int(start_time // 60):02d}:{int(start_time % 60):02d}",
                }
            )
            expected_start = end_bar + 1
        if expected_start != total_bars + 1:
            raise ValueError("最後のセクションを曲の最終小節まで設定してください")
        if "automaticSections" not in data:
            data["automaticSections"] = data.get("sections", [])
        data["sections"] = normalized
        data["sectionsEditedAt"] = datetime.now(timezone.utc).isoformat()

    updated = attach_session_assets(data)
    save_json(result_file, updated)
    entry_date = next(
        (item.get("date") for item in load_manifest() if item.get("id") == video_id),
        date.today().isoformat(),
    )
    replace_manifest_entry_preserving_order(build_manifest_entry(updated, entry_date=entry_date))
    export_static_assets()
    return updated


DELETE_LOCK = threading.Lock()
SESSION_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{1,128}$")


def delete_results(video_ids: list[str]) -> list[str]:
    ids = list(dict.fromkeys(video_ids))
    if not ids or any(not SESSION_ID_PATTERN.fullmatch(video_id) for video_id in ids):
        raise ValueError("削除対象のセッションIDが不正です")

    with DELETE_LOCK:
        deleted_ids = set(ids)
        for video_id in ids:
            files = (
                DATA_RESULTS_DIR / f"{video_id}.json",
                DATA_AUDIO_DIR / f"{video_id}.wav",
                DATA_AUDIO_DIR / f"{video_id}.mp3",
                DATA_VIDEO_DIR / f"{video_id}.mp4",
                PUBLIC_RESULTS_DIR / f"{video_id}.json",
                PUBLIC_AUDIO_DIR / f"{video_id}.mp3",
                PUBLIC_VIDEO_DIR / f"{video_id}.mp4",
            )
            for path in files:
                path.unlink(missing_ok=True)
            for directory in (DATA_STEMS_DIR / video_id, PUBLIC_STEMS_DIR / video_id):
                if directory.exists():
                    shutil.rmtree(directory)
            cleanup_analysis_workdir(video_id)

        manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
        save_json(MANIFEST_FILE, [item for item in manifest if item.get("id") not in deleted_ids])
        folders = []
        if FOLDERS_FILE.exists():
            raw_folders = json.loads(FOLDERS_FILE.read_text(encoding="utf-8"))
            if isinstance(raw_folders, list):
                folders = [
                    {
                        **folder,
                        "sessionIds": [
                            session_id
                            for session_id in folder.get("sessionIds", [])
                            if session_id not in deleted_ids
                        ],
                    }
                    for folder in raw_folders
                ]
                save_json(FOLDERS_FILE, folders)
        export_static_assets()
        record_session_deletions(ids, path=DEVICE_SYNC_STATE_FILE)

        config = get_r2_config() if os.environ.get("R2_AUTO_PUBLISH") == "1" else None
        if config is not None:
            delete_session_assets(ids, config)
            upload_manifest(config, MANIFEST_FILE)
            upload_folders(config, FOLDERS_FILE)
    return ids


def delete_result(video_id: str) -> None:
    delete_results([video_id])
