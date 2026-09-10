import subprocess
import tempfile
import unittest
import wave
from array import array
from pathlib import Path
from unittest.mock import patch

from practice_lab import services


class StemExportTests(unittest.TestCase):
    def test_creates_distinct_click_waveforms_for_each_sound(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            with patch.object(services, "DATA_WORK_DIR", Path(temp_dir)):
                payloads = []
                for sound in ("classic", "wood", "hihat"):
                    path = services.create_export_click_track([0], 85, sound)
                    with wave.open(str(path), "rb") as source:
                        self.assertEqual(source.getframerate(), 44100)
                        self.assertEqual(source.getnchannels(), 1)
                        payloads.append(source.readframes(source.getnframes()))
            self.assertEqual(len(set(payloads)), 3)
            self.assertTrue(all(any(payload) for payload in payloads))

    def test_creates_distinct_standard_click_pitches(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            with patch.object(services, "DATA_WORK_DIR", Path(temp_dir)):
                payloads = []
                for pitch in ("low", "standard", "high"):
                    path = services.create_export_click_track([0], 85, "classic", pitch)
                    with wave.open(str(path), "rb") as source:
                        payloads.append(source.readframes(source.getnframes()))
            self.assertEqual(len(set(payloads)), 3)

    def test_raises_export_click_source_level_without_changing_visible_volume(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            with patch.object(services, "DATA_WORK_DIR", Path(temp_dir)):
                path = services.create_export_click_track([0], 85)
                with wave.open(str(path), "rb") as source:
                    samples = array("h")
                    samples.frombytes(source.readframes(source.getnframes()))
            self.assertGreater(max(map(abs, samples)) / 32767, 0.60)

    def test_exports_only_enabled_stems_with_volume_and_range(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            stem_dir = root / "stems" / "video123"
            work_dir = root / "work"
            stem_dir.mkdir(parents=True)
            for stem in ("vocals", "drums", "bass", "other"):
                (stem_dir / f"{stem}.mp3").write_bytes(b"stem")

            with (
                patch.object(services, "PUBLIC_STEMS_DIR", root / "stems"),
                patch.object(services, "DATA_WORK_DIR", work_dir),
                patch.object(services, "run_process") as run,
            ):
                output = services.export_stem_mix(
                    "video123",
                    {"vocals": 80, "drums": 0, "bass": 50, "other": 0},
                    start_sec=12.5,
                    end_sec=20,
                )

            command = run.call_args.args[0]
            self.assertEqual(command.count("-i"), 2)
            self.assertIn(str((stem_dir / "vocals.mp3").resolve()), command)
            self.assertIn(str((stem_dir / "bass.mp3").resolve()), command)
            self.assertNotIn(str((stem_dir / "drums.mp3").resolve()), command)
            self.assertEqual(command.count("-ss"), 2)
            self.assertEqual(command.count("7.500000"), 2)
            filter_graph = command[command.index("-filter_complex") + 1]
            self.assertIn("volume=0.800000", filter_graph)
            self.assertIn("volume=0.500000", filter_graph)
            self.assertIn("amix=inputs=2", filter_graph)
            self.assertEqual(output.parent, work_dir)

    def test_rejects_export_when_all_stems_are_muted(self):
        with self.assertRaisesRegex(ValueError, "At least one stem"):
            services.export_stem_mix(
                "video123",
                {"vocals": 0, "drums": 0, "bass": 0, "other": 0},
            )

    def test_removes_temporary_output_when_ffmpeg_fails(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            stem_dir = root / "stems" / "video123"
            stem_dir.mkdir(parents=True)
            (stem_dir / "vocals.mp3").write_bytes(b"stem")
            with (
                patch.object(services, "PUBLIC_STEMS_DIR", root / "stems"),
                patch.object(services, "DATA_WORK_DIR", root / "work"),
                patch.object(
                    services.subprocess,
                    "run",
                    side_effect=subprocess.CalledProcessError(1, ["ffmpeg"]),
                ),
            ):
                with self.assertRaises(subprocess.CalledProcessError):
                    services.export_stem_mix("video123", {"vocals": 100})
            self.assertEqual(list((root / "work").glob("*.mp3")), [])

    def test_queued_export_returns_download_metadata(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            temporary_mix = root / "temporary.mp3"
            temporary_mix.write_bytes(b"mix")
            with (
                patch.object(services, "DATA_WORK_DIR", root / "work"),
                patch.object(services, "export_stem_mix", return_value=temporary_mix),
                patch.object(services, "set_job_status") as set_status,
            ):
                result = services.create_stem_mix_export(
                    "video123",
                    "a" * 32,
                    {"vocals": 100},
                    output_filename="楓_only_drums.mp3",
                    job_id="video123:stem-export:job",
                )

            set_status.assert_called_once_with(
                "video123:stem-export:job", "exporting", "Rendering stem mix"
            )
            self.assertEqual(result["exportId"], "a" * 32)
            self.assertEqual(result["downloadUrl"], "/jobs/video123:stem-export:job/download")
            self.assertEqual(result["filename"], "楓_only_drums.mp3")
            self.assertTrue((root / "work" / "stem-exports" / f"{'a' * 32}.mp3").is_file())

    def test_adds_click_track_to_mix_and_removes_temporary_wav(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            stem_dir = root / "stems" / "video123"
            stem_dir.mkdir(parents=True)
            (stem_dir / "drums.mp3").write_bytes(b"stem")
            with (
                patch.object(services, "PUBLIC_STEMS_DIR", root / "stems"),
                patch.object(services, "DATA_WORK_DIR", root / "work"),
                patch.object(services, "run_process") as run,
            ):
                services.export_stem_mix(
                    "video123",
                    {"drums": 100},
                    click_times=[0, 0.5, 1.0],
                    click_volume=85,
                    click_sound="wood",
                )

            command = run.call_args.args[0]
            self.assertEqual(command.count("-i"), 2)
            filter_graph = command[command.index("-filter_complex") + 1]
            self.assertIn("[1:a]anull[click]", filter_graph)
            self.assertIn("amix=inputs=2", filter_graph)
            click_input = Path(command[command.index("-i", command.index("-i") + 1) + 1])
            self.assertFalse(click_input.exists())


if __name__ == "__main__":
    unittest.main()
