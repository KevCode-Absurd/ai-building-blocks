---
name: hs-code-and-duty-research
description: "A duty research sheet for each product and import market: the product described the way customs reads it, the likely HS code worked through the classification rules in order, the national tariff line, the duty rate and any added duties with the official source and date, the value the duty is charged on, other import fees and taxes, the duty per unit, a confidence grade, and a flag for broker review or a binding ruling where the code is unclear. Use before the first import of a product into a market, before costing a new product, after a supplier sends a code you have not checked, or after a duty bill that did not match the plan."
---

# HS code and duty research per product

**You get:** one row per product per import market with a plain customs description, the likely code and how it was reached, the tariff line, duty rate, added duties, the value it is charged on, other fees and import taxes, duty per unit, the official source and date, a confidence grade, and the questions for your licensed customs broker.

## When to use

- A new product is about to ship to a market for the first time.
- A new product is being costed and duty is still a guess.
- A supplier or forwarder gave you a code and nobody checked it against your own tariff.
- A duty bill came in higher or lower than planned.
- A tariff change was announced and you need to know which SKUs it hits.

## Not for

- Filing the entry or giving a legally binding code: a licensed customs broker files, and only customs can bind a code.
- Full landed cost per unit: use `calculate-landed-cost-per-unit`, which reads this sheet.
- The registrations you need before stock lands: use `import-registration-by-market`.
- Forecasting future duty and cost moves: use `cogs-forecast-three-cases`.
- Product safety certificates and labels: use `order-samples-and-quality-check` and the compliance agent meenakshi-compliance.

## What you need

Required (read access, level 1):

1. **Product facts per SKU:** what it is, what it does, how it is used, materials with share by weight, how it is made, whether it is sold as a set, and photos.
2. **Country of origin:** where the product was last substantially made, not where it shipped from.
3. **The commercial invoice terms:** price, currency, Incoterm, and any assists you supply (moulds, artwork, parts).
4. **Import markets:** which countries the stock will enter and by which mode (ocean, air, post or express).
5. **Codes already in use:** the supplier's export code, the forwarder's or broker's code, and past entry papers if any.

Optional: a recent duty bill or entry summary, spec sheets, lab reports showing material content.

Research and drafting are level 1 and 2. Sending a ruling request to customs or telling the broker which code to file needs the owner's yes.

## Before you start: the gates

1. **Facts, not names.** Pass when you know material content by weight, function and use for every SKU. Fail: ask for them; customs classifies what a product is and does, not its marketing name, and a "travel organiser" can be a bag, a box or a textile article.
2. **Origin is clear.** Pass when origin is stated with the factory location. Fail: ask the supplier; origin decides added duties and any preferential rate.
3. **One market at a time.** Pass when each row names a single import market. Fail: split it; only the first 6 digits of a code match worldwide, and the US, UK and EU each add their own digits [OPS-6685].

## Steps

### 1. Describe the product the way customs reads it

Write one line per SKU: what it is, main material with percent by weight, function, how it is used, and whether it comes as a set. Example: "Pillowcase, woven, 100% linen, for household bed use, sold singly." Note anything that changes the code: a battery, a motor, a coating, a mix of materials, a gift set.

### 2. Work out the first 6 digits with the rules in order

Use the General Rules of Interpretation in order: heading words and the section and chapter notes first (GRI 1), then the rules for unfinished goods, mixtures and sets (GRI 2 and 3), and subheadings last (GRI 6) [OPS-6670]. Write down which heading you chose, which notes you read and which headings you ruled out, so the broker can check your reasoning. Where two headings could fit, list both.

### 3. Find the national line in each market's own tariff

Look up the full code and rate in the official tariff for each market, and record the link and the date you checked:

- **United States:** the Harmonized Tariff Schedule (10 digits) on hts.usitc.gov.
- **United Kingdom:** the UK Trade Tariff (10 digits) on gov.uk.
- **European Union:** TARIC (10 digits) on the European Commission site.
- **Canada:** the Customs Tariff from the Canada Border Services Agency.
- **Australia:** the Working Tariff from the Australian Border Force.

Never copy a supplier's export code into your import tariff without checking it there [OPS-6685].

### 4. Add the extra duties

Check each market for duties on top of the normal rate, with the legal notice and date:

- **United States:** China Section 301 duties of mostly 25% on Lists 1 to 3 and 7.5% on List 4A [OPS-6677]; a 12.5% Section 301 duty on goods from China, Vietnam and Turkiye since 24 July 2026 [OPS-6634]; check whether any product exclusion still applies, as the last extension ran only to 9 November 2026 [OPS-6662]; check anti-dumping and countervailing duty orders for your product and origin.
- **United Kingdom and European Union:** check trade remedy duties on the tariff line, and whether a preferential rate applies. In the UK, goods from a trade agreement partner or under the Developing Countries Trading Scheme can enter at lower or zero duty only with valid proof of origin [COG-6387].

### 5. Work out the value the duty is charged on

- **United States:** duty is charged on the price paid to the seller, excluding international freight and insurance, plus packing, selling commissions, assists such as moulds you supply, and royalties [COG-6262].
- **European Union:** customs value includes transport and insurance up to the point goods enter the EU, plus commissions, packing and assists [COG-6353].
- **United Kingdom:** customs value includes freight and insurance up to the UK port or airport, including peak and congestion surcharges [COG-6386].

### 6. Add the other fees and import taxes

- **United States:** merchandise processing fee of 0.3464% of entered value, with a minimum and maximum per formal entry [OPS-6648]; harbor maintenance fee of 0.125% on ocean cargo only [OPS-6676]. Duty-free de minimis entry has been suspended for non-postal modes [OPS-6647].
- **United Kingdom:** import VAT on customs value plus duty plus delivery to the first UK destination [FIN-6441]; a VAT-registered importer can use postponed VAT accounting [FIN-6440].
- **European Union:** import VAT on customs value plus duties plus transport to the first destination [FIN-6439]; low-value parcels of €150 or less carry a €3 duty per item from 1 July 2026 [OPS-6658].
- **Canada and Australia:** note the national goods and services tax at import and any provincial sales tax in Canada, for the accountant.

### 7. Work out duty per unit

Duty per unit = duty value per unit x (normal rate + added duties). Then add fees per unit at the planned shipment size. Show the result as money per unit and as a percent of factory price. Hand it to `calculate-landed-cost-per-unit`.

### 8. Grade confidence and decide on a ruling

- **High:** one heading clearly fits, the broker agrees, past entries used it.
- **Medium:** one heading fits but a note or material share could change it.
- **Low:** two or more headings could fit, or the duty gap between them is large.

For medium or low on a product you will import often, ask for a binding ruling before the goods ship: a US CBP ruling through eRulings usually arrives within 30 days and must be asked for before shipping [OPS-6671]; a UK Advance Tariff Ruling takes 30 to 120 days and must be asked for before clearance [OPS-6684]; an EU Binding Tariff Information decision is valid 3 years in every EU state and is issued within 120 days [OPS-6657].

### 9. If a duty bill did not match

Line up the entry summary against this sheet: code filed, value declared, origin, rate applied, added duties. Mark each difference as the broker's choice, a value error or a rate change. In the US the importer of record, not the broker or supplier, carries the duty of reasonable care, and disclosing an error first can cut the penalty to interest [OPS-6686]. In the US, IEEPA tariffs paid before they were struck down may be refundable through CBP's process, with time limits after liquidation [FIN-6437]. Send the findings to the broker before anyone files a correction.

## Checks before you hand it over

- Each row names one market, one origin and one product.
- The description uses material, function and use, not the marketing name.
- The code was checked in that market's own tariff, with a link and date.
- Added duties were checked for that origin, with the legal notice and date.
- The value basis matches the market's rule.
- Duty per unit is shown in money and percent of factory price.
- Every medium or low grade has a broker question or a ruling plan.
- Nothing says the code is final; the broker confirms.

## Output

1. **Duty research sheet:** SKU, market, origin, customs description, HS 6 digits, national code, normal rate, added duties, total rate, value basis, fees and import taxes, duty per unit, source link, date checked, confidence, ruling needed (yes or no).
2. **Reasoning note per SKU:** headings considered, notes read, why one was chosen.
3. **Broker question list:** one line per open point.
4. **Ruling plan** for medium and low codes on repeat products: market, body, lead time, date to file by.
5. **Duty bill check** (when a bill did not match): line, filed, expected, difference, cause.

## Common mistakes

- **Using the marketing name.** Step 1 uses material, function and use.
- **Copying the supplier's code.** Step 3 checks it in each import tariff.
- **Missing added duties.** Step 4 checks them by origin.
- **Charging duty on the wrong value.** Step 5 follows each market's rule.
- **Asking for a ruling after the goods ship.** Step 8 times it before.
- **Treating research as a final code.** The broker confirms every code.

## Sources

- OPS-6670: classify with the General Rules of Interpretation in order.
- OPS-6685: only the first 6 digits match worldwide.
- OPS-6677, OPS-6634, OPS-6662: US Section 301 duties and exclusions.
- COG-6387: UK preferential duty needs proof of origin.
- COG-6262, COG-6353, COG-6386: customs value rules in the US, EU and UK.
- OPS-6648, OPS-6676, OPS-6647: US fees and de minimis.
- FIN-6439, FIN-6440, FIN-6441, OPS-6658: EU and UK import VAT and EU low-value duty.
- OPS-6671, OPS-6684, OPS-6657: binding rulings in the US, UK and EU.
- OPS-6686, FIN-6437: US importer liability and IEEPA refunds.
- Web sources: CBP, "What Every Member of the Trade Community Should Know About: Tariff Classification" (https://www.cbp.gov/sites/default/files/documents/icp017r2_3.pdf); GOV.UK, "Finding commodity codes for imports into or exports out of the UK" (https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports); European Commission, "Binding Tariff Information Quick Info" (https://taxation-customs.ec.europa.eu/system/files/2019-03/04_taxud_ucc_binding_tariff_information_quick_info_en.pdf).

What makes this skill ours: each product is described the way customs reads it, the code is worked through the rules in order and checked in each market's own tariff, added duties and the value basis follow that market's law, every row has a dated official source and a confidence grade, and unclear codes get a ruling plan before the goods ship.

## Selling in India

Importing into India? Ishita (ishita-india-commerce) owns India customs, GST and marketplaces; hand those parts to her.

- India adds its own digits to the 6-digit HS code; check the line in the Indian customs tariff, not the supplier's export code.
- Duty is basic customs duty plus IGST, and IGST is charged on assessable value plus customs duties; a GST-registered importer can claim the IGST back as input tax credit, but never the basic customs duty [COG-6260].
