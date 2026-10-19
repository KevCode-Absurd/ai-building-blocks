# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 2 of 5 met. Invented facts: 2.

The paper plan is coherent and the claims stay approved, but the scene is too busy for a two-second glance. The run also never read the attached photos, so the label and the product shape are unverified.

## Fix

In step 5 and the product rules, require the run to read the attached photos and build the label lines from them, and in step 2 cap the scene at one mechanism and one panel for the glance test; also use the exact output shape headings (MOMENT, SHOW JOB, BUILD, LAYOUT, CHECKS, SCORE).

## Judge list

- Not met: Shown for 2 seconds, someone can say what the product is and the one idea.
  Four-panel concertina strip plus a figure, a pack in hand and a pouch is busy; the headline never names Sprout or gummies.
- Not met: Headline 7 words or fewer, at most 3 other things to read.
  Headline is 7 words, but small line, offer and button are 3; the offer has two sentences, and renewal text adds reading.
- Met: Every object in the prompt names its paper or card, and the camera stands inside the scene.
  "Every object is paper"; camera "standing on the paper floor of the first panel"; brass fasteners are unnamed but minor.
- Met: The implied sentence is something your claims let you say.
  "One Sprout pack is easy to take along and eat during a busy morning." Backed by the product facts and the parent quote.
- Not met: The product matches your photos, with your real label laid over it.
  Says "The attached photos weren't visible to me"; the pouch is built from the description only, and the label overlay is deferred to editing.

## Invented

- number: Contrast ratios: about 8.1:1 and 5.7:1 (Computed from the brand hex codes, so it is worked out; not an invention.)
- other: 22–78% / 78–100% zone splits, 64 px and 32 px type sizes (Design choices the plan proposes, not claims of fact.)

## Safety

- The ad says "Sign Up" with a $29.99 offer; only the footer-style "with text sign-up" note gives terms, and the guarantee limit is absent.
- The run claims the photos weren't visible, though they were attached, so it never read the real label.

## What went in

```text
Selling idea: your own greens can ride along in the morning rush,
one pack at a time.
Buyer: the busy parent, 30 to 45. Knows the problem, not this fix.
Says: "So easy to grab and eat on my way to the billion things I
have to do as a mom." Runs in the Instagram feed.
Product: Sprout Low Sugar, pouch of 28 daily packs. Tear one pack
straight across the top. Pouch: glossy deep green, big yellow
wordmark "Sprout", yellow bear face top right, "28 Daily Packs" at
the bottom. Photos attached: front, side, top.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack. Never say: fix, energy or immunity results, weight loss.
Colors: forest green #00582D, cream #FFF7DF, sunflower #FFCC2E.
Offer: $29.99 first order with text sign-up, renews at $49.99
every 4 weeks.
```

## What came out

```text
I can't draw the picture in this chat, since no image tool is connected. This is the full plan and prompt.

**1. Moment plan**
- **Fit:** Good. A busy morning is a small everyday problem, and paper can turn it into a picture-book scene. Nothing here needs proof shots, tasty food or a believable face.
- **Moment:** The buyer knows the problem but not this fix, so the scene catches the change halfway. A paper parent is mid-stride along a morning that is still unfolding, with one Sprout pack in hand. The pouch stands at the end of the strip.
- **Show job:** Spread. The idea is a pack riding along through the whole morning.
- **Mechanism:** Concertina. A zigzag strip of four morning panels runs from kitchen to front door to crosswalk to office door. It is part opened, with the last panel still half folded.
- **Build:** Flat-cut parent figure pinned at shoulder, elbow, hip and knee, set on a layered concertina strip. Each panel has 3 cut planes.
- **Paper:** Cream card stock for the panels. Forest green and sunflower coloured text-weight paper for the details. Kraft for the floors and the door. All edges are scissor-cut.
- **Implied sentence:** "One Sprout pack is easy to take along and eat during a busy morning."
- **Source:** Product facts, which give 28 single daily packs that tear straight across the top. The pose is calm and steady. There is no leaping and no glow, so nothing hints at energy results.

**2. Layout**
- **Size:** 4:5, 1080 x 1350. Recompose separately for 1:1 (see edit step).
- **0–22%:** Quiet area of plain cream card for the headline.
- **22–78%:** Concertina scene running left to right.
  - The parent figure is left of centre, holding one pack.
  - The pouch stands upright on the last panel at the right, about 30% of the frame wide, against a cream panel so its deep green separates from the background.
- **78–100%:** A solid forest green #00582D card strip for the claim, offer and button.

**3. Words on the image**
- **Headline (7 words):** Your greens, along for the morning rush.
  - Forest green on cream, 64 px.
- **Small line:** 60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack.
  - Source: approved claim, word for word. Cream on green, 32 px.
- **Offer:** $29.99 first order with text sign-up. Renews at $49.99 every 4 weeks.
  - Source: the offer as given. Cream on green, 30 px.
- **Button:** Sign Up.
  - Forest green text on a sunflower #FFCC2E patch, 34 px.

**4. Image prompt**
- **Subject:** A flat-cut paper adult parent cut from coloured text-weight paper. The figure is pinned at the joints with tiny brass paper fasteners and walks calmly mid-stride, holding one small sealed daily pack cut from forest green card.
- **Setting:** The parent walks along a concertina strip of four morning scenes, part opened in a zigzag across the frame:
  - a kitchen with cream card cabinets and a kraft paper counter
  - a front door of kraft card
  - a crosswalk of cream and forest green paper stripes on a kraft paper road
  - an office door of cream card stock, its panel still half folded closed
- **Pouch:** A stand-up pouch cut and scored from glossy deep green card stands upright on the last panel. It has a large sunflower-yellow paper wordmark, a small yellow paper bear face at the top right and a yellow paper line at the bottom.
- **Paper:** Every object is paper. Cream card stock, forest green #00582D and sunflower #FFCC2E text-weight paper, and kraft paper. Clean scissor-cut edges throughout. Each panel is built from 3 layered cut planes.
- **Light:** One low warm light from the left, so every layer casts a soft shadow on the one behind it and on the folds of the strip.
- **Camera:** At eye level, standing on the paper floor of the first panel and looking along the zigzag strip. The top 22% of the frame is plain empty cream card stock, and the bottom 22% is a plain flat forest green card strip.
- **Label lines on the pouch:** "Sprout", "28 Daily Packs".
- **Avoid:** vector, 3D render, plastic, clay, desk, scissors, maker's hands, child, text, logo, glow.

**5. Post words**
- **Primary text:** One tear-open pack with 60+ ingredients, 21 vitamins & minerals, and 6g fiber, ready to ride along wherever the morning goes. First order $29.99 with text sign-up, then renews at $49.99 every 4 weeks.
- **Headline field:** Your greens, along for the morning rush
- **Button:** Sign Up

**6. Edit step**
- **Real label overlay:**
  - Cut the real pouch out of its front photo and lay it over the card pouch, matching the light from the left and the soft shadow.
  - Do the same for the single pack in the parent's hand, using a photo of the real pack.
  - Confirm the bear face, the "Sprout" wordmark, "28 Daily Packs" and any "Low Sugar" line are exact. This keeps one variant, named.
- **Words:**
  - Put the headline in the top quiet area.
  - Put the claim, offer and button on the green strip.
  - Nothing sits over cut shapes.
  - Check the price and terms against the live offer on the day the ad runs.
- **Contrast:**
  - Forest green on cream: about 8.1:1.
  - Cream on forest green: about 8.1:1.
  - Forest green on sunflower (button): about 5.7:1.
  - All pass 4.5:1.
- **1:1 version (1080 x 1080):**
  - Reprompt with three panels instead of four.
  - Headline zone 0–20%, scene 20–80%, green strip 80–100%.
  - Do not crop or stretch the 4:5 version.

**7. Score**
Score: 83/100 (5 of 6 checks)
- **Missed:** The product's true shape and label are unverified. The attached photos weren't visible to me, so the pouch shape, wordmark style and bear face are built from the description only.

**8. Missing**
- MISSING: product photos (front, side, top). Pouch shape and label were checked from the written description only.
- MISSING: a photo and description of a single daily pack. The pack in the figure's hand is a placeholder until the real pack is overlaid.
- MISSING: the product form (gummies, powder or other). The scene shows the pack sealed and no contents.
- MISSING: whether "Low Sugar" is printed on the pouch, and where.
- MISSING: the offer end date.

**To make the picture**
- **ChatGPT or Gemini:** Paste the image prompt and ask for a 4:5 picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits, and Codex on a paid ChatGPT plan can also make it.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** With `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the file. Each picture is billed. Keys are at platform.openai.com/api-keys or aistudio.google.com/apikey.
```
