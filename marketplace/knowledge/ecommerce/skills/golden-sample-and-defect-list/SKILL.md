---
name: golden-sample-and-defect-list
description: "A golden sample record (photos from six sides under one light, every measurement, weight and colour standard, signed and dated, with sealed copies for the store, the factory and the inspector) and a defect list split into critical, major and minor, each with how to check it, its tolerance and the return reason or review complaint it prevents. Use when a sample is approved and before production starts, so the factory and the inspector check against the same standard, or when returns say 'not as pictured' and nobody can say what the right product looks like."
---

# Golden sample and defect list

**You get:** a golden sample record, a defect list sorted by severity and tied to the store's own return reasons, and a hand-over note that gets one sealed sample to the inspector from the store, not from the factory.

## When to use

- The pre-production sample is approved and bulk is next.
- A new mould, material or factory is starting.
- Returns or reviews say "broken", "not as pictured" or "wrong size", and the factory says the goods are fine.
- An inspector is being booked and needs a reference.

## Not for

- Judging the samples before approval: use `order-samples-and-quality-check`.
- The AQL plan, inspection schedule and pass, rework or reject calls: use `aql-sampling-plan-and-inspection-calls`.
- Safety tests and certificates: use `product-test-and-certificate-plan` with Meenakshi.
- Colour approval in detail: use `colour-standard-and-lab-dip-approval`.

## What you need

Required:

1. **The approved sample** (in hand) and the spec version it was approved against.
2. **The spec sheet** with measurements and tolerances (from `write-product-spec-sheet-for-factory`).
3. **Return reasons and reviews** for this product or the closest one: Shopify returns by product and reason, marketplace returns, 1 to 3 star review text.

Optional: competitors' 1-star reviews, past inspection reports, photos of past defects.

Phuong and Maxine draft at level 2. The owner signs the golden sample record. Courier costs for sealed samples need the owner's yes.

## Before you start: the gates

1. **It really is approved.** Pass: the sample passed every critical and major line on the sample checklist. Fail: do not make it golden; fix and resample.
2. **Enough copies.** Pass: the factory made at least three approved samples. Fail: ask for more from the same run; one sample cannot sit in three places.
3. **Return reasons logged.** Pass: returns have reasons per product. Fail: the defect list falls back on reviews and the spec; set up reasons now, since a refund without a return records no reason.

## Steps

### 1. Record the golden sample

- Spec version, factory, date, approver.
- Photos from six sides plus close-ups of seams, joins, logo and labels, all under one named light (daylight-balanced lamp) on a grey card, same camera settings.
- Every measurement point from the spec with the measured value, and the weight.
- Colour standard per material (Pantone code and the physical standard).
- Function checks done and their results (opens, closes, fits, holds, charges).

### 2. Seal and place three copies

One for the store, one for the factory, one for the inspector. Each is tagged, signed and dated, and sealed in a bag with the tag across the seal. Send the inspector's copy from the store, not from the factory: a sample left at the factory can be swapped or worn.

### 3. Build the defect list from returns first

Pull 6 to 12 months of return reasons and 1 to 3 star reviews. Group them into the part or property they point to ("zip split", "lid leaks", "colour darker than photos"). Each group becomes a defect line with the return reason it prevents. Then add lines from the spec and from competitors' 1-star complaints. Check returned goods before blaming the factory: US retailers judged about 9% of returns fraudulent in 2025.

### 4. Sort every line by severity

- **Critical:** unsafe, illegal or unusable: sharp edge, choking part on a child's product, wrong voltage, missing legal label. One critical fails the lot.
- **Major:** a buyer would return it: size outside tolerance, colour off the standard, function fails, seam opens.
- **Minor:** a buyer might notice but would keep it: loose thread or a small mark on a hidden area.

Default limits for consumer goods are AQL 0 for critical, 2.5 for major and 4.0 for minor; Phuong sets the plan in `aql-sampling-plan-and-inspection-calls`.

### 5. Give every line a check and a tolerance

Each line has a method (measure, weigh, compare to golden sample, function test, drop test, scan barcode) and a pass rule with a number. Tolerance examples from one shirt maker: plus or minus 0.4 inch on chest width, 0.5 inch on lengths, 0.3 inch on collar and cuffs, doubled for circumferences. Carton drop tests can follow ISTA 1A heights by packed weight: 760 mm up to 10 kg, 610 mm to 19 kg, 460 mm to 28 kg.

### 6. Put a cost on the top lines

For the five most common defects: units returned in the last year x (refund + return shipping + lost unit). This shows the factory and the owner why each line matters. Quality cost sits in four buckets: prevention (this record), appraisal (inspection), internal failure (rework before shipping) and external failure (returns after delivery); the last is the dearest.

### 7. Share and sign

The factory signs the defect list with the golden sample, so both sides agree what a fail is before production. Version it: any change needs a new version and both signatures.

## Checks before you hand it over

- The golden sample record has photos under one light, every measurement and the colour standard.
- Three sealed copies exist, and the inspector's goes from the store.
- Every defect line has a severity, a method, a number and the return reason it prevents.
- Critical lines include every legal label and safety point.
- The top five defects have a yearly cost.
- The factory has signed the same version.

## Output

**Golden sample record:** spec version, factory, date, approver, photo set, measurement table, weight, colour standards, function results, seal tag numbers and where each copy is.

**Defect list:**

| # | Defect | Part | Severity | How to check | Tolerance or pass rule | Return reason or review it prevents | Returns last year | Cost last year |
|---|---|---|---|---|---|---|---|---|

**Hand-over note** for the inspector: golden sample tag number, courier tracking, defect list version.

## Common mistakes

- **Letting the factory keep the only good sample.** Step 2 seals three and the store sends one to the inspector.
- **A defect list copied from a template.** Step 3 starts from the store's own returns.
- **Words like "good finish".** Step 5 sets a number.
- **Blaming the factory for every return.** Step 3 checks returned goods first.
- **Changing the list without the factory.** Step 7 versions and signs it.

## Sources

- COG-0005: exact measures and a physical reference sample.
- COG-0007: three sample stages and a golden sample on each side.
- COG-0009: expect defects in bulk orders.
- COG-0011: a full tech pack removes most supplier errors.
- CXP-0007: poor returns cut repeat purchase.
- QualityInspection.org, How to get approved samples in the hands of the inspector?: https://qualityinspection.org/samples-in-hands-of-inspector/
- V-Trust, Defect Classification: https://www.v-trust.com/en/our-services/inspection-standards/defect-classification
- Proper Cloth, Accepted sewing tolerances: https://propercloth.com/reference/accepted-sewing-tolerances-for-proper-cloth-garments/
- HQTS, All you need to know about ISTA 1A package testing: https://hqts.com/all-you-need-to-know-about-ista-1a-package-testing
- ASQ, What is Cost of Quality (COQ)?: https://www.asq.org/quality-resources/cost-of-quality
- Shopify Help Center, Sales reports (returns by reason): https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/sales-report
- NRF, Consumers expected to return nearly $850 billion in merchandise in 2025: https://nrf.com/media-center/press-releases/consumers-expected-to-return-nearly-850-billion-in-merchandise-in-2025

What makes this skill ours: the defect list starts from the store's own return reasons and reviews, so every line is something buyers send back; each line carries a number and a yearly cost; and the inspector's golden sample comes from the store, sealed, so nobody can swap the standard.
