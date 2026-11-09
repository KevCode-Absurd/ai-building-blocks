---
name: supplier-invoice-check
description: Checks a batch of supplier invoices before they are approved or paid. Tests the basics (supplier, numbering, dates, totals, tax line shown), matches each bill to its order, contract and proof of receipt, compares it with the supplier's past bills, scans the batch and history for duplicates, and treats any change of bank details as a hold until verified by phone. Gives each invoice a status of approve, hold or ask with a one-line reason, ranked by money at risk. Use it before a payment run, when bills pile up, or when you suspect a double payment. Check this with local rules and ask a qualified accountant about tax lines.
---

# Supplier invoice check

## When to use

- Before each payment run, on the bills due in the run.
- When a pile of bills has built up and nobody knows which ones are right.
- When you suspect a bill was paid twice, or a supplier says it was never paid.
- When a supplier's invoice arrives with new bank details, a new email address or an urgent tone.

Do not use it to decide how tax applies to a bill or whether a supplier is committing fraud. This is general practice: check this with local rules and ask a qualified accountant about any tax line.

## Access needed

- **Level 1 (read):** bills, purchase orders, receiving records, supplier list and payment history in the accounting or payables tool, or exports of them.
- **Level 2 (read and draft):** enter bills as drafts with the evidence attached, add a hold note, and draft questions to suppliers.
- **Level 3 (read, write and publish):** enter and code bills, route them to your approvers, and send routine questions to suppliers' known accounts contacts. Approving bills, releasing payment and changing bank details stay with you, at every level.

## What you need

1. The batch: each invoice as a PDF, e-invoice or export line (supplier, invoice number, date, due date, currency, net, tax, total, bank details shown).
2. The supplier list with payment terms and the bank details on file (masked to the last four digits).
3. Purchase orders or contracts, and proof of receipt (delivery notes, receiving records, or a manager's confirmation for services).
4. The last 6 to 12 months of bills and payments for the same suppliers, for the duplicate and price checks.
5. Your approval limits: who approves what, up to which amount.
6. The value above which you want a full three-way match. If you have not set one, ask; do not invent it.

## Steps

### 1. Check the basics on every invoice

- Supplier name matches the supplier on file.
- Invoice number present and not seen before for this supplier.
- Invoice date and due date present; due date matches agreed terms.
- Line items multiply and add up; tax shown as a separate line where the supplier charges it; total matches.
- Currency as expected.
- Your company name and address correct (a bill addressed to someone else is not yours to pay).
- For received e-invoices: any rejection or validation message from the platform.

### 2. Match to the order and receipt

- **Three-way match** (above the client's value, and for stock): invoice against purchase order (price, quantity) and against receiving record (arrived, right quantity, right condition).
- **Two-way match** (services, subscriptions, small bills): invoice against contract, order or the last approved bill.
- Record each difference: price, quantity, item, or missing order or receipt. Small differences inside a tolerance the client has set can pass; with no tolerance set, list them.

### 3. Compare with history

- Price per unit against the last few bills from the same supplier.
- Bills from a new supplier with no order behind them.
- Round-number bills with vague descriptions ("services rendered").
- Gaps or jumps in the supplier's invoice numbers.
- Bills just under an approval limit, or split into several just under it.

### 4. Scan for duplicates

Across the batch and the history:
- Same supplier and same amount within a short period.
- Same invoice number with a small change: a suffix, a dash, a swapped digit, a leading zero.
- Same amount and date from two supplier records that may be the same supplier set up twice.
- A credit note already issued against an invoice that is still in the run.

### 5. Treat bank detail changes as a hold

If any invoice shows bank details different from those on file, or a covering email asks to change them:
- Status **hold**, whatever the amount.
- Note the change, the email address it came from, and any look-alike domain.
- Ask the client to call the supplier on a number already on file (not one in the email) and confirm with a person they know.
- A second person approves the change in the system after the call. I write up the change at level 2; the client makes it.

### 6. Give each invoice a status

- **Approve:** basics pass, matched, no duplicate, no bank change.
- **Hold:** a risk that must be cleared before payment (bank change, possible duplicate, no order, price jump over tolerance).
- **Ask:** a question that a quick answer will clear (missing receipt confirmation, unclear description).

Rank holds and asks by amount at risk. Give each a one-line reason and the person who can clear it.

## Checks

- Every invoice in the batch has a status and a reason.
- Every bank detail change is on hold, with no exceptions.
- Duplicates checked across the batch and the history, not just the batch.
- Amounts come from the invoices and ledger, never estimated.
- No accusation of fraud: flags describe what was seen.
- Account numbers masked to the last four digits.
- The output carries the line: *General practice, not tax or legal advice: check this with local rules and ask a qualified accountant about tax lines.*

## Output format

1. Summary: number of invoices, total value, approve / hold / ask counts and values.
2. Holds and asks table, ranked by amount: supplier, invoice number, amount, status, reason, who clears it.
3. Approved table: supplier, invoice number, amount, due date, match type.
4. Duplicate scan results: the matching fields and amount at risk.
5. Bank change log: supplier, what changed, where the request came from, verification status.
6. Questions for suppliers (drafts), and questions for the accountant.
7. What I could not check (for example no receiving records for services).

## Example of good output (short)

Illustrative structure, not a real business: a wholesale bakery with 14 staff. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.

> **Bill batch for run of 12 November 2026: 23 invoices, 18,640.20 total.** Approve 19 (14,105.70), hold 3 (4,212.50), ask 1 (322.00).
>
> | Supplier | Invoice | Amount | Status | Reason | Clears it |
> |---|---|---|---|---|---|
> | Supplier A | 20931 | 2,980.00 | Hold | Invoice shows new bank account (…7781); email from a lookalike of Supplier A's domain (capital I in place of l) | Owner calls Supplier A on number on file |
> | Supplier B | 4471-A | 864.50 | Hold | Same amount and date as 4471, paid 3 Nov; possible duplicate | Supplier B statement |
> | Supplier C | 118 | 368.00 | Hold | Price per visit up from 240.00 with no new contract | Operations manager |
> | Supplier D | 552 | 322.00 | Ask | No sign-off that the repair was done | Head baker |
>
> *General practice, not tax or legal advice: check this with local rules and ask a qualified accountant about tax lines.*
