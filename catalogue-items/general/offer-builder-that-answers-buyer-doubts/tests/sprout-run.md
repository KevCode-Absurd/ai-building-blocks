# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Two sound, honest offers that use only Sprout's own prices and terms, correctly condition the $29.99 on text sign-up, state the $49.99 renewal in the same breath, and keep the guarantee's first-order limit visible. Profit maths is handled with MISSING and formulas, illustrative figures are clearly labelled, and the must-arrange lists give the owner a real to-do list to clean up the discount mess.

## Judge list

- Met: Each offer names one buyer and answers a doubt from research, in their words.
  "First-time buyer who knows the brand... 'Which discount is real?' 'Will the price jump after the first order?'" and "'I hate subscriptions because I feel like they are a trap.'"
- Met: Each offer says which lever it pulls, and its tools fit that lever.
  Offer 1 "Lever: Price... One price shown the same way everywhere"; Offer 2 "Lever: Certainty... guarantee... reminder before the first renewal"
- Met: Guarantee quoted exactly; anything longer or wider under must arrange.
  "30-day money-back, 'This policy applies only to your initial purchase.'"; reminder text listed under "Must arrange: Set up the reminder text"
- Met: First-order price states what it becomes in the same sentence; no urgency without a real date or limit.
  "$29.99 for your first 28 packs when you sign up for texts, then $49.99 every 4 weeks"; "Why now: none" in both offers
- Met: Unknown costs shown as MISSING with formula; no treats/cures/prevents claims.
  "MISSING: cost per pouch, delivery cost, payment fees... K1 = 29.99 − (28 × pouch cost) − delivery − fees"; no health claims made

## What went in

```text
Buyer: the price doubter, first-time. Knows the brand, thinks it
costs too much. Doubts: "Which discount is real?" "Will the price
jump after the first order?" "I hate subscriptions because I feel
like they are a trap."

Prices: one-time 28 packs $66.65. Subscription $49.99 every 4
weeks. First order $29.99, only with the text sign-up discount.
Live on the site at once: "Save 52%", "up to 55% off", "49% off",
"58%"; ads say "61% off". "Buy 2 Save $5" for more than one
person on an order.
Terms: "Pause Or Cancel Any Time." Guarantee: 30-day money-back,
"This policy applies only to your initial purchase."
Cost per pouch, delivery cost, fees: not known.
```

## What came out

```text
**No cost data was given, so neither offer moves a price.** Offer 1 is on the price lever but changes only how the existing prices are shown. Offer 2 is on the certainty lever.

---

## Offer 1: One Clear Price

**Buyer:** First-time buyer who knows the brand and thinks it costs too much.
**Doubts:** "Which discount is real?" "Will the price jump after the first order?"
**Lever:** Price. The doubt is about not knowing the real price, not the amount itself.
**Tools:**
1. One price shown the same way everywhere.
2. What the first price becomes, in the same sentence.

**Build**
- **For:** first-time buyers, one person, one subscription.
- **Pay now:** $29.99 for the first 28 packs, with text sign-up.
- **Pay after:** $49.99 every 4 weeks.
- **They get:** 28 packs. Nothing else is promised.
- **What makes yes safe:** the whole price path is in one sentence, with one saving figure measured against one price ($66.65 one-time).
- **Why now:** none.

**Price facts from your numbers** (shown as percents because all are under $100)
- First order: $29.99 against $66.65 is **55% less**. This matches "up to 55% off".
- Subscription: $49.99 against $66.65 is **25% less**.
- Per pack: $2.38 one-time, about $1.79 on subscription, about $1.07 on the first order.
- "52%", "49%", "58%" and "61%" do not match any of these comparisons.

**Page line:** "$29.99 for your first 28 packs when you sign up for texts, then $49.99 every 4 weeks (25% less than $66.65 one-time). Pause Or Cancel Any Time."

**Spoken line:** "It's $29.99 the first time, then $49.99 every four weeks, and you can pause or cancel whenever you like."

**Terms:**
- The first order is $29.99 with text sign-up. Each order after is $49.99 every 4 weeks until paused or cancelled.
- "Pause Or Cancel Any Time."

**Why it answers the doubt:** There is one number to believe and the jump is stated up front, so nothing is hidden for later.

**Profit check**
- **Inputs:** $29.99 first order, $49.99 renewal, 28 packs per order.
- MISSING: cost per pouch, delivery cost, payment fees, refund rate, cost per text sign-up.
- **Formulas:**
  - First order keeps K1 = 29.99 − (28 × pouch cost) − delivery − fees − (refund rate × refund cost) − text cost per sign-up.
  - Each renewal keeps K2 = 49.99 − (28 × pouch cost) − delivery − fees.
  - If K1 is below 0, the renewals needed to break even = −K1 ÷ K2.
- **Effect of this offer:** it changes no price, so K1 and K2 stay the same. Only conversion and cancellation rates move.
- **Illustrative figures only, not your numbers:** with pouch cost $0.50, delivery $5 and 3% fees, K1 = 29.99 − 14 − 5 − 0.90 = $10.09 before text and refund costs, and K2 = $29.49.

**Must arrange before it runs**
- Retire "Save 52%", "49% off" and "58%" on the site, and "61% off" in ads. Keep only the 55% first-order figure and the 25% subscription figure, both measured against $66.65.
- Confirm that $29.99 applies only to the subscription's first order, and say what a one-time buyer pays with text sign-up.
- Confirm when the first $49.99 charge happens, for example 4 weeks after the first order.
- Write the cancel path in plain steps.
- MISSING: delivery cost, or whether delivery is free. The total with delivery must show before checkout.
- Keep "Buy 2 Save $5" off this page, because it is for more than one person and adds a second money-off number.

**Five checks**
- **Fits:** passed. Both tools act on the price-clarity doubt.
- **True:** fixed. The conflicting percent claims are retired, and the saving figures come from your own prices.
- **Pays:** passed. Formulas are shown.
- **Clear:** missed.
- **Lasting:** fixed. Four live money-off numbers become one, and no new number is added.

**Score: 80/100 (4 of 5 checks)**
- **Clear missed:** the date of the first $49.99 charge and the cancel steps were not given, so I can't state them without inventing them.

---

## Offer 2: No-Trap First Order

**Buyer:** The same first-time price doubter.
**Doubt:** "I hate subscriptions because I feel like they are a trap."
**Lever:** Certainty. The fear is of being stuck.
**Tools:**
1. The guarantee in the brand's own words, placed at the order button.
2. A text reminder before the first renewal.

**Build**
- **For:** first-time buyers, one person.
- **Pay now:** $29.99 with text sign-up.
- **Pay after:** $49.99 every 4 weeks.
- **They get:** 28 packs, a text before the next charge, and the 30-day money-back guarantee on the first order.
- **What makes yes safe:**
  - The guarantee is shown at the button: 30-day money-back, "This policy applies only to your initial purchase."
  - A reminder text arrives before any $49.99 charge.
  - "Pause Or Cancel Any Time."
- **Why now:** none.

**Page line:** "Your first order has our 30-day money-back guarantee. We'll text you before your next $49.99 order so you can pause or cancel. Pause Or Cancel Any Time."

**Spoken line:** "If the first order isn't for you, you get your money back. Either way, we'll text you before we charge you again."

**Terms:**
- The 30-day money-back guarantee covers the first order only: "This policy applies only to your initial purchase."
- A reminder text comes before each $49.99 renewal.
- "Pause Or Cancel Any Time."

**Why it answers the doubt:** A trap means a charge you didn't see coming. Here, both the first order and the next charge come with a way out.

**Profit check**
- **Inputs:** as in Offer 1, plus the refund on the first order and the reminder text.
- MISSING: cost per pouch, delivery, fees, refund rate, whether refunded packs come back, cost per text.
- **Formulas:**
  - First order keeps K1 = 29.99 − (28 × pouch cost) − delivery − fees − text costs − refund rate × (29.99 + any unrecovered goods and delivery).
  - Each renewal keeps K2 = 49.99 − (28 × pouch cost) − delivery − fees − reminder text cost.
  - Profit per first-time buyer = K1 + (share still subscribed at each renewal × K2), added up over renewals.
- **What to watch:** compare this against the current offer. The reminder may raise cancellations before the second charge, and that only pays if more people start.

**Must arrange before it runs**
- Set up the reminder text and choose its timing. I propose 3 days before each charge, but that is your call.
- MISSING: the full guarantee wording and how to claim it. It must be shown word for word.
- Write the cancel path in plain steps, and test that it works exactly as written.
- Confirm when the first $49.99 charge happens.

**Five checks**
- **Fits:** passed. The guarantee and reminder act on the fear of being trapped.
- **True:** passed. Only your quoted words are used, nothing new is promised, and there are no dates or limits.
- **Pays:** passed. Formulas are shown.
- **Clear:** missed.
- **Lasting:** passed. There is no money-off number.

**Score: 80/100 (4 of 5 checks)**
- **Clear missed:** the first charge date, the cancel steps and the full guarantee wording were not given, so a stranger can't yet say exactly when they'll be charged or how to stop.

---

## Test plan (both offers)

**How to run it**
- Run each offer on its own page beside the current offer.
- The current offer stays until one of these beats it.

**What to measure**
- First orders.
- Refunds.
- Cancellations before the second charge.
- Profit per first-time buyer over 12 weeks, using the formulas once costs are known.

**Ask new buyers two questions**
1. What nearly stopped you?
2. What made you go ahead?
```
