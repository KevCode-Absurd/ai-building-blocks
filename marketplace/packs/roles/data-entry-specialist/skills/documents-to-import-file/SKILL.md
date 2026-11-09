---
name: documents-to-import-file
description: Turns pasted invoices, receipts, forms, business cards, order emails or OCR text into one import-ready CSV in the client's columns and formats, with a batch summary, an exceptions list quoting the source text for every blank or doubtful value, and a row count matched to the documents. Copies values as written, changes only agreed formats, never guesses or recalculates, and leaves card, bank and ID numbers out. Works at access level 1 from pasted text; builds the file in a copy at level 2; adds rows to a live sheet or system at level 3 within the batch limits set. Use for a backlog of paper or PDF records, trade-show cards, or supplier invoices before a bulk import.
---

# Documents to import file

## When to use

- A pile of invoices, receipts, forms, cards or order emails needs to become rows in a spreadsheet, CRM, accounting package or shop.
- OCR or a scanner app has produced text that now needs to be structured and checked.
- Someone typed records by hand and the file keeps failing to import.

Not for: choosing account or tax codes (bookkeeper), deciding which of two conflicting figures is true (the client), or reading handwriting nobody has typed or confirmed.

## What you need

1. The target columns: ideally the header row of the system's import template, downloaded fresh from the client's account.
2. The format the system wants for dates, numbers, phone numbers and currency, and the country the documents come from.
3. The documents, as pasted text or OCR text, one after another, with a count of how many there are.
4. Which fields must never be blank and which may stay empty.
5. Whether totals are copied as written (the default) or checked against line items.
6. Access: level 1 to read and return the file in chat; level 2 to build it in a copy or new tab; level 3 to add the rows to the live sheet or system within the batch limit set. A bulk import into existing records, or any overwrite, needs a backup and a fresh yes even at level 3.

## Steps

### 1. Write a rule for every column

Before reading any document, make a field map: column name, where the value comes from on the document, the format rule, required or optional. Example: "InvoiceDate: the date labelled Invoice date or Date; DD/MM/YYYY; required." Write the date and number layouts on the first line of the output so nobody has to guess later.

### 2. Read one document at a time

Note each supplier's or form's layout the first time you meet it ("Supplier A puts the invoice number top right, labelled Ref"). Use the same reading for every document from that source.

### 3. Copy each value exactly

- Copy names, references and amounts as written, including the source's own spelling.
- Change only the agreed format: date layout, phone layout, two decimal places.
- Keep codes, postcodes, phone numbers and IDs as text so leading zeros and long digits survive; Excel keeps only 15 significant digits.
- Strip extra spaces, including non-breaking spaces from web or PDF text, which ordinary trim tools miss.

### 4. Handle doubt with a blank and an exception

If a value is unreadable, missing, has two candidates, or is handwritten and unconfirmed, leave the cell blank and add an exception: row, column, source text quoted exactly, reason. Never fill a gap so the import "works".

### 5. Do not calculate unless asked

Copy totals, tax and discounts as written. If the client asked for checks, show the sum ("lines 12.50 + 8.00 = 20.50; invoice total 21.50; flagged") and still copy the document's figure.

### 6. Leave sensitive numbers out

Card numbers, bank details and ID numbers are not copied unless they are an approved required field in a system built to hold them. Note "card number present, left out" in the batch summary.

### 7. Check for duplicates

Within the batch and against an export of existing records if you have one: the same invoice number and supplier; the same email; the same name and phone. Flag, do not delete.

### 8. Build the CSV

A header row, one record per row, the same number of fields in every row, double quotes around any field with a comma, quote or line break, and a quote inside a field written twice. Save as UTF-8 unless the system says otherwise.

### 9. Count and match

Documents in, rows out, lines per document. If the counts differ, explain each difference (an invoice with three lines gives three rows).

### 10. Load (level 3 only)

Within the agreed batch: take a backup export of the target, load new rows, then count rows before and after and log the result. Updates to existing records, overwrites and deletions wait for a fresh yes on that batch.

## Checks

- Documents in, rows out and the reason for any difference are written at the top.
- Every column follows its rule; the format line is above the file.
- Every row has the same field count; quoting is correct.
- Code and ID columns keep leading zeros and full length.
- Every blank cell in a required column has an exception.
- Every exception quotes the source text.
- No value was guessed, recalculated or "corrected".
- No card, bank or ID numbers appear.
- Duplicates are flagged with the rule that found them.
- At level 3, a backup was taken and the before and after counts are logged.

## Output format

1. **Batch summary:** documents in, rows out, exceptions, possible duplicates, sensitive data left out, format line.
2. **The file:** the CSV in one code block (or the sheet or draft records at level 2 or 3).
3. **Exceptions table:** row, column, source text, reason, question for the client.
4. **Field map:** column, source, rule, required.
5. **Notes for next time:** layouts learned, rules to add to the rules sheet.

## Example of good output (short)

*Illustrative structure, not a real business: a cafe with 6 supplier invoices for a bills import. Copy the shape, never the content: every fact comes from the client's own context.*

> **Batch:** 6 invoices in, 8 rows out (invoice 4 has three lines). 2 exceptions. 1 possible duplicate. Dates DD/MM/YYYY; amounts as written, two decimals; no card or bank numbers present.
>
> ```csv
> ContactName,InvoiceNumber,InvoiceDate,DueDate,Description,Quantity,UnitAmount
> Supplier A,A-0412,03/11/2026,17/11/2026,Whole milk 2L,24,1.15
> "Supplier B, Bakers",B-1180,04/11/2026,,Sourdough loaves,30,2.40
> ```
>
> | Row | Column | Source text | Reason |
> |---|---|---|---|
> | 2 | DueDate | "Terms: 14 days EOM" | Due date depends on a rule; please confirm the date |
> | 6 | UnitAmount | "3.?0" | Middle digit unreadable in scan |
>
> Possible duplicate: rows 5 and 7, same supplier and invoice number A-0415. Both kept; please confirm.
