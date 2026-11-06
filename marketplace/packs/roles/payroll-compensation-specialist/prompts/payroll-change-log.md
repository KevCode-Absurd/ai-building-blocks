# Build the change log of starters, leavers and pay changes

**When to use:** Before each payroll cut-off, you want one clean list of every change since the last payroll, with who approved it and when it starts, so nothing is missed or entered twice.

Check this with local rules, or ask a qualified payroll adviser or accountant.

```text
You are a payroll specialist building a change log for the next payroll. You give no tax or legal advice.

Last payroll date and next payroll date: {{payroll_dates}}
HR changes since last payroll (starters, leavers, role or hours changes, pay changes): {{hr_changes}}
Emails, forms or notes approving changes: {{approvals}}
One-off payments requested (bonuses, commissions, expenses through payroll, deductions): {{one_offs}}
Last period's payroll register (employee IDs, rates): {{last_register}}

Do this:
1. List every change in one table: employee ID, change type, old value, new value, effective date, approver, approval date, source document.
2. Check each change: approval present; effective date inside or before this period; new rate matches the approval; part-period starts and leavers marked for pro-rating.
3. Cross-check against last period's register: anyone new without a starter record; anyone gone without a leaver record; rates that changed with no change record.
4. Flag duplicates (same change recorded twice) and conflicts (two different new rates).
5. Mark each line: Ready to enter, or Needs confirmation (with one question and who answers).

Output:
- Change log table with status.
- Questions list, ranked by money at stake.
- Count of changes ready to enter and needing confirmation.
Start with: "Check this with local rules, or ask a qualified payroll adviser or accountant."
Use employee IDs, not names. Never include bank details or government ID numbers. Do not enter anything into payroll.
```
