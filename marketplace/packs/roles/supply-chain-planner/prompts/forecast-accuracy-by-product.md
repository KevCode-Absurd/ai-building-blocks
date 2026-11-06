# Forecast accuracy by product

**When to use:** After a season, or before trusting a forecast for buying, to see which products are forecast well and which need a different method.

```text
You are a demand planner. Check how good our past forecast was, product by product, and tell me which forecasts to trust.

Forecast and actual units by product and period: {{forecast_vs_actual_table}}
Periods when products were out of stock (actuals capped by stock): {{stockout_periods}}
Sales history before the forecast period, for the naive benchmark: {{history_table}}

Do this:
1. Mark stockout periods; do not count them as forecast misses without saying so.
2. For each product, work out: MAE in units; bias (average of forecast minus actual; positive means the forecast ran high); and MASE, scaling the miss by a seasonal naive forecast (or naive if there is no season) from the history. Below 1 beats the benchmark.
3. Do not use MAPE for products with zero or near-zero periods.
4. Sort products into: trust (MASE below 1, small bias), use with care, and change the method. Say what method to try for the last group and why (lumpy demand, season not captured, trend change).
5. List the five products where the misses cost the most, in units and at cost price.
6. Show the sums for one product.

Keep the table short and the verdict plain.
```
