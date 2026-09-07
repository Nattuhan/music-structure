import io
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

from practice_lab import services
from practice_lab.cloud_storage import R2Config, build_r2_session_assets, delete_session_assets, get_r2_config
from practice_lab.config import load_env_files
from practice_lab.services import apply_bpm_factor_to_result, get_analyzer_runtime_config, repair_double_time_beats
from practice_lab.storage import attach_session_assets, build_manifest_entry


class CliLogTests(unittest.TestCase):
    def test_progress_bar_characters_do_not_break_cp932_console(self):
        output = io.BytesIO()
        console = io.TextIOWrapper(output, encoding="cp932", errors="strict")

        with patch("sys.stdout", console):
            services.cli_log("local-test", "Analyzing: █████")
            console.flush()

        rendered = output.getvalue().decode("cp932")
        self.assertIn("[local-test]", rendered)
        self.assertIn(r"\u2588", rendered)


class CloudPublicationSafetyTests(unittest.TestCase):
    def test_session_changes_do_not_publish_until_manual_sync(self):
        with (
            patch.dict(os.environ, {"R2_AUTO_PUBLISH": "0"}, clear=False),
            patch.object(services, "get_r2_config") as get_config,
        ):
            services.publish_session_to_cloud(
                "session-id",
                {},
                Path("session.json"),
                Path("audio.mp3"),
                None,
            )
        get_config.assert_not_called()

    def test_failed_cloud_upload_does_not_replace_local_asset_urls(self):
        config = R2Config(
            bucket="bucket",
            endpoint_url="https://example.invalid",
            access_key_id="access",
            secret_access_key="secret",
            public_base_url="https://cdn.example",
        )
        data = attach_session_assets({"id": "session-id", "title": "Song", "bpm": 120})
        original_assets = dict(data["assets"])
        with (
            tempfile.TemporaryDirectory() as temp_dir,
            patch.dict(os.environ, {"R2_AUTO_PUBLISH": "1"}, clear=False),
            patch.object(services, "get_r2_config", return_value=config),
            patch.object(services, "load_manifest", return_value=[{
                "id": "session-id", "title": "Song", "bpm": 120, "date": "2026-08-30",
            }]),
            patch.object(services, "upload_session_assets", side_effect=OSError("offline")),
            patch.object(services, "cli_log"),
        ):
            root = Path(temp_dir)
            result_file = root / "session.json"
            audio_file = root / "audio.mp3"
            result_file.write_text("{}", encoding="utf-8")
            audio_file.write_bytes(b"audio")

            services.publish_session_to_cloud("session-id", data, result_file, audio_file, None)

        self.assertEqual(data["assets"], original_assets)


class AudioConversionTests(unittest.TestCase):
    def test_loudnorm_output_is_decoded_as_utf8(self):
        analysis = MagicMock()
        analysis.stderr = """{
          "input_i": "-20.0",
          "input_lra": "2.0",
          "input_tp": "-1.0",
          "input_thresh": "-30.0",
          "target_offset": "0.0"
        }"""

        with patch.object(services, "run_process", side_effect=[analysis, MagicMock()]) as run:
            services.convert_wav_to_mp3(Path("input.wav"), Path("output.mp3"))

        first_call = run.call_args_list[0]
        self.assertEqual(first_call.kwargs["encoding"], "utf-8")
        self.assertEqual(first_call.kwargs["errors"], "replace")


class PublishedVideoStorageTests(unittest.TestCase):
    def test_publish_video_reuses_the_source_file_on_the_same_volume(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            source = root / "data" / "video.mp4"
            destination = root / "public" / "video.mp4"
            source.parent.mkdir()
            source.write_bytes(b"video-data")

            services.publish_video(source, destination)

            self.assertEqual(destination.read_bytes(), b"video-data")
            self.assertTrue(os.path.samefile(source, destination))


class JobQueueTests(unittest.TestCase):
    def test_cloud_sync_uses_a_separate_network_queue(self):
        job_id = "cloud:queue-test"
        cloud_queue = MagicMock()
        compute_queue = MagicMock()
        try:
            with (
                patch.object(services, "ensure_job_worker") as ensure,
                patch.object(services, "CLOUD_JOB_QUEUE", cloud_queue),
                patch.object(services, "JOB_QUEUE", compute_queue),
                patch.object(services, "cli_log"),
                patch.object(services, "persist_jobs_locked"),
            ):
                services.submit_queued_job(
                    job_id,
                    "Queued cloud sync",
                    lambda: {},
                    kind="cloud-sync",
                )

            ensure.assert_called_once_with("cloud")
            cloud_queue.put.assert_called_once()
            compute_queue.put.assert_not_called()
        finally:
            with services.JOB_LOCK:
                services.JOBS.pop(job_id, None)

    def test_job_display_title_replaces_internal_id_for_clients(self):
        job_id = "opaque-video-id"
        with services.JOB_LOCK:
            services.JOBS[job_id] = {
                "id": job_id,
                "stage": "downloading",
                "message": "Fetching title",
                "done": False,
            }
        try:
            with patch.object(services, "persist_jobs_locked"):
                services.set_job_display_title(job_id, "Human readable song")
            self.assertEqual(services.get_job_status(job_id)["display_title"], "Human readable song")
        finally:
            with services.JOB_LOCK:
                services.JOBS.pop(job_id, None)

    def test_resubmission_clears_an_earlier_cancellation(self):
        job_id = "test-video:score-preview"
        with services.JOB_LOCK:
            services.JOBS[job_id] = {
                "id": job_id,
                "stage": "canceled",
                "message": "Canceled",
                "done": True,
                "error": None,
                "canceled": True,
                "cancel_requested": True,
                "result": {"stale": True},
            }
        fake_queue = MagicMock()
        try:
            with (
                patch.object(services, "ensure_job_worker"),
                patch.object(services, "JOB_QUEUE", fake_queue),
                patch.object(services, "cli_log"),
                patch.object(services, "persist_jobs_locked"),
            ):
                submitted = services.submit_queued_job(
                    job_id, "Queued score preview", lambda: {"ok": True}
                )

            status = services.get_job_status(job_id)
            self.assertEqual(submitted["stage"], "queued")
            self.assertFalse(status["done"])
            self.assertFalse(status["canceled"])
            self.assertFalse(status["cancel_requested"])
            self.assertNotIn("result", status)
            archived = [
                job for job in services.list_job_history()
                if job.get("source_job_id") == job_id
            ]
            self.assertEqual(len(archived), 1)
            self.assertTrue(archived[0]["canceled"])
            fake_queue.put.assert_called_once()
        finally:
            with services.JOB_LOCK:
                services.JOBS.pop(job_id, None)
                for archived_id in [key for key in services.JOBS if key.startswith(f"{job_id}:history:")]:
                    services.JOBS.pop(archived_id, None)

    def test_unfinished_job_is_loaded_as_user_resumable(self):
        previous_jobs = services.JOBS.copy()
        previous_loaded = services.JOB_STORE_LOADED
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                store = Path(temp_dir) / "jobs.json"
                store.write_text(
                    '[{"id":"job-1","stage":"running","message":"Working","done":false,'
                    '"spec":{"type":"cloud_sync","jobId":"job-1"}}]',
                    encoding="utf-8",
                )
                with patch.object(services, "JOB_STORE_FILE", store):
                    services.JOBS.clear()
                    services.JOB_STORE_LOADED = False
                    services.initialize_job_store()
                    status = services.get_job_status("job-1")

                self.assertEqual(status["stage"], "interrupted")
                self.assertTrue(status["done"])
                self.assertTrue(status["resumable"])
                self.assertEqual(services.get_resumable_job_spec("job-1")["type"], "cloud_sync")
        finally:
            services.JOBS.clear()
            services.JOBS.update(previous_jobs)
            services.JOB_STORE_LOADED = previous_loaded


class SessionAssetTests(unittest.TestCase):
    def test_attaches_local_asset_urls_for_cloud_ready_session_metadata(self):
        payload = attach_session_assets({"id": "abc123", "title": "Song", "bpm": 120})

        self.assertEqual(
            payload["assets"],
            {
                "result": "results/abc123.json",
                "audio": "audio/abc123.mp3",
                "video": "video/abc123.mp4",
            },
        )

    def test_existing_asset_urls_override_local_defaults(self):
        payload = attach_session_assets(
            {
                "id": "abc123",
                "assets": {"audio": "https://cdn.example/audio.mp3"},
            }
        )

        self.assertEqual(payload["assets"]["audio"], "https://cdn.example/audio.mp3")
        self.assertEqual(payload["assets"]["video"], "video/abc123.mp4")

    def test_manifest_entry_includes_assets(self):
        entry = build_manifest_entry({"id": "abc123", "title": "Song", "bpm": 120}, entry_date="2026-05-16")

        self.assertEqual(entry["assets"]["result"], "results/abc123.json")
        self.assertEqual(entry["date"], "2026-05-16")

    def test_manifest_entry_includes_library_metadata(self):
        entry = build_manifest_entry(
            {
                "id": "abc123",
                "title": "Song",
                "bpm": 120,
                "tags": ["課題曲"],
                "lastOpenedAt": "2026-08-10T10:00:00+00:00",
            },
            entry_date="2026-08-10",
        )
        self.assertEqual(entry["tags"], ["課題曲"])
        self.assertEqual(entry["lastOpenedAt"], "2026-08-10T10:00:00+00:00")


class R2ConfigTests(unittest.TestCase):
    def test_r2_is_disabled_by_default(self):
        with patch.dict(os.environ, {"PRACTICE_LAB_SKIP_ENV_FILE": "1"}, clear=True):
            self.assertIsNone(get_r2_config())

    def test_builds_endpoint_from_account_id(self):
        with patch.dict(
            os.environ,
            {
                "R2_ENABLED": "1",
                "R2_BUCKET": "practice-lab",
                "CLOUDFLARE_ACCOUNT_ID": "account123",
                "R2_ACCESS_KEY_ID": "key",
                "R2_SECRET_ACCESS_KEY": "secret",
                "R2_PUBLIC_BASE_URL": "https://assets.example.com/",
                "PRACTICE_LAB_SKIP_ENV_FILE": "1",
            },
            clear=True,
        ):
            config = get_r2_config()

        self.assertIsNotNone(config)
        self.assertEqual(config.endpoint_url, "https://account123.r2.cloudflarestorage.com")
        self.assertFalse(config.configure_cors)
        self.assertEqual(
            build_r2_session_assets("abc123", config),
            {
                "result": "https://assets.example.com/sessions/abc123/session.json",
                "audio": "https://assets.example.com/sessions/abc123/audio.mp3",
                "video": "https://assets.example.com/sessions/abc123/video.mp4",
            },
        )

    def test_cors_updates_must_be_explicitly_enabled(self):
        with patch.dict(
            os.environ,
            {
                "R2_ENABLED": "1",
                "R2_BUCKET": "practice-lab",
                "CLOUDFLARE_ACCOUNT_ID": "account123",
                "R2_ACCESS_KEY_ID": "key",
                "R2_SECRET_ACCESS_KEY": "secret",
                "R2_CONFIGURE_CORS": "1",
                "PRACTICE_LAB_SKIP_ENV_FILE": "1",
            },
            clear=True,
        ):
            config = get_r2_config()

        self.assertTrue(config.configure_cors)

    def test_deletes_all_session_asset_keys_in_one_request(self):
        config = R2Config(
            bucket="practice-lab",
            endpoint_url="https://example.invalid",
            access_key_id="key",
            secret_access_key="secret",
            prefix="sessions",
        )
        client = MagicMock()
        client.delete_objects.return_value = {}

        with patch("practice_lab.cloud_storage._client", return_value=client):
            delete_session_assets(["first", "second"], config)

        request = client.delete_objects.call_args.kwargs
        self.assertEqual(request["Bucket"], "practice-lab")
        keys = {item["Key"] for item in request["Delete"]["Objects"]}
        self.assertIn("sessions/first/session.json", keys)
        self.assertIn("sessions/second/stems/drums.mp3", keys)
        self.assertEqual(len(keys), 14)


class LibraryMetadataTests(unittest.TestCase):
    def test_open_updates_last_opened_and_normalizes_tags(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            results_dir = Path(temp_dir)
            result_file = results_dir / "song-1.json"
            result_file.write_text(
                '{"id":"song-1","title":"Song","bpm":120,"total_bars":1,"duration":1,"sections":[]}',
                encoding="utf-8",
            )
            replace = MagicMock()
            with (
                patch.object(services, "DATA_RESULTS_DIR", results_dir),
                patch.object(services, "load_manifest", return_value=[{"id": "song-1", "date": "2026-08-10"}]),
                patch.object(services, "replace_manifest_entry_preserving_order", replace),
                patch.object(services, "export_static_assets"),
            ):
                updated = services.update_library_metadata(
                    "song-1",
                    tags=[" 課題曲 ", "課題曲", "ライブ"],
                    opened=True,
                )

            self.assertEqual(updated["tags"], ["課題曲", "ライブ"])
            self.assertNotIn("practiceCount", updated)
            self.assertTrue(updated["lastOpenedAt"])
            replace.assert_called_once()


class SectionEditingTests(unittest.TestCase):
    def test_saves_contiguous_sections_and_restores_automatic_result(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            results_dir = Path(temp_dir)
            result_file = results_dir / "song-1.json"
            original = [{
                "label": "verse", "start_bar": 1, "end_bar": 4, "bar_count": 4,
                "start_time": 0, "end_time": 4, "start_time_str": "00:00",
            }]
            result_file.write_text(
                json.dumps({
                    "id": "song-1", "title": "Song", "bpm": 120, "total_bars": 4,
                    "duration": 4, "sections": original, "beats": [], "downbeats": [0, 1, 2, 3],
                }),
                encoding="utf-8",
            )
            with (
                patch.object(services, "DATA_RESULTS_DIR", results_dir),
                patch.object(services, "load_manifest", return_value=[{"id": "song-1", "date": "2026-08-10"}]),
                patch.object(services, "replace_manifest_entry_preserving_order"),
                patch.object(services, "export_static_assets"),
            ):
                edited = services.save_sections("song-1", [
                    {"label": "intro", "startBar": 1, "endBar": 2},
                    {"label": "chorus", "startBar": 3, "endBar": 4},
                ])
                restored = services.save_sections("song-1", [], restore_automatic=True)

            self.assertEqual([section["bar_count"] for section in edited["sections"]], [2, 2])
            self.assertEqual(edited["sections"][1]["end_time"], 4)
            self.assertEqual(restored["sections"], original)
            self.assertNotIn("automaticSections", restored)

    def test_rejects_section_gaps(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            results_dir = Path(temp_dir)
            (results_dir / "song-1.json").write_text(
                '{"id":"song-1","title":"Song","bpm":120,"total_bars":4,"duration":4,"sections":[]}',
                encoding="utf-8",
            )
            with patch.object(services, "DATA_RESULTS_DIR", results_dir):
                with self.assertRaises(ValueError):
                    services.save_sections("song-1", [{"label": "verse", "startBar": 2, "endBar": 4}])


class DeleteResultsTests(unittest.TestCase):
    def test_batch_delete_updates_manifest_folders_and_public_results(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            paths = {
                "DATA_RESULTS_DIR": root / "data" / "results",
                "DATA_AUDIO_DIR": root / "data" / "audio",
                "DATA_VIDEO_DIR": root / "data" / "video",
                "DATA_STEMS_DIR": root / "data" / "stems",
                "PUBLIC_RESULTS_DIR": root / "public" / "results",
                "PUBLIC_AUDIO_DIR": root / "public" / "audio",
                "PUBLIC_VIDEO_DIR": root / "public" / "video",
                "PUBLIC_STEMS_DIR": root / "public" / "stems",
            }
            for path in paths.values():
                path.mkdir(parents=True, exist_ok=True)
            manifest = paths["DATA_RESULTS_DIR"] / "manifest.json"
            folders = paths["DATA_RESULTS_DIR"] / "folders.json"
            manifest.write_text(
                '[{"id":"first"},{"id":"keep"},{"id":"second"}]', encoding="utf-8"
            )
            folders.write_text(
                '[{"id":"folder","sessionIds":["first","keep","second"]}]', encoding="utf-8"
            )
            for video_id in ("first", "second"):
                (paths["DATA_RESULTS_DIR"] / f"{video_id}.json").write_text("{}", encoding="utf-8")
                (paths["PUBLIC_RESULTS_DIR"] / f"{video_id}.json").write_text("{}", encoding="utf-8")

            with (
                patch.multiple(services, **paths, MANIFEST_FILE=manifest, FOLDERS_FILE=folders),
                patch.object(services, "cleanup_analysis_workdir"),
                patch.object(services, "export_static_assets"),
                patch.object(services, "get_r2_config", return_value=None),
            ):
                deleted = services.delete_results(["first", "second", "first"])

            self.assertEqual(deleted, ["first", "second"])
            self.assertEqual(services.json.loads(manifest.read_text(encoding="utf-8")), [{"id": "keep"}])
            self.assertEqual(
                services.json.loads(folders.read_text(encoding="utf-8"))[0]["sessionIds"], ["keep"]
            )
            self.assertFalse((paths["PUBLIC_RESULTS_DIR"] / "first.json").exists())
            self.assertFalse((paths["PUBLIC_RESULTS_DIR"] / "second.json").exists())

    def test_rejects_unsafe_session_id(self):
        with self.assertRaisesRegex(ValueError, "セッションID"):
            services.delete_results([".."])


class EnvFileTests(unittest.TestCase):
    def test_loads_env_local_without_overriding_existing_environment(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            env_file = Path(temp_dir) / ".env.local"
            env_file.write_text(
                "\n".join(
                    [
                        "R2_ENABLED=1",
                        "R2_BUCKET=from-file",
                        "R2_ACCESS_KEY_ID='quoted-key'",
                    ]
                ),
                encoding="utf-8",
            )
            with patch("practice_lab.config.ROOT_DIR", Path(temp_dir)):
                with patch.dict(os.environ, {"R2_BUCKET": "from-env"}, clear=True):
                    load_env_files()

                    self.assertEqual(os.environ["R2_ENABLED"], "1")
                    self.assertEqual(os.environ["R2_BUCKET"], "from-env")
                    self.assertEqual(os.environ["R2_ACCESS_KEY_ID"], "quoted-key")


class AnalyzerRuntimeConfigTests(unittest.TestCase):
    def test_defaults_allow_silent_cpu_inference_to_finish(self):
        with patch.dict(os.environ, {}, clear=True):
            config = get_analyzer_runtime_config()

        self.assertEqual(config.timeout_seconds, 1800)
        self.assertIsNone(config.no_output_timeout_seconds)
        self.assertEqual(config.heartbeat_seconds, 30)
        self.assertEqual(config.device, "auto")

    def test_no_output_timeout_can_be_disabled(self):
        with patch.dict(os.environ, {"ANALYZER_NO_OUTPUT_TIMEOUT_SECONDS": "0"}, clear=True):
            config = get_analyzer_runtime_config()

        self.assertIsNone(config.no_output_timeout_seconds)

    def test_analyzer_device_can_be_selected(self):
        with patch.dict(os.environ, {"ANALYZER_DEVICE": "cpu"}, clear=True):
            config = get_analyzer_runtime_config()

        self.assertEqual(config.device, "cpu")


class BpmCorrectionTests(unittest.TestCase):
    def test_double_bpm_keeps_one_based_inclusive_bar_ranges_consistent(self):
        data = {
            "bpm": 100,
            "total_bars": 8,
            "beats": [float(value) for value in range(32)],
            "sections": [
                {"label": "A", "start_bar": 1, "end_bar": 4, "bar_count": 4},
                {"label": "B", "start_bar": 5, "end_bar": 8, "bar_count": 4},
            ],
        }

        adjusted = apply_bpm_factor_to_result(data, 2)

        self.assertEqual(adjusted["total_bars"], 16)
        self.assertEqual(
            [(section["start_bar"], section["end_bar"], section["bar_count"]) for section in adjusted["sections"]],
            [(1, 8, 8), (9, 16, 8)],
        )

    def test_half_bpm_keeps_one_based_inclusive_bar_ranges_consistent(self):
        data = {
            "bpm": 200,
            "total_bars": 16,
            "beats": [float(value) for value in range(64)],
            "sections": [
                {"label": "A", "start_bar": 1, "end_bar": 8, "bar_count": 8},
                {"label": "B", "start_bar": 9, "end_bar": 16, "bar_count": 8},
            ],
        }

        adjusted = apply_bpm_factor_to_result(data, 0.5)

        self.assertEqual(adjusted["total_bars"], 8)
        self.assertEqual(
            [(section["start_bar"], section["end_bar"], section["bar_count"]) for section in adjusted["sections"]],
            [(1, 4, 4), (5, 8, 4)],
        )


class BeatRepairTests(unittest.TestCase):
    def test_repairs_sustained_double_time_beats_and_recomputes_bars(self):
        data = {
            "bpm": 60,
            "total_bars": 7,
            "beats": [0, 1, 2, 3, 4, 5, 6, 7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
            "downbeats": [0, 4, 8, 10, 12],
            "sections": [
                {"label": "A", "start_time": 0, "end_time": 8, "start_bar": 1, "end_bar": 2, "bar_count": 2},
                {"label": "B", "start_time": 8, "end_time": 12, "start_bar": 3, "end_bar": 5, "bar_count": 3},
            ],
        }

        adjusted = repair_double_time_beats(data)

        self.assertEqual(adjusted["beats"], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        self.assertEqual(adjusted["downbeats"], [0, 4, 8, 12])
        self.assertEqual(adjusted["total_bars"], 4)
        self.assertEqual(
            [(section["start_bar"], section["end_bar"], section["bar_count"]) for section in adjusted["sections"]],
            [(1, 2, 2), (3, 4, 2)],
        )

    def test_leaves_stable_beat_grid_unchanged(self):
        data = {
            "bpm": 60,
            "total_bars": 3,
            "beats": [0, 1, 2, 3, 4, 5, 6, 7, 8],
            "downbeats": [0, 4, 8],
            "sections": [],
        }

        self.assertIs(repair_double_time_beats(data), data)


if __name__ == "__main__":
    unittest.main()
