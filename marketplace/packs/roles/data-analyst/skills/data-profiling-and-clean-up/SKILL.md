---
name: data-profiling-and-clean-up
description: Profiles a messy CSV or Excel export, then writes numbered clean-up rules (dates, names, phone numbers, categories, duplicates, totals rows), merges several files into one table, and turns the rules into Power Query M steps, Google Sheets formulas or a short script, with row counts before and after every step. Use it before any analysis, before importing a file into a new system, or when the same export is fixed by hand every month.
---

# Data profiling and clean-up

## When to use

- A file has to be analysed and you have not looked at its blanks, duplicates and odd values yet.
- Several exports (till, booking system, CRM, marketplace) must become one table.
- A file is about to be imported into a new system and you want to know which rows will fail.
- Someone fixes the same monthly export by hand and wants a recipe that repeats.

Skip it when the data is already a tidy, checked table from a system you trust and the question is simple.

## What you need

1. The question or the job the clean file is for (analysis, import, monthly report).
2. The file, or 50 to 200 sample rows that show every kind of problem. Replace names, emails and phone numbers with made-up values or IDs first.
3. A column list with what one row means ("one order line", "one visit").
4. The tool you will use: Excel with Power Query, Google Sheets, or a script.
5. For an import check: the target system's required fields and allowed values.
6. Access: level 1 (read) is enough for steps 1 to 6 and 8. Building the recipe inside your workbook needs level 2 (in a copy) or level 3 (in the live file, within your limits). Importing clean data into another system is a level 3 action I confirm with you first.

## Steps

### 1. Describe the file before changing it

For each file write: rows, columns, date range, what one row means and the key that should identify a row. Note header rows that are not row 1, totals or subtotal rows, merged cells and notes typed into data columns.

### 2. Profile every column

For each column record type, blanks, distinct values, the five most common values, minimum and maximum, and anything odd: text in number columns, dates in two formats, codes with lost leading zeros, IDs longer than 15 digits shown in scientific notation. In Power Query, turn on column quality, distribution and profile and switch profiling from the first 1,000 rows to the entire data set.

### 3. Check the shape

Is it tidy? Look for months or categories across the top (unpivot them), two facts in one column (split them), and more than one kind of thing in one table (split the table). Name the problem in plain words.

### 4. Write the rules in plain words, in order

One rule per line, in the order it must run. Typical order:
1. Remove non-data rows (titles, blank rows, totals), and count them.
2. Promote the real header row.
3. Set types, reading dates with the file's locale, and keep IDs and postcodes as text.
4. Trim spaces, fix case, standardise categories with a mapping table.
5. Standardise phone numbers and postcodes to one pattern.
6. Unpivot or split columns.
7. Flag, set aside or drop invalid rows, each with a reason.
8. Dedupe.

Never fill a blank with a guess. If a value is missing, it stays missing or the row is set aside with a reason.

### 5. Merge files (if more than one)

Build a column map: target column, source column in each file, any conversion. Choose the join key. Decide the join type and say why. Count rows before and after the join, and list keys that did not match on each side.

### 6. Dedupe in two passes

First exact matches on the key after trimming and fixing case. Then close matches (same email but different name spelling, same phone with different formats) into a review list for a person. Never merge close matches automatically.

### 7. Turn the rules into steps for the tool (level 2 or 3 if I build it in your file)

- **Power Query:** one applied step per rule with a clear step name; folder queries for monthly files; "Unpivot other columns" so new months are picked up.
- **Google Sheets:** a raw tab that is never edited, a clean tab built with formulas such as TRIM, PROPER, REGEXREPLACE, SPLIT and QUERY. Remember QUERY treats mixed-type columns as one type and blanks out the minority.
- **Script:** only if asked, with the raw file left unchanged and a log of changes.

### 8. Run it on the sample and reconcile

Show rows before and after each rule and the rows set aside. The numbers must add up: raw rows minus removed rows minus set-aside rows equals clean rows.

### 9. Plan for next month

Say what happens if a column is added, renamed or missing, or the file is empty, and how someone will notice.

## Checks

- Every column name used comes from the sample.
- No blank was filled with a guess.
- Every removed or set-aside row is counted, with a reason.
- Totals reconcile from raw to clean.
- Dates were read with the right locale; IDs kept as text.
- Close-match duplicates went to a review list, not merged.
- No real personal data appears in the output or the example.

## Output format

1. **File summary** table: file, rows, columns, date range, one row means, key.
2. **Profile** table: column, type, blanks, distinct, examples of problems.
3. **Clean-up rules**, numbered, in plain words.
4. **Clean-up log**: step, rows before, rows after, set aside, reason.
5. **Recipe** for the tool (M code, formulas or script) with where to paste it.
6. **Review list** of close-match duplicates.
7. **Next-month notes**: what breaks and how you will know.

## Example of good output (short)

*Illustrative structure, not a real business: a US garden shop with two tills exported monthly as CSV. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Profile highlights.** 4,212 rows. "Date" mixes 04/03/2026 and 2026-04-03. "ZIP" lost leading zeros on 37 rows. Three totals rows at the end. "Category" has 19 spellings for 7 categories.
>
> **Rules.**
> 1. Remove the 3 rows where Till ID is "TOTAL" (4,212 to 4,209).
> 2. Read Date with locale English (United States); split out month and check none is above 12 (0 errors).
> 3. Keep ZIP as text and pad it to 5 digits (37 rows fixed).
> 4. Map Category spellings to 7 names using the mapping table (19 values mapped, 0 unmapped).
> 5. Set aside rows with a blank Amount (12 rows, listed in the review tab).
> 6. Dedupe on Till ID + Receipt No. (8 exact duplicates removed, 4,197 to 4,189).
>
> **Reconcile.** 4,212 raw = 3 totals + 12 set aside + 8 duplicates + 4,189 clean.
>
> **Next month.** If a new column appears, the query keeps running and ignores it; if "Amount" is renamed, the Changed type step errors, which is what we want: it fails loudly.
