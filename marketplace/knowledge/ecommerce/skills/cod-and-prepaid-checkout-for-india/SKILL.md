---
name: cod-and-prepaid-checkout-for-india
description: "Sets an Indian store's cash on delivery rules, prepaid nudges and checkout settings from its own delivered-order economics, so prepaid share rises without losing orders. Works out what a COD order really earns after return-to-origin losses, how big a prepaid incentive the store can afford, whether a COD fee, an order-value cap or a small advance fits, where each message goes (product page, cart, payment step, WhatsApp after order), and the Shopify settings or apps that apply. Ends with a switchback test that judges on delivered gross profit per session, not prepaid share alone. Use when COD share or RTO is high, before adding a COD fee or prepaid discount, or after a checkout change."
---

# Cash on delivery and prepaid checkout for India

**You get:** a COD and prepaid policy sheet (COD limits, fee or no fee, prepaid incentive and its cap, advance rule if any), the exact nudge lines and where each appears, a settings list for Shopify or the store's checkout, and a 4 to 6 week switchback test plan with a keep or drop rule based on delivered gross profit per session.

## When to use

- COD is more than about half of orders and RTO losses are eating profit.
- The owner wants to add a COD fee or a prepaid discount and needs to know what it costs.
- A one-click or third-party checkout is being added or changed.
- Prepaid share fell after a payment or theme change.

## Not for

- Scoring risky pincodes and orders to confirm or block: use `cut-rto-on-cod-orders`.
- Setting up gateways, UPI and fees comparison: use `set-up-payments-and-cod-rules`.
- Confirmation calls and WhatsApp scripts for COD orders: use `confirm-cod-orders-by-chat-or-call`.
- Making Meta optimise for confirmed or prepaid orders: use `meta-ads-for-cod-stores`.

## What you need

Required (read access, level 1):

1. **Shopify order export, last 90 to 180 days:** Name, Created at, Total, Shipping, Discount Code, Payment Method, Financial Status, Fulfillment Status, Shipping Zip, Shipping Province, Tags (RTO or cancelled tags if used).
2. **Courier or aggregator report:** per shipment, status (delivered, RTO, lost), forward and return charges, COD remittance charge.
3. **Gateway rate card:** fees for UPI, cards, wallets, net banking, and any refund fees.
4. **Gross profit per delivered order** before shipping, from `build-sku-profit-sheet`.
5. **Sessions by week** for the same window (Shopify Analytics or GA4).
6. **Current checkout:** Shopify checkout or a third-party checkout, payment methods shown and their order, any COD apps.

Optional: confirmation call outcomes, RTO reasons, cart value bands, support tickets about payment.

If courier data is missing, ask once; without RTO costs the COD economics cannot be computed, so stop. Changing payment settings or apps needs draft access (level 2) where possible; any live checkout or payment change needs the client's yes.

## Before you start: the gates

1. **Delivered economics known.** Gross profit per delivered order, forward and return shipping, COD remittance charge and RTO rate by payment method. Margin must be on delivered cost [MEA-0037]. Fail: compute it in Step 1 or stop.
2. **COD orders are counted honestly.** On Shopify, COD is a manual payment: orders stay unpaid until marked paid after cash is collected [SET-6186]. Revenue reports that count unpaid COD orders as sales overstate the business. Fail: rebuild the numbers on delivered orders.
3. **Cash.** COD cash arrives days after delivery through remittance; check the store can carry that wait. A prepaid push also shortens the cash cycle; note it.
4. **Rules are shown up front.** Any COD fee or condition must appear before the payment step (on the product page or cart). Surprise charges at checkout are drip pricing under India's 2023 dark-pattern guidelines [CRO-6606], and the E-Commerce Rules require the total price with other charges broken out [LPG-6600] and the top stated reason buyers leave checkout [CRO-6180].

## Steps

### 1. Work out what each payment type earns

For COD and for prepaid separately:

- **Prepaid gross profit per order** = gross profit per delivered order - forward shipping - gateway fee - prepaid cancellations and refunds cost.
- **COD gross profit per order placed** = (1 - RTO rate) x (gross profit per delivered order - forward shipping - COD remittance charge) - RTO rate x (forward shipping + return shipping + repacking and damage).

The gap between the two is the value of moving one COD order to prepaid. Do it by cart value band and by top states; the gap is usually widest on high-value carts and far pincodes.

### 2. Size the prepaid incentive

A prepaid incentive is paid to every prepaid buyer, including those who would have paid online anyway. Break-even incentive per prepaid order = (COD orders switched x value gap from Step 1) / all prepaid orders after the change. Model three levels (for example a flat 25, 50 and 100 rupees, or 3%, 5% and 8%) with planning switch rates (working figures: 10%, 20% and 30% of COD buyers, marked). Choose the largest gain in gross profit per session. A flat rupee amount reads clearly on low and mid carts; a percent can overpay on large carts, so cap it.

### 3. Decide on COD fee, cap or advance

- **COD fee:** charges the COD buyer for the cost they cause. Keep total extra charges small against order value; one practitioner found fees under about 10% of order value had no material conversion effect in his tests [LPG-0063], but COD buyers may be more sensitive (practitioner default, test it). Shopify has no native COD fee [SET-6186]; it needs an app, a third-party checkout, or a separately labelled shipping rate. The fee is part of the order value for GST; confirm treatment with the accountant.
- **Order-value cap:** hide COD above a value where RTO losses are largest. Shopify plans from Basic up can hide, reorder or rename payment methods with payment customization apps [SET-6187].
- **Advance (partial COD):** ask a small UPI payment to confirm the order and collect the rest on delivery. Use it for high carts or risky zones if the checkout supports it (practitioner default, test it).
- **Leave COD alone** where RTO is low and the gap from Step 1 is small; a nudge then only costs money.

Pick one main lever and at most one support lever. Hand pincode-level blocking to `cut-rto-on-cod-orders`.

### 4. Place the nudges

| Place | Message (fill with real numbers) | Rule |
|---|---|---|
| Product page, under price | "Pay online with UPI and save [amount]. Cash on delivery available." | Only if the incentive is live |
| Cart | "[amount] off when you pay online" and "COD fee [amount]" if any | State both before checkout |
| Payment step | UPI first, then cards and wallets, COD last, with the incentive in the method label where the checkout allows | Reorder with payment customization [SET-6187] |
| WhatsApp after a COD order, before dispatch | "Pay now by UPI and get [benefit]; your order ships the same way." | Only to buyers who agreed to WhatsApp messages; automated journeys perform far better than broadcasts in India [EML-0048] |

Keep words plain, in the store's languages; Hindi or regional versions where buyers use them. Never imply COD is unavailable when it is.

### 5. Set the checkout

List each setting with its owner: COD method name and instructions, payment method order, COD cap rule, fee mechanism, advance payment flow, prepaid discount as an automatic discount limited to online payment methods (check the checkout supports payment-method conditions; many do only through apps or third-party checkouts), and the order tags that mark COD, prepaid, converted and RTO for reporting.

### 6. Test with switchback weeks

Shopify's checkout cannot be split tested by browser tools on non-Plus plans [CRO-0016]. Use switchback weeks: alternate policy on and off week by week for 4 to 6 weeks (at least 2 weeks of each, covering full weekly cycles [CRO-0015]), with no sale or festival in the window. Measure for each week:

- Orders per session (all payment types): must not fall beyond normal weekly noise.
- Prepaid share and COD share.
- **Delivered gross profit per session** after RTO, read 2 to 3 weeks after each week ends so RTO has landed. This decides.

Keep the policy if delivered gross profit per session is higher and orders per session did not drop. If the store has under about 300 orders a month, read it as directional and say so [CRO-0011].

### 7. Watch after rollout

Weekly for 8 weeks: prepaid share, RTO rate by payment type, orders per session, delivered gross profit per session, and payment failure rate for UPI and cards (a rise in prepaid share is worthless if failed payments rise with it).

## Checks before you hand it over

- COD and prepaid gross profit per order are computed from courier and gateway data, by cart value band.
- The incentive is sized against all prepaid orders, not only switched ones.
- Any COD fee or condition is shown before the payment step, with GST treatment flagged.
- One main lever and at most one support lever are chosen, with the reason.
- WhatsApp nudges go only to opted-in buyers.
- The test judges on delivered gross profit per session after RTO, with orders per session as a guardrail.
- No live payment or checkout change without the client's yes.

## Output

**One-screen summary:** COD share, RTO rate, gross profit per COD order versus prepaid order, the chosen policy, expected change in delivered gross profit a month, and the test dates.

**Economics table:**

| Cart value band | Orders | COD share | RTO rate (COD) | GP per prepaid order | GP per COD order placed | Gap |
|---|---|---|---|---|---|---|

**Policy sheet:** COD available (yes, cap at [value], excluded zones handed to RTO rules), COD fee ([amount] or none), prepaid incentive ([amount], cap, methods), advance ([amount], when), WhatsApp conversion offer (yes or no, terms).

**Nudge lines:** Place, Exact words (English and other languages), Shows when.

**Settings list:** #, Setting, Where (Shopify admin, app, third-party checkout), Value, Owner, Approval.

**Switchback test plan:** Week, Policy on or off, Sessions, Orders, Prepaid share, Delivered GP per session (read date).

## Common mistakes

- **Counting COD orders as sales.** Gate 2 rebuilds on delivered orders.
- **Pricing the incentive on switched orders only.** Step 2 charges it against every prepaid order.
- **Surprise COD fees at checkout.** Gate 4 and Step 4 show them early.
- **Judging on prepaid share.** Step 6 decides on delivered gross profit per session.
- **Killing COD outright.** Step 3 caps or prices it; many buyers will not pay online for a first order from a new store.
- **Reading RTO too early.** Step 6 waits 2 to 3 weeks after each test week.

## Sources

- CRO-0011: test type gated by monthly orders.
- CRO-0015: run in full weekly cycles.
- CRO-0016: Shopify checkout cannot be split tested by browser tools.
- CRO-6180: unexpected costs are the top stated checkout exit reason.
- EML-0048: automated WhatsApp journeys outperform broadcasts in India.
- LPG-0063: extra checkout costs under about 10% of order value.
- MEA-0037: gross margin is delivered cost.
- SET-6186: Shopify COD is a manual payment, unpaid until collected.
- SET-6187: payment customization apps can hide, reorder and rename payment methods.
- [CRO-6606]: drip pricing and other checkout dark patterns.
- [LPG-6600]: India E-Commerce Rules: total price with charges broken out, origin, grievance officer.

What makes this skill ours: COD is valued per order placed after RTO and remittance costs, by cart value band; the prepaid incentive is priced against every prepaid order, not just converts; fees and conditions must show before the payment step to avoid drip pricing; and the policy is proven with switchback weeks read on delivered gross profit per session after RTO lands.
