# Snitch WhatsApp plan: COD confirmation, prepaid nudge, cart recovery, delivery day

## The point in three lines

- COD refusals cost about ₹11.2 lakh a month: 6,240 refused parcels x ₹180. Tier 3 towns are 31% of COD orders but half of that cost (₹5.5 lakh).
- So every COD order gets a confirm-or-cancel message. Tier 3 orders ship only after a yes. A prepaid offer goes only to tier 2 and tier 3 buyers, after they confirm.
- Cart and delivery messages answer what buyers ask most: fit, COD and "when will it come?" No discounts, no fake stock alerts.

| Pincode group | COD orders a month | Refused parcels | Cost a month | Loss per COD order |
|---|---|---|---|---|
| Metro | 10,080 | 1,512 | ₹2.7 lakh | ₹27 |
| Tier 2 | 7,308 | 1,681 | ₹3.0 lakh | ₹41 |
| Tier 3 and rural | 7,812 | 3,047 | ₹5.5 lakh | ₹70 |

**Assumptions:** opt-in is taken before the shipping step; your provider can pull the courier's date range per pincode; you can lower an order's amount when a buyer pays online; exchange is 7 days from delivery, started from the order page.

## 1. COD order confirmation

| When | Metro and tier 2 | Tier 3 and rural |
|---|---|---|
| 15 min after order | `snitch_cod_confirm` (replaces "order placed" for COD) | Same |
| 4 hours, no reply | `snitch_cod_reminder` | Same |
| 24 hours, no reply | Ship it | `snitch_cod_final_notice`, order on hold |
| 48 hours, no reply | | Cancel, send `snitch_cod_cancelled` |

- Skip repeat buyers like Arjun whose past COD orders were all delivered. They get "order placed" only.
- A Cancel tap stops the order at once. Each one is a parcel that never comes back.
- Change address opens a chat. The bot takes the full address and pincode and tags the order "Address fixed."

**Templates (all Utility, English, no offer in any)**

`snitch_cod_confirm`
- Header: Confirm your COD order
- Body: Hi {{1}}, your Snitch order {{2}} is in. Items: {{3}}. Pay ₹{{4}} in cash at delivery. Address: {{5}}. Usually arrives {{6}}. Tap Confirm and we pack it.
- Buttons (quick reply): Confirm order / Change address / Cancel order
- Samples: Vikram / #SN48213 / 1 Oversized Shirt (M) / 1,299 / 12 MG Road, Indore 452001 / 18 to 21 Nov

`snitch_cod_reminder`
- Body: Hi {{1}}, quick check on order {{2}}. ₹{{3}}, cash on delivery. We pack it as soon as you confirm.
- Buttons: Confirm order / Cancel order

`snitch_cod_final_notice`
- Body: Hi {{1}}, we still need a yes for order {{2}}. If we don't hear back by {{3}}, we will cancel it. You pay nothing.
- Buttons: Confirm order / Cancel order
- Sample for {{3}}: 7 pm, 16 Nov

`snitch_cod_cancelled`
- Body: Hi {{1}}, order {{2}} is cancelled because it was not confirmed. Still want it? Order again any time.
- Button (URL): Order again, to the product link

## 2. Nudge to switch to prepaid

**Who and when:** tier 2 and tier 3 buyers, right after they tap Confirm. The tap opens a 24-hour chat window, so this goes as a normal chat message. An offer inside a utility template would turn it into marketing. No nudge for metro: at ₹27 loss an order, a discount costs more than it saves.

**Offer:** ₹30 off in tier 3, ₹20 off in tier 2. The ₹30 pays if switchers would have refused at 17% or more; the ₹20 pays at 11% or more. Today's rates are 39% and 23%, a buffer because switchers are safer than average.

`snitch_prepaid_switch` (chat message in the window; if your provider only sends templates in automations, submit it as Marketing)
- Body: Confirmed, {{1}}! Want to skip cash at the door? Pay now by UPI or card and get ₹{{2}} off. Cash on delivery is still fine too.
- Buttons: Pay now, skip cash (URL to this order's payment link) / Keep COD

## 3. Cart recovery

About 18,000 carts a month drop after the shipping step (42,000 orders ÷ 70% x 30%). Message opted-in numbers only.

| Message | When | Do not send if |
|---|---|---|
| 1 | 45 minutes after drop-off, 9 am to 9 pm; later drops go at 10 am | Order placed, opted out, item sold out, or a cart message in the last 7 days |
| 2 | Next day, 11 am to 7 pm, if no reply and no order | Same |

Two messages per cart at most, no discount. Hold back 10% of carts at random for 4 weeks to see the real lift.

`snitch_cart_reminder_1` (Marketing)
- Body: Hey {{1}}, your {{2}} is still in your cart 👀 Size doubt? Tap Help with size and we will match it for you. COD works on your pincode.
- Buttons: Complete my order (URL, cart link) / Help with size / Stop offers
- For prepaid-only pincodes, submit `snitch_cart_reminder_1_prepaid` without the last line.

`snitch_cart_reminder_2` (Marketing)
- Body: {{1}}, not sure it will fit? Tell us your size in any brand and we will match it for this style. Wrong size later? Exchange it from your order page within 7 days.
- Buttons: Back to my cart (URL) / Match my size / Stop offers

## 4. Shipping and delivery day

These take on "Where is my order?", 44% of chats (about 4,900 a month).

| Template (Utility) | When | Body | Buttons |
|---|---|---|---|
| `snitch_order_shipped` | Courier pickup scan | Hi {{1}}, order {{2}} has shipped. Usually arrives {{3}}. Payment: {{4}}. | Track order (URL) |
| `snitch_out_for_delivery` | Out-for-delivery scan, from 8 am | {{1}}, your Snitch order {{2}} arrives today 📦 Payment: {{3}}. Not home? Tap below and we will ask the courier for another try. | Track order (URL) / Not home today |
| `snitch_delivery_missed` | Within 2 hours of a failed-attempt scan | We missed you, {{1}}. The courier could not deliver order {{2}} today. Reason given: {{3}}. Pick what works. | Try again tomorrow / Fix my address / Talk to us |

Samples: Arjun / #SN50117 / 18 to 20 Nov / ₹1,299 cash at delivery (or "Paid online") / Address not found.

"Fix my address": the bot collects it and asks the courier to retry. Dates always come from the courier.

## 5. Reply scripts for the 5 common questions

Load these as quick replies. After 8 pm, when 31% of chats arrive (about 3,500 a month), the bot sends the first line.

**Order status (44%)**
"Your order {{order}} is on its way. Track it live here: {{tracking link}}."

**Size and fit (21%)**
"Fit changes from style to style. Which size do you wear in other brands? Send me the product link too, and I'll check this style's measurements for you."
Then: "Go with {{size}}. If it doesn't fit, exchange is easy within 7 days."

**Exchange (14%)**
"Exchange easy hai. Within 7 days of delivery, open your order page, tap Exchange and pick the new size. Want the link?"

**COD available? (11%)**
"Haan, we do COD. Send your pincode and I'll confirm it for your area. UPI works too if that's easier."
If COD is off there: "COD isn't open for this pincode right now. UPI or card works, and exchange is just as easy."

**Delivery date (10%)**
"Send your pincode and I'll share the date range our courier gives for it."
Then: "For {{pincode}}, it usually arrives {{date range}}. You'll get a WhatsApp when it ships and on delivery day."

**Away message (8 pm to 10 am):** "Hey! Our team is back at 10 am. Tap Track order for live status, or leave your question and we'll reply first thing."

**Hand-off:** a person takes any complaint, damaged item, refund, payment problem, or a buyer who asks for one. The bot posts a one-line summary so the buyer never repeats himself.

## 6. Numbers to watch every week

| Number | How to read it | Today |
|---|---|---|
| COD refusal rate, by pincode group | Refused ÷ (delivered + refused) | 15% / 23% / 39% |
| Confirm rate and cancel taps | ÷ confirmation messages sent | New |
| Tier 3 orders cancelled for no reply | Orders lost, not just parcels saved | New |
| Prepaid switch rate | Paid online ÷ nudges sent, by group | New |
| Refusal cost saved vs offer cost | (Drop in refusals x ₹180) − (switches x offer) | New |
| COD share of orders | COD ÷ all orders | 60% |
| Cart recovery lift | Order rate, messaged minus held-back carts | New |
| "Where is my order?" share of chats | WISMO chats ÷ all chats | 44% |
| Median first reply, 10 am to 8 pm | From the inbox | 52 minutes |
| Opt-outs, blocks, template quality rating | From the provider | New |

One point off the COD refusal rate saves about 252 parcels and ₹45,000 a month. Loosen the tier 3 hold if no-reply cancels cost more than the refusals they prevent.

**Rollout:** submit all templates on day 1 (review can take up to 24 hours). Week 1: COD confirmation and delivery messages. Week 2: prepaid nudge. Week 3: cart recovery. 

## To confirm

- Exchange window and steps (scripts assume 7 days, from the order page).
- Whether the gateway can send a reduced-amount payment link for an existing COD order.
- Your provider's current per-message rates, to check that cart messages cost less than the profit they add.
