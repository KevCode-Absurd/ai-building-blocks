---
name: recover-carts-by-chat
description: "WhatsApp, SMS and chat messages with exact timing that bring back abandoned carts and checkouts, sent only to buyers who opted in, plus a separate path for chat leads who went quiet after a link. Sets who gets a message, the delay, the two-message cap, when a discount is allowed, how replies are answered, the suppressions (bought, opted out, open complaint, out of stock), the cost check per message and a holdout that shows real recovered profit rather than attributed revenue. Market notes for WhatsApp journeys, pay-on-delivery carts, and SMS consent in the US, UK, EU, Canada and Australia. Use when carts are abandoned and the store has WhatsApp or SMS consent but no chat recovery, or when chat leads go cold after a link."
---

# Recover carts by chat

**You get:** a cart recovery plan for chat channels: an audience table, a timing card with at most two messages per cart, the written messages (opted-in WhatsApp, SMS, and quiet chat leads), a reply guide, a suppression list, a cost check and a holdout test sheet.

## When to use

- The store collects phone numbers with WhatsApp or SMS consent at checkout but sends nothing when carts are abandoned.
- Buyers ask questions in chat, get a link, and go quiet.
- Email cart recovery exists and the store wants a chat message alongside it.
- Chat recovery runs but nobody knows if it earns more than it costs.

## Not for

- Writing the cart and checkout emails: use `write-abandoned-cart-and-checkout-emails`.
- Full flow planning across email, SMS and WhatsApp: use `email-sms-flow-plan`.
- Consent capture, TCPA, UK and EU consent rules, sender registration and quiet hours: use `sms-and-whatsapp-compliance-setup`.
- Fixing why buyers leave checkout: use `fix-checkout-drop-off`.

## What you need

Required:

1. **Abandoned checkout export** from Shopify (Checkouts: Created at, Email, Phone, Total, Line items, Recovery status, Abandoned checkout URL) for the last 30 days.
2. **Consent source** for each phone number: which checkbox or form, its wording and date. No record means no message.
3. **Messaging route**: WhatsApp Business Platform through a provider, an SMS sender, or the store's chat inbox for quiet chat leads.
4. **Gross profit per order** and the store's discount rules.
5. **Current email recovery timing**, so chat and email do not collide.

Optional: chat labels from `set-up-whatsapp-sales-chat` ("Link sent", "Lost: no reply"), template approval status, past recovery results.

Access: reading checkouts is level 1. Building templates and flows is level 2. Turning on any automated message to buyers needs the client's yes.

## Before you start: the gates

1. **Consent.** WhatsApp may message only people who gave their number and opted in, and every stop request must be honoured [EML-6320]. A cart reminder is marketing, not an order update; on WhatsApp it needs a marketing template [OPS-6286]. Fail: email only.
2. **Gross profit per order known.** Pass: the cost check in step 7 can run. Fail: compute it in `build-sku-profit-sheet`.
3. **Price and stock refresh.** Messages read the cart's current price and stock at send time. Fail: no product price in the message.
4. **Someone answers replies** within the staffed hours. A reminder that invites a question nobody answers loses the sale twice. Fail: send at hours when someone is on.

## Steps

### 1. Split the audience

| Group | Who | Channel | Template needed |
|---|---|---|---|
| A. Checkout abandoners | Reached checkout, gave phone, opted in | WhatsApp marketing template or SMS | Yes |
| B. Cart abandoners | Added to cart, known contact, opted in | Same | Yes |
| C. Quiet chat leads | Asked in chat, got a link, no order | Reply inside the open chat | No, while the 24-hour window is open [EML-6322] |
| D. Ad leads | Started from a click-to-WhatsApp ad | Reply in chat | No, inside the free window of up to 7 days [EML-6363] |

Instagram is group C only: a business cannot start an Instagram DM, it can only reply [ORG-6365].

### 2. Set the timing

| Group | Message 1 | Message 2 | Stop |
|---|---|---|---|
| A | 30 to 60 minutes after drop-off, sent with the first email, not hours after it [EML-0064] [EML-0012] | About 20 to 24 hours later, only if no reply and no order | After message 2 |
| B | 1 to 2 hours after the add [EML-0046] | Optional, next day | After message 2 |
| C | 3 to 4 hours after the link, same day | None | Label "Lost: no reply" |
| D | Within the window, next morning | One more inside the window | When the window closes |

Two chat messages per cart at most (practitioner default, test it). Send between 9 am and 9 pm in the buyer's time zone.

### 3. Write message 1: help, no discount

Message 1 helps, it does not bribe. Cart abandoners often buy within a day or two anyway, so any early incentive is small or none, and at checkout a reminder or risk reducer beats a discount [OFF-0009].

> Hi [first name], you left [product] in your cart at [store]. It's still available at [price in the store's currency]. [One risk reducer: free returns in 7 days / pay on delivery available / delivery by (date)]. Pick up where you left off: [cart link]. Any question about size or delivery? Just reply here.

Ending on a simple question invites replies, and replies surface the real objection [EML-0035].

### 4. Write message 2: answer the likely doubt

Use the top reason from the store's "Lost:" labels or post-purchase survey (size, delivery time, trust, price). One doubt, one answer, one proof line, one link. If the store allows a discount, it comes no earlier than late in the sequence with a real expiry the store keeps [EML-0044]. Run the discount through `offer-bundle-threshold-design` first; a discount can wipe out the order's gross profit [OFF-0065].

### 5. Write the quiet chat lead message (group C)

> "Hi [first name], did the [size M] link work for you? If you're between sizes or want to check delivery to your postcode, tell me and I'll sort it."

No template, no offer blast, one message. Answers come from `write-chat-sales-scripts`.

### 6. Set the suppressions

Do not send if: the order was placed (check at send time), the buyer opted out, there is an open support ticket or complaint, the cart item is out of stock, the buyer got a cart message in the last 7 days (practitioner default), or the cart total is under the line where message cost beats expected profit. Built-in tools have their own rules; Shopify Messaging skips people sent a cart, checkout or browse email in the last 14 days [EML-0009].

### 7. Run the cost check

Per group: messages sent x cost per message (from the provider's current rate card) must be less than extra recovered orders x gross profit per order. Use extra orders from step 8, not all orders that clicked.

### 8. Measure with a holdout

Hold back 10% of eligible carts at random for 4 weeks (practitioner default). Compare the order rate within 7 days for messaged versus held-back carts, then multiply the difference by gross profit per order. Attributed recovered revenue counts people who would have bought anyway.

### Market notes

- **WhatsApp markets** (much of Europe, Latin America, the Middle East and Asia): WhatsApp is often the main chat channel, and automated trigger journeys have drawn far more clicks than broadcasts [EML-0048]. Where the store offers pay on delivery, message 1 can say it is open; never suggest it where the store has made that area prepaid only. Write in the language the buyer used at checkout where possible.
- **US:** SMS cart reminders need express written consent under US texting rules; route set-up through `sms-and-whatsapp-compliance-setup`. Keep each text under 160 characters with no emoji, or it bills extra segments [EML-0024].
- **UK, EU, Canada and Australia:** cart texts and WhatsApp messages need prior marketing consent and a clear opt-out (UK and EU privacy and e-marketing rules, Canada's anti-spam law, Australia's Spam Act); route set-up through `sms-and-whatsapp-compliance-setup`.

## Checks before you hand it over

- Every messaged phone has a recorded opt-in for that channel.
- No more than two chat messages per cart.
- Message 1 has no discount; any later discount has a real expiry and a profit check.
- Price and stock are read at send time.
- All six suppressions are set.
- The cost check passes for each group.
- A holdout is set before go-live.

## Output

1. **One-screen summary:** groups covered, monthly sends, cost, expected extra gross profit, go-live date and what the client must approve.
2. **Audience and timing table** (steps 1 and 2).
3. **Message set:** Group, Message number, Channel, Template category, Text, Character count, Link, Send window.
4. **Reply guide:** top 5 replies expected and the script to use for each.
5. **Suppression list** and **cost check:** Group, Sends, Cost, Extra orders, Gross profit.
6. **Holdout sheet:** Week, Eligible carts, Messaged, Held back, Orders messaged, Orders held back, Difference, Extra gross profit.

## Common mistakes

- **Messaging every number at checkout.** Gate 1 needs recorded opt-in.
- **Discount in the first message.** Step 3 helps first; step 4 holds any discount late.
- **SMS three hours after the email.** Step 2 sends chat with the first email.
- **Cold DMs on Instagram.** Step 1 keeps Instagram to replies.
- **Counting attributed revenue as recovered.** Step 8 uses a holdout.
- **Reminders for sold-out items.** Step 6 suppresses them.

## Sources

- EML-6320: WhatsApp opt-in and stop requests.
- OPS-6286: offers make a WhatsApp template marketing.
- EML-6322, EML-6363: 24-hour window, templates, free ad window.
- ORG-6365: businesses cannot start Instagram DMs.
- EML-0064, EML-0012, EML-0046: first message timing; send chat with email.
- OFF-0009: small or no incentive for cart and checkout abandoners.
- EML-0035: end with a simple question.
- EML-0044, OFF-0065: late discounts with real expiry; discount profit maths.
- EML-0009: Shopify Messaging suppression.
- EML-0048: WhatsApp trigger journeys beat broadcasts.
- EML-0024: SMS segment length.

What makes this skill ours: quiet chat leads are recovered free inside the open window instead of with paid templates; each group is judged on extra gross profit from a holdout, not attributed revenue; message 1 helps rather than discounts; and Instagram is kept to replies because the platform does not allow cold DMs.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. WhatsApp is the main chat channel. For COD carts, message 1 can say COD is open; never suggest COD where the store has made that pincode prepaid only. Show prices as Rs [price].
