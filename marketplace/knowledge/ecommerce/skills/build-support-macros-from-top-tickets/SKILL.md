---
name: build-support-macros-from-top-tickets
description: "Twenty ready support replies (macros) for the store's most common tickets, counted from its own inbox, written in the brand's voice, each with the facts to check first, the fields to fill, what the agent may offer without asking, and when to bend the policy. Covers order status, address changes, cancellations, damaged or wrong items, returns, refunds, sizing and use questions, discount codes, COD and UPI payment issues in India and US refund and delay rules. Use when the team types the same answers every day, replies sound different from agent to agent, or a new support hire needs to be useful in week one."
---

# Support replies for top tickets

**You get:** twenty saved replies for the twenty most common ticket reasons, each with a trigger tag, the checks to run first, the fill-in fields, a short and a long version, the agent's no-approval offer and the bend-the-rule line, ready to paste into the helpdesk as macros.

## When to use

- Agents type the same answers by hand and each one says it differently.
- First replies take too long because agents look up policy every time.
- A new agent or a support outsourcer starts and needs answers that are right on day one.
- Policies changed (returns window, shipping times, COD rules) and old replies still quote the old rules.

## Not for

- Setting up the inbox, tags, owners and response targets: use `set-up-helpdesk-and-response-times` first; this skill fills it.
- Calming one heated case that is already escalating: use `handle-angry-customer-escalations`.
- Writing the public FAQ page: use `write-faq-from-tickets-and-reviews`.
- Messages sent to every buyer when orders run late or stock runs out: use `delay-and-stockout-customer-messages`.

## What you need

Required (read access, level 1):

1. **Ticket export, last 90 days**: ticket id, created date, channel, tags or reason, subject, first message, resolution, reopen flag. From the helpdesk export, or a Gmail or WhatsApp Business chat export if there is no helpdesk.
2. **Live policies**: shipping, returns, refunds, cancellations, warranty, as published on the store.
3. **Operations facts**: dispatch cut-off, carrier per region, refund method and days to land, who pays return shipping, COD rules.
4. **Gross profit per order** from `store-meta-math` or `build-sku-profit-sheet`, to set offer limits.
5. **Five real brand lines** (emails, site copy, a reply the owner likes) for voice.

Optional: CSAT by reason, the top 20 order values, any existing macros.

If there is no ticket export, take the last 300 emails and chats by hand and tag them. Saving macros in the helpdesk needs draft access (level 2); the owner approves the set before agents use it, and any change to refund or credit limits needs a fresh yes.

## Before you start: the gates

1. **Policy is settled.** Each reply quotes a policy page that matches what the warehouse really does. If the page and practice differ, stop that reply and send the gap to `write-store-policy-pages`.
2. **Offer limits are costed.** A no-approval budget per ticket needs gross profit per order and repeat value. Fail: set offers to "ask the owner" until the numbers exist.
3. **Payment and data safety.** No reply asks for full card numbers, UPI PINs, OTPs or passwords. No reply shares another customer's data.
4. **Legal timing rules.** US orders: a late shipment needs a delay notice and the option to cancel with a prompt refund (FTC mail order rule; general practice, not a legal ruling). India: refund timelines and grievance contact must match the published policy.

## Steps

### 1. Count the real reasons

Tag every ticket with one primary reason from a fixed list (start with: order status, address change, cancel, damaged, wrong item, missing item, return request, refund status, exchange or size, product use, product fit or match, discount code, payment failed, COD question, subscription change, invoice or GST bill, stock or restock, wholesale, complaint about service, other). Count tickets per reason and the share of all tickets. Keep "other" under 10%; if it is higher, split it.

Expect order status to lead. It is often 30 to 50% of tickets; under 3% of orders raising one is healthy [CXP-0012]. If it is above 8% of orders, also run `cut-where-is-my-order-tickets`, because replies alone will not fix it.

### 2. Pick the twenty

Rank reasons by ticket count times average handling minutes. Take the top twenty. Add any reason that is rare but risky (safety complaint, chargeback threat, allergic reaction) as a routing macro, not a solve macro: it only acknowledges and passes to the owner.

### 3. Write the facts block for each

Before any wording, list what the agent must check: order status in Shopify, tracking scan date, payment method, delivery date, return window left, past contacts. Each macro starts with "Check first" so the agent never promises from memory.

### 4. Write the reply in five moves

1. Name the actual problem in the buyer's words, no long apology.
2. State what you checked and what is true now.
3. Say what you are doing now.
4. Give the next step with a real date, never "soon".
5. Tell them how to reach you if that date passes.

Keep effort low: one reply that solves it beats three that ask questions. Low-effort service drives loyalty far more than going above and beyond; in one large study 96% of high-effort contacts led to disloyalty versus 9% of low-effort ones [CXP-0009]. So each macro asks for every missing detail in one go (order number, photo, size) instead of one at a time.

Write a short version (chat, WhatsApp, under 60 words) and a long version (email). Match the brand voice by ear against the five real lines.

### 5. Set what the agent may offer

For each macro, set a no-approval offer and a cap. A small per-incident budget lets agents fix things without waiting; one card scales a famous hotel rule down to about 50 to 200 dollars per incident for a store [OPS-0009], where repeat value can carry it. Set the store's own cap from gross profit per order: practitioner default, cap at about one order's gross profit, test it.

- **Damaged or wrong item under a low value line:** refund or reship without a return. Returnless refunds suit items around 20 dollars or less, where a return can cost 20 to 65% of the item's cost to process; watch for repeat claimers, since about 9% of returns are fraudulent [CXP-0018].
- **Refund status:** say the exact day the refund was issued and how many days the bank or UPI takes. Fast refunds keep buyers; slow ones lose the intent to rebuy [CXP-0015]. Check whether the payment provider keeps its fee on a refund; if it does, a refund costs more than the order value paid back.
- **Return requests:** offer exchange first where stock exists, refund second. A poor return experience makes most buyers less likely to buy again [CXP-0007].

### 6. Write the bend-the-rule line

For each macro, one line: when the agent may go outside policy, and the limit. Example pattern: "Return window passed by 7 days or less, first return, order value under the cap: accept the return." Anything beyond goes to the owner with the case written up.

### 7. India and US notes

- **India:** COD refunds go to UPI or bank, so the macro asks for a UPI ID or bank details through the store's secure form, never in chat. Address change macros warn that an order already handed to the courier can only be redirected if the carrier allows it. Offer replies in the buyer's language (Hindi, Tamil and so on) when the buyer writes in it; keep a checked translation, not a live machine one. GST invoice requests get the invoice link, not a typed bill.
- **US:** delay macros offer the choice to wait or cancel with a refund. Sales tax questions point to the receipt, not an agent's guess.

### 8. Test and load

Run each macro against five real past tickets of its reason. If any needs heavy editing, rewrite it. Load into the helpdesk with the tag that triggers it. Review the set every quarter or whenever a policy changes.

## Checks before you hand it over

- Twenty macros, ranked by ticket count times handling time, with counts shown.
- Every macro has Check first, fill-in fields, short and long versions, offer cap and bend line.
- Every policy fact in a reply matches the live policy page and real operations.
- No reply asks for card numbers, PINs, OTPs or passwords.
- Every next step has a date or a time window, not "soon".
- Offer caps are tied to gross profit per order, or marked "ask the owner".
- Each macro passed five real past tickets with light edits at most.

## Output

**One-screen summary:** the top ten reasons with ticket share, the three that cost the most agent time, and the policy gaps found.

**Macro sheet** (one row per macro):

| Rank | Reason tag | Tickets (90 days) | Share | Check first | Fill-in fields | Short reply (chat or WhatsApp) | Long reply (email) | No-approval offer | Cap | Bend-the-rule line | Escalate when | Policy source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Routing macros** for rare high-risk reasons: reason, acknowledgment text, owner, response time.

**To confirm:** each offer cap and each bend line, signed off by the owner.

## Common mistakes

- **Writing from a generic list.** Step 1 counts the store's own tickets first.
- **Replies that promise from memory.** Every macro starts with Check first.
- **Asking one question per message.** Step 4 asks for everything missing at once.
- **Unlimited goodwill.** Step 5 caps every offer against gross profit per order.
- **"Soon" as a timeline.** Every next step carries a date.
- **Collecting payment details in chat.** India COD refunds go through a secure form.

## Sources

- CXP-0007: poor returns cut repeat buying.
- CXP-0009: low effort beats delight in service.
- CXP-0012: WISMO share of tickets and per-order health line.
- CXP-0015: fast refunds keep the buyer's intent.
- CXP-0018: returnless refunds for low-value items, fraud rate.
- OPS-0009: no-approval budget per incident.

What makes this skill ours: macros are ranked by the store's own ticket count times handling time; every reply opens with the facts to check before promising; offer caps come from gross profit per order; and India COD refunds, language and GST invoice cases are built in.
