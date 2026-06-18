# Longevity Escape Velocity Video Article Design

## Goal

Publish the approved 60-second longevity video as a substantive, search-friendly article on AI Health & Wellness Hub and deploy it directly to the live Netlify site.

## Content

- Title: `Longevity Escape Velocity: Can Science Outrun Aging?`
- Lead with the cinematic 60-second video and a dedicated poster image.
- Explain the hypothesis in plain language, distinguish healthspan from lifespan, introduce geroscience, and separate promising research from proven human outcomes.
- End with practical, evidence-based healthspan priorities and the site's standard medical disclaimer.
- Cite authoritative primary or institutional sources already gathered for the long-form video research.

## Site Integration

- Create `site/articles/longevity-escape-velocity.html` using the established article layout.
- Copy the final MP4 and poster into `site/assets/videos/`.
- Add the article as the first item in the homepage article library.
- Add the canonical article URL to `site/sitemap.xml`.
- Include Open Graph, X card, Article, and VideoObject metadata for sharing and search discovery.

## Visual Direction

Preserve the existing dark navy health-tech article design. The video remains full-width within the article body, with a 16:9 aspect ratio, cinematic poster, native controls, and no autoplay. No new global design system or unrelated CSS changes are required.

## Verification And Release

- Confirm the copied video decodes, is 1920x1080, and has no subtitle stream.
- Validate local links, HTML structure, JavaScript syntax, sitemap entry, and media responses.
- Review the article at desktop and mobile widths.
- Deploy only from `D:\AI HEALTH & WELLNESS HUB\site` and verify the live article URL after release.
