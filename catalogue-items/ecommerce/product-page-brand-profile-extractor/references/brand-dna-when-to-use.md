# When to use `/brand-dna`

**What it does:** Extracts a complete brand DNA profile from a product URL. Output is the foundation for all downstream creative (briefs, layouts, copy, images).

**Runtime:** 3-5 minutes.

## Run this when

1. **Starting work with a new client or new product.** Before any ad is written or generated.
2. **Creative keeps feeling off-brand.** Profile exposes what the brand actually is vs what the team assumed.
3. **Handing off to a new designer.** Profile is a one-page brand brief.
4. **Building an AI image prompt.** Profile feeds color palette, visual vocabulary, and theme selection.

## Before you run

- Product URL (required)
- Brand name and category (optional, helps calibration)
- Existing brand guidelines if available (saves extraction time)

## What you get back

- Product data (name, price, description, features)
- Marketing intelligence (10 elements: mechanism, claims, testimonials, objections, audience, authority, positioning, ingredients, USPs, emotional triggers)
- 6-color palette with hex codes
- Visual vocabulary (backgrounds, lighting, props, mood, photography style)
- Top 3 recommended marketing themes with reasoning

## Chains well with

- `/generate-ad` uses the color palette and visual vocabulary directly
- `/layout-templates` uses the recommended theme
- `/ad-design-levers` uses brand positioning for mood calibration
- `/ad-copy` uses the marketing intelligence as source material
