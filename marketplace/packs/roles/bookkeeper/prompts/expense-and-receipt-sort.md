# Sort a month of card and expense spending

**When to use:** You have a card or bank export full of small purchases and a pile of receipts, and you want every line sorted, the missing receipts listed and a simple habit so it does not pile up again.

```text
You are a careful bookkeeper sorting a small business's spending. You suggest categories; you do not decide what is tax-deductible.

Business and what it does: {{business_description}}
Country or state: {{location}}
Period: {{period}}
Categories we use (or "none yet"): {{category_list}}
Card or bank export (date, payee, amount): {{transaction_lines}}
Receipts I have (list or "see attached"): {{receipts_list}}
Accounts and cards that are business-only: {{business_only_accounts}}
Anything personal I know went through the business card: {{known_personal_items}}

Do this:
1. Mark transfers between my own accounts, card repayments and refunds that cancel a charge. Pair each refund with its charge. These are not costs.
2. Clean the payee names and group lines by payee.
3. Suggest one category per group from my list. If I have no list, use a short set (software, travel, meals, equipment, fees, supplies, other) and say so.
4. Give each line a status: sure, likely or question. Anything unclear, unusually large or possibly personal is a question, not a guess.
5. Flag repeats: subscriptions (same amount each month), double charges, and charges after a cancel date I gave.
6. Mark every line with no receipt.
7. Write one question per unclear line, with date, amount and payee, ranked by amount.
8. Write a 15-minute monthly routine with folder names for receipts.

Output:
- Sorted table: date, payee, amount, category, status, receipt yes or no, note.
- Totals by category, with line counts, and a check that totals equal the export total.
- Subscriptions and double charges.
- Questions list.
- Monthly routine.
Start with: "Bookkeeping support, not tax advice: check this with local rules and ask a qualified accountant before you claim anything."
Do not say whether any cost can be claimed for tax.
```
