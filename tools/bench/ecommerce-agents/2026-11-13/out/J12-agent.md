# Snitch WhatsApp sales and COD kit

## What RTO costs you today

With 60% COD and 25% of COD refused at ₹180 each, every 1,000 orders lose ₹27,000 to RTO, or ₹45 per COD order. Each point cut from COD RTO saves ₹1,080 per 1,000 orders.

**Assumptions:** the checkout opt-in covers order updates and offers, and sits on the contact step, so buyers who left after shipping can be messaged if they ticked it. No cart discount is offered. The courier accepts reattempt requests.

## Templates to submit

Language: English; add Hindi copies under the same names if buyers write in Hindi. Submit two days before go-live.

### 1. snitch_cod_confirm (Utility)

- **Header:** Please confirm your order
- **Body:** Hi {{1}}, thanks for shopping with Snitch. Please confirm your cash on delivery order {{2}}.
  Items: {{3}}
  Pay at delivery: ₹{{4}}
  Address: {{5}}
  Expected delivery: {{6}}
  We ship as soon as you confirm.
- **Buttons (quick reply):** Confirm order | Change address | Cancel order
- **Samples:** Rahul, #104821, Linen shirt (M) and Slim jeans (32), 1,299, 12 MG Road Indore 452001, 18 to 20 Nov

### 2. snitch_cod_reminder (Utility)

- **Body:** Hi {{1}}, your Snitch order {{2}} for ₹{{3}} is waiting for your confirmation. We hold cash on delivery orders until you confirm.
- **Buttons:** Confirm order | Cancel order

### 3. snitch_cod_cancelled (Utility)

- **Body:** Hi {{1}}, we could not reach you to confirm order {{2}}, so we have cancelled it. Nothing is due. If you still want it, reply here and we will help.

### 4. snitch_prepaid_switch (Marketing), plus a free chat version

**Chat version**, sent the moment the buyer taps Confirm order (the tap opens the 24-hour window, so no template is needed):

> Confirmed, thanks {{name}}. Your order ships as cash on delivery. Prefer to skip cash at the door? Pay ₹{{total minus 20}} by UPI or card on this secure link and save ₹20: {{link}}. The link works until we pack your order. Cash on delivery is still fine.

**Template**, for buyers confirmed by phone:

- **Body:** Hi {{1}}, your order {{2}} is confirmed for cash on delivery. If you would rather skip cash at the door, pay ₹{{3}} online now and save ₹20. The link works until your order is packed. Cash on delivery is still fine.
- **Buttons:** URL "Pay online, save ₹20" (payment-link base URL ending in {{1}}) | Quick reply "Stop promotions"
- **When:** once, within 1 hour of call confirmation, never after dispatch.

**Why ₹20:** only COD buyers see it, so people who pay online anyway never get it. It stays below the RTO loss it removes: ₹45 at 25% RTO, about ₹22 if confirmation halves RTO. Keep offers out of templates 1 to 3, or they become marketing.

### 5. snitch_cart_1 (Marketing)

- **Header:** Your Snitch bag is saved
- **Body:** Hi {{1}}, you left {{2}} in your bag. Your size is still in stock at ₹{{3}}. {{4}} Any doubt on size or delivery date? Reply here and our team will help, 10 am to 8 pm.
- **Buttons:** URL "Complete my order" (checkout link ending in {{1}}) | Quick reply "Stop promotions"
- **Samples:** Arjun, Oxford shirt (L), 1,299, "Cash on delivery and online payment are both open for your pincode."
- **{{4}} rule:** for prepaid-only pincodes, send "Pay online by UPI or card at checkout." Never offer COD where it is off.
- **When:** 45 minutes after drop-off at the shipping step, only 10 am to 7:30 pm so an agent can answer. Later drop-offs: 10 am.

### 6. snitch_cart_2 (Marketing)

- **Body:** Hi {{1}}, still thinking about {{2}}? It can reach {{3}} by {{4}}. Not sure about the size? Send us your usual size and height and we will tell you which one fits. Your bag is saved here.
- **Buttons:** URL "Complete my order" | Quick reply "Stop promotions"
- **When:** 22 hours after message 1, if no order and no reply. Then stop.

**Skip** buyers who ordered, opted out, have an open complaint, or got a cart message in the last 7 days, and items out of stock. Hold back a random 10% of carts for 4 weeks to measure real extra orders.

### 7. snitch_out_for_delivery (Utility)

- **Header:** Your Snitch order arrives today
- **Body:** Hi {{1}}, your order {{2}} is out for delivery today. Amount to pay at the door: {{3}}. Please keep your phone on so the delivery partner can reach you.
- **Buttons:** I'll be available | Not home today
- **{{3}}:** "₹1,299 in cash", or "Nothing, already paid" for prepaid.
- **When:** on the out-for-delivery scan, not before 8 am. "Not home today" goes to an agent, who requests a next-day attempt.

### 8. snitch_delivery_missed (Utility)

- **Body:** Hi {{1}}, our delivery partner could not deliver order {{2}} today. Reason given: {{3}}. Tap below and we will arrange another attempt.
- **Buttons:** Deliver tomorrow | Fix my address
- **When:** within 2 hours of a failed-delivery scan. No reply by 10:30 am: an agent calls.

## COD confirmation flow

| Time after COD order | Action | Owner |
|---|---|---|
| Within 15 min (skip buyers with a delivered COD order and no RTO) | Template 1 | Automatic |
| On Confirm tap | Prepaid chat message; order released to packing | Automatic |
| 4 hours, no reply (after 9 pm: next 9 am) | Template 2 | Automatic |
| 24 hours, no reply | Call, 2 attempts at different times, 10 am to 8 pm | Agents |
| 48 hours, unconfirmed | Template 3, cancel | Automatic |

Unconfirmed orders stay on a fulfilment hold. Each order ends with one Shopify tag: Confirmed, Paid prepaid, Address fixed, Cancelled by buyer, Not ordered, No response cancelled.

**Call opener:** "Hi {{name}}, this is {{agent}} from Snitch. You ordered {{item}} for ₹{{total}}, cash on delivery. Can I confirm it before we ship?" Didn't order it: thank them and cancel. Never pressure, never ask for OTPs or UPI PINs.

**Capacity:** 4 agents give 40 hours a day. Cap calls at 20 hours, about 300 attempts at 4 minutes each. Above that, call the highest-value orders first.

## Reply scripts for the 5 common questions

**Size and fit:** "Which size do you wear in other brands, and do you like a snug or relaxed fit? I'll match it to this product's size chart." Then: "Size {{size}} suits you. Shall I send the link?"

**Delivery date:** "Send me your pincode and I'll check." Then: "It can reach {{pincode}} by {{date}}. Want the link to order now?"

**Exchange policy:** "If the size or fit is off, you can exchange it. {{exchange window and steps, from the live policy page}}. Which size are you looking at? I'll help you get it right first time."

**COD availability:** "Send me your pincode and I'll check." If open: "Cash on delivery is open for {{pincode}}. You can also pay by UPI or card at checkout and skip cash at the door." If not: "Cash on delivery isn't open for {{pincode}} right now. UPI and cards work at checkout."

**Order status:** "Share your order number or the phone number you ordered with." Then: "Order {{number}} is {{status}} and should reach you by {{date}}. Track it here: {{link}}." Delayed, damaged or upset: pass to a senior agent and tell the buyer.

## Numbers to watch every Monday

| Number | Start | Good sign |
|---|---|---|
| COD share of orders | 60% | Falling |
| COD RTO rate, confirmed vs skipped buyers | 25% (₹27,000 per 1,000 orders) | Each point down saves ₹1,080 |
| Confirm rate, cancels by reason | New | Few "Not ordered" |
| Prepaid switch rate (paid links ÷ messages) | New | Rising |
| Drop after the shipping step | 30% | Falling |
| Extra cart orders vs holdout | New | Above message cost |
| Opt-outs and blocks per 1,000 marketing sends | New | Flat; a rise risks your quality rating |
| First reply time | New | Overnight chats cleared by 11 am |
| WhatsApp spend vs RTO saved | New | Saving above spend |

Read RTO 2 to 3 weeks after each week ends, once parcels have come back.

## To confirm before go-live

- Provider rates for utility, marketing and service messages.
- Exchange window and steps from the live policy page.
- Opt-in wording covers offers, not only order updates.
- A paid link marks the COD order paid and updates the amount.
- The courier accepts reattempt and address-fix requests.
