# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Four honest bullets that stay inside the approved facts, show the renewal price rather than the SMS-only teaser, and cut the unsourced clarity and immunity claims. The needs-evidence list is genuinely useful, though points 3 and 4 run long for bullets under a product title and point 1 stays at the fact rung.

## Judge list

- Met: Every number and claim traces to a fact you gave it. Check two.
  "blood vitamin C rose 40.1% and folate rose 20.5%" (input); "$49.99 ÷ 28 = $1.785" (product page renewal line, arithmetic shown).
- Met: No point is a bare feature. Each says what the buyer gets or what it does.
  "It's a habit that's easy to keep: tear open one pack a day..."; point 1 is fact-rung but framed against the 'can't hold enough' doubt.
- Met: Each point answers a question your buyers really ask.
  Points 1-2 answer 'can't hold enough', point 3 'one habit that lasts', point 4 'They are expensive'.
- Met: No two points make the same argument.
  Point 2 is explicitly "proof of point 1", the one allowed second point; 3 and 4 answer different questions.
- Met: Gaps sit in 'needs evidence' or 'unanswered', not in the points.
  "MISSING: evidence for the payoff 'enough to replace your powder'"; mental clarity and immunity bullets "are cut".

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
1. A small handful of gummies still carries 6 g of prebiotic fiber and 21 vitamins and minerals in every daily pack. *(Will it work? Fact. Source: product page, "6 g prebiotic fiber per pack", "21 vitamins & minerals", "small handful of gummies.")*

2. It's clinically tested for nutrient absorption: in a 12-week study of 120 adults, blood vitamin C rose 40.1% and folate rose 20.5%. *(Will it work? This is proof of point 1. Effect, for vitamin C and folate only. Source: science page, 2025 study, and the approved line "Clinically tested for nutrient absorption.")*

3. It's a habit that's easy to keep: tear open one pack a day and eat the gummies, with no water, no mixing and no shaker to wash, and 80% of 3,000+ surveyed customers take it daily. *(Is it easy? Effect: the routine is supported. The payoff "a habit that lasts" is only partly supported, by self-reported survey data. Source: product page directions, and the product page survey of 3,000+ customers at 3 months.)*

4. After any first-order discount, a subscription is $49.99 for 28 packs every 4 weeks, which is under $1.80 a day. *(Is it worth it? Fact. Source: product page, "Renews at $49.99 each 4 weeks", "28 packs." $49.99 ÷ 28 = $1.785.)*

**Needs evidence**
- MISSING: evidence for the payoff "enough to replace your powder". There are no per-nutrient amounts set against a typical greens powder.
- MISSING: evidence for the effect of the 6 g fiber on digestion. The page's 67% "better, more regular digestion" is a self-reported customer survey, not a test. The 61% stat is about Americans in general, not this product, and its footnote only says "Source".
- MISSING: evidence for absorption of anything beyond vitamin C and folate. The study measured only those two.
- MISSING: evidence for "Promotes mental clarity + energy" and "Supports immunity + stress relief". No source was given, so both are cut. The 52% "feel more energized" figure is self-reported.
- Vitamin count: "21 vitamins & minerals" here, "over 20" in the ingredients panel. Confirm against the label before using 21.
- Survey method for point 3: who was asked, and whether only customers still subscribed at 3 months were counted. If so, 80% overstates how many people keep the habit.
- MISSING: evidence for a cost comparison with powders. The "Us vs. Them" figures ($1.26 vs $3.60) have no source, and $1.26 matches neither plan price ($1.07 first box, ~$1.78 renewal).
- First-box price: $29.99 ($1.07/day) depends on the SMS sign-up, per the footer only. Keep it out of the bullets until the offer is stated plainly.

**Unanswered**
- UNANSWERED: "They are expensive". Point 4 gives an honest daily price, but nothing supplied shows Sprout costs less than a powder or what it replaces.
- "What if it's not for me?" was not raised by this buyer and was left out for space. If it's added, word it exactly: 30-day money-back guarantee, first order only.
```
