# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The sheet is tightly grounded: every quote traces to a numbered review, the lead problem matches the brand's own open lane, and claim limits correctly keep the gut story and GLP-1 lines out. The owner gets a buildable four-row test with the real gaps (article page, consent, rival count) flagged rather than papered over.

## Judge list

- Met: The fit names real things buyers tried, with review numbers.
  "Greens powders, used for years and quit: 1, 3, 4"; "separate supplements: 5"; "shaker-bottle routine: 6"
- Met: The counts in the problems table match the review numbers listed.
  "1, 2, 3, 4, 5, 6 | 6", "7, 8, 9, 10, 11 | 5", "12, 18, 19 | 3"; all six rows add up, 21 reviews each used once.
- Met: Push, habit, doubt and pull are exact quotes with numbers, or say MISSING.
  Push 4 and 3, Doubt 17/21/18, Pull 1/2/5/6 all match reviews.md; "MISSING: a customer line voicing 'a gummy can't hold enough...'"
- Met: The narrator is a real cleared person or the brand. Nobody is invented.
  "The brand, summing up what customers tell it. Nobody is cleared to speak"; quotes are unnamed, "one customer wrote".
- Met: The four test rows differ on all three columns.
  Forces Push/Habit/Pull/Doubt; traces tub/bottles/torn pack/phone email; openers scene/count/quote/date.
- Met: The sheet ends with every MISSING line in one list.
  MISSING list carries both body lines ("an article-style page", "a customer line voicing...") plus six more, then "SCORE 100/100 (6 of 6 checks)".

## What went in

```text
Product: Sprout, daily greens gummies. A pouch of 28 daily packs;
you tear a pack open and eat the gummies. $29.99 first box with the
text sign-up, then $49.99 every 4 weeks.
Buyers: the quitter who wants to stick (about 40%), the gut-fix
seeker (about 25%), the busy parent (about 25%), the price doubter.
Claims: the brand file's "fine to repeat" list. Never the risky list.

Customer words: all 20 reviews from reviews.md, numbered, with
sources, plus "They are expensive" (retailer).

People cleared to speak: nobody. No founder story on file, and no
customer has agreed to ad use.
Market notes: none. Page: none yet.

[attached: sprout/brand.md, sprout/reviews.md]
```

## What came out

```text
## FIT

**Suits.** Buyers describe a routine they kept trying and dropping, and what they dropped it for:

- **Greens powders, used for years and quit:**
  - 1: "I've tried a few green powders over the years."
  - 3: "I was taking [a big-name greens powder] but even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky."
  - 4: "I've been choking on [a big-name greens powder] for the last few years"
- **A shelf of separate supplements, dropped:**
  - 5: "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies."
- **The shaker-bottle routine, left behind:**
  - 6: "not having to clean a shaker bottle or extra dishes for greens stuff in powder form"

This is a used-up product with a clear history of slipping routines and half-finished tubs.

## PROBLEMS

Customer words are numbered 1 to 20 as in reviews.md. "They are expensive" (retailer) is added as **21**. Each review is counted once.

| Problem | Reviews | Count | Strength |
|---|---|---|---|
| Couldn't stick with powders, pills and supplement stacks | 1, 2, 3, 4, 5, 6 | 6 | Strong (years of trying, "choking", "$94 a month", relief at finally sticking) |
| Gut and regularity | 7, 8, 9, 10, 11 | 5 | Strong ("15 years", "chronic IBS", relief) |
| Taste | 12, 18, 19 | 3 | Medium (praise and complaints) |
| Energy and feeling better | 13, 14 | 2 | Medium |
| Feeding the family, no time | 15, 16, 17 | 3 | Medium |
| Price and subscription | 20, 21 | 2 | Medium |

**Lead: couldn't stick with a supplement routine (reviews 1 to 6).**
- It is the most common problem and is said strongly.
- It fits the brand's "fine to repeat" claims cleanly.
- The brand file calls it the open lane: only 2 of the brand's 40 newest ads use the habit idea.

**Backup: gut and regularity (reviews 7 to 11).**
- It is just as strongly felt, but its best lines read as a cure.
  - 7: "normal for the 1st time in 15 years!"
  - 9: "the solution to my problems"
- The brand may only say "supports digestion and gut health". This story is harder to tell inside that limit, so it goes second.

## WHY THEY SWITCH

**Push** (the moment the old way stopped being bearable):
- 4: "I've been choking on [a big-name greens powder] for the last few years"
- 3: "it was still $94 a month and the drink was definitely gritty/chalky."

**Habit** (what they kept doing, and why it made sense):
- 1: "The issue has never been nutritive content. It's always been an issue of consistency like many things." The nutrition was right, so they kept buying.
- 5: "separate probiotic gummies, b12 gummies, and multivitamin gummies". They kept stacking one product per need.

**Doubt** (what made them wary of something new):
- 17: "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived."
- 21: "They are expensive"
- 18: "I thought the first pack I tried tasted terrible, but after the third day they started tasting better"
- MISSING: a customer line voicing "a gummy can't hold enough to replace my powder". This doubt exists only in the brand's buyer profile, not in any review.

**Pull** (what is different now, matched to a claim the brand may make):

| Customer line | Brand claim it matches |
|---|---|
| 1: "[Sprout] has been the one thing I've been able to stick to." | "95% of users take [Sprout] at least 4-6x per week with 80% taking daily", with "of surveyed users" |
| 2: "It's wild I WANT to take [Sprout] and don't forget." | Same survey claim |
| 5: "I just take these now and it's easier for me to manage." | "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack |
| 6: "The convenience and taste are huge! ... Plus not having to clean a shaker bottle or extra dishes" | Format facts: no water, no mixing, no shaker |

**Traces you could photograph:**
- A half-used tub of green powder with a dried, clumped scoop inside. No brand marks.
- A shaker bottle with a green ring, left in the sink.
- A counter line of separate bottles: probiotic gummies, B12 gummies, multivitamin gummies (review 5). Generic, no marks.
- Green powder dust on a kitchen counter.
- A phone showing a generic "your subscription renews" email.
- A Sprout daily pack torn straight across the top, gummies pouring into a palm, in an ordinary out-the-door spot.

## CLAIM LIMITS

**May say:**
- "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack. Use 21, never "20+".
- The survey lines, always with "of surveyed users", noted as a brand-reported survey of 3,000+ customers:
  - "95% of users take [Sprout] at least 4-6x per week with 80% taking daily"
  - "52% feel more energized" (only if energy comes up)
- Format facts: tear a pack, eat the gummies, no water, mixing or shaker.
- Vegan, pectin base, free from gluten, dairy, nuts, synthetic dyes and sweeteners. Methylfolate, not folic acid.
- Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants.
- "Clinically tested for nutrient absorption", only with the study named and its 2 numbers (vitamin C +40.1%, folate +20.5%).
- Public review lines, word for word, as "one customer wrote".

**May not say:**
- That one pack equals or replaces a greens powder serving. There is no evidence on file.
- The rival's name, or "$94 a month" as the brand's own price claim. It may appear only inside review 3, and only after a person checks it.
- The dated "$1.26 vs $3.60" comparison.
- "works", "clinically backed for energy, immunity", "revive whole body vitality", the 30/60/90-day results, or "backed by 35,000+ studies".
- "4.8 stars from 100,000 reviews" without naming the source and its true count.
- Anything about cancelling beyond the site's own words, or any promise of an easy cancel.
- Any GLP-1 line. Reviews 11 and 14 are not used.
- A bare "$29.99" without the SMS-discount condition and the $49.99 renewal.

## AIM

**Moment-first, assumed.** No market notes were given, so the rival count is unknown.

- The moment is the half-used tub, or the shaker nobody wants to wash. Anyone who quit a routine has lived it, so it reaches the largest buyer group (about 40%) and part of the parent group.
- Risk: the big-name powder brand now sells gummies too, and could tell the same story. Check the ad library before committing.

## NARRATOR

**The brand**, summing up what customers tell it. Nobody is cleared to speak:
- No customer has agreed to ad use.
- There is no founder story on file.
- There is no expert.

No named or first-person "customer" voice appears anywhere.

**Reviews that may be quoted word for word, unnamed, as "one customer wrote":**
- 1: "I've tried a few green powders over the years. The issue has never been nutritive content. It's always been an issue of consistency like many things. [Sprout] has been the one thing I've been able to stick to." (brand site)
- 2: "It's wild I WANT to take [Sprout] and don't forget." (brand site)
- 3: "I was taking [a big-name greens powder] but even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky." (brand site; competitor name must not run)
- 4: "I've been choking on [a big-name greens powder] for the last few years" (brand site; competitor name must not run)
- 5: "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies. I just take these now and it's easier for me to manage." (brand site)
- 6: "10/10 would recommend. The convenience and taste are huge! Like mixed berries! Plus not having to clean a shaker bottle or extra dishes for greens stuff in powder form, is absolutely excellent!" (brand site)
- 17: "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived. We quickly decided to resubscribe because we love [Sprout] so much! A bonus is my kids love them too!" (brand site)

## CLICK GOES TO

MISSING: an article-style page. It must be built before the ad runs. Use a "Learn more" button to it, never a link straight to the product page.

**Its first screen must show:**
- The same moment as the ad: the half-used tub, or the shaker in the sink.
- A brand-voice headline about finally sticking with it.
- No price and no product grid.

**Further down:**
- The format: tear a pack, eat the gummies.
- The allowed claims.
- One offer, with its real terms: $29.99 first order with the SMS discount, then $49.99 every 4 weeks.
- Only then a link to the product page.

## TEST PLAN

All four rows test the lead problem. No budget was given, so there is no fifth row.

| Row | Opening force | Trace in the picture | Opener |
|---|---|---|---|
| 1 | Push (review 4) | Half-used tub with a dried, clumped scoop | The scene in the picture |
| 2 | Habit (review 5) | Counter line of separate probiotic, B12 and multivitamin bottles | A count: the three bottles named in review 5 |
| 3 | Pull (reviews 1, 2) | Daily pack torn straight across the top, gummies pouring into a palm by the front door | A real quote: review 2, "It's wild I WANT to take [Sprout] and don't forget." |
| 4 | Doubt (review 17) | Phone showing a generic "your subscription renews" email | A date: day 28, when the 28-pack pouch runs out and the next one ships every 4 weeks |

## READING RESULTS

- Compare each story only with your other ads for new customers, never with ads shown to past visitors.
- Give every row the same budget and the same number of days before you judge.
- Judge first on how many people reach the article page and read to the offer, then on sales.
- The bar is your own last month of new-customer ads. None is on file, so run this first set to set one and judge the rows against each other.
- Retire a row that sends fewer readers than your usual new-customer ads and sells nothing. If every row fails, move to the backup problem (gut and regularity).
- Build on a winner: keep its opening force and trace, and change the opener.

## A PERSON CHECKS

- **Claims:** a claims or legal review of every line against the "fine to repeat" list.
  - "of surveyed users" appears on every survey number.
  - The count is "21", never "20+".
  - Nothing suggests a gummy replaces a powder.
- **Review quotes:**
  - Permission to quote public reviews in ads when no customer has agreed in writing.
  - How to quote reviews 3 and 4 without naming the competitor, and whether "$94 a month" may run at all.
  - That the brand-site reviews were hand-picked by the brand, and must not be presented as typical.
- **Offer:**
  - The $29.99 SMS-discount condition and the $49.99 renewal are shown wherever a price appears.
  - One discount figure is used, not the live mix of 49% to 61%.
  - Row 4's subscription wording uses only the site's own words, with no easy-cancel promise. Cancelling is the loudest public complaint.
- **Pictures:**
  - The daily pack is torn straight across the top only.
  - The big pouch is never torn.
  - No competitor, partner or cartoon tie-in marks on tubs, bottles or packs.
- **Product and page:**
  - Whether the FDA line is needed on the ad and the article page.
  - Reviews 11 and 14 (GLP-1) are kept out entirely.

## MISSING

- MISSING: an article-style page
- MISSING: a rival count for the habit story (Meta Ad Library, active US ads, main phrase in quotes)
- MISSING: a customer line voicing "a gummy can't hold enough to replace my powder"
- MISSING: evidence that one pack compares to a greens powder serving
- MISSING: written consent from any customer for ad use
- MISSING: star ratings for most reviews
- MISSING: last month of new-customer ad results to use as the bar
- MISSING: test budget (decides whether a fifth row runs)

## SCORE

SCORE 100/100 (6 of 6 checks)
```
