---
name: weekly-cost-watch-routine
description: "A level 1 routine that maps each BOM line to a named public price series (World Bank and IMF commodity prices, China futures prices, producer price indexes, Drewry and Freightos container freight indexes, central bank exchange rates, import price indexes), runs on the schedule you set, and writes a short report: what moved and by how much, cents per unit and margin per SKU, anything past a trigger line, and a base, high and low COGS view for 3, 6 and 12 months. Use when your margin depends on commodity prices, container freight or exchange rates and you want a scheduled check instead of surprises."
---

# Weekly materials, freight and currency watch

**You get:** a price series map for every BOM line, a weekly (or monthly) cost watch report in a fixed format, a running log of readings, and a 3, 6 and 12 month COGS range per SKU that feeds `cost-trigger-rules`.

## When to use

- Margin swings with metal, cotton, resin, pulp or paper prices.
- The store imports by container and freight rates have jumped before.
- The supplier quotes in a currency other than the one the store sells in.
- A supplier asked for a price rise and the owner wants to test it against the market.
- Tariffs or duties in an import market are under review.

## Not for

- Building the BOM or should-cost: Douglas owns it (`should-cost-model-per-bom-line`).
- Deciding what to do when a line is crossed: use `cost-trigger-rules`.
- Demand and reorder forecasts: use `forecast-demand-per-sku` with Omar.
- Changing prices: Brendan and Radek decide with the owner.
- Trading, hedging or buying futures: never; suggest a talk with the store's bank.

## What you need

Required:

1. **The BOM with cost per line per SKU** (from `should-cost-model-per-bom-line`), so each series has a weight.
2. **Where each input is bought**: the factory's country and currency, and the Incoterm of the quote.
3. **Freight lane and mode**: for example Shanghai to Rotterdam by 40ft container, or Ho Chi Minh City to Los Angeles.
4. **Selling currency and margin floor** per SKU.

Optional: past invoices (to measure the lag from a price move to your invoice), the forwarder's rate card, the broker's tariff notes.

The routine is level 1: it reads public data and writes a report. It never contacts a supplier, changes a price or places an order. The owner sets the schedule and who gets the report.

## Before you start: the gates

1. **BOM weights known.** Pass: each line has its share of COGS. Fail: the report cannot say cents per unit; build the BOM first.
2. **Right market for each input.** Pass: you know if the factory buys the input in yuan, dollars or another currency. Fail: ask the factory; a US index says little about a Chinese factory's steel.
3. **Baseline set.** Pass: each series has a baseline value and date (usually the date of the current quote). Fail: set it before the first run.

## Steps

### 1. Map every BOM line to a series

| Input | Series to watch | Updates |
|---|---|---|
| Cotton | IMF global price of cotton (FRED PCOTTINDUSDM), World Bank Pink Sheet | Monthly |
| Aluminium, copper, zinc, nickel, tin, rubber, plywood | World Bank Pink Sheet; IMF Primary Commodity Prices | Monthly, first business days |
| Steel, aluminium, stainless, rubber, pulp, paper bought in China | Shanghai Futures Exchange | Daily, free data delayed 30 minutes |
| PP, LLDPE, PVC bought in China | Dalian Commodity Exchange, monthly average contracts | Daily and monthly |
| Resin, cartons, steel for US-made parts | US PPIs on FRED: resin PCU325211325211, corrugated boxes PCU322211322211, steel WPU1017 | Monthly, mid-month |
| Woven fabric | US PPI broadwoven fabric mills (PCU313210313210) | Monthly |
| Container freight | Drewry World Container Index (Thursdays, 8 lanes); Freightos Baltic Index (daily, Friday weekly, 12 lanes) | Weekly or daily |
| Exchange rates | ECB euro reference rates (about 16:00 CET working days); Federal Reserve H.10 (Mondays); CFETS yuan central parity (each business day) | Daily or weekly |
| Supplier price-rise test | BLS import price index for goods from China (FRED CHNTOT), priced before duty | Monthly |
| Duties and tariffs | Official notices in each import market, read by Sheila and the broker | When published |

Write for each line: series name and code, unit, weight in COGS, how often it updates, and the lag to invoices.

### 2. Set the lag and the share that really moves

Input moves reach factory prices slowly and in part: one central bank study found about half a year for the first effect and only about a quarter of the move passed through to consumer goods. Measure your own lag from past invoices where you can. For a part where the material is 40% of the price, a 10% material move is about a 4% price move, not 10%.

Currency: outside the US, watch your selling currency against the US dollar, not only the supplier's currency, because most trade is invoiced in dollars. A 1% fall against the dollar lifts import prices about 0.6% to 0.8% within a year.

### 3. Run the check on schedule

Each run, for each series: latest value and date, change since last run, change since baseline. Then for each SKU:

cents per unit = line cost x share driven by the series x % change since baseline

Sum across lines for the COGS change per SKU, then the new gross margin per order. Freight: container rate / units per container gives freight per unit; add a week to sea lead times when schedule reliability is low (about half of ships arrived on schedule in September 2026).

### 4. Build the 3, 6 and 12 month range

Base case: the latest World Bank or other published forecast where one exists, otherwise the current value. High and low: for a price that moves like a random walk, the h-month band is plus or minus c x monthly volatility x square root of h, with c of 1.28 for an 80% band. Turn each case into COGS and margin per SKU, and name the driver behind each.

### 5. Flag anything past a line

Compare each reading with the watch and action lines from `cost-trigger-rules`. Flag the line, the SKU and the money per month at current sales. Two readings in a row past a line count as a cross; one is noise (house rule, test it).

### 6. Write the report and log it

Same format every run, so the owner reads it in two minutes. Append each reading to the log so trends and lags can be measured later.

## Checks before you hand it over

- Every BOM line over 5% of COGS has a named series, or says why none exists.
- Each reading has a value, a date and a source.
- Cents per unit use the share of the price the input drives, not the whole price.
- Currency is checked against the US dollar as well as the supplier's currency.
- High and low cases show the band method and the volatility used.
- No supplier was contacted and no price changed by the routine.

## Output

**Cost watch report (each run, one screen):**

1. Headline: COGS change per SKU since baseline, in money and %, and margin per order now.
2. What moved: series, change since last run, change since baseline.
3. Past a line: driver, SKU, money per month, the move it starts (from `cost-trigger-rules`), owner.
4. Coming up: tariff dates, holiday closures, next forecast release.

**Series map:**

| BOM line | SKU | Weight in COGS | Series and code | Source | Unit | Updates | Lag to invoice | Baseline value and date |
|---|---|---|---|---|---|---|---|---|

**COGS range:**

| SKU | Now | 3 months base / high / low | 6 months base / high / low | 12 months base / high / low | Main driver | Margin at high case |
|---|---|---|---|---|---|---|

**Reading log:** date, series, value, change, run id.

## Common mistakes

- **Watching a US index for a Chinese factory's input.** Step 1 picks the market the factory buys in.
- **Passing the whole move through.** Step 2 uses the share and the lag.
- **Watching only the supplier's currency.** Step 2 adds the dollar.
- **Reacting to one reading.** Step 5 needs two in a row.
- **A new format each week.** Step 6 keeps one.

## Sources

- COG-0008: total lead time, production plus sea door to door.
- COG-6287: small brands are limited by the cash cycle.
- COG-6293: full landed cost with the live exchange rate as product cost.
- World Bank, Commodity Markets (Pink Sheet and Commodity Markets Outlook): https://www.worldbank.org/en/research/commodity-markets
- IMF, Primary Commodity Prices: https://www.imf.org/en/research/commodity-prices
- FRED, Global price of Cotton (PCOTTINDUSDM): https://fred.stlouisfed.org/series/PCOTTINDUSDM
- FRED, PPI Plastics Material and Resin Manufacturing: https://fred.stlouisfed.org/series/PCU325211325211
- FRED, PPI Corrugated and Solid Fiber Box Manufacturing: https://fred.stlouisfed.org/series/PCU322211322211
- FRED, Import Price Index by Origin: China (CHNTOT): https://fred.stlouisfed.org/series/CHNTOT
- Shanghai Futures Exchange: https://www.shfe.com.cn/eng/
- Drewry, World Container Index Methodology: https://www.drewry.co.uk/logistics-executive-briefing/logistics-executive-briefing-articles/world-container-index-methodology
- Freightos Baltic Index: https://www.freightos.com/enterprise/terminal/freightos-baltic-index-global-container-pricing-index/
- ECB, Euro foreign exchange reference rates: https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html
- Federal Reserve, H.10 Foreign Exchange Rates: https://www.federalreserve.gov/releases/h10/current/
- CFETS, Central Parity of RMB: https://www.chinamoney.com.cn/english/bmkcpr/
- IMF Working Paper 20/126, Patterns in Invoicing Currency in Global Trade: https://www.imf.org/-/media/files/publications/wp/2020/english/wpiea2020126-print-pdf.pdf
- ECB Economic Bulletin 5/2021, Pipeline pressures for non-energy industrial goods inflation: https://www.ecb.europa.eu/pub/economic-bulletin/focus/2021/html/ecb.ebbox202105_07~d799754f4e.en.html
- Forecasting: Principles and Practice, 5.5 Prediction intervals: https://otexts.com/fpp3/prediction-intervals.html
- Sea-Intelligence, Global Schedule Reliability (September 2026): https://www.sea-intelligence.com/press-room/415-global-schedule-reliability-records-a-marginal-gain-in-september

What makes this skill ours: each BOM line is tied to the market its factory really buys in; moves are turned into cents per unit through the share and the lag, not passed through whole; the dollar is watched as well as the supplier's currency; and the same two-minute report lands on schedule with the lines that need a decision.
