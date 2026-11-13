---
name: delay-and-stockout-customer-messages
description: "Ready-to-load messages and triggers for every late or out-of-stock moment: dispatch delays, items oversold after purchase, split shipments, stuck parcels, failed delivery, peak cut-offs, pre-order date slips, back-in-stock alerts, and orders that will never ship, each with its trigger rule, channel, timing, the buyer's choice to wait or cancel, and the make-good rule. Written to meet US delay-notice rules and WhatsApp template rules, with India notes on SMS registration and languages. Use when late orders flood support, a stockout or courier problem hits, before peak season, or when setting up order notifications."
---

# Delay and stockout messages

**You get:** a trigger table (event, rule, channel, send time, owner) and a filled message set of 10 messages in email, SMS and WhatsApp versions, each with a wait-or-cancel choice where needed, plus a make-good rule card for support and a one-screen summary for the client to approve.

## When to use

- Late orders are driving "where is my order" tickets and angry reviews.
- A product oversold, a shipment is stuck at port, or a courier is failing in a region.
- Peak season, a festival or a weather event is coming and cut-offs need to go out.
- Pre-order or backorder dates are slipping.
- The store is setting up order notifications for the first time.

## Not for

- Tracking pages and the full plan to cut order-status tickets: use `cut-where-is-my-order-tickets`.
- Setting up pre-orders and backorders: use `set-up-pre-orders-and-backorders`.
- Replies for every other ticket type: use `build-support-macros-from-top-tickets`.
- Marketing texts and WhatsApp campaign templates: use `write-sms-and-whatsapp-messages`.

## What you need

Required:

1. **Order and fulfilment data**: Shopify order export with Created at, Fulfillment Status, Fulfilled at, Shipping Country, Payment Method; plus courier tracking events (last scan, estimated delivery, failed-delivery reason).
2. **The store's promises**: dispatch time, delivery promise by region, pre-order dates, policy pages.
3. **Channels and consent**: which buyers agreed to SMS or WhatsApp, the WhatsApp Business provider, registered SMS sender and templates (India DLT).
4. **Brand voice**: five real lines from the store's emails or site.
5. **Make-good budget**: what support may give without asking.

Optional: ticket tags for delays, peak cut-off dates from carriers, languages buyers use.

Messages and automations are built at draft access (level 2). Turning them on, sending to buyers or giving credits needs the client's yes.

## Before you start: the gates

1. **Promise is known.** Pass when each order has a promised dispatch or delivery date. Fail: set the promise first with `set-up-shipping-rates-and-delivery-promise`; a delay message needs something to be late against.
2. **Consent per channel.** Pass when SMS and WhatsApp go only to buyers who agreed, and Indian SMS templates are registered. Fail: email only until fixed.
3. **US delay rule.** Pass when US buyers get a wait-or-cancel choice before the promised date passes [CXP-6160]. Fail: fix the trigger timing before anything else.
4. **Capacity.** Pass when someone answers replies within one working day. Fail: send fewer, plainer messages with self-serve links.

## Steps

### 1. Map the triggers

| # | Event | Trigger rule | Send |
|---|---|---|---|
| 1 | Dispatch delay | Unfulfilled 1 working day past promised dispatch | Same day, before the promise breaks if known earlier |
| 2 | Oversold item | Item at zero or below at the fulfilling location after purchase | Within 24 hours of finding it |
| 3 | Split shipment | Part shipped, rest waiting | With the first tracking message |
| 4 | Stuck parcel | No scan for 3 days, or estimated delivery passed | Day 3 of no scan |
| 5 | Failed delivery | Courier reports failed attempt | Within 2 hours |
| 6 | Peak or weather cut-off | Known cut-off or regional disruption | 7 days and 2 days before the cut-off; on the event |
| 7 | Pre-order date slip | New arrival date later than promised | Before the old date passes |
| 8 | Back in stock | Buyer signed up; stock above zero | Within 1 hour of restock |
| 9 | Will never ship | Supplier cancelled or item discontinued | Same day as known, with refund |
| 10 | Lost parcel | Courier confirms loss, or 7 days past estimated delivery with no scan | Same day |

The day counts are practitioner defaults; tune them to the courier's normal scan gaps.

### 2. Set the rules each message must follow

- **Say what happened, the new date, and what the buyer can do**, in that order. One message, one action.
- **Give a real choice** when the order is late: wait for the new date or cancel for a full refund, with a one-tap cancel link. For US buyers, a first delay of 30 days or less can treat silence as agreement; a longer or open-ended delay must say the order will be cancelled if they do not reply, and a second delay needs a fresh yes [CXP-6160].
- **No swaps without a yes.** Never send another colour or size unless the buyer agrees, and refund to the original payment method, not store credit, unless they choose credit [OPS-6281].
- **Keep offers out of WhatsApp order updates.** A delay update with a credit or code in it counts as marketing, not utility [OPS-6286]. Send any make-good by email, or as a separate step once the buyer replies.
- **Be early.** Proactive updates cut order-status contacts sharply [CXP-0014]; a contact rate above 8% of orders points to a broken process, not a messaging gap [CXP-0012].
- **Plain and low-effort.** Every message carries the order number, the new date and a link that works on a phone. Effort, not lack of delight, drives disloyalty [CXP-0009].

India notes: send in English plus the buyer's language where the store has it (Hindi and the main regional languages of its top states); keep SMS within registered DLT templates. For COD orders, say the amount due on delivery stays the same. US notes: transactional texts still need the buyer's number given for order updates; keep marketing out of them.

### 3. Write the message set

Fill each message in the brand's voice; keep the structure. Email versions add a short subject. SMS versions stay under 160 characters.

**1. Dispatch delay (WhatsApp or SMS)**
"Hi {first_name}, your order {order_number} is taking longer to pack than we promised. New dispatch date: {new_date}. Happy to wait? No need to reply. Prefer a full refund? Tap {cancel_link}. Sorry for the wait. {store_name}"

**2. Oversold item (email, subject: "An item in order {order_number} is delayed")**
"We sold more {product_name} than we had, and that's on us. The rest of your order {ships now / ships together on {date}}. Your choices: wait until {new_date}, swap for another item ({swap_link}), or cancel this item for a full refund to your original payment ({cancel_link}). If we don't hear from you, we'll {hold it until {new_date} / cancel and refund by {date}}."

**3. Split shipment**
"Part of order {order_number} is on its way: {tracking_link}. {product_name} follows by {date}; you won't pay extra shipping."

**4. Stuck parcel**
"Your parcel for order {order_number} hasn't moved since {last_scan_date}. We've raised it with {courier}. Next update by {date}. If it doesn't move by then, we'll send a replacement or refund, your choice."

**5. Failed delivery**
"{courier} couldn't deliver order {order_number} today ({reason}). Pick a new day or fix the address here: {reattempt_link}. {For COD: Please keep {amount} ready.}"

**6. Peak or weather cut-off**
"Order by {date} to get it before {festival or holiday}. After that, orders ship from {date}. {Region} deliveries may run {n} days late because of {reason}."

**7. Pre-order date slip**
"Your pre-order {product_name} (order {order_number}) is now due to ship by {new_date}, not {old_date}, because {reason}. Wait or cancel for a full refund: {cancel_link}. {US, over 30 days: If we don't hear from you by {date}, we'll cancel and refund in full.}"

**8. Back in stock** (only to people who signed up)
"{product_name} is back in stock: {link}. Stop these alerts: {opt_out}." Add a stock line only if it is true, such as "Only sizes S and M came back."

**9. Will never ship**
"We can't get {product_name} again, so we've cancelled it from order {order_number} and refunded {amount} to your original payment. It should show in {n} working days."

**10. Lost parcel**
"Order {order_number} is lost in transit. We're sorry. Choose a replacement sent today ({replace_link}) or a full refund ({refund_link})."

### 4. Set the make-good rule card

- Late by 1 to 3 days: apology only.
- Late beyond the promise by 4+ days, or a lost or oversold item: free shipping refund or a small credit, within a no-approval budget; giving reps a small fixed budget per incident lets them fix problems on the spot [OPS-0009].
- Never promise a recovery that beats a smooth order; recovery rarely leaves buyers happier than no problem at all [CXP-0011]. Fix the cause.

### 5. Handle stockouts before purchase

On the product page: show "Sold out" with a back-in-stock sign-up (email, or SMS or WhatsApp with consent), and an expected date only if a purchase order is confirmed. At peak, if a product will sell out early, hiding it can protect the rest of the season [OPS-0019].

### 6. Load, test and watch

Load the triggers in the helpdesk, Shopify Flow or the messaging app. Test each message on a real phone with a test order. Each week, count sends per trigger, cancels after a delay message, replies needing a person, and order-status tickets per 100 orders. A trigger that fires often is a process problem: send it to `pick-pack-ship-sop`, `compare-shipping-carriers` or `set-reorder-points-and-safety-stock`.

## Checks before you hand it over

- Every message has a trigger rule, channel, send time and owner.
- Every late-order message gives the new date and a one-tap cancel for a full refund.
- US delay messages follow the first and renewed notice rules.
- No WhatsApp order update contains a discount, credit or code.
- No message swaps an item or pays a refund as credit without the buyer choosing it.
- SMS and WhatsApp go only to buyers who agreed; India SMS fits registered templates.
- Each message was tested on a phone with a real link.
- Nothing is switched on or sent without the client's yes.

## Output

1. **One-screen summary:** the 10 triggers, channels, make-good rule, and the go-live list.
2. **Trigger table:** #, Event, Trigger rule, Channel, Send time, Template name, Owner, Weekly count.
3. **Message set:** each of the 10 in email, SMS and WhatsApp versions, with placeholders named exactly as the sending tool uses them.
4. **Make-good rule card** for support.
5. **Weekly tracker:** Week, Sends per trigger, Cancels after delay, Replies to a person, Order-status tickets per 100 orders, Root cause sent to.

## Common mistakes

- **Telling buyers after the date passes.** Step 1 fires before the promise breaks.
- **No way to cancel.** Step 2 puts a cancel link in every late-order message.
- **A coupon inside a WhatsApp delay update.** Step 2 keeps offers out.
- **Swapping colour or size to "save" the order.** Step 2 needs the buyer's yes.
- **Heavy credits that hide a broken process.** Step 4 caps make-goods and step 6 fixes causes.
- **Back-in-stock alerts to people who never signed up.** Message 8 goes to sign-ups only.

## Sources

- CXP-6160: US delay notices, silence and renewed consent.
- OPS-6281: no swaps without agreement; no store-credit refunds.
- OPS-6286: WhatsApp delay updates with offers count as marketing.
- CXP-0014: proactive updates cut order-status tickets.
- CXP-0012: healthy order-status contact rates.
- CXP-0009: low effort drives loyalty.
- CXP-0011: service recovery rarely beats no problem.
- OPS-0009: no-approval budget for reps.
- OPS-0019: hiding items at peak to avoid selling out.

What makes this skill ours: every late-order message carries a real wait-or-cancel choice timed to US notice rules; offers stay out of WhatsApp order updates so they remain utility messages; make-goods are capped and each frequent trigger is sent back to the process that caused it; and India COD, SMS registration and language notes are built in.
