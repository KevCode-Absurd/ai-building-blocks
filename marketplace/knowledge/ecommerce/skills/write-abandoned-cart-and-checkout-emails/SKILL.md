---
name: write-abandoned-cart-and-checkout-emails
description: "Cart and checkout recovery messages written in full: three added-to-cart emails, four started-checkout emails and one text, each with subject lines, preview, body, button, timing and exit rule, plus a written discount rule that says exactly who may get a code, how much, in which message and with what real expiry, checked against gross profit per order. Uses the store's real reasons for leaving (extra costs, delivery time, returns, payment trust), splits new from returning buyers and pay-later from prepaid checkouts, and follows each market's text consent rules (US, UK, EU, Canada, Australia). Use when recovery flows are missing, run on one trigger, or open with a discount by default."
---

# Abandoned cart and checkout emails

**You get:** seven recovery emails and one text written in full (three for added to cart, four for started checkout, one text alongside checkout email 1), a timing and exit sheet, and a one-page discount rule with its gross profit check, ready to load as drafts for the client to approve.

## When to use

- The store has one "abandoned cart" flow that really fires on Started Checkout, and nothing for people who only added to cart.
- The first recovery email carries a discount and buyers have learned to wait for it.
- Recovery emails are a product picture and "you forgot something", with no answer to why people left.
- Pay on delivery or pay-later shoppers and prepaid shoppers get the same message.

## Not for

- Flow priorities and build order across the account: use `email-sms-flow-plan`.
- Finding and fixing why checkout loses buyers on the site: use `fix-checkout-drop-off`.
- Recovering carts in WhatsApp chat with a person replying: use `recover-carts-by-chat`.
- People who viewed but never added to cart: use `write-browse-abandonment-emails`.

## What you need

Required (read access, level 1):

1. **Current flows**: trigger, messages, delays, any code, and last 90 days of recipients, click rate, placed order rate, revenue per recipient and unsubscribe rate, from the email platform's flow report.
2. **Gross profit per order** by cart size, from `store-meta-math` or `build-sku-profit-sheet`.
3. **Why people leave**: post-purchase "what almost stopped you" answers, support tickets about checkout, and the checkout funnel from Shopify Analytics or GA4 (reached checkout, reached shipping, reached payment, completed).
4. **Shipping, returns and payment facts** as shown at checkout today: shipping cost and threshold, delivery days, return window, payment methods, and any pay on delivery or pay later rules and fees.
5. **Reviews export** with product names, and five real brand voice lines.
6. **Consent state**: whether the store collects SMS or WhatsApp opt-in, and where.

Optional: Shopify order export with Discount Code to see how often recovery codes are used, payment failure logs from the gateway.

If no reasons data exists, use the store's checkout funnel step with the biggest drop as the main reason, and Baymard's general list as backup [CRO-6180]. Drafts need draft access (level 2); switching flows on needs the client's yes.

## Before you start: the gates

1. **Gross profit per order.** Needed for any code. Fail: write the flows with no discount at all.
2. **Triggers.** Added to Cart must reach the email platform as an event. If the platform only sees Started Checkout, write the checkout flow now and list the cart event fix for the builder.
3. **Double sends.** If the store uses Shopify Messaging, its cart automation already skips anyone sent a cart, checkout or browse email in 14 days [EML-0009]. Run one tool per flow, never two.
4. **Text consent and rules.** SMS only to SMS opt-ins. US: consent wording, 8 a.m. to 9 p.m. recipient time, STOP instructions [EML-6345]. UK and EU: prior consent under the UK and EU marketing and privacy rules, an easy opt-out in every text. Canada: CASL consent and sender details. Australia: consent, sender ID and an unsubscribe in every message. Some markets also need registered sender IDs or templates [EML-6344].
5. **Send-time facts.** The cart block pulls live price and stock; an item out of stock exits the person or swaps to an in-stock option.

## Steps

### 1. Name the top three reasons

Rank reasons from step 3 inputs. For checkout leavers in general, extra costs lead, then slow delivery, then distrust of paying [CRO-6180]. Use the store's own order where it has data. Each email after the first answers one reason.

### 2. Write the discount rule before the copy

A code is allowed only when all of these hold:

- the cart's gross profit after the code stays above zero, using the cart's real value;
- the shopper is new (returning customers get service and proof, not codes);
- the person has not had a recovery code in the last 30 days (practitioner default, test it);
- it sits in the last checkout email, around day 4 to 5, with a real 48-hour expiry the platform enforces [EML-0044].

Offers should match the stage: small for cart leavers, and at checkout prefer shipping help or risk reversal over money off [OFF-0009]. So the default late offer is free or cheaper shipping on this order if shipping cost is the top reason, and a small code only if price is. Write the rule as one table and the cost per redeemed order beside it.

### 3. Set timing

| Flow | Message | Send after trigger | Job |
|---|---|---|---|
| Added to cart | Email 1 | 30 to 45 minutes [EML-0018] | Plain reminder, cart block, one help line |
| Added to cart | Email 2 | Day 1 | Answer reason 1 |
| Added to cart | Email 3 | Day 3 | Proof for the product in the cart |
| Started checkout | Email 1 + text | 15 to 60 minutes [EML-0064]; text at the same time, not hours later [EML-0012] | Restore the checkout |
| Started checkout | Email 2 | Day 1 | Answer reason 1 (costs, delivery) |
| Started checkout | Email 3 | Day 2 to 3 | Answer reason 2 or 3 (returns, payment trust) with proof |
| Started checkout | Email 4 | Day 4 to 5 | Offer if the rule allows; else plain-text note from a person |

Exit every message on Placed Order. Someone who starts checkout leaves the cart flow. Short reminders often beat long objection emails, so keep each email to a few lines [EML-0023]. These counts sit inside common flow lengths [EML-0019]; add messages only when a test shows the extra one earns more than its unsubscribes.

**Trigger, re-entry and block checks before you build.** Test that the added to cart event really fires: open the store from a tracked email link, add an item, and look for the event on that profile in the email tool. Do not build the cart flow until it shows. Use different re-entry windows for the two flows: the added to cart flow skips anyone who entered it in the last 30 days, but the started checkout flow can let people back in after 2 to 3 days, because someone who comes back to checkout is still close to buying (starting points to test). The cart and checkout events carry different product fields, so a product block copied from one flow to the other can show nothing; preview every email with a real profile. In the checkout flow, link the product image and the button to the buyer's saved checkout, not the home page, so one tap restores the basket.

### 4. Write the emails

Every email: one button back to the restored cart or checkout, the cart block (image, name, variant, price), one job, grade 8 reading level.

- **Reminder emails** say what is in the cart and how to get back, in two or three lines. No guilt, no "hurry".
- **Reason emails** answer one reason with the store's real terms: "Shipping is free over [threshold]; your cart is [amount] away" only if true for that cart; delivery days by region; the return window in plain words.
- **Proof emails** use one or two reviews of the product in the cart, each answering a doubt [EML-0033].
- **Offer email** states the exact code, what it covers, the end date and time with time zone, and that it is single use. If the rule says no offer, this email is a short plain-text note from a named person asking if something went wrong, with a reply address that a person reads.

Two subjects per email (plain and benefit). Never "Your order is waiting" or "Payment failed" unless the store's event confirms it.

### 5. Write the one text

Under 160 characters with no emoji, since one emoji cuts the limit to 70 and one character over bills two segments [EML-0024]. Brand name first, the cart link, and opt-out wording where required. One text per abandonment; US platforms limit abandonment texts to within 48 hours [EML-0029].

```
[Brand]: you left [item] in your cart. Pick up where you stopped: [link] Reply STOP to opt out
```

Where a market requires registered templates, the text must match its registered template word for word, with a whitelisted full link, not a public shortener [EML-6344]. In WhatsApp-first markets (much of Europe, Latin America and Asia), stores often do better with a WhatsApp template; write it with `write-sms-and-whatsapp-messages`.

### 6. Branch by payment type and for returning buyers

- **Pay on delivery or pay later checkouts:** answer trust and delivery: the option is available to this postcode, any fee, delivery days, how to cancel. A pay-upfront saving line only if the store's numbers show it costs less than the failed delivery loss it prevents.
- **Prepaid checkouts:** offer a card, wallet or local payment method retry link and say it is secure. Mention a failed payment only when the gateway event confirms it.
- **Returning customers:** shorter emails, no code, a line from support offering help.

### 7. Check, then plan the test

Run the checks below. First test: delay of email 1 (for example 30 versus 60 minutes), with copy fixed. Flows need about 1,000 recipients per variant [EML-0061]. Judge on recovered orders and gross profit per entrant, not opens.

## Checks before you hand it over

- Cart and checkout flows have separate triggers and the cart flow exits on Started Checkout.
- No code before the last checkout email; the discount rule table shows gross profit after the code.
- Every policy line matches the live checkout and policy pages.
- Text is under 160 characters, emoji-free, with brand name and opt-out; any registered-template market's text matches its template.
- No "payment failed" or stock claim without a confirming event.
- Pay-later and prepaid branches exist where the store offers both; returning buyers get no code.
- Nothing switched on without the client's yes.

## Output

1. **One-screen summary:** the top three reasons, the discount rule in two lines, the build order and the first test.
2. **Flow sheet:** Flow, Message, Channel, Delay, Job, Reason answered, Exit, Branch, Subject A, Subject B, Preview.
3. **Each message in full:**

```
[Flow] [Message n]   Send: [delay]   Exit: Placed Order
Subject A / B: [plain] / [benefit]   Preview: [adds new information]
Body: [2 to 5 lines]   [cart block]
Button: [Return to my cart] -> [restore URL]
Offer (email 4 only): [code], [what it covers], ends [date, time, zone]
Sources: [policy URL / review id]
```

4. **Discount rule table:** Condition, Value, Cost per redeemed order, Gross profit after code.
5. **Builder notes:** event fixes, suppression, live price and stock block.

## Common mistakes

- **One flow on checkout only.** Step 3 adds the added-to-cart flow [EML-0018].
- **Code in email 1.** Step 2 holds it to the last message.
- **Text hours after the email.** Step 3 sends both together.
- **"Only 2 left" with no stock check.** Gate 5 and step 4 require the live block.
- **Same message to pay-later and prepaid buyers.** Step 6 splits them.
- **Codes to loyal customers.** Step 2 gives them service instead.

## Sources

- CRO-6180: cart abandonment reasons (proposed).
- EML-0009: Shopify Messaging 14-day suppression.
- EML-0012: send text with email 1.
- EML-0018: separate added-to-cart flow, 30 to 45 minutes.
- EML-0019: common flow lengths.
- EML-0023: short reminders and delay tests.
- EML-0024, EML-0029: text length, segments, one abandonment text.
- EML-0033: reviews that answer objections.
- EML-0044: late discount with real 48-hour expiry.
- EML-0061: flow test size.
- EML-0064: first-email timing.
- EML-6344: registered SMS template rules (proposed).
- EML-6345: US text consent and quiet hours (proposed).
- OFF-0009: offers by funnel stage.

What makes this skill ours: a written discount rule tied to gross profit, new versus returning buyer and a real enforced expiry, decided before any copy; each email answers a ranked reason from the store's own checkout data; pay-later and prepaid shoppers get different messages; and the text follows each market's exact consent rules rather than a generic template.

## Selling in India

- SMS needs a DLT-registered template and header, matched word for word, with a whitelisted full link [EML-6344]. A WhatsApp template often works better.
- COD checkouts: confirm COD to this pin code, any COD fee, delivery days and how to cancel. Add a prepaid saving line only if `cod-and-prepaid-checkout-for-india` shows it costs less than the RTO loss it prevents.
- Prepaid checkouts: offer a UPI or card retry link.
