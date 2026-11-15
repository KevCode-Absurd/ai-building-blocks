---
name: should-cost-model-per-bom-line
description: "A should-cost sheet with one row per bill of materials line: material quantity grossed up for scrap, the market price with its named source and date, conversion (machine time or sewing minutes), overhead, outsourced steps and a fair factory margin, set against the quoted price, with the gap in money and percent, the likely reason, and a target price with a walk-away range for the next talk. Use when you have a BOM or supplier quotes and want to know what each part should cost before the next order or negotiation, when a supplier asks for a price rise, or when you think you overpay but cannot say by how much."
---

# Should-cost for every part of your product

**You get:** a should-cost sheet (one row per BOM line per SKU) with every number sourced and dated, a quote gap table ranked by money at stake, a target price and walk-away range per line, and a version log, ready for `negotiate-moq-and-price` and for the COGS feed to the profit sheet.

## When to use

- A factory quote arrives and the owner wants to know if each part is fairly priced.
- A supplier asks for a price rise "because materials went up".
- The store has 3 or more quotes that differ by more than about 20% and nobody knows why.
- Before a yearly price review with a long-standing factory.
- A new SKU is being costed before the first sample.

## Not for

- Getting goods to the warehouse (freight, duty, insurance): use `calculate-landed-cost-per-unit`.
- Finding cheaper ways to make the product: use `cost-down-levers-with-return-risk` (this sheet feeds it).
- Running the talk itself: use `negotiate-moq-and-price` with Wenhao.
- Tracking price moves every week: use `weekly-cost-watch-routine`.
- Writing the spec the BOM comes from: use `write-product-spec-sheet-for-factory`.

## What you need

Required:

1. **The BOM or the spec** with every part, material, grade and weight. If there is no BOM, a sample to take apart and photograph, part by part.
2. **At least one factory quote** with the unit (per piece, per set), the quantity it is priced for, the Incoterm and the currency.
3. **Yearly units per SKU**, so a cent of saving can be shown as money per year.

Optional: competing quotes (more than 5 shows the market price; about 20 shows it well, if all quote the same spec, quantity, packing and Incoterm), a cost breakdown from the factory, the factory's country and city, past invoices.

Access: Douglas reads the BOM in Google Sheets, Excel or CSV at the access the owner grants (level 1) and drafts the sheet (level 2). Target prices are not shared with any supplier without the owner's yes.

## Before you start: the gates

1. **Quote is comparable.** Pass: unit, quantity, Incoterm and currency are written on the quote. Fail: ask the supplier for them before you build a row; a should-cost against an unknown basis is a guess.
2. **Spec is fixed.** Pass: the BOM names material, grade and weight for every part. Fail: send it back to Maxine (`write-product-spec-sheet-for-factory`); you cannot price "good quality plastic".
3. **Worth the effort.** Pass: the SKU sells enough that a 5% cut is worth an afternoon. Below that, cost only the top 3 lines and say so.

## Steps

### 1. Rank the lines by cost before you price anything

List every line with its quoted or estimated cost and sort high to low. A few lines carry most of the cost: in a textbook pocket knife, the bought-in blade was about 87% of factory cost and the moulded handle about 8%. Put your effort on the top lines that make up about 80% of cost. Every other line gets a quick check only.

### 2. Gross up each material quantity for scrap

Required quantity x (1 + scrap rate). 100 pieces at 10% component scrap means costing 110. Scrap compounds across levels: 10% assembly scrap then 10% component scrap on 200 units needs 242 components, not 240. Do not load assembly scrap onto parts fitted after faulty units are pulled out; in one example 1,000 units at 10% assembly scrap needed 1,100 of an early part but only 1,010 of a late part. Take scrap rates from the factory or past invoices; if none, write "assumed" beside the rate.

### 3. Price each material from a named series, with its date

| Material | Where to look | Note |
|---|---|---|
| Cotton, rubber, aluminium, copper, zinc, nickel, tin, plywood | World Bank Pink Sheet (monthly, first business days of the month) | No steel, resin or pulp series |
| Metals, pulp and paper a Chinese factory buys in yuan | Shanghai Futures Exchange prices | Free data delayed 30 minutes |
| PP, LLDPE, PVC bought in China | Dalian Commodity Exchange, including monthly average contracts | Good base for index-linked quotes |
| US-made resin, cartons, steel | US producer price indexes (FRED) | Direction only for overseas factories |
| Anything with no public price | Two or three fresh sub-vendor quotes | Date each one |

Write the series name, the value, the unit and the date in the row. Convert at the rate on that date and name the rate source. Never use a number with no source; mark it "unknown" and say what would find it.

### 4. Add conversion the way the factory works

- **Moulded parts:** resin (part weight x waste factor x price) plus machine time (hourly press rate / parts per hour) plus tooling (mould cost / lifetime units). For small parts, press time, not resin, is usually the big cost: about 86% of the knife handle's moulded cost was machine time.
- **Cut and sew:** working minute cost x standard minutes for the style / line efficiency. An 18-minute polo sewn at 60% efficiency takes 30 real minutes, so efficiency moves labour cost as much as wages do.
- **Assembly and packing:** minutes per unit x minute cost.
- **Outsourced steps:** printing, plating, embroidery, each as its own line.

### 5. Add overhead, logistics to the price point, and a fair margin

Build up in a fixed order: materials, conversion, overhead, outsourced steps, transport to the quoted Incoterm point, then factory profit and any agent commission. In one public garment costing, materials were 1.35 dollars, total cost about 1.75, factory profit 10% and a buying agent 3%, for an FOB of about 1.98. Use the factory's category and country to set the margin, mark it "assumed" unless you have evidence, and keep margin (share of price) and mark-up (share of cost) apart.

### 6. Set should-cost against the quote, line by line

For each line: should-cost, quoted price, gap in money, gap in percent, money per year at planned volume, and the likely reason. Read the gap like this:

- Gap in materials: check consumption, scrap and grade.
- Gap in conversion: check minutes, efficiency and press rate.
- Gap at the bottom: margin, or an agent you cannot see.
- Quote far below should-cost: a warning, not a win. Factories filling idle lines or short of cash tend to cut material or checks after you commit.

House bands (test them): under 5% is fair, 5 to 15% is an ask, over 15% is a dig with a question to the factory.

### 7. Set a target and a walk-away range

- **Target:** should-cost plus the fair margin from step 5.
- **Fallback:** the middle competing quote on the same basis.
- **Walk-away:** the landed-cost ceiling from `calculate-landed-cost-per-unit`, or the best vetted competing quote, whichever is lower.

Give Wenhao one question per gap line, for example "Our material estimate is 0.42 dollars at 38 grams of PP at the Dalian monthly average; your line shows 0.61. What grade and weight are you using?"

### 8. Version it and feed the profit sheet

Every price change gets a date, a source and a version number. Hand a dated COGS table per SKU (factory price, tooling spread and packaging) to Radek (`build-sku-profit-sheet`) and to Zhenyu for landed cost.

## Checks before you hand it over

- Every number has a source and a date, or is marked "unknown" or "assumed".
- Scrap is grossed up per level, not added once at the end.
- Lines are ranked by cost and the top 80% were priced in full.
- The rows add up to the quote, and any gap is named.
- A quote far below should-cost is flagged as a risk, not praised.
- Margin and mark-up are not mixed.
- No target price was shared with a supplier without the owner's yes.

## Output

**One-screen summary:** quoted unit price, should-cost, total gap per unit and per year, the three lines with the most money at stake, and the first question for the factory.

**Should-cost sheet (`should-cost.csv` or a Google Sheet tab):**

| SKU | Line | Material and grade | Net qty | Scrap % | Gross qty | Price series, value, date | Material cost | Conversion | Overhead | Outsourced | Margin | Should-cost | Quoted | Gap | Gap % | Money per year | Likely reason | Target | Walk-away | Source tags |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Version log:** version, date, line changed, old value, new value, source.

## Common mistakes

- **Pricing every line in detail.** Step 1 ranks first and spends time on the big lines.
- **Adding scrap once at the end.** Step 2 compounds it by level.
- **Using a US index for a Chinese factory's input.** Step 3 picks the market the factory buys in.
- **Ignoring machine time.** Step 4 shows it can be most of a moulded part's cost.
- **Cheering a quote below should-cost.** Step 6 treats it as a quality risk.
- **Sharing the target too early.** Step 7 keeps it with the owner until the shortlist.

## Sources

- COG-0001: break each SKU into components, labour, overhead and margin once COGS is large.
- COG-0002: price breaks per BOM line around how fully the factory uses your line.
- COG-0010: bulk tiers move unit cost sharply.
- COG-0011: weights in the spec let you catch a quiet material cut.
- COG-6293: use full landed cost and the live exchange rate as product cost.
- Fair Wear, Guidance for Use of the Labour Minute and Product Costing Calculator: https://api.fairwear.org/wp-content/uploads/2020/06/Guidance-for-Use-of-the-Fair-Wear-Labour-and-Minute-and-Product-Costing-Calculator-Final.pdf
- SAP Help, Component Scrap and Operation Scrap examples: https://help.sap.com/doc/6297d7531a4d414de10000000a174cb4/1610%20002/en-US/d195d7531a4d414de10000000a174cb4.html
- BYU-Idaho, Case Study 12.1: Estimating the Cost of an Injection-Molded Pocket Knife: https://books.byui.edu/docx/11048
- World Bank, Commodity Markets (Pink Sheet): https://www.worldbank.org/en/research/commodity-markets
- Shanghai Futures Exchange, products and market data: https://www.shfe.com.cn/eng/
- QualityInspection.org, China Supplier Vetting Part 10: Pricing, Negotiation, Contracts: https://qualityinspection.org/pricing-negotiation-contracts/
- QualityInspection.org, When a Chinese Factory Quote Is Too Low: https://qualityinspection.org/when-a-chinese-factory-quote-is-too-low-the-hidden-risks-for-buyers/

What makes this skill ours: lines are ranked before they are priced; every material price names the market the factory really buys in, with a date; scrap compounds by level; conversion is built the factory's way (press time or sewing minutes); a quote below should-cost is read as a risk; and each gap becomes one exact question for the negotiator.
