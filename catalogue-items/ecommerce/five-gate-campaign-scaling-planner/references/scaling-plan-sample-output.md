# Sample output: `/scaling-plan`

VitaReds. 5 campaigns. Meta + Google mix. Target CPA $35. Target ROAS 3.0x. Redacted.

---

## Scale-Readiness Summary

| Campaign | Platform | CPA | ROAS | CTR | Freq | Scale-Ready | Blocking |
|----------|----------|-----|------|-----|------|-------------|----------|
| Meta - UGC Prospecting | Meta | $27 | 5.0x | 1.8% | 2.1 | YES | — |
| Meta - Lifestyle Prospecting | Meta | $42 | 3.0x | 1.2% | 2.8 | NO | Check 1 (CPA above target) |
| Meta - Reviews Retargeting | Meta | $18 | 6.0x | 2.4% | 4.2 | NO | Check 5 (freq >3.0 + creative fatigue) |
| Google - Branded Search | Google | $12 | 12x | 6% | N/A | YES | — |
| Google - PMax Shopping | Google | $38 | 2.8x | 1.1% | N/A | NO | Check 4 (ROAS just below target) |

2 campaigns scale-ready. 3 blocked. Address blockers in parallel with scaling the 2 qualified.

---

## Budget Pacing Status

**Current month:** Day 18 of 30 (60% elapsed)
**Monthly cap:** $25,000
**Spend to date:** $14,400
**3-day rolling avg:** $820/day
**Projected EOM:** $24,240 (97% of cap)
**Status:** ON PACE

[ANNOTATION: No pacing pressure. Scaling decisions can be made purely on merit, not to hit spend.]

---

## Scaling Recommendations

### Campaign 1: Meta - UGC Prospecting

**Method:** Vertical Scaling (Low risk)
**Current:** $225/day
**Recommended end state:** $390/day (+73% over 4 weeks)

Week-by-week:
- Week 1: $225 → $270 (+20%)
- Week 2: $270 → $324 (+20%)
- Week 3: $324 → $390 (+20%)
- Week 4: hold, evaluate saturation

Expected impact: +$825/day revenue by end of week 3 at 5.0x ROAS (factor 10% decay → +$735/day realistic).
Monthly impact: +$22,050/month additional revenue.
Risk: LOW (proven winner, under frequency cap).

### Campaign 2: Google - Branded Search

**Method:** Not vertical (already at 12x). Check Lost IS.
**Current:** $45/day. Lost IS (Budget) = 8%. Lost IS (Rank) = 2%.
**Recommended:** +$4/day to $49/day.
**Method:** Vertical Scaling at small increment.

Branded search at 12x ROAS is a floor, not a ceiling. Incremental scaling captures any remaining demand.

Expected impact: +$48/day revenue = +$1,440/month.
Risk: LOW (branded demand is known).

**Opportunity flag:** consider Horizontal Scaling — launch Non-Branded Search campaign to capture new demand. Estimated test budget $30/day, target 3x ROAS.

---

## Blockers (Do These in Parallel)

### Meta - Lifestyle Prospecting (CPA too high)
- Diagnose: creative specifically, not audience
- Run `/creative-diagnostics` on the Lifestyle creatives
- Target: reduce CPA to $35 within 14 days
- If it hits $35, rerun `/scaling-plan` to get scale-ready

### Meta - Reviews Retargeting (fatigue)
- Frequency 4.2 is in refresh zone
- Run `/ab-test` to spin up new retargeting creatives
- Expected: CTR should climb back above 2.0% once fresh creative launches
- Target: frequency back under 3.0, then rerun scale-readiness

### Google - PMax (ROAS just below target)
- Diagnose asset group quality first
- Run `/google-audit` or equivalent on this campaign specifically
- If underperformance is structural (wrong audience signals), reconfigure
- Target: ROAS 3.2x+ within 14 days

---

## Saturation Watchlist

| Campaign | Signal | Current | Threshold | Status |
|----------|--------|---------|-----------|--------|
| Meta - UGC Prospecting | Frequency | 2.1 | 4.0 | Healthy |
| Meta - Reviews Retargeting | Frequency | 4.2 | 8.0 | Caution |
| Meta - Lifestyle | CPM | $14 | $16 (14-day avg) | Healthy |
| Google - Branded | Impression Share | 92% | 80% saturation | Near ceiling |
| Google - PMax | IS Lost (Budget) | 12% | <5% saturation | Healthy |

---

## 30-Day Projection

```
Current state:
- Daily spend: $820
- Daily revenue: $2,132
- Blended ROAS: 2.60x
- Monthly: $24,600 spend → $63,960 revenue

Projected (scaling UGC + branded, others blocked):
- Daily spend: $1,010
- Daily revenue: $2,866 (includes 10% decay on UGC)
- Blended ROAS: 2.84x
- Monthly: $30,300 spend → $85,980 revenue

Delta: +$22,020/month at blended 2.84x
```

Requires raising monthly cap from $25K to $30K.

---

## Next Check-In

Re-run `/scaling-plan` weekly (every Monday). Expected sequence:
- Week 1: UGC to $270, Branded to $49
- Week 2: UGC to $324, Lifestyle unblocked (CPA fix)
- Week 3: UGC to $390, Reviews unblocked (creative refresh)
- Week 4: hold scales, begin non-branded search test
