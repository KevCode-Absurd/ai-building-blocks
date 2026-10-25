# When to use `/prompt-pipeline`

**What it does:** Compiles all upstream creative choices (brand DNA, theme, layout, levers, copy) into the final model-ready prompt string. Recommends which model to route to.

**Runtime:** 2 minutes.

## Run this when

1. **You're about to hit generate.** Last step before image production.
2. **Generations are off-brand.** Prompt is probably missing hex codes or brand anchor.
3. **Generations are inconsistent across variations.** Prompt is probably too long, losing attention.
4. **Debugging a model's text rendering.** Check whether text is quoted exactly.

## Before you run

- Brand DNA (or accept defaults)
- Theme chosen
- Layout spec
- 8 levers configured
- Copy finalized (if baked in)

## What you get back

- A model-ready prompt string (250-500 tokens)
- Token and cost estimate
- Model recommendation
- Negative prompt (what to avoid)
- Plain-English description of expected output

## Chains well with

- `/brand-dna` → `/layout-templates` → `/ad-design-levers` → `/photography-styles` → `/ad-copy` → `/prompt-pipeline` → `/generate-ad`

The pipeline skill is the second-to-last step before generation.
