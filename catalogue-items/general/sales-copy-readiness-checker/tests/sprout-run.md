# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A sound last read: it caught the real probiotics error, blocked the ad, flagged every unsupported offer claim, and gave three fixes built only from the owner's facts. Derived numbers ($1.07/day, $20 off, 40%) are shown as arithmetic, and the gaps are listed as MISSING rather than guessed; the only wobble is scoring 13/13 after fixes while "Big news" stays unverified.

## Judge list

- Met: Every no quotes a real line from your copy.
  Check 5 quotes the 25-word sentence; 6 quotes "Get up to 61% OFF + 4 FREE gifts"; 8, 9, 10 quote "$29.99 for your first order" / "Shop [Sprout]".
- Met: Every number and claim in the copy appears in the facts gate.
  Gate lists $29.99, $1.10/day, 60+, whole-food, 21 vitamins, probiotics, $20 off, +$5, third-party tested, online-exclusive, 61%, 4 gifts, "Big news".
- Met: The verdict follows the rule, with blocked items first.
  "Verdict: BLOCKED" on the contradicted probiotics claim; Fix 1 is "(Blocker, and check 5)".
- Met: No fix asks you to add a fact you don't have.
  Fix 3 adds only "$29.99 with text sign-up, then $49.99 every 4 weeks. 30-day money-back guarantee on your first order", all in the given facts.
- Met: It doesn't mark you down for being plain or using "best" in your own voice.
  Check 1 and 12 pass the plain "Big news" opener and short deal-led length; no polish penalties.

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
```
Verdict: BLOCKED

Facts gate:
- "$29.99 for your first order": held (facts: needs the text sign-up discount, which the copy doesn't mention)
- "less than $1.10/day": held, derived ($29.99 / 28 days = $1.07, if one box is 4 weeks)
- "60+ ... ingredients": held
- "whole-food": unverified
- "21 vitamins & minerals": held
- "gut-supporting probiotics": contradicted (no probiotics in the ingredient list; the facts list 6 g prebiotic fiber)
- "one daily gummy pack": unverified
- "$20 off your first order": held, derived ($49.99 - $29.99)
- "+$5 off for every extra person": unverified
- "Third-party tested": held
- "Online-exclusive offer" / "online exclusive": unverified
- "up to 61% OFF": unverified (the facts support $20 off $49.99 = 40%)
- "4 FREE gifts": unverified
- "Big news ... just got a lot more affordable" (implies a new offer): unverified

Measures: grade about 6 (estimated, target 8), longest sentence 25 words (target 25 or under, passes)

Checks 1 to 12:
1. Yes. "Big news: your first order of [Sprout] just got a lot more affordable."
2. Yes. "your first order of [Sprout] just got a lot more affordable" + "Shop [Sprout]."
3. Yes. "60+ whole-food ingredients, 21 vitamins & minerals ... in one daily gummy pack."
4. Yes. Headline, first sentence and "Shop [Sprout]" carry the point: Sprout is cheaper now.
5. No. "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack." This one sentence carries the price, the daily cost and the full contents.
6. No. "Get up to 61% OFF + 4 FREE gifts" and "+$5 off for every extra person" have no supplied fact. "$20 off" works out to 40%, not 61%.
7. Yes. "less than $1.10/day for 60+ ... ingredients, 21 vitamins & minerals ... in one daily gummy pack." The reader can check these.
8. No. "$29.99 for your first order." The ad never says what comes after the first order, and that is exactly this buyer's doubt.
9. No. "Shop [Sprout]." There is one ask, but it doesn't say what the buyer gets.
10. No. "$20 off your first order. ... Shop [Sprout]." The renewal ($49.99 every 4 weeks), the text sign-up condition and the 30-day first-order guarantee are all missing.
11. Cannot verify. "Online-exclusive offer," "4 FREE gifts" and "Big news" aren't in the facts.
12. Yes. The ad is short and leads with the deal, which suits a reader who already knows Sprout.

Fixes, in order:
1. (Blocker, and check 5) Replace the second sentence with: "$29.99 for your first box. That's less than $1.10 a day. Each daily gummy pack has 60+ ingredients, 21 vitamins & minerals and 6 g prebiotic fiber."
2. (Check 6) Cut every claim the facts don't hold: "up to 61% OFF," "4 FREE gifts," "+$5 off for every extra person," "Online-exclusive offer" and "whole-food." Put any of them back only once it's confirmed. New headline: "Your first [Sprout] box: $29.99, $20 off."
3. (Checks 8, 9, 10) Above the ask, add: "First box $29.99 with text sign-up, then $49.99 every 4 weeks. 30-day money-back guarantee on your first order." Change the ask to: "Get my first box for $29.99."

Readiness score: 8 / 13 x 100 = 62 (1 check left out as cannot verify), with the fixes made 13 / 13 x 100 = 100
```

MISSING: shipping and delivery cost; whether "+$5 off per extra person," "4 free gifts," "online exclusive" and "whole-food" are true; whether one box lasts 28 days.

Next, do you want to plan what to test with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Bring this report. Or tell me what you'd rather do.
```
