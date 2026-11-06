# Clearing a backlog of paper or PDF records

**Trigger:** A backlog has built up (months of unentered invoices, a box of paper forms, an old system's PDFs) and the client wants it entered by a date.

**Cadence:** A short project in rounds: a pilot round, then fixed-size batches, with a check after each one.

**Access:** Level 1 is enough to plan, enter and check every batch for the client to import. [L2] marks draft or test work inside the client's tools; [L3] marks live entry within the client's limits (for example: "add new records only, up to 200 per batch, to the shared sheet and HubSpot; no updates to existing records; no deletions").

## Steps

1. **Size the backlog.** Count documents by type, source and year. Note what is scanned, what is paper, and what is handwritten. Ask which records are needed first and which may not need entering at all. *Approval: the client agrees the scope and the order.*
2. **Retention check.** Ask the client's accountant how long originals must be kept (in the UK, company records for 6 years from the end of the financial year they relate to; the IRS gives 3 to 7 years depending on the case). Nothing is destroyed as part of this work.
3. **Pilot round.** Take 20 to 30 documents of each type. Build the field map (`import-field-map-and-check`), enter them (`documents-to-import-file`), and run a full read-back. Record the layouts, the error types and the time per document.
4. **Rules and validation.** Write the rules sheet and set validation on the entry sheet with the `entry-rules-sheet-and-validation` skill, so later rounds avoid the pilot's errors. [L2] Build validation in a copy; [L3] apply it to the live sheet within the agreed limits.
5. **Batches.** Enter in fixed batches. After each batch, run `entry-checks-and-spot-sampling`: count check, control totals, random spot check, and the accept or recheck call. Rechecks cover the whole batch.
6. **Exceptions.** Collect exceptions across batches into one list grouped by question, so the client answers them in one sitting.
7. **Import per batch.** Pre-import check with the `check-a-file-before-import` prompt; test import [L2]; then import new records within the limit [L3] with a backup and counts before and after. *Approval: any update to existing records, overwrite, merge or deletion needs a fresh yes on that batch.*
8. **Weekly report.** Documents done and left, error rate in spot checks, exceptions open, the forecast finish, and anything blocked.
9. **Close.** Final counts by type, outstanding exceptions, the rules sheet and field maps handed over, and the list of originals the client keeps.

## Outputs

- Backlog count and plan in order of need
- Pilot results: layouts, error types, time per document
- Rules sheet and validation plan
- One file, exceptions table and batch check per batch
- Combined exceptions list for the client
- Import logs (level 3)
- Weekly progress report and closing summary

## Needs the client's approval

The scope and order; answers to every exception; the batch limits before live entry; every bulk update, overwrite, merge or deletion, each with a backup first; any change to who can edit shared sheets; and anything touching payments, bank details or account codes, which stays with the client and their bookkeeper or accountant.
