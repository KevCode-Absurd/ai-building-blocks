# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable brief: the one approved study fact is carried with its exact numbers, a readable source line, a plain phone-caption look and a sensible flag that the underlying study report and who ran it are not on file. The only nit is the line under the image omits the required '(which line, characters)' note, though the line itself is the buyer's own words and 22 characters.

## Judge list

- Met: The number and the wording match the source exactly.
  "Blood vitamin C up 40.1% in 12 weeks, 2.7x placebo": 40.1%, 2.7x and 12 weeks all match the source; verb "up" kept.
- Met: There's one fact, with a source line you can read.
  "Folate 20.5% is left off the strip"; source line "2025 study · 120 adults · double-blind, placebo-controlled" sits "smaller, but still readable on a phone".
- Met: It looks like a captioned photo, not a news report or a TV graphic.
  "Black at about 60% opacity... One plain sans serif... No outlet name, logo, colours, ticker, clock or 'breaking' label."
- Met: Nothing claims more than the source measured.
  "The study measured blood vitamin C levels (absorption) and nothing about health outcomes. The caption claims nothing beyond that."
- Met: It's flagged for a person to check before it runs.
  "A fact on the image: a person checks it against its source before it runs."

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
1. **The fact and its source**
   - **As the source states it:** "Blood vitamin C up 40.1% (2.7x placebo)."
   - **Who:** Sprout science page. MISSING: who ran and measured the study (Sprout in-house, a contract research lab or a university), and the study report itself.
   - **How:** Randomized, double-blind, placebo-controlled, 12 weeks, 120 healthy adults aged 23 to 59.
   - **Year:** 2025.

2. **Source check**
   - **The number: pass.** 40.1% stays 40.1%. 2.7x stays 2.7x. This is the one fact used. Folate 20.5% is left off the strip.
   - **The verbs: pass.** The source says "up", and the caption says "up". It does not say "boosts" or "proves".
   - **What was measured: pass, with a flag.**
     - The study measured blood vitamin C levels (absorption) and nothing about health outcomes. The caption claims nothing beyond that.
     - The source means vitamin C rose 40.1%, which is 2.7 times the placebo group's rise. It does not mean a 40.1-point difference over placebo. The caption keeps "2.7x placebo" so it can't be read the second way.
   - **The year: pass.** 2025 is under five years old.

3. **Scene**
   A messy kitchen counter on a weekday morning, with a half-finished coffee and someone's hand resting beside it.

4. **Where and when**
   - **Place:** A home kitchen counter with a coffee mug, a phone face-down, a few crumbs, a folded tea towel and keys.
   - **Time:** About 7:30 a.m. on a weekday.
   - **Light:** Plain window light from the left, slightly cool, with soft shadows.
   - **Camera spot:** Handheld phone at standing chest height, angled down about 45°. The lower third of the frame is plain countertop, left calm for the strip.

5. **Words on the image**
   - **Caption:** Blood vitamin C up 40.1% in 12 weeks, 2.7x placebo
   - **Source line:** 2025 study · 120 adults · double-blind, placebo-controlled

6. **The strip**
   - **Where:** A full-width band across the lower fifth of the frame, over the plain countertop.
   - **Colour and opacity:** Black at about 60% opacity, with white text.
   - **Typeface:** One plain sans serif, the kind a phone editor uses by default.
   - **Text layout:** The caption sits in regular weight at a readable size. The source line sits below it, smaller, but still readable on a phone.
   - **What to leave out:** No outlet name, logo, colours, ticker, clock or "breaking" label.

7. **Blank version**
   The same kitchen-counter photo with no strip. The lower fifth stays plain countertop, so the strip can be added later in a phone editor or design tool.

8. **Line under the image**
   Candy with a label on?

9. **Flags**
   - **A fact on the image:** a person checks it against its source before it runs.
   - **Source behind the claim not on file:** The only source on file is Sprout's own science page. Get the study report, and say who ran it, before this runs. The landing page must open on the same fact and show that full source near the top.
   - **Wording in the story ad:** The story says "went up 40.1%… against placebo". That could be read as 40.1% more than placebo, which is not what the source says. Confirm the story wording with whoever approved it.
   - **No product in the picture:** None was requested, so there are no gummies or packs in frame.
   - **No customer in the picture:** The narrator is a customer example only. No person in the image is presented as a customer. The hand belongs to a made-up adult.
   - **Health claims:** None. The fact covers absorption only.

10. **Image prompt**
   Candid phone photo of a home kitchen counter on a weekday morning. A half-drunk mug of coffee and a phone lying face-down sit on the counter, with a few crumbs, a folded tea towel and a set of keys. An adult's hand rests near the mug, cropped at the wrist, no face. Plain window light from the left, slightly cool, soft shadows. Handheld, angled down about 45° from standing height, slight imperfect framing, natural phone-camera sharpness, no retouching. The lower fifth of the frame is plain empty countertop. Square 1:1. No logos, no text on objects, no brand colours, no packaging, no vitamins or gummies visible.
   Strip (only if the tool must add it): a black band at 60% opacity across the lower fifth, plain white sans serif, reading "Blood vitamin C up 40.1% in 12 weeks, 2.7x placebo" with a smaller line below reading "2025 study · 120 adults · double-blind, placebo-controlled". Check every digit afterwards.
```
