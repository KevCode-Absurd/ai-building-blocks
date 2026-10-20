# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, accurate scan: the word count, hit count, per-100 rate and before score (13) are all correct, every quote is exact, and all fixes are safe cuts that add nothing. The owner gets a clean, short rewrite plus a clear list of gaps to fill, though the heavy cutting leaves the email thin.

## Judge list

- Met: Every hit is quoted exactly as it appears in your copy.
  "Whether you're a busy parent or a gym regular, your nutrition matters." and the other four match the input word for word.
- Met: No fix adds a fact, claim or number that wasn't in the copy.
  All five fixes are cuts; the rewrite only adds "It's" to line 8.
- Met: The rewrite keeps your meaning and order.
  Rewrite keeps lines 2, 7, 8, 9 in order; cuts are justified under the rule 'another line already says it'.
- Met: A fixed sign hasn't turned into another, such as a negation run becoming a triple.
  Every fix is a deletion, so no new shapes appear; "AFTER: 0 per 100 words".
- Met: Read the rewrite aloud. It should sound plainer, not cleverer.
  "Sprout packs 60+ ingredients... It's clinically tested for nutrient absorption. Rip. Tip. Enjoy." is plainer than the original.

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
HITS: 5 in 65 words (7.7 per 100)
1. "Whether you're a busy parent or a gym regular, your nutrition matters."
   Sign: 9, stock opener
   Fix:  Cut the line. The email then opens on line 2, which is the fact.
2. "No powders. No pills. No shaker."
   Sign: 6, negation run
   Fix:  Cut. Line 2 already says once what the buyer gets: "one small daily pack of gummies."
3. "Does it actually work? Absolutely."
   Sign: 8, self-answered question
   Fix:  Cut. Line 8 already gives the copy's only evidence. MISSING: what result "work" refers to.
4. "Less hassle. More greens."
   Sign: 5, contrast pivot
   Fix:  Cut. The copy names no greens and gives no reason for "less hassle." MISSING: which greens are in it, and what hassle it removes.
5. "It's about more than vitamins."
   Sign: 1, importance inflation
   Fix:  Cut. Line 2 already says it: 60+ ingredients and 6 g of fiber alongside the vitamins.

NOT FLAGGED
- "60+ ingredients, 21 vitamins and minerals, and 6 g of fiber" is a list of three different real facts.
- "Level up your daily routine." "Level up" is the only cluster word in the copy, and one alone is just a word. It stays.
- "Clinically tested for nutrient absorption." This is a specific product claim, not "studies show." It stays. MISSING: who ran the test, so it can be named or checked.
- "Rip. Tip. Enjoy." This is the brand's own published line, and it reads as a person would say it.

RHYTHM: fail. There is a fragment run in "No powders. No pills. No shaker." and another in "Less hassle. More greens." Lines 6–8 are also three sentences in a row at 5 words each. In the rewrite, line 8 becomes a full sentence. "Rip. Tip. Enjoy." still makes a fragment run, but it is kept as the brand's line.

REWRITTEN COPY
Sprout packs 60+ ingredients, 21 vitamins and minerals, and 6 g of fiber into one small daily pack of gummies.
Level up your daily routine.
It's clinically tested for nutrient absorption.
Rip. Tip. Enjoy.

AFTER: 0 per 100 words

SCORE
Before: 100 - (7.7 x 10) - 10 = 13
After: 100 - (0 x 10) - 10 = 90 (the rhythm still fails on the kept brand line "Rip. Tip. Enjoy.")

Gaps to fill later: who ran the clinical test, what "work" means, which greens are in it.

Want to plan what to test next with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Bring this audit report. Or type your own next step.
```
