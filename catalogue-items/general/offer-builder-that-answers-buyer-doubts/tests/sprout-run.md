# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Two honest, usable offers that restate Sprout's real prices and terms plainly, pull the right levers for the price doubter, and never invent a cost or claim. The illustrative margin maths is correctly labelled and the owner gets a clear list of gaps and must-arrange items before anything runs.

## Judge list

- Met: Each offer names one buyer and answers a doubt from your research, in their words.
  Offer 1: "Which discount is real?" "Will the price jump after the first order?"; Offer 2: "I hate subscriptions because I feel like they are a trap."
- Met: Each offer says which lever it pulls, and its tools fit that lever.
  Offer 1 "Lever: Price" with one-price-everywhere and what-it-becomes; Offer 2 "Lever: Certainty" with guarantee at the offer and renewal reminder.
- Met: The guarantee is quoted exactly. Anything longer or wider is listed under "must arrange".
  "30-day money-back." "This policy applies only to your initial purchase." Reminder before renewal and cancel-without-support sit under must arrange.
- Met: A first-order price states what it becomes after, in the same sentence. No urgency appears without a real date or limit.
  "$29.99 with text sign-up, then $49.99 every 4 weeks." Both offers: "Why now: None."
- Met: Unknown costs show as a formula with MISSING, not as made-up numbers. No offer says the product treats, cures or prevents anything.
  "MISSING: cost per order (C), delivery cost (D), fees (F), refund rate (r)" with formulas; illustrative table labelled "made-up figures, not yours". No health claims.

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
# Offer 1: One Price, Plainly

**Buyer and doubt:** First-time buyer who knows the brand and thinks it costs too much. Their words: *"Which discount is real?"* *"Will the price jump after the first order?"*

**Lever:** Price. The doubt is about not knowing what they will actually pay, more than the amount itself.

**Tools:**
1. One price shown the same way everywhere.
2. What the first price becomes, in the same sentence.

**This offer changes no price.** With no cost data, it only restates the prices you already charge.

**Build**
- **For:** First-time buyers who doubt the price.
- **Pay now:** $29.99 for the first order, only with the text sign-up. `MISSING:` confirm $29.99 is the first subscription order and not a one-time order.
- **Pay after:** $49.99 every 4 weeks.
- **Without a plan:** $66.65 once.
- **They get:** 28 packs per order.
- **What makes yes safe:** Every price is written out in full. Nothing is shown only as a percent. The total with delivery appears before checkout. `MISSING:` what delivery costs the buyer, if anything.
- **Why now:** None.

**Page line:** "Your first 28 packs: $29.99 with text sign-up, then $49.99 every 4 weeks. Or buy once for $66.65, no plan."

**Spoken line:** "If you sign up for texts, the first box is $29.99. After that it's $49.99 every four weeks. If you'd rather not subscribe, it's $66.65 once."

**Terms:** The $29.99 first-order price needs the text sign-up. Later orders are $49.99 every 4 weeks, "Pause Or Cancel Any Time."

**Why it answers the doubt:** The buyer sees three real prices in dollars, in one place, and the second price sits in the same sentence as the first. That leaves no discount to decode and no jump to discover later.

**Profit check**
- **Inputs used:** $29.99 first order, $49.99 renewal, $66.65 one-time.
- **Not known:** Cost per pack or pouch, delivery, fees, refund rate, and order history (so the spread of order values can't be read).
- `MISSING:` cost per order (C), delivery cost (D), fees (F), refund rate (r).

Formulas:
- **One-time order keeps:** 66.65 − C − D − F(66.65)
- **First subscription order keeps:** 29.99 − C − D − F(29.99) − r × (29.99 + C + D)
  - The refund term assumes refunded goods are not recovered.
- **Each renewal keeps:** 49.99 − C − D − F(49.99)
- **Renewals needed to match one one-time sale (n):**
  - n = [one-time keeps − first-order keeps] ÷ renewal keeps
  - Compare n with how many renewals subscribers really pay. `MISSING:` average paid renewals.

**Illustrative only (made-up figures, not yours):** C = 10, D = 6, fees = 3% + $0.30, no refunds.

| Order | Keeps |
|---|---|
| One-time | $48.35 |
| First subscription order | $12.79 |
| Each renewal | $32.19 |

So n ≈ 1.1. A subscriber would need to pay about one renewal to match one one-time sale.

**Must arrange before it runs**
1. Remove "Save 52%", "up to 55% off", "49% off" and "58%" from the site, and "61% off" from the ads.
   - If a saving is shown at all, use one only, worked out from $66.65.
   - `MISSING:` what each of the live percentages is measured against.
2. Show the same three prices on the product page, in the cart, at checkout and in ads.
3. Show the total with delivery before checkout.
4. Keep "Buy 2 Save $5" out of this offer. If it stays live, run the profit check again for orders that combine it with $29.99.

**Five checks**
- **Fits:** Passed. Both tools are price-clarity tools, and the doubt is price clarity.
- **True:** Fixed. The unverifiable percentages are removed, no new product fact is added, and no health claim is made.
- **Pays:** Passed with formulas. No numbers are possible without cost data.
- **Clear:** Fixed for what they pay today and what it becomes. It is still missing for how to stop.
- **Lasting:** Fixed. This offer adds no new money-off number, and the live ones are retired under "must arrange".

**CHECKS MISSED:**
- **Clear:** How to cancel, and by when before a renewal, is not given. `MISSING:` cancel steps and cut-off.

**Test plan**
- Run this on its own page beside the current page. The current page stays until this one beats it.
- Measure first orders, and renewals paid after 4 and 8 weeks.
- Ask new buyers two questions: "What nearly stopped you?" and "What made you go ahead?"

---

# Offer 2: Cancel Any Time Plan

**Buyer and doubt:** The same first-time price doubter. Their words: *"I hate subscriptions because I feel like they are a trap."*

**Lever:** Certainty. The fear is being trapped.

**Tools:**
1. Your guarantee and terms, in your own words, placed at the offer.
2. A reminder before every renewal.

**This offer changes no price.**

**Build**
- **For:** First-time buyers who avoid subscriptions.
- **Pay now:** $29.99 first order with text sign-up.
- **Pay after:** $49.99 every 4 weeks.
- **They get:** 28 packs per order, a reminder before each renewal, and "Pause Or Cancel Any Time."
- **What makes yes safe:** "30-day money-back." "This policy applies only to your initial purchase."
  - Both lines are shown together, so the buyer knows renewals are not covered.
- **Why now:** None.

**Page line:** "Pause Or Cancel Any Time. We remind you before every renewal. 30-day money-back on your first order. This policy applies only to your initial purchase."

**Spoken line:** "You can pause or cancel any time, and we message you before every charge. If the first box isn't for you, you have 30 days to get your money back."

**Terms:** $29.99 first order with text sign-up, then $49.99 every 4 weeks. "Pause Or Cancel Any Time." "30-day money-back." "This policy applies only to your initial purchase."

**Why it answers the doubt:** A trap means being charged without warning and being unable to leave. This offer warns them before every charge, lets them leave at any time, and covers the first order with money back.

**Profit check**
- Uses the same formulas as Offer 1. Add the cost of each reminder message: `MISSING:` cost per text or email (M).
- **Each renewal keeps:** 49.99 − C − D − F(49.99) − M
- **Watch the trade-off:** Reminders may raise pauses and cancels. Compare paid renewals per subscriber against the current page, not only sign-ups.

**Must arrange before it runs**
1. Set up a reminder before each renewal. `MISSING:` how many days before, and whether by text or email.
2. Make cancelling possible without contacting support, and state the steps on the page. `MISSING:` the current cancel steps.
3. Make sure the refund process for the first order matches "30-day money-back" exactly.
4. `MISSING:` a review or proof line to place at the offer. None was given, so none is added.

**Five checks**
- **Fits:** Passed. A guarantee and renewal reminders are certainty tools, and the doubt is fear of being trapped.
- **True:** Passed. The guarantee and terms are quoted word for word, there is no urgency, and no product fact or health claim is added.
- **Pays:** Passed with formulas.
- **Clear:** Fixed for what they pay today and what it becomes. It is still missing for how to stop.
- **Lasting:** Passed. No money-off number is used.

**CHECKS MISSED:**
- **Clear:** The cancel steps and the renewal cut-off are not known, so a stranger can't yet say how to stop. `MISSING:` cancel steps and cut-off.

**Test plan**
- Run this on its own page beside the current page. The current page stays until this one beats it.
- Compare first orders, cancels before the first renewal, and renewals paid after 8 weeks.
- Ask new buyers two questions: "What nearly stopped you?" and "What made you go ahead?"

---

**Gaps to fill later:**
- Whether $29.99 is the first subscription order.
- What delivery costs the buyer.
- Cost per pack or pouch, delivery cost to you, and fees.
- Refund rate.
- 90 days of order values and items per order.
- Average paid renewals.
- What each live percentage is measured against.
- Cancel steps and cut-off.
- Reminder timing, channel and cost.
- A proof line.

What next? You could **write the landing page** with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer), **make image ads** with the [Three-way offer image ad planner](https://useaiblocks.com/skills/three-way-offer-image-ad-planner), **make video ads** with the [Video ad script writer from customer quotes](https://useaiblocks.com/skills/video-ad-script-writer-from-customer-quotes), or **write the ad copy** with the [Image ad copy writer](https://useaiblocks.com/skills/image-ad-copy-writer). Each one takes the offer, or you can type your own next step.
```
