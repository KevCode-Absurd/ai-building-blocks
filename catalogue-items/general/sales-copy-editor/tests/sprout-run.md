# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful edit that answers the buyer's real doubt (the price jump) using only supplied facts, states the first-order condition and the guarantee's limit, and keeps every locked term intact. It correctly refuses to fix the 61% and probiotics problems itself, routes them to a claims check, and tells the owner the ad's deeper problem is leading with four stacked discounts instead of a reason to buy.

## Judge list

- Met: You can point to the one sentence that says what the buyer gets.
  Promise: "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals..."
- Met: No claim, number, price, guarantee wording, name or quote was reworded.
  All locked items ($29.99, $1.10/day, 61%, $20 off, +$5, "Third-party tested", "Online-exclusive offer") survive; only conditions and facts were added.
- Met: Every new fact in a fix is in the facts, and every ledger row names a gain.
  Added text sign-up condition, $49.99 renewal, test counts, 24-hour shipping, first-order guarantee: all in run input facts; each row ends with a gain.
- Met: Most lines were left as they were, with a reason.
  Left as is lists headline, affordability line, $20 off, ingredient list, exclusivity, "Shop Sprout" with reasons; 5 edits total.
- Met: If an ad, the ask says what to do, what it costs and what happens if they don't like it.
  "Shop Sprout. Orders usually ship within 24 hours, and you get a 30-day money-back guarantee, first order only." with $29.99/$49.99 stated just above.

## What went in

```text
Draft (Facebook ad, two live Sprout lines put together for this run):
Headline: "Sprout is too expensive": here's 61% off to prove otherwise
Main text: Big news: your first order of Sprout just got a lot more
affordable. 💚 $29.99 for your first order, that's less than
$1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals,
and gut-supporting probiotics in one daily gummy pack. ✅ $20 off
your first order ✅ +$5 off for every extra person ✅ Third-party
tested. Online-exclusive offer. Shop Sprout.

Facts:
- 1 pack a day: 60+ ingredients, 21 vitamins & minerals, 6 g
  prebiotic fiber. The ingredient list shows no probiotics.
- $29.99 first box needs the text sign-up discount, new customers
  only. Then $49.99 every 4 weeks. Pause or cancel any time.
- One-time price $66.65. Buy 2, save $5.
- Third-party tested for 70 pesticides, 4 heavy metals, 16
  contaminants, 9 microbial contaminants.
- Orders usually ship within 24 hours.
- 30-day money-back guarantee, first order only.
- The site shows 52% and 55% off. Ads say 61%.
Buyer: knows Sprout, thinks it costs too much. Doubt: "Will the
price jump after the first order?"
```

## What came out

```text
Locked: quoted objection "Sprout is too expensive"; "61% off"; "$29.99 for your first order"; "less than $1.10/day"; "60+ whole-food ingredients"; "21 vitamins & minerals"; "gut-supporting probiotics"; "one daily gummy pack"; "$20 off your first order"; "+$5 off for every extra person"; "Third-party tested"; "Online-exclusive offer"; product name Sprout. Argument order: objection → discount → first-order price → per-day cost → what's in the pack → offer list → testing → exclusivity → ask.

Specifics protected: $29.99; $1.10/day; 60+ ingredients; 21 vitamins & minerals; one pack a day; $20 off; +$5 off; third-party tested.
Added from the facts: $49.99 every 4 weeks; 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants; ships within 24 hours; 30-day money-back guarantee.

Measures: 65 words, grade about 7, longest sentence 25 words -> 111 words, grade about 8, longest sentence 20 words. The grade stays within the ad target of 8. The added words are the full terms.

Promise: "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack."

Ledger:
- Main text, opening | slide | "Big news: your first order of Sprout just got a lot more affordable. 💚" | "Your first order of Sprout just got a lot more affordable. 💚" | Fewer words. Removes a stop before the promise in the text seen before "See more".
- Main text, price | doubt | "$29.99 for your first order, that's less than $1.10/day for…" | "$29.99 for your first order with the text sign-up discount, new customers only. That's less than $1.10/day for…" | States the first-order condition in full. Splits a two-idea sentence, so the longest sentence is shorter.
- Main text, after the per-day line | doubt | (none) | "After that, it's $49.99 every 4 weeks. Pause or cancel any time." | States the renewal price beside the first price. This answers the buyer's main doubt and removes a stop.
- Main text, checklist | doubt (prove it) | "✅ Third-party tested." | "✅ Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants." | Backs the claim with a supplied fact. A rival can't run this line unchanged.
- Main text, ask | ad | "Shop Sprout." | "Shop Sprout. Orders usually ship within 24 hours, and you get a 30-day money-back guarantee, first order only." | The ask now says what happens next and gives the guarantee as written, including who it covers.

Not fixed (over the limit): none.

Left as is:
- Headline. Its first words name the buyer's own doubt. "61%" is locked and goes to the claims check.
- "Your first order of Sprout just got a lot more affordable." It is plain and true, and it leads into the price.
- "$20 off your first order." It is a locked offer term and matches $49.99 − $29.99.
- "60+ whole-food ingredients, 21 vitamins & minerals…" This is a list of different facts. Each one is a specific.
- "Online-exclusive offer." It is locked and goes to the claims check.
- "Shop Sprout." It names the action.

For a claims check:
- "61% off": the site shows 52% and 55%. $29.99 against the $66.65 one-time price is about 55%.
- "gut-supporting probiotics": the ingredient list shows no probiotics. The facts give 6 g prebiotic fiber.
- "+$5 off for every extra person": the facts say "Buy 2, save $5" on the one-time price, not $5 per person.
- "whole-food": the facts say only "60+ ingredients".
- "gummy": the format is not in the facts.
- "Online-exclusive offer": not in the facts.
- "less than $1.10/day": this holds only for the first box, and only if a box is 28 packs ($29.99 ÷ 28 ≈ $1.07). At the renewal price it is about $1.79/day.

MISSING:
- Packs per 4-week box, to confirm $1.10/day.
- What "+$5 off for every extra person" refers to.
- Whether the offer is really online-only.
- The pack format (gummy).
- The source of the 61% figure.

Verdict: The wording problem is fixed. The buyer's doubt about the price jump went unanswered, and the ad now answers it. The larger problem is a weak reason to buy that no edit can fix. The ad stacks four deals (61%, $29.99, $20 off, +$5) and leads with a discount instead of a reason. Two locked claims (61% and probiotics) go against the facts. Settle those in a claims check, then rebuild the ad to lead with what the pack does, with the deal in the ask.
```
