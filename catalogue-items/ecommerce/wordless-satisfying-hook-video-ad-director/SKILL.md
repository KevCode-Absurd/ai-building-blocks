---
name: wordless-satisfying-hook-video-ad-director
description: Use when you need a 4 to 5 second wordless scroll-stopper to put in front of an existing ad: the product, what it is made of, or the thing it replaces does one motion that resolves (fills, peels, clicks shut, sorts). Writes the line-up, opening still prompt and clip prompt for an AI image and video model.
---

# Wordless Satisfying Hook Video Ad Director

You get two or three hook options (different motions), an opening still prompt and a clip prompt for each. A hook has one job: keep people watching so the ad body gets seen. It is judged on three things: the first frame stops the thumb, the eye stays until the motion ends, the last frame leads into the body without a change of subject.

## Inputs
- **What is sold** (required): name, real photos by job (pack front, product out of pack, in hand, close surface), how it opens or pours, its real motions and sounds, `Made of` and `Replaces` if known.
- **The ad body it joins** (required): its first frame, first line, place and light. Without it ask for the ad itself.
- **Brand brain** (optional): places and light, camera and pace, on-screen text style, buyer words for the overlay, "never show" list.
- **Clip limits** (optional): shortest clip length your tool makes. Default 4 seconds (5 if the motion needs it).

## Steps
1. **Apply the nine rules:**
   - one motion that resolves (fills, peels, clicks shut, slides free, sorts); an orbit or glide with no end is not a hook
   - the object in focus is the product out of its pack, something it is made of, or the thing it replaces; a sealed pack turning on a stand is a packshot
   - the product comes from its attached photos, each with a job; words alone got the colour wrong
   - the motion is already under way in frame 1 and ends in the last third; the last half second is still
   - the last frame hands over: product in view, printing uncovered, in the place and light where the body begins
   - real speed (see step 4)
   - sound is named: the motion's sound and its end, the room, no music, no voice
   - no speaking person and no words in the picture; a hand may do the motion; worn products are shown on a hanger, flat, or on an adult cropped below the face
   - a still first, then one clip, then a batch of 2 or 3; never 10
2. **Shape for a 4-second hook:** 0.0 the motion part-way (the pour in the air, the seal a third peeled); 0 to 2.5 it continues with the end in sight; 2.5 to 3.5 the end (brim reached, last corner free, the click); 3.5 to 4 nothing moves, product in view.
3. **Choose in this order** for each hook: the object in focus; the mechanic and what "done" looks like; the place (same as the body's); the camera (locked by default; top-down locked for fill/sort/spread/fit; slow push in that ends when the motion ends; a small arc with stated start and end side; from inside looking out only via the opening still, not words); the sound; the last frame. Then say in one sentence why this buyer would wait for the end; if there is no answer, pick again.
   Mechanics to choose from:
   - inside comes out: pour and settle; fill to the brim; scoop and level; spread in one pass; one pump gives one dose that holds; dissolve or bloom to its finished state; drop and settle
   - opens, shuts or fits: peel a seal whole; click shut; twist to the stop; slide flush into place; zip or fasten the full length; open and reveal contents in order
   - material behaves: squeeze and spring back; fold or roll to a neat block; unroll or drape; wipe a clean stripe; release whole from a tin or pan; bead and run off; cut to show a clean cross-section
   - order from disorder: sort into order; stack or nest; many become one (the old things swept aside, the product set down)
   - when nothing moves (weakest, shortest clip only): light crossing a texture; the moment just after (foam settling)
   Examples by product type: oats poured into a bowl, or bolts from a tin into a tray; a clear glass filled to its etched line; a seal on a jar peeled in one piece, or film off a new phone; vitamins tipped into a weekly organiser, or drill bits into a case; four old gadgets cleared aside and one tool set down.
   Start from the product's real motions; a motion nobody described is one the model makes up. Keep the end in doubt until late (a glass full by second 1 wastes 3 seconds). A batch of 2 or 3 differs by mechanic and by object in focus, not by wording.
4. **Real speed.** Write "real speed" once near the top. Never write slow motion, time-lapse, sped up, frozen in time, bullet time, high-speed camera or a frame rate. A slow camera is fine; a "slow pour" gets slowed playback, so write "a steady pour". Use natural verbs (settle, roll, pour, peel, click, fold, slide, land); never explode, shatter, burst or crash. Say how the material behaves when the motion depends on it: thin liquids fall in a clear stream and level at once; thick liquids fall in a rope and level slowly; cream holds a peak; powder falls with a little dust and lands as a cone; small solids tumble and stop; fabric hangs by weight; foam compresses and returns in about a second; hard materials keep their shape and click; a cap travels on its thread and stops. State counts that matter ("8 gummies").
5. **Match the body's look.** Take light, closeness and focus from the body; a hook before a phone-filmed body looks phone-filmed. Leave out dreamlike, surreal, epic, glossy, perfect, 3D, render, camera makers and film titles.
6. **Show the line-up and wait for a yes:** 2 or 3 rows with object in focus, mechanic and "done", place and camera, sound, last frame, why they wait. Ask once about the overlay.
7. **Opening still, approved.** Make it from the tagged photos. Check: product matches its photo; motion visibly part-way; camera as stated; everything the clip uses is in frame; top and bottom sixth empty; reads at thumb size with one subject.
8. **Make one clip** at the shortest length from the approved still, and check it: frame 1 already has the motion; it ends in the last third; nothing new happens after; the last frame is a clean still that sits beside the body's first frame; any frame is a good picture; a person has listened (the motion's sound, no music, no voice). Then the rest of the batch.
9. **Overlay** (added later on a copy, raw clip kept): 1 to 4 words that open a question ("Wait for it", "POV:", the first words of a buyer's thought); never an offer, price, claim or call to action; brand typeface, upper third below the feed's button band, never over the object in focus; the overlay, picture and body's first line make one point.
10. **Deliver** each hook as the raw clip, the clip with overlay, its last frame as a picture, and one line on what it shows. Test the same body with each hook in front as separate ads.

## Output
1. **Line-up table** (2 or 3 rows).
2. **Opening still prompt** for the first row (attachments by job).
3. **Clip prompt** for each row: aspect, length, real speed, camera, the motion with its start state and end state, material behaviour, counts, sound, last frame, "no words, no people speaking".
4. **Overlay text** (or none) and the **delivery list**.

## Checks
- "real speed" appears once and no speed-list word appears.
- One motion with a start and an end; natural verbs only.
- The last frame is still, product in view, printing uncovered.
- No filter-refused word, named place, shop or trademark.
- The product matches its photo; no invented contents.

## Product notes
- Copy the brand's lessons on how the product is opened and held word for word into the clip prompt.
- Worn products: hanger, laid flat, or an adult cropped below the face.
- Inputs to collect: pack front, product out of pack, in hand, close-up of the surface, real motions and sounds, `Made of`, `Replaces`, `Visible result`, `Never show`.

## If something is missing
Write `MISSING: <what>`. No out-of-pack photo: no hook that shows the product. No `how it is used`: ask before any hook that opens or pours. Motions unknown: propose from `how it is used`, mark each "inferred", and have the brand confirm.

## Avoid
- A camera move with no end as the hook.
- A hook that changes subject from the body.
- Ten variants: more than 3 means the first was not approved.
- Offers, prices or claims in the overlay.
