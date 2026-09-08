from pathlib import Path

import numpy as np
import pytest
import soundfile as sf

from practice_lab.audio_timing import refine_timing_from_audio


def write_attacks(path, times, duration, *, inverted_stereo=False):
    rate = 8000
    audio = np.zeros(round(duration * rate))
    t = np.arange(round(.065 * rate)) / rate
    pulse = .7 * np.sin(2 * np.pi * 870 * t) * np.exp(-t * 65)
    for time in times:
        i = round(time * rate)
        if i < 0 or i + len(pulse) > len(audio):
            continue
        audio[i:i + len(pulse)] += pulse
    if inverted_stereo:
        audio = np.column_stack([audio, -audio])
    sf.write(path, audio, rate, subtype='FLOAT')


def drifting_detection(period, offset):
    start = offset + 16 * period
    end = start + 32 * period
    downbeats = ([offset + i * 4 * period for i in range(4)]
                 + np.linspace(start, end, 8).tolist()
                 + [end + i * 4 * period for i in range(1, 9)])
    beats = [round(left + (right - left) * i / 4, 3)
             for left, right in zip(downbeats, downbeats[1:]) for i in range(4)]
    beats.append(round(downbeats[-1], 3))
    return dict(bpm=60 / period, beats=beats, downbeats=[round(b, 3) for b in downbeats],
                duration=beats[-1] + period, sections=[dict(start_time=0, end_time=beats[-1])]), start, end


@pytest.mark.parametrize('period,offset', [(.31, .11), (.5, .17), (.7, .23)])
@pytest.mark.parametrize('offbeat', [3.5, 4.5])
def test_corrects_audio_supported_syncopation_at_different_tempos_and_positions(tmp_path, period, offset, offbeat):
    data, start, end = drifting_detection(period, offset)
    attacks = [start + (i // 2 * 8 + (offbeat if i % 2 else 0)) * period for i in range(9)]
    audio = tmp_path / 'unrelated-name.wav'
    write_attacks(audio, attacks, data['duration'], inverted_stereo=True)
    result = refine_timing_from_audio(data, audio)
    fixed = [beat for beat in result['beats'] if round(start, 3) <= beat <= round(end, 3)]
    assert len(fixed) == 33
    assert max(abs((b - a) - period) for a, b in zip(fixed, fixed[1:])) < .006
    assert 'audioTimingRepair' in result
    assert 'timingCorrection' not in result
    assert [b for b in result['beats'] if b < start or b > end] == [b for b in data['beats'] if b < start or b > end]
    assert refine_timing_from_audio(result, audio) == result


@pytest.mark.parametrize('case', ['real_tempo_change', 'silence', 'unrelated_attacks'])
def test_keeps_genuine_tempo_change_or_unsupported_span(tmp_path, case):
    data, start, end = drifting_detection(.5, .17)
    if case == 'real_tempo_change':
        attacks = [b for b in data['beats'] if start <= b <= end]
    elif case == 'silence':
        attacks = []
    else:
        attacks = [start + .14 + (i // 2 * 8 + (3.5 if i % 2 else 0)) * .5 for i in range(9)]
    audio = tmp_path / 'song.wav'
    write_attacks(audio, attacks, data['duration'])
    assert refine_timing_from_audio(data, audio) is data


@pytest.mark.parametrize('period', [.3, .45, .65])
def test_backfills_missing_intro_only_with_audio_support(tmp_path, period):
    first = 4.5 * period
    beats = [round(first + i * period, 3) for i in range(48)]
    data = dict(bpm=60 / period, beats=beats, downbeats=beats[::4], duration=beats[-1] + period)
    audio = tmp_path / 'intro.wav'
    write_attacks(audio, [first - 3.5 * period, first - .5 * period], data['duration'])
    result = refine_timing_from_audio(data, audio)
    assert result['beats'][:5] == [round(first - i * period, 3) for i in range(4, -1, -1)]
    assert result['downbeats'][:2] == [round(first - 4 * period, 3), round(first, 3)]
    assert result['beats'][4:] == beats
    assert refine_timing_from_audio(result, audio) == result
    write_attacks(audio, [], data['duration'])
    assert refine_timing_from_audio(data, audio) is data
    write_attacks(audio, [first - 3.2 * period, first - .2 * period], data['duration'])
    assert refine_timing_from_audio(data, audio) is data


def test_fresh_analyzer_output_is_repaired_without_session_identity_or_saved_correction(tmp_path, monkeypatch, capsys):
    import importlib.util
    import json
    import sys
    from types import SimpleNamespace

    data, start, end = drifting_detection(.5, .17)
    audio = tmp_path / 'brand-new-recording.wav'
    attacks = [start + (i // 2 * 8 + (3.5 if i % 2 else 0)) * .5 for i in range(9)]
    write_attacks(audio, attacks, data['duration'])
    result = SimpleNamespace(beats=data['beats'], downbeats=data['downbeats'], bpm=data['bpm'],
                             path=audio, segments=[])
    monkeypatch.setitem(sys.modules, 'allin1fix', SimpleNamespace(analyze=lambda *args, **kwargs: result))
    monkeypatch.setitem(sys.modules, 'torch', SimpleNamespace(
        cuda=SimpleNamespace(is_available=lambda: False),
        backends=SimpleNamespace(mps=SimpleNamespace(is_available=lambda: False))))
    spec = importlib.util.spec_from_file_location('fresh_analyzer_test', Path(__file__).resolve().parents[1] / 'scripts/analyze_audio.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    for _ in range(2):
        assert module.main([str(audio), '--device', 'cpu']) == 0
        output = json.loads(capsys.readouterr().out)
        assert len([b for b in output['beats'] if start <= b <= end]) == 33
        assert 'audioTimingRepair' in output
        assert 'timingCorrection' not in output


def test_accent_pattern_is_inferred_instead_of_matching_a_specific_riff(tmp_path):
    data, start, end = drifting_detection(.5, .17)
    positions = [0, 1.5, 4, 6.5, 8, 11.5, 16, 19.5, 24, 25.5, 28, 30.5, 32]
    audio = tmp_path / 'different-rhythm.wav'
    write_attacks(audio, [start + beat * .5 for beat in positions], data['duration'])
    result = refine_timing_from_audio(data, audio)
    assert len([b for b in result['beats'] if start <= b <= end]) == 33
    assert [span['intervals'] for span in result['audioTimingRepair']['spans']] == [4, 4, 8, 8, 4, 4]
