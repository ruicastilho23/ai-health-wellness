# Human-Reviewed Long-Form Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace quota-driven automatic video production with a curated-library-first workflow that requires narrated-animatic approval and scene-level CapCut rough-cut approval.

**Architecture:** Add a read-only curated-library indexer, explicit storyboard and approval schemas, and a stage-aware editorial validator alongside the final technical validator. Rewrite the skill contract so catalog previews, mandatory provider quotas, mandatory Blender, flattened CapCut masters, and inferred human approval can no longer pass production gates.

**Tech Stack:** Python 3.14 standard library, Pillow, ffprobe, CSV/JSON, unittest, Markdown skill contracts, FFmpeg, CapCut Desktop.

---

## File Map

- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/index_curated_library.py`: read-only technical inventory of `D:/AI_Health_Wellness_Images`.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_editorial_workflow.py`: storyboard, approval, and scene-level CapCut gates.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_curated_library.py`: indexer tests.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_editorial_workflow.py`: stage-validator tests.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_human_review_skill_contract.py`: static contract tests.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/storyboard-schema.csv`: scene-level editorial schema.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/curated-library-selections-schema.csv`: copied-asset provenance schema.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/capcut-scene-manifest-schema.csv`: editable-timeline proof schema.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/approval-gates-schema.json`: explicit human decisions.
- Create `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/references/scene-level-capcut-rough-cut-workflow.md`: editable rough-cut procedure.
- Modify `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_package.py`: retain final technical QC but remove obsolete production quotas.
- Modify `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_validate_package.py`: update fixtures and assertions for the new contract.
- Modify `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/SKILL.md`: new phase state machine.
- Modify `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/references/enforced-production-contract.md`: new required package and gates.
- Modify `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/run-enforced-video-prompt.txt`: launcher asks for a reviewable pilot, not automatic completion.
- Modify `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/final-capcut-master-prompt.md`: two-gate CapCut workflow.
- Modify `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_card_kit_skill_contract.py`: change mandatory card-kit assertions to conditional-use assertions.

### Task 1: Add the curated-library indexer

**Files:**
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_curated_library.py`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/index_curated_library.py`

- [ ] **Step 1: Write failing indexer tests**

```python
import csv
import tempfile
import unittest
from pathlib import Path

from scripts.index_curated_library import build_inventory


class CuratedLibraryTests(unittest.TestCase):
    def test_inventory_is_read_only_and_records_supported_media(self):
        with tempfile.TemporaryDirectory() as work:
            root = Path(work) / "library"
            root.mkdir()
            image = root / "plate.jpg"
            motion = root / "clip.mp4"
            image.write_bytes(b"image")
            motion.write_bytes(b"motion")
            before = sorted(path.relative_to(root) for path in root.rglob("*"))
            rows = build_inventory(root, probe_media=False)
            after = sorted(path.relative_to(root) for path in root.rglob("*"))
            self.assertEqual(before, after)
            self.assertEqual({row["extension"] for row in rows}, {".jpg", ".mp4"})
            self.assertTrue(all(row["rights_status"] == "needs_rights_check" for row in rows))
            self.assertTrue(all(len(row["sha256"]) == 64 for row in rows))

    def test_inventory_ignores_unsupported_files(self):
        with tempfile.TemporaryDirectory() as work:
            root = Path(work)
            (root / "notes.txt").write_text("notes", encoding="utf-8")
            (root / "plate.png").write_bytes(b"png")
            rows = build_inventory(root, probe_media=False)
            self.assertEqual([row["extension"] for row in rows], [".png"])
```

- [ ] **Step 2: Run the tests and verify the import fails**

Run:

```powershell
Set-Location 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video'
python -m unittest tests.test_curated_library -v
```

Expected: `ModuleNotFoundError: No module named 'scripts.index_curated_library'`.

- [ ] **Step 3: Implement the minimal read-only inventory API**

```python
#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import subprocess
from pathlib import Path

SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".m4v"}
FIELDS = (
    "asset_id", "source_path", "folder", "extension", "bytes", "width", "height",
    "duration_seconds", "sha256", "rights_status", "source_or_license",
    "creative_tags", "review_status", "notes",
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def probe(path: Path) -> dict[str, str]:
    command = [
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration:stream=width,height", "-of", "json", str(path),
    ]
    payload = json.loads(subprocess.check_output(command, text=True))
    stream = next((item for item in payload.get("streams", []) if item.get("width")), {})
    return {
        "width": str(stream.get("width", "")),
        "height": str(stream.get("height", "")),
        "duration_seconds": str(payload.get("format", {}).get("duration", "")),
    }


def build_inventory(root: Path, probe_media: bool = True) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for index, path in enumerate(sorted(root.rglob("*")), start=1):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED:
            continue
        media = probe(path) if probe_media else {"width": "", "height": "", "duration_seconds": ""}
        rows.append({
            "asset_id": f"LIB-{index:04d}",
            "source_path": path.as_posix(),
            "folder": path.parent.relative_to(root).as_posix(),
            "extension": path.suffix.lower(),
            "bytes": str(path.stat().st_size),
            "width": media["width"],
            "height": media["height"],
            "duration_seconds": media["duration_seconds"],
            "sha256": sha256(path),
            "rights_status": "needs_rights_check",
            "source_or_license": "",
            "creative_tags": "",
            "review_status": "unreviewed",
            "notes": "",
        })
    return rows
```

Add this CLI, which refuses to place its output inside the read-only source library:

```python
def main() -> int:
    parser = argparse.ArgumentParser(description="Index the curated AI Health media library")
    parser.add_argument("library_root", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    library_root = args.library_root.resolve()
    output = args.output.resolve()
    if not library_root.is_dir():
        parser.error(f"Library root is unavailable: {library_root}")
    if output == library_root or library_root in output.parents:
        parser.error("Output must be outside the read-only curated library")
    rows = build_inventory(library_root)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"assets={len(rows)}")
    print(f"output={output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Run the tests and a real inventory scan**

Run:

```powershell
python -m unittest tests.test_curated_library -v
python scripts/index_curated_library.py 'D:/AI_Health_Wellness_Images' --output 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/library-assets.csv'
```

Expected: two tests pass; the CLI reports `assets=139`; no file under `D:/AI_Health_Wellness_Images` changes.

- [ ] **Step 5: Commit the indexer**

```powershell
git add scripts/index_curated_library.py tests/test_curated_library.py
git commit -m "feat: index curated video library read-only"
```

### Task 2: Add storyboard, provenance, approval, and CapCut schemas

**Files:**
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/storyboard-schema.csv`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/curated-library-selections-schema.csv`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/capcut-scene-manifest-schema.csv`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/approval-gates-schema.json`

- [ ] **Step 1: Create the storyboard schema**

```csv
scene_id,start_seconds,end_seconds,narration_phrase,viewer_takeaway,visual_action,reference_path,reference_provenance,reference_role,asset_type,camera_framing,movement,on_screen_text,relevance_reason,claim_ids,risk_flags,review_status
```

- [ ] **Step 2: Create the curated-library selection schema**

```csv
scene_id,source_path,copied_path,asset_role,rights_status,source_or_license,modifications,sha256,review_status,notes
```

- [ ] **Step 3: Create the CapCut scene-manifest schema**

```csv
scene_id,timeline_order,start_seconds,end_seconds,video_clip_path,narration_clip_path,graphic_paths,text_overlay_paths,replaceable,capcut_track,review_status,notes
```

- [ ] **Step 4: Create the approval-gates schema**

```json
{
  "animatic": {
    "status": "pending",
    "approved_at": null,
    "approved_by": null,
    "artifact": "renders/animatic-review.mp4",
    "notes": []
  },
  "rough_cut": {
    "status": "pending",
    "approved_at": null,
    "approved_by": null,
    "artifact": "renders/capcut-rough-cut-review.mp4",
    "notes": []
  },
  "picture_lock": {
    "status": "pending",
    "approved_at": null,
    "approved_by": null,
    "artifact": "capcut-scene-manifest.csv",
    "notes": []
  }
}
```

- [ ] **Step 5: Verify the schemas parse**

Run:

```powershell
python -c "import csv,json,pathlib; r=pathlib.Path('templates'); [list(csv.DictReader((r/n).open(encoding='utf-8-sig'))) for n in ['storyboard-schema.csv','curated-library-selections-schema.csv','capcut-scene-manifest-schema.csv']]; json.loads((r/'approval-gates-schema.json').read_text(encoding='utf-8')); print('schemas=passed')"
```

Expected: `schemas=passed`.

- [ ] **Step 6: Commit the schemas**

```powershell
git add templates/storyboard-schema.csv templates/curated-library-selections-schema.csv templates/capcut-scene-manifest-schema.csv templates/approval-gates-schema.json
git commit -m "feat: add editorial review schemas"
```

### Task 3: Add the stage-aware editorial validator

**Files:**
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_editorial_workflow.py`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_editorial_workflow.py`

- [ ] **Step 1: Write failing validator tests**

Create a complete fixture with 40 storyboard rows and helpers for approvals and CapCut manifests:

```python
import csv
import json
import tempfile
import unittest
from pathlib import Path

from scripts.validate_editorial_workflow import validate_editorial_project


STORYBOARD_FIELDS = [
    "scene_id", "start_seconds", "end_seconds", "narration_phrase", "viewer_takeaway",
    "visual_action", "reference_path", "reference_provenance", "reference_role",
    "asset_type", "camera_framing", "movement", "on_screen_text", "relevance_reason",
    "claim_ids", "risk_flags", "review_status",
]
CAPCUT_FIELDS = [
    "scene_id", "timeline_order", "start_seconds", "end_seconds", "video_clip_path",
    "narration_clip_path", "graphic_paths", "text_overlay_paths", "replaceable",
    "capcut_track", "review_status", "notes",
]


class EditorialWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "renders").mkdir()
        rows = []
        for index in range(40):
            rows.append({
                "scene_id": f"S{index + 1:02d}",
                "start_seconds": str(index * 10),
                "end_seconds": str((index + 1) * 10),
                "narration_phrase": f"Narration {index + 1}",
                "viewer_takeaway": f"Takeaway {index + 1}",
                "visual_action": f"Visual action {index + 1}",
                "reference_path": f"assets/references/ref_{index + 1:02d}.jpg",
                "reference_provenance": "D:/AI_Health_Wellness_Images/Plates/reference.jpg",
                "reference_role": "reference_only",
                "asset_type": "image",
                "camera_framing": "medium",
                "movement": "slow push",
                "on_screen_text": "",
                "relevance_reason": f"Explains narration {index + 1}",
                "claim_ids": "C01",
                "risk_flags": "none",
                "review_status": "internally_reviewed",
            })
        self.write_csv(self.root / "storyboard.csv", STORYBOARD_FIELDS, rows)
        (self.root / "approval-gates.json").write_text(json.dumps({
            "animatic": {"status": "pending", "approved_at": None, "approved_by": None},
            "rough_cut": {"status": "pending", "approved_at": None, "approved_by": None},
            "picture_lock": {"status": "pending", "approved_at": None, "approved_by": None},
        }), encoding="utf-8")

    @staticmethod
    def write_csv(path, fields, rows):
        with path.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerows(rows)

    def approve(self, gate):
        path = self.root / "approval-gates.json"
        payload = json.loads(path.read_text(encoding="utf-8"))
        payload[gate].update({"status": "approved", "approved_at": "2026-07-16T12:00:00+07:00", "approved_by": "user"})
        path.write_text(json.dumps(payload), encoding="utf-8")

    def codes(self, stage):
        return {item["code"] for item in validate_editorial_project(self.root, stage)["errors"]}

    def write_manifest(self, count=40, replaceable="true", same_clip=False):
        rows = []
        for index in range(count):
            clip = "renders/flattened.mp4" if same_clip else f"renders/scenes/S{index + 1:02d}.mp4"
            rows.append({
                "scene_id": f"S{index + 1:02d}", "timeline_order": str(index + 1),
                "start_seconds": str(index * 10), "end_seconds": str((index + 1) * 10),
                "video_clip_path": clip, "narration_clip_path": "audio/narration-working.wav",
                "graphic_paths": "", "text_overlay_paths": "", "replaceable": replaceable,
                "capcut_track": "V1", "review_status": "reviewed", "notes": "",
            })
        self.write_csv(self.root / "capcut-scene-manifest.csv", CAPCUT_FIELDS, rows)

    def test_storyboard_rejects_catalog_preview_media(self):
        rows = list(csv.DictReader((self.root / "storyboard.csv").open(encoding="utf-8-sig")))
        rows[0]["reference_path"] = "renders/catalog-previews/light-leak.mp4"
        self.write_csv(self.root / "storyboard.csv", STORYBOARD_FIELDS, rows)
        self.assertIn("catalog_preview_in_storyboard", self.codes("storyboard"))

    def test_animatic_requires_explicit_user_approval(self):
        (self.root / "renders" / "animatic-review.mp4").write_bytes(b"animatic")
        self.assertIn("animatic_not_approved", self.codes("animatic"))

    def test_rough_cut_rejects_one_flattened_clip(self):
        (self.root / "renders" / "animatic-review.mp4").write_bytes(b"animatic")
        self.approve("animatic")
        self.write_manifest(count=40, replaceable="false", same_clip=True)
        self.assertIn("flattened_capcut_timeline", self.codes("rough-cut"))

    def test_final_requires_picture_lock(self):
        (self.root / "renders" / "animatic-review.mp4").write_bytes(b"animatic")
        (self.root / "renders" / "final_capcut_export.mp4").write_bytes(b"final")
        self.approve("animatic")
        self.approve("rough_cut")
        self.write_manifest()
        self.assertIn("picture_lock_missing", self.codes("final"))
```

- [ ] **Step 2: Run tests and confirm the module is missing**

Run:

```powershell
python -m unittest tests.test_editorial_workflow -v
```

Expected: import failure for `scripts.validate_editorial_workflow`.

- [ ] **Step 3: Implement stage validation**

Implement these exact validation boundaries:

```python
#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

STAGES = ("storyboard", "animatic", "rough-cut", "final")
REFERENCE_ROLES = {"direct_use", "adaptable", "reference_only", "user_replacement_candidate"}
REQUIRED_STORYBOARD_FIELDS = (
    "scene_id", "start_seconds", "end_seconds", "narration_phrase", "viewer_takeaway",
    "visual_action", "reference_path", "reference_provenance", "reference_role",
    "asset_type", "camera_framing", "movement", "relevance_reason", "claim_ids",
    "risk_flags", "review_status",
)


def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.is_file():
        return []
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def error(errors: list[dict], code: str, message: str, **details) -> None:
    errors.append({"code": code, "message": message, **details})


def require_file(path: Path, code: str, errors: list[dict]) -> None:
    if not path.is_file() or path.stat().st_size == 0:
        error(errors, code, f"Missing non-empty artifact: {path}")


def load_approvals(root: Path, errors: list[dict]) -> dict:
    path = root / "approval-gates.json"
    if not path.is_file():
        error(errors, "missing_approval_gates", "Missing approval-gates.json")
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        error(errors, "invalid_approval_gates", "approval-gates.json is invalid", detail=str(exc))
        return {}


def require_approval(approvals: dict, gate: str, code: str, errors: list[dict]) -> None:
    record = approvals.get(gate, {})
    if record.get("status") != "approved" or not record.get("approved_at") or not record.get("approved_by"):
        error(errors, code, f"Explicit user approval is required for {gate}")


def validate_storyboard(rows: list[dict[str, str]], errors: list[dict]) -> None:
    if not 40 <= len(rows) <= 50:
        error(errors, "storyboard_scene_count", "Storyboard must contain 40–50 scenes", actual=len(rows))
    scene_ids = [(row.get("scene_id") or "").strip() for row in rows]
    if len(scene_ids) != len(set(scene_ids)):
        error(errors, "duplicate_storyboard_scene", "Storyboard scene IDs must be unique")
    previous_end = 0.0
    for index, row in enumerate(rows, start=2):
        missing = [field for field in REQUIRED_STORYBOARD_FIELDS if not (row.get(field) or "").strip()]
        if missing:
            error(errors, "incomplete_storyboard_scene", "Storyboard scene is incomplete", row=index, fields=missing)
        try:
            start = float(row.get("start_seconds") or -1)
            end = float(row.get("end_seconds") or -1)
        except ValueError:
            start, end = -1, -1
        if start < previous_end or end <= start:
            error(errors, "invalid_storyboard_timing", "Storyboard timing must be ordered and positive", row=index)
        previous_end = max(previous_end, end)
        role = (row.get("reference_role") or "").strip().lower()
        if role not in REFERENCE_ROLES:
            error(errors, "invalid_reference_role", "Storyboard reference role is invalid", row=index, role=role)
        normalized = (row.get("reference_path") or "").replace("\\", "/").lower()
        if "/catalog-previews/" in f"/{normalized.lstrip('/')}":
            error(errors, "catalog_preview_in_storyboard", "Catalog previews are test artifacts", row=index, path=normalized)


def validate_capcut_manifest(root: Path, storyboard_rows: list[dict[str, str]], errors: list[dict]) -> None:
    rows = read_csv(root / "capcut-scene-manifest.csv")
    expected = {(row.get("scene_id") or "").strip() for row in storyboard_rows}
    actual = {(row.get("scene_id") or "").strip() for row in rows}
    if actual != expected:
        error(errors, "capcut_scene_mismatch", "CapCut manifest must map every storyboard scene", expected=sorted(expected), actual=sorted(actual))
    orders = [(row.get("timeline_order") or "").strip() for row in rows]
    if len(orders) != len(set(orders)):
        error(errors, "duplicate_timeline_order", "CapCut timeline order must be unique")
    clip_paths = {(row.get("video_clip_path") or "").strip() for row in rows if (row.get("video_clip_path") or "").strip()}
    replaceable = sum((row.get("replaceable") or "").strip().lower() == "true" for row in rows)
    ratio = replaceable / len(rows) if rows else 0.0
    if len(rows) <= 1 or len(clip_paths) <= 1 or ratio < 0.90:
        error(errors, "flattened_capcut_timeline", "CapCut rough cut must contain separate replaceable scene media", rows=len(rows), distinct_clips=len(clip_paths), replaceable_ratio=ratio)


def validate_editorial_project(root: Path | str, stage: str) -> dict:
    if stage not in STAGES:
        raise ValueError(f"Unknown stage: {stage}")
    root = Path(root)
    errors: list[dict] = []
    rows = read_csv(root / "storyboard.csv")
    if not rows:
        error(errors, "missing_storyboard", "Missing or empty storyboard.csv")
    validate_storyboard(rows, errors)
    approvals = load_approvals(root, errors)
    if stage in {"animatic", "rough-cut", "final"}:
        require_file(root / "renders" / "animatic-review.mp4", "missing_animatic", errors)
        require_approval(approvals, "animatic", "animatic_not_approved", errors)
    if stage in {"rough-cut", "final"}:
        validate_capcut_manifest(root, rows, errors)
    if stage == "final":
        require_approval(approvals, "rough_cut", "rough_cut_not_approved", errors)
        require_approval(approvals, "picture_lock", "picture_lock_missing", errors)
        require_file(root / "renders" / "final_capcut_export.mp4", "missing_final_export", errors)
    return {"passed": not errors, "stage": stage, "errors": errors, "root": str(root)}


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the human-reviewed editorial workflow")
    parser.add_argument("project", type=Path)
    parser.add_argument("--stage", choices=STAGES, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = validate_editorial_project(args.project, args.stage)
    payload = json.dumps(report, indent=2, ensure_ascii=False)
    if args.output:
        args.output.write_text(payload, encoding="utf-8")
    print(payload)
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Run the validator tests**

Run:

```powershell
python -m unittest tests.test_editorial_workflow -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit the editorial validator**

```powershell
git add scripts/validate_editorial_workflow.py tests/test_editorial_workflow.py
git commit -m "feat: enforce human editorial approval gates"
```

### Task 4: Refactor final technical validation around the approved workflow

**Files:**
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_package.py`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_validate_package.py`

- [ ] **Step 1: Replace quota-oriented tests with contract-oriented failures**

Remove tests that require twenty generated images, eight Imagen images, six GPT Image assets, or a mandatory card kit. Add:

```python
def test_structural_mode_does_not_require_final_export(self):
    temp, root = self.make_project()
    self.addCleanup(temp.cleanup)
    (root / "renders" / "final_capcut_export.mp4").unlink()
    report = validate_project(root, structural_only=True)
    self.assertNotIn("missing_final_capcut_export", {e["code"] for e in report["errors"]})

def test_rejects_catalog_preview_as_timeline_asset(self):
    temp, root = self.make_project()
    self.addCleanup(temp.cleanup)
    score = root / "visual-score.csv"
    score.write_text(score.read_text(encoding="utf-8").replace(
        "assets/generated/plate_01.png", "renders/catalog-previews/light-leak.mp4", 1
    ), encoding="utf-8")
    codes = {e["code"] for e in validate_project(root, structural_only=True)["errors"]}
    self.assertIn("catalog_preview_timeline_asset", codes)
```

- [ ] **Step 2: Run the targeted tests and confirm failures**

Run:

```powershell
python -m unittest tests.test_validate_package.ValidatePackageTests.test_structural_mode_does_not_require_final_export tests.test_validate_package.ValidatePackageTests.test_rejects_catalog_preview_as_timeline_asset -v
```

Expected: both tests fail against the old validator.

- [ ] **Step 3: Modify `validate_project`**

Implement these changes:

```python
if not structural_only:
    if not final_export.exists() or final_export.stat().st_size == 0:
        _error(errors, "missing_final_capcut_export", "Missing non-empty renders/final_capcut_export.mp4")
    if not (root / "final-qc-report.txt").exists() and not (root / "final-qc-report.json").exists():
        _error(errors, "missing_final_qc", "Missing final QC report")

preview_assets = [
    row.get("asset_filename", "") for row in score_rows
    if "catalog-previews" in row.get("asset_filename", "").replace("\\", "/").lower()
]
if preview_assets:
    _error(errors, "catalog_preview_timeline_asset", "Catalog previews are test artifacts, not timeline media", assets=preview_assets)
```

Make `image-provider-log.csv`, `visual-diversity-ledger.csv`, and card-kit evidence conditional: validate them when referenced by the visual score, but do not require arbitrary counts or providers. Preserve narrator identity, caption prohibition, HyperFrames runtime scanning, motion proof, ffprobe, and final CapCut export checks.

- [ ] **Step 4: Run the package-validator suite**

Run:

```powershell
python -m unittest tests.test_validate_package -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit the validator refactor**

```powershell
git add scripts/validate_package.py tests/test_validate_package.py
git commit -m "refactor: validate editorial evidence over asset quotas"
```

### Task 5: Rewrite the skill state machine and production contract

**Files:**
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/SKILL.md`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/references/enforced-production-contract.md`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_card_kit_skill_contract.py`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_human_review_skill_contract.py`

- [ ] **Step 1: Write failing static contract tests**

```python
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class HumanReviewSkillContractTests(unittest.TestCase):
    def test_contract_requires_library_first_and_two_human_gates(self):
        text = "\n".join((ROOT / name).read_text(encoding="utf-8") for name in (
            "SKILL.md", "references/enforced-production-contract.md",
            "templates/run-enforced-video-prompt.txt",
        )).lower()
        for phrase in (
            "d:/ai_health_wellness_images", "narrated animatic", "explicit user approval",
            "scene-level capcut", "picture lock", "catalog previews are test artifacts",
        ):
            self.assertIn(phrase, text)

    def test_contract_does_not_require_generation_or_blender_quotas(self):
        text = (ROOT / "SKILL.md").read_text(encoding="utf-8").lower()
        self.assertNotIn("at least eight imagen", text)
        self.assertNotIn("at least six gpt image", text)
        self.assertNotIn("create one or two 8", text)
```

- [ ] **Step 2: Run the contract tests and verify they fail**

Run:

```powershell
python -m unittest tests.test_human_review_skill_contract -v
```

Expected: failures for missing library-first and approval language.

- [ ] **Step 3: Rewrite the phase state machine**

Replace the existing phases with:

1. Research and claim lock.
2. Script and working narration lock.
3. Curated-library-first storyboard.
4. Narrated animatic and explicit user approval.
5. Approved asset production in small batches.
6. Scene-level CapCut rough cut and explicit user approval.
7. Picture lock, finish, final CapCut export, and technical QC.

State explicitly:

- `D:/AI_Health_Wellness_Images` is searched first and never modified.
- Generated-image counts and providers are determined by storyboard need.
- Blender and HyperFrames are optional explanatory tools.
- Catalog previews and template demos can never be used as timeline media.
- The agent stops after producing each review artifact until the user approves it.
- Human approval is recorded in `approval-gates.json`.

- [ ] **Step 4: Convert card-kit rules from mandatory to conditional**

Update `test_card_kit_skill_contract.py` so it asserts: if a card-form scene is selected, its source and render must be project-local, scene-specific, and preview-tested; it must not assert that every project has a card-kit scene.

- [ ] **Step 5: Run static contract tests**

Run:

```powershell
python -m unittest tests.test_human_review_skill_contract tests.test_card_kit_skill_contract -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit the skill contract**

```powershell
git add SKILL.md references/enforced-production-contract.md tests/test_human_review_skill_contract.py tests/test_card_kit_skill_contract.py
git commit -m "feat: require human-reviewed longform production"
```

### Task 6: Add the scene-level CapCut workflow and update launcher prompts

**Files:**
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/references/scene-level-capcut-rough-cut-workflow.md`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/run-enforced-video-prompt.txt`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/final-capcut-master-prompt.md`

- [ ] **Step 1: Write the CapCut procedure**

The reference must require:

- Import `audio/narration-working.wav` as a separate locked narration track.
- Import each approved scene as `S##_descriptive-name.mp4` or a replaceable still.
- Place each scene separately in timeline order.
- Keep graphics and editorial text on separate tracks.
- Record every timeline item in `capcut-scene-manifest.csv`.
- Export `renders/capcut-rough-cut-review.mp4` for Approval Gate 2.
- Do not flatten the project until after picture lock.
- Export `renders/final_capcut_export.mp4` only after `picture_lock.status=approved`.

- [ ] **Step 2: Rewrite the reusable launcher**

The launcher must request research, script, working narration, storyboard, and narrated animatic, then explicitly stop for user approval. It must not ask for an automatic finished video in the same uninterrupted run.

- [ ] **Step 3: Rewrite the CapCut master prompt**

Require a scene-level rough cut, separate narration, replaceable scene media, manifest evidence, and a review export. Remove “FFmpeg assembly followed by real CapCut finishing” as the default architecture.

- [ ] **Step 4: Run the contract tests**

Run:

```powershell
python -m unittest tests.test_human_review_skill_contract -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit the workflow references and prompts**

```powershell
git add references/scene-level-capcut-rough-cut-workflow.md templates/run-enforced-video-prompt.txt templates/final-capcut-master-prompt.md
git commit -m "docs: add scene-level CapCut review workflow"
```

### Task 7: Run the full skill verification suite

**Files:**
- Modify only if a failing test reveals a contract inconsistency.

- [ ] **Step 1: Run all skill tests**

Run:

```powershell
Set-Location 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video'
python -m unittest discover -s tests -v
```

Expected: all tests pass with zero errors and zero failures.

- [ ] **Step 2: Run placeholder and obsolete-rule scans**

Run:

```powershell
rg -n "at least eight Imagen|at least six GPT Image|one or two 8|renders/catalog-previews/.*timeline|flattened pre-finish" SKILL.md references templates scripts
```

Expected: no active requirement matches; historical session references may be excluded from this scan.

- [ ] **Step 3: Run the real curated-library indexer**

Run:

```powershell
python scripts/index_curated_library.py 'D:/AI_Health_Wellness_Images' --output 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/library-assets.csv'
```

Expected: `assets=139`, and the output is outside the curated source folder.

- [ ] **Step 4: Record verification evidence**

Create `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/workflow-verification.txt` containing the test command, timestamp, pass count, source-library file count, and confirmation that the source folder was not modified.

- [ ] **Step 5: Commit any final consistency repair**

```powershell
git status --short
git add SKILL.md scripts/index_curated_library.py scripts/validate_editorial_workflow.py scripts/validate_package.py tests templates references/enforced-production-contract.md references/scene-level-capcut-rough-cut-workflow.md
git commit -m "test: verify human-reviewed video workflow"
```

Skip the commit when the verification run produces no changes.
