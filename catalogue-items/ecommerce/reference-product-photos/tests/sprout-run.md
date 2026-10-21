# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable reading and prompt that keeps the pouch true to the owner's description, marks every guess, and sets a real quiet area for both sizes. It correctly admits it can't draw, works from the text description rather than pretending to see the photos, and lists honest gaps (pouch size, serving count) instead of guessing.

## Judge list

- Met: All five parts of the reading are filled in. None says "unclear".
  Light, Camera, Set, Frame, Finish all filled; guesses marked "(guess)" per the skill, no line says "unclear".
- Met: The prompt never mentions the reference's product, brand or words.
  "Image 3 is the look reference. Take only its light, camera height and framing." No jar, sweets or label named in the prompt.
- Met: In the picture, the printed words match your real photo letter for letter.
  No picture made; prompt asks: "Copy its shape, deep green glossy foil, yellow wordmark, yellow bear face top right and "28 Daily Packs" printing exactly."
- Met: The product's shadow falls the same way as the rest of the scene.
  "Hard, direct morning sunlight from the right" and "cast crisp shadows to the left across the cream sill."
- Met: There's real empty space where words will go, and it survives in every size you asked for.
  "For 3:2: ... left half is open... quiet area. For 4:5: ... top and upper-left third are open... quiet area."

## What went in

```text
Product: Sprout Original (Adults), Low Sugar. Attached: the pouch
front on, and gummies in an open hand. Glossy deep green stand-up
foil pouch, big yellow wordmark, yellow bear face top right, "28
Daily Packs" at the bottom. Opens only at its resealable top.

Reference (attached): a photo I like of a glass jar of sweets on a
white kitchen windowsill. Hard morning sun from the right, crisp
shadows falling left. Jar sharp, a garden behind the window
blurred. Shot from just above sill height, close. Jar in the right
third, bright empty wall on the left.

For: an email header (3:2) and a Facebook image ad (4:5), with
words added later.

Brand look: cream #FFF7DF, forest green #00582D, sunflower yellow
#FFCC2E. Bright, sunny, candy-like. Never clinical, never muted.
```

## What came out

```text
I can't make pictures in this chat, so this is the reading and the prompt, ready to paste into an image tool.

**Reading of the reference**
This is read from your description of the photo. Lines marked *(guess)* are not in that description.

- **Light:** One hard source, morning sun through the window from about 3 o'clock, low to mid height. It is a small, hard, warm-white source *(guess on colour)*. The fill is a soft bounce off the white sill and wall. Shadows are crisp, fall to the left and are mid-dark *(guess on depth)*.
- **Camera:** Just above sill height, nearly level with a slight downward tilt. Close distance, with a normal to short-tele lens feel *(guess)*. The jar is sharp. Focus is shallow and the garden is fully soft.
- **Set:** A white kitchen windowsill against a white wall, with a garden behind the glass. The only prop is the jar of sweets, which is the reference's own subject.
- **Frame:** Subject in the right third, about a third of the frame *(guess)*. Bright empty wall on the left. No motion.
- **Finish:** High-key, bright whites with garden greens and crisp contrast. Natural to lively saturation *(guess)*, clean and low grain *(guess)*. The mood is a fresh morning.

**Keep, swap, drop**
- **Keep:**
  - Hard sun from the right with crisp shadows falling left.
  - Camera just above sill height, close.
  - Product sharp against a blurred garden.
  - Subject in the right third with an open, bright area on the left.
- **Swap:**
  - The white sill and wall become cream (#FFF7DF), because brand colours win.
  - The garden blur becomes deep greens with sunflower-yellow (#FFCC2E) flower spots.
  - The jar of sweets becomes the Sprout pouch standing upright, with a few gummies resting on the sill in the sun.
- **Drop:** The jar, the sweets in it, and any label, brand or words from the reference.
- **How it's shown:** The pouch stands upright and closed, since it opens only at the top, with a small cluster of gummies beside it. The job is identity in its place.
- **Scale:** Set by the sill depth and the window frame.
- **Angle:** A level camera suits a tall stand-up pouch.
- **Quiet area:** On the left for 3:2. Top-left and upper area for 4:5.
- **Gloss:** The foil reflects only this window and the cream room.

**Prompt**

> **Roles:** Image 1 is the real product, the Sprout Original (Adults) Low Sugar pouch. Copy its shape, deep green glossy foil, yellow wordmark, yellow bear face top right and "28 Daily Packs" printing exactly. Image 2 is the real gummies in an open hand. Copy the gummies' shape, colour and surface exactly and leave out the hand. Image 3 is the look reference. Take only its light, camera height and framing.
>
> **Scene:** A sunny kitchen windowsill painted warm cream, with a cream wall. Behind the glass is a garden softly out of focus, with deep forest greens and spots of sunflower-yellow flowers.
>
> **Product in the scene:** The pouch stands upright and closed on the sill, whole and uncut, at true size against the sill depth and window frame. A small cluster of gummies rests on the sill just in front and to the left of the pouch, catching the sun. The pouch and gummies are lit by the scene's sun and cast crisp shadows to the left across the cream sill. The glossy foil reflects only this window and room. The brightest highlight sits on the pouch's right edge, never across the wordmark, bear face or "28 Daily Packs". No shadow crosses the front print. No people, no hands.
>
> **Camera and light:** Hard, direct morning sunlight from the right, low-mid height, warm white. A soft bounce fill comes from the cream surfaces. Camera just above sill height, nearly level, close, with a short-tele lens feel. Shallow depth of field: pouch and gummies sharp, garden fully blurred.
>
> **Finish:** Bright, sunny, candy-like. A cream, forest green and sunflower yellow palette, crisp contrast and lively saturation. Clean, with no grain. Never muted, never clinical.
>
> **Keep:** The product exactly as in Images 1 and 2, whole and uncut. No added words, logos or marks. No children.
> - **For 3:2:** Pouch in the right third, filling about a third of the frame height-wise. The left half is open, sunlit cream wall and sill, kept as the quiet area.
> - **For 4:5:** Pouch in the lower right, filling about 40% of the frame height. The top and upper-left third are open, sunlit cream wall, kept as the quiet area.

Make one test picture in 3:2 first. Check it at full size beside the pouch photo before making the 4:5. If something fails, change that one line rather than resending the same prompt.

CHECKS MISSED: none

**To finish it:**
- **ChatGPT or Gemini:** Paste the prompt into a chat with Images 1–3 attached and ask for the picture. Or paste this whole skill there so it writes the prompt and makes the picture in one go. ChatGPT uses GPT Image and Gemini uses Nano Banana. Nano Banana keeps the look reference separate from the product photos well. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** If you have `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the files. Get keys at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). Each picture is billed.

**Gaps:**
- MISSING: job. You didn't pick one, so I used identity in its place.
- MISSING: pouch size, which is needed for true scale on the sill.
- MISSING: how many gummies make one daily pack, so the cluster can show a true serving.
- MISSING: a photo of a daily pack, if you want one shown in the scene.

Next, would you like to make image ads from this with the [Three-way offer image ad planner](https://useaiblocks.com/skills/three-way-offer-image-ad-planner)? Or write a full spec with the [Product image spec writer](https://useaiblocks.com/skills/product-image-spec-writer), or type your own next step.
```
