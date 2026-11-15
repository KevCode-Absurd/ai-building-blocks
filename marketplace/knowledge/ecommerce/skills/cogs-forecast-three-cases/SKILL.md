---
name: cogs-forecast-three-cases
description: "A COGS per SKU forecast at 3, 6 and 12 months with base, high and low cases: each BOM line tied to a named public price series (commodity, producer price index, container freight index, exchange rate) with its weight in cost, its lag and how much of a move reaches your invoice, plus duty changes by import market, the gross margin each case leaves at today's price, trigger lines that start a move (buy ahead, reprice, renegotiate, re-source), and a log that scores the last forecast against real invoices. Use before setting prices, a budget or a big buy, after a supplier asks for a price rise, or when freight, currency or tariffs move."
---

# COGS forecast with base, high and low cases

**You get:** a price series map for every BOM line, a COGS per SKU forecast at 3, 6 and 12 months in three cases with the driver behind each, the gross margin each case leaves, duty and tariff changes per import market with their dates, trigger lines with the move and owner for each, and an accuracy log that grades the last forecast against invoices.

## When to use

- Before setting next season's prices, the yearly budget or a big stock buy.
- A supplier asks for a price rise and you want to know if the market backs it.
- Container rates, a key material or your currency against the US dollar moved sharply.
- A tariff or duty change is announced in a market you import into.
- The last forecast was wrong and nobody knows by how much.

## Not for

- Demand and reorder forecasts: use `forecast-demand-per-sku` and `set-reorder-points-and-safety-stock`.
- Today's landed cost per unit: use `calculate-landed-cost-per-unit`.
- Keeping the BOM and its price history: use `bom-version-log-and-cogs-rollup`.
- Finding the right HS code and duty rate: use `hs-code-and-duty-research`.
- Supplier talks: use `negotiate-moq-and-price`.
- Trading, hedging or buying futures: the agent only suggests a talk with the bank.

## What you need

Required (read access, level 1):

1. **The BOM** with cost per line per SKU and the last 12 months of price history (from `bom-version-log-and-cogs-rollup`).
2. **Landed cost per SKU** split into factory price, freight, duty and fees, with the currency each is paid in.
3. **Last 12 to 24 months of supplier invoices**, to measure how fast and how far market moves reached you.
4. **Import markets and the HS code per SKU** for each (from `hs-code-and-duty-research`).
5. **Selling prices** and planned volume per SKU for the next 12 months.

Optional: supplier contracts with any index clause, the bank's FX rate spread, forwarder contract rates.

Pulling public price data and drafting the forecast is level 1 and 2. Repricing, placing a forward buy or signing a contract needs the owner's yes.

## Before you start: the gates

1. **Weights add up.** Pass when BOM lines, freight, duty and fees sum to landed cost per SKU within 3%. Fail: fix the BOM or landed cost first; a forecast on a wrong base is wrong in every case.
2. **A real series for each big line.** Pass when every line above 5% of COGS has a named public series, or is marked "contract price" or "no series". Fail: do not invent a proxy; say "no series" and forecast it flat with a wider band.
3. **Rates you can name.** Pass when every duty rate has an official source and date for its market. Fail: hand to `hs-code-and-duty-research`, and use "broker to confirm" until then.

## Steps

### 1. Map each BOM line to a price series

| Input | Free series to use |
|---|---|
| Cotton | FRED Global price of Cotton (PCOTTINDUSDM), monthly, about three weeks after month end [COG-6307] |
| Woven fabric | US PPI broadwoven fabric mills (PCU313210313210) [COG-6308] |
| Plastic resin | US PPI plastics material and resin (PCU325211325211) [COG-6310]; for Chinese factories, Dalian PP, LLDPE and PVC monthly average futures [COG-6328] |
| Cartons and paper packaging | US PPI corrugated and solid fibre boxes (PCU322211322211) [COG-6309] |
| Metals | World Bank Pink Sheet for aluminium, copper, zinc, nickel and tin [COG-6355]; US steel PPIs only for US-made parts [COG-6311]; Shanghai Futures Exchange for inputs a Chinese factory buys in yuan |
| Goods from China overall | BLS import price index for China (CHNTOT), which excludes duty [COG-6306, COG-6364] |
| Ocean freight | Drewry World Container Index (weekly) [COG-6376] or Freightos Baltic Index (daily) [COG-6382] on your lane |
| Exchange rates | ECB reference rates [COG-6379] or the Fed's H.10 [COG-6380], plus your bank's spread |

For each line record: series name and code, update day, weight in landed cost, the currency you pay in, and the last value with its date. If you can browse, pull the latest value; otherwise ask the owner to paste it. Never type an index value from memory.

### 2. Measure lag and pass-through from your own invoices

Market moves reach a consumer goods factory price slowly and only in part: the ECB estimates about half a year for the first effect and only about a quarter of an input move passed through [COG-6378]. Raw cotton rose about 23% in a year while woven fabric rose 6.5% [COG-6308]. Check this on your invoices: line up each supplier's price changes against its series and note the lag in months and the share passed through. Use your measured numbers where you have three or more price changes; otherwise use the ECB default and say so.

Outside the US, watch your own currency against the US dollar, not the supplier's currency: most Asian goods are invoiced in dollars, and a 1% fall against the dollar lifts import prices about 0.6% to 0.8% within a year.

### 3. Build the base case

For each line: base cost at month h = today's cost x (1 + series change expected by month h minus lag) x pass-through share. For the expected series change use, in order: a contract price or index clause; a published forecast (the World Bank issues price forecasts in April and October); otherwise no change from the latest value. Freight base case = the forwarder's contract rate where one exists; spot index otherwise.

### 4. Build the high and low cases

Use each series' own monthly volatility: for a price that moves like a random walk, the h-month band is plus or minus c x monthly sigma x square root of h, with c = 1.28 for an 80% band [COG-6329]. Compute sigma from 24 to 36 months of monthly changes. Apply the band, then the lag and pass-through, so a short horizon inside the lag shows little change. Add known one-off risks to the high case only when dated: a tariff with an effective date, a carrier surcharge already announced, Chinese New Year capacity.

### 5. Add duty and tariff changes by market

Duty is set by law in each import market, so list each change with its market, legal source, effective date and the SKUs it touches, for the broker to confirm. Examples in force or announced at the time of writing:

- **United States:** a Section 301 duty of 12.5% on goods from China, Vietnam and Turkiye since 24 July 2026, on top of normal duty [OPS-6634]; older China Section 301 duties of mostly 25% (Lists 1 to 3) and 7.5% (List 4A) [OPS-6677]; remaining China exclusions ran only to 9 November 2026 [OPS-6662]; de minimis duty-free entry suspended for non-postal modes [OPS-6647]; merchandise processing fee 0.3464% of entered value within a minimum and maximum per entry [OPS-6648].
- **European Union:** a €3 customs duty per item on parcels of €150 or less from 1 July 2026 to 1 July 2028 [OPS-6658], and a €2 handling fee per item expected from 1 November 2026 [OPS-6656]. Import VAT is charged on customs value plus duty [FIN-6439].
- **United Kingdom:** duty relief on consignments of £135 or less to be removed by March 2029 at the latest [OPS-6631]; import VAT is charged on value plus duty [FIN-6441].

Put each change into the case where it belongs: in force goes in all cases, announced with a date goes in base and high, proposed only goes in high.

### 6. Turn cost into margin per SKU

COGS per SKU per case = sum of line forecasts + freight + duty and fees. Show gross margin at today's selling price in each case, and the price needed to hold today's margin. Flag any SKU whose high case drops gross margin below the owner's floor.

### 7. Set trigger lines and moves

For each big driver set a trigger and the move it starts, with an owner:

- Freight index up 25% in a month on your lane: book the next shipment early or switch mode; owner sheila-inbound-freight.
- A material series up more than one band width in a quarter: ask the supplier for an index-linked clause with a base month, a named series and a weight for each input [COG-6366]; owner wenhao-procurement.
- High case margin below floor on an A product: plan a price review; owner juliet-merchandising.
- A dated tariff on a top SKU: price a second origin; owner zhenyu-sourcing.

### 8. Score the last forecast

Each month or quarter, compare the last forecast for each SKU with the invoiced cost. Record the error, the signed error (bias) and whether the actual fell inside the 80% band. If past errors average a fixed amount, add it back to remove the bias [OPS-6642]. Compare your error with a "no change" forecast; if yours is not better, say so and simplify [OPS-6646].

## Checks before you hand it over

- Every line above 5% of COGS has a named series with code, date and source, or is marked "no series".
- No index value or duty rate was typed from memory.
- Lag and pass-through come from invoices or are labelled as the ECB default.
- Bands widen with horizon and use the series' own volatility.
- Every duty point names its market, source, date and status, and says "broker to confirm".
- Margin per SKU is shown in all three cases at today's price.
- Every trigger has a move and an owner.
- The accuracy log grades the last forecast, including bias.

## Output

1. **Price series map:** BOM line, series and code, update day, weight in landed cost, lag, pass-through, last value and date.
2. **Forecast table:** SKU, case, COGS at 3, 6 and 12 months, gross margin at today's price, price to hold margin, main driver.
3. **Duty watch:** market, change, legal source, effective date, status, SKUs hit, cost per unit if it lands.
4. **Trigger sheet:** driver, trigger line, move, owner, review date.
5. **Accuracy log:** period, SKU, forecast, invoiced, error, bias, inside band (yes or no).
6. **One-paragraph summary** for the owner: what moved, what it does to margin, and the one move to make now.

## Common mistakes

- **Passing a commodity move straight to COGS.** Step 2 applies lag and pass-through.
- **One flat high case of plus 10%.** Step 4 uses each series' volatility and horizon.
- **Using US metal PPIs for overseas parts.** Step 1 limits them to US-made parts.
- **Watching the supplier's currency.** Step 2 watches yours against the dollar.
- **Tariffs from news headlines.** Step 5 needs a legal source, a date and the broker.
- **Never checking the last forecast.** Step 8 grades it.

## Sources

- COG-6306, COG-6307, COG-6308, COG-6309, COG-6310, COG-6311, COG-6328, COG-6355, COG-6364: public price series by input.
- COG-6376, COG-6382: container freight indexes.
- COG-6379, COG-6380: exchange rate sources.
- COG-6378: lag and partial pass-through to factory prices.
- COG-6329: volatility bands for high and low cases.
- COG-6366: index-linked price clauses with fixed weights.
- OPS-6634, OPS-6677, OPS-6662, OPS-6647, OPS-6648: US duty and fee changes.
- OPS-6658, OPS-6656, FIN-6439: EU low-value duty, handling fee and import VAT.
- OPS-6631, FIN-6441: UK low-value relief and import VAT.
- OPS-6642, OPS-6646: bias and the naive benchmark.
- Web sources: IMF, "Patterns in Invoicing Currency in Global Trade" (https://www.imf.org/-/media/files/publications/wp/2020/english/wpiea2020126-print-pdf.pdf); World Bank, "Commodity Markets" (https://www.worldbank.org/en/research/commodity-markets); Shanghai Futures Exchange market data (https://www.shfe.com.cn/eng/); BLS, "Price Adjustment Guide for Contracting Parties" (https://www.bls.gov/ppi/publications/price-adjustment-guide-for-contracting-parties.htm).

What makes this skill ours: every cost line is tied to a named public series with its measured lag and pass-through, the high and low cases come from each series' own volatility, duty changes are listed by market with a legal source and date, every trigger has a move and an owner, and the forecast is graded against real invoices.
