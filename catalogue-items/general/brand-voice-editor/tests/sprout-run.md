# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The three fixes are correct, minimal, grounded in the supplied voice notes and customer quotes, and leave every number, price and claim intact, so the owner could use them as-is. The run dropped the NOT FLAGGED section, so the owner can't see at a glance that lines 2, 3, 6 and 7 were deliberately checked and left alone.

## Fix

In 'Check before you hand it back', add: 'The NOT FLAGGED section is always present and lists every line left alone (facts, numbers, prices, terms, brand lines), even if the verdict is on_voice.'

## Judge list

- Met: Every flagged phrase is quoted exactly as it appears in the ad.
  "maintain a consistent supplementation regimen", "unpleasant powdered beverages", "Our formulation is designed to support digestive wellness" all match the script word for word.
- Met: Each issue names a rule from the voice notes or a customer quote, not general taste.
  Line 1 cites "no lab-coat tone" and "the one thing I've been able to stick to"; Line 4 cites "gritty/chalky" and "sloshing chalky powders".
- Met: Numbers, prices, the guarantee and approved claims are word for word the same.
  Lines 2, 3, 6, 7 untouched; Line 5 keeps "support digestion" with no claim added or softened.
- Met: Zero to four fixes; did not rewrite nearly every line.
  Three fixes out of seven lines; lines 2, 3, 6, 7 left as written.
- Met: Fixed lines sound more like customers, not more clever.
  "Struggling to stick to your supplements?" and "Say goodbye to gritty, chalky powder drinks." use the customers' own words plainly.

## What went in

```text
Voice: playful, cheeky, casual internet voice. A funny friend who
is into wellness but refuses to be preachy. No lab-coat tone.
Brand lines: "Rip. Tip. Enjoy." / "No more gagging on pills,
sloshing chalky powders, or cleaning messy counters."
Approved claim: "Supports digestion and gut health."
Buyer: people who quit greens powders and pill stacks
Customer quotes: "I've been choking on [a big-name greens powder]
for the last few years" / "the drink was definitely gritty/chalky"
/ "[Sprout] has been the one thing I've been able to stick to."
Mode: fix

Script:
1. Struggling to maintain a consistent supplementation regimen?
2. Sprout is a daily greens gummy, clinically tested for nutrient
   absorption.
3. 60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack.
4. Say goodbye to unpleasant powdered beverages.
5. Our formulation is designed to support digestive wellness.
6. Rip. Tip. Enjoy.
7. $29.99 for your first box with our text sign-up discount.
   Renews at $49.99 every 4 weeks.
```

## What came out

```text
**Verdict:** `needs_fixes`

**Summary:** The middle of the script reads like a lab-coat product sheet rather than a funny, casual friend, but the brand line and the offer lines already sound right.

**Issues:**

1. **Line 1**
   - **Off-voice phrase:** "maintain a consistent supplementation regimen"
   - **Why:** This is a wrong word and the wrong tone. It's clinical and formal, which breaks "no lab-coat tone" and the casual end of the brand's scale. Customers say "the one thing I've been able to stick to," not "maintain a regimen."
   - **Corrected text:** Struggling to stick to your supplements?

2. **Line 4**
   - **Off-voice phrase:** "unpleasant powdered beverages"
   - **Why:** This is a wrong word and talks past the buyer. It's stiff marketing talk. Customers describe the drink as "gritty/chalky," and the brand's own line says "sloshing chalky powders."
   - **Corrected text:** Say goodbye to gritty, chalky powder drinks.

3. **Line 5**
   - **Off-voice phrase:** "Our formulation is designed to support digestive wellness"
   - **Why:** This is a wrong word and the wrong tone. "Formulation" and "digestive wellness" are lab-coat and marketing terms, outside the casual voice. The approved claim's own wording is "supports digestion." The claim is unchanged, with nothing added and nothing softened.
   - **Corrected text:** It's designed to support digestion.
```
