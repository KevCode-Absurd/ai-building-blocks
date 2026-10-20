# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, restrained edit: it fixed only the three genuinely stiff lines using the customer's own words and left prices, numbers and claims alone. The owner can use the corrected script as is, with two sensible MISSING notes pointing to a claims check for lines 2 and 5.

## Judge list

- Met: Every flagged phrase is quoted exactly as it appears in the ad.
  "maintain a consistent supplementation regimen", "unpleasant powdered beverages", "Our formulation is designed to" all match the script word for word.
- Met: Each issue names a rule from the voice notes or a customer quote, not general taste.
  Line 1 cites "No lab-coat tone" and "the one thing I've been able to stick to"; Line 4 cites "gritty/chalky" and "chalky powders".
- Met: Numbers, prices, the guarantee and approved claims are word for word the same.
  Lines 3 and 7 left untouched; Line 5 keeps "support digestive wellness"; Line 2 claim left unchanged with MISSING note.
- Met: Zero to four fixes; did not rewrite nearly every line.
  Three issues on a seven-line script; four lines left alone in NOT FLAGGED.
- Met: Fixed lines sound more like customers, not more clever.
  "Struggling to stick to your supplements?" and "gritty, chalky powder drinks" use the pasted customer words directly.

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
VERDICT: needs_fixes

SUMMARY
The brand lines sound like the cheeky friend, but three lines use a lab-coat tone and stiff words that this buyer doesn't use.

ISSUES
Line 1
  Phrase:    "maintain a consistent supplementation regimen"
  Why:       Wrong word. This is clinical jargon, and the voice notes say "No lab-coat tone." Customers say they "stick to" things: "[Sprout] has been the one thing I've been able to stick to."
  Corrected: Struggling to stick to your supplements?

Line 4
  Phrase:    "unpleasant powdered beverages"
  Why:       Wrong word. It talks past the buyer, who says "the drink was definitely gritty/chalky." "Beverages" is stiff for a casual internet voice, and the brand's own line says "chalky powders."
  Corrected: Say goodbye to gritty, chalky powder drinks.

Line 5
  Phrase:    "Our formulation is designed to"
  Why:       Wrong tone. "Formulation" and "designed to" are lab-coat corporate wording, which breaks "No lab-coat tone" and the casual funny-friend voice. The claim wording after it is left exactly as written.
  Corrected: It's made to support digestive wellness.

NOT FLAGGED
Line 2: This line states a fact and a claim ("clinically tested for nutrient absorption"), so the clinical wording is allowed and the claim is not mine to change. MISSING: the status of this claim. It is not on the approved claims list you gave me.
Line 3: Numbers and ingredient counts, left unchanged.
Line 6: The brand's own line, "Rip. Tip. Enjoy."
Line 7: Prices and renewal terms, left unchanged.
Line 5 (claim part): "support digestive wellness" is kept as written. MISSING: confirmation that it matches the approved claim "Supports digestion and gut health." A claims check should decide this, not a voice edit.

VOICE SCORE
Now: 4 / 7 x 100 = 57
After the fixes: 7 / 7 x 100 = 100

Next, do you want to plan what to test with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Or tell me what you'd rather do.
```
