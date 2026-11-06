# Pay period pre-check cycle

**Cadence:** every pay period (weekly, fortnightly or monthly), starting at the change cut-off and ending when the client runs payroll. About two to four hours of checking for a team under 50.

**Access:** set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the list to enter yourself. Until you choose, I work at level 1. Running, approving or submitting payroll, paying anyone and changing bank details stay with you at every level.

Check this with local rules, or ask a qualified payroll adviser or accountant.

## Steps

1. **Cut-off reminder (cut-off minus 2 working days).** Send managers the reminder you approved once: approve timesheets, send starters, leavers and pay changes with approvals. At level 3, I send it to the agreed managers on the agreed day.
2. **Change log (cut-off day).** Build the log with the `payroll-change-log` prompt from HR changes, approvals and one-off payments. Mark each line ready or needs confirmation.
3. **Timesheets (cut-off day).** Check them with the `timesheet-overtime-check` prompt against your written rules. At level 3, apply only the corrections a manager has approved in writing, inside this period, and log each one.
4. **Commission and bonus (cut-off day, if due).** Prepare the payout file from the approved calculation and the plan (see the `sales-commission-plan` skill for the rules). *Approval: you approve the payout file.*
5. **Pre-check (cut-off plus 1 day).** Run the `payroll-input-precheck` skill: person-by-person comparison, starters and leavers, pay changes, variable pay, duplicates. Send the ranked question list to the people who can answer.
6. **Prepare the pay run (level 2, after answers).** Enter the approved and confirmed changes in the unsubmitted pay run, attach the question list and answers, and log each entry. Anything still unconfirmed stays out and is listed.
7. **Hand over (before your processing deadline).** Tell you the run is ready, with the summary: gross against last period, items entered, items held, what I could not check. *Approval: you review, approve and submit the pay run, and pay.*
8. **After payday.** Note any correction made after payday and its cause. Each quarter, look for repeat causes and suggest one process fix.

## Outputs

- Change log with status and approvals
- Timesheet flag list and applied corrections (level 3 only)
- Commission payout file for approval
- Pre-check report with ranked questions
- Prepared, unsubmitted pay run (level 2)
- Action log (what, where, when, result)
- Quarterly note on repeat errors

## Needs the client's approval

**Runs within your limits after one confirmation.** Sending the agreed cut-off reminder to the agreed managers, applying manager-approved timesheet corrections (level 3), and entering approved changes in the unsubmitted pay run (level 2).

**Always stays with you or needs a new yes.** Approving and submitting the pay run, paying anyone (including commissions and off-cycle payments), adding or changing bank or payout details, any pay rate change without a written approval, deleting records, and any tax, pension or legal question, which goes to your payroll adviser or accountant.
