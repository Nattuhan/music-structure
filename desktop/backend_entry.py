from __future__ import annotations

import importlib
import multiprocessing
import os
import runpy
import sys
from pathlib import Path

import uvicorn

from practice_lab.app import create_app


MEDIA_FROZEN_RUNTIME_MODULES = (
    "numpy",
    "PIL",
)
BASE_FROZEN_RUNTIME_MODULES = (
    *MEDIA_FROZEN_RUNTIME_MODULES,
    "yt_dlp",
    "practice_lab.timing",
)
MACOS_ANALYSIS_RUNTIME_MODULES = (
    "allin1fix",
    "demucs_infer.separate",
    "natten",
    "torch",
    "practice_lab.compute_device",
    "practice_lab.jpop_sections",
    "practice_lab.audio_timing",
)


def main() -> None:
    host = os.environ.get("PRACTICE_LAB_HOST", "127.0.0.1")
    port = int(os.environ.get("PRACTICE_LAB_PORT", "8000"))
    uvicorn.run(create_app(), host=host, port=port, log_level="info", access_log=False)


def check_frozen_runtime(profile: str) -> None:
    """Import modules used by scripts that the frozen backend executes dynamically."""
    modules: list[str]
    if profile == "score":
        modules = list(BASE_FROZEN_RUNTIME_MODULES)
        from practice_lab.optional_features import score_runtime_available
        if not score_runtime_available():
            raise RuntimeError("Score feature pack is unavailable")
        modules.append("practice_lab.score_extractor")
    elif profile in {"macos-analysis", "windows-cpu"}:
        modules = list(MEDIA_FROZEN_RUNTIME_MODULES)
        modules.extend(MACOS_ANALYSIS_RUNTIME_MODULES)
    elif profile in {"windows", "base"}:
        modules = list(BASE_FROZEN_RUNTIME_MODULES)
    else:
        raise ValueError(f"Unknown frozen runtime profile: {profile}")

    for module in modules:
        importlib.import_module(module)
        print(f"[OK] {module}", flush=True)


def run_frozen_python_command() -> bool:
    """Emulate the Python CLI for subprocesses launched by the frozen backend."""
    if not getattr(sys, "frozen", False) or len(sys.argv) < 2:
        return False
    if sys.argv[1] == "--check-runtime":
        if len(sys.argv) != 3:
            raise SystemExit("usage: practice-lab-backend --check-runtime PROFILE")
        check_frozen_runtime(sys.argv[2])
        return True
    if sys.argv[1] == "-m" and len(sys.argv) >= 3:
        module = sys.argv[2]
        sys.argv = [module, *sys.argv[3:]]
        runpy.run_module(module, run_name="__main__")
        return True
    script = Path(sys.argv[1])
    if script.suffix.lower() == ".py" and script.is_file():
        sys.argv = [str(script), *sys.argv[2:]]
        runpy.run_path(str(script), run_name="__main__")
        return True
    return False


if __name__ == "__main__":
    multiprocessing.freeze_support()
    if not run_frozen_python_command():
        main()
