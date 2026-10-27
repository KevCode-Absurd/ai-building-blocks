---
name: budget-scenario-planning
description: Project marketing budget across a conversion funnel using Monte Carlo sampling, calibrate Hill-saturation curves from historical spend, and compare/backtest scenarios without claiming causal lift.
license: MIT
metadata:
  author: Riley Sorenson
  version: "0.1.0"
---

# Budget Scenario Planning

Use this skill when analyzing marketing budgets, forecasting outcomes, fitting Hill-saturation curves, projecting funnel performance using Monte Carlo sampling, or backtesting models against historical scenarios. 

This skill provides a mathematically rigorous approach to marketing budget allocation, replacing flat multiplier forecasting with methods that account for diminishing returns and variance.

## What you need first

- Past spend by channel and period (weekly or monthly), and the result per channel (for example conversions or leads).
- Funnel counts per period, and the step-to-step rates (for example leads to qualified leads).
- A marginal return (beta) and an error size (sigma) per channel. If the person does not have them, estimate them from the history and say that you did. With only two or three periods, say the curves are rough guesses.
- The new total budget and the period it covers, in the same unit as the history (a monthly budget for monthly history).
- An AI that can run Python with numpy. Without code running, explain the method and the inputs, and do not state any forecast number.

## If something is missing

Ask once. If it is still missing, write `MISSING: <what>` and stop that step. Never invent spend, results, betas or sigmas. A blank spend cell stays a gap, never zero.

## What you hand back

1. **Inputs used**: periods covered, channels, gaps found, and which betas and sigmas were supplied or estimated.
2. **Fitted curves**: one line per channel with the asymptote, the half-saturation point and the historical mean spend.
3. **Allocation**: spend per channel for the new budget, using one rule: the Karush-Kuhn-Tucker (KKT) conditions on the Hill curves, which means each funded channel ends with the same return on its next dollar (the equal marginal-return rule). `optimize_budget` in `scripts/run-budget-scenario.py` does this. Never put all of it in one channel.
4. **Forecast**: p10 (cautious), mean and p90 (optimistic) for total results, then the funnel counts at each stage.
5. **Backtest**: error (RMSE or MAPE) on held-out periods. Hold out the last 2 to 4 periods (or about a quarter of the history), fit on the earlier ones, forecast the held-out periods and report the error as RMSE. `scripts/run-budget-scenario.py` does not backtest. Compute it yourself from the history, or write `BACKTEST NOT RUN: <reason>`.
6. **Caveats**: forecasts from past correlation, not proof that more spend causes more results. Say it in the result, not only here.

## Core concepts & workflow

1. **Calibrate**: Ingest historical weekly/monthly spend by channel alongside funnel outcomes.
2. **Curve-fit**: Fit a Hill-saturation curve `f_c(x) = a_c * x / (b_c + x)` for each channel using the `a_c = 4 * μ_c * β_c` heuristic to cap the upside of low-spend, high-return channels.
3. **Project**: Given a total budget and timeframe, project the expected outcome across funnel stages.
4. **Sample**: Run Monte Carlo simulations to generate p10 (conservative) and p90 (optimistic) bands.
5. **Backtest**: Compare projected scenarios against historical hold-out periods to measure model error (e.g., RMSE, MAPE).

## Mandatory constraints (Contract Boundaries)

- **Unknown ≠ Zero**: If historical spend data is missing for a period, treat it as a missing data point (gap), not as $0 spend.
- **No allocator hallucination**: When asked to "optimize" or "allocate" a budget, you MUST use the Karush-Kuhn-Tucker (KKT) conditions on the Hill curves. DO NOT use a naive linear programming solver that dumps 100% of the budget into the single highest ROI channel. 
- **Strict framing**: Projections are observational estimates based on historical correlation. Explicitly communicate to the user that these are forecasts, NOT causal incrementality guarantees.
- **Date alignment**: Funnel projection periods must cleanly map to the historical fit window.

## Using the included artifacts

- Consult `references/planning-math.md` for exact formulas (Hill calibration, KKT allocation, Monte Carlo sampling).
- Use `scripts/run-budget-scenario.py` to project budgets deterministically.
- Use `references/scenario-fixtures.json` to mock inputs or test the script.
- Check `references/eval.md` and `references/eval-cases.json` for validation criteria and evaluation prompts.
