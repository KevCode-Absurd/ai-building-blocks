# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean first checkpoint: the script is kept word for word, every panel has a transition, the reveal is longest, and the avatar card is simple and non-customer. It correctly said it could not see the photo and marked the photo, pack look, brand colours, offer and tool limits as MISSING instead of guessing, then stopped for approval as the skill requires.

## Judge list

- Met: Stopped for approval after the avatar card (stages 1, 3 and 4), unless asked to run all in one go
  "Checkpoint 1 of 3. Approve the panel list, ink line and avatar card... I'll write the reference image prompts (stage 2) once you approve."
- Met: Every panel has a named transition, and the reveal panel is the longest
  All 7 panels carry a transition; "P4 | moment to moment (the reveal)... 6 (5 s clip + 1 s hold)" is the longest.
- Met: Lock lines the same word for word in every prompt
  Only one hero line exists so far ("to be repeated word for word in every later prompt"); no prompts yet to contradict it, run stopped at stage 1.
- Met: No prompt asks the tool to draw words or numbers; each clip has one kind of motion
  No image or clip prompts written yet (correctly stopped); it already states label words "appear only on the P7 photo".
- Met: The last panel is the real product photo, set in editing
  "P7 ... A real photo of the Sprout pouch in the same border and gutter colour. The offer is text set in edit."

## What went in

```text
Script (30 s, from "Tell your buyer's story in comic panels that
sell"). Claim: "60+ ingredients, 21 vitamins & minerals, and 6g
fiber" in 1 pack.
P1 "Every morning, the same chalky glass." CHOKING ON POWDER AGAIN
P2 "Then the shaker sits in the sink." THE SHAKER WINS AGAIN
P3 "So the whole lot went in one pack." 60+ INGREDIENTS / 6G FIBER
P4 "One small handful a day." RIP. TIP. ENJOY.
P5 "Same kitchen. Nothing to rinse." NO SHAKER TO WASH
P6 (no narration) out the door. P7 photo panel, offer text.
Hero: an adult woman, round simple face, dark ponytail, navy
blazer over a white top, small gold hoop earrings.
Product: Sprout pouch, photo attached (glossy deep green, big yellow
wordmark, yellow bear face top right, "28 Daily Packs").
Use: tear one daily pack straight across the top, tip into palm.
```

## What came out

```text
I write the prompts only. No video tool is connected here, so no pictures or clips will come out of this chat. At the end I'll explain how to make them.

I can't see a photo in this chat, so I'm working from your description of the pouch.

---

## 1. Panel list, ink line and avatar card (stages 0 and 1)

### Fit check
This script fits a motion comic. It is a short problem-and-fix story around one claim. It doesn't rest on proof from a real person, and the pouch is judged by how it looks, not how it pours or fits. One limit: the drawings can't *show* "60+ ingredients" or "21 vitamins & minerals". Those words stay in the caption and on the photo panel. P3 shows the pouch only, with no invented ingredients drawn around it.

### Panel list (30 s, 9:16, hard cuts)

| # | Transition in | What's drawn (one large thing) | Narration (locked) | Caption (locked, lettered in edit) | Sec |
|---|---|---|---|---|---|
| P1 | scene to scene (opening) | The hero at a kitchen counter, grimacing over a cloudy glass, with a sweat drop. | "Every morning, the same chalky glass." | CHOKING ON POWDER AGAIN | 4 |
| P2 | action to action | The same hero drops the powder-crusted shaker into a full sink, under a small storm cloud. | "Then the shaker sits in the sink." | THE SHAKER WINS AGAIN | 4 |
| P3 | subject to subject | The eye moves to the Sprout pouch standing upright on the same counter. | "So the whole lot went in one pack." | 60+ INGREDIENTS / 6G FIBER | 4 |
| P4 | moment to moment (**the reveal**) | Close on her hands: she tears one daily pack straight across the top and tips it toward her palm, slowed down. | "One small handful a day." | RIP. TIP. ENJOY. | **6** (5 s clip + 1 s hold in edit) |
| P5 | subject to subject | The same kitchen with an empty, dry sink. The hero smiles, relaxed. | "Same kitchen. Nothing to rinse." | NO SHAKER TO WASH | 4 |
| P6 | scene to scene | The hero steps out of her front door into morning light. | (none) | (none) | 3 |
| P7 | subject to subject (photo panel) | A real photo of the Sprout pouch in the same border and gutter colour. The offer is text set in edit. | (none) | offer: `MISSING: current offer` | 5 |

- **Panel count:** 6 drawn panels plus the photo panel.
- **Mood transitions:** "aspect to aspect" is not used, so the story never stalls.
- **Reveal length:** P4 is the longest panel at 6 s.
- **Narration and captions:** every narration line is 10 words or fewer, and every caption is 6 words or fewer.

### Ink line
- **Line:** clean, even black brush-pen outlines. The weight is medium for figures and heavier for the product's outline. Interior lines are thin.
- **Fills:** flat colour only, with no gradients and no rendered texture.
- **Shadow:** one flat shadow tone (a cool light grey), with hard edges.
- **Halftone:** light halftone dots in backgrounds only. Never on the face or the product.
- **Palette** `[inferred]`, black plus 4 flat colours:
  - warm off-white for walls, paper and the white top
  - dusty, desaturated navy for the blazer
  - Sprout deep green, used on the product only
  - Sprout yellow, used on the product and the tiny earrings only
- **Border:** a thin black panel border inset from the screen edges, with a warm off-white gutter all around.

### Avatar card
- **Who:** one adult woman, the hero and narrator. She is not presented as a customer, an expert or someone reporting a result.
- **Face:** a round, simple, open face with dot eyes, short line brows, a small curved mouth and no nose detail beyond one short line. There are no lashes, blush or realistic shading.
- **Hair:** one shape, a dark (black-ink) ponytail with a smooth flat fill and a single highlight gap.
- **Clothes:** two colours only, a dusty navy blazer over a plain white top. There are no patterns or logos.
- **Accessory:** small gold hoop earrings, drawn as yellow circles with a black outline.
- **Body:** an average adult build in simple proportions, with simple four-finger-plus-thumb hands.
- **Narrator voice:** a warm, dry, slightly wry adult woman's voice. She speaks unhurried and conversational, like telling a friend about her morning. The voice is designed, not cloned from anyone.
- **Never changes:** the round face, the dot eyes, the ponytail shape, navy blazer over white top, the gold hoops, and adult age. No extra accessories, makeup detail or realistic face rendering.

**Hero line (to be repeated word for word in every later prompt):**
> One adult woman drawn in flat 2D ink: round simple face, dot eyes, short line brows, small curved mouth, smooth dark ponytail, dusty navy blazer over a plain white top, small gold hoop earrings, simple adult proportions.

---

**Missing (I'll keep going around these and never guess):**
- `MISSING: product photo` (front, side, top, out of pack). I'll draw the product sheet from your description: a glossy deep green pouch with a big yellow wordmark and a yellow bear face at top right. It can't be checked against the real pack. The label words "Sprout" and "28 Daily Packs" will appear only on the P7 photo.
- `MISSING: what's inside a daily pack` (shape, colour, size). Until then, P4 shows the tear and the tip with her hand closing over the contents. Nothing inside gets drawn.
- `MISSING: daily pack look` (wrapper colour and shape) for P4.
- `MISSING: exact brand colours, lettering typeface, "never show" list`. The palette above is marked `[inferred]`.
- `MISSING: current offer` for P7.
- `MISSING: tool limits`. I'm planning one 3 to 5 s clip per panel.

**Checkpoint 1 of 3.** Approve the panel list, ink line and avatar card, or tell me what to change. I'll write the reference image prompts (stage 2) once you approve.
```
