# Human-Reviewed Long-Form Video Workflow Design

Date: 2026-07-15

Pilot topic: Medical-Grade Sensors Are Moving Into the Home

Project: AI Health & Wellness Hub

## Decision

Replace the automatic end-to-end long-form video workflow with a staged editorial workflow containing two mandatory human approval gates:

1. Narrated storyboard/animatic approval.
2. Scene-level CapCut rough-cut approval.

For the pilot, retain the verified research, claim sheet, script, and Dr. Ava Shen narration as source material. Do not reuse the existing final edit, pre-finish assembly, generated image set, HyperFrames scene renders, Blender scenes, scene timing, or flattened CapCut timeline. Every retained source item must still be re-reviewed before entering the new production.

## Why the Existing Cut Is Not a Production Base

The previous validator confirmed technical properties but not editorial quality. It could verify file counts, duration, hashes, provider quotas, and motion while missing unrelated visuals, malformed devices, repeated compositions, placeholder template text, and weak explanatory animation.

The existing assembly also imported one flattened master into CapCut. This made CapCut a finishing and re-encoding step instead of an editable review environment. Individual visual decisions could not be replaced cleanly.

The previous cut remains an archived comparison reference only. It is not a source timeline for the rebuild.

## Approaches Considered

### 1. Repair the existing final cut

Fastest, but rejected. The visual problems are distributed across the timeline, and the flattened CapCut project makes scene-level repair inefficient. It would preserve the faulty storyboard and pacing assumptions.

### 2. Controlled rebuild from the editorial foundation

Selected. Reuse research and narration material, then rebuild from the storyboard forward. This preserves valid work while replacing the failed visual architecture.

### 3. Restart research, script, narration, and visuals from zero

Not selected. The central failure is visual production and editorial review, not the existence of the research package. Research and script are revalidated rather than automatically discarded.

## Roles

### Codex production role

Codex performs research, claim checking, script revision, narration generation, storyboard construction, visual-reference curation, animatic assembly, asset production, graphics production, CapCut timeline construction, requested revisions, finishing, and quality control.

### User creative-director role

The user does not need to create images, edit graphics, or operate production tools. The user reviews two artifacts and gives decisions or timestamped comments:

- The narrated animatic.
- The editable CapCut rough cut.

The user may optionally replace or trim clips directly in CapCut, but this is not required.

## Production Architecture

### Curated visual library — mandatory first search

The shared folder `D:/AI_Health_Wellness_Images` is the preferred visual library for all future AI Health & Wellness Hub videos. It currently contains curated plates, publishing images, and motion clips selected by the user.

Before generating or sourcing new media, Codex must search this library for:

- A direct-use asset that already fits the scene.
- A motion clip that can be used or safely adapted.
- A visual reference that defines the user's preferred style, framing, subject, or palette.
- A candidate the user may want to place manually during CapCut review.

The library is read-only during production. Originals are never renamed, overwritten, recolored, cropped, or reorganized in place. Selected assets are copied into the current video project under `assets/curated-library/` and logged with the original path, hash, scene ID, modification status, and usage-rights status.

User curation establishes creative preference, but it does not automatically establish publication rights. Assets with confirmed original ownership, generation provenance, public-domain status, or an appropriate license may be marked `approved_for_final`. Internet-sourced assets without sufficient provenance are marked `reference_only` or `needs_rights_check` until cleared.

Motion clips from previous attempts are not automatically accepted. Each clip must be checked for baked text, placeholder content, topic mismatch, repeated imagery, aspect ratio, visual quality, and narration relevance.

Each project receives a `curated-library-selections.csv` manifest containing:

```csv
scene_id,source_path,copied_path,asset_role,rights_status,source_or_license,modifications,sha256,review_status,notes
```

### Stage 1 — Research and claim lock

Revalidate the retained research against current primary and authoritative sources. Produce a compact research brief and claim sheet. Each important statement must include its source, evidence strength, visual implication, and safety risk.

Gate condition: all material claims are supported and the intended story angle remains valid.

### Stage 2 — Script and narration lock

Revise the retained script only where needed for clarity, pacing, or visual explainability. Produce a working narration in `en-US-AvaMultilingualNeural` and confirm pronunciation, pauses, speed, and duration.

The working narration becomes the timing authority for the storyboard. If the script changes after this stage, narration and all downstream timecodes must be regenerated.

Gate condition: script, claims, voice, pronunciation, and runtime pass internal editorial review.

### Stage 3 — Scene-by-scene storyboard

Divide the narration into approximately 40–50 editorial scenes. Each storyboard record must contain:

- Scene identifier and time range.
- Exact narration phrase.
- Single viewer takeaway.
- Proposed visual action.
- Visual reference or concept frame.
- Reference provenance and permitted use.
- Asset type and production method.
- Camera framing and movement.
- Purposeful on-screen text, if any.
- Reason the visual supports the narration.
- Risks: factual ambiguity, visual repetition, malformed-device risk, or medical misinterpretation.

References establish subject, composition, environment, realism, and camera language. They are not automatically final media. Official product imagery may be used for factual identification when licensing and context permit; other references are direction-only unless cleared for final use.

For every storyboard scene, Codex searches `D:/AI_Health_Wellness_Images` before proposing newly generated or externally sourced media. Matching library candidates are displayed on the storyboard card and labeled as direct-use, adaptable, reference-only, or user-replacement candidates.

No generated asset batch begins during this stage.

### Stage 4 — Narrated animatic and Approval Gate 1

Build a lightweight 1080p animatic using the working narration, storyboard frames, simple labels, and approximate transitions. The animatic must reveal pacing and visual meaning without pretending to be a finished film.

Deliver:

- Storyboard contact sheet or review document.
- Narrated animatic MP4.
- Scene-comment sheet keyed by timecode.

The user approves the animatic or requests changes. Comments may identify irrelevant visuals, repeated scenes, pacing problems, weak explanations, inappropriate tone, or incorrect graphics.

Gate condition: explicit user approval. Production cannot continue on an unapproved animatic.

### Stage 5 — Production assets in small batches

Produce final assets only for approved scenes, in batches small enough to review meaningfully. Every asset is checked against its storyboard card and narration phrase before timeline use.

Asset priority order:

1. Rights-cleared direct-use asset from `D:/AI_Health_Wellness_Images`.
2. Approved adaptation of a curated library asset or motion clip.
3. New licensed/official source material.
4. New generated image or custom animation when the first three routes cannot serve the scene.

Generated imagery must pass:

- Subject and anatomy/device integrity.
- Narration relevance.
- Composition and art-direction consistency.
- Non-repetition against already accepted assets.
- Absence of fake readable medical interfaces, unwanted text, logos, and watermarks.

HyperFrames rules:

- Catalog previews are test artifacts and can never be timeline media.
- Every production graphic receives a scene-specific source file.
- All visible strings, values, labels, and background elements are enumerated and reviewed.
- A rendered graphic is compared against its storyboard card before acceptance.
- HyperFrames is used only when the selected structure improves comprehension.

Blender rules:

- Blender is optional rather than quota-driven.
- It is used only when 3D spatial explanation materially improves the scene.
- A concept frame must be approved in the animatic before modeling.
- The rendered sequence must communicate the storyboard takeaway without relying on narration to explain an unrelated abstraction.

### Stage 6 — Scene-level CapCut rough cut

Construct CapCut with separate, replaceable timeline elements:

- Individual scene clips.
- Separate narration track.
- Separate music and sound-effect tracks when requested.
- Separate graphic and editorial-text overlays.
- Scene identifiers and timeline markers.

Do not import a single flattened pre-finish master as the editable project.

The rough cut may have temporary color and sound, but its visuals, timing, claims, and scene order must be representative of the intended final film.

### Stage 7 — Approval Gate 2 and picture lock

The user reviews the CapCut rough cut, either directly in CapCut or through an exported review MP4 with timecodes. Codex performs requested replacements and pacing changes while preserving scene-level editability.

Picture lock requires explicit user approval of:

- Scene order.
- Timing and pacing.
- Visual relevance.
- Graphics and data.
- On-screen text.
- Overall visual style.

No final polish or export is considered complete before picture lock.

### Stage 8 — Final finish and delivery

After picture lock, complete narration mastering, optional music and sound design, color consistency, transition refinement, source labels, safety notes, visual QC, audio QC, and the final CapCut export.

The final validator checks technical requirements and verifies that every approved scene ID is present. It does not replace human editorial approval.

## Data Flow

```text
research → claims → script → working narration
                         ↓
                  storyboard records
                         ↓
                  narrated animatic
                         ↓
                  USER APPROVAL 1
                         ↓
             approved asset production
                         ↓
              scene-level CapCut project
                         ↓
                  USER APPROVAL 2
                         ↓
                    picture lock
                         ↓
               finish → QC → final export
```

Each downstream stage references stable scene identifiers. A rejected scene returns only to the earliest affected stage instead of forcing a complete restart.

## Error Handling and Stop Conditions

Production stops when:

- A claim cannot be supported.
- A storyboard visual cannot be explained as relevant to its narration phrase.
- A generated image contains a malformed or misleading medical device.
- A template contains unreviewed strings or demonstration content.
- Two accepted scenes are substantially repetitive.
- An animation does not communicate its storyboard takeaway.
- The animatic or CapCut rough cut lacks user approval.

Replacing a failed tool is allowed; weakening the scene or inserting filler is not.

## Validation Strategy

### Automated checks

- Required files and scene IDs.
- Runtime, resolution, frame rate, audio, and stream integrity.
- Source and claim coverage.
- Missing visual references.
- Duplicate file detection and perceptual similarity warnings.
- Forbidden placeholder strings and catalog-preview paths.
- CapCut project contains scene-level clips rather than only one flattened master.

### Human checks

- Does each visual support the exact spoken idea?
- Is the subject believable and medically non-misleading?
- Is the pacing comfortable when watched continuously?
- Are graphics factually and visually correct?
- Is the visual language varied without becoming inconsistent?
- Would a viewer understand the central idea without seeing production notes?

Human approval is evidence recorded in the project package, not an assumption inferred from validator success.

## Pilot Acceptance Criteria

The rebuilt Medical-Grade Sensors video succeeds when:

- The user approves the narrated animatic.
- The user approves the scene-level CapCut rough cut.
- No catalog preview, placeholder text, or demonstration scene enters the timeline.
- Every final visual maps to one narration phrase and one viewer takeaway.
- Individual clips and graphics remain replaceable in CapCut.
- The finished export passes technical QC after picture lock.
- The previous failed video is retained only as a comparison reference.

## Scope Boundary

This design defines the production workflow and the pilot rebuild. It does not yet modify the existing skill or generate new pilot assets. Skill implementation begins only after the user reviews and approves this written specification and a separate implementation plan is produced.
