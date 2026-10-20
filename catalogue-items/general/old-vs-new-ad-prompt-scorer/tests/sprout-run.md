# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest comparison that catches the real compliance problems in the live ads (probiotics claim, unconditioned $29.99 price) and refuses to call the new prompt better on two unblinded pairs. The owner gets a usable pass/fail audit plus a clear plan for a fair test, with every gap marked MISSING.

## Judge list

- Met: Each pair has the same brief on both sides
  P1 pairs the two offer/price-doubter texts; P2 the two 'Feeling off in your gut lately?' texts, each with constants listed.
- Met: An ad with an invented claim fails the checks, however good it reads
  "FAIL. 'gut-supporting probiotics': the formula lists prebiotic fiber and inulin, with no probiotics on file."
- Met: Every pick was made twice with the order swapped, and a disagreement counts as a tie
  "Round 1 | A then B | A" / "Round 2 | B then A | A" for both pairs; counted only when agreeing.
- Met: The decision quotes how many wins were needed for that many decided pairs
  "Two decided pairs are below the 10-pair floor, where 9 wins are needed."
- Met: It says nothing about clicks or sales
  Only the required disclaimer: "It does not predict clicks, sales or how Meta will deliver the ads." No performance claims made.

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
# Sprout: old vs new ad prompt comparison (2 pairs, copy only)

**Read this first:** this judges the quality of these ad texts against the brand file. It does not predict clicks, sales or how Meta will deliver the ads.

**Limits that apply to every result below:**
- **The "before" set is incomplete.** The outputs predate the change (live ads captured Sept to Oct 2026). The old prompt, its inputs, model and settings were not saved. The live ads may not have come from the old prompt at all.
- **Blinding was not possible.** The outputs arrived labelled BEFORE and AFTER, and I, the AI judge, read the labels. The A/B letters were assigned at random anyway, but treat every pick as unblinded.
- **No person checked the judge.** The skill asks for a human to judge 10 pairs; there are only 2.

---

## Pair P1: offer ad, price doubter

**Labels (random):** A = AFTER, B = BEFORE

**Constants:**
- Product: Sprout Original (Adults), 28 packs
- Offer: $29.99 first order
- Buyer: price doubter
- Format: Meta main text

**Confounds:**
- Before is a live ad of unknown origin (person, other tool or old prompt).
- Before had emoji stripped.
- Before is about twice the length.
- The two ads appear to cite different offer mechanics ($20 off vs text sign-up).
- Model and settings are unknown for both sides.

### Pass-or-fail checks

| Check | A (AFTER) | B (BEFORE) |
|---|---|---|
| Claims on approved list, limits intact | PASS. "60+ ingredients, 21 vitamins & minerals and 6 g prebiotic fiber a day" matches the label claim (1 pack = 1 day). "Third-party tested" is approved. | **FAIL.** "gut-supporting probiotics": the formula lists prebiotic fiber and inulin, with no probiotics on file. "60+ whole-food ingredients": "whole-food" is not approved and the vitamins are not whole foods. |
| Prices and offer terms match | PASS. $29.99 is tied to "our text sign-up offer", matching the footer condition. "Renews at $49.99 every 4 weeks" matches the subscription price. Minor gap: Low Sugar is not named, and Sugar-Free renews at $54.99. | **FAIL.** "$29.99 for your first order" leaves out the text sign-up condition. "Online-exclusive offer" is not in the brief. "$20 off" plus "+$5 off for every extra person" stacks a second mechanic without its terms. No renewal price. |
| Right product, described right | PASS. 28 packs, daily pack. | PASS. "one daily gummy pack". |
| Required words, fields, length | MISSING: brief's required fields and length | MISSING: brief's required fields and length |
| Readable at viewing size | N/A, no images | N/A, no images |
| **Result** | **PASS** | **FAIL** |

### Picks

| Round | Order shown | Pick |
|---|---|---|
| Round 1 | A then B | A |
| Round 2 | B then A | A |

**Counted result:** win for AFTER.

### Reasons

| Question | Winner (A, AFTER) | Loser (B, BEFORE) |
|---|---|---|
| Fits the buyer and what they know? | **Yes.** Opens on their objection ("Sprout is too expensive?"). "Renews at $49.99 every 4 weeks" answers the file's doubt "Will the price jump after the first order?" | **No.** Gives $29.99, "less than $1.10/day", "$20 off" and "+$5 off for every extra person" in one ad. This feeds the doubt "Which discount is real?" |
| Sounds like the brand? | **Yes, lightly.** The cheeky question hook fits. The rest is plain. | **No.** "Big news… just got a lot more affordable" is a generic retail opener. |
| Words and picture agree? | MISSING: images | MISSING: images |
| Easy to read in order? | **Yes.** Objection, then price and condition, then contents, then renewal, then proof. | **No.** Facts and offers interleave, ending on three separate offer lines. |
| A distinct idea? | **No.** The "too expensive" opener is the account's most-copied angle (15+ live copies). The file shows it runs, not that it sells. | **No.** It is a standard first-order discount ad. |

---

## Pair P2: gut buyer

**Labels (random):** A = BEFORE, B = AFTER

**Constants:**
- Product: Sprout Original (Adults)
- Buyer: gut-fix seeker
- Format: Meta main text
- No offer in either ad

**Confounds:**
- Before is a live ad of unknown origin with emoji stripped.
- Both open with the identical hook, "Feeling off in your gut lately?", which suggests After may have been seeded from Before.
- Model and settings are unknown for both sides.

### Pass-or-fail checks

| Check | A (BEFORE) | B (AFTER) |
|---|---|---|
| Claims on approved list, limits intact | **FAIL (narrow).** "Supports digestion" is approved. "to help keep your gut balanced" is not on the list: it implies a gut-balance effect and credits "daily vitamins" with it. "6g of fiber, prebiotics" also reads as two things, when the 6 g is the prebiotic fiber. | PASS. "6 g prebiotic fiber to support digestion" stays at "supports". |
| Prices and offer terms match | N/A, no offer stated | N/A, no offer stated |
| Right product, described right | PASS | PASS. "One daily pack". |
| Required words, fields, length | MISSING: brief's required fields and length | MISSING: brief's required fields and length |
| Readable at viewing size | N/A, no images | N/A, no images |
| **Result** | **FAIL** | **PASS** |

### Picks

| Round | Order shown | Pick |
|---|---|---|
| Round 1 | A then B | B |
| Round 2 | B then A | B |

**Counted result:** win for AFTER. This pair was close on taste. The pick leans on the claim wording and the brand line.

### Reasons

| Question | Winner (B, AFTER) | Loser (A, BEFORE) |
|---|---|---|
| Fits the buyer and what they know? | **Partly no.** It names the fiber and the support claim. It does not touch the file's doubt "Will this upset my stomach more?" or point to Low Sugar. | **Partly no.** It has the same gap, plus a vaguer claim. |
| Sounds like the brand? | **Yes.** "Rip. Tip. Enjoy." is a live brand line, and "No powders, no shaker, no prep" uses the 3-beat rhythm. | **No.** "without powders or prep" is flat, with no brand phrasing. |
| Words and picture agree? | MISSING: images | MISSING: images |
| Easy to read in order? | **Yes.** Hook, then fact, then the old way, then a sign-off. | **Yes.** It is one clear sentence after the hook. |
| A distinct idea? | **No.** Same hook as Before. | **No.** Same hook as After. |

---

## Summary

| Measure | BEFORE | AFTER |
|---|---|---|
| Outputs | 2 | 2 |
| Outright failures | **2** (P1 probiotics claim plus offer terms; P2 "gut balanced") | **0** |
| Wins / ties / losses (for AFTER) | n/a | 2 / 0 / 0 |
| Tokens, spend, time, retries | MISSING: usage records | MISSING: usage records |
| Cost per usable ad | MISSING: spend (and 0 usable ads) | MISSING: spend, divided by 2 usable ads |

- **Decided pairs:** 2. The table starts at 10 decided pairs, which need 9 wins. Fewer than 10 decided pairs can't settle it.
- **Estimates vs measured usage:** neither exists. No cost figures are given.

### Score

- **Win score:** 2 wins / 2 decided pairs × 100 = **100**. This is unblinded and far below the minimum sample, so it is not evidence on its own.
- **Pass rate, BEFORE:** 0 passed / 2 outputs × 100 = **0**
- **Pass rate, AFTER:** 2 passed / 2 outputs × 100 = **100**

## Decision

**Keep testing; don't switch yet.**

- **Switch for quality** needs the new version to have no more failures than before and to meet the wins table. Two decided pairs are below the 10-pair floor, where 9 wins are needed.
- **Switch to save cost** can't be judged because there are no usage records.

**What this test does show:**
- The new prompt removed two real compliance problems the live ads carry: an unsupported "probiotics" claim, and a $29.99 price shown without its text sign-up condition.
- It also added the renewal price that the price doubter asks about.
- That supports the new prompt's checks and claims list, but it is 2 unblinded pairs against "before" ads of unknown origin. It is not a fair old-prompt vs new-prompt result.

**To settle it:**
- Save the old prompt and its settings.
- Run both versions on at least 10 briefs, and better 20, where 15 wins are needed. Cover Kids, the busy parent, the quitter and image ads.
- Have someone other than the person who knows the labels judge them blind, both orders.
- Log usage.

**One fix for the new prompt, whatever the result:** neither gut ad answered "Will this upset my stomach?". Add the "point gut-sensitive buyers to Low Sugar" fact to the gut-buyer step only.

## Gaps

- MISSING: old prompt, its inputs, model and settings (the "before" set is outputs only, of unknown origin)
- MISSING: blind judging (labels were seen) and a human check of the judge on 10 pairs
- MISSING: usage records for both runs (tokens, spend, time, retries)
- MISSING: images, so the picture and readability checks were not run
- MISSING: each brief's required fields and length
- MISSING: decided pairs to reach the table (have 2, need 10 or more)

Want to plan the next round with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Bring this report. Or type your own next step.
```
