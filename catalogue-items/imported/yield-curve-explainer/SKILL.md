---
name: yield-curve-analysis
description: Explain a government yield curve from dated official data. Calculate requested slopes, show sign conventions and missing points, and give neutral context. Market coverage depends on available sources.
---

# Yield Curve Explainer

> Modified by AI Blocks on 2026-10-24: method/copy repair.

## Core principles

Describe the supplied government curve using the source's instrument definition. Compare nominal and real yields only when the source provides compatible observations. Add historical context only when the same series is available over the chosen period. Keep interpretation descriptive; do not call trades or recommend positions.

**Slope sign convention:** state it. "2s10s = −45bp" (inverted) and "10y-2y = +45bp" (steep) are the
same market described two ways. Pick one, label it, and keep it.

## Data sources (free)

| Market and need | Example official source |
|---|---|
| US nominal curve, 1M–30Y, daily | US Treasury daily par yield CSV, no key — the "Daily Treasury Par Yield Curve Rates" page on home.treasury.gov (open the page and use its CSV download; do not guess a URL) |
| US real curve (TIPS) | same feed, `type=daily_treasury_real_yield_curve` |
| Bills / long-term average | same feed, `_bill_rates` / `_long_term` |
| Euro curve | ECB `YC` SDMX, no key |
| India government curve | Use official Indian source data only when the curve definition, date and permitted use are established; do not assume a public quote is a fitted curve |
| Historical yields, keyless | FRED `fredgraph.csv?id=<SERIES>&cosd=…` |
| Macro context | FRED (`GDPC1`, `CPIAUCSL`, `UNRATE`, `DFF`, `SOFR`), IMF DataMapper, World Bank |

> **Verify a series id resolves before you use it** — a wrong FRED id returns a CSV of commas
> rather than an error, so an unchecked id looks like "flat rates".

## Data integrity (non-negotiable)

**Never fabricate a yield.** A plausible-looking curve point is worse than a gap, because nobody
downstream can tell it from a real one. If a tenor or date is unavailable: name the gap, leave the
cell empty, and do not interpolate across a hole without saying that you did.

All free sources are EOD or delayed — not real-time. Carry source + retrieval date on every table.

## Workflow

1. **Set the market and date.** Use the country or currency area named by the user and an official source that identifies the instrument, units and observation date. Do not load India-specific conventions for another market or use US series as an India proxy.
2. **Record nominal points.** Preserve whether the source reports par yields, zero rates or security quotes. List requested tenors; leave unavailable points blank with a reason.
3. **Calculate requested slopes.** State formula and sign convention next to each result. Use same-date values from the same curve. Calculate `10Y−2Y`, `30Y−5Y`, or another slope only when both inputs exist. Do not label a curve flat unless a threshold was defined in advance.
4. **Compare real yields only when supplied comparably.** For US Treasury data, TIPS real yields are observations for their stated dates and tenors. A breakeven is nominal Treasury yield minus same-date, same-tenor TIPS real yield; it is not a pure inflation forecast. For other markets, use the source's real-rate series only when its definition and horizon match.
5. **Add history only from the same series.** State the comparison window and method. Do not infer percentiles or direction from a different instrument or a partial history.
6. **Summarize neutrally.** Separate observed values, calculations and interpretation. Identify missing or incomparable data. Do not frame, size or recommend trades.

## Output format

### Curve table
| Tenor | Nominal rate (source unit) | Comparable real rate (if available) | Breakeven (if matched) |
|-------|-------------|---------------|----------------|
| 2Y | | | |
| 5Y | | | |
| 10Y | | | |
| 30Y | | | |

### Curve metrics
| Metric | Current | 1Y ago | 3Y percentile (where today's value ranks among the daily values of the last 3 years, from the same series) |
|--------|---------|---------|---------------|
| 2s10s (bp) | | | |
| 5s30s (bp) | | | |
| 2s5s10s butterfly (bp) | | | |
| Shape | | | |

### Real-rate comparison (when comparable inputs exist)
| Tenor | Nominal | Breakeven | Real | Notes |
|-------|---------|-----------|------|--------|
| 2Y | | | | |
| 10Y | | | | |

### Plain-language read
Explain what the reported slopes and available real-rate observations show. State the limits of the data and avoid a forecast or trading recommendation. Then offer one next step: compare the same slopes on a later date, or take the figures to your adviser.

## What this skill does not do

- Swap spreads, swap curve shape, basis, or swaption vols — no free source.
- Inflation breakeven curves as a separate feed — derived from nominal minus TIPS instead.
- Live pricing.

Say so rather than approximating. A labelled gap is a useful answer; a fabricated swap spread is not.

## Repaired method and market scope

Follow the market named by the user. The workflow below applies only where a named official source supplies the requested instrument and date. Preserve local period labels and units, and do not substitute another country's yield series. For India, use official Indian curve data only when its source definition and permitted use are established. For the US, distinguish Treasury par yields from zero rates and TIPS real yields. For euro-area curves, use the identified ECB series. Do not claim one source covers every market.

The rules in this section control the whole method above. Use same-date, same-instrument tenor pairs. State slope formula and sign: 10Y−2Y; positive is upward by this convention, negative is inverted. Define a flat threshold before using that label; otherwise report the number only. Butterfly=2×5Y−2Y−10Y, with units and sign stated. Real yield is an observed series where available; do not also call it nominal minus an unrelated inflation series. Breakeven=nominal minus real only for matched instruments, tenors and dates, and is not a pure inflation forecast. Never fabricate or interpolate missing points. Report source, observation date, retrieval date and delayed/EOD status. Do not give trade advice or position sizing.
