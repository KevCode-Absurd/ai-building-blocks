---
name: set-up-helpdesk-and-response-times
description: "A working support desk plan: one shared inbox that pulls in email, site chat, WhatsApp, Instagram and Facebook messages and marketplace questions, with a fixed tag list, an owner for each queue, routing rules, business hours, first-reply and resolution targets per channel, and the weekly numbers to watch. Sized from the store's own contact volume and orders, with a free path (shared Gmail plus WhatsApp Business app labels) and a helpdesk path. Covers WhatsApp opt-in and human-handoff rules, India regional-language queues and peak season staffing. Use when messages are scattered across apps, replies get missed, or the store is about to hire or outsource support."
---

# Helpdesk and response time setup

**You get:** a one-page desk design (channels connected, tag list, queues and owners, routing rules, hours and response targets) plus a setup checklist the agent or owner can follow in the chosen tool, and a weekly scorecard layout.

## When to use

- Customer messages sit in five places (Gmail, Instagram DMs, WhatsApp, site chat, Amazon) and some are never answered.
- The store is about to hire its first support person or an outsourced team.
- Nobody knows how fast the store replies, or which reasons fill the inbox.
- A sale or festive season is coming and the desk must handle two to three times the load.

## Not for

- Writing the replies agents will use: use `build-support-macros-from-top-tickets` once the tags exist.
- Setting up WhatsApp for selling (catalog, quick replies for buyers): use `set-up-whatsapp-sales-chat`.
- Consent and sender registration for marketing texts: use `sms-and-whatsapp-compliance-setup`.
- Training a bot to answer first: use `train-support-chatbot-on-store-faqs` after this desk runs.

## What you need

Required (read access, level 1):

1. **Contact volume per channel**, last 90 days: count of new conversations per week for email, chat, WhatsApp, Instagram, Facebook, phone and marketplaces. Pull it from each app, or count one normal week by hand.
2. **Orders per week** from the Shopify order export (Name, Created at, Financial Status, Payment Method), for contacts per order.
3. **Who answers now** and their hours, languages and cost per hour.
4. **Current tools**: email host, chat app, WhatsApp Business app or platform provider, any helpdesk.
5. **Order value**: average and the top quartile, since bigger orders bring more calls.

Optional: CSAT scores, the top reasons if someone tags already, the sale calendar.

Connecting channels to a helpdesk needs draft access (level 2) to each account; the client signs in to every tool through its own login, and approves the plan before anything is switched over. Never ask for passwords.

## Before you start: the gates

1. **Capacity is real.** The response targets must fit the hours the team actually has. Compute it in step 5; if the targets need more hours than exist, lower the targets or plan the hire, never publish a promise the team cannot keep.
2. **Cash.** A paid helpdesk is charged per seat or per ticket. If the store handles under about 300 conversations a month, start on the free path (practitioner default, test it).
3. **Channel rules.** WhatsApp contact needs the buyer's number and their opt-in, and any automated reply needs a clear way to reach a person [CXP-6302]. Instagram and Facebook messages follow Meta's messaging windows; check the current rules in Meta's help centre before setting auto-replies.
4. **Data access.** Agents see order data only through the store's own admin or an official helpdesk integration. No shared admin logins.

## Steps

### 1. Map every place a buyer can write

List each channel, where it lands today and who reads it. Include the ones people forget: the contact form, the returns app, marketplace messages, Google Business messages, replies to marketing emails and SMS. Each one gets a home in the shared inbox or is closed with a redirect message.

### 2. Choose the tool

- **Free path:** one shared Google Workspace inbox with labels for email and the form; WhatsApp Business app with labels and quick replies on one shared phone or linked devices; Instagram and Facebook through Meta Business Suite inbox. Good up to about two agents.
- **Helpdesk path:** any helpdesk that connects to Shopify (order lookup inside the ticket), email, chat, WhatsApp through the official Business Platform, Instagram and Facebook. Choose on: Shopify order panel, WhatsApp support through an official provider, per-ticket versus per-seat cost at the store's volume, and an export of all tickets.

Recommend one; give the runner-up in a line.

### 3. Fix the tag list

One primary reason tag per conversation, from a short fixed list (order status, change or cancel, damaged or wrong, return or exchange, refund, product question, pre-sale, payment or COD, subscription, complaint, wholesale, spam). Add a channel tag automatically, a language tag in India, and a "risk" tag for safety, legal or chargeback words. More than about 20 primary tags and agents stop tagging well (practitioner default, test it).

### 4. Set queues, owners and routing

| Queue | Gets | Owner | Backup |
|---|---|---|---|
| Pre-sale | Product questions before an order, chat and WhatsApp | Chat sales lead | Support lead |
| Orders | Status, changes, cancels | Support agent | Fulfilment lead |
| Problems | Damaged, wrong, missing, returns, refunds | Support lead | Owner |
| Risk | Safety, legal threats, chargebacks, press | Owner | Support lead |
| Partners | Wholesale, creators, suppliers | Owner or sales | None |

Routing rules: order number or tracking words go to Orders; "broken", "wrong", "refund" go to Problems; risk words go to Risk and alert the owner. Pre-sale questions get the fastest target because a buyer is waiting to pay.

A blended team can send simple, repeated tickets (order status, address changes) to a lower-cost team and complex ones to staff close to the business, who may be about twice as efficient; compare cost per resolved ticket, not hourly rate [OPS-0013].

### 5. Size the team and set targets

Workload a week = conversations a week x average handling minutes / 60. Add 30% for follow-ups and tagging (practitioner default, test it). Compare with agent hours.

Expect more contacts as order value rises; one card puts calls at about 12 to 18% of orders at a 250 dollar average order versus about 3% at 40 dollars [OPS-0006]. Order status contacts above 8% of orders point to a shipping message problem, not a staffing one [CXP-0012]; send that to `cut-where-is-my-order-tickets` before hiring.

Targets, practitioner defaults to test against the store's own numbers:

| Channel | First reply in business hours | Resolution |
|---|---|---|
| Site chat, pre-sale WhatsApp | Under 5 minutes | Same conversation |
| WhatsApp and social, post-sale | Under 1 hour | 24 hours |
| Email and form | Under 8 business hours | 48 hours |
| Risk queue | Under 1 hour, owner alerted | Owner decides |

Out of hours, an auto-reply states when a person will answer, gives the tracking page link and never pretends to be a person. Fewer touches matter more than fast first replies: high-effort service drives disloyalty [CXP-0009], so measure contacts per resolved case too.

### 6. Plan the peak

Before a sale, multiply the weekly workload by last year's peak ratio. Cover the gap with flexible help, not permanent hires: one card sizes full-time payroll to the lowest month and staffs the rest flexibly [OPS-0010]. Load macros and a pinned "known issues" note before the sale starts.

### 7. India and US notes

- **India:** WhatsApp is often the main channel; give it its own queue and a named owner. Add language queues (Hindi plus the store's top regional language) if over about 10% of messages arrive in that language (practitioner default, test it). Publish the grievance contact the store's policy names. COD buyers often call; log calls as tickets.
- **US:** email and chat lead; SMS replies to marketing texts land in the SMS tool and must be routed in. Show business hours with time zone.

### 8. Switch over

Connect channels one at a time, send a test message through each, confirm it lands in the right queue, then set the old inbox to forward. Keep both running for one week. The owner approves each switch.

## Checks before you hand it over

- Every channel a buyer can use is listed and lands in one inbox or redirects.
- Tag list has one primary reason per conversation and 20 tags or fewer.
- Every queue has an owner and a backup by name.
- Targets fit the computed workload and real agent hours.
- WhatsApp has opt-in and a human handoff; auto-replies never pose as a person.
- A test message from every channel landed in the right queue.
- Peak plan covers the expected load with flexible help.

## Output

**One-screen summary:** channels and where they land, the tool chosen, weekly workload versus hours, and the targets.

**Desk sheet** with tabs:

1. Channels: Channel, Lands in, Connected (yes or no), Test passed, Old route closed.
2. Tags: Tag, Meaning, Example message, Queue.
3. Queues: Queue, Owner, Backup, Hours, First reply target, Resolution target.
4. Routing rules: If message contains or comes from, Then queue, Then alert.
5. Weekly scorecard: Week, Conversations by channel, Contacts per 100 orders, Median first reply, Median resolution, Touches per resolved case, Reopen rate, Top 5 tags, CSAT.

**Setup checklist** in the order of step 8.

## Common mistakes

- **Promising targets the team cannot staff.** Step 5 sizes the work first.
- **Too many tags.** Step 3 caps the list so tagging stays accurate.
- **Hiring for order status tickets.** Step 5 sends that to shipping messages first.
- **Bots that hide the human.** WhatsApp requires a clear path to a person [CXP-6302].
- **Forgotten channels.** Step 1 lists marketplace, form and email-reply inboxes too.

## Sources

- CXP-0009: low-effort service builds loyalty.
- CXP-0012: order status contacts per order and share of tickets.
- CXP-6302: WhatsApp automation needs escalation to a person; opt-in.
- OPS-0006: contact load rises with order value.
- OPS-0010: size payroll to the lowest month, flex for peaks.
- OPS-0013: blend teams and judge by cost per resolved ticket.

What makes this skill ours: targets are sized from the store's own workload and hours, not copied from benchmarks; order status volume is sent to a shipping fix before anyone is hired; a free path runs on Gmail and the WhatsApp Business app; and India gets a WhatsApp-first queue, language queues and COD call logging.
