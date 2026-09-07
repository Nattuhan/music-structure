"""Keep separated tracks at a common listening level without changing their balance."""

import json
import math
import re
from pathlib import Path

from .process_manager import run_process


def measure_loudness(sources: list[Path]) -> dict:
    command = ["ffmpeg", "-hide_banner", "-nostdin"]
    for source in sources:
        command.extend(["-i", str(source)])
    inputs = "".join(f"[{index}:a]" for index in range(len(sources)))
    # Measure the reconstructed mix, not each instrument's loudness: normalizing
    # instruments independently would turn quiet accompaniment into a lead part.
    graph = (
        f"{inputs}amix=inputs={len(sources)}:normalize=0:duration=longest,"
        "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json[out]"
    )
    command.extend(["-filter_complex", graph, "-map", "[out]", "-f", "null", "-"])
    result = run_process(command, capture_output=True, text=True, encoding="utf-8", errors="replace", check=True)
    match = re.search(r'(\{\s*"input_i".*?\})', result.stderr, re.DOTALL)
    if not match:
        raise RuntimeError("ffmpeg loudness measurement not found")
    return json.loads(match.group(1))


def shared_gain_db(measured: dict, peaks: list[float]) -> float:
    integrated = float(measured["input_i"])
    if integrated == -math.inf:
        return 0.0  # Silence must stay silent, rather than receiving infinite gain.
    mix_peak = float(measured["input_tp"])
    if not math.isfinite(integrated) or not math.isfinite(mix_peak):
        raise ValueError("Invalid loudness measurement")
    if any(math.isnan(peak) or peak == math.inf for peak in peaks):
        raise ValueError("Invalid stem peak measurement")
    # Preserve dynamics and leave headroom in both the full mix and solo tracks.
    # Very dynamic recordings may remain below the target to avoid clipping.
    return min(-16.0 - integrated, -1.5 - max([mix_peak, *peaks]))


def measure_stem_gain(sources: list[Path]) -> float:
    if not sources:
        raise ValueError("No stems to normalize")
    measured = measure_loudness(sources)
    peaks = [float(measure_loudness([source])["input_tp"]) for source in sources]
    return shared_gain_db(measured, peaks)
