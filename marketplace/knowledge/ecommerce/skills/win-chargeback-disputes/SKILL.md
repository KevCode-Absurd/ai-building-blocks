---
name: win-chargeback-disputes
description: "Builds a dispute pack for each open chargeback, matched to its reason (fraud, item not received, not as described, refund not processed, subscription cancelled, duplicate), with the evidence list to pull, a short plain response letter, and a fight-or-accept call based on expected recovery. Tracks every deadline, then reads the last 6 months of disputes to find the store changes that prevent the next one: clearer billing name, delivery proof, refund speed, policy wording, 3D Secure and fraud holds. Never invents or alters evidence. Use when a chargeback or inquiry arrives, when the dispute rate climbs toward the processor's warning line, or after a run of lost disputes."
---

# Win chargeback disputes

**You get:** one dispute pack per open chargeback (reason, deadline, fight or accept call, evidence checklist with files named, a response letter under 300 words), a dispute log with deadlines, and a prevention list of the 3 to 5 store changes that would have stopped most of the last 6 months of disputes.

## When to use

- A chargeback or inquiry has just arrived in the Shopify admin or gateway dashboard.
- Several disputes are open and deadlines are close.
- The store keeps losing disputes it believes it should win.
- The dispute rate is climbing toward the processor's warning line.

## Not for

- Stopping card testing and fake orders before they become disputes: use `stop-fake-orders-and-card-testing`.
- Designing the returns process: use `set-up-returns-and-exchanges`.
- Booking dispute losses and fees in the accounts: use `reconcile-payouts-and-payment-fees`.
- Angry customers who have not disputed yet: use `handle-angry-customer-escalations`.

## What you need

Required:

1. **The dispute record**: order number, amount, reason, due date, any message from the bank (Shopify admin, Orders, Chargebacks, or the gateway dashboard).
2. **The order**: order page, payment details shown by Shopify (AVS and CVV results, 3D Secure status, risk analysis), IP and device information where shown.
3. **Fulfilment proof**: courier tracking, delivery scan, proof of delivery (photo or signature) if any.
4. **Customer contact history**: emails, chat, WhatsApp, support tickets.
5. **The product page and policies** as they were on the order date (use the store's own copies or a web archive snapshot if the page has changed).

Optional: past orders from the same customer, account login history, subscription records, refund records.

Pulling evidence is level 1. Submitting a response is a live action that always needs the client's fresh yes, even at level 3, because dispute evidence is a formal claim. Accepting a chargeback also needs a yes.

## Before you start: the gates

1. **Deadline known.** Shopify Payments usually allows 7 to 21 days and submits on the due date even if nothing is added; the decision can take up to 75 days and has no appeal [SEC-6201]. Fail: if the deadline is under 48 hours, build a short pack today.
2. **Facts only.** Pass when every piece of evidence is a real record. Fail: never edit screenshots, backdate messages, or write anything the records do not show.
3. **Refund check.** If the order was already refunded before the dispute opened, the pack is just the refund record, fought as "credit already processed". If a refund is still owed, accept the chargeback instead of refunding: the bank has already taken the money back, so a refund during an open chargeback can pay the buyer twice.
4. **Inquiry or chargeback.** An inquiry is a question from the bank with no money taken yet; answer it fast with the direct proof, because an unanswered inquiry often turns into a chargeback. A chargeback has already pulled the funds and the fee.
5. **Protection check.** For Fraudulent or Unrecognized disputes on Shopify Payments, check whether the order is marked protected by Shopify Protect before building anything; a protected order needs no pack.

## Steps

### 1. Fight or accept

Expected recovery = chance of winning x (order value + fee returned on a win) minus the time to build the pack. Shopify returns the chargeback fee (US $15 on Shopify Payments) only when the store wins [SEC-6201]. Accept when the evidence is weak (no tracking on "not received", no proof the buyer authorised a fraud order) or the buyer has a fair point; fight when the record answers the reason directly. Practitioner default, test it: fight when the evidence directly answers the reason code; accept otherwise and fix the cause.

### 2. Build the pack by reason

Shopify lists the evidence to send for each reason [SEC-6201]:

- **Fraudulent, not authorised:** AVS and CVV results, 3D Secure record, IP and device data, delivery to the billing address, the customer's past orders, and any message where the buyer acknowledged the order. A 3D Secure authenticated payment moves fraud liability to the card issuer [SEC-0005], so say so first if it applies.
- **Item not received:** tracking with the delivery scan, proof of delivery, shipping address match, carrier notices, and messages sent with tracking.
- **Not as described or defective:** the product page as it was at purchase, order and fulfilment records, pre-shipment photos, quality checks, messages, and the return policy with the buyer's choice not to use it.
- **Refund not processed:** refund record or the return policy and proof the item never came back.
- **Subscription cancelled:** the agreement and cancellation policy shown at sign-up, cancellation records, billing reminders sent, and usage after the charge.
- **Duplicate:** both transaction records and proof they are separate orders, or the refund of the duplicate.
- **Unrecognized:** treat it like fraud, then add the statement descriptor the buyer saw on their card bill and the order confirmation email, since many of these are buyers who did not recognise the store name.

For fraud cases on Visa, check one condition before writing: were there earlier undisputed payments on the same card 120 to 365 days before this one? If so, Visa's Compelling Evidence 3.0 rules may let those past orders count. Treat it as a condition to check on the dispute page, never as something the store's history already meets.

### 2b. Mark every item's status before you write a word

For each item on the reason's list, mark one status:

| Status | Meaning |
|---|---|
| Have | The client holds the file now, or Shopify adds it to the response itself |
| Get | It exists or can be obtained; name who holds it (carrier, customer, payment app) |
| Check | Nobody knows yet whether it exists; name where to look |
| Not available | The client says it does not exist |

Three rules keep the pack honest:

- **Words are not documents.** A statement the client heard ("she said it was a mistake", "the courier confirmed on the phone") is Get until there is a screenshot, email or file. Keep the client's own word for the channel: "texted" stays "texted"; never upgrade it to "in writing".
- **Someone else's proof is not the store's.** A carrier confirmation or a customer's cancellation proof stays Get until the file is in hand.
- **Keep two people apart.** Call the person the store dealt with "your customer" and the person who filed with their bank "the cardholder". In a fraud case the pack asks for evidence that links the order to the cardholder; it never says they are the same person.

A pack built on Have items only can be filed today; a pack that rests on Get items needs those files first, and the fight-or-accept call in Step 1 is made again once the Get items arrive or fail to.

### 2c. Leave out what answers the wrong question

Evidence for a different reason weakens the case. Delivery proof alone does not answer a fraud claim (it shows where the parcel went, not who ordered it). The return policy does not belong in a "not received" case. Marketing emails, long chat logs and screenshots of five-star reviews add pages without answering anything. List what not to upload in each pack.

### 2d. File rules

On Shopify Payments at the time of writing (check the dispute page, which wins if it differs): PDF, JPEG or PNG only; each file 2 MB or less and 4 MB in total; one file per evidence type, so merge several screenshots into one PDF; PDFs under 50 pages; readable in black and white, cropped to the part that matters, labelled with what it shows and its date; no links, audio or video. Pressing submit locks the response; if nobody submits, Shopify sends what is there on the due date.

### 3. Write the response letter

Under 300 words, plain, in this order: one line that answers the reason ("The order was delivered to the cardholder's billing address on 4 Nov, signed for"); a numbered list of the evidence attached, each with a one-line reason it matters; the policy line that applies; and the outcome asked for. No emotion, no blame, no claims without a file behind them. Name each file plainly: `01-tracking-delivered-4nov.pdf`.

### 4. Submit and log

Show the client the pack and letter; submit only after their yes. Submit before the due date and attach everything in one go, since a submitted response generally cannot be changed later. Log: date submitted, reason, amount, decision date expected.

### 5. Other gateways and payment methods

- Card disputes that come through a third-party gateway follow the gateway's own response window; it is often shorter than the card network's. Read the date on the gateway dashboard the day the dispute arrives.
- Disputes on bank payments, wallets and buy now pay later (PayPal, Klarna, Afterpay, local bank transfer schemes) are raised through that provider, each with its own window and evidence form; the provider asks the store for proof of delivery or refund. Keep courier proof of delivery for every prepaid order for at least 120 days (practitioner default, test it).
- Pay on delivery orders have no chargebacks, but refunds and refusals still need records.

### 6. Dispute rate and protection

- Card networks and processors watch the dispute rate. Most processors flag stores above about 0.9% and can stop accepting their cards above 1%; each chargeback costs about $128 all in [SEC-0004].
- For eligible stores on Shopify Payments (US and some other countries), Shopify's chargeback protection may cover some disputed orders; check which orders are marked protected before building a pack.

### 7. Prevent the next one

Read the last 6 months of disputes by reason and count them. Typical fixes, matched to reason:

- **"I don't recognise this charge":** set a billing descriptor that matches the store name buyers know; put the store name in the order email subject.
- **Not received:** require signature or photo proof above an order value line; send tracking and delivery updates, since buyers check tracking about 4.6 times per order [CXP-0014].
- **Not as described:** fix the product page claims, sizes and photos that the disputes mention.
- **Refund not processed:** refund faster; slow refunds push buyers to their bank, and fast refunds keep them buying [CXP-0015]. For low-value items, refund without return can be cheaper than fighting [CXP-0018].
- **Fraud:** hold high-risk orders before dispatch and keep 3D Secure on for risky payments [SEC-0005]. Leave AVS settings as they are unless the risk reports support a change [SEC-0003].
- **Late deliveries:** in the US, offer the delay-or-cancel choice and refund within 7 working days of a cancel [CXP-6160]; in the UK and EU, a buyer can cancel and get a refund if the agreed delivery date is missed. Telling buyers early prevents "not received" disputes everywhere.

## Checks before you hand it over

- Every open dispute has a due date, a fight or accept call with its reason, and an owner.
- Each pack's evidence answers its reason code directly.
- Every file is an original record; nothing edited or invented.
- Each letter is under 300 words and lists attachments with file names.
- No pack was submitted without the client's yes.
- The prevention list ties each fix to a counted dispute reason.
- The dispute rate is shown against the processor's warning line.
- Every evidence item has a status; no word-only statement or third party's file is marked Have.
- "Your customer" and "the cardholder" are never written as the same person.
- No refund was issued on an order with an open chargeback.
- Every file meets the dispute page's file rules, and each pack has a leave-out list.

## Output

**One-screen summary:** open disputes and total value, deadlines in the next 7 days, fight or accept calls, dispute rate against the warning line, and the top 3 prevention fixes.

**Dispute log:**

| Order | Amount | Reason | Opened | Due | Fight or accept | Evidence ready | Submitted | Outcome | Lesson |
|---|---|---|---|---|---|---|---|---|---|

**Dispute pack** (one per dispute): reason; due date; inquiry or chargeback; protected or not; evidence checklist (Item, Status: Have, Get, Check or Not available, Who holds it or where to look, File name, Upload as); leave-out list; response letter.

**Letter template:**

> Order [number], [amount], dispute reason: [reason].
> [One sentence that answers the reason with the key fact and date.]
> Attached:
> 1. [File]: [what it shows].
> 2. [File]: [what it shows].
> Policy shown at checkout: [the line, with link].
> We ask that the dispute be decided in the merchant's favour.

**Prevention list:** Reason, Disputes (6 months), Fix, Owner, Date.

## Common mistakes

- **Missing the deadline.** Shopify submits basic order data anyway, which rarely wins [SEC-6201]. Gate 1 and the log.
- **Generic evidence.** A pile of files that does not answer the reason. Step 2 matches evidence to reason.
- **Fighting weak cases.** Step 1 accepts when evidence is thin.
- **Long angry letters.** Step 3 keeps it under 300 words, facts only.
- **Editing evidence.** Gate 2 forbids it.
- **Refunding during an open chargeback.** Gate 3 accepts instead, so the buyer is not paid twice.
- **Counting a phone call as proof.** Step 2b marks word-only statements as Get until there is a file.
- **Sending delivery proof against a fraud claim.** Step 2c leaves out evidence that answers a different question.
- **Never fixing the cause.** Step 7 counts reasons and assigns fixes.

## Sources

- SEC-6201: evidence window, auto-submit, fees, decision time, evidence by reason.
- SEC-0003: AVS off by default; false declines.
- SEC-0004: chargeback thresholds and cost per chargeback.
- SEC-0005: 3D Secure liability shift.
- CXP-0014: buyers check tracking about 4.6 times per order.
- CXP-0015: fast refunds keep buyers.
- CXP-0018: refund without return for low-value items.
- CXP-6160: US delay-or-cancel and 7 working day refund rule.

What makes this skill ours: each dispute starts with a fight-or-accept call on expected recovery; evidence is matched to the reason code from the platform's own list; nothing is submitted without the client's fresh yes or edited from the original record; and every lost or fought dispute feeds a counted prevention list.

## Selling in India

- UPI disputes are raised through the buyer's bank or app; the gateway asks for proof of delivery or refund.
- COD orders have no chargebacks, but refunds and refusals still need records.
