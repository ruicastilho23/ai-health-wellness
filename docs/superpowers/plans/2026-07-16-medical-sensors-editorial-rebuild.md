# Medical Sensors Editorial Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild “Medical-Grade Sensors Are Moving Into the Home” as the first human-reviewed pilot, preserving valid research and narration material while replacing the failed visual edit from the storyboard forward.

**Architecture:** Create a new project isolated from the failed production, revalidate its editorial foundation, search the curated library before sourcing or generating media, and build a narrated animatic for Approval Gate 1. After approval, produce final assets in batches and construct a scene-level CapCut project for Approval Gate 2 before picture lock and final export.

**Tech Stack:** Current authoritative web research, CSV/Markdown, `en-US-AvaMultilingualNeural`, curated image and motion library, Pillow, FFmpeg/ffprobe, optional image providers, optional HyperFrames, optional Blender, CapCut Desktop.

---

## Project Paths

- Previous comparison package: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-14-154730-medical-grade-sensors-home`
- New pilot package: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild`
- Curated source library: `D:/AI_Health_Wellness_Images`
- Curated inventory: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/library-assets.csv`
- Workflow skill: `D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video`

## Reuse Boundary

Eligible for revalidation and copying:

- `research-notes.md`
- `claim-sheet.csv`
- `script.md`
- `narration.txt`
- `narration-voice.json`
- `audio/narration-raw.mp3`
- `audio/narration-master.wav`

Comparison-only; do not copy into the new production timeline:

- `renders/pre_finish.mp4`
- `renders/final_capcut_export.mp4`
- `renders/scenes/`
- `renders/catalog-previews/`
- `renders/catalog-scenes/`
- `renders/card-kit/`
- `assets/imagen/`, `assets/gpt-image/`, and `assets/fal/`
- `assets/blender/`
- `capcut-project/`
- Previous `visual-score.csv` and scene timing

### Task 1: Create the isolated pilot package

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/source-salvage-manifest.csv`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/approval-gates.json`

- [ ] **Step 1: Create only the new project directories**

Run:

```powershell
$root='D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild'
New-Item -ItemType Directory -Force -Path $root,($root+'/audio'),($root+'/assets/curated-library'),($root+'/assets/generated'),($root+'/assets/official'),($root+'/assets/motion'),($root+'/renders'),($root+'/review-frames'),($root+'/capcut-project'),($root+'/phase-status') | Out-Null
```

Expected: the new project exists; the previous package remains unchanged.

- [ ] **Step 2: Copy only eligible source material**

Copy the seven eligible files listed in the reuse boundary. Calculate their old and new SHA-256 hashes and write:

```csv
source_path,copied_path,sha256,revalidation_status,notes
```

Every row begins with `revalidation_status=pending`. Do not copy previous visuals or renders.

- [ ] **Step 3: Initialize approval gates from the skill template**

Run:

```powershell
Copy-Item -LiteralPath 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/templates/approval-gates-schema.json' -Destination ($root+'/approval-gates.json')
```

Expected: all three gate statuses are `pending`.

- [ ] **Step 4: Verify the isolation boundary**

Run:

```powershell
$forbidden=@('pre_finish.mp4','final_capcut_export.mp4','visual-score.csv')
$hits=Get-ChildItem -LiteralPath $root -File -Recurse | Where-Object { $_.Name -in $forbidden -or $_.FullName -match 'catalog-previews|assets\\blender|assets\\imagen|assets\\gpt-image|assets\\fal' }
if($hits){$hits.FullName; exit 1}else{'isolation=passed'}
```

Expected: `isolation=passed`.

- [ ] **Step 5: Commit the project skeleton and source manifest**

```powershell
Set-Location 'D:/AI HEALTH & WELLNESS HUB'
git add 'social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/source-salvage-manifest.csv' 'social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/approval-gates.json'
git commit -m "chore: initialize medical sensors editorial rebuild"
```

Do not commit large audio or video files unless the repository’s existing media policy explicitly permits them.

### Task 2: Revalidate the research, script, and working narration

**Files:**
- Modify: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/research-notes.md`
- Modify: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/claim-sheet.csv`
- Modify: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/script.md`
- Modify: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/narration.txt`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/editorial-lock.json`

- [ ] **Step 1: Recheck the primary sources**

Open and verify:

- FDA sensor-based digital health technology device list.
- Onera SleepMap K253668 decision page and summary.
- New Wave System K260455 decision page and summary.

Record access date, exact intended-use language, authorization status, and any changes since the previous research package. Do not use search-result snippets as evidence.

- [ ] **Step 2: Reconcile the claim sheet against the sources**

For every script claim, set:

```csv
claim_id,claim_text,source_url,source_title,evidence_strength,script_section,visual_note,risk_note,verified_at
```

Expected: every material claim has a primary source or is explicitly framed as analysis; the consumer-wearable caveat remains clear.

- [ ] **Step 3: Revise the script for visual explainability**

Keep the narration between 1,050 and 1,250 words. Rewrite sentences that require vague “technology” imagery into concrete visual propositions. Preserve the strong first-15-second hook and the specific-device/specific-intended-use caveat.

- [ ] **Step 4: Generate or confirm the working narration**

Use `en-US-AvaMultilingualNeural`. If the script changed, regenerate the complete narration; never splice a different voice. Save `audio/narration-working.wav` and update `narration-voice.json`.

- [ ] **Step 5: Verify the editorial lock**

Run:

```powershell
python -c "import json,re,pathlib; p=pathlib.Path(r'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild'); n=len(re.findall(r'\b[\w’\x27-]+\b',(p/'narration.txt').read_text(encoding='utf-8'))); assert 1050<=n<=1250,n; print(f'narration_words={n}')"
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/audio/narration-working.wav'
```

Write `editorial-lock.json` with source verification time, narration word count, audio duration, voice ID, and `status=passed`.

- [ ] **Step 6: Update the salvage manifest and commit text artifacts**

Set retained text rows to `revalidation_status=passed`; set replaced narration rows to `revalidation_status=regenerated`. Commit research, claims, script, narration text, voice metadata, and editorial lock.

### Task 3: Index and review the curated visual library

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/library-assets.csv`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/plates-contact-sheet.jpg`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/motion-contact-sheet.jpg`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/library-review.csv`

- [ ] **Step 1: Run the read-only indexer**

Run:

```powershell
Set-Location 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video'
python scripts/index_curated_library.py 'D:/AI_Health_Wellness_Images' --output 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/curated-library-index/library-assets.csv'
```

Expected: 139 indexed assets and no source-folder mutation.

- [ ] **Step 2: Build review sheets without modifying originals**

Create thumbnails in the workspace index folder. For motion clips, extract representative frames at 20%, 50%, and 80% of duration. Label every tile with `asset_id` and source filename.

- [ ] **Step 3: Inspect and classify every likely pilot candidate**

Write:

```csv
asset_id,creative_tags,direct_use_quality,topic_relevance,rights_status,source_or_license,approved_role,review_notes
```

Use only `approved_for_final`, `reference_only`, `needs_rights_check`, or `rejected` for rights/review decisions. Filename references to Unsplash, Pixabay, Commons, or public domain are clues, not proof; record the actual source/license before direct use.

- [ ] **Step 4: Shortlist sensor-video candidates**

Create `curated-library-candidates.csv` inside the pilot with:

```csv
asset_id,source_path,candidate_role,possible_narration_topic,rights_status,review_notes
```

Do not assign final scene IDs before the storyboard exists.

- [ ] **Step 5: Verify library integrity**

Re-run the inventory and compare all 139 source hashes with the first scan. Expected: identical hashes and file count.

### Task 4: Create the new storyboard and visual-reference board

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/storyboard.csv`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/curated-library-selections.csv`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/review-frames/storyboard-contact-sheet.jpg`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/storyboard-review.md`

- [ ] **Step 1: Segment narration by meaning, not a fixed nine-second grid**

Create 40–50 scenes with variable durations. Each scene must express one viewer takeaway. Do not inherit previous scene boundaries.

- [ ] **Step 2: Search the curated library for every scene**

For each scene, record the best available library candidate and classify it as `direct_use`, `adaptable`, `reference_only`, or `user_replacement_candidate`. If no candidate fits, state the exact missing visual rather than using a generic substitute.

- [ ] **Step 3: Complete every storyboard field**

Use the skill’s `storyboard-schema.csv`. Require one exact narration phrase, takeaway, visual action, reference, reference provenance, camera plan, relevance reason, claim IDs, and risk flags for every row.

- [ ] **Step 4: Create the storyboard contact sheet**

Each tile shows scene ID, time range, reference frame, short narration phrase, viewer takeaway, and rights/reference role. The sheet must make repetition and pacing visible across the whole program.

- [ ] **Step 5: Run storyboard validation**

Run:

```powershell
python 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_editorial_workflow.py' 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild' --stage storyboard
```

Expected: `passed=true`, zero catalog-preview paths, 40–50 unique scenes, and no missing relevance fields.

- [ ] **Step 6: Perform the human-quality precheck**

Before animatic assembly, inspect the full sheet and reject any scene that is malformed, repetitive, implausible, visually unrelated, rights-unclear for direct use, or dependent on narration to explain an unrelated abstraction.

### Task 5: Build the narrated animatic and stop at Approval Gate 1

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/renders/animatic-review.mp4`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/renders/animatic-timecoded.mp4`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/animatic-scene-manifest.csv`

- [ ] **Step 1: Render simple storyboard scene clips**

Use reference frames, restrained pans or holds, temporary source labels, and no final visual effects. Render exact storyboard durations and name clips `S##_animatic.mp4`.

- [ ] **Step 2: Assemble the narration-led animatic**

Place `audio/narration-working.wav` under the temporary scene clips. Keep graphics simple enough that the user evaluates meaning and pacing rather than polish.

- [ ] **Step 3: Export clean and timecoded review versions**

The timecoded version includes scene ID and running timecode for feedback. The clean version shows only planned editorial text.

- [ ] **Step 4: Run automated animatic checks before asking for review**

Verify 1920×1080, 24 or 30 fps, narration present, duration within the approved runtime, scene manifest matches storyboard, and no catalog preview appears.

- [ ] **Step 5: Deliver the animatic and request explicit approval**

Provide the storyboard sheet, review notes, and review MP4. When the user is on mobile, use a user-approved private sharing destination; do not publish the review publicly or assume a local path is accessible.

- [ ] **Step 6: Stop**

Do not generate final production assets. Record user comments in `approval-gates.json`. Continue only when `animatic.status=approved` with approval time, approver, artifact hash, and notes.

### Task 6: Produce approved final assets in small batches

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/asset-production-manifest.csv`
- Create: approved media under `assets/curated-library/`, `assets/generated/`, `assets/official/`, and `assets/motion/`

- [ ] **Step 1: Copy rights-cleared curated assets into the project**

Preserve source hashes and log every copy in `curated-library-selections.csv`. Do not transform originals in place.

- [ ] **Step 2: Produce only the first approved batch**

Create final assets for six to eight storyboard scenes. Use generated imagery, HyperFrames, or Blender only where the storyboard specifically calls for them.

- [ ] **Step 3: Inspect the batch against narration and references**

Reject malformed devices, fake medical UI, unrelated symbolism, repeated rooms/compositions, incorrect text, template demo content, and weak explanatory animation.

- [ ] **Step 4: Replace rejected assets before beginning another batch**

Do not accumulate unresolved “acceptable for now” scenes. Update the manifest with `approved`, `rejected`, or `replaced` and the review reason.

- [ ] **Step 5: Repeat batches until all approved storyboard scenes have production media**

Keep final filenames scene-specific, for example `S18_home_sleep_sensor_closeup.mp4`.

### Task 7: Build the scene-level CapCut rough cut

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/capcut-scene-manifest.csv`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/capcut-project/`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/renders/capcut-rough-cut-review.mp4`

- [ ] **Step 1: Import narration as a separate track**

Use `audio/narration-working.wav`; lock it after synchronization.

- [ ] **Step 2: Import each approved scene separately**

Arrange scene clips in storyboard order. Do not import a single full-length pre-finish MP4.

- [ ] **Step 3: Place graphics and text on separate tracks**

Every overlay remains editable and replaceable. Name source files and timeline records by scene ID.

- [ ] **Step 4: Complete the CapCut scene manifest**

Record every scene’s clip path, narration path, overlays, timeline track, start/end, review status, and `replaceable=true` where applicable.

- [ ] **Step 5: Export the rough-cut review MP4**

Use 1080p H.264 with working audio. This is a review artifact, not the final master.

- [ ] **Step 6: Validate editability evidence**

Run:

```powershell
python 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_editorial_workflow.py' 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild' --stage rough-cut
```

Expected: the manifest maps every storyboard scene, uses multiple distinct clip paths, and at least 90% of media rows are replaceable.

### Task 8: Stop at Approval Gate 2 and obtain picture lock

**Files:**
- Modify: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/approval-gates.json`
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/rough-cut-review-notes.csv`

- [ ] **Step 1: Deliver the editable CapCut project and review MP4**

Provide both so the user may either edit directly or comment by timecode.

- [ ] **Step 2: Record every requested change**

Use:

```csv
comment_id,timecode,scene_id,request,status,resolution_notes
```

- [ ] **Step 3: Apply changes at scene level**

Replace clips, graphics, or timing without flattening the timeline. Re-export the review MP4 after each review round.

- [ ] **Step 4: Record explicit rough-cut approval and picture lock**

Set `rough_cut.status=approved` and `picture_lock.status=approved` only after the user confirms scene order, pacing, visual relevance, graphics, on-screen text, and overall style.

- [ ] **Step 5: Stop if either approval is missing**

No final finish or delivery is permitted while either status remains pending or changes-requested.

### Task 9: Finish, export, and validate the picture-locked film

**Files:**
- Create: `D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/renders/final_capcut_export.mp4`
- Create: final QC artifacts in the pilot root.

- [ ] **Step 1: Apply final finishing in CapCut**

Complete color consistency, final narration mastering, optional music/sound design, source labels, safety notes, and restrained transitions without changing picture-locked editorial decisions.

- [ ] **Step 2: Export the clean YouTube master**

Export 1920×1080 H.264 MP4 at 24 or 30 fps with AAC stereo. Do not add automated subtitles, transcript captions, or karaoke text.

- [ ] **Step 3: Run editorial final validation**

Run:

```powershell
python 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_editorial_workflow.py' 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild' --stage final
```

Expected: all three approval statuses are approved and the scene-level manifest remains valid.

- [ ] **Step 4: Run final technical validation**

Run:

```powershell
python 'D:/MovedFromC/.codex/skills/ai-health-longform-multitool-video/scripts/validate_package.py' 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild' --output 'D:/AI HEALTH & WELLNESS HUB/social-assets/youtube/2026-07-16-medical-grade-sensors-home-editorial-rebuild/final-qc-report.json'
```

Expected: zero errors and zero warnings.

- [ ] **Step 5: Perform final human visual review**

Review the hook, all graphics, all custom animation, every source/safety label, the full-timeline contact sheet, and the actual final CapCut export. Technical validation cannot override a weak or incorrect scene.

- [ ] **Step 6: Deliver the final package**

Deliver the final MP4, editable CapCut project, storyboard, narrated animatic, both approval records, curated-library manifest, research, script, narration, final QC, and reusable prompt.
