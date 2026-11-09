---
name: sql-for-a-business-question
description: Writes, explains and checks the SQL that answers one business question (sales by month, cohorts, funnels, members with credits left, stock to reorder) for PostgreSQL, MySQL, SQLite or SQL Server - restating the question as a result table, planning joins at the right grain so one-to-many links do not double count, using CTEs and window functions where they help, handling NULLs, time zones, refunds, duplicates and deleted or test rows, and tying the result to a total the business trusts. Read-only queries at access level 1, ideally on a replica or copy; saved views or report queries at level 2; any query that changes data only at level 3 with a tested backup and a fresh yes. Use it for reports, one-off questions and reviews of existing queries.
---

# SQL for a business question

## When to use

- "How many members have classes left this month?"
- A weekly or monthly report needs a set of queries.
- A report's totals do not match the accounts and someone wants to know why.
- An existing query is hard to read, slow or suspected of double counting.

## What you need

1. The question in plain words, and what decision it feeds.
2. Database type and version.
3. The schema for the tables involved (DDL or a column list) and a few made-up sample rows.
4. Business definitions: what counts as a sale, a customer, an active member; which time zone; how refunds, cancellations and test accounts are marked.
5. A total someone trusts (from the till, accounts or a dashboard) to tie out against.
6. Access: level 1 to run read-only queries, ideally on a replica or copy. Level 2 to save views or report queries in a sandbox schema or BI tool draft. Any query that inserts, updates or deletes is level 3, with a tested backup and a fresh yes, and runs first on a copy.

## Steps

### 1. Restate the question as a result table

Write the columns, one example row and the grain: "one row per month, columns month, new_members, active_members, revenue_gbp". Agree the period, the time zone and the filters. Most wrong answers start with a vague question.

### 2. Map the tables to the grain

For each table, write what one row is (one order, one order line, one payment, one booking). Mark every one-to-many link between them. Joining orders to order lines to payments in one step multiplies rows; sum each at its own grain first, then join the totals.

### 3. Write it in readable steps

Use common table expressions, one per step: filter the base rows, aggregate at the right grain, join the aggregates, compute ratios last. Comment each step with what it does and why. Name columns for people, not machines.

### 4. Handle the edge cases on purpose

- **NULLs:** `COUNT(column)` skips NULLs, `COUNT(*)` does not; `NOT IN` with a NULL in the subquery returns nothing, so use `NOT EXISTS`.
- **Time zones:** convert to the business's zone before grouping by day or month; a late-evening order can land on the wrong day otherwise.
- **Date ranges:** half-open (`>= '2026-10-01' AND < '2026-11-01'`), never `BETWEEN` on timestamps.
- **Refunds and cancellations:** subtract or exclude as the business defines; say which.
- **Duplicates:** check the key is unique before trusting a count.
- **Deleted, archived and test rows:** exclude them and say how many there were.
- **Ratios:** divide sums, never average row-level ratios.

### 5. Use window functions where they fit

Running totals, rankings, "previous month" comparisons and first-purchase dates (`ROW_NUMBER()`, `LAG()`, `SUM() OVER (PARTITION BY ... ORDER BY ...)`) avoid self-joins. Check the frame and the partition; a missing `PARTITION BY` silently ranks across everyone.

### 6. Fit the dialect

Date functions, string functions, `LIMIT` versus `TOP`, boolean handling and casting differ between PostgreSQL, MySQL, SQLite and SQL Server. Write for the named database and version, and note any line that would change on another.

### 7. Check the answer

- Tie at least one total to the trusted figure, and explain any gap.
- Count rows at each step; a jump after a join means fan-out.
- Spot-check three rows by hand against the source tables.
- Run the query on an empty period and a period with known values.

### 8. Explain it

A plain-English walk-through, step by step, for someone who will maintain it. Then a list of assumptions and edge cases the reader should know.

### 9. If the query changes data

Write it first as a `SELECT` that shows exactly the rows it would touch and a count. Then the change inside a transaction, with the expected count checked before commit. Run it on a copy first. On production it is level 3, with a backup restored in a test and a fresh yes for that run, every time.

## Checks

- The result table, grain, period, time zone and filters are written down and agreed.
- Each table's grain is known, and no join multiplies rows unintentionally.
- NULLs, time zones, refunds, duplicates and test or deleted rows are handled and stated.
- At least one total ties to a trusted figure.
- Syntax fits the named database and version.
- No real personal data appears in examples.
- Any data-changing query ran on a copy first and only reached production with a tested backup and a fresh yes.

## Output format

1. The question as a result table, with grain and definitions.
2. The SQL with comments, in steps.
3. Plain-English walk-through.
4. Edge cases and assumptions.
5. Tie-out: our total, trusted total, difference, reason.
6. Refresh notes for a recurring report.

## Example of good output (short)

*Illustrative structure, not a real business: a yoga studio counting class credits left per member on PostgreSQL 17. Copy the shape, never the content: every fact comes from the client's own context.*

> **Result table:** one row per member with a valid pack: member_id, credits_bought, credits_used, credits_left, as of today in Europe/London.
>
> ```sql
> WITH used AS (             -- one row per pack: credits used by bookings not cancelled
>   SELECT pack_purchase_id, COUNT(*) AS credits_used
>   FROM booking
>   WHERE cancelled_at IS NULL
>   GROUP BY pack_purchase_id
> ), live_packs AS (         -- one row per pack still valid today, London time
>   SELECT p.member_id, p.credits, COALESCE(u.credits_used, 0) AS credits_used
>   FROM pack_purchase p
>   LEFT JOIN used u ON u.pack_purchase_id = p.id
>   WHERE p.refunded_at IS NULL
>     AND p.expires_on >= (now() AT TIME ZONE 'Europe/London')::date
> )
> SELECT member_id,
>        SUM(credits) AS credits_bought,
>        SUM(credits_used) AS credits_used,
>        SUM(credits - credits_used) AS credits_left
> FROM live_packs
> GROUP BY member_id
> ORDER BY credits_left DESC;
> ```
>
> **Why count bookings per pack first:** joining packs straight to bookings repeats each pack once per booking, so `SUM(credits)` would be inflated.
> **Assumption to confirm:** each booking records the pack that paid for it (`booking.pack_purchase_id`); if not, that link is needed before credits can be counted per pack.
