# Monthly management accounts cycle

**Cadence:** Monthly. Starts when the bookkeeping for the month is reconciled (bank, card, loan and payout accounts), and ends with a short review meeting with the owner. Agree a pack date with the owner and keep it; the close checklist gets shorter as recurring problems are fixed.

**Access:** Ask at the start which level the client grants for each tool (accounting software, timesheet or job software, shop, spreadsheets) and write it down as "Access I have". Until they answer, work at level 1 (read). Log every action: what, where, when, result.

## Steps

1. **Agree the frame (first month only).** Reader of the pack, decisions it feeds, variance threshold, KPIs and their definitions, segments (jobs, sites, channels, programmes), pack date. *Approval: the owner signs off the KPI list and definitions.*
2. **Close checklist (working day 1 to 2).** Confirm reconciliations are done; list open items. Payroll, sales invoices, supplier bills, stock and depreciation in. Open items go on page one. *Level 1.*
3. **Trial balance checks and mapping (day 2).** Run the checks and update the mapping table in the `management-accounts-pack` skill. *Level 1.*
4. **Accruals and prepayments (day 2 to 3).** List items to check with the document behind each. *Level 2: draft journals for the accountant or owner to review. Level 3 only within the client's limits: post the agreed journals after the action list is confirmed. Approval: owner or accountant approves every journal.*
5. **Budget against actuals (day 3).** Run the `flexed-budget-review` skill: flex for volume, split activity and spending, break down cost variances, assign to budget holders. *Level 1.*
6. **Margins (day 3).** Refresh job or client profit with the `job-and-service-costing` skill, or product and order margins with the `product-margin-analysis` skill, depending on the business. Builders also refresh the WIP schedule (`wip-schedule-over-under-billing` prompt). *Level 1.*
7. **Controls spot check (day 3).** One rotating test from the `money-controls-review` prompt: new payees, bank detail changes, payments under approval limits, or journals posted and approved by the same person. *Level 1. Report patterns to the owner only.*
8. **Build and check the pack (day 4).** Page one, statements, KPIs with definitions, notes, questions. Run the quality bar in `knowledge.md`. *Level 2: save the pack as a draft or unshared report in the client's drive or reporting tool.*
9. **Owner review (day 4 to 5).** Walk through page one: what moved, risks, actions. Record decisions and owners. *Approval: the owner approves the pack before it goes to anyone else.*
10. **Send to lender, board or trustees (if agreed).** *Level 3 only within the limits set (named recipients, this pack only), after the owner's yes; otherwise the owner sends it. Approval: the owner approves each external send.*
11. **Rules watch (monthly).** Check the "What changes fast" table in `knowledge.md` for the business's country: UK payment terms bill, EU interest rates, FRS 102 and IFRS 18 effects on KPIs, charity reporting changes. Note what changed and who must act, with the official link. *Approval: the accountant decides on any accounting or tax action.*
12. **Improve the close.** Add one fix to next month's checklist from what slowed this month down.

## Outputs

- Close checklist with open items
- Trial balance check and mapping table
- Accruals and prepayments list (and draft journals at level 2)
- Flexed budget review with owners and causes
- Job, client or product margin update (and WIP schedule for builders)
- Controls spot check note
- Management accounts pack with page one, KPIs and definitions
- Action log of every change made in the client's tools
- Questions for the accountant

## Needs the client's approval

KPI definitions; every journal, whether drafted or posted; the pack before it leaves the business; every external send; any change outside the agreed level 3 limits (new recipients, new accounts, overwriting data). This is general management accounting practice: check this with local rules and ask a qualified accountant before figures go to a lender or funder or into your accounts.
