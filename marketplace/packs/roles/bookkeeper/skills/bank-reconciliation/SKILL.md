---
name: bank-reconciliation
description: Reconciles one bank, card or loan account to its statement for one or more months, from a statement and a ledger or bank feed export. Matches lines by amount, date and payee, finds duplicates, missing entries and wrong-period entries, and produces a reconciliation report, a change request for the owner or accountant to approve, and a ranked questions list. Use it for month-end close, catch-up bookkeeping, or when the balance in the books does not match the bank. It never forces a difference, and it posts entries only with level 3 access, within the owner's limits.
---

# Bank reconciliation

## When to use

- Month-end close: prove each account agrees with its statement before reports go out.
- Catch-up work: the business is months behind and nobody knows which months are right.
- Something looks off: the bank balance in the software does not match online banking, or the accountant has sent back an adjustment.
- After switching software, banks or bank feeds, when duplicates and gaps are most likely.

Do not use it to decide tax treatment of any line. This is bookkeeping support, not tax advice: check this with local rules and ask a qualified accountant about how any item should be treated for tax.

## What you need

1. The bank's own statement (PDF or CSV) for each month in scope, with opening and closing balances.
2. A ledger export for the same account and period: date, description, amount, account coded to, and whether it is marked reconciled.
3. The last month that was properly reconciled, and its closing balance.
4. The currency of the account, and whether any lines are in another currency.
5. Any notes from the owner on odd payments, plus receipts or invoices if they exist.
6. Who approves changes: the owner, the accountant, or both.

**Access:** level 1 to read the ledger, bank feed and reconciliation history; level 2 to save the fixes as draft entries and suggested matches; level 3 to match, post the fixes and mark lines reconciled, within your limits (accounts, months, kinds of entry, a value cap per entry). Deleting or voiding posted entries and anything in a locked period always need a new yes.

Ask for statements, not just feed exports. The feed can drop or repeat lines; the statement is the bank's record.

## Steps

### 1. Check the start point

Confirm the opening balance on the first statement equals the closing balance of the last reconciled month in the books. If it does not, stop. Find the first month where the two diverge and start there. Every later month inherits an error at the start.

### 2. Check the files

- Dates cover the whole period with no gaps between statements.
- Statement opening balance plus money in minus money out equals the closing balance. If the bank's own file does not add up, ask for a fresh copy.
- One currency per account, or a clear rate for any foreign lines.

### 3. Match in passes

1. **Exact:** same amount, same date, same payee text.
2. **Near:** same amount, date within a few days (card and cheque lines often clear late), payee text similar.
3. **Grouped:** one bank line equals several ledger lines (a deposit of several customer payments) or the reverse (one invoice paid in parts).
4. **Leftovers:** list every unmatched line on both sides.

Note which pass matched each line. If an AI tool or bank rule already matched lines, review them as a separate list: read every line matched by prediction rather than by a rule or an exact match.

### 4. Explain the leftovers

For each unmatched line, choose one cause and the evidence for it:
- **Missing from books:** on the statement, not in the ledger (bank fees, interest, a payment nobody recorded).
- **Missing from bank:** in the ledger, not on the statement (an uncleared cheque, a payment recorded twice, an entry in the wrong account).
- **Duplicate:** two ledger lines for one bank line, often a feed line plus a manual entry or a receipt app entry.
- **Wrong period:** dated in the next or previous month.
- **Wrong amount:** a typo or a currency difference.
- **Transfer:** money moved between the owner's own accounts, which must be recorded on both sides as a transfer.
- **Unknown:** no evidence. This goes to the questions list.

### 5. Look for risk while you are there

- Round-number payments with no invoice.
- Payments to a new payee with a name close to a regular supplier.
- Personal-looking spending in the business account.
- Gaps in cheque numbers or invoice numbers.
These are flags for the owner, not accusations.

### 6. Draft the change request, then act at your level

For each fix, one row: date, amount, what to change (add, delete, re-date, recode, mark as transfer), the evidence, and the reason. At level 1, the owner or accountant posts the approved rows. At level 2, save them as draft entries (level 2). At level 3, post the rows that sit inside the agreed limits and log each one (level 3); rows over the cap, deletions, voids and anything in a locked period wait for a new yes.

### 7. Prove it

After the proposed changes, the reconciled balance must equal the statement closing balance, with the difference at 0.00. If a difference remains, it stays on the questions list with its amount. Do not create a balancing entry to hide it.

### 8. Rank the questions

One question per line with date, amount and payee, sorted by money at stake. Write yes or no questions where you can.

## Checks

- Opening balance agrees with the last reconciled close.
- Statement arithmetic checked for each month.
- Every unmatched line has a cause and evidence, or is a question.
- No balancing or "reconciliation adjustment" entry proposed.
- Transfers appear on both accounts.
- Account numbers masked to the last four digits.
- The report carries the line: *Check this with local rules and ask a qualified accountant before you file or claim anything.*

## Output format

1. Summary box: account (last four digits), period, statement closing balance, book balance before and after proposed changes, difference.
2. Matching summary: lines matched by each pass, lines left.
3. Unmatched lines table: date, amount, payee, side (bank or books), cause, evidence.
4. Change request table: date, amount, change, evidence, reason, approval status.
5. Risk flags (if any).
6. Questions for the owner and for the accountant, ranked by amount.
7. What I could not check (for example receipts I never saw).

## Example of good output (short)

Made-up business for illustration: Harbour Lane Pottery, a two-person studio.

> **Business current account (…4417), October 2026.** Statement closing balance 8,412.60. Books before changes 8,327.60. Difference 85.00 (books lower).
>
> | Date | Amount | Side | Cause | Evidence | Proposed change |
> |---|---|---|---|---|---|
> | 31 Oct | -35.00 | Bank | Missing from books | Statement line "MONTHLY ACCOUNT FEE" | Add bank charge, coded to Bank fees |
> | 14 Oct | -120.00 | Books | Duplicate | Feed line and receipt app entry, same supplier and day | Delete receipt app copy, keep feed line |
> | 14 Oct | -120.00 | Bank | Matched | Feed line | None |
>
> After the change request is approved: 8,327.60 - 35.00 + 120.00 = 8,412.60. Difference 0.00.
>
> **Questions for the owner**
> 1. 22 Oct, -600.00 to "J. Moss": is this a supplier, a refund or a personal payment?
>
> *Check this with local rules and ask a qualified accountant before you file or claim anything.*
