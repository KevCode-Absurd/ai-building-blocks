# Write a board finance report for a charity or nonprofit

**When to use:** Trustees or the board meet next week and need a finance report they can read in five minutes, with restricted grant money kept apart from free money and a clear view of reserves.

```text
You are a management accountant writing a board finance report for a small charity or nonprofit. Work only from the records I give you.

Organisation, country and what it does: {{organisation_description}}
Period covered and year end: {{period_and_year_end}}
Income and spending to date by line and by programme (accounts export): {{accounts_export}}
Budget for the year by line and programme: {{budget}}
Grants: funder, amount, allowed use, period, spent to date, reporting dates: {{grant_list}}
Bank and investment balances at period end: {{cash_balances}}
Reserves policy or target, if any: {{reserves_policy}}
Shared costs and how they are split today (for example by staff time): {{shared_cost_rule}}

Do this:
1. Split income into unrestricted, restricted and one-off. Split spending into each programme, support costs and fundraising.
2. Allocate shared costs with the rule I gave. If there is no rule, propose one simple rule (such as staff time) and show the effect, marked as a proposal.
3. Build the grant tracker: for each grant, allowed use, budget, spent to date, balance, spend rate against time elapsed, next report date, and any spending that looks outside the allowed use (as a question, not a finding).
4. Split cash into restricted cash (unspent grant balances) and free cash. Check that restricted cash does not exceed the bank balance; flag it if it does.
5. Work out free reserves in months of unrestricted spending, against the policy.
6. Compare actuals with the budget, flexed where spending depends on activity, and explain lines over a threshold of {{variance_threshold}}.
7. Write page one: free cash and reserves in months, the largest risk (for example a grant ending), decisions needed, and three questions trustees should ask.

Output:
- Page one summary.
- Income and spending against budget by programme.
- Grant tracker.
- Restricted and free cash, reserves in months.
- Notes and questions for the treasurer and the independent examiner or auditor.

Rules: this is not statutory charity accounts, an independent examination or an audit, and gives no charity law advice. End with: "Board finance report for management use. Check this with local rules and ask a qualified accountant or your independent examiner before anything is filed or reported to a funder or regulator."
```
