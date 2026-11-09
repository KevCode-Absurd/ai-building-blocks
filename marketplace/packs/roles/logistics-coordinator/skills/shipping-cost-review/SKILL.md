---
name: shipping-cost-review
description: Finds where a seller's shipping and fulfilment money goes and how to spend less without breaking delivery promises - matching carrier invoice lines to orders, true cost per order by zone, weight band, service and box, billed versus actual weight, surcharges, the real order mix priced on each rate card, 3PL quotes put on the same basis, and a checkout rate table that covers costs. Use it monthly, before a carrier or 3PL switch, or when shipping eats the margin. Changes checkout rates or buys labels only with level 3 access.
---

# Shipping cost review

## When to use

- Shipping costs keep rising and nobody can say why.
- Before changing carrier, service or 3PL, or renewing a contract.
- The checkout charges customers less than shipping really costs.
- Monthly, as a standing check on carrier bills.

Do not use it to negotiate contracts on the client's behalf, to pay or dispute bills without the client, or to make pricing decisions; the owner sets prices.

## Access needed

- **Level 1 (read):** carrier invoices or the shipping platform's cost export, the order export with weights and destinations, rate cards, 3PL bills and quotes.
- **Level 2 (read and draft):** a copy of the checkout rate table with changes marked; draft disputes of billing errors.
- **Level 3 (read, write and publish):** update checkout shipping rates once the owner approves the table, and switch default box sizes or services in the shipping platform within the client's limits. Paying or disputing bills stays with the client.

## What you need

1. One to three months of carrier invoices (line level, not just totals), or the shipping platform's cost export.
2. The order export: order number, items, weight, box used, destination, service chosen, shipping charged to the customer.
3. Box sizes in stock, with inside dimensions.
4. Rate cards or quotes from each carrier and 3PL being compared.
5. The delivery promises shown at checkout.
6. Volumes by month, and any expected change.

## Steps

### 1. Match invoice lines to orders
Join invoices to orders by tracking number. List unmatched lines (returns, re-ships, adjustments) separately. True cost per order includes the base rate, every surcharge and any adjustment billed later.

### 2. Break costs down
Cost per order by zone, weight band, service and box. Find the few combinations that carry most of the spend. Show cost as a share of order value by product type.

### 3. Check billed against actual weight
For each parcel, compare actual weight with the billed weight. Where the carrier billed on dimensional weight, work out what the next smaller box would have cost. Use each carrier's own rule: USPS, for example, uses dimensional weight for Priority Mail parcels over one cubic foot, with a divisor of 139 (as of its July 2026 manual). Read other carriers' divisors from the client's rate card or the carrier's current service guide; never assume one.

### 4. List the surcharges
Fuel, residential, delivery area, oversize, address correction, signature and any peak surcharges. For each: how often, what it cost, and whether it could be avoided (address checks, box changes, service choice).

### 5. Price the real order mix on each option
Take last period's actual orders and price each one on each rate card or quote. Keep the delivery promise in view: a cheaper service that misses the promise is not a saving. Show the total and the change.

### 6. Put 3PL quotes on the same basis
Use the client's own order profile (orders, units per order, SKUs, storage, receiving, returns). Price every fee line from each quote. List fees a quote leaves out or prices "on request" as gaps to ask about.

### 7. Rank the savings
Rank by money saved and effort: box changes, address checks, service mix, a carrier switch, a 3PL change. For each: the saving from the client's data, what could go wrong, and how to test it on a small share of orders first.

### 8. Build the checkout rate table (if wanted)
Rates by zone and weight band that cover the true cost, the gap against what customers pay now, and where a free-shipping threshold would sit. The owner decides the prices.

### 9. Hand over or apply
At level 2, deliver the review and the draft rate table. With the owner's approval of the table, at level 3, update the checkout rates and default boxes or services within the limits, and log the change.

## Checks

- Every cost is from an invoice, export or rate card; guesses (future volume, fuel surcharge changes) are labelled.
- Unmatched invoice lines are listed, not dropped.
- Dimensional weight rules are each carrier's own, with the source and date.
- Comparisons use the real order mix and keep delivery promises.
- 3PL comparisons list missing fees as questions.
- No live rate change without the owner's approved table and level 3 access.

## Output format

1. One-page summary: top findings, savings ranked, next steps.
2. Tables: cost per order by zone, weight band, service and box; surcharges; billed versus actual weight; option comparison.
3. 3PL comparison sheet (if relevant).
4. Draft checkout rate table (if wanted).
5. Assumptions and gaps.

## Example of good output (short)

*Illustrative structure, not a real business: a ceramics shop shipping about 1,200 parcels a month in the US. Copy the shape, never the content: every fact comes from the client's own context.*

> **Top finding:** 31% of parcels shipped in the 14 x 12 x 12 inch box (2,016 cubic inches), which is over one cubic foot, so USPS Priority Mail billed them on dimensional weight: 2,016 / 139 = 14.5, rounded up to 15 lb. The mugs inside weighed under 3 lb. Switching two-mug orders to the 10 x 8 x 6 box (with the same padding spec) would have cut last month's bill by the amount in table 3.
>
> | Cause | Parcels | Extra cost last month | Fix | Effort |
> |---|---|---|---|---|
> | Box too big (dimensional weight) | 372 | [from invoices] | New box for 1-2 mug orders | Low |
> | Address correction fees | 41 | [from invoices] | Address check at checkout | Low |
> | Residential surcharge on UPS Ground | 610 | [from invoices] | Price USPS Ground Advantage for light parcels | Medium |
>
> **Test first:** one week of two-mug orders in the new box, with a breakage check on arrival, before switching all.
