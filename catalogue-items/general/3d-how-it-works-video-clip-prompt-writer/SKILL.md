---
name: 3d-how-it-works-video-clip-prompt-writer
description: Use when what a product does happens too small or too hidden to film, and you want a short narrated 3D explainer that zooms from an everyday moment into the process and back out. It runs the full video process in six stages (script in, avatar card, reference renders, sheets and lock lines, storyboard, clips and edit), stopping for your approval after the avatar card, the sheets and the storyboard. With no script, it first tests candidate processes for honesty and offers 2 or 3 story options. The product, or its active part, is usually the avatar, and every part keeps one colour and shape. Ends with a score out of 100 against its checks.
---

# 3D how-it-works video clip prompt writer

You take one true process the product takes part in all the way to a finished 3D explainer, in six stages. The film starts at human size, dives down to where the process happens, walks through it one link at a time, and comes back out to the same moment. The product appears at the link where it acts, named there, and not before.

**Stop for approval after stages 1, 3 and 4.** Never skip a stage, and never start the next one until the user approves.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Check for these first. The result is much better with them.

**Needed:**
- **Brand brain** (its products part), made by the [Website brand file builder](https://useaiblocks.com/skills/website-brand-file-builder): your facts, products, buyers, claims and voice, in one folder of eight files.

**The steps before this one** (do each once, then reuse what it makes):
1. **Brand brain** with the [Website brand file builder](https://useaiblocks.com/skills/website-brand-file-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand brain, read:** `00-start-here.md`, `voice-and-look.md`, `offers.md`, `proof-and-claims.md`. Take how the product looks, the colours, fonts and photo style, and the exact words allowed on the picture. Leave out review quotes and research notes. Source notes and rejected ideas never go into the result.

How to check:
- **In Claude Code,** look in the project first. A brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name, or ask for their path.
- **In a chat,** ask once: "Do you have your brand brain? Attach or paste them here." If they're already in this project's files, use those.
- **If one is missing,** say so before you start, in one line: the result will be much better with it, with the link to make it once and reuse it. Next time they can attach it (or, in Claude Code, give its path). Then carry on with what you have and mark each gap with `MISSING:`.

**Tools that do this best:**
- **Nano Banana:** Takes up to 14 reference images, so your parts sheet and frames keep the same colours and shapes.
- **Veo:** Takes a first and a last frame, so the dive starts and ends exactly where you planned.
- **ElevenLabs:** Reads the narration with tags for pauses and pace, in a voice you designed or licensed.
<!-- /needs -->

## What you need
- **The product** (required): name, clean photos (front, side, top, out of the pack), every label line, what it's made of, how it works (each step with a source), how it's used. Read attached photos directly, and ask for photos rather than a description. If only a description comes, say the product sheet can't be checked against the real pack.
- **Brand file** (required): claims with sources, banned claims, what buyers assume, colours and font, a voice the brand has the right to use, how the name and hard words are said.
- **Script** (optional): the locked script and cast note from the 3D script skill.
- **Your tool's limits** (optional): clip lengths, and whether a clip can start or end on a chosen image.

<!-- making-it -->
## Making the video

You write the prompts. You can't make pictures or video unless this chat has a video tool connected. Say that once, in one line, before you start, so nobody waits for a clip that won't come. At the end, tell them how to finish it:
- **Each clip starts from a picture.** Make the first frame from its image prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, then animate that picture with the clip prompt.
- **Higgsfield:** paste each clip prompt into its video tool and pick Seedance, Kling or Veo, or connect Higgsfield to Claude so Claude makes the clips there. It runs on paid credits.
- **Gemini:** paid Google AI plans include Veo video in the Gemini app, with a few clips a day.
- **Claude Code:** with a key from a video service that offers Seedance, Kling or Veo, offer to send each clip prompt to it and save the files. Pictures alone need an OpenAI or Google key. Keys: platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.

If a video tool is connected, offer to make the clips with it, and ask before you spend credits.
<!-- /making-it -->

## Stage 0: Script in
With a locked script, read it, run the three tests on it and go on. Without one, build it here:
1. **Three tests.** Hidden: a camera can't see it at normal size (if it can, a filmed demo is stronger and cheaper). True: every link can be backed. Teaches: a viewer could sketch the process after one watch, and most of the film teaches something true without the brand's name. Fail any test and say so.
2. **Candidate chains.** Look at three sizes: the tiny (molecules, fibres, microbes), the surface (skin, fabric, a pan, a filter) and the structure (layers, seams, joints). Write each candidate as 2 to 4 links: "this meets that, that happens, so the buyer gets this". Mark every link: brand claim with source, common knowledge (a school textbook would say it), or unsupported. Cut a chain back to where its support ends. Keep it only if one link is the snag and another is where the product acts.
3. **Honesty rules.** Soft, true verbs ("helps", "supports", "contains"), never cure, treat, prevent or fix. The product does no more on screen than its verb. No damage vanishing, no body before and after, no clinic, white coat or illness; show a body only as far as the claim names it, otherwise a plain model shape. Numbers only with a source and the study size. Products in a field with claim rules (health, beauty, food, money, alcohol and the like): the brand reads the script before any picture is made.
4. **Story options, then stop.** 2 or 3 whole films in 80 words or fewer each (the moment, the chain, the snag, the product's link, the closing moment, who it suits), with sources and regulator flags. Wait for the choice, then write the four movements: surface (ending on a question nobody can answer by looking), dive (one continuous move down, size said aloud), chain (one shot and one sentence per link, snag before the product's link), surface again (same moment, going easier, product in hand). About 4 seconds a link, 3 to 5 for the surface shots and the dive.

## Stage 1: Pick the avatar (approval 1)
Here the product, or its active part, usually carries the ad, so **the product is the avatar**. Write an **avatar card** for each actor in the chain, which together make the **parts key**: plain buyer's name, one colour, one simple shape, how it moves (drifts, gathers, locks on), its size against the others. Keep everything else neutral so the eye follows the coloured parts. Add a card for the product itself (modelled from its photos) and, only if the surface moment needs one, a stylised 3D adult: age range, look, fully clothed, calm, never a real person, an expert or a patient. Name the narrator's voice in plain words: one the brand recorded, hired or licensed, never cloned or copied from a creator or celebrity. **Stop. Show the cards and wait for approval.**

## Stage 2: Avatar to image
Write 3 or 4 reference render prompts for the product's active part and the product model, varied only in light or angle, plus the person if there is one. The user picks one of each.

## Stage 3: Sheets and lock lines (approval 2)
- **Parts sheet**: every part from the front, side and three-quarter, in its key colour and shape, side by side at their relative sizes.
- **Product sheet** from the real photos: front, side and top, with every label line typed exactly, for the closing shot.
- **Set sheet** for each size: the surface room at human size, and the small-size world (plain model shapes, soft light, a little haze for scale). No letters, logos or numbers inside the 3D world.
- **Character sheet** (only with a person): front, three-quarter left and right, side and back, beside the product for size.
Then write the **lock lines**, repeated word for word in every later prompt: the look line for each size, the parts key, and the product line. **Stop. Show the sheets and lock lines and wait for approval.**

## Stage 4: Storyboard (approval 3)
One frame per shot: the surface, the deepest frame of the dive, each link, the product's arrival and the surface again. Each shot card gives the size we're at, the parts in frame (by key colour), the one thing that moves, the camera (the dive is the one long continuous move; every other shot holds or makes one slow move), the narration line, seconds and sound. Then check continuity: the parts key holds in every frame, the dive starts on the surface frame and ends on the first link frame, the product's first appearance is at its own link, and the closing moment matches the opening one. **Stop. Show the storyboard and wait for approval.**

## Stage 5: Storyboard to video
1. **Voice first.** Record the narration in the approved voice. In the text the voice reads, spell hard words by sound; captions keep the real spelling. A person listens to the whole read and approves it before any picture is paid for. There's no lip-sync; the narrator stays off screen.
2. **Clips.** Each approved frame starts its clip; the dive takes the surface frame as its start and the deepest frame as its end. The clip prompt describes only the motion, with the lock lines unchanged. Make 2 or 3 takes and pick one.
3. **Edit.** Join the dive into the chain as one move; elsewhere use hard cuts or a short dissolve, so one bad clip spoils only itself. Captions word for word, with the process's key word in the brand colour the first time it's said. The offer is on-screen text over the closing shot, from current terms, never spoken. Keep words inside the app's safe zones.
4. **Fixes.** Rerun the same prompt once. Then simplify (hold the camera, one action). Then change one instruction. A part changing colour: re-attach the parts sheet. Anatomy creeping in: name the plain model shape first in the prompt.
5. **Final check** against the script and claims: a viewer could sketch the chain in four boxes, and no picture shows more than its line.

## Score it
Before the final hand-back, check the run against the 6 checks under "Check before you hand it back". Fix any failed check you can, then check again. The score measures how well these prompts meet those checks: checks passed divided by 6, times 100, rounded. Show it as `SCORE <n>/100 (<passed> of 6 checks)`, with one line for each check still missed.

## What you hand back
1. **Chains, honesty notes and story options** (stage 0, when no script came in). Stop for the choice.
2. **Avatar cards** (the parts key, the product, any person) and the voice (stage 1).
3. **Reference render prompts** (stage 2).
4. **Sheet prompts and lock lines** (stage 3).
5. **Storyboard**: frame prompts and shot cards (stage 4).
6. **Clip prompts** and the **edit list**: voice brief with spellings by sound, caption list, cuts, offer, safe zones, retake notes (stage 5).
7. **Score:** out of 100, with one line per check still missed.

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, ask in one short question what they want to do next. Offer these, and say they can type their own:
- **Check it before it goes live** with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker). It takes the video ad script.
- **Make video ads** with the [Ad script format finder](https://useaiblocks.com/skills/ad-script-format-finder). It takes the video ad script.
- **Make image ads** with the [Image ad remake planner](https://useaiblocks.com/skills/image-ad-remake-planner). It takes the video ad script.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Check before you hand it back
- You stopped after stages 1, 3 and 4 (and after the story options, if you wrote them).
- Every link and every picture traces to a source or common knowledge.
- The product appears first at its own link.
- The parts key never changes colour, shape or name.
- No unsupported number, no body before and after.
- The voice is one the brand may use, and a person approved it.

## If something is missing
Write `MISSING: <what>`. No "how it works": ask, and never make one up. If no chain passes the tests, recommend another format.

## Avoid
- Bending a claim to make a better picture.
- Copying any person's, channel's or creator's look, voice, catchphrases or footage.
- See-through bodies or bare figures. Frame only the part the camera travels into.
