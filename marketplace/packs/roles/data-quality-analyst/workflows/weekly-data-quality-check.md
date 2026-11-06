# Weekly data quality check

**Cadence:** Weekly (Monday works for most teams, before the week's reports), plus straight away after a new import, a new form or integration, or a report that turned out wrong. About an hour once the rules are set up; the dictionary and rules get a fuller review each quarter.

## Steps

1. **Confirm access (level 1).** Re-read "Access I have". Use read-only connections or exports.
2. **Freshness first (level 1).** Check each source loaded on time: dbt `dbt source freshness`, the last import date in the CRM, or the newest row's timestamp. Stale data stops the run until explained.
3. **Run the stop rules (level 1).** The rules marked "stop" in the rules table from the `data-quality-rules-and-checks` skill: sheet formulas, SQL queries, dbt tests, Great Expectations or Soda checks. Record failing counts.
4. **Run the rest (level 1).** "Fix this week" and "note" rules. Compare counts with last week; a jump matters more than a steady number.
5. **Check row counts in and out (level 1).** For each load or sync: rows in the source, rows arrived, rows rejected. Any difference without a reason becomes an issue.
6. **Duplicates (level 1).** New pairs since last week on the agreed match rules. Large numbers go to the `duplicate-review-and-merge-plan` skill.
7. **Log issues (level 1).** Each new failure gets an issue log row using the `issue-log-and-root-cause` prompt, with an owner and a root cause to investigate.
8. **Fix single records (level 3, within limits).** Where agreed, correct individual records and log each change. *Approval: within the limits the client set.*
9. **Bulk fixes, merges and deletions (level 3 gate).** Prepare the change list with counts and a sample (level 2). *Approval: a backup export taken first and a fresh yes for each batch, every time.*
10. **Source fixes (level 2).** Write the change that stops the error at its source: a validation list, a required field, a form change, an import template fix, a dbt test or constraint. Open a pull request or draft the change. *Approval: the owner of that system.*
11. **Report.** One page: freshness, stop rules passed or failed, counts against last week, new issues with owners, issues closed, actions taken from the log.
12. **Quarterly.** Review the rules table (retire rules that never fail, add rules for new failure types) and the data dictionary's "to confirm" list.

## Outputs

- Freshness and rule results with counts against last week
- Updated issue log with owners and root causes
- Change lists for any bulk fix, merge or deletion, waiting for approval
- Pull requests or drafts for fixes at the source
- One-page weekly report with the action log

## Needs the client's approval

The access level and limits for each tool; every bulk update, merge or deletion (a backup export first and a fresh yes for each batch, every time); changes to forms, validation, fields or permissions in live systems; any new data source or recipient of the report. The client can lower the access level at any time.
