# Snitch WhatsApp plan: COD confirmation, prepaid switch, cart recovery, delivery day

## Why this matters

- 25,200 COD orders a month (60% of 42,000). 25% are refused, so about 6,300 RTOs cost you about ₹11.3 lakh a month.
- Tier 3 towns are 31% of COD orders but about half of all RTOs: about 3,050 a month at a 39% rate. Tier 2 adds about 1,680, metros about 1,510.
- Every 1 point cut in the RTO rate saves about 252 RTOs, or about ₹45,000 a month.
- 65% of chats (order status, COD, delivery date) are simple lookups. 31% arrive 8 pm to midnight with no one online.

## Assumptions

1. The checkout opt-in covers order updates and marketing. If it covers only order updates, hold the two cart templates until you add a marketing line to the opt-in.
2. Exchange: 7-day size exchange. Swap in your real wording before you submit. It appears in one template and two scripts.
3. No prepaid discount. The prepaid nudge sells ease, not a deal. If you add an offer, submit that template as Marketing.
4. Your provider can fire templates on store and courier events and tag button taps on the order.
5. The courier gives an expected delivery date (EDD). We call it "expected", never a promise.
6. Language: English (en). Variables are {{1}}, {{2}} and so on. Sample values are given for approval.

## Templates

**1. cod_confirm_v1 | Utility** (replaces "order placed" for COD orders)
> Hi {{1}}, your Snitch order {{2}} is placed.
> Items: {{3}}
> Pay at delivery: ₹{{4}}
> Address: {{5}}
> Please confirm so we can pack it.

Buttons (quick reply): `Yes, confirm` · `Change address` · `Cancel order`
Sample: Vikram, #SN48213, Linen Shirt (M), 1,299, 12 MG Road, Indore 452001

**2. cod_confirm_reminder_v1 | Utility**
> Hi {{1}}, quick check on order {{2}} (₹{{3}}, cash on delivery). Tap below to confirm and we will pack it.

Buttons: `Yes, confirm` · `Cancel order`

**3. pay_online_option_v1 | Utility**
> Hi {{1}}, order {{2}} is confirmed. Want to skip cash at the door? Pay ₹{{3}} now by UPI. Same order, same exchange rules. COD is still fine if you prefer.

Button (URL, dynamic): `Pay by UPI` → snitch.co.in/pay/{{1}}

**4. cod_not_confirmed_v1 | Utility**
> Hi {{1}}, we could not reach you to confirm order {{2}}, so we have not shipped it. Still want it? Tap below and we will ship it.

Button: `Yes, ship it`

**5. cart_saved_v1 | Marketing**
> Hi {{1}}, your cart is saved. {{2}} in size {{3}} is still waiting. Pay by UPI or cash on delivery.

Button (URL): `Go to my cart`

**5b. cart_saved_prepaid_v1 | Marketing** (for pincodes without COD)
> Hi {{1}}, your cart is saved. {{2}} in size {{3}} is still waiting. Checkout takes a minute with UPI.

Button (URL): `Go to my cart`

**6. cart_fit_help_v1 | Marketing**
> Hi {{1}}, not sure about the size? Every product page has a size chart in inches. Match it to a shirt that fits you well. Wrong size? Exchange it within 7 days.

Button (URL): `See my cart`

**7. order_shipped_v1 | Utility** (for every order; this is the "just tell me when it ships" message)
> Hi {{1}}, order {{2}} has shipped with {{3}}. Expected delivery: {{4}}.

Button (URL): `Track order`

**8. out_for_delivery_cod_v1 | Utility**
> Hi {{1}}, your Snitch order {{2}} is out for delivery today. Please keep ₹{{3}} ready.

Button (quick reply): `Not home today`

**9. out_for_delivery_prepaid_v1 | Utility**
> Hi {{1}}, your Snitch order {{2}} is out for delivery today. Nothing to pay at the door.

Button (URL): `Track order`

## Flows and timing

Quiet hours: send nothing between 9 pm and 9 am. Anything due then goes at 9 am.

**COD order confirmation**
1. Within 2 minutes of the order: template 1.
2. `Yes, confirm`: tag confirmed, release to packing. A 24-hour chat window is now open, so send template 3's text right away as a normal chat message.
3. `Change address`: send an address-edit link. Hold packing until it is saved.
4. `Cancel order`: cancel and reply "Done. Order {{2}} is cancelled. Nothing to pay." A cancel before shipping costs nothing. An RTO costs ₹180.
5. No reply in 4 hours: template 2.
6. No reply in 24 hours:
   - Metro: ship anyway.
   - Tier 2 and tier 3: one call (agent or automated). Still no answer at 48 hours: hold the order and send template 4. Ship only on `Yes, ship it`.
7. Run the 48-hour hold in tier 3 only for 2 weeks. Add tier 2 if tier 3 RTO falls without a big drop in delivered orders.

**Prepaid switch**
- Send it in the chat right after `Yes, confirm`. Use template 3 only for orders confirmed by call.
- Once per order. Never on delivery day.
- Keep 10% of COD orders as a no-nudge holdout to see the true switch rate.

**Cart recovery** (cart dropped after the shipping step)
- 1 hour after drop: template 5, or 5b if COD is not offered on that pincode.
- 23 hours after drop: template 6.
- Stop the moment they order. Max 2 messages per cart. Max one cart series per person per 7 days.

**Shipping and delivery day**
- On the shipped scan: template 7.
- On the out-for-delivery scan: template 8 (COD) or 9 (prepaid). If the scan comes before 9 am, send at 9 am.
- `Not home today`: reply "No problem. We will ask the courier to try again on the next working day." Raise a reattempt request with the courier.

## Reply scripts for the 5 common questions

Light Hinglish is fine. One question or action per message.

**1. "Where is my order?" (44%)**
> Hi! Order {{id}} is {{status}}. Expected by {{EDD}}. Track it here: {{link}}

If late:
> Sorry, it is running late. I have raised it with the courier. I will update you here by {{time}} tomorrow.

**2. Size and fit (21%)**
> Which size fits you in other brands, M or L? 👕

Then:
> Check the chest size on the size chart on the product page. Match it to a shirt that fits you well. If it says oversized, it is cut loose on purpose. Wrong size? Exchange it within 7 days.

**3. Exchange policy (14%)**
> Easy. Within 7 days of delivery, go to {{link}} and choose Exchange. Pick your new size and you are done.

For Arjun-type buyers:
> Try the new fit. If it is not right, swap the size within 7 days.

**4. COD availability (11%)**
> Haan, COD hai! Share your 6-digit pincode and I will check it for you.

Then:
> Yes, COD works on {{pincode}}. You can also pay by UPI if you like.

If not available:
> COD is not available on {{pincode}} yet. You can pay by UPI and still exchange within 7 days.

**5. Delivery date (10%)**
> Share your pincode and I will check. Checkout shows the expected date for your area. Once it ships, you get tracking right here.

Never give a date earlier than the courier's EDD.

**After hours and response time**
- 8 pm to 10 am auto-reply with three buttons: `Track my order`, `COD and delivery`, `Talk to a person`. The first two answer with scripts 1, 4 and 5 automatically. The third says: "Our team is back at 10 am. You are first in line."
- Move one agent to a 2 pm to midnight shift. Same total hours, and the 31% evening wave gets a person.
- Order status alone is 44% of about 373 chats a day. Let the bot take it.

## Numbers to watch every week

| Number | Today | What it tells you |
|---|---|---|
| COD confirmed within 24 hours | New | Read by pincode group. |
| RTO rate, overall and by group | 25% (15/23/39%) | The main goal. Split confirmed vs unconfirmed. |
| RTO cost | about ₹2.6 lakh a week | |
| Cancels before shipping | New | A rise here is good if RTO falls. |
| COD share of orders | 60% | Should fall. |
| Pay-online switch rate vs holdout | New | The true lift from template 3. |
| Cart recovery rate | New | Orders ÷ carts messaged. |
| Read rate, block rate, quality rating per template | New | Pause any template whose blocks keep rising. |
| Order status share of chats | 44% | Should fall. |
| Median first reply, working hours | 52 min | Target under 10 min. |
| Evening chats answered by 10:30 am | New | |

**Rough sizing:** if 30% of carts reaching shipping drop, that is about 18,000 a month, so each 1% recovered is about 180 orders (₹2.3 lakh). Each 1% of COD moved to prepaid removes about 63 expected RTOs (₹11,000 a month).
