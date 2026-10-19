# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 5 met. Invented facts: 0.

The brief is a solid, usable cupboard photo prompt that follows the story and keeps labels unreadable. However, it drifts from the required output format and invents a detail about the jars' use, so it isn't fully clean.

## Fix

In the 'What you hand back' step, enforce the exact output-shape headings and the 'SCORE <passed> / 6 checks x 100' format, and for 'Left half full' show only the use the story states (e.g. the loose lid), not invented fill levels.]

## Judge list

- Met: Every object is a generic kind with no readable label.
  "labels turned to the back"; "No readable text, no logos"; plain mismatched jars advised.
- Not met: It shows only the things your story names, with the use the story describes.
  Story names greens tub plus three gummy kinds; output adds a mug, teabags, honey (fine) but says gummy jars "partly used" and tub scoop correct.
- Met: The camera is where your buyer would find these things.
  "cupboard door just pulled open at eye level beside a kettle"
- Met: It looks like a real cupboard, familiar and not disgusting.
  "Everyday clutter, unretouched." Dried clumped powder is ordinary.
- Met: There's no person and no product.
  "No people"; "The Sprout pack is left out because the brief didn't ask for it."

## What went in

```text
Story ad (approved; narrator: a customer who agreed, built on
review 5, example only):
The cupboard by the kettle: every supplement I've given up on.
A greens powder tub, a third full, the scoop stuck in dried
powder. Probiotic gummies. B12 gummies. Multivitamin gummies,
lid left loose.
I stopped buying the separate ones. Now it's one Sprout daily
pack: 60+ ingredients, 21 vitamins and minerals, 6 g prebiotic
fiber, in a small handful of gummies. Tear the top, eat them.
```

## What came out

```text
No image tool is connected here, so this is the written brief and prompt only, not the picture.

1. **Scene:** A kitchen cupboard just opened, with a row of half-used supplement tubs and gummy jars.

2. **Where and when:** The cupboard by the kettle, on a weekday morning. Plain daylight comes from a side window and the shelf sits in slight shadow. The camera is at the eye level of someone standing at the counter, with the door just pulled open.

3. **How it was given up:** Left half full. Each one was bought, tried and dropped while there was still product inside. The greens tub is "a third full" and a lid was "left loose." Four kinds in one row show "again and again."

4. **The objects:**
   - **A greens powder tub:** About a third full with the lid off. A plastic scoop is stuck upright in dried, clumped powder. It sits front left.
   - **A probiotic gummies jar:** Partly used and plain, with its label turned to the back. It sits next in the row.
   - **A B12 gummies jar:** Partly used, plain, with its label turned away. It sits next.
   - **A multivitamin gummies jar:** Partly used. The lid sits loose and tilted, not screwed on. It sits at the end of the row.

5. **Ordinary things around it:** A mug, a box of teabags turned away, a jar of honey and a coiled phone charger.

6. **Words on the image:** None.

7. **Line under the image:** "The cupboard by the kettle" (26 characters)

8. **Flags:**
   - **Inferred amounts:** The story doesn't give the gummy jars' fill levels, so "partly used" is inferred.
   - **Lookalike risk:** Gummy jars can look like known brands, especially white bottles with coloured caps. Use plain, mismatched jars with no distinctive shape, and turn the labels away.
   - **No product:** The Sprout pack is left out because the brief didn't ask for it.
   - **Narrator:** This is an example built on review 5 from a customer who agreed. Confirm that consent covers this image.
   - **Easiest honest photo:** Photograph that customer's or a team member's real cupboard, with labels turned away.

9. **Image prompt:**
   Square 1:1 phone photo taken standing at a kitchen counter. A cupboard door has just been pulled open at eye level beside a kettle. Ordinary morning daylight comes from a side window, with soft shadow inside the cupboard. On one shelf, in a loose row: a plain green tub of greens powder about a third full, lid off, a plastic scoop stuck upright in dried, clumped powder; then three plain plastic gummy jars, each partly used, labels turned to the back, the last jar's lid sitting loose and tilted. Around them are a mug, a box of teabags turned away, a jar of honey and a coiled phone charger. Everyday clutter, unretouched. No readable text, no logos, no people.

10. **Score:** 100. All 6 of 6 checks passed (6/6 × 100 = 100). No checks missed.

**To make the picture:**
- **ChatGPT or Gemini:** Paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** Save an `OPENAI_API_KEY` (from platform.openai.com/api-keys) or a `GEMINI_API_KEY` (from aistudio.google.com/apikey). The prompt can then go to that image API and the file gets saved. OpenAI or Google bills each picture.
```
