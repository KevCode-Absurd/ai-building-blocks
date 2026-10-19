# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The scan is accurate: quotes are exact, both word counts (65 and 55) check out, the rhythm run (lines 6 to 8 at five words each) is real, and the rewrite is plainer without adding any claim. The owner gets a usable email intro that drops the unsupported "Absolutely" and keeps the brand line and the approved absorption claim.

## Judge list

- Met: Every hit is quoted exactly as it appears in your copy.
  All five quotes match the input word for word, e.g. "No powders. No pills. No shaker." and "Less hassle. More greens."
- Met: No fix adds a fact, claim or number that wasn't in the copy.
  "Because they're gummies, there's no powder, pill or shaker to deal with" uses only line 2 (gummies) and line 3 (no powders/pills/shaker).
- Met: The rewrite keeps your meaning and order.
  Rewrite runs line 2, merged 3+5, 7, 8, 9 in original order; cuts (1, 4, 6) follow the skill's fixes and a MISSING note.
- Met: A fixed sign hasn't turned into another.
  "no powder, pill or shaker" is a short list of three different real things, not three adjectives or lines; no new pivot, question or dash.
- Met: Read the rewrite aloud. It should sound plainer, not cleverer.
  "Sprout is clinically tested for nutrient absorption." replaces "Does it actually work? Absolutely."; plain sentences, no slogans added.

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
Hits: 5 in 65 words (7.7 per 100)
1. "Whether you're a busy parent or a gym regular, your nutrition matters." | sign 9, stock opener | Cut the line and open on line 2, the first sentence with facts.
2. "No powders. No pills. No shaker." | sign 6, negation run | Say once what the buyer gets: "Because they're gummies, there's no powder, pill or shaker to deal with."
3. "Does it actually work? Absolutely." | sign 8, self-answered question | Cut. Line 8 already gives the evidence the copy has. MISSING: proof that it "works" beyond the absorption test.
4. "Less hassle. More greens." | sign 5, contrast pivot | Say Y with the reason, and merge it into fix 2: "...so you get your greens with less hassle."
5. "It's about more than vitamins." | sign 1, importance inflation ("more than") | Cut. Line 2 already lists what Sprout has beyond vitamins (60+ ingredients, 6 g of fiber).

Not flagged:
- "Rip. Tip. Enjoy." This is the brand's own published line, and a person would still say it.
- "60+ ingredients, 21 vitamins and minerals, and 6 g of fiber". These are three different real facts, not a reflex triple.
- "Level up your daily routine." "Level up" is the only cluster word in the copy. One is a word, not a sign. It carries no fact, but cutting it is a brand call.
- "Clinically tested for nutrient absorption." This is a specific claim, not "studies show". It stays. MISSING: who ran the test, if the email should name the source.

Rhythm: fail. Lines 6, 7 and 8 are three sentences in a row at 5 words each. Line 3 ("No powders. No pills. No shaker.") and line 5 ("Less hassle. More greens.") are runs of fragments that aren't labels. Line 9 is the brand line, so it stays.

Rewritten copy:
Sprout packs 60+ ingredients, 21 vitamins and minerals, and 6 g of fiber into one small daily pack of gummies. Because they're gummies, there's no powder, pill or shaker to deal with, so you get your greens with less hassle. Level up your daily routine. Sprout is clinically tested for nutrient absorption.
Rip. Tip. Enjoy.

After: 0 per 100 words (0 in 55 words)
```
