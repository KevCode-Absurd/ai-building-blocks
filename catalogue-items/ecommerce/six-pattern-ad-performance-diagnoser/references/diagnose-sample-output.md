# Sample output: `/diagnose`

Real output from diagnosing a skincare brand's top prospecting campaign that dropped from 3.2x ROAS to 1.4x in 10 days. Redacted.

---

```
CAMPAIGN DIAGNOSIS
==================
Campaign: Prospecting - Broad - US
Period Analyzed: Feb 10 - Feb 23
Data Quality: HIGH (30+ days baseline available)

PRIMARY DIAGNOSIS:
- Issue: Creative fatigue on top-spending ad
- Severity: HIGH
- Confidence: 0.87 (Strong)
- Pattern Match: Pattern 1 - Creative Fatigue

TRIGGER METRICS:
| Metric    | 7-day  | 14-day | 30-day (baseline) | Deviation | Status   |
|-----------|--------|--------|-------------------|-----------|----------|
| ROAS      | 1.4x   | 1.9x   | 3.1x              | -55%      | CRITICAL |
| Frequency | 4.7    | 3.9    | 2.8               | +68%      | FAIL     |
| CTR       | 0.62%  | 0.84%  | 1.21%             | -49%      | CRITICAL |
| CPM       | $31.40 | $29.80 | $26.40            | +19%      | WARNING  |
| CPC       | $5.06  | $3.55  | $2.18             | +132%     | -        |
| CPA       | $87    | $58    | $38               | +129%     | CRITICAL |
```

[ANNOTATION: Three of the six diagnostic metrics are CRITICAL. All three are the fingerprint of Pattern 1 (fatigue): ROAS down + Frequency up + CTR down. That combination triggered the +0.15 confidence boost.]

## ROOT CAUSE ANALYSIS

The top-spending ad in this campaign (Ad ID: 23847...) has been running for 47 days and accounts for 71% of campaign spend. Its CTR has decayed 56% from first-week baseline, while 7-day frequency has climbed to 4.7 against the 3.0 prospecting threshold. The audience has seen this ad too many times and engagement is falling off a cliff. CPM is also rising because the algorithm is penalizing low-engagement creative. This is textbook creative fatigue, not an audience or offer problem.

## RECOMMENDED ACTIONS

1. **Immediate:** Halve budget on the fatigued ad (Ad ID ending 23847). Reduce from $240/day to $120/day. Expected impact: Frequency drops back toward 3.0 within 3-5 days.

2. **This week:** Launch 3 refreshed variants of the winning concept. Same offer, same audience, new hooks. Expected impact: CTR recovers to 0.9-1.1%, ROAS to 2.2-2.6x.

3. **Next 2 weeks:** Rotate winners. Never let a single ad exceed 40% of campaign spend on prospecting broader than 1M reach.

## DO NOT

- Increase budget to "push through" the decline. Higher budget on fatigued creative = faster burn and higher CPMs.
- Change the audience. The audience is fine. The creative is tired.
- Pause the whole campaign. Just the fatigued ad.
- Blame CPM inflation. CPM followed CTR, not the other way around.

[ANNOTATION: "DO NOT" is as important as "DO". Most media buyers react to ROAS drops by increasing budget or changing audiences. Both make fatigue worse.]

## MONITORING

- **Day 1-3:** Watch frequency on the paused ad. Should drop from 4.7 toward 3.5.
- **Day 3-5:** Check CTR on the 3 new variants. Minimum bar: 0.9%. If below, they did not fix the fatigue issue, test different angles.
- **Day 7:** Evaluate campaign-level ROAS recovery. Target: back above 2.5x.
- **Day 14:** If ROAS still below 2.5x with fresh creative running, diagnosis was wrong. Re-run with updated data.

## Data Quality Notes

- Baseline confidence: 1.0 (30+ days of clean data)
- All 3 time horizons (7d, 14d, 30d) agreed on direction
- Multi-signal pattern match confirmed (3 of 3 fatigue signals present)
- No conflicting signals (CVR was stable, ruling out Pattern 2)

[ANNOTATION: When confidence >0.80 and the pattern is clear, the skill commits to a specific diagnosis. When confidence drops below 0.60, the output reads more like "here are three possibilities, gather more data".]
