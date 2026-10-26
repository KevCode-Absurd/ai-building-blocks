---
name: matlab-optimize-portfolio
description: Help users formulate and solve portfolio optimization problems using Financial Toolbox's Portfolio object. Covers mean-variance (Markowitz), maximum Sharpe ratio (tangency), and efficient frontier workflows. Use when users ask about portfolio optimization, Markowitz, efficient frontier, Sharpe ratio, or attempt to use generic solvers (quadprog, fmincon, ga, problem-based optimize) for portfolio problems.
license: https://www.mathworks.com/content/dam/mathworks/license/pmrl/license.md
metadata:
  author: MathWorks
  version: "1.0"
---

# Portfolio Optimization with Financial Toolbox

You are helping a user formulate and solve a portfolio optimization problem using MATLAB's Financial Toolbox `Portfolio` object.

## What you need

- MATLAB R2021a or later with the Financial Toolbox (a paid MathWorks product). The code only works there.
- Either a table of past asset returns (or prices to turn into returns), or ready-made expected returns (`mu`) and a covariance matrix (`Sigma`).
- Optional: limits such as a cap per asset or group, a target return, a risk-free rate, a turnover limit.

If you can run MATLAB code (for example through the MathWorks MATLAB tools), run it and report what it printed. If you cannot, write the code, say plainly that you have not run it, and ask the user to run it and paste back any error.

If the data is missing, ask once for it. Do not invent returns. If the user has no data and only wants to see the method, use the small example in `references/examples.md` and label it as an example, not their numbers.

## When to Use

- User wants to optimize a portfolio (minimize variance, maximize Sharpe ratio, trace efficient frontier)
- User asks about Markowitz, mean-variance, minimum-variance, or tangency portfolios
- User asks about the efficient frontier or target-return portfolios
- User is trying to use fmincon, quadprog, ga, or problem-based optimize for portfolio optimization (redirect to Portfolio object)
- User asks how to set up constraints for portfolio optimization (bounds, groups, turnover, one-way turnover, cardinality, semicontinuous)
- User asks about mean-variance with cardinality or semi-continuous constraints
- User gets errors from Portfolio, estimateMaxSharpeRatio, estimateFrontier, or related methods

## When NOT to Use

- User has a general optimization problem (QP, NLP, MILP) that is NOT financial asset allocation (e.g., filter design, resource allocation, mixture proportions) — use `matlab-solve-optimization`
- User needs to retrieve market data from Bloomberg, FRED, or Haver Analytics — use `matlab-access-datafeed`
- User wants to predict returns or portfolio weights using neural networks or ML — use `matlab-train-network`
- User only wants to clean, explore, or summarize a returns table without optimization — use `matlab-analyze-data`
- User wants Experiment Manager parameter sweeps (not portfolio frontier) — use `matlab-use-experiment-manager`
- User wants CVaR, MAD, or other non-mean-variance risk measures — use `PortfolioCVaR` or `PortfolioMAD` classes (not covered by this skill)

## Key Principle

**Always use the `Portfolio` class** — never let users manually code the optimization with `fmincon` or `quadprog`. The toolbox handles solver configuration, constraint management, and frontier computation automatically.

If the user is already attempting a manual solver approach, acknowledge their work, then show how the Portfolio object achieves the same result with less code and fewer pitfalls.

## Step 1: Identify the Formulation

Determine which problem the user is trying to solve:

| User wants to... | Formulation | Reference |
|------------------|-------------|-----------|
| Minimize portfolio risk (no return target) | Mean-variance (min-variance) | [formulation-mean-variance.md](references/formulation-mean-variance.md) |
| Minimize risk for a given target return | Mean-variance (target-return) | [formulation-mean-variance.md](references/formulation-mean-variance.md) |
| Trace the efficient frontier | Mean-variance (frontier) | [formulation-mean-variance.md](references/formulation-mean-variance.md) |
| Maximize risk-adjusted return (Sharpe ratio) | Max Sharpe / tangency | [formulation-max-sharpe.md](references/formulation-max-sharpe.md) |

Consult the relevant formulation file for problem-specific guidance and methods.

## Step 2: Determine What Data the User Has

Ask (if not clear) whether they have:
- A matrix of historical asset returns (or prices that need converting)
- Pre-computed mean returns (mu) and covariance matrix (Sigma)
- A risk-free rate (relevant for Sharpe ratio; defaults to 0 if unspecified. Say that you used 0.)

## Step 3: Create the Portfolio Object

See [reference-core.md](references/reference-core.md) for all creation patterns. The most common:

**From return statistics:**
```matlab
p = Portfolio('AssetMean', mu, 'AssetCovar', Sigma);
```

**From historical returns:**
```matlab
p = Portfolio;
p = setAssetMoments(p, mean(returns)', cov(returns));
```

## Step 4: Set Constraints

Always set constraints. At minimum, use default constraints (fully invested, long-only):
```matlab
p = setDefaultConstraints(p);
```

For other constraint types (bounds, groups, turnover, one-way turnover, cardinality), see [reference-core.md](references/reference-core.md).

## Step 5: Solve

Use the method appropriate to the formulation (see the formulation file). Common patterns:
```matlab
wMinVar = estimateFrontierLimits(p, 'Min');       % minimum-variance
wTarget = estimateFrontierByReturn(p, targetRet); % target-return
wSharpe = estimateMaxSharpeRatio(p);              % max Sharpe ratio
wFrontier = estimateFrontier(p, 20);              % efficient frontier
```

## Step 6: Analyze and Visualize

Use built-in methods for portfolio statistics — never compute them manually:
```matlab
portRisk = estimatePortRisk(p, w);
portRet  = estimatePortReturn(p, w);
[risk, ret] = estimatePortMoments(p, w);
```

Always use `plotFrontier` as the primary frontier visualization — add custom annotations (special portfolios, CAL line) with `hold on`/`hold off` afterward:
```matlab
wFrontier = estimateFrontier(p, 20);
plotFrontier(p, wFrontier);
hold on
[risk, ret] = estimatePortMoments(p, wSpecial);
plot(risk, ret, 'r*', 'MarkerSize', 12);
hold off
```

## What you hand back

Give the user these parts, in this order:

1. **Setup used.** The formulation (min-variance, target-return, max Sharpe or frontier), the data source, the risk-free rate, and every constraint, with any default you chose marked as a default.
2. **Weights table.** One row per asset: name and weight, for each portfolio you solved (for example minimum-variance and max Sharpe side by side).
3. **Risk and return.** Portfolio risk and return for each set of weights, taken from `estimatePortRisk`, `estimatePortReturn` or `estimatePortMoments`. State the period the figures are in (monthly or annual).
4. **Frontier chart.** The `plotFrontier` chart, with the special portfolios marked, when the user asked for the frontier or max Sharpe.
5. **The MATLAB code.** The full script that produced the above, ready to paste into MATLAB.
6. **Checks.** Say whether the weights sum to 1 and meet every constraint, and whether the code ran. List anything you could not check as `CHECKS MISSED:` (or "none").

## Common Pitfalls

1. **Manual solver usage** — quadprog/fmincon for portfolio problems is error-prone; Portfolio handles it.
2. **Missing constraints** — A Portfolio without constraints is underdetermined.
3. **Redundant solves** — Pass weights to `plotFrontier`, not a number of portfolios, if you already solved.
4. **Manual risk/return formulas** — Use `estimatePortRisk`, `estimatePortReturn`, `estimatePortMoments`.
5. **Cardinality/semicontinuous constraints** — When calling `estimateMaxSharpeRatio`, specify `'Method','iterative'` (MATLAB auto-selects with a warning if omitted, but explicit is cleaner). Frontier methods (`estimateFrontier`, `estimateFrontierLimits`, `estimateFrontierByReturn`) auto-detect these constraints and select the mixed-integer solver internally — do NOT pass `'Method','iterative'` to them.

## Limits and next steps

- The weights are only as good as the return and risk estimates behind them. Past averages are not a forecast, and small changes in `mu` can change the weights a lot. Say this with the result.
- This is a calculation aid, not investment advice. Do not tell the user to buy or sell anything.
- Next steps to suggest: check the weights against real-world limits (fees, taxes, minimum trade sizes), try the same run with a tighter cap per asset to see how stable the mix is, and compare with the current holdings before trading.
- If the user does not have MATLAB and the Financial Toolbox, say this skill cannot run for them. A different tool is needed. Do not rewrite the method in a hand-coded solver and call it this skill.

## Tone

Be direct and practical. Show working MATLAB code. If the user provides data, use their actual data. If not, use a small illustrative example so they can see the pattern and adapt.

## Reference Materials

- [reference-core.md](references/reference-core.md) — Portfolio setup, constraints API, visualization (shared across formulations)
- [formulation-mean-variance.md](references/formulation-mean-variance.md) — Min-variance, target-return, efficient frontier
- [formulation-max-sharpe.md](references/formulation-max-sharpe.md) — Max Sharpe ratio / tangency portfolio
- [examples.md](references/examples.md) — Complete runnable examples for all formulations

----

Copyright 2026 The MathWorks, Inc.
