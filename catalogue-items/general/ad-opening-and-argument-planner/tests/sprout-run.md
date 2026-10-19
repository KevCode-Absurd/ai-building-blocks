# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The brief is accurate and well aimed at the price doubter: it uses only Sprout's real numbers, flags the first-order-only guarantee, and avoids the confusing discount percentages. It departs from the required shape, though, which makes it less paste-ready for the writer.

## Fix

In the Steps and output shape, require the exact format: LEVEL and MARKET STAGE lines at the top, then a WHY heading, and a SCORE block with "Missed:" line, and make the brief keep the "Ask"/"Argue"/"Usually goes wrong" labels exactly.

## Judge list

- Met: Exactly one level and one market stage are named.
  "Level: Product aware. Stage: 3, every greens brand promises nutrients."
- Met: An ad written from the brief would open, bring in the product and ask differently from the level next door.
  Opens on the renewal-price doubt, product named from the start, direct ask with risk removal, short length.
- Met: A stage 2 brief uses only numbers your brand states.
  Stage 3 chosen, so not applicable; all numbers used ($29.99, $49.99, $1.78, 60+, 21, 6 g) are in the brand file.
- Met: No offer at unaware; at most one offer term for problem-aware and most-aware.
  Level is product aware; the limit does not apply.
- Met: Anything assumed is labelled as assumed.
  "The store-shelf origin is assumed from the idea."

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
**Brief: Sprout price-doubter image ad**

**Level:** Product aware. **Stage:** 3, every greens brand promises nutrients.

- **First words:** Answer the doubt "Will the price jump after the first order?" Say the renewal price up front: "$29.99 to start. $49.99 after. $1.78 a day."
- **Product enters:** Named from the start, not explained. Show the real adult Original pouch exactly as photographed, with one daily pack torn straight across the top.
- **The ask:** Direct. Remove the risk the way the offer does: the 30-day money-back guarantee (first order only, so say so), plus the site's own words, "Pause Or Cancel Any Time." Do not promise anything easier than that.
- **Length:** Short. One headline, one price line, one risk line.
- **Argument:** Make the price add up on the page. Show the price per day for each step:
  - first box $1.07 (needs the text sign-up)
  - renewal $1.78
  - one-time $2.38
  
  Then show what $1.78 buys in one pack: 60+ ingredients, 21 vitamins and minerals, 6 g fiber.
- **Leave out:** Any "% off." The ads and site show 49%, 52%, 55%, 58% and 61% at once, which feeds "which discount is real?"
- **What usually goes wrong:** Answering three doubts thinly instead of one fully.
- **Why:** The buyer already knows Sprout, so the job is to name the real ongoing price and remove the risk. The store-shelf origin is assumed from the idea.

**Score: 4/4 checks passed = 100/100**
```
