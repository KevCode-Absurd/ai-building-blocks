---
name: reel-cover
description: Generate Instagram Reel cover images with your presenter’s headshot on a dark textured background with turquoise accent text
metadata:
  tags: reel, cover, instagram, thumbnail, headshot, cover art
---

# Reel Cover Generator

You generate 1080x1920 Instagram Reel cover images with a consistent visual identity: dark textured background, headshot, bold title text with a turquoise accent on one word, and small logo bug.

## How This Works

1. User provides a Reel title (or asks you to write one from topic)
2. You pick the accent word (the one that earns the turquoise)
3. You compose the cover to the cover recipe
4. You output the image

---

## STEP 1: Collect Inputs

| Input | Required | Default |
|-------|----------|---------|
| Headshot image | Yes | Uploaded once, reused |
| Reel title | Yes | - |
| Accent word | Optional | System picks |
| Theme mood | Optional | "serious, premium, dark" |
| Logo | Optional | logo bug bottom left |

---

## STEP 2: Cover Recipe

```
Canvas:             1080 x 1920 (9:16)
Background:         Dark charcoal (#0B0D0E) with grain texture, soft vignette
Headshot placement: Bottom 40% of canvas, right-aligned, cut out clean
Headshot style:     Natural color, slight warmth, 100% crop from chest up
Text placement:     Top 55% of canvas, left-aligned, 4-5 line stack
Primary text color: Cream white (#F2EFE8)
Accent color:       Turquoise (#2CC5B8)
Typography:         Bold condensed sans. Heavy weight. Tight line height.
Logo:               logo bug, 60px wide, bottom-left, 80% opacity
```

---

## STEP 3: Title Rules

- 4-8 words max (longer won't read on mobile feed)
- Line-broken for max 3-4 visual lines
- One accent word gets turquoise (usually the payoff word, number, or pattern-interrupt)
- Sentence case or all-caps consistent within a batch
- No punctuation at end (titles, not sentences)

### Accent word heuristic
Pick the word that carries the hook's emotional or numeric punch:
- "I Built a $10M **Agency** With AI" — Agency
- "This AI Wrote Ads That **Outperformed** Mine" — Outperformed
- "**3** Agents Every Founder Needs" — 3
- "The Hook That **Broke** Our CPA" — Broke

One accent per cover. Never two.

---

## STEP 4: Output

Image file: 1080x1920 PNG, sRGB, 72 DPI (social-optimized).

Also return:
- Title text as delivered
- Accent word highlighted
- File path or URL

---

## Rules

1. Headshot is always right-aligned bottom. Never centered. Never left.
2. Text is always left-aligned top. Never centered.
3. Turquoise appears on exactly one word.
4. Background is always dark charcoal with grain. No gradients, no images.
5. No em dashes in titles.
6. Logo bug goes bottom-left at 80% opacity. Never top.
