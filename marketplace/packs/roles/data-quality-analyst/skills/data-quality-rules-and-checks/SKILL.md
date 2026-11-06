---
name: data-quality-rules-and-checks
description: Profiles a dataset (spreadsheet, CRM export, database table or dbt model), writes data quality rules in five groups (complete, valid, unique, consistent, linked) plus freshness, turns each rule into an exact check (Google Sheets or Excel formula, SQL query returning failing rows, dbt test, Great Expectations Expectation or Soda check), gives each a pass condition, severity, owner and fix step, runs the rules on the sample and reports what fails today. Reads at access level 1; builds checks in a copy, branch or pull request at level 2; schedules checks and fixes single records at level 3 within limits. Never deletes failing rows; bulk fixes need a backup and a fresh yes. Use when reports keep needing manual fixes, before a monthly report, or when setting up checks for a new data source.
---

# Data quality rules and checks

## When to use

- A report keeps going wrong and nobody knows where the bad data comes from.
- A CRM or order system is fed by many people and fields are filled inconsistently.
- A new data source, import or dbt model needs checks before anyone relies on it.
- A team wants a Monday routine that catches problems before the board pack.

## What you need

1. What the data feeds (reports, invoices, emails) and what has gone wrong before.
2. The column list and row count for each file or table, and what one row means.
3. 20 or more sample rows per file, with names, emails and phone numbers replaced. Include messy rows, not only tidy ones.
4. Where the checks will run: Google Sheets, Excel, SQL (which database and version), dbt (which version), Great Expectations or Soda.
5. Who owns each dataset and who can fix failures.
6. Access: level 1 to read and profile. Level 2 to build checks in a copy, branch or pull request. Level 3 to schedule checks and fix single records within limits. Bulk fixes and deletions need a backup and a fresh yes every time.

## Steps

### 1. Profile

For each table: row count, what one row means, whether the key is unique. For each column: type, share blank, distinct values, minimum and maximum, formats seen, the commonest values and the odd ones. Across tables: references that point to nothing. In Power Query, switch profiling from the first 1,000 rows to the entire data set before trusting the numbers. With web search connected, check the tool's current docs for syntax; without it, use the version the client names and mark syntax "check against your version".

### 2. Write the rules in plain words

Sort every rule into one group:
- **Complete:** required fields are filled ("every won deal has a close date").
- **Valid:** formats, ranges and allowed values ("stage is one of the eight pipeline stages"; "price is above zero").
- **Unique:** no duplicates on the key ("one contact per email").
- **Consistent:** values agree ("close date is on or after create date"; "order total equals the sum of its lines"; "the same customer has the same VAT number in CRM and accounts").
- **Linked:** every reference has a match ("every order has a customer that exists").
- **Fresh:** data arrived on time ("orders table loaded within the last 24 hours").

Mark which rules test validity and which test accuracy. Accuracy needs a reference: a source system, a document or a person's confirmation.

### 3. Turn each rule into an exact check

Write the check so it returns the failing rows, using the client's column names:
- **Google Sheets:** `=FILTER(A2:H, (F2:F="Won")*(G2:G=""))` for won deals with no close date; `=COUNTIF(C:C, C2)>1` in a helper column for duplicate emails.
- **Excel:** `=FILTER(Deals, (Deals[Stage]="Won")*(Deals[CloseDate]=""), "none")`; conditional formatting with a COUNTIF rule to highlight duplicates.
- **SQL:** `SELECT id, stage, close_date FROM deals WHERE stage = 'won' AND close_date IS NULL;`
- **dbt:** `not_null`, `unique`, `accepted_values` and `relationships` under `data_tests:`; a singular test SQL file for rules across columns; `severity` and `warn_if` or `error_if` for thresholds; `dbt source freshness` for freshness; unit tests for tricky transformation logic.
- **Great Expectations or Soda:** the matching built-in check, named in the rules table.

### 4. Give each rule its working parts

- **Pass condition:** zero failing rows, or a threshold the client agrees ("fewer than 5 failing rows" is the client's number, not mine).
- **Severity:** stop (the report waits), fix this week, or note only.
- **Owner:** a named role who fixes failures.
- **Fix step:** what the owner does, at the source where possible.

### 5. Run on the samples

Run every rule on the sample rows and report what fails today, with counts. Set failing rows aside with reasons; never delete them.

### 6. Put the rules in order

A run order for the routine: freshness first, then stop rules, then the rest. At level 2, deliver the checks as a check tab in a copy, a SQL file or a dbt pull request. At level 3, schedule them within limits and fix single records; bulk fixes go through a backup and a fresh yes.

## Checks

- Every column named in a rule exists in the brief or samples.
- Every rule has group, check, pass condition, severity, owner and fix step.
- Every check was run on the samples and the failing counts are stated.
- No row was dropped or changed without a reason and a count.
- Checks only read data unless a fix step was agreed.
- No real personal data appears in the output.
- Syntax matches the named tool and version, or is marked to check.

## Output format

1. Profile summary per table (rows, key, notable columns).
2. Rules table: group, rule, check, pass condition, severity, owner, fix step, fails today.
3. "What fails today" with counts and example row IDs.
4. Run order for the weekly routine.
5. Files: check tab, SQL file or dbt YAML, as asked.
6. Questions to confirm.

## Example of good output (short)

*Made-up business for illustration: "Harbour Lane Tutors", bookings in PostgreSQL 17.*

> | Group | Rule | Check | Severity | Owner | Fails today |
> |---|---|---|---|---|---|
> | Linked | Every booking has a student | `SELECT b.id FROM bookings b LEFT JOIN students s ON s.id = b.student_id WHERE s.id IS NULL;` | Stop | Office manager | 7 |
> | Valid | Price is zero or more | `SELECT id, price FROM bookings WHERE price < 0;` | Fix this week | Bookkeeper | 2 |
> | Consistent | Session is 4 hours or less | `SELECT id FROM bookings WHERE ends_at - starts_at > interval '4 hours';` | Note | Office manager | 11 |
>
> The 7 orphaned bookings were all created on 2 October, the day the student import ran. Fix at the source: re-run the import with student IDs, then re-check. Nothing was deleted.
