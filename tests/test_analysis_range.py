import unittest
import tempfile
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from practice_lab import app as app_module
from practice_lab import services
from practice_lab.services import build_analysis_session_id, normalize_analysis_range


class AnalysisRangeTests(unittest.TestCase):
    def test_full_video_keeps_original_session_id(self):
        self.assertEqual(build_analysis_session_id("abc123", None, None), "abc123")
        self.assertEqual(build_analysis_session_id("abc123", 0, None), "abc123")

    def test_range_builds_stable_distinct_session_id(self):
        self.assertEqual(
            build_analysis_session_id("abc123", 30.5, 95),
            "abc123-clip-30500-95000",
        )

    def test_rejects_reversed_range(self):
        with self.assertRaisesRegex(ValueError, "終了時間"):
            normalize_analysis_range(60, 30)

    def test_api_queues_range_under_clip_session_id(self):
        captured = {}

        def submit(job_id, description, func, cleanup=None, **metadata):
            captured.update(job_id=job_id, func=func, cleanup=cleanup, metadata=metadata)
            return {"jobId": job_id, "stage": "queued", "message": description}

        with tempfile.TemporaryDirectory() as temp_dir:
            public_dir = Path(temp_dir) / "public"
            public_paths = {
                "PUBLIC_DIR": public_dir,
                "PUBLIC_AUDIO_DIR": public_dir / "audio",
                "PUBLIC_VIDEO_DIR": public_dir / "video",
                "PUBLIC_STEMS_DIR": public_dir / "stems",
                "PUBLIC_SCORE_DIR": public_dir / "score",
                "PUBLIC_RESULTS_DIR": public_dir / "results",
            }
            for path in public_paths.values():
                path.mkdir(parents=True, exist_ok=True)

            with (
                patch.multiple(app_module, **public_paths),
                patch.object(app_module, "ensure_directories"),
                patch.object(app_module, "bootstrap_public_data"),
                patch.object(app_module, "export_static_assets"),
                patch.object(app_module, "submit_queued_job", side_effect=submit),
            ):
                client = TestClient(app_module.create_app())
                response = client.post(
                    "/analyze",
                    json={
                        "url": "https://www.youtube.com/watch?v=abc123",
                        "startSec": 30.5,
                        "endSec": 95,
                    },
                )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["jobId"], "abc123-clip-30500-95000")
        self.assertEqual(captured["job_id"], "abc123-clip-30500-95000")

    def test_range_analysis_caches_full_source_and_trims_locally(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            paths = {
                "DATA_RESULTS_DIR": root / "data" / "results",
                "DATA_AUDIO_DIR": root / "data" / "audio",
                "DATA_VIDEO_DIR": root / "data" / "video",
                "DATA_WORK_DIR": root / "data" / "work",
                "PUBLIC_AUDIO_DIR": root / "public" / "audio",
                "PUBLIC_VIDEO_DIR": root / "public" / "video",
            }
            for path in paths.values():
                path.mkdir(parents=True, exist_ok=True)

            def fake_download(_url, destination, *_range):
                destination.write_bytes(b"media")

            def fake_publish(source, destination):
                destination.write_bytes(source.read_bytes())

            def fake_trim(source, destination, *_range):
                destination.write_bytes(source.read_bytes())

            analysis = {
                "bpm": 120.0,
                "total_bars": 1,
                "duration": 64.5,
                "sections": [],
                "beats": [0.0, 0.5, 1.0, 1.5],
                "downbeats": [0.0],
            }
            with (
                patch.multiple(services, **paths),
                patch.object(services, "get_title", return_value="Demo"),
                patch.object(services, "download_video", side_effect=fake_download) as download_video,
                patch.object(services, "extract_wav_from_video", side_effect=fake_trim) as extract_audio,
                patch.object(services, "trim_audio_range", side_effect=fake_trim) as trim_audio,
                patch.object(services, "trim_video_range", side_effect=fake_trim) as trim_video,
                patch.object(services, "convert_wav_to_mp3", side_effect=lambda _src, dst: dst.write_bytes(b"mp3")),
                patch.object(services, "publish_video", side_effect=fake_publish),
                patch.object(services, "run_analyzer", return_value=analysis),
                patch.object(services, "update_manifest"),
                patch.object(services, "export_static_assets"),
                patch.object(services, "publish_session_to_cloud"),
                patch.object(services, "set_job_status"),
            ):
                result = services.analyze_url(
                    "https://www.youtube.com/watch?v=abc123",
                    start_sec=30.5,
                    end_sec=95,
                )

            self.assertEqual(result["id"], "abc123-clip-30500-95000")
            self.assertEqual(result["sourceVideoId"], "abc123")
            self.assertEqual(result["analysisStartSec"], 30.5)
            self.assertEqual(result["analysisEndSec"], 95.0)
            self.assertEqual(result["title"], "Demo (0:30–1:35)")
            self.assertEqual(download_video.call_args.args[2:], ())
            self.assertEqual(download_video.call_args.args[1].name, "abc123.mp4")
            self.assertEqual(extract_audio.call_args.args[0].name, "abc123.mp4")
            self.assertEqual(extract_audio.call_args.args[1].name, "abc123.wav")
            self.assertEqual(trim_audio.call_args.args[2:], (30.5, 95.0))
            self.assertEqual(trim_video.call_args.args[2:], (30.5, 95.0))


if __name__ == "__main__":
    unittest.main()
