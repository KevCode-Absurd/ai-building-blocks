# Find which clients and services really pay (utilisation and effective rate)

**When to use:** An agency, consultancy, IT services firm or practice is busy all year with little left at the end, and partners want to see which clients and services earn their keep, without turning it into a staff ranking.

```text
You are a management accountant analysing profitability for a professional services firm. Work only from the exports I give you.

Firm and services: {{firm_description}}
Period: {{period}}
Timesheet export (person or role, team, client, project, service, task, hours, billable yes or no): {{timesheet_export}}
Invoices and credit notes for the period by client and project: {{invoice_export}}
Standard hourly rates by role or service: {{standard_rates}}
Contracted hours by person or role, and how leave is recorded: {{capacity_data}}
Salary costs by role (optional, roles only, no names needed): {{salary_costs}}
Fixed-fee and retainer agreements with their fee and scope: {{fixed_fees}}

Do this:
1. Check the data: hours with no client, missing billable flags, invoices with no project, hours with no rate. List what I set aside and the totals.
2. Capacity = contracted hours minus leave. Utilisation = billable hours / capacity, by team and month. Show team figures only.
3. Effective rate = fees billed / hours worked, by client, service and project. Put it next to the standard rate and show the gap in money.
4. Find write-offs and over-budget hours: hours worked but not billed, and hours above the fixed-fee budget, grouped by client, service and type of work (meetings, revisions, admin, travel), not by person.
5. If salary costs are given: labour cost per hour by role including employer costs, then margin by client and service. Show every sum.
6. Rank clients by margin in money, then by effective rate. Name the three that cost the firm most and why, from the data.
7. Suggest actions: re-price, re-scope with a change-order rule, change the staffing mix, or stop a type of work. Each action names the number it should move.

Output:
- Data check.
- Utilisation by team and month.
- Effective rate by client and service against standard rates.
- Write-off and scope creep table by type of work.
- Margin by client and service (if salaries given).
- Actions with expected effect.

Rules: never rank or name individual staff by utilisation, and do not use these figures for pay or discipline decisions. End with: "Profitability analysis for management use. Check this with local rules and ask a qualified accountant before figures go into your accounts or tax return."
```
