# Year-end handover to the accountant

**Trigger:** The financial year ends, or the accountant asks for records. Start in the last month of the year with a pre-close check, and finish within the time the accountant gives. Repeat each year.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the accounting software; at a lower level I hand you the entries to post yourself. Until you choose, I work at level 1.

## Steps

1. **Ask what the accountant wants (month 12).** Get their list, deadline, file formats and any report layout. If there is no list, use the `year-end-records-pack` prompt to draft one for the owner to send them to confirm. *Approval: the owner sends the request, or says yes to that message and I send it.*
2. **Pre-close check (month 12).** Run the `month-end-close` workflow for every month not yet closed. Clear suspense accounts (level 3 within your limits). Chase missing receipts now, not after year-end.
3. **Count and list (last day of the year).** Stock count if the business holds stock; equipment bought or sold; loans and finance agreements with lender statements; deposits paid and received; unpaid invoices and bills at the year-end date.
4. **Close the final month (first weeks of the new year).** Reconcile every account to the year-end statement with the `bank-reconciliation` and `payout-reconciliation` skills. Note money in transit at year-end.
5. **Build the records pack.** Use the `year-end-records-pack` prompt: totals by group tied to the bank, document checklist, flags, contractor totals with the `contractor-payments-summary` prompt, and the questions list.
6. **Check region items.** From `knowledge.md`: record retention for the business's country, any Making Tax Digital or e-invoicing duties, any information returns the accountant may need data for. List them as questions with the official link; do not decide them.
7. **Hand over.** Prepare the pack, the change and action log for the year, and exports. *Approval: the owner sends the pack (or says yes and I send it) and decides what access the accountant gets in the software.*
8. **Post the accountant's adjustments.** When the accountant sends year-end journals, check each one against the evidence and ask about anything unclear. At level 2, save them as draft journals. At level 3, post the batch the accountant confirmed once the owner says yes to that batch. *Approval: posted by the accountant, or by me with the owner's written yes for that batch.*
9. **Learn from it.** List each adjustment the accountant made and why. Update coding rules, the chart of accounts notes and the monthly routine so the same fix is not needed next year.
10. **Set the retention reminder.** Record where the year's records live and the date they may be reviewed for deletion under local rules. *Approval: owner confirms the storage place; deleting old records always needs a new yes.*

## Outputs

- Year-end records pack with bank-tied totals
- Document checklist with status
- Stock, asset, loan and open-items lists at year-end
- Contractor payments summary
- Questions for the accountant with figures
- Year's change and action log
- Post-year lessons and updated coding rules

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action, I show the list (finish the open months, reconcile, clear holding accounts) with its limits: which company file, accounts and months, the cap per entry, and until when. After your yes, I do these and log each one.

**Always needs a new yes.** Every message to the accountant, every share of access, every batch of year-end journals, any entry over the cap or in a locked period, closing the year, and every deletion of old records. Tax and accounting decisions belong to a qualified accountant; check this with local rules before anything is filed.
