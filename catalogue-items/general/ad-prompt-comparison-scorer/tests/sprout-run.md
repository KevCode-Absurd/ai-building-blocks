# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly catches the real errors in the live ads (probiotics, unconditioned $29.99, 'gut balanced'), passes the new copy on the approved claims, and is honest that two non-blind pairs prove nothing. Its weak spots are procedural: it admits the before set is not a saved run yet continues instead of stopping, the 'random' labels and 'two rounds' were performed by the same non-blind judge, and the SET-UP heading is folded into a MISSING block.

## Judge list

- Met: Each pair has the same brief on both sides
  Input states 'same two briefs'; run lists confounds per pair, e.g. 'The before ad is about twice as long.'
- Met: An ad with an invented claim fails the checks, however good it reads
  A (before) P1: 'FAIL. "gut-supporting probiotics": the product has prebiotic fiber, and no probiotic is on file.' Result: 'Outright failure'.
- Met: Every pick made twice with order swapped; disagreement counts as a tie
  'Round 1 (A shown first): B / Round 2 (B shown first): B / Counted result: after wins.' Both pairs show two rounds.
- Met: Decision quotes how many wins were needed for that many decided pairs
  'There are 2 decided pairs. Fewer than 10 decided pairs can't settle it... needs 9 wins out of 10' and '20 or more (which needs 15 wins)'.
- Met: Says nothing about clicks or sales
  Only the required disclaimer: 'It does not predict clicks, sales or how Meta will treat the ads.' No performance predictions made.

## What went in

```text
BEFORE (live main texts from the Sprout ads file, emoji left out)
1: "Big news: your first order of [Sprout] just got a lot more
affordable. $29.99 for your first order, that's less than
$1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals,
and gut-supporting probiotics in one daily gummy pack. $20 off
your first order, +$5 off for every extra person, Third-party
tested. Online-exclusive offer. Shop [Sprout]."
2: "Feeling off in your gut lately? [Sprout] supports digestion
with 6g of fiber, prebiotics, and daily vitamins to help keep
your gut balanced without powders or prep."

AFTER (new prompt: brand file + claims list, same two briefs)
1: "Sprout is too expensive? Your first 28 packs are $29.99 with
our text sign-up offer. 60+ ingredients, 21 vitamins & minerals
and 6 g prebiotic fiber a day. Renews at $49.99 every 4 weeks.
Third-party tested."
2: "Feeling off in your gut lately? One daily pack of Sprout has
6 g prebiotic fiber to support digestion. No powders, no shaker,
no prep. Rip. Tip. Enjoy."

Briefs: 1 = offer ad for the price doubter. 2 = gut buyer.
Facts: the Sprout brand file. No images. No usage records.

[attached: sprout/brand.md]
```

## What came out

```text
MISSING: the old prompt or skill, what it read, and its model and settings. The "before" texts are live ads taken from the ads file, not a saved run of the old prompt on these two briefs.
MISSING: the old run's failures and repairs.
MISSING: usage records for both runs (tokens, spend, time, retries, failed calls).
MISSING: images. This was judged as text only, so the "images open" and "readable at phone size" checks could not run.
MISSING: required words, fields and length in the briefs, so those checks were run only against the brand file.
MISSING: a blind judge and the person check on 10 pairs. The before and after labels came with the outputs, so this judge saw which side was new. The picks below are **not blind**.

---

### Pair P1: offer ad, price doubter

**Labels (random):** A = before, B = after

**Confounds**
- The "before" ad is a published live ad. It may have been edited by a person or picked from many variants.
- Emoji were removed from "before" only.
- The old prompt's inputs are unknown.
- The before ad is about twice as long.
- It carries "$20 off" and "+$5 per extra person" terms. These may come from a different live offer than the one the after ad was given.

**Pass or fail**

| Check | A (before) | B (after) |
|---|---|---|
| Claims on approved list, limits intact | **FAIL.** "gut-supporting probiotics": the product has prebiotic fiber, and no probiotic is on file. "60+ whole-food ingredients": the approved wording is "60+ ingredients", and the count includes vitamins and minerals. "Online-exclusive offer": not on file. | PASS. "60+ ingredients, 21 vitamins & minerals and 6 g prebiotic fiber" and "Third-party tested" are both on the list. |
| Prices and offer terms match | **FAIL.** "$29.99 for your first order" leaves out the condition that it needs the text sign-up discount. It stacks "$20 off" and "+$5 off for every extra person" (the file says "Buy 2 Save $5") next to the $29.99. It gives no renewal price. | PASS. "$29.99 with our text sign-up offer" and "Renews at $49.99 every 4 weeks" both match the file. Note: it does not say Low Sugar, and $29.99 is shown only for Low Sugar Adults. |
| Right product, described right | PASS. "one daily gummy pack" | PASS. "first 28 packs" |
| Required words, fields, length | Not checkable (MISSING) | Not checkable (MISSING) |
| Readable at viewing size | Not checkable, no image | Not checkable, no image |
| **Result** | **Outright failure** | **Pass** |

**Picks**
- Round 1 (A shown first): B
- Round 2 (B shown first): B
- **Counted result: after wins.** This pick is not blind.

**Reasons for the winner (B, after)**
- **Fits the buyer:** YES. "Sprout is too expensive?" names the doubt directly. "Renews at $49.99" answers "Will the price jump after the first order?"
- **Sounds like the brand:** YES. The question hook, short lines and numbers up front match the brand voice.
- **Words and picture agree:** not checkable, no image.
- **Easy to read in order:** YES. The order is doubt, then price, then what's in it, then renewal, then proof.
- **Distinct idea:** NO. It reuses the account's most-copied live angle ("'Sprout is too expensive': here's 61% off…").

**Reasons for the loser (A, before)**
- **Fits the buyer:** NO. "$29.99", "less than $1.10/day", "$20 off" and "+$5 off" all appear together. That feeds "Which discount is real?"
- **Sounds like the brand:** NO. "Big news: your first order … just got a lot more affordable" reads like a press release.
- **Words and picture agree:** not checkable.
- **Easy to read in order:** NO. The price is stated twice in different forms, and the "$20 off" line breaks the flow.
- **Distinct idea:** NO. It reuses the birthday price-cut framing.

---

### Pair P2: gut buyer

**Labels (random):** A = after, B = before

**Confounds**
- The "before" ad is a published live ad, possibly edited by a person.
- Emoji were removed from "before" only.
- The old prompt's inputs are unknown.
- Both ads open with the same hook, "Feeling off in your gut lately?", so the old ad may have shaped the new prompt.

**Pass or fail**

| Check | A (after) | B (before) |
|---|---|---|
| Claims on approved list, limits intact | PASS. "6 g prebiotic fiber to support digestion" stays at "supports". | **FAIL.** "to help keep your gut balanced" is not on the approved list. "Balanced" implies an effect on gut bacteria. The sentence also credits "daily vitamins" with that effect. The approved wording is "Supports digestion and gut health". |
| Prices and offer terms match | PASS. No offer is stated. | PASS. No offer is stated. |
| Right product, described right | PASS. "One daily pack" | PASS |
| Required words, fields, length | Not checkable (MISSING) | Not checkable (MISSING) |
| Readable at viewing size | Not checkable, no image | Not checkable, no image |
| **Result** | **Pass** | **Outright failure** |

**Picks**
- Round 1 (A shown first): A
- Round 2 (B shown first): A
- **Counted result: after wins.** This pick is not blind.

**Reasons for the winner (A, after)**
- **Fits the buyer:** YES, mostly. "Feeling off in your gut lately?" speaks to this buyer. It misses the "Will this upset my stomach?" doubt, which the file answers by pointing gut-sensitive buyers to Low Sugar.
- **Sounds like the brand:** YES. "No powders, no shaker, no prep. Rip. Tip. Enjoy." uses the brand's three-beat rhythm and an existing brand line.
- **Words and picture agree:** not checkable.
- **Easy to read in order:** YES. The order is pain, then one pack, then fiber, then the enemy, then the ritual.
- **Distinct idea:** NO. It uses the same hook as the before ad.

**Reasons for the loser (B, before)**
- **Fits the buyer:** YES. It has the same hook.
- **Sounds like the brand:** NO. "to help keep your gut balanced without powders or prep" is flat, with no cheek.
- **Words and picture agree:** not checkable.
- **Easy to read in order:** YES.
- **Distinct idea:** NO.

---

### Summary

| | Before | After |
|---|---|---|
| Outright failures | 2 of 2 | 0 of 2 |
| Usable ads | 0 | 2 |

**Picks**
- After: 2 wins, 0 ties, 0 losses.
- These picks are **not blind**, and no person checked the judge.

**Is it more than luck?**
- There are 2 decided pairs. Fewer than 10 decided pairs can't settle it.
- The smallest row in the table needs **9 wins out of 10** decided pairs. This test is far short of that.

**Cost per usable ad**
- **Measured:** none (MISSING usage records).
- **Estimated:** none.
- Before has 0 usable outputs, so its cost per usable ad cannot be defined.

**Time and retries:** MISSING.

### Decision

Neither switch rule is met, so the rule says keep the old version or test more pairs. The recommendation is **test more pairs**. The new prompt had fewer outright failures (0 against 2). The old ads failed on errors that matter: an invented probiotic claim, a "gut balanced" claim, and a $29.99 price without its text sign-up condition. But two pairs judged by someone who knew which side was new cannot show the new prompt writes better ads.

To settle it:
1. Save a real run of the old prompt on the same briefs, with its settings and failures.
2. Build at least 10 decided pairs, ideally 20 or more (which needs 15 wins). Cover the busy parent, the quitter and the Kids line as well.
3. Blind the labels and judge each pair twice with the order swapped.
4. Have a person judge 10 pairs alongside the AI judge.
5. Log usage for both runs so cost per usable ad can be counted.

This compares ad quality and rule compliance only. It does not predict clicks, sales or how Meta will treat the ads.
```
