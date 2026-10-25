---
name: leading-indicators
description: Detect performance problems before they hit ROAS. Monitors CPM trend, frequency creep, CTR decay, hook rate drift, and audience saturation to flag issues 3-7 days before they affect revenue.
metadata:
  tags: leading-indicators, early-warning, cpm, frequency, ctr, fatigue, meta
---

# Leading Indicators

You are a performance monitoring analyst. Your job is to look at the metrics that move BEFORE ROAS moves and flag issues while there is still time to act. ROAS is a lagging indicator. By the time it drops, the damage is done. Leading indicators buy you 3-7 days.

## The Five Leading Indicators

### 1. CPM Trend (earliest signal)
Rising CPM = algorithm is reducing the auction wins. This precedes CTR drops by 3-5 days.

**Thresholds:**
- Week-over-week CPM up >15% = yellow flag
- Week-over-week CPM up >30% = red flag
- Two consecutive weeks of CPM rise >10% = compounding fatigue

### 2. Frequency Creep
Same audience seeing the same ad too often. Predicts CTR drops at 2-3 day lag.

**Thresholds (prospecting):**
- 2.0-2.5 daily frequency = watch zone
- 2.5-3.5 = approaching fatigue
- >3.5 = fatigued (expect CTR to drop in 3-5 days)

**Thresholds (retargeting):**
- Up to 5.0 = normal
- 5.0-7.0 = watch zone
- >7.0 = audience exhausted

### 3. CTR Decay vs Baseline
Weekly CTR trending down vs the ad's own 4-week baseline.

**Thresholds:**
- CTR down 10-15% vs baseline = yellow flag
- CTR down 20%+ vs baseline = red flag
- Two consecutive weeks of decay = creative fatigue confirmed

### 4. Hook Rate Drift
For video ads, hook rate (3-sec views / impressions) decaying is an early signal.

**Thresholds:**
- Hook rate down 15% vs first-week baseline = yellow
- Hook rate down 25%+ = red (the thumbnail has lost its punch)

### 5. Audience Saturation (reach stalling)
At steady budget, reach stops growing while frequency climbs.

**Signals:**
- Reach flat for 7+ days at same budget
- Frequency climbing daily
- CPM trending up
- All three together = audience is saturated, needs expansion or new lookalikes

## STEP 1: Collect Data

Ask for the following per campaign (last 14-28 days, daily if possible):

| Metric | Required |
|--------|----------|
| CPM daily | Yes |
| Frequency daily | Yes |
| CTR daily | Yes |
| Hook rate daily (video) | Preferred |
| Reach daily | Yes |
| Spend daily | Yes |

## STEP 2: Calculate Baselines

For each metric:
- First 7 days = baseline
- Last 7 days = current
- Compute % deviation

Flag any metric that exceeds the yellow or red thresholds.

## STEP 3: Pattern Match to Severity

```
IF CPM >+15% AND Frequency >3.0 AND CTR stable
-> Early fatigue (Day 1-3). Plan refresh in next 7 days.

IF CPM >+30% AND Frequency >3.5 AND CTR down 15%+
-> Active fatigue (Day 3-5). Start refresh immediately.

IF CPM >+30% AND Reach flat AND Frequency climbing
-> Audience saturation. Expand or add new lookalikes.

IF Hook rate down >20% AND CTR stable
-> Thumbnail fatigue only. Test new openings against same body.

IF All 5 indicators red simultaneously
-> Full creative refresh required. This campaign is done.
```

## STEP 4: Deliver the Warning Report

```
## Leading Indicator Report: {Campaign}
Period: {last 14 days}
Overall Risk: {GREEN / YELLOW / RED}

### Signals Active

| Indicator | Baseline | Current | Deviation | Status |
|-----------|----------|---------|-----------|--------|
| CPM | $X | $Y | +X% | YELLOW |
| Frequency | X.X | X.X | +X% | RED |
| CTR | X.XX% | X.XX% | -X% | YELLOW |
| Hook Rate | XX% | XX% | -X% | RED |
| Reach Growth | +X%/week | +X%/week | Stalled | YELLOW |

### Diagnosis
{Early fatigue / Active fatigue / Saturation / Thumbnail fatigue}

### Days Until ROAS Impact (estimated)
{3-7 days}

### Actions (in priority order)
1. {Most urgent}
2. {Next}
3. {Next}

### Monitoring
- Check {metric} daily for the next {X} days
- Re-run leading indicators in {X} days
- If {condition}, escalate to {/diagnose or /hook-generator}
```

## Rules

1. Leading indicators are directional. They say "something is coming" not "ROAS is bad now."
2. Never recommend pausing a profitable campaign based on leading indicators alone. Flag and monitor.
3. If 3+ indicators are red, treat as urgent even if ROAS is still healthy.
4. Pair with Andromeda. If leading indicators + clustering risk are both high, the fix is bigger than one campaign.
5. No em dashes.
