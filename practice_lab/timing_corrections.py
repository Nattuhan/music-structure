"""Apply explicit, audio-verified timing anchors without guessing tempo changes."""
from math import isfinite

from .timing import bars_from_sections


def apply_timing_correction(data: dict, correction: dict) -> dict:
    beats = list(data.get("beats") or [])
    downbeats = list(data.get("downbeats") or [])
    if not beats:
        raise ValueError("Timing correction requires detected beats")
    for span in correction.get("spans", []):
        start, end = float(span["start"]), float(span["end"])
        count = span["intervals"]
        if not (isfinite(start) and isfinite(end) and 0 <= start < end
                and isinstance(count, int) and count > 0 and count % 4 == 0):
            raise ValueError("A verified span must join downbeats over whole 4/4 bars")
        # The endpoints are verified downbeats, not automatically selected attacks:
        # a syncopated accent must never become a new tempo or bar boundary.
        grid = [round(start + (end - start) * i / count, 3) for i in range(count + 1)]
        beats = sorted([b for b in beats if b < start or b > end] + grid)
        downbeats = sorted([b for b in downbeats if b < start or b > end] + grid[::4])
    intro = correction.get("intro")
    if intro:
        anchor, period = float(intro["downbeat"]), float(intro["period"])
        if not (isfinite(anchor) and isfinite(period) and 0 <= anchor <= 30 and period >= 0.1):
            raise ValueError("Invalid verified intro anchor")
        # Work backwards from an existing downbeat, preserving its bar phase.
        leading = [(i, round(anchor - i * period, 3))
                   for i in range(0, int(anchor / period) + 1)]
        beats = sorted([b for b in beats if b > anchor] + [b for _, b in leading])
        downbeats = sorted([b for b in downbeats if b > anchor]
                           + [b for i, b in leading if i % 4 == 0])
    adjusted = {**data, "beats": beats, "downbeats": downbeats,
                "total_bars": len(downbeats), "timingCorrection": correction}
    for key in ("sections", "automaticSections"):
        if key in data:
            adjusted[key] = bars_from_sections(data[key], downbeats)
    return adjusted
