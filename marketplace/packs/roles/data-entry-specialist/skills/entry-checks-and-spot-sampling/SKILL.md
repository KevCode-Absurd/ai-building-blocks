---
name: entry-checks-and-spot-sampling
description: Proves an entered batch matches its source documents before anyone imports or relies on it. Picks the right check for each field (count check, control totals, read-back, independent double entry for amounts, dates and references that trigger payments or deadlines, OCR-versus-image comparison for scans), draws a random spot-check sample, records errors by type, and gives an accept or recheck call for the batch with an error log and the source fix. Works at access level 1 on files and documents shared; at level 2 it marks rows in a copy; it changes live records only at level 3 within agreed limits, and bulk corrections need a backup and a fresh yes. Use after any data entry or OCR batch, before an import, or when a team's error rate needs measuring.
---

# Entry checks and spot sampling

## When to use

- A batch has been keyed or OCR'd and is about to be imported or used.
- OCR or a document AI tool produced the data and nobody has compared it with the images.
- The client wants to know how accurate their team's or a supplier's data entry is.
- An error was found downstream and the client wants to know how far it spreads.

## What you need

1. The entered file and the source documents (text, PDFs or images) with an ID that links each row to its document.
2. Any independent totals: a supplier statement, a batch slip, a bank export, a till report.
3. Which fields matter most (amounts, dates, references, account or customer IDs) and what an error costs in each.
4. The client's acceptable error limit for the batch, in their own words. If they have none, I report what I find and they set one.
5. Access: level 1 to check and report; level 2 to mark rows in a copy; level 3 to correct individual live records within agreed limits. Bulk corrections need a backup and a fresh yes.

## Steps

### 1. Choose checks by field risk

| Field type | Check |
|---|---|
| Every batch | Count check: documents in, rows out, lines per document |
| Money totals | Control total against an independent figure, arithmetic shown |
| Amounts, dates and references that trigger a payment or a deadline | Independent double entry or full read-back |
| Names, addresses, descriptions | Spot-check sample |
| Coded fields (status, category, country) | Allowed-value check against the system's list |
| OCR output from scans | Compare against the image: every handwritten value, plus a sample of printed ones |

Double entry means a second, independent pass of the chosen fields without looking at the first, then a field-by-field comparison; every difference is checked against the source. In a 2012 study of structured forms, double key entry made far fewer errors than single entry, and a 2020 follow-up found character recognition of handwritten numbers much worse than keying. Those were clinical forms; use them as direction, not as a target rate.

### 2. Run the count check and control totals

Write: "38 documents, 41 rows, 3 multi-line invoices: matches." Sum the amounts in the file and compare with the independent figure. A difference is investigated row by row before any sample is drawn.

### 3. Draw the spot-check sample

- Number the rows and pick a random sample (use the spreadsheet's random number function, sort by it, take the top rows). Write the sample size and how it was drawn.
- Include every row already flagged as odd (exceptions, outliers, handwritten values) in addition to the random sample, and report them separately so they do not distort the random result.
- Compare every field of every sampled row against its source document.

A spot check decides whether to release or recheck this batch. It does not measure the team's long-run quality, and it is no substitute for fixing the process that produced the errors.

### 4. Record each error

| Row | Field | Entered | Source says | Error type | Likely cause |
|---|---|---|---|---|---|

Error types: transposed digits, wrong field, omitted, extra, format (date order, lost zero, scientific notation), OCR misread (0/O, 1/l, 5/S, 8/B), guessed value, duplicate.

### 5. Make the call

- **Accept:** no errors in the sample beyond the client's limit, counts and totals match.
- **Recheck:** errors above the limit, or any error in a high-risk field. Recheck the whole batch, not just the sampled rows.
- **Stop:** counts or totals do not match and the cause is unknown.

### 6. Fix the source, not just the rows

Group errors by cause and propose one change for each: a validation rule that blocks bad dates, a text-typed column, a clearer rule on the rules sheet, a better scan setting (at least 300 dpi for Tesseract), or double entry on one field. Prefer hard stops over warnings for fields that must never be wrong.

### 7. Correct (level 3 only)

Correct individual live records within the agreed limit, logging old value, new value, source and time. A bulk correction waits for a backup export, the row count, a sample and a fresh yes.

## Checks

- Count check and control totals done before sampling.
- Sample size, method and seed or order recorded.
- Flagged rows reported apart from the random sample.
- Every sampled field compared to the source, not to another copy.
- Every error has a type and a likely cause.
- The call (accept, recheck, stop) follows the client's limit, stated in their words.
- At least one source fix proposed for each error cause.
- Corrections logged; no bulk change without a backup and a fresh yes.

## Output format

1. **Batch check summary:** counts, control totals, sample size and method, errors found, the call.
2. **Error log** table.
3. **Errors by cause**, with one source fix each.
4. **Correction log** (level 3).

## Example of good output (short)

*Made-up business for illustration: "Pembury Physio", 120 paper intake forms keyed by two temps.*

> Counts: 120 forms, 120 rows: match. No money fields.
> Sample: 20 random rows (random number column, sorted, top 20) plus 7 rows with handwritten dates.
> Random sample: 3 errors in 20 rows x 14 fields (2 transposed phone digits, 1 date entered MM/DD).
> Handwritten dates: 2 of 7 unreadable; sent to the clinic as exceptions.
> Your limit: "no wrong phone numbers". **Call: recheck** the phone column on all 120 rows by double entry.
> Source fixes: phone column set to text with an 11-character rule; date column set to reject anything not DD/MM/YYYY.
