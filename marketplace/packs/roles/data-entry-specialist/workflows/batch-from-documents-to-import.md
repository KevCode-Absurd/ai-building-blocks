# One batch: from documents to a checked import

**Trigger:** A new batch of documents arrives: supplier invoices at month end, cards after an event, forms after a sign-up day, an export from another system.

**Cadence:** Once per batch. For regular batches (weekly invoices), run it the same way each time and keep the rules sheet and field map from the last run.

**Access:** Level 1 (read) is enough to produce the file, exceptions and checks for the client to import. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "create up to 60 draft bills in Xero from this batch; add new supplier contacts that are not on the list; no approvals, payments, bank details or changes to existing contacts").

## Steps

1. **Intake.** Ask for the target system, a fresh import template, the date layout, the document count and an export of existing records for duplicate checks. Write the access level for each tool under "Access I have". Questions from `access.md`.
2. **Field map.** Build or reuse the map with the `import-field-map-and-check` skill, step 2. Confirm any "to confirm" fields with the client before reading documents.
3. **OCR (scans only).** Convert scans to text (Google Drive, the client's scanner app, or a cloud OCR service in the client's own account). Check the text with the `ocr-text-against-the-original` prompt. Ask for better scans if many values need checking.
4. **Enter.** Run the `documents-to-import-file` skill (or the `invoices-to-bills-import` or `business-cards-to-crm-contacts` prompt for those jobs). Output: batch summary, file, exceptions table.
5. **Check.** Run the `entry-checks-and-spot-sampling` skill: count check, control totals, double entry on payment-triggering fields, a random spot check. Make the accept, recheck or stop call.
6. **Pre-import check.** Run the `check-a-file-before-import` prompt or the `import-field-map-and-check` skill, step 3.
7. **Exceptions back to the client.** Send the exceptions table with one clear question per row. *Approval: the client answers every exception; no gap is filled without their answer.*
8. **Test import [L2].** Import the 5 to 10 messiest rows into a copy, sandbox or draft state and compare field by field.
9. **Import [L3].** *Approval: the client confirms the batch and limits once at the start.* Take a backup export, import new records within the limit, compare counts before and after, log the result. Any update to existing records, overwrite, merge or deletion needs a fresh yes on that batch.
10. **Close.** Report counts, exceptions cleared and outstanding, anything left out (card or bank numbers), and add new rules to the rules sheet with the `entry-rules-sheet-and-validation` skill.

## Outputs

- Field map and "no home" list
- Import-ready file with a format line and batch summary
- Exceptions table with source text
- Batch check: counts, control totals, sample result and call
- Pre-import check and fix list
- Import log with before and after counts (level 3)
- Updated rules sheet

## Needs the client's approval

Every exception answer; the batch limits before the first live action; every bulk update, overwrite, merge or deletion (with a backup first); and anything involving payments, bank or payout details or a new payee, which stays with the client. Account and tax codes are chosen by the client's bookkeeper or accountant.
