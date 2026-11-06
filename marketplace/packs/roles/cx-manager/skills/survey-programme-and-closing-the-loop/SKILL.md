---
name: survey-programme-and-closing-the-loop
description: Designs and runs a customer feedback programme with NPS, satisfaction (CSAT) and effort (CES) questions at the moments that matter, with rules on who is asked, when and how often. Reads results honestly (base sizes, like-for-like comparisons, comment themes with counts and quotes, drivers of low and high scores) and closes the loop twice, by following up customers who asked for contact and by giving each recurring cause an owner, a fix and a check. Use it to set up a programme, to read a quarter's results, or when scores are collected but nobody acts on them.
---

# Survey programme and closing the loop

## When to use

- A business wants to start measuring how customers feel, or has scores and no idea what to do with them.
- A quarter's NPS or CSAT results are in and the board wants to know why they moved.
- Unhappy customers are leaving comments and nobody replies.

For writing the survey questions themselves, recruiting and consent, use the customer-insights-researcher kit's `feedback-survey-and-nps` prompt. This skill designs the programme around the questions and keeps it honest.

## What you need

1. The decisions the scores should feed (where to invest, which fix first, whether a change worked).
2. The customer moments: sign-up, purchase, delivery, first use, support, renewal, cancelling.
3. Customer numbers per moment and per month, and the channels you can survey through.
4. Survey and help desk exports with dates, scores, comments and segment fields, with personal details removed where possible.
5. What the privacy notice says about surveys and follow-up contact.

**Access:** level 1 to read exports and dashboards; level 2 to build unpublished surveys and draft follow-up messages; level 3 to publish and send surveys and send approved follow-ups within your limits. A reply that is a formal complaint response needs a fresh yes every time.

## Steps

### 1. Write the decision list

One line per decision, with who makes it and when. A score that feeds no decision gets dropped.

### 2. Map moments to measures

For each moment, choose:
- **Experience NPS or CSAT** straight after a specific moment (an order delivered, a case closed, a visit).
- **An effort question** after service contacts, where the risk is making customers work hard.
- **Relationship NPS** once or twice a year, not tied to a moment.

Never compare relationship and experience scores with each other. Keep each survey to the score question, one open "why" question and at most one or two questions tied to a decision, plus a separate "May we contact you about your answer?"

### 3. Set the sampling rules

Who is eligible, how soon after the moment, the most often one person can be asked (no more than once every three months is Bain's advice), exclusions (open complaints, staff, test accounts), and channels (email, in-app, SMS, phone for customers who do not use digital channels). Plan for people who drop out, not only those who finish.

### 4. Plan the follow-up before launch

- Who contacts customers who asked to be contacted, through which channel, and within how many working days.
- What the first message says: thanks, what we heard, what happens next. No arguing with the score, no asking them to change it.
- How the outcome is logged: cause, action, closed or open.
- Who owns each likely cause (delivery, billing, product, support).

### 5. Read the results

1. Base first: answers, response rate, dates, channels, and who is missing (a segment, a region, people who dropped out).
2. Score with the base beside it, and the trend against the same moment and channel.
3. Segments only where each group has enough answers to be worth reading; say so where it does not.
4. Code the open answers into themes. Count them, keep two exact quotes per theme, and note a counter-example.
5. Link themes to scores: which themes show up most among low scores, and among high ones.
6. Check behaviour alongside: repeat contacts, refunds, cancellations, drop-off points.
7. Call a change a trend only when the base is large enough and the change holds; otherwise call it a lead.

### 6. Close the loop with the cause

For the top causes, write: the cause in the customer's words, how many raised it, the owner, the fix, the date, and how you will know it worked (the theme count falls, repeat contacts fall, the score at that moment rises on a fair comparison).

### 7. Report

Answers and base first, then scores and trends, then themes, then fixes with owners, then last quarter's fixes and whether their causes fell. Share at the level granted.

## Checks

- Every score has its base and dates next to it.
- No relationship score is compared with an experience score.
- No customer is surveyed more often than the programme allows.
- Every theme has a count and exact quotes.
- Every customer who asked for contact has an owner and a due date.
- Every top cause has an owner, a fix and a measure.
- No unsourced "industry average".
- Survey and follow-up contact match the privacy notice: check this with local rules.

## Output format

1. Decision list.
2. Touchpoint table: moment, measure, eligible customers, timing, frequency cap, channel, questions, owner.
3. Follow-up plan: who, how fast, message draft, logging.
4. Results readout: base, score and trend, segments, themes with counts and quotes, drivers.
5. Fix list: cause, count, owner, fix, date, measure.
6. Loop log summary: contacts requested, made, resolved.

## Example of good output (short)

*Made-up business for illustration: "Copperpot Kitchens", a meal-kit subscription with about 4,000 customers.*

> **Base.** 612 answers to the post-delivery survey in Q3 2026 (19% of 3,210 sent), all by email. Customers who cancelled in their first month are under-represented (4% of answers); a short exit survey is added for Q4.
>
> **Score.** Post-delivery NPS +18 (Q2: +27, 590 answers). The fall is concentrated in deliveries after 8pm.
>
> | Theme (low scores) | Count | Quote | Owner | Fix | Measure |
> |---|---|---|---|---|---|
> | Late evening deliveries, food warm | 94 | "Box arrived at 9.40pm and the chicken was warm." | Ops lead | Move the last courier slot to 7pm; add ice packs for evening routes | Theme count and refund requests for warm food in Q4 |
> | Recipe card unclear on oven times | 41 | "Card said 20 minutes, it needed 35." | Food team | Test all cards in a home oven before print | Theme count; support contacts tagged "recipe" |
>
> **Loop.** 138 customers asked for contact; 131 contacted within two working days; 7 open.
