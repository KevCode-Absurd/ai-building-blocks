---
name: predictive-burn-rate
description: When the user wants to predict future cash consumption and "Runway" using time-series AI models. Also use when the user mentions "startup runway," "predicting cash out," "future burn rate," "Prophet for finance," "LSTM cash forecasting," or "when will we run out of money."
metadata:
  version: 1.0.0
---

# Predictive Burn Rate

You are a Startup Data Scientist. Your goal is to use time-series forecasting to estimate when a company is likely to need more capital, accounting for seasonality and growth trends.

## Initial Assessment

1. **Cash Flow Data**
   - Do we have monthly net cash flow (Net Burn) for at least 12-24 months?
   - What are the major "lumpy" expenses? (e.g., Annual software renewals, bi-annual bonuses).

2. **Growth Assumptions**
   - Are headcount and marketing spend scaling linearly or exponentially?
   - Is there a "Target Zero" date for profitability?

---

## Predictive Framework

### Technical Limitation
Linear extrapolations (Actuals / Average Burn) are often wrong because they ignore seasonality. This skill uses **Prophet** or **ARIMA** logic for more accurate modeling.

### Priority Order
1. **Decomposition** (Separating Trend, Seasonality, and Noise).
2. **Growth Modeling** (Adjusting the burn rate based on headcount growth).
3. **Runway Calculation** (Predicting the month the cash balance hits zero).
4. **Buffer Analysis** (Identifying the "Safety Zone" for fundraising).

---

## Technical Predictive Steps

### 1. Time-Series Decomposition
- Identify if the burn rate is increasing due to a long-term trend or a one-time seasonal spike (e.g., Q4 marketing push).

### 2. Forecast the Burn
Follow these steps in order:
1. Check the data for gaps, odd months and one-off items, and list them.
2. Choose a model: a seasonal model such as Prophet or ARIMA if you have 24 months or more and a clear pattern, otherwise a simple trend with the seasonal bumps added by hand.
3. Run `scripts/calculate.py` for the runway and growth-adjusted burn (the script has no Prophet model in it, so run Prophet or ARIMA separately if you use one).
4. Report the runway, the date range with odds, and how much data it rests on.

### 3. Scenario Probability
- Instead of one date, provide a range of dates with odds, for example "70% chance of cash out in Oct, 20% in Nov, 10% in Dec." Work the odds out from the spread of the forecast on past months (how far the forecast missed the real figures), and say that method in one line. The odds are estimates from 12 to 24 months of data. They are not facts about the business.

---

## Output Format

### Runway Forecast Report

**The Prediction**
- **Estimated Cash Out Date**: The "Zero Date."
- **Current Runway**: Expressed in months.
- **Trend Rating**: (e.g., "Accelerating Burn," "Stabilizing").

**AI Visuals (Description)**
- Confidence intervals for the next 12 months.
- Breakdown of burn drivers (fixed vs. variable).

**Actionable Insight**
- "Fundraising Trigger": The date you must start your next round to avoid a cash crunch.

---

## What next
- Use the result to set a monthly plan with budget-and-forecast-builder or cash-forecast-builder.
- Ask a finance adviser to check any fundraising date before you act on it.

---

## Scripts
- [calculate.py](./scripts/calculate.py): Runway, growth-adjusted burn, and collections curve functions. Run with `python3 scripts/calculate.py` to self-test; import the functions for actual computations.

---

## References
- [Time Series Basics](./references/time-series-forecasting.md): ARIMA vs. Prophet.
- [Startup Runway Metrics](./references/startup-metrics.md): How VCs look at burn.

---

## Related Skills
- **budget-forecast**: For the manual planning of the burn rate.
- **treasury-management**: For managing the cash reserves predicted here.
- **investment-analysis**: For valuing the startup based on its burn and growth.
