# Weekly money in, money out cycle

**Cadence:** Weekly, on a fixed day (for example Tuesday for chasing and Thursday for the payment run). Steps marked [L2] need level 2 access in that tool; steps marked [L3] need level 3 within the client's limits. Without access, I do the same steps from exports and hand over the drafts.

## Steps

1. **Invoices out (daily or weekly).** Raise invoices for work done or triggers met since last week, using the template from the `credit-terms-and-billing-setup` skill. Check purchase order numbers and contacts before sending. [L2] create drafts; [L3] send approved invoices. *Approval: the first invoice to any new customer, and any invoice outside the price list, needs the client's yes.*
2. **Match receipts (Monday).** Match every customer payment and remittance to its invoices; list unmatched receipts as questions. [L3] record receipts that match an invoice exactly; anything else waits for the client.
3. **Chase (Tuesday).** Run the `overdue-invoice-chase` skill on the aged debt report: clean the list, rank, pick the next step and date, send or draft the messages, log promises and disputes, update the 90-day cash-in view. [L3] send approved templates to known billing contacts. *Approval: final notices that mention legal steps, interest or compensation claims, account stops, plans outside the approved range, agency referrals and write-offs need a fresh yes each time.*
4. **Bills in (daily or weekly).** Enter new supplier bills with evidence attached. [L2] drafts; [L3] enter and code, then route to approvers. *Approval: bills are approved by the client's named approvers, not by me.*
5. **Check the bills (Wednesday).** Run the `supplier-invoice-check` skill on every bill due before the next run. Any bank detail change goes on hold and to the client for a phone check, using the `supplier-bank-change-check` prompt.
6. **Plan the run (Thursday morning).** Run the `payment-run-plan` skill: cash floor, priority order, discounts, supplier notes for anything late. [L2] build the batch, unapproved. *Approval: the client approves and releases every payment run; any new payee or changed bank detail needs a fresh yes after a phone check.*
7. **After release (Thursday afternoon).** Record payments against bills, send remittance advice if the client wants it. [L3] send approved supplier notes.
8. **Weekly note (Friday).** One page: invoices sent, cash in, overdue by age band and change since last week, disputes opened and closed, run paid, bills held and why, decisions waiting for the client. Include: *General practice, not legal or tax advice: check this with local rules and ask a qualified accountant or solicitor before claiming interest, taking legal steps or changing terms.*

## Outputs

- Invoices raised and sent (or drafts)
- Receipts matched and an unmatched list
- Chase list, messages sent or drafted, promise and dispute log
- 90-day cash-in view
- Checked bill batch with approve, hold or ask
- Payment run plan and an unapproved batch for release
- Action log (what, where, when, result)
- Weekly note with decisions for the client

## Needs the client's approval

Releasing payments; any new payee or bank change; first invoices to new customers; interest, compensation and legal steps; account stops; payment plans outside the agreed range; agency referrals; write-offs; and the first live action under any new level 3 limit.
