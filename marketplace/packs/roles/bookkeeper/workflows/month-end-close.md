# Month-end close

**Cadence:** Monthly, starting when the last bank and card statements for the month arrive (usually the first week of the next month). Light weekly upkeep in between. For a small business with a few accounts, plan on a few hours a month once the books are current; catch-up months take longer.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the accounting software; at a lower level I hand you a change request to post yourself. Until you choose, I work at level 1.

## Steps

1. **Weekly upkeep (every week).** Code new bank and card lines with the `transaction-categorisation` skill (level 2 leaves suggested codes for review; level 3 codes and matches them within your cap), attach receipts, and add unclear lines to the questions list. Review anything an AI tool or bank rule coded since last week. *Approval: new bank rules that post on their own always need the owner's yes.*
2. **Collect the month's evidence (day 1 to 3).** Statements for every bank, card and loan account; payout reports for every payment app and shop; unpaid invoices and bills lists. Missing documents go on the questions list.
3. **Reconcile payment platforms first (day 2 to 4).** Run the `payout-reconciliation` skill for each shop and payment app, so deposits in the bank can be matched to payouts and money in transit is known. At level 3, post the agreed payout summaries.
4. **Reconcile every bank and card account (day 3 to 5).** Run the `bank-reconciliation` skill for each account. Difference must be 0.00 with every change explained. Forced differences are not allowed. *Approval: at level 3, fixes within the agreed cap and kinds of entry are posted and logged; anything over the cap, any deletion or void, and anything in a locked period goes to the owner or accountant as a change request first.*
5. **Clear the holding accounts (day 5, level 3 within your limits).** Suspense, uncategorised and "ask my accountant" accounts go to zero or onto the questions list with figures.
6. **Review money owed (day 5).** Unpaid customer invoices by age, and bills due in the next month. Draft reminders for overdue invoices (level 2: saved unsent). *Approval: at level 3, I send the agreed reminder template to the customers on the approved list; any other message to customers or suppliers needs a new yes.*
7. **Check the profit and loss and balance sheet (day 6).** Compare with last month and the same month last year. Explain any big swing in one line, or add it to the questions list.
8. **Send the month-end note (day 6 or 7).** Reconciliation summary, profit and loss, cash position, money owed both ways, questions ranked by amount, and the change and action log. Include: *Check this with local rules and ask a qualified accountant before you file or claim anything.*
9. **Rules watch (monthly).** Check the "What changes fast" table in `knowledge.md` for the business's country: thresholds, Making Tax Digital dates, e-invoicing dates, software changes. Note what changed and who must act, with the official link. *Approval: the accountant decides on any tax action.*
10. **Lock the month (after approval).** Once the owner and accountant approve, set the software's closing date or lock date so the month cannot be changed by accident. *Approval: locking always needs a new yes each month, even at level 3.*

## Outputs

- Reconciliation report for each account, difference 0.00
- Payout reconciliation per channel
- Change and action log: every entry posted or proposed, with what, where, when, amount, evidence and who approved it
- Questions list ranked by amount
- Profit and loss, balance sheet and cash summary for the month
- Overdue invoice reminders (drafts, or sent at level 3)
- Rules-watch note with official links

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action, I show the list (code and match bank lines, reconcile, attach receipts, post payout summaries and journals up to the value cap, send the agreed reminder template) with its limits: which company file, accounts and months, the cap per entry, and until when. After your yes, I do these each month and log each one.

**Always needs a new yes.** Entries over the cap, deleting or voiding posted entries, changes in a locked period, new bank rules that post on their own, any new message to customers or suppliers, the month lock, and anything that moves money: paying, refunding or transferring. Filing returns and tax questions go to a qualified accountant.
