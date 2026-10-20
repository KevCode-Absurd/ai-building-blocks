# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Four clean, sourced bullets that keep the absorption claim to the two measured vitamins, state the guarantee's first-order limit, and refuse to fake a price comparison. The owner gets a usable list plus an honest gap list, though the worth-it question is left for them to fill and the $1.79/day differs slightly from the page's own $1.78.

## Judge list

- Met: Every number and claim traces to a fact you gave it. Check two.
  "80% of the 3,000+ customers surveyed after 3 months" and "blood vitamin C rose 40.1% and folate rose 20.5%" both match the input and product page.
- Met: No point is a bare feature. Each says what the buyer gets or what it does.
  "with no water, no mixing and no shaker to wash"; point 1 ties contents to the absorption result.
- Met: Each point answers a question your buyers really ask.
  Point 1 answers "A gummy can't hold enough"; points 2 to 3 answer the want for "one habit that lasts"; 4 is risk.
- Met: No two points make the same argument.
  Point 3 is tagged "Proof for point 2" (routine vs. people sticking with it), which the skill allows.
- Met: Gaps sit in "needs evidence" or "unanswered", not in the points.
  "MISSING: evidence for 'Promotes mental clarity + energy' (no source). Cut from the bullets."

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
```
POINTS
1. One daily pack holds 21 vitamins and minerals plus 6 g of prebiotic fiber, and in a 12-week study of 120 adults, blood vitamin C rose 40.1% and folate rose 20.5%.
   (Will it work? | effect, absorption shown for vitamin C and folate only |
   product page: 60+ ingredients, 21 vitamins & minerals, 6 g prebiotic fiber per pack; science page: 2025 study, 12 weeks, 120 adults, vitamin C +40.1%, folate +20.5%; approved line "Clinically tested for nutrient absorption")
2. You tear open one pack a day and eat the gummies straight from it, with no water, no mixing and no shaker to wash.
   (Is it easy? | effect |
   product page: 1 pack a day, torn across the top, eaten from the pack, no water, no mixing, no shaker)
3. It's a habit people keep: 80% of the 3,000+ customers surveyed after 3 months take it every day.
   (Is it easy? Proof for point 2 | effect |
   product page: survey of 3,000+ customers after 3 months, 80% daily)
4. If it's not for you, your first order is covered by a 30-day money-back guarantee.
   (What if it's not for me? | fact |
   FAQ: "a simple 30-day guarantee on your first order ... This policy applies only to your initial purchase.")
(first question first, risk last)

NEEDS EVIDENCE
MISSING: evidence for "Promotes mental clarity + energy" (no source). Cut from the bullets.
MISSING: evidence for "Supports immunity + stress relief" (no source). Cut from the bullets.
MISSING: evidence that the absorption result covers more than vitamin C and folate. The study measured only those 2, so no wider absorption payoff is written.
MISSING: evidence that one pack matches or replaces a greens powder serving (no side-by-side amounts). This is the payoff the buyer's first doubt asks for.
MISSING: a source for the "Us vs. Them" cost per serving (Sprout $1.26, greens powders $3.60). The $1.26 also doesn't match the page's $1.07 or $1.78 a day, so it isn't used.
MISSING: one confirmed vitamin and mineral count. The facts say 21, the ingredients panel says "over 20".
MISSING: evidence for the payoff "a habit that lasts" beyond the 3-month survey point.
MISSING: evidence that the Sugar-Free option is easy on the stomach (sugar-alcohol panel not captured, [inferred]).

UNANSWERED
"A gummy can't hold enough to replace my powder." The facts give Sprout's contents but no comparison with a powder, so they can't answer it head-on.
"They are expensive." The renewal price is $49.99 for 28 packs, about $1.79 a day. The $29.99 first box needs the promotional text sign-up. With no sourced powder price, no honest "cheaper than your powder" point can be written, so no worth-it bullet was used.
What happens after the first order if I want my money back? The guarantee covers the first order only.

CHECKS MISSED
none
```
```
