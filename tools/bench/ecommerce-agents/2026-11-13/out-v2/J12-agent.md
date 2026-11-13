# Snitch WhatsApp sales kit

## The money behind it

Per 1,000 orders (test figures): 600 are COD, 150 get refused, costing ₹27,000. Each COD order carries about ₹45 of expected RTO loss (25% x ₹180). So:

- Each COD order moved to prepaid saves about ₹45.
- Each 1-point drop in the COD refusal rate saves ₹1,080 per 1,000 orders.
- A ₹25 prepaid incentive pays while switched buyers would otherwise be refused more than 14% of the time (₹25 ÷ ₹180).

## 1. Templates to submit

English. Submit two days before go-live. Utility templates carry no offer, or Meta recategorises them as marketing.

| Name | Category | Body | Buttons |
|---|---|---|---|
| snitch_cod_confirm | Utility | Header: "Please confirm your COD order". Hi {{1}}, thanks for shopping with Snitch. Order {{2}}: {{3}}. Amount to pay in cash at delivery: ₹{{4}}. Address: {{5}}. Tap Confirm and we will ship it. Tap Cancel if you did not place this order. | Quick reply: Confirm order / Change address / Cancel order |
| snitch_cod_reminder | Utility | Hi {{1}}, your Snitch order {{2}} for ₹{{3}}, cash on delivery, is waiting for your confirmation. We will pack it as soon as you tap Confirm. | Same three as above |
| snitch_cod_cancelled | Utility | Hi {{1}}, we have cancelled order {{2}} because we could not confirm it. Nothing is due. If you still want it, reply here and we will help you order again. | None |
| snitch_prepaid_switch | Marketing | Thanks {{1}}, order {{2}} is confirmed. Want to skip cash at the door? Pay ₹{{3}} online now by UPI or card and save ₹25. The link works until your order is packed. Cash on delivery is still fine. | URL: Pay online, save ₹25 / Quick reply: Keep cash on delivery |
| snitch_cart_reminder_1 | Marketing | Header: "Your Snitch cart is saved". Hi {{1}}, you stopped at the delivery step for {{2}}. Expected delivery to {{3}}: {{4}}. Not sure about the size? Reply with your height and usual size and our team will help. | URL: Complete my order / Quick reply: Help with size |
| snitch_cart_reminder_2 | Marketing | Hi {{1}}, {{2}} is still in your cart. If the fit is not right after delivery, you can exchange it for another size. Pay online, or choose cash on delivery where your pincode allows it. | URL: Complete my order / URL: Exchange policy |
| snitch_out_for_delivery | Utility | Hi {{1}}, your Snitch order {{2}} arrives today. Please keep ₹{{3}} ready in cash, or pay online now and skip cash. Can't receive it today? Tell us and we will ask the courier to come again. | URL: Pay online now / Quick reply: Can't receive today |
| snitch_delivery_missed | Utility | Hi {{1}}, the courier could not deliver order {{2}} today. Reason given: {{3}}. Choose what works for you and we will arrange the next attempt. | Quick reply: Deliver tomorrow / Change address / Talk to our team |

Also submit snitch_out_for_delivery_paid for prepaid orders, without the cash sentence and Pay button. Bodies stay under 200 characters, buttons under 25.

Sample values for review: Rahul, #SN10482, Cotton shirt (L), 1,299, 14 MG Road, Indore 452001, 18 to 20 Nov, Customer not reachable.

## 2. Flow and timing

| Flow | Who gets it | When | Stops when |
|---|---|---|---|
| COD confirm | Every COD order, except buyers with an earlier delivered COD order and no refusals | Confirm within 15 minutes, any hour. Reminder at 4 hours (8 pm to 10 am waits for 10 am). Call at 24 hours, two tries. Cancel notice at 48 hours. | Buyer confirms, changes address or cancels |
| Prepaid nudge | Buyers who just tapped Confirm | Immediately, once. Link expires at packing, since the courier's cash amount cannot change after dispatch. | Paid, or Keep cash tapped |
| Cart recovery | Shoppers who left after the shipping step and opted in | Message 1 at 45 minutes. Message 2 about 22 hours later if no order or reply. Send only 10 am to 7 pm, while agents can answer; night drop-offs get message 1 at 10 am. | Order, opt-out, out of stock, or a cart message in the last 7 days. Two at most. |
| Out for delivery | Every order | At the courier's out-for-delivery scan | Delivered |
| Missed delivery | Any failed attempt | Within 2 hours of the failed scan; call next morning if no reply | Reattempt booked |

**Hold rule.** Tag unconfirmed COD orders "Awaiting confirmation" and hold them from packing. Ship confirmed ones the same day.

**Call script.** "Hi, is this {first name}? I'm {agent} from Snitch. You ordered {item} for ₹{total}, cash on delivery. I'm calling to confirm before we ship. Is that right?"

- Yes: read back address and landmark, give delivery dates, tag Confirmed.
- Wrong address or size: fix the order, read back the total, tag Address fixed or Confirmed.
- "I didn't order this": thank them, cancel, tag Not ordered. Never argue.
- No answer twice: let the 48-hour cancel run, tag No response cancelled.

Never ask for OTPs, card numbers or UPI PINs. One agent calls 11 am to 1 pm and 4 to 6 pm, orders above ₹2,600 and first-time buyers first.

**Proof it works.** For 2 weeks, ship a random 10% of queued COD orders unconfirmed. For 4 weeks, send nothing to a random 10% of eligible carts. Compare each with the rest.

## 3. Reply scripts for the five common questions

{Braces} come from the order, size chart or courier pincode check.

**1. Size and fit**
"What's your height, and which size do you usually wear in shirts or jeans?" Then: "For {product}, size {size} matches you on the size chart. It's a {fit} fit. Shall I send the link for {size}?"

**2. Delivery date**
"Send me your pincode and I'll check." Then: "To {pincode}, an order placed today should reach you {date range}. Want the link to order now?"

**3. Exchange policy**
"You can exchange for another size within {exchange window} of delivery. Start it here: {exchange link}. Want me to check your size first so it fits the first time?"

**4. COD availability**
"Yes, cash on delivery is available to {pincode}. We'll message you on WhatsApp to confirm before shipping. UPI also works, with no cash at the door. Shall I send the link?" If not available: "Cash on delivery isn't available to {pincode}, but UPI and cards are. Shall I send the link?"

**5. Order status**
"Let me check order {number}. It's {status} with {courier}, expected {date}. Track it here: {tracking link}. Anything else on this order?"

**Hand to a senior agent** when the buyer is upset, asks for a person, wants a bulk order, or the order is late. Say who will reply and when.

## 4. Numbers to watch every week

| Number | Start point | What to do with it |
|---|---|---|
| COD share of orders | 60% | Falling is good if orders per session hold. |
| COD refusal rate: confirmed, skipped, holdout | 25% | Parcels return 2 to 3 weeks late; book expected refusals at last month's rate. |
| RTO cost | ₹27,000 per 1,000 orders | Refused parcels x ₹180. |
| Confirm rate in 24 hours; cancels by reason | New | "Not ordered" rising from one ad source points to fake orders there. |
| Prepaid switch rate; incentive paid | New | Keep ₹25 while confirmed orders are refused over 14% of the time. |
| Cart recovery: extra orders versus holdout | New | Keep a message only if extra orders x gross profit beats its cost. |
| Template quality rating, blocks, opt-outs | New | Pause a template whose opt-outs rise two weeks running. |
| First reply time; chats by question; chats to orders | New | A growing question type needs a product page fix. |

**Keep confirmation if** (holdout refusal rate minus confirmed refusal rate) x ₹180 x confirmed orders is more than the week's message and call cost.

## Assumptions

- Checkout opt-in covers offers too. If it covers order updates only, run the utility templates and hold the marketing ones until the wording is fixed.
- The store can tag and hold orders; the provider can send a payment link for an existing COD order and look up delivery dates by pincode.
- Order volume, margin and message rates were not given: figures are per 1,000 orders, the incentive is priced on RTO cost alone, and no revenue is forecast.

## To confirm before go-live

1. Exchange window and conditions.
2. COD limits and non-COD pincodes.
3. Provider's utility and marketing rates.
4. Your approval of the ₹25 incentive and 48-hour cancel rule.
