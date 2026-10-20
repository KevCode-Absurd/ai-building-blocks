# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable five-image plan that sticks to the supplied facts, keeps every figure sourced and refuses to describe photos it never saw. It stops early rather than padding, and the gaps list tells the owner exactly which photos and facts would unlock the remaining slots.

## Judge list

- Met: The score table explains every image that made the cut and every one that didn't.
  18 types scored, each marked slot, gap or cut, e.g. "Side by side 2+1+0 = 3  -> gap", "Promise 1+0+1 = 2  -> cut".
- Met: Slot 1 is the product, slot 2 answers the biggest doubt, and at least one image shows size.
  "CARD 01-main ... pouch upright in the centre"; "CARD 02-made-of question: Can a gummy hold enough to replace my powder?"; "CARD 03-scale ... gummies in an open hand".
- Met: Every number on a card has its unit and a source; every rating has its count.
  "Vitamin C | 93 mg (source: product facts)"; study keeps "120 healthy adults aged 23 to 59; 12 weeks"; no rating placed on a card.
- Met: Reviews are copied exactly, with the reviewer's published name.
  No reviews used; Voices sent to gaps: "NEED: two or three reviews copied exactly with the reviewers' published names".
- Met: The gaps list is honest. A missing review is a NEED line, not a made-up quote.
  15 NEED lines, none filled by guessing; "NEED: first-order price, when renewal starts, and cancel terms -> 05".

## What went in

```text
Product: Sprout Original (Adults), Low Sugar, pouch of 28 daily
packs. One pack a day, about 20 g, "a small handful" of gummies.
Tear the pack across the top, tip the gummies into your palm.
Facts: "60+ ingredients, 21 vitamins & minerals, and 6g fiber" per
pack; vitamin C 93 mg, D3 20 mcg, B12 2.4 mcg, folate 400 mcg DFE.
Study: 2025, 12 weeks, randomized, double-blind, placebo-controlled,
120 healthy adults aged 23 to 59. Blood vitamin C +40.1%, folate
+20.5%. Third-party tested for 70 pesticides and 4 heavy metals.
Price: renews at $49.99 every 4 weeks ($1.78/day).
Guarantee: 30-day money-back, "This policy applies only to your
initial purchase."
Ratings: 4.8 from 100,000 (header); 4.75 from 109,639 (widget).
Photos: pouch front on; gummies in an open hand.
Doubts: "A gummy can't hold enough to replace my powder." (most
common) / "Will the price jump after the first order?" / "Is this
just candy?"
```

## What came out

```text
KIND: goes in or on the body (supplement gummies)

SCORES  (asked + picture wins + proof = total)
Main 2+2+1 = 5  -> slot 01
Made of 2+1+1 = 4  -> slot 02
Scale 1+2+1 = 4  -> slot 03
Tested 2+1+1 = 4  -> slot 04
Cost per use 2+1+1 = 4  -> slot 05
How often 1+1+1 = 3  -> slot 03
In use 1+2+0 = 3  -> gap
Steps 1+2+0 = 3  -> gap
What arrives 1+2+0 = 3  -> gap
Up close 1+2+0 = 3  -> gap
Side by side 2+1+0 = 3  -> gap
Other sides 1+1+0 = 2  -> gap
Facts panel 1+1+0 = 2  -> gap
Voices 1+1+0 = 2  -> gap
Promise 1+0+1 = 2  -> cut
Range 0+1+0 = 1  -> cut
Fit guide 0+0+0 = 0  -> cut
Works with 0+0+0 = 0  -> cut

CARD 01-main
question: What is it?
message:  Sprout Original (Adults), Low Sugar: a pouch of 28 daily gummy packs.
photo:    pouch, front on
layout:   pouch upright in the centre, whole and filling most of the frame, on a plain background; no added words; the label carries the name
words:    none added (pouch label only, exactly as printed)
proof:    partial
watch:    Adding gummies, loose packs or an inset that isn't in the real photo. Confirm the label shows "Original (Adults)" and "Low Sugar" before upload.

CARD 02-made-of
question: Can a gummy hold enough to replace my powder?
message:  One daily pack holds 60+ ingredients, 21 vitamins & minerals and 6g fiber.
photo:    pouch, front on (smaller, to one side)
layout:   headline across the top; pouch on the left; the three points and the amounts table stacked on the right
words:    "Enough to replace your powder?" (source: most common customer doubt, shortened to fit the headline)
          "60+ ingredients per pack" (source: product facts)
          "21 vitamins & minerals" (source: product facts)
          "6g fiber per pack" (source: product facts)
          table: "Vitamin C | 93 mg" (source: product facts)
          table: "Vitamin D3 | 20 mcg" (source: product facts)
          table: "Vitamin B12 | 2.4 mcg" (source: product facts)
          table: "Folate | 400 mcg DFE" (source: product facts)
proof:    partial
watch:    Answering the headline with "Yes" or "replaces your powder". No such claim was supplied. Let the amounts answer, and keep "DFE" and "per pack".

CARD 03-scale
question: How much is one daily serving, and how often do I take it?
message:  One pack a day: about 20 g, a small handful in your palm.
photo:    gummies in an open hand
layout:   open hand with the gummies in the centre, filling most of the frame; headline above; two short points below
words:    "One pack, a small handful" (source: product facts, "a small handful")
          "One pack a day" (source: product facts)
          "About 20 g per pack" (source: product facts)
proof:    partial
watch:    Stating a gummy count or gummy size that wasn't supplied. Cropping or enlarging the gummies beyond what the real photo shows.

CARD 04-tested
question: Is this just candy, or does it actually do something?
message:  A 12-week placebo-controlled study measured higher blood vitamin C and folate.
photo:    none (type-led on a plain background; brand colour MISSING)
layout:   headline at the top; three points in a column in the centre; study conditions as a footnote along the bottom
words:    "Tested in a 12-week study" (source: study details, input)
          "Blood vitamin C +40.1%" (source: 2025 study, input)
          "Blood folate +20.5%" (source: 2025 study, input)
          "70 pesticides, 4 heavy metals tested" (source: product facts, third-party testing)
          footnote: "2025 randomized, double-blind, placebo-controlled study; 120 healthy adults aged 23 to 59; 12 weeks. NEED: vs placebo or vs baseline; study citation" (source: input)
proof:    NEED
watch:    Dropping the footnote, or writing "+40.1% vs placebo" before that is confirmed. Naming a lab or a certificate that wasn't supplied.

CARD 05-cost-per-use
question: What does it cost, and will the price jump after the first order?
message:  It works out at $1.78 a day, renewing at $49.99 every 4 weeks.
photo:    pouch, front on
layout:   price headline large on the left; pouch on the right; two points under the headline
words:    "$1.78 a day" (source: pricing, input)
          "Renews at $49.99 every 4 weeks" (source: pricing, input)
          "28 daily packs per pouch" (source: product facts)
proof:    partial
watch:    Implying the first order costs the same, or promising "no price jump". The first-order price wasn't supplied.

GAPS
NEED: the two photos attached as files. I could only read descriptions, so the photo check is still to do -> 01, 02, 03, 05
NEED: whether +40.1% and +20.5% are measured against placebo or against baseline -> 04
NEED: study citation (who ran it, where it was published) -> 04
NEED: testing lab, method and pass limits for the 70 pesticides and 4 heavy metals -> 04
NEED: first-order price, when renewal starts, and cancel terms -> 05
NEED: sugar per pack in grams, to answer "Is this just candy?" -> 02 (optional row), 04
NEED: gummy count per pack -> 03 (optional point)
NEED: photo of a single daily pack being torn across the top and tipped into a palm -> In use, Steps
NEED: photo of the pouch with the 28 packs laid out and counted -> What arrives
NEED: sharp close-up photo of the gummies -> Up close
NEED: photo of the back or label panel -> Other sides, Facts panel
NEED: two or three reviews copied exactly with the reviewers' published names, plus one confirmed rating with its count and scale (header says 4.8 from 100,000; widget says 4.75 from 109,639) -> Voices
NEED: sourced figures for a typical unbranded greens powder -> Side by side
NEED: full guarantee terms beyond "30-day money-back" and "This policy applies only to your initial purchase." -> Promise (cut for now; put the full terms in page copy)
NEED: brand colours, fonts and photo style (no brand brain supplied) -> all cards

CHECKS MISSED: Every figure has its unit and a source; a study keeps its conditions. 04-tested: +40.1% and +20.5% still lack "against what" (placebo or baseline) and a study citation.
Every close-up or inset comes from a real photo: not verified, because the photos were described but not seen (photo check still to do).
```
