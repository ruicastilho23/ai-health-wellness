# Long-form to Short Publishing Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and activate one daily Codex automation that turns each new finished long-form YouTube video into a published website short/article and a local X-ready package.

**Architecture:** A local recurring automation runs in the active AI Health & Wellness Hub workspace at 10:00 AM Bangkok time. It detects one unprocessed final long-form export, performs the complete video and publishing workflow described in the approved design, and records success only after local and live checks pass.

**Tech Stack:** Codex recurring automations, ffmpeg/ffprobe, local speech transcription or existing captions/scripts, static HTML/CSS/JS, Playwright browser checks, Git, Netlify, and the installed HyperFrames, automation escalation, and X health-tech skills.

---

### Task 1: Create the recurring automation

**Files:**
- Reference: `docs/superpowers/specs/2026-07-16-longform-to-short-publishing-automation-design.md`
- Runtime workspace: `D:\AI HEALTH & WELLNESS HUB`
- Runtime state: `social-assets/automation/longform-to-short-processed.json`

- [ ] **Step 1: Confirm the active workspace and approved design**

Run the equivalent read-only checks for the current path and design file.

Expected:

```text
D:\AI HEALTH & WELLNESS HUB
docs/superpowers/specs/2026-07-16-longform-to-short-publishing-automation-design.md exists
```

- [ ] **Step 2: Check for an existing matching automation**

Inspect the existing Codex automations for a job named `Publish New Long-form Short` or a prompt that performs the same workflow.

Expected: no matching automation exists. If one exists, update it instead of creating a duplicate.

- [ ] **Step 3: Create the active local automation**

Create one local recurring automation with these settings:

```text
Name: Publish New Long-form Short
Workspace: D:\AI HEALTH & WELLNESS HUB
Execution environment: local
Status: ACTIVE
Schedule: every day at 10:00 AM Asia/Bangkok time
Reasoning effort: high
```

Use this self-contained task prompt:

```text
Turn the newest unprocessed finished AI Health & Wellness Hub long-form YouTube video into one polished short, publish it with a website article, and prepare an X-ready package. Follow D:\AI HEALTH & WELLNESS HUB\docs\superpowers\specs\2026-07-16-longform-to-short-publishing-automation-design.md exactly. Work only in D:\AI HEALTH & WELLNESS HUB, the active source-of-truth workspace.

Use the installed hyperframes skill for the video-editing workflow, automation-tool-escalation for deterministic local rendering and verification, x-health-tech-post for the X caption, and verification-before-completion before reporting success. Use ffmpeg and ffprobe for local media work and Playwright for local website checks.

Search social-assets/youtube for the newest unprocessed final 5-12 minute MP4 with video and audio. Prefer final_capcut_export.mp4, final-capcut.mp4, final_capcut.mp4, or final.mp4. Exclude scenes, drafts, pre-finish files, picture-only or silent renders, samples, references, rejected files, and generated shorts. Process at most one source per run. Check social-assets/automation/longform-to-short-processed.json and existing website/X outputs to prevent duplicates. If no valid new source exists, make no changes and finish with a concise status.

Choose the strongest self-contained passage, targeting 50-70 seconds and approximately one minute. Use existing captions, scripts, or speech transcription to identify sentence boundaries. Start naturally and end after a complete sentence before the next scene or thought begins. Inspect the final seconds frame-by-frame and listen to the ending. Never leave the beginning of a cut-off scene or an unfinished sentence. Export a landscape H.264/AAC MP4 and a clear poster frame.

Create site/assets/videos/<slug>-short.mp4, site/assets/videos/<slug>-poster.jpg, and site/articles/<slug>.html. Match the established site article template. Embed the video, use accurate constructive health-tech writing, cite current primary or authoritative sources for medical facts, include the existing disclaimer and legal elements, and add complete metadata with the clean production URL. Add the article exactly once to site/index.html and site/sitemap.xml. Do not change CSS or JavaScript unless genuinely required; if either changes, follow the site's cache-bump rule.

Create social-assets/x/YYYY-MM-DD-<slug>/ with <slug>-x-short.mp4, <slug>-poster.jpg, x-post-copy.md, and x-article.md. The X caption must be 60-80 words, lead with a practical benefit, include the live article URL and one to three relevant hashtags, and avoid medical overclaims. Never open X, post to X, schedule an X post, or modify live X content.

Run node --check site/app.js and node --check site/p5-hero.js only if p5-hero.js changed. Preview from the site folder at http://127.0.0.1:5173/index.html. Check the article and homepage at desktop and mobile widths, video playback, poster loading, disclaimers, links, and horizontal overflow. Probe both website and X videos for duration, codecs, and audio/video streams.

Preserve all unrelated user changes. Stage only the exact site files created or modified for this article. Confirm the staged list before committing. Commit the website package and push the current main branch so Netlify publishes it. If Git is unsafe, the push fails, or the live article/video checks fail, preserve local outputs, do not mark the source processed, and report the precise blocker.

Only after all checks pass, update social-assets/automation/longform-to-short-processed.json with the source path, file size, modified timestamp, output slug, and processing date. Report the source video, short duration, live article URL, X-package location, and any non-blocking warnings.
```

Expected: the automation is created once, active, points to the local source-of-truth workspace, and does not contain instructions to publish on X.

### Task 2: Verify the saved automation

**Files:**
- Read-only automation configuration managed by Codex

- [ ] **Step 1: View the saved automation**

Open the saved automation details immediately after creation.

Expected:

```text
Name: Publish New Long-form Short
Status: ACTIVE
Workspace: D:\AI HEALTH & WELLNESS HUB
Execution environment: local
Schedule: daily at 10:00 AM in the user's local timezone
```

- [ ] **Step 2: Check the prompt against the approved boundaries**

Confirm the saved prompt explicitly includes all of the following:

```text
one source per run
50-70 second short
complete-sentence ending
frame-by-frame final-seconds check
automatic website publication
live article and video verification
X-ready package creation
no X posting or scheduling
duplicate protection
exact-file Git staging
no processed record after a failed run
```

Expected: every boundary is present with no contradictory instruction.

- [ ] **Step 3: Report activation without starting an unscheduled production run**

Do not manually trigger the video workflow during setup. Report the active schedule, the automatic website/X boundary, and the saved automation name.

Expected: the user knows the job is active and will first check for a new finished video at the next scheduled run.
