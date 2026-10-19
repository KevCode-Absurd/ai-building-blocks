# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 2 of 6 met. Invented facts: 2.

It correctly stops at approval 1 and writes the turn as paint behaviour, but it produces nothing past the avatar card. It also wrongly says the attached photos did not come through and lists many MISSING items that the input already gave.

## Fix

In the "What you need" and "If something is missing" rules, add: only write MISSING for facts truly absent from the input, and treat the supplied pouch text, tool limits and script lines as given. Do not claim attached photos are absent unless none were provided.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  "Stopping here. Does this avatar card work for you? Reply yes..." It stopped at the first gate and did not go on.
- Not met: The material sentence and lock lines are word for word the same in every image prompt.
  No material sentence, lock lines or image prompts were written; the run ended at stage 1.
- Not met: Each clip prompt names one camera move and at most one paint change.
  No clip prompts exist. Stage 0 note only says line 4 will be treated as one change.
- Met: The turn is written as what wet paint does, never as a brush at work.
  "each named green adds one thin leaf-shaped glaze over the dry shapes... the colour deepens." Paint behaviour only.
- Not met: The product's label lines are short, in quotes, and match your pack.
  No product sheet or painted label lines yet; it lists label lines but the product stage was not reached.
- Not met: Every frame reads as watercolor on paper, never as a filtered photo.
  No frames or image prompts were produced, so this can't be shown.

## Invented

- other: Warm medium skin tone; oatmeal knit sleeve; age 30 to 45; right hand (Avatar details are marked inferred, so they are acceptable.)
- number: Seconds ~3, ~5, ~6, ~2.5 (Marked as estimated from word count, so acceptable.)

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
I can only write the prompts here; no image or video tool is connected to this chat, so no pictures or clips will come from me.

# Stage 0: Script in (fixed from here on)

**Show job:** build
**Technique:** glazing, cold-press paper, light granulation

**The turn (line 4)**
- **Starts:** one pale, see-through kale-leaf glaze on dry warm-white paper, the shape left from line 3.
- **Builds:** each named green adds one thin leaf-shaped glaze over the dry shapes before it. Where the layers overlap, the colour deepens.
- **Stops:** the stacked overlap reaches the pouch's deep forest green at the pouch's outline, where the layers meet in line 5.
- **Never crosses:** the label. That means the "Sprout" lettering, the bear face top right and "28 Daily Packs". Glazes stop at the pouch edge and the label stays its own clean, crisp shape.

| Line | Narration | Picture | Seconds (est. from word count) | Claims |
|---|---|---|---|---|
| 3 | "Here are those greens, one layer at a time." | One pale kale leaf | ~3 | none |
| 4 | "Kale. Spinach. Spirulina. Broccoli. Wheatgrass." | THE TURN: glazes stack | ~5 | contains kale, spinach, spirulina, broccoli, wheatgrass |
| 5 | "Sixty-plus ingredients, twenty-one vitamins and minerals, six grams of fiber." | The pouch where the layers meet | ~6 | 60+ ingredients; 21 vitamins and minerals; 6 g fiber |
| 6 | "In one pack you tear and eat." | Hand, torn daily pack, bears | ~2.5 | one daily pack |

**Note on line 4:** five glazes in one clip would be five changes. In stage 4 I will treat it as one change: thin layers stacking in sequence over a locked-off frame. If you prefer, it can be split across two clips.

# Stage 1: Avatar card (hands, line 6 only)

The pouch carries the ad and gets its own product card in stage 3. The cast note names hands only, so this card covers the hands.

- **Role in the story:** the payoff of "you tear and eat." The hands hold one daily pack, already torn open, with the bears showing at the opening. They appear in line 6 only.
- **Age range:** adult, about 30 to 45. This is inferred, because the cast note gives no age.
- **Look:**
  - Loosely painted adult hands, seen from the wrists down.
  - Warm medium skin tone (inferred).
  - Short, plain, unpolished nails.
  - Soft, simplified knuckles with no fine skin detail.
  - Painted in the same see-through washes as the leaves, so they read as paint, never as a photo.
- **Clothes and colours:** the cuff of a soft oatmeal knit sleeve at the wrist (inferred). It stays pale so it never competes with the greens.
- **Props:**
  - One daily pack, torn straight across the top only.
  - The bears visible at the torn opening.
  - Pack art and bear shape and colour to match the attached daily-pack photo.
- **Voice:** none on screen. The narrator is off screen.
- **What never changes:**
  - Same hand holds the pack in every frame (right hand).
  - No rings, watch or bracelet.
  - Sleeve colour stays the same.
  - The pack's tear stays straight across the top and nowhere else.
  - No face or body beyond the wrist.
  - The hands never speak or gesture to camera.

# MISSING

- `MISSING: photos.` The photos (pouch front, side and top, plus the daily pack) didn't come through to me. Please re-attach them. Until I can see them, the product sheet can't be checked against the real pack.
- `MISSING: full label text.` I need the label word for word, with its colours, for the pouch and the daily pack. I have only "Sprout" in yellow, the yellow bear face and "28 Daily Packs". I'll ask again before any product prompt.
- `MISSING: ingredient list as the brand lists it.` The five leaf shapes in the turn depend on kale, spinach, spirulina, broccoli and wheatgrass being on it. Without the list, the ingredient shapes are dropped from the turn.
- `MISSING: bears.` I need to know what they are (gummies?), plus their colours and shape, from the pack photo or the brand.
- `MISSING: script lines 1–2 and 7–8.` I need the narration, the picture notes and the live offer for the end card.
- `MISSING: brand file.` I need the brand colours, things never to show and approved claims, to confirm the line 5 claims word for word.
- `MISSING: video tool name.` I'm planning for 8-second clips, start plus end frame, no sound.

**Stopping here.** Does this avatar card work for you? Reply yes, or tell me what to change, before I move to the reference images.
```
