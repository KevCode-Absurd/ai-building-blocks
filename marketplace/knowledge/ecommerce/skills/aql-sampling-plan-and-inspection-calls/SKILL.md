---
name: aql-sampling-plan-and-inspection-calls
description: "An AQL inspection plan in the ISO 2859-1 style for every production order (general inspection level II by default, sample size and accept or reject numbers per defect class, carton selection, on-site tests), an inspection schedule by stage (pre-production, during production at about 20% made, pre-shipment at 100% made and 80% packed, container loading), booking requests for the owner's yes, and a pass, rework or reject call on each report before the balance is paid. Use for every production order, from the first booking to the inspector's report, and when a supplier's lots keep failing."
---

# AQL inspection plan and pass, rework or reject calls

**You get:** a sampling plan per order, an inspection schedule with booking dates, a booking request ready for the owner's yes, a report review with a clear call and marked photos, and the message to the supplier before the balance is paid.

## When to use

- A production order is placed and the store needs to know when to inspect and what a pass means.
- An inspection report has arrived and the owner must decide whether to pay the balance.
- The same supplier has failed two inspections and the store wants tighter checks.
- The first order with a new factory or a new mould.

## Not for

- Setting the golden sample and defect list: use `golden-sample-and-defect-list` first; this plan uses it.
- Sample approval before bulk: use `order-samples-and-quality-check`.
- Lab tests and certificates: use `product-test-and-certificate-plan`.
- Rating suppliers over a quarter: use `supplier-scorecard`.
- Passing a failed lot so the shipment is not late: never.

## What you need

Required:

1. **The PO**: quantity per SKU, ship date, payment trigger (from `purchase-order-and-supply-terms`).
2. **The defect list and golden sample record** (from `golden-sample-and-defect-list`).
3. **The supplier's production schedule**: start date, first finished units, finish date, packing date.
4. **Factory address and contact.**

Optional: past inspection reports for this supplier, return reasons for the last lot, carton count and packing list.

Phuong drafts plans and reads reports at level 2. Every inspector booking and fee, and every balance payment, needs the owner's yes. The supplier is told the plan before production starts.

## Before you start: the gates

1. **Agreed before production.** Pass: the standard, level and limits are in the PO or terms schedule. Fail: send them now and get the supplier's written yes before production; limits set after a fail are disputes.
2. **Reference with the inspector.** Pass: the golden sample and defect list are with the inspector. Fail: send them from the store.
3. **Balance not paid.** Pass: the balance is still unpaid. Fail: the inspection has no lever; say so and plan the next order differently.

## Steps

### 1. Pick the inspection level

- **General level II:** the default.
- **Level III:** after recent quality problems, a new mould, or high-value goods.
- **Level I:** only for a supplier with a clean record over several lots.
- **Special levels S1 to S4:** for slow or destructive tests (drop, wash, battery run-down), so you do not destroy 200 units.

MIL-STD-105, ANSI Z1.4 and ISO 2859-1 share the same basic tables, so a PO can cite any one and inspectors anywhere will draw the same sample.

### 2. Read the sample size and limits

Common defaults: AQL 0 for critical (one critical fails the lot), 2.5 for major, 4.0 for minor. At general level II, normal inspection:

| Lot size | Code | Sample | Major (AQL 2.5) accept / reject | Minor (AQL 4.0) accept / reject |
|---|---|---|---|---|
| 151 to 280 | G | 32 | 2 / 3 | 3 / 4 |
| 281 to 500 | H | 50 | 3 / 4 | 5 / 6 |
| 501 to 1,200 | J | 80 | 5 / 6 | 7 / 8 |
| 1,201 to 3,200 | K | 125 | 7 / 8 | 10 / 11 |
| 3,201 to 10,000 | L | 200 | 10 / 11 | 14 / 15 |
| 10,001 to 35,000 | M | 315 | 14 / 15 | 21 / 22 |

For other lot sizes or levels, take the row from the standard or the inspector's calculator and write it into the plan. The inspector opens at least the square root of the total export cartons, picked at random from all parts of the stack.

### 3. Add the on-site tests

From the defect list: measurements against the spec, weight, colour against the golden sample, function test, barcode scan, carton drop test, carton size and weight against the packing list, labels and country of origin marks.

### 4. Schedule the inspections by stage

| Stage | When | Why |
|---|---|---|
| Factory audit (new supplier) | Before the first PO | Capacity, process, quality system; about 398 dollars per man-day in one inspector's price list |
| Pre-production check | Materials in, before cutting or moulding | Wrong material caught before it becomes product |
| During production | At about 20% made, timed to first finished output, not a calendar date | Faults fixed while they still can be, and a real finish date |
| Pre-shipment | 100% made and at least 80% packed; book at least 3 days ahead | The pass that releases the balance; about 268 dollars per man-day in one price list |
| Container loading | At loading | Quantity, assortment, carton state, container seal number |

On a 30-day, 20,000-piece order with first units on day 8, a during-production check on about day 12 is right. For a small order, weigh each visit against the order value and keep at least the pre-shipment check.

### 5. Book with the owner's yes

Booking request: inspection type, date, factory address and contact, PO, quantity, AQL plan, defect list version, golden sample tag, tests, report deadline, fee. The owner says yes before booking. Tell the supplier the date and that the goods must be ready; an aborted visit is at the supplier's cost.

### 6. Read the report and make the call

Check first that the inspector used the right lot size, code letter, sample size and carton count, and the store's golden sample. Then:

- **Pass:** no critical, majors and minors at or under the accept numbers. Recommend releasing the balance, with the owner's yes.
- **Rework:** over the limit on major or minor, with faults that can be sorted or fixed. The supplier sorts 100% or reworks, then a re-inspection at the supplier's cost; deduct the fee from the balance with a debit note.
- **Reject:** any critical defect, or faults that cannot be reworked. No shipment; open the deposit talk and the backup supplier.
- **Owner's call:** close to the line with only cosmetic minors. Show the cost of shipping the defects (expected returns x cost per return) against the cost of the delay, and let the owner decide.

Mark each photo with the defect line number. Keep the report in the supplier's record.

### 7. Switch levels on the record

Under the Z1.4 switching rules: 2 rejected lots out of 5 in a row move a supplier to tightened inspection; 5 straight passes return it to normal; 10 straight passes can allow reduced inspection. Record each lot so the switch is automatic, not a mood.

### 8. Check on arrival too

Alibaba.com Trade Assurance refund claims must be made within 30 days of delivery, so open a sample of cartons on arrival and log any defects against the lot. Pass return reasons for the lot to `supplier-scorecard` after 90 days.

## Checks before you hand it over

- Standard, level and limits were agreed in writing before production.
- Sample size, code letter and accept or reject numbers match the lot size.
- The golden sample and defect list went to the inspector from the store.
- Every inspection has a date tied to production progress, not only a calendar date.
- Each report call names the defect counts against the limits.
- Re-inspection is at the supplier's cost.
- No booking, fee or balance was paid without the owner's yes.

## Output

**Sampling plan:** standard, level, lot size, code letter, sample size, accept and reject numbers per class, carton count to open, tests.

**Inspection schedule:**

| PO | Stage | Trigger | Planned date | Booked | Inspector | Fee | Result | Call |
|---|---|---|---|---|---|---|---|---|

**Report review:** lot facts checked, defect counts by class against the limits, marked photos, call (pass, rework, reject, owner's call), message to the supplier, payment recommendation.

## Common mistakes

- **Setting the limits after the fail.** Gate 1 agrees them before production.
- **Inspecting at a calendar date.** Step 4 times checks to output.
- **Using the factory's sample as the reference.** Gate 2 sends the store's.
- **Paying the balance, then inspecting.** Gate 3 keeps the lever.
- **Same level forever.** Step 7 switches on the record.
- **Destroying 200 units in a drop test.** Step 1 uses a special level.

## Sources

- COG-0006: book a third-party inspection before the container leaves; pay the balance after it passes.
- COG-0009: expect defects; order extra or inspect.
- COG-6265: Alibaba.com protection only on platform-paid orders.
- QIMA, AQL Calculator and guide: https://www.qima.com/aql
- QIMA, Acceptable Quality Limit (AQL) tables: https://www.qima.com/aql-acceptable-quality-limit
- QualityInspection.org, How the AQL inspection levels in ISO 2859-1 affect sampling size: https://qualityinspection.org/inspection-level/
- SQC Online, Switching Rules (MIL-STD-105E, Z1.4): https://www.sqconline.com/switching-rules-mil-std-105e-z14
- NIST/SEMATECH e-Handbook, MIL-STD-105E and related standards: https://itl.nist.gov/div898/handbook/pmc/section2/pmc231.htm
- QualityInspection.org, How to select the cartons to inspect: https://qualityinspection.org/select-cartons-to-inspect/
- QIMA, The pre-shipment inspection procedure explained: https://www.qima.com/blog/quality-control/pre-shipment-inspection-procedure
- V-Trust, Pre-Shipment Inspection, Container Loading Supervision and Factory Audit services: https://www.v-trust.com/en/our-services/quality-control/pre-shipment-inspection-service-in-china-india-vietnam-malaysia-thailand-bangladesh-pakistan-indonesia-cambodia
- QIMA, During Production Inspection: https://www.qima.com/during-production-inspection
- QualityInspection.org, Inspection during production: https://qualityinspection.org/inspection-during-production/
- QualityInspection.org, When QC inspections are at the supplier's charge: https://qualityinspection.org/qc-inspections-at-the-suppliers-charge/
- Alibaba.com Trade Assurance, Money-back policy: https://tradeassurance.alibaba.com/ta/MoneyBackPolicy.htm
- QIMA, Q3 2026 Barometer: https://www.qima.com/newsroom/news/news-q3-2026-barometer

What makes this skill ours: limits are agreed before production and tied to the balance; inspections follow the real production clock; the call on each report is written against the numbers with the cost of shipping defects shown; and the inspection level tightens or relaxes on the supplier's record, not on feel.
