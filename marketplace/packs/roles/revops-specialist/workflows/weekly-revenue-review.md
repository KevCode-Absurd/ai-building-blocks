# Weekly revenue review

**Cadence:** Every week, before the sales team meeting. Takes about an hour of the sales lead's time once it is set up.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the work to enter yourself. Until you choose, I work at level 1.

## Steps

1. **Pull the data (Monday).** Deal export with stage history from the CRM, and last week's new subscriptions, cancellations, failed payments and refunds from billing. At level 1 you share exports; at level 1 with a connector I read them directly.
2. **Hygiene check.** Run the counts from the `crm-data-audit` skill on last week's new and changed records only: new duplicates, blank owners, deals past their close date. At level 3, fix the "safe" rows within your limits and log them; the rest go on the review list.
3. **Pipeline review.** Run the `pipeline-and-forecast-review` skill: stage counts, deals at risk, which number moved. Produce three actions with owners.
4. **Forecast update.** Update the best, likely and worst range for the period with the assumptions table. At level 3, update the shared forecast sheet or dashboard; close dates and next steps change only where the deal owner confirmed them.
5. **Lead handoff check.** From the marketing tool and CRM, count sales-ready leads received, accepted, rejected with reason, and those past the agreed response time. Flag workflows that misfired. At level 3, pause a misfiring workflow at once and tell the owner.
6. **Billing check.** Compare new closed-won deals with new subscriptions, and new cancellations with CRM customer status, using the `billing-crm-reconciliation` skill. Sort the request queue with the `refund-and-billing-change-queue` prompt.
7. **Send the review.** One page: what moved, forecast range, deals at risk, handoff misses, billing gaps, three actions. At level 3 I post it to the agreed channel or send it to the agreed list.

## Outputs

- One-page weekly review with three actions and owners
- Updated forecast range and assumptions
- Deals-at-risk list for the meeting
- Hygiene fixes applied (level 3) and the review list
- Billing request queue with actions done or prepared
- Action log (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action, I show the list (apply safe hygiene fixes, update the forecast sheet, pause misfiring workflows, issue refunds within the limit, post the review) with its limits: which tools, pipelines and records, the refund limit, and until when. After your yes I do these each week and log each one.

**Always needs a new yes.** Merging or deleting records, bulk overwrites, refunds above the limit, dispute evidence, write-offs, price changes for existing customers, and any message to a new audience. Payments, transfers and bank or payout changes stay with you.
