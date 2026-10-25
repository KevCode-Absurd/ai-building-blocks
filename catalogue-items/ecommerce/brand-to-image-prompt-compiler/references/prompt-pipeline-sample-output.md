# Sample output: `/prompt-pipeline`

VitaReds. Social Proof theme. 1:1 square. Redacted.

---

## Compiled Generation Prompt

### Model: Gemini 3.1 Flash (Nano Banana 2)
### Token estimate: 312
### Cost estimate: $0.036

---

### Prompt

```
Editorial lifestyle photograph, 1:1 square, 1080x1080.

Brand: VitaReds pomegranate greens.
Palette: deep pomegranate red (#8B2635), warm cream (#F5F0EA), gold accent (#D4A574), near-black text (#1A1410).

Scene: warm morning kitchen counter, natural window light, slight golden cast. A woman in her late 30s, hair slightly undone, holding a clear glass filled with the pomegranate-red VitaReds drink. She's smiling naturally, looking off-camera. Linen napkin and ceramic mug nearby. Real kitchen, not a set.

Composition: left half customer holding product eye-level, right half pull-quote in near-black sans-serif: "Three weeks in. No 3pm crash. Just consistent energy." Below quote, smaller attribution: "Sarah, 38, verified customer" and 4.7-star rating.

Product placement: product clearly visible in her hand, not hidden. Sachet color (pomegranate red) must be visible.

Text overlay: headline already integrated above. Font: Inter, medium weight for pull-quote, regular for attribution. Left-aligned text block on right half.

CTA (bottom-right corner, small, gold button): "Try 30 days"

Mood: trustworthy, relatable, warm.
Style: documentary-editorial, slight shallow depth of field at 50mm equivalent.
Lighting: natural morning window, diffused, warm.

Negatives: no studio sweep, no green drink, no influencer aesthetics, no dramatic lighting, no text on image other than the quote/attribution/CTA shown, no extreme close-up, no models under 30, no fluorescent lighting, no product tub (sachet only).
```

### Aspect ratio: 1:1

---

## Expected Output

A photograph-style ad with:
- Real-looking woman (not model-type) in a warm morning kitchen
- Holding a clear glass of red drink (not green)
- Quote dominant on right half, photo on left
- Product clearly identifiable
- Small gold CTA bottom-right
- Overall mood: warm, trustworthy, not promotional

---

## Compression Notes

- Dropped: 120 tokens of brand history and audience prose
- Dropped: competitor comparison language (model doesn't need it)
- Kept: all hex codes, exact text quotes, style anchors
- Final: 312 tokens, well within 500-token sweet spot

## If this prompt fails

Symptom → Fix:
- Product shows green → Strengthen "pomegranate red, not green" in negatives
- Woman looks too model-like → Add "not a model, real customer, age 35-45"
- Text rendering garbled → Reduce text volume or re-route to Gemini 2.5 Flash
- Kitchen feels staged → Add "real lived-in kitchen, not rented set"
- Scene too dark → Brighten by specifying "morning sun through window, 10am light"
