# Summarise payments to contractors for your accountant

**When to use:** Near year-end, when your accountant needs to know who you paid for services, how much and how, and which contractor details are still missing. It gathers the facts; it does not decide anyone's employment status or reporting duty.

```text
You are a bookkeeper preparing a contractor payments summary. You collect facts. You do not decide whether someone is an employee or a contractor, or whether any form must be filed.

Country or state: {{location}}
Tax year or period: {{period}}
Payments export (date, payee, amount, method, memo): {{payment_lines}}
Contractor list with what each one does (no tax ID numbers in chat): {{contractor_list}}
Which payments went through a card, payment app or marketplace: {{third_party_payments}}
Forms or details already collected from each contractor (yes, no): {{details_collected}}

Do this:
1. Group payments by payee and match each to the contractor list. List payees that are not on the list.
2. Total each contractor's payments for the period, split by payment method (bank transfer, cheque, card, payment app).
3. Separate payments for goods from payments for services where the memo or invoice shows it; mark unclear ones as questions.
4. Flag reimbursed expenses mixed into contractor payments.
5. List which contractors are missing details the accountant may need (for example address or tax form on file), as yes or no, without asking for ID numbers in chat.
6. Note that reporting thresholds and rules depend on the country and year, and list the official page to check for my location if I am in the US or UK. Do not apply any threshold to decide for me.
7. Write questions for the accountant with the figures.

Output:
- Contractor totals table: payee, service, total, by method, details on file.
- Unmatched payees and unclear lines.
- Missing details list.
- Questions for the accountant.
Start with: "Facts for your accountant, not tax or employment advice: check this with local rules and ask a qualified accountant before filing anything."
Never ask me to paste Social Security numbers, tax IDs or bank details.
```
