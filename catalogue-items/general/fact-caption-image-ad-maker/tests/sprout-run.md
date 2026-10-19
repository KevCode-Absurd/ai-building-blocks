# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 1.

A solid, accurate brief: the number and wording are exact, the strip looks like a phone caption, and it flags the 'against placebo' ambiguity and the missing study runner. The owner can use it after a person checks the fact against the report.

## Judge list

- Met: The number and the wording match the source exactly.
  Caption: "Blood vitamin C up 40.1% (2.7x placebo)" matches the fact line exactly; source line matches the science page.
- Met: There's one fact, with a source line you can read.
  One fact (vitamin C); source line "2025 study, 120 adults, 12 weeks, double-blind, placebo-controlled".
- Met: It looks like a captioned photo, not a news report or a TV graphic.
  Plain black 60% band, white sans-serif, kitchen counter phone photo; no outlet, ticker or logo.
- Met: Nothing claims more than the source measured.
  Caption only states vitamin C up; flags the story's 'against placebo' ambiguity and that it measured absorption.
- Met: It's flagged for a person to check before it runs.
  "a person checks it against its source before it runs."

## Invented

- number: 60% (Strip opacity design choice, not a fact claim.)

## What went in

```text
Story ad (approved; narrator: a customer who agreed, example
only):
I figured gummy vitamins were candy with a label on.
Then I read Sprout's study. 12 weeks, 120 adults, randomized and
placebo-controlled. Blood vitamin C went up 40.1%, and folate up
20.5%, against placebo.
It measured absorption, nothing else. That was the part I'd
doubted.
One daily pack: 21 vitamins and minerals and 6 g prebiotic fiber,
in a small handful of gummies.

Fact: "Blood vitamin C up 40.1% (2.7x placebo)."
Source: Sprout science page. 2025 study, 12 weeks, randomized,
double-blind, placebo-controlled, 120 healthy adults aged 23 to
59.
```

## What came out

```text
I can't draw the picture in this chat because no image tool is connected, so this is the written brief and prompt.

**1. The fact and its source**
"Blood vitamin C up 40.1% (2.7x placebo)." Source: Sprout science page, 2025 study, 12 weeks, randomized, double-blind, placebo-controlled, 120 healthy adults aged 23 to 59.
MISSING: who ran and measured the study (Sprout, a contract lab or a university), and the full study report. The science page is the brand's summary, so get the report on file before this runs.

**2. Source check**
- **Number: pass.** The caption uses 40.1% and 2.7x exactly. Folate (20.5%) is left out so there is one fact per strip.
- **Verbs: pass.** The caption keeps the source's "up."
- **What was measured: pass on the image, but check the story.** The source says vitamin C rose 40.1%, which is 2.7x the placebo rise. The story's line "went up 40.1%… against placebo" can read as a 40.1% gap over placebo. Confirm which one the report shows and align the story to it.
- **Year: pass.** 2025 is within five years.

**3. Scene**
"Someone's messy kitchen counter in the morning, with coffee and a cut orange, and a caption about vitamin C."

**4. Where and when**
- **Place:** a home kitchen counter.
- **Time:** a weekday, around 7:30 am.
- **Light:** soft window daylight from the left, slightly uneven.
- **Camera spot:** phone held at standing height, angled down about 45°.
- **Strip space:** the bottom fifth is plain counter surface, kept clear for the strip.

**5. Words on the image**
Caption: Blood vitamin C up 40.1% (2.7x placebo)
Source line: 2025 study, 120 adults, 12 weeks, double-blind, placebo-controlled

**6. The strip**
- **Position:** a full-width band across the bottom fifth.
- **Colour:** black at 60% opacity.
- **Text:** white, in one plain sans-serif (Helvetica or Inter). The caption is at regular weight and the source line about half its size directly below. Both are left-aligned with modest padding.
- **Style:** nothing else, like a phone editor's caption.

**7. Blank version**
The same counter photo with no band and no text.

**8. Line under the image**
I thought gummies were candy

**9. Flags**
- A fact is on the image, so a person checks it against its source before it runs.
- The study is Sprout's own. The landing page must say so near the top, open on the same 40.1% figure, and show the full source.
- The "against placebo" wording in the story needs to be resolved (see 2).
- The story narrator is a customer who agreed and is used as an example only. No person is shown on the image.

**10. Image prompt**
Square 1:1 casual phone photo, taken from standing height angled down at a home kitchen counter on a weekday morning. Soft, slightly uneven window daylight from the left. On a worn wooden counter: a half-drunk mug of coffee, an orange cut in half on a scratched cutting board, a few crumbs, a folded dish towel, keys near the edge. Lived-in, a little cluttered, natural colours, light phone-camera grain, no retouching. No people, no packaging, no labels, no logos, no text. Keep the bottom fifth of the frame as calm, plain counter surface.
Strip (only if the tool must add it): plain black band at 60% opacity across the bottom fifth, white sans-serif text "Blood vitamin C up 40.1% (2.7x placebo)", below it smaller "2025 study, 120 adults, 12 weeks, double-blind, placebo-controlled".

**11. Score: 83/100**
5 of 6 checks passed, so 5/6 × 100 = 83.
- **Missed, Follow:** the landing page repeating the fact with the full source isn't confirmed or on file.

**To make it**
Best: generate the blank photo, then add the strip in a phone editor or design tool so every character is exact. If an image tool adds the strip, check "40.1%" and "2.7x" digit by digit.
- **ChatGPT or Gemini:** paste the image prompt into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, the prompt can be sent to that image API and the file saved. Get keys at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.
```
