---
name: order-samples-and-quality-check
description: "A sample order plan for the shortlisted suppliers and a quality checklist that turns 'looks fine' into pass or fail: what to order from whom, the sample stages, the tests to run at home, the defect list sorted into critical, major and minor, the approve or reject rule, the golden sample, and the pre-shipment inspection brief that gates the final payment. Use before a first bulk order, when switching or adding a supplier, or when returns point to a quality problem."
---

# Samples and quality check

**You get:** a sample order plan (which suppliers, which stages, cost and dates), a filled quality checklist for this product with pass or fail rules, a sample decision sheet, and a pre-shipment inspection brief that must pass before the balance is paid.

## When to use

- A shortlist exists and the store must choose a supplier on real product, not photos.
- A new supplier is being added beside the current one.
- A bulk order is about to ship and the store needs an inspection before paying the balance.
- Reviews or returns point to a quality problem with the current stock.

## Not for

- Finding suppliers: use `find-and-vet-suppliers`.
- Writing the spec the samples are judged against: use `write-product-spec-sheet-for-factory`.
- Rating suppliers over a quarter: use `supplier-scorecard`.
- Customer return handling: hand to the support agent.

## What you need

Required:

1. **Spec sheet** with version number (from `write-product-spec-sheet-for-factory`), or for a stock product, the listing plus a written list of must-haves.
2. **Shortlist** with contacts and sample prices.
3. **A reference product**: the competitor or current product the sample must match or beat.
4. **Delivery address** for samples and a named person to test them.

Optional: competitors' 1-star reviews, the store's own return reasons for this product, photos of past defects.

Paying for samples and inspections needs a client yes for each payment. Messages to suppliers go out from the client's account at level 2. Approving a sample is the client's decision; this skill prepares it.

## Before you start: the gates

1. **Spec fixed.** Pass: there is a written spec with exact measures and a version number. Fail: write it first; you cannot reject a sample against words like "good quality".
2. **Budget and time.** Pass: sample fees, courier and duty fit the budget, and three to six weeks for sampling fit the launch date. US note: small sample shipments now carry duty [COG-6261].
3. **Product rules.** Pass: the required labels and certificates are listed (India: Legal Metrology pack declarations [COG-6264] and any BIS order; US: product-specific rules such as textile labels [COG-6263]).

## Steps

### 1. Choose who gets a sample order

Order from the top 2 to 3 suppliers, not one. Samples test communication as well as product: who follows the spec, who updates without being chased. Pay through the platform where possible; platform protection covers defects only on platform-paid orders [COG-6265].

### 2. Plan the stages

For custom products, approve in three stages and never skip one [COG-0007]:

1. **Material or print sample (strike-off):** fabric, colour, finish, print or logo.
2. **Pre-production sample:** the full product made to spec. This becomes the golden sample: keep one, the factory keeps one, both signed and dated.
3. **Production sample:** pulled from the start of the bulk run, checked against the golden sample before the rest is made.

For stock products with a logo or packaging change, stage 2 and 3 are enough. Send a physical reference sample with the spec where the look or feel is hard to describe [COG-0005].

### 3. Build the checklist before samples arrive

Write it from the spec, the reference product and the complaints buyers make about competing products [AMZ-0002]. Sort every check into:

- **Critical:** unsafe, illegal or unusable (sharp edge, wrong voltage, missing required label, choking part on a child's product). One critical fail rejects the sample or the lot.
- **Major:** a buyer would return it (wrong size outside tolerance, colour off the approved standard, seam opens, function fails).
- **Minor:** a buyer might notice but would keep it (loose thread, small mark in a hidden area).

Each line has a method (measure, weigh, compare, test) and a pass rule (a number with a tolerance, or match to the golden sample).

### 4. Test the samples like a buyer

Run the same tests on every supplier's sample and the reference product, side by side:

- **Measure and weigh:** every spec dimension; fabric weight, since cutting the fabric spec can be proven by weighing it [COG-0011].
- **Use test:** use it as a buyer would for a week (wear, wash, fill, charge, drop from table height).
- **Ship test:** send one sample to yourself by the courier you will use, in the real shipping packaging, and check it on arrival.
- **Pack and label check:** every required declaration and label present and correct.
- **Photo record:** each sample photographed against the reference.

Score each sample: number of critical, major and minor fails. Reject any critical fail. Prefer the sample with fewest majors; send a written fix list to the others and allow one resample round.

### 5. Decide and lock

Approve one supplier and keep the second warm. Record the golden sample's spec version and photos. A cheaper new supplier gets a small trial order first; one switch to a supplier about 20% cheaper produced mostly faulty units in a 500-unit trial [COG-0009].

### 6. Gate the bulk order with inspection

Book a third-party pre-shipment inspection before the goods leave the factory, about 200 dollars in one practitioner's sourcing, and pay the balance only after it passes; once goods are at sea, faults cannot be fixed [COG-0006]. The inspector:

- Draws units at random using the sampling tables in ISO 2859-1, at a level agreed in writing with the supplier before production.
- Allows zero critical defects. Major and minor limits are agreed in the purchase order (practitioner default: a tighter limit for major than minor).
- Checks against the golden sample, measures, counts cartons, weighs cartons, checks labels and shipping marks, and photographs everything.
- Confirms the export and customs documents are in the shipment; a single missing customs document once got a brand's stock held over its peak season [OPS-0001].

If you cannot afford an inspector, order about 10% extra to cover defects [COG-0009] and inspect a sample of cartons on arrival before stock goes live.

### 7. After it lands

Check a random set of cartons against the checklist before listing. Watch the return rate and return reasons on the new stock for 90 days and compare with the previous supplier or lot. Poor returns cost repeat buyers: 71% of consumers in one 2025 survey said a poor return makes them less likely to buy again [CXP-0007].

### India and US notes

- **India:** local suppliers will often courier samples within days; still use the same checklist. Check the pack declarations, including MRP inclusive of all taxes and the importer's address for imports [COG-6264].
- **US:** country of origin must be marked as required; for textiles it goes on the front of the label [COG-6263].

## Checks before you hand it over

- Every sample was judged against the same checklist and the same reference.
- Each check line has a method and a pass rule with a number or the golden sample.
- Critical, major and minor are defined for this product.
- The golden sample is recorded with spec version and photos, one kept by each side.
- The pre-shipment inspection brief states the sampling level and limits, agreed before production.
- The balance payment is tied to a passed inspection.
- No payment or approval was made without the client's yes.

## Output

**One-screen summary:** recommended supplier, their sample results against the others, top fix requested, inspection date and the payment gate.

**Sample order plan:**

| Supplier | Stage | What is sampled | Cost | Courier and duty | Ordered | Due | Tester |
|---|---|---|---|---|---|---|---|

**Quality checklist:**

| Check | Category (critical, major, minor) | Method | Spec or standard | Tolerance | Supplier A | Supplier B | Supplier C | Reference |
|---|---|---|---|---|---|---|---|---|

**Sample decision sheet:** supplier, critical fails, major fails, minor fails, communication notes, decision (approve, resample, reject), fix list sent.

**Pre-shipment inspection brief:** purchase order number, quantity, golden sample reference, spec version, sampling standard and level, defect limits, checks (measurements, function, labels, cartons, weights, documents), photo list, pass rule, who receives the report.

## Common mistakes

- **One sample from one supplier.** Step 1 samples two or three.
- **Judging by eye.** Steps 3 and 4 use numbers and the golden sample.
- **Skipping the production sample.** Step 2 checks the start of the bulk run.
- **Paying the balance before inspection.** Step 6 ties payment to a pass.
- **Switching fully to a cheaper supplier.** Step 5 trials small first.
- **Forgetting the pack and documents.** Steps 4 and 6 check labels and customs papers.

## Sources

- AMZ-0002: competitors' 1-star complaints become the spec.
- COG-0005: exact measures and a physical reference sample.
- COG-0006: pre-shipment inspection, balance paid after pass.
- COG-0007: three sample stages and a golden sample on each side.
- COG-0009: defects in bulk, 10% extra, trial new suppliers small.
- COG-0011: weigh fabric to prove spec cutting.
- CXP-0007: poor returns cut repeat purchase.
- OPS-0001: a missing customs document held peak stock.
- COG-6261 (proposed): US duty on small shipments since August 2025.
- COG-6263 (proposed): US textile label rules.
- COG-6264 (proposed): India pack declarations.
- COG-6265 (proposed): platform protection only on platform-paid orders.

What makes this skill ours: the checklist is written before samples arrive and sorted by what a buyer would return; every sample faces the same reference; the inspection limits are agreed before production and tied to the balance payment; and new stock gets a 90-day return watch so a quality slip shows up before the next order.
