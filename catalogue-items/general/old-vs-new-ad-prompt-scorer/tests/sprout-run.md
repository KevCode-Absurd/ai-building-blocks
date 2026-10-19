# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 1.

The report is careful and useful: it catches the probiotics error, the missing text sign-up condition, the conflicting offers, flags every gap as MISSING and correctly refuses to call 2 pairs proof. It is undone by one unsupported line calling the 'too expensive' angle the brand's best-performing one, which the files do not support and which slips a results claim into a report that is meant to judge quality only.

## Fix

In step 6, add: 'When judging a distinct idea, cite only what the files show (copies live, reviews, approved claims); never call an angle proven or best-performing, since the ad library shows no results.'

## Judge list

- Met: Each pair has the same brief on both sides
  "Pair 1: offer ad for the price doubter" and "Pair 2: gut buyer" each hold one Before and one After for the same brief, with confounds listed.
- Met: An ad with an invented claim fails the checks, however good it reads
  "Fail. 'gut-supporting probiotics': Sprout has prebiotic fiber, not probiotics." and Before 2 fails on "help keep your gut balanced".
- Met: Every pick was made twice with the order swapped, and a disagreement counts as a tie
  Each pair shows "Round 1 | A then B" and "Round 2 | B then A"; both agreed, so no tie arose. Judge admitted not blind.
- Met: The decision quotes how many wins were needed for that many decided pairs
  "2 decided pairs is far below the 10 minimum, and even then it would need at least 9 wins out of 10."
- Not met: It says nothing about clicks or sales
  "It is the brand's best-performing 'too expensive' angle" asserts results; the disclaimer at the end is present but this line contradicts it.

## Invented

- claim: It is the brand's best-performing "too expensive" angle (Brand file says only that it has the most live copies and to treat it as a hypothesis; ad-results.csv shows Hot girl tummy outperforming it on purchases and revenue.)

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
# Sprout ad prompt comparison: 2 matched pairs

**Read this first:**
- **Usage:** `MISSING: usage records`. There are no tokens, spend, time or retries for either run.
- **Old prompt:** `MISSING: old prompt, settings and model for the "before" set`. The "before" outputs are live ads. They existed before the change, so they count as a frozen "before" set. But nothing shows they came from the old prompt rather than a person or an edit pass.
- **Images:** `MISSING: images`. All outputs are main text only, so the image and phone-size readability checks were skipped.
- **Judge blindness:** `MISSING: blind judge`. The judge (this AI) saw the before and after labels in the input. The A/B order swap below was still run, but the picks are not truly blind.
- **Human check:** `MISSING: human judge check on 10 pairs`. With only 2 pairs, step 7 can't be run.

---

## Pair 1: offer ad for the price doubter

**Random labels:** A = After, B = Before

**Confounds:**
- The before ad states two offers at once: $29.99 first order and "$20 off + $5 per extra person". The after ad states one.
- The before ad is about twice as long.
- The source (person or prompt), model and settings of the before ad are unknown.

### Pass-or-fail checks

| Check | Before | After |
|---|---|---|
| Claims on approved list, limits intact | **Fail.** "gut-supporting probiotics": Sprout has prebiotic fiber, not probiotics. "whole-food" is not on the list. | Pass. "60+ ingredients, 21 vitamins & minerals and 6 g prebiotic fiber" matches the approved line. "Third-party tested" is approved. |
| Prices and offer terms match | **Fail.** "$29.99 for your first order" leaves out the text sign-up condition. "$20 off your first order" conflicts with $29.99, which is $36.66 off the $66.65 one-time price. "Online-exclusive offer" is not in the file. | Pass. "$29.99 with our text sign-up offer" and "Renews at $49.99 every 4 weeks" match. *Note:* $29.99 is the Low Sugar price, and the ad doesn't say Low Sugar. |
| Right product, described right | Pass. "one daily gummy pack". | Pass. "first 28 packs". |
| Required words, fields, length | `MISSING: brief's required fields and length` | `MISSING: brief's required fields and length` |
| Readable at size | Not applicable (text only) | Not applicable (text only) |
| **Result** | **FAIL** | **PASS** |

### Picks and counted result

| Round | Order shown | Pick |
|---|---|---|
| 1 | A then B | A (After) |
| 2 | B then A | A (After) |

**Counted result:** win for After.

### Reasons, with evidence

| Reason | Winner (After) | Loser (Before) |
|---|---|---|
| Fits the buyer and what they know? | Yes. It opens with their objection, "Sprout is too expensive?", and answers "will it jump?" with "Renews at $49.99". | No. It never names the price doubt. Two discounts raise "which discount is real?" |
| Sounds like the brand? | Partly. It is short and puts numbers first, but has little cheek. | No. "Big news… just got a lot more affordable" is generic retail voice. |
| Words and picture agree? | Not applicable (no images) | Not applicable (no images) |
| Easy to read in order? | Yes. Objection, price, contents, renewal, proof. | No. The price appears, then a second offer, then proof, then "Online-exclusive". |
| A distinct idea? | Yes. It is the brand's best-performing "too expensive" angle. | No. It is a standard discount announcement. |

---

## Pair 2: gut buyer

**Random labels:** A = Before, B = After

**Confounds:**
- The source, model and settings of the before ad are unknown.
- Otherwise both ads share the same opening line and the same length range.

### Pass-or-fail checks

| Check | Before | After |
|---|---|---|
| Claims on approved list, limits intact | **Fail.** "help keep your gut balanced" goes beyond the approved "supports digestion and gut health". It also credits "daily vitamins" with digestion support, which is not on the list. | Pass. "6 g prebiotic fiber to support digestion" keeps the "supports" limit. |
| Prices and offer terms match | Pass (no offer stated) | Pass (no offer stated) |
| Right product, described right | Pass | Pass. "One daily pack". |
| Required words, fields, length | `MISSING: brief's required fields and length` | `MISSING: brief's required fields and length` |
| Readable at size | Not applicable (text only) | Not applicable (text only) |
| **Result** | **FAIL** | **PASS** |

### Picks and counted result

| Round | Order shown | Pick |
|---|---|---|
| 1 | A then B | B (After) |
| 2 | B then A | B (After) |

**Counted result:** win for After.

### Reasons, with evidence

| Reason | Winner (After) | Loser (Before) |
|---|---|---|
| Fits the buyer and what they know? | Yes. It opens with "Feeling off in your gut lately?" and gives one concrete fact, "6 g prebiotic fiber". | Yes. It has the same opening line. |
| Sounds like the brand? | Yes. "Rip. Tip. Enjoy." is the brand's own line, and "No powders, no shaker, no prep" uses its three-beat rhythm. | Partly. "without powders or prep" names the enemy, but in a flat tone. |
| Words and picture agree? | Not applicable (no images) | Not applicable (no images) |
| Easy to read in order? | Yes. Pain, fact, enemy, ritual. | Yes. One sentence after the hook. |
| A distinct idea? | Partly. It joins the gut angle to the ritual of opening a pack. | No. It is a generic gut-support line. |

---

## Summary

| Measure | Before | After |
|---|---|---|
| Outright failures | 2 of 2 | 0 of 2 |
| Wins / ties / losses (for After) | | 2 / 0 / 0 |
| Decided pairs | | 2 |
| Wins needed | | At least 9 of 10 decided pairs. Fewer than 10 decided pairs can't settle it. |
| Tokens, spend, retries | `MISSING: usage records` | `MISSING: usage records` |
| Time | `MISSING: usage records` | `MISSING: usage records` |
| Cost per usable ad | Can't compute: 0 usable outputs, spend missing | Can't compute: spend missing |

**Usage:** none measured and none estimated.

**Win score: 100**
- Sum: 2 wins / 2 decided pairs × 100 = 100.
- It covers only 2 pairs, so it proves nothing.

**Pass rates:**
- Before: 0 passed / 2 outputs × 100 = **0**
- After: 2 passed / 2 outputs × 100 = **100**

## Decision

Keep testing. Neither switch rule is met.

- **Switch for quality:** not met. The new prompt has fewer outright failures (0 against 2) and won both pairs. But 2 decided pairs is far below the 10 minimum, and even then it would need at least 9 wins out of 10.
- **Switch to save cost:** not met. There are no usage records, so cost per usable ad can't be compared.

**Next run:**
1. Save the old prompt, its settings and fresh outputs before changing anything. Live ads aren't a clean "before" set.
2. Run at least 10 matched pairs, ideally 20 to 30, across adult and kids briefs, flavours and buyers.
3. Hold the offer constant inside each pair.
4. Log usage for both runs.
5. Hide the before and after labels from the judge.
6. Have a person judge 10 pairs before trusting the AI judge on the rest.

**Separate from the decision:** two problems in the live "before" ads stand regardless of which prompt wins. Ad 1 claims "probiotics" and states two conflicting first-order offers. Ad 2 adds a "balanced gut" claim the brand hasn't approved.

This scores ad quality against the brief and the brand file. It does not predict clicks, sales or how a platform will treat the ads.
```
