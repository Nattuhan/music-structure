"""Conservative beat repair supported by attacks in the source audio.

Timing alone cannot distinguish syncopation from a real tempo change. Candidate
spans must also contain attacks supporting the same quarter/eighth-note grid.
"""
from pathlib import Path
from statistics import median

import numpy as np
import soundfile as sf
from scipy.signal import find_peaks

from .timing import bars_from_sections


def _attacks(audio: sf.SoundFile, start: float, end: float, relative_threshold: float) -> list[tuple[float, float]]:
    rate = audio.samplerate
    first = max(0, int(start * rate))
    audio.seek(first)
    samples = audio.read(max(0, int(end * rate) - first), always_2d=True, dtype="float32")
    hop = max(1, round(rate * 0.005))
    count = len(samples) // hop
    if count < 4:
        return []
    # Average channel power, not samples: opposite stereo phases must not cancel.
    power = np.mean(samples[:count * hop].reshape(count, hop, -1) ** 2, axis=(1, 2))
    envelope = np.sqrt(power)
    onset = np.maximum(0, envelope - np.r_[envelope[:2], envelope[:-2]])
    maximum = float(onset.max())
    if maximum <= 1e-7:
        return []
    indexes, properties = find_peaks(onset, distance=max(1, round(0.1 * rate / hop)),
                                    prominence=maximum * relative_threshold)
    return [(round((first + int(index) * hop) / rate, 3), float(strength))
            for index, strength in zip(indexes, properties["prominences"])]


def _candidate_spans(data: dict) -> list[tuple[float, float, float]]:
    downbeats = data.get("downbeats") or []
    bpm = float(data.get("bpm") or 0)
    if bpm <= 0 or len(downbeats) < 12:
        return []
    bar = 240 / bpm
    gaps = np.diff(downbeats)
    candidates = []
    index = 3
    while index < len(gaps) - 3:
        if not 1.08 * bar <= gaps[index] <= 1.3 * bar:
            index += 1
            continue
        first = index
        while index < len(gaps) and 1.08 * bar <= gaps[index] <= 1.3 * bar:
            index += 1
        if index > len(gaps) - 3 or not 4 <= index - first <= 16:
            continue
        before, after = gaps[first - 3:first], gaps[index:index + 3]
        flank = list(before) + list(after)
        period = median(flank) / 4
        # Both sides must independently agree. A sustained tempo change is not
        # an error, even if its own beat intervals are very regular.
        if any(abs(gap / (4 * period) - 1) > 0.04 for gap in flank):
            continue
        if abs(median(before) / median(after) - 1) > 0.025:
            continue
        candidates.append((float(downbeats[first]), float(downbeats[index]), period))
    return candidates


def _audio_supported_spans(audio: sf.SoundFile, start: float, end: float, period: float) -> list[dict]:
    beat_count = round((end - start) / (4 * period)) * 4
    if not 16 <= beat_count <= 64:
        return []
    fitted_period = (end - start) / beat_count
    if abs(fitted_period / period - 1) > 0.025:
        return []
    attacks = _attacks(audio, start - 0.08, end + 0.08, 0.3)
    if len(attacks) < 6:
        return []
    times = [time for time, _ in attacks]
    positions = [(time - start) / fitted_period for time in times]
    eighths = [round(position * 2) for position in positions]
    # Infer each accent's eighth-note position from the audio; no particular
    # accent sequence or song identity is prescribed. Require both offbeats and
    # independently audible bar heads across the span before filling its grid.
    if (any(abs(position - eighth / 2) > 0.14 for position, eighth in zip(positions, eighths))
            or len(set(eighths)) != len(eighths)
            or sum(eighth % 2 != 0 for eighth in eighths) < 2
            or eighths[0] != 0 or eighths[-1] != beat_count * 2):
        return []
    if max(abs(times[0] - start), abs(times[-1] - end)) > period * 0.1:
        return []
    anchors = [(time, eighth // 2) for time, eighth in zip(times, eighths) if eighth % 8 == 0]
    if len(anchors) < 3:
        return []
    anchors[0], anchors[-1] = (start, 0), (end, beat_count)
    return [{"start": left[0], "end": right[0], "intervals": right[1] - left[1]}
            for left, right in zip(anchors, anchors[1:])]


def _missing_intro(audio: sf.SoundFile, data: dict) -> dict | None:
    beats = data.get("beats") or []
    downbeats = data.get("downbeats") or []
    if len(beats) < 32 or not downbeats or abs(downbeats[0] - beats[0]) > 0.03:
        return None
    leading = np.asarray(beats[:32], dtype=float)
    period, _ = np.polyfit(np.arange(len(leading)), leading, 1)
    first = float(beats[0])
    if not 2 * period < first < min(8 * period, 8):
        return None
    if any(abs(gap / period - 1) > 0.1 for gap in np.diff(leading)):
        return None
    if any(abs((downbeats[i] - first) / period - i * 4) > 0.15
           for i in range(min(8, len(downbeats)))):
        return None
    attacks = _attacks(audio, 0, first, 0.035)
    if len(attacks) < 2 or attacks[-1][0] - attacks[0][0] < period:
        return None
    # Music before the detector's first beat must follow its eighth-note phase.
    # Silence or an unrelated/free-time introduction provides no such evidence.
    if any(abs((first - time) / period * 2 - round((first - time) / period * 2)) > 0.24
           for time, _ in attacks):
        return None
    return {"downbeat": first, "period": round(float(period), 6)}


def _apply_verified_grid(data: dict, correction: dict) -> dict:
    beats = list(data["beats"])
    downbeats = list(data.get("downbeats") or [])
    for span in correction["spans"]:
        start, end, count = span["start"], span["end"], span["intervals"]
        grid = [round(start + (end - start) * i / count, 3) for i in range(count + 1)]
        beats = sorted([b for b in beats if b < start or b > end] + grid)
        downbeats = sorted([b for b in downbeats if b < start or b > end] + grid[::4])
    if correction.get("intro"):
        anchor = correction["intro"]["downbeat"]
        period = correction["intro"]["period"]
        leading = [(i, round(anchor - i * period, 3))
                   for i in range(0, int(anchor / period) + 1)]
        beats = sorted([b for b in beats if b > anchor] + [b for _, b in leading])
        downbeats = sorted([b for b in downbeats if b > anchor]
                           + [b for i, b in leading if i % 4 == 0])
    adjusted = {**data, "beats": beats, "downbeats": downbeats, "total_bars": len(downbeats)}
    for key in ("sections", "automaticSections"):
        if key in data:
            adjusted[key] = bars_from_sections(data[key], downbeats)
    return adjusted


def refine_timing_from_audio(data: dict, audio_path: Path) -> dict:
    """Return unchanged data unless independent audio evidence supports repair."""
    with sf.SoundFile(audio_path) as audio:
        intro = _missing_intro(audio, data)
        spans = []
        for start, end, period in _candidate_spans(data):
            spans.extend(_audio_supported_spans(audio, start, end, period))
    if not intro and not spans:
        return data
    correction = {"spans": spans}
    if intro:
        correction["intro"] = intro
    adjusted = _apply_verified_grid(data, correction)
    adjusted["audioTimingRepair"] = {"version": 1, **correction}
    return adjusted
