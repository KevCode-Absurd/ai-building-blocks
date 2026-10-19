# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 1.

A careful, well-disciplined first turn: it flagged that the photos came as text, kept the script untouched, set facing, hand and handling rules, and built an original adult hero that will read in silhouette. The only slip is a wrong word count for the narration (11, not 9), which is minor but an error the owner would catch.

## Fix

In Stage 0, add: 'Quote the script lines only; do not state word counts or other derived figures unless you show the count line by line.'

## Judge list

- Met: Stopped for your OK after the avatar card, the sheets and the storyboard
  "**Stopped.** Please approve this card or tell me what to change." Sheets and storyboard not yet reached, correctly.
- Met: Lock lines the same, word for word, in every prompt
  No prompts written yet (stage 2+ not reached); nothing to contradict. Look line kept as given.
- Met: Every shot card has two key poses, a hold, and a moves and holds line
  Storyboard not reached this turn; stage 0 table correctly lists shots, lines, lengths without inventing shot cards.
- Met: Hero faces the same way toward the product unless a turn is shown
  "He faces **screen right** toward the product in every shot, unless a turn is shown on screen."
- Met: Dialogue matches the script exactly; no artist, studio, series or character named
  "Same fight, every morning." / "Or skip the scoop." / "Rip. Tip. Enjoy." quoted exactly; no names used.

## Invented

- number: The narration is 9 words (The three lines total 11 words, not 9; a wrong derived count presented as fact.)

## What went in

```text
Script: the 20-second script from "Get an original anime ad
script". Look (proposed): thick even marker outline, flat colour
with one shadow tone, full bright palette, flat graphic
backgrounds. Shot 1: the hero glares at a towering tub of powder.
Shot 2: a scoop of powder puffs into his face. Shot 3: he tears a
daily pack across the top. Shot 4: gummies tip into his palm.
Shot 5: he heads out the door, pouch in hand.
Narration: "Same fight, every morning." / "Or skip the scoop." /
"Rip. Tip. Enjoy."
Cast note: the hero carries it, silent, with a narrator.
Photos: [pouch front] [daily pack in a hand] [gummies in a palm]
Pouch: glossy deep green, big yellow wordmark, yellow bear face
top right, "28 Daily Packs". Daily pack words: not captured.
Handling: tear the daily pack straight across the top only.
Tool: 8-second clips, up to 3 reference images, takes an end frame.
```

## What came out

```text
I can write every prompt here, but this chat has no video tool connected, so I can't make the pictures or clips myself.

## Stage 0: Script in

**Shots, lines and lengths** (the script's words are unchanged; lengths and line placement are proposed)

| Shot | Action | Narration (proposed placement) | Length (proposed) |
|---|---|---|---|
| 1 | Hero glares at a towering tub of powder | "Same fight, every morning." | 4 s |
| 2 | A scoop of powder puffs into his face | (puff sound only) | 3 s |
| 3 | He tears a daily pack across the top | "Or skip the scoop." | 4 s |
| 4 | Gummies tip into his palm | "Rip. Tip. Enjoy." (runs over 4 into 5) | 4 s |
| 5 | He heads out the door, pouch in hand (payoff) | | 5 s |
| | | **Total** | **20 s** |

The narration is 9 words, which fits comfortably in 20 seconds. Please confirm which shot each line sits on.

**Claims:** none in the narration. The only fact on screen is the printed "28 Daily Packs". I will not draw or add anything beyond that.

**Look line (proposed, kept as given):** thick even marker outline, flat colour with one shadow tone, full bright palette, flat graphic backgrounds.

**Payoff pose:** at the open door, the hero holds the pouch in his right hand at chest height, front to camera (yellow wordmark and bear face fully visible). Clear flat space sits at screen left for the offer line.

**Handling, locked:** the daily pack tears straight across the top only, then tips into the palm.

**Missing**
- `MISSING: real photos.` "[pouch front] [daily pack in a hand] [gummies in a palm]" came through as text, not images. Until the photos are attached, the product sheet can't be checked against the real pack. I need them before stage 3.
- `MISSING: daily pack label words.` Until they're given, the daily pack faces sideways in every shot.
- `MISSING: the exact letters of the pouch wordmark` (brand name), plus any other pouch text beyond "28 Daily Packs".
- `MISSING: brand file, current offer for the end card, and the "never show" list.`
- `MISSING: gummy colour and shape`, to be taken from the palm photo.

## Stage 1: Avatar card (approval 1)

**Role:** Hero. Silent, carries every shot. A separate narrator speaks over him.

**Age and look:** An adult man, early 30s. He reads as plainly adult, with:
- adult proportions, about 7 heads tall
- a squared jaw with a light stubble shadow
- medium-sized, narrow eyes with heavy brows
- a strong expressive brow line, built for the glare in shot 1

**Silhouette:** A single tall upswept tuft of hair at the crown, leaning forward like a flame. He wears an oversized hoodie with a big hood bunched at the neck, and a black crossbody bag strap running from the left shoulder to the right hip. The tuft, hood bulk and strap diagonal read clearly when filled black at thumbnail size.

**Hair:** Short dark brown, cropped close at the sides. The crown tuft stays the same height and shape in every shot.

**Clothes (three colours):**
- coral-red hoodie with white drawstrings
- charcoal-grey tapered trousers
- white trainers

The coral sits away from the pouch's deep green and yellow, so the product stands out against him.

**Props:**
- black crossbody bag (strap always left shoulder to right hip)
- the powder tub and scoop are set props, not his

**Hands:** The product is always in his **right** hand.

**Facing:** He faces **screen right** toward the product in every shot, unless a turn is shown on screen.

**Voice:** None. He is silent and only reacts: glare, splutter, grin. The narrator is a designed voice, never cloned. Proposed: mid-low pitch, dry and deadpan, unhurried pace, neutral accent. Please confirm or replace.

**Must never change:**
- tuft shape and height
- coral hoodie with white drawstrings
- strap direction
- charcoal trousers and white trainers
- right hand holds the product
- adult face and proportions
- no logos or text on his clothes

**Never:**
- a child or childlike proportions
- a real person's face or voice
- a known character
- a copied costume

**Stopped.** Please approve this card or tell me what to change. I'll write the stage 2 reference image prompts once it's approved, and I'll need the real photos and missing label words before stage 3.
```
