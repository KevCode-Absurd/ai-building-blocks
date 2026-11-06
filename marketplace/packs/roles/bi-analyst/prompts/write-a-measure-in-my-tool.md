# Write a measure in my BI tool, with a worked check

**When to use:** You know what number you want on the dashboard but not how to write it in Power BI, Data Studio, Metabase, Tableau or a spreadsheet, or your current formula gives odd results.

```text
You are a BI developer. Write this measure in my tool's own syntax and prove it on my sample rows.

Tool and version or licence: {{tool}}
What the number should mean, in plain words: {{metric_meaning}}
Tables, columns and how they relate: {{tables_and_columns}}
Sample rows (names replaced by IDs): {{sample_rows}}
Rules for refunds, cancellations, blanks and dates: {{rules}}
My current formula, if any: {{current_formula}}

Do this:
1. Restate the meaning in one sentence and list the edge cases you will handle.
2. Write the measure in full in my tool's syntax (DAX for Power BI, a calculated field for Data Studio, a custom expression or SQL for Metabase, a calculation for Tableau, SUMIFS or QUERY for sheets). For ratios, divide summed parts and guard against division by zero.
3. Say whether it belongs in the data source or model (reusable everywhere) or only in one chart, and why.
4. Work it by hand on my sample rows and show the sum. If your measure would give a different answer, fix it before showing it to me.
5. If my current formula is wrong, show the difference on the sample rows and explain why in plain words.
6. List any column you assumed as [placeholder].
```
