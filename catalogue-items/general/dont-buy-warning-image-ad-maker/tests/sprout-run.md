# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief is strong: a six-word stop card, generic tub, no health scare and a clear prompt. It strays from the required shape, though, so it isn't fully ready to use as specified.

## Fix

In the "What you hand back" step and output shape, require the exact uppercase headings and the SCORE line as "<passed> / 6 checks x 100 = <score>", with the score stated against 6 checks.

## Judge list

- Met: Card warns against a kind of product or habit, never a named rival
  "Don't buy another tub of greens." Names no brand; the tub is generic.
- Met: Three to nine words, reason left to the story
  "Don't buy another tub of greens." (6 words); the card carries no reason.
- Met: Looks like one person's advice, no official or hazard look
  White index card, black marker, uneven letters, no hazard styling.
- Met: Nothing scares the reader about health or safety
  Warning is about a gritty, costly habit; the reason test notes no health scare.
- Met: Old thing in frame is generic, label turned away
  "large generic plastic greens powder tub with its label turned to the wall"

## What went in

```text
Story ad (approved; narrator: a customer who agreed, built on
reviews 1 and 3, example only):
I paid $94 a month for a greens powder, even with the
subscription discount, and the drink was gritty and chalky.
My advice: don't buy another tub of greens.
The issue was never what was in it. It was sticking with it.
Sprout is one daily pack of gummies: 60+ ingredients, 21 vitamins
and minerals, 6 g prebiotic fiber. No water, no shaker. 30-day
money-back guarantee on your first order.

The kind that failed: greens powder (a big-name powder, don't
name it).
Reason: review 3 ("gritty/chalky", "$94 a month"), review 1
("an issue of consistency").
Answering claim: "60+ ingredients, 21 vitamins & minerals, and
6g fiber" in 1 pack (label).
```

## What came out

```text
No image tool is connected here, so this is a written brief and image prompt. The last section explains how to turn it into the picture.

**1. Scene**
A handwritten card propped against an old greens powder tub on a kitchen counter says not to buy another one.

**2. Where and when**
A kitchen counter at about 7:30 on a weekday morning. Soft daylight comes from a window on the left. The phone is held at chest height, angled slightly down and a little off-level. A mug, a dish towel and a few crumbs are nearby.

**3. The advice**
This is a stop. It comes from the narrator's line in the story: "My advice: don't buy another tub of greens."

**4. The reason** (for the record, not printed)
The powder was gritty and chalky, it cost $94 a month even with the discount, and the narrator couldn't stick with it.
- **Sources:** review 3 ("gritty/chalky", "$94 a month") and review 1 ("an issue of consistency").
- **Answering claim:** "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in one daily pack, from the label.
- **Reason test:** it passes. The reason is in the story, the label backs the answer, and it carries no health or safety scare.

**5. The form**
A white index card written in black marker, in one pen with slightly uneven letters.

**6. The old way in frame**
A large generic plastic greens powder tub with its label turned to the wall. The lid sits ajar with a scoop inside. Beside it is a cloudy shaker bottle with green residue. No pack anyone would recognise.

**7. Words on the image**
"Don't buy another tub of greens." (6 words)

**8. Blank version**
The same counter, tub, shaker and light, with the index card propped in the same spot and left blank.

**9. Line under the image**
Still got a half-full tub? (26 characters)

**10. Flags**
- **Words written for the image:** "Don't buy another tub of greens." This is lifted from the narrator's advice line, so it matches the approved story.
- **Claims to keep in the story only, never on the card:**
  - "60+ ingredients, 21 vitamins & minerals, and 6g fiber" (label)
  - "$94 a month" and "gritty/chalky" (review 3)
  - "consistency" (review 1)
  - the 30-day money-back guarantee
- **Product:** Sprout's name and gummies stay out of the frame.

**11. Image prompt**
Square 1:1 phone photo of a kitchen counter on a weekday morning, soft window light from the left, framed slightly off-level, ordinary clutter: a mug, a dish towel, a few crumbs. A large generic plastic greens powder tub, label turned to the wall, lid ajar with a scoop inside; a cloudy shaker bottle with green residue beside it. Propped against the tub, a plain white index card handwritten in black marker, slightly uneven letters: "Don't buy another tub of greens." No logos, brand names, prices, people or other text. Unretouched, natural colour, casual snapshot, not staged.

**12. Score**
6/6 × 100 = **100**. No checks missed.

**How to finish it**
- **Best option:** write the card by hand in black marker and photograph it against a real tub. Otherwise, generate the scene and check the card's words letter by letter.
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can also make it.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that image API and save the file.
  - Get a key at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google).
  - OpenAI or Google bills each picture.
```
