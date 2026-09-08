import json
import tempfile
from pathlib import Path

import pytest

from practice_lab.timing_corrections import apply_timing_correction
from scripts.repair_timing import repair

RECIPE = Path(__file__).resolve().parents[1] / 'scripts/timing-corrections/XUSMX3kEYoY-clip-0-228000.json'


def test_verified_syncopation_repair_preserves_other_beats_and_is_idempotent():
    correction = json.loads(RECIPE.read_text())
    # Actual bad detector positions: it stretches quarter notes toward syncopated attacks.
    middle = [127.23, 127.65, 128.09, 128.55, 128.97, 129.43, 129.85,
              130.3, 130.74, 131.19, 131.65, 132.11, 132.56, 133.01,
              133.44, 133.87, 134.31, 134.76, 135.19, 135.63, 136.09,
              136.52, 136.98, 137.41, 137.88, 138.33, 138.77, 139.22, 139.59]
    data = dict(beats=[1.83, 2.21, 126.83] + middle + [139.98, 140.37],
                downbeats=[1.83, 127.23, 128.97, 130.74, 132.56, 134.31, 136.09, 137.88, 139.59],
                sections=[dict(start_time=0, end_time=141)])
    adjusted = apply_timing_correction(data, correction)
    fixed = [b for b in adjusted['beats'] if 127.23 <= b <= 139.59]
    assert len(fixed) == 33
    assert all(.383 <= round(b-a, 3) <= .394 for a, b in zip(fixed, fixed[1:]))
    assert adjusted['beats'][:5] == [.283, .67, 1.057, 1.443, 1.83]
    assert adjusted['downbeats'][:2] == [.283, 1.83]
    assert adjusted['beats'][-2:] == [139.98, 140.37]
    assert 126.83 in adjusted['beats']
    assert apply_timing_correction(adjusted, correction) == adjusted
    assert data['beats'][0] == 1.83


def test_local_repair_preserves_backup_and_updates_only_target_session():
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        results = root / 'data/results'
        results.mkdir(parents=True)
        correction = json.loads(RECIPE.read_text())
        target = results / (correction['sessionId'] + '.json')
        data = dict(id=correction['sessionId'], beats=[1.83, 127.23, 139.59], downbeats=[1.83, 127.23, 139.59])
        target.write_text(json.dumps(data))
        original = target.read_bytes()
        other = results / 'other.json'
        other.write_text('{}')
        report = repair(root, RECIPE)
        assert Path(report['backup']).read_bytes() == original
        first = target.read_bytes()
        repair(root, RECIPE)
        assert target.read_bytes() == first
        assert Path(report['backup']).read_bytes() == original
        assert other.read_text() == '{}'
        assert (root / 'public/results' / target.name).read_bytes() == first


def test_rejects_non_bar_anchor_instead_of_guessing():
    with pytest.raises(ValueError):
        apply_timing_correction({'beats': [0, 1]}, {'spans': [{'start': 0, 'end': 1, 'intervals': 3}]})
