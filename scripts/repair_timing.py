"""Repair one local session from reviewed anchors; never upload assets."""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from practice_lab.timing_corrections import apply_timing_correction


def repair(root: Path, recipe: Path) -> dict:
    correction = json.loads(recipe.read_text())
    session_id = correction["sessionId"]
    if Path(session_id).name != session_id or session_id in {".", ".."}:
        raise ValueError("Invalid session id")
    result = root / "data" / "results" / f"{session_id}.json"
    data = json.loads(result.read_text())
    if data.get("id") != session_id:
        raise ValueError("Correction does not match this session")
    adjusted = apply_timing_correction(data, correction)
    # Preserve the original before either local copy is replaced, including repeat runs.
    backup = result.with_suffix(".json.before-timing-repair")
    if not backup.exists():
        backup.write_bytes(result.read_bytes())
    rendered = json.dumps(adjusted, ensure_ascii=False, indent=2)
    for target in (result, root / "public" / "results" / result.name):
        target.parent.mkdir(parents=True, exist_ok=True)
        temporary = target.with_suffix(".json.tmp")
        temporary.write_text(rendered)
        temporary.replace(target)
    # Manifest contains the bar count shown in the library; keep local copies aligned.
    for manifest in (root / "data/results/manifest.json", root / "public/results/manifest.json"):
        if manifest.exists():
            entries = json.loads(manifest.read_text())
            for entry in entries:
                if entry.get("id") == session_id:
                    entry["total_bars"] = adjusted["total_bars"]
            temporary = manifest.with_suffix(".json.tmp")
            temporary.write_text(json.dumps(entries, ensure_ascii=False, indent=2))
            temporary.replace(manifest)
    return {"session": session_id, "beatsBefore": len(data["beats"]),
            "beatsAfter": len(adjusted["beats"]), "backup": str(backup)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--recipe", type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(repair(args.root, args.recipe), ensure_ascii=False))
