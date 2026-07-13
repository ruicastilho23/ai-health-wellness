# Mandatory HyperFrames Card Kit Integration

## Goal

Upgrade both AI Health long-form video skills so every information, evidence, comparison, source, statistic, and presenter-adjacent card uses the local HyperFrames motion-card kit. Keep the official HyperFrames catalog mandatory for charts, maps, transitions, parallax, captions, and outros.

## Source Package

Use this local package as the single source of truth for card construction and styling:

`D:\AI HEALTH & WELLNESS HUB\social-assets\youtube\ai-health-youtube-graphics-kit\motion-cards`

The package supplies:

- `code-diff` for evidence corrections, before/after comparisons, and claim-versus-evidence cards.
- `code-morph` for staged information such as signal → pattern → action.
- `caption-pill-karaoke` for short designed emphasis inside card treatments, never as burned-in narration subtitles.
- The complete clinical card design system: dark technical surfaces, JetBrains Mono/system monospace typography, rounded caption typography, clinical blue, evidence green, caution red, spacing, borders, shadows, and deterministic GSAP motion.
- HyperFrames configuration, lint/validate/inspect commands, and a package test.

## Mandatory Routing

Route every card scene through this package:

| Content type | Required package treatment |
|---|---|
| Information/explanation | `code-morph` shell or a direct adaptation of its state system |
| Evidence/claim correction | `code-diff` |
| Comparison | `code-diff` or a composition derived directly from its row system |
| Source/citation | Package-styled technical card using the same tokens and motion grammar |
| Statistic/key figure | Package-styled technical card; use the official catalog `data-chart` when the scene is a chart rather than a card |
| Presenter-adjacent card | Package-styled overlay placed in negative space within Dr. Ava Chen's full-frame 16:9 panoramic studio shot; never crop her into a side panel |

Adapt only topic data, wording, duration, layout density, and approved brand accents. Preserve the package's structure, visual tokens, and authored motion language. Do not substitute generic glass cards, hand-rolled HUDs, static text boxes, or unrelated catalog cards.

## Official Catalog Boundary

Continue using exact installed official HyperFrames catalog items for:

- Charts and data visualizations
- Maps and flow diagrams
- Transitions and effects
- Parallax treatments
- Editorial captions and lower thirds that are not cards
- Outros

The local card kit complements the official catalog; it does not replace these catalog families.

## Skill Changes

Update both:

- `ai-health-longform-multitool-video`
- `ai-health-avatar-longform-video`

For each skill:

1. Add the card-kit path to mandatory reading/preflight.
2. Add a fail-closed card-routing rule to the production workflow and launcher prompt.
3. Copy the package into each new video project at `hyperframes/card-kit/` before adaptation so the render is reproducible and never depends on an ambiguous imitation.
4. Record every card in a card-kit usage manifest with scene ID, content category, package composition, source path, rendered file, and preview result.
5. Require lint, validate, inspect, render, and visual-review proof for every card composition.
6. Reject delivery when a required card uses an unapproved style or lacks package provenance.
7. Preserve the existing subtitle-free master rule; `caption-pill-karaoke` may only provide short designed emphasis inside card treatments.

## Hermes Deployment

After each Codex skill passes its tests and validation, copy the complete skill folder to:

`C:\Users\Lenovo_CT\.hermes\skills\<skill-name>`

Hermes copies must be byte-equivalent to the validated Codex copies for all skill instructions, references, templates, scripts, and tests.

## Validation

Use a red-green-refactor skill test for each production skill:

1. Baseline: demonstrate that the existing skill can route a source, statistic, or presenter-adjacent card to an official catalog/generic card without requiring the local kit.
2. Updated behavior: verify the skill requires the correct package treatment and manifest evidence.
3. Run existing unit tests and `quick_validate.py` for each skill.
4. Compare Codex and Hermes skill folders recursively by relative path and file hash.

## Failure Handling

Fail closed when the motion-card package is missing, unreadable, does not pass its checks, or cannot render the required treatment. Repair or regenerate the card from the package; never downgrade to a generic, static, or improvised card.
