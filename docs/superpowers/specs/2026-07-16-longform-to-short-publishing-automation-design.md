# Long-form to Short Publishing Automation

## Purpose

Create a recurring workflow for AI Health & Wellness Hub that detects each newly finished 7-8 minute YouTube video, creates one polished short of about one minute, publishes the short with a related website article, and prepares a complete X-ready package without posting to X.

The workflow covers both long-form formats:

- One non-avatar video per week.
- One avatar video per week.

## Schedule and Environment

- Run every day at 10:00 AM in the `Asia/Bangkok` timezone.
- Run in the active local workspace: `D:\AI HEALTH & WELLNESS HUB`.
- Scan daily because production days can vary.
- If no new finished video is available, make no file or publishing changes.

## Source Detection

Search dated project folders below `social-assets/youtube` for the newest unprocessed finished long-form export.

A valid source must:

- Be a normal 7-8 minute long-form video, allowing a conservative 5-12 minute validation range.
- Contain both video and audio streams.
- Be a final export such as `final_capcut_export.mp4`, `final-capcut.mp4`, `final_capcut.mp4`, or `final.mp4`.
- Not be inside a `scenes` folder.
- Not be a draft, pre-finish file, picture-only render, silent render, sample, reference, rejected render, or previously generated short.

When several final-looking files exist in one project, prefer the most recently modified valid final export. Never process more than one source video in a single run.

## Duplicate Protection

Maintain `social-assets/automation/longform-to-short-processed.json` as a local processed-source record containing the source path, file size, modified timestamp, output slug, and processing date. Also check existing website and X-package outputs before processing. A source already represented by either record must be skipped.

Only add a source to the processed record after the video, website, deployment, and X-package checks have succeeded. A failed run must remain eligible for retry.

## Short Video Editorial Rules

Create one landscape short suitable for both X and the website.

- Target approximately 60 seconds, normally 50-70 seconds.
- Select the strongest self-contained passage with a clear hook, useful explanation, and satisfying takeaway.
- Use the source transcript, captions, script, or speech transcription to locate sentence boundaries.
- Begin at a natural phrase or sentence boundary.
- End after a complete sentence and before the next scene or thought begins.
- Inspect the final seconds manually or frame-by-frame so the ending never contains an abrupt fragment.
- Keep the original voice, imagery, captions, and audio character unless a small transition or fade is required for a polished ending.
- Export H.264 video with AAC audio in an X-compatible MP4.
- Preserve the source aspect ratio and avoid unnecessary recomposition.

Create a poster frame that is clear, representative, and free from awkward expressions, motion blur, or transition frames.

## Website Package and Publishing

For each processed source, create:

- `site/assets/videos/<slug>-short.mp4`
- `site/assets/videos/<slug>-poster.jpg`
- `site/articles/<slug>.html`

The article must:

- Use the established AI Health & Wellness Hub article structure and visual style.
- Embed the short video and poster.
- Explain the topic in clear, approachable language.
- Use constructive, non-hype health-technology framing.
- Avoid diagnosis, treatment promises, personalized medical advice, and unsupported medical claims.
- Cite current primary or authoritative health sources when factual medical context is included.
- Include the existing medical disclaimer and preserve all site-wide legal and contact elements.
- Include complete title, description, canonical, Open Graph, and article metadata using the clean production URL.

Add the new article exactly once to the homepage article list and sitemap. Do not change unrelated content, legal text, affiliate links, styling, or scripts.

Verify the site locally at desktop and mobile widths, confirm that the video loads and plays, run the required JavaScript syntax check, and verify that there is no horizontal overflow.

Stage only the exact website files created or modified for this article. Commit and push those files to the existing `main` branch so the current Netlify workflow publishes them. Never include unrelated dirty or untracked files. Confirm the live article and live video return successfully before marking the run complete.

If publishing fails, preserve the local outputs, do not mark the source as processed, and report the specific failure so the next run can retry safely.

## X-ready Package

Create a local package at `social-assets/x/YYYY-MM-DD-<slug>/` containing:

- `<slug>-x-short.mp4`
- `<slug>-poster.jpg`
- `x-post-copy.md`
- `x-article.md`

The X caption should be approximately 60-80 words, lead with the practical benefit, include the live article link, use one to three relevant hashtags, and remain accurate and publish-safe. The longer X article copy should summarize the website article in an X-friendly format.

The automation must never open the X composer, publish a post, schedule a post, or modify existing X content. The package is for human review and manual posting only.

## Verification and Completion Report

Before reporting success, verify:

- The source is a valid final long-form export.
- The short duration is within the accepted range.
- Video and audio streams are present.
- The final spoken sentence is complete.
- The last visual moment is intentional and not the start of a cut-off scene.
- Website and X video files are playable.
- The article passes desktop and mobile checks.
- Only intended site files were committed.
- The live article and video are reachable.
- The X package contains all four required deliverables.

The completion report should identify the source video, short duration, live article URL, X-package location, and any non-blocking warnings.

## Success Criteria

The automation is successful when every newly finished avatar or non-avatar long-form video is processed once, the website article and short are published automatically, the short ends cleanly on a complete sentence, and a review-ready X package is produced without any automatic X posting.
