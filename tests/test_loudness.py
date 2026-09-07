import math
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from practice_lab.loudness import measure_loudness, measure_stem_gain, shared_gain_db
from practice_lab.services import convert_stem_wav_to_mp3


class SharedGainTests(unittest.TestCase):
    def test_quiet_and_loud_tracks_move_toward_same_target(self):
        self.assertEqual(shared_gain_db({"input_i": "-26", "input_tp": "-14"}, [-18, -16]), 10)
        self.assertEqual(shared_gain_db({"input_i": "-10", "input_tp": "-1"}, [-3, -4]), -6)

    def test_solo_peak_limits_gain_even_when_mix_has_cancellation(self):
        self.assertEqual(shared_gain_db({"input_i": "-26", "input_tp": "-14"}, [-2, -8]), 0.5)

    def test_silent_stems_do_not_change_gain(self):
        self.assertEqual(shared_gain_db({"input_i": "-26", "input_tp": "-14"}, [-math.inf]), 10)
        self.assertEqual(shared_gain_db({"input_i": "-inf", "input_tp": "-inf"}, [-math.inf]), 0)

    def test_invalid_measurement_is_rejected(self):
        with self.assertRaises(ValueError):
            shared_gain_db({"input_i": "nan", "input_tp": "-10"}, [])

    @unittest.skipUnless(shutil.which("ffmpeg"), "ffmpeg required")
    def test_encoded_mixes_match_across_source_levels_and_preserve_balance(self):
        levels = []
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for scale in (0.2, 1.0):
                sources = []
                for index, frequency in enumerate((440, 880)):
                    source = root / f"{scale}-{index}.wav"
                    subprocess.run([
                        "ffmpeg", "-v", "error", "-f", "lavfi", "-i",
                        f"sine=frequency={frequency}:duration=4:sample_rate=44100",
                        "-af", f"volume={scale / (index + 1)}", str(source),
                    ], check=True, capture_output=True)
                    sources.append(source)
                before = [float(measure_loudness([source])["input_i"]) for source in sources]
                gain = measure_stem_gain(sources)
                outputs = []
                for source in sources:
                    output = source.with_suffix(".mp3")
                    convert_stem_wav_to_mp3(source, output, gain_db=gain)
                    outputs.append(output)
                after = [float(measure_loudness([output])["input_i"]) for output in outputs]
                self.assertAlmostEqual(before[0] - before[1], after[0] - after[1], delta=0.3)
                levels.append(float(measure_loudness(outputs)["input_i"]))
            self.assertAlmostEqual(levels[0], levels[1], delta=0.3)
            for level in levels:
                self.assertAlmostEqual(level, -16, delta=0.5)
