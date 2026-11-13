# Snitch WhatsApp templates, flows and scripts

## The decision

- **COD refusals cost about ₹11.2 lakh a month.** 25,200 COD orders x 24.8% RTO = about 6,240 parcels x ₹180. Tier 3 towns are 31% of COD orders but 49% of those parcels (3,047).
- **Confirm before you ship.** First-time COD buyers and all tier 2 and tier 3 COD orders get a confirm message in 15 minutes. Repeat buyers with no past refusal skip it. Each 1-point drop in COD RTO saves 252 parcels, or ₹45,360 a month.
- **Prepaid offer: ₹30 off, tier 2 and tier 3 only.** ₹30 pays back only where RTO is above 17% (₹30 ÷ ₹180). Metro is at 15%, so metro gets no offer.
- **54% of chats ask "where" or "when"** (6,048 a month). "Shipped" and "out for delivery" messages answer them before they are asked.
- **31% of chats (3,472 a month) arrive after 8 pm with nobody online.** Every reply script below also works as an after-hours auto reply.
- **This week:** submit the 9 templates (allow 2 days for review). Tag COD orders by pincode group. Hold fulfilment on orders tagged "Awaiting confirm".

## The templates

Language: English. Utility templates carry no offer, or Meta moves them to Marketing. All bodies are under 200 characters.

### COD confirmation

**1. snitch_cod_confirm** (Utility)
- Header: Confirm your COD order
- Body: Hi {{1}}, thanks for shopping with Snitch. Order {{2}}: {{3}}. Cash to pay at delivery: ₹{{4}}. Address: {{5}}. Courier's expected date: {{6}}. Tap Confirm and we'll ship it.
- Buttons (quick reply): Confirm order | Change address | Cancel order
- Samples: Vikram; #SN48213; Cotton shirt, size M; 1,299; 12 MG Road, Indore 452001; 3 to 5 days

**2. snitch_cod_reminder** (Utility)
- Body: Hi {{1}}, your Snitch order {{2}} is waiting for your OK. ₹{{3}} cash at delivery. Tap Confirm to ship it, or Cancel if you don't need it.
- Buttons (quick reply): Confirm order | Cancel order
- Samples: Vikram; #SN48213; 1,299

**3. snitch_cod_cancelled** (Utility)
- Body: Hi {{1}}, we cancelled order {{2}} because we did not get your confirm. You pay nothing. Still want it? Tap below to order again.
- Button (URL): Order again, https://www.snitch.co.in/{{3}}
- Samples: Vikram; #SN48213; cart/48213

### Prepaid nudge

**4. snitch_prepaid_switch** (Marketing)
- Body: Order {{1}} confirmed ✅ Want to skip cash at the door? Pay now by UPI or card: ₹{{2}} instead of ₹{{3}}. COD bhi chalega. Nothing changes if you skip this.
- Buttons: Pay now (URL, https://www.snitch.co.in/{{4}}) | Keep COD (quick reply)
- Footer: Reply STOP to stop offers
- Samples: #SN48213; 1,269; 1,299; pay/48213

### Cart recovery

**5. snitch_cart_reminder_1** (Marketing)
- Body: Hi {{1}}, your {{2}} is still in your Snitch cart, in your size. COD is open for pincode {{3}}, so you pay when it arrives.
- Button (URL): Finish order, https://www.snitch.co.in/{{4}}
- Footer: Reply STOP to stop offers
- Samples: Vikram; Cotton shirt, size M; 452001; cart/91022

**6. snitch_cart_reminder_2** (Marketing)
- Body: Hi {{1}}, not sure the {{2}} will fit? Reply with the size you wear in other brands and our team will match it. Wrong size later? Exchange it from your order page.
- Buttons: Finish order (URL, https://www.snitch.co.in/{{3}}) | Help me pick size (quick reply)
- Footer: Reply STOP to stop offers
- Samples: Vikram; cotton shirt; cart/91022

### Delivery updates

**7. snitch_order_shipped** (Utility)
- Body: Hi {{1}}, your Snitch order {{2}} has shipped with {{3}}. Courier's expected date: {{4}}. We'll message you the day it's out for delivery.
- Button (URL): Track order, https://www.snitch.co.in/{{5}}
- Samples: Arjun; #SN50377; Delhivery; 2 to 3 days; track/50377

**8. snitch_out_for_delivery_cod** (Utility)
- Body: Hi {{1}}, your Snitch order {{2}} is out for delivery today. Please keep ₹{{3}} ready for the delivery partner. Won't be home? Tap below and we'll help.
- Buttons (quick reply): I'll be there | Can't take it today
- Samples: Vikram; #SN48213; 1,299

**9. snitch_out_for_delivery_paid** (Utility)
- Body: Hi {{1}}, your Snitch order {{2}} is out for delivery today. It's already paid, so there's nothing to pay at the door.
- Button (URL): Track order, https://www.snitch.co.in/{{3}}
- Samples: Arjun; #SN50377; track/50377

## Flow and timing

| Flow | Who | Timing | Then |
|---|---|---|---|
| COD confirm (#1) | First-time COD buyers; all tier 2 and tier 3 COD orders | 15 minutes after order, replacing "order placed". After midnight: 9 am. | Hold until Confirm. Cancel tap: cancel. |
| Reminder (#2) | No tap | 4 hours, 9 am to 9 pm only | At 24 hours, metro and tier 2 ship; tier 3 stays held |
| Cancel (#3) | Tier 3, no tap | 48 hours | Cancel the order |
| Prepaid (#4) | Tier 2 and tier 3, just tapped Confirm | Right after the tap, once | Paid: tag "Confirmed, paid" |
| Cart (#5, #6) | Opted in, left after the shipping step | #5 at 45 minutes (after 9 pm: next 9 am); #6 next day, 11 am | Stop if they order, reply STOP, the item sells out, or had a cart message in 7 days |
| Delivery (#7, #8, #9) | Every order | Courier's "shipped" and "out for delivery" events | None |

- **No confirmation calls.** Agents already take 52 minutes to first reply. Unconfirmed tier 3 orders (39% RTO) are cancelled instead.
- **Cart message 2 lands at 11 am,** so size replies reach agents who are online.
- **No cart discount.** #5 answers the COD worry, #6 the fit worry (size and exchange: 35% of chats).
- **Repeat buyers like Arjun** skip confirmation and get #7: "Just tell me when it ships."
- "Change address" and "Can't take it today" go to an agent; after 8 pm, the auto reply takes details.

## Reply scripts for the 5 common questions

After hours, each reply starts with: "Hi, this is Snitch's auto reply. Our team is online 10 am to 8 pm." It ends with: "Type AGENT and we'll reply after 10 am."

**1. Order status (44%): "Where is my order?"**
- Agent: "On it! Order {order no.} shipped with {courier}. Courier's expected date: {date range}. Track it live here: {tracking link}"
- After hours: "Tap Track order in our 'shipped' message above. No shipped message yet? Then it hasn't left us. You'll get one the moment it ships."

**2. Size and fit (21%): "Other brands mein M fit hota hai, yahan?"**
- Agent: "Tell me the product and the brand where M fits you. I'll check our size chart and tell you your size. Wrong size later? Exchange it from your order page."
- After hours: "Send the product and your size in another brand. We'll reply with your Snitch size after 10 am."

**3. Exchange (14%): "Exchange easy hai?"**
- Agent and after hours: "Haan, easy hai. Open your order, tap Exchange and pick the new size. Stuck anywhere? Reply here and we'll guide you."

**4. COD (11%): "COD hai na?"**
- Agent: "Haan, COD hai! Send your pincode and I'll check it's open for you. You pay in cash when it arrives."
- After hours: "Haan! Checkout shows Cash on Delivery if it's open for your pincode."

**5. Delivery date (10%): "Kab tak aayega?"**
- Agent and after hours: "Send your pincode and we'll share the courier's expected date. Once it ships, you'll get a tracking link right here."

Never say "only 2 left" unless true. Never promise a date firmer than the courier's range.

## Numbers to watch weekly

| Number | Start | Act when |
|---|---|---|
| Confirm rate, by pincode group | New | One group lags: rewrite #1 for it |
| Orders lost to cancels, by group | New | Tier 3 cancels outweigh parcels saved there |
| RTO rate, confirmed vs not, by group | 24.8%; tier 3 39% | Count expected RTO now, not when parcels return |
| RTO cost (parcels x ₹180) | ₹11.2 lakh a month | Each 1-point drop should show ₹45,360 |
| Prepaid switch rate after #4 | New | A tier's confirmed RTO falls below 17%: stop the ₹30 offer there |
| Cart orders in 7 days, messaged vs 10% held back | About 18,000 carts a month | #6 adds nothing over #5: drop it |
| "Where" and "when" share of chats | 54% | Not falling: check the courier events firing #7 and #8 |
| Median first reply | 52 minutes | Not falling as auto replies take after-hours chats |
| STOP replies and quality rating, per template | New | Rating drops to low: pause and rewrite |

For 2 weeks, leave 10% of queued orders unconfirmed; their RTO shows what confirmation saves.

## Assumptions

1. Your provider can fill variables from the order: name, items, amount, address, courier's date range, cart link and payment link.
2. Size exchange is open on every order from the order page. If an item cannot be exchanged, agents say so before the sale.
3. "30% of carts abandoned after the shipping step" means 30% of carts that reach that step: about 18,000 a month (42,000 ÷ 0.7 x 0.3).
