# System move with record counts

**Trigger:** Moving from spreadsheets or an old system to a new one: a CRM switch, a new accounting package, a booking system or till change, or merging two customer lists into one system.

## Steps

1. **Agree access and limits (level 1).** Ask which access level the client grants for the old system, the new system and any spreadsheets, and the limits. Write them under "Access I have". Remind the client that every bulk import, merge and deletion needs a backup and a fresh yes, even at level 3.
2. **Count what exists (level 1).** Record counts per file or object, duplicates and blanks on key fields, and a few totals the business trusts (open invoices, active members, stock value).
3. **Map the fields (level 1).** Use the `migration-field-map` prompt: field map, "no home yet" list, values that would be lost.
4. **Write the transform rules (level 1).** Numbered rules with before-and-after examples: splitting names, fixing dates, mapping status values, joining files.
5. **De-duplicate (levels 1 and 2).** Use the `duplicate-review-and-merge-plan` skill on the combined data before it moves, on a copy. Survivorship rules are agreed with the client.
6. **Describe the new system (level 2).** Use the `data-dictionary-and-glossary` skill for the new system's fields, so staff know what each one means from day one.
7. **Test import (level 2).** Load a small batch of the messiest records, not the tidiest, into a sandbox or test account, using a file checked with the `pre-import-file-check` prompt. Compare counts and spot-check records field by field. Repeat until it passes. *Approval: the client signs off the test result.*
8. **Write the cut-over plan (level 2).** Freeze date, final export, clean-up, de-duplication, import, counts, spot checks and switch-over, each with an owner and a pass check. Write the rollback steps first: what triggers a rollback and how to go back.
9. **Back up (level 3 gate).** Take and store a full export of the old system and of the new system as it stands. Check the export opens and its counts match.
10. **Run the import (level 3).** Show the final counts, the file and the action list. *Approval: a fresh yes for the import, and a separate fresh yes for any merge or deletion in the new system.* Import in the agreed order (for example companies, then contacts, then deals), recording counts after each step.
11. **Check and switch.** Compare counts and trusted totals with step 2. Any unexplained difference stops the switch until found. Then switch over and keep the old system read-only for the agreed period.
12. **Report.** Counts at every stage, differences and their reasons, the "no home yet" decisions, the action log and the date the old system can be retired. Retiring or deleting the old data needs its own fresh yes.

## Outputs

- Starting counts and trusted totals
- Field map, transform rules and "no home yet" list
- Merge plan and survivorship rules
- Data dictionary for the new system
- Test import results
- Cut-over checklist with rollback steps
- Backup record, import log with counts, and final report

## Needs the client's approval

The access level and limits; the field map and survivorship rules; the test import result; a backup before any live change; a fresh yes for the live import, and separate fresh yeses for every merge batch, bulk update or deletion; the switch-over; and retiring the old system. The client can lower the access level at any time.
