# Quarterly spreadsheet health check

**Cadence:** Every three months for the workbooks the business depends on (quotes, budget, payroll inputs, stock, reports), and before year end or a funding round. About an hour per workbook.

## Steps

1. **List the critical workbooks.** For each: owner, users, what depends on it, last change, any macros or scripts. Rank by money or people affected.
2. **Get access (level 1).** The owner grants read access to each workbook, or shares a copy with masked data, or screenshots with formulas visible.
3. **Run the review.** Use the `spreadsheet-review` skill on the top-ranked workbooks, focused on what changed since last quarter: new rows, new tabs, new users, new versions of Excel or Sheets.
4. **Check the platform changes.** Re-read the "What changes fast" table in `knowledge.md`: retired functions (such as the COPILOT function), Apps Script runtime and quota changes, macro trust settings. Search each workbook for anything affected.
5. **Check the automations.** For each macro or script: does it still run, who owns the trigger, are the permissions still the narrowest needed, is the log being written, did anyone leave the business whose account runs a trigger?
6. **Check access.** Who can edit and who can view; remove people who left. Move any sensitive data out of shared workbooks, since protection is not security.
7. **Report.** One page: workbooks checked, wrong-answer findings and their fixes, fragile spots, automation status, access changes needed. *Approval: the owner chooses which fixes to make and who makes them.*
8. **Fix and log (level 2 on a copy, level 3 on the live file).** Approved fixes are made on a copy and tested; at level 3 I then replace the live file within the agreed limits, otherwise the owner or their builder does. Each change goes in the workbook's change log.

## Outputs

- Ranked list of critical workbooks
- Findings table per workbook, with fixed formulas
- Automation status (runs, owner, permissions, log)
- Access changes to make
- One-page report for the owner

## Needs the client's approval

The access level for each workbook, every fix, every change to who can edit, any change to a macro or script, and replacing any live file. At level 3 the owner confirms the change list and limits once before the first live change, and I ask again before anything outside them.
