# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A thorough, specific audit that catches the page's real problems (SMS condition, renewal price, first-order-only guarantee, discount mismatch, risky claims) and ranks them sensibly without inventing any figures. The owner gets a shippable quick-win list and clearly labelled gaps, with every proposed copy line drawn from facts on file.

## Judge list

- Met: Every finding quotes or points to a specific place on the page.
  Each row has a Where plus a quote, e.g. rank 1: "Screen 2 (plan box)" / "DISCOUNT AUTO-APPLIED".
- Met: The ranking follows severity first, then position on the page.
  Severity runs 4, then 3s (ranks 2-11), 2s (12-20), 1 (21); within each, screen 1 before screen 2 before lower.
- Met: No money figure or predicted lift appears without analytics.
  "Sample size can't be worked out: MISSING: conversion rate and visits." No lifts or revenue figures given.
- Met: No fix asks for proof, ratings, counts or urgency you don't have.
  Fixes use on-file claims: "vitamin C +40.1%, folate +20.5%"; "Keep '1M+ Customers' only if the brand can back it."
- Met: The advice is about this page.
  "Put both prices inside the Subscribe tile: 'First box $29.99, then $49.99 every 4 weeks'"; sugar-alcohol line under selector.

## What went in

```text
The page: sprout.example/products/sprout, as text top to bottom, with
the notes on what was and wasn't seen (sprout/product-page.md).

Brand file: sprout/brand.md (buyers and their doubts, offers, the
guarantee, claims that are fine and risky).

No ad and no analytics this time. Judge the page on its own.

[attached: sprout/brand.md, sprout/product-page.md]
```

## What came out

```text
## 1. The page's job and verdict

**Job:** a first purchase. The page exists to start a Subscribe & Save order on Sprout Original (Adults).

**Verdict:** The product idea, a greens supplement you'll actually stick to, barely shows. The $29.99 price is buried under conditions buyers find only in the footer and the last FAQ: the SMS sign-up, the $49.99 renewal and the first-order-only guarantee. The price doubter and the subscription-wary buyer get the most reasons to stop.

## 2. Scent

`MISSING: ad to compare.`

The brand file says the Meta ads promise "up to 61% OFF + 4 FREE gifts". This page shows 52% and "up to 55%", and mentions no gifts anywhere. Anyone arriving from those ads will likely see a mismatch. Check this against the actual ad before acting on it.

## 3. Glance (phone first screen, inferred: announcement bar, gallery, title, rating)

- **What is this?** Only partly answered. "Sprout Superfood Gummies" never says greens, daily packs or "no powder, no pills". "Revive whole body vitality" says nothing concrete.
- **Who is it for?** Blank. There is no adult, gut, quitter or parent cue. Adults vs Kids appears only later, in "Find Your Flavor".
- **What do I do next?** Likely blank. The plan box and the "Start Now" button probably sit below the first screen (inferred).
- **What stood out?** A rotating discount bar (52%, free shipping, VIP, new flavour), "4.8/5.0 (100,000)" and "1M+ Customers".

## 4. Skim

A skimmer takes away two lines:
- "Superfood gummies that do a bit of everything (vitality, clarity, immunity, gut), rated 4.8 by 100,000 and used by a million people."
- "It's $29.99 with up to 55% off, free shipping and a 30-day guarantee. Tap Start Now."

The $49.99 renewal, the SMS condition, the first-order-only guarantee and the delivery time all fall out of the skim.

## 5. Findings

| Rank | Read | Where | What the page does now | Fix | Severity 0–4 | Ease | Needs analytics to size? |
|---|---|---|---|---|---|---|---|
| 1 | Doubt | Screen 2 (plan box, inferred) | Shows ~~$66.65~~ **$29.99** with "DISCOUNT AUTO-APPLIED". The footer says the price "assumes customer has received and uses promotional SMS discount". A buyer who skipped the pop-up will meet a different total at checkout. | Pick one of two fixes. (a) Make the price truly auto-applied. (b) Put the condition beside the price, e.g. "$29.99 with text sign-up (new customers)", and remove "DISCOUNT AUTO-APPLIED". | 4 | High | No |
| 2 | Glance / Skim | Screen 1 (bar) and screen 2 (badge) | Four discounts on one visit: bar "Save 52%", badge "GET UP TO 55% OFF", pop-up "Sign Up for 55% Off", and 61% in the ads. | Choose the one discount that is true at checkout. Use the same number in the bar, badge and pop-up. | 3 | High | No |
| 3 | Skim / Doubt | Screen 1 (bar) and screen 2 (plan box) | The bar says "30-DAY GUARANTEE" and the plan box says "30-Day Money-Back Guarantee". The last FAQ says "This policy applies only to your initial purchase." | Change both to "30-day money-back guarantee on your first order". | 3 | High | No |
| 4 | Doubt | Screen 1 (bar) and lower (birthday section) | The bar says "✨ Limited Time Sale ✨". The birthday section says the $29.99 price holds "Not just for a week but indefinitely." That is urgency without an end date. | Drop "Limited Time" from the bar. Keep the honest message: "New lower price: subscriptions start at $29.99." Add the SMS condition from rank 1. | 3 | High | No |
| 5 | Skim / Doubt | Screen 1 (under title) and bottom | The header says "4.8/5.0 (100,000)". The review widget says 4.75 from 109,639. The brand file adds 4.74 from 118,002 on the reviews page and 4.0 from 2,411 on a public site. "1M+ Customers" has no source on file. | Show the live widget figure with its source, e.g. "4.75 from 109,639 reviews on sprout.example". Keep "1M+ Customers" only if the brand can back it. | 3 | High | No |
| 6 | Glance / Doubt | Screen 1 (subline, bullets inferred near top) | Says "60+ potent ingredients to revive whole body vitality", "Promotes mental clarity + energy" and "Supports immunity + stress relief". The study measured only blood vitamin C and folate. | Replace with claims on file: "60+ ingredients, 21 vitamins & minerals and 6 g fiber in 1 pack", "Supports digestion and gut health", and "Clinically tested for nutrient absorption: vitamin C +40.1%, folate +20.5% (2025, 12-week placebo-controlled study, 120 adults)". | 3 | High | No |
| 7 | Glance | Screen 1 (title area) | Nothing says greens, the daily tear-open pack, or the core idea that it replaces powders and pills you quit. No audience cue. | Add a subline from label facts, e.g. "Your daily greens in one tear-open pack. No water, no shaker, no pills." Optionally add "For adults" with a link to Kids. | 3 | Med | Yes |
| 8 | Skim / Doubt | Screen 2 (plan box) | Shows "$1.07/day" large. The $49.99 ($1.78/day) renewal appears only in small text under the button. "Free Shipping Today" does not say whether renewals ship free. | Put both prices inside the Subscribe tile: "First box $29.99, then $49.99 every 4 weeks ($1.78/day)". State renewal shipping. `MISSING: renewal shipping terms.` | 3 | High | No |
| 9 | Doubt | Screen 2 (sugar selector) | Offers "Low Sugar / Sugar-Free" with no visible note on sugar alcohols (panel not captured, inferred). The gut-fix buyer, about 25% and the strongest feelings, asks "Will the sugar-free one cause problems?" | Add one line under the selector: "Sugar-Free is sweetened with sugar alcohols, which can upset sensitive stomachs. Gut-sensitive? Start with Low Sugar." Show the price difference at the selector. | 3 | High | No |
| 10 | Doubt | Screen 2 (One Time tile) | One-time purchase says "No Free Shipping" but never gives the shipping cost. The buyer most afraid of subscriptions can't work out their total. | State the one-time shipping cost in the tile. Drop "No First Order Discount" as a selling line. `MISSING: one-time shipping cost.` | 3 | Med | No |
| 11 | Doubt | Screen 2 (plan box) | "Pause Or Cancel Any Time. Cancel anytime." gives no method. The brand file calls cancelling the loudest public complaint. | State the real method, e.g. where in the account it's done. Don't promise ease beyond what the site already supports. `MISSING: cancellation method.` | 3 | Med | No |
| 12 | Skim | Screen 2 (button, likely below first screen) | The button says "Start Now", which doesn't say what the buyer gets. | Change it to "Start my subscription" or "Get my first box", matching the selected plan. | 2 | High | Yes |
| 13 | Doubt | Screen 2 (flavour tile) | The "Brand New" tie-in tile doesn't say the subscription reverts to Original after one box. That appears only in the FAQ. It also costs more ($32.79 first order per the brand file). | Add to the tile: "Limited: 1 box, then your subscription switches back to Original." | 2 | High | No |
| 14 | Doubt | Screen 2 (under button) | Says "Less than 1% of customers use our Money-Back Guarantee". This is brand-reported and unverified, and can read as "the guarantee is hard to use". | Cut it. Use the space for the delivery line (rank 17). | 2 | High | No |
| 15 | Doubt | Screen 2 (Directions accordion, closed) | The serving is only "a small handful of green gummy bears". The ~20 g pack size is not on this page and sugar grams are not shown. | Show near the selector: "1 pack a day (~20 g), 28 packs = 28 days", plus sugar grams for each option. `MISSING: sugar grams.` | 2 | Med | No |
| 16 | Doubt | Overlay (timing not captured) | The "Sign Up for 55% Off" pop-up is the gate to the advertised price, and it may cover the first screen. | Move the SMS sign-up into the plan box next to the price it unlocks, or delay the pop-up. | 2 | Med | Yes |
| 17 | Skim / Doubt | Lower (FAQ) | Delivery ("ship within 24 hours ... arrive 3-5 days later") appears only in the FAQ. | Put it under the button: "Ships within 24 hours, usually arrives in 3–5 days." | 2 | High | No |
| 18 | Doubt | Lower ("Modern Living" section) | Reads "[number missing] of U.S. adults don't meet..." and the footnotes say only "Source". | Fill in the number with a named source, or cut the stat. Name the source of the 61% stat too. | 2 | High | No |
| 19 | Doubt | Lower ("Us vs. Them") | Shows Sprout at $1.26 per serving, a figure that matches no price on the page ($1.07, $1.78, $2.38). The third column is "~$35" with no label. | Recompute from current real prices. Date and name the competitor price. Label the third column, or cut the section. | 2 | Med | No |
| 20 | Skim | Lower (reviews at very bottom) | The best proof, powder quitters and gut stories, is far from the button. Survey stats sit mid-page. | Move 2–3 real review cards (habit, vs powders, gut) and "of surveyed users" stats beside the plan box. | 2 | Med | Yes |
| 21 | Doubt | Lower (Ingredients accordion) | Says "over 20 vitamins & minerals", while elsewhere it is 21. | Use "21" everywhere. | 1 | High | No |

**Phone basics:**
- `MISSING: speed.`
- `MISSING: text size and button reach on phone.` The first-screen layout is inferred.

## 6. Quick wins this week

1. **State the SMS condition** next to $29.99, or make the price truly auto-applied (rank 1).
2. **Use one discount number** across the bar, badge and pop-up, and drop "Limited Time Sale" (ranks 2 and 4).
3. **Put "first order"** into every guarantee line (rank 3).
4. **Show the rating with its source** ("4.75 from 109,639 reviews on sprout.example"), and swap the vitality, clarity and immunity claims for the on-file claims (ranks 5 and 6).
5. **Put "then $49.99 every 4 weeks ($1.78/day)"** inside the Subscribe tile. Add the Sugar-Free sugar-alcohol line under the selector (ranks 8 and 9).

## 7. Tests

Sample size can't be worked out: `MISSING: conversion rate and visits.` For each test, size the sample from the current conversion rate and the smallest lift worth detecting. If the page can't reach that sample in about a month, ship the change and watch revenue per visitor instead.

1. **First-screen angle.** Hypothesis: a habit and powder-quitter subline ("The one supplement people stick with. No powder, no pills.") starts more subscriptions than a numbers-led subline ("21 vitamins & minerals, 6 g fiber, 1 pack a day"). Both versions must use on-file claims only. The current "revive vitality" line goes regardless.
2. **Proof beside the button.** Hypothesis: 2–3 real review cards (habit, vs powders, gut) next to the plan box raise conversion over reviews at the bottom.
3. **Inline SMS sign-up.** Hypothesis: putting the text sign-up inside the plan box next to $29.99 raises completed first orders over the pop-up. Track subscription cancellations as well.

## 8. What the page can't tell us

**Page and traffic data:**
- The ad the buyer clicked, and whether the "4 free gifts" exist on this path.
- The phone first-screen layout, phone share of traffic, speed, conversion by step, and phone vs desktop.

**Missing terms:**
- Sugar grams and the Low Sugar vs Sugar-Free panel.
- Shipping cost on one-time orders and on renewals.
- The real cancellation method.
- Whether the $66.65 one-time price is the price buyers actually pay. It is used as the "was" price.
- The source of "1M+ Customers" and of the 4.8/100,000 header rating.

**Checkout:** steps, guest checkout, express pay, and whether anything (gifts, add-ons, a second adult) is pre-ticked.

**Kids page:** what "Renews at $74.98 each 4 weeks" under a $22.49 price covers (probably 2 kids, unconfirmed).
```
