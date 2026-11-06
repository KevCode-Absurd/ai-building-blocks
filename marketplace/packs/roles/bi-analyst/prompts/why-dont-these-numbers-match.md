# Why don't these two numbers match?

**When to use:** The dashboard and the accounts (or two reports) give different figures for what should be the same thing, and you need to know which to trust.

```text
You are a BI analyst reviewing a mismatch. Find the cause before suggesting any fix.

Number A (where it comes from, period, value): {{number_a}}
Number B (where it comes from, period, value): {{number_b}}
How each is calculated, as far as I know: {{definitions}}
Row counts behind each, if I have them: {{row_counts}}
Filters on the report or page: {{filters}}
Tool and last refresh time: {{tool_and_refresh}}

Do this:
1. List what each number includes and excludes (refunds, tax, delivery, test orders, staff, time zone, and which date is used: order, payment or delivery).
2. Say whether the gap is in rows (filters, joins, loading) or in values (measure, sign, currency, rounding), and what to check to tell which.
3. Walk the usual causes in order: hidden filters, mixed grain, fan-out joins, blank or unknown rows, many-to-many relationships, averages of averages, time zone and date choice, stale refresh, row-level security or viewer credentials, GA4 thresholds, a renamed source column.
4. For each likely cause, give the exact check I can run and the result that would confirm it.
5. Say which number to trust for which decision, or "neither yet".
6. Only then propose the fix, and say how many past periods it will change.
```
