import os
import re
import secrets
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Header, HTTPException, Request, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from .config import DATA_WORK_DIR, PUBLIC_AUDIO_DIR, PUBLIC_DIR, PUBLIC_RESULTS_DIR, PUBLIC_SCORE_DIR, PUBLIC_STEMS_DIR, PUBLIC_VIDEO_DIR, ensure_directories
from .models import (
    AnalyzeRequest,
    AnalyzeResponse,
    ApplyBpmCorrectionRequest,
    DeleteSessionsRequest,
    DesktopCloudConfigRequest,
    JobStatusResponse,
    JobSubmissionResponse,
    LibraryMetadataRequest,
    RenameSessionRequest,
    ScoreExtractRequest,
    ScoreExtractResponse,
    ScorePreviewRequest,
    ScorePreviewResponse,
    SaveSectionsRequest,
    SidebarFolder,
    StemExportRequest,
    StorageCleanupRequest,
)
from .services import analyze_local_audio, analyze_url, build_analysis_session_id, cancel_interrupted_job, cancel_job, cleanup_canceled_analysis, cleanup_canceled_stems, cleanup_stem_mix_export, cleanup_uploaded_analysis, create_stem_mix_export, create_stems, delete_result, delete_results, extract_video_id, get_job_status, get_resumable_job_spec, initialize_job_store, list_job_history, list_job_statuses, normalize_analysis_range, publish_folders_to_cloud, rename_result, save_bpm_correction, save_sections, save_uploaded_audio, set_job_status, submit_queued_job, sync_cloud_library, update_library_metadata
from .storage import bootstrap_public_data, export_static_assets, load_folders, save_folders
from .storage_usage import cleanup_storage, storage_report
from .system_status import get_system_status, launch_nvidia_setup
from .optional_features import feature_status, install_mac_analysis_runtime, install_score_runtime, install_windows_cpu_runtime, score_runtime_available, uninstall_mac_analysis_runtime, uninstall_score_runtime, uninstall_windows_cpu_runtime
from .cloud_storage import get_r2_config, test_r2_connection


def _score_module():
    if not score_runtime_available():
        raise RuntimeError("楽譜抽出機能が追加されていません。設定の「追加機能」から追加してください")
    from . import score_extractor
    return score_extractor


def submit_job_spec(spec: dict) -> dict:
    job_type = spec.get("type")
    job_id = spec.get("jobId")
    if not isinstance(job_id, str) or not job_id:
        raise ValueError("ジョブIDがありません")

    if job_type == "analyze_url":
        return submit_queued_job(
            job_id,
            "Queued analysis",
            lambda: analyze_url(
                spec["url"],
                bool(spec.get("force")),
                job_id=job_id,
                start_sec=spec.get("startSec"),
                end_sec=spec.get("endSec"),
            ),
            cleanup=lambda: cleanup_canceled_analysis(job_id),
            spec=spec,
            kind="analysis",
        )
    if job_type == "analyze_file":
        source_path = DATA_WORK_DIR / "uploads" / Path(spec["sourceName"]).name
        if not source_path.exists():
            raise ValueError("再開に必要なアップロード音源がありません")
        return submit_queued_job(
            job_id,
            "Queued local audio analysis",
            lambda: analyze_local_audio(
                source_path,
                job_id,
                spec["title"],
                original_filename=spec.get("originalFilename"),
                job_id=job_id,
            ),
            cleanup=lambda: cleanup_uploaded_analysis(job_id, source_path),
            spec=spec,
            kind="analysis",
        )
    if job_type == "stems":
        video_id = spec["videoId"]
        return submit_queued_job(
            job_id,
            "Queued stem separation",
            lambda: create_stems(video_id, job_id=job_id),
            cleanup=lambda: cleanup_canceled_stems(video_id),
            spec=spec,
            kind="stems",
        )
    if job_type == "stem_export":
        request = spec["request"]
        export_id = spec["exportId"]
        video_id = spec["videoId"]
        return submit_queued_job(
            job_id,
            "Queued stem mix export",
            lambda: create_stem_mix_export(
                video_id,
                export_id,
                request["stemVolumes"],
                start_sec=request.get("startSec"),
                end_sec=request.get("endSec"),
                click_times=request.get("clickTimes", []),
                click_volume=request.get("clickVolume", 0),
                output_filename=request.get("outputFilename", "stem-mix.mp3"),
                job_id=job_id,
            ),
            cleanup=lambda: cleanup_stem_mix_export(export_id),
            spec=spec,
            kind="stem-export",
        )
    if job_type == "cloud_sync":
        return submit_queued_job(
            job_id,
            "Queued cloud sync",
            lambda: sync_cloud_library(job_id=job_id),
            spec=spec,
            kind="cloud-sync",
        )
    if job_type == "feature_install_windows_cpu":
        return submit_queued_job(
            job_id,
            "Queued Windows CPU feature installation",
            lambda: install_windows_cpu_runtime(
                progress=lambda message: set_job_status(job_id, "installing", message),
            ),
            spec=spec,
            kind="feature-install",
        )
    if job_type == "feature_install_mac_analysis":
        return submit_queued_job(
            job_id,
            "Queued Mac analysis feature installation",
            lambda: install_mac_analysis_runtime(
                progress=lambda message: set_job_status(job_id, "installing", message),
            ),
            spec=spec,
            kind="feature-install",
        )
    if job_type == "feature_install_score":
        return submit_queued_job(
            job_id,
            "Queued score feature installation",
            lambda: install_score_runtime(
                progress=lambda message: set_job_status(job_id, "installing", message),
            ),
            spec=spec,
            kind="feature-install",
        )
    if job_type == "score_preview":
        score = _score_module()
        video_id = spec["videoId"]
        return submit_queued_job(
            job_id,
            "Queued score preview",
            lambda: score.prepare_score_preview(
                spec["request"],
                progress=lambda stage, message: set_job_status(job_id, stage, message),
            ),
            cleanup=lambda: score.cleanup_canceled_score_job(video_id),
            spec=spec,
            kind="score-preview",
        )
    if job_type == "score_extract":
        score = _score_module()
        video_id = spec["videoId"]
        return submit_queued_job(
            job_id,
            "Queued score extraction",
            lambda: score.extract_score(
                spec["request"],
                progress=lambda stage, message: set_job_status(job_id, stage, message),
            ),
            cleanup=lambda: score.cleanup_canceled_score_job(video_id),
            spec=spec,
            kind="score-extract",
        )
    raise ValueError(f"未対応のジョブ種別です: {job_type}")


def create_app() -> FastAPI:
    ensure_directories()
    initialize_job_store()
    bootstrap_public_data()
    export_static_assets()

    app = FastAPI(title="PracticeLab")

    @app.middleware("http")
    async def protect_desktop_backend(request: Request, call_next):
        expected_token = os.environ.get("PRACTICE_LAB_DESKTOP_TOKEN")
        expected_origin = os.environ.get("PRACTICE_LAB_BACKEND_ORIGIN")
        if expected_token and request.url.path != "/healthz":
            if expected_origin:
                expected_host = expected_origin.removeprefix("http://").removeprefix("https://")
                if request.headers.get("host") != expected_host:
                    return JSONResponse(status_code=421, content={"detail": "接続先が一致しません"})
                origin = request.headers.get("origin")
                if origin and origin != expected_origin:
                    return JSONResponse(status_code=403, content={"detail": "この画面からは操作できません"})
            supplied_token = request.headers.get("x-practice-lab-desktop-token")
            if not supplied_token or not secrets.compare_digest(expected_token, supplied_token):
                return JSONResponse(status_code=403, content={"detail": "デスクトップアプリから実行してください"})
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
        if expected_token and request.url.path.startswith(("/audio/", "/video/", "/stems/", "/score/")):
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.get("/healthz")
    async def healthz():
        instance_id = os.environ.get("PRACTICE_LAB_INSTANCE_ID")
        return {"ok": True, **({"instanceId": instance_id} if instance_id else {})}

    @app.post("/desktop/cloud-config")
    async def configure_desktop_cloud(request: DesktopCloudConfigRequest):
        if not os.environ.get("PRACTICE_LAB_DESKTOP_TOKEN"):
            raise HTTPException(status_code=403, detail="デスクトップアプリでのみ設定できます")
        values = request.model_dump()
        endpoint_url = str(values["endpointUrl"] or "").strip()
        account_id = str(values["accountId"] or "").strip()
        if not endpoint_url and account_id:
            endpoint_url = f"https://{account_id}.r2.cloudflarestorage.com"
        required = (
            str(values["bucket"] or "").strip(),
            endpoint_url,
            str(values["accessKeyId"] or "").strip(),
            str(values["secretAccessKey"] or "").strip(),
        )
        if values["enabled"] and not all(required):
            raise HTTPException(status_code=400, detail="クラウド接続設定が不足しています")
        os.environ.update({
            "R2_ENABLED": "1" if values["enabled"] else "0",
            "R2_BUCKET": required[0],
            "R2_ENDPOINT_URL": endpoint_url,
            "CLOUDFLARE_ACCOUNT_ID": account_id,
            "R2_PUBLIC_BASE_URL": str(values["publicBaseUrl"] or "").strip().rstrip("/"),
            "R2_PREFIX": str(values["prefix"] or "sessions").strip().strip("/") or "sessions",
            "R2_ACCESS_KEY_ID": required[2],
            "R2_SECRET_ACCESS_KEY": required[3],
        })
        return {"configured": bool(values["enabled"]), "bucket": required[0] or None}

    @app.get("/system/status")
    async def system_status():
        return await run_in_threadpool(get_system_status)

    @app.get("/features")
    async def optional_feature_status():
        return await run_in_threadpool(feature_status)

    @app.post("/features/windows-cpu/install", response_model=JobSubmissionResponse)
    async def install_windows_cpu_feature():
        try:
            return JobSubmissionResponse(**submit_job_spec({
                "type": "feature_install_windows_cpu",
                "jobId": "feature:windows-cpu",
            }))
        except RuntimeError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc

    @app.delete("/features/windows-cpu")
    async def remove_windows_cpu_feature():
        if any(not job.get("done") for job in list_job_statuses()):
            raise HTTPException(status_code=409, detail="処理中のジョブがあるためCPU解析機能を削除できません")
        return await run_in_threadpool(uninstall_windows_cpu_runtime)

    @app.post("/features/mac-analysis/install", response_model=JobSubmissionResponse)
    async def install_mac_analysis_feature():
        try:
            return JobSubmissionResponse(**submit_job_spec({
                "type": "feature_install_mac_analysis",
                "jobId": "feature:mac-analysis",
            }))
        except RuntimeError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc

    @app.delete("/features/mac-analysis")
    async def remove_mac_analysis_feature():
        if any(not job.get("done") for job in list_job_statuses()):
            raise HTTPException(status_code=409, detail="処理中のジョブがあるためMac解析機能を削除できません")
        return await run_in_threadpool(uninstall_mac_analysis_runtime)

    @app.post("/features/score/install", response_model=JobSubmissionResponse)
    async def install_score_feature():
        return JobSubmissionResponse(**submit_job_spec({
            "type": "feature_install_score",
            "jobId": "feature:score",
        }))

    @app.delete("/features/score")
    async def remove_score_feature():
        if any(not job.get("done") for job in list_job_statuses()):
            raise HTTPException(status_code=409, detail="処理中のジョブがあるため楽譜抽出機能を削除できません")
        return await run_in_threadpool(uninstall_score_runtime)

    @app.post("/system/setup-nvidia")
    async def setup_nvidia(x_practice_lab_desktop_token: str | None = Header(default=None)):
        expected_token = os.environ.get("PRACTICE_LAB_DESKTOP_TOKEN")
        if not expected_token or not x_practice_lab_desktop_token or not secrets.compare_digest(expected_token, x_practice_lab_desktop_token):
            raise HTTPException(status_code=403, detail="デスクトップアプリから実行してください")
        try:
            return await run_in_threadpool(launch_nvidia_setup)
        except RuntimeError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc

    @app.get("/storage")
    async def get_storage_report():
        return await run_in_threadpool(storage_report)

    @app.post("/storage/cleanup")
    async def clean_storage(request: StorageCleanupRequest):
        if any(not job.get("done") for job in list_job_statuses()):
            raise HTTPException(status_code=409, detail="処理中のジョブがあるためキャッシュを整理できません")
        try:
            return await run_in_threadpool(cleanup_storage, request.categories)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.get("/jobs", response_model=list[JobStatusResponse])
    async def jobs(recoverable: bool = False):
        return [JobStatusResponse(**job) for job in list_job_statuses(recoverable_only=recoverable)]

    @app.get("/jobs/history", response_model=list[JobStatusResponse])
    async def job_history():
        return [JobStatusResponse(**job) for job in list_job_history()]

    @app.post("/jobs/{job_id}/resume", response_model=JobSubmissionResponse)
    async def resume_job(job_id: str):
        try:
            spec = await run_in_threadpool(get_resumable_job_spec, job_id)
            submitted = await run_in_threadpool(submit_job_spec, spec)
        except ValueError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc
        return JobSubmissionResponse(**submitted)

    @app.delete("/jobs/{job_id}/cancel-interrupted")
    async def cancel_interrupted_job_request(job_id: str):
        try:
            job = await run_in_threadpool(cancel_interrupted_job, job_id)
        except ValueError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc
        return {"ok": True, "job": JobStatusResponse(**job).model_dump()}

    @app.get("/jobs/{video_id}", response_model=JobStatusResponse)
    async def job_status(video_id: str):
        job = get_job_status(video_id)
        if not job:
            raise HTTPException(status_code=404, detail="job not found")
        return JobStatusResponse(**job)

    @app.delete("/jobs/{job_id}", response_model=JobStatusResponse)
    async def cancel_job_request(job_id: str):
        try:
            job = await run_in_threadpool(cancel_job, job_id)
        except ValueError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc
        return JobStatusResponse(**job)

    @app.post("/analyze", response_model=JobSubmissionResponse)
    async def analyze(request: AnalyzeRequest):
        if not request.url.startswith("http"):
            raise HTTPException(status_code=400, detail="URLが不正です")
        video_id = extract_video_id(request.url)
        if not video_id:
            raise HTTPException(status_code=400, detail="YouTube URLが不正です")
        try:
            start_sec, end_sec = normalize_analysis_range(request.startSec, request.endSec)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        session_id = build_analysis_session_id(video_id, start_sec, end_sec)
        return JobSubmissionResponse(**submit_job_spec({
            "type": "analyze_url",
            "jobId": session_id,
            "url": request.url,
            "force": request.force,
            "startSec": start_sec,
            "endSec": end_sec,
        }))

    @app.post("/analyze-file", response_model=JobSubmissionResponse)
    async def analyze_file(file: UploadFile = File(...)):
        filename = Path(file.filename or "").name
        suffix = Path(filename).suffix.lower()
        if suffix not in {".wav", ".m4a", ".mp3", ".flac", ".aac", ".ogg"}:
            await file.close()
            raise HTTPException(status_code=400, detail="WAV、M4A、MP3、FLAC、AAC、OGGに対応しています")

        session_id = f"local-{uuid.uuid4().hex[:20]}"
        source_path = DATA_WORK_DIR / "uploads" / f"{session_id}{suffix}"
        try:
            await run_in_threadpool(save_uploaded_audio, file.file, source_path)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"アップロード保存エラー: {exc}") from exc
        finally:
            await file.close()

        title = Path(filename).stem.strip()[:200] or "ローカル音源"
        return JobSubmissionResponse(**submit_job_spec({
            "type": "analyze_file",
            "jobId": session_id,
            "sourceName": source_path.name,
            "title": title,
            "originalFilename": filename,
        }))

    @app.delete("/results/{video_id}")
    async def remove_result(video_id: str):
        try:
            await run_in_threadpool(delete_result, video_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"削除エラー: {exc}") from exc
        return {"ok": True}

    @app.delete("/results")
    async def remove_results(request: DeleteSessionsRequest):
        try:
            deleted = await run_in_threadpool(delete_results, request.ids)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"一括削除エラー: {exc}") from exc
        return {"ok": True, "deleted": deleted}

    @app.patch("/results/{video_id}", response_model=AnalyzeResponse)
    async def rename_session(video_id: str, request: RenameSessionRequest):
        try:
            data = await run_in_threadpool(rename_result, video_id, request.title)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"リネーム保存エラー: {exc}") from exc
        return AnalyzeResponse(**data)

    @app.patch("/results/{video_id}/library", response_model=AnalyzeResponse)
    async def update_session_library_metadata(video_id: str, request: LibraryMetadataRequest):
        try:
            data = await run_in_threadpool(
                update_library_metadata,
                video_id,
                tags=request.tags,
                opened=request.opened,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return AnalyzeResponse(**data)

    @app.put("/results/{video_id}/sections", response_model=AnalyzeResponse)
    async def update_sections(video_id: str, request: SaveSectionsRequest):
        try:
            data = await run_in_threadpool(
                save_sections,
                video_id,
                [section.model_dump() for section in request.sections],
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return AnalyzeResponse(**data)

    @app.delete("/results/{video_id}/sections", response_model=AnalyzeResponse)
    async def restore_sections(video_id: str):
        try:
            data = await run_in_threadpool(save_sections, video_id, [], restore_automatic=True)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return AnalyzeResponse(**data)

    @app.post("/results/{video_id}/bpm", response_model=AnalyzeResponse)
    async def apply_bpm_correction(video_id: str, request: ApplyBpmCorrectionRequest):
        try:
            data = await run_in_threadpool(save_bpm_correction, video_id, request.factor)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"BPM補正保存エラー: {exc}") from exc
        return AnalyzeResponse(**data)

    @app.post("/results/{video_id}/stems", response_model=JobSubmissionResponse)
    async def generate_stems(video_id: str):
        job_id = f"{video_id}:stems"
        return JobSubmissionResponse(**submit_job_spec({
            "type": "stems",
            "jobId": job_id,
            "videoId": video_id,
        }))

    @app.post("/results/{video_id}/stems/export", response_model=JobSubmissionResponse)
    async def export_stems(video_id: str, request: StemExportRequest):
        export_id = uuid.uuid4().hex
        job_id = f"{video_id}:stem-export:{export_id}"
        return JobSubmissionResponse(**submit_job_spec({
            "type": "stem_export",
            "jobId": job_id,
            "videoId": video_id,
            "exportId": export_id,
            "request": request.model_dump(),
        }))

    @app.get("/jobs/{job_id}/download")
    async def download_job_result(job_id: str):
        job = get_job_status(job_id)
        result = job.get("result") if job and job.get("done") and not job.get("error") else None
        export_id = result.get("exportId") if isinstance(result, dict) else None
        if not isinstance(export_id, str) or not re.fullmatch(r"[0-9a-f]{32}", export_id):
            raise HTTPException(status_code=404, detail="Export is not ready")
        output_path = DATA_WORK_DIR / "stem-exports" / f"{export_id}.mp3"
        if not output_path.is_file():
            raise HTTPException(status_code=404, detail="Export file not found")
        return FileResponse(
            output_path,
            media_type="audio/mpeg",
            filename=result.get("filename", "stem-mix.mp3"),
        )

    def require_desktop_token(token: str | None) -> None:
        expected_token = os.environ.get("PRACTICE_LAB_DESKTOP_TOKEN")
        if not expected_token or not token or not secrets.compare_digest(expected_token, token):
            raise HTTPException(status_code=403, detail="デスクトップアプリから実行してください")

    @app.get("/cloud/status")
    async def cloud_status():
        config = get_r2_config()
        return {
            "configured": config is not None,
            "bucket": config.bucket if config else None,
            "viewerUrl": f"{config.public_base_url}/index.html" if config and config.public_base_url else None,
        }

    @app.post("/cloud/test")
    async def cloud_test(x_practice_lab_desktop_token: str | None = Header(default=None)):
        require_desktop_token(x_practice_lab_desktop_token)
        config = get_r2_config()
        if config is None:
            raise HTTPException(status_code=409, detail="クラウド連携が設定されていません")
        try:
            return await run_in_threadpool(test_r2_connection, config)
        except Exception as exc:
            raise HTTPException(status_code=409, detail=f"R2へ接続できませんでした: {exc}") from exc

    @app.post("/cloud/sync", response_model=JobSubmissionResponse)
    async def sync_cloud(x_practice_lab_desktop_token: str | None = Header(default=None)):
        require_desktop_token(x_practice_lab_desktop_token)
        job_id = "cloud:sync"
        return JobSubmissionResponse(**submit_job_spec({
            "type": "cloud_sync",
            "jobId": job_id,
        }))

    @app.get("/library/folders", response_model=list[SidebarFolder])
    async def get_library_folders():
        return [SidebarFolder(**folder) for folder in load_folders()]

    @app.put("/library/folders", response_model=list[SidebarFolder])
    async def put_library_folders(folders: list[SidebarFolder]):
        payload = [folder.model_dump() for folder in folders]
        saved = await run_in_threadpool(save_folders, payload)
        await run_in_threadpool(export_static_assets)
        await run_in_threadpool(publish_folders_to_cloud)
        return [SidebarFolder(**folder) for folder in saved]

    @app.post("/score/preview", response_model=JobSubmissionResponse)
    async def score_preview(request: ScorePreviewRequest):
        if not score_runtime_available():
            raise HTTPException(status_code=409, detail="楽譜抽出機能が追加されていません")
        video_id = extract_video_id(request.url)
        if not video_id:
            raise HTTPException(status_code=400, detail="YouTube URLが不正です")
        job_id = f"{video_id}:score-preview"
        return JobSubmissionResponse(**submit_job_spec({
            "type": "score_preview",
            "jobId": job_id,
            "videoId": video_id,
            "request": request.model_dump(),
        }))

    @app.post("/score/extract", response_model=JobSubmissionResponse)
    async def score_extract(request: ScoreExtractRequest):
        if not score_runtime_available():
            raise HTTPException(status_code=409, detail="楽譜抽出機能が追加されていません")
        video_id = extract_video_id(request.url or "")
        if not video_id:
            raise HTTPException(status_code=400, detail="YouTube URLが不正です")
        job_id = f"{video_id}:score-extract"
        return JobSubmissionResponse(**submit_job_spec({
            "type": "score_extract",
            "jobId": job_id,
            "videoId": video_id,
            "request": request.model_dump(),
        }))

    app.mount("/audio", StaticFiles(directory=PUBLIC_AUDIO_DIR), name="audio")
    app.mount("/video", StaticFiles(directory=PUBLIC_VIDEO_DIR), name="video")
    app.mount("/stems", StaticFiles(directory=PUBLIC_STEMS_DIR), name="stems")
    app.mount("/score", StaticFiles(directory=PUBLIC_SCORE_DIR), name="score")
    app.mount("/results", StaticFiles(directory=PUBLIC_RESULTS_DIR), name="results")
    app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="static")
    return app
