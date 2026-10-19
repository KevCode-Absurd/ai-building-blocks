# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The checker caught the real error in Sprout's live ad (probiotics vs prebiotic fiber), flagged the unsupported 61% and gift claims, and surfaced the hidden text-sign-up condition and $49.99 renewal that the price-doubting buyer cares about. Score arithmetic (8/14 = 57) checks out and every proposed rewrite uses only facts the owner supplied, so the fixes can be applied as written.

## Judge list

- Met: Every no quotes a real line from your copy.
  Checks 5, 6, 8, 9, 10, 11 each quote copy, e.g. 9: "'Shop [Sprout]' is one ask, but it doesn't say what the buyer gets."
- Met: Every number and claim in the copy appears in the facts gate.
  Gate lists $29.99, $1.10/day, 60+, 21, probiotics, $20 off, +$5, third-party tested, online exclusive, more affordable, 61%, 4 gifts, whole-food, daily pack.
- Met: The verdict follows the rule, with blocked items first.
  "Verdict: BLOCKED" after "gut-supporting probiotics: contradicted"; fix 1 removes the contradicted claim first.
- Met: No fix asks you to add a fact you don't have.
  Fixes use only $29.99, $49.99, 6 g prebiotic fiber, text sign-up, first-order guarantee; $20 off is $49.99 minus $29.99.
- Met: It doesn't mark you down for being plain or using 'best' in your own voice.
  Check 12 "Yes. The ad is short and leads with the deal"; no polish or superlative penalty anywhere.

## What went in

```text
Copy (Facebook ad, emoji removed):
Main text: Big news: your first order of [Sprout] just got a lot
more affordable. $29.99 for your first order, that's less than
$1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals,
and gut-supporting probiotics in one daily gummy pack. $20 off your
first order. +$5 off for every extra person. Third-party tested.
Online-exclusive offer. Shop [Sprout].
Headline: Get up to 61% OFF + 4 FREE gifts: online exclusive

Buyer: knows Sprout and thinks it costs too much. Doubt: "Will the
price jump after the first order?"

Facts: 60+ ingredients, 21 vitamins & minerals, 6 g prebiotic
fiber (no probiotics in the ingredient list). First box $29.99 with
the text sign-up discount, then $49.99 every 4 weeks. 30-day
money-back guarantee, first order only. Third-party tested.
```

## What came out

```text
Verdict: BLOCKED

Facts gate:
- "$29.99 for your first order": held. The facts tie this price to the text sign-up discount, and the copy doesn't mention that condition.
- "less than $1.10/day": held. $29.99 over 4 weeks is about $1.07 a day, for the first box only.
- "60+ … ingredients": held
- "whole-food": unverified
- "21 vitamins & minerals": held
- "gut-supporting probiotics": contradicted. The facts list 6 g prebiotic fiber and no probiotics.
- "daily gummy pack": unverified
- "$20 off your first order": held ($49.99 − $29.99)
- "+$5 off for every extra person": unverified
- "Third-party tested": held
- "Online-exclusive offer" / "online exclusive": unverified. The facts tie the discount to text sign-up.
- "just got a lot more affordable" (implies a new price): unverified
- "up to 61% OFF": unverified. The facts support $20 off $49.99, which is 40%.
- "4 FREE gifts": unverified

Measures: grade about 7 (target 8), longest sentence 25 words ("$29.99 for your first order, that's less than $1.10/day … in one daily gummy pack.")

Checks 1 to 12:
1. Yes. "Big news: your first order of [Sprout] just got a lot more affordable."
2. Yes. The first line and "Shop [Sprout]" together say: a cheaper first order of Sprout.
3. Yes. "…60+ whole-food ingredients, 21 vitamins & minerals … in one daily gummy pack."
4. Yes. The headline ("Get up to 61% OFF…"), the first line ("…just got a lot more affordable") and "Shop [Sprout]" carry the argument: it's cheaper now, so shop.
5. No. "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack." This one sentence carries price, daily cost, ingredients, nutrients, probiotics and format.
6. No. "Get up to 61% OFF + 4 FREE gifts" has no supplied fact beside it, and "gut-supporting probiotics" is contradicted.
7. Yes. "less than $1.10/day", "60+ … ingredients" and "21 vitamins & minerals" can all be checked.
8. No. "$29.99 for your first order" leaves the buyer's doubt ("Will the price jump?") unanswered. The $49.99 renewal never appears.
9. No. "Shop [Sprout]" is one ask, but it doesn't say what the buyer gets.
10. No. "$20 off your first order." There is no renewal ($49.99 every 4 weeks), no guarantee terms and no text sign-up condition near the ask.
11. No. "Online-exclusive offer" and "just got a lot more affordable" aren't supported by the facts, and the facts tie the discount to text sign-up.
12. Yes. The ad is short and leads with the deal, which suits a reader who already knows Sprout.

Fixes (max 3), in order:
1. Remove the contradicted claim and split the long sentence. Change "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack." to "Your first box is $29.99. That's under $1.10 a day. Each daily pack has 60+ ingredients, 21 vitamins & minerals and 6 g prebiotic fiber."
2. Cut the unsupported offer and urgency lines. Change the headline to "$20 off your first box of [Sprout] when you sign up by text." Change the first line to "Big news: your first box of [Sprout] is $20 off." Delete "+$5 off for every extra person." and "Online-exclusive offer."
3. State the terms and the payoff at the ask. Put "Then $49.99 every 4 weeks. 30-day money-back guarantee on your first order." right before a button reading "Get my first box for $29.99."

Readiness score: 8 / 14 x 100 = 57, with the fixes made 14 / 14 x 100 = 100
```
