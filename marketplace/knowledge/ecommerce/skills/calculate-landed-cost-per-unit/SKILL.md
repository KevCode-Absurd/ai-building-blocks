---
name: calculate-landed-cost-per-unit
description: "A landed cost sheet giving the true cost of each unit sitting in the store's warehouse: factory price, tooling, packaging, inspection, freight, insurance, duty, US tariffs, UK and EU duty and import VAT treatment, clearance, inland transport and a defect allowance, split per SKU from real invoices. Also runs backwards from the selling price to the most a unit may cost. Use before ordering, when quotes need comparing, when freight or tariffs change, or when the books show margin that does not match reality."
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
3. **Customs entry** (US entry summary, UK or EU import declaration, or the local equivalent) or a broker's duty estimate with the HS code and rate.
4. **Clearance and local charges**: broker or customs house agent fee, port and handling charges, inland transport to the warehouse.
5. **Packaging and inserts** bought separately, and inspection fees.
6. **Exchange rate** actually paid, or today's rate plus a buffer.

Optional: carton sizes and weights per SKU (needed to split freight fairly), tooling or mould invoices, the defect rate from the last inspection.

Missing invoices: use quotes and mark the row "estimate" until real invoices arrive. Missing duty rate: stop and ask a customs broker; never guess a duty rate. Writing the final cost into Shopify's "cost per item" needs draft access (level 2) and a client yes.

## Before you start: the gates

1. **One costing rule.** Pass: the store agrees what sits in cost of goods. The rule here: everything until it is on your shelf is in [FIN-0007]. Inbound freight, duty and the retail box are in; outbound shipping, platform fees, ads and storage are below gross profit [FIN-0017]. The retail box is product cost, the plain shipping carton is a shipping cost, even on one invoice [FIN-0008]. Fail: agree it with the client's accountant before filling numbers, and write the choice at the top of the sheet.
2. **Tax status.** Pass: UK, EU, Australia and other VAT or goods and services tax countries: is the store registered and able to reclaim import tax? US: who is importer of record? Fail: ask; it changes whether import VAT is a cost.
3. **Real basis.** Pass: every number is tagged invoice or estimate.

## Steps

### 1. Start from the factory price

Unit price x quantity in the supplier's currency, converted at the rate actually paid plus bank fees. For a quote, add a currency buffer (practitioner default 2 to 3%, test it against the last six months' movement).

Add one-off costs spread over the units in this order: moulds, tooling, printing plates, sample fees not refunded. Spread them over the first order only, and note that later orders will be cheaper.

### 2. Add packaging and inspection

Retail box, inner bags, labels and inserts per unit if bought separately. A pre-shipment inspection is about 200 dollars a visit in one practitioner's sourcing [COG-0006]; divide by units in the lot.

### 3. Add freight and insurance

Split a shared shipment across SKUs by the driver that set the price: volume (cubic metres) for sea and most consolidated freight, chargeable weight for air and courier. Splitting freight by value makes small, heavy items look cheap. Use carton sizes from the supplier's quote.

Chargeable weight is the greater of actual and volume weight: air uses length x width x height in centimetres divided by 6,000 (about 167 kg per cubic metre), express divides by 5,000, and LCL counts 1 cubic metre as 1,000 kg. Container freight per unit = container rate / units that fit: a 20ft holds about 33 cubic metres, a 40ft about 67.7 and a 40ft high cube about 76.4. Move from LCL to a 20ft container once the all-in LCL quote reaches the 20ft price. Small air shipments cost far more per kilo than heavy ones (about 115 dollars per kg at 10 kg against 9 at 300 kg on one Vietnam to US quote), so group air orders.

Check what the Incoterm leaves to you: under EXW, export clearance, terminal and document fees sit with the store; under FOB or FCA the seller pays them. Insurance under CIF is only the minimum cover (Institute Cargo Clauses C); price broader cover if the goods matter.

### 4. Add duty by the destination country's rules

**US:**

- Duty is charged on the price paid to the seller, not including international freight and insurance, plus packing, selling commissions, moulds or tools you supplied, and royalties [COG-6262].
- Rate = the HTS rate for the code plus any additional tariffs in force for that origin on the day of entry. These have changed often since 2025; take them from the broker or the official tariff schedule on the day.
- Duty-free entry for low-value shipments ended for all countries on 29 August 2025, so courier and sample shipments now carry duty too [COG-6261].
- Add the customs processing and harbour fees and the broker fee from the entry summary.
- From 1 October 2026 the merchandise processing fee is 0.3464% of entered value, at least 34.58 and at most 670.86 dollars per formal entry; the harbor maintenance fee is 0.125% of cargo value on ocean freight only, with no cap. Both are charged on the value, not the freight.
- For ocean freight, file the Importer Security Filing at least 24 hours before the cargo is loaded abroad (a late or wrong filing can bring 5,000 dollars in liquidated damages), and hold a customs bond: a continuous bond is the greater of 50,000 dollars or 10% of the last 12 months' duties, taxes and fees.
- Extra duties by origin change often: Chinese goods still carry older Section 301 duties (mostly 25% or 7.5% by list), and since 24 July 2026 a further Section 301 duty applies to goods from China, Vietnam, Turkiye and several other origins, including Mexican goods outside USMCA. Take the total rate for the code and origin from the broker on the day, and recheck any exclusion before costing it in.
- The 800 dollar de minimis exemption is suspended for non-postal shipments and ends by law on 1 July 2027, so every low-value parcel needs an entry.
- A short check: US landed cost per unit = (factory price + freight + insurance + duty on the factory value + MPF + HMF + broker fees + inland delivery) / sellable units.

**UK and EU:**

- Customs duty is charged on the customs value, which includes the goods, freight and insurance to the border; the rate comes from the UK or EU tariff for the HS code and origin. Duty is a cost.
- Import VAT is charged on the customs value plus duty. A VAT-registered store can usually reclaim it (in the UK through postponed VAT accounting); customs duty can never be reclaimed. So import VAT is a cash outlay, not a cost, for a registered store that can reclaim it, and a real cost otherwise. Record it in a separate column either way, since it ties up cash until it is reclaimed.
- Add customs broker fees, port and terminal charges, and transport to the warehouse.
- UK customs value includes freight and insurance up to the UK port or airport, including peak and congestion surcharges; UK inland transport and demurrage can be left out if shown separately. EU customs value works the same way up to the point the goods enter the EU. Import VAT in both is charged on customs value plus duty plus transport to the first destination, so VAT is also charged on the duty.
- To clear goods the business needs an EORI number: a GB EORI for Great Britain (a business not established in the UK appoints someone in the UK for customs) and one EU EORI, from the first member state where it declares, used in every EU country.
- Goods from a country with a UK or EU trade agreement can enter at lower or zero duty, but only with valid proof of origin; ask the supplier for it before shipping.
- Shipping parcels direct to EU buyers from outside the EU: since 1 July 2026 parcels worth 150 euros or less pay a 3 euro customs duty per item (items sharing one tariff code count as one) until 1 July 2028, and a 2 euro handling fee per item is expected from 1 November 2026. UK parcels of 135 pounds or less pay no duty today, but that relief is due to end by March 2029.
- Domestic purchases: VAT on the supplier's invoice is reclaimable for a registered store; cost the unit before VAT.

**Australia, Canada and other countries:** the same pattern holds: duty is a cost, and import goods and services tax or sales tax is a cash outlay when the store can reclaim it. Take the duty base and rate from the broker, since some countries charge duty on the factory price and others on the price including freight.

**Classification, everywhere:** only the first 6 digits of a commodity code are the same worldwide; the US, UK and EU add their own, so check the supplier's code in each tariff instead of copying it. The importer carries the duty of care for the code, not the broker or supplier. For a high-volume SKU, a binding ruling fixes the code before you ship: CBP rulings usually arrive within 30 days; an HMRC Advance Tariff Ruling takes 30 to 120 days; an EU Binding Tariff Information decision is issued within 120 days and lasts 3 years. The commercial invoice must show any assists, such as moulds you paid for that are not in the unit price.

### 5. Add a defect allowance

Bulk orders have defects: 300 of 10,000 in one jewellery order [COG-0009]. Divide total cost by sellable units, not ordered units. Use the last inspection's defect rate; for a first order with no data, use 3% and say it is an assumption (practitioner default from that case, test it).

When the go or no-go is close, show two cases side by side (3% and 10% defects) so the owner sees how much the decision depends on quality.

### 6. Total, then check against the ceiling

Landed cost per sellable unit = sum of all lines / sellable units.

Ceiling (worked backwards): selling price, minus discounts and VAT, goods and services tax or sales tax inside the price, minus the gross profit the store needs per order, minus outbound shipping, pick and pack, payment fees, marketplace fees and returns allowance. Product margin is not gross margin: one tee with a 30 dollar unit cost read 70% margin but earned 24% after freight-in, shipping, pick-pack, fees and allowances [MEA-0023]. Gross margin must be counted at the customer's door [MEA-0037]; hand the landed cost to `store-meta-math` for that step.

If landed cost is above the ceiling, show which line to attack first (usually freight mode, duty classification, order size or packaging) and hand it to `negotiate-moq-and-price`.

Stress test before any first order: raise landed cost by 10% and check the margin still clears the floor. If it does not, the product has no room for a freight spike or a tariff change; take it to `cost-down-levers-with-return-risk` and set trigger lines in `cost-trigger-rules`.

### 7. Update after landing

When real invoices arrive, replace estimates, recompute, and update Shopify's cost per item for each variant (with the client's yes). Note the change from the estimate. Returns that are repackaged for resale add that labour and material to cost of goods, while return shipping stays an overhead [FIN-0009].

## Checks before you hand it over

- The costing rule is written at the top and matches the accountant's.
- Every line is tagged invoice or estimate.
- Freight is split by volume or weight, not by value.
- Duty is on the right base for the country, with the rate's source and date.
- Import VAT or goods and services tax sits in its own column and is a cost only when it cannot be reclaimed.
- Cost is divided by sellable units after the defect allowance.
- Tooling is spread over a stated number of units.
- The ceiling and the gap to it are shown.
- Freight per unit uses chargeable weight or container fill, with the rate's date.
- A 10% stress test is shown for any first order.

## Output

**One-screen summary:** landed cost per unit for each SKU, the ceiling from the selling price, the gap, the biggest three cost lines, and what changed since the last shipment.

**Landed cost sheet (one row per SKU per shipment):**

| SKU | Shipment ref | Units ordered | Sellable units | Currency and rate | Factory price per unit | Tooling per unit | Packaging and inserts per unit | Inspection per unit | Freight per unit | Insurance per unit | Duty and tariffs per unit | Clearance, port and broker per unit | Inland transport per unit | Defect allowance per unit | Landed cost per unit | Import VAT or recoverable tax per unit | Invoice or estimate | Date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Ceiling block:**

| Selling price | Less tax in price | Less target gross profit | Less outbound shipping and pick-pack | Less fees | Less returns allowance | Ceiling landed cost | Actual landed cost | Gap |
|---|---|---|---|---|---|---|---|---|

**File:** `landed-cost.csv` or a Google Sheet with live formulas, one tab per shipment.

## Common mistakes

- **Using the factory price as cost.** Steps 2 to 5 add every cost to the shelf.
- **Freight split by value.** Step 3 splits by volume or weight.
- **Treating import VAT as a cost (or as free).** Step 4 depends on registration and reclaim.
- **US duty on the freight-inclusive price.** Step 4 uses the right base.
- **Dividing by units ordered.** Step 5 divides by sellable units.
- **Never updating.** Step 7 replaces estimates with invoices after each landing.
- **Copying the supplier's commodity code.** Step 4 checks it in each market's tariff.
- **Comparing EXW with FOB as if equal.** Step 3 adds the origin charges.

## Sources

- COG-0006: about 200 dollars per pre-shipment inspection.
- COG-0009: defects in bulk orders, 300 of 10,000.
- FIN-0007: all in until it is on the shelf.
- FIN-0008: retail box is product cost, shipping carton is shipping cost.
- FIN-0009: refurbishing returns is cost of goods, return shipping is overhead.
- FIN-0017: inbound freight, duty and packaging sit in cost of goods.
- MEA-0023: product margin is not gross margin.
- MEA-0037: count gross margin at the customer's door.
- COG-6261 (proposed): US de minimis ended August 2025.
- COG-6262 (proposed): US duty base excludes international freight, adds packing and assists.
- Freightos, Chargeable and Volumetric Weight Calculator: https://www.freightos.com/freight-resources/chargeable-and-volumetric-weight-calculator-freightos/
- Maersk, Cargo weight limit and container capacity: https://www.maersk.com/support/faqs/cargo-weight-limit
- Flexport, Should I ship by LCL or FCL?: https://www.flexport.com/help/lcl-vs-fcl/
- Freightos, Shipping From Vietnam to United States (November 2026): https://www.freightos.com/shipping-routes/shipping-from-vietnam-to-the-united-states/
- Flexport glossary, Origin Charges: https://www.flexport.com/glossary/origin-charges
- ICC, Differences between Incoterms 2010 and 2020: https://library.iccwbo.org/clp/clp-incoterms-2020vs2010.htm
- CBP Dec. 26-14, Customs User Fees for Fiscal Year 2027: https://public-inspection.federalregister.gov/2026-15530.pdf
- eCFR, 19 CFR 24.24 Harbor maintenance fee: https://www.ecfr.gov/current/title-19/chapter-I/part-24/section-24.24
- CBP, Importer Security Filing FAQ: https://www.cbp.gov/sites/default/files/assets/documents/2023-May/ISF%20FAQ%202.0%20%28508%29.pdf
- CBP, How CBP Sets Bond Amounts: https://www.cbp.gov/sites/default/files/assets/documents/2024-Feb/FINAL_A%20Guide%20for%20the%20Public_How%20CBP%20Sets%20Bond%20Amounts%20(February%202024)%20(Not%20Secured).pdf
- CBP CSMS #69326983, Section 301 Forced Labor Import Duties: https://content.govdelivery.com/accounts/USDHSCBP/bulletins/421d887
- USTR, China Section 301 four-year review: https://ustr.gov/trade-topics/enforcement/section-301-investigations/section-301-china-technology-transfer/china-section-301-tariff-actions-and-exclusion-process/four-year-review
- CBP Dec. 26-12, Indefinite Suspension of the De Minimis Exemption: https://public-inspection.federalregister.gov/2026-12670.pdf
- GOV.UK, Delivery costs to include in the customs value: https://www.gov.uk/guidance/delivery-costs-to-include-in-the-customs-value
- GOV.UK, Working out the VAT value of imported goods: https://www.gov.uk/guidance/working-out-the-vat-value-using-the-customs-value-of-the-imported-goods
- GOV.UK, Get an EORI number: https://www.gov.uk/eori
- European Commission, Customs Valuation Quick Info: https://taxation-customs.ec.europa.eu/document/download/b6388552-f370-47a2-b017-f7d2af3a2078_en
- European Commission, EORI number: https://taxation-customs.ec.europa.eu/customs/customs-procedures-import-and-export/customs-procedures/economic-operators-registration-and-identification-number-eori_en
- European Commission, EUR 3 customs duty per item on low-value e-commerce consignments: https://trade.ec.europa.eu/access-to-markets/en/news/eu-applies-eu3-customs-duty-item-low-value-e-commerce-consignments
- GOV.UK, Reforming the customs treatment of low value imports: https://assets.publishing.service.gov.uk/media/692576c7aca6213a492dcfda/FINAL_-_Reforming_the_customs_treatment_of_low_value_imports_into_the_United_Kingdom.pdf
- GOV.UK, Finding commodity codes: https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports
- CBP, eRuling requirements: https://www.cbp.gov/trade/rulings/eruling-requirements
- eCFR, 19 CFR 141.86 Contents of invoices: https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-F/section-141.86

What makes this skill ours: freight is split by what set its price; import VAT is kept in its own column because it is cash, not cost, for a registered store; US duty uses the transaction value base; cost is divided by sellable units after defects; and the same sheet runs backwards from the selling price so every quote meets a ceiling.

## Selling in India

- Basic customs duty and any surcharge on it are a cost. IGST is charged on the assessable value plus customs duty; a GST-registered store can take it back as input tax credit, but basic customs duty never comes back [COG-6260]. Keep IGST in its own column.
- Use the bill of entry and the HSN code. Add customs house agent fees and container freight station charges.
- Domestic purchases: cost the unit ex-GST if the store can claim credit.
- Source: COG-6260 (proposed), IGST creditable, customs duty not.
