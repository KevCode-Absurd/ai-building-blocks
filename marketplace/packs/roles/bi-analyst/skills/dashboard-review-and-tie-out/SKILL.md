---
name: dashboard-review-and-tie-out
description: Reviews an existing dashboard or report whose numbers do not match the accounts, the till or another report, or that is slow, stale or ignored. Ties key numbers to trusted source totals, traces each gap to its cause (grain, joins, filters, time zone, refresh, credentials, row-level security, thresholds), and returns ranked fixes with corrected measures. Use it when someone says "the dashboard is wrong", before a board meeting, or when inheriting a BI estate.
---

# Dashboard review and tie-out

## When to use

- "The dashboard says £48k, the accounts say £51k."
- Two reports disagree on the same metric.
- A dashboard is slow, has not refreshed, or nobody opens it.
- A new owner inherits reports and wants to know which to trust.

## What you need

1. The dashboard or report (level 1 access, or screenshots of each page with filters shown).
2. The numbers that look wrong and the source totals people trust, with the period.
3. The model or data source definitions: tables, relationships, measures or calculated fields, blends, credentials mode, refresh settings.
4. The metric cards, if they exist.
5. Who sees the dashboard and in what role.

Never ask for passwords or connection strings. Level 1 is enough to diagnose; fixes in a copy need level 2; fixing the live report needs level 3.

## Steps

### 1. Agree what "right" means

For each disputed number, write the trusted source, its period, its time zone and what it includes (net or gross of refunds, VAT, delivery). Half of all mismatches are two correct numbers that measure different things.

### 2. Tie out the top numbers

Build a tie-out table for at least three numbers: dashboard value, source value, difference, tolerance. Then compare row counts from source to model. A row-count gap points to filters, joins or loading; a value gap with matching rows points to measures, signs or currencies.

### 3. Trace each gap through the usual causes

Work down this list and stop when the gap closes:
- **Filters:** page, report or chart filters nobody sees; test or staff rows included or excluded.
- **Grain:** order and order-line rows in one table; a join to a table at a finer grain that repeats rows (fan-out).
- **Joins and relationships:** unknown members (blank rows) carrying real values; many-to-many relationships dropping unmatched rows; Data Studio blends collapsing identical rows or using the wrong join type.
- **Ratios:** averages of averages; a summed unit price.
- **Dates:** time zone, order date versus payment date, refunds booked in a different month, a date table with gaps.
- **Refresh:** last refresh time; failed refreshes; a Power BI schedule paused after two months without visits; Data Studio freshness of 12 hours on a Google Analytics source.
- **Security and credentials:** row-level security hiding rows from a Viewer, or not applying to a Member; Data Studio viewer's credentials showing different data to different people.
- **Thresholds:** GA4 hiding small or demographic rows.
- **Source changes:** a renamed column, a new product category, a new till.

### 4. Check speed and use

For slow pages: count visuals per page, bi-directional relationships, many-to-many relationships and large text columns in the model. For use: check the tool's usage figures if available and ask readers which question they open it for.

### 5. Rank the findings

Score each finding by effect on decisions (wrong numbers first, then stale, then slow, then hard to read) and effort. Give each a fix, and for wrong measures, the corrected measure with a worked check on sample rows.

### 6. Fix (level 2 or 3)

At level 2, apply fixes in a copy or development workspace and rerun the tie-out. At level 3, publish only after the owner approves, then add a release note: what changed, which numbers moved and by how much. Any change to a definition people already use needs the owner's sign-off.

## Checks

- Every finding names its evidence (a tie-out row, a screenshot, a measure, a setting) or says "not verified".
- Each corrected measure is worked by hand on sample rows.
- Row counts reconcile after the fix.
- Numbers that were right are listed too, so nobody "fixes" them.
- No fix hides a real problem, such as filtering out unmatched rows instead of fixing the keys.
- Every action in the client's tools is logged.

## Output format

1. Summary: what is wrong, how much it matters, the top three fixes
2. Tie-out table, before and after
3. Findings table: ID, area, finding, evidence, effect, fix, effort
4. Corrected measures with worked checks
5. Settings to change (refresh, credentials, RLS)
6. What was not checked and why
7. Release note draft and approvals needed

## Example of good output

*Illustrative structure, not a real business: a hardware retailer with two shops and a web store. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Top finding (wrong number).** October revenue shows £48,210; the accounts show £51,060. The source has 6,402 order rows, the model 6,371. The 31 missing rows are orders with status "Part refunded", which a report-level filter drops; their net value is £2,850, the whole gap. The accounts count them net of the refund. Fix: remove the filter and subtract refund lines in the revenue measure. Effort: 30 minutes. Needs approval: yes, because every past month moves up.
>
> | ID | Area | Finding | Evidence | Effect | Fix |
> |---|---|---|---|---|---|
> | F2 | Ratios | Average basket is an average of daily averages | Measure AvgBasket uses AVERAGEX over dates | Shows £31.40; true value £29.85 | DIVIDE(SUM(Sales[Net]), DISTINCTCOUNT(Sales[OrderID])) |
> | F3 | Refresh | Schedule paused since 2 Sep | Service banner and owner email | Board saw September data in October | Re-enable; add a second failure-alert recipient |
