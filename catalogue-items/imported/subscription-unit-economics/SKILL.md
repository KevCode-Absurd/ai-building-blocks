---
name: unit-economics
description: Analyze unit economics for PE targets — ARR cohorts, LTV/CAC, net retention, payback periods, revenue quality, and margin waterfall. Essential for software/SaaS, recurring revenue, and subscription businesses. Use when evaluating revenue quality, building a cohort analysis, or assessing customer economics. Triggers on "unit economics", "cohort analysis", "ARR analysis", "LTV CAC", "net retention", "revenue quality", or "customer economics".
---

# Unit Economics Analysis

## India

This skill operates on **Indian markets**. Load **`india-market-conventions`**
before building anything, and **`india-market-data`** for sources. Two rules cause
most Indian errors:

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` =
  Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year.
  Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format
  `#,##0,," Cr"` — each trailing comma divides by 1,000, so that format displays
  **lakh under a crore label: a 100× error**. Divide by `10000000` in a live
  formula and label the column `Total Revenue (₹ Cr)`.

What has no Indian equivalent is listed in `NOT-ADAPTABLE.md`. Name the gap —
never substitute a proxy and present it as the real thing.

> In this copy, `india-market-conventions`, `india-market-data` and `NOT-ADAPTABLE.md` are not included. If you do not have them, follow the two rules above, say in the output that the market-data sources were not loaded, and do not state Indian market figures from memory.

## Workflow

### Step 1: Identify Business Model

Determine the revenue model to tailor the analysis:
- **SaaS / Subscription**: ARR, net retention, cohorts
- **Recurring services**: Contract value, renewal rates, upsell
- **Transaction / usage-based**: Revenue per transaction, volume trends, take rate
- **Hybrid**: Break down by revenue stream

### Step 2: Core Metrics

#### ARR / Revenue Quality
- **ARR bridge**: Beginning ARR → New → Expansion → Contraction → Churn → Ending ARR
- **ARR by cohort**: Vintage analysis — how does each annual cohort retain and grow?
- **Revenue concentration**: Top 10/20/50 customers as % of total
- **Revenue by type**: Recurring vs. non-recurring vs. professional services
- **Contract structure**: ACV distribution, multi-year %, auto-renewal %

#### Customer Economics
- **CAC (Customer Acquisition Cost)**: Total S&M spend / new customers acquired
- **LTV (Lifetime Value)**: (ARPU × Gross Margin) / Churn Rate
- **LTV:CAC ratio**: Target >3x for healthy businesses (a rule of thumb, not a sourced figure)
- **CAC payback period**: Months to recover acquisition cost
- **Blended vs. segmented**: Break down by customer segment (enterprise vs. SMB vs. mid-market)

#### Retention & Expansion
- **Gross retention**: % of beginning ARR retained (excludes expansion)
- **Net retention (NDR)**: % of beginning ARR retained including expansion
- **Logo churn**: % of customers lost
- **Dollar churn**: % of revenue lost (often different from logo churn)
- **Expansion rate**: Upsell + cross-sell as % of beginning ARR

#### Cohort Analysis
Build a cohort matrix showing:

| Cohort | Year 0 | Year 1 | Year 2 | Year 3 | Year 4 |
|--------|--------|--------|--------|--------|--------|
| [YEAR] | [REVENUE] | [REVENUE] | [REVENUE] | [REVENUE] | |
| [YEAR] | [REVENUE] | [REVENUE] | [REVENUE] | | |
| [YEAR] | [REVENUE] | [REVENUE] | | | |
| [YEAR] | [REVENUE] | | | | |

Fill every cell from the user's own data. Show both absolute amounts and indexed (Year 0 = 100%) views.

Formulas: cohort index for a year = that year's revenue from the cohort / the cohort's Year 0 revenue × 100. Net retention (NDR) for a period = (beginning ARR + expansion − contraction − churn) / beginning ARR. Gross retention = (beginning ARR − contraction − churn) / beginning ARR. Use the same period (one fiscal year) for each.

#### Margin Waterfall
- Revenue → Gross Profit → Contribution Margin → EBITDA
- Fully loaded unit economics: what does it cost to acquire, serve, and retain a customer?
- Gross margin by revenue stream (subscription vs. services vs. other)

### Step 3: Benchmarking

Compare unit economics to relevant benchmarks. These ranges are common rules of thumb, not sourced data. Check them against the sector before quoting them:
- **SaaS Rule of 40**: Growth rate + EBITDA margin > 40%
- **SaaS Magic Number**: Net new ARR / prior period S&M spend > 0.75x
- **NDR benchmarks**: Best-in-class >120%, good >110%, concerning <100%
- **LTV:CAC**: Best-in-class >5x, good >3x, concerning <2x
- **Gross retention**: Best-in-class >95%, good >90%, concerning <85%
- **CAC payback**: Best-in-class <12mo, good <18mo, concerning >24mo

### Step 4: Revenue Quality Score

Synthesize into a revenue quality assessment:

| Factor | Score (1-5) | Notes |
|--------|-------------|-------|
| Recurring % | | |
| Net retention | | |
| Customer concentration | | |
| Cohort stability | | |
| Growth durability | | |
| Margin profile | | |
| **Overall** | | |

### Step 5: Output

- Excel workbook with ARR bridge, cohort matrix, unit economics dashboard
- Summary slide with key metrics and benchmarks
- Red flags and areas for further diligence

## Important Notes

- Always ask for raw customer-level data if available — aggregate metrics can hide problems
- NDR above 100% can mask high gross churn if expansion is strong enough — always show both
- Cohort analysis is the single most important view for revenue quality — push for this data
- Differentiate between contracted ARR and actual recognized revenue
- For usage-based models, focus on consumption trends and expansion patterns rather than traditional ARR metrics
- Professional services revenue should be evaluated separately — it's not recurring and margins are typically lower

- **Runbook:** [`references/runbook-unit-economics.md`](references/runbook-unit-economics.md) — the end-to-end walkthrough (which skills to load in what order, and the output contract). Skills it names that are not in this copy can be skipped.
