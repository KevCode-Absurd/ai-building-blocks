# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, disciplined stage 0 and 1: the turn is defined as paint behaviour, the label is protected, the hands card is safe (made-up adult, no face, no tool) and every gap is flagged MISSING rather than guessed. It stops exactly where the skill says to, so the owner can approve and move on with nothing to undo.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  "Stop. Please approve this avatar card ... I won't start the reference images (stage 2) until you say yes." Sheets and storyboard not yet reached, correctly.
- Met: The material sentence and lock lines are word for word the same in every image prompt.
  No image prompts exist yet; run correctly halted at approval 1, so nothing to contradict this.
- Met: Each clip prompt names one camera move and at most one paint change.
  No clip prompts yet; stage 5 not reached because the run stopped where the skill requires.
- Met: The turn is written as what wet paint does, never as a brush at work.
  "Thin see-through leaf glazes then stack one at a time. Where they overlap, the green deepens." No brush or tool named.
- Met: The product's label lines are short, in quotes, and match your pack.
  "clear of the "Sprout" lettering, the bear face and "28 Daily Packs"" matches the pouch description in the input.
- Met: Every frame reads as watercolor on paper, never as a filtered photo.
  No frames generated yet; turn description already uses "loosely painted", "cold-press paper", "see-through leaf glazes".

## What went in

```text
Script (from the watercolor ad script skill), about 30 s.
Show plan: build, glazing. Leaf glazes stack until they match the
pouch's deep forest green. Cold-press, light granulation.
3 "Here are those greens, one layer at a time." One pale kale leaf.
4 "Kale. Spinach. Spirulina. Broccoli. Wheatgrass." THE TURN.
5 "Sixty-plus ingredients, twenty-one vitamins and minerals, six
  grams of fiber." The pouch where the layers meet.
6 "In one pack you tear and eat." Hand, torn daily pack, bears.
(lines 1-2 shelf, 7-8 offer and close)
Cast note: hands only, in line 6. The pouch carries the ad.
Photos attached: pouch front, side and top; one daily pack.
Pouch: glossy deep green, "Sprout" in big yellow letters, yellow
bear face top right, "28 Daily Packs" at the bottom. Pack torn
straight across the top only. Video tool: 8-second clips, takes an
end frame, no sound.
```

## What came out

```text
# Stage 1: Avatar card (hands)

**What's fixed from the script**
- **Show job:** build. **Technique:** glazing.
- **The turn (line 4):**
  - It starts with one pale, dry, painted kale leaf on cold-press paper.
  - Thin see-through leaf glazes then stack one at a time. Where they overlap, the green deepens.
  - It stops when the overlapped centre matches the pouch's deep forest green.
  - It never crosses the label. The glazes stay clear of the "Sprout" lettering, the bear face and "28 Daily Packs".
- **Lines, seconds and claims (about 30 s total):**

| Line | Seconds (est.) | Words | Claims |
|---|---|---|---|
| 1–2 | ~0–8 | MISSING (shelf) | MISSING |
| 3 | ~8–11 | "Here are those greens, one layer at a time." | none |
| 4 | ~11–15 | "Kale. Spinach. Spirulina. Broccoli. Wheatgrass." | five named ingredients |
| 5 | ~15–21 | "Sixty-plus ingredients, twenty-one vitamins and minerals, six grams of fiber." | 60+ ingredients; 21 vitamins and minerals; 6 g fiber |
| 6 | ~21–24 | "In one pack you tear and eat." | none |
| 7–8 | ~24–30 | MISSING (offer and close) | MISSING |

**Avatar card: the hands**
- **Role in the story:** They appear in line 6 only. They hold one daily pack, already torn open, with gummy bears showing. They prove "tear and eat". The pouch carries the rest of the ad.
- **Age range:** A made-up adult, roughly 30 to 45. No real person, customer or child.
- **Look in plain words:**
  - Two loosely painted adult hands in warm mid-tone skin.
  - Soft, simple shapes with no knuckle or vein detail.
  - Short plain nails, with no polish, rings or watch.
- **Clothes and colours:** A soft oatmeal-cream knit cuff at each wrist, just visible at the frame edge. Nothing else is shown.
- **Props:**
  - One daily pack, torn straight across the top only. Its colours and wording will be painted from your daily-pack photo.
  - A few gummy bears showing at the tear. Their colour will come from the photo.
- **Voice:** None on screen. The narrator is off screen, and nobody on screen speaks.
- **What never changes:**
  - The left hand holds the pack and the right hand shows the bears. This stays the same in every frame.
  - The pack is torn only across the top, and only from shot 6 on. It is never shown torn earlier.
  - The cuff colour stays the same.
  - No face or arm appears above the cuff.
  - The hands never hold a brush or any tool.

**MISSING:**
- **Ingredient list.** Without it, the leaf shapes in the turn (kale, spinach, spirulina, broccoli, wheatgrass) have to be dropped. The turn would then become plain green glazes stacking to the pouch green. Please send the list so the leaves can stay.
- **Pouch label text, word for word with colours.** I have "Sprout", the bear face and "28 Daily Packs", but I need the full label before any product prompt.
- **Daily pack label text and colours, and the gummy bear colour.**
- **Lines 1–2 and 7–8:** the narration, picture notes, seconds and claims.
- **Brand file:** exact colours, things never to show, and the approved wording of the line 5 claims.
- **Live offer and price** for the end card.

**Stop.** Please approve this avatar card, or tell me what to change. I won't start the reference images (stage 2) until you say yes.
```
