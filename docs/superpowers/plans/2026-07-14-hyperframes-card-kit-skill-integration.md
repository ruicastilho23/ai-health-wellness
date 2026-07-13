# HyperFrames Card Kit Skill Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the local HyperFrames motion-card kit mandatory for every information, evidence, comparison, source, statistic, and presenter-adjacent card in both AI Health long-form video skills, then deploy identical validated copies to Hermes.

**Architecture:** Each skill receives a self-contained card-kit contract, launcher instructions, workflow gates, and deterministic validator checks. Every production project copies the source kit into `hyperframes/card-kit/`, declares card rows in `visual-score.csv`, records provenance in `card-kit-usage.json`, and supplies strict check evidence in `card-kit-check.log`; official catalog items remain responsible for charts, maps, transitions, parallax, captions, and outros.

**Tech Stack:** Markdown skill contracts, Python 3 `unittest`, JSON/CSV manifests, HyperFrames CLI, SHA-256 file comparison, PowerShell deployment.

**Execution decision:** Inline execution selected. **Status:** Completed on 2026-07-14 after the user explicitly resumed implementation. Both Codex skills and both Hermes copies contain the mandatory motion-card contract; the avatar skill also enforces native full-frame panoramic 16:9 framing for all four Dr. Ava Chen appearances.

**Verification result:** Codex and Hermes each passed 16 no-avatar tests and 13 avatar tests. All four skill folders passed `quick_validate.py`. Recursive SHA-256 comparison, excluding transient Python cache files, found zero missing, extra, or mismatched files between each Codex source and its Hermes copy.

---

## File Map

### No-avatar skill

- Create `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\references\hyperframes-card-kit-contract.md`: standalone routing, style, manifest, and failure contract.
- Create `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\tests\test_card_kit_skill_contract.py`: static contract test proving the skill and launcher require the kit.
- Modify `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\SKILL.md`: mandatory reading, preflight, score, production, verification, stop, and delivery rules.
- Modify `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\references\enforced-production-contract.md`: visual-score schema and package evidence.
- Modify `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\templates\run-enforced-video-prompt.txt`: reusable user prompt requirement.
- Modify `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\scripts\validate_package.py`: fail-closed card-kit validation.
- Modify `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\tests\test_validate_package.py`: valid fixture and card-kit failure tests.

### Avatar skill

- Create `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\references\hyperframes-card-kit-contract.md`: standalone copy of the same contract with presenter-adjacent routing.
- Create `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\tests\test_card_kit_skill_contract.py`: static contract test.
- Modify `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\SKILL.md`: mandatory kit gates including both middle presenter side panels.
- Modify `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\references\enforced-avatar-production-contract.md`: avatar-project evidence and presenter card rule.
- Modify `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\templates\run-avatar-video-prompt.txt`: reusable user prompt requirement.
- Modify `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\scripts\validate_avatar_package.py`: require card-kit copy, manifest, logs, and presenter-adjacent evidence.
- Modify `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\tests\test_validate_avatar_package.py`: valid fixture and failure tests.

### Hermes deployment

- Create or replace `C:\Users\Lenovo_CT\.hermes\skills\ai-health-longform-multitool-video` from the validated Codex skill.
- Create or replace `C:\Users\Lenovo_CT\.hermes\skills\ai-health-avatar-longform-video` from the validated Codex skill.

---

### Task 1: Baseline the no-avatar skill

**Files:**
- Read: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\SKILL.md`
- Create: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\tests\test_card_kit_skill_contract.py`

- [ ] **Step 1: Run an unprimed application scenario against the current skill**

Ask a fresh worker to use the current skill to plan three scenes: one source card, one statistic card, and one evidence-comparison card. Provide the skill and source package paths, but do not reveal the desired routing. Record whether it independently requires `motion-cards`, a project-local kit copy, and `card-kit-usage.json`.

- [ ] **Step 2: Write the failing static contract test**

```python
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class CardKitSkillContractTests(unittest.TestCase):
    def test_skill_and_launcher_require_the_motion_card_kit(self):
        combined = "\n".join(
            (ROOT / relative).read_text(encoding="utf-8")
            for relative in (
                "SKILL.md",
                "references/enforced-production-contract.md",
                "references/hyperframes-card-kit-contract.md",
                "templates/run-enforced-video-prompt.txt",
            )
        )
        for required in (
            "ai-health-youtube-graphics-kit\\motion-cards",
            "hyperframes/card-kit",
            "card-kit-usage.json",
            "card-kit-check.log",
            "information",
            "evidence",
            "comparison",
            "source",
            "statistic",
        ):
            self.assertIn(required, combined)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 3: Run the test and verify RED**

Run:

```powershell
python -m unittest tests.test_card_kit_skill_contract -v
```

Expected: FAIL because `references/hyperframes-card-kit-contract.md` does not exist and the current skill does not mandate the package.

---

### Task 2: Implement the no-avatar card-kit contract

**Files:**
- Create: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\references\hyperframes-card-kit-contract.md`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\SKILL.md`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\references\enforced-production-contract.md`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\templates\run-enforced-video-prompt.txt`

- [ ] **Step 1: Write the standalone routing contract**

Specify the exact source path, required project copy `hyperframes/card-kit/`, mandatory `code-diff`, `code-morph`, and package-token rules, the six allowed categories, official-catalog boundary, required manifest/log schemas, and fail-closed behavior. Require this manifest shape:

```json
{
  "source_package": "D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/ai-health-youtube-graphics-kit/motion-cards",
  "project_copy": "hyperframes/card-kit",
  "package_check_passed": true,
  "cards": [
    {
      "scene_id": "S08",
      "category": "evidence",
      "composition": "code-diff",
      "source_file": "hyperframes/card-kit/compositions/code-diff.html",
      "rendered_file": "renders/card-kit/S08.mp4",
      "preview_passed": true
    }
  ]
}
```

Require `card-kit-check.log` to contain `strict=true`, `lint=passed`, `validate=passed`, `inspect=passed`, and `render=passed`.

- [ ] **Step 2: Route all card categories in the skill**

Add the new reference to Mandatory Reading. In preflight, verify and copy the kit. In the visual score, require `card_category` and `card_kit_composition` columns. In style proof and production, require package-derived cards. In final verification and stop conditions, require manifest/log evidence and reject generic cards.

- [ ] **Step 3: Update the production contract and launcher**

Extend the CSV header to:

```text
scene,time_range,duration,narration_phrase,visual_purpose,asset_type,primary_tool,catalog_name,card_category,card_kit_composition,on_screen_text,motion_verb,transition,claim_id,asset_filename,prompt_or_source
```

State that official `data-chart` remains the chart route, while card-form statistics use the mandatory kit.

- [ ] **Step 4: Run the static contract test and verify GREEN**

Run:

```powershell
python -m unittest tests.test_card_kit_skill_contract -v
```

Expected: PASS.

---

### Task 3: Enforce the no-avatar card evidence in code

**Files:**
- Modify: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\scripts\validate_package.py`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video\tests\test_validate_package.py`

- [ ] **Step 1: Extend the passing fixture**

Create `hyperframes/card-kit/` with `DESIGN.md`, `compositions/code-diff.html`, `compositions/code-morph.html`, and `compositions/components/caption-pill-karaoke.html`. Add `card_category` and `card_kit_composition` fields to the score, make one row an evidence `code-diff` card, create its rendered file, write `card-kit-usage.json`, and write the five required `card-kit-check.log` markers.

- [ ] **Step 2: Add failing validator tests**

```python
def test_rejects_missing_project_card_kit_copy(self):
    temp, root = self.make_project()
    self.addCleanup(temp.cleanup)
    shutil.rmtree(root / "hyperframes" / "card-kit")
    codes = {e["code"] for e in validate_project(root, structural_only=True)["errors"]}
    self.assertIn("missing_card_kit_copy", codes)

def test_rejects_unapproved_card_composition(self):
    temp, root = self.make_project()
    self.addCleanup(temp.cleanup)
    path = root / "card-kit-usage.json"
    path.write_text(path.read_text(encoding="utf-8").replace("code-diff", "generic-glass-card"), encoding="utf-8")
    codes = {e["code"] for e in validate_project(root, structural_only=True)["errors"]}
    self.assertIn("invalid_card_kit_composition", codes)

def test_rejects_incomplete_card_kit_check_log(self):
    temp, root = self.make_project()
    self.addCleanup(temp.cleanup)
    (root / "card-kit-check.log").write_text("strict=true\nlint=passed\n", encoding="utf-8")
    codes = {e["code"] for e in validate_project(root, structural_only=True)["errors"]}
    self.assertIn("card_kit_check_failed", codes)
```

- [ ] **Step 3: Run only the new tests and verify RED**

Run:

```powershell
python -m unittest tests.test_validate_package.ValidatePackageTests.test_rejects_missing_project_card_kit_copy tests.test_validate_package.ValidatePackageTests.test_rejects_unapproved_card_composition tests.test_validate_package.ValidatePackageTests.test_rejects_incomplete_card_kit_check_log -v
```

Expected: FAIL because the validator has no card-kit checks.

- [ ] **Step 4: Implement minimal validation**

Add constants for the exact source path, required copy files, allowed categories, allowed category/composition mapping, and log markers. Validate the project copy, score columns, manifest JSON, manifest-to-score scene equality, source/rendered files, `preview_passed`, `package_check_passed`, and all log markers. Emit stable error codes: `missing_card_kit_copy`, `missing_card_kit_manifest`, `invalid_card_kit_manifest`, `invalid_card_kit_composition`, `unproven_card_scene`, and `card_kit_check_failed`.

- [ ] **Step 5: Run the complete no-avatar test suite**

Run:

```powershell
python -m unittest discover -s tests -v
```

Expected: all tests PASS.

- [ ] **Step 6: Validate the no-avatar skill folder**

Run:

```powershell
python "D:\MovedFromC\.codex\skills\.system\skill-creator\scripts\quick_validate.py" "D:\MovedFromC\.codex\skills\ai-health-longform-multitool-video"
```

Expected: `Skill is valid!`

---

### Task 4: Forward-test and deploy the no-avatar skill to Hermes

**Files:**
- Read: validated no-avatar skill
- Create/replace: `C:\Users\Lenovo_CT\.hermes\skills\ai-health-longform-multitool-video`

- [ ] **Step 1: Repeat the Task 1 application scenario with the updated skill**

Expected: the fresh worker explicitly copies the local kit, routes all three cards through it, preserves official catalog charts, and creates the manifest/log evidence without being told the intended answer.

- [ ] **Step 2: Copy the complete skill to Hermes**

Use a non-destructive staged replacement: copy the validated skill to a temporary sibling directory, compare files, rename an existing destination to a backup only if present, then rename the temporary directory into place.

- [ ] **Step 3: Verify recursive equality**

Compare relative paths and SHA-256 hashes for every file, excluding transient `__pycache__` and `.pyc` files. Expected: zero missing, extra, or mismatched files.

---

### Task 5: Baseline and implement the avatar skill

**Files:**
- Create: `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\references\hyperframes-card-kit-contract.md`
- Create: `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\tests\test_card_kit_skill_contract.py`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\SKILL.md`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\references\enforced-avatar-production-contract.md`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\templates\run-avatar-video-prompt.txt`

- [ ] **Step 1: Run the baseline presenter-adjacent scenario**

Ask a fresh worker to plan presenter-adjacent cards for the full-frame panoramic `AVA-02` and `AVA-03` scenes from the current avatar skill. Record whether it independently requires the local motion-card kit and preserves the native 16:9 presenter composition.

- [ ] **Step 2: Write and run the failing static contract test**

Use the Task 1 test structure, replace the launcher/contract filenames, and add required token `presenter-adjacent`. Expected: FAIL before implementation.

- [ ] **Step 3: Add the standalone contract and workflow rules**

Copy the validated no-avatar card contract and add the avatar-specific rule: both middle appearances use package-styled presenter-adjacent overlays in the negative space of native full-frame 16:9 panoramic shots. Never shrink, crop, mask, or push Ava into a side panel. Add mandatory reading, preflight copy, style proof, assembly, final verification, red-flag, and delivery evidence rules.

- [ ] **Step 4: Update the avatar contract and launcher**

Require `card-kit-usage.json`, `card-kit-check.log`, and presenter-adjacent entries for `AVA-02` and `AVA-03`. Preserve official catalog charts, maps, transitions, parallax, captions, and outros.

- [ ] **Step 5: Run the static contract test and verify GREEN**

Run:

```powershell
python -m unittest tests.test_card_kit_skill_contract -v
```

Expected: PASS.

---

### Task 6: Enforce avatar presenter-card evidence

**Files:**
- Modify: `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\scripts\validate_avatar_package.py`
- Modify: `D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video\tests\test_validate_avatar_package.py`

- [ ] **Step 1: Extend the passing avatar fixture**

Create the required project-local kit files, two rendered presenter cards, a valid manifest with `AVA-02` and `AVA-03` presenter-adjacent entries, and a complete check log.

- [ ] **Step 2: Add failing avatar tests**

```python
def test_rejects_missing_presenter_adjacent_cards(self):
    report = self.run_case(omit_presenter_cards=True)
    self.assertIn("presenter-adjacent card evidence is required for AVA-02 and AVA-03", report["errors"])

def test_rejects_generic_presenter_card(self):
    report = self.run_case(generic_presenter_card=True)
    self.assertIn("card-kit composition is not approved for presenter-adjacent", report["errors"])

def test_rejects_missing_card_kit_copy(self):
    report = self.run_case(remove_card_kit=True)
    self.assertIn("the project-local HyperFrames card kit is required", report["errors"])
```

- [ ] **Step 3: Run the new avatar tests and verify RED**

Run:

```powershell
python -m unittest tests.test_validate_avatar_package.ValidateAvatarPackageTests.test_rejects_missing_presenter_adjacent_cards tests.test_validate_avatar_package.ValidateAvatarPackageTests.test_rejects_generic_presenter_card tests.test_validate_avatar_package.ValidateAvatarPackageTests.test_rejects_missing_card_kit_copy -v
```

Expected: FAIL because the avatar validator does not inspect card evidence.

- [ ] **Step 4: Implement minimal avatar card validation**

Require the same source path, project-copy files, manifest/log markers, and file proof as the no-avatar validator. Additionally require exactly one presenter-adjacent manifest record linked to each of `AVA-02` and `AVA-03`, using `presenter-card`, `code-diff`, or `code-morph` derived directly from the kit.

- [ ] **Step 5: Run the complete avatar suite and folder validation**

Run:

```powershell
python -m unittest discover -s tests -v
python "D:\MovedFromC\.codex\skills\.system\skill-creator\scripts\quick_validate.py" "D:\MovedFromC\.codex\skills\ai-health-avatar-longform-video"
```

Expected: all tests PASS and `Skill is valid!`.

---

### Task 7: Forward-test and deploy the avatar skill to Hermes

**Files:**
- Read: validated avatar skill
- Create/replace: `C:\Users\Lenovo_CT\.hermes\skills\ai-health-avatar-longform-video`

- [ ] **Step 1: Repeat the Task 5 presenter scenario with the updated skill**

Expected: the fresh worker routes both middle presenter cards through the local package and supplies the required manifest/log proof while preserving the official catalog boundary.

- [ ] **Step 2: Copy the complete skill to Hermes with the staged replacement procedure**

Preserve any unrelated Hermes skills and configuration.

- [ ] **Step 3: Verify recursive relative-path and SHA-256 equality**

Expected: zero missing, extra, or mismatched non-transient files.

---

### Task 8: Final cross-skill verification

**Files:**
- Verify all four skill directories and both source launchers.

- [ ] **Step 1: Run both test suites again from their own directories**

Expected: all no-avatar and avatar tests PASS.

- [ ] **Step 2: Run `quick_validate.py` against all four Codex/Hermes directories**

Expected: all four report valid.

- [ ] **Step 3: Search for contradictory card instructions**

Run a focused search for `generic card`, `optional card`, `catalog card`, `glass card`, and `presenter-adjacent`; resolve any instruction that permits bypassing the local kit.

- [ ] **Step 4: Produce the completion summary**

Report the exact source package, mandatory categories, official catalog boundary, validator evidence, Codex paths, Hermes paths, test totals, and hash-comparison result.
