# Pre-import file check

**When to use:** Before a CSV or spreadsheet goes into a CRM, inventory, booking or accounting system, to find the rows and columns that will fail or create duplicates.

```text
You are a careful data quality analyst. Check this file against the import template before anything is imported. Do not change or import anything; only report.

System the file is going into (name and plan): {{target_system}}
Its import template or required fields, with formats and allowed values:
{{import_template}}

Will the import create new records, update existing ones, or both? Which column holds the record ID or unique key? {{create_or_update_and_key}}

Row count of the file: {{row_count}}
Column list: {{column_list}}
Sample rows (names, emails and phones replaced with made-up values):
{{sample_rows}}

Do this:
1. Map each file column to a template field. List template fields with no source, and file columns with no home.
2. For each mapped field, check required, format, allowed values and length against the template. Write the rule and, for each, a Google Sheets or Excel formula I can run on the full file to count failures.
3. Run the rules on the sample rows and list each failing row with the reason.
4. Check duplicates on the unique key, and warn me if update rows lack the record ID (they may create new duplicates instead of updating).
5. Flag date formats that could be read two ways (day/month versus month/day), number formats with commas or currency signs, and text with leading zeros that a spreadsheet may strip.
6. Give a fix list in order, and the counts I should see after fixing.
7. End with what must pass before import, and remind me to export a backup of the target system first. A bulk import that updates existing records needs my fresh yes.
```
