---
name: email-program-plan
description: Builds a 90-day email plan for a small business from its list export, past results and goals. Sets behaviour-based segments with rules, picks which automated flows to build first, and lays out a send calendar of newsletters and campaigns with one goal and one ask per email. Use when a business has a list but sends at random, only sends sale blasts, is starting a newsletter, or wants to know what to send, to whom and when.
---

# Email program plan

A plan answers four questions before anyone writes an email: who is on the list and how they got there, what each group should hear, which emails should run automatically, and what goes out on which date. This skill produces that plan from the client's own data.

## When to use

- The client sends "whenever we remember", or only discount blasts.
- A new newsletter or a relaunch of a tired one.
- A list has grown but sales from email have not.
- Before a busy season, to plan campaigns around real dates.
- After a deliverability fix, to restart sending in a sensible order.

## What you need

- **List export** (CSV) with sign-up date, sign-up source, consent field if any, last click date, last order or booking date, and tags. Ask the client to remove anything you do not need, such as phone numbers.
- **Past results** for the last 90 days: per email, the sends, clicks, orders or bookings, unsubscribes and spam complaints. Opens are optional and treated as unreliable.
- **Goals** for the next 90 days in plain words: "fill the spring course", "more repeat orders", "book consultations".
- **Offers and dates** the client knows about: launches, events, seasonal peaks, closures. Only real ones.
- **Platform:** which email tool, and whether it can trigger flows on purchase, booking, form fill or tag.
- **Voice samples:** two past emails the client liked.
- **Regions** the list covers (US, UK, EU), because consent rules differ.

**Access:** level 1 to read the list and results; level 2 to build segments and the calendar's emails as unsent drafts; level 3 to save segments and schedule sends on the approved calendar, within your limits.

If the client has no export, work from their description and mark the plan as a draft to confirm.

## Steps

1. **Check consent first.** Group contacts by how they joined: sign-up form, checkout opt-in, purchase only, event, imported list of unknown origin. In the UK and EU, purchase-only contacts can get marketing only under the similar-products rule with an opt-out offered at collection; contacts of unknown origin get no marketing until permission is confirmed. Flag any group that fails. In the US, opt-out law applies, but mailbox providers still expect wanted mail.
2. **Build segments by behaviour, then interest, then age.** Typical starting set:
   - *New* (joined in the last 30 days).
   - *Customers* (bought or booked at least once), split into one-time and repeat if numbers allow.
   - *Engaged non-buyers* (clicked in the last 90 days, never bought).
   - *Quiet* (no click, order or reply in a long time; the client sets the window from their usual buying cycle, and it should be longer than the normal gap between purchases).
   - *Interest groups* only where a tag or click history exists.
   Write each segment as a rule the platform can apply, and give it a message theme.
3. **Choose the flows, in order.** Rank by how many people hit the trigger and how close it is to revenue. Usual order: welcome; post-purchase or post-booking; follow-up on browsed products, carts, enquiries or quotes; win-back for lapsed customers; sunset for quiet contacts. Each flow gets a goal, a trigger, a rough number of emails and an exit rule. The lifecycle-flow-builder skill writes them.
4. **Set the cadence the client can keep.** A steady monthly newsletter beats a weekly one that stops in March. Tell subscribers the cadence at sign-up and keep to it. Leave rest weeks after a sale.
5. **Lay out the calendar.** For each send: date, segment, goal, type (newsletter, offer, news, story, event), subject idea, one main action, and any real deadline. Aim for most sends to be useful on their own (a tip, a story, a how-to), with offers in between.
6. **Plan the exclusions.** Who should not get each send: recent buyers of the same item, people in an active flow, quiet contacts, anyone who complained.
7. **Set the measures.** Main metric per email (clicks, orders, bookings or replies), guardrails (unsubscribe and complaint rates), and the review date. Note that open rates are inflated by Apple Mail Privacy Protection.
8. **List assumptions and questions** the client must answer before anything is written.

## Checks

- Every segment has a consent basis that suits the regions on the list.
- Every segment rule can be built in the client's platform with fields that exist.
- Flows come before extra campaigns, and each has an exit rule.
- One goal and one main action per send.
- No invented offers, dates or stock claims; every offer is marked "client to confirm".
- Quiet contacts are not mailed with everyone else; a sunset step exists.
- The cadence matches what subscribers were promised.
- Measures are clicks, orders, bookings or replies, with complaints as a guardrail.

## Output format

1. **Summary** (five lines): list size by segment, the main goal, the first flow to build, the cadence, the biggest risk.
2. **Consent table:** source group, count, region, basis, action (mail, confirm, exclude).
3. **Segment table:** name, rule, size, theme.
4. **Flow plan:** order, flow, trigger, number of emails, goal, exit rule.
5. **90-day calendar:** date, segment, type, goal, subject idea, main action, exclusions.
6. **Measures:** what to read, when, and what would change the plan.
7. **Questions for the client.**

## Example of good output (short)

*Illustrative structure, not a real business: a two-person bike repair shop with 2,400 contacts in the UK. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Summary:** 2,400 contacts; goal is spring service bookings before April; build the post-service flow first; send one newsletter a month plus two booking pushes; biggest risk is 600 contacts imported from an old raffle with no record of consent.

**Consent table (extract)**

| Source | Count | Basis | Action |
|---|---|---|---|
| Website newsletter form | 900 | Consent, recorded with date | Mail |
| Booked a service, opt-out offered at booking | 900 | Soft opt-in, service-related offers only | Mail service news and offers |
| 2022 raffle sheet | 600 | Unknown | Do not mail marketing; ask the client whether consent wording exists |

**Flow plan (extract)**

| # | Flow | Trigger | Emails | Exit |
|---|---|---|---|---|
| 1 | Post-service | Job marked complete | 3 over 6 months: care tips, review request, service reminder | Books again or unsubscribes |
| 2 | Welcome | Newsletter sign-up | 3 over 10 days | Books a service |

**Calendar (extract)**

| Date | Segment | Type | Goal | Subject idea | Main action |
|---|---|---|---|---|---|
| 4 Mar | All mailable, not booked in 60 days | Useful | Clicks | "The 5-minute check before your first spring ride" | Read the checklist |
| 11 Mar | Customers, last service over 9 months ago | Offer | Bookings | "Spring service slots for March (client to confirm dates)" | Book a slot |

*Why this works:* it settles consent before content, builds the flow that touches every customer first, and gives each send one goal the shop can measure in bookings.
