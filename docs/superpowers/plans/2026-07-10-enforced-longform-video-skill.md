# Enforced Long-Form Video Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the permissive AI Health long-form video workflow with deterministic phase gates and use it to create a fresh, catalog-faithful cardiac-CT video exported through CapCut.

**Architecture:** Keep `SKILL.md` concise and move mechanical production rules into a production-contract reference plus a reusable Python validator. The video run writes structured manifests and pass records that the validator checks before each phase. Hyperframes catalog components are installed, preview-rendered independently, then composed into the final timeline only after strict error-free verification.

**Tech Stack:** Markdown skills, Python 3, Hyperframes CLI/GSAP/HTML, official Hyperframes registry, Imagen/GPT Image/FAL where available, Blender 5.1, Edge TTS, FFmpeg/ffprobe, CapCut.

---

### Task 1: Establish the failing baseline

**Files:**
- Read: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/SKILL.md`
- Read: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-10-1752-ai-heart-risk-ct-catalog-blocks-run/`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/baseline-failures.json`

- [ ] Record the observed failures as machine-readable assertions: placeholder visual score, 831-word narration, seven real generated images, nineteen procedural substitutes, identical B-roll plan/log, Hyperframes compiler errors, non-strict render, missing final export, and missing final QC.
- [ ] Run the baseline validator test against the July 10 package and verify it fails for those reasons.

### Task 2: Build the deterministic validator using TDD

**Files:**
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_validate_package.py`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_package.py`

- [ ] Write failing tests for required files, narration word count, visual-score specificity, provider provenance, Hyperframes catalog lock, strict/error-free logs, scene distribution, still-duration limits, Blender placement limits, motion thresholds, and final CapCut export.
- [ ] Run `python -m unittest tests.test_validate_package -v` from the skill directory and verify the tests fail because the validator does not exist.
- [ ] Implement the validator with a nonzero exit code and a JSON report containing `passed`, `errors`, `warnings`, and measured metrics.
- [ ] Re-run the unit tests and the validator against the rejected July 10 package; unit tests must pass and the package must fail.

### Task 3: Refactor the skill for progressive disclosure

**Files:**
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/SKILL.md`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/references/enforced-production-contract.md`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/final-capcut-master-prompt.md`
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/run-enforced-video-prompt.txt`

- [ ] Replace repeated prose in `SKILL.md` with the phase-gated state machine, mandatory reference routing, validator commands, stop conditions, and delivery contract.
- [ ] Put detailed schemas, counts, provider rules, catalog rules, Blender limits, and QC thresholds in `references/enforced-production-contract.md`.
- [ ] Replace the master prompt with a concise launcher that invokes the skill and validator rather than duplicating hundreds of lines.
- [ ] Create the plain-text reusable user prompt for future runs.
- [ ] Run the skill validator and scan for stale contradictions such as requiring nonexistent catalog chart types.

### Task 4: Forward-test the revised skill

**Files:**
- Read: revised skill and validator
- Create: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/forward-test-results.md`

- [ ] Run a pressure scenario on the old behavior and record its shortcuts.
- [ ] Run the same scenario with the revised skill and verify it refuses procedural image substitutions, placeholder visual-score rows, broken Hyperframes renders, and pre-finish delivery.
- [ ] Close any discovered loopholes and re-run validation.

### Task 5: Create a fresh project and research package

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-10-<time>-ai-heart-risk-ct-enforced-run/`
- Create required brief, research, claim, script, narration, score, catalog-lock, provider, B-roll, caption, brand, metadata, and checklist files.

- [ ] Create a unique timestamped folder and confirm no files are copied from old topic packages.
- [ ] Browse current primary sources for the cardiac-CT risk research and write a sourced claim sheet.
- [ ] Write a 1,050–1,250 word narration with a strong 15-second hook and 5–7 sections.
- [ ] Generate a specific 45–55 row visual score and validate it before asset generation.

### Task 6: Lock and prove the Hyperframes catalog system

**Files:**
- Create: project `hyperframes/`, `hyperframes-catalog-lock.json`, `hyperframes-add-log.txt`, preview renders, and strict logs.

- [ ] Inspect the live official catalog and registry and choose exact relevant items: Data Chart, Flowchart/Map or count treatment, two captions, parallax, two transitions/effects, lower third, and outro.
- [ ] Install each exact item with `hyperframes add <name> --no-clipboard`.
- [ ] Adapt only text, sourced data, colors, timing, and spacing.
- [ ] Strict-render every item independently; scan logs and sample frames for blank/overflow/broken output.
- [ ] Build and visually verify the style-proof reel before full asset production.

### Task 7: Produce fresh image and Blender assets

**Files:**
- Create: project `assets/imagen/`, `assets/gpt-image/`, `assets/fal/`, `assets/blender/`, provider log, prompts, and preview sheets.

- [ ] Verify provider access without exposing secrets.
- [ ] Generate 14–18 new bright, clean, cinematic 16:9 health-tech plates; no procedural filler counts.
- [ ] Build one or two detailed Blender animations with topic-specific modeled geometry and real camera/object movement.
- [ ] Render preview frames/clips and reject weak or repetitive assets.

### Task 8: Produce narration and assemble the pre-finish video

**Files:**
- Create: project `assets/audio/`, `renders/segments/`, `renders/pre_finish.mp4`, assembly scripts, and timeline manifest.

- [ ] Generate calm narration and verify natural duration and pacing.
- [ ] Assemble 45–55 scenes with no still-only scene over six seconds and with catalog/Blender/generated assets distributed throughout.
- [ ] Normalize audio and render the pre-finish MP4.
- [ ] Run the validator, contact-sheet review, and early/middle/late motion proof; fix every failure.

### Task 9: Finish in CapCut and verify the final export

**Files:**
- Create: project `renders/final_capcut_export.mp4`, final contact sheet, motion proof, silence log, ffprobe JSON, and final QC JSON/text.

- [ ] Import the validated pre-finish file into CapCut, review the timeline, apply selective finishing, and export locally.
- [ ] Copy the actual export to `renders/final_capcut_export.mp4`.
- [ ] Run ffprobe, silence detection, motion sampling, catalog evidence checks, provider counts, and full package validation against the CapCut export.
- [ ] Visually review the final contact sheet and representative hook/chart/Blender frames.

### Task 10: Deliver the artifact and reusable prompt

**Files:**
- Read: final validation report and reusable prompt template.

- [ ] Provide the final MP4 path, project folder, QC report, measured specs, asset counts, and exact official catalog items used.
- [ ] Provide the reusable plain-text prompt for future topics.

