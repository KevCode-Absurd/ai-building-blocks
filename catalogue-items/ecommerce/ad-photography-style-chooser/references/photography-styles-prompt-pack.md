---
name: photography-styles
description: Select and configure photography style for AI ad generation. 12 styles with product fit, audience fit, and brand fit matrix.
metadata:
  tags: photography, style, ai, generation, visual
---

# Photography Styles

You pick the right photography style for an ad. Style is Lever 7 of the 8-lever system and is often the most impactful single choice for brand fit.

## STEP 1: Collect Context

- Product / category
- Brand positioning (premium / value / niche)
- Audience (age, gender skew, digital literacy)
- Platform (feed / story / Reel / YouTube)

## STEP 2: The 12 Styles

### Product-first
1. **Studio product photography** — clean, commercial, white or gradient sweep. Default for features.
2. **Flat lay / overhead** — product plus accessories on a surface. Good for lifestyle adjacency.
3. **Macro close-up** — extreme detail, 85mm lens feel. Good for texture and craftsmanship.

### Lifestyle
4. **Documentary lifestyle** — candid, natural light, real people. Default for cold.
5. **Editorial magazine** — polished, aspirational, controlled. Premium brands.
6. **UGC/iPhone aesthetic** — vertical, handheld, shaky. Cold prospecting wins.

### Direct-response
7. **Split comparison** — before/after, us/them. Must be clearly labeled.
8. **Infographic hybrid** — product plus diagrammatic callouts. Features-heavy.
9. **Meme/graphic** — text-driven, low fidelity. Cultural moment ads.

### Brand-driven
10. **Fashion editorial** — high production, models, location. Apparel.
11. **Food photography** — styled, warm, appetizing. Food/bev.
12. **Interior photography** — environmental, architectural. Home goods.

## STEP 3: Style-to-Context Matrix

| Context | Best Style | Avoid |
|---------|-----------|-------|
| Cold prospecting, 25-45 audience | UGC/iPhone | Editorial magazine |
| Premium brand, established | Editorial or fashion | UGC |
| Skeptical audience | Documentary lifestyle | Studio (feels ad-y) |
| Features-heavy claim | Infographic hybrid | Lifestyle |
| Before/after claim | Split comparison | Single scene |
| Food/bev | Food photography | Studio |
| Tech/SaaS | Studio or infographic | Lifestyle |
| Supplement | Documentary or editorial | Meme |

## STEP 4: Deliver Spec

```
## Photography Style Spec

Product: [name]
Brand positioning: [premium / value / niche]
Audience: [description]

### Primary Style: [style name]
Why: [fit reasoning]
Reference: [2-3 example brands using this style well]

### Secondary Style (for variation testing): [style name]
Why: [different hypothesis to test]

### Avoid: [style name]
Why: [would break brand or audience fit]

### Execution Notes
- Lighting: [specific guidance]
- Lens feel: [focal length / depth of field]
- Color grading: [warm/cool/neutral]
- Talent: [age/gender/energy]
- Props: [list]
```

## Rules

1. Never recommend more than 2 styles. More = no decision made.
2. UGC is default for cold prospecting, not a fallback.
3. Never mix editorial + UGC in the same campaign. Pick one aesthetic.
4. Style is Lever 7 and usually locked per brand. Don't make it variable per ad.
5. No em dashes.
