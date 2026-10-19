# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 2.

The run handled the missing items well: it flagged absent photos and script lines, stopped at approval 1, and invented no facts. But it skipped the required Stage 2 reference image prompts and used a different output layout, so the owner cannot yet use it.

## Fix

In Stage 1, require Stage 2 reference image prompts and the Stage 0 and Stage 1 output shape to be shown before the stop, or state that Stage 2 must be given in the same turn as the avatar card.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  Ended at stage 1: "Stopping here. Reply yes to approve this avatar card"; never moved past approval 1, as the skill requires.
- Met: The material and motion sentences are word for word the same in every prompt.
  No image or clip prompts yet; run stopped before stage 3 locks the sentences, so nothing differs.
- Met: Every frame names a camera spot inside the scene, and every object names its paper or card.
  No frames written yet. Objects in the avatar card name paper: "kraft-paper lunchboxes", "forest green #00582D matte card".
- Met: Each clip has one camera move and one paper change, written as paper moves.
  No clips written yet; stage 5 not reached, so nothing violates it.
- Met: The label lines on the card pack are short, in quotes, and match your pack.
  No pack prompt made. Only real label lines cited: "Sprout", "28 Daily Packs"; asked for photos and full label first.

## Invented

- other: Skin: warm tan matte card; dark-brown hair; sunflower hair clip; grey car keys (Design choices for the invented figure; skin tone marked proposed, and the rest are marked as the card's look, not facts.)
- number: Seconds ~4/~5 per line (Marked inferred; the script gave only about 30 s total.)

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
I write the prompts only. No image or video tool is connected to this chat, so no pictures or clips will be made here.

---

## File 0: Script in (fixed from here on)

**Show job:** reveal
**Mechanism:** pop-up
**Build:** flat-cut figure on layered planes; matte card, kraft lunchboxes, scissor-cut edges

**The turn**
- **Starts:** line 4, as the paper planner page begins to turn.
- **Ends:** the daily pack stands fully upright from the fold, with its shadow grown.
- **The one paper-made scene change:** the planner page opens from flat to upright, and the pack fixed across the fold stands up.

**Lines, seconds and claims**

| # | Line | Picture | Seconds (`inferred`) | Claims |
|---|---|---|---|---|
| 1 | `MISSING: line 1 text` | kitchen | ~4 | `MISSING` |
| 2 | `MISSING: line 2 text` | shelf | ~4 | `MISSING` |
| 3 | "So put them where your day already goes." | paper planner | ~4 | none |
| 4 | "One pack, right there." | THE TURN: page turns, daily pack pops up from the fold | ~5 | one pack per day (matches "28 Daily Packs") |
| 5 | "Rip. Tip. Enjoy." | paper hands tear the pack across the top | ~4 | tear across the top only |
| 6 | `MISSING: line 6 text` | pouch on a car seat | ~4 | `MISSING` |
| 7 | `MISSING: line 7 text` (offer) | end card | ~5 | `MISSING: live offer and price` |

**Still needed before stage 3 (product prompts):**
- `MISSING: pouch photos.` Your note says front, side and top are attached, but no images came through to me. Please re-attach them, because the product sheet can't be checked against the real pack without them.
- `MISSING: daily pack (single sachet) photo and its label text word for word with colours.` Lines 4 and 5 show the single pack, not the pouch.
- `MISSING: pouch label text in full, word for word,` beyond "Sprout", the bear face and "28 Daily Packs".
- `MISSING: pouch and daily-pack sizes next to the figure` (for example, the pouch is about hand-height on her).
- `MISSING: brand file.` I need the approved claims, the things never to show, and whether the brand uses music.
- `MISSING: image tool and video tool names.` I have 8-second clips, end frame yes, no sound.

---

## File 1: Avatar card (approval 1)

**Role in the story:** The everyday woman whose day the pack slots into. She owns the kitchen, the shelf, the planner and the car seat. Her hands tear the pack in line 5.

**Age range:** about 40. She is an invented paper adult.

**Look (plain words):**
- **Skin:** warm tan matte card (`proposed`).
- **Face:** simple cut shapes. It has two small dark-brown card ovals for eyes, a thin curved card strip for a smile, and a slightly darker tan card nose shape layered on. There are no drawn details.
- **Hair:** shoulder-length, cut from dark-brown matte card in three layered scissor-cut pieces. A small sunflower #FFCC2E card clip sits on the left side.
- **Build:** flat-cut, side-on readable silhouette, pinned at shoulders, elbows and knees.

**Clothes and card colours:**
- **Cardigan:** forest green #00582D matte card, with a cream #FFF7DF card top showing at the neck.
- **Trousers:** kraft paper.
- **Shoes:** dark-brown card.
- **Hands:** flat tan card mittens with a cut thumb. They stay flat and never curl.

**Props:**
- **Paper planner:** cream card pages with a forest-green card cover.
- **Kraft-paper lunchboxes:** used in the kitchen.
- **Car keys:** cut from grey card, used in line 6.

**Voice:** none on screen. The narrator is off screen, and she never speaks or mouths words.

**Second figure:** none. The line-5 hands are her own paper hands in close-up.

**What never changes:**
- The face shapes and hair pieces.
- The green cardigan with cream top.
- The yellow hair clip on the left.
- Her size next to the product, to be set in stage 3.
- Her flat, rigid card build.
- She is always an adult, never a child, never a real person, never speaking.

---

**Stopping here.** Reply **yes** to approve this avatar card, or tell me what to change. Please re-attach the pack photos and send the missing script lines so stage 3 can follow.
```
