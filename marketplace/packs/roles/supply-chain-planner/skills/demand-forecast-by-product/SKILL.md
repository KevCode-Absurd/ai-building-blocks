---
name: demand-forecast-by-product
description: Forecasts units for each product (SKU) by week or month for buying and production - rebuilds demand hidden by stockouts, sorts products into steady, seasonal, lumpy and new, gives each group a method that fits (seasonal naive, moving average, seasonal index or Holt-Winters, Croston or an average rate, launch curves from similar past products), tests each product on held-back periods with MASE and bias, reconciles product and family totals, and returns low, likely and high units plus the error spread that safety stock needs. Use it before a reorder plan, a seasonal buy, a production plan or an accuracy review of an existing forecast.
---

# Demand forecast by product

## When to use

- "How many of each product will we sell over the next six months?" before buying or making stock.
- A seasonal build: candles before the fourth quarter, swimwear before spring, garden lines before summer.
- A new product with no sales of its own.
- "Which of our forecasts can we trust?" after a season of misses.
- Feeding safety stock: the reorder skill needs each product's typical miss over the lead time.

Not for: promising a sales figure to a lender or investor, or anything sold as certain.

## What you need

1. **Unit sales by product by week or month.** Two full years for seasonal products where possible. Units, not revenue, and not raw orders with customer names.
2. **Stock on hand by period, or a list of stockout dates.** Without it, stockouts look like weak demand.
3. **One-offs:** bulk orders, promotions, price changes, lost or new listings, with dates.
4. **Planned events** in the forecast window.
5. **Supplier lead time per product.** It sets the horizon that matters most.
6. **Product families** (scent, range, size) if you plan at more than one level.
7. **Access:** level 1 (read) for everything here. Writing the forecast into your planning sheet needs level 2 (a copy) or level 3 (the live sheet, within your limits).

## Steps

### 1. Agree what the forecast drives

Buying, production, cash or storage. Note the lead time for each supplier: a product with a ten-week lead time needs a good forecast ten weeks out, not next week.

### 2. Clean the history, product by product

- Mark each stockout period. Rebuild its demand from the in-stock days of that period (units ÷ in-stock days × days in period) or from the same period last year scaled by the trend, and label the rebuilt value.
- Take one-off bulk orders out of the base and list them separately.
- Note promotions and price changes; they explain spikes, they are not the base.
- Count the periods covered, zeros and gaps. A product with fewer than two seasons cannot support a seasonal method.

### 3. Sort the products into groups

- **Steady:** sells most periods, no clear season.
- **Seasonal:** the same months rise and fall each year.
- **Lumpy or slow:** many zero periods, or a few large orders.
- **New:** little or no history.

Write the group next to each product. If the client has many products, sort them by volume or margin too (an ABC split with cut-offs the client chooses), so effort goes where the money is.

### 4. Give each group a method

- **Steady:** a moving average or simple exponential smoothing; trend only if it is clear and explained.
- **Seasonal:** a seasonal index from at least two years (each month's average ÷ the average of all months, times a base level), or Holt-Winters where the tool supports it.
- **Lumpy:** Croston's method (1972, see `knowledge.md`), which smooths the size of non-zero sales and the gap between them separately, or an average rate per period with a wide range. Do not trust a smooth curve for these products.
- **New:** take two to five similar past launches from the client's data, scale their first months to the new product's planned launch size, and give a wide range with a date to switch to real sales.

Always run naive (next = last) and seasonal naive (next March = last March) alongside as benchmarks.

### 5. Test on held-back periods

Hold back the most recent periods, at least as many as the lead time plus one review cycle where history allows. Forecast them from earlier data with each method and the benchmarks. For each product report:
- **MASE:** the miss scaled by the naive miss; below 1 beats naive, and it compares fairly across big and small products.
- **Bias:** the average of (forecast minus actual). Positive means the forecast runs high.
- **MAE in units:** easy to explain, and the input for the error spread.
Avoid MAPE for products with zero or near-zero periods.

If a method does not beat the benchmark for a product, use the benchmark for that product and say so.

### 6. Forecast and set the range

Refit on all history and forecast each period. Set low and high from the held-back misses, not from a feeling: for example, likely ± the standard deviation of held-back errors scaled to the period, or ± the largest held-back miss. State which. Widen the range for periods further ahead and for new or lumpy products.

### 7. Reconcile levels

If you also forecast families or channels, make the product forecasts add up to the family forecast (scale them by share), or add the products up to make the family. Do not ship two numbers for the same total.

### 8. Add events as labelled lines

Promotions, new listings and lost accounts go in as separate rows with their size and where the size came from. Adjust only for information the model does not have, and write the reason down so it can be checked later.

### 9. Hand the spread to the reorder plan

For each product, pass on average demand per period and the standard deviation of forecast errors (or of demand, if no forecast test was possible) for the reorder skill.

### 10. Write it back (level 2 or 3)

Put the table and formulas in a copy of the planning sheet (level 2) or the live sheet (level 3), with the cells to update each period.

## Checks

- Every stockout period is named and rebuilt, or flagged as too thin to rebuild.
- Each product has a group, a method and a reason.
- Held-back MASE and bias are shown for every product with enough history.
- No MAPE on products with zero periods.
- Low, likely and high for every period; ranges wider for lumpy and new products.
- Product totals reconcile to family and total.
- No growth rate appears that is not worked out from the data or a named event.
- Products with too little history are listed, not quietly forecast.

## Output format

1. **Purpose, horizon and lead times.**
2. **Data notes:** periods, stockouts rebuilt, one-offs removed.
3. **Product groups** table: product, group, method, why.
4. **Accuracy test** table: product, MASE (method and benchmark), bias, MAE, verdict.
5. **Forecast** table: product, period, low, likely, high, adjustment lines.
6. **Spread for safety stock:** product, average per period, error standard deviation.
7. **One product worked through.**
8. **Limits and the products to watch.**

## Example of good output (short)

*Illustrative structure, not a real business: a candle maker with 12 core scents and 34 months of history. Copy the shape, never the content: every fact comes from the client's own context.*

> **Stockouts.** Fig & Cedar, Sea Salt and Tobacco ran out for 9 to 16 days in May 2025. Their May demand is rebuilt from in-stock days (Fig & Cedar: 212 units sold in 15 days → 438 for the month) and labelled "rebuilt".
>
> | Product | Group | Method | MASE (method / seasonal naive) | Bias |
> |---|---|---|---|---|
> | Fig & Cedar | Seasonal | Seasonal index | 0.71 / 1.00 | +4 units |
> | Midnight Oud | Lumpy | Average rate, wide range | 0.95 / 1.00 | -2 units |
> | Sea Salt | Seasonal | Seasonal naive (index did not beat it) | 1.00 / 1.00 | +11 units |
>
> **Fig & Cedar, December.** Base level 410 × December index 2.3 = 943 likely; range 860 to 1,030 from the held-back error spread. The wholesale order from a gift shop chain (your figure: 300 units) is a separate line, not in the base.
>
> **Watch.** Sea Salt has run high four months in a row (+11 units on average). If January also runs high, lower the base.
