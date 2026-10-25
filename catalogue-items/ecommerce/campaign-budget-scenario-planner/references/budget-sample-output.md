# Sample output: `/budget`

5 campaigns. $25K/month total. Target ROAS 3.0x. Moderate risk tolerance. Redacted.

---

## Campaign Classification

| Campaign | Spend (30d) | Revenue | ROAS | CPA | Tier | Action | New Budget |
|----------|-------------|---------|------|-----|------|--------|------------|
| Prospecting - UGC | $4,500 | $22,500 | 5.0x | $27 | SCALE | +50% phased | $225/day → $337/day |
| Prospecting - Lifestyle | $3,200 | $9,600 | 3.0x | $45 | MAINTAIN | Hold | $107/day |
| Retargeting - Reviews | $2,800 | $16,800 | 6.0x | $18 | SCALE | +40% phased | $93/day → $130/day |
| Prospecting - Founder | $5,100 | $4,080 | 0.8x | $140 | REDUCE | -40% | $170/day → $100/day |
| Retargeting - Offer | $1,400 | $140 | 0.1x | $280 | KILL | Pause | $0 |

Budget freed from REDUCE + KILL: $117/day
Budget needed for SCALE: $149/day
Net: need additional $32/day to fully fund moderate scenarios, OR scale at 70% of moderate.

[ANNOTATION: Kill first, then reduce, then scale. Order matters for cash flow.]

---

## Scaling Plan: Prospecting - UGC

**Current:** $225/day, 5.0x ROAS, 22% Lost IS (Budget) → $49.50/day headroom

### Conservative (50% of headroom = +$25/day → $250/day)
- Projected daily revenue gain: +$125/day
- Monthly impact: +$3,750/mo
- Risk: LOW

### Moderate (75% of headroom = +$37/day → $262/day) - RECOMMENDED
- Projected daily revenue gain: +$185/day
- Monthly impact: +$5,550/mo
- Risk: MEDIUM, 72-hour monitoring

### Aggressive (100% of headroom = +$49/day → $274/day)
- Projected daily revenue gain: +$246/day (assume 15% decay → +$209/day realistic)
- Monthly impact: +$6,270/mo
- Risk: HIGH, daily monitoring

**Recommendation:** Moderate. Phase in 2 moves:
- Week 1: $225 → $250
- Week 2 (if ROAS holds >4.2x): $250 → $262

---

## Scaling Plan: Retargeting - Reviews

**Current:** $93/day, 6.0x ROAS
**Headroom:** no IS data, estimate 15% audience headroom

### Moderate Recommendation
- New daily: $130 (+40%)
- Phase 1: $93 → $112 (Week 1)
- Phase 2: $112 → $130 (Week 2, if ROAS holds >5x)
- Expected monthly impact: +$3,300/mo

---

## Reduction Plan: Prospecting - Founder

**Current:** $170/day, 0.8x ROAS for 22 days

### Reduction Math
- Current ROAS / Target ROAS = 0.8/3.0 = 0.27
- Raw new budget = $170 x 0.27 = $46/day
- Floor is 50% of current = $85/day
- **New budget: $100/day (-40%)**

### Monitor
- Day 7: ROAS should improve to 1.5x+ at lower spend (less wasted inventory)
- Day 14: if ROAS still <2.0x, escalate to KILL
- Day 21: if ROAS at 2.5x+, flag as MAINTAIN candidate

---

## Kill: Retargeting - Offer

Zero revenue on $1,400 spend over 30 days. Pause immediately.
Before relaunching: diagnose landing page, offer strength, audience match.
Save the $47/day for scale campaigns.

---

## Net Impact Projection

```
CURRENT STATE
Total daily spend: $832
Total daily revenue: $1,773
Blended ROAS: 2.13x
Monthly: $24,960 spend → $53,190 revenue

PROPOSED STATE (Moderate recommendations applied)
Total daily spend: $822
Total daily revenue: $2,058 (projected, factoring 10% decay on scales)
Blended ROAS: 2.50x
Monthly: $24,660 spend → $61,740 revenue

NET IMPROVEMENT
- Revenue: +$8,550/month
- Spend: -$300/month
- ROAS: 2.13x → 2.50x (+17%)
```

[ANNOTATION: Most of the win is from killing the dead retargeting campaign and reducing the dead prospecting campaign. Not from scaling. This is typical.]

---

## Implementation Timeline

- **Day 1:** Pause Retargeting-Offer. Reduce Prospecting-Founder to $100/day.
- **Day 2-3:** Phase 1 scale moves (UGC to $250, Reviews to $112).
- **Day 4-7:** No touches. Monitor only.
- **Day 8:** Review. If scale campaigns hold ROAS, execute Phase 2.
- **Day 15:** Full review. Reassess all tiers with fresh data.
- **Day 30:** Complete audit of reallocation impact.

---

## Concentration Check

Top campaign (Prospecting-UGC at proposed $262/day) = 32% of $822 total. Under the 60% concentration cap. Safe.

## No-Scale Scenario

If every campaign failed scale-readiness, the recommendation would be "no budget increases this month, fix creative first." Ship that finding if it applies rather than force-fitting scale.
