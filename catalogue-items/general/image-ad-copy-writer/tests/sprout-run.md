# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Two usable ad versions with every number and offer condition kept exact, a real sourced review used correctly, and the Low Sugar qualifier placed in the description. The main texts are nearly identical after the first line, so the test is mostly a headline test, but all counts check out and nothing is made up.

## Judge list

- Met: The image headline and the picture make the same point, in 7 words or fewer
  "Fiber you chew. No shaker required. (6)" matches powder tub pushed back; V2 quote is 8 words, within the 12 allowed for a real quote.
- Met: The main text doesn't repeat the image words
  V1 image says "6 g prebiotic fiber"; main text says "swaps the tub for a daily pack of gummies you tear open and eat" instead.
- Met: Every number, offer term and condition matches your proof and terms
  "$29.99 with the text sign-up discount, then $49.99 every 4 weeks, with a 30-day money-back guarantee on your first order only"; 6 g, 3,000+, 67% all supplied.
- Met: No customer story, quote or guarantee appears that you didn't supply
  "The prebiotics do their job, but not aggressively" is review 8 in reviews.md, attributed "A Sprout customer with IBS, review on the brand site".
- Met: The versions differ in appeal, not just in wording
  VERSION 1: Self-interest (benefit headline) vs VERSION 2: Their words (real review quote headline with source).

## What went in

```text
Picture (chosen): a woman at a kitchen counter in the morning tears
a Sprout daily pack across the top and pours green gummies into her
palm. A tub of fiber powder sits pushed to the back.
Who it's for: people with gut troubles who've tried fiber powders
and probiotics. They know the problem, not Sprout.
Proof: 6 g prebiotic fiber per pack. Approved: "Supports
digestion and gut health." Survey of 3,000+ customers: "67% of
surveyed users experienced better, more regular digestion."
Reviews: all 20, in reviews.md (attached).
Qualifier: Sugar-Free uses sugar alcohols, which upset some
stomachs; point gut-sensitive buyers to Low Sugar.
Offer: first box $29.99 with the text sign-up discount, then $49.99
every 4 weeks. 30-day money-back guarantee, first order only.
Voice: playful, cheeky, never preachy.
Limits: main text 5 sentences, first under 125 characters;
description 30 characters.
Versions: 2

[attached: sprout/reviews.md]
```

## What came out

```text
```
VERSION 1: Self-interest
On image, headline:   Fiber you chew. No shaker required. (6)
On image, support:    6 g prebiotic fiber in every daily pack
Main text:            Scoop, stir, gulp, rinse the glass, repeat tomorrow: that's a lot of work before coffee. Sprout swaps the tub for a daily pack of gummies you tear open and eat, and it supports digestion and gut health. In a survey of 3,000+ Sprout customers, 67% of surveyed users experienced better, more regular digestion. Your first box is $29.99 with the text sign-up discount, then $49.99 every 4 weeks, with a 30-day money-back guarantee on your first order only. Tap below, sign up for texts and push that tub to the back. (5 sentences; first line 88 characters)
Headline under image: Gut support you tear, pour and chew (35)
Description:          Gut-sensitive? Pick Low Sugar. (30)
Button:               Shop Now

VERSION 2: Their words
On image, headline:   "The prebiotics do their job, but not aggressively" (8, real quote)
On image, support:    A Sprout customer with IBS, review on the brand site
Main text:            If your gut routine means scooping powder, stirring hard and gulping fast, mornings get long. Sprout puts 6 g of prebiotic fiber into a daily pack of gummies, and it supports digestion and gut health. In a survey of 3,000+ Sprout customers, 67% of surveyed users experienced better, more regular digestion. Your first box is $29.99 with the text sign-up discount, then $49.99 every 4 weeks, with a 30-day money-back guarantee on your first order only. Tap below, sign up for texts and let the tub retire to the back of the counter. (5 sentences; first line 93 characters)
Headline under image: Gut support you tear, pour and chew (35)
Description:          Gut-sensitive? Pick Low Sugar. (30)
Button:               Shop Now

NOTE
Code:        Old way, new way · kitchen-counter morning photo · gut-trouble buyers who've tried fiber powders and probiotics (no code supplied; worked out from the written description)
Buyer knows: warm (solution-aware: has tried fiber powders and probiotics, doesn't know Sprout)
MISSING:     picture (no image attached; worked from the written description) · ad type code (worked out, not supplied)

CHECKS MISSED
The headline and the picture make the same point: checked against the written description, not the image, because no picture was attached.
```
```
