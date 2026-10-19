---
name: wordless-video-ad-opening-writer
description: Use when you need a 4 to 6 second wordless opening to put in front of an ad you already have, where the product, something it's made of, or the old way it replaces does one motion that visibly finishes (levels, fits, comes away whole, wipes clean, sorts). Writes a line-up of 2 or 3, then runs the video process with the product as the avatar (product card, product and set sheets, a start and end frame per opening, clip prompts) for an AI image and video tool. Scores the finished set out of 100 against its own checks.
---

# Wordless video ad opening writer

You write two or three openings, each built on a different finish, and take them through the video process. There is no person: the product is the avatar. An opening has one job: keep the right people watching long enough to reach the ad behind it. Judge each one on three moments: a first frame already in motion, a finish the eye waits for, and a last frame that hands over to the ad without a jump. Stop for approval after stages 1, 3 and 4.

## What you need
- **Product** (required): real photos labelled by what they show (pack front, product out of the pack, in a hand, a surface close-up), how it opens, pours or closes in the brand's words, its real motions and sounds, what it's made of, what it replaces. Read the attached photos directly, and ask for photos rather than a description.
- **The ad it goes in front of** (required): its first frame, first line, place and light. If you only have a description, ask for a still of that first frame.
- **Brand file** (optional): places and light, on-screen text style, buyer words for the overlay, what never to show.
- **Your tool** (optional): shortest clip length, and whether it can take a start and an end frame. Default: 4 seconds, start and end frames.

<!-- making-it -->
## Making the video

You write the prompts. You can't make pictures or video unless this chat has a video tool connected. Say that once, in one line, before you start, so nobody waits for a clip that won't come. At the end, tell them how to finish it:
- **Each clip starts from a picture.** Make the first frame from its image prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, then animate that picture with the clip prompt.
- **Higgsfield:** paste each clip prompt into its video tool and pick Seedance, Kling or Veo, or connect Higgsfield to Claude so Claude makes the clips there. It runs on paid credits.
- **Gemini:** paid Google AI plans include Veo video in the Gemini app, with a few clips a day.
- **Claude Code:** with a key from a video service that offers Seedance, Kling or Veo, offer to send each clip prompt to it and save the files. Pictures alone need an OpenAI or Google key. Keys: platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.

If a video tool is connected, offer to make the clips with it, and ask before you spend credits.
<!-- /making-it -->

## Steps

### Stage 0: Script in (the line-up)
1. **Pick candidates by finish,** the same five finishes as the satisfying motion script skill:
   - **Level:** a pour or fill settles at its end (a glass to its etched line, a scoop levelled, a palm of gummies).
   - **Fit:** a part meets its place (a lid clicks, a cap stops on its thread, a zip closes end to end).
   - **Release:** something comes away whole (a seal peeled in one piece, a loaf out of its tin).
   - **Smooth:** a surface gets done (one wipe leaves a clean stripe, water beads and runs off).
   - **Order:** mess becomes order (bolts sorted into a tray, four old gadgets swept aside and one set down).
   Start from the product's real motions. A motion nobody described is one the tool will invent, so mark it "inferred". A sealed pack turning on a stand is a pack shot, not an opening.
2. **Shape each in thirds.** Frame 1 is already part done (the pour mid-air, the seal a third up). The first two thirds carry the motion toward its end, with the end kept in doubt. The finish lands in the last third, then everything holds still for the final half second with the product in view and its printing clear.
3. **Show the line-up and wait for a yes.** 2 or 3 rows that differ by finish and by what's in focus, not by wording: the focus, the finish and what "done" looks like, the place and camera, the sound, the last frame, and one sentence on why this buyer would wait for the end. A row with no answer to that gets replaced. Ask once about the overlay.

### Stage 1: Pick the avatar (approval 1)
The product is the avatar. Write the **product card:** the exact variant, the photos by job, how it opens and moves in the brand's words, and what never changes (shape, colour, label words, where it opens and where it never does).

**Approval 1 of 3:** stop and show the product card.

### Stage 2: Avatar to image
Write 3 or 4 reference prompts of the product in the focus each row needs (out of the pack, a material close-up), from its labelled photos, in the light of the ad's first frame. The person picks one per row. Nothing inside the pack is drawn without a photo of it.

### Stage 3: Product and set sheets (approval 2)
- **Product sheet:** front, side, top, the label word for word, and each state the motion passes through (sealed, part open, open, empty).
- **Set sheet:** the place, light, distance and focus of the ad's first frame, so a phone-filmed ad gets a phone-filmed opening. Camera locked by default; overhead and locked for fills, sorts and spreads; a slow push in only if it stops when the motion does.
- **Lock lines:** the product line, the set line and a **material line** in plain words: thin liquid falls in a clear stream and levels at once; thick liquid folds like a ribbon and takes its time; powder drops with a little dust and lands as a cone; small solids tumble and stop; fabric hangs by its weight; foam squashes and springs back; hard parts keep their shape and click. State any count that matters ("8 gummies").

**Approval 2 of 3:** stop and show the sheets and lock lines.

### Stage 4: Storyboard (approval 3)
Two frames and one shot card per approved row:
- **Start frame:** the motion visibly part done, everything the motion uses already in frame, one subject that reads at thumbnail size.
- **End frame:** the finished state, still, product in view, printing clear, in the place and light of the ad's first frame.
- **Shot card:** camera, start state, the motion timed in thirds, the finish, the hold, the sound (`SFX:` the motion and its finish, `Ambient noise:` the room; no music, no voice).
Keep the top seventh and bottom third of a 9:16 frame free of anything that matters, since the app covers them.

**Approval 3 of 3:** stop and show both frames and the shot card for every row.

### Stage 5: Storyboard to video
1. **Clip prompt per row,** from both frames if your tool takes a first and last frame, or from the start frame if not: aspect, length, "real speed" once near the top, camera, start state, timed motion, finish, the hold, the material line, counts, the SFX and ambient lines, "no words, no one speaking". Never write slow motion, time-lapse, sped up, frozen or a frame rate; say "a steady pour", not "a slow pour". Use plain verbs (pour, settle, roll, peel, click, slide, land), never explode, shatter, burst or crash. Leave out style words like dreamlike, epic, glossy or render.
2. **Make one clip at the shortest length and check it:** frame 1 already moving; the finish in the last third; nothing new after it; the last half second still; the last frame sits next to the ad's first frame without a jump; only the motion's own sound. Make two or three takes, pick one, then make the rest.
3. **Overlay,** added in the edit on a copy, raw clip kept: up to 4 words that leave a question hanging ("Wait for it", "POV:"). Never an offer, price, claim or call to action. In the brand font, just below the top safe margin, never over the thing in focus.
4. **Edit and deliver:** each opening joined to the same ad with a hard cut. Deliver the raw clip, the clip with overlay, its end frame as a picture, and one line on what it shows. Test each as a separate ad.
5. **Score it.** Run the checks in "Check before you hand it back" and fix any that fail. Then score the openings: checks passed divided by checks, times 100, rounded (5 of 6 passed is 83). Show the score, the sum, and one line for each check still missed.

## What you hand back
1. **Line-up** (2 or 3 rows), with inferred motions marked.
2. **Product card** and **reference image prompts**, with the picks.
3. **Sheet prompts** and lock lines with the material line.
4. **Storyboard:** start frame, end frame and shot card per row, photos attached by job.
5. **Clip prompt** per row.
6. **Edit list:** overlay (or none) and what to deliver.
7. **Score** out of 100, with the sum and one line for each check still missed.

## Check before you hand it back
- Each approval came before the next stage.
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
