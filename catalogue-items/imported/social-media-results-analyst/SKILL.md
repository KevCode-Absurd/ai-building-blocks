---
name: "social-media-analyzer"
description: Social media campaign analysis and performance tracking. Calculates engagement rates and platform benchmarks, with financial ROI only when measured attributed revenue is supplied. Use when analyzing social media performance, calculating engagement rate, measuring campaign ROI, comparing platform metrics, or benchmarking against industry standards. Also use when the user mentions "social media audit," "engagement rate," or "which platform performs best."
triggers:
  - analyze social media
  - calculate engagement rate
  - social media ROI
  - campaign performance
  - compare platforms
  - benchmark engagement
  - Instagram analytics
  - Facebook metrics
  - TikTok performance
  - LinkedIn engagement
---

# Social Media Analyzer

Campaign performance analysis with engagement metrics, measured financial ROI when revenue data is supplied, and platform benchmarks.

---

## Table of Contents

- [Analysis Workflow](#analysis-workflow)
- [Engagement Metrics](#engagement-metrics)
- [Financial Return](#financial-return)
- [Platform Benchmarks](#platform-benchmarks)
- [Tools](#tools)
- [Examples](#examples)

---

## Analysis Workflow

Analyze social media campaign performance:

1. Validate input data completeness (reach > 0, dates valid)
2. Calculate engagement metrics per post
3. Aggregate campaign-level metrics
4. Calculate financial ROI only when attributed revenue and matching spend are provided
5. Compare against platform benchmarks
6. Identify top and bottom performers
7. Generate recommendations
8. **Validation:** Engagement rate < 100%; financial ROI requires supplied attributed revenue and matching spend

### Input Requirements

| Field | Required | Description |
|-------|----------|-------------|
| platform | Yes | instagram, facebook, twitter, linkedin, tiktok |
| posts[] | Yes | Array of post data |
| posts[].likes | Yes | Like/reaction count |
| posts[].comments | Yes | Comment count |
| posts[].reach | Yes | Unique users reached |
| posts[].impressions | No | Total views |
| posts[].shares | No | Share/retweet count |
| posts[].saves | No | Save/bookmark count |
| posts[].clicks | No | Link clicks |
| total_spend | No | Spend matched to the campaign period |
| attributed_revenue | No | Measured revenue attributed to this campaign |
| attribution_method | No | How revenue was attributed; required for financial ROI |
| attribution_window | No | Attribution period; required for financial ROI |

### Data Validation Checks

Before analysis, verify:

- [ ] Reach > 0 for all posts (avoid division by zero)
- [ ] Engagement counts are non-negative
- [ ] Date range is valid (start < end)
- [ ] Platform is recognized
- [ ] Spend > 0 if ROI requested

---

## Engagement Metrics

### Engagement Rate Calculation

```
Engagement Rate = (Likes + Comments + Shares + Saves) / Reach × 100
```

### Metric Definitions

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| Engagement Rate | Engagements / Reach × 100 | Audience interaction level |
| CTR | Clicks / Impressions × 100 | Content click appeal |
| Reach Rate | Reach / Followers × 100 | Content distribution |
| Virality Rate | Shares / Impressions × 100 | Share-worthiness |
| Save Rate | Saves / Reach × 100 | Content value |

### Performance Categories

| Rating | Engagement Rate | Action |
|--------|-----------------|--------|
| Excellent | > 6% | Scale and replicate |
| Good | 3-6% | Optimize and expand |
| Average | 1-3% | Test improvements |
| Poor | < 1% | Analyze and pivot |

---

## Financial Return

Calculate activity costs from engagement and click counts. Calculate financial return only when the input includes measured attributed revenue, matching spend, the attribution method, and its window:

1. Sum total engagements across posts
2. Calculate cost per engagement (CPE)
3. Calculate cost per click (CPC) if clicks available
4. Do not assign dollar values to likes, comments, shares, saves or clicks.
5. When attributed revenue, spend, method, and window are supplied, calculate `ROAS = attributed revenue / spend` and `financial ROI = (attributed revenue - spend) / spend × 100`.
6. Otherwise return financial ROI as unavailable and say which inputs are missing. Never recommend budget increases from engagement rates or a dollar proxy.

### ROI Formulas

| Metric | Formula |
|--------|---------|
| Cost Per Engagement (CPE) | Total Spend / Total Engagements |
| Cost Per Click (CPC) | Total Spend / Total Clicks |
| Cost Per Thousand (CPM) | (Spend / Impressions) × 1000 |
| Return on Ad Spend (ROAS) | Revenue / Ad Spend |

### Financial ROI Interpretation

| ROI % | Rating | Recommendation |
|-------|--------|----------------|
| > 500% | High reported return | Verify attribution window, margin, and incremental lift before a budget decision |
| 200-500% | Positive reported return | Check margin and attribution quality before expansion |
| 100-200% | Positive reported return | Review costs and conversion quality |
| 0-100% | Low or break-even reported return | Check revenue coverage and costs |
| < 0% | Negative reported return | Review costs, attribution, and campaign setup |

---

## Platform Benchmarks

These figures are rough industry averages. They change by year, industry and account size, and no source or date comes with them here. Use them as a loose guide, check them against your own past results, and see `references/platform-benchmarks.md` for more.

### Engagement Rate by Platform

| Platform | Average | Good | Excellent |
|----------|---------|------|-----------|
| Instagram | 1.22% | 3-6% | >6% |
| Facebook | 0.07% | 0.5-1% | >1% |
| Twitter/X | 0.05% | 0.1-0.5% | >0.5% |
| LinkedIn | 2.0% | 3-5% | >5% |
| TikTok | 5.96% | 8-15% | >15% |

### CTR by Platform

| Platform | Average | Good | Excellent |
|----------|---------|------|-----------|
| Instagram | 0.22% | 0.5-1% | >1% |
| Facebook | 0.90% | 1.5-2.5% | >2.5% |
| LinkedIn | 0.44% | 1-2% | >2% |
| TikTok | 0.30% | 0.5-1% | >1% |

### CPC by Platform

| Platform | Average | Good |
|----------|---------|------|
| Facebook | $0.97 | <$0.50 |
| Instagram | $1.20 | <$0.70 |
| LinkedIn | $5.26 | <$3.00 |
| TikTok | $1.00 | <$0.50 |

See `references/platform-benchmarks.md` for complete benchmark data.

---

## Tools

### Calculate Metrics

```bash
python scripts/calculate_metrics.py assets/sample_input.json
```

Calculates engagement rate, CTR, reach rate for each post and campaign totals.

### Analyze Performance

```bash
python scripts/analyze_performance.py assets/sample_input.json
```

Generates full performance analysis with ROI, benchmarks, and recommendations.

**Output includes:**
- Campaign-level metrics
- Post-by-post breakdown
- Benchmark comparisons
- Top performers ranked
- Actionable recommendations

---

## Examples

### Sample Input

See `assets/sample_input.json`. The block below is shortened to one post, so its totals are smaller than the sample output's:

```json
{
  "platform": "instagram",
  "total_spend": 500,
  "posts": [
    {
      "post_id": "post_001",
      "content_type": "image",
      "likes": 342,
      "comments": 28,
      "shares": 15,
      "saves": 45,
      "reach": 5200,
      "impressions": 8500,
      "clicks": 120
    }
  ]
}
```

### Sample Output

See `assets/expected_output.json`:

```json
{
  "campaign_metrics": {
    "total_engagements": 1521,
    "avg_engagement_rate": 8.36,
    "ctr": 1.55
  },
  "roi_metrics": {
    "total_spend": 500.0,
    "cost_per_engagement": 0.33,
    "attributed_revenue": null,
    "financial_roi_percentage": null
  },
  "insights": {
    "overall_health": "excellent",
    "benchmark_comparison": {
      "engagement_status": "excellent",
      "engagement_benchmark": "1.22%",
      "engagement_actual": "8.36%"
    }
  }
}
```

### Interpretation

The sample campaign shows:
- **Engagement rate 8.36%** vs 1.22% benchmark = Excellent (6.8x above average)
- **CTR 1.55%** vs 0.22% benchmark = Excellent (7x above average)
- **Financial ROI:** unavailable because attributed revenue was not supplied
- **Recommendation:** Compare engagement and click costs; do not infer business return from them

---

## Reference Documentation

### Platform Benchmarks

`references/platform-benchmarks.md` contains:

- Engagement rate benchmarks by platform and industry
- CTR benchmarks for organic and paid content
- Cost benchmarks (CPC, CPM, CPE)
- Content type performance by platform
- Optimal posting times and frequency
- ROI calculation formulas

## Proactive Triggers

- **Engagement rate below platform average** → Content isn't resonating. Analyze top performers for patterns.
- **Follower growth stalled** → Content distribution or frequency issue. Audit posting patterns.
- **High impressions, low engagement** → Reach without resonance. Content quality issue.
- **Competitor outperforming significantly** → Content gap. Analyze their successful posts.

## Output Artifacts

| When you ask for... | You get... |
|---------------------|------------|
| "Social media audit" | Performance analysis across platforms with benchmarks |
| "What's performing?" | Top content analysis with patterns and recommendations |
| "Competitor social analysis" | Competitive social media comparison with gaps |

## Communication

Hand back a short report: the headline numbers, how they compare with the benchmarks, the best and worst posts, and what to do next. Say what you could not measure, and do not guess revenue or return when it was not supplied.

## Related Skills

- **social-post-writer** and **social-post-planner** (in the AI Blocks library): For creating social posts. Use this skill for analyzing performance.
- **campaign-analytics**: For cross-channel analytics including social.
- **content-strategy**: For planning social content themes.
- **marketing-context**: Provides audience context for better analysis.
