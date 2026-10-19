# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief is a usable, well-composed kitchen scene with clear roles, clutter and no product. But it breaks the output shape, scores itself down for an invented missing-research problem, and miscounts the roles.

## Fix

In the output step, require the exact labelled-line shape (SCENE, ROOM AND HOUR, ... SCORE) and state that the story ad itself counts as the lived-in evidence for check 1. Also say the 'one more trace' must be listed separately and never as an extra object inside a role.

## Judge list

- Met: Nobody is in the frame, and nothing suggests harm or an emergency.
  "No people, no text, no logos"; scene is just-left kitchen, no harm suggested.
- Met: You can name the trace, the clock and the gap without being told.
  Cold coffee mug (trace), lunchbox lid plus morning sun (clock), pushed-back chair (gap) are clear.
- Met: It looks lived in, with clutter that has nothing to do with the story.
  "phone charger cable, a hair tie, an opened letter" in the prompt.
- Met: Nothing says whose home it is.
  Plain lunchbox lid, no brands; flags say it should not hint at whose children live there.
- Met: There's no product and no second, happier photo.
  No Sprout pack in the prompt; single scene only.

## What went in

```text
Story ad (approved, built on review 15):
By 8:15 the kitchen is empty. Two cereal bowls in the sink, a
lunchbox lid left on the counter, and at my place, a full mug of
coffee gone cold and a slice of toast with one bite out of it.
That was my breakfast most school days.
Now I grab a Sprout pack on the way out. Tear the top, eat the
small handful of gummies on the way. 21 vitamins and minerals,
6 g prebiotic fiber. Or as one mum put it: "So easy to grab and
eat on my way to the billion things I have to do as a mom."

Buyer: the busy parent, 30 to 45, mostly mums.
Brand look: bright, sunny, real homes. Never clinical.
```

## What came out

```text
I can't draw the picture here because no image tool is connected, so this is the brief and a ready-to-paste prompt.

1. **Scene:** A sunny kitchen just after the school run. At one place on the table there's a full mug and a slice of toast with one bite out of it, and the chair is pushed back.

2. **Room and hour:** The kitchen at about 8:15 on a school morning. Bright, low morning sun comes through the window and falls across the table and counter. It's warm and sunny, never clinical.

3. **The three roles:**
   - **Trace:** A full mug of coffee gone cold. The one extra trace is a slice of toast with a single bite taken, on a plate beside it.
   - **Clock:** A plain plastic lunchbox lid left on the counter after the school run, with low morning sun backing it up.
   - **Gap:** Her chair pushed back from the table and angled out, as if she stood up mid-bite.

4. **Camera:** In the hallway doorway at adult standing eye level, slightly tilted. This is where she would stand coming back in and seeing the breakfast she didn't eat.

5. **Ordinary clutter:** Two cereal bowls in the sink, a phone charger cable on the counter, a hair tie by the fruit bowl and an opened letter.

6. **Words on the image:** None.

7. **Line under the image:** "Breakfast, most school days"

8. **Flags:**
   - The cold mug, bitten toast, lunchbox lid and two cereal bowls all come from the story ad's opening, not from buyer research.
   - The pushed-back chair is invented for the gap role. It is not in the story or the research.
   - Keep the lunchbox lid plain, with no character prints or brand. It should not hint at whose children live there.

9. **Image prompt:**
   > Phone photo of an ordinary family kitchen at 8:15 on a school morning, just after everyone has left. Shot from the hallway doorway at adult standing eye level, slightly tilted, 1:1 square. Bright low morning sun through the window across the counter. On the table at one place: a full mug of coffee gone cold, a slice of toast with one bite taken, and the chair pushed back from the table, angled out. A plain plastic lunchbox lid left on the counter. Two cereal bowls in the sink, a phone charger cable, a hair tie, an opened letter. Everyday mess, real home, natural light, faint grain in the shadows. No people, no text, no logos, no brands, not styled.

10. **Score: 80/100 (4 of 5 checks)**
    - Missed: buyer research showing that busy parents skip or abandon breakfast on school mornings. The review quote shows rushed mornings, not this exact moment. `MISSING: buyer research (e.g. review 15 in full or similar reviews) confirming the cold-coffee, half-eaten-breakfast morning.`

**To make the picture:**
- **ChatGPT or Gemini:** Paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** If you have `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file. You can get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.
```
