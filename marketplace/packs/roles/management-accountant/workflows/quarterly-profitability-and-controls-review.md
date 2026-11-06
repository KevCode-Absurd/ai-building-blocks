# Quarterly profitability and controls review

**Cadence:** Quarterly, two to three weeks after quarter end, once the third monthly pack is approved. Also triggered by a price review, a planned sale season, a new channel, a loss-making job, or a near miss with a payment.

**Access:** Confirm the access level for each tool at the start ("Access I have"); default to level 1 (read). Log every action.

## Steps

1. **Pull the quarter (week 1).** Timesheets, job cost reports, sales and fee exports, payroll by role, overhead lines and the three monthly packs. *Level 1.*
2. **Refresh the cost rates (week 1).** Recompute labour cost per hour by role and the overhead rate with the `job-and-service-costing` skill. Compare with the rates used in quotes and price lists. If under- or over-applied overhead has built up in one direction, propose a new rate. *Approval: the owner approves any new rate before it is used in quotes.*
3. **Profit by job, client or product (week 1 to 2).** Rank by total profit or contribution, using the costing or `product-margin-analysis` skill. Pick the bottom five for a closer look. *Level 1.*
4. **Estimate versus actual for the worst (week 2).** Line by line: hours, materials, subcontractors, variations, fees, returns. Name causes from the data, or ask. *Level 1.*
5. **Decisions with relevant costs (week 2).** For any cut, re-price or outsource idea, run the `relevant-cost-decision` prompt so sunk and spread costs do not drive the choice. *Level 1.*
6. **Keep, fix or cut list and quoting rules (week 2).** One line per product, service or client type, plus updated quoting rules. *Approval: the owner decides every keep, fix or cut and every price change.*
7. **Full controls review (week 2).** Run the `money-controls-review` prompt across the quarter's payments: task-to-person map, pattern tests, gap ratings, approval policy check. *Level 1 for the review. Level 2: draft changes to approval workflows or user roles for the owner. Level 3 only within agreed limits and after the owner confirms the action list, for example setting a second approver in the bank or accounting software. Approval: the owner approves every change to user rights, approval limits or payee settings.*
8. **Set up tracking for fixes (week 3).** Job cost sheet, new tracking categories or classes, a margin report or a monthly new-payee report. *Level 2: create drafts or unshared reports. Level 3 within limits: create the categories or reports in the live tool. Every action logged.*
9. **Review meeting (week 3).** Present the ranking, the worst-job causes, the keep, fix or cut list, control gaps and the 30-day plan. *Approval: owner signs off the plan and its owners.*
10. **Check last quarter's actions.** Did the re-priced quotes win and earn more? Did the control fixes happen? Carry anything not done into the new plan.

## Outputs

- Updated labour cost per hour and overhead rate, with inputs
- Profit ranking by job, client or product
- Estimate-versus-actual reviews for the worst performers
- Relevant-cost decision notes for any cut or re-price
- Keep, fix or cut list and quoting rules
- Controls review, approval policy and 30-day plan
- Action log of every change made in the client's tools

## Needs the client's approval

New cost and overhead rates, every price or range decision, every change to user rights, approval limits or payee settings, and anything outside the agreed level 3 limits. A control finding about a person is never acted on without the owner and, where needed, a qualified accountant or fraud examiner. This is general management accounting practice: check this with local rules and ask a qualified accountant before acting on accounting, tax or employment matters.
