# Long-Form Video Narration and Visual-Diversity Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make clean subtitle-free delivery, one consistent adult female narrator, and measurable image diversity mandatory for future no-avatar videos.

**Architecture:** Add package-level evidence files and deterministic checks to the existing fail-closed validator, then align the skill body, production contract, and both launcher prompts with those checks. Preserve purposeful editorial graphics while excluding transcript-style captions.

**Tech Stack:** Markdown skill instructions, CSV/JSON evidence, Python `unittest` validator tests.

---

### Task 1: Add failing validator tests

**Files:**
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/tests/test_validate_package.py`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_package.py`

- [ ] Add fixtures for `narration-voice.json`, `caption-plan.csv`, and `visual-diversity-ledger.csv`.
- [ ] Add tests that reject a male voice, burned subtitle mode, reused generated assets, insufficient visual families, overused families, adjacent repeated families, and missing GPT Image/Imagen minimums.
- [ ] Run the new tests and confirm they fail because the checks do not yet exist.
- [ ] Add the smallest validator checks that satisfy the tests.
- [ ] Run the complete validator suite and confirm zero failures.

### Task 2: Update the reusable production contract

**Files:**
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/SKILL.md`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/references/enforced-production-contract.md`

- [ ] Add the clean-master subtitle rule and distinguish forbidden transcript captions from allowed editorial text.
- [ ] Add the adult female narrator identity and narration evidence requirement.
- [ ] Replace the 14–18 plate target with 20–26 unique plates and add visual-family limits.
- [ ] Require GPT Image and Imagen provider minimums.
- [ ] Add explicit red flags forbidding renamed duplicates, alternate crops, and “storytelling purpose” repetition exceptions.

### Task 3: Update launch prompts and verify deployment

**Files:**
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/final-capcut-master-prompt.md`
- Modify: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/run-enforced-video-prompt.txt`

- [ ] Put all three defaults directly in both prompts.
- [ ] Run the validator tests, skill quick validation, and a forward pressure test.
- [ ] Confirm the completed heart-risk video package remains unchanged.
