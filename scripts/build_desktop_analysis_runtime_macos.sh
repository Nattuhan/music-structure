#!/bin/bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
python_bin="${PYTHON_BIN:-$repo_root/.venv/bin/python}"
version="$(node -p 'require("./package.json").version')"
dist_dir="$repo_root/desktop/dist/features"
runtime_name="practice-lab-analysis-runtime"
archive="$repo_root/desktop/dist/installer/PracticeLab-Analysis-macOS-arm64-$version.zip"

if [[ "$(uname -s)" != "Darwin" || "$(uname -m)" != "arm64" ]]; then
  echo "The macOS analysis runtime must be built on an Apple Silicon Mac." >&2
  exit 1
fi

"$python_bin" -m PyInstaller \
  --noconfirm \
  --clean \
  --onedir \
  --name "$runtime_name" \
  --paths "$repo_root" \
  --collect-all torch \
  --collect-all natten \
  --collect-all allin1fix \
  --collect-all demucs_infer \
  --exclude-module cv2 \
  --exclude-module rapidocr_onnxruntime \
  --exclude-module onnxruntime \
  --exclude-module pyclipper \
  --exclude-module shapely \
  --hidden-import practice_lab.compute_device \
  --hidden-import practice_lab.jpop_sections \
  --hidden-import practice_lab.timing \
  --hidden-import practice_lab.audio_timing \
  --distpath "$dist_dir" \
  --workpath "$repo_root/desktop/build/analysis-runtime" \
  --specpath "$repo_root/desktop/build" \
  "$repo_root/desktop/backend_entry.py"

runtime="$dist_dir/$runtime_name/$runtime_name"
"$runtime" --check-runtime macos-analysis
"$runtime" "$repo_root/scripts/analyze_audio.py" --help
"$runtime" "$repo_root/scripts/split_stems.py" --help

mkdir -p "$(dirname "$archive")"
"$python_bin" -c 'from pathlib import Path; import sys; Path(sys.argv[1]).unlink(missing_ok=True)' "$archive"
(cd "$dist_dir" && zip -qry "$archive" "$runtime_name")
echo "Created $archive"
