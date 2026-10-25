# When to use `/layout-templates`

**What it does:** Produces a structural blueprint for an ad given a theme + aspect ratio. Output is an ASCII diagram + zone allocations + text hierarchy + CTA rules + 3-4 variations.

**Runtime:** 3 minutes.

## Run this when

1. **Starting a new ad.** Layout first, copy and visuals fill the zones.
2. **Briefing a designer.** Blueprint removes ambiguity. Designer knows exact space per zone.
3. **Generating AI images.** Gemini/REVE consume the layout spec for zone placement.
4. **Auditing a failed ad.** Is the zone allocation wrong? Is text over 30%?

## Before you run

- Theme (choose from 9)
- Aspect ratio (1:1 / 9:16 / 16:9)
- Optional: funnel position for validation
- Optional: product type for visual weight calibration

## What you get back

- ASCII layout diagram with zone percentages
- Text hierarchy rules (weight, case, word count caps)
- CTA position and contrast requirements
- 3-4 layout variations with use cases
- Do/Don't list for the theme

## Chains well with

- `/ad-design-levers` for visual direction that fills the zones
- `/generate-ad` to produce the image per layout
- `/ad-copy` to produce copy that fits the word count caps
- `/teep-framework` to ensure each zone carries a TEEP element
