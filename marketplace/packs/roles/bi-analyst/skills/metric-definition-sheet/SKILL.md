---
name: metric-definition-sheet
description: Turns a business goal into a KPI tree and a sheet of exact metric definitions (meaning, formula on real columns, grain, time window, filters, edge cases, source, owner, rhythm), and settles metrics that teams count two ways. Use it before building any dashboard, when teams argue about a number, when setting quarterly goals or OKRs, or when a report's numbers drift from month to month.
---

# Metric definition sheet

## When to use

- Before a dashboard or report is built, so the build has exact targets to hit.
- When two teams report different numbers for the "same" metric ("active customers", "utilisation", "repeat rate").
- When an owner sets yearly or quarterly goals and wants drivers, not just a revenue target.
- When a metric is about to become a target or part of someone's pay.

## What you need

1. The goal in the owner's words, with a date if there is one.
2. The reports used today (screenshots or exports) and who reads them.
3. Column lists and 10 to 20 sample rows from each source, with names, emails and phones replaced by IDs.
4. Any rules already written down: refund policy, what counts as a cancellation, financial year, time zone.
5. Last period's figures, if you have them, to test the tree.

Access: level 1 is enough. Reading the current model or report definitions in the tool saves time but changes nothing.

## Steps

### 1. Write the goal as one number with a date

"Grow" becomes "Revenue of £1.2m in the year to 31 March 2027". If the brief is vague, propose a measurable version and mark it "to confirm". Never set the target yourself; if no target was given, leave the field as "owner to set".

### 2. Build the KPI tree

Split the goal into drivers that multiply or add up to it. Write the formula that links each level to its parent.

```
Revenue = Active customers × Visits per customer × Spend per visit
Active customers = Retained customers + New customers
New customers = Leads × Lead-to-customer rate
```

Go two or three levels down and stop at numbers a person can act on this week (bookings made by the front desk, leads followed up within a day). Mark each metric leading (moves before the result) or lagging (records the result).

### 3. Check the tree adds up

Plug in last period's figures. If the top number does not come out within rounding, a definition or a source is wrong. Find which before going on.

### 4. Write a card for every metric

For each metric, fill every field:
- **Name** in one naming pattern (noun first: "Customers, active").
- **Meaning**: one plain sentence.
- **Formula**: in words and in the target tool's syntax, on the real column names. Ratios are sum of numerator divided by sum of denominator, never an average of row ratios (Kimball's non-additive rule).
- **Grain**: what one row of the source means.
- **Time window and zone**: calendar month, rolling 28 days, financial year; which time zone.
- **Filters**: what is excluded (staff accounts, test orders, internal transfers).
- **Edge cases**: refunds (which month do they land in?), part refunds, cancellations, no-shows, duplicates, merged customer records.
- **Source system and table**, **owner** (a person, not a team), **review rhythm** (weekly or monthly).
- **Guardrail**: for any metric that will be a target, name the counter-metric that would show gaming (bookings per stylist, guarded by rebooking rate and complaints).

Where the brief does not settle a rule, write it as a question with a recommended answer. Never choose silently.

### 5. Settle the metrics counted two ways

For each disputed metric, show both formulas side by side, run them on a small example from the sample rows, and explain the gap in plain words. Recommend one definition and say which reports change and by how much.

### 6. Hand over for sign-off

The owner approves each card. Until then, cards are marked "draft". At level 2 or 3, write approved definitions into the tool as descriptions on measures or metrics, so the meaning travels with the number. Changing a definition already in use needs the owner's yes and a release note.

## Checks

- Every column and system name comes from the brief or is marked [placeholder].
- The tree reproduces last period's top number, or the gap is explained.
- Every ratio is built from summed parts.
- No target, benchmark or industry average appears that the owner did not give.
- Every disputed metric has both formulas, a worked example and one recommendation.
- Every metric that is or will be a target has a guardrail.
- One naming pattern throughout.

## Output format

1. Goal statement (number, date, status: confirmed or to confirm)
2. KPI tree as a Mermaid diagram plus the formulas
3. Tie-out of the tree to last period
4. Metric cards (one table, or one block per metric)
5. Conflicts: side-by-side formulas, worked example, recommendation
6. Open questions with recommended answers
7. Change list for existing reports

## Example of good output

*Made-up business, for illustration only: "Harbour Lane Physio", a three-clinic practice.*

> **Goal (to confirm):** 21,000 attended appointments in the year to 31 March 2027. Target given by owner: yes.
>
> | Metric | Meaning | Formula | Grain | Window | Edge cases | Owner |
> |---|---|---|---|---|---|---|
> | Appointments, attended | Appointments where the patient came | COUNTROWS(FILTER(Appointments, Appointments[Status] = "Attended")) | One booking | Calendar month, Europe/London | No-shows and late cancels excluded; rebooked slots count once | Clinic manager |
> | Utilisation, clinician hours | Share of bookable hours that were booked and attended | DIVIDE(SUM(Sessions[AttendedMinutes]), SUM(Rota[AvailableMinutes])) | One clinician-day | Calendar month | Training days removed from available minutes | Operations lead |
>
> **Conflict:** Finance counts "active patients" as anyone billed in 12 months (1,840 in the sample); reception counts anyone with a future booking (1,212). Recommendation: keep both, rename them "Patients, billed in 12 months" and "Patients, with future booking", because they answer different questions.
