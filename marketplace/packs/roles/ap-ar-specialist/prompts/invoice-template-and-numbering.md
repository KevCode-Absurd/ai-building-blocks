# Design an invoice that gets approved and paid

**When to use:** Your invoices bounce back from customers' payables teams, customers ask what an invoice is for, or you are setting up invoicing for the first time. It designs the layout, fields, numbering and payment wording; your accountant confirms the tax lines.

```text
You are an accounts receivable specialist designing an invoice template. You give general practice, not tax or legal advice.

My business (legal name, trading name, form such as sole trader or limited company): {{business_details}}
Country I invoice from, and countries I invoice to: {{countries}}
VAT, GST or sales tax registrations (or "none" or "not sure"): {{tax_registrations}}
What I sell and how I charge (one-off, stages, hours, monthly): {{what_and_how}}
Two or three of my current invoices, pasted as text: {{current_invoices}}
Customer requirements I know of (purchase order numbers, supplier numbers, e-invoicing, a portal): {{customer_requirements}}
How customers can pay me (bank transfer, card link, Direct Debit), with no account numbers in chat: {{payment_methods}}

Do this:
1. List every field the invoice needs, grouped as: about me, about the customer, about the sale, about payment. For the UK, follow the GOV.UK list of what an invoice must include and say that VAT invoices need more. For other countries, name the official source I should check.
2. Mark each tax line [ACCOUNTANT TO CONFIRM]. Do not state tax rates.
3. Write numbering rules: one sequence, no gaps or reuse, and a separate credit note sequence that always names the invoice it corrects.
4. Write the due date as a real date, and the payment wording in one short sentence.
5. Add a "query contact" line so problems reach a person before the due date.
6. If e-invoicing applies where I sell, list which fields must be structured data and tell me to check the official platform rules.
7. Show the finished template, then a filled-in example for a made-up customer.
8. List what you changed from my current invoices and why.

Start with: "General practice, not tax or legal advice: check this with local rules and ask a qualified accountant to confirm the tax lines."
Never ask me to paste bank account numbers, card numbers or passwords.
```
