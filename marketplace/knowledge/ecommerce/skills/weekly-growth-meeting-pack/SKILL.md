---
name: weekly-growth-meeting-pack
description: "A one-page weekly growth pack for the founder and team: what changed in sales, profit and new customers, why it changed (split into traffic, conversion and order value, with noise and reporting delays ruled out), what was decided, and who does what by when. Leads with contribution after ads and new-customer cost, corrects the known Shopify, GA4, Meta and Google reporting traps, grades last week's decisions, and keeps a decision log with the signal to watch and when to undo. Includes a 30-minute meeting agenda. Use every week before the growth meeting, or when the team argues about numbers instead of deciding."
---

# Weekly growth meeting pack

**You get:** a one-page pre-read (five headline numbers, what changed and why, one main constraint, one win, one oddity, up to five owned actions) plus a decision log and a 30-minute agenda, ready to send the day before the meeting.

## When to use

- The team meets weekly about ads, email, site and offers, and the meeting runs long without decisions.
- The founder wants one page instead of five dashboards.
- Numbers from Shopify, GA4 and the ad platforms disagree and the meeting gets stuck on which is right.
- Last week's decisions were never checked.

## Not for

- Building the weekly numbers sheet itself: use `build-weekly-kpi-dashboard`; this pack reads it.
- A whole-business review across stock, support and finance: use `weekly-store-operating-review`.
- Deep diagnosis of a sudden drop: use `store-results-drop-diagnosis`, then bring its finding here.
- The monthly report for the owner or investors: use `monthly-store-performance-report`.

## What you need

Required (read access, level 1):

1. **Shopify**: orders export or Analytics for this week and the four weeks before (net sales, orders, new and returning customers, discounts, refunds).
2. **Ad spend and results by channel**, same weeks, from each ads manager, Meta on 7-day click.
3. **GA4 or Shopify sessions** by channel and device, same weeks.
4. **Gross profit per order** (from `build-sku-profit-sheet` or `store-meta-math`).
5. **Last week's decision log** (empty on the first week).
6. **Change log**: price, offer, site, stock, tracking, budget and creative changes with dates.

Optional: email and SMS revenue by send, stock by hero SKU, new-customer cost table from `new-customer-cost-by-channel`.

If gross profit per order is missing, the pack shows revenue only, marks every profit line "open" and lists the cost data needed. Nothing here needs more than read access; actions agreed in the meeting are carried out by their owners at the access level the owner set.

## Before you start: the gates

1. **The week is closed.** Use complete weeks in the store's time zone. Fail: wait or mark the last day partial.
2. **Sources reconcile.** Ad spend equals invoices or account totals; Shopify orders exclude test and cancelled orders. Fail: report the gap with its size and block budget decisions it could change.
3. **Profit basis is stated.** Contribution after ads = net sales - delivered costs - ad spend. Fixed costs stay out of the weekly read [MEA-0030]. Fail: revenue-only pack, flagged.
4. **Data is mature.** Google credits sales to the click date, so the last 3 to 4 days look weak [MEA-0051]. Fail: label recent days immature; do not decide on them.

## Steps

### 1. Pull the goal metric and the five headline numbers

The first line is the owner's goal metric in their words (from `store-90-day-growth-plan`; if none, contribution after ads as a share of net sales), sum shown.

| Number | Formula |
|---|---|
| Owner's goal metric | As defined in the plan, working shown |
| Contribution after ads | Net sales - delivered costs - ad spend |
| New customers | First-time buyers from store orders |
| Cost per new customer | Paid acquisition cost / new customers |
| Acquisition MER | New-customer revenue / ad spend [MEA-0039] |
| Returning customer profit | Gross profit from repeat orders [MEA-0055] |

Show each against last week, the 4-week average, the same week last year and the quarter's baseline and day-90 target. Each line has one owner and the threshold that triggers action.

### 2. Correct the reporting traps

- Shopify books returns on the refund date, so a strong month can be followed by a false dip [MEA-0011].
- Shopify sessions include bot traffic that GA4 filters; check sessions in GA4 before reading a conversion drop [MEA-0012].
- Shopify's dashboard AOV excludes shipping charged [MEA-0013].
- Shopify's returning customer rate rises when acquisition slows; use first-time and returning counts instead [MEA-0014].
- Meta read on 7-day click, not the view-heavy default [MEA-0042].

Write one line under the numbers: "Corrected for: ...".

### 3. Split what changed

Sales = sessions x conversion rate x order value. Break the change into those three parts so they add up to the total. Then decide if it is real:

- Small moves compound: a 5% order value dip and a 4% conversion dip make about 10%, which is often normal noise [MEA-0009].
- Conversion rate falls when cold spend grows, because cold traffic converts less than warm [MEA-0015]. Read contribution per visitor, not conversion rate alone.
- In small accounts, daily swings are noise; read 7 days [ADC-0064].

Mark each move "real", "noise" or "immature". Any screen or rule of thumb that decides something is shown with its sum and source, or dropped.

### 4. Find why, in a fixed order

Check, and stop at the first that explains most of the change [MEA-0018]:

1. Change log: anything changed on those dates?
2. Tracking: did purchases reaching each platform drop while store orders did not?
3. Stock and site: sell-outs, slow pages, checkout or payment errors.
4. Offer and price.
5. Channels weighted by spend share, then the top 5 campaigns by spend.
6. Creative fatigue and season.

Use "linked to" unless a test or a clear mechanism proves cause.

### 5. Name one constraint, one win, one oddity

- **Main constraint:** the single thing that limits profit growth this week, with the evidence for and against. If the evidence is weak, list two candidates and the smallest test that separates them.
- **Win:** what worked, with the number.
- **Oddity:** something that does not fit and needs a check, with an owner.

### 6. Grade last week's decisions

For each entry in the log: done or not, the signal it predicted, what happened, grade (hit, partial, miss, too early, not done). Hand the running record to `recommendation-scorekeeping` monthly.

### 7. Draft the actions

Up to five. Each needs: the issue, its size in the goal metric's unit and money per week (sum shown, one unit for all, so they rank by sorting), the exact next step, owner, due date, the signal that shows it worked, a guard line (what makes us stop), and the access level it needs. "Monitor" is not an action unless it names the number, the threshold and the response. Any spend, send or live change in an action still needs the owner's yes before it happens.

Failed delivery note: where many orders fail delivery or are paid later (pay on delivery, invoice), add delivered orders and the failed delivery rate to the headline table, as placed orders overstate the week.

### 8. Write the agenda

30 minutes: 5 minutes on the headline and corrections (no debating numbers already reconciled), 10 on the main constraint, 10 on decisions and owners, 5 on last week's grades. Disputed numbers go to an owner to resolve after the meeting.

## Checks before you hand it over

- The pack fits on one page; detail is in an appendix.
- The owner's goal metric leads, with working; then contribution after ads and new-customer cost, not revenue or ROAS.
- Every headline line has a baseline, day-90 target, owner and action threshold.
- Every action is sized in the goal metric's unit and money per week. Mixed units fail.
- Every headline number names its source and basis.
- The sales change splits into sessions, conversion and order value that add up.
- Immature days and noise are labelled, not explained away.
- No more than five actions, each with owner, date, signal and guard line.
- Last week's decisions are graded.
- No causal claim without a test or clear mechanism.

## Output

**The one-page pack:**

1. **Headline table:** Number, This week, Last week, 4-week average, Same week last year, Baseline, Day-90 target, Owner, Action threshold, Source.
2. **Corrected for:** one line.
3. **What changed:** sessions, conversion, order value effects in money, each marked real, noise or immature.
4. **Main constraint / Win / Oddity:** three short paragraphs.
5. **Actions:** Issue, Goal-metric impact, Money per week, Next step, Owner, Due, Signal, Guard line, Access needed.

**Decision log** (`growth-decisions.csv`, one row per decision): Date, Decision, Basis, Owner, Expected signal, Review date, Undo if, Grade, Grade note.

**Agenda:** four timed items as in step 8.

**Appendix:** channel table (spend, new customers, cost per new customer, contribution), top 5 campaigns, change log for the week.

## Common mistakes

- **Leading with ROAS or revenue.** Step 1 leads with the owner's goal metric, contribution and new customers.
- **Numbers with no target.** Step 1 gives each line a baseline, target, owner and action threshold.
- **Arguing about whose number is right.** Gate 2 and step 2 reconcile before the meeting.
- **Explaining noise.** Step 3 labels normal swings as noise.
- **Deciding on immature days.** Gate 4 labels the last days of Google data.
- **Ten actions, none done.** Step 7 caps at five with owners and dates.
- **No memory.** Step 6 grades last week so the team learns which calls work.

## Sources

- MEA-0009: compounded small dips are often noise.
- MEA-0011: Shopify returns on refund date.
- MEA-0012: Shopify sessions include bots.
- MEA-0013: Shopify AOV excludes shipping.
- MEA-0014: returning customer rate moves with acquisition.
- MEA-0015: conversion rate falls as cold spend scales.
- MEA-0018: top-down order for finding a drop's cause.
- MEA-0030: track contribution without fixed costs.
- MEA-0039: acquisition MER over blended MER.
- MEA-0042: Meta on 7-day click.
- MEA-0051: Google credits the click date.
- MEA-0055: split first-time and returning profit.
- ADC-0064: small accounts swing daily.

What makes this skill ours: the pack leads with contribution after ads and new-customer cost; known Shopify, GA4, Meta and Google traps are corrected in writing before the meeting; every change is split into sessions, conversion and order value and labelled real, noise or immature; and every decision carries a signal, a guard line and a grade the next week.
