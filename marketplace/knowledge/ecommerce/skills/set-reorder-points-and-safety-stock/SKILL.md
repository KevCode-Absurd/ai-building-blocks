---
name: set-reorder-points-and-safety-stock
description: "A reorder sheet for every product: the stock level that triggers a reorder, the safety buffer, how many units to order and the date the order must go out, worked from in-stock sales speed, the supplier's full lead time and the cash the store has. Grades products so the buffer follows profit and risk, not a flat rule, and flags any product that will run out before new stock can land. Use when the store keeps selling out or sits on too much stock, before placing purchase orders, or when a supplier, lead time or sales speed changes."
---

# Reorder points and safety stock

**You get:** one reorder sheet (Google Sheet or CSV) with a row per product or variant showing daily sales speed, full lead time, safety stock, reorder point, order quantity, the last safe order date and a red, amber or green status, plus a one-screen summary of the purchase orders to place this month and the cash they need.

## When to use

- The store sold out of a best seller in the last 90 days, or keeps stock that has not moved in months.
- A purchase order is due and the owner wants a number, not a guess.
- A supplier changed lead time, minimum order or shipping mode (air to sea, or the reverse).
- A sale, launch or peak season is coming and stock must last through it.
- The store moved warehouse or 3PL and receiving time changed.

## Not for

- Predicting next quarter's sales per product with seasons and promotions: use `forecast-demand-per-sku` first, then bring its numbers here.
- Getting rid of stock that already sits too long: use `clear-slow-moving-stock`.
- Amazon FBA shipments and storage limits: use `plan-fba-inventory`.
- Working out what a unit really costs: use `calculate-landed-cost-per-unit`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 180 days or more (365 if the store is seasonal): Created at, Lineitem sku, Lineitem quantity, Lineitem price, Financial Status, Cancelled at. Remove test, staff and cancelled orders.
2. **Inventory history or stockout dates per SKU.** Shopify's month-end inventory snapshot, the inventory adjustment history, or the owner's notes of when each item sold out. Without this, ask once; if nobody knows, mark every day with zero sales on a normally steady seller as a suspected stockout day.
3. **Current stock per SKU**: on hand, committed to open orders, and on order (open purchase orders with their expected arrival).
4. **Supplier lead times per SKU**: production days, transit days by mode, customs and inbound receiving days. Ask the supplier and the 3PL; use the last three real orders where they exist.
5. **Minimum order quantity, case pack and unit landed cost per SKU.**
6. **Cash the owner can put into stock this month**, from `build-13-week-cash-forecast` if it exists.

Optional: a demand forecast from `forecast-demand-per-sku`, planned promotions, and the gross profit per unit from `build-sku-profit-sheet`.

Placing a purchase order is a commitment of money: the agent drafts it (level 2), and the client approves and sends it.

## Before you start: the gates

1. **Gross profit per unit.** Pass when each SKU has landed cost and delivered gross profit [MEA-0037]. Fail: build it first with `build-sku-profit-sheet`. Without it, products cannot be graded, and the sheet will protect loss makers as hard as winners.
2. **Cash.** Pass when the total of the suggested orders fits the cash the owner named and the 13-week forecast stays above zero. Fail: keep the sheet, but cut order sizes in grade order (C first) and say which products will run thin. Stock-funded growth can starve a business of cash even while sales rise [FIN-0011].
3. **Clean sales speed.** Pass when stockout days are known or estimated. Fail: do not use raw monthly totals; they understate demand for any month with stockout days [OPS-0014].
4. **Lead time is real.** Pass when the lead time counts production, transit, customs and receiving, from the day money is paid to the day stock is sellable. Fail: ask the supplier; until then, add 25% to the quoted figure as a practitioner default and mark it amber.

## Steps

### 1. Measure sales speed on in-stock days only

For each SKU over the last 90 days (or the last 28 to 56 for a fast-changing product), daily speed = units sold / days the item was in stock. If a product sold 60 units in 30 days but was out of stock for 15, its speed is 4 a day, not 2 [OPS-0014]. Shopify's own days-of-inventory report divides by all 28 days, so it reads low after a stockout [COG-6285].

Keep variability in its measured time unit. With weekly standard deviation, safety stock under independent comparable period errors is z x weekly standard deviation x square root of (lead time in days / 7). Do not divide weekly standard deviation by 7 to infer daily variability. If independence is not supported, estimate the forecast-error distribution over the actual protection period instead.

If `forecast-demand-per-sku` has given a forecast, use the forecast speed for the lead-time window instead of the past speed. Never apply a flat growth rate to a seasonal product; peak months can run many times the base [OPS-0014].

### 2. Build the full lead time

Full lead time = production + transit + customs or clearance + inbound receiving at the warehouse + the days between deciding and paying the supplier (your own review rhythm).

Planning ranges from one practitioner for Chinese suppliers: production 20 to 30 days, sea 30 to 40 days door to door, air 7 to 10 [COG-0008]. Use the store's own history over these when it has it. Domestic or nearby suppliers (for example in Mexico for the US, Turkey or Portugal for the EU and UK) can run 7 to 21 days, but add holiday shutdowns (Lunar New Year closes many Chinese factories for weeks; summer shutdowns in Europe) and haulier delays. Imports add customs clearance, duties paperwork and possible product safety or labelling checks under your market's rules (for example CPSC certificates in the US, CE or UKCA marking in the EU and UK). US imports also need duties paperwork since de minimis ended, and any market can add port congestion at peak.

If the store checks stock once a week, add 7 days. A weekly review cycle is part of the lead time.

Add a buffer for late ships: only about half of container ships arrived on schedule in September 2026, and late ships averaged about 6.65 days late, so add about a week to sea lead times. Add 3 to 4 weeks to a new supplier's quoted lead time and about 2 for a regular one. For Chinese suppliers, plan Chinese New Year as 2 to 4 weeks lost: order by mid-December to cover sales to about 1 April, plus 15 to 30 days of extra safety stock.

### 3. Grade every SKU

Rank by gross profit over the last 90 days, not revenue. Shopify's ABC report ranks by revenue and ignores cost [COG-6285], so recompute:

- **A:** products that together make 80% of gross profit.
- **B:** the next 15%.
- **C:** the last 5%, plus anything launched in the last 60 days with too little data.

The grade sets the buffer. Running out of an A product costs the most; holding extra C stock costs cash for little return.

### 4. Set safety stock

Use the simplest method the data supports:

- **Days method (default for small stores):** safety stock = daily speed x buffer days. One practitioner holds about 5 to 10 days [OPS-0014]. Use 10 for A, 7 for B, 3 to 5 for C.
- **Variability method (when you have 26+ weeks of clean data):** safety stock = z x daily standard deviation x square root of lead time in days, with z = 1.65 for A (about a 95% chance of not running out in a cycle), 1.28 for B (90%), 0.84 for C (80%). This is the standard textbook formula; treat the service levels as a practitioner default and test them.
- **Lead time risk:** if the supplier has missed dates before, add daily speed x the worst delay of the last three orders.
- **Demand and lead time both vary (when you have the data):** the spread of demand over the lead time is the square root of (lead time x daily standard deviation squared + daily speed squared x lead time standard deviation squared). An unreliable supplier can triple safety stock this way, which puts a number on the cost of late deliveries in `supplier-scorecard`.
- **Use one-sided z values:** 1.28 for 90%, 1.65 for 95%, 2.05 for 98%, 2.33 for 99%. Using 1.96 for 95% overstocks by about 19%. Base the spread on forecast errors rather than raw sales once `forecast-demand-per-sku` is running.

Returns note: for products with high return rates (fashion, or any market where pay on delivery is common and parcels get refused), a share of units come back after 7 to 30 days. Count returned sellable units as incoming, not as stock on hand, and plan for the return wave after peak seasons such as Black Friday and the winter holidays.

### 5. Set the reorder point

Reorder point = daily speed x full lead time + safety stock.

Example (illustrative): 8 a day, 60 days full lead time, 10 days buffer: 8 x 60 + 80 = 560 units. When available stock plus units on order falls to 560, the purchase order goes out.

### 6. Set the order quantity

Draft order quantity = max(0, daily speed x (lead time + target days of cover) + safety stock - inventory position over that horizon), then round positive quantities to the case pack and minimum order. Inventory position subtracts committed units and backorders from sellable on-hand stock and adds only confirmed receipts arriving within the horizon. Reconcile reservation definitions to avoid subtracting the same commitment twice. Build a dated projected-stock timeline too: a later receipt cannot cure an earlier stockout. Apply the cash gate after rounding; expose the unfunded shortfall rather than placing an unaffordable order.

Target days of cover: one practitioner holds 4, 8 or 12 weeks by how volatile the product is and how much cash is free [OPS-0014]. Default: A 8 weeks, B 6, C 4. Fit it to supplier float: when the store pays on terms longer than the lead time, stock is partly funded by the supplier [FIN-0005].

When the minimum order is far above the target, compare three options in the sheet: pay the minimum (more cash locked up), pay a higher price for a smaller run, or switch the product to C and let it sell out. Hand price talks to `negotiate-moq-and-price`.

Where ordering costs matter (inspection, freight minimums, admin per order), check the order size against EOQ = square root of (2 x yearly units x cost per order / holding cost per unit per year). Total cost is flat near EOQ, so ordering 20% off it adds only about 2%; round to cartons. Take a price break only when total yearly cost (goods plus ordering plus holding) falls. With two suppliers for one product, split each order by their scorecard (about 70% to the better one and 30% to the backup is a common pattern), as long as each share meets its MOQ.

For a new supplier or a first bulk run, add about 3 to 10% for defects or pay for an inspection; one practitioner saw 300 bad units in 10,000 [COG-0009].

### 7. Find the last safe order date

Days left = (available stock + on order arriving in time) / daily speed. Last safe order date = today + days left minus full lead time minus safety days.

Status:

- **Red:** the last safe date has passed. The product will run out before stock lands. Options: air freight part of the order [COG-0008], cap ad spend on it, or raise its ad target so it sells slower [ADC-0023].
- **Amber:** the last safe date is within 14 days.
- **Green:** more than 14 days away.

### 8. Tie ads and sales to stock

Share the red and amber list with the media buyer. A product with fewer days of stock than its lead time should get a higher target or a pause, not more budget [ADC-0023]; a winning ad can be pushed hard when stock must move or held steady to make stock last [ADC-0012]. Before a peak, a store that will sell out early may do better hiding the product than losing the rest of the season [OPS-0019].

### 9. Fit the orders to cash

Total the suggested orders and their pay dates against the owner's stock budget. If over, cut C orders first, then trim B cover days, and keep A orders whole. Record each cut and the product that will run thin.

### 10. Set the review rhythm

Weekly: update stock, recheck red and amber. Monthly: recompute speed, grades and safety stock. After every delivery: log the real lead time. Forecasts miss; mature retailers miss by around 5% and fast-growing stores by far more [OPS-0014].

## Checks before you hand it over

- Sales speed uses in-stock days only, and the stockout days are listed.
- Every lead time counts production, transit, clearance, receiving and the review cycle.
- Grades come from gross profit, not revenue.
- Every order quantity is rounded to case pack and minimum order.
- Every red item has a named fix (air freight, ad cap or accept the gap).
- The total cash for orders fits the owner's limit, with the cuts listed.
- No purchase order was sent; each sits as a draft for approval.

## Output

1. **One-screen summary:** red items first, the purchase orders to place this month with units, supplier, cost and pay date, total cash needed, and any product that will run thin because of cash.
2. **Reorder sheet**, one row per SKU:

| Column | What goes in it |
|---|---|
| SKU, Product, Variant | From Shopify |
| Grade | A, B or C by gross profit |
| In-stock days (90) | Days available to sell |
| Daily speed | Units / in-stock days, or forecast speed |
| Daily std dev | From weekly sales |
| Full lead time (days) | Production + transit + clearance + receiving + review |
| Safety stock | Units, with method noted |
| Reorder point | Speed x lead time + safety |
| On hand, Committed, On order | From inventory and open POs |
| Days left | Available / speed |
| Last safe order date | Date |
| Order quantity | Rounded to case pack and MOQ |
| Unit landed cost, Order cost, Pay date | Money out |
| Status | Red, amber, green |
| Note | Air freight split, MOQ choice, ad cap |

3. **Draft purchase orders** for the client to approve.
4. **Lead time log** template: SKU, PO date, paid date, shipped date, arrived date, sellable date, quoted versus real days.

## Common mistakes

- **Speed from months with stockouts.** Step 1 divides by in-stock days.
- **Lead time = production only.** Step 2 counts every day from paying to sellable.
- **One buffer for every product.** Step 4 sets it by grade and variability.
- **Grades by revenue.** Step 3 ranks on gross profit.
- **Orders that ignore cash.** Step 9 fits orders to the stock budget and cuts C first.
- **Ads scaling a product about to run out.** Step 8 hands the red list to the media buyer.
- **Trusting the quoted lead time.** Step 2 adds late-ship, new-supplier and holiday buffers.
- **Using 1.96 for a 95% buffer.** Step 4 uses one-sided z values.

## Sources

- OPS-0014: forecast from in-stock days; 4, 8 or 12 weeks of cover; 5 to 10 days buffer.
- COG-0008: production and transit ranges; air first, sea to restock.
- COG-0009: defect allowance or inspection on bulk orders.
- COG-6285: Shopify ABC and days-remaining definitions and their limits.
- FIN-0005: supplier float from payment terms minus lead time.
- FIN-0011: stock-funded growth capped by the cash cycle.
- ADC-0023: raise targets or pause ads when stock is below lead time.
- ADC-0012: push or hold a winning ad by stock and cash.
- OPS-0019: hiding in-stock items at peak to avoid selling out.
- MEA-0037: gross profit on delivered cost.
- Sea-Intelligence, Global Schedule Reliability (September 2026): https://www.sea-intelligence.com/press-room/415-global-schedule-reliability-records-a-marginal-gain-in-september
- QualityInspection.org, Sourcing from China 101, Part 5: The Terms You Need to Discuss: https://qualityinspection.org/negotiations_terms_china/
- QualityInspection.org, Chinese New Year: how to manage the disruption: https://qualityinspection.org/chinese-new-year-production-planning/
- University of Iowa, Reorder Point lecture slides: https://user.engineering.uiowa.edu/~dbricker/Lecture_Slides/Reorder_Point.pdf
- University of Houston, Operations Management Chapter 3: Inventory Management: https://www.bauer.uh.edu/egardner/3301H%20Operations%20Management/OM%20Text/3INVENTORY%20MANAGEMENT-1.pdf

What makes this skill ours: speed is measured only on days the product could sell; the buffer follows a gross-profit grade instead of one flat number; the last safe order date turns the sheet into a red list the media buyer acts on; and orders are cut to the cash the store really has, C products first.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Domestic suppliers in Tiruppur, Surat or Jaipur can run 7 to 21 days, but add festival-season shutdowns around Diwali and transporter delays; imports add customs clearance and possible BIS or labelling checks. For products sold heavily on COD, a share of units come back as RTO after 7 to 15 days; count returned sellable units as incoming, not as stock on hand.

## Reproducible calculation

Use the shared `tools/commerce-math.mjs` operation `safetyStock and stockPlan` for the supported calculation. Run `node tools/commerce-math.mjs <input.json>` with `{ "operation": "<one operation>", "inputs": { ... } }`; inspect the exported function for exact field names and units. Save inputs and result with the deliverable. Unsupported assumptions or missing inputs remain explicit gaps; never substitute a guessed figure. This tool is arithmetic support, not authority to act.
