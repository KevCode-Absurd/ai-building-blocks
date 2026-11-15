---
name: bom-version-log-and-cogs-rollup
description: "A living bill of materials for every SKU: one line per part with material, quantity, scrap allowance, unit price, supplier, quote date and source, a version log that records every price change with its date, reason and approver, and a COGS per SKU tab (factory price, tooling spread per unit, packaging, scrap) that the profit sheet, landed cost and Shopify cost per item all read from. Use when a new quote, cost-down, supplier switch, tooling buy or packaging change lands, when Shopify profit reports look wrong, or before a price, budget or reorder decision that needs today's true product cost."
---

# Living BOM with a COGS roll-up per SKU

**You get:** one versioned BOM file (a Google Sheet or CSV) with a line per component per SKU, a dated log of every price change, a COGS per SKU tab with factory price, tooling spread, packaging and scrap, a list of SKUs whose Shopify cost per item is out of date, and the hand-offs to the profit sheet and landed cost.

## When to use

- A supplier sends a new quote, a price rise or a price break.
- A cost-down, material swap, packaging change or supplier switch is approved.
- New tooling or moulds are bought and need spreading over units.
- Shopify profit reports, the SKU profit sheet and the accountant's COGS disagree.
- A price change, ad budget or big reorder needs today's product cost, not last year's.
- The brand has no BOM at all and the factory price is one number nobody can explain.

## Not for

- Building a should-cost and target price per line: that is Douglas's should-cost work, which reads this file; for the supplier talks use `negotiate-moq-and-price`.
- Freight, duty and landed cost per unit: use `calculate-landed-cost-per-unit`.
- Forecasting where costs are heading: use `cogs-forecast-three-cases`.
- Profit per product after ads, returns and fees: use `build-sku-profit-sheet`.
- Writing the factory spec: use `write-product-spec-sheet-for-factory`.

## What you need

Required (read access, level 1):

1. **Product list** from Shopify or the catalogue: SKU, variant, title, current cost per item, status (active, draft, archived).
2. **Supplier quotes and invoices** for each SKU, with date, currency, quantity break and Incoterm.
3. **The spec or tech pack** for each product: materials, weights or quantities per unit, trims, labels, inserts and packaging.
4. **Tooling and mould invoices**, with the expected lifetime units of each tool.
5. **Owner's rules:** who approves a price change, and the currency the books use.

Optional: a factory cost breakdown (materials, labour, overhead, margin), scrap or defect rates from past runs, the last two purchase orders per SKU.

Drafting the file is level 2. Writing new cost per item values into Shopify is a publish step (level 3) and needs the owner's yes each time.

## Before you start: the gates

1. **One key per SKU.** Pass when every active SKU has a unique code and barcode in the catalogue. Fail: list duplicates and blanks first; two variants sharing one SKU or barcode will mix costs, stock and orders. Fix the catalogue before building the BOM.
2. **A dated source for each price.** Pass when every price you will enter has a quote, invoice or PO with a date. Fail: mark the line "estimate" with who gave it; never type a remembered price as fact.
3. **Same basis.** Pass when you know each price's currency, quantity break and Incoterm. Fail: ask the supplier; an EXW price and an FCA or FOB price for the same part are not the same number [COG-6296, COG-6297].

## Steps

### 1. Set up the file

Four tabs:

- **BOM lines:** SKU, level (finished good, sub-assembly, component), component, material, spec (gauge, GSM, grade, Pantone), quantity per unit, unit of measure, scrap rate, quantity with scrap, unit price, currency, price basis (Incoterm and break), supplier, sub-supplier, quote date, source document, line cost, version.
- **Version log:** date, SKU, component, old price, new price, change in money and percent, reason (new quote, cost-down, switch, FX, tooling, error fix), source, approved by.
- **Tooling:** tool ID, SKU, supplier, cost, date paid, who owns it (in writing or not), expected lifetime units, units made so far, spread per unit.
- **COGS per SKU:** the roll-up in step 5.

Keep one tab per purpose and never overwrite a price: a change is a new row in the log and a new version number on the line.

### 2. Break each SKU into lines

From the spec, list every part that ends up in or on the product: main materials, trims and hardware, labels and care labels, inserts, the retail box or bag. Put the plain shipping carton on its own line marked "outbound" because it is a shipping cost, not product cost [FIN-0008]. A tech pack line that names a Pantone code, stitch type or gauge makes the BOM line checkable later.

If the factory will share a breakdown, ask for components, sub-suppliers, labour, overhead and factory margin as separate lines; above about $1M a year of COGS this is normal practice and shows hidden margin [COG-0001]. For cut and sew, the order of build is materials, then cut and make, overhead, outsourced steps, logistics, then factory profit and any agent commission [COG-6299].

### 3. Gross up for scrap

Quantity with scrap = quantity per unit x (1 + scrap rate). 100 pieces at 10% scrap means buying and costing 110 [COG-6320]. Scrap compounds across levels: 10% assembly scrap then 10% component scrap on 200 units needs 242 components, not 240 [COG-6321]. Do not load assembly scrap onto parts fitted after faulty units are pulled out [COG-6322]. Where the factory gives no scrap rate, use the defect rate from past inspections and mark it "estimate".

### 4. Spread tooling and one-off costs

Tooling spread per unit = tool cost / expected lifetime units. Use the factory's stated mould life, or the units you expect to sell over the product's life if that is lower. Record who owns each tool; an invoice that says "mould fee" does not prove ownership, so ask for a tooling schedule with photos and ID numbers. Once a tool's planned units are reached, its spread drops to zero and COGS falls: log that as a change too.

### 5. Roll up COGS per SKU

COGS per SKU tab columns: SKU, materials, labour and conversion (if known), overhead and factory margin (if known), factory price per unit, tooling spread, retail packaging, scrap allowance, product cost (ex freight and duty), currency, version, date, change vs last version (money and percent), gross margin at current price.

- Product cost = sum of BOM line costs with scrap + tooling spread + retail packaging, or the factory's unit price + tooling spread + any parts you buy yourself.
- Check the roll-up against the last invoice: if the BOM total and the invoiced price differ by more than 3%, find the line that explains it before anyone uses the number.
- Rank lines by share of cost per SKU. Cost-down work goes to the top lines first; in a textbook knife the bought-in blade is about 87% of factory cost and the moulded handle about 8% [COG-6304].

### 6. Hand the numbers on

- **Landed cost:** send product cost per SKU to `calculate-landed-cost-per-unit`, where freight, duty, fees and FX are added. Full landed cost, not factory price, is what COGS should be; a 2 to 3 point COGS error on a $20M brand can wipe about $500K of profit [COG-6293].
- **Shopify cost per item:** Shopify reports profit only for variants that had a cost per item when they sold, and it keeps that cost as a snapshot, so enter landed cost before launch and update it with each new PO [MEA-6402]. List the SKUs whose Shopify cost is more than 2% off the new landed cost, and ask the owner before writing any change.
- **Profit sheet:** send the dated COGS table to `build-sku-profit-sheet` and the radek-unit-economics agent.

### 7. Keep it alive

Run this file on every new quote, invoice that differs from the quote, approved cost-down, packaging change, supplier switch or tooling buy. Once a month, compare the last invoices with the BOM and log any drift. Once a quarter, review every line older than 12 months and ask for a fresh quote on the top three cost lines per SKU.

## Checks before you hand it over

- Every active SKU has a unique code; duplicates are listed for the owner.
- Every price has a date, a source document and a basis (currency, break, Incoterm).
- Scrap is grossed up level by level, not added once at the end.
- Tooling is spread over stated lifetime units, with ownership recorded.
- The shipping carton sits outside product cost.
- The BOM roll-up is within 3% of the last invoice, or the gap is explained.
- Every price change has a log row with reason and approver.
- No Shopify cost per item was changed without the owner's yes.

## Output

1. **BOM file** with the four tabs above, version numbered.
2. **COGS per SKU table:** SKU, product cost, tooling spread, packaging, scrap, version, date, change vs last version, gross margin at current price.
3. **Change note** for this update: what moved, by how much per unit and per year at forecast volume, and why.
4. **Shopify cost update list:** SKU, current cost per item, new landed cost, difference, for the owner to approve.
5. **Open questions** for suppliers: missing breakdowns, estimate lines, tooling ownership.

## Common mistakes

- **Overwriting old prices.** Step 1 logs every change as a new row so history survives.
- **Mixing price bases.** Gate 3 makes currency, break and Incoterm part of each line.
- **Adding scrap once at the end.** Step 3 applies it per level.
- **Forgetting tooling.** Step 4 spreads it and drops it when the tool is paid off.
- **Putting the shipping carton in COGS.** Step 2 keeps it as an outbound cost.
- **Stale Shopify costs.** Step 6 flags every SKU more than 2% off.

## Sources

- COG-0001: ask factories for a full cost breakdown above about $1M a year of COGS.
- COG-6299: garment FOB build order (materials, cut and make, overhead, profit, commission).
- COG-6304: rank BOM lines by cost before cost-down work.
- COG-6320, COG-6321, COG-6322: scrap gross-up and how it compounds across levels.
- COG-6296, COG-6297: EXW, FCA and FOB price bases.
- COG-6293: use full landed cost by SKU as product cost.
- MEA-6402: Shopify profit needs a cost per item at the time of sale.
- FIN-0008: retail box is COGS, shipping carton is a shipping cost.
- Library item: Duplicate SKU finder (adapted from shopify-admin-duplicate-sku-barcode-detector by 40rty AI, MIT, https://github.com/40rty-ai/shopify-admin-skills/tree/main/skills/merchandising/shopify-admin-duplicate-sku-barcode-detector), used for the one-key-per-SKU gate.
- Web sources: SAP Help, "Component Scrap" (https://help.sap.com/doc/6297d7531a4d414de10000000a174cb4/1610%20002/en-US/d195d7531a4d414de10000000a174cb4.html); Shopify Help Center, "Profit reports" (https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/profit-reports); Harris Sliwoski, "Who Owns Your Molds?" (https://harris-sliwoski.com/chinalawblog/who-owns-your-molds-how-overseas-factories-hold-tooling-hostage-and-how-to-stop-them/).

What makes this skill ours: every price carries a date, source and basis, scrap is grossed up level by level, tooling spreads drop off when paid, the roll-up is checked against the last invoice, and Shopify's cost per item is kept in step so profit reports stay true.
