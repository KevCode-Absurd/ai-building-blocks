---
name: macro-rates-monitor
description: Build an India macro and government-rates dashboard from dated official data. Track growth, prices, jobs, policy rates, and sovereign yields when the needed inputs are available. Show source dates, units, gaps, and limits. Do not make investment recommendations.
---

# India macro and government-rates dashboard

> Modified by AI Blocks on 2026-10-24: method/copy repair.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose and limits

Prepare a dated summary of Indian macroeconomic indicators and government rates from inputs supplied by the user or from the official Indian sources listed below. Use India as the sole region. This method does not make market forecasts, investment recommendations, return estimates, or policy decisions. It does not declare a business-cycle phase when the evidence is incomplete. Every number must be traceable to a dated source value or a calculation shown from source values.

The original imported method mixes India-specific instructions with US and euro-area sources, conflicting definitions of real yields, and a swap-spread table without a reliable Indian input. This India-only method removes those items. It does not claim to preserve the original method unchanged. Keep the imported source, its Apache-2.0 license, and provenance records alongside any local adaptation.

## Inputs

Ask for or identify:

- The reference period and the latest acceptable release date.
- The Indian indicators requested: national accounts, CPI, labour statistics, RBI survey results, the policy rate, or government yields.
- Source files or official source pages and their as-of/release dates.
- Any requested yield tenors and the exact meaning of each yield series (for example, fitted zero-coupon yield or security-level traded yield).
- For a real-rate calculation, a nominal yield and an expected-inflation measure with the same horizon, annualization, period, and as-of context.
- Confirmation that the intended use is permitted by the data provider for any restricted source. In particular, do not use CCIL curve data commercially without written permission from CCIL.

If an input or permission is missing, mark the affected output unavailable and state what is missing. Do not infer a missing value, source permission, survey definition, maturity, or period.

## Source and date rules

Use official Indian source releases and retain a source ledger for every input. Record the series/table name, source URL or supplied filename, reference period, release or publication date, retrieval date, unit, geography, population or instrument definition, base year where applicable, and revision/estimate status. Distinguish the date a value describes from the date it was published. Use the latest valid release no later than the user's cutoff; do not call a value “current” without an explicit as-of date.

- **National accounts:** Use current MoSPI National Accounts Statistics/eSankhyiki releases. Keep current-price and constant-price series separate. Record the applicable base year (the current new series uses 2022-23), unit, period, and estimate/revision status exactly as shown in the release. Compare growth only within a consistent series, base, and frequency. Do not splice series across a base-year break unless MoSPI publishes a compatible back series.
- **Prices:** Use MoSPI CPI series and state whether it is All India Combined, Rural, or Urban. For the current CPI series, record base 2024=100. Compare the same geography and series. Compute year-over-year inflation only when both monthly index values are available from the same series and base: `(current_index / index_12_months_earlier - 1) * 100`. Do not use an archived 2012-base series as if it were the current series.
- **Labour:** Use the MoSPI Periodic Labour Force Survey release and name its measure, reference period, population, geography, and unit. The monthly bulletin reports current-weekly-status measures; preserve the age coverage and whether the value is LFPR, WPR, or unemployment rate. Note the PLFS method change from January 2025 when comparing across that break. Do not silently treat different survey measures as interchangeable.
- **RBI surveys:** Use only the measure and survey period stated in the RBI release. Describe survey responses as survey evidence, not as realized GDP, inflation, or employment. Household inflation expectations are expectations from surveyed households; they are not market-implied inflation or a matched-maturity breakeven. Use an expectation in a real-rate calculation only if its horizon and reference context match the nominal yield input.
- **Policy rate:** Use a dated RBI policy statement or RBI rates page. Record the rate name, percentage unit, effective/announcement date, and retrieval date. Do not infer a future rate path.
- **Government yields:** CCIL's Zero Coupon Sovereign Rupee Yield Curve (ZCYC) is a fitted zero-coupon curve built from eligible Government of India security and Treasury-bill trade data, not an executable quote or a par-yield curve. Use the dated CCIL downloadable curve only when the user's supplied file or permitted access establishes the observation date and use rights. CCIL states that commercial use of website data requires written permission. Without verified permission, omit the curve values and write “unavailable: CCIL commercial-use permission not verified.” A CCIL Market Watch security quote is a security-level bid/offer observation and must not be presented as the fitted ZCYC. Do not invent curve points or fill absent tenors.

Do not use FRED, US Treasury, TIPS, ECB, or euro-area series in this India-only dashboard. Do not produce swap rates or a swap-spread table unless the user supplies a dated, licensed Indian swap-rate series with instrument, tenor, quote convention, unit, and a comparable government-yield observation. If any of those are absent, say “not calculated: comparable licensed swap input unavailable.”

## Periods and units

Use Indian fiscal-year notation with calendar dates, such as `Q1 FY2025-26 (Apr-Jun 2025)` or `FY2025-26 (Apr 2025-Mar 2026)`. Never use an ambiguous label such as `FY26` by itself. Preserve the source's units. If converting, state the original unit, conversion factor, and result unit. One crore rupees is ₹10,000,000; one lakh crore rupees is ₹1,000,000,000,000. Show rates and inflation in percent; show a difference in percentage points or basis points (100 basis points = 1 percentage point). Do not mix percent with percentage points.

## Calculations

Show each formula and its input values. Calculate only when all inputs match the required series and periods.

- Growth: `(current_value / comparison_value - 1) * 100`, using the same series, unit, base, and comparable period.
- Yield-curve slope: `long-tenor zero-coupon yield - short-tenor zero-coupon yield`, from the same curve and observation date. Report the result in percentage points and, if useful, basis points.
- Expected real yield: use the exact Fisher relation only when the nominal yield and expected inflation are both annualized percentages for the same horizon and context: `((1 + nominal_yield_pct / 100) / (1 + expected_inflation_pct / 100) - 1) * 100`. Name the nominal instrument/source and the expectation source, period, and horizon. This is a derived expected real yield, not a realized return or an investment return forecast. If the horizons do not match or an input is missing, report `n/a` with the specific reason. Never substitute a US TIPS breakeven or simply label a nominal-minus-inflation difference as an exact real rate.

## Interpretation

Separate reported facts, calculations, and interpretation. Describe only the signals present in the supplied, comparable data. Do not label the cycle as expansion, slowdown, recession, or recovery based on one series, missing values, incomparable periods, or unreconciled revisions. When evidence is insufficient, state `cycle assessment not made: [specific missing or conflicting evidence]`. Do not turn a survey response, one yield move, or a policy rate into a causal conclusion. Do not state expected portfolio returns or recommend a trade.

## Output

Use a compact dashboard with:

1. **As of:** the data cutoff and retrieval date.
2. **Source ledger:** indicator, source and series, value, unit, reference period, release date, base/definition, and revision status.
3. **Macro indicators:** only supported values and calculations, with formulas where calculated.
4. **Government yields:** dated ZCYC tenors and zero rates only when source, observation date, and permitted use are established; otherwise state why unavailable. Do not substitute security quotes for curve points.
5. **Expected real yield:** only matched-horizon calculations; otherwise `n/a` and the missing match.
6. **Interpretation and gaps:** cautious observations, unresolved revisions, missing inputs, and any omitted measures.

Do not output a fabricated number, an invented table row, an unverified data-use permission, a swap spread without both comparable inputs, or a cycle verdict without adequate evidence. Label any synthetic example “fictional illustration—not observed data.”

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Nonprofit program measurement planner](https://useaiblocks.com/skills/nonprofit-program-measurement-planner). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Fictional worked example and checks

All values in this example are invented solely to demonstrate arithmetic. They are not Indian official data and must never be copied into a live dashboard.

Supplied fictional inputs for `Q1 FY2025-26 (Apr-Jun 2025)`: constant-price output is ₹100 crore; the comparable prior-year quarter is ₹95 crore, with the same series and base. Growth is `(100 / 95 - 1) * 100 = 5.263%`, rounded to 5.26%. Check 1: the calculation uses two supplied same-series values and has a percent unit. Check 2: the output period is labeled as a fiscal quarter with calendar months.

Supplied fictional CPI Combined 2024=100 index values are 110.0 for Sep 2026 and 106.8 for Sep 2025. Inflation is `(110.0 / 106.8 - 1) * 100 = 2.996%`, rounded to 3.00%. Check 1: the two values have the same geography, series, and base. Check 2: the calculation compares the same month one year apart.

Supplied fictional annual yields on one observation date: one-year zero yield 6.20% and ten-year zero yield 7.00%; fictional matched one-year expected inflation is 4.50%. The slope is `7.00% - 6.20% = 0.80 percentage points = 80 basis points`. The one-year expected real yield is `((1.062 / 1.045) - 1) * 100 = 1.63%`. Check 1: slope inputs are from the same date and curve. Check 2: the real-yield inputs have matching one-year horizons and annualized percent units. These are fictional calculations, not a claim that a real CCIL curve or forecast was available. No swap input is supplied, so no swap spread is calculated. No cycle label is made because the example does not provide a sufficient set of comparable macro series.
