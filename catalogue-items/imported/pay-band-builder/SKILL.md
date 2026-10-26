---
name: hr-salary-benchmarking
description: "Help compensation teams and HR leaders benchmark pay against the external market to set competitive, defensible salary ranges. Use when asked to benchmark salaries for [role], compare our pay against market data, build salary ranges from market data, assess whether we're paying competitively, or choose salary survey data sources."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# Salary benchmarking

Benchmark pay against external market data to set a competitive, defensible pay range for a role: pick the right data, match the role, and turn market data into an internal band.

This is pay planning help. It is not legal advice and not a check against pay transparency law. Say so in the output.

## Before you start

You need the role (title, level and what the person does), the location, and market data. Market data is a salary survey extract, a table the user pastes, or a public source they name.

- Salary surveys from vendors such as Radford (Aon), Mercer or Pave are often paid or limited by licence. Don't assume the user has one. Free options to suggest: government wage statistics for the country (for example, the US Bureau of Labor Statistics wage data), and pay ranges shown in public job ads where the law requires them. Say which is thin on detail.
- If there is no market data, don't invent any. Explain the method, list the data to get, and mark every number "MISSING: market data". Stop there.
- Optional: current pay for the role, target percentile, the survey's date, and any geography or level factors the user already uses.

If a required input is missing, ask once. If it stays missing, mark it MISSING and carry on only where you can do so without a guess.

## Steps

1. **Restate the role.** Title, level, scope, location, who it reports to, and the percentile the user wants (ask if not given; the 50th is the usual starting point).
2. **Pick the data.** Say which source you use, its date, and its limits (sample size, location, company size). Say how old it is and whether it needs a refresh.
3. **Match the job.** Find the closest benchmark job in the data. Match on scope and duties, not only title. Note differences, and if the role spans two benchmark jobs, say how you blended them.
4. **Read the market number.** Take the figure at the target percentile for base pay. If total pay matters, add bonus and equity only if the data has them.
5. **Adjust.** Apply any level or location factor the user gave, and show the arithmetic. Don't invent a factor. If none was given, say "no adjustment applied" and name what is missing.
6. **Set the range.** Treat the adjusted market number as the midpoint. Set min and max from a spread the user chooses (state the spread used). Show: midpoint, min = midpoint x (1 - spread / 2), max = midpoint x (1 + spread / 2).
7. **Check competitiveness.** If current pay was given, show where it sits in the range (below min, in range, above max) and its position as a percent of the midpoint.
8. **Handle thin data.** If the role has few data points, say so, widen the range, and suggest a second source.
9. **Write the method note.** Four to six lines a leader can read: source and date, job match, percentile, adjustment, spread, limits. This makes the range easy to defend.

## Output

```
ROLE AND ASSUMPTIONS
DATA USED            <source> | <date> | <limits>
JOB MATCH            <internal role> -> <benchmark job> | differences: <...>
PAY RANGE            min <n> | midpoint <n> | max <n> | currency | percentile | spread
ADJUSTMENTS          <factor> | <amount> | shown arithmetic
COMPETITIVENESS      <current pay> | position in range | compa-ratio (current / midpoint)
METHOD NOTE          <4 to 6 lines for leaders>
MISSING AND NEXT     <data gaps> | refresh date | second source to try
```

If the user asks for a table for several roles, use one row per role with these columns: job code or title, percentile, min, midpoint, max, geography adjustment, source, data date.

## Supported tasks

- Selecting appropriate salary survey and market data sources by role and market
- Matching internal roles accurately to external benchmark job codes
- Building salary ranges from benchmark data adjusted for geography and level
- Assessing whether current pay is competitive against market percentiles
- Benchmarking total compensation, not just base salary, against market
- Handling roles with thin or unreliable market data
- Refreshing salary benchmarks on a regular cadence
- Presenting benchmarking findings to leadership for pay decisions
- Benchmarking pay across multiple countries or regions consistently
- Reconciling internal pay equity considerations with market benchmark data
- Building a benchmarking methodology document for compensation governance
- Comparing benchmarking vendors and data sources for cost and reliability

## Key prompts

### Selecting data and matching roles

1. "What salary survey or market data sources are most appropriate for benchmarking [role] in [industry/region]?"
2. "How should we accurately match our internal [role] to the closest external benchmark job code, given differences in scope?"
3. "Compare the reliability and cost trade-offs of [benchmarking vendor A] vs. [benchmarking vendor B] for [role type]."
4. "How often should we refresh benchmark data for [fast-moving role/industry] versus a more stable function?"

### Building ranges

1. "Build a salary range for [role] in [location] using [percentile target] against current market benchmark data."
2. "Adjust this benchmark-derived salary range for [level/geography] differences from the base survey data."
3. "How should we handle benchmarking for a role with thin or unreliable external market data?"
4. "How do we set ranges for a hybrid role that spans two distinct market benchmark job codes?"

### Assessing competitiveness

1. "Assess whether our current pay for [role/function] is competitive against the [50th/75th] percentile of market data."
2. "Benchmark total compensation, including bonus and equity, for [role] against market, not just base salary."
3. "Benchmark pay for [role] consistently across [multiple countries/regions], accounting for cost-of-labor differences."
4. "What should trigger an off-cycle benchmark refresh for [role] outside our normal annual cadence?"

### Governance and presentation

1. "Present these salary benchmarking findings to leadership with clear recommendations on where pay adjustments are needed."
2. "Draft a benchmarking methodology document explaining our data sources, job matching approach, and refresh cadence."
3. "Reconcile market benchmark data with internal pay equity findings where the two suggest different actions."
4. "Draft governance guidelines for who can approve pay decisions that fall outside the benchmarked range."

## Tips

- Match roles by actual scope and responsibility, not just job title — title inflation or deflation across companies leads to misleading comparisons.
- Benchmark total compensation, not base salary alone; a role that looks underpaid on base may be competitive once bonus and equity are included.
- Refresh benchmarks regularly, especially in fast-moving talent markets; a benchmark more than 12-18 months old can be materially stale.
- Balance market competitiveness with internal pay equity — chasing market data role by role without checking internal consistency creates compression and fairness issues.
- Document your methodology so benchmarking decisions are defensible and repeatable, not dependent on one person's institutional knowledge.
