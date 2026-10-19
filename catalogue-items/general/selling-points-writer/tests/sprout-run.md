# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

The list is honest and well-sourced: every number checks out, the risky bullets are cut, the renewal price is stated plainly, and the gaps are flagged clearly. But the lead bullet is still a bare ingredient count, which the run admits and scores against itself, so the owner gets three usable bullets and one to rewrite.

## Fix

In step 5 add: a point that cannot climb past the fact rung must still say what that fact means for this buyer (or be merged into the point it proves); never hand back a point that only lists contents.

## Judge list

- Met: Every number and claim traces to a fact you gave it. Check two.
  "blood vitamin C rose 40.1% and folate rose 20.5%" and "renews at $49.99 for 28 packs, which is under $1.79 a day" ($49.99/28 = $1.785).
- Not met: No point is a bare feature. Each says what the buyer gets or what it does.
  "A small handful of gummies still carries 21 vitamins and minerals plus 6 g of prebiotic fiber" states contents only; the run itself admits it "stays at the fact rung".
- Met: Each point answers a question your buyers really ask.
  Points 1-2 answer "a gummy can't hold enough", point 3 the habit want, point 4 "they are expensive".
- Met: No two points make the same argument.
  Point 2 is labelled "proof for point 1" (allowed); points 3 and 4 argue habit and price separately.
- Met: Gaps sit in "needs evidence" or "unanswered", not in the points.
  "MISSING: evidence for payoff on point 1, 'enough to replace your powder'"; "UNANSWERED: Is it worth it compared with my powder?"

## What went in

```text
Features and facts:
- 60+ ingredients, 21 vitamins & minerals, 6 g prebiotic fiber per
  pack, in a small handful of gummies (product page)
- 1 pack a day, torn across the top, eaten from the pack. No water,
  no mixing, no shaker. (product page)
- 2025 study, 12 weeks, 120 adults: blood vitamin C +40.1%, folate
  +20.5%. Approved: "Clinically tested for nutrient absorption"
  (science page)
- 80% of surveyed users take it daily, survey of 3,000+ customers
  (product page)
- 30-day money-back guarantee, first order only (FAQ)
- Current bullets also say "Promotes mental clarity + energy" and
  "Supports immunity + stress relief" (no source)
Buyer: people who quit greens powders. Want: one habit that lasts.
Doubts: "A gummy can't hold enough to replace my powder." / "They
are expensive."
Where: 4 bullets under the product title, one sentence each
Competitors all say: "science-first", long ingredient lists

[attached: sprout/product-page.md]
```

## What came out

```text
1. A small handful of gummies still carries 21 vitamins and minerals plus 6 g of prebiotic fiber in every pack. *(Will it work? · Rung: fact · Source: product page, "60+ ingredients, 21 vitamins & minerals, 6 g prebiotic fiber per pack, in a small handful of gummies")*
2. It's clinically tested for nutrient absorption: in a 2025 study of 120 adults over 12 weeks, blood vitamin C rose 40.1% and folate rose 20.5%. *(Will it work? This is proof for point 1 · Rung: effect, for vitamin C and folate only · Source: science page, 2025 study, approved line "Clinically tested for nutrient absorption")*
3. It's a greens habit people keep: you tear open a pack and eat it, with no water, mixing or shaker, and 80% of 3,000+ surveyed customers take it every day. *(Why this one? · Rung: payoff · Source: product page directions, "no water, no mixing, no shaker"; product page customer survey, 80% daily)*
4. After the first box, your subscription renews at $49.99 for 28 packs, which is under $1.79 a day. *(Is it worth it? · Rung: fact · Source: product page, "Renews at $49.99 each 4 weeks", 28 packs per pouch)*

**Needs evidence**
- MISSING: evidence for payoff on point 1, "enough to replace your powder." The buyer's main doubt calls for a side-by-side of amounts per serving against a typical greens powder. There is no % Daily Value or amount per nutrient.
- MISSING: evidence for effect on point 1. Confirm the count on the label: the page says "21 vitamins" in one place and "over 20" in the ingredients panel. The 6 g of prebiotic fiber does not appear in the captured page text either.
- MISSING: evidence for effect beyond point 2. The study measured only vitamin C and folate in the blood. It does not say whether there was a control group, who sponsored it, or which recipe was tested (Low Sugar or Sugar-Free).
- MISSING: evidence for "Promotes mental clarity + energy." There is no source. The survey's "52% feel more energized" is self-reported. Cut this bullet.
- MISSING: evidence for "Supports immunity + stress relief." There is no source. Cut this bullet.
- MISSING: evidence for payoff on point 4, "cheaper than my powder." The Us vs. Them figure of $3.60 per serving for greens powders has no source. Its Sprout figure of $1.26 per serving matches neither $1.07/day (first box) nor $1.78/day (renewal).
- MISSING: evidence for "replaces handfuls of health products" (Why Sprout? accordion).
- Point 3 rests on a brand-run, self-reported survey. Say so wherever it is cited.
- Not used, but this buyer will meet it: the $1.07/day price applies only after the SMS sign-up and only to the first box. Do not lead with it.

**Unanswered**
- UNANSWERED: Is it worth it compared with my powder? The facts give Sprout's price per day but no sourced price for a powder.
- UNANSWERED: What if it's not for me? The buyer didn't raise it and the four bullets ran out. If it is added, word it as the store does: "a simple 30-day guarantee on your first order ... This policy applies only to your initial purchase."

**Score: 2 / 3 = 67**
- Missed: "No point is a bare feature." Point 1 stays at the fact rung because nothing supplied shows what 21 nutrients and 6 g of fiber do against a powder. It cannot climb further without invented evidence.
```
