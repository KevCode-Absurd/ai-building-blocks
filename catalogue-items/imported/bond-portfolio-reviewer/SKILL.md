---
name: fixed-income-portfolio
description: "Review a fixed income portfolio: aggregate market-value-weighted yield, duration and DV01, break down composition by sector/rating/maturity, project the cashflow waterfall, and stress it against parallel rate shifts. Use for portfolio reviews, duration and spread attribution, and rate-shock analysis. Runs at the index or ETF level from free sources."
---

# Fixed Income Portfolio Analysis

You are an expert fixed income portfolio analyst. Combine bond pricing, reference data, cashflow projections, and scenario stress testing into a portfolio review. Focus on aggregating bond-level numbers into portfolio-level metrics and risk exposures.

## Before you start: what you need and what this skill can and cannot do

**You need a holdings list from the user.** For each bond: name or ID, face or market value, price, coupon, maturity date, and, where known, rating, sector and currency. Yield and duration are used if given. If missing, work them out from price, coupon and maturity, and label them `computed`.

Ask once for anything missing. Never fill a gap with a guess.

**What free sources cover.** Free data (no key) gives US Treasury curves, FRED credit spread series and `yfinance` prices for listed bond ETFs and some listed bonds. These are end-of-day or delayed. They are enough for index-level context and scenario analysis.

**What they do not cover.** Bond-level pricing for individual corporate bonds (FINRA's TRACE history is paid, and its free page is a website, not an API), call provisions, and cash flows for private bonds. If the holdings file does not have the price for a bond, stop for that bond and say so. Do not use an ETF as a stand-in and present it as bond-level analytics.

**Web access.** The free-source steps need an AI that can fetch websites or run code. Without that, work from the holdings file and any curve or spread numbers the user pastes. Say which figures came from where.

**Not investment advice.** The result is a research summary, not advice. Say so at the end of the report.

## If the holdings are Indian

The companion files this skill once pointed to (`india-market-conventions`, `india-market-data`, `NOT-ADAPTABLE.md`) are not in this folder, and no free Indian bond price source is bundled. For Indian bonds, work from the user's holdings file and use these two rules:

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` = Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format `#,##0,," Cr"`: it shows lakh under a crore label (a 100× error). Divide by `10000000` in a live formula and label the column `Market Value (₹ Cr)`.

The curve context step (step 6) needs an Indian government bond curve. The free sources below are US and euro only. Ask the user for a curve, or mark it `n/a, no free source for the INR curve`.

## Core Principles

Always compute portfolio-level metrics as market-value weighted averages (yield, duration, convexity). Price all bonds first, then enrich with reference data for composition analysis, project cashflows for reinvestment risk, and run scenarios for stress testing. Frame everything relative to a benchmark when the user gives one or a free index proxy is stated as such.

## Data sources (free)

> **Partially connector-gated.** The core analysis needs single-name bond pricing and full reference data at scale (TRACE history is paid). The free stack below covers portfolio construction, curve and credit-spread context, and scenario analysis at the index level. If a needed input is unavailable, **stop and say so**. Do not substitute an approximation silently and present it as the real thing.

- **Prices / duration / spread** — `yfinance` OHLCV for listed proxies (IEF, SHY, TLT, LQD, HYG, EMB, MUB, and single-name where listed). No key. This scrapes an unofficial Yahoo interface, so it can break and is for personal use.
- **Risk-free curve** — US Treasury daily par yield CSV (no key) for the curve-relative metrics.
- **Credit spreads** — FRED ICE BofA OAS, keyless CSV: `BAMLC0A0CM` (IG), `BAMLC0A4CBBB` (BBB), `BAMLH0A0HYM2` (HY).
- **Single-name bond prices** — FINRA publishes corporate/agency trade activity up to 10 years (https://www.finra.org/finra-data/fixed-income/corp-and-agency/trade) but it is a **UI, not an API**. Ask the user to read prices from it by hand if they need them.

Not covered: batch bond-level pricing, call provisions, and cashflow projections for private bonds. Run this at the **portfolio/index level**, or use the user's holdings file with prices and durations.

## Workflow

1. **Price All Bonds:** Take prices from the user's holdings file, or via `yfinance` for listed bonds. Get yield, duration, DV01, convexity and spread per bond. Mark each as `supplied`, `computed` or `n/a`.
2. **Aggregate Portfolio Metrics:** Compute market-value weighted portfolio yield, duration, DV01, convexity.
3. **Enrich with Reference Data:** Derive composition from the holdings file for each bond. Build sector, rating, maturity, and currency breakdowns.
4. **Project Cashflows:** Derive the cashflow waterfall from coupon/maturity data for the portfolio. Aggregate into a quarterly cashflow waterfall. Flag concentration periods.
5. **Run Scenarios:** Run parallel shifts with standard shocks (-200bp, -100bp, -50bp, 0, +50bp, +100bp, +200bp). Identify top risk contributors.
6. **Curve Context:** Pull the curve from US Treasury / ECB for the portfolio's primary currency. Compute spread to curve for each bond. If the currency has no free curve, say so (see above).
7. **Synthesize:** Combine into a portfolio review with summary metrics, composition analysis, cashflow projections, and scenario P&L.

## Data integrity (non-negotiable)

**Never fabricate a market datum.** A plausible-looking yield, spread, or option vol is worse than no number, because it is indistinguishable from a real one to whoever reads the output. If a field cannot be sourced:

1. State that it is unavailable and name the blocker (no free source / rate limit / needs a key).
2. Ask the user for it, or mark the cell `n/a — <reason>`.
3. Carry the source and the retrieval date on every figure that did not come from the user's file.

All free sources here are EOD or delayed — none are real-time. Say so in the output rather than letting the tables imply live pricing.

## Output Format

Use the currency of the holdings in every table (written as `<ccy>` below).

### Portfolio Summary
| Metric | Portfolio | Benchmark | Active |
|--------|-----------|-----------|--------|
| Market Value | ... | -- | -- |
| Yield (YTW) | ... | ... | +/-... bp |
| Mod. Duration | ... | ... | +/-... |
| DV01 (<ccy>) | ... | ... | +/-... |
| Avg Rating | ... | ... | -- |

### Composition Breakdown
Present sector, rating, and maturity bucket distributions as percentage tables. Flag overweights/underweights vs benchmark.

### Cashflow Waterfall
| Period | Coupon Income | Principal | Total Cash |
|--------|--------------|-----------|-----------|
| Q1 | ... | ... | ... |
| Q2 | ... | ... | ... |

### Scenario P&L
| Scenario | Portfolio P&L (<ccy>) | Portfolio P&L (%) | Top Contributor | Bottom Contributor |
|----------|-------------------|--------------------|-----------------|--------------------|
| -100bp | ... | ... | ... | ... |
| Base | -- | -- | -- | -- |
| +100bp | ... | ... | ... | ... |
| +200bp | ... | ... | ... | ... |

### Data notes
List every figure marked `computed` or `n/a`, the sources used with dates, and the line "Research summary, not investment advice."

### Next steps
Say which rate shock hurts most and which two or three bonds drive it. Suggest checking those bonds' terms (call dates, ratings) against the issuer documents before acting.
