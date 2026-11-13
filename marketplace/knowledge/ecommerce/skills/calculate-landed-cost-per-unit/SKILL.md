---
name: calculate-landed-cost-per-unit
description: "A landed cost sheet giving the true cost of each unit sitting in the store's warehouse: factory price, tooling, packaging, inspection, freight, insurance, duty, US tariffs or India customs duty and GST treatment, clearance, inland transport and a defect allowance, split per SKU from real invoices. Also runs backwards from the selling price to the most a unit may cost. Use before ordering, when quotes need comparing, when freight or tariffs change, or when the books show margin that does not match reality."
---

# Landed cost per unit

**You get:** a landed cost sheet (one row per SKU per shipment) with the cost of each unit delivered to the warehouse, the target ceiling worked back from the selling price, and a one-screen note on what moved the number.

## When to use

- Before a first order, to know if the product can make money at the planned price.
- To compare supplier quotes on one basis (called by `write-rfq-and-compare-quotes`).
- After each shipment lands, to update the cost in Shopify and the books from real invoices.
- When freight rates, duty rates, tariffs or the exchange rate change.
- When gross margin in the P&L looks better than cash says it should.

## Not for

- Gross profit per order after outbound shipping, fees, returns and ads: use `store-meta-math` (this skill gives it the unit cost).
- The monthly P&L: use `monthly-store-pnl`.
- Deciding what to stock or cut: use `rank-products-to-push-or-cut`.
- Fulfilment cost per order: use `choose-3pl-or-self-fulfil`.

## What you need

Required (read access, level 1):

1. **Supplier invoice or quote**: unit price per SKU, quantity, currency, price basis (EXW, FOB, CIF, delivered).
2. **Freight invoice or quote**: cost, mode (sea, air, courier), what it covers (to port or to door).
3. **Customs entry** (US entry summary or India bill of entry) or a broker's duty estimate with the HS or HSN code and rate.
4. **Clearance and local charges**: broker or customs house agent fee, port and handling charges, inland transport to the warehouse.
5. **Packaging and inserts** bought separately, and inspection fees.
6. **Exchange rate** actually paid, or today's rate plus a buffer.

Optional: carton sizes and weights per SKU (needed to split freight fairly), tooling or mould invoices, the defect rate from the last inspection.

Missing invoices: use quotes and mark the row "estimate" until real invoices arrive. Missing duty rate: stop and ask a customs broker; never guess a duty rate. Writing the final cost into Shopify's "cost per item" needs draft access (level 2) and a client yes.

## Before you start: the gates

1. **One costing rule.** Pass: the store agrees what sits in cost of goods. The rule here: everything until it is on your shelf is in [FIN-0007]. Inbound freight, duty and the retail box are in; outbound shipping, platform fees, ads and storage are below gross profit [FIN-0017]. The retail box is product cost, the plain shipping carton is a shipping cost, even on one invoice [FIN-0008]. Fail: agree it with the client's accountant before filling numbers, and write the choice at the top of the sheet.
2. **Tax status.** Pass: India: is the store GST-registered and able to claim input tax credit? US: who is importer of record? Fail: ask; it changes whether IGST is a cost.
3. **Real basis.** Pass: every number is tagged invoice or estimate.

## Steps

### 1. Start from the factory price

Unit price x quantity in the supplier's currency, converted at the rate actually paid plus bank fees. For a quote, add a currency buffer (practitioner default 2 to 3%, test it against the last six months' movement).

Add one-off costs spread over the units in this order: moulds, tooling, printing plates, sample fees not refunded. Spread them over the first order only, and note that later orders will be cheaper.

### 2. Add packaging and inspection

Retail box, inner bags, labels and inserts per unit if bought separately. A pre-shipment inspection is about 200 dollars a visit in one practitioner's sourcing [COG-0006]; divide by units in the lot.

### 3. Add freight and insurance

Split a shared shipment across SKUs by the driver that set the price: volume (cubic metres) for sea and most consolidated freight, chargeable weight for air and courier. Splitting freight by value makes small, heavy items look cheap. Use carton sizes from the supplier's quote.

### 4. Add duty by the destination country's rules

**US:**

- Duty is charged on the price paid to the seller, not including international freight and insurance, plus packing, selling commissions, moulds or tools you supplied, and royalties [COG-6262].
- Rate = the HTS rate for the code plus any additional tariffs in force for that origin on the day of entry. These have changed often since 2025; take them from the broker or the official tariff schedule on the day.
- Duty-free entry for low-value shipments ended for all countries on 29 August 2025, so courier and sample shipments now carry duty too [COG-6261].
- Add the customs processing and harbour fees and the broker fee from the entry summary.

**India:**

- Basic customs duty and any surcharge on it are a cost.
- IGST is charged on the assessable value plus customs duty. A GST-registered store can take it back as input tax credit; basic customs duty can never be taken back [COG-6260]. So IGST is a cash outlay, not a cost, for a registered store that can use the credit, and a real cost otherwise. Record it in a separate column either way, since it ties up cash until the credit is used.
- Add customs house agent fees, port and container freight station charges, and transport to the warehouse.
- Domestic purchases: GST on the supplier's invoice is creditable for a registered store if the supplier files correctly; cost the unit ex-GST.

### 5. Add a defect allowance

Bulk orders have defects: 300 of 10,000 in one jewellery order [COG-0009]. Divide total cost by sellable units, not ordered units. Use the last inspection's defect rate; for a first order with no data, use 3% and say it is an assumption (practitioner default from that case, test it).

### 6. Total, then check against the ceiling

Landed cost per sellable unit = sum of all lines / sellable units.

Ceiling (worked backwards): selling price, minus discounts and GST or sales tax inside the price, minus the gross profit the store needs per order, minus outbound shipping, pick and pack, payment fees, marketplace fees and returns allowance. Product margin is not gross margin: one tee with a 30 dollar unit cost read 70% margin but earned 24% after freight-in, shipping, pick-pack, fees and allowances [MEA-0023]. Gross margin must be counted at the customer's door [MEA-0037]; hand the landed cost to `store-meta-math` for that step.

If landed cost is above the ceiling, show which line to attack first (usually freight mode, duty classification, order size or packaging) and hand it to `negotiate-moq-and-price`.

### 7. Update after landing

When real invoices arrive, replace estimates, recompute, and update Shopify's cost per item for each variant (with the client's yes). Note the change from the estimate. Returns that are repackaged for resale add that labour and material to cost of goods, while return shipping stays an overhead [FIN-0009].

## Checks before you hand it over

- The costing rule is written at the top and matches the accountant's.
- Every line is tagged invoice or estimate.
- Freight is split by volume or weight, not by value.
- Duty is on the right base for the country, with the rate's source and date.
- India: IGST sits in its own column and is a cost only when credit cannot be used.
- Cost is divided by sellable units after the defect allowance.
- Tooling is spread over a stated number of units.
- The ceiling and the gap to it are shown.

## Output

**One-screen summary:** landed cost per unit for each SKU, the ceiling from the selling price, the gap, the biggest three cost lines, and what changed since the last shipment.

**Landed cost sheet (one row per SKU per shipment):**

| SKU | Shipment ref | Units ordered | Sellable units | Currency and rate | Factory price per unit | Tooling per unit | Packaging and inserts per unit | Inspection per unit | Freight per unit | Insurance per unit | Duty and tariffs per unit | Clearance, port and broker per unit | Inland transport per unit | Defect allowance per unit | Landed cost per unit | IGST or recoverable tax per unit (India) | Invoice or estimate | Date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Ceiling block:**

| Selling price | Less tax in price | Less target gross profit | Less outbound shipping and pick-pack | Less fees | Less returns allowance | Ceiling landed cost | Actual landed cost | Gap |
|---|---|---|---|---|---|---|---|---|

**File:** `landed-cost.csv` or a Google Sheet with live formulas, one tab per shipment.

## Common mistakes

- **Using the factory price as cost.** Steps 2 to 5 add every cost to the shelf.
- **Freight split by value.** Step 3 splits by volume or weight.
- **Treating India's IGST as a cost (or as free).** Step 4 depends on registration and credit use.
- **US duty on the freight-inclusive price.** Step 4 uses the right base.
- **Dividing by units ordered.** Step 5 divides by sellable units.
- **Never updating.** Step 7 replaces estimates with invoices after each landing.

## Sources

- COG-0006: about 200 dollars per pre-shipment inspection.
- COG-0009: defects in bulk orders, 300 of 10,000.
- FIN-0007: all in until it is on the shelf.
- FIN-0008: retail box is product cost, shipping carton is shipping cost.
- FIN-0009: refurbishing returns is cost of goods, return shipping is overhead.
- FIN-0017: inbound freight, duty and packaging sit in cost of goods.
- MEA-0023: product margin is not gross margin.
- MEA-0037: count gross margin at the customer's door.
- COG-6260 (proposed): India IGST creditable, customs duty not.
- COG-6261 (proposed): US de minimis ended August 2025.
- COG-6262 (proposed): US duty base excludes international freight, adds packing and assists.

What makes this skill ours: freight is split by what set its price; India's IGST is kept in its own column because it is cash, not cost, for a registered store; US duty uses the transaction value base; cost is divided by sellable units after defects; and the same sheet runs backwards from the selling price so every quote meets a ceiling.
