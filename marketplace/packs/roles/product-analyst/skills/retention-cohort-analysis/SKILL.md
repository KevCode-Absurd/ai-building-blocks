---
name: retention-cohort-analysis
description: Builds a retention cohort grid from sign-up, activity, order or cancel data - start event, return event, period and retention criterion agreed first ("on" or "on or after"), a data check with counts set aside, cohorts by start month or week, counts and percentages in every cell, too-new cells marked with a dash - then finds the steepest drop, compares plans, channels and early behaviours with small groups flagged, gives monthly churn and median time to cancel, and leaves COUNTIFS or SQL to refresh it. Reading data is level 1; publishing a shared retention dashboard is level 3. Use it for subscriptions, memberships, apps and repeat purchase.
---

# Retention cohort analysis

## When to use

- "How long do members stay, and which plan keeps them longest?"
- "Churn feels high after month 2. Is it?"
- "Do first-time buyers come back for a second order?"
- "Does any channel bring users who stick?"

## What you need

1. A file with one row per customer or per event, IDs only: start date (sign-up, join, first order), and either a cancel date, last active date or every activity date. Plan, channel, site or other groups if they are to be compared.
2. The rules, or my proposed ones to confirm: what counts as active, whether a pause counts as churn, what counts as coming back.
3. Known events in the period: price changes, closures, a new app version.
4. Access: level 1 covers everything. Saving the grid as an unshared report is level 2; publishing or sharing a dashboard inside your tool is level 3, with the viewers agreed.

## Steps

### 1. Agree the definitions first

Write them above everything else:
- **Start event:** what puts someone in a cohort (paid first month, first order, account created).
- **Return event:** the action that shows they are still getting value (a visit, an order, a lesson attended). "Any event" is rarely right; app opens alone can flatter.
- **Period:** month for subscriptions and memberships, week for apps, and the time zone.
- **Criterion:** "on" (came back in that exact period) or "on or after" (came back then or later). Tools differ: Mixpanel defaults to "on or after", PostHog to "on" [17][21]. Amplitude calls them N-day and unbounded [13]; unbounded always reads higher.
- **Churn, pause and return:** when a customer counts as gone; whether paused counts as active; whether someone who cancels and rejoins is "reactivated" in their first cohort or starts a new one.
If the brief does not say, state my choice as a question at the top and continue.

### 2. Check the data

Report rows read, date range, blank or impossible dates (cancel before join), duplicate IDs, staff and test accounts. Count everything set aside. Cohort sizes must add up to the clean total.

### 3. Build the grid

Rows: cohorts by start month or week, with cohort size. Columns: periods since start (0, 1, 2 ...). Each cell: number still active and that number over cohort size. Period 0 is 100% by definition [13].

### 4. Mark what is too new

A cohort that started last month cannot have a month-6 value. Show those cells as a dash, never a zero, and leave them out of averages. Mixpanel marks still-open buckets with an asterisk and averages only completed periods [17].

### 5. Read the shape

- The single steepest drop period: name it first.
- Whether the curve flattens, and at what level.
- Whether newer cohorts sit above or below older ones at the same age.
- A weighted average across cohorts (by cohort size), labelled as such.

### 6. Compare groups

Build the same grid, or the month-3 and month-6 values, by plan, channel, site or first-week behaviour. Show each group's size. Flag groups too small to judge (agree the minimum size with the client); with very small groups one person moves the rate a lot. Groups that stay longer are "linked with" staying; they do not prove a cause.

### 7. Churn and time to cancel

Monthly churn: customers who cancelled in the month over customers active at its start. Median time to cancel: for each cohort, the month by which half had cancelled; if fewer than half have cancelled, say "not reached yet". For shops: the share of first-time buyers with a second order within 30, 60 and 90 days, by first-order month, with the revenue at stake.

### 8. Leave a refresh recipe

COUNTIFS formulas or SQL using the client's column names. State the SQL dialect.

### 9. Write it up

Plain summary first: how many stay to month 3 and month 6, the best and worst group, the steepest drop. Then the grid, then the comparisons, then limits. If a dashboard is wanted, sketch its layout: the grid, the month-3 trend by cohort and the group comparison, each with its rule in the title. Building it in a BI tool belongs to the BI analyst kit.

## Checks

- Start, return, period, criterion and churn rules written above the grid.
- Cohort sizes add up to the clean total from the data check.
- Every percentage shows its count; too-new cells are dashes and excluded from averages.
- Small groups flagged; nothing from outside the file appears.
- "Linked with" used for patterns; no claim of cause without a test.
- The recipe runs on the client's columns.

## Output format

```
# Retention: [business], [date range]
Rules: start = [x]; return = [x]; period = [x]; criterion = [on / on or after]; pause = [x]
Data check: [rows read, set aside, clean total]

## Summary (3 lines)
## Cohort grid (count and %; dash = too new)
## Groups compared
## Churn and time to cancel
## Refresh recipe ([dialect])
## Limits
```

## Example of good output (short)

*Illustrative structure, not a real business: a bouldering gym with monthly memberships; joins January to June 2026, read on 1 October 2026. Copy the shape, never the content: every fact comes from the client's own context.*

> Rules: start = first paid month; active = membership paid that month; criterion = "on" (paid in that exact month); pauses count as active.
> Data check: 1,212 rows read; 9 test accounts and 4 rows with cancel before join set aside; 1,199 members.
>
> **Summary.** About 60% of members who joined January to April were still paying in month 3, and about 44% of January to March joiners in month 6. The steepest drop is month 1 to month 2. Annual-prepay members are linked with longer stays, but only 58 joined that way.
>
> | Join month | Members | M1 | M2 | M3 | M6 |
> |---|---|---|---|---|---|
> | Jan | 240 | 211 (88%) | 158 (66%) | 146 (61%) | 106 (44%) |
> | Feb | 198 | 172 (87%) | 129 (65%) | 119 (60%) | 85 (43%) |
> | May | 205 | 182 (89%) | 139 (68%) | 127 (62%) | - |
>
> Dashes: May joiners have not reached month 6. Grid for March, April and June is in the full table.
