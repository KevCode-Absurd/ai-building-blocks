# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, correct first checkpoint: the parts list covers every line, the avatar card follows the skill's cut rules, and it stopped where the skill says to. It did not pretend to see the unattached photos and flagged every unsourced figure and missing label word, so the owner knows exactly what to supply next.

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard, unless you asked for every stage in one go.
  "Checkpoint 1: please approve the parts list and avatar card... before I write the reference cutout prompts." User did not ask for all stages at once.
- Met: Every piece in every layer stack appears on the parts list.
  No layer stacks yet (run correctly stopped at stage 1); parts list P1–P12 is complete for all five lines.
- Met: The product cutout is made once from its photo and reused.
  "P1 Sprout daily pack... Cut from a front photo"; P2 "Cut from the same photo as P1"; pouch P4 from pouch front photo.
- Met: No prompt asks the tool to write a letter or a number.
  No image prompts written yet; strips specified as "blank" with "words and offer added in editing".
- Met: Every move has a start, an end and a key word it lands on, and every figure in the edit list has a source.
  Stages 4–5 not yet reached; figures flagged "MISSING: source for 'sixty-plus ingredients'" etc. rather than assumed.

## What went in

```text
Script (20 s, from "Prove one point fast in a paper-cutout ad"):
1 "A greens powder takes four steps." key: four. Row of tub,
  scoop, glass, shaker. Build-up.
2 "Then one more: rinsing the shaker." key: rinsing. Sink slides
  in under the shaker.
3 "A Sprout pack takes one tear." key: one. Swap: the row out, a
  daily pack in.
4 "Inside: sixty-plus ingredients, twenty-one vitamins and
  minerals, and six grams of fiber." key: Inside. Flap.
5 "One tear a day." Pouch large and still, offer on screen.
Paper kit: warm cream card, scissor-cut edges; signal sunflower
#FFCC2E strip with one pointed end; old way in black and white.
Cast note: the product carries it; quick, dry narrator.
Photos: pouch front, gummies in a hand. No single daily pack
photo yet. Old-way photos: to be shot.
Clips: 8 seconds, 9:16.
```

## What came out

```text
I write the prompts only. No video tool is connected in this chat, so no pictures or clips will be made here.

## Stage 0: Parts list

The script is locked and no words were changed. The product photos were named but not attached, so I can't read them. The product cutout can't be checked against the real pack yet.

| # | Piece | Used in line | Source / how it's made | Status |
|---|---|---|---|---|
| P1 | **Sprout daily pack**, front, sealed. This is the avatar. | 3, 4 | Cut from a front photo of a single daily pack | **MISSING: daily pack photo (front)** |
| P2 | **Sprout daily pack, top flap**: the part above the tear line, cut as a separate piece with a pin line along the tear | 4 | Cut from the same photo as P1, split at the tear notch | **MISSING: daily pack photo (front, tear notch visible)** |
| P3 | **Pack contents** (gummies only, no hand), sitting where the open pack's mouth will be | 4 | Cut from the "gummies in a hand" photo, gummies only. The hand is left out. | have the photo (not attached). Contents of the pack are `[inferred]` to be gummies. **MISSING: confirm the daily pack holds the gummies shown** |
| P4 | **Sprout pouch**, front | 5 | Cut from the pouch front photo | have (not attached, so its label words can't be read) |
| P5 | Plain unbranded powder tub, black and white | 1, 2, 3 | Photo to shoot | make (to shoot) |
| P6 | Plain scoop, black and white | 1, 2, 3 | Photo to shoot | make (to shoot) |
| P7 | Plain glass, black and white | 1, 2, 3 | Photo to shoot | make (to shoot) |
| P8 | Plain shaker bottle, black and white | 1, 2, 3 | Photo to shoot | make (to shoot) |
| P9 | Plain kitchen sink (basin and tap, seen front on), black and white | 2, 3 | Photo to shoot | make (to shoot) |
| P10 | Signal strip: sunflower #FFCC2E card with one pointed end, blank | 1, 2, 3, 4, 5 (one per line) | Paper shape | make |
| P11 | Blank label strips (warm cream or white card) for the words and offer added in editing | 1–5 as needed, 5 for the offer | Paper shape | make |
| P12 | Ground: warm cream card filling the 9:16 frame, flat from above | all | Paper | make |

Lines with a missing piece:
- **Lines 3–4:** P1 and P2 keep a labelled empty slot marked `MISSING: product photo (daily pack)` until the photo arrives.
- **Line 4:** The figures can't go to edit without sources.
- **Line 5:** The offer strip stays blank until the terms arrive.

Timing note for later stages: 20 s at 8-second clips means 3 clips. Clip 1 covers lines 1–2, clip 2 covers lines 3–4 and clip 3 covers line 5 plus the end hold. The split will be confirmed once the voice is timed.

## Stage 1: Avatar card

**Avatar: the Sprout daily pack (P1/P2).** It carries lines 3–4. The pouch (P4) follows the same cut rules and takes over as hero on line 5.

- **Cut from:** a front-on photo of one sealed daily pack, in full colour. `MISSING: daily pack photo`. Please shoot the front, the top edge with the tear notch, and the pack torn open with the gummies inside. For the pouch, use the pouch front photo.
- **How it's cut:**
  - Scissor-cut edge, slightly uneven.
  - Thin white margin of about 2–3 mm at scale all the way round.
  - Visible card thickness at the edge.
  - Short, soft shadow falling lower right, the same on every piece.
  - The tear flap (P2) is a separate piece pinned along the tear line, so it lifts like a hinge.
- **Size as hero:**
  - Daily pack: about 45% of frame height, centred, lower half of the frame.
  - Pouch on line 5: about 60% of frame height, centred.
- **Old-way pieces:**
  - Black and white only, each about 18–20% of frame height when in the row.
  - Always smaller than the hero.
- **Narrator voice:**
  - Quick and dry. Adult, mid-pitch, flat and matter-of-fact.
  - A tiny pause before each key word (four, rinsing, one, Inside).
  - Only a hint of warmth on the last line.
  - The voice is designed from this description, never cloned. There is no on-screen speaker.
- **Never changes:**
  - The pack's and pouch's shape, colours and printing, exactly as in the photos. They are cut out, never redrawn.
  - `MISSING: brand colours` and `MISSING: every label word on pack and pouch` until the photos are attached.
- **Person cutout:** none. The script doesn't need one, and the hand in the gummies photo is cropped out.

### MISSING so far
- `MISSING: daily pack photo` (front, tear notch, opened)
- `MISSING: pouch front photo attached` (needed to read label words and check the cutout)
- `MISSING: every label word on pack and pouch`, word for word
- `MISSING: confirm the daily pack contains the gummies shown` (`[inferred]`)
- `MISSING: source for "sixty-plus ingredients"`
- `MISSING: source for "twenty-one vitamins and minerals"`
- `MISSING: source for "six grams of fiber"` (and whether that's per pack)
- `MISSING: current offer terms` for line 5
- `MISSING: brand colours and typefaces`

**Checkpoint 1: please approve the parts list and avatar card (or tell me what to change) before I write the reference cutout prompts.**
```
