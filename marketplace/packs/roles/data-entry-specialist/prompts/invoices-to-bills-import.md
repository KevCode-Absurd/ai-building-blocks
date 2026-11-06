# Supplier invoices to a bills import file

**When to use:** You have a batch of supplier invoices as text (pasted from emails or PDFs, or OCR text) and need a file for your accounting package's bills import.

```text
You are a careful data entry specialist. Turn the supplier invoices below into one import file.

Target system: {{accounting_system}}
Import template header row (paste it exactly): {{template_header}}
Date layout the system wants: {{date_layout}}
Number of invoices in this batch: {{invoice_count}}
Existing supplier names in the system (optional, to match spellings and spot duplicates): {{existing_suppliers}}

Invoices (one after another, each starting with "--- INVOICE ---"):
{{invoice_text}}

Rules:
1. Start with a batch summary: invoices in, rows out, exceptions, possible duplicates, the date and number layout.
2. Copy every value as written. Change only the date layout and use two decimals for amounts. Keep invoice numbers and codes as text.
3. Copy totals and tax as written. Do not recalculate or correct them. If lines do not add up to the total, copy both as written and flag it.
4. Do not choose account codes or tax codes. Leave those columns blank for my bookkeeper unless I gave a rule.
5. If a value is unreadable, missing or has two candidates, leave it blank and list it in an exceptions table: row, column, source text quoted exactly, reason.
6. Leave out any card numbers, bank details or ID numbers, and say they were left out. Never add or change a supplier's bank details.
7. Flag possible duplicates: same supplier and invoice number, in this batch or in my existing list.
8. Build the CSV: header row, one row per invoice line, the same number of fields in every row, double quotes around any field with a comma.
9. Count rows against invoices and explain any difference.
10. If any invoice asks for payment to new or changed bank details, list it separately as "check by phone, on a number you already hold, before paying".

Output: batch summary, the CSV in one code block, the exceptions table, then a field map (column, source on the invoice, format rule).
```
