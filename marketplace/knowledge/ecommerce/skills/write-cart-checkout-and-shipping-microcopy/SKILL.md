---
name: write-cart-checkout-and-shipping-microcopy
description: "Writes and places the small words that remove doubt between add to cart and order confirmed: the line under the buy button, delivery estimate and postcode check text, cart drawer reassurance, free-shipping progress messages, discount box wording, shipping method names, payment notes (including pay on delivery where the store offers it), returns lines, error messages and the order confirmation reassurance. Every line matches live policy and real delivery data, sits where the doubt happens, and is mapped to what Shopify lets the store edit on its plan. Use when cart or checkout drop-off is high, after changing shipping or returns, or when tickets show buyers were unsure at checkout."
---

# Cart, checkout and shipping microcopy

**You get:** a microcopy sheet of 20 to 40 lines, each with its exact wording, its location (product page, cart drawer, cart page, checkout step, confirmation page, shipping email), the doubt it answers, its source policy or data, and how to edit it on the store's Shopify plan, ready for the client's approval and loading on a duplicate theme or in checkout settings.

## When to use

- Many shoppers reach cart or checkout but do not finish.
- Tickets ask "when will it arrive", "can I return it", "can I pay with my usual method", "why is the price higher now".
- Shipping rates, the free-shipping line, the returns policy or payment options changed.
- The cart drawer only shows items and a total.

## Not for

- Finding where and why buyers leave cart and checkout, with fixes ranked: `fix-checkout-drop-off` (this skill writes the words it calls for).
- Setting shipping zones, rates and the free-shipping line: `set-up-shipping-rates-and-delivery-promise`.
- Policy pages in full: `write-store-policy-pages`.
- Pay-on-delivery rules and prepaid nudges for Indian stores: hand to Ishita (`ishita-india-commerce`), who uses `cod-and-prepaid-checkout-for-india`.
- Which upsells to show in cart: `set-up-cart-upsells-and-cross-sells`.

## What you need

Required (read access, level 1):

1. **Screenshots or a screen recording** of product page buy box, cart drawer or page, each checkout step and the confirmation page, on a phone.
2. **Live policies**: shipping rates and free-shipping line, dispatch time, returns and exchange window, refund timing, payment options, and any pay-on-delivery rules and fees.
3. **Delivery data, last 90 days**: order, dispatch and delivery dates by region or postcode zone, from the shipping app or courier export.
4. **Funnel numbers**: add to cart, reached checkout, purchased, from Shopify or GA4.
5. **Tickets and chats** that mention cart, checkout, payment, delivery or returns.

Optional: on-page survey answers from cart and checkout, recordings of checkout sessions, payment failure reports.

The Shopify plan matters: since checkout extensibility, client-side tools cannot test checkout, and adding content inside checkout steps needs Shopify Plus, while non-Plus stores edit what comes before checkout and the checkout's language strings [CRO-0016]. Edits need draft access (level 2) on a duplicate theme or in checkout settings; going live needs the client's yes.

## Before you start: the gates

1. **Promises match operations.** Every delivery line comes from measured dispatch and transit times. In the US, any stated or implied ship time needs a reasonable basis and delays need a notice with a free cancel option [CXP-6160]. Fail: write the cautious version ("Dispatched in 1 to 2 working days") until data exists.
2. **Prices are whole up front.** No fee or tax appears for the first time at the last step. Consumer rules in most big markets treat drip pricing, false urgency and basket sneaking (adding items or charges without consent) as unfair or misleading: the FTC in the US, UK consumer law enforced by the CMA (which now bans drip pricing outright), and the EU's consumer and price rules. Where buyers expect tax-inclusive prices (UK, EU, Australia and many other markets), keep VAT or the local sales tax in the shown price; in the US, say tax is worked out at checkout; and show every delivery or payment fee before checkout. Fail: move the fee line earlier.
3. **No fake pressure.** No countdowns that reset, no "only 2 left" unless from live stock, no "500 bought today" unless from live orders. Fail: delete the line.

## Steps

1. **Map the doubts by step.** From tickets, surveys and recordings, list the doubts at each step: product page (will it arrive in time, can I return it, can I pay the way I like), cart (what is the total, how close am I to free shipping, is this secure), checkout (shipping cost, delivery date, payment options, will my card or wallet work), confirmation (what happens now). Count each doubt.
2. **Read the funnel.** Compare add to cart, reached checkout and purchase. A typical ratio is about 4 add-to-carts to 2 checkouts to 1 purchase, with well-run low-ticket stores near 2 to 1 to 1 [MEA-0008]. A big cart-to-checkout gap points to cart words and totals; a big checkout-to-purchase gap points to shipping cost, payment and trust.
3. **Write the under-button line.** One line of risk reducers directly under the buy button: returns window, delivery estimate, payment note [LPG-0038]. The same line repeats in the cart drawer.
4. **Write the delivery estimate.** Specific dates beat vague ranges when padded and usually met [CXP-0010]: "Order today, arrives by Thu 21 Nov" based on the 90th percentile transit time for the buyer's zone. Where delivery time varies a lot by area: a postcode or ZIP check box with "Check the delivery date for your postcode", and clear results for fast zones, slower zones and areas the store cannot reach. For cross-border orders, say whether duties and import taxes are included.
5. **Write the cart drawer.** Item lines, total with taxes stated, the free-shipping progress message in the store's own currency ("You're $24 away from free delivery"), then any gift ladder step that the store actually runs [LPG-0001] [LPG-0072], one reassurance line (returns, secure payment), and the checkout button label ("Checkout securely"). If no promotion is running, consider hiding the discount code box in cart and showing a trust line instead, which one store found worth about $40,000 a month [LPG-0058]; test it.
6. **Write shipping method names.** Name methods by arrival, not courier codes: "Standard, arrives 22 to 25 Nov", "Express, arrives 20 Nov". Keep shipping, tax and fees added at checkout small relative to order value; one practitioner saw no material conversion effect while they stayed under about 10% of AOV [LPG-0063].
7. **Write payment notes.** List the methods buyers in each market expect: cards and express wallets (Apple Pay, Google Pay, Shop Pay, PayPal) almost everywhere; buy now, pay later (Klarna, Afterpay, Affirm) where the store offers it; local methods such as iDEAL in the Netherlands or Bancontact in Belgium where the store sells. If the store offers pay on delivery in any region, state any fee and order limit before checkout; a prepaid incentive line only if the store funds it and it is modelled. Shop Pay showed a higher mobile checkout-to-order rate in Shopify's own data [SET-0008]; label it plainly.
8. **Write errors and edge cases.** Payment failed ("Your payment did not go through. You have not been charged. Try again or pick another method."), address not serviceable, out of stock in cart, discount not valid (say why). Each error tells the buyer what happened and what to do next.
9. **Write the checkout abandonment offer rule.** At checkout, reassurance and shipping help beat discounts; save generous offers for earlier stages [OFF-0009]. Hand recovery messages to `write-abandoned-cart-and-checkout-emails`.
10. **Write confirmation and shipping email lines.** Confirmation page: what happens next, dispatch date, how to track, how to change the address, support contact. Pay on delivery orders, where offered: "Keep [amount] ready for the courier" and the card option only if the courier supports it.
11. **Place and measure.** Map each line to its exact location and the edit method on the store's plan. Record funnel step rates before; read them again after 2 to 4 weeks. Stores under about 30 monthly orders should ship and watch, not split-test [CRO-0011].

## Checks before you hand it over

- Every delivery line uses measured data and a buffer, with the data date.
- Every fee appears before the final step, in the same amount as checkout.
- No fake urgency or invented social proof anywhere.
- Every error message says what happened and the next action.
- Each line names its location and whether it is editable on the store's plan.
- Returns and refund lines match the live policy page in substance.
- Postcode, local payment method and pay-on-delivery cases are covered for each market the store sells to.

## Output

**Summary (one screen):** funnel step rates, top doubts by step with counts, the 5 lines expected to matter most, lines that need Shopify Plus, and the read date.

**Microcopy sheet:**

| # | Location | Doubt answered (count) | Copy | Source (policy, data, date) | Edit method on plan | Status |
|---|---|---|---|---|---|---|

**Error and edge case sheet:** case, trigger, message, next action.

**Before and after measure:** step, rate before, date, rate after, date.

**Assumptions:** where a policy or fee was not given, the one used, one line each. Lines that need Shopify Plus are marked in the sheet.

## Common mistakes

- **Delivery promises from the courier's best case.** Step 4 uses the 90th percentile.
- **Fees that appear at the last step.** Gate 2 moves them earlier.
- **Discount box that sends buyers hunting for codes.** Step 5 tests hiding it when no promotion runs.
- **Error messages that blame the buyer.** Step 8 says what happened and what to do.
- **Writing copy the plan cannot place.** Step 11 maps each line to an edit method.
- **Fake pressure.** Gate 3 deletes it.

## Sources

- CRO-0016: checkout editing and testing limits since checkout extensibility.
- CXP-6160: US ship-time claims and delay notices.
- MEA-0008: add-to-cart to checkout to purchase ratios.
- LPG-0038: risk reducers under the button.
- CXP-0010: specific, padded delivery dates.
- LPG-0001, LPG-0072: cart progress bars and gift ladders.
- LPG-0058: hide the discount box and add a trust bar when no promotion runs.
- LPG-0063: shipping and fees under 10% of AOV.
- SET-0008: Shop Pay mobile checkout-to-order rate.
- OFF-0009: no discount at checkout; use reassurance.
- CRO-0011: testing gated by monthly orders.

What makes this skill ours: each line answers a counted doubt at the exact step it happens; delivery wording comes from the store's own 90th percentile transit data; every fee shows before the last step, in line with drip pricing rules in the US, UK and EU; and each line is mapped to what the store's Shopify plan can actually edit.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Points to keep:
- Show prices GST-inclusive and any COD fee before checkout. India's 2023 dark patterns guidelines name drip pricing, false urgency and basket sneaking.
- Add a pincode check box: "Check delivery date and COD for your pincode", with clear results for serviceable, COD-unavailable and not serviceable pincodes.
- List UPI, cards, wallets and COD; state any COD fee and limit before checkout.
- COD confirmation line: "Keep [amount] ready, or pay by UPI on delivery" only if the courier supports it.
- COD rules and prepaid nudges as a setup: `cod-and-prepaid-checkout-for-india`.
