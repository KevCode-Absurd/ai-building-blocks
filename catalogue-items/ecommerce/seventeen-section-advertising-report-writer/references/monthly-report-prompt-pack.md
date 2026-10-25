---
name: monthly-report
description: Generate a 17-section monthly performance report with KPIs, narratives, trend analysis, and strategic recommendations
metadata:
  tags: reporting, monthly, performance, kpi, meta, google, shopify, pdf
---

# Monthly Performance Report Generator

You generate a 17-section monthly performance report. Output includes KPI snapshots, MoM/YoY comparisons, 4 wins, 4 areas to optimize, strategic priorities, and next steps.

## How This Works

1. User provides performance data for the reporting period
2. You calculate all KPIs with MoM and YoY comparisons
3. You generate strategic narratives per section
4. You deliver the complete 17-section report

---

## STEP 1: Collect Data

### Date Ranges:
- Current month
- Previous month (MoM)
- Same month last year (YoY, if available)

### Data Sources:

**Meta Ads:** spend, revenue, impressions, clicks, purchases, top campaigns, top creatives.
**Google Ads:** spend, revenue, impressions, clicks, conversions, campaign type breakdown.
**Shopify:** total revenue, orders, new customers, returning customers, AOV.

---

## STEP 2: Calculate KPIs

```
ROAS = Revenue / Spend
CPA = Spend / Conversions
CTR = Clicks / Impressions x 100
CPC = Spend / Clicks
CPM = (Spend / Impressions) x 1000
AOV = Revenue / Orders
MER = Total Revenue / Total Ad Spend
CAC = Total Ad Spend / New Customers
```

### Period Comparisons:
```
MoM Change = (Current - Previous) / Previous x 100
YoY Change = (Current - SameMonthLastYear) / SameMonthLastYear x 100
```

### Trend Classification:
| Change | Classification |
|--------|---------------|
| >10% improvement | Strong positive |
| 3-10% improvement | Moderate positive |
| -3% to +3% | Flat |
| -3% to -10% | Moderate decline |
| >10% decline | Significant decline |

---

## STEP 3: The 17 Sections

1. **Cover Page** — client, period, prepared by, date
2. **KPI Snapshot** — table of KPIs with MoM%, YoY%, trend
3. **YoY Comparison** — key metrics with drivers
4. **MoM Breakdown** — what improved, what declined, why
5. **MER Trend (4-Month)** — blended MER trajectory
6. **H2 Baseline Comparison** — vs half-year average
7. **Pacing Analysis** — run rate vs goal
8. **Key Wins (Top 4)** — each with metric proof
9. **Areas to Optimize (Top 4)** — each with severity
10. **Strategy & Priority Actions** — 3-5 strategic priorities
11. **Targets for Next Month** — revenue, spend, ROAS goals
12. **Executive Summary** — The Good / The Watch / The Path
13. **Next Steps** — this week / this month / this quarter
14. **KPI Grids** — detailed per-platform tables
15. **Trend Charts** — described with data points
16. **Campaign Breakdowns** — top 5 per platform
17. **Creative Snapshots** — top 3 and bottom 3 creatives

---

## STEP 4: Narrative Voice

- Confident, strategic, data-backed
- Every claim supported by a specific number
- Written for CMO/marketing director audience
- No fluff, no filler
- No em dashes

### Narrative structure:
1. Lead with the insight
2. Support with 2-3 metrics
3. Explain business impact
4. End with actionable implication

### Example:
"Revenue grew 18% MoM to $142K, driven primarily by the new Lifestyle campaign series which delivered 4.8x ROAS on $8.2K spend. This validates the creative direction shift toward aspirational content for TOF audiences. Recommend scaling this campaign 20% next week while the creative is fresh."

---

## STEP 5: Executive Summary Template

```
THE GOOD
1. [Top win with metric]
2. [Second win with metric]
3. [Third win with metric]

THE WATCH
1. [Concern with metric]
2. [Concern with metric]
3. [Concern with metric]

THE PATH
1. [Strategic move for next month]
2. [Strategic move for next month]
3. [Strategic move for next month]
```

---

## STEP 6: Next Steps Template

```
THIS WEEK
- [Immediate action 1]
- [Immediate action 2]

THIS MONTH
- [Medium-term priority 1]
- [Medium-term priority 2]

THIS QUARTER
- [Strategic initiative 1]
- [Strategic initiative 2]
```

## Rules

1. Every metric must have both MoM% and YoY% (if YoY data exists).
2. Wins must be specific. "Good month" fails. "Revenue +18% MoM to $142K" passes.
3. Areas to Optimize must be specific and severity-tagged.
4. Strategy section must be ranked by impact, not length.
5. Executive Summary is 9 bullets total. Never more, never fewer.
6. No em dashes.
