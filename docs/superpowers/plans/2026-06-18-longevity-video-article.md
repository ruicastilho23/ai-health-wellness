# Longevity Video Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a video-led longevity escape velocity article on the live AI Health & Wellness Hub site.

**Architecture:** Reuse the static site's established article template. Store the MP4 and poster under `site/assets/videos`, link the article from the homepage library, expose it in the sitemap, and deploy the existing Netlify publish directory.

**Tech Stack:** Static HTML, CSS, JavaScript, HTML5 video, JSON-LD, Netlify CLI

---

### Task 1: Prepare media assets

**Files:**
- Create: `site/assets/videos/longevity-escape-velocity-60s.mp4`
- Create: `site/assets/videos/longevity-escape-velocity-poster.jpg`

- [ ] **Step 1: Copy the verified final video into the site media folder**

Run `Copy-Item -LiteralPath 'social-assets\x\2026-06-18-longevity-escape-velocity\x-longevity-escape-velocity-60s.mp4' -Destination 'site\assets\videos\longevity-escape-velocity-60s.mp4'`.

- [ ] **Step 2: Create the poster from the approved cinematic frame**

Run `ffmpeg -y -ss 6 -i site/assets/videos/longevity-escape-velocity-60s.mp4 -frames:v 1 -q:v 2 site/assets/videos/longevity-escape-velocity-poster.jpg`.

- [ ] **Step 3: Verify the media**

Run `ffmpeg -v error -i site/assets/videos/longevity-escape-velocity-60s.mp4 -f null NUL` and `ffprobe` to confirm 1920x1080 H.264/AAC, about 60 seconds, and zero subtitle streams.

### Task 2: Create the article

**Files:**
- Create: `site/articles/longevity-escape-velocity.html`

- [ ] **Step 1: Create SEO and social metadata**

Use the canonical URL `https://www.aihealthwellness.com/articles/longevity-escape-velocity.html`, the poster URL under `/assets/videos/`, and `Article` plus `VideoObject` JSON-LD. The title is `Longevity Escape Velocity: Can Science Outrun Aging?`.

- [ ] **Step 2: Add the article hero and video**

Use the existing `article-page`, `article-detail`, `article-hero`, and `article-body` classes. Add a native video element:

```html
<video controls preload="metadata" poster="../assets/videos/longevity-escape-velocity-poster.jpg">
  <source src="../assets/videos/longevity-escape-velocity-60s.mp4" type="video/mp4">
</video>
```

- [ ] **Step 3: Add evidence-based article copy**

Cover the definition, geroscience, evidence ladder, biomarker limitations, practical healthspan, authoritative sources, and medical disclaimer. Do not claim that aging can currently be reversed or recommend longevity drugs.

- [ ] **Step 4: Validate internal links and structured data syntax**

Confirm every relative link resolves inside `site` and parse each JSON-LD block with `JSON.parse`.

### Task 3: Add discovery paths

**Files:**
- Modify: `site/index.html`
- Modify: `site/sitemap.xml`

- [ ] **Step 1: Add the new first article card**

Insert a card before the AI cancer article using category `Longevity Science`, the article title, a concise evidence-led summary, and `articles/longevity-escape-velocity.html`.

- [ ] **Step 2: Add the sitemap URL**

Add `<url><loc>https://www.aihealthwellness.com/articles/longevity-escape-velocity.html</loc><priority>0.8</priority></url>`.

- [ ] **Step 3: Run static checks**

Run `node --check site/app.js`, parse `site/sitemap.xml`, and scan the new article for required metadata, video paths, disclaimer, and source links.

### Task 4: Preview and deploy

**Files:**
- Verify: `site/articles/longevity-escape-velocity.html`
- Verify: `site/index.html`

- [ ] **Step 1: Start and verify the local site**

Serve `site` at `http://127.0.0.1:5173/` and confirm HTTP 200 for the homepage, article, MP4, and poster.

- [ ] **Step 2: Review desktop and mobile layouts**

Capture the article at 1440x900 and 390x844. Confirm the video remains 16:9, text does not overflow, the presenter is fully visible, and navigation remains usable.

- [ ] **Step 3: Run the predeployment check**

Run `powershell -ExecutionPolicy Bypass -File scripts/predeploy-check.ps1` and resolve any failures related to this change.

- [ ] **Step 4: Deploy the active site to Netlify**

Run the linked site's production deployment from `D:\AI HEALTH & WELLNESS HUB`, using `site` as the publish directory.

- [ ] **Step 5: Verify the live release**

Confirm HTTP 200 for the live article, poster, and MP4, then check that the homepage contains the longevity article link.
