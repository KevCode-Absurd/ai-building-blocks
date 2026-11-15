---
name: handle-angry-customer-escalations
description: "An escalation playbook for upset customers: how to read the case before replying, a five-move reply that calms and solves in as few touches as possible, an offer ladder with what each role may give without asking, the triggers that move a case to the support lead or owner (safety, legal threats, chargebacks, public posts, repeat failures), and how to close and log it so the cause gets fixed. Includes reply wording for email, chat, WhatsApp and phone, notes on failed deliveries, buyer languages and consumer bodies in any market, and US chargeback timing. Use when a customer is angry, threatens a bad review or chargeback, or when agents either over-refund or argue."
---

# Handle angry customers

**You get:** an escalation playbook the team can use today: a case triage card, the five-move reply with wording per channel, a role-by-role offer ladder with caps, the escalation triggers and owners, and a case log layout.

## When to use

- A customer is angry, has written several times, or is threatening a review, chargeback or social post.
- Agents handle anger very differently: some refund everything, some argue policy.
- A run of failures (late batch, defective lot) is producing many angry tickets at once.
- The owner wants to stop being pulled into every hard case.

## Not for

- Everyday replies to common tickets: use `build-support-macros-from-top-tickets`.
- Replying to a bad review in public: use `reply-to-negative-reviews`.
- Disputes already filed with the payment provider: prepare evidence with the owner; disputes need a fresh yes at any access level.
- Fixing the product or shipping fault behind many complaints: use `turn-support-tickets-into-insights`.

## What you need

Required (read access, level 1):

1. **The case**: every message from this customer, all channels, in order.
2. **Order facts** from Shopify: items, value, payment method, fulfilment and delivery scans, refunds already given, past orders and lifetime spend.
3. **Live policies**: returns, refunds, warranty, shipping.
4. **Gross profit per order** and repeat value from `store-meta-math` or `cohort-repeat-and-ltv-analysis`, to set offer caps.
5. **Roles**: who handles support, who is lead, who is owner.

Optional: CSAT history, any known issue notes (late batch, carrier problem).

Sending a reply needs draft access (level 2) to the helpdesk with the client's approval of the playbook. Refunds, credits and replacements above the role cap need a fresh yes from the owner, at any level.

## Before you start: the gates

1. **Safety and legal first.** Injury, allergic reaction, a product hazard, a lawyer, a regulator or a data breach skips the ladder and goes straight to the owner. No agent offers anything in those cases beyond acknowledging and promising a reply by a set time.
2. **Facts before feelings.** Read the whole history and the order record before the first reply. A reply that repeats a question already answered makes anger worse.
3. **Offer caps are costed.** Caps come from gross profit per order and repeat value. Fail: every offer above a free reship needs the owner.
4. **No pressure on reviews.** Never offer money or goods in exchange for removing or changing a review, and never threaten or harass a customer about one; in the US that is review suppression [CXP-6301].

## Steps

### 1. Triage the case in two minutes

Fill the triage card: what went wrong (our fault, carrier, customer, unclear), what they want (refund, replacement, apology, explanation), how many contacts so far, money at stake, any trigger words (chargeback, review, lawyer, police, consumer court, social post). Rate severity:

- **Level 1:** one failure, first contact, clear fix.
- **Level 2:** repeated contact, failure on our side, or a review or social threat.
- **Level 3:** safety, legal, chargeback filed, press, or a public post with reach.

### 2. Reply fast, and in one complete message

Answer level 2 and 3 cases first. Aim to solve in one reply: low effort matters more than delight; in one large study 96% of high-effort service contacts led to disloyalty versus 9% of low-effort ones [CXP-0009]. Each reply follows five moves:

1. **Name it.** Say what happened in their words, without hedging. "Your order arrived with a cracked lid, and this is the second time."
2. **Own our part.** If we failed, say so once. No blame on the carrier or warehouse.
3. **Fix it now.** Say what you have already done, not what you could do. "I have sent a replacement by express; it ships today."
4. **Give a date.** The day the fix lands, and when you will check in.
5. **Leave a door.** A direct way to reach the same person.

Keep it short. Do not quote policy unless the customer asks why. Do not paste a macro into an angry thread; adapt it.

Wording to avoid: "as per our policy", "unfortunately", "we apologise for any inconvenience", "calm down". Wording that works: "You are right", "Here is what I have done", "I will check on [date]".

### 3. Switch channel when it helps

If a level 2 case has gone back and forth three times in writing, offer a call or a voice note at a time they choose. Never move a customer off a public channel by ignoring them there; reply once in public, then continue in private.

### 4. Use the offer ladder

Match the remedy to the harm, then add a small gesture only when we failed. The ladder:

| Step | Offer | Agent | Lead | Owner |
|---|---|---|---|---|
| 1 | Clear explanation and fix date | Yes | Yes | Yes |
| 2 | Free reship or replacement of the failed item | Yes, to cap | Yes | Yes |
| 3 | Refund of the failed item without return | Yes, low-value items | Yes | Yes |
| 4 | Shipping refund or upgrade on next order | Yes | Yes | Yes |
| 5 | Credit or gift for our failure | Up to agent cap | Up to lead cap | Any |
| 6 | Full order refund plus keep the goods | No | Up to lead cap | Any |
| 7 | Anything outside policy | No | No | Yes |

Set caps from the numbers: one card suggests about 50 to 200 dollars per incident as a no-approval budget for a store [OPS-0009]; for low-margin stores, practitioner default: agent cap about half of one order's gross profit, lead cap about one order's gross profit, test it. Returnless refunds suit low-value items where a return costs more than it saves; watch repeat claimers, since about 9% of returns are fraudulent [CXP-0018].

Do not plan on a recovery making the customer happier than before. That outcome is rare; in one large study only 5.4% of customers with a problem rated the recovery much better than expected [CXP-0011]. Fix it well and fast, and do not over-spend chasing delight. A fixed weekly budget for going further on the worst failures, logged and reviewed, keeps gestures controlled [CXP-0022].

### 5. Escalate on the triggers

Move the case up, with the triage card and history attached, when:

- Level 3 trigger words appear.
- The remedy the customer wants is above the agent's cap.
- The same customer had a failure before in 90 days.
- A public post or review has reach (comments, shares) or tags the brand.
- The agent feels unsafe, or the customer is abusive. Abusive customers get one calm warning, then the lead takes over.

Escalation targets: lead replies within 2 business hours, owner within 4 for level 3 (practitioner defaults, test them).

### 6. Close and log

A case closes only when the fix is verified (tracking shows delivered, refund shows processed) and the customer has the confirmation. Log: reason, root cause owner (product, warehouse, carrier, site, policy), offer given, cost, and whether a review or chargeback followed. Send repeated causes to `turn-support-tickets-into-insights` weekly.

### 7. Market notes

- **All markets:** many angry cases start on WhatsApp or a phone call after a failed delivery. Reply in the language they wrote in. Refunds for pay-on-delivery orders go to bank details collected through a secure form, never in chat. A mention of a consumer body, ombudsman or small claims court (for example Trading Standards or Citizens Advice in the UK, or a state consumer agency in Australia) is a level 3 trigger: acknowledge, and the owner replies.
- **US:** a chargeback threat is level 2; a filed dispute is level 3, with a short evidence window set by the payment provider. Solving the problem first often prevents the dispute; never refund and also contest the same dispute.

## Checks before you hand it over

- Triage card covers fault, want, contacts, money, trigger words and severity.
- Every reply template has the five moves and no banned phrases.
- The offer ladder shows a cap per role, tied to gross profit per order.
- Safety and legal cases skip the ladder and go to the owner.
- No step offers anything in exchange for changing or removing a review.
- Escalation triggers and target times are named, with owners.
- The case log captures root cause owner and cost.

## Output

**One-screen summary:** the severity levels, the offer caps by role and the escalation owners.

**Triage card:** Case id, Channel, Contacts so far, What went wrong, Fault, Customer wants, Money at stake, Trigger words, Severity, Next owner.

**Reply templates:** five-move reply for email, chat or WhatsApp (under 80 words) and a phone call outline, for: late order, damaged item, wrong item, refund delay, repeated failure, abusive customer warning.

**Offer ladder** as in step 4 with the store's caps filled in.

**Case log:** Date, Case id, Reason, Root cause owner, Offer, Cost, Escalated to, Closed on, Review or dispute after (yes or no).

## Common mistakes

- **Replying before reading the history.** Step 1 triages first.
- **Quoting policy at an angry buyer.** Step 2 fixes first and explains only if asked.
- **Unlimited refunds to make it go away.** Step 4 caps each role.
- **Chasing a delighted recovery.** It is rare [CXP-0011]; fast and complete is the goal.
- **Offering credit for a review change.** Gate 4 bans it.
- **Closing on a promise.** Step 6 closes on a verified fix.

## Sources

- CXP-0009: low effort beats delight in service.
- CXP-0011: the recovery paradox is rare.
- CXP-0018: returnless refunds for low-value items, fraud rate.
- CXP-0022: a fixed weekly budget for going further, tracked.
- CXP-6301: no intimidation or pressure over reviews (US).
- OPS-0009: no-approval budget per incident.

What makes this skill ours: offer caps by role come from the store's gross profit per order; safety, legal and review-pressure cases are taken out of agents' hands; the playbook aims for one complete reply rather than a delighted recovery; and failed-delivery, language and consumer-body cases are built in for every market.

## Selling in India

- Many angry cases start on WhatsApp or a phone call after a failed COD delivery.
- Refunds for COD orders go to UPI or bank details collected through a secure form, never in chat.
- A mention of the consumer helpline or consumer commission is a level 3 trigger: acknowledge, and the owner replies.
