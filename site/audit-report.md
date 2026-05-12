# Site Audit Report

Audit date: 2026-05-07

## Scope Checked

- Live homepage: https://www.obrasileiro.info/
- Meal plan page: https://www.obrasileiro.info/meal-plan
- Subscribe page: https://www.obrasileiro.info/subscribe
- Subscribe function: https://www.obrasileiro.info/.netlify/functions/subscribe
- WordPress content hub: https://aihealthtracking.wordpress.com
- WordPress public API site metadata and posts

## Functional Findings

1. Homepage brand/content mismatch
   - `www.obrasileiro.info` currently loads a Brazilian food/restaurant homepage.
   - The linked content hub and requested section structure are for "AI Health & Wellness Hub".
   - This is a major expectation mismatch for visitors and search engines.

2. Homepage HTML has malformed metadata
   - The Google verification meta tag is missing its closing `>`.
   - Current snippet:
     `<meta name="google-site-verification" content="A6kDBPErLChKOVUZSVLo7rZwYcNVtDfmisl-OujXmpo"`
   - Browsers may recover, but crawlers can parse the rest of the head unpredictably.

3. Subscribe endpoint is alive
   - A POST with an empty body returned `400 Bad Request` with `{"error":"Valid email is required"}`.
   - This is expected validation behavior and confirms the function responds.

4. Subscribe form behavior exists
   - `/subscribe` posts to `/.netlify/functions/subscribe`.
   - On success it redirects to `https://aihealthtracking.wordpress.com/your-free-7-day-ai-meal-plan-is-ready/`.
   - The page has loading/error/success states, but its visual style is inconsistent with the rest of the site.

5. HTTP redirect works
   - `http://www.obrasileiro.info` redirects to `https://www.obrasileiro.info/`.

6. Navigation mismatch
   - Current homepage navigation points to restaurant sections: Home, Menu, About, Gallery, Contact.
   - Requested content structure needs AI Nutrition, Fitness, Mental Wellness, Sleep, Tool Comparison, and 7-Day Challenge.

## SEO Findings

1. Wrong homepage SEO intent
   - The homepage title/description target Brazilian food in Koh Phangan, not AI health.
   - This conflicts with the WordPress content hub and requested AI-health site.

2. Important subscribe page is `noindex`
   - `/subscribe` includes `<meta name="robots" content="noindex">`.
   - This is fine if the page is only a private lead-capture page, but it should not be the only discoverable conversion page.

3. WordPress content contains schema pasted as visible HTML
   - The welcome article displays JSON-LD-like schema as paragraph content.
   - Schema should be emitted as `<script type="application/ld+json">`, not visible body text.

4. Split-domain authority
   - Core pages live on WordPress, while the custom domain hosts the homepage, meal plan, and subscribe flow.
   - This dilutes internal linking and creates brand/domain confusion.

5. Missing unified structured data
   - The rebuilt site should include WebSite, Organization, Article, FAQ/HowTo where applicable, and health disclaimer markup if publishing medically adjacent content.

6. Legal and trust pages exist in the WordPress hub
   - Medical Disclaimer, Privacy Policy, Terms of Use, Affiliate Disclosure, Contact, and About are linked from the hub and should remain accessible.

## Preserved Content Inventory

Published articles found:

- Welcome — Start Your AI Health Journey
- How AI is Revolutionizing Personal Nutrition: From Generic Plans to Personalized Meals
- AI-Powered Fitness: How Smart Technology is Transforming Your Workout
- AI and Mental Wellness: Technology for a Healthier Mind
- The Science of AI Sleep Optimization: Better Rest Through Technology
- Top AI Health Tools Compared: Which One is Right for You?
- Your 7-Day AI Health Kickstart Challenge

Conversion/content pages found:

- Free 7-Day AI Meal Plan
- Meal plan download/print page
- Subscribe form
- Thank-you page
- About, Contact, Medical Disclaimer, Privacy Policy, Terms of Use, Affiliate Disclosure

## Recommended Fixes Before Publishing

- Replace the restaurant homepage with the AI Health & Wellness Hub homepage or move restaurant content to a separate domain/subdirectory.
- Fix malformed head metadata immediately.
- Add canonical URLs and Open Graph/Twitter metadata.
- Keep `/subscribe` noindex if desired, but add visible subscribe CTAs throughout indexable pages.
- Move visible schema text into JSON-LD script tags.
- Consolidate internal links under the preferred production domain.
- Add a sitemap.xml and robots.txt that match the final domain strategy.
- Add a medical disclaimer link in the footer and near AI-health recommendation sections.
- Track subscribe CTA clicks and successful submissions.

