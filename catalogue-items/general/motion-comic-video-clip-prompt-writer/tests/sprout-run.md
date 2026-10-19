# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run did stages 0 and 1 cleanly: a correct 30-second panel list with named transitions, the reveal held longest, an ink line and a simple avatar card, then it stopped for approval as the skill requires. It invented nothing, flagged the unseen product photo, pack contents, label words, P6 caption and offer text as MISSING rather than guessing, and kept the tear direction to the brand's straight-across rule.

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard.
  "Stopping here. Please approve or edit the avatar card." Stopped at approval 1 as required; stages 3 and 4 not yet reached.
- Met: Every panel has a named transition, and the reveal panel is the longest.
  All P1 to P7 carry a transition; "P4 | moment to moment (the reveal) ... 5 (longest)" against 4 or 4.5 s elsewhere.
- Met: The lock lines are the same, word for word, in every prompt.
  Not yet applicable: no sheet, storyboard or clip prompts exist because the run correctly stopped before stage 3.
- Met: No prompt asks the tool to draw words or numbers, and each clip has one kind of motion.
  No image or clip prompts written yet; captions marked "for editing" and label words reserved "only on the photo panel".
- Met: The last panel is your real product photo, set in editing.
  "P7 | subject to subject: photo panel of the real pouch, set in editing"

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
I can't make pictures or video in this chat; I'll write every prompt, and at the end I'll explain how to turn them into clips.

# 1. Panel list, ink line and avatar card (stages 0 and 1)

## Script check
- **Fit:** This works as a motion comic. It is a short problem-and-fix morning story built around one claim, and it doesn't depend on a real person's proof or on how the product pours or stretches.
- **Script:** Locked and unchanged. All 7 panels fit 30 s.
- **Product photo:** `MISSING: product photos.` I can only see your description of the pouch, not the photo itself. Until the real photos arrive, I can't check the product sheet against the actual pack. Please attach:
  - pouch front
  - pouch side
  - pouch top
  - one daily pack, sealed
  - one daily pack torn open
  - the contents tipped into a palm
- **Contents:** `MISSING: what is inside a daily pack` (shape, colour, how many pieces). P4 and P5 can't be drawn until I know this. I won't guess.
- **Label words:** `MISSING: all label words, word for word.` So far I have the wordmark "Sprout" and "28 Daily Packs". These words will appear only on the photo panel.
- **P6 caption:** `MISSING: P6 caption`, or confirm the panel has none.
- **P7 offer:** `MISSING: P7 offer text` from your current terms.
- **Brand file:** Optional, but I'll need the typeface for captions and SFX lettering by the edit stage. Also send your "never show" list.

## Panel list

| # | Transition in | Narration (exact) | Caption (exact) | Seconds |
|---|---|---|---|---|
| P1 | scene to scene (opening): her kitchen, morning | "Every morning, the same chalky glass." | CHOKING ON POWDER AGAIN | 4 |
| P2 | subject to subject: same kitchen, the eye moves to the shaker in the sink | "Then the shaker sits in the sink." | THE SHAKER WINS AGAIN | 4 |
| P3 | subject to subject: the eye moves to the Sprout pouch on the counter | "So the whole lot went in one pack." | 60+ INGREDIENTS / 6G FIBER | 4.5 |
| P4 | moment to moment (**the reveal**): she tears one daily pack straight across the top and tips it into her palm, slowed down | "One small handful a day." | RIP. TIP. ENJOY. | **5 (longest)** |
| P5 | aspect to aspect (the only mood panel): same kitchen, empty dry sink, nothing on the rack | "Same kitchen. Nothing to rinse." | NO SHAKER TO WASH | 4 |
| P6 | scene to scene: front door, she heads out | (none) | MISSING | 4 |
| P7 | subject to subject: photo panel of the real pouch, set in editing | (none) | offer text: MISSING | 4.5 |

**Total: 30 s.** Each clip is 3 to 5 s, and the reveal is the longest clip. There is only one mood transition (P5), and the panels on either side of it are not mood panels.

**Claim guard:**
- P3 shows the pouch and its caption only. There are no drawn ingredients, vitamins or fibre icons beyond what is stated.
- P5 shows the routine getting easier, not a measured result.

## Ink line
- **Line:** clean black brush line, medium weight on figures and the product, thin on the background.
- **Fills:** flat, with one cool shadow tone at 20% darker than each fill and no gradients.
- **Halftone:** light halftone dots on backgrounds only, never on the hero's face or the product.
- **Palette:** black plus four flat colours:
  - warm cream (paper, walls, her top)
  - dusty navy (blazer, shadows)
  - muted ochre (earrings, wood, warm kitchen accents)
  - Sprout deep green with Sprout yellow, used on the product only and always the most saturated thing in the frame
- **Border and gutter:** thin black panel border, inset slightly from the 9:16 screen edge, with a warm cream gutter showing at all four edges.
- **Style references:** none (no artist, publisher or title named).

## Avatar card (becomes the hero line)
- **Who:** an adult woman in her mid-30s, the narrator of her own morning. She is not a customer, an expert or a child, and she claims no result.
- **Face:** round and simple: dot eyes, a short line for each brow, a tiny hook nose, a small line mouth. Open and easy to read at phone size, with no realistic detail.
- **Hair:** one shape, a dark high ponytail swinging to her right.
- **Clothes:** two colours, a dusty navy blazer over a plain cream-white top.
- **Accessory:** small hoop earrings in muted ochre.
- **Voice, in plain words:** warm, dry and a little wry about mornings. She speaks unhurried, at a normal pace, with a slight smile in it. The voice is designed from this card and never cloned from a real person.
- **Never changes:**
  - round face and dot eyes
  - ponytail swinging to her right
  - navy blazer over a cream-white top
  - hoop earrings
  - no other jewellery, logos or text on her clothes
  - she holds the daily pack in her right hand

**Stopping here. Please approve or edit the avatar card. Send the photos and the missing items above too, and I'll move on to the reference image prompts.**
```
