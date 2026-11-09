---
name: made-up-test-data
description: Builds made-up datasets (CSV, JSON or SQL INSERT with CREATE TABLE) to the client's columns, types and rules, for testing imports, forms, data quality checks, demos, dashboards and training. Writes a spec table first, plans patterns (seasons, dips, repeat rates) and labelled edge cases (blanks, duplicates, bad formats, long text, odd characters, boundary values) by row ID, uses reserved example.com emails, Ofcom drama phone ranges and published payment test cards only, keeps keys linked across tables, and adds check totals so the client can prove the file loaded in full. Never copies or disguises real customer rows. Builds files at any access level; loading into a sandbox needs level 2 and into a live system level 3. Use when testing an import, proving data quality checks work, seeding a database or teaching a class.
---

# Made-up test data

## When to use

- Testing an import or a form before real data goes through it.
- Proving that data quality checks catch what they should: one bad row per rule.
- Seeding a development or staging database.
- Building a demo or dashboard mock-up that shows a pattern (a busy December, a dip in week 5).
- Making a practice dataset for a class, with an answer key.

## What you need

1. Purpose: import test, check test, seed data, demo or class.
2. Columns with types and rules, or the import template, schema or form.
3. Row count per table and how tables link.
4. Patterns to show and edge cases to include.
5. Output format: CSV, JSON, or SQL for a named database and version.
6. Region, for names, addresses, phone formats and date formats.

If a rule is missing, I choose a sensible one and list it in the spec for the client to change. Real customer rows are not needed and not wanted.

## Steps

### 1. Write the spec table first

Column, type, rule or range, how values are made, and which table and column it links to. The client checks the spec before any rows are made.

### 2. Plan patterns and edge cases

Decide which row IDs carry which pattern and which edge case, so every special row is deliberate. For tests, make at least the edge cases the client listed, and one row per data quality rule to be tested. Typical edge cases:
- Blank required field; blank optional field.
- Wrong format (date as text, email without @, phone with letters).
- Duplicate on the key; near duplicate (same person, different case or spacing).
- Boundary values (zero, the maximum, the first and last day of a month, 29 February).
- Very long text, apostrophes in names, accented letters, emoji, commas and quotes inside fields.
- References to a parent row that does not exist.

### 3. Make every value safe

- **Names:** plainly made up.
- **Emails:** the reserved `example.com`, `example.net` or `example.org` domains (RFC 2606).
- **Phones:** UK numbers from Ofcom's drama ranges (for example 07700 900000 to 900999 for mobiles, 020 7946 0000 to 0999 for London); elsewhere, numbers marked fake. With web search connected, check the regulator's current fictional ranges for other countries; without it, label numbers "fake".
- **Cards:** only a payment provider's published test cards, such as Stripe's 4242 4242 4242 4242, used in test mode. Never real card or ID numbers.
- **Addresses:** made-up street names; real town names are fine.

Faker can generate names and addresses by locale. Seed it for a repeatable file and pin its version, because output can change between versions.

### 4. Build the rows

All rows in one block, no "more rows here" gaps. CSV with one header row and the same field count on every row, quoted where fields hold commas. JSON that parses. SQL with `CREATE TABLE` first, then `INSERT` statements with keys that link across tables, for the named database.

### 5. Add check totals

Rows per table, rows per status or category, sums of amounts, counts of edge cases. The client compares these after loading to prove nothing went missing.

### 6. Write load steps

Numbered steps to load the file into the named tool. Loading into a sandbox is level 2; into a live system, level 3 with the client's yes, and test rows clearly tagged so they can be found and removed later with a fresh yes.

## Checks

- Row count matches the brief.
- Every foreign key points to a row that exists, except rows labelled as broken-link edge cases.
- A "sample data" label sits at the top of the file or table.
- Every edge case is listed by row ID with what should happen.
- No real person, real card number or real ID number appears.
- CSV field counts are equal on every row; JSON parses; SQL runs on the named version or is marked to check.
- Check totals add up.

## Output format

1. "Sample data: made up, no real people" label.
2. Spec table.
3. The data in one code block per table.
4. Edge-case table: row ID, problem, expected result.
5. Check totals.
6. Load steps.

## Example of good output (short)

*Illustrative structure, not a real business: a pottery studio running a HubSpot contact import test. Copy the shape, never the content: every fact comes from the client's own context.*

> **Sample data: made up, no real people.**
>
> | Row | Problem | Expected result |
> |---|---|---|
> | 7 | Email `amira.okafor@example` has no top-level domain | Rejected by the email check |
> | 12 | Duplicate of row 3 email in upper case | Flagged as duplicate after lower-casing |
> | 19 | Surname `O'Brien-Ndlovu` | Imports intact |
> | 23 | Phone `07700 900 12A` | Rejected by the phone check |
> | 30 | Created date `2026-02-29` (not a real date) | Rejected by the date check |
>
> Check totals: 60 rows; 8 edge-case rows (5 shown above); 54 should import; 6 should be rejected or flagged; lifecycle stage counts: lead 31, customer 22, other 7.
