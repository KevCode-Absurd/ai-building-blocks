# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The gate call is right: a swollen stomach fails the body gate, and the hand-off to a lunchbox moment is usable and safe. But the output drifts from the required stop shape, and the line idea is miscounted, so it falls short of a clean pass.

## Fix

In "What you hand back" for the stop case, require the exact labels (WHY IT STOPS, HAND-OFF, GATE SCORE) and an exact character count for any line idea, with the GATE block in the Where/Words/Feels fine format.  Also state that the stomach fail makes the Where answer "stop".

## Judge list

- Met: The gate answers are shown, and a stop comes with a hand-off you can use.
  Three gate answers shown; hand-off to problem-moment-image-ad-maker with lunchbox moment and line idea "The lunchbox came home full".
- Met: The person is made up, shows no face, and nothing says they're a customer.
  Stopped at gate; hand-off scene is "no person needed", so no real or customer person shown.
- Met: It's never the "before" of a before-and-after.
  No before-and-after proposed; only a lunchbox scene and a doodle.
- Met: No disease is named, and your copy doesn't say the product treats or cures it.
  No disease named; line ideas "The lunchbox came home full" and "Every day, right at 3pm" make no treatment claims.
- Met: The skin looks real, with no retouching and no product on it.
  No image prompt produced because the gate stopped; no skin or product depicted.

## What went in

```text
Story ad (approved, built on reviews 8 and 10):
By 3pm, every day, my stomach was swollen and tight under my work
trousers.
So I started skipping lunch. Most days the lunchbox came home
full.
I'd tried fiber powders and probiotics. Sprout is a daily pack of
gummies with 6 g prebiotic fiber, and it supports digestion and
gut health. One reviewer wrote: "Feel lighter, less bloated and
overall good." Start with Low Sugar if your stomach is sensitive.

Buyer: the gut-fix seeker, 25 to 55, mostly women.
Brand limits: "supports", never "fix".
```

## What came out

```text
No image tool is connected here, so I can only write the brief, not draw the picture.

**Gate**
- **Where is it?** Fail. The sign is a swollen, tight stomach, and the stomach is on the stop list.
- **Can the words stay off the reader?** Pass. The line can describe the moment ("By 3pm, the waistband pinches") without saying the reader is bloated.
- **Would someone without it feel fine?** Fail. A close-up of a swollen belly under trousers invites body comparison and shame. Platforms reject that as a negative body image.

**Why it stops:** The sign lives on the stomach. Even framed kindly, the photo would show a midsection and imply what the viewer's own body looks like. A visible-symptom photo needs all three answers to pass.

**Hand-off: `problem-moment-image-ad-maker`**
- **Moment to give it:** The workaround, not the body. A packed lunchbox comes home unopened on the kitchen counter in the evening. The lid is clipped shut, with work keys and a lanyard tossed beside it. Everyday light and normal mess, no person needed.
- **Line idea:** "The lunchbox came home full" (27 characters)
- **Backup for `hand-drawn-story-image-ad-maker`:** A simple doodle of an office clock at 3:00 next to a trouser button straining on its thread. Line idea: "Every day, right at 3pm"

**Gate score: 33/100.** One of three answers passed, and the photo needs all three.
```
