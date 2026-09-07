from pathlib import Path
from unittest.mock import Mock

import pytest

from practice_lab import services


@pytest.fixture
def generation(tmp_path, monkeypatch):
    for name, setting in [("results", "DATA_RESULTS_DIR"), ("audio", "DATA_AUDIO_DIR"),
                          ("published", "PUBLIC_STEMS_DIR"), ("raw", "DATA_STEMS_DIR"), ("work", "DATA_WORK_DIR")]:
        directory = tmp_path / name
        directory.mkdir()
        monkeypatch.setattr(services, setting, directory)
    (tmp_path / "results/song.json").write_text('{"id":"song","title":"Song","bpm":120}')
    (tmp_path / "audio/song.wav").write_bytes(b"audio")
    published = tmp_path / "published/song"
    published.mkdir()
    for stem in services.STEM_NAMES:
        (published / f"{stem}.mp3").write_bytes(f"old-{stem}".encode())
    monkeypatch.setattr(services, "run_stem_splitter", Mock(return_value=tmp_path / "new-wav"))
    monkeypatch.setattr(services, "measure_stem_gain", Mock(return_value=0))
    for name in ["raise_if_job_canceled", "set_job_status", "save_json", "update_manifest", "export_static_assets", "publish_session_to_cloud"]:
        monkeypatch.setattr(services, name, Mock())
    monkeypatch.setattr(services, "convert_stem_wav_to_mp3", lambda source, dest, **kw: dest.write_bytes(f"new-{source.stem}".encode()))
    return published


def assert_previous(published):
    for stem in services.STEM_NAMES:
        assert (published / f"{stem}.mp3").read_bytes() == f"old-{stem}".encode()
    assert sorted(path.name for path in published.parent.iterdir()) == ["song"]


@pytest.mark.parametrize("failure", ["encode", "cancel", "empty", "separation"])
def test_failed_generation_preserves_previous_mix(generation, monkeypatch, failure):
    if failure == "separation":
        monkeypatch.setattr(services, "run_stem_splitter", Mock(side_effect=RuntimeError("separation")))
    else:
        def encode(source, destination, **kwargs):
            if source.stem == "drums":
                if failure == "cancel":
                    raise services.JobCanceledError()
                if failure == "encode":
                    raise RuntimeError("encoding")
                destination.write_bytes(b"")
            else:
                destination.write_bytes(b"new")
        monkeypatch.setattr(services, "convert_stem_wav_to_mp3", encode)
    with pytest.raises((RuntimeError, services.JobCanceledError)):
        services.create_stems("song")
    if failure == "cancel":
        services.cleanup_canceled_stems("song")
    assert_previous(generation)


def test_success_replaces_all_four_stems(generation):
    services.create_stems("song")
    for stem in services.STEM_NAMES:
        assert (generation / f"{stem}.mp3").read_bytes() == f"new-{stem}".encode()
    assert sorted(path.name for path in generation.parent.iterdir()) == ["song"]


def test_failed_directory_swap_rolls_back(generation, monkeypatch):
    rename = Path.rename
    def fail_swap(path, destination):
        if path.name == "new":
            raise OSError("simulated directory replacement failure")
        return rename(path, destination)
    monkeypatch.setattr(Path, "rename", fail_swap)
    with pytest.raises(OSError):
        services.create_stems("song")
    assert_previous(generation)


def test_cancel_after_generation_does_not_delete_playable_stems(generation):
    services.create_stems("song")
    services.cleanup_canceled_stems("song")
    assert all((generation / f"{stem}.mp3").is_file() for stem in services.STEM_NAMES)
