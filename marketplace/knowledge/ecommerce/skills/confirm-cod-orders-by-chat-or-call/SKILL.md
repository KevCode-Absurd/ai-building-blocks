---
name: confirm-cod-orders-by-chat-or-call
description: "A daily routine and full scripts for confirming cash-on-delivery orders before they ship: which orders to confirm, the WhatsApp or SMS confirmation message (kept a utility message with no offer), reminder and call timings, a call script with branches for wrong address, changed mind, not ordered and no answer, a separate prepaid offer sent only after the buyer confirms, the outcome tags to record in Shopify, and a weekly read that checks the routine saves more than it costs. Use when return-to-origin losses are high, fake or doubtful COD orders are getting shipped, or a team confirms orders by hand with no script or timing."
---

# Confirm COD orders by chat or call

**You get:** a written COD confirmation routine for the team: a queue rule, a timing card, a confirmation message, a reminder, a call script with 6 branches, a post-confirmation prepaid message, 7 outcome tags, a cost check and a weekly tracker that shows parcels saved and orders lost.

## When to use

- Many COD parcels come back as refused or "customer not available".
- Fake orders, joke orders or duplicate orders get shipped.
- The team calls buyers but each person says something different and nothing is recorded.
- `cut-rto-on-cod-orders` put a segment into "confirm first" and the team needs the wording and routine.

## Not for

- Deciding which pincodes, products or buyers need confirmation, COD fees or prepaid-only rules: use `cut-rto-on-cod-orders`.
- COD settings and prepaid nudges at checkout: use `cod-and-prepaid-checkout-for-india`.
- Card testing and organised fraud: use `stop-fake-orders-and-card-testing`.
- Telling Meta to optimise for confirmed orders: use `meta-ads-for-cod-stores`.

## What you need

Required:

1. **Shopify order export**, last 90 days: Name, Created at, Payment Method, Financial Status, Fulfillment Status, Total, Shipping Zip, Phone, Tags, Cancelled at.
2. **Courier or aggregator report** for the same orders: delivered, RTO, failed-delivery reasons.
3. **Gross profit per COD order** and **cost per RTO parcel** (forward and return shipping, COD handling fee, packaging, damage), from `build-sku-profit-sheet` or `returns-and-rto-cost-analysis`.
4. **The confirm rule** from `cut-rto-on-cod-orders`. Missing: use the starter rule in step 1 and mark it provisional.
5. **Messaging route**: WhatsApp Business Platform through a provider, or SMS with registered templates, plus a phone line for calls.

Optional: past confirmation logs, the checkout app's risk score, team hours.

Access: reading orders is level 1. Tagging orders, holding fulfilment and sending confirmation messages are level 2 actions the client approves once as a routine; cancelling an order needs the routine's rule written and approved by the client first.

## Before you start: the gates

1. **Money case.** Expected saving per confirmed order = (RTO rate without confirmation minus RTO rate with it) x cost per RTO parcel. It must be higher than the cost per confirmation (message cost plus call minutes plus staff time). Use the store's own delivered gross profit, not order value [MEA-0037]. Fail: confirm only the riskiest segment.
2. **Consent and template.** Buyers agreed at checkout to order updates on WhatsApp or SMS; WhatsApp needs opt-in and must honour every stop request [EML-6320]. In India, SMS templates must be registered under the DLT rules. Fail: confirm by call only until fixed.
3. **Capacity.** Calls a day x minutes per call fits the staffed hours. Fail: narrow the queue to the highest-risk orders.
4. **Fulfilment hold works.** Unconfirmed orders can be held, not shipped. In Shopify, COD orders stay unpaid until cash is collected [SET-6186], so use a tag and a fulfilment hold, not payment status. Fail: fix the hold first.

## Steps

### 1. Build the daily queue

Use the rule from `cut-rto-on-cod-orders`. Starter rule if none exists (practitioner default, test it): confirm every COD order except buyers with an earlier delivered COD order and no RTO; always confirm orders above twice the median COD value, repeat orders to the same phone within 24 hours, and pincodes with an RTO rate above the product's break-even.

### 2. Send the confirmation message

Within 15 minutes of the order. On WhatsApp this is a utility template, and it must carry no offer, or it becomes a marketing message [OPS-6286] [EML-6322].

> Hi [first name], thanks for your order [#1234] with [store]. Items: [items]. Amount to pay in cash at delivery: Rs [total]. Address: [address], [pincode]. Expected delivery: [date range]. Please confirm so we can ship it.
> Buttons: Confirm order / Change address / Cancel order

SMS version: under 160 characters with a short confirm link.

### 3. Follow the timing card

| Time after order | Action |
|---|---|
| 15 minutes | Confirmation message |
| 4 hours, no reply | One reminder message |
| 24 hours, no reply | Call, up to 2 attempts at different times |
| 48 hours, not confirmed | Cancel with a polite message saying so, and how to reorder |

Timings match `cut-rto-on-cod-orders` and are practitioner defaults; test them. Calls go between 10 am and 8 pm local time (practitioner default) unless the buyer asks otherwise.

### 4. Make the call

> "Hi, am I speaking with [first name]? This is [agent] from [store]. You placed an order for [item] for Rs [total], cash on delivery. I'm calling to confirm it before we ship. Is that right?"

Branches:

| Buyer says | Agent does |
|---|---|
| Yes | Read back address and landmark, confirm someone will be there with Rs [total] in cash, give the delivery date range, tag Confirmed |
| Wrong address or phone | Take the corrected address in the buyer's words, update the order, tag Address fixed |
| Wants a different size or colour | Edit the order, read back the new total, tag Confirmed |
| Not sure | Offer to hold the order 24 hours; one more message the next day; then cancel |
| "I didn't order this" | Thank them, cancel, tag Not ordered; never argue |
| No answer twice | Send a message saying the order will be cancelled in 24 hours unless confirmed |

Never mention internal risk labels, never pressure, and never ask for card numbers, OTPs or UPI PINs. If the buyer has a product question, answer from `write-chat-sales-scripts`.

### 5. Offer prepaid only after confirmation

When the buyer taps Confirm or replies, the 24-hour customer service window opens [EML-6322], so the agent can send one separate, plain message in the chat:

> "Thanks, your order is confirmed. If you'd rather pay now by UPI or card and skip cash at delivery, here's a secure link: [gateway link]. Paying now gets [real benefit, e.g. Rs 30 off / priority dispatch]. Cash on delivery is fine too."

Set the benefit with `cut-rto-on-cod-orders`: it must cost less than the expected RTO loss it removes. Do not send this as part of the confirmation template.

### 6. Record every outcome

Tag each order with exactly one outcome: Confirmed, Confirmed and paid prepaid, Address fixed, Cancelled by buyer, Not ordered, No response cancelled, Held. Only Confirmed, Paid and Address fixed orders move to fulfilment.

### 7. Read it weekly

Each week: COD orders, share in the queue, confirm rate, cancel rate by reason, prepaid conversion after confirmation, RTO rate for confirmed versus auto-allowed orders, cost of the routine, and net gross profit per COD order. Accrue expected RTO on this week's orders at the segment's rate rather than waiting for parcels to return [MEA-0028].

To know what confirmation itself saves, the client may approve a 2-week holdout: 10% of queued orders, picked at random, shipped without confirmation (practitioner default). Without it, compare against the 4 weeks before, and say the comparison is rough. Automated WhatsApp journeys have drawn far more engagement than broadcasts in India [EML-0048], so if calls cost more than messages, move effort to messages and keep calls for no-replies.

### India and US notes

- **India:** most of this skill. Write the message in the buyer's checkout language where the store supports it; keep amounts in rupees including GST; give a delivery date range the courier usually meets.
- **US and other card-first markets:** COD is rare. A phone check is worth it only for high-value orders flagged by `stop-fake-orders-and-card-testing`; follow US calling and texting consent rules.

## Checks before you hand it over

- The confirmation template carries no offer or discount.
- The prepaid message is separate and sent only after a buyer reply.
- Timing card, call script and branches are written out in full.
- Every order ends with exactly one outcome tag.
- Unconfirmed orders are held from fulfilment.
- The money case shows saving per confirmed order above cost per confirmation.
- Cancellation rule and wording are approved by the client.

## Output

1. **One-screen summary:** orders to confirm per day, expected cost, expected saving, the queue rule, and the 3 changes to make this week.
2. **Timing card** (step 3) and **message set**: confirmation, reminder, cancellation notice, prepaid message.
3. **Call script** with the branch table.
4. **Outcome tag list** for Shopify.
5. **Weekly tracker:** Week, COD orders, Queued, Confirmed, Paid prepaid, Address fixed, Cancelled (by reason), RTO rate confirmed, RTO rate allowed, Routine cost, Net gross profit per COD order, Change made.

## Common mistakes

- **An offer inside the confirmation template.** Step 2 keeps it utility; step 5 sends the offer separately.
- **Confirming every order, including loyal buyers.** Step 1 skips buyers with clean delivered history.
- **Calls with no record.** Step 6 tags one outcome per order.
- **Arguing with "I didn't order this".** Step 4 cancels and moves on.
- **Judging the routine on confirm rate.** Step 7 judges RTO saved against cost.
- **Shipping while waiting.** Gate 4 holds unconfirmed orders.

## Sources

- MEA-0037: gross margin is the delivered cost to the door.
- EML-6320: WhatsApp opt-in and stop requests.
- OPS-6286: an offer turns a utility template into marketing.
- EML-6322: 24-hour customer service window and template categories.
- SET-6186: Shopify COD orders stay unpaid until marked paid.
- MEA-0028: accrue returns at the expected rate.
- EML-0048: automated WhatsApp journeys in India beat broadcasts.

What makes this skill ours: the prepaid offer rides in the free 24-hour window opened by the buyer's own confirmation instead of spoiling the utility template; every order ends in one outcome tag; the routine must show RTO saved above its own cost; and a small holdout tells the store whether confirmation is really what cut returns.
