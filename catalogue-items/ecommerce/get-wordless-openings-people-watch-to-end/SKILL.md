---
name: get-wordless-openings-people-watch-to-end
description: Use when you need a 4 to 6 second wordless opening to put in front of an ad you already have, where the product, something it's made of, or the old way it replaces does one motion that visibly finishes (levels, fits, comes away whole, wipes clean, sorts). Writes a line-up of 2 or 3, then a start frame, an end frame and a clip prompt for each, for an AI image and video tool.
---

# Get wordless openings people watch to the end

You write two or three openings, each built on a different finish, and the prompts to make them. An opening has one job: keep the right people watching long enough to reach the ad behind it. Judge each one on three moments: a first frame already in motion, a finish the eye waits for, and a last frame that hands over to the ad without a jump.

## What you need
- **Product** (required): real photos labelled by what they show (pack front, product out of the pack, in a hand, a surface close-up), how it opens, pours or closes in the brand's words, its real motions and sounds, what it's made of, what it replaces.
- **The ad it goes in front of** (required): its first frame, first line, place and light. If you only have a description, ask for a still of that first frame.
- **Brand file** (optional): places and light, on-screen text style, buyer words for the overlay, what never to show.
- **Your tool** (optional): shortest clip length, and whether it can take a start and an end frame. Default: 4 seconds, start and end frames.

## Steps
1. **Pick candidates by finish.** Use the same five finishes as the satisfying motion script skill:
   - **Level:** a pour or fill settles at its end (a glass to its etched line, a scoop levelled, a palm of gummies).
   - **Fit:** a part meets its place (a lid clicks, a cap stops on its thread, a zip closes end to end).
   - **Release:** something comes away whole (a seal peeled in one piece, a loaf out of its tin, film off a new screen).
   - **Smooth:** a surface gets done (one wipe leaves a clean stripe, water beads and runs off).
   - **Order:** mess becomes order (bolts sorted into a tray, four old gadgets swept aside and one set down).
   Start from the product's real motions. A motion nobody described is one the tool will invent, so mark it "inferred". The thing in focus is the product out of its pack, something it's made of, or the old way; a sealed pack turning on a stand is a pack shot.
2. **Shape the clip in thirds.** Frame 1 is already part done (the pour mid-air, the seal a third up). The first two thirds carry the motion toward its end, with the end kept in doubt (a glass full by second 1 wastes the clip). The finish lands in the last third, then everything holds still for the final half second with the product in view and its printing clear.
3. **Choose the camera and look.** Locked by default. Overhead and locked for fills, sorts and spreads. A slow push in only if it stops when the motion does. Take the light, distance and focus from the ad's first frame, so a phone-filmed ad gets a phone-filmed opening. Leave out style words like dreamlike, epic, glossy, 3D or render, and any camera brand or film title.
4. **Write the physics in plain words.** Put "real speed" once, near the top. Never write slow motion, time-lapse, sped up, frozen, bullet time or a frame rate, and say "a steady pour", not "a slow pour", which tools read as slow playback. Use plain verbs (pour, settle, roll, peel, click, slide, land), never explode, shatter, burst or crash. Say how the material behaves when it matters:
   - thin liquid falls in a clear stream and levels at once; thick liquid folds down like a ribbon and takes its time to level
   - powder drops with a little dust and lands as a cone; small solids tumble and stop
   - fabric hangs by its weight; foam squashes and springs back
   - hard parts keep their shape and click; a cap turns along its thread and stops
   State any count that matters ("8 gummies").
5. **Name the sound** on its own lines: `SFX:` the motion and its finish (a soft tap, the click), `Ambient noise:` the room. No music, no voice.
6. **Show the line-up and wait for a yes.** 2 or 3 rows that differ by finish and by what's in focus, not by wording. Each row: the focus, the finish and what "done" looks like, the place and camera, the sound, the last frame, and one sentence on why this buyer would wait for the end. A row with no answer to that gets replaced. Ask once about the overlay.
7. **Make two stills per approved row,** from the labelled photos:
   - the **start frame**: the motion visibly part done, everything the motion uses already in frame, one subject that reads at thumbnail size;
   - the **end frame**: the finished state, still, product in view, printing clear, in the place and light of the ad's first frame.
   Keep the top seventh and bottom third of a 9:16 frame free of anything that matters, since the app covers them.
8. **Make one clip,** at the shortest length, from both stills if your tool takes a first and last frame, or from the start frame and the prompt if not. Check: frame 1 already moving; the finish in the last third; nothing new after it; the last half second still; the last frame sits next to the ad's first frame without a jump; the sound is the motion's own, with no music or voice. Then make the rest.
9. **Overlay,** added later on a copy, raw clip kept: up to 4 words that leave a question hanging ("Wait for it", "POV:", or a buyer's thought as it would begin). Never an offer, price, claim or call to action. In the brand font, just below the top safe margin, never over the thing in focus.
10. **Deliver** each opening as the raw clip, the clip with overlay, its end frame as a picture, and one line on what it shows. Test the same ad with each opening in front, as separate ads.

## What you hand back
1. **Line-up** (2 or 3 rows), with inferred motions marked.
2. **Start and end frame prompts** for each approved row, photos attached by job.
3. **Clip prompt** per row: aspect, length, real speed, camera, start state, timed motion, finish, the hold, material behaviour, counts, SFX and ambient lines, "no words, no one speaking".
4. **Overlay** (or none) and the **delivery list**.

## Check before you hand it back
- "Real speed" appears once and no slow-motion or time-lapse word appears.
- One motion with a visible finish; plain verbs only.
- The end frame is still, product in view, printing clear, matching the ad's first frame.
- No words in the picture, no person speaking, no shop name or trademark other than the product's own printing.
- The product matches its photos, with nothing made up inside it.

## If something is missing
Write `MISSING: <what>`. No out-of-pack photo: no opening that shows the product out of its pack. No use steps: ask before any opening that opens or pours. Motions unknown: propose them from how it's used, mark each "inferred", and ask the brand to confirm.

## Avoid
- A camera move with no finish.
- An opening that changes subject from the ad.
- Batches of ten. More than three means the first wasn't right.
