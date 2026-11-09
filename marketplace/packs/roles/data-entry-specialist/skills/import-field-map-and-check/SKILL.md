---
name: import-field-map-and-check
description: Maps a client's columns to a target system's import template (Xero, QuickBooks, HubSpot, Shopify, a booking system or a shared sheet), writes the format rule and blank rule for every field, then checks a finished file before import - field counts, quoting, encoding, date and number layouts, required fields, text-typed codes, record IDs for updates, overwrite risks and duplicates against existing records - and plans a small test import. Reads and maps at access level 1; runs a test import into a copy, sandbox or draft state at level 2; runs the live import at level 3 only within the agreed batch, with a backup, counts and a fresh yes for any update, overwrite or deletion. Use before any bulk import or when an import keeps failing.
---

# Import field map and pre-import check

## When to use

- A client is about to import a file into a CRM, accounting package, shop or booking system.
- An import failed, or worked but created duplicates or blanked out fields.
- Data is moving from one sheet layout to another and someone needs to know which column goes where.

For moving a whole system (every table, cut-over and rollback), use the data quality analyst kit's system move workflow instead.

## What you need

1. The target system's import template, downloaded fresh from the client's account, and its help page if they have it.
2. The source file or a sample of 20 to 50 rows, including the messiest ones.
3. An export of existing records if the import may touch them (to find duplicates and record IDs).
4. Whether the import should create new records, update existing ones, or both.
5. Access: level 1 to map and check; level 2 to test-import into a copy, sandbox or draft state; level 3 for the live import of the agreed batch. Updates to existing records, overwrites, merges and deletions need a backup, a count, a sample and a fresh yes every time.

## Steps

### 1. Read the target's rules

From the template and the vendor's help page, note: required columns, accepted file types, encoding, file size and row limits, date layouts accepted, number and phone formats, and how the system decides between creating and updating. Examples as of 6 November 2026, to re-check on the day:
- **HubSpot:** .csv, .xlsx or .xls, one sheet, header row; email required for contacts; name or domain for companies; phone as +country code; free tools 20 MB per file, paid 512 MB; a unique identifier such as record ID or email to update instead of create.
- **Shopify products:** Title required for new products; URL handle for variants and updates; UTF-8 with LF line endings; with "Overwrite products with matching handles" on, a blank in a non-required column wipes the stored value.
- **Xero and QuickBooks:** use the template from the client's own account; columns and rules change.

### 2. Build the field map

One row per target column:

| Target column | Source column or document field | Format rule | Required? | If blank | Notes |
|---|---|---|---|---|---|

Add a "no home" list: source columns the target cannot take, so the client decides whether to drop them or add a custom field. Mark any guess "to confirm".

### 3. Check the file

Run every check and count the failures:
- **Structure:** same number of fields on every line; fields with commas, quotes or line breaks in double quotes; header names exactly as the template spells them.
- **Encoding:** UTF-8 unless the system says otherwise; accented names display correctly after a test open.
- **Types:** codes, phones, postcodes and IDs stored as text with leading zeros intact; no values in scientific notation; no codes turned into dates (such as "1-Mar").
- **Dates:** one layout throughout; no day and month swaps (look for months with no days above 12).
- **Spaces:** no leading, trailing or non-breaking spaces.
- **Required fields:** none blank.
- **Allowed values:** dropdown-style fields (status, country, category) match the system's list exactly.
- **Duplicates:** within the file and against existing records, with the rule that found each.
- **Create or update:** rows meant to update carry the record ID; rows meant to create do not collide with existing records.
- **Overwrite risk:** blanks in columns that would erase stored values.

### 4. Test import (level 2)

Import the 5 to 10 messiest rows into a copy, sandbox, test account or draft state. Open each imported record and compare field by field against the source row. Fix the map, not just the rows.

### 5. Live import (level 3)

For each batch:
1. Take a backup export of the records the import can touch.
2. State the batch: file name, rows, creates vs updates, overwrite on or off.
3. New records within the agreed limit go ahead; updates, overwrites, merges and deletions wait for a fresh yes on this batch.
4. Import, then compare counts before and after, and open a sample of imported records.
5. Log what, where, when, rows and result. Stop and ask if rows are rejected or counts differ.

## Checks

- Every target column has a rule and a source, or is marked optional and empty.
- The "no home" list is shown.
- Every structural, type, date, space, required, allowed-value and duplicate check was run, with counts.
- Update rows carry record IDs.
- No blank will overwrite a stored value without the client knowing.
- A test import was compared field by field.
- At level 3: backup taken, batch stated, fresh yes recorded where needed, counts before and after logged.

## Output format

1. **Field map** table and "no home" list.
2. **Pre-import check:** one line per check, with pass or the number of failing rows and examples.
3. **Fix list:** what to change in the file or the map.
4. **Test import result:** rows tested, differences found.
5. **Import plan:** batches, creates vs updates, backup, what needs a fresh yes.
6. **Import log** (level 3): batch, rows, before and after counts, result.

## Example of good output (short)

*Illustrative structure, not a real business: a garden tools business with 312 trade-show contacts going into HubSpot. Copy the shape, never the content: every fact comes from the client's own context.*

> | Check | Result |
> |---|---|
> | Field count per line | Pass (11 fields on all 312 lines) |
> | Email present | 9 rows blank: cannot import as contacts; listed |
> | Phone format | 41 rows missing +44; fixed in the file, shown in the change list |
> | Duplicates vs HubSpot export | 27 emails already exist: split into an update file with record IDs |
> | Non-breaking spaces | 6 company names; cleaned |
>
> Plan: batch 1 creates 276 new contacts (within your level 3 limit). Batch 2 updates 27 existing contacts: backup export saved as `hubspot_contacts_before.csv`, waiting for your yes.
