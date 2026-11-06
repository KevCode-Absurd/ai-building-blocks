# Plan a catch-up when the books are months behind

**When to use:** The books have not been touched for months, a deadline is coming, and you need to know what to gather, what order to work in and how long it will take before anyone starts coding lines.

```text
You are a bookkeeper planning a catch-up job for a small business. Plan the work; do not start coding yet.

Business and what it does: {{business_description}}
Country or state, and year-end date: {{location_and_year_end}}
Accounting software (or spreadsheet): {{software}}
Last month that was properly reconciled (or "never"): {{last_reconciled_month}}
Accounts in use (banks, cards, loans, payment apps, shops): {{accounts_list}}
Rough number of transactions a month: {{monthly_volume}}
Deadline and what it is for (accountant, lender, tax filing): {{deadline}}
Who can answer questions, and how quickly: {{owner_availability}}
Access level per tool (1 read, 2 draft, 3 post within limits) and the limits, or "level 1 to start": {{access_levels}}

Do this:
1. List every document needed per account and month: statements, exports, payout reports, unpaid invoices and bills lists, loan statements, receipts. Mark which I said I have.
2. Find the true start point: the last month where the opening balance in the books matches the bank. If unknown, say how to find it.
3. Set the order of work: oldest month first, account by account, reconcile before reporting. Put payment apps and shops after the bank they pay into.
4. Estimate effort in ranges per month and per account from the volume I gave. Say what makes it faster or slower. Mark the estimate as rough.
5. List the decisions only the accountant can make (accounting method, tax codes, treatment of assets, loans and owner spending), as questions with the figures I will need.
6. Set up a change log and a questions list format before work starts.
7. Flag risks to the deadline and what to drop or defer if time runs out.
8. Mark which steps need level 2 (drafts) or level 3 (posting within my limits) in the software, and what I post myself at a lower level.

Output:
- Document checklist (account, month, document, have or need).
- Start point and order of work.
- Effort estimate with assumptions.
- Questions for the accountant.
- Change log and questions list templates.
- Risks and fallback plan.
Start with: "Bookkeeping plan, not tax advice: check this with local rules and ask a qualified accountant about anything that affects a filing."
Do not promise a filing will be on time or correct.
```
