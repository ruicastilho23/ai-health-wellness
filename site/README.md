# AI Health and Wellness App Project

Static website and integrated meal-plan app for AI Health & Wellness Hub.

## What This Project Contains

- Modern AI Health & Wellness landing site.
- Preserved original content: AI nutrition, fitness, mental wellness, sleep, tool comparison, 7-day challenge, meal plan, disclaimers, contact/legal links, and affiliate links.
- Interactive 7-day meal generator using user weight, goal, and diet preference.
- p5.js animated glass-bubble hero background.
- Custom AI Health logo in `assets/logo-ai-health.png`.
- Local preview server files for opening the site in a browser.

## Main Files

- `index.html` - main website structure and content.
- `style.css` - full visual system, responsive layout, spacing, typography, and button styling.
- `app.js` - navigation, counters, reveal animations, subscribe flow, and meal generator logic.
- `p5-hero.js` - animated bubble background.
- `assets/logo-ai-health.png` - cropped logo emblem used in the header.
- `audit-report.md` - audit notes and SEO recommendations from the original site review.
- `robots.txt` and `sitemap.xml` - SEO support files.
- `preview-server.js` and `OPEN_SITE.bat` - local preview helpers.

## Preview

From this folder, run:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173/index.html
```

## Current Design Direction

- Dark navy health-tech interface.
- Dark green and blue gradients for buttons.
- Glassmorphism panels and cards.
- Professional typography with Inter and Space Grotesk.
- Responsive layout optimized for desktop, tablet, and phone.
- Animated floating bubbles on the first page.

## Notes

The site is currently static HTML/CSS/JS and can be deployed on Netlify. The subscribe form is designed to call the Netlify function at `/.netlify/functions/subscribe` when deployed.
