# Longevity Cinematic Render Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce an upload-ready seven-minute YouTube master with the approved cinematic presenter background, modern animated information cards, smooth transitions, and consistently leveled dialogue.

**Architecture:** A new deterministic Python renderer will generate modern scene plates and animated clips, composite the existing HeyGen presenter over a cinematic room plate, and assemble the final video with continuous audio processing. FFmpeg handles compositing, transitions, encoding, crossfades, compression, and loudness normalization; Pillow handles deterministic graphic frames.

**Tech Stack:** Python 3, Pillow, FFmpeg/ffprobe, unittest.

---

### Task 1: Define renderer contracts with failing tests

**Files:**
- Create: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/test_render_cinematic_revision.py`
- Create: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/render-cinematic-revision.py`

- [ ] **Step 1: Write tests for scene timing, layout safety, audio targets, and transition overlap**
- [ ] **Step 2: Run `python -m unittest test_render_cinematic_revision.py -v` and confirm imports or assertions fail because the renderer contract is missing**
- [ ] **Step 3: Add minimal constants and validation helpers for 1920x1080 output, 420-second timing, safe zones, -14 LUFS target, -1 dBTP ceiling, and 0.45-second transitions**
- [ ] **Step 4: Re-run the tests and confirm all contract tests pass**

### Task 2: Build the approved cinematic presenter environment

**Files:**
- Create: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/cinematic-room-clean.png`
- Modify: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/render-cinematic-revision.py`

- [ ] **Step 1: Create a clean 16:9 room plate from the approved preview with no presenter, text, logos, or controls**
- [ ] **Step 2: Add foreground extraction based on the known flat HeyGen background color with edge softening and despill**
- [ ] **Step 3: Composite the moving presenter over the room plate without changing her scale or cropping her head, hands, or torso**
- [ ] **Step 4: Render short samples from all three presenter sections and inspect them at full resolution**

### Task 3: Replace basic cards with modern motion graphics

**Files:**
- Modify: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/render-cinematic-revision.py`
- Create: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/cinematic-revision-assets/`

- [ ] **Step 1: Implement layered translucent panels, thin structural rules, tabular data labels, and high-contrast editorial typography**
- [ ] **Step 2: Rebuild the big idea, geroscience, evidence ladder, biomarkers, healthspan strategy, systems map, and closing scenes**
- [ ] **Step 3: Animate hierarchy in order: topic label, headline, structural rule, primary data, supporting labels**
- [ ] **Step 4: Add subtle ambient pan, signal movement, and line drawing without random decorative motion**
- [ ] **Step 5: Render representative frames and verify no overlap, clipping, or text outside the title-safe area**

### Task 4: Add professional scene transitions

**Files:**
- Modify: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/render-cinematic-revision.py`

- [ ] **Step 1: Use directional masked pushes for related graphic scenes**
- [ ] **Step 2: Use gentle focus-pull crossfades when entering or leaving presenter scenes**
- [ ] **Step 3: Use a restrained warm-light transition for the closing section**
- [ ] **Step 4: Confirm every scene has an entrance and every boundary has a visual handoff**

### Task 5: Rebuild and normalize the audio timeline

**Files:**
- Modify: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/render-cinematic-revision.py`

- [ ] **Step 1: Assemble dialogue continuously from the presenter and narration sources without per-scene fades to silence**
- [ ] **Step 2: Add short equal-power audio crossfades at source changes**
- [ ] **Step 3: Apply gentle compression, peak limiting, and two-pass EBU R128 normalization**
- [ ] **Step 4: Measure the result and require approximately -14 LUFS integrated, controlled loudness range, and true peak at or below -1 dBTP**

### Task 6: Render and verify the final master

**Files:**
- Create: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/longevity-cinematic-revision-master.mp4`
- Create: `social-assets/youtube/2026-06-14-longevity-escape-velocity/capcut-assets/00-import-to-capcut/youtube-upload-longevity-cinematic-7min.mp4`
- Modify: `social-assets/youtube/2026-06-14-longevity-escape-velocity/reference-style-build/README.md`

- [ ] **Step 1: Render the complete 1920x1080 H.264/AAC master**
- [ ] **Step 2: Run the complete unit test suite**
- [ ] **Step 3: Run ffprobe and confirm 16:9 video, stereo audio, approximately seven minutes, and zero subtitle streams**
- [ ] **Step 4: Decode the entire master and require a zero exit status**
- [ ] **Step 5: Extract presenter, infographic, transition, and closing review frames and inspect them visually**
- [ ] **Step 6: Copy the verified master to the upload-ready output path and document the result**
