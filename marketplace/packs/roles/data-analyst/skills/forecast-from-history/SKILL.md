---
name: forecast-from-history
description: Builds a monthly or weekly forecast of sales, orders, bookings or covers from a business's own history - checks the history, picks the simplest method that fits (seasonal naive, moving average, trend times seasonal index, or Excel FORECAST.ETS), tests it on held-back periods with MAE and MASE, and gives low, likely and high values with the formulas to update it. Use it for buying, staffing, cash planning or splitting a yearly target by month.
---

# Forecast from history

## When to use

- "How much will we sell next quarter?" for buying, staffing or cash planning.
- Weekly covers, bookings or orders for rotas and ordering.
- Checking how far off last year's forecast was.
- Splitting a yearly target across months by the business's own seasonal pattern.

Not for: share prices, crypto, lending or investment decisions, or anything sold as certain.

## What you need

1. What the forecast is for (buying, staffing, cash, targets). This sets the period and how wide a useful range is.
2. History as totals per period (month or week), ideally two or more full years. Totals, not raw order files with customer details.
3. Known one-offs and closures with dates: refits, a big contract, a lockdown, a price change, a new site.
4. Planned events for the forecast period: openings, promotions, price changes.
5. The tool: Excel (desktop) or Google Sheets.
6. Access: level 1 (read) for steps 1 to 8. Writing the forecast and its formulas into your planning sheet needs level 2 (a copy) or level 3 (the live sheet, within your limits).

## Steps

### 1. Check the history

List periods covered, gaps, zeros and one-offs. Mark known one-offs so they do not bend the pattern. If periods are missing, say how they will be handled; Excel's FORECAST.ETS fills up to 30% missing points by default, but filling is a choice to state, not to hide.

### 2. Look for trend and season

Chart the series. Compare each period with the same period a year earlier. With at least two full years, work out a seasonal index for each month: the month's average divided by the average of all months.

### 3. Pick the simplest method that fits

- **Seasonal naive** (next March = last March): short, noisy or strongly seasonal history. Always run it as the benchmark.
- **Moving average:** no clear season, slow drift.
- **Trend times seasonal index:** steady growth with a stable season.
- **FORECAST.ETS (Excel desktop) or Holt-Winters:** two or more years of regular history. FORECAST.ETS needs a constant time step and is not available in Excel for the web or mobile.
Say why the method was chosen.

### 4. Test on held-back periods

Hold back the most recent periods, at least as many as you will forecast ahead. Forecast them from the earlier data only, with both your method and seasonal naive. Report:
- **MAE**: average miss in units or money, easy to explain.
- **MASE**: below 1 means better than naive.
- **MAPE** only if no actual value is zero or close to zero.
If your method does not beat seasonal naive, use seasonal naive and say so.

### 5. Forecast the full horizon

Refit on all the history and forecast every period for every series asked for (each site or product line).

### 6. Set the range

Base low and high on the size of past misses, not on a feeling. Two honest options:
- Use the spread of held-back errors (for example, likely ± the largest held-back miss as a rough band).
- For normal errors, an 80% interval is about ± 1.28 × the standard deviation of errors; widen it for periods further ahead.
Say which you used. In Excel, FORECAST.ETS.CONFINT gives a confidence half-width for FORECAST.ETS.

### 7. Add planned events separately

Apply each planned event as a labelled adjustment line after the base forecast, with its size and where the size came from. Never bury it inside the base.

### 8. Show one value worked out

Walk through one forecast value step by step, so the owner can check the logic.

### 9. Write the formulas (level 2 or 3 if I add them to your sheet)

Formulas for the client's tool and column layout, which cells to update each month, and how to re-test accuracy when actuals arrive.

## Checks

- One-offs marked and handled; closures not treated as zero demand.
- The method beat seasonal naive on held-back data, or seasonal naive is used.
- The error measure fits the data (no MAPE with zeros).
- Every period has low, likely and high values.
- Series totals add up to the overall total.
- Every growth rate comes from the history or a named event.
- If history is too short for a seasonal method, the brief says so plainly.

## Output format

1. **Purpose and data** (periods, gaps, one-offs).
2. **Method and why.**
3. **Accuracy test** table: held-back period, actual, forecast, miss; method versus seasonal naive; MAE and MASE.
4. **Forecast table:** period, low, likely, high, adjustments.
5. **One value worked out.**
6. **Formulas and update steps.**
7. **Limits:** what would make this wrong.

## Example of good output (short)

*Illustrative structure, not a real business: a café with 36 months of sales history. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Method.** Strong season (December is 1.4 times the monthly average), steady growth. I compared trend times seasonal index with seasonal naive on the last 6 months, held back.
>
> | Held-back month | Actual | Seasonal naive | Trend × index |
> |---|---|---|---|
> | May | 41,200 | 38,900 | 40,600 |
> | Jun | 44,800 | 42,100 | 45,300 |
> | ... | | | |
> | **MAE** | | 2,750 | 1,180 |
>
> Trend × index misses by less than half as much as seasonal naive on the held-back months (MAE 1,180 against 2,750), so I use it.
>
> **Forecast (likely, with low and high from the largest held-back miss of 2,100).** January: 33,400 (31,300 to 35,500). February: 35,100 (33,000 to 37,200). The new terrace (opening in April, your estimate +6% for April to September) is a separate line, not in the base.
>
> **Limit.** Only three Decembers in the history, so the December index could be off by more than the band shows.
