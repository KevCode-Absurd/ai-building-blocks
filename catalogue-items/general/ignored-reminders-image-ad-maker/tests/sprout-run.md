# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

The brief follows the story's three reminders exactly and keeps the screen generic, with no product, brand or claim on it. Gaps and inferences such as the clock time and weekday are clearly marked, and the build steps are usable.

## Judge list

- Met: Each reminder was set by the narrator, for the narrator; none looks like it came from a real app, bank, clinic, shop or courier.
  Reminders lifted word for word from the story, e.g. "Did anyone take the vitamins?"
- Met: No reminder is a sales message or names your product.
  "Kids vitamins. Before shoes." names no brand and makes no sales pitch.
- Met: Each reminder is something a person would really set.
  "Vitamins. Still on the counter." is a plausible self-set nudge.
- Met: Four reminders or fewer, and every time and word is right.
  Three reminders at 7:45, 7:30, 7:15, matching the story exactly, newest first.
- Met: The screen copies no real phone's look, and the wallpaper is a plain colour.
  "plain muted slate grey, with no photo"; no real phone icons, fonts or layout.

## Invented

- number: 90% opacity (A design suggestion for the build, not a fact about Sprout.)

## What went in

```text
Story ad (approved, built on reviews 15 and 16):
My phone has three school-morning reminders.
7:15: "Kids vitamins. Before shoes."
7:30: "Vitamins. Still on the counter."
7:45: "Did anyone take the vitamins?"
Most mornings the answer was no.
I'd tried all of the green options for the kids. Sprout Kids is
the only one mine love eating: 6 Strawberry Burst gummies in a
daily pack, for ages 2 to 13. They think it's a treat. I grab my
own pack on the way out the door.

Buyer: the busy parent, 30 to 45, mostly mums. Problem time: the
school run.
```

## What came out

```text
I can't draw in this chat, so I'm handing back the brief and prompt. Finishing steps are at the end.

**1. Scene**
A mum's phone lock screen at 7:52 on a school morning, with three vitamin reminders she ignored stacked on top of each other.

**2. How they pile up**
Getting sharper. The story quotes three reminders that go from an instruction, to a nudge, to a tired question. That shows a routine slipping under school-run pressure, not one simply forgotten.

**3. The screen**
- **Type:** a generic lock screen, with no real phone's icons, fonts or layout.
- **Wallpaper:** plain muted slate grey, with no photo.
- **Clock:** "7:52" in large type at the top, with "Tuesday" small underneath.
- **Cards:** three white rounded notification cards stacked newest on top. Each is labelled only "Reminder" and has its time on the right.
- **Crop:** off-centre, with the top and bottom edges cut like a shared screenshot.

**4. Words on the image** (newest first, exactly)
- 7:45: Did anyone take the vitamins?
- 7:30: Vitamins. Still on the counter.
- 7:15: Kids vitamins. Before shoes.
- Clock: 7:52
- Date line: Tuesday

**5. Blank version**
The same slate-grey lock screen, crop and clock. It shows "7:52" and "Tuesday" with no cards below.

**6. Line under the image**
Three reminders. No vitamins.

**7. Flags**
- **Lifted:** all three reminders and their times come word for word from the approved story.
- **Written for the image:** the "Reminder" card labels, the date line and the caption.
- **Inferred:**
  - The clock time 7:52 `[inferred]`, seven minutes after the last reminder, so they read as ignored.
  - "Tuesday" `[inferred]`, as any school weekday.
  - The slate-grey wallpaper `[inferred]`.
- **MISSING:** brand colours. The wallpaper must not match Sprout Kids' colours. Please check this, since no brand brain was given.

**8. How to make it**
Best is to build it in Canva or Figma:
1. Make a 1080 × 1080 frame filled with flat slate grey (about #5E6670). Swap the colour if it's close to the brand's colours.
2. Add "7:52" in large, thin, plain sans-serif type, centred near the top. Put "Tuesday" small below it.
3. Add three white rounded rectangles at about 90% opacity, stacked with small gaps.
   - Each card has "Reminder" in small grey type at the top left and its time at the top right.
   - The reminder line sits below in regular black type.
   - The order from top to bottom is 7:45, 7:30, 7:15.
4. Type every word as real text, not generated, so no digit gets swapped. Use no icons, logos, battery or signal symbols, or brand fonts.
5. Crop slightly off-centre, trimming a little from the top and bottom, then export as PNG.

Fallback image prompt (GPT Image). Check every word and digit afterwards:
> Square 1:1 cropped screenshot of a generic smartphone lock screen, no real phone or app styling. Plain muted slate-grey wallpaper, no photo. Large clock at top reads "7:52", small line beneath reads "Tuesday". Below, three stacked white rounded notification cards, newest on top, each with a small label "Reminder" and a time on the right. Top card: "Did anyone take the vitamins?" with time "7:45". Middle card: "Vitamins. Still on the counter." with time "7:30". Bottom card: "Kids vitamins. Before shoes." with time "7:15". Simple sans-serif text. No icons, logos, products, people, buttons or brand colours. Slightly off-centre crop with top and bottom edges cut, like a shared screenshot.

**9. Checks missed**
- House rules: I can't confirm the wallpaper avoids the brand colours (MISSING: brand brain, `voice-and-look.md`).

**Gaps to fill later**
- MISSING: brand colours and look, so the wallpaper can be confirmed as off-brand.
- MISSING: the brand brain's allowed on-image words. The story's lines were used as approved.

**To finish it:**
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. You can also paste this whole skill there so it writes the prompt and makes the picture in one go. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits, and Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** save an OpenAI or Google key as `OPENAI_API_KEY` or `GEMINI_API_KEY`, and I can send the prompt to that image API and save the file. Get keys at platform.openai.com/api-keys or aistudio.google.com/apikey. Each picture is billed by the provider.

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? It takes the image prompt above. Or type your own next step.
```
