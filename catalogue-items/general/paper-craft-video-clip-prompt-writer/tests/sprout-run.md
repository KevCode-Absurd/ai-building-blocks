# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful stage 0 and 1: the turn is fixed, the given lines and claims are tabled, and every gap (lines 1, 2, 6, 7, daily-pack photos, live offer, never-show list) is marked MISSING instead of guessed. The avatar card is complete, uses only the given hex colours plus clearly marked proposed tones, and correctly halts for approval before any prompt is written.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  "Approval 1: please reply yes to this avatar card, or tell me what to change." Stopped after stage 1; later stops not yet reached.
- Met: The material and motion sentences are word for word the same in every prompt.
  No image or clip prompts written yet (correctly halted at approval 1); nothing to contradict. Not yet testable.
- Met: Every frame names a camera spot inside the scene, and every object names its paper or card.
  No frames yet; all objects named so far carry paper: "Kraft-paper lunchboxes", "cream card cover and kraft pages", "cream card car key".
- Met: Each clip has one camera move and one paper change, written as paper moves.
  No clips yet; the turn is already written as paper: "the page turns and the pop-up pack rises from the fold."
- Met: The label lines on the card pack are short, in quotes, and match your pack.
  No product prompt yet; it asks first: "MISSING: photos and label text for the single daily pack... I will ask before any product prompt."

## What went in

```text
Script (from the paper world script skill), about 30 s.
Show plan: reveal, pop-up. Flat-cut figure on layered planes,
matte card, kraft lunchboxes, scissor-cut edges.
3 "So put them where your day already goes." Paper planner.
4 "One pack, right there." THE TURN: the page turns, the daily
  pack stands up from the fold.
5 "Rip. Tip. Enjoy." Paper hands tear the pack across the top.
(lines 1-2 kitchen and shelf, 6-7 pouch on a car seat and offer)
Cast note: one flat-cut paper woman, an invented adult about 40.
Photos attached: pouch front, side and top. Label: "Sprout" in
yellow, a yellow bear face top right, "28 Daily Packs" at the
bottom. Gummies: small deep-green bears. Tear only across the top.
Colors: forest green #00582D, cream #FFF7DF, sunflower #FFCC2E.
Video tool: 8-second clips, takes an end frame, no sound.
```

## What came out

```text
# File 1: Avatar card

## Script in (fixed from here on)

- **Show job:** reveal
- **Mechanism:** pop-up
- **Build:** flat-cut figure on layered planes
- **Paper:** matte card, kraft lunchboxes, scissor-cut edges
- **The turn:**
  - **Starts:** line 4, with the paper planner lying open and a page partway through its turn.
  - **Ends:** the daily pack stands upright from the fold, its shadow grown long.
  - **The one paper-made scene change:** the page turns and the pop-up pack rises from the fold.

| # | Line | Seconds | Picture | Claims |
|---|---|---|---|---|
| 1 | MISSING: line 1 text | ~4 (proposed) | kitchen | MISSING |
| 2 | MISSING: line 2 text | ~4 (proposed) | shelf | MISSING |
| 3 | "So put them where your day already goes." | ~5 (proposed) | paper planner | none |
| 4 | "One pack, right there." | ~4 (proposed) | THE TURN: page turns, daily pack pops up | none |
| 5 | "Rip. Tip. Enjoy." | ~4 (proposed) | paper hands tear the pack across the top only | none |
| 6 | MISSING: line 6 text | ~4 (proposed) | pouch on a car seat | MISSING |
| 7 | MISSING: line 7 text | ~5 (proposed) | offer, end card | MISSING |

- MISSING: the exact text of lines 1, 2, 6 and 7, with their seconds and any claims in them.
- MISSING: photos and label text for the single **daily pack** (the piece that pops up and gets torn). Only the 28-pack pouch is described. I will ask before any product prompt.
- MISSING: the brand's never-show list and its approved claims.
- MISSING: the live offer for the end card.
- Colours: forest green #00582D, cream #FFF7DF and sunflower #FFCC2E are given. The skin, hair and kraft tones below are `proposed`.

## Avatar card: the woman

- **Role in the story:** the person whose day the narration follows. Her day runs through the kitchen, the shelf, her planner and the car. She finds the daily pack waiting in her planner (line 4). Her paper hands tear and tip it (line 5).
- **Age range:** about 40. She is an invented adult and not based on anyone.
- **Look:**
  - She is a flat-cut paper figure made from matte card, with scissor-cut edges.
  - Her skin is warm tan matte card (`proposed`).
  - Her face is made of simple cut shapes: an oval head, two small dark-brown dot eyes, a thin curved strip for a smile, and two small rosy-card circles for cheeks.
  - Her hair is one dark-brown card piece cut as a chin-length bob with a straight scissor-cut fringe.
  - She has no nose, and no mouth that can open.
- **Clothes and their card colours:**
  - A forest green #00582D card cardigan, cut as a separate layer over the top.
  - A cream #FFF7DF card top showing at the neck.
  - Kraft-paper trousers and dark-brown card flat shoes.
  - One sunflower #FFCC2E card hair clip as her single accent.
- **Props:**
  - Kraft-paper lunchboxes (kitchen).
  - A paper planner with a cream card cover and kraft pages (lines 3 and 4).
  - A cream card car key (car seat shot, if she appears in it).
- **Joints:** pinned at the shoulders, elbows and knees. Her hands are flat mitten shapes with a separate cut thumb.
- **Voice:** none on screen. The narrator is off screen, and she never speaks.
- **Second figure:** none. The hands in line 5 are **her** hands in close-up, with the forest green cardigan cuff showing at each wrist.
- **What never changes:**
  - her hair shape and colour
  - her face shapes, with no mouth movement
  - her clothing colours and layers
  - her pin points and proportions
  - every piece staying rigid and flat

**Approval 1:** please reply yes to this avatar card, or tell me what to change. Please also send the MISSING lines above, especially the daily-pack photos and label, before I move on to stage 2.
```
