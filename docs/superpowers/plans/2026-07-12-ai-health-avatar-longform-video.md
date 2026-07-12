# AI Health Avatar Long-Form Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, validate, and forward-test a separate 7–8 minute AI Health & Wellness avatar-video skill with exactly four mandatory Dr. Ava Shen appearances totaling no more than 120 seconds.

**Architecture:** Create a new skill that imports the proven production contract conceptually but owns its avatar-specific instructions, manifests, templates, tests, and validator. Mirror the validated skill into Hermes, then use it to produce the antibiotic-resistance video through research, HeyGen avatar generation, premium visual production, CapCut finishing, and final QC.

**Tech Stack:** Markdown skills, Python 3 validator/tests, pytest or unittest, HyperFrames CLI, HeyGen in authenticated Chrome, Azure neural TTS, Imagen, GPT Image, FAL/FLUX, Blender, FFmpeg/ffprobe, CapCut, Git.

---

## File Structure

- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/SKILL.md` — skill router and phase state machine.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/agents/openai.yaml` — discoverability metadata.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/references/enforced-avatar-production-contract.md` — complete artifact and quality contract.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/references/heygen-avatar-workflow.md` — authenticated Dr. Ava Shen generation and regeneration procedure.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/references/hermes-runtime-contract.md` — Hermes-specific precedence and verification rules.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/templates/run-avatar-video-prompt.txt` — reusable launcher.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/templates/avatar-manifest-schema.json` — manifest example.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/scripts/validate_avatar_package.py` — structural and final validator.
- `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/tests/test_validate_avatar_package.py` — validator tests.
- `C:/Users/Lenovo_CT/AppData/Local/hermes/skills/ai-health-avatar-longform-video/` — byte-equivalent Hermes installation.
- `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/` — first production package.

### Task 1: Scaffold the Separate Skill

**Files:**
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/`
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/agents/openai.yaml`

- [ ] **Step 1: Initialize the skill with focused resources**

Run:

```powershell
python "D:/MovedFromC/.codex/skills/.system/skill-creator/scripts/init_skill.py" ai-health-avatar-longform-video --path "D:/MovedFromC/.codex/skills" --resources scripts,references --interface "display_name=AI Health Avatar Long-Form Video" --interface "short_description=Create verified 7–8 minute AI Health videos with four Dr. Ava Shen avatar appearances." --interface "default_prompt=Create a complete AI Health & Wellness Hub avatar video using Dr. Ava Shen and every enforced quality gate."
```

Expected: a new skill folder with `SKILL.md` and `agents/openai.yaml`; the existing no-avatar folder remains untouched.

- [ ] **Step 2: Validate the scaffold**

Run:

```powershell
python "D:/MovedFromC/.codex/skills/.system/skill-creator/scripts/quick_validate.py" "D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video"
```

Expected: `Skill is valid!`

### Task 2: Build Avatar Validation Test-First

**Files:**
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/tests/test_validate_avatar_package.py`
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/scripts/validate_avatar_package.py`

- [ ] **Step 1: Write failing tests for the manifest contract**

Create tests that build temporary packages and assert:

```python
def test_accepts_four_passing_clips_under_120_seconds(tmp_path):
    package = make_package(tmp_path, durations=[32.0, 27.0, 28.0, 27.0])
    assert validate(package, structural_only=True)["passed"] is True

def test_rejects_missing_required_appearance(tmp_path):
    package = make_package(tmp_path, durations=[32.0, 27.0, 28.0])
    report = validate(package, structural_only=True)
    assert "exactly four avatar appearances" in report["errors"]

def test_rejects_total_over_120_seconds(tmp_path):
    package = make_package(tmp_path, durations=[35.0, 30.0, 30.0, 26.0])
    report = validate(package, structural_only=True)
    assert "avatar duration exceeds 120 seconds" in report["errors"]

def test_rejects_failed_clip_even_when_file_exists(tmp_path):
    package = make_package(tmp_path, durations=[32.0, 27.0, 28.0, 27.0], failed_clip=2)
    report = validate(package, structural_only=True)
    assert "avatar clip AVA-03 has not passed QC" in report["errors"]

def test_rejects_subtitles_or_voice_mismatch(tmp_path):
    package = make_package(tmp_path, durations=[32.0, 27.0, 28.0, 27.0], subtitles=True)
    assert validate(package, structural_only=True)["passed"] is False
```

- [ ] **Step 2: Run the new tests and verify failure**

Run:

```powershell
python -m pytest "D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/tests/test_validate_avatar_package.py" -v
```

Expected: FAIL because `validate_avatar_package` and helpers do not exist.

- [ ] **Step 3: Implement the manifest validator**

Implement `validate(package: Path, structural_only: bool) -> dict` with these required manifest fields:

```json
{
  "avatar_name": "Dr. Ava Shen",
  "provider": "HeyGen",
  "voice_id": "en-US-AvaMultilingualNeural",
  "subtitles_enabled": false,
  "clips": [
    {
      "id": "AVA-01",
      "role": "opening-hook",
      "duration_seconds": 32.0,
      "resolution": "1920x1080",
      "qc_passed": true,
      "regeneration_count": 0,
      "source_file": "assets/avatar/AVA-01.mp4"
    }
  ]
}
```

Require IDs `AVA-01` through `AVA-04`, four files, 1080p, identical voice ID, `subtitles_enabled=false`, every `qc_passed=true`, a target warning outside 110–115 seconds, and a hard failure above 120 seconds. In full mode, call ffprobe for every avatar clip and the final CapCut export.

- [ ] **Step 4: Run the tests until all pass**

Run the pytest command from Step 2.

Expected: all validator tests PASS.

### Task 3: Author the Skill, Contracts, and Launcher

**Files:**
- Modify: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/SKILL.md`
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/references/enforced-avatar-production-contract.md`
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/references/heygen-avatar-workflow.md`
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/references/hermes-runtime-contract.md`
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/templates/run-avatar-video-prompt.txt`
- Create: `D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/templates/avatar-manifest-schema.json`

- [ ] **Step 1: Write the skill trigger and phase state machine**

Set frontmatter to trigger only for 7–8 minute AI Health videos with Dr. Ava Shen, HeyGen, an avatar, presenter, or spokesperson. Preserve every no-avatar quality requirement and add an avatar phase between script approval and bulk asset production.

- [ ] **Step 2: Write the enforced avatar production contract**

Require research notes, claim sheet, 1,050–1,250 spoken words, 45–55 scenes, 20–26 unique image plates, eight visual families, official HyperFrames items, one or two Blender sequences, female voice continuity, four AVA script blocks, `avatar-manifest.json`, per-clip QC stills, HeyGen provenance, real CapCut export, and full validation.

- [ ] **Step 3: Write the HeyGen workflow**

Specify authenticated Chrome routing, correct existing Dr. Ava Shen selection, uploaded matching audio where available, 1080p, no subtitles, download naming, ffprobe verification, visual/lip-sync inspection, and mandatory regeneration on any failure. Explicitly forbid excluding or hiding a failed required clip.

- [ ] **Step 4: Write the reusable launcher prompt**

Include `[TOPIC]`, `[CORE PROMISE]`, four mandatory avatar appearances, the 115-second target, 120-second ceiling, regeneration rule, clean-master subtitle rule, and complete delivery requirements.

- [ ] **Step 5: Validate the finished skill**

Run:

```powershell
python "D:/MovedFromC/.codex/skills/.system/skill-creator/scripts/quick_validate.py" "D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video"
python -m pytest "D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/tests" -v
```

Expected: skill validation succeeds and all tests pass.

### Task 4: Install and Verify Hermes Parity

**Files:**
- Create: `C:/Users/Lenovo_CT/AppData/Local/hermes/skills/ai-health-avatar-longform-video/`

- [ ] **Step 1: Copy the validated skill into Hermes**

Copy the complete skill tree without caches or temporary test output.

- [ ] **Step 2: Verify semantic and byte parity**

Run a recursive SHA-256 comparison over all files except `__pycache__` and `.pytest_cache`.

Expected: zero missing, extra, or mismatched files.

- [ ] **Step 3: Verify Hermes discovery and precedence**

Confirm the Hermes skill snapshot includes `ai-health-avatar-longform-video`, and the new Hermes runtime contract states that this skill overrides older avatar-video plans without modifying the existing no-avatar skill.

### Task 5: Create the Antibiotic-Resistance Production Package

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/`

- [ ] **Step 1: Research the NIH source and linked primary paper**

Save `research-notes.md` and `claim-sheet.csv`. Separate demonstrated laboratory results from projections, and preserve the exact safety statement that candidates are experimental rather than approved treatments or human cures.

- [ ] **Step 2: Write and validate the narration**

Create `script.md` and `narration.txt` at 1,050–1,250 words with exactly four marked AVA blocks: opening hook, mechanism checkpoint, evidence/limitations checkpoint, and final safety/takeaway.

- [ ] **Step 3: Build the visual score and diversity ledger**

Create 45–55 specific rows distributed across avatar, images, official HyperFrames, and Blender. Use opening and closing full-frame avatar layouts and middle side-panel layouts. Ensure no image file or substantially similar setup is reused.

- [ ] **Step 4: Run structural validation before external generation**

Run:

```powershell
python "D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/scripts/validate_avatar_package.py" "D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar" --structural-only
```

Expected: avatar-aware preproduction structure passes; media-dependent checks remain explicitly pending rather than falsely passing.

### Task 6: Generate and Regenerate Four Dr. Ava Shen Clips

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/avatar/AVA-01.mp4`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/avatar/AVA-02.mp4`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/avatar/AVA-03.mp4`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/avatar/AVA-04.mp4`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/avatar-manifest.json`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/review-frames/avatar-qc/`

- [ ] **Step 1: Generate matching voice audio for all four AVA blocks**

Use `en-US-AvaMultilingualNeural`, record durations, and shorten wording before HeyGen if the projected total exceeds 115 seconds.

- [ ] **Step 2: Generate the four clips in the authenticated HeyGen account**

Select the existing Dr. Ava Shen avatar, use the matching audio workflow, disable subtitles, choose 1080p, and generate each current-project clip separately.

- [ ] **Step 3: Download, rename, and verify every clip**

Run ffprobe for resolution, codec, audio, and duration. Create beginning/middle/end review frames for every clip and inspect identity, lip-sync, hands/face, framing, voice, and subtitle absence.

- [ ] **Step 4: Regenerate every failed required clip**

Repeat generation and QC until all four clips pass. Increment `regeneration_count`; never remove, conceal, or replace a required AVA block.

- [ ] **Step 5: Run avatar structural validation**

Expected: exactly four passing clips and combined avatar time at or below 120 seconds.

### Task 7: Produce Premium Visuals and Assemble the Video

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/imagen/`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/gpt-image/`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/fal/`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/assets/blender/`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/hyperframes/`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/renders/pre_finish.mp4`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/renders/final_capcut_export.mp4`

- [ ] **Step 1: Lock and preview official HyperFrames items**

Install and strict-render exact catalog items for sourced data, peptide-design flow, editorial text, parallax/effects, lower thirds, source card, and outro. Reject any compiler, browser, timeout, clipping, static, or readability failure.

- [ ] **Step 2: Generate and review 20–26 unique image plates**

Use at least eight Imagen and six GPT Image plates plus FAL/FLUX for range. Build and inspect a full contact sheet; regenerate near-duplicates before assembly.

- [ ] **Step 3: Create one or two topic-specific Blender animations**

Model peptide structures interacting with resistant bacterial geometry using layered materials, depth, lighting, and real camera/object animation. Export `.blend`, frames, MP4, GIF preview, and motion evidence.

- [ ] **Step 4: Assemble the 45–55-scene pre-finish master**

Integrate all four avatar clips at their assigned positions, preserve voice continuity, keep still-only scenes under six seconds, avoid burned-in subtitles, and distribute pattern interrupts across the full runtime.

- [ ] **Step 5: Finish and export through CapCut**

Import the validated pre-finish master, perform selective finishing, and copy the actual CapCut export to `renders/final_capcut_export.mp4`.

### Task 8: Final Verification and Delivery

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/final-ffprobe.json`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/final-silencedetect.log`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/final-motion-deltas.json`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/final-qc-report.json`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/final-qc-report.txt`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/review-frames/final-capcut-contact-sheet.jpg`

- [ ] **Step 1: Run the full avatar package validator**

Run:

```powershell
python "D:/MovedFromC/.codex/skills/ai-health-avatar-longform-video/scripts/validate_avatar_package.py" "D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar" --output "D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-12-ai-antibiotic-resistance-avatar/final-qc-report.json"
```

Expected: exit code 0 with exactly four avatar clips, all QC passed, total avatar duration no more than 120 seconds, 7–8 minute runtime, and all inherited premium-media gates passed.

- [ ] **Step 2: Perform final visual review**

Inspect the opening hook, all four avatar appearances, every catalog scene, Blender checkpoints, full-timeline contact sheet, and early/middle/late motion samples. Fix and re-export any weak or broken result.

- [ ] **Step 3: Deliver the verified artifacts**

Return the absolute final MP4 path, project folder, QC report, reusable prompt, exact HeyGen duration, regeneration counts, image-provider counts, Blender count, and official HyperFrames list.

## Plan Self-Review

- Spec coverage: separate triggering, four mandatory appearances, 110–115-second target, 120-second ceiling, full/middle layouts, continuous voice, no subtitles, regeneration-only failure handling, Hermes parity, and the antibiotic-resistance forward test are each assigned to a task.
- Placeholder scan: the plan contains no unresolved marker, deferred implementation, or runtime path.
- Type consistency: `avatar-manifest.json`, IDs `AVA-01` through `AVA-04`, `qc_passed`, `regeneration_count`, and `duration_seconds` are consistent across tests, implementation, generation, and final validation.
