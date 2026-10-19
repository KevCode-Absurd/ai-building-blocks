# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The edits themselves are good: three well-chosen, minimal fixes that swap lab-coat wording for the customers' own words while leaving every number, price and claim intact. It left out the NOT FLAGGED section, so the owner can't see which lines were deliberately kept and why.

## Fix

In 'What you hand back', add a required item: 'Not flagged: list the lines you left alone and the reason (fact, number, price, term)', and add 'The NOT FLAGGED section is present' to 'Check before you hand it back'.

## Judge list

- Met: Every flagged phrase is quoted exactly as it appears in your ad.
  "maintain a consistent supplementation regimen", "unpleasant powdered beverages", "Our formulation is designed to support digestive wellness." all match the script verbatim.
- Met: Each issue names a rule from your voice notes or a customer quote, not general taste.
  "the 'lab-coat tone' the voice rules out. Customers say 'the one thing I've been able to stick to.'"
- Met: Numbers, prices, the guarantee and approved claims are word for word the same. Check line by line.
  Lines 2, 3, 6, 7 untouched; line 5 stays at "support" and names the approved claim's word "digestion".
- Met: Most good scripts get zero to four fixes. If it rewrote nearly every line, it went too far.
  Three fixes on a seven-line script (lines 1, 4, 5).
- Met: Read the fixed lines aloud. They should sound more like your customers, not more clever.
  "Struggling to stick to your supplements?" and "gritty, chalky powdered drinks" use the customers' own words, no added tricks.

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

**Summary:** The brand line and the offer lines sound like Sprout, but three lines use the stiff, lab-coat wording the voice rules out instead of the casual way these buyers talk.

**Issues:**

1. **Line 1.** Phrase: "maintain a consistent supplementation regimen"
   - **Why:** This is clinical jargon, the "lab-coat tone" the voice rules out. Customers say "the one thing I've been able to stick to."
   - **Corrected:** "Struggling to stick to your supplements?"

2. **Line 4.** Phrase: "unpleasant powdered beverages"
   - **Why:** This is stiff marketing talk. Customers say "the drink was definitely gritty/chalky," and the brand line says "sloshing chalky powders."
   - **Corrected:** "Say goodbye to gritty, chalky powdered drinks."

3. **Line 5.** Phrase: "Our formulation is designed to support digestive wellness."
   - **Why:** "Formulation" is lab-coat wording, and "digestive wellness" is wellness-marketing talk. Both clash with the casual "funny friend" voice. The fix uses the approved claim's own word, "digestion." It keeps "made to support," which is no stronger than "designed to support."
   - **Corrected:** "It's made to support digestion."

**Voice score:**
- **Now:** 4 lines with no issue / 7 lines checked × 100 = 57
- **After fixes:** 7 lines with no issue / 7 lines checked × 100 = 100
```
