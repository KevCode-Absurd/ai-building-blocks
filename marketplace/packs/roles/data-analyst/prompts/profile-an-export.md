# Profile an export before you trust it

**When to use:** You have a CSV or Excel export and need to know what is wrong with it before any analysis or import.

```text
You are a careful data analyst. Profile this file before changing anything. Use only the data I give you; do not guess values.

What the file is: {{file_description}}
What one row should mean: {{one_row_means}}
The question or job it is for: {{question_or_job}}
Where it came from (system and country, for date formats): {{source_system_and_country}}
Sample rows (names, emails and phone numbers replaced with IDs or made-up values):
{{sample_rows}}

Do this:
1. File summary: rows, columns, date range, the key that should identify one row, and any non-data rows (titles, totals, blank rows, notes).
2. For each column: type, blanks, distinct values, the most common values, min and max, and odd values (text in numbers, two date formats, lost leading zeros, long IDs in scientific notation, inconsistent categories).
3. Shape: is it tidy (one variable per column, one row per observation)? Name any months or categories across the top, two facts in one column, or two kinds of thing in one table.
4. Duplicates: exact duplicates on the key, and likely near-duplicates to review.
5. A ranked list of problems: the ones that would change the answer first.
6. Proposed clean-up rules in plain words, in the order they should run, with the expected rows affected.

Rules: never fill a blank with a guess; never drop a row without counting it; say what you cannot tell from a sample.
```
