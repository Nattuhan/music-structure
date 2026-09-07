import plistlib
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts.verify_notarized_macos import verify_app


class NotarizedMacTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.app = Path(self.directory.name) / "PracticeLab.app"
        (self.app / "Contents").mkdir(parents=True)
        (self.app / "Contents/Info.plist").write_bytes(plistlib.dumps({
            "CFBundleIdentifier": "jp.nattuhan.practicelab",
            "CFBundleShortVersionString": "1.2.2",
        }))

    def test_wrong_version_is_rejected_before_running_code(self):
        with patch("scripts.verify_notarized_macos.subprocess.run") as run:
            with self.assertRaisesRegex(RuntimeError, "version"):
                verify_app(self.app, "1.2.3", False)
            run.assert_not_called()

    def test_ad_hoc_signature_cannot_pass_as_a_public_release(self):
        with patch("scripts.verify_notarized_macos.subprocess.run", return_value=subprocess.CompletedProcess([], 0, stderr="Signature=adhoc\nflags=0x10000(runtime)")):
            with self.assertRaisesRegex(RuntimeError, "Developer ID"):
                verify_app(self.app, "1.2.2", False)

    def test_missing_hardened_runtime_is_rejected(self):
        with patch("scripts.verify_notarized_macos.subprocess.run", return_value=subprocess.CompletedProcess([], 0, stderr="Authority=Developer ID Application: Example")):
            with self.assertRaisesRegex(RuntimeError, "Hardened Runtime"):
                verify_app(self.app, "1.2.2", False)

    def test_apple_ticket_and_gatekeeper_must_both_accept(self):
        for rejected_tool in ("xcrun", "spctl"):
            with self.subTest(rejected_tool=rejected_tool):
                def run(command, **kwargs):
                    if command[0] == rejected_tool:
                        raise subprocess.CalledProcessError(1, command)
                    return subprocess.CompletedProcess(command, 0, stderr="Authority=Developer ID Application: Example\nflags=0x10000(runtime)")
                with patch("scripts.verify_notarized_macos.subprocess.run", side_effect=run):
                    with self.assertRaises(subprocess.CalledProcessError):
                        verify_app(self.app, "1.2.2", False)
