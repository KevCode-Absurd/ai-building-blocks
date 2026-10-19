# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, correct read: it catches the real probiotics error, flags every unsupported discount claim, and names the buyer's price-jump worry as the gap the ad leaves open. The suggested rewrites use only facts the owner actually has, so they can be applied straight away; the "$20 off: held" and "40% off" lines are arithmetic on given numbers, not new facts.

## Judge list

- Met: Every no quotes a real line from your copy.
  Check 5 quotes sentence 2 in full; check 9 quotes "Shop [Sprout]"; check 11 quotes "Online-exclusive offer". All appear in the copy.
- Met: Every number and claim in the copy appears in the facts gate.
  Gate covers $29.99, $1.10/day, 60+, whole-food, 21, probiotics, $20 off, +$5, third-party tested, online-exclusive, 61%, 4 gifts, "more affordable".
- Met: The verdict follows the rule, with blocked items first.
  "Verdict: BLOCKED" on the contradicted probiotics claim; fix 1 is the blocker, then reader-order fixes.
- Met: No fix asks you to add a fact you don't have.
  Fixes use only supplied facts (6 g prebiotic fiber, $49.99 renewal, text sign-up, first-order guarantee) and say "Confirm or cut" for unverified items.
- Met: It doesn't mark you down for being plain or using "best" in your own voice.
  Check 1 passes "Big news... a lot more affordable"; no deductions for tone or boldness.

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
Verdict: BLOCKED (once cleared, check 5 makes it REWRITE main text, sentence 2)

Facts gate:
- "60+ … ingredients": held
- "whole-food": unverified
- "21 vitamins & minerals": held
- "gut-supporting probiotics": **contradicted** (the facts list 6 g prebiotic fiber, with no probiotics in the ingredient list)
- "$29.99 for your first order": held, but the facts tie it to the text sign-up discount and the copy doesn't say so
- "less than $1.10/day": unverified (the facts don't give the first box's length)
- "one daily gummy pack": unverified
- "$20 off your first order": held ($49.99 − $29.99)
- "+$5 off for every extra person": unverified
- "Third-party tested": held
- "Online-exclusive offer": unverified (the facts name a text sign-up discount, not an online one)
- "up to 61% OFF": unverified (the facts support 40% off: $20 of $49.99)
- "4 FREE gifts": unverified
- "just got a lot more affordable" (implies a new price drop): unverified

Measures: grade ≈7 (target 8), longest sentence 25 words (sentence 2, at the limit)

Checks 1 to 12:
1. Yes. "Big news: your first order of [Sprout] just got a lot more affordable."
2. Yes. "your first order of [Sprout] just got a lot more affordable" + "Shop [Sprout]"
3. Yes. "60+ whole-food ingredients, 21 vitamins & minerals … in one daily gummy pack"
4. Yes. "Get up to 61% OFF + 4 FREE gifts" / "your first order … just got a lot more affordable" / "Shop [Sprout]"
5. No. "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack." This one sentence covers price, cost per day, ingredients, vitamins and format.
6. No. "Get up to 61% OFF + 4 FREE gifts" and "+$5 off for every extra person" have no supporting fact beside them.
7. Yes. "60+ whole-food ingredients, 21 vitamins & minerals … in one daily gummy pack"
8. No. "$29.99 for your first order" never says what comes after the first order, which is exactly this buyer's worry.
9. No. "Shop [Sprout]" is the only ask, but it doesn't say what the buyer gets.
10. No. "$20 off your first order." The ad omits the $49.99 every 4 weeks renewal, the 30-day first-order guarantee and the text sign-up condition.
11. No. "Online-exclusive offer" and "just got a lot more affordable" are not supported by the facts.
12. Yes. The short, price-led ad suits a reader who already knows Sprout: "$20 off your first order."

Fixes:
1. Remove "gut-supporting probiotics" and use the supplied fact instead: "6 g prebiotic fiber."
2. Split sentence 2 into one idea per sentence: "$29.99 for your first box. That's less than $1.10 a day. Each daily pack has 60+ ingredients, 21 vitamins & minerals and 6 g prebiotic fiber." Confirm the $1.10/day figure against the box length first.
3. Answer the price-jump doubt and state the terms beside the ask: "$29.99 for your first box with text sign-up, then $49.99 every 4 weeks. 30-day money-back guarantee on your first order." Make the ask say what the buyer gets, e.g. "Get your first box for $29.99." Confirm or cut "up to 61% OFF", "4 FREE gifts", "+$5 off for every extra person" and "Online-exclusive."
```
