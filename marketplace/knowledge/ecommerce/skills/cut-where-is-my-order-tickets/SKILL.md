---
name: cut-where-is-my-order-tickets
description: "A plan and the ready parts to remove most 'where is my order' tickets: the store's own order-status contact rate, where in the delivery path buyers get anxious, a tracking page on the store's domain, four proactive order messages (confirmed, shipped, out for delivery, delivered) with exact wording for email, SMS and WhatsApp, an order-status FAQ block, and the fulfilment fixes that messages cannot hide. Includes India COD and pincode delivery notes and US delay-notice rules, with a free path using Shopify's own notifications. Use when order status is the top ticket reason, contacts per order are rising, or the store is changing carrier or 3PL."
---

# Cut where-is-my-order tickets

**You get:** a one-page diagnosis of the store's order-status tickets, a tracking page spec, four proactive messages written in full per channel, an order-status FAQ block, and a before and after measure, ready to build at draft level.

## When to use

- "Where is my order" (WISMO) is the biggest ticket reason.
- Order-status contacts are above about 3% of orders.
- Buyers are sent to a carrier tracking page in another brand's colours, or get no shipping messages at all.
- The store is switching carrier, 3PL or courier aggregator.

## Not for

- Messages for orders that are already late or out of stock: use `delay-and-stockout-customer-messages`.
- Setting delivery dates and shipping rates at checkout: use `set-up-shipping-rates-and-delivery-promise`.
- Choosing between carriers: use `compare-shipping-carriers`.
- Writing the full help-centre FAQ: use `write-faq-from-tickets-and-reviews`; this skill writes only the order-status block.

## What you need

Required (read access, level 1):

1. **Ticket export, last 90 days**, with reason tags, created time and order number.
2. **Shopify order export**: Name, Created at, Fulfilled at, Shipping Method, Shipping Province or Zip, Payment Method, Tags.
3. **Carrier or aggregator tracking export**: order number, pickup scan, in-transit scans, out-for-delivery, delivered, exceptions (NDR in India).
4. **Current notifications**: Shopify notification templates in use, any SMS or WhatsApp order messages, the tracking link sent today.
5. **Delivery promise** shown on product page and checkout.

Optional: a tracking app already installed, CSAT on order-status tickets.

If the carrier export is missing, use Shopify's fulfilment and delivery dates for 200 recent orders. Editing notifications and the tracking page needs draft access (level 2); turning on new messages to buyers needs the client's yes.

## Before you start: the gates

1. **Promise versus reality.** Measure how often orders arrive by the promised date. If fewer than 9 in 10 do, fix the promise or fulfilment first: one card says keep delivery accuracy above 90% [CXP-0010]. Messages that keep saying "on its way" past the promised date make tickets worse.
2. **Dispatch is on time.** If orders sit more than the stated handling time before pickup, the fix is in the warehouse or 3PL, not in messages. Put a "picked on time" standard in the 3PL agreement [OPS-0015].
3. **Message consent.** Order updates are transactional, but SMS and WhatsApp still need the buyer's number given for that purpose, and WhatsApp needs opt-in and an approved utility template [CXP-6302].
4. **Cash.** A paid tracking app is optional. The free path uses Shopify's order status page and notifications.

## Steps

### 1. Measure the store's own rate

WISMO rate = order-status tickets in a month / orders shipped that month. Under 3% is healthy, 3 to 8% normal but costly, above 8% structural [CXP-0012]. Also record the share of all tickets.

### 2. Find when buyers ask

For each WISMO ticket, find the last tracking scan before it arrived. Bucket them:

| Moment | Typical cause | Fix in this skill |
|---|---|---|
| Before dispatch | No shipped message, slow handling | Confirmed message with dispatch date |
| Shipped, no scans for days | Label made but not picked up, or slow first scan | Shipped message sent on first carrier scan, not label creation |
| In transit, quiet | Long gaps between scans | Tracking page with expected date, mid-transit update |
| Out for delivery or failed attempt | Missed courier, wrong address | Out-for-delivery message with what to do if missed |
| Marked delivered, not received | Wrong door, neighbour, theft | Delivered message with "not received?" link |

The biggest bucket is where to start.

### 3. Build the tracking page

Buyers check tracking about 4.6 times per order, and three proactive updates plus a branded tracking page are reported to cut these tickets 40 to 60% [CXP-0014]; those are vendor figures, so measure the store's own change. Spec:

- On the store's domain, reached from every message and the account page.
- Top: order number, items, the expected delivery date as a date, and the current step in plain words ("Packed, leaves our warehouse Tuesday").
- Then: scan history in local time, carrier name and tracking number.
- Then: the three questions buyers ask at that step, answered (see step 5).
- Bottom: a single "Still need help?" button that opens a pre-filled ticket with the order number.
- Optional: one product-use tip or a care guide link. No discount banners on a page for people who have not received their order.

Free path: Shopify's order status page with the tracking link and a custom message block; paid path: any tracking app that hosts the page on the store domain.

### 4. Write the four proactive messages

Specific dates beat vague ranges [CXP-0010]. Each message has one job.

1. **Confirmed** (at order): "Thanks, [name]. Order [number] is confirmed. We pack it by [date] and you should have it by [date]. Track it any time: [link]."
2. **Shipped** (on first carrier scan): "Your order is on its way with [carrier]. Expected [date]. Track: [link]."
3. **Out for delivery**: "Arriving today. If you will be out, [what the carrier allows]. Track: [link]."
4. **Delivered**: "Delivered at [time]. Not with you? Check [porch, reception, neighbour] and tap here within 48 hours: [link]."

Add a mid-transit note only on lanes where scans go quiet for more than two days: "Still moving. No new scan since [date] is normal on this route; expected [date]."

Channels: email for all four; SMS or WhatsApp for shipped and out for delivery, where the buyer gave a number. Keep SMS under 160 characters with no emoji.

### 5. Write the order-status FAQ block

Six to eight answers, each two sentences, used on the tracking page, in order emails and in the help centre: when does my order ship; why is tracking not moving; can I change my address; it says delivered but I do not have it; can I get it faster; what if I am not home; (India) can I pay cash at the door; (India) the courier did not call. Answers must match the policies and carrier rules exactly.

### 6. Fix what messages cannot

List each fulfilment issue found in step 2 with an owner: late pickups, lanes with long silent gaps, a carrier with high failed-delivery rates. Vet the 3PL on error rate and peak throughput [OPS-0008]. Send carrier problems to `compare-shipping-carriers`.

### 7. India and US notes

- **India:** COD buyers get a call or WhatsApp from the courier; the out-for-delivery message says to keep cash or UPI ready and gives the courier's contact if the aggregator shares it. Failed delivery (NDR) gets its own message asking the buyer to confirm address or a new date within 24 hours, since each failed attempt raises return-to-origin risk; send RTO work to `cut-rto-on-cod-orders`. Add pincode-level expected dates if lanes differ a lot. Offer messages in the buyer's language where the store supports it.
- **US:** if an order will miss the stated ship date, the FTC mail order rule expects a delay notice with the option to cancel and a prompt refund (general practice, not a legal ruling); hand those messages to `delay-and-stockout-customer-messages`.

### 8. Measure

Record WISMO rate for 4 weeks before and 4 weeks after launch, on similar order volume. Target: under 3% of orders, or half the starting rate, whichever is higher. If the rate does not fall, go back to step 2: the cause is probably fulfilment.

## Checks before you hand it over

- WISMO rate and share of tickets measured from the store's own data.
- Tickets bucketed by delivery moment, with the biggest bucket addressed first.
- Every message gives a date, not a range like "3 to 7 days" alone.
- Shipped message fires on first carrier scan, not label creation.
- Tracking page is on the store domain and has a pre-filled help button.
- FAQ answers match live policy and carrier rules word for word.
- Fulfilment issues have owners; no message hides a late warehouse.
- No message goes live without the client's yes.

## Output

**One-screen summary:** WISMO rate now, the biggest anxiety moment, the three changes to ship first and the target rate.

**Diagnosis table:** Moment, Tickets, Share, Main cause, Fix, Owner.

**Message set:** Message, Trigger event, Channel, Text, Character count, Link, Template category (WhatsApp).

**Tracking page spec** and **FAQ block** as written in steps 3 and 5.

**Measure sheet:** Week, Orders shipped, WISMO tickets, WISMO rate, Delivered on time %.

## Common mistakes

- **Sending "shipped" when the label prints.** Buyers see no scans and write in; step 4 waits for the first scan.
- **Ranges instead of dates.** A date the store usually beats works better [CXP-0010].
- **Messages covering a slow warehouse.** Gate 2 and step 6 fix dispatch first.
- **Carrier-branded tracking.** Step 3 keeps buyers on the store's page.
- **Selling on the tracking page.** Buyers waiting for an order want answers, not offers.

## Sources

- CXP-0010: specific delivery dates and 90% accuracy.
- CXP-0012: WISMO rate bands and share of tickets.
- CXP-0014: tracking views per order and proactive updates.
- CXP-6302: WhatsApp opt-in and templates.
- OPS-0008: vet a 3PL on error rate and peak throughput.
- OPS-0015: picked-on-time standard in the 3PL agreement.

What makes this skill ours: tickets are bucketed by the last tracking scan to find the exact anxious moment; the shipped message waits for the first real scan; fulfilment problems are fixed before messages hide them; and India gets COD, NDR and pincode-level handling.
