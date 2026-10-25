---
name: prompt-pipeline
description: Build the optimized AI image generation prompt from brand DNA, theme, layout, levers, and copy. Produces the token-efficient prompt string sent to the model.
metadata:
  tags: prompt, pipeline, optimization, ai, image generation
---

# Prompt Pipeline

You compile all upstream creative configuration into a single model-ready prompt. Every choice (brand DNA, theme, layout, levers, photography style, copy) flows into one optimized string.

## STEP 1: Collect Upstream Inputs

Check for each (pull from cache if available):
- [ ] Brand DNA profile
- [ ] Chosen marketing theme + variation
- [ ] Layout template spec
- [ ] 8-lever configuration
- [ ] Photography style primary
- [ ] Copy (headline, sub, CTA)
- [ ] Aspect ratio
- [ ] Any explicit user overrides

If any are missing, flag and ask user whether to use defaults or run the upstream skill first.

## STEP 2: Build the Prompt in Sections

### Section 1: Brand anchor (always first)
```
Brand: [brand name]
Product: [product name]
Color palette: [3-5 hex codes]
Visual vocabulary: [backgrounds, lighting, props]
```

### Section 2: Scene description
```
Theme: [theme]
Layout: [primary zone allocation]
Mood: [from Lever 1]
Style: [from Lever 7]
Setting: [from Lever 6]
```

### Section 3: Product rendering
```
Product placement: [from Lever 4]
Camera angle: [from Lever 8]
Lighting: [from Lever 3]
Composition: [from Lever 5]
```

### Section 4: Text overlay (if any)
```
Headline: "[exact text]"
Sub: "[exact text]"
CTA: "[exact text]"
Typography: [family + weight]
Text placement: [zone from layout]
```

### Section 5: Negatives (what NOT to produce)
```
Avoid: [list]
```

## STEP 3: Compression

Most models have a sweet spot of 250-500 tokens. Compress without losing:
1. Brand colors (hex codes mandatory)
2. Product identification (always specific)
3. Mood + style (the two dominant qualitative anchors)
4. Layout (specific zone allocations)
5. Text if present (exact quotes)

Drop:
- Redundant adjectives
- Long brand history
- Audience demographic prose (model doesn't need it)
- Competitor comparisons

## STEP 4: Model Routing

Based on prompt content, recommend model:

| Content | Model | Why |
|---------|-------|-----|
| Photorealistic human, complex scene | Gemini 3.1 Flash default | Best photoreal |
| Text-heavy (80%+ of surface is text) | Gemini 2.5 Flash | Better text rendering |
| Macro / product-only | Gemini 3.1 Flash | Strong product |
| Illustration | Gemini 3 Pro | Better stylization |
| 4K output | Gemini 3 Pro at 4K | Only option |

## STEP 5: Deliver the Compiled Prompt

```
## Compiled Generation Prompt

### Model: [recommended]
### Token estimate: [count]
### Cost estimate: [$]

### Prompt

[final compressed prompt string]

### Negatives
[avoid list]

### Expected output
[what the image should look like in plain English]
```

## Rules

1. Always include 3-5 hex codes. No color adjectives alone (e.g., "pomegranate red" is not enough, needs #8B2635).
2. Always include aspect ratio tag at end of prompt.
3. Text overlays must be quoted verbatim. Model will transcribe what's in quotes.
4. Keep prompt under 500 tokens. Longer prompts dilute attention.
5. No em dashes in prompts or outputs.
