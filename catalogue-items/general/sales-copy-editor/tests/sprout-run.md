# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest edit: it put the renewal price and first-order condition beside the $29.99, backed the test claim with real numbers, and flagged the probiotics, 61% and $5-per-person lines for a claims check instead of quietly fixing them. Word counts and arithmetic check out, nothing is invented, and the owner gets a clear warning that the ad shouldn't run until those claims are cleared.

## Judge list

- Met: You can point to the one sentence that says what the buyer gets.
  Promise: "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals..."
- Met: No claim, number, price, guarantee wording, name or quote was reworded.
  Every number and term survives; "$29.99 for your first order" became "Your first order is $29.99" (sentence split, price and term intact).
- Met: Every new fact in a fix is in the facts, and every ledger row names a gain.
  Added $49.99 every 4 weeks, text sign-up, 70 pesticides, 4 heavy metals, 24 hours, 30-day first-order guarantee: all in the input facts; each row ends with a gain.
- Met: Most lines were left as they were, with a reason.
  Left as is: "$20 off your first order", the quoted objection, the emoji, "Online-exclusive offer", "+$5 off"; headline untouched.
- Met: If it's an ad, the ask says what to do, what it costs and what happens if they don't like it.
  "Shop Sprout. Orders usually ship within 24 hours, and your first order comes with a 30-day money-back guarantee"; price and renewal sit directly above.

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
Locked: Headline quote "Sprout is too expensive"; "61% off"; "first order... a lot more affordable"; "$29.99 for your first order"; "less than $1.10/day"; "60+ whole-food ingredients"; "21 vitamins & minerals"; "gut-supporting probiotics"; "one daily gummy pack"; "$20 off your first order"; "+$5 off for every extra person"; "Third-party tested"; "Online-exclusive offer"; "Shop Sprout". The argument runs in this order: the objection, then the deal, then the price per day, then what's in the pack, then the bullets, then the ask.

Specifics protected: $29.99, $1.10/day, 60+, 21, $20 off, +$5, third-party tested, the quoted objection. Added from the facts: $49.99 every 4 weeks, pause or cancel, 70 pesticides, 4 heavy metals, 24-hour shipping, 30-day first-order guarantee.

Measures: 65 words, about grade 7 (estimated; the bullet fragments pull it down), longest sentence 25 words -> 112 words, about grade 6 (estimated), longest sentence 20 words. The added words are the missing terms.

Promise: "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack." Three deals are stacked on it: 61% off, $20 off and $5 per person.

Ledger:
- Main text | ad / slide | "Big news: your first order of Sprout just got a lot more affordable." | "Your first order of Sprout just got a lot more affordable." | 2 fewer words. The first words before "See more" now speak to the price doubter, and an empty opener is removed.
- Main text | slide | "$29.99 for your first order, that's less than $1.10/day for…" | "Your first order is $29.99. That's less than $1.10/day for…" (rest of the sentence unchanged) | The longest sentence drops from 25 to 20 words, a lower grade.
- Main text, after the price | doubt | (none) | "This price is for new customers with the text sign-up discount. After that, it's $49.99 every 4 weeks, and you can pause or cancel any time." | Terms in full. The price condition and renewal now sit beside the first price, which answers the buyer's "will it jump?" doubt.
- Bullet | doubt (prove it / swap it) | "✅ Third-party tested." | "✅ Third-party tested for 70 pesticides and 4 heavy metals" | A claim backed by a supplied fact that a rival can't copy as is.
- Ask | ad / skim | "Shop Sprout." | "Shop Sprout. Orders usually ship within 24 hours, and your first order comes with a 30-day money-back guarantee." | The ask now names what happens next. The guarantee and who it covers appear where the buyer decides.

Not fixed (over the limit): None over the limit. Two things were held back because of locked claims:
- The headline's "to prove otherwise" is a stop, since a discount doesn't prove the price isn't too high. The headline is also the discount-only lead. Fixing either needs the basis of the 61%.
- The ad stacks three deals. Which one stays is a claims decision first.

Left as is:
- "✅ $20 off your first order": this matches $49.99 less $29.99.
- The quoted objection: it picks out the buyer by their situation.
- The 💚 emoji: there was no gain from removing it.
- "Online-exclusive offer" and "+$5 off for every extra person": these are locked and flagged below.

For a claims check:
- "61% off": the site shows 52% and 55%, and $29.99 against the $66.65 one-time price is about 55%.
- "gut-supporting probiotics": the ingredient list shows no probiotics. The facts do support "6 g prebiotic fiber".
- "whole-food": the facts say "60+ ingredients" only.
- "gummy": the facts say "pack" only.
- "+$5 off for every extra person": the facts say "Buy 2, save $5".
- "Online-exclusive offer": this is not in the facts.
- "less than $1.10/day": this holds for the first box only, at about $1.07 a day if the box holds 28 packs. At $49.99 it is about $1.79 a day.

MISSING:
- The ad image, so the picture check couldn't run.
- What the 61% is measured against.
- The packs per box.
- A fact behind "whole-food".

Verdict: Mostly a wording and missing-terms problem, and the reason to buy is sound: a daily pack at about a dollar a day. However, three of its supports (61%, probiotics, $5 per person) go against or beyond the facts. A claims check must clear them before this runs.

Score: before 2/10 = 20, after 4/10 = 40 | Still failed:
- (1) One clear promise: three deals are still stacked on one promise.
- (2) Promise on a skim: the 61%, $29.99 and $20 off figures compete.
- (4) No stop in the headline or first block: "to prove otherwise" stays in the headline.
- (5) Every praise word backed by a fact: "whole-food" and "gut-supporting" are unbacked.
- (8) Image words agree with the picture: not run, because there was no image.
- (10) A discount is never the whole message: the headline is a discount alone.
```
