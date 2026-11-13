---
name: cut-rto-on-cod-orders
description: "A cash-on-delivery rule table that sorts every COD order into allow, confirm first, nudge to prepaid or prepaid only, by pincode, buyer history, product, order value and order pattern, using the store's own break-even return-to-origin rate per segment. Includes the confirmation and failed-delivery timings, the prepaid offer that pays, and a weekly tracker of orders lost versus parcels saved. Use when return-to-origin eats margin, COD share is high, a new region or product is opening to COD, or ads are bringing in orders that never get delivered."
---

# Cut return-to-origin on COD orders

**You get:** a rule table (segment, evidence, action, owner, timing) that sorts each new COD order into allow, confirm, nudge to prepaid or prepaid only; a pincode and pattern risk sheet built from the store's own orders; the break-even return-to-origin rate per product; and a weekly tracker that shows parcels saved against orders lost.

## When to use

- Return to origin (parcels refused or undelivered and shipped back) is above about 15% of COD orders, or shipping losses wipe out ad profit.
- COD is more than half of orders and the owner wants to cut risk without killing sales.
- The store is opening COD to new pincodes, a new product or a big sale.
- A new ad campaign or influencer push is bringing orders that do not get delivered.

## Not for

- Confirmation call and chat scripts: use `confirm-cod-orders-by-chat-or-call`.
- Checkout settings and prepaid offers on the checkout page: use `cod-and-prepaid-checkout-for-india`.
- Meta optimising for confirmed or delivered orders: use `meta-ads-for-cod-stores`.
- Fake orders and card testing: use `stop-fake-orders-and-card-testing`. US stores rarely offer COD; their risk work sits there.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 6 months: Name, Created at, Email, Phone, Shipping Name, Shipping Address1, Shipping Zip, Shipping City, Shipping Province, Payment Method, Total, Lineitem sku, Lineitem quantity, Discount Code, Tags, Cancelled at.
2. **Courier or aggregator shipment report** for the same orders: AWB, status (delivered, returned to origin, lost), delivery attempts, failed-delivery reasons, delivered or returned date.
3. **Costs:** forward shipping, return shipping, COD fee, packaging, and the share of returned units that cannot be resold.
4. **Order source** per order (UTM or channel), if tracked.

Optional: confirmation logs, past prepaid offers and their take rate, the risk scores an aggregator or checkout app already gives.

Rules are built at draft access (level 2) inside the checkout, COD or aggregator app. Switching COD off for any segment, sending messages to buyers or cancelling orders needs the client's yes.

## Before you start: the gates

1. **Gross profit per delivered COD order.** Pass when it includes shipping, COD fee and payment cost [MEA-0037]. Fail: compute it; product margin alone hides most of the cost [MEA-0023].
2. **Enough data.** Pass when the store has at least 300 delivered or returned COD orders in 6 months. Fail: use state-level rules and buyer history only, and recheck at 300.
3. **Consent and channels.** Pass when buyers agreed to order messages on WhatsApp or SMS, and SMS templates are registered under India's DLT rules. Fail: confirm by call or email until fixed.
4. **Fair rules.** Pass when rules use order behaviour, location and history only. Fail: remove any rule based on a buyer's name, religion, caste, gender or similar.

## Steps

### 1. Compute each product's break-even return-to-origin rate

Return-to-origin cost per parcel = forward shipping + return shipping + COD fee if charged + packaging + (share unsellable x landed cost).

Break-even rate = gross profit per delivered order / (gross profit per delivered order + return-to-origin cost).

Illustrative: profit of 400 per delivered order and 180 lost per returned parcel gives 400 / 580, about 69%. A low-margin product with profit of 120 and the same 180 loss breaks even at 40%. The same pincode can be fine for one product and a loss for another.

### 2. Measure risk by segment

From the joined export and courier report, return-to-origin rate = returned / (delivered + returned), per:

- **Pincode.** Use a pincode only with 20+ COD orders; otherwise roll up to its first 3 digits, then city, then state (practitioner default).
- **Buyer history.** Past delivered COD orders, past returned COD orders, by phone number.
- **Product and price band.**
- **Order pattern:** first-time buyer, order value above the store's 90th percentile, 3+ units of one SKU, incomplete or very short address, same phone with several open orders, order cancelled and placed again.
- **Source:** campaign or creator, if tracked.

Track failed-delivery reasons too: "customer refused", "not reachable" and "address not found" need different fixes.

### 3. Set the action for each segment

Compare each segment's rate with the product's break-even rate:

| Segment risk | Action |
|---|---|
| Buyer has a delivered COD order before and no returns | **Allow**, no confirmation |
| Rate below half of break-even | **Allow**, auto-confirmation message |
| Rate between half and full break-even | **Confirm first**, plus prepaid nudge |
| Rate above break-even, or buyer has 2+ past returns | **Prepaid only** (hide COD for that pincode, product or buyer) |
| Incomplete address or unreachable phone | **Hold** until fixed; cancel after 48 hours |

The half-of-break-even line is a practitioner default; tune it with the weekly tracker. Write each rule with its evidence (rate, orders behind it) so anyone can see why it exists.

### 4. Set the confirmation routine

- Send the confirmation message within 15 minutes of the order: order, amount to pay in cash, address, and two buttons (confirm, cancel). On WhatsApp this is a utility message; keep any offer out of it, or it becomes marketing [OPS-6286].
- Not answered in 4 hours: second message. Not answered in 24 hours: a call. Not confirmed in 48 hours: cancel, with a message saying so. Timings are practitioner defaults; test them.
- Ship only confirmed orders in the "confirm first" group. In India, automated WhatsApp journeys have drawn far more clicks than broadcasts across a large data set [EML-0048], so messages beat calls on cost; calls catch the rest.

Hand the exact wording to `confirm-cod-orders-by-chat-or-call`.

### 5. Price the prepaid nudge

A prepaid offer (a flat amount off, or free shipping, for paying by UPI or card) pays for a segment when:

share of nudged buyers who switch x return-to-origin rate x return-to-origin cost > offer cost x (buyers who switch + buyers who would have prepaid anyway).

Show it in the confirmation message only as a separate, plain choice after the order is confirmed, or on the checkout page through `cod-and-prepaid-checkout-for-india`. A small COD fee works the other way; model both.

### 6. Fix the failed-delivery loop

Most parcels that go back are first marked as failed deliveries. When the courier reports one, message the buyer within 2 hours with the reason and a reattempt or address fix link; call if no reply by the next morning. Ask the courier for the maximum reattempts. Give a specific delivery date at order time and keep buyers updated so they expect the parcel [CXP-0010] [CXP-0014].

### 7. Close the gap in the numbers

Accrue expected returns on today's COD orders at the segment's rate instead of waiting for parcels to come back [MEA-0028]; ad and profit reports otherwise look better than they are for 2 to 3 weeks. Send "confirmed" and "delivered" signals to the ad platforms through `meta-ads-for-cod-stores`.

### 8. Track weekly and adjust

Every week: COD orders, share in each action group, confirmations, cancellations, return-to-origin rate per group, orders lost to prepaid-only rules (buyers who left instead of paying), and net gross profit per COD order. Loosen a rule if it blocks more profit than it saves; tighten it if a segment's rate crosses break-even. Re-run steps 1 and 2 monthly.

Data note: sharing buyer phone numbers with an outside risk-scoring service is a data-sharing decision under India's data protection law; get the client's and their adviser's view first.

## Checks before you hand it over

- Every product has a break-even return-to-origin rate from real costs.
- Every pincode rule rests on 20+ orders or a rolled-up area, with the count shown.
- Each rule has an action, evidence, owner and timing.
- No rule uses names, religion, caste, gender or similar.
- Confirmation messages carry no offer and go only to buyers who agreed to receive them.
- The prepaid offer passes the step 5 test for the segments it targets.
- The weekly tracker counts orders lost as well as parcels saved.
- No COD switched off, order cancelled or buyer messaged without the client's yes.

## Output

1. **One-screen summary:** current COD return-to-origin rate and cost per month, the rules proposed, expected parcels saved, expected orders lost, and the net change in gross profit per month.
2. **Rule table:** Rule ID, Segment (pincode or area, buyer history, product, pattern, source), Orders behind it, Return-to-origin rate, Break-even rate, Action, Owner, Timing, Review date.
3. **Break-even sheet:** SKU, Gross profit per delivered order, Return-to-origin cost, Break-even rate.
4. **Pincode risk sheet:** Pincode or area, COD orders, Delivered, Returned, Rate, Top failure reason, Action.
5. **Confirmation and failed-delivery timings card** for the team.
6. **Weekly tracker:** Week, COD orders, Allow, Confirm, Prepaid only, Hold, Cancelled, Return-to-origin rate per group, Orders lost, Net gross profit per COD order, Change made.

## Common mistakes

- **One return-to-origin limit for every product.** Step 1 sets break-even per product.
- **Blocking a pincode on five orders.** Step 2 rolls thin pincodes up to wider areas.
- **Putting a discount in the confirmation message.** Step 4 keeps it a utility message.
- **Prepaid offers to everyone.** Step 5 targets segments where they pay.
- **Ignoring failed deliveries until the parcel is back.** Step 6 acts within hours.
- **Counting parcels saved but not orders lost.** Step 8 tracks both.

## Sources

- MEA-0037, MEA-0023: gross margin on delivered cost.
- MEA-0028: accrue returns at the expected rate.
- OPS-6286: WhatsApp utility versus marketing templates.
- EML-0048: automated WhatsApp journeys in India versus broadcasts.
- CXP-0010: specific delivery dates.
- CXP-0014: tracking checks and proactive updates.

What makes this skill ours: the break-even return-to-origin rate is computed per product, so one pincode can be allowed for a high-margin item and prepaid-only for a thin one; thin pincodes roll up instead of being blocked on a handful of orders; the tracker counts orders lost as well as parcels saved; and the confirmation message stays a utility message so it is cheap and allowed.
