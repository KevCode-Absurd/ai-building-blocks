# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 1 of 5 met. Invented facts: 3.

The run correctly stopped for approval after the avatar card, with a solid Dev card and four distinct crowd figures, but nothing past stage 1 exists yet. It wrongly said the script lines and photos were missing even though the run input gave the places, the morph on line 5, the pouch label and photos, so it asked for facts it already had.

## Fix

In Stage 0, add a rule to read the script from the run input (places, morph line, set card) and always output the STAGE 0 SCRIPT IN line before stage 1. Only write MISSING for facts that truly aren't in the input, and say 'photos listed in the input' rather than asking for them again.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  "Stopping here. Reply \"yes\" to approve this avatar card and crowd" — correctly stopped at stage 1 and did not proceed.
- Not met: The set, light, palette and lens lines are word for word the same in every prompt.
  Run stopped at stage 1; no SET/LIGHT/PALETTE/LENS lines or prompts were written yet.
- Not met: The lead's full description appears wherever they do.
  Description given once in the avatar card; no shot prompts exist to repeat it in.
- Not met: Every shot card names one mover, and everyone else holds still.
  No shot cards produced; the script's mover column was claimed missing.
- Not met: The label lines are written out exactly, and there's at most one clay morph, built from a first and last frame.
  No product sheet or morph frame pair written; label lines only mentioned as missing.

## Invented

- other: dark brown clay shoes (`proposed`) (Marked proposed, so acceptable.)
- other: forest-green felt strap with a small cream clay badge (Lanyard design detail not in cast note, but a reasonable creative choice for the avatar card.)
- other: Crowd figure details (grey bun, moustache, glasses, auburn hair, etc.) (Crowd was only given as tall/short/round/slight; faces are creative design the skill requires.)

## What went in

```text
Script: the 10-line office-sink script from "Get a clay town ad
script with a crowd". Places: the office kitchen (lines 1 to 4),
Dev's desk (lines 6 to 10). Line 5 is the morph: the shaker in
Dev's hand squashes into a flat daily pack.
Set card: figures a hand tall, chunky props, handled finish,
water as clear gel, soft morning key light from a window.
Cast note: Dev, a clay adult man, about 30, slim, warm brown clay
skin, short black clay hair with comb grooves, a mustard knit
jumper of real fabric, navy clay trousers, a lanyard. Crowd: four
base figures (tall, short, round, slight).
Photos: pouch front, side and top; a daily pack in a hand.
Pouch label: big yellow "Sprout" wordmark on deep green, yellow
bear face top right, "28 Daily Packs" at the bottom.
Daily pack label words: not captured.
Colours: forest green #00582D, warm cream #FFF7DF, sunflower
yellow #FFCC2E. Tool: 5-second clips, first and last frame: yes.
```

## What came out

```text
I write the prompts only. No video tool is connected in this chat, so I can't make pictures or clips here.

---

# File 1: Avatar card (stage 1)

## Lead: Dev

- **Role in the story:** the office worker with the sink problem in the kitchen (lines 1 to 4). His shaker squashes into a flat daily pack at the swap (line 5). He is at his desk with the Sprout daily pack (lines 6 to 10).
- **Age range:** adult, about 30.
- **Look:**
  - slim build, a hand tall
  - warm brown matte clay skin
  - short black clay hair with visible comb grooves
  - an oval face
  - small dark bead eyes
  - simple sculpted brows
  - chunky clay hands with rounded fingertips and no nails
- **Clothes and materials:**
  - mustard knit jumper of real knitted fabric
  - navy clay trousers
  - dark brown clay shoes (`proposed`)
- **Signature item:** a lanyard. It is a forest-green felt strap with a small cream clay badge. The badge is blank, with no words.
- **Props:**
  - a chunky clay shaker bottle, held in his right hand, lines 1 to 5
  - the Sprout daily pack: sculpted clay in a printed paper label, in his right hand from line 5
  - the Sprout pouch: clay in a printed paper label, on his desk, lines 6 to 10
- **Voice:** none on screen. His mouth is sculpted closed in a set expression: flat and tired in the kitchen, a small closed smile at the desk. The narrator is off screen.
- **Never changes:**
  - his skin tone, hair shape and grooves, face shape and eyes
  - the mustard knit jumper and navy trousers
  - the lanyard and its blank badge, always on
  - his height next to the pack
  - the right hand holds the shaker or pack in every shot
  - the handled finish: some thumbprints on matte clay

## Crowd: four base figures

All are adults, a hand tall, in the handled clay finish. Mouths are sculpted closed. None of them is ever used as proof.

1. **Tall:**
   - long narrow face, pale peach clay skin, high grey clay bun
   - heavy straight brows, long nose
   - cream felt cardigan
2. **Short:**
   - wide square face, deep umber clay skin, cropped curly black hair
   - round cheeks, thick moustache
   - forest-green clay shirt
3. **Round:**
   - full round face, light olive clay skin, chin-length brown bob with a fringe
   - small round glasses of clear acrylic
   - sunflower-yellow knit vest
4. **Slight:**
   - narrow pointed chin, tan clay skin, swept-back auburn hair
   - large eyes, freckle dots pressed into the clay
   - navy felt blazer

---

MISSING: the 10 script lines themselves, with each line's seconds, its claims and the mover column. I can't fix the lines, timings or claims until I have them. Please paste the script.

MISSING: the photo files. I can't see any attached images in this chat. Please attach the pouch front, side and top, and the daily pack. A described pack can't be checked against the real one, so I'll ask for the photos again before stage 3.

MISSING: the daily pack's label words. Until I have them, the daily pack's label side faces away from camera in every shot, including the morph's last frame.

MISSING: the pack's size next to a person, and your "never show" list (online-store add-on).

Note: the "daily pack in a hand" photo is used only as a reference for size and grip. No human hand enters the set; Dev's clay right hand holds it.

**Stopping here.** Reply "yes" to approve this avatar card and crowd, or tell me what to change.
```
