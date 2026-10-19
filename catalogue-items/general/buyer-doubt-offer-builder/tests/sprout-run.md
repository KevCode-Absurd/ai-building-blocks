# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Two honest, usable offers that quote the real terms, state the renewal price in the same breath as the $29.99 and flag every unknown cost with a formula instead of a guess. The one weakness is the profit formula multiplying 28 by "pouch cost" (a pouch already holds 28 packs per the brand file), which the output hedged with a MISSING line rather than resolving; the owner should correct that before using the sums.

## Judge list

- Met: Each offer names one buyer and answers a doubt from research, in their words
  Offer 1: "Which discount is real?" / "Will the price jump after the first order?"; Offer 2: "I hate subscriptions because I feel like they are a trap."
- Met: Each offer says which lever it pulls, and its tools fit that lever
  Offer 1 "Lever: Price" with one-price-everywhere and what-it-becomes; Offer 2 "Lever: Certainty" with quoted guarantee and pre-renewal reminder.
- Met: Guarantee quoted exactly; anything longer or wider under must arrange
  "This policy applies only to your initial purchase." quoted in both; reminder text listed under "Must arrange before it can run".
- Met: First-order price states what it becomes in the same sentence; no urgency without a real date or limit
  "First 28 packs $29.99 with text sign-up, then $49.99 every 4 weeks." and "Why now: None." in both offers.
- Met: Unknown costs show as MISSING with formula; no treat/cure/prevent claims
  "First order keeps = 29.99 − (28 × pouch cost) − delivery − fees..." with MISSING lines; no health claims anywhere.

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
## Offer 1: One Clear Price

**Buyer and doubt:** A first-time buyer who knows the brand and thinks it costs too much. Their doubts: "Which discount is real?" and "Will the price jump after the first order?"
**Lever:** Price. They can't tell what they will pay now or later.
**Tools:**
1. One price, shown the same way on the page, the cart, texts and ads.
2. What the first price becomes, stated in the same sentence.

**Build**
- **Who it's for:** First-time buyers only. Returning subscribers are not shown this.
- **What they pay now:** $29.99 for the first 28 packs. This is only available with the text sign-up.
- **What they pay after:** $49.99 every 4 weeks. A one-time order of 28 packs is $66.65.
- **What they get:** 28 packs per delivery.
- **What makes yes safe:** "Pause Or Cancel Any Time." There is also a 30-day money-back guarantee, and "This policy applies only to your initial purchase."
- **Why now:** None.

**Page line:** "First 28 packs $29.99 with text sign-up, then $49.99 every 4 weeks. Pause Or Cancel Any Time."
**Spoken line:** "Your first box is $29.99 when you sign up by text. After that it's $49.99 every four weeks, and you can pause or cancel whenever you want."
**Terms:** The $29.99 first-order price needs the text sign-up and starts a subscription at $49.99 every 4 weeks. You can pause or cancel any time. The 30-day money-back guarantee "applies only to your initial purchase."
**Why it answers the doubt:** There is one price to believe, and the later price sits in the same sentence, so nothing is left to surprise them.

**Profit check**
- **Inputs used:** $29.99 first order, $49.99 renewal, $66.65 one-time, 28 packs per order.
- **Missing inputs:**
  - `MISSING:` cost per pouch.
  - `MISSING:` whether 1 pack = 1 pouch.
  - `MISSING:` delivery cost for 1, 2 and 3 orders.
  - `MISSING:` payment fees.
  - `MISSING:` refund rate.
- **What one order keeps (formulas):**
  - First order keeps = 29.99 − (28 × pouch cost) − delivery − fees − (refund rate × 29.99, plus any goods not recovered).
  - Renewal keeps = 49.99 − (28 × pouch cost) − delivery − fees.
  - Renewals needed to recover a first-order loss = (first-order loss) ÷ (renewal keeps).
- **Effect on profit:** No price moves, so profit per order is the same as today. Any gain or loss comes from how many buyers start and how long they stay.
- **Do not stack:** The live "Buy 2 Save $5" stays separate. If it is combined with $29.99, run the sum again.

**Must arrange before it can run**
- Remove "Save 52%", "49% off" and "58%" from the site, and "61% off" from ads. Check that "up to 55% off" matches: $29.99 against $66.65 is 55% less.
  - None of 52, 49, 58 or 61 match the listed prices. `MISSING:` what each one is calculated from.
- Decide whether $29.99 stays gated behind the text sign-up. If it does, show that condition everywhere the price appears.
- Show the total including delivery before checkout. `MISSING:` whether buyers pay delivery, and how much.
- Confirm the date of the first $49.99 charge. `MISSING:` whether it falls 4 weeks after the first order.

**Five checks**
- **Fits:** Passed. Both tools act on the money and the uncertainty about it.
- **True:** Passed. Terms and guarantee are quoted word for word. No new product fact. No urgency.
- **Pays:** Passed. Formulas are shown because costs are `MISSING:`.
- **Clear:** Fixed. "How to stop" was missing. Add the actual cancel route (`MISSING:` account page, text reply or email) next to the terms.
- **Lasting:** Fixed. Five competing percentages teach buyers to hunt for the deepest one. This offer replaces them and adds no new money-off number.

---

## Offer 2: Easy Exit Plan

**Buyer and doubt:** The same first-time price doubter. Their doubt: "I hate subscriptions because I feel like they are a trap."
**Lever:** Certainty. They fear being trapped.
**Tools:**
1. The guarantee in the brand's own words, placed at the offer.
2. A reminder before every renewal charge.

**Build**
- **Who it's for:** First-time buyers who hesitate at the subscription.
- **What they pay now:** $29.99 for the first 28 packs, with the text sign-up.
- **What they pay after:** $49.99 every 4 weeks.
- **What they get:** 28 packs per delivery, plus a text before each charge naming the date and the $49.99 amount.
- **What makes yes safe:**
  - "Pause Or Cancel Any Time."
  - The 30-day money-back guarantee: "This policy applies only to your initial purchase."
  - The reminder before each charge.
- **Why now:** None.

**Page line:** "We'll text you before every $49.99 charge. Pause Or Cancel Any Time. 30-day money-back on your first order."
**Spoken line:** "You'll never be charged without a heads-up. We text you first, and you can pause or cancel right then. Your first order also has 30-day money-back."
**Terms:** After the $29.99 first order, you are charged $49.99 every 4 weeks. You get a text before each charge and can pause or cancel any time. The 30-day money-back guarantee "applies only to your initial purchase."
**Why it answers the doubt:** A trap works by charging you without you noticing. A warning before every charge, with a way out right there, removes that.

**Profit check**
- **Inputs and missing costs:** Same as Offer 1. Prices are unchanged. Every cost is `MISSING:`.
- **Added cost per renewal:** text cost (`MISSING:`) per renewal.
- **Renewal keeps:** 49.99 − (28 × pouch cost) − delivery − fees − text cost.
- **Value of one new buyer:** (first-order keeps) + (average renewals × renewal keeps).
- **Watch this:** Reminders may lift sign-ups but cut renewals. Judge the offer on value per new buyer, not sign-ups alone.

**Must arrange before it can run**
- Build the pre-charge reminder text. The timing is a proposal, for example 3 days before; set your own.
- Write the cancel route into the reminder. `MISSING:` how a buyer cancels today.
- Confirm the reminder goes to buyers who joined through the text sign-up, and that their consent covers it.

**Five checks**
- **Fits:** Passed. Both tools act on the fear of being trapped.
- **True:** Passed. The guarantee is quoted exactly, including its limit to the first order. The reminder is listed under "must arrange", not claimed as live.
- **Pays:** Passed. Formulas are shown, with text cost added.
- **Clear:** Fixed. As in Offer 1, the actual cancel method is needed in the terms and in the reminder.
- **Lasting:** Passed. No money off is involved.

---

## Why no third offer
The buyer's doubts sit on two levers only: price and certainty. A result, time or effort offer would answer a doubt they haven't stated.

All prices stay as they are because there is no cost data. Neither offer moves a price.

## Test plan
- Run each offer on its own page beside the current offer. The current offer stays until something beats it on value per new buyer, meaning first-order keeps plus renewals.
- Ask new buyers two questions:
  1. What nearly stopped you?
  2. What made you go ahead?
```
