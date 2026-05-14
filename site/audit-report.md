# Site Audit Report

Audit date: 2026-05-15

## Scope

- Source folder: `C:\Users\Lenovo_CT\Desktop\Health & Welness Hub All Files`
- Production domain: `https://www.aihealthwellness.com/`
- Netlify project: `ai-health-wellness-hub`
- GitHub repo: `ruicastilho23/ai-health-wellness`
- Production branch: `main`
- Publish directory: `site`
- Functions directory: `netlify/functions`

## Pre-Publishing Checks

1. Live crawl
   - 21 live pages checked.
   - All pages returned HTTP 200.
   - 208 internal links checked.
   - Broken internal links: 0.
   - 112 key assets checked.
   - Broken key assets: 0.

2. SEO metadata
   - Public HTML uses `www.aihealthwellness.com`.
   - No public HTML, sitemap, or robots file references the typo domain.
   - No public HTML, sitemap, or robots file references the Netlify subdomain as canonical.
   - All public HTML pages have title, description, canonical, robots, Open Graph URL, and Open Graph image metadata.
   - Overlong article/home title tags were shortened for cleaner search snippets.
   - `meal-plan.html` remains `noindex,follow` and is not listed in the sitemap.

3. Sitemap and robots
   - `sitemap.xml` uses `https://www.aihealthwellness.com/`.
   - `robots.txt` points to `https://www.aihealthwellness.com/sitemap.xml`.
   - Sitemap includes the public article and guide pages.
   - Sitemap excludes the gated generator page.

4. Generator and download workflow
   - Subscribe endpoint returns HTTP 200.
   - Subscribe response includes `generatorPath: "/meal-plan.html#free-meal-generator"`.
   - Generator page loads.
   - Generator creates a full 7-day plan with summary targets and Day 7 output.
   - PDF file returns HTTP 200 with `application/pdf`.
   - PDF buttons include the `download` attribute.

5. External resources
   - WordPress article images returned HTTP 200.
   - p5.js CDN asset returned HTTP 200.
   - Amazon affiliate links returned HTTP 200 with GET fallback.
   - Wellness app/tool links returned HTTP 200.
   - Replaced stale IASP crisis centres link with `https://findahelpline.com/`, which returned HTTP 200.

## Local Verification Commands

- `node --check site\app.js`
- `node --check site\p5-hero.js`
- Local HTML SEO metadata gate
- External link spot check for `https://findahelpline.com/`

## Publishing Status

GitHub and Netlify were updated after the fixes.

- Audit fixes commit: `703c16c8cd892dd9d8e0ba85b4d07be661035849`
- Verified content deploy: `6a062706c3f0c10007d2d463`
- Deploy state: `ready`
- Production URL: `https://www.aihealthwellness.com/`
- Note: later documentation-only deploys may have a newer deploy ID without changing the audited site workflow.

## Post-Deploy Verification

- Live crawl passed: 21 pages returned HTTP 200.
- Live internal link check passed: no broken internal links.
- Live asset check passed: no broken key assets.
- Live SEO metadata gate passed: no missing title, description, canonical, robots, Open Graph URL, or Open Graph image tags.
- Live sitemap and robots check passed.
- Live subscribe endpoint returned HTTP 200 and the generator path.
- Live browser generator check passed: the page generated the full 7-day plan through Day 7 with no console errors or warnings.
- Live PDF check passed: `assets/ai-health-7-day-meal-plan.pdf` returned HTTP 200 with `application/pdf`.
- Live external link check passed: 22 outbound links checked, with no broken links.

Publishing verdict: ready to publish articles.
