---
name: hr-workforce-forecasting
description: "Help workforce planners build and maintain quantitative forecasts of headcount, attrition, and hiring demand. Use when asked to forecast headcount for next year, predict attrition trends, build a hiring demand forecast, model seasonal staffing needs, or improve the accuracy of our workforce forecast."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# Workforce forecasting

Build and maintain quantitative forecasts of headcount, attrition, and hiring demand — grounded in historical data and business drivers — to give TA and finance a reliable basis for planning.

## Steps

1. Ask for the inputs. Required: monthly or quarterly headcount and exits for the past period, and the horizon to forecast. Helpful: growth goals or business drivers, known events (launch, new office), and the last forecast. If history is missing, ask once. If it is still missing, stop and say a forecast needs history. Do not invent figures.
2. Check the data. Count the periods. Under 12 months of history is too short to see seasonal swings, so say so and give a simple range, not a seasonal forecast. List gaps, odd spikes and anything that looks like a data error.
3. Choose a method and say why in one or two lines: a trend line (little data or a steady business), a driver-based model (headcount tied to revenue or workload, when the person gave the driver), or a statistical method (long, steady history, and a tool that can run it). Prefer the simplest method the data supports.
4. Back-test if there is enough history. Hide the last 3 to 6 periods, forecast them, and compare with what happened. Report the size of the miss. Skip this step and say so if there is too little data.
5. Build the forecast: headcount, exits by team (and tenure if the data has it), and hiring demand (headcount change plus exits). Add the effect of any known event the person named.
6. Show a range, a low and a high case, and say in plain words what moves the range. Do not give one number alone.
7. If the person has a top-down target from finance, reconcile it with the bottom-up number and show the gap and where it comes from.
8. Finish with what to update next and when.

## Output

```markdown
## Headcount forecast: <team or company>, <horizon>

### Method and why
<method chosen, data used, data problems>

### Forecast by <month or quarter>
| Period | Headcount (low / mid / high) | Expected exits | Hires needed |
|--------|------------------------------|----------------|--------------|
| <period> | <low / mid / high> | <number> | <number> |

### Hiring demand by team
| Team | Exits | Growth | Hires needed |
|------|-------|--------|--------------|

### Back-test
<how far the method missed on past periods, or "not enough history">

### Gap to target
<top-down target vs bottom-up number, and the reasons for the gap>

### Assumptions and next refresh
- <assumption>
```

If the AI can build a spreadsheet, offer it with one tab per table. If it cannot, give the tables as text.

## Supported tasks

- Building headcount forecasts based on historical trends and business drivers
- Forecasting attrition rates by function, level, and tenure band
- Modeling hiring demand forecasts tied to revenue or operational targets
- Forecasting seasonal or cyclical staffing needs
- Reconciling top-down business targets with bottom-up hiring forecasts
- Selecting appropriate forecasting methods (trend-based, driver-based, statistical)
- Backtesting forecast accuracy against actual outcomes
- Communicating forecast uncertainty and confidence ranges to stakeholders
- Integrating workforce forecasts with recruiting capacity planning
- Forecasting the workforce impact of known future events (product launch, expansion)

## Key prompts

### Building forecasts

1. "Build a headcount forecast for [function] over the next [timeframe] based on historical growth and [business driver]."
2. "Forecast attrition rates for [function/level] over the next [timeframe] based on historical patterns and current risk signals."
3. "Model a hiring demand forecast for [team] tied to [revenue target/operational metric]."
4. "Forecast seasonal staffing needs for [function] based on the past [number] years of hiring and departure patterns."

### Method and reconciliation

1. "What forecasting method — trend-based, driver-based, or statistical — best fits our data maturity for [function]?"
2. "Reconcile a top-down headcount target from finance with a bottom-up hiring forecast from the business — where do they diverge and why?"
3. "Backtest our last [timeframe] forecast against actual outcomes and identify where accuracy broke down."
4. "What is the minimum amount of historical data needed before a driver-based forecast becomes more reliable than a simple trend line?"

### Communication and use

1. "How should we present forecast uncertainty (confidence ranges, scenario bands) rather than a single misleadingly precise number?"
2. "How should this workforce forecast translate into recruiting capacity planning for the next quarter?"
3. "How often should forecasts be refreshed for a fast-changing business versus a stable, mature one?"

### Event-driven forecasting

1. "Forecast the workforce impact of [a known future product launch / market expansion / restructuring]."
2. "How should we adjust our standing forecast when an unplanned event changes hiring demand mid-quarter?"
3. "Design a rapid-response forecasting process for events, like an acquisition, that require a workforce plan within days rather than weeks."

## Tips

- Present forecasts as ranges with confidence levels, not single precise numbers — false precision erodes trust when reality deviates.
- Backtest regularly; a forecasting method that worked two years ago may no longer fit if business dynamics have shifted.
- Reconcile top-down and bottom-up numbers explicitly rather than picking one silently — the gap itself is often the most useful insight.
- Update forecasts on a fixed cadence tied to business planning cycles, not ad hoc, so stakeholders know when to expect revisions.
- Keep the forecasting method as simple as the data quality supports — a sophisticated statistical model built on poor data is less reliable than a well-reasoned driver-based estimate.
