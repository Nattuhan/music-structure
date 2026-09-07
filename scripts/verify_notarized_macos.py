"""Verify the actual distributed app, including its stapled Apple ticket."""

import argparse
import hashlib
import os
import plistlib
import socket
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path


def verify_app(app: Path, version: str, runtime: bool) -> None:
    info = plistlib.loads((app / "Contents/Info.plist").read_bytes())
    if info.get("CFBundleIdentifier") != "jp.nattuhan.practicelab" or info.get("CFBundleShortVersionString") != version:
        raise RuntimeError("Unexpected application identity or version")
    subprocess.run(["codesign", "--verify", "--deep", "--strict", str(app)], check=True)
    signature = subprocess.run(["codesign", "-dvv", str(app)], capture_output=True, text=True, check=True).stderr
    if "Authority=Developer ID Application:" not in signature or "runtime" not in signature:
        raise RuntimeError("A Developer ID signature with Hardened Runtime is required")
    subprocess.run(["xcrun", "stapler", "validate", str(app)], check=True)
    subprocess.run(["spctl", "--assess", "--type", "execute", "--verbose=2", str(app)], check=True)
    if not runtime:
        return
    # Gatekeeper acceptance alone cannot detect missing Electron JIT rights or
    # a broken nested Python runtime. Exercise both without touching user data.
    env = {**os.environ, "ELECTRON_RUN_AS_NODE": "1"}
    subprocess.run([str(app / "Contents/MacOS/PracticeLab"), "-e", "if (!process.versions.node) process.exit(1)"], env=env, check=True, timeout=60)
    with tempfile.TemporaryDirectory(prefix="practicelab-notary-check-") as directory:
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        env.update(PRACTICE_LAB_HOME=directory, PRACTICE_LAB_RESOURCE_DIR=str(app / "Contents/Resources/app"), PRACTICE_LAB_SKIP_ENV_FILE="1", PRACTICE_LAB_PORT=str(port), PRACTICE_LAB_HOST="127.0.0.1")
        env.pop("PRACTICE_LAB_DESKTOP_TOKEN", None)
        with (Path(directory) / "backend.log").open("w+") as log:
            process = subprocess.Popen([str(app / "Contents/Resources/backend/practice-lab-backend")], env=env, stdout=log, stderr=subprocess.STDOUT)
            try:
                for _ in range(90):
                    if process.poll() is not None:
                        log.seek(0)
                        raise RuntimeError(log.read())
                    try:
                        with urllib.request.urlopen(f"http://127.0.0.1:{port}/healthz", timeout=1) as response:
                            if response.status == 200:
                                print("Electron and bundled backend startup verified")
                                return
                    except OSError:
                        time.sleep(0.5)
                raise RuntimeError("Packaged backend startup timed out")
            finally:
                process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("artifact", type=Path)
    parser.add_argument("--version", required=True)
    parser.add_argument("--runtime", action="store_true")
    parser.add_argument("--expected-sha256")
    args = parser.parse_args()
    artifact = args.artifact.resolve()
    if args.expected_sha256:
        with artifact.open("rb") as source:
            digest = hashlib.file_digest(source, "sha256").hexdigest()
        if digest != args.expected_sha256.strip().lower():
            raise RuntimeError("Notarized artifact SHA-256 mismatch")
    if artifact.suffix == ".app":
        verify_app(artifact, args.version, args.runtime)
    elif artifact.suffix == ".zip":
        with tempfile.TemporaryDirectory(prefix="practicelab-update-check-") as directory:
            subprocess.run(["ditto", "-x", "-k", str(artifact), directory], check=True)
            verify_app(Path(directory) / "PracticeLab.app", args.version, args.runtime)
    elif artifact.suffix == ".dmg":
        result = subprocess.run(["hdiutil", "attach", "-readonly", "-nobrowse", "-plist", str(artifact)], capture_output=True, check=True)
        mounts = [entry["mount-point"] for entry in plistlib.loads(result.stdout)["system-entities"] if "mount-point" in entry]
        try:
            if len(mounts) != 1:
                raise RuntimeError("Expected exactly one DMG volume")
            verify_app(Path(mounts[0]) / "PracticeLab.app", args.version, args.runtime)
        finally:
            for mount in mounts:
                subprocess.run(["hdiutil", "detach", mount], check=True)
    else:
        raise ValueError("Expected a .app, .zip or .dmg")


if __name__ == "__main__":
    main()
