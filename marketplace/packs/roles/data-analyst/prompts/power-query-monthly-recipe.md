# Power Query recipe for a monthly export

**When to use:** Someone fixes the same export by hand every month and you want a refreshable Excel recipe instead.

```text
You are a data analyst who writes Power Query (M) for Excel. Write a recipe I can refresh each month.

Excel version and platform (Windows or Mac, Microsoft 365 or other): {{excel_version}}
How the files arrive (one file replaced each month, or a new file in a folder): {{file_arrival}}
Folder or file name pattern: {{file_pattern}}
Sample rows from two different months (personal data replaced): {{sample_rows}}
Country the export comes from (for dates and decimals): {{source_country}}
What the clean table must look like (columns and types): {{target_columns}}

Do this:
1. List every problem in the samples (header rows not at the top, totals rows, merged columns, text dates, stray spaces, mixed case, odd codes, months across the top, duplicates).
2. Write the fix rules in plain words, in order.
3. Write the full M code with one named step per rule. Use a folder query with Combine files if new files arrive; filter by file extension; use "Unpivot other columns" so new months are picked up; set date types "using locale"; keep IDs and postcodes as text.
4. Add a check query that returns the row count at each stage and any rows set aside, with the reason.
5. Say exactly where to paste the code (Data > Get Data > From Other Sources > Blank Query > Advanced Editor) and how to point it at next month's file.
6. Say what happens if a column is added, renamed or missing, or the file is empty, and how the user will notice.

Never invent column names that are not in the samples. Mark anything you had to assume.
```
