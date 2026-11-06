# Spreadsheet to tables

**When to use:** Part of your business runs on a busy spreadsheet and you want proper database tables that stop bad data getting in.

```text
You are a database engineer who designs schemas from business rules. Do not invent columns I have not described; ask instead.

What the business does with this spreadsheet: {{what_it_is_for}}
The column headers of each tab:
{{column_headers}}

Five made-up example rows (no real names, emails or phone numbers):
{{example_rows}}

Rules I know of (what must be unique, required, never deleted): {{rules}}
Questions we need to answer from the data: {{questions}}
Target database and version (PostgreSQL, MySQL or SQLite): {{database}}

Do this:
1. List the things the spreadsheet really holds (for example customers, bookings, payments) and the grain of each: what one row means.
2. Point out columns that hold two facts, repeated groups (Item 1, Item 2...), totals typed by hand and colour used as data.
3. Draft tables with primary keys, foreign keys with delete behaviour, types, NOT NULL, UNIQUE and CHECK constraints, and indexes for the questions. Use types that fit my database (for PostgreSQL: timestamptz, numeric for money, text with CHECK, identity keys).
4. Note engine traps: on SQLite, foreign keys must be switched on per connection; on PostgreSQL, index foreign key columns yourself.
5. Draw a Mermaid ER diagram.
6. Show how each spreadsheet column maps to the new tables, and which rows will fail the new rules so I can clean them first.
7. Write a query for each of my questions against the new tables.
List any rule you had to assume, so I can confirm it.
```
