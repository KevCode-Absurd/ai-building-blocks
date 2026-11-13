# Snitch: WhatsApp sales and COD confirmation playbook

## Assumptions

- Brief figures are test inputs. Math is per 1,000 orders.
- The opt-in box sits on the contact step, so shoppers who drop after shipping have usually opted in. Message opted-in numbers only.
- Anything in [brackets] is a placeholder for live policy (exchange window, delivery days, offer amount). Fill it in before submitting.
- Templates follow WhatsApp rules: lowercase names, no variable at the start or end of a body, at most 3 buttons, button text under 25 characters.
- Message fees depend on your provider's rate card. Utility costs less than Marketing.
- New policy: ship COD orders only after the customer confirms.

## What is at stake

- 600 COD orders, 25% refused = 150 RTOs x ₹180 = **₹27,000 lost**.
- Expected RTO cost per COD order: 25% x ₹180 = **₹45**. Every order moved to prepaid saves about ₹45. Keep any prepaid discount below ₹45 or it costs more than it saves.
- Every 1-point drop in RTO rate saves 6 x ₹180 = **₹1,080**.
- A COD order cancelled before shipping saves the full ₹180.
- Per 1,000 checkouts, 300 carts drop after shipping, worth about 300 x ₹1,300 = **₹3,90,000**.

## Templates

### 1. cod_order_confirm (Utility)

> Hi {{1}}, thanks for shopping with Snitch.
> Your order {{2}} for ₹{{3}} is placed as Cash on Delivery.
> Items: {{4}}
> Delivery address: {{5}}
> We ship COD orders only after you confirm. Please tap a button below.

Buttons (quick reply): `Confirm order` | `Change address` | `Cancel order`

**Flow and timing**
- Send within 5 minutes of a COD order, any hour.
- Confirm: tag the order, release it to the warehouse, then send the prepaid offer (template 3).
- Change address: route to an agent, who fixes it and confirms.
- Cancel: cancel automatically. Ask for a reason in a free-form reply (the customer's tap opens a free 24-hour service window).
- No reply in 4 hours: send template 2.
- No reply in 24 hours: an agent calls (10 am to 8 pm).
- No reply in 48 hours: cancel the order.

### 2. cod_confirm_reminder (Utility)

> Hi {{1}}, your Snitch order {{2}} is still waiting for your confirmation. We will ship it as soon as you tap Confirm. If you no longer need it, tap Cancel.

Buttons (quick reply): `Confirm order` | `Cancel order`

**Timing:** 4 hours after template 1. Hold sends between 9 pm and 9 am until 9 am.

### 3. cod_to_prepaid_offer (Marketing)

> Hi {{1}}, your order {{2}} is confirmed. Pay online now and save ₹{{3}} on this order. Nothing to pay at the door. The offer is open for [2 hours]. Prefer cash? No action needed.

Buttons: URL `Pay online now` (https://snitch.co.in/pay/{{1}}, unique payment link per order) | quick reply `Keep COD`

**Flow and timing**
- Send right after the Confirm tap. The service window is open then, so you can send it as a free-form message with the same buttons. Use the template when the window has closed.
- Suggested discount: ₹[30]. That stays under the ₹45 break-even.
- On payment: mark the order prepaid and update the courier label before dispatch.
- Without a discount, this message can go as Utility. With a discount it must be Marketing.

### 4. cart_recovery_1 (Marketing)

> Hi {{1}}, you left {{2}} in your Snitch cart. We saved it for you. Finish your order in one tap. Cash on Delivery and online payment are both open.

Buttons: URL `Complete my order` (https://snitch.co.in/cart/{{1}}) | quick reply `Help with size` | quick reply `Stop promotions`

**Flow and timing**
- Send 45 minutes after the shopper drops at the shipping step.
- Drops after 9 pm: send at 10 am.
- `Help with size` routes to an agent (size script below).
- Stop the sequence the moment an order is placed.

### 5. cart_recovery_2 (Marketing)

> Hi {{1}}, your {{2}} is still in your cart. Use code {{3}} to get ₹[X] off when you pay online. The code works till midnight today.

Buttons: URL `Use my code` (https://snitch.co.in/cart/{{1}}) | quick reply `Stop promotions`

**Timing:** 24 hours after message 4, only if no order. No third message. Tie the code to prepaid only, so each recovered order also avoids RTO risk.

### 6. delivery_today_cod (Utility)

> Hi {{1}}, your Snitch order {{2}} is out for delivery today. Please keep ₹{{3}} ready for the delivery partner. Want to skip cash? Pay online using the button below.

Buttons: URL `Pay online now` | quick reply `I'm available` | quick reply `Not home today`

**Flow and timing**
- Trigger when the courier marks "out for delivery". Send between 8 am and 10 am.
- `Not home today`: an agent asks for a better day and updates the courier before the attempt.
- No reply by 12 noon: an agent calls high-value orders (₹[2,000] and above).

### 7. delivery_today_prepaid (Utility)

> Hi {{1}}, your Snitch order {{2}} is out for delivery today. It is already paid, so there is nothing to pay at the door. Track it below.

Buttons: URL `Track order` (tracking link)

**Timing:** Same trigger as template 6.

## Reply scripts for the 5 common questions

Send as free-form replies inside the 24-hour window.

**1. Size and fit**
"Happy to help. Which size do you usually wear in shirts or jeans, and what is your height and weight? Each product page has a Size Guide with chest and waist measurements. If you are between sizes, [pick the larger one for a relaxed fit]. If it doesn't fit, you can exchange it within [X] days."

**2. Delivery date**
"Please share your 6-digit pincode. Most orders reach metro cities in [X to Y] days and other areas in [X to Y] days. Once it ships, you will get a tracking link here on WhatsApp."

**3. Exchange policy**
"You can exchange for another size or item within [X] days of delivery. The item must be unworn with tags on. Start here: [exchange link]. We will arrange pickup from your address."

**4. COD availability**
"Yes, Cash on Delivery is open for most pincodes. Share yours and I will check. Tip: paying online saves you ₹[30] and you have nothing to pay at the door."

**5. Order status**
"Please share your order number or the phone number you ordered with. [Agent checks.] Your order is [status]. Track it here: [link]."

**Chat rules for the team of 4**
- First reply within 5 minutes, 10 am to 8 pm.
- Outside hours, an auto-reply says: "Thanks for writing to Snitch. Our team is back at 10 am. For order status, tap [tracking link]."

## Numbers to watch every week

| Metric | How to calculate | Baseline / rule |
|---|---|---|
| COD share | COD orders / all orders | 60% today. Should fall. |
| Confirmation reply rate | Confirms + cancels / templates 1 sent | Track from week 1 |
| Cancelled at confirmation | Cancels / templates 1 sent | Each one saves ₹180 |
| RTO rate | RTOs / COD orders shipped | 25% today |
| Weekly RTO cost | RTOs x ₹180 | Should fall |
| Prepaid switch rate | Switches / template 3 sent | Net saving = switches x (₹45 minus discount) |
| Cart recovery rate | Orders from messages 4 and 5 / carts messaged | Track by message |
| Recovered revenue per message | Recovered revenue / messages sent | Must beat Marketing fee per message |
| Opt-out and block rate | Stop taps and blocks / marketing sends | If it rises 2 weeks in a row, cut sends |
| Quality rating | In your provider dashboard | If it drops from High, pause Marketing templates |
| First reply time | Median, 10 am to 8 pm | Under 5 minutes |
| Chats per agent per day | Chats / 4 agents | Watch for overload |
| Unanswered at 8 pm | Open chats at close | Clear by 10:30 am next day |

**Decision rules**
- If the net prepaid saving turns negative, lower the discount.
- If confirmed orders still show high RTO, review the 48-hour cancel rule and the delivery-day calls first.
