---
name: payment-run-plan
description: Plans a supplier payment run from checked bills and the cash position. Lists what to pay now, what can wait to its due date and what is on hold, works out whether each early payment discount is worth taking, shows cash before and after the run, and prepares the batch for the client to approve and release. Also drafts short notes to suppliers who will be paid later than agreed. Use it weekly or before each run, and when cash is tight. Prepares payments at level 2; the client releases them. Check this with local rules and ask a qualified accountant before changing payment terms.
---

# Payment run plan

## When to use

- Before the weekly or fortnightly payment run.
- When cash is tight and the client must choose who to pay first.
- When suppliers offer discounts for paying early and nobody has checked whether they are worth it.
- After a supplier invoice check, to turn the approved bills into a run.

This is general practice for planning payments. It does not decide whether a supplier can legally charge interest or whether terms can be changed: check this with local rules and ask a qualified accountant or solicitor.

## Access needed

- **Level 1 (read):** open bills, due dates, supplier terms, bank balance and expected receipts.
- **Level 2 (read and draft):** build the payment batch in the payables tool or as a bank file, left unapproved, and save supplier notes as drafts.
- **Level 3 (read, write and publish):** send approved notes to suppliers' known accounts contacts and update the tracker. Releasing the batch, any transfer, and any new payee or bank change stay with the client, at every level.

## What you need

1. Bills due or overdue, already checked (status approve), with supplier, invoice number, amount, currency and due date.
2. Supplier terms, including any early payment discount and its deadline.
3. Cash today in each account the run will use, and cash the client must keep (payroll, tax, rent, loan payments).
4. Receipts expected before the next run, from the aged debt report or a 90-day cash view.
5. The client's priority rules: which suppliers are critical, which have agreed longer terms, which are owed for disputed work.
6. The client's cost of cash: the rate on any overdraft or loan, or what idle cash earns. If unknown, ask.

## Steps

### 1. Build the list

Take every approved bill due on or before the next run date, plus overdue bills. Leave out holds and asks, listed separately with their reason. Check none has been paid already (payment history and supplier statement).

### 2. Set the floor

Cash available for the run = cash today minus the amount the client must keep, plus receipts the client is confident will land before the run date. Show each part. If the client is not confident in a receipt, leave it out and say so.

### 3. Test each discount

For each discount offered:
- Discount amount = invoice amount x discount rate.
- Days gained by not paying early = days to normal due date minus days to discount deadline.
- Yearly cost of skipping it = (discount rate / (1 minus discount rate)) x (365 / days gained).
- Compare with the client's cost of cash. If the yearly cost of skipping is higher, the discount is worth taking when cash allows.

Show the working for each discount. Do not take a discount the client cannot afford without breaking the floor.

### 4. Order the run

Within the cash available, in the client's priority order:
1. Anything the client marks critical (for example payroll providers, tax, rent, key raw materials).
2. Overdue bills, oldest first, unless the client says otherwise.
3. Bills due before the next run.
4. Discounts worth taking.
5. Bills that can wait to their due date go in the next run, not this one.

If cash does not cover everything due, list what would be late, by how many days, and which suppliers they are.

### 5. Draft supplier notes

For each supplier who will be paid after the due date, a short, honest note before the due date: what will be paid, when, and a name to call. No promises the client has not approved.

### 6. Prepare the batch (level 2)

Build the batch in the payables tool or bank file, unapproved, with each line referencing the invoice numbers it pays (so the supplier's remittance matches). Check every payee and bank account against the supplier record on file. Any payee not paid before, or any changed bank detail, comes out of the batch and goes to the client for a fresh yes after a phone check.

### 7. Hand over for release

Send the plan with the batch total, the cash after the run, and the release steps. The client approves and releases. After release, record the payments against the bills and send remittance advice if the client wants it.

## Checks

- Cash floor respected; cash after the run shown.
- No bill in the run is on hold, already paid or credited.
- Every payee and bank account matches the supplier record; no new payee in the batch without a fresh yes.
- Discount working shown for every discount offered.
- Every late payment has a supplier note drafted before the due date.
- The plan says clearly: prepared at level 2, released by the client.
- The output carries the line: *General practice, not legal or tax advice: check this with local rules and ask a qualified accountant before changing payment terms.*

## Output format

1. Summary: cash today, amount kept back, expected receipts, cash available, run total, cash after the run.
2. Pay now table: supplier, invoice numbers, amount, due date, reason (critical, overdue, due, discount).
3. Wait table: supplier, amount, due date, next run date.
4. Discounts table with the working.
5. Held or questioned bills, with reasons.
6. Late payments and supplier notes (drafts).
7. Release checklist for the client.

## Example of good output (short)

Made-up business for illustration: Fernhill Joinery, a 9-person workshop.

> **Run of 13 November 2026.** Cash today 41,200.00. Kept back for payroll and VAT 26,500.00. Expected receipts by 13 Nov 6,000.00 (one customer, confirmed). Available 20,700.00. Run total 17,940.00. Cash after run 2,760.00.
>
> | Supplier | Invoices | Amount | Due | Reason |
> |---|---|---|---|---|
> | Oakline Timber | OT-3391, OT-3402 | 11,480.00 | 10 Nov | Overdue, critical stock |
> | Brassworks Hardware | BH-882 | 3,920.00 | 15 Nov | Due, takes 2% discount (saves 80.00) |
> | Sparkfield Electrical | SE-71 | 2,540.00 | 12 Nov | Due before next run |
>
> **Discount, Brassworks:** 2% if paid within 10 days, otherwise 30 days. Yearly cost of skipping = (0.02 / 0.98) x (365 / 20) = about 37%. The client's overdraft costs 9% a year, so take it.
>
> **Waits:** Clearcoat Finishes 2,300.00, due 27 Nov, next run.
>
> Batch built in BILL, unapproved. Release by the owner after checking the totals above.
>
> *General practice, not legal or tax advice: check this with local rules and ask a qualified accountant before changing payment terms.*
