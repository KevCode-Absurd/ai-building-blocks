---
name: bulk-order-quote-and-invoice
description: "A working quote, proforma and tax invoice process for bulk and wholesale orders: three filled templates, a numbering rule, the steps from enquiry to paid with a margin floor and stock check, payment terms and a collections schedule, GST tax invoice, e-invoice and e-way bill steps for India and sales tax and resale certificate steps for the US. Keeps stock and reports right by running bulk orders through the store, and protects buyers and the store from changed-bank-details fraud. Use when bulk, corporate or wholesale enquiries arrive and are handled by email and guesswork."
---

# Bulk order quote and invoice

**You get:** three ready templates (quote, proforma, tax invoice) with the store's details filled, a document numbering rule, a one-page process from enquiry to cash received with owners and timings, and a collections schedule, all approved by the client and the store's accountant before first use.

## When to use

- Bulk enquiries (corporate, institutions, resellers) arrive and each quote is made from scratch.
- A business buyer asked for a proforma or a GST invoice and the store does not know what goes on it.
- Shopify's own invoices are not accepted by business buyers.
- Wholesale customers pay late and nobody tracks who owes what.

## Not for

- Setting the wholesale price list and terms: use `build-wholesale-price-list-and-terms`.
- The store's tax settings and registrations: use `set-up-taxes-gst-and-us-sales-tax`.
- Designing corporate gift boxes and the pitch: use `corporate-gifting-sales-pitch`.
- Monthly payout matching for online sales: use `reconcile-payouts-and-payment-fees`.

## What you need

Required:

1. **Legal and tax details**: legal name, address, GSTIN and state code (India) or EIN and states where the store collects sales tax (US), Udyam number if registered.
2. **Price list** with delivered cost per SKU from `build-wholesale-price-list-and-terms`.
3. **HSN codes and GST rates** per SKU (India), confirmed by the store's chartered accountant.
4. **Stock on hand** and lead time for top-ups.
5. **Freight quotes** for typical bulk shipments.
6. **Accounting or invoicing tool** in use, or none.

Optional: past bulk orders and how they were paid, the store's logo and signature block.

If HSN codes or rates are not confirmed, mark every tax field "to confirm" and do not send a tax invoice until the accountant signs off. Building templates needs no access. Creating draft orders in Shopify needs draft access (level 2). Sending a quote is a binding offer, so each one needs the client's fresh yes. The store's bank details are entered by the client from their own records, never typed by the agent.

## Before you start: the gates

1. **Margin floor.** Pass when every quote line shows gross profit after delivered cost, packing, freight and payment cost [MEA-0037], and the order total is above the floor set in the price list. Fail: requote or decline.
2. **Stock and date.** Pass when stock is reserved or a top-up arrives before the promised dispatch date.
3. **Cash.** Pass when credit given fits the cash forecast; growth funded by unpaid invoices stalls the store [FIN-0011].
4. **Tax set-up.** India: Shopify does not create GST-compliant invoices, so invoices come from an accounting tool, a GST invoicing app or the template here [FIN-6205]. US: the store collects sales tax where it has nexus [FIN-6206].

## Steps

### 1. Qualify the enquiry

Capture in one reply: company, contact, GSTIN or tax ID, SKUs and quantities, customisation, delivery address or addresses, required date, and how they pay. Reply within one working day (practitioner default).

### 2. Price and check

- Unit price from the price list band for that quantity; custom work and packing as separate lines; freight as its own line.
- Gross profit per line and for the order. Below floor: change the band, the freight terms or decline.
- Reserve stock in the sheet or as a draft order.

### 3. Send the quote

The quote is a commercial offer, not a tax document. Fields: quote number, date, valid until (practitioner default 15 days), buyer details, lines with HSN (India), unit price before tax, tax rate and amount shown separately, freight, total, delivery date counted from payment or artwork approval, payment terms, cancellation rule. The client approves each quote before it goes.

### 4. Issue the proforma on acceptance

Many buyers need a proforma to raise their purchase order or release payment. It carries the same lines as the quote plus payment instructions. A proforma is not a tax invoice; the buyer cannot claim tax credit on it [FIN-6380].

Payment instructions come from the client. Add one line to every proforma and quote: "Our bank details will never change by email. Call us on [number] before paying to any new account." Changed-bank-details fraud targets exactly this step.

### 5. Collect the advance

- New buyers: practitioner default 50 to 100% advance; repeat buyers with a clean record: agreed net terms.
- India: NEFT, RTGS or UPI. When an advance is received, issue a receipt voucher; GST is not payable on an advance for goods, only for services [FIN-6380]. If the store is a Udyam-registered micro or small enterprise, buyers must pay within 45 days of accepting goods [FIN-6382].
- US: ACH or wire for large orders; card adds the processor fee, so set who bears it in the quote.
- Mark the draft order paid only when money is in the bank, not when a payment screenshot arrives.

### 6. Raise the tax invoice at dispatch

**India**

- Issue the tax invoice before or at the time the goods leave [FIN-6380].
- Fields: supplier name, address, GSTIN; serial number unique for the financial year; date; buyer name, address and GSTIN; HSN; description; quantity and unit; taxable value after discount; CGST and SGST for same-state, IGST for other-state buyers; place of supply with state name; delivery address if different; reverse charge yes or no; signature (not needed on an electronic invoice) [FIN-6380].
- Three copies for goods: original for recipient, duplicate for transporter, triplicate for supplier [FIN-6380].
- E-invoice: if aggregate turnover is above Rs 5 crore, generate the IRN and QR code on the government portal before the invoice is valid; at Rs 10 crore and above, report within 30 days of the invoice date [FIN-6381].
- E-way bill: needed when the consignment value crosses the rule 138 limit (Rs 50,000 in most cases); the accountant confirms the state's rules.

**US**

- Invoice with buyer, lines, sales tax by state where the store has nexus [FIN-6206], payment terms and due date.
- A buyer reselling the goods may give a resale or exemption certificate; keep a copy on file before dropping the tax. No certificate, charge the tax.

### 7. Number everything

One series per document per financial year, for example `Q/2026-27/0001` for quotes, `PI/2026-27/0001` for proformas, `INV-B2B/2026-27/0001` for tax invoices, `CN/2026-27/0001` for credit notes. Never reuse or skip a tax invoice number.

### 8. Handle returns and changes

Damaged or returned goods after invoicing: a credit note that names the original invoice number and date [FIN-6380]. Price changes after the invoice: credit or debit note, never an edited invoice.

### 9. Collect what is owed

- Reminder 3 days before due, on the due date, 7 days after, 15 days after.
- At 15 days overdue: hold further dispatches to that buyer; the client decides next steps.
- India: an MSME supplier can file a delayed payment claim on the MSME ODR portal [FIN-6382].
- Track wholesale receivables separately from marketplace and card payouts so a slow buyer is visible.

### 10. Keep stock and reports in one place

Create each bulk order as a Shopify draft order (custom prices and payment due dates are allowed) or record it in the inventory tool the same day, so online stock stays right.

## Checks before you hand it over

- Quote, proforma and invoice templates exist and use the numbering rule.
- Every quote line shows tax separately and the order passes the margin floor.
- The proforma says it is not a tax invoice and carries the bank-change warning.
- India invoice template has every rule 46 field, the copy markings, and the e-invoice step where turnover requires it.
- US invoices handle nexus states and resale certificates.
- The collections schedule and the hold-dispatch rule are written down.
- Bank details are left for the client to enter.
- The accountant has confirmed HSN codes and rates, or they are marked "to confirm".

## Output

1. **One-screen summary:** the process in 10 lines, numbering rule, payment terms, who approves what, and items "to confirm" with the accountant.
2. **Quote template:** Quote no., Date, Valid until, Buyer, GSTIN or tax ID, Line items (SKU, Description, HSN, Qty, Unit price, Tax rate, Tax amount, Line total), Custom and packing, Freight, Total, Delivery date basis, Payment terms, Cancellation, Bank-change warning.
3. **Proforma template:** as the quote plus PO reference, payment instructions (client fills), "Not a tax invoice".
4. **Tax invoice template (India):** every field in step 6, copy marking, IRN and QR space, e-way bill number. **US invoice template:** Seller, Buyer, Lines, Sales tax by state, Resale certificate on file (yes or no), Terms, Due date.
5. **Receivables tracker:** Invoice no., Buyer, Amount, Due date, Days overdue, Reminders sent, Status, Next action.
6. **Process sheet** with steps 1 to 10, owner and time limit for each.

## Common mistakes

- **Treating a proforma as a tax invoice.** Step 4 marks it clearly [FIN-6380].
- **Invoicing from Shopify for B2B in India.** Gate 4 routes invoices to a GST-compliant tool [FIN-6205].
- **Quotes without a margin check.** Step 2 checks every line [MEA-0037].
- **Paying out on a screenshot.** Step 5 waits for money in the bank.
- **Edited invoices.** Step 8 uses credit and debit notes.
- **No follow-up on overdue invoices.** Step 9 sets reminders and a dispatch hold [FIN-0011].

## Sources

- FIN-6380: India GST tax invoice fields, timing, copies, receipt vouchers, credit notes.
- FIN-6381: India e-invoicing threshold and 30-day reporting.
- FIN-6382: India MSMED Act 45-day payment and ODR claims.
- FIN-6205: Shopify does not create GST-compliant invoices.
- FIN-6206: US sales tax nexus.
- MEA-0037: price on delivered cost.
- FIN-0011: unpaid invoices stretch the cash cycle.

What makes this skill ours: one numbered document chain from quote to credit note that matches GST rule 46 field by field; e-invoice and e-way bill steps tied to the store's turnover; a bank-change fraud warning on every payment document; and bulk orders kept in the store's own stock records so the website never oversells.
