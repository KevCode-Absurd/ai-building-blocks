---
name: time-series-analysis
description: Temporal pattern detection and forecasting. Use when analyzing trends over time, detecting seasonality, identifying anomalies in time series, or building simple forecasting models for planning.
---

# Time Series Analysis

# When to use
- Building a forecast for operational planning (staffing, inventory, infrastructure capacity)
- Identifying whether a trend is genuine or driven by seasonality
- Detecting anomalies in a metric stream (traffic spikes, revenue dips, error rate surges)
- Providing a "what would have happened" baseline for measuring initiative impact
- Presenting year-over-year growth in a way that accounts for seasonal patterns

# Process
1. **Load and inspect the time series** — confirm regular intervals (fill gaps if needed), check for obvious data quality issues (negative values, zeros in non-zero series), and identify the natural granularity (daily, weekly, monthly).
2. **Test for stationarity** — run an ADF test. If non-stationary (trend or seasonality present), note this — it informs decomposition and model choice rather than blocking analysis. See `references/ts_patterns_guide.md`.
3. **Decompose into components** — separate the time series into trend, seasonal, and residual using additive or multiplicative decomposition. Measure the strength of each component (0–1). Strong seasonality (>0.6) means raw values are misleading without seasonal adjustment.
4. **Detect anomalies** — flag points more than 3 standard deviations from the rolling median. Investigate the top 5 anomalies against the event log (product releases, campaigns, incidents). Use `scripts/ts_analyzer.py --detect-anomalies`.
5. **Fit a forecast model** — fit an ARIMA model (or simpler moving average if data is short). Validate on a held-out 20% test set and report MAPE. Generate point estimates and 95% confidence intervals for the forecast horizon.
6. **Produce the analysis report** — summarise trend direction and strength, seasonal patterns and their business implications, anomaly findings, and the forecast with uncertainty. Use `assets/ts_report_template.md`.

# Plain words
- **ADF test**: a check for whether the numbers keep a steady average over time.
- **Stationarity**: the numbers keep the same average and spread over time. A trend or a season breaks this.
- **ARIMA**: a common forecasting method that predicts the next values from the recent past.
- **MAPE**: the average size of the forecast's miss, as a percent of the real value. Lower is better.

# Inputs the skill needs
- Time series data: date column + one numeric metric column, minimum 2 full seasonal cycles
- Granularity of the data (daily, weekly, monthly)
- Forecast horizon required (days, weeks, months ahead)
- Event log or change log for anomaly investigation
- Business context: what drives this metric, known seasonal patterns

# Output
- `scripts/ts_analyzer.py` — decomposes, detects anomalies, and fits an ARIMA forecast; outputs charts and CSV
- `references/ts_patterns_guide.md` — stationarity, seasonality types, model selection guide, and common pitfalls
- `assets/ts_report_template.md` — report template: characteristics, decomposition summary, anomaly list, forecast table, insights

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Statistical data analyst](https://useaiblocks.com/skills/statistics-helper). It takes the spreadsheet.
- The [Sign-up group retention analyst](https://useaiblocks.com/skills/retention-cohort-analyst). It takes the spreadsheet.
- The [Animal study severity scorer](https://useaiblocks.com/skills/animal-study-severity-scorer). It takes the spreadsheet.
- The [Offline dashboard builder](https://useaiblocks.com/skills/dashboard-builder). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
