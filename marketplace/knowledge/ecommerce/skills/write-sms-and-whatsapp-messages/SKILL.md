---
name: write-sms-and-whatsapp-messages
description: "Short SMS texts and WhatsApp templates for a store's flows and campaigns (welcome, cart and checkout recovery, order and delivery updates, pay-on-delivery confirmation, review ask, launch or sale, win-back), each written to the channel's hard limits: 160 characters and no emoji for a single SMS segment, WhatsApp header 60, body 1,024, button 25 characters, and the right template category so utility messages carry no offer. Includes US consent and quiet-hour wording, UK and EU consent rules, sender and template registration where a country requires it, the cost check per send, and the reply plan when a message invites answers. Use when adding texts or WhatsApp to existing email flows or campaigns."
---

# SMS and WhatsApp messages

**You get:** a message set for the store's flows and campaigns (up to 12 messages), each as exact SMS text or a WhatsApp template with category, header, body, footer, buttons, variables and sample values, character counts, send timing and a cost per send, ready to submit for template approval or load as drafts once the client says yes.

## When to use

- The store has email flows and is adding SMS or WhatsApp beside them (SMS leads in the US; WhatsApp leads in much of Europe, Latin America and Asia).
- WhatsApp templates keep getting rejected or recategorised as marketing.
- Texts run over 160 characters or use emoji and cost double.
- Pay-on-delivery or high-value orders need a confirmation message and delivery updates on WhatsApp.

## Not for

- Consent capture, sender registration (10DLC in the US, sender IDs and other country rules), quiet-hour settings and opt-out handling: use `sms-and-whatsapp-compliance-setup` first.
- Setting up the WhatsApp Business account, catalog and number: use `set-up-whatsapp-marketing`.
- Live chat replies and cart recovery conversations run by a person: use `recover-carts-by-chat` or `write-chat-sales-scripts`.
- The pay-on-delivery confirmation routine, calls and rules for which orders to hold: use `confirm-cod-orders-by-chat-or-call`; this skill writes the messages.

## What you need

Required (read access, level 1):

1. **Channels and consent**: which lists exist (SMS opt-ins, WhatsApp opt-ins), where consent was captured, and the exact consent wording.
2. **Provider and limits**: SMS or WhatsApp provider, cost per SMS segment or per WhatsApp message by category, and any sender registration the country needs (10DLC brand and campaign in the US, registered sender IDs or templates elsewhere).
3. **The matching emails** for each flow or campaign, so offers and deadlines match word for word.
4. **Gross profit per order** and the expected order rate per message from past sends, or a planning rate.
5. **Who answers replies** and their hours.

Optional: past text and WhatsApp reports (delivered, clicks, orders, opt-outs).

If cost per message is unknown, ask once; without it the cost check cannot run and campaign texts wait. Template submission and drafts need draft access (level 2); any send needs the client's yes.

## Before you start: the gates

1. **Consent per channel.** Texts go only to people who opted in to that channel. US: express written consent that says consent is not a condition of purchase [EML-6345]. A checkout phone number for delivery is not marketing consent.
2. **Registration.** Where a country requires registered senders or templates (10DLC in the US, sender ID registration in many others), every SMS uses them. WhatsApp: every message outside a 24-hour customer service window is an approved template [EML-6322].
3. **Cost.** Each campaign text and marketing template passes: recipients x segments (or messages) x cost per unit is below the send's expected gross profit.
4. **Reply capacity.** A message that asks a question needs someone to answer within the store's stated hours.

## Steps

### 1. Choose the channel per message

- **US:** SMS for welcome, abandonment, launches, sales and restocks; email does the teaching. About one SMS campaign a week, two at most [EML-0025].
- **UK, EU, Latin America and much of Asia:** WhatsApp for order and delivery messages and for triggered journeys where buyers opted in; triggered journeys usually out-click broadcasts by a wide margin. SMS for transactional notices where WhatsApp opt-in is missing. In the UK and EU, marketing texts need prior consent (or, in the UK, the soft opt-in for past buyers) and a free way to opt out.

### 2. Set the message list

| Message | Channel | Category | Timing |
|---|---|---|---|
| Welcome 1 | SMS / WhatsApp | Marketing | On opt-in |
| Welcome 2 | SMS | Marketing | Day 3 [EML-0029] |
| Checkout recovery | SMS / WhatsApp | Marketing | With email 1, not hours later [EML-0012] |
| Order confirmed | WhatsApp | Utility | On order |
| Pay-on-delivery confirm (if offered) | WhatsApp | Utility | Within minutes of the order |
| Shipped / out for delivery | WhatsApp | Utility | On event |
| Review ask | SMS / WhatsApp | Marketing | Same day as the email ask |
| Launch or sale | SMS / WhatsApp | Marketing | Per campaign |
| Win-back | SMS | Marketing | At twice the median days between orders [EML-0029] |

One abandonment text per event; US platforms allow it only within 48 hours [EML-0029].

### 3. Write SMS to the segment limit

- Under 160 characters, plain characters only. One emoji or special character drops the limit to 70, and one character over bills two segments [EML-0024]. Count spaces and the link.
- Brand name first so the reader knows who it is.
- One offer, one link, one ask.
- US: opt-out wording ("Reply STOP to opt out") in the first message and at least monthly [EML-6345]; send between 8 a.m. and 9 p.m. recipient time, tighter where state law says so.
- Countries with template registration: the text must match the registered template and carry only allowed full links, never public shorteners. A promo line inside a transactional SMS makes the whole message promotional.
- MMS images cost about three times SMS; keep them for welcome, abandonment and launches [EML-0028].

```
[Brand]: Your 10% code is WELCOME10, good until [date]. Shop: [link] Reply STOP to opt out
```

### 4. Write WhatsApp templates to the component limits

- Header up to 60 characters, body up to 1,024, footer up to 60, button text up to 25; at most 2 URL buttons and 1 phone button [EML-6343]. Aim for bodies under about 300 characters; people read on a phone (practitioner default).
- Every variable needs a sample value; a URL button takes one variable at the end of the link [EML-6343].
- **Utility** templates (order, payment confirmation, delivery) carry no offer, no code and no cross-sell. Add one and Meta treats it as marketing; repeated misuse can restrict utility templates [OPS-6286].
- Since 1 July 2025 every delivered template is charged by category, and outside the 24-hour window only templates may be sent [EML-6322]. Put the cost per category into the step 6 check.
- Submit templates at least two days before use; review can take up to 24 hours [EML-6343].

```
Category: Utility    Name: pay_on_delivery_confirm
Header: Please confirm your order
Body: Hi {{1}}, you ordered {{2}} for {{3}} to be paid on delivery. Expected delivery: {{4}}. Tap Confirm to ship it, or Cancel if you did not place it.
Buttons: [Confirm order] [Cancel order]
Samples: {{1}} Sofia, {{2}} Linen shirt, {{3}} €49, {{4}} 18 to 20 Nov
```

### 5. Write the reply plan

Ending a welcome text with a simple question can start conversations; subscribers who reply showed about 1.5 times the lifetime value at one provider [EML-0035]. Use it only if a person or approved bot answers within hours, with a clear path to a person. For each message that invites replies, write the three most likely replies and the answer to each.

### 6. Run the cost check

For each campaign message: recipients x segments (SMS) or messages (WhatsApp) x unit cost, against expected orders x gross profit per order. Expected orders use the store's past rate for that message type, or half the email rate for the same message as a planning figure (practitioner default, test it). A message that fails is cut or moved to email.

## Checks before you hand it over

- Each SMS is under 160 plain characters, or its segment count and cost are shown.
- Each WhatsApp template is within component limits, has a category, and has sample values.
- No utility template or transactional SMS contains an offer, code or cross-sell.
- SMS texts match any registered templates and sender IDs the country requires; links are allowed full links.
- US texts have consent on file, opt-out wording and quiet hours set.
- Offers and deadlines match the matching email word for word.
- Every campaign message passes the cost check.
- Nothing submitted or sent without the client's yes.

## Output

1. **One-screen summary:** channels by market, the message list, monthly cost estimate and the templates to submit first.
2. **Message sheet:** Message, Flow or campaign, Channel, Category, Timing, Text or template body, Characters, Segments, Variables and samples, Buttons, Cost per send, Expected gross profit, Pass or fail.
3. **Template submission pack** (WhatsApp): name, language, category, header, body, footer, buttons, samples.
4. **Sender registration pack** (where a country requires it, such as 10DLC in the US): sender or header, template type, exact text, variable tags.
5. **Reply plan:** Message, Likely reply, Answer, Hand-off rule.

## Common mistakes

- **Emoji in SMS.** Step 3 keeps the 160-character limit.
- **Discounts in order updates.** Step 4 keeps utility clean.
- **Texting checkout phone numbers.** Gate 1 requires marketing consent.
- **Template submitted on sale day.** Step 4 builds in review time.
- **Broadcast blasts instead of journeys.** Step 1 favours triggered messages.
- **Questions nobody answers.** Step 5 needs a reply owner.

## Sources

- EML-0012: send recovery text with the first email.
- EML-0024, EML-0028: segment limits, emoji and MMS cost.
- EML-0025: SMS campaign frequency.
- EML-0029: SMS flow timing and the 48-hour abandonment limit.
- EML-0035: reply question and lifetime value.
- EML-6322: WhatsApp per-message pricing and service window (proposed).
- EML-6343: WhatsApp template limits and review time (proposed).
- EML-6345: US text consent, opt-out and quiet hours (proposed).
- OPS-6286: WhatsApp utility versus marketing (proposed).

What makes this skill ours: every message is written to the channel's hard limits and checked for its true category before submission; each campaign text must pay for itself against gross profit; WhatsApp-first markets get triggered journeys and order confirmation, and SMS follows each country's registration rules; and messages that invite replies come with a written reply plan and an owner.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Points to keep:
- WhatsApp for order, COD and delivery messages and triggered journeys; automated journeys averaged 11.12% click rate against 2.6% for broadcasts across Indian brands [EML-0048]. SMS for OTP-style notices where WhatsApp opt-in is missing.
- Every SMS matches a DLT-registered template on the right header type, keeps at least 30% fixed wording, uses only pre-tagged variables, and carries only whitelisted full links [EML-6344]. Hand over a DLT pack: header, template type, exact text, variable tags.
- COD confirm template sample values: {{1}} Priya, {{2}} Cotton kurta set, {{3}} Rs 1,499.
- EML-0048: WhatsApp journeys versus broadcasts in India.
- EML-6344: India SMS header and template rules (proposed).
