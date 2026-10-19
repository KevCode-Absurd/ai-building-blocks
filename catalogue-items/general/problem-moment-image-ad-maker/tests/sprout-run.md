# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief is strong: a believable, unposed kitchen-sink moment that matches the story's opening and keeps product, face and words out. It reads as a numbered list with bold labels rather than the required shape, and the closing instructions are long.

## Fix

Add a rule in the 'What you hand back' step that the reply must use the exact output-shape block (uppercase labels, one line each, SCORE line last), without numbered bold lists.

## Judge list

- Met: Story's first line and the picture show the same instant
  Opening is the sink, huge multivitamin, three tries; picture shows pill back in palm after second try, glass in hand.
- Met: Buyer would say 'that's me', not 'that's an ad'
  Own-view shot over the sink at 7:40 weekday, grey sweatshirt, everyday mess, unretouched.
- Met: Nobody smiling, posing or pulling a pained face
  "Face: None shows." Strain is in grip: "right hand grips the glass tight, knuckles firm."
- Met: No product, logo, price or words in the picture
  Words: None; prompt says "No face, no text, no logos, no brand colours, no product packaging."
- Met: Line under image describes the thing or moment, never the reader
  "Second try. Still too big." describes the moment; no product name, no 'you'.

## What went in

```text
Story ad (approved, built on review 5 and the brand's own line
about pills):
Every morning at the kitchen sink: one huge multivitamin, a full
glass of water, and three tries to get it down.
Then the probiotic. Then the B12.
Now it's one Sprout daily pack. Tear the top, eat the small
handful of gummies inside. 60+ ingredients, 21 vitamins and
minerals, 6 g prebiotic fiber. No water needed.

Buyer: the quitter who wants to stick, 28 to 45, office jobs.
Brand look: bright, sunny, everyday adults in casual clothes at
home. Never clinical.
```

## What came out

```text
I can't draw the picture here because no image tool is connected, so this is the brief and a ready-to-paste prompt.

1. **Scene:** Someone's hand over a sunny kitchen sink, holding a big multivitamin that didn't go down, with a half-drunk glass in the other hand.

2. **Where and when:** The kitchen sink at about 7:40 on a weekday morning, before work. Within reach are the tap, a half-drunk glass of water, two plain unlabelled supplement bottles, a sponge and yesterday's mug.

3. **The instant:** She's looking down at the big multivitamin back in her palm after the second try, glass still in her other hand.

4. **Who held the phone:** The buyer herself. It's her own view, looking down over the sink at her hands, so it reads as "this is me."

5. **The person:**
   - **Who:** A made-up woman of about 34, ready for an office day, in a grey sweatshirt with the cuff pushed up and a hair tie on her wrist.
   - **Hands:** Her left palm is cupped open with the pill in it. Her right hand grips the glass tight, knuckles firm.
   - **Face:** None shows.

6. **Words on the image:** None.

7. **Line under the image:** "Second try. Still too big." (26 characters, in the buyer's own voice.)

8. **Flags:**
   - **Inferred:**
     - The instant comes from the opening line, "three tries to get it down." The story doesn't say the pill comes back out, so showing it back in her palm is inferred.
     - Her gender and exact age are inferred from the 28 to 45 range.
     - The probiotic and B12 are shown as generic, label-free bottles.
   - **Out of frame:**
     - The Sprout pack and the gummies.
     - Her face, and any other person.
     - Pill organisers and anything else clinical.
     - Any rival brand, label or brand colour.
   - **Kept small:** The pill is shown at its real large size, not cartoonishly huge.

9. **Image prompt:**
   > Square 1:1 phone photo, shot from her own eyes looking down over a kitchen sink at 7:40 on a weekday morning. A woman's hands, mid-30s, grey sweatshirt cuff pushed up, hair tie on her wrist: her left palm cupped open with one large oval multivitamin back in it, her right hand gripping a half-drunk glass of water tightly. Two plain unlabelled supplement bottles stand by the tap, one cut off by the frame's edge. Low bright morning sun through the window over the sink, water drops on the steel, a sponge and yesterday's mug nearby. Slightly off-centre, everyday mess, unretouched. No face, no text, no logos, no brand colours, no product packaging.

10. **Score:** 100/100 (6 of 6 checks)

**To make the picture:**
- **ChatGPT or Gemini:** Paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** Paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** If you save an OpenAI or Google key as `OPENAI_API_KEY` or `GEMINI_API_KEY`, I can send the prompt to that image API and save the file. OpenAI or Google bills each picture.
  - OpenAI keys: platform.openai.com/api-keys
  - Google keys: aistudio.google.com/apikey
```
