# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A tight, honest five-card argument that uses only the given facts, labels the survey numbers correctly, states the real renewal price and the first-order-only guarantee, and flags missing photos and shipping terms. The owner could brief a designer from this as is; the only nits are a word count (card 3 is 9, not 10) and a character count (64, not 66) that are slightly off but still within limits.

## Judge list

- Met: Card 1 makes sense with no other card.
  "Choking on greens powder? Here's why you keep quitting." picks the powder quitter and stands alone as a hook.
- Met: Every card 12 or fewer words, the last 20 or fewer.
  Counts: 9, 12, 9 (output says 10), 11, 20. All within limits; card 5 is exactly 20.
- Met: Only the last card asks for an action.
  Only card 5 has "Start yours." Cards 2 and 3 describe, they do not ask to buy.
- Met: Swapping cards 2 and 3 breaks the argument.
  Card 1 gap "why do I keep quitting?" is only answered by card 2 "It's the chore"; card 3 before it reads wrong.
- Met: Every number, quote and price is in the brand facts.
  60+, 21, 6g, 28 packs, $49.99/4 weeks, 30-day first order, 95%/80%/3,000+ all appear in the run input.

## What went in

```text
Idea: the powder quitter. Greens powder is a chore, so people
quit. Sprout is greens you eat, so they stick with it.
Cards: 5. Buyer: knows the problem, has tried powders.

Brand facts:
- 28 daily packs per pouch. Tear one across the top, pour the
  small handful of gummy bears into your palm. No water, no
  mixing, no shaker.
- 60+ ingredients, 21 vitamins & minerals, 6g fiber per pack
- Survey: 95% of surveyed users take it at least 4-6x per week,
  80% daily (brand survey, 3,000+ customers)
- Subscription $49.99 every 4 weeks, "Pause Or Cancel Any Time".
  30-day money-back guarantee, first order only.
- Doubt: "A gummy can't hold enough to replace my powder."
- Customer words: "I've been choking on [a big-name greens
  powder] for the last few years" / "It's wild I WANT to take
  [Sprout] and don't forget."
```

## What came out

```text
**Card 1 | Opening and problem | "Choking on greens powder? Here's why you keep quitting." (9 words) | 1:1. A tall glass of murky green powder drink, clumps on the rim, a shaker and scoop beside it, kitchen counter, morning light. No product, no brand. Same type, colours and framing on all five cards. | Why powders fail | Gap: why do I keep quitting?**

**Card 2 | Promise | "It's the chore. Imagine greens you WANT to take, and don't forget." (12 words) | 1:1. Same counter and framing. The shaker, scoop and water glass are pushed to the edge of the frame, and the centre is left empty. | Greens, minus chore | Gap: so what replaces the shaker?**

**Card 3 | How it works | "No water. No mixing. No shaker. Tear, pour, eat." (10 words) | 1:1. Same counter. A hand tears one daily pack across the top and pours a small handful of gummy bears into the palm. The product is seen but not named, and must match the real pack photo. | Tear. Pour. Done. | Gap: but can a handful of gummies hold enough?**

**Card 4 | Doubt | "Enough? One pack: 60+ ingredients, 21 vitamins & minerals, 6g fiber." (11 words) | 1:1. Same palm of gummy bears from card 3, with the three numbers set beside it in the same type. | What's in one pack | Gap: so how do I start without the risk?**

**Card 5 | Offer and action | "Sprout: 28 daily packs, $49.99 every 4 weeks. Pause Or Cancel Any Time. 30-day money-back guarantee, first order. Start yours." (20 words) | 1:1. Same counter. A full pouch with one pack torn open beside it, as the pack photos show. First time the product is named. | $49.99 every 4 weeks | Gap: none. This card closes the set.**

**Text above the ad**

Quit greens powder because the shaker, water and mixing got old? Sprout is greens you eat: tear a pack, pour, done. 80% of surveyed users take it daily, and 95% take it at least 4-6x per week (brand survey, 3,000+ customers). Your first order comes with a 30-day money-back guarantee.

*(First sentence: 66 characters.)*

**Sources**
- "choking on": customer quote, "I've been choking on [a big-name greens powder] for the last few years". On card 1 it is adapted and is not a quote card.
- "WANT to take, and don't forget": customer quote, "It's wild I WANT to take [Sprout] and don't forget". On card 2 it is adapted and is not a quote card.
- Tear, pour, gummy bears into palm, no water/mixing/shaker: brand facts, product use.
- 60+ ingredients, 21 vitamins & minerals, 6g fiber per pack: brand facts.
- The doubt answered on card 4 ("A gummy can't hold enough"): brand facts, doubt.
- 28 daily packs per pouch: brand facts.
- $49.99 every 4 weeks, "Pause Or Cancel Any Time": brand facts, subscription. The capitalisation is the brand's own.
- 30-day money-back guarantee, first order only: brand facts.
- 80% daily, 95% at least 4-6x per week, 3,000+ customers: brand survey, brand facts.
- "Sprout is greens you eat": the idea brief.

MISSING: product photos by role (pack front, pack torn open with gummies in palm, close-up), one per product shown, to check cards 3 to 5 against.
MISSING: shipping terms and returns terms in the store's own wording, for the offer card.
MISSING: which flavour or variant to show. The carousel uses one variant on every card.
```
