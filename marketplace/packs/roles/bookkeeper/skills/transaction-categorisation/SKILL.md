---
name: transaction-categorisation
description: Sorts a bank, card or expense export into the business's chart of accounts, line by line, with a confidence note for each line, a list of lines that need a receipt or an answer, and a reusable rule table for bank rules. Flags duplicates, forgotten subscriptions, transfers and personal spending. Use it for monthly coding, catch-up clean-ups, receipt chasing and before handing records to an accountant. It suggests categories; it never decides what is tax-deductible.
---

# Transaction categorisation

## When to use

- Each month, before reconciling, to code new bank and card lines.
- A catch-up job: months of uncategorised lines, or everything in one "general expenses" account.
- Receipt chasing: you need to know which lines still need a receipt or a reason.
- Setting up bank rules so next month codes itself, with a person reviewing.

Do not use it to decide whether a cost can be claimed for tax, how VAT, GST or sales tax applies, or whether a payment is business or personal when there is no evidence. Those are the owner's facts and the accountant's decisions. Check this with local rules and ask a qualified accountant.

## What you need

1. The transaction export: date, description, amount, and any existing category.
2. The chart of accounts in use (codes and names). If there is none, run the `chart-of-accounts-setup` skill first.
3. Existing bank rules, if any.
4. Receipts or invoices, or a list of which lines have them.
5. A short description of the business: what it sells, main suppliers, staff, vehicles, home office, and which accounts and cards are business-only.
6. Owner's notes on regular payees and anything personal that went through the business account.

**Access:** level 1 to read the bank feed, chart and rules; level 2 to leave suggested codes on the lines and save new rules as suggest-only; level 3 to code the "sure" lines in the software, within your limits (accounts, months, a value cap per line). "Likely" and "question" lines, new accounts and rules that post on their own wait for a yes.

## Steps

### 1. Clean the list before coding

- Remove nothing silently. Mark lines that are not income or costs:
  - **Transfers** between the owner's own accounts (including savings pots and tax pots).
  - **Card repayments** from the bank account to a business card already coded line by line.
  - **Refunds** that cancel an earlier charge: pair them with the charge.
  - **Loan drawdowns and repayments:** these move a loan balance, and only the interest part is a cost.
- Note duplicates: same amount, date and payee from two sources.

### 2. Group by payee

Clean payee names (strip card numbers, store codes and locations), then group. Most of the work is in the top payees: code each group once, consistently.

### 3. Code each group

For each payee group, pick one account from the chart and write a one-line reason ("monthly design software subscription, Software"). Use the accountant's account names exactly. Rules of thumb:
- One account per kind of cost. Do not invent new accounts mid-job; propose them in the change request.
- Assets that last (equipment, vehicles) go to the asset account the accountant names, not to costs, until the accountant says otherwise. Ask about the threshold; do not set one.
- Owner's personal spending goes to the drawings or director's loan account the accountant names.
- Mixed-use items (phone, car, home office) go to the account the accountant names, with a note. The business share is a question for the accountant, not for me.

### 4. Mark confidence honestly

Each line gets a status:
- **Sure:** clear payee, matches a pattern or receipt.
- **Likely:** payee clear, purpose assumed from the pattern; needs owner confirmation once.
- **Question:** unclear payee, unusual amount, no receipt, or possibly personal. Do not code it; ask.

Lines coded by an AI tool or an existing bank rule count as "likely" until a person has reviewed them. At level 2, leave the codes as suggestions (level 2). At level 3, code the "sure" lines in the software within your limits and log them (level 3).

### 5. Hunt for the usual leaks

- Subscriptions: the same amount each month from the same payee. List them with the monthly cost and the last use if known.
- Double charges: the same amount twice within days.
- Charges after a cancel date the owner gave you.
- Foreign transaction fees and card fees hiding inside purchases.

### 6. Write the rule table

For each payee the business pays regularly: payee text to match, account, tax code to confirm with the accountant, and whether the rule should auto-post or only suggest. Recommend "suggest" for anything not marked sure. Switching a rule to auto-post always needs the owner's yes.

### 7. Build the questions list

One line per question: date, amount, payee, the question, and what evidence would settle it (receipt, invoice, a yes or no). Rank by amount.

## Checks

- Totals in equal totals out: the sum of coded lines plus transfers plus questions equals the export total.
- No line coded "general" or "miscellaneous" without a note.
- Transfers and card repayments are not counted as costs.
- Every new account suggested is in the change request, not in the data.
- Tax codes are left for the accountant to confirm.
- The file carries the line: *Check this with local rules and ask a qualified accountant before you file or claim anything.*

## Output format

1. The coded export: original columns plus account, status (sure, likely, question), reason, receipt yes or no.
2. Summary by account for the period, with line counts.
3. Subscriptions and leaks table.
4. Rule table for bank rules (payee text, account, suggest or auto).
5. Questions list ranked by amount.
6. Change request: new accounts or reclassifications to approve.

## Example of good output (short)

Made-up business for illustration: Fernhill Copy Studio, a sole trader writing for clients.

> | Date | Payee | Amount | Account | Status | Reason | Receipt |
> |---|---|---|---|---|---|---|
> | 03 Oct | Design app subscription | -18.99 | Software | Sure | Same amount monthly since January | Yes |
> | 05 Oct | Transfer to tax savings | -500.00 | Transfer | Sure | Own savings account | n/a |
> | 12 Oct | Supermarket | -64.20 | (not coded) | Question | Could be client meeting supplies or personal | No |
> | 19 Oct | Laptop shop | -1,249.00 | Equipment (asset) | Likely | Owner said new work laptop; asset treatment to confirm with accountant | Yes |
>
> **Leaks found:** two cloud storage subscriptions (9.99 and 11.99 a month) that look like the same service.
>
> **Questions**
> 1. 19 Oct, -1,249.00 laptop: how should this be treated? (for the accountant)
> 2. 12 Oct, -64.20 supermarket: business or personal? (for the owner)
>
> *Check this with local rules and ask a qualified accountant before you file or claim anything.*
