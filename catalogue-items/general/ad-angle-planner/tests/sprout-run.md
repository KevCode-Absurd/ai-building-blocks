# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The brief is accurate, faithful to the stated prices and offer terms, and correctly tells the writer to avoid percent-off figures and label the guarantee as first-order-only. The 12-pack caution is a useful catch; the only slips are a brief slightly over 200 words and no next-step suggestion at the end.

## Judge list

- Met: Exactly one level and one market stage are named.
  "LEVEL Product aware (knows Sprout...)" and "MARKET STAGE 3 (every greens brand promises nutrients)"; no second level or stage anywhere.
- Met: An ad written from the brief would open, bring in the product and ask differently from the level next door.
  Opens on the doubt, product "Named and shown from the start, without explanation", ask "Direct" with risk removed; solution-aware would open on a tried fix.
- Met: A stage 2 brief uses only numbers the brand states.
  Stage 3 brief; all numbers ($29.99, $1.07, $49.99, $1.78, 60+, 21, 6 g, $19.97) are in the input or brand.md.
- Met: No offer at unaware; at most one offer term at problem-aware and most-aware.
  Product-aware level, where the row allows "Direct, with the risk removed as the offer does it"; two risk-removers used, which the level permits.
- Met: Anything assumed is labelled as assumed.
  "The level and stage come from the buyer brief." Nothing else assumed; doubts and offer terms taken from the input.

## What went in

```text
Ad idea: an image ad for people who know Sprout, maybe from a store
shelf, and think it costs too much. Reason to buy: the real price
per day. Format: Facebook image ad.
Their doubts: "Which discount is real?" / "Will the price jump after
the first order?" / "I hate subscriptions because I feel like they
are a trap."
From the buyer brief: product aware. Market stage 3, every greens
brand promises nutrients.

Brand file:
- First box $29.99 ($1.07/day), text sign-up discount needed
- Renews at $49.99 every 4 weeks ($1.78/day). One-time $66.65
  ($2.38/day)
- "Pause Or Cancel Any Time" (the site's own words)
- 30-day money-back guarantee, first order only
- Ads say 61% off; the site shows 52%, 55%, 49% or 58%

[attached: sprout/brand.md]
```

## What came out

```text
LEVEL Product aware (knows Sprout, maybe from a store shelf, and thinks it costs too much)
MARKET STAGE 3 (every greens brand promises nutrients)

- First words: Their doubt, said straight: "Will the price jump after the first box?" Then answer it at once with both numbers.
- Product enters: Named and shown from the start, without explanation. Use the real deep-green pouch with "28 Daily Packs", exactly as photographed.
- Ask: Direct. Remove the risk the way the offer does: "Pause Or Cancel Any Time" (the site's words, nothing more) and the 30-day money-back guarantee, labelled "first order only."
- Length: Short. Shorter than a solution-aware ad, with no setup.
- Argue: Show the price per day, then what each pack holds. First box is $29.99 ($1.07/day, with the text sign-up discount). After that it renews at $49.99 every 4 weeks ($1.78/day). One pack has 60+ ingredients, 21 vitamins & minerals and 6 g fiber. Use no percent-off figure.
- Usually goes wrong: Answering all three doubts thinly, or stacking 61%, 55% and 52% claims that feed "which discount is real?"

WHY
The level and stage come from the buyer brief. Stating the renewal price plainly answers the "jump" doubt fully and also eases the "trap" doubt. Caution: the store 12-pack ($19.97, about $1.66/day) is cheaper per day than the subscription renewal, so never call this the cheapest way to buy.

CHECKS MISSED
none
```
