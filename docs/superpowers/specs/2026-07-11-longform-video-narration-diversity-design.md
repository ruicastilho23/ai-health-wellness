# Long-Form Video Narration and Visual-Diversity Refinement

## Scope

Update only the reusable no-avatar long-form video skill and its launcher prompts. Do not remake the completed AI heart-risk video. Do not create the separate Dr. Ava Shen avatar-video workflow yet.

## Approved defaults

1. Deliver a clean YouTube master with no burned-in automated subtitles, karaoke captions, or sentence-by-sentence narration text. Short designed editorial text remains allowed for hooks, section titles, chart labels, key figures, source labels, safety notes, and calls to action.
2. Use `en-US-AvaMultilingualNeural` throughout every future no-avatar video. Her delivery must be warm, calm, intelligent, medically credible, conversational, and non-alarmist. Treat this as the audio identity associated with the future Dr. Ava Shen brand, without implying that the no-avatar video contains or depicts Dr. Ava Shen.
3. Generate one unique image plate for every image-led scene. Never reuse an image file, crop, or derived variant in the same video.
4. Prevent semantic repetition, not only duplicate files. Create a visual-diversity ledger recording each plate's visual family, subject, environment, camera treatment, dominant palette, focal object, provider, prompt, and timeline use.
5. Use 20–26 fresh plates for a typical 45–55-scene program. Include at least eight visual families, use no family more than three times, and never place the same family in adjacent image-led scenes.
6. Make GPT Image a core provider: target at least six plates from GPT Image and at least eight from Imagen, with FAL/FLUX available for additional variation. If a named provider is unavailable, stop and report the provider failure instead of silently substituting procedural imagery.
7. Reject duplicate prompts and near-duplicate compositions during a full contact-sheet review before assembly. Quantity does not compensate for sameness.

## Validation design

Extend the validator to fail when:

- `caption-plan.csv` contains subtitle, transcript, karaoke, or full-narration caption modes.
- `narration-voice.json` does not identify one adult female voice.
- A generated asset is used by more than one visual-score row.
- Fewer than eight visual families are recorded, a family appears more than three times, or adjacent image-led scenes share a family.
- GPT Image or Imagen minimums are missing from the provider log.
- Required diversity evidence files are absent.

Require `visual-diversity-ledger.csv`, `narration-voice.json`, and an all-plates contact sheet in every final package.

## Success criteria

A future agent cannot satisfy the skill by using a male voice, burning narration subtitles, renaming similar images, repeating one clinical room from different angles, or invoking a vague “storytelling purpose” exception.
