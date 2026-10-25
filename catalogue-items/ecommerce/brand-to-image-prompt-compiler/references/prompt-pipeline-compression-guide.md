# Prompt Compression Guide

How to compress creative briefs into model-ready prompts without losing fidelity.

---

## The 500-Token Rule

Most image models have an attention sweet spot of 250-500 tokens. Beyond that, the later parts of the prompt are ignored or diluted. Aim for 300-450 tokens in production.

---

## What to Always Keep

1. **Hex codes** for all brand colors
2. **Aspect ratio** (tag at end)
3. **Subject identification** (what the ad shows, in one sentence)
4. **Product identification** (specific name, key visual distinguishing features)
5. **Text overlays verbatim** (in quotes)
6. **Mood + style** (two qualitative anchors max)
7. **Lighting** (one clear direction)
8. **Composition** (zones and placement)

## What to Always Drop

1. **Brand history prose** ("founded in 2020 by...")
2. **Audience demographics as prose** (model doesn't need "women 32-48 with disposable income")
3. **Marketing theory language** ("social proof theme with middle-funnel positioning")
4. **Redundant adjectives** ("beautiful, stunning, gorgeous, breathtaking")
5. **Competitor comparisons** unless the comparison is the ad
6. **Feature lists** unless they appear as text in the ad

---

## Compression Before / After

### Before (822 tokens)

```
We are creating a beautiful editorial lifestyle ad for VitaReds, a pomegranate greens drink
brand founded in 2022 by a skeptical wellness consumer who wanted a greens drink that
wasn't green. The brand targets women ages 32-48 who are wellness-literate but skeptical
of influencer-driven hype in the supplement space. The brand positioning is premium but
accessible, competing with Athletic Greens at a lower price point while emphasizing
97% third-party-tested absorption and 22 vegetables per serving. Our target audience
rejects transformational language and responds instead to anti-hype, verifiable claims.
The marketing theme we're targeting is social proof, specifically the multi-proof
variation which features multiple testimonials as the dominant visual. We want to use
the primary brand palette which includes #8B2635 (pomegranate red, primary brand color),
#F5F0EA (warm cream, background), #D4A574 (gold accent for CTAs and highlights), and
#1A1410 (near-black for text). The photography style should be documentary editorial,
meaning candid but elevated... [continues for 400 more words]
```

### After (298 tokens)

```
Editorial lifestyle photograph, 1:1 square.

Brand: VitaReds pomegranate greens.
Palette: #8B2635 (primary), #F5F0EA (bg), #D4A574 (accent), #1A1410 (text).

Scene: warm morning kitchen, natural window light. Woman late 30s, hair undone, holding
a clear glass of pomegranate-red drink. Smiling, looking off-camera. Real kitchen.

Composition: left half customer with product eye-level, right half pull-quote in
near-black sans: "Three weeks in. No 3pm crash. Just consistent energy." Below quote:
"Sarah, 38, verified customer" and 4.7-star rating.

Product visible in hand, sachet red clearly shown.

CTA bottom-right, small gold button: "Try 30 days"

Mood: trustworthy, relatable, warm.
Style: documentary-editorial, 50mm, slight shallow DOF.
Lighting: morning window, diffused.

Negatives: no studio sweep, no green drink, no influencer aesthetics, no dramatic
lighting, no models under 30, no product tub (sachet only), no extra text.
```

Same instruction, 64% fewer tokens, better model attention on each element.

---

## Compression Tactics

1. **Bullet over prose** — model parses structured prompts faster
2. **Quotes around text overlays** — prevents paraphrasing
3. **Hex codes in parens** — tighter than naming colors
4. **Negatives at end** — attention is strongest early and late
5. **Aspect ratio as first or last token** — models anchor layout to it
6. **Drop articles** where clarity allows ("woman holding glass" vs "a woman holding a glass")

---

## What Not to Compress

- Subject descriptions. If the prompt says "woman" without age, style, context, the model defaults will be generic and often misaligned.
- Product descriptions. Always specify what the product looks like. "Sachet" vs "tub" is a critical visual difference.
- Lighting direction. "Natural morning light" always beats "nice lighting".

---

## Debugging Compressed Prompts

If the output is wrong:
1. Check if the missing element survived compression. If you compressed it out, add it back.
2. Check if the negative list is being ignored. Move critical negatives up into the positive spec.
3. Check token count. Over 500 dilutes. Under 250 is often underspecified.
4. Check for contradictions. "Warm lighting" + "studio lighting" confuses the model.

---

## Tool Note

The system uses `prompt-optimizer.ts` to auto-compress creative briefs. This skill is the manual walkthrough when automation output is off.
