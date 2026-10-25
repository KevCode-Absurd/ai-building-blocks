# Budget Allocation Scorecard

**Campaign-level scorecard. Score every active campaign weekly on 4 signals. Score determines the action: SCALE, MAINTAIN, REDUCE, or KILL.**

---

## The 4 scoring signals

Every campaign gets a score from 0-100 based on 4 weighted inputs.

| Signal | Weight | Measures |
|---|---|---|
| **ROAS / CPA vs target** | 35% | Is it making money at the target efficiency? |
| **Volume** | 25% | Is it delivering meaningful spend and results? |
| **Trend** | 20% | Is it getting better or worse over the last 7 days? |
| **Creative freshness** | 20% | Is the creative fatigued (frequency, CTR decay)? |

---

## Scoring rubric

### 1. ROAS / CPA vs Target (35 points)

Compare to the account's target ROAS (or max CPA).

| Performance vs target | Score |
|---|---|
| 150%+ of target ROAS (or 50%+ below max CPA) | 35 |
| 120-149% of target | 30 |
| 100-119% of target | 25 |
| 80-99% of target | 15 |
| 60-79% of target | 8 |
| Below 60% of target | 0 |

---

### 2. Volume (25 points)

Does the campaign deliver enough to matter?

| 7-day spend | Score |
|---|---|
| $5,000+ | 25 |
| $2,000-$4,999 | 20 |
| $1,000-$1,999 | 15 |
| $500-$999 | 10 |
| $200-$499 | 5 |
| Below $200 | 0 |

**Adjustment:** If the account's total 7-day spend is below $10k, scale the bands down proportionally.

---

### 3. Trend (20 points)

Compare this 7 days to the previous 7 days.

| Direction | Score |
|---|---|
| ROAS up 15%+ AND spend up 15%+ (scaling efficiently) | 20 |
| ROAS up 5-15%, spend flat or up | 15 |
| ROAS flat, spend flat | 10 |
| ROAS down 5-15% | 5 |
| ROAS down 15%+ | 0 |

---

### 4. Creative Freshness (20 points)

Based on frequency + CTR decay on the top-spending ad.

| Signal | Score |
|---|---|
| Frequency < 2.0 AND CTR stable | 20 |
| Frequency 2.0-3.0 AND CTR stable | 15 |
| Frequency 3.0-4.5 AND CTR declining < 15% | 10 |
| Frequency 4.5-6.0 OR CTR declined 15-30% | 5 |
| Frequency > 6.0 OR CTR declined > 30% | 0 |

---

## Composite score → Action

| Score | Action | What to do |
|---|---|---|
| **80-100** | **SCALE** | Increase budget 20-30% week-over-week. Monitor efficiency for 72 hours. |
| **60-79** | **MAINTAIN** | Hold spend. Add 1 new creative variant. Re-score next week. |
| **40-59** | **REDUCE** | Cut budget 30-50%. Investigate creative fatigue or targeting issue. |
| **20-39** | **REDUCE aggressively** | Cut budget 60-70%. Flag for potential kill next week if no improvement. |
| **0-19** | **KILL** | Pause immediately. Redirect budget to SCALE campaigns. |

---

## Example scorecard

### Campaign: TOF_Cold_V2_Lifestyle_Feb

| Signal | Measurement | Score |
|---|---|---|
| ROAS vs target | Target 2.5, actual 3.4 (136%) | 30 |
| Volume | $2,700 spend last 7 days | 20 |
| Trend | ROAS up 22%, spend up 18% | 20 |
| Creative freshness | Frequency 2.8, CTR stable | 15 |
| **Total** | | **85** |

**Action: SCALE.** Increase budget from $400/day to $520/day (+30%). Monitor for 72 hours.

---

### Campaign: Retarget_ProductPage_V3

| Signal | Measurement | Score |
|---|---|---|
| ROAS vs target | Target 4.0, actual 2.8 (70%) | 8 |
| Volume | $680 spend last 7 days | 10 |
| Trend | ROAS down 18% | 0 |
| Creative freshness | Frequency 5.2, CTR declined 26% | 5 |
| **Total** | | **23** |

**Action: REDUCE aggressively.** Cut to $80/day. Add 2 new retarget creatives. Re-score in 7 days. If no improvement, kill.

---

## The SCALE decision (important)

**Do not scale on Fridays.** Weekend CPMs shift unpredictably, attribution lags, and you will misread the scale-up window.

Best scale days: Monday, Tuesday, Wednesday.
Acceptable scale days: Thursday.
Never: Friday, Saturday, Sunday.

Scaling moves:

| Move | When |
|---|---|
| +20% budget | Score 80-89. First scale of the week. |
| +30% budget | Score 90+. Proven 2+ weeks above 80. |
| +50% budget | Rare. Score 95+. Already scaled once this week with stable efficiency. |
| Horizontal scale (duplicate campaign) | When a campaign is above $1k/day and you are hitting CBO / budget-per-adset ceilings |

Never scale more than 30% in a single move. The learning phase disruption kills efficiency.

---

## The KILL decision

**Kill rules:**

- Score 0-19 for 2 consecutive weeks → KILL (no exceptions)
- Spend > $500 with ZERO purchases → KILL immediately
- ROAS < 0.5 × target for 7+ days with > $300 spend → KILL
- New creative test spent $200 with CTR < 0.5% → KILL (don't wait for conversions)

---

## The 4-tier budget allocation rule

Once you have scored all campaigns, split the TOTAL account budget across tiers:

| Tier | Goal | Typical allocation |
|---|---|---|
| **SCALE tier** (score 80+) | Reinforce winners | 50-60% |
| **MAINTAIN tier** (score 60-79) | Protect workhorses | 20-30% |
| **TEST tier** (new launches, <14 days old) | Discover next winners | 10-20% |
| **REDUCE tier** (score 40-59) | Wind down or rescue | 5-10% |

**If allocation drifts outside these ranges for 2+ weeks**, your account is either over-exploiting (too little test budget) or under-exploiting (too much test, not enough scale). Rebalance.

---

## Weekly ritual

Every Monday morning:

1. Pull 7-day campaign performance data from Meta and Google
2. Score every campaign on the 4 signals
3. Apply the action rules (SCALE / MAINTAIN / REDUCE / KILL)
4. Rebalance budget tiers
5. Execute moves in Ads Manager before 10 AM
6. Log decisions in the weekly performance doc
7. Notify the team of all KILLs and SCALEs in Slack

Budget discipline is a weekly habit, not a monthly emergency.

---

## Common mistakes

1. **Scaling on a single day of strong ROAS.** Day-over-day variance is noise. Scale on 7-day trend.
2. **Killing after 3 days at bad ROAS.** Meta's learning phase is 50 conversions. Give it at least 7 days unless spend:0-conversions hits the hard kill rules.
3. **Refusing to kill a "sentimental" campaign.** The founder's favorite ad is not your budget's friend. Score, don't feel.
4. **Never testing.** If 100% of budget is in SCALE + MAINTAIN, you have no pipeline for the next winner.
5. **Scaling during a promo.** Promotion windows distort the signal. Wait until the promo ends and normal attribution returns before scoring.

---

## When the scorecard fails

This scorecard assumes stable attribution and reliable conversion data. It breaks down when:

- iOS 14 attribution loss is severe and unresolved → use platform events + GA4 triangulation
- New pixel / tracking setup still warming (< 14 days) → score manually, not by rubric
- Category has extreme seasonality (holidays, BFCM) → re-baseline against same-period last year
- Account just launched (< 30 days total spend) → use learning-phase-focused rules, not full scorecard

In all edge cases: the scorecard is a guide, not a gun. Human judgment + rubric > rubric alone.
