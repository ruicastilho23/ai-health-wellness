# Enforced AI Health Long-Form Video Skill Design

## Objective

Replace the current instruction-heavy long-form video workflow with a staged, machine-verifiable production system, then use it to create a fresh 7–8 minute no-avatar video about AI-assisted cardiac CT risk prediction.

The revised system must stop on failed tools, broken motion graphics, placeholder planning, provider substitutions, weak motion, incomplete finishing, or missing evidence. It must never turn a failed premium workflow into a technically complete but visually mediocre slideshow.

## Scope

This change covers two connected deliverables:

1. A revised `ai-health-longform-multitool-video` skill, master prompt, references, and deterministic validation scripts.
2. A completely fresh production package and final CapCut export for the cardiac CT topic.

The existing July 10 package is evidence for the failure mode only. None of its scripts, narration, images, Blender plates, Hyperframes renders, timelines, or exports may be reused in the fresh production.

## Core Architecture

The workflow becomes a phase-gated state machine:

1. **Preflight and catalog lock** — verify tools/providers and select exact official Hyperframes catalog items.
2. **Research, claims, script, and scene score** — produce specific evidence-backed narration and a real shot-by-shot plan.
3. **Style proof** — render a short internal proof containing the hook, a generated plate, official data graphic, official caption/effect, and Blender sequence.
4. **Asset production** — generate all fresh image, Blender, narration, and Hyperframes assets.
5. **Assembly and finishing** — assemble the timeline and export through CapCut.
6. **Final verification** — run automated checks plus visual inspection against the actual CapCut export.

Each phase writes a pass record. A failed gate stops the workflow. Later phases cannot run without prior pass records.

## Hyperframes Catalog Contract

Before storyboarding, create `hyperframes-catalog-lock.json`. Each entry contains:

- Official registry name and category.
- Official catalog and registry URLs.
- Installation command.
- Local installed path.
- Intended scene IDs and narrative purpose.
- Allowed adaptations: text, data, colors, timing, and spacing only.
- Preview render path and pass/fail status.

Use exact official files installed with `hyperframes add <name> --no-clipboard`. Do not recreate, imitate, trace, or replace official patterns with custom lookalikes.

The official registry currently provides one main `data-chart` block plus maps, flowcharts, count/showcase blocks, cards, captions, parallax components, and transitions. The revised requirements therefore use these categories:

- 2–3 official Data Chart scenes with different sourced datasets.
- 2–4 official map, flowchart, count, or diagram scenes where narratively relevant.
- 3–5 official caption/text-treatment scenes.
- 3–5 official parallax/effect/transition uses.
- 1–2 official lower-third, source-card, or outro blocks.

Do not require nonexistent official radial-gauge, heatmap, uncertainty-band, or slope-chart blocks. Do not call non-chart catalog blocks “chart types.”

Render and inspect every installed catalog item separately before adding it to the main timeline. Any browser/compiler error, timeout, blank frame, unreadable text, overflow, or missing animation fails the item. Main rendering uses strict mode and log scanning; it may not continue past runtime failures.

## Script and Hook Design

The narration must contain 1,050–1,250 spoken words and naturally occupy 7:20–7:50 at approximately 135–155 words per minute.

The first 15 seconds contain:

- A concrete tension statement.
- A readable on-screen headline using an approved official text treatment.
- A striking moving generated or Blender visual.
- The safe framing immediately after the hook, not before it.

The script uses 5–7 sections and a visual or rhetorical pattern interrupt every 30–45 seconds. The narration remains calm, evidence-aware, non-alarmist, and explicitly distinguishes research risk estimation from diagnosis.

## Visual Score Contract

Create 45–55 micro-scenes. Every row must contain:

- Exact narration phrase.
- Exact time range and duration.
- Narrative purpose.
- Exact asset filename.
- Exact primary tool.
- Exact official Hyperframes catalog name when applicable.
- On-screen text.
- Motion behavior.
- Transition.
- Claim/source ID.

Reject generic values such as `mixed`, `matched narration segment`, `fresh plate`, `soft wipe` repeated throughout, or blank on-screen text for scenes that require captions.

Still-image-only scenes may not exceed 6 seconds without an additional meaningful animation layer. Hyperframes, generated images, Blender, and breathing-room scenes must be distributed across early, middle, and late sections rather than clustered by asset type.

## Generated Image Contract

Generate 14–18 fresh 16:9 cinematic plates using working premium image providers. Imagen remains the primary provider. GPT Image and FAL/FLUX are checked and used when available.

Every asset records its exact provider and prompt. Local procedural circles, generic bars, placeholder HUDs, and programmatically drawn abstract filler do not count as generated image plates.

Images follow the project’s bright, clean health-tech direction: airy clinical whites, daylight, soft blues and greens, realistic devices, optimistic preventive-health context, no fake readable UI, and no presenter/avatar.

## Blender Contract

Use Blender for one or two 8–15 second premium sequences, not a long block of still camera angles. Each sequence must include:

- Topic-specific modeled geometry.
- Layered objects and meaningful materials.
- Lighting and depth.
- Real camera or object animation.
- A short preview render and visual approval record.

Different camera views of one static Blender scene do not count as multiple unique 3D sequences.

## Style-Proof Gate

Before full production, render a short internal proof containing:

- Final opening hook treatment.
- One fresh generated image plate with motion.
- One official Data Chart scene.
- One official caption treatment.
- One official parallax/effect transition.
- One detailed Blender animation moment.

The proof must pass visual inspection for readability, animation quality, palette, pacing, composition, and narrative relevance. Failed proof elements are corrected before producing the remaining assets.

## Automated Validation

Bundle a reusable validator with the skill. It exits nonzero when any required condition fails, including:

- Missing required files or phase pass records.
- Visual score row count or placeholder/generic values.
- Narration outside the word-count or duration range.
- Missing catalog-lock entries or installed files.
- Hyperframes errors, timeouts, blank/near-blank sampled frames, or non-strict rendering.
- Too few real generated images or false provider provenance.
- Too many or clustered Blender scenes.
- Insufficient catalog-scene distribution.
- Still-only scenes longer than 6 seconds.
- Motion deltas at or below threshold in early, middle, or late checkpoints.
- Missing final CapCut export.
- Runtime, resolution, audio, or silence failures.

The validator must test structured evidence, not prose claims in checklists.

## Final Editing and QC

The pre-finish render is imported into CapCut for a real finishing pass. The delivered file is the actual CapCut export copied to `renders/final_capcut_export.mp4`.

Generate contact sheets and grouped motion-proof frames from the final CapCut file. Review the full timeline for visual repetition, weak transitions, unreadable captions, dark monotony, empty frames, generic procedural imagery, and mismatched narration.

The final package passes only when automated validation and visual review both succeed.

## Success Criteria

- The revised skill is concise, uses progressive disclosure, and delegates mechanical rules to scripts.
- The master prompt is reusable plain text and does not duplicate the entire skill.
- Hyperframes scenes visibly match exact official catalog structures and render without runtime errors.
- The video contains real visual variation, meaningful motion, fresh premium imagery, one or two strong Blender sequences, and a readable hook.
- The narration sounds natural rather than stretched.
- No checklist claims tool use that is absent from the artifact.
- The delivered 7–8 minute MP4 is a verified CapCut export.

