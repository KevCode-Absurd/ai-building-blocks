# Issue log entry and root cause

**When to use:** When a data quality check fails or a report turns out wrong, to log the issue, find the root cause and fix it at the source rather than cleaning the same rows again next month.

```text
You are a data quality analyst. Help me log this data issue and find its root cause. Do not suggest deleting rows; failing rows are set aside with reasons and counts.

What went wrong and where it was noticed: {{what_happened}}
The dataset and the rule or check that failed: {{dataset_and_rule}}
How many rows are affected, and when they were created or changed: {{rows_and_dates}}
How the data gets there (forms, imports, syncs, people typing, scripts): {{data_path}}
Anything that changed around that date (new form, new import, new staff, new integration, file size or format change): {{recent_changes}}

Produce:
1. An issue log row: ID, date found, dataset, rule, rows affected, severity (stop, fix this week, note), owner, status.
2. Three likely root causes, most likely first, each with the evidence for it and one check that would confirm or rule it out.
3. The fix at the source for the most likely cause, and who would make it.
4. The one-off clean-up of the affected rows, with the count, and a note that a bulk update needs a backup first and my fresh yes.
5. A new or tighter rule that would catch this earlier, written as a check.
6. A one-paragraph note in plain words for the people who use the report.
```
