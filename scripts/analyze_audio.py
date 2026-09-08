import collections
import collections.abc
import argparse
import contextlib
import json
import os
import sys
import warnings
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

import numpy as np

for name in ("MutableSequence", "MutableMapping", "Sequence", "Mapping"):
    if not hasattr(collections, name):
        setattr(collections, name, getattr(collections.abc, name))

for name, value in (("float", float), ("int", int), ("complex", complex)):
    if not hasattr(np, name):
        setattr(np, name, value)

warnings.filterwarnings("ignore", message="NATTEN was not built with")

import allin1fix
import torch

from practice_lab.compute_device import is_acceleration_compatibility_error, select_torch_device
from practice_lab.jpop_sections import refine_jpop_section_labels
from practice_lab.timing import normalize_tempo_grid
from practice_lab.audio_timing import refine_timing_from_audio


def fmt(seconds: float) -> str:
    return f"{int(seconds // 60):02d}:{int(seconds % 60):02d}"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="PracticeLab music structure analyzer")
    parser.add_argument("audio_path")
    parser.add_argument("--device", choices=("auto", "cuda", "mps", "cpu"), default="auto")
    args = parser.parse_args(argv)

    mp3_path = Path(args.audio_path).resolve()
    device = select_torch_device(args.device, torch)

    def analyze(selected_device: str):
        print(f"[INFO] Starting all-in-one-fix analysis on {selected_device}.", file=sys.stderr, flush=True)
        return allin1fix.analyze(str(mp3_path), device=selected_device)

    with contextlib.redirect_stdout(sys.stderr):
        try:
            result = analyze(device)
        except RuntimeError as exc:
            if args.device != "auto" or device != "mps" or not is_acceleration_compatibility_error(exc):
                raise
            print(f"[INFO] MPS backend is unavailable for this model; retrying on CPU: {exc}", file=sys.stderr, flush=True)
            device = "cpu"
            result = analyze(device)
        print(f"[INFO] Finished all-in-one-fix analysis on {device}.", file=sys.stderr, flush=True)

    beats = sorted(round(float(beat), 3) for beat in (result.beats or []))
    downbeats = sorted(round(float(downbeat), 3) for downbeat in (result.downbeats or []))

    def time_to_bar(value: float) -> int:
        for index, downbeat in enumerate(downbeats):
            if downbeat >= value - 0.1:
                return index + 1
        return len(downbeats)

    sections = []
    segments = result.segments or []
    duration = float(result.path and (beats[-1] if beats else 0.0))
    if segments:
        last_end = float(getattr(segments[-1], "end", 0.0) or 0.0)
        duration = max(duration, last_end)
    if downbeats:
        duration = max(duration, downbeats[-1])

    for index, segment in enumerate(segments):
        start = float(segment.start)
        if index + 1 < len(segments):
            end_time = float(segments[index + 1].start)
        else:
            end_time = float(getattr(segment, "end", duration) or duration)
            duration = max(duration, end_time)
        start_bar = time_to_bar(start)
        end_bar = max(start_bar, time_to_bar(end_time) - 1)
        sections.append(
            {
                "label": segment.label,
                "start_bar": start_bar,
                "end_bar": end_bar,
                "bar_count": end_bar - start_bar + 1,
                "start_time": round(start, 2),
                "end_time": round(end_time, 2),
                "start_time_str": fmt(start),
            }
        )

    sections, jpop_changes = refine_jpop_section_labels(sections)

    data = {
        "device": device,
        "bpm": round(float(result.bpm), 1) if result.bpm is not None else 0.0,
        "total_bars": len(downbeats),
        "duration": round(duration, 2),
        "sections": sections,
        "beats": beats,
        "downbeats": downbeats,
    }
    if jpop_changes:
        data["jpopLabeling"] = {"version": 1, "changes": jpop_changes}
    data = normalize_tempo_grid(data)
    data = refine_timing_from_audio(data, mp3_path)
    print(json.dumps(data, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
