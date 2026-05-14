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

This report documents the pre-publishing audit and local fixes. Production should be verified again after pushing this audit batch to GitHub and after Netlify finishes the Git-based production deploy.
