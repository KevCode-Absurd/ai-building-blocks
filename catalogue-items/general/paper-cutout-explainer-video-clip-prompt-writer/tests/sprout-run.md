# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, correct first pass: it listed every piece per line, marked what must be shot or supplied, picked the daily pack as avatar and stopped exactly where the skill says. The owner gets a clear to-do list (pack photos, old-way shoot, figure sources, offer terms) with nothing guessed, though the powder-or-gummies question could have been answered from the brand file had it been supplied.

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard.
  "**Stopped at approval 1.** Please approve or correct the avatar card." Stages 2-5 correctly not started.
- Met: Every piece in every layer stack appears on the parts list.
  No layer stacks yet (stage 4 not reached); parts list covers ground, old-way pieces, pack, pouch, strips per line.
- Met: The product cutout is made once from its photo and reused.
  "Lines 3 and 4: daily pack, front photo, full colour"; "Line 5: pouch front photo (have), cut the same way."
- Met: No prompt asks the tool to write a letter or a number.
  No image prompts written yet; strips listed as "Blank strip for on-screen word" and "Three blank strips, one per figure".
- Met: Every move has a start, an end and a key word it lands on, and every figure in the edit list has a source.
  No moves or edit list yet; figures already flagged: "MISSING: source for each figure (label panel or spec sheet)".

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
# 1. Parts list (Stage 0)

Script locked as written. No words changed.

**Ground**

| Piece | Source | Status |
|---|---|---|
| Ground paper: warm cream card, flat, fills the 9:16 frame edge to edge | Made in paper kit | make |

**Line 1: "A greens powder takes four steps." (key: four, build-up)**

| Piece | Source | Status |
|---|---|---|
| Plain unbranded greens-powder tub cutout, black and white | Old-way photo | MISSING: photo (to be shot) |
| Plain scoop cutout, black and white | Old-way photo | MISSING: photo (to be shot) |
| Plain glass cutout, black and white | Old-way photo | MISSING: photo (to be shot) |
| Plain shaker cutout, black and white | Old-way photo | MISSING: photo (to be shot) |
| Sunflower #FFCC2E signal strip, one pointed end, blank | Paper kit | make |
| Blank strip for on-screen word | Paper kit | make |

**Line 2: "Then one more: rinsing the shaker." (key: rinsing, slide)**

| Piece | Source | Status |
|---|---|---|
| Plain sink cutout, black and white | Old-way photo | MISSING: photo (to be shot) |
| Shaker cutout | Carried from line 1 | have, once shot |
| Sunflower signal strip | Carried | make |
| Blank strip | Paper kit | make |

**Line 3: "A Sprout pack takes one tear." (key: one, swap)**

| Piece | Source | Status |
|---|---|---|
| Sprout single daily pack cutout, full colour, sealed | Daily pack front photo | MISSING: single daily pack photo |
| Sunflower signal strip | Paper kit | make |
| Blank strip | Paper kit | make |

**Line 4: "Inside: sixty-plus ingredients, twenty-one vitamins and minerals, and six grams of fiber." (key: Inside, flap)**

| Piece | Source | Status |
|---|---|---|
| Daily pack cutout with its tear edge as a flap, pin at the tear line | Daily pack photo, plus a torn-open pack photo | MISSING: torn/open daily pack photo |
| What the flap reveals: contents | Photo of what is inside the pack | MISSING: contents photo. Powder or gummies? See note below. |
| Three blank strips, one per figure | Paper kit | make |
| Figures 60+, 21, 6 g | Source per figure | MISSING: source for each figure (label panel or spec sheet) |

**Line 5: "One tear a day." (pouch large and still, offer on screen)**

| Piece | Source | Status |
|---|---|---|
| Sprout pouch cutout, full colour, large | Pouch front photo | have |
| Blank strip for offer | Paper kit | make |
| Offer text | Current offer terms | MISSING: current offer, price and guarantee wording |

**Also needed across all lines**

| Item | Status |
|---|---|
| Every label word on the pouch and the daily pack, word for word | MISSING |
| Brand typefaces | MISSING. This is optional, but needed for the edit. |

**Notes**
- The "gummies in a hand" photo is not on any line, so it is not used. It also shows a real person's hand.
- Line 1 says "greens powder" and line 3 says "Sprout pack". Please confirm whether Sprout is a powder in single packs or gummies. This decides what the line 4 flap reveals.
- Please confirm whether the line 5 pouch is the same product as the line 3 daily pack, or the outer pouch that holds the packs.
- Lines that must wait:
  - Lines 1 and 2 wait until the old-way photos are shot.
  - Lines 3 and 4 wait until the daily pack photos (sealed and open) exist and the figure sources are in.
  - Line 5 waits for the offer terms.
- Timing flag: line 4 is long for a 20 s cut. It will likely need its own 8 s clip.

---

# 2. Avatar card (Stage 1)

**Avatar:** the Sprout single daily pack. The product carries the ad, and there is no person cutout.

**Source photo**
- Lines 3 and 4: daily pack, front photo, full colour. MISSING: this photo needs to be shot.
- Line 4 open state: the same pack photographed torn open. MISSING.
- Line 5: pouch front photo (have), cut the same way.

**Cut**
- Scissor-cut edge, slightly irregular. It must not look like a vector outline.
- Thin, even white margin, about 2 mm at pack scale.
- Visible card thickness on the edge.
- Short, soft drop shadow falling lower right, the same direction in every frame.
- The photo is cut out, never redrawn.

**Hero size against the 9:16 frame**

| Line | Size | Position |
|---|---|---|
| Line 3 | About 55% of frame height | Centred, front on |
| Line 4 | About 60% of frame height | Centre, so label and contents stay legible |
| Line 5 | About 75% of frame height | Centred, front on, still |

**Narrator voice**
- Adult, quick and dry. Plain delivery with a slight deadpan, as if stating the obvious.
- Short pause before each key word, no hype and no upward sell.
- The voice is designed from this card, never cloned. Nobody speaks on screen.

**Never changes**
- Pack and pouch outline shape.
- Printed colours as photographed.
- All printing and label words, word for word from the photo.
- Front-on angle.
- Sealed or torn state carries over from the line where it changes, which is line 4.

**Old-way pieces (not avatar)**
- Black and white only.
- Plain and unbranded.
- Never a named rival.

---

**Stopped at approval 1.** Please approve or correct the avatar card. Please also send the missing items: the daily pack photos (sealed and open), the contents photo, the label words, the sources for the three figures, the offer terms, and the old-way shoot. Please also answer the powder-or-gummies question and the pack-versus-pouch question.
```
