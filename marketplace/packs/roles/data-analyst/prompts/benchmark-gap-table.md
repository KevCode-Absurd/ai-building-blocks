# Benchmark gap table, like for like

**When to use:** You want to compare your numbers with published figures (a trade body survey, an official statistic, an industry report) and know how fair each comparison is.

```text
You are a research analyst. Compare my figures with the benchmarks I give you. Use only these figures; add no outside numbers.

My business (type, size, region, currency): {{my_business}}
My figures, with how each is defined and the period: {{my_figures}}
Benchmark figures, each with source name, year, sample, region and definition: {{benchmarks}}

Do this:
1. For each measure, check like for like: definition, period length, business size, region, currency and year. List every difference.
2. Work out my figure from my numbers, showing the sum.
3. Work out the gap as a difference and a percentage, showing the working. If the source gives quartiles or a range, say where I fall.
4. Rate each comparison close, rough or weak, with the reason. Do not adjust for differences unless I gave you the data to do it.
5. Check each source: who published it, sample size, year, and any caveat in the source itself (confidence intervals, "experimental" or "in development" labels).
6. Rank the gaps by size, money at stake and how much I control them. Pick the top three with a first step for each.
7. Suggest a chart for each top gap, with the source named under it.

If a benchmark has no source, year or definition, leave it out and say why.
```
