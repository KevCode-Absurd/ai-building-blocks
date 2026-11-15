---
name: purchase-order-and-supply-terms
description: "A purchase order and supply terms for one supplier: price and currency, quantity and tolerance, Incoterm with a named place, payment split with Trade Assurance or a letter of credit, quality standard and AQL, golden sample, ship date, late and defect remedies with fixed figures, re-inspection at the supplier's cost, tooling ownership with a tooling schedule, labelling and documents, in English and Chinese, flagged for a lawyer to check before signing. Use before placing a first order, or a repeat order where terms have drifted since the first PO."
---

# Purchase order and supply terms

**You get:** a filled purchase order, a terms schedule (the parts that do not change each order), a tooling schedule, a bilingual copy for a China supplier, and a lawyer check list. The owner signs and pays; this skill drafts.

## When to use

- A sample is approved and the first bulk order is next.
- Repeat orders run on chat messages and nobody can say what the late penalty or defect rule is.
- A mould or custom tool is being paid for.
- The supplier sent its own proforma invoice (PI) and the owner wants to know what is missing.

## Not for

- Negotiating the price and MOQ: use `negotiate-moq-and-price`.
- Protecting the design before sharing it: use `nnn-agreement-for-china-factories`.
- Setting the AQL plan and inspection calls in detail: use `aql-sampling-plan-and-inspection-calls`.
- Legal advice: a lawyer qualified for the supplier's country checks the terms before signing.

## What you need

Required:

1. **Agreed commercial terms**: price per unit, currency, quantity per SKU, Incoterm and place, payment split (from `negotiate-moq-and-price`).
2. **Spec version and golden sample reference** (from `write-product-spec-sheet-for-factory` and `golden-sample-and-defect-list`).
3. **Supplier's legal name, address and bank details as shown in its business licence**, and for Alibaba.com orders, the Trade Assurance order number.
4. **Ship date and land-by date.**

Optional: the supplier's PI, the defect list, the test plan, the forwarder's name.

Wenhao drafts at level 2. The owner signs and pays. Nothing is sent to the supplier as final until the owner says yes, and a lawyer has checked any master agreement.

## Before you start: the gates

1. **Terms agreed in writing.** Pass: price, quantity, Incoterm and payment split are confirmed by email or platform chat. Fail: go back to `negotiate-moq-and-price`.
2. **Spec frozen.** Pass: a spec version and an approved golden sample exist. Fail: no PO; you cannot hold a factory to an open spec.
3. **Pay the right company.** Pass: the bank account name matches the company that signs the PO. Fail: stop. Payments to Hong Kong, personal, broker or related-company accounts raise fraud risk and weaken your claim.

## Steps

### 1. Use a master agreement plus a PO per order

A PO alone is not a full supply contract. Have a lawyer write a master manufacturing agreement once, then change only the exhibits (spec, price, dates) for each order. Until then, attach the terms schedule from this skill to every PO.

### 2. Set the price basis

- Price per unit, currency, and whether the price includes Chinese VAT (含税) or not (不含税).
- **Incoterm 2020 with a named place.** For container goods, buy FCA (named terminal or factory) rather than FOB, which ICC keeps for bulk cargo loaded onto a ship. Avoid EXW across a border: you would load the truck at your risk and handle export clearance. Under DDP the seller clears import in your country, which some countries do not allow foreign firms to do; DAP is the usual alternative. Under CIF the seller insures only at the minimum level (Institute Cargo Clauses C); ask for Clauses A or insure yourself.
- Incoterms do not settle title, payment, documents, faults or disputes. Write those below.
- Price hold until a date, or an index clause from `cost-trigger-rules`.

### 3. Set payment so the balance follows a passed inspection

- Common first-order split: 30% deposit, 70% balance. Push for the balance after a passed inspection or against a copy of the bill of lading, not before shipping. Treat the deposit as at risk.
- Non-custom goods: ask for a 10 to 20% deposit. Better terms usually come after one or two clean orders.
- **Alibaba.com:** run it as a Trade Assurance order and pay only to the bank details Alibaba.com gives at checkout, never to details sent in chat. Refund claims must be made within 30 days of delivery (60 for Enterprise buyers), so inspect on arrival.
- **Orders of about 30,000 dollars or more:** consider a letter of credit, stated from first contact, with an inspection certificate among the required documents.

### 4. Write the quality terms

- Standard: ISO 2859-1, general inspection level II, AQL 0 critical, 2.5 major, 4.0 minor (adjust with Phuong).
- The golden sample, held by the buyer, is the reference; a copy goes to the inspector from the buyer.
- No change to materials, sub-suppliers or process without written approval.
- No subcontracting to another factory without written approval.
- Failed inspection: the supplier sorts or reworks, and pays the re-inspection; the buyer may deduct the fee from the balance with a debit note.

### 5. Write the delivery remedies with fixed figures

Put a fixed figure in, because a fixed sum is easier to enforce than a loss you must prove. For example: 5% of order value per week late, airfreight at the supplier's cost when late past a set date, and the right to cancel and get the deposit back after two weeks late. Chinese courts may cut damages that are more than 30% above the real loss, so keep the figure in proportion. Plan new suppliers with 3 to 4 extra weeks on their quoted lead time, and 2 for a regular one.

### 6. Write the tooling schedule

An invoice saying "mould fee" does not prove you own the mould. List each tool with photo, ID number, location, number of cavities, expected life in shots, ownership plate, and a release deadline with a penalty if the supplier will not hand it over. Pay at least part of the tooling yourself and get ownership in writing.

### 7. Write labelling, packing and documents

Carton marks, labels per the spec, barcodes, country of origin marking. Documents: commercial invoice (description, quantities, unit price and currency, origin, all charges, and any assists such as moulds not in the price), packing list, bill of lading or air waybill, certificate of origin where a preference applies, test reports.

### 8. Make the bilingual copy and the lawyer list

Translate to Simplified Chinese and back-translate every number and remedy (see `bilingual-supplier-messages`). The Chinese usually controls in a Chinese court. Flag for the lawyer: governing law and where disputes are heard, the enforceability of each remedy, the company chop on the Chinese copy, and whether a master agreement is needed.

## Checks before you hand it over

- Price states currency, Incoterm 2020 with named place, and 含税 or 不含税.
- The bank account name matches the signing company.
- The balance is tied to a passed inspection or document, not to a ship date alone.
- AQL, golden sample, no-change and no-subcontracting terms are written.
- Late and defect remedies have fixed figures.
- Each tool has an ID, photo, location and release deadline.
- The Chinese copy is back-translated and the lawyer list is attached.

## Output

**Purchase order:** PO number, date, buyer and supplier legal names, SKUs with quantity, unit price, total, currency, Incoterm and place, ship date, land-by date, payment split and trigger, spec version, golden sample reference, terms schedule reference, signatures.

**Terms schedule:** price basis and hold, payment, quality standard and AQL, change control, subcontracting, inspection and re-inspection cost, late remedies, defect remedies, tooling, labelling and documents, communication record.

**Tooling schedule:**

| Tool | ID | Photo | Location | Cavities | Life in shots | Paid by | Owner | Release deadline | Penalty |
|---|---|---|---|---|---|---|---|---|---|

**Lawyer check list** and the **bilingual copy**.

## Common mistakes

- **Using FOB for container goods.** Step 2 uses FCA.
- **Paying the balance on a ship date.** Step 3 ties it to inspection or the bill of lading.
- **Wiring to details sent in chat.** Step 3 pays only Alibaba.com's checkout details.
- **Penalties with no number.** Step 5 fixes the figure.
- **Thinking the mould fee bought the mould.** Step 6 writes ownership down.
- **Signing the English only.** Step 8 checks the Chinese.

## Sources

- COG-0006: pay the balance after a passed pre-shipment inspection.
- COG-0008: production plus sea lead times.
- COG-0013: continued supply and best-price terms with a sole supplier.
- COG-6265: Alibaba.com protection only on platform-paid orders.
- ICC Academy, Incoterms 2020: FCA or FOB?: https://academy.iccwbo.org/incoterms/article/incoterms-2020-fca-or-fob/
- ICC Academy, Incoterms 2020: EXW or FCA?: https://academy.iccwbo.org/incoterms/article/incoterms-2020-exw-or-fca/
- ICC Academy, Incoterms 2020: EXW or DDP?: https://academy.iccwbo.org/incoterms/article/incoterms-2020-exw-or-ddp/
- ICC, Differences between Incoterms 2010 and 2020: https://library.iccwbo.org/clp/clp-incoterms-2020vs2010.htm
- International Trade Administration, Know Your Incoterms: https://www.trade.gov/know-your-incoterms
- International Trade Administration, Methods of Payment: https://www.trade.gov/index.php/methods-payment
- QualityInspection.org, T/T Payment Terms with China Factories: https://qualityinspection.org/payment-terms-chinese-manufacturer/
- QualityInspection.org, Is It Possible To Get Credit from a Chinese Supplier?: https://qualityinspection.org/payment-credit-chinese-factory/
- QualityInspection.org, How to get a Chinese supplier to accept a letter of credit: https://qualityinspection.org/china-supplier-lc/
- QualityInspection.org, Imposing fines on Chinese suppliers: https://qualityinspection.org/penalties-chinese-suppliers/
- QualityInspection.org, Sourcing from China 101, Part 5 and Part 6: https://qualityinspection.org/negotiations_terms_china/
- Harris Sliwoski, China Manufacturing Contracts and payment terms: https://harris-sliwoski.com/chinalawblog/china-manufacturing-and-the-huge-impact-of-payment-terms/
- Harris Sliwoski, Who Owns Your Molds?: https://harris-sliwoski.com/chinalawblog/who-owns-your-molds-how-overseas-factories-hold-tooling-hostage-and-how-to-stop-them/
- Harris Sliwoski, China Contract Damages: https://harris-sliwoski.com/chinalawblog/china-contract-damages-done-right/
- Alibaba.com Trade Assurance, Money-back policy: https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm
- eCFR, 19 CFR 141.86 Contents of invoices: https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-F/section-141.86

What makes this skill ours: the balance follows a passed inspection, not a ship date; the Incoterm is chosen for container goods with a named place; remedies have fixed figures a court can enforce; moulds are owned on paper with IDs and a release date; and the Chinese copy is checked because it is the one that counts.
