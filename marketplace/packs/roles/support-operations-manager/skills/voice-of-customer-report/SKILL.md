---
name: voice-of-customer-report
description: Turns ticket exports, chats, reviews and survey answers into a weekly KPI pack and a monthly voice-of-customer report - every measure defined in one line, contact reasons counted by unique customers, themes ranked by reach and pain with real quotes (names removed), feature requests merged and scored, cost per contact reason from the client's own figures, and three fixes for product, operations or marketing. Use it when a team has ticket data but no time to read it, when the owner asks what customers keep asking, or before planning product and help centre work. Never invents counts or quotes and never judges individual agents.
---

# Voice of customer report

## When to use

- The owner asks "what are customers contacting us about, and what should we fix first?"
- The team has a help desk full of tickets but no regular report.
- Product, operations or marketing want evidence from customers before planning.
- Support costs are rising and nobody knows which reasons drive them.

## Access needed

- **Level 1 (read):** ticket exports, analytics, CSAT, reviews and survey answers.
- **Level 2 (read and draft):** build reports and dashboards unshared; draft new tags or help articles for gaps.
- **Level 3 (read, write and publish):** share the agreed dashboard, schedule the weekly pack to the agreed channel, apply agreed tags, and publish approved help articles. New recipients for the report need a fresh yes.

## What you need

1. The period and the decision the report supports.
2. A ticket export: created and solved dates, channel, tags, group, first reply time, replies, reopens, CSAT, first message text, with names and contact details removed.
3. Reviews, survey answers or call notes for the same period, if wanted.
4. Customer segment (plan, region, new or returning) if the client wants comparisons.
5. Cost per agent hour, if the client wants cost per reason.
6. Last period's report, if one exists.

## Steps

### 1. Confirm the source and the question

Note row counts, missing fields and the date range. Write the decision this report feeds ("what goes on the Q1 product list").

### 2. Remove personal data first

Strip names, emails, phone numbers and order numbers before reading. Never repeat them in quotes.

### 3. Define every measure

One line each, the same every week:
- **Volume:** new tickets created in the period, by channel.
- **First reply time:** median time from creation to the first public agent reply, filtered on created date.
- **Resolution time:** median time from creation to solved, filtered on solved date. Do not compare it directly with first reply time on the same chart, because the two cover different ticket sets in Zendesk (see `knowledge.md`, section 3).
- **Backlog:** open tickets at period end, by age band.
- **Reopen rate:** solved tickets reopened, divided by solved tickets.
- **Repeat contact:** customers with more than one ticket on the same reason within the period.
- **AI resolutions:** confirmed and assumed counted separately.

### 4. Tag reasons

Use the client's reason list, or propose 8 to 15 reasons from a sample. Tag each ticket with one reason and a type: bug, request, question, complaint, praise or cancellation reason.

### 5. Count unique customers

Merge duplicates. Count customers per reason, not messages, then by channel and week. Compare with last period and by segment where supplied.

### 6. Work out effort and cost

Handling time and replies per reason, repeat contacts and reopens. If the client gives cost per agent hour, show cost per reason. Use only their figures.

### 7. Score themes and requests

For each theme: reach (customers affected), pain (repeat contacts, CSAT, cancellation mentions) and fit with the client's goals. Show the scores so the client can disagree. Merge feature requests and count unique requesters.

### 8. Choose three fixes

For each of the top three reasons, the best fix and its owner: a help page or macro (support), a product change (product), a process change (operations), or clearer wording before purchase (marketing). Add two or three real quotes per theme.

### 9. Write the summary last

Five lines: the month, the trend, the biggest risk, the three fixes, and what the owner needs to decide. Then the detail. Say what the data cannot show and mark thin themes as thin.

### 10. Research (both modes)

With web search connected, check public reviews of the client's own business for the same period to compare themes. Without it, ask the client to paste reviews or survey answers.

## Checks

- Every number traces to the export and the stated period.
- Every measure has a one-line definition, including its date filter.
- Counts are unique customers, not messages.
- Quotes are real, short and anonymous.
- Small themes are marked as small; no conclusion from a handful of tickets.
- Nothing ranks or judges individual agents.
- Each fix has an owner outside support where the cause is outside support.

## Output format

1. Five-line summary.
2. KPI table with definitions and change from last period.
3. Reasons table: reason, unique customers, share, change, effort, cost.
4. Themes ranked, each with scores, two or three quotes and the fix.
5. Feature requests merged and ranked.
6. What the data cannot show.
7. Decisions for the owner.

## Example of good output (short)

*Made-up business for illustration: Tidewater Bikes, an online e-bike shop, October report.*

> **Summary.** 1,140 customers contacted us in October, up 9% on September. "Battery won't charge" grew fastest: 96 customers, up from 31, all on the Coast 2 model shipped after 1 October. The biggest risk is returns on that batch. Fixes: a help page on the charger reset (support), a batch check with the supplier (operations), a charger reset card in the box (product). Decision needed: whether to email all Coast 2 buyers before they contact us.
>
> | Reason | Customers | Share | vs Sept | Median replies |
> |---|---|---|---|---|
> | Where is my order | 402 | 35% | -4% | 1 |
> | Battery won't charge | 96 | 8% | +210% | 3 |
>
> Quote (battery theme): "The light flashes green then nothing. I've tried two sockets."
> Thin theme: "saddle too hard" (7 customers); watch, no action yet.
