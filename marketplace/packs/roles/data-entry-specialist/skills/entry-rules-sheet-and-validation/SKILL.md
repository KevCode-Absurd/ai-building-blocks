---
name: entry-rules-sheet-and-validation
description: Writes a one-page data entry rules sheet for a team (dates, names, addresses, phone numbers, money, codes, duplicates, what to do when unsure, who to ask) from the client's own systems and past mistakes, then turns the most important rules into data validation in Excel or Google Sheets - dropdowns, date and number limits, text-length and custom rules, text-typed code columns, input messages and blocking alerts - and tests each rule with good and bad values. Drafts at access level 1; builds and tests validation in a copy at level 2; applies it to the live shared sheet at level 3 within agreed limits. Use when several people enter the same data, after an error batch, or when a new starter joins.
---

# Entry rules sheet and validation

## When to use

- Several people enter the same kind of record and each does it differently.
- A spot check or a failed import showed the same mistakes again and again.
- A new starter, temp or outsourced team is about to start entering data.
- A shared sheet is used as an input form and keeps collecting junk.

## What you need

1. The target system and its import template or field list.
2. A sample of real entries, including bad ones, and any error log from past checks.
3. The client's existing conventions, even unwritten ones ("we always put the site name first").
4. The tool used for entry: Excel (which version), Google Sheets, or a form.
5. Access: level 1 to draft the rules; level 2 to build validation in a copy and test it; level 3 to apply validation and protection to the live shared sheet within agreed limits. Changing who can edit a sheet, or protecting ranges others use, needs the client's yes first.

## Steps

### 1. Collect the real problems

Sort the sample and the error log by field and list the mistakes that actually happen: date order swaps, dropped leading zeros, codes turned into dates, two spellings of the same supplier, phone numbers in five layouts, blanks in required fields, extra spaces.

### 2. Write one rule per field, in plain words

Each rule says what the value is, the layout, an example, and what to do when the source is unclear. Keep the whole sheet to one page.

| Field | Rule | Example | If unsure |
|---|---|---|---|
| Invoice date | The date printed as Invoice date, as DD/MM/YYYY | 03/11/2026 | Leave blank, add an exception |
| Supplier | Exactly as on the approved supplier list | Supplier A Ltd | Do not create a new supplier; ask |
| Amount | As printed, two decimals, no currency sign | 1240.50 | Copy as written; flag a mismatch |
| Phone | +country code, no spaces | +441632960123 | Copy what is there; flag if short |

### 3. Add the general rules

- Copy as written; never guess or "correct" a document.
- One record per row; never merge two documents into one row.
- Never type card numbers, bank details or ID numbers unless the field is approved for them.
- Unsure? Leave blank, add an exception with the source text, carry on.
- Duplicates: check before adding a new supplier, contact or product.
- Who to ask, and by when.

### 4. Turn key rules into validation

In **Excel** (Data > Data Validation), the types are whole number, decimal, list, date, time, text length and custom formula, with an input message and an error alert. Only the **Stop** alert blocks a bad entry; **Warning** and the third style (labelled "Important" on Microsoft's page) let people carry on. Validation settings cannot be changed while a workbook is shared or the sheet is protected.

In **Google Sheets** (Data > Data validation, or Insert > Dropdown), dropdowns reject values not on the list by default unless set to "Show a warning".

Rules of thumb:
- **Blocking (Stop or reject)** for fields that must never be wrong: dates, amounts, supplier from a list, status codes.
- **Warning** only for soft checks, such as an unusually large amount.
- **Text type first** for code, phone, postcode and ID columns, set before any data goes in, so leading zeros and long numbers survive.
- **Lists from a range** (a supplier tab) rather than typed options, so one update fixes every dropdown; remove stray spaces from list items.
- **Input messages** that repeat the plain-words rule from the sheet.

### 5. Test every rule

For each validated column, try at least one good value, one bad value and one edge case (a 29 February, a value with a leading zero, a name with an accent). Record what happened. Validation is a check at the point of entry, not a clean-up, so run a separate check on the data already in the sheet.

### 6. Hand over

Put the rules sheet on its own tab or page, link it from the entry sheet, and date it. At level 3, apply validation and protection to the live sheet within the agreed limits and log what changed. Review the sheet after each spot check.

## Checks

- Every rule comes from a real problem or a stated system requirement.
- The rules sheet fits on one page and uses the team's own words.
- Every rule has an example and an "if unsure" action.
- Fields that must never be wrong use blocking validation, not warnings.
- Code and ID columns are text-typed before data entry.
- Every validation rule was tested with good, bad and edge values.
- Existing data was checked separately.
- No one's edit rights changed without the client's yes.

## Output format

1. **Rules sheet:** a one-page table plus the general rules, dated.
2. **Validation plan:** column, tool setting, alert style, input message.
3. **Test log:** column, value tried, expected, result.
4. **Change log** (level 3): what was applied where and when.

## Example of good output (short)

*Illustrative structure, not a real business: a plumbing firm with three office staff entering job sheets into a shared Google Sheet. Copy the shape, never the content: every fact comes from the client's own context.*

> Problems found in 200 rows: 31 dates in MM/DD, 14 job codes turned into dates (e.g. "3-Jun" for JUN3), 22 customer names with trailing spaces, 5 rows with no job number.
>
> | Column | Setting | Alert | Input message |
> |---|---|---|---|
> | Job date | Valid date | Reject | "Date on the job sheet, DD/MM/YYYY" |
> | Job code | Plain text format, set before entry | (format) | "Copy the code exactly, e.g. JUN3" |
> | Engineer | Dropdown from Staff tab | Reject | "Pick from the list; ask Ali to add a name" |
>
> Test log: "31/02/2026" rejected; "JUN3" kept as text; "Sam " (trailing space) not on list, rejected.
