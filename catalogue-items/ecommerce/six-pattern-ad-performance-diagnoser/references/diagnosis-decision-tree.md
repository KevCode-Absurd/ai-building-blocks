# Diagnosis Decision Tree

The flowchart behind `/diagnose`. Use this when you want to diagnose something by hand or teach a junior the logic.

---

## Entry: You notice a performance drop

```
Is the drop real?
    |
    +-- Check: 7-day window vs 14-day vs 30-day
    |       If only 7-day is bad, could be noise. Wait 48h.
    |       If 14-day AND 7-day are bad, it is real. Continue.
    |
    v
Is the campaign still profitable?
    |
    +-- YES (CPA <= baseline AND ROAS >= 1.0)
    |     -> Suppress input-metric warnings (CPC, CPM)
    |     -> Only check for fatigue and frequency signals
    |
    +-- NO
          -> Full diagnostic flow below
```

---

## Multi-signal pattern matching

Check in this order. First match wins.

### 1. Tracking Breakdown? (highest priority)
```
IF Conversions dropped to zero/near-zero
AND Spend continues normally
AND CTR is normal
-> Pattern 6: Tracking Breakdown
-> Confidence: +0.20 (high)
-> Fix: Check pixel, CAPI, conversion tracking IMMEDIATELY
```

### 2. Creative Fatigue?
```
IF ROAS decreased >20%
AND Frequency >3.0 (prospecting) or >5.0 (retargeting)
AND CTR decreased >20% from baseline
-> Pattern 1: Creative Fatigue
-> Confidence: +0.15
-> Fix: Refresh creative. Do NOT increase budget.
```

### 3. Audience Saturation?
```
IF CPM increased >15%
AND Reach decreased >15% (at same budget)
AND Frequency increased >20%
-> Pattern 3: Audience Saturation
-> Confidence: +0.15
-> Fix: Expand audience, new lookalikes, new geos
```

### 4. Conversion Rate Problem?
```
IF CPA increased >30%
AND Spend stable
AND Impressions stable
AND CTR stable (within 10%)
-> Pattern 2: Conversion Rate Problem
-> Confidence: +0.15
-> Fix: Check landing page, offer, checkout
```

### 5. Budget Constraint?
```
IF ROAS >target
AND Daily spend <10x target CPA
AND Learning phase = "Limited"
-> Pattern 4: Budget Constraint
-> Confidence: +0.10
-> Fix: Increase budget, consolidate ad sets
```

### 6. Platform Algorithm Shift?
```
IF CPM spiked across MULTIPLE campaigns
AND No creative/budget/audience changes made
AND Account-wide CPM trend up
-> Pattern 5: Platform Algorithm Shift
-> Confidence: +0.10
-> Fix: Wait 3-5 days. Check industry news.
```

---

## No pattern matched?

Fall back to the 4-level threshold chain:

1. Check per-client custom thresholds first
2. Then account baselines (+/- 30% warning, +/- 50% critical)
3. Then absolute thresholds (ROAS <0.5x = critical, Freq >5.0 = critical)
4. Then industry defaults

Flag whichever metric is farthest from baseline as the primary issue. Confidence stays at 0.50 baseline since no pattern matched.

---

## Confidence band interpretation

| Confidence | What it means | What to do |
|-----------|---------------|-----------|
| >0.80 | Strong signal, pattern clear | Act on diagnosis now |
| 0.60-0.80 | Moderate, likely correct | Investigate further before major change |
| <0.60 | Weak, directional only | Gather more data, run again in 3-5 days |

---

## Common mistakes this tree prevents

1. **Reacting to 7-day noise.** If only the 7-day window is bad, it is probably variance. Wait.
2. **Changing audience during fatigue.** Fatigue is about creative, not audience. Changing targeting mid-fatigue just moves the problem.
3. **Increasing budget on a fatigued ad.** Higher budget on tired creative = faster burn.
4. **Missing tracking breakdowns.** If conversions drop to zero but spend continues, this is always Pattern 6 until proven otherwise. Check pixel FIRST.
5. **Blaming algorithm shifts when only one campaign is affected.** Pattern 5 requires multi-campaign impact. Single-campaign CPM spike is probably creative fatigue or audience saturation.
