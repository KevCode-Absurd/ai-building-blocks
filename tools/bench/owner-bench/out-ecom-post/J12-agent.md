# Snitch WhatsApp: COD, prepaid, cart and delivery messages

## The plan on one screen

- **Refused COD parcels cost about ₹11.3 lakh a month:** 25,200 COD orders × 25% RTO × ₹180.
- **Tier 3 towns are 31% of COD orders but nearly half of refusals** (about 3,050 of 6,300 parcels, ₹5.5 lakh a month). They get calls and a cancel rule.
- **54% of chats ask "where is it?" or "when will it come?"** (about 6,050 a month). Shipped and out-for-delivery messages answer them first.
- **31% of chats land after 8 pm with nobody online.** A night menu answers status, COD and delivery date.
- **Bad news:** confirmation cancels some orders that might have been delivered, and discounts reach buyers who would have paid anyway. Holdouts measure the net.
- **This week:** submit the 9 templates (Meta review can take up to 24 hours), tag every pincode Metro, Tier 2 or Tier 3, and hold unconfirmed Tier 3 COD orders from packing.

Assumptions: opt-in is captured before the shipping step, so those carts can be messaged. The courier gives an expected delivery range (EDD) per pincode. Size exchange is requested from the order page.

## 1. Templates to submit

Language: English. Utility templates carry no offer, or Meta recategorises them. Marketing templates get the footer "Reply STOP to stop these messages."

| # | Name | Category | Body | Buttons |
|---|---|---|---|---|
| T1 | cod_order_confirm | Utility | Hi {{1}}, thanks for your Snitch order {{2}}. You pay ₹{{3}} in cash at delivery. Address: {{4}}. Expected delivery: {{5}}. Please confirm so we can ship it. | Quick reply: Confirm order / Change address / Cancel order |
| T2 | cod_confirm_reminder | Utility | Hi {{1}}, your order {{2}} (₹{{3}}, cash on delivery) is waiting for your OK. Tap Confirm and we'll ship it. Don't need it now? Tap Cancel, no problem. | Quick reply: Confirm order / Cancel order |
| T3 | cod_order_cancelled | Utility | Hi {{1}}, we couldn't reach you, so order {{2}} is cancelled. You owe nothing. Still want it? You can order again any time. | URL: Order again |
| T4 | prepaid_switch_save | Marketing | Order confirmed ✅ Want to skip cash at the door? Pay ₹{{1}} now by UPI instead of ₹{{2}} at delivery. Same order, same delivery. Cash on delivery still works too. | URL: Pay now by UPI |
| T5 | cart_reminder_1 | Marketing | Hey {{1}}, your {{2}} is still in your cart. Cash on delivery is on, and if the size is off, you can exchange it. Tap below to finish your order. | URL: Finish order |
| T6 | cart_size_help | Marketing | Hi {{1}}, still thinking about the {{2}}? Fit is the big question, we get it. Reply with the size you wear in other brands and our team will tell you your Snitch size. | Quick reply: Help with my size; URL: View my cart |
| T7 | order_shipped | Utility | Hi {{1}}, your Snitch order {{2}} has shipped with {{3}}. Expected delivery: {{4}}. Tap below to track it. | URL: Track order |
| T8 | out_for_delivery_cod | Utility | Hi {{1}}, your order {{2}} is out for delivery today. Please keep ₹{{3}} ready for the delivery partner. Not home today? Tap below and we'll ask the courier for a new attempt. | URL: Track order; Quick reply: Not home today |
| T9 | out_for_delivery_prepaid | Utility | Hi {{1}}, your order {{2}} is out for delivery today. Nothing to pay, it's prepaid. Not home today? Tap below and we'll ask the courier for a new attempt. | URL: Track order; Quick reply: Not home today |

Sample values for review: Vikram, #SN48213, 1,299 (T4: 1,259 and 1,299), 14 MG Road, Indore 452001, 18 to 21 Nov, Delhivery, oversized shirt. Buttons stay under 25 characters.

## 2. Flow and timing

### COD confirmation

| When | Metro | Tier 2 | Tier 3 |
|---|---|---|---|
| 15 min after order | T1 | T1 | T1 |
| Taps Confirm | Release. Plain nudge, no discount | Release. T4 at ₹20 off | Release. T4 at ₹40 off |
| Taps Change address | Agent takes address and landmark, then releases | Same | Same |
| Taps Cancel | Cancel at once | Same | Same |
| 4 h, no reply | T2 | T2 | T2 |
| 24 h, no reply | Ship | Ship | Agent calls, 2 tries, 10 am to 8 pm |
| 48 h, still silent | | | Cancel, send T3 |

- Skip T1 for buyers with an earlier delivered COD order and no refusal, like Arjun.
- Reminders due from 11 pm to 9 am wait until 9 am.
- Metro nudge, a normal chat inside the 24-hour window: "Order confirmed. Want to skip cash at the door? Pay now by UPI: {payment link}. Cash on delivery still works too."

**Why tiers differ.** Expected refusal loss per COD order is ₹70 in Tier 3 (39% × ₹180), ₹41 in Tier 2 and ₹27 in Metro. Each discount sits below the loss it removes. Calls go only to Tier 3 (about 260 COD orders a day) because the same 4 agents carry chat.

**Holdout.** For 2 weeks, a random 10% of Tier 3 COD orders get T1 only: no call, no cancel. Their RTO shows what calls and cancels really save.

### Cart recovery (abandoned after the shipping step)

- T5 at 30 minutes. T6 the next day between 10 am and 7 pm, so an agent can answer the size reply.
- Stop on order, STOP reply or after T6. One cart flow per person per 7 days. A random 10% of carts get nothing, to measure real lift.
- No discount. Vikram's blockers are COD trust and fit, and T5 and T6 answer those.

### Shipping and delivery day

- Courier pickup scan: T7, Arjun's "just tell me when it ships."
- Out-for-delivery scan: T8 for COD, T9 for prepaid.
- "Not home today" tap: an agent, or the bot after 8 pm, logs a reattempt with the courier.

## 3. Reply scripts

After 8 pm, the away message offers a button for each topic. The bot answers R1, R4 and R5 from order and courier data. Size and exchange get: "Our team is online from 10 am and will reply to you first."

**R1. Order status**
- Shipped: "Hi {name}! Order {id} is with {courier}, expected {EDD range}. Track it here: {link}"
- Not shipped: "Order {id} hasn't shipped yet. You'll get a WhatsApp with tracking the moment it does."
- Past the EDD: "Sorry, it's running late. I've raised it with {courier} and will update you by {time today}." Hand to an agent.

**R2. Size and fit**
- "Other brands mein M? Send me the brand and size you wear, plus the product link. I'll check our size chart and tell you your Snitch size."
- Then: "This shirt in M is {chest} inches at the chest. With your {brand} M, go for {size}. If it's off, you can exchange it after delivery."

**R3. Exchange**
- "Yes, size exchange is easy. After delivery, open your order on snitch.co.in, tap exchange and pick your new size. The order page shows the time limit."

**R4. COD availability** (bot checks the pincode)
- "Haan, COD hai on {pincode}. Pay in cash when it arrives, or UPI at checkout."
- If not: "COD isn't open on {pincode} yet. UPI or card works for this order."

**R5. Delivery date**
- "To {pincode}, it usually takes {EDD range}. We'll WhatsApp you when it ships and again on delivery day."

Never promise a single day, say "only 2 left" unless true, or make COD buyers feel doubted.

## 4. Numbers to watch every Monday

Weekly baseline: about 5,800 COD orders, 1,450 refused parcels (₹2.6 lakh) and 2,585 chats.

| Number | Baseline | What it tells you |
|---|---|---|
| COD RTO rate, Metro / Tier 2 / Tier 3 | 15% / 23% / 39% | Each point off is worth about ₹45,000 a month |
| Tier 3 RTO, full flow vs holdout | New | What confirmation alone saves |
| Confirm, cancel and no-reply rates by tier | New | Who you reach |
| Net saving: parcels avoided × ₹180, minus discounts, messages and call hours | New | Keep the flow only if positive |
| Prepaid switch rate after Confirm, by tier | New | Whether ₹20 and ₹40 earn their cost |
| Cart orders and revenue vs holdout | New | Real recovery only |
| Chats on order status and delivery date | 54% | Should fall once T7 to T9 go live |
| Median first reply, 10 am to 8 pm | 52 min | Target under 15 min as volume drops |
| STOP replies, blocks and quality rating per template | New | Pause any template rated low |

## Bolder move: a ₹99 UPI advance for Tier 3 COD

Tier 3 buyers pay ₹99 by UPI to book, and the rest in cash. Projection: if Tier 3 RTO falls from 39% to 25 to 30%, you save ₹1.3 to 2.0 lakh a month, before orders lost to the extra step. First step: 10% of Tier 3 pincodes for 4 weeks, against matched pincodes. Risk: buyers like Vikram, who distrust paying upfront, may drop off. Stop if lost orders cost more than parcels saved.
