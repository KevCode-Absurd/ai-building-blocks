# When to use `/generate-ad`

**What it does:** Configures and produces AI-generated ad images from product + theme + visual direction. Handles generation, editing (text and style), and version control.

**Runtime:** 30-90 seconds per image.

## Run this when

1. **You need 3-6 creative variations fast.** Cheaper and faster than a designer for initial drafts.
2. **Testing theme hypotheses.** Generate the same product across 3 themes, see which resonates.
3. **Iterating on a winner.** Text/style edits in the same composition at $0.01-0.04 per edit.
4. **Format expansion.** Take a winning 1:1 and generate 9:16 and 16:9 versions.

## Do NOT use when

- You need a specific human model or scene that requires directed photography
- You need photorealistic humans holding the product (AI still struggles with this; use UGC)
- Legal claims need on-screen text proven (use designer for compliance-critical work)
- Brand requires photography contracts (AI output may conflict with contracted assets)

## Before you run

- Brand DNA profile (run `/brand-dna` first if missing)
- Chosen marketing theme (run `/persona-stage-theme` or `/brainstorm` first)
- Aspect ratio (1:1, 9:16, or 16:9)
- Optional: copy (headline, CTA) if you want text baked in

## What you get back

- 1-6 generated images
- Each stored in Supabase with parent-child edit history
- Cost per image logged
- Recommendations for next iterations

## Chains well with

- `/brand-dna` first (mandatory if not cached)
- `/layout-templates` for the structural blueprint
- `/ad-design-levers` for the 8-lever visual direction
- `/ad-copy` for the text that gets baked in
