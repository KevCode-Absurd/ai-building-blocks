# Month-end payables and receivables close

**Trigger:** The first three working days after month end, before the bookkeeper or accountant closes the books. Steps marked [L2] or [L3] need that access level in the tool; without access, I work from exports.

## Steps

1. **Freeze the lists (day 1).** Export the aged receivables and aged payables at month end and check each total agrees with the ledger control accounts. Any difference goes on the questions list for the bookkeeper.
2. **Customer statements (day 1 to 2).** Prepare statements for every customer with an open balance. [L2] draft; [L3] send to known billing contacts as approved. *Approval: statements to customers in dispute, or on a payment plan, are checked by the client first.*
3. **Supplier statements (day 1 to 3).** Reconcile statements from key suppliers to the payables ledger: invoices missing from the books, payments the supplier has not applied, credit notes not received. Draft queries to suppliers. [L3] send routine queries to known accounts contacts.
4. **Disputes and credit notes (day 2).** Review every open dispute: age, amount, owner, next step. Draft credit notes where the client has agreed a fault. *Approval: every credit note above the client's limit, and every write-off, needs the client's yes.*
5. **Duplicate and risk review (day 2).** Run a duplicate scan across the month's payments with the `supplier-invoice-check` skill, and list all supplier records changed in the month (bank details, addresses, new suppliers) with who changed them and how each was verified.
6. **Numbers for the month (day 3).** Days sales outstanding, days payable outstanding, overdue by age band, top ten debtors, cash collected against the 90-day view, disputes opened and closed. Compare with last month, and explain any big change in one line.
7. **Bad debt list for the accountant (day 3).** Debts the client thinks will not be paid, with the history and evidence. *Approval: the client and accountant decide on provisions and write-offs.*
8. **Rules watch (monthly).** Check the "What changes fast" table in `knowledge.md`: UK Late Payments Bill, e-invoicing dates for the countries the client trades with, statutory interest tables, Nacha rules if the client pays by ACH. Note what changed and who must act, with the official link. *Approval: the client's adviser decides on any legal or tax change.*
9. **Month-end note (day 3).** Lists agree with the ledger, statements sent, supplier statements reconciled, the month's numbers, risk review, bad debt list and questions. Include: *General practice, not legal or tax advice: check this with local rules and ask a qualified accountant or solicitor before claiming interest, taking legal steps or writing off debts.*

## Outputs

- Aged receivables and payables at month end, agreed to the ledger
- Customer statements (sent or drafts)
- Supplier statement reconciliations and queries
- Dispute log and draft credit notes
- Duplicate scan and supplier change log
- Monthly numbers with comments
- Bad debt list for the accountant
- Rules-watch note with official links
- Month-end note and action log

## Needs the client's approval

Credit notes above the client's limit, write-offs and provisions, statements to disputed or plan accounts, any supplier record change, and any legal or tax step.
