# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean stage 0 and 1: the panel list keeps the locked script word for word, names every transition, gives the reveal the longest time, keeps the pouch the only saturated thing, and correctly halts for approval. The owner gets a clear avatar card and a short MISSING list (skin tone, viewable photos, offer terms, brand file) rather than guesses, though the brand file was available and could have been used for colours and the never-show list.

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard.
  "Stopping here for approval 1... I won't start the reference image prompts until you approve." Later stops not yet reached.
- Met: Every panel has a named transition, and the reveal panel is the longest.
  All 7 panels named; "P4 | Moment to moment (the reveal)... 6" while others are 4 s; total 30 s.
- Met: The lock lines are the same, word for word, in every prompt.
  No prompts written yet (stage 3 not reached); the ink line is set once, no inconsistency to find.
- Met: No prompt asks the tool to draw words or numbers, and each clip has one kind of motion.
  No prompts yet; rule stated: "the claim numbers ('60+', '6G') appear only in edited caption lettering... never drawn."
- Met: The last panel is your real product photo, set in editing.
  "P7 | Subject to subject: the photo panel of the real pouch, with offer text" and border kept "in every panel including P7".

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
# 1. Panel list, ink line, avatar card (stages 0 and 1)

## Fit check
This script fits a motion comic. It is a short problem-and-fix story (powder mess, then one pack) built around one claim. It does not depend on a real person's proof or on how the product pours or stretches.

**Rule on numbers:** the claim numbers ("60+", "6G") appear only in edited caption lettering and on the photo panel. They are never drawn. The full claim on record is: "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack.

## Panel list (30 s)

| # | Transition in | Seconds | Narration (locked) | Caption (locked) |
|---|---|---|---|---|
| P1 | Scene to scene: open on her kitchen, morning | 4 | "Every morning, the same chalky glass." | CHOKING ON POWDER AGAIN |
| P2 | Action to action: she finishes the glass, and the shaker goes into the sink | 4 | "Then the shaker sits in the sink." | THE SHAKER WINS AGAIN |
| P3 | Subject to subject: the eye moves from her to the Sprout pouch on the counter | 4 | "So the whole lot went in one pack." | 60+ INGREDIENTS / 6G FIBER |
| P4 | Moment to moment (**the reveal**): she tears one daily pack straight across the top and tips it into her palm, slowed down | **6** | "One small handful a day." | RIP. TIP. ENJOY. |
| P5 | Aspect to aspect (the only mood transition): details of the same kitchen, an empty sink and a dry rack, so the routine reads as easier | 4 | "Same kitchen. Nothing to rinse." | NO SHAKER TO WASH |
| P6 | Action to action: she grabs her bag and steps out the door | 4 | (none) | (none in script) |
| P7 | Subject to subject: the photo panel of the real pouch, with offer text | 4 | (none) | Offer text from current terms |

- The reveal (P4) is the longest panel at 6 s. The total is 30 s.
- P5 is the only aspect-to-aspect transition. It is followed by action to action, so there are no two mood transitions in a row.
- P5 shows only the routine going easier. It shows no body result and no measured outcome.

## Ink line
- **Line:** clean black brush-pen outlines. Medium weight on figures and a heavier weight on the outer silhouette. Thin interior lines, no sketchy hatching.
- **Fills:** flat colour only. No gradients, no texture, no rendered gloss.
- **Shadow:** one shadow tone only, made of black halftone dots at about 20% on the shadow side of forms.
- **Halftone:** yes, used only for that shadow tone.
- **Palette:** black plus 4 flat colours.
  - Warm cream: walls, counters and the white top.
  - Dusty navy: the blazer and dark set accents.
  - Deep green: product only, at full saturation.
  - Sunflower yellow: product only, at full saturation.
  - The scene stays muted so the pouch is always the most saturated thing in its panels.
  - Skin is one flat tone. See MISSING.
- **Border and gutter:** a thin black panel border inset from the screen edges, with a warm cream gutter between the border and the screen edge, in every panel including P7.

## Avatar card (becomes the hero line)
- **Who:** one adult woman, the narrator and hero of her own morning routine. She is not drawn as a customer reporting a result, an expert or a doctor.
- **Face:** round and simple, with two dot eyes, short single-stroke brows, a small hook nose and a one-line mouth. No lashes, blush or lip detail. The face is open and easy to step into, and readable at phone size.
- **Hair:** dark ponytail, drawn as one shape: a high ponytail as a single black-filled teardrop.
- **Clothes (two colours):** navy blazer over a white top. The top uses the cream fill.
- **Accessory (one):** small gold hoop earrings. They are drawn as tiny thin rings in a pale, low-saturation tint of the yellow so they never compete with the pouch.
- **Voice (designed, never cloned):** a warm, mid-pitch adult woman's voice. Plain and a little dry, as if wry about her own morning. Unhurried, conversational, no announcer polish.
- **Never changes:** round face shape, dot eyes, single-shape dark ponytail, navy blazer, white top, small gold hoops, skin tone, line weight. She never claims a health result, energy, weight or how she feels.

## MISSING
- `MISSING: hero skin tone`. The cast note doesn't give it, so please confirm one flat tone.
- `MISSING: viewable product photos`. I need the front, side and top of the pouch, plus one daily pack and the contents out of the pack. This is needed before stage 3, and P4 ("small handful", "tip into palm") can't be drawn until I can see what the contents look like.
- `MISSING: current offer terms` for the P7 photo panel.
- `MISSING: brand file`, meaning the lettering typeface, approved claim wording beyond the line above, and the "never show" list.
- **Tool limits** were not given, so I'm planning one 3 to 5 s clip per panel. P4 runs 6 s and will be two takes joined, or one longer clip if your tool allows it.

**Stopping here for approval 1.** Please approve or edit the panel list, ink line and avatar card, and send the missing items. I won't start the reference image prompts until you approve.
```
