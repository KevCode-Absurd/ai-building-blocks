# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable brief: the gate is answered honestly, the only numbers in view are the story's own, and the one gap (which four days were ticked) is clearly marked as a placeholder with a real-screenshot fix. The owner can paste the prompt or, better, photograph the customer's actual app and draw the circle by hand.

## Judge list

- Met: The reading is one your buyer takes themselves, not a clinic scan or a doctor's file.
  "the narrator keeps the habit app and reads its 'vitamins' row herself, on her phone."
- Met: There's exactly one mark, on the part your story's first line explains.
  "circle, magenta ... one loose circle around the empty stretch of the 'vitamins' row" matches "4 ticks out of 31".
- Met: Every number you can read comes from your story or research.
  "March", 1–31 and 4 ticks sourced to the story; tick days "2, 3, 4 and 11 are [inferred] placeholders" and listed under CHECKS MISSED.
- Met: It names no condition and shows no name, date of birth or clinic.
  "No condition, no clinic, no alarm colours" and prompt says "no other readable text or numbers".
- Met: The app or sheet looks generic, with no real app's icon or colours.
  "a plain, generic habit-tracker app in month view ... No logo, no brand colours"

## What went in

```text
Story ad (approved; narrator: a customer who agreed, example only):
My habit app has a row called "vitamins". In March it had 4
ticks out of 31.
I've tried a few green powders over the years. The issue was
never what was in them. It was sticking with it.
Sprout is one daily pack you tear open and eat: a small handful
of gummies, 21 vitamins and minerals, 6 g prebiotic fiber.

Claims list: 21 vitamins and minerals, 6 g prebiotic fiber
(label). "95% of users take Sprout at least 4-6x per week"
(brand survey of 3,000+ customers, always "of surveyed users").
```

## What came out

```text
I can't make images in this chat, so I'll hand back the prompt and how to finish it.

```
GATE              Yes: the narrator keeps the habit app and reads its "vitamins" row herself, on her phone.
                  Yes: the only claim about the reading is the story's own "4 ticks out of 31" in March, the customer's figure. The picture claims nothing about Sprout changing it.
                  Yes: an ordinary habit calendar with gaps. No condition, no clinic, no alarm colours.
SCENE             Someone's habit app for March, where the "vitamins" row is almost all empty circles, and someone has circled the gap.
WHERE AND WHEN    A kitchen counter on a weekday morning, in window light. A blurred mug and the corner of a cutting board sit at the frame edge. The camera is a second phone shooting over the shoulder at a slight tilt, with a thumb at the left edge holding the phone.
THE READING       A generic habit-tracker month view on a phone, headed "March". The one part that tells the story is the long empty run in the "vitamins" row after the few ticks.
THE MARK          circle, magenta (the colour least present against a white screen, grey ticks and warm wood; it isn't an alarm red), one loose circle around the empty stretch of the "vitamins" row
NUMBERS IN VIEW   "March" and days 1–31: from the story ("In March", 31 days). 4 ticks: from the story ("4 ticks out of 31"). Which 4 days are ticked: MISSING. Days 2, 3, 4 and 11 are [inferred] placeholders. Nothing else is readable.
LINE UNDER IMAGE  4 ticks out of 31 in March (the buyer's own line, 26 characters)
FLAGS             This is a reading in the picture, so a person checks the claims behind it before it runs.
                  Claim: "In March it had 4 ticks out of 31". Source: the narrating customer's own habit app. Confirm it with her real March screenshot, because the story is marked "example only".
                  The picture and line don't use the survey claim. If the copy adds it, it must read "95% of surveyed users take Sprout at least 4-6x per week" (brand survey, 3,000+ customers).
                  Nothing may say Sprout treats or fixes anything.
IMAGE PROMPT      Casual phone photo of a smartphone held by a hand at the left edge, over a wooden kitchen counter, morning window light, soft glare and faint moire on the screen, slight tilt, unretouched. The screen shows a plain, generic habit-tracker app in month view, headed "March", days 1 to 31 in a grid. One row labelled "vitamins" is in sharp focus: simple grey check marks on only four days (2, 3, 4, 11), and the other 27 days are empty circles. The rows above and below are soft and out of focus. No logo, no brand colours, no other readable text or numbers. A mug and a cutting board are blurred at the frame edge. Square 1:1.
MARK STEP         After the photo is made, open it in your phone's photo editor. Use the markup pen in magenta at medium width and draw one quick, slightly uneven circle around the empty days after the last tick in the "vitamins" row. Draw it once and don't redo it.
                  Fallback prompt line: "one rough hand-drawn magenta marker circle around the empty days 12 to 31 in the vitamins row, uneven and imperfect"
CHECKS MISSED     Every readable number sourced: which four days were ticked isn't in the story, so 2, 3, 4 and 11 are inferred. Replace them with the customer's real screenshot. Best is to photograph her actual app.
```

MISSING: the customer's real March screenshot showing which 4 days she ticked, and confirmation that the 4/31 figure is hers.

**To finish it:**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, the prompt can be sent to that image API and the file saved. Keys are at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.
- **Best option:** photograph the customer's own app on a phone and draw the circle by hand. Every number will then be true.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker), using this image prompt? Or say what you'd like to do next.
```
