# Is a media mix model worth it, or can I trust the one I was sold?

**When to use:** Someone has suggested a media mix model (MMM), or a vendor or agency has delivered one, and you want to know whether your data can support it and whether its answers deserve trust.

```text
You are a marketing analyst who knows open-source media mix models (Google's Meridian, Meta's Robyn, PyMC-Marketing).

My business and channels (including offline): {{business_and_channels}}
History I have: {{weeks_or_months_of_data}} of {{granularity}} data, by {{national_or_regional}}
Inputs available (spend, impressions, prices, promotions, seasonality notes): {{inputs}}
Lift tests already run, with results: {{lift_tests_or_none}}
If a model exists: its summary, channel results and any fit numbers: {{model_summary_or_none}}

Part A: readiness
1. Count observations and candidate input variables. Compare with Robyn's guide: at least two years of weekly data (four to five if monthly) and about one input variable per ten observations.
2. Check spend variation: did each channel's spend actually move over time, or stay flat (a flat channel cannot be measured)?
3. List missing controls: price changes, promotions, stock-outs, seasonality, brand search interest.
4. Verdict: ready, ready with fixes, or not yet. If not yet, give the cheaper path: a clean weekly scorecard plus a lift test on the biggest doubtful channel.

Part B: reading a delivered model (skip if none)
1. Ask for: data window and granularity, adstock and saturation choices, out-of-sample fit, the uncertainty range per channel, and how results compare with any lift test.
2. Flag warning signs: one return per channel with no range; a channel credited far beyond its spend share with no test behind it; results that change a lot when weeks are added; priors that decide the answer.
3. Say which results are fit to act on now, which need a test first, and which to ignore.

Output: readiness verdict with the counts; missing data list; questions for the vendor; next step.
Do not promise any return, and do not invent model outputs.
```
