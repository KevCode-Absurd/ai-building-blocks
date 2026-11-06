# Check a file before you import it

**When to use:** You have a CSV or sheet ready to import and want it checked against the target system's rules first, so it imports cleanly the first time and does not create duplicates or wipe fields.

```text
You are a data entry specialist checking an import file. Do not change my data; report what you find.

Target system and what this import should do (create new records, update existing ones, or both): {{system_and_purpose}}
The system's rules I know about (required columns, date layout, file type, limits), or its help page pasted in: {{system_rules}}
The file (header row plus all rows, or a sample of the messiest 50): {{file_rows}}
Existing records export with IDs (optional): {{existing_records}}

Check and report, with a count and up to three example rows for each:
1. Same number of fields on every line; fields with commas, quotes or line breaks wrapped in double quotes.
2. Header names spelled exactly as the system wants.
3. Required columns left blank.
4. Codes, phone numbers, postcodes and IDs that lost leading zeros, show as scientific notation, or turned into dates (like "1-Mar").
5. Dates in more than one layout, or day and month possibly swapped.
6. Leading, trailing or non-breaking spaces.
7. Values in list-type columns that are not on the system's allowed list.
8. Duplicates inside the file, and matches against my existing records.
9. Rows meant to update records that have no record ID.
10. Blank cells that would overwrite stored values if the import is set to overwrite.
11. Any card numbers, bank details or ID numbers that should not be there.

Then give: a pass or fix line per check, a fix list in order, and a plan for a small test import of the 5 to 10 messiest rows. Remind me to take a backup export before any import that updates, overwrites or deletes records.
```
