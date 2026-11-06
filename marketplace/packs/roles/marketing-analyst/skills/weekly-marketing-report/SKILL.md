---
name: weekly-marketing-report
description: Turns GA4, ad platform and store or CRM exports into one page an owner can read in two minutes - three to five numbers defined once, checked against the backend, compared with last period and target in numbers and percent, what moved and the likely reason, three actions ranked by payback, one thing to watch and the data gaps with the export that would fill each. Use for a weekly or monthly marketing report, when dashboards exist but nobody reads them, or when an agency's report needs a plain second read.
---

# Weekly marketing report

A good report is short because the thinking happened before it was written. Each number is defined once, checked before it is compared, and explained with the other numbers, not with guesses.

## When to use

- Every week (or month) for an owner or team who has the data but no time.
- An agency sends a long deck and the owner wants the three things that matter.
- Before a budget decision, to agree what happened last period.

## What you need

1. The goal for the period: orders, revenue, booked jobs, qualified leads, with a target if one exists.
2. Exports for this period and the last: backend orders and revenue (after refunds), GA4 sessions and key events by channel, spend and results from each ad platform, email results if relevant.
3. Margin or contribution margin per order, if cost decisions are in scope.
4. Anything that changed: offers, prices, stock, site changes, campaigns started or stopped, tracking fixes.

**Access:** level 1 to read the accounts or the exports; level 2 to build the report as a draft (a Data Studio page or a document) that only the client can see; level 3 to send or share the approved report to the agreed people on the agreed schedule. Sending to a new audience needs a fresh yes.

## Steps

### 1. Pick and define the numbers
Choose three to five numbers tied to the goal, for example backend revenue, new customers, cost per new customer, marketing efficiency ratio (revenue ÷ marketing spend) and one leading signal such as qualified leads. Write each definition once: what is counted, from which source, before or after refunds and tax. Reuse the same definitions every week.

### 2. Check the data before comparing
- Same date range and time zone in every export.
- No double counting: platform conversions are not added together; backend is the total.
- Tracking gaps noted: tags changed, consent changes, outages, the share of Unassigned or "(not set)".
- Spend includes every channel the client pays for, including agency fees if MER is in scope.
If a check fails, say what it changes and report anyway with the caveat.

### 3. Compare
For each number, show this period, last period, change as a number and as a percent, and target. Use the same period last year too when the business is seasonal.

### 4. Explain what moved
Use the other numbers to explain: did revenue fall because fewer people came, fewer bought, or each spent less? Did cost per customer rise because spend rose or customers fell? Did one channel or campaign drive the change? Say "likely" when cause is not proven, and never claim a channel caused a result without a test.

### 5. Recommend
Three actions, ranked by expected payback, each with the number it should move and who does it. Then one thing to watch next week, with the level that would trigger action.

### 6. Cost limits (when asked)
Show the most the business can pay to win a customer: contribution margin per first order, plus repeat purchases over a period the client has actually observed, minus nothing invented. Show the working and say which inputs are assumptions. Compare with this period's cost per new customer.

### 7. List data gaps
For each gap, name the exact export or setting that would fill it, for example "Shopify orders export with discount codes" or "GA4 data retention set to 14 months".

## Checks

- Every number has one definition and one source.
- Backend totals anchor revenue and orders.
- Changes are shown as numbers and percents, and the maths is right.
- Explanations use other numbers; unproven causes say "likely".
- Actions are specific, ranked, and owned.
- The report fits on one page; detail goes in an appendix.
- Nothing is shared beyond the people the client approved.

## Output format

1. Headline: one sentence on the period
2. Scoreboard table: number, definition link, this period, last period, change, target
3. What moved and why (three to five bullets)
4. Three actions, ranked, with owner
5. One thing to watch
6. Data gaps and the export that fills each
7. Appendix: definitions, channel detail, workings

## Example of good output (short)

*Made-up business: Brookfield Tea Co., an online tea shop. Figures are invented for illustration.*

> **Headline:** Revenue rose, but new customers fell and cost more.
>
> | Number | This week | Last week | Change | Target |
> |---|---|---|---|---|
> | Revenue (Shopify, after refunds) | £14,200 | £12,900 | +£1,300 (+10.1%) | £13,500 |
> | New customers | 118 | 141 | −23 (−16.3%) | 140 |
> | Cost per new customer | £31.40 | £24.80 | +£6.60 (+26.6%) | £26 |
> | MER (revenue ÷ marketing spend) | 3.8 | 3.7 | +0.1 | 3.5 |
>
> **What moved:** Revenue growth came from returning customers buying the advent box (likely the email on Tuesday: 212 orders used its code). New customers fell while Meta spend held at £2,600, so cost per new customer rose. Meta's prospecting ads are in their fifth week with the same three images; click-through fell from 1.4% to 0.9%.
>
> **Actions:** 1) Refresh the prospecting images this week (media buyer). 2) Send the advent email to lapsed buyers (email, level 3 on your list). 3) Add a "How did you hear about us?" question at checkout.
>
> **Watch:** if cost per new customer stays above £30 next week, cut prospecting spend by a quarter until new images are live.
>
> **Gap:** the Instagram link-in-bio has no UTMs, so 9% of sessions sit in Unassigned. Fix: tag the link with `utm_source=instagram&utm_medium=social&utm_campaign=bio`.
