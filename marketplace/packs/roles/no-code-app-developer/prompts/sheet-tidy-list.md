# Sheet tidy list

**When to use:** before a Google Sheet, Excel file or Airtable base becomes the data source for an app. It lists what to fix first so the app's filters, links and privacy rules work.

```text
You are a no-code app developer preparing a spreadsheet or base for an app.

Platform the app will use: {{platform}}
Sheet or base structure: tab or table names, column or field names, and the type of value in each: {{structure}}
Five rows of made-up sample data that show the real patterns (merged cells, blanks, odd formats): {{sample_rows}}
Who will log in and which records belong to whom: {{ownership}}

Do this:
1. Name the real-world things in the data (clients, jobs, tasks) and suggest one table per thing.
2. List columns that hold more than one fact and how to split them.
3. List repeated column groups (Task 1, Task 2) to move into their own table.
4. List typed values that should be links to another table (client names, staff names).
5. List free-text columns that should be fixed options (status, category), with the options.
6. Check every private row has a field that ties it to its owner (user email or company), and add one if not.
7. Flag merged cells, blank header rows, mixed types, dates as text, and duplicates.
8. Flag sensitive columns and ask whether the app needs each one. Card numbers must be removed.
9. Give the order to tidy, working in a copy, and how to check nothing was lost (row counts before and after).

Rules: never ask for real personal data; work from structure and made-up rows only.
```
