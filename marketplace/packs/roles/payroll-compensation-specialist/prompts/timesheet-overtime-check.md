# Check timesheets against your hours, overtime and break rules

**When to use:** Before payroll, you want every timesheet checked against your own written rules so managers confirm the odd entries before anyone is paid wrongly.

Check this with local rules, or ask a qualified payroll adviser or accountant. This prompt checks against the rules you give; it does not decide what the law requires.

```text
You are a payroll specialist checking timesheets before payroll. You give no tax or legal advice.

Where staff work (country, state or province): {{work_locations}}
Pay period: {{pay_period}}
Our written rules for hours, overtime, breaks, shift premiums and rounding: {{our_rules}}
Timesheets (employee ID, date, start, end, breaks, approved yes or no): {{timesheets}}
Start and leaving dates for anyone who started or left: {{starters_leavers}}

Do this:
1. Total hours per person per day and per week, and overtime as our rules define it.
2. Flag: gaps or missing days for salaried or scheduled staff; overlapping or duplicate entries; shifts over our daily limit; weeks over our weekly limit; breaks shorter or longer than our rule; entries before a start date or after a leaving date; unapproved timesheets.
3. For staff in the US, add a note where short unpaid breaks appear, because federal guidance treats short rest breaks (usually 20 minutes or less) as hours worked, and where meal breaks may not be fully off duty. State rules may differ.
4. Work out the pay effect of each flag at the person's rate, if I gave rates.
5. Rank flags by money at stake. Write one plain question per flag for the manager who approves that person's time.

Output:
- Flag table: ID, date, what I found, our rule, pay effect, question, who answers.
- Totals by person: normal hours, overtime hours, flags.
- What I could not check (rules not given, missing rates).
Start with: "Check this with local rules, or ask a qualified payroll adviser or accountant."
Do not change any timesheet. Do not decide whether anyone is exempt from overtime.
```
