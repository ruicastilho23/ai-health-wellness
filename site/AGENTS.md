# AGENTS.md

## Source of Truth

This `site/` folder is the active source for the live website:

```text
C:\Users\Lenovo_CT\Desktop\Health & Welness Hub All Files\site
```

Do not use the old inactive copy:

```text
C:\Users\Lenovo_CT\Desktop\AI Health and Wellness App Project\site
```

Before editing or deploying, verify that the current path contains `Health & Welness Hub All Files`, not `AI Health and Wellness App Project`.

Guidance for Codex or other coding agents working on this project.

## Project Summary

This is the **AI Health and Wellness App Project**, a static HTML/CSS/JS website with an integrated 7-day meal generator app.

The main site is built from:

- `index.html`
- `style.css`
- `app.js`
- `p5-hero.js`
- `assets/logo-ai-health.png`

## Core Rules

1. Preserve all original article content, meal-plan content, legal links, contact information, disclaimers, and Amazon affiliate links unless the user explicitly asks to change them.
2. Keep the visual direction professional, modern, dark navy, health-tech, and trustworthy.
3. Use dark green and blue gradients for all main buttons and CTAs. Do not change them back to violet/purple unless explicitly requested.
4. Keep the p5.js first-page background as floating glass bubbles unless the user asks for a different animation.
5. Keep the logo image in the header while preserving the existing text: `AI Health & Wellness Hub` and `Personalized health intelligence`.
6. Maintain responsive spacing carefully. Avoid large empty vertical gaps, overlapping UI, or text that overflows containers.
7. Do not remove the meal generator. It is part of the app experience.
8. When changing CSS or JS, bump the query-string cache version in `index.html` so browser preview updates immediately.

## Testing Checklist

After changes:

- Run `node --check app.js`.
- Run `node --check p5-hero.js` if edited.
- Preview at desktop and mobile widths.
- Check hero spacing, article-to-tools spacing, button wrapping, form layout, and meal generator output.
- Check that local preview opens at `http://127.0.0.1:5173/index.html`.

## Local Server

Start a local server from the project folder:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

## Deployment Notes

This project is suitable for Netlify static hosting. The subscribe form expects a Netlify function endpoint:

```text
/.netlify/functions/subscribe
```

Do not assume that function exists locally unless a Netlify functions folder is added later.
