---
name: b2b-sales-follow-up-sequence
description: "Follow-up emails, calls and WhatsApp messages for retail stockist and corporate gifting leads, written in full for each stage (no reply, interested, sampled, quoted, first order placed), with send days, what each touch adds, the one ask, and clear rules for when to stop and when to try again months later. Keeps every message lawful (CAN-SPAM opt-out, WhatsApp opt-in and templates), never discounts to close, and turns first orders into reorders. Use when leads from pitches, trade shows or enquiries go quiet, or when follow-up is ad hoc and nobody knows who was last contacted."
---

# B2B sales follow-up sequence

**You get:** five written sequences (no reply, interested, sampled, quoted, first order placed) for retail and corporate leads, each with 3 to 5 touches, send days, channel, the one new thing each adds and the one ask, plus stop and re-try rules and a tracker, as drafts the client approves before any send.

## When to use

- Pitches to shops or companies went out and most have not replied.
- Trade show or pop-up contacts need following up while they still remember the stall.
- Samples or quotes were sent and nothing happened.
- A stockist ordered once and never reordered.

## Not for

- The first pitch and target list: use `find-and-pitch-retail-stockists` or `corporate-gifting-sales-pitch`.
- Consumer emails and automated store flows: use `email-sms-flow-plan`.
- Answering price objections from shoppers in chat: use `handle-price-objections-in-chat`.
- Chasing overdue invoices: use the collections steps in `bulk-order-quote-and-invoice`.

## What you need

Required:

1. **Lead list** with: name, business, type (retail or corporate), stage, channel, consent status for WhatsApp, last contact date and what was sent.
2. **The first pitch** each lead received, so follow-ups do not repeat it.
3. **Assets that add something new**: shelf or display photos, a packed gift box photo, real reviews with dates, a current stockist willing to be named, a real order-by date, the line sheet and terms.
4. **Season and stock facts**: order-by dates, stock available, the season cap on gift boxes if any.

Optional: notes from calls, the buyer's likely objections (shelf space, price, minimums, timing).

If a lead's consent for WhatsApp is unknown, treat it as no. If there are no new assets, the sequence gets shorter, not padded. Writing drafts in the client's mailbox needs draft access (level 2). Sending, or scheduling sends from a tool, needs the client's yes for the list and the copy, or level 3 with written limits.

## Before you start: the gates

1. **The offer still makes money.** Pass when the price list or gift box pricing has passed its margin check, so follow-ups never need a discount to close. Fail: fix pricing with `build-wholesale-price-list-and-terms` first.
2. **Stock for a yes.** Pass when the store can fill the orders a successful sequence would bring, including reorders [OPS-0022].
3. **Email rules.** Every commercial email to US recipients, business or not, needs accurate sender details, an honest subject line, the store's postal address and an opt-out honoured within 10 business days [EML-6385]. Apply the same standard everywhere.
4. **WhatsApp rules.** Message only people who opted in; honour any block or stop; outside 24 hours since their last message, use approved templates only [EML-6320].

## Steps

### 1. Sort every lead by stage

No reply, interested (replied, asked for more), sampled, quoted, first order placed. One lead sits in one stage. A reply of any kind moves the lead out of automation to a person.

### 2. Apply the touch rules

- Each touch adds one new thing: a photo, a proof, an answer to a likely objection, a real date, an easier first step. Never "just checking in".
- One ask per message, answerable in one line.
- Email under 90 words. WhatsApp and SMS lines short; for lead texts, under about 80 characters with an open question, and a human takes over at the first reply [EML-0031].
- No discounts to close. Make the first step smaller instead (fewer SKUs, one case, a trial gift order).
- No invented urgency: dates and caps must be real.

### 3. Write the "no reply" sequence

Practitioner timing, test it:

- **Day 3 or 4, email:** new thing: a photo of the product on a shelf or a packed gift box. Ask: "Worth sending the line sheet?"
- **Day 8 to 10, email:** new thing: answer the likely objection in two lines (for shops: shelf space and slow sellers, with the reorder minimum; for companies: delivery to many addresses). Same ask.
- **Day 16 to 18, phone call** in quiet hours (shops: weekday mornings, not weekends; offices: mid-morning). Script: who you are, the one reason they fit, one question.
- **Day 25 to 30, email, the close:** "I will stop here. If stocking [product] makes sense later, reply any time." Then park.

### 4. Write the "interested" sequence

- **Same day:** send what they asked for, with the one next step (sample, call, quote).
- **Day 3:** answer the question they are likely to ask next (minimums, terms, delivery).
- **Day 7:** ask for a decision date: "When will you decide on new brands for this season?"

### 5. Write the "sampled" sequence

Samples sent only on request [OFF-0057].

- **Delivery day:** confirm arrival, one tip on how to try it.
- **Day 5 to 7:** ask for feedback with one question: "Would it sell at [retail price] on your shelf?"
- **Day 12 to 14:** offer the small opening order with the order form attached.

### 6. Write the "quoted" sequence

- **Day 2:** confirm the quote arrived; offer to adjust quantity or box mix, not price.
- **Day 5 to 7:** remind of the real order-by date or the season cap if one applies.
- **Two days before the quote expires:** last reminder; after expiry, a new quote at current prices.

### 7. Write the "first order placed" sequence

Turning a first order into reorders is where wholesale pays.

- **On delivery:** thank-you and display tips, shelf card or tester offer.
- **Day 14:** ask how it is selling and which SKU moves fastest.
- **Day 30, or when their expected sell-through is near:** reorder prompt with the reorder minimum. Sell-through, not the first order, is what turns into cash [FIN-0028]. An empty shelf can end the account, so prompt before they run out [OPS-0022].
- **Corporate:** 10 months later, a note before next season with last year's order attached.

### 8. Set stop and re-try rules

- Any reply: stop the sequence; a person answers within one working day.
- "No" or "not now": thank them and close. Re-try once after 90 to 180 days only with a genuinely new reason (new product, new season, a stockist nearby). At most twice a year.
- Opt-out, unsubscribe, "stop" or a WhatsApp block: stop at once on every channel and record it [EML-6385] [EML-6320].
- Bounce or wrong person: find the right buyer once, then stop.

### 9. India and US notes

- **India:** WhatsApp is often the buyer's preferred channel, but only after they share the number for this; send outside the 24-hour window as approved templates [EML-6320]. Send in the language the buyer used. Festive deadlines (Diwali gifting) compress the corporate sequence to the order-by date. Avoid bulk SMS to cold numbers.
- **US:** email first; phone for interested and quoted leads. Every email carries the postal address and opt-out line [EML-6385].

### 10. Approve and track

Show the client all five sequences, the lead list with stages and the stop rules. Send nothing until approved. Update the tracker after every touch.

## Checks before you hand it over

- Every touch adds one named new thing and has one ask.
- No message offers a discount to close or states a date or cap that is not real.
- Every email has the postal address and an opt-out line.
- WhatsApp is planned only for leads with recorded opt-in, with templates outside 24 hours.
- Each sequence ends with a clean close and a park date.
- Stop rules cover reply, no, opt-out, block and bounce.
- The first-order sequence includes a reorder prompt timed to sell-through.
- Nothing was sent without the client's yes.

## Output

1. **One-screen summary:** leads by stage, the next 10 touches due this week, assets used, and the runner-up approach in one line.
2. **Sequence sheet**, one tab per stage: Touch #, Send day, Channel, New thing added, Message text (subject and body, or WhatsApp template name and text), Ask, Stop if.
3. **Tracker:** Lead, Business, Type, Stage, Channel, WhatsApp opt-in (yes, no, date), Last touch, Next touch date, Status, Outcome, Park until.
4. **Call script card:** opener, reason they fit, one question, how to log the answer.

## Common mistakes

- **"Just checking in".** Step 2 makes every touch add something.
- **Discounting to close.** The margin gate and step 2 shrink the first step instead.
- **WhatsApp without consent.** Gate 4 and step 9 require opt-in [EML-6320].
- **Endless chasing.** Step 3 ends with a clean close; step 8 limits re-tries to twice a year.
- **Stopping at the first order.** Step 7 builds reorders on sell-through [FIN-0028].
- **Automation replying to a reply.** Step 1 moves any reply to a person.

## Sources

- EML-6385: CAN-SPAM covers business email; address, opt-out within 10 business days.
- EML-6320: WhatsApp opt-in, opt-out and templates outside 24 hours.
- EML-0031: short lead texts with an open question; human takes over at reply.
- OFF-0057: samples pay when requested.
- OPS-0022: an empty retailer shelf can end the account.
- FIN-0028: sell-through drives cash.

What makes this skill ours: sequences are split by stage so a sampled or quoted lead never gets a cold-lead message; every touch must add a named new asset; the money gate means follow-ups never need a discount; and the sequence keeps going after the first order, timed to the stockist's sell-through so reorders arrive before the shelf is empty.
