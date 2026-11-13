---
name: pick-pack-ship-sop
description: "A written daily routine for an in-house packing team or a small warehouse: order cut-off and release times, pick lists by shelf location, scan or double-check to stop wrong items, a box and protection guide per product, weight checks, inserts, labels and invoices, courier handover with a scan count, end-of-day reconciliation, weekly stock counts, and the error and damage log with targets. Includes India invoice, COD and e-way bill notes and US label and hazardous goods notes. Use when wrong items, missing items or damage show up in tickets, when a new packer joins, before peak season, or when moving packing out of the founder's hands."
---

# Pick, pack and ship routine

**You get:** a one-page daily routine with times and owners, a step card for each station (pick, pack, label, hand over), a box and protection guide per product, the exception rules, an error and damage log with weekly targets, and a one-screen summary for the owner.

## When to use

- Tickets or reviews mention wrong items, missing items, damage or late dispatch.
- A new packer, temp or second shift is starting and needs written steps.
- Peak season is coming and the team will double.
- The founder is handing packing to someone else.
- Shipping costs jumped because parcels are packed in the wrong boxes.

## Not for

- Choosing a 3PL or staying in-house: use `choose-3pl-or-self-fulfil`.
- Choosing couriers: use `compare-shipping-carriers`.
- Unboxing design and inserts: use `packaging-and-unboxing-brief`.
- The returns desk: use `set-up-returns-and-exchanges`.

## What you need

Required:

1. **Shopify order export**, last 30 days: Name, Created at, Lineitem sku, Lineitem quantity, Shipping Method, Payment Method, Total, Tags. Gives orders per day, units per order and peaks by hour.
2. **Product list** with SKU, barcode (if any), shelf location, weight, size, fragile or liquid flags, and expiry dates where relevant.
3. **Packaging list**: box and mailer sizes, fillers, tape, inserts, with cost.
4. **Courier pickup times** and cut-offs for each service.
5. **Error and damage history**: last 3 months of wrong, missing, damaged and late orders from tickets and returns.

Optional: a photo of the packing area, label printer and scanner models, the current SOP if any.

The routine is a document; writing it needs no access. Changing Shopify packages, shipping settings or apps needs draft access (level 2) and the client's yes.

## Before you start: the gates

1. **Promise known.** Pass when the store's dispatch promise (for example "ships within 1 working day") is written down. Fail: agree it first; the routine is built to hit it.
2. **Cost per order known.** Pass when packaging and labour per order are in gross profit per order. Fail: add them; the plain shipping carton is a shipping expense, and the branded retail box is cost of goods [FIN-0008].
3. **Capacity.** Pass when labour hours cover the peak hour of the busiest normal day. Fail: add a packing window or a person before writing times that cannot be met.

## Steps

### 1. Set the daily clock

Example for a store with a 3 p.m. courier pickup (adjust to the store):

| Time | Task | Owner |
|---|---|---|
| 9:00 | Release orders placed up to 9:00; print pick lists | Lead |
| 9:15 to 12:30 | Pick and pack batch 1 | Packers |
| 12:30 | Release orders up to 12:30 | Lead |
| 13:00 to 14:30 | Pick and pack batch 2 | Packers |
| 14:30 | Order cut-off for same-day dispatch shown on site | |
| 14:45 | Courier handover count | Lead |
| 16:30 | End-of-day check and log | Lead |

Release order: express shipping, then oldest orders, then the rest. On a pre-order arrival day, clear the backlog oldest first. Hold orders tagged for fraud review, address fix or COD confirmation.

Treat "picked on time" as the team's own promise: orders in by cut-off leave the same day [OPS-0015]. Show a dispatch or delivery date on the site that this routine can really meet [CXP-0010].

### 2. Set up the shelves

- Every product has a fixed shelf location code (aisle, shelf, bin). Fast sellers sit nearest the pack station.
- Similar-looking variants (sizes, shades) never share a bin; label bins with SKU and a photo.
- Pick lists print in walking order by location, not by order number.

### 3. Pick

- Batch pick for single-item orders (one trip per SKU); pick by order for multi-item orders.
- Check each item against the pick list: SKU, size or variant, quantity.
- If a barcode exists, scan every item. Without scanners, a second person checks the SKU on orders with 3+ items or similar variants (practitioner default).
- Missing item: do not substitute. Tag the order "short pick", tell the lead, and trigger the oversold message from `delay-and-stockout-customer-messages`.

### 4. Pack

**Box guide:** one row per product or common order (see Output). Pick the smallest box that fits with protection. Every box used must be saved in Shopify with its empty weight and size, or calculated shipping undercharges [SET-0007]. Size counts as well as weight: USPS charges Priority Mail parcels over 1 cubic foot by size [OPS-6287], and Indian couriers commonly bill by size above a set ratio.

**Protection rules:**

- Fragile (glass, ceramics): wrap each item, 5 cm of filler on every side, "fragile" label; do a shake test (nothing moves).
- Liquids: lid taped or sealed, item in a sealed bag, upright.
- Apparel: folded in a polybag or tissue; no filler needed.
- Jewellery and small high-value items: inner box, tamper-evident tape on the outer mailer.

**Inserts:** invoice, return instructions, and any brand card. Branded unboxing can stay cheap; one card puts the range from under 0.50 USD per order to a few dollars [CXP-0008].

**Weight check:** weigh the packed parcel. If it differs from the expected weight (sum of item weights + box) by more than 5% or 50 g, whichever is larger, open and recheck (practitioner default; tune it).

**Photo:** for orders above a value the owner sets, or all COD orders, take a photo of the open box with contents and the order number visible. It settles "wrong item" and "empty box" claims and courier disputes.

### 5. Label and paperwork

- Print the label after the weight check, so the weight on the label is real.
- Check the label name and pincode or ZIP against the order.
- India: put the GST invoice in the parcel; for COD, check the amount on the label matches the order total. For high-value consignments, check whether an e-way bill is needed before handover. Packaged goods need their legal labels intact.
- US: perfumes, aerosols, batteries and some cosmetics can be restricted or need hazardous materials labels; check the carrier's rules for each such product before shipping.

### 6. Hand over

- Count parcels by courier and service; scan or tick each tracking number on the manifest.
- Get the courier to sign or scan the manifest with the count; photo it.
- Parcels left behind: log them and book a pickup or drop-off the same day.

### 7. End-of-day check

Orders released = orders shipped + orders held (with reason). Any order not accounted for is found before the team leaves. Log: orders shipped, held, short picks, damage found, late (missed cut-off), with reasons.

### 8. Weekly and monthly routines

- **Weekly:** count the top 20 SKUs by sales (cycle count) and fix Shopify stock; review the error log; restock packaging.
- **Monthly:** full or rolling count of all locations; check courier invoices against orders shipped and box sizes used [OPS-0012]; review the box guide against damage reports.

### 9. Track errors and set targets

Per week:

- mis-pick rate = wrong or missing item orders / orders shipped (target under 0.5%, practitioner default);
- damage rate = damaged on arrival / orders shipped (target under 0.5%);
- dispatched on time = shipped by promise / orders due (target 98%+);
- orders per labour hour.

For each error, write the cause (wrong bin, similar variant, rushed, no check) and change one thing in the routine. Recheck after two weeks.

### 10. Peak plan

Six weeks before peak: train extra packers on this routine with a 20-order supervised test; pre-make boxes; extend hours or add a second pickup; set the site cut-off dates for festival or holiday delivery; and agree who decides when to pause ads if the backlog passes two days.

## Checks before you hand it over

- The clock fits the courier pickup and the store's dispatch promise.
- Every product has a shelf location, a box and a protection rule.
- Every box is saved in Shopify with empty weight and size.
- The pick step has a scan or second check for risky orders, and no substitutes.
- The weight check has a tolerance and an action.
- India invoice, COD amount and e-way bill checks, and US restricted goods checks, are in the routine where they apply.
- The end-of-day check accounts for every released order.
- Error targets and a weekly review are set.

## Output

1. **One-screen summary:** the dispatch promise, the daily clock, the three biggest error causes found and the fix for each, and targets.
2. **Daily routine page** (step 1 table, printable).
3. **Station cards:** pick, pack, label, hand over, end of day; one card each, 6 to 10 lines.
4. **Box and protection guide:**

| SKU or order type | Box or mailer | Filler | Protection rule | Expected packed weight | Inserts | Photo needed |
|---|---|---|---|---|---|---|

5. **Exception rules:** short pick, damaged stock, address problem, COD hold, missed pickup; what to do and who to tell.
6. **Error and damage log:** Date, Order, Type, Cause, Fix, Owner.
7. **Weekly scorecard:** Week, Orders shipped, Mis-pick %, Damage %, On-time %, Orders per labour hour, Change made.

## Common mistakes

- **Pick lists by order number.** Step 2 sorts by walking route.
- **Similar variants in one bin.** Step 2 separates them with photos.
- **Substituting a missing item.** Step 3 stops and messages the buyer.
- **Boxes not saved in Shopify.** Step 4 saves each with empty weight.
- **No proof of what was packed.** Step 4 photographs high-value and COD orders.
- **Orders lost between release and dispatch.** Step 7 reconciles every day.

## Sources

- OPS-0015: picked-on-time promise.
- OPS-0012: monthly invoice checks against orders.
- CXP-0008: unboxing cost ranges.
- CXP-0010: a specific, kept delivery promise.
- SET-0007: saved package weights and sizes on Shopify.
- OPS-6287: USPS size-based weight over 1 cubic foot.
- FIN-0008: shipping carton versus retail box in the accounts.

What makes this skill ours: release times are worked back from the courier pickup and the promise shown on site; a weight check and packed-order photo catch errors and settle COD and courier disputes; every release is reconciled before the team leaves; and India invoice, COD and e-way bill checks sit next to US restricted goods checks in the same routine.
