---
name: wordless-video-ad-opening-writer
description: Use when you need a 4 to 6 second wordless opening to put in front of an ad you already have, where the product, something it's made of, or the old way it replaces does one motion that visibly finishes (levels, fits, comes away whole, wipes clean, sorts). Writes a line-up of 2 or 3, then runs the video process with the product as the avatar (product card, product and set sheets, a start and end frame per opening, clip prompts) for an AI image and video tool.
---

# Wordless video ad opening writer

You write two or three openings, each built on a different finish, and take them through the video process. There is no person: the product is the avatar. An opening has one job: keep the right people watching long enough to reach the ad behind it. Judge each one on three moments: a first frame already in motion, a finish the eye waits for, and a last frame that hands over to the ad without a jump. Stop for approval after stages 1, 3 and 4.

**All stages at once.** If the person asks for every stage in one go, or already gives the approvals in their message, write stages 0 to 5 in one reply in the layout under "What you hand back": carry the strongest row through, mark each approval point "(approve)", and end by asking for their yes on each. If they change something at a point, redo the stages after it. At a normal stop, hand back the stages done so far in that same layout, then the stop question.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
This skill runs on its own. What's below makes the result better, but none of it is required.

**Works best with** (or they can paste their own instead):
- **Brand brain** (its products part), made by the [Website brand brain builder](https://useaiblocks.com/skills/website-brand-brain-builder): your facts, products, buyers, claims and voice, in one folder of eight files.
- **Your video ads** (yours): the video ads, attached or linked.

**Makes it better (optional):**
- **Product photos** (yours): clear photos of the real product, from more than one angle. Attach them.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand brain** with the [Website brand brain builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `voice-and-look.md`, `offers.md`, `proof-and-claims.md`. Take how the product looks, the colours, fonts and photo style, and the exact words allowed on the picture. Leave out review quotes and research notes. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In Claude Code, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name.
2. **If something is missing, advise, don't block.** In one short message, say this skill works on its own and will be better with your brand brain, your video ads, product photos. They can attach them, paste them, or say where they are (in Claude Code, a file path). Name the recommended steps above as a suggestion, with their links. Then ask: "Add them, or shall I go ahead with what you've given me?" If their message already says to go ahead, skip this and start.
3. **When they say go ahead,** do the whole job with what you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once, merge steps that give the same thing, and aim for under 700 words unless the job truly needs more. In CHECKS MISSED, name only the checks that failed, or write “none”.

**Tools that do this best:**
- **Veo:** Makes the motion between a start frame and an end frame you give it, with matching sound.
- **Kling:** Starts each clip from the start frame you choose, which helps when testing several openings.
- **Nano Banana:** Makes the product sheet and the start and end frames from your photos with real-looking light.
<!-- /needs -->

## What you need
This skill runs on its own. All it needs to start is the product and how it moves, in plain words; everything else below makes the result better. If something is missing, ask once in one short message for what you can't work without (or let them paste their own version), then carry on with what you have and mark each gap `MISSING:` or `[inferred]`.

- **Product** (required): real photos labelled by what they show (pack front, product out of the pack, in a hand, a surface close-up), how it opens, pours or closes in the brand's words, its real motions and sounds, what it's made of, what it replaces. Read the attached photos directly, and ask for photos rather than a description.
- **The ad it goes in front of** (required): its first frame, first line, place and light. If you only have a description, ask for a still of that first frame. With no ad at all, plan the end frame in the product's own setting and mark the match to the ad as still to do.
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
   Start from the product's real motions. A motion nobody described is one the tool will invent, so mark it "inferred". A sealed pack turning on a stand is a pack shot, not an opening. Props come only from the product photos, the ad's first frame or the brand file; mark any other prop "inferred". "Why they'd wait" says what the motion makes the viewer want to see, never a fact about the buyer (what they own, what they did) the brand file doesn't give. Write the rows in the line-up layout even when photos are missing; a description is enough to plan from.
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
5. **Check it.** Run the checks in "Check before you hand it back" and fix any that fail. List any you couldn't fix on a `CHECKS MISSED:` line, or write "none".

## What you hand back
1. **Line-up** (2 or 3 rows), with inferred motions marked.
2. **Product card** and **reference image prompts**, with the picks.
3. **Sheet prompts** and lock lines with the material line.
4. **Storyboard:** start frame, end frame and shot card per row, photos attached by job.
5. **Clip prompt** per row.
6. **Edit list:** overlay (or none) and what to deliver.
7. `CHECKS MISSED:` one line for each check you couldn't fix, or "none".

Hand it back in exactly this layout, with these labels in this order (at a stop, end at the stage you stopped after):

```
STAGE 0  LINE-UP (approve one or more rows)
<n> Focus: <..>  Finish: <kind>: <motion>. Done = <..>
  Camera: <..>  Sound: <..>  Last frame: <..>
  Why they'd wait: <one sentence>
Inferred: <motions or props to confirm>
STAGE 1  PRODUCT CARD (approval 1)  <variant, photos by job, never changes>
STAGE 2  REFERENCE IMAGES  1-4 <prompt>  Picked: <n per row>
STAGE 3  SHEETS (approval 2)
Product: <views, label words, states>  Set: <the ad's place and light>
LOCK LINES  <product> <set> <material>
STAGE 4  STORYBOARD (approval 3)
START FRAME (row <n>)  <motion part done>
END FRAME (row <n>)  <finished, still, matching the ad's first frame>
SHOT CARD  <camera, timed motion, finish, hold, SFX, ambient>
STAGE 5  CLIP PROMPT (row <n>)
<aspect>, <seconds>, real speed. <timed motion>. No words, no one speaking.
OVERLAY  <1 to 4 words, or none>   DELIVER  <raw clip, overlay copy, end frame>
MISSING: <..>
CHECKS MISSED: <one line each, or none>
```

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check it before it goes live** with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker). It takes the ad copy.
- **Make video ads** with the [On-screen text planner for video ads](https://useaiblocks.com/skills/video-ad-text-overlays). It takes the video ads.
- **Make image ads** with the [Article headline image ad maker](https://useaiblocks.com/skills/article-headline-image-ad-maker). It takes the ad copy.
- **Write the ad copy** with the [Ad first line writer and scorer](https://useaiblocks.com/skills/ad-first-line-writer-and-scorer). It takes the ad copy.
- **Write the landing page** with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer). It takes the ad copy.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Check before you hand it back
- Each approval came before the next stage, or, when asked for every stage at once, each approval point is marked "(approve)" and the yeses are asked for.
- "Real speed" appears once and no slow-motion or time-lapse word appears.
- One motion with a visible finish; plain verbs only.
- The end frame is still, product in view, printing clear, matching the ad's first frame.
- No words in the picture, no person speaking, no shop name or trademark other than the product's own printing.
- The product matches its photos, with nothing made up inside it.

## If something is missing
Write `MISSING: <what>`. No out-of-pack photo: no opening that shows the product out of its pack. No use steps: ask once, plan openings that don't depend on them, and mark the rest `MISSING:`. Motions unknown: propose them from how it's used, mark each "inferred", and ask the brand to confirm.

If photos or the ad's still are named but you can't see them, say so in one line. Take the product's look and label words from the brand file (or the input), mark the photo check as still to do, and never describe a photo you didn't see. A missing photo never stops the line-up. Before writing `MISSING:` for a fact, look for it in the brand file and the input; write it only when both lack it.

## Avoid
- A camera move with no finish.
- An opening that changes subject from the ad.
- Batches of ten. More than three means the first wasn't right.
