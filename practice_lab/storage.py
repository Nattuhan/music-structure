import json
import shutil
from datetime import datetime
from pathlib import Path

from .config import (
    DATA_RESULTS_DIR,
    FOLDERS_FILE,
    PUBLIC_AUDIO_DIR,
    PUBLIC_STEMS_DIR,
    PUBLIC_RESULTS_DIR,
    MANIFEST_FILE,
)

STEM_NAMES = ("vocals", "drums", "bass", "other")


def build_session_assets(video_id: str) -> dict[str, str]:
    assets = {
        "result": f"results/{video_id}.json",
        "audio": f"audio/{video_id}.mp3",
        "video": f"video/{video_id}.mp4",
    }
    stem_dir = PUBLIC_STEMS_DIR / video_id
    if all((stem_dir / f"{stem}.mp3").exists() for stem in STEM_NAMES):
        assets["stems"] = {
            stem: f"stems/{video_id}/{stem}.mp3"
            for stem in STEM_NAMES
        }
    return assets


def attach_session_assets(payload: dict) -> dict:
    if "id" not in payload:
        return payload
    return {**payload, "assets": {**build_session_assets(payload["id"]), **(payload.get("assets") or {})}}


def build_manifest_entry(payload: dict, *, entry_date: str) -> dict:
    payload = attach_session_assets(payload)
    entry = {
        "id": payload["id"],
        "title": payload["title"],
        "bpm": payload["bpm"],
        "date": entry_date,
        "assets": payload["assets"],
    }
    for key in ("tags", "lastOpenedAt"):
        if key in payload:
            entry[key] = payload[key]
    return entry


def normalize_manifest_entries(entries: list[dict]) -> list[dict]:
    normalized = []
    for entry in entries:
        if "id" not in entry:
            continue
        normalized.append(attach_session_assets(entry))
    return normalized


def _build_manifest_from_results() -> list[dict]:
    entries = []
    for result_file in sorted(DATA_RESULTS_DIR.glob("*.json")):
        if result_file.name in {"manifest.json", "folders.json"}:
            continue
        payload = json.loads(result_file.read_text(encoding="utf-8"))
        entry = build_manifest_entry(
            payload,
            entry_date=datetime.fromtimestamp(result_file.stat().st_mtime).date().isoformat(),
        )
        entry["_sort"] = result_file.stat().st_mtime_ns
        entries.append(entry)

    entries.sort(key=lambda item: item["_sort"], reverse=True)
    for entry in entries:
        entry.pop("_sort", None)
    return entries


def rebuild_manifest_if_needed() -> None:
    existing = []
    if MANIFEST_FILE.exists():
        existing = load_json(MANIFEST_FILE)
    if existing:
        return
    save_json(MANIFEST_FILE, _build_manifest_from_results())


def _sync_files(src_dir: Path, dst_dir: Path) -> None:
    dst_dir.mkdir(parents=True, exist_ok=True)
    src_names = {src.name for src in src_dir.iterdir() if src.is_file()}
    for dst in dst_dir.iterdir():
        if dst.is_file() and dst.name not in src_names:
            dst.unlink()
    for src in src_dir.iterdir():
        if src.is_file():
            shutil.copy2(src, dst_dir / src.name)


def bootstrap_public_data() -> None:
    for src_dir, dst_dir in ((PUBLIC_RESULTS_DIR, DATA_RESULTS_DIR),):
        if not src_dir.exists():
            continue
        for src in src_dir.iterdir():
            dst = dst_dir / src.name
            if src.is_file() and not dst.exists():
                shutil.copy2(src, dst)

    if not MANIFEST_FILE.exists():
        MANIFEST_FILE.write_text("[]", encoding="utf-8")
    if not FOLDERS_FILE.exists():
        FOLDERS_FILE.write_text("[]", encoding="utf-8")
    rebuild_manifest_if_needed()
    manifest = normalize_manifest_entries(load_manifest())
    save_json(MANIFEST_FILE, manifest)


def export_static_assets(*, include_audio: bool = True) -> None:
    _sync_files(DATA_RESULTS_DIR, PUBLIC_RESULTS_DIR)
    PUBLIC_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    if not include_audio:
        for dst in PUBLIC_AUDIO_DIR.iterdir():
            if dst.is_file():
                dst.unlink()
        if PUBLIC_STEMS_DIR.exists():
            shutil.rmtree(PUBLIC_STEMS_DIR)
        PUBLIC_STEMS_DIR.mkdir(parents=True, exist_ok=True)
    elif PUBLIC_STEMS_DIR.exists():
        # Stem files are already produced directly under public/stems.
        PUBLIC_STEMS_DIR.mkdir(parents=True, exist_ok=True)


def load_json(path: Path) -> dict | list:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict | list) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def load_manifest() -> list[dict]:
    return normalize_manifest_entries(load_json(MANIFEST_FILE))


def update_manifest(entry: dict) -> None:
    entry = attach_session_assets(entry)
    data = [item for item in load_manifest() if item["id"] != entry["id"]]
    data.insert(0, entry)
    save_json(MANIFEST_FILE, data)


def delete_manifest_entry(video_id: str) -> None:
    data = [item for item in load_manifest() if item["id"] != video_id]
    save_json(MANIFEST_FILE, data)


def load_folders() -> list[dict]:
    if not FOLDERS_FILE.exists():
        return []
    value = load_json(FOLDERS_FILE)
    return value if isinstance(value, list) else []


def save_folders(folders: list[dict]) -> list[dict]:
    save_json(FOLDERS_FILE, folders)
    return folders
