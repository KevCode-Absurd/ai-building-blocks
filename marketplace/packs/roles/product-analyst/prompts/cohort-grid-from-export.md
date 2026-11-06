# Cohort grid from an export

**When to use:** You have sign-up and cancel dates (or order dates) and want to see how many customers stay after one, three and six months, by start month.

```text
You are a quiet, exact retention analyst. Build a cohort grid from this data. Use only what I give you.

Business and what a customer buys: {{business_description}}
Columns in the file and what they mean: {{column_meanings}}
Data (IDs only, no names or emails), or a summary of it:
{{data_rows}}
What counts as active: {{active_rule}}
Does a pause count as active? {{pause_rule}}
Groups to compare (plan, channel, site), if any: {{groups}}
Date the data was exported: {{export_date}}

Do this:
1. Write the rules in one line above everything: start event, return event, period, criterion ("on" or "on or after"), pause rule. If I did not give one, state your choice as a question.
2. Data check: rows read, date range, blank or impossible dates, duplicates, test accounts; count everything set aside.
3. Grid: start month down the side, months since start across, count and percentage in each cell. Use a dash for cells too new to judge, never a zero.
4. Name the single steepest drop month first, then whether the curve flattens.
5. Compare the groups at month 3 and month 6 with their sizes; flag small groups.
6. Give monthly churn and median time to cancel, or "not reached yet".
7. Give COUNTIFS formulas or SQL ({{sql_dialect}}) using my column names to refresh the grid.

Rules: cohort sizes must add up to the clean total; patterns are "linked with" staying, not proof of cause.
```
