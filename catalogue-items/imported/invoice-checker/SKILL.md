---
name: invoice-processing
description: Extract, validate, and categorize invoice data against purchase orders and GL codes. Use when the user requests invoice processing or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# Invoice Processing

Extract structured data from invoices, validate fields against purchase orders and vendor records, categorize line items by general ledger (GL) codes, and flag discrepancies for review. This skill handles both single invoice processing and batch operations, producing clean, auditable output ready for import into accounting systems.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Receive and Parse Invoice**
   Accept invoice data in any format — raw text, OCR output, structured JSON, or CSV. Identify the document type (standard invoice, credit memo, debit note, proforma) and extract the header block: invoice number, date, due date, vendor name, vendor address, and payment terms.

2. **Extract Line Items and Totals**
   Parse each line item for description, quantity, unit price, extended amount, and tax. Validate that line item totals sum to the stated subtotal. Extract tax amounts, shipping charges, discounts, and the grand total. Flag any arithmetic inconsistencies between line items and totals.

3. **Validate Against Purchase Order**
   Match the invoice to its corresponding PO by PO number, vendor, or line item descriptions. Compare quantities and unit prices. Compute a three-way match score across PO, goods receipt, and invoice. If no goods receipt data was given, skip the three-way match and say so. Flag invoices where price variance exceeds a configurable threshold (default: 2%) or quantities don't match.

4. **Categorize by GL Code**
   Assign each line item to the appropriate general ledger account based on item description, vendor category, and historical patterns. Use the person's own chart of accounts for the codes. Example mappings only (placeholders, replace with your own): office supplies → 6200, software subscriptions → 6500, professional services → 6300, raw materials → 5100. If no code list was given, label every code and cost center "suggested, confirm". Apply department cost center codes where applicable.

5. **Flag Discrepancies and Generate Output**
   Produce a structured record for each invoice with all extracted fields, validation status, GL assignments, and any flags. Group flags by severity: blocking errors (missing PO, total mismatch > 5%), warnings (minor price variance, missing fields), and informational (new vendor, first invoice from vendor).

6. **Generate Processing Summary**
   For batch operations, produce a summary report showing total invoices processed, pass/fail counts, total dollar value, and a breakdown of flag types. List all blocked invoices requiring manual review with specific reasons.

## Usage

Provide invoice data as text, structured data, or describe the invoices you need processed. Specify any PO data for validation and your GL code mapping preferences.

**Example prompt:**
> Process this vendor invoice: Invoice #[INVOICE NUMBER] from [VENDOR NAME], dated [DATE], PO #[PO NUMBER]. Line items: [QTY] x [ITEM] at [UNIT PRICE] each, [QTY] x [ITEM] at [UNIT PRICE]. Tax [TAX RATE]. Validate against PO and assign GL codes.

## Examples

All names, numbers and codes below are placeholders. Replace them with your own. Never keep them in a real record.

### Example 1: Single Invoice Processing (no goods receipt given)

**Input:**
```
Invoice #[INVOICE NUMBER]
Vendor: [VENDOR NAME] (Vendor ID: [VENDOR ID])
Date: [DATE] | Due: [DUE DATE] | Terms: [PAYMENT TERMS]
PO Reference: [PO NUMBER]

Line Items:
  1. [ITEM 1] (qty: [QTY 1], unit: [UNIT PRICE 1]) — [LINE AMOUNT 1]
  2. [ITEM 2] (qty: [QTY 2], unit: [UNIT PRICE 2]) — [LINE AMOUNT 2]

Subtotal: [SUBTOTAL]
Tax ([TAX RATE]): [TAX AMOUNT]
Total: [TOTAL]
```

**Output:**
```json
{
  "invoice_number": "[INVOICE NUMBER]",
  "vendor": { "name": "[VENDOR NAME]", "id": "[VENDOR ID]" },
  "date": "[DATE]",
  "due_date": "[DUE DATE]",
  "po_reference": "[PO NUMBER]",
  "line_items": [
    {
      "description": "[ITEM 1]",
      "quantity": "[QTY 1]",
      "unit_price": "[UNIT PRICE 1]",
      "amount": "[LINE AMOUNT 1]",
      "gl_code": "[SUGGESTED CODE, confirm]",
      "gl_name": "[ACCOUNT NAME]",
      "cost_center": "[SUGGESTED COST CENTER, confirm]"
    },
    {
      "description": "[ITEM 2]",
      "quantity": "[QTY 2]",
      "unit_price": "[UNIT PRICE 2]",
      "amount": "[LINE AMOUNT 2]",
      "gl_code": "[SUGGESTED CODE, confirm]",
      "gl_name": "[ACCOUNT NAME]",
      "cost_center": "[SUGGESTED COST CENTER, confirm]"
    }
  ],
  "subtotal": "[SUBTOTAL]",
  "tax": "[TAX AMOUNT]",
  "total": "[TOTAL]",
  "validation": {
    "arithmetic_check": "PASS or FAIL, from your own recalculation",
    "po_match": "PASS or FAIL",
    "price_variance": "[PERCENT]",
    "three_way_match": "SKIPPED (no goods receipt data given)"
  },
  "flags": []
}
```

### Example 2: Batch Processing with Validation Errors

**Input:** [NUMBER] invoices from different vendors processed in batch.

**Output — Error Report:**

| Invoice #            | Vendor        | Amount     | Status  | Flags                                              |
|----------------------|---------------|------------|---------|----------------------------------------------------|
| [INVOICE NUMBER 1]   | [VENDOR 1]    | [AMOUNT 1] | PASS    | —                                                  |
| [INVOICE NUMBER 2]   | [VENDOR 2]    | [AMOUNT 2] | WARNING | Unit price [INVOICE PRICE] vs PO price [PO PRICE] ([VARIANCE %]) |
| [INVOICE NUMBER 3]   | [VENDOR 3]    | [AMOUNT 3] | BLOCKED | No matching PO found                               |
| [INVOICE NUMBER 4]   | [VENDOR 4]    | [AMOUNT 4] | BLOCKED | Line item total [LINE TOTAL] ≠ stated subtotal [SUBTOTAL] |

**Batch Summary:**
- **Total Processed:** [COUNT]
- **Passed:** [COUNT] ([SHARE]) — [VALUE]
- **Warnings:** [COUNT] ([SHARE]) — [VALUE]
- **Blocked:** [COUNT] ([SHARE]) — [VALUE]
- **Total Value:** [TOTAL VALUE]
- **Action Required:** [COUNT] invoices require manual review before payment authorization.

## Best Practices

- Always verify arithmetic independently — never trust the stated totals without recalculating from line items.
- Maintain a vendor-to-GL mapping table and update it as new vendors or expense types appear.
- Set price variance thresholds appropriate to your industry: 2% for commodities, up to 10% for services with variable scope.
- Require PO matching for all invoices above a configurable dollar threshold to prevent unauthorized spending.
- Retain the raw invoice data alongside extracted fields for audit trail purposes.
- Process invoices in batch during off-peak hours and route exceptions to AP staff immediately.

## Safety Boundaries

- Treat the output as analytical support, not individualized financial, tax, investment, or accounting advice.
- Preserve source data and expose assumptions, formulas, units, and reconciliation checks so a reviewer can reproduce the result.
- Do not initiate payments, transactions, journal entries, filings, or account changes without explicit user authorization.
- Require a qualified professional to review material decisions, regulated filings, or conclusions based on incomplete data.

## Edge Cases

- **Invoices with no PO reference:** Flag as requiring manual approval. Check if the vendor has a blanket PO or standing agreement that covers the charges.
- **Credit memos and negative amounts:** Process as negative invoice entries. Validate that the credit references an existing invoice and that the credit amount doesn't exceed the original.
- **Multi-currency invoices:** Extract the stated currency, apply the exchange rate as of invoice date, and record both the original and converted amounts.
- **Duplicate invoice detection:** This check only works if the user has pasted the last 90 days of invoice records into the chat. If they have not, say "duplicate check not done: no earlier records were given". Never say "no duplicates found" without records. If they have, check invoice number + vendor + amount + date against those records. Flag exact matches as likely duplicates and near-matches (same vendor + amount, different invoice number) as potential duplicates.
- **Partial shipments:** When goods receipt quantity is less than PO quantity, validate the invoice against received quantity, not PO quantity. Hold remaining balance as open.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Invoice totals checker](https://useaiblocks.com/skills/invoice-totals-checker). It takes the spreadsheet.
- The [Journal entry preparer](https://useaiblocks.com/skills/journal-entry-preparer). It takes the spreadsheet.
- The [Contractor invoice and terms reviewer](https://useaiblocks.com/skills/monthly-contractor-roster-keeper). It takes the spreadsheet.
- The [Budget variance explainer](https://useaiblocks.com/skills/budget-variance-explainer). It takes the spreadsheet.
- The [Freelancer transaction and cash review](https://useaiblocks.com/skills/monthly-freelancer-books-closer). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
