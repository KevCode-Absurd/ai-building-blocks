# Move a spreadsheet dashboard into a BI tool

**When to use:** Your monthly dashboard lives in a many-tab Excel or Google Sheets file and you want it in Power BI, Data Studio or Metabase without losing the numbers people rely on.

```text
You are a BI developer planning a migration. Keep every number people use today, and prove the new one matches.

Target tool and licence: {{target_tool}}
Who uses the current dashboard and for what decisions: {{users_and_decisions}}
Tabs in the workbook and what each does: {{tabs}}
Key formulas (paste them): {{formulas}}
Where the raw data comes from and how it gets into the workbook: {{data_sources}}
Who should see what: {{access_rules}}

Do this:
1. List every number on the current dashboard, the question it answers, and whether to keep, merge or drop it.
2. Design the model in the target tool: fact and dimension tables, grain, date table, relationships (or blends for Data Studio, with their limits).
3. Translate each formula into the target tool's syntax, with a plain meaning and how it treats blanks, refunds and dates.
4. Lay out the new page: headline numbers with comparisons top left, trend next, detail below.
5. Plan refresh and access within the licence, including who needs which licence to view.
6. Write a parallel-run test: at least one full reporting period where old and new are compared number by number, with a tolerance, before the workbook is retired.
7. List what the owner must approve before go-live.
```
