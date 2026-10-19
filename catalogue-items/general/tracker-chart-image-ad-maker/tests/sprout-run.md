# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief is strong and sound: a true 4-of-31 reading, one cyan circle, generic app, no invented facts, and sensible flags. But it breaks the required output shape and the score line. The shape specifies 6 checks and the run reports 8 of 8, and it uses numbered bold headings in place of the specified labels.

## Fix

In the output step, require the exact labelled lines from the output shape and the score as "<passed> / 6 checks x 100". Make it say the six checks it scores against, since the checks list holds more than six items.

## Judge list

- Met: The reading is one your buyer takes themselves, not a clinic scan or a doctor's file.
  "It's the narrator's own habit app on their own phone."
- Met: There's exactly one mark, on the part your story's first line explains.
  "one rough circle... around the longest run of empty squares in the 'vitamins' row"
- Met: Every number you can read comes from your story or research.
  "4 ticks and 31 squares... source is the story"; day numerals match a 31-day March; no other numbers.
- Met: It names no condition and shows no name, date of birth or clinic.
  "no condition named, no clinic and no alarm colours."
- Met: The app or sheet looks generic, with no real app's icon or colours.
  "a generic, unbranded habit-tracker app in its March month view"

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
No image tool is connected to this chat, so this is a written brief and prompt only. The steps to make the picture are at the end.

**1. Gate**
- **Buyer takes the reading themselves?** Pass. It's the narrator's own habit app on their own phone.
- **Brand can back what the story says about it?** Pass. "4 ticks out of 31" comes from the approved story. The survey claim "95% of surveyed users take Sprout at least 4-6x per week" (brand survey, 3,000+ customers) speaks to the same reading, which is sticking with a daily habit.
- **Can it stay ordinary?** Pass. It shows missed vitamins in a normal month, with no condition named, no clinic and no alarm colours.

**2. Scene**
Someone held up their phone to show a habit calendar where the "vitamins" row for March is almost all empty, and they circled the blank stretch.

**3. Where and when**
- **Place:** a kitchen counter.
- **Time:** a weekday morning in ordinary window daylight.
- **Around the reading:** a mug, a few crumbs and the counter edge, all soft in the background.
- **Camera:** another phone shooting from just above and slightly to one side, tilted a few degrees. There is glare across the screen and a thumb at the bottom edge.

**4. The reading**
- **What it is:** a generic, unbranded habit-tracker app in its March month view, on a smartphone held in a hand.
- **The part that tells the story:** the "vitamins" row has 31 day squares and only 4 ticks. The long run of empty squares after the last tick carries the story.

**5. The mark**
- **Shape:** one rough circle (a loose oval) around the longest run of empty squares in the "vitamins" row.
- **Colour:** cyan. It's the colour least present in a warm kitchen photo with a white screen and green ticks, and it avoids red, which would read as an alarm.

**6. Numbers in view**
- **4 ticks and 31 squares, countable:** source is the story ("In March it had 4 ticks out of 31").
- **"March" label:** source is the story.
- **Day numerals:** small and soft, matching a 31-day March.
- **Anything else:** none readable. Other rows are out of focus or cropped, and there are no totals, streaks or percentages.

**7. Line under the image**
March: 4 ticks out of 31.

**8. Flags**
- **A reading in the picture: a person checks the claims behind it before it runs.**
  - Claim: 4 of 31 days ticked in March.
  - Source: the approved story. The narrator is marked "example only", so confirm this against a real customer's record, or build the chart yourself from these exact numbers.
- **If the survey figure appears in any copy near this image,** it must read "95% of surveyed users take Sprout at least 4-6x per week" (brand survey, 3,000+ customers). It should never be presented as a general fact.
- **Label claims** (21 vitamins and minerals, 6 g prebiotic fiber) come from the label. No copy may say Sprout treats, fixes or reverses anything.

**9. Image prompt**
Phone photo, square 1:1, of a hand holding a smartphone over a kitchen counter in ordinary morning daylight. The phone shows a generic, unbranded habit-tracker app in a March month view. One row labelled "vitamins" is in sharp focus: a strip of 31 small day squares, only 4 filled with a plain green tick, the other 27 empty and pale grey. Other habit rows are blurred or cut off by the frame. No totals, percentages, streak counts or other numbers on screen. Slight tilt, faint window glare and light moire on the glass, thumb at the bottom edge, a mug and crumbs soft in the background. Unretouched, no logo, no product, no face.

**10. Mark step**
1. Open the photo in your phone's built-in markup tool (iPhone Photos > Edit > Markup, or Google Photos > Edit > Markup).
2. Pick the pen in cyan at medium width.
3. Draw one loose oval around the longest empty run in the "vitamins" row, in one quick stroke. Let it be slightly uneven, and don't close it neatly.
4. Save a copy.

Fallback prompt line: *"Add one rough, hand-drawn cyan circle around the longest run of empty squares in the 'vitamins' row, like a quick finger scribble in a phone markup tool."*

Better still, recreate the row in a real habit app with exactly 4 ticks in March, then photograph it. Every number will then be true.

**11. Score**
100 / 100 (8 of 8 checks passed: Stop, Sort, Follow, one mark, every number sourced, no personal or clinic details, no diagnosis or treatment claim, house rules hold).

**To make the picture**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits, and Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** save an OpenAI or Google key as `OPENAI_API_KEY` or `GEMINI_API_KEY`, and the prompt can be sent to that image API and the file saved. You can get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. OpenAI or Google bills each picture.
```
