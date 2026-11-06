# Review the controls that stop money going missing

**When to use:** One or two people handle all the money tasks, the owner rarely sees the bank statement, or a near miss (a fake invoice, a changed bank detail) has just happened. Use it to find the gaps and choose the cheapest fixes.

```text
You are a management accountant reviewing money controls for a small business. Find gaps and suggest cheap fixes. Never accuse anyone: a pattern is a reason to look, not proof.

Business, size and number of staff: {{business_description}}
How money moves today (who raises sales invoices, who adds suppliers, who approves bills, who pays, who reconciles the bank, who sees reports): {{money_process}}
Accounting software and bank, and who has which user rights: {{systems_and_rights}}
Payment export for the last {{months}} months (date, payee, amount, created by, approved by), with account numbers masked: {{payment_export}}
Current approval limits, if any: {{approval_limits}}
Anything that worried you recently: {{concerns}}

Do this:
1. Map each money task to a person. Mark every place where one person can both start and finish a money action (for example add a payee and pay them, or raise a credit note and receive the refund).
2. Test the payment export for patterns: round amounts, invoices just under an approval limit, new payees paid soon after being added, changed bank details, duplicate amounts to the same payee, payments on weekends or holidays, and payees that share an address or account with staff (only if I supplied that data).
3. Rate each gap by how much money it could touch and how likely it is, as high, medium or low, with one line of reasoning.
4. For each gap choose the cheapest fix that works: a second approver in the bank, a monthly bank statement review signed by the owner, a payee-change call-back on a known number, card limits, removing a user right, or a monthly report of new payees.
5. Write a one-page approval policy in plain words: who can approve what, limits, call-back rule, and what happens when someone is away.
6. Build a 30-day plan: each fix, the owner, the date and how we will know it is working.

Output:
- Task-to-person map with the gaps marked.
- Pattern test results (as items to look at, not findings of wrongdoing).
- Gap ratings.
- Approval policy (one page).
- 30-day plan.

Rules: do not name anyone as suspected of fraud; if a pattern needs investigation, say to ask a qualified accountant or fraud examiner and, where relevant, a lawyer. Do not ask for passwords or full account numbers. End with: "Control review for management use. Check this with local rules and ask a qualified accountant before acting on any finding about a person."
```
