# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 2 of 5 met. Invented facts: 3.

The scan finds the right signs and keeps the brand line, but the fixes add claims (replacement, easier) and turn a negation run into a triple. The output also drifts from the required layout and its score arithmetic is muddled.

## Fix

In Steps 2 and the checks, add: a fix may only reword or delete, never state a new claim (such as 'replace' or 'easier'), and must not convert one sign into another such as a triple; also require the exact output shape with numbered Sign/Fix lines.

## Judge list

- Met: Every hit is quoted exactly as it appears in your copy.
  Hits 1-6 quote lines verbatim, e.g. "No powders. No pills. No shaker." and "Level up your daily routine."
- Not met: No fix adds a fact, claim or number that wasn't in the copy.
  "The gummies replace powders, pills and a shaker" and "so getting your greens is easier" assert replacement and ease, which the copy never states.
- Not met: The rewrite keeps your meaning and order.
  Original order was lines 2,3,5,7,8,9; rewrite moves things and "Take one pack a day" replaces line 7 with new instruction.
- Not met: A fixed sign hasn't turned into another, such as a negation run becoming a triple.
  "replace powders, pills and a shaker" is a reflex triple; the negation run became a triple.
- Met: Read the rewrite aloud. It should sound plainer, not cleverer.
  Rewrite reads plain and short, though a bit of a claim is added.

## Invented

- claim: The gummies replace powders, pills and a shaker (Copy only said "No powders. No pills. No shaker."; replacement is a new claim.)
- claim: so getting your greens is easier (Ease claim not stated in copy, turned from "Less hassle".)
- other: Take one pack a day. (Serving instruction is in brand files but not in the copy; fix rule says only copy facts.)

## Safety

- Rewrite says "It's clinically tested for nutrient absorption" without naming the study, and "replace powders, pills" implies a replacement claim beyond approved wording.

## What went in

```text
Copy (email intro):
1 Whether you're a busy parent or a gym regular, your nutrition
  matters.
2 Sprout packs 60+ ingredients, 21 vitamins and minerals, and 6 g
  of fiber into one small daily pack of gummies.
3 No powders. No pills. No shaker.
4 Does it actually work? Absolutely.
5 Less hassle. More greens.
6 It's about more than vitamins.
7 Level up your daily routine.
8 Clinically tested for nutrient absorption.
9 Rip. Tip. Enjoy.

Brand's own lines: "Rip. Tip. Enjoy." / "Tastes like a treat,
works like a supplement."
```

## What came out

```text
Hits: 6 in 65 words (9.2 per 100)
1. "Whether you're a busy parent or a gym regular, your nutrition matters." | sign 9, stock opener | Cut. Open on line 2, the first line with facts.
2. "No powders. No pills. No shaker." | sign 6, negation run | "The gummies replace powders, pills and a shaker"
3. "Does it actually work? Absolutely." | sign 8, self-answered question | Cut. Line 8 already gives the answer as a fact.
4. "Less hassle. More greens." | sign 5, contrast pivot | Joined to fix 2: "so getting your greens is easier."
5. "It's about more than vitamins." | sign 1, importance inflation | MISSING: what else it is about. Cut.
6. "Level up your daily routine." | sign 10, familiar word cluster ("level up") | "Take one pack a day."

Not flagged:
- Line 2, "60+ ingredients, 21 vitamins and minerals, and 6 g of fiber": a list of three different real facts.
- Line 8, "Clinically tested for nutrient absorption.": a specific claim, not a vague "studies show". It stays. MISSING: the trial or testing body, if the email needs to back the claim.
- Line 9, "Rip. Tip. Enjoy.": the brand's own published line, and a person would still say it.

Rhythm: fail.
- Lines 6–8 are three sentences in a row at 5 words each ("It's about more than vitamins." / "Level up your daily routine." / "Clinically tested for nutrient absorption.").
- There are fragment runs that aren't labels: "No powders. No pills. No shaker." and "Less hassle. More greens."
- In the rewrite, line 8 becomes a full sentence ("It's clinically tested…") to break the run. This adds no fact.

Rewritten copy:
Sprout packs 60+ ingredients, 21 vitamins and minerals, and 6 g of fiber into one small daily pack of gummies. The gummies replace powders, pills and a shaker, so getting your greens is easier. Take one pack a day. It's clinically tested for nutrient absorption. Rip. Tip. Enjoy.

After: 0 per 100 words (0 hits in 48 words; rhythm pass)

Score: before 100 - (9.2 x 10) - 10 rhythm = -2, stops at 0; after 100 - (0 x 10) = 100
```
