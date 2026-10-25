# Sample output: `/leading-indicators`

Run against a supplement brand's top prospecting campaign. Redacted.

---

```
## Leading Indicator Report: Prospecting_Broad_US
Period: Feb 12 - Feb 25
Overall Risk: YELLOW (escalating)

### Signals Active

| Indicator     | Baseline (first 7d) | Current (last 7d) | Deviation | Status  |
|---------------|---------------------|-------------------|-----------|---------|
| CPM           | $24.80              | $29.60            | +19%      | YELLOW  |
| Frequency     | 2.1                 | 2.9               | +38%      | YELLOW  |
| CTR           | 1.34%               | 1.18%             | -12%      | YELLOW  |
| Hook Rate     | 38%                 | 36%               | -5%       | GREEN   |
| Reach Growth  | +18%/week           | +4%/week          | Stalling  | YELLOW  |
```

[ANNOTATION: Four of five indicators are yellow. Hook rate is still green, so the creative itself is stopping the scroll. The issue is audience, not creative.]

```
### Diagnosis
Audience saturation approaching. CPM is rising, frequency is climbing, reach growth is stalling at the same budget. Hook rate and CTR are holding up, which means the creative is fine. The audience pool is shrinking.

### Days Until ROAS Impact (estimated)
5-7 days. Expect CPA to rise 15-20% within 7 days if no action is taken. ROAS currently 3.1x, expected to drop toward 2.4-2.6x.

### Actions (in priority order)

1. **Expand audience within 48 hours.**
   - Current audience: Broad + interest stack (est. 4.2M)
   - Add: 5% lookalike from past 180 day purchasers (est. +8M)
   - Add: Expanded interest stack (test without detailed targeting)
   - Expected impact: Reach growth returns to 12-18%/week, frequency drops to 2.3-2.5

2. **Do NOT increase budget yet.**
   - Current $340/day is already pressuring the audience
   - Higher budget on a saturating audience accelerates frequency climb
   - Expand first, then scale

3. **Pre-build creative refresh.**
   - Hook rate is green now, but 3-5 more weeks of this CPM trend will wear it out
   - Queue 3-4 new hooks + bodies for production this week
   - If you wait for hook rate to turn red, you're 2 weeks behind

### Monitoring
- Daily for next 5 days: CPM, frequency, reach growth
- Day 3 after audience expansion: verify frequency drops below 2.5
- Day 7: re-run /leading-indicators
- If ROAS drops below 2.8x before re-run: escalate to /diagnose immediately

### Context
- No creative changes in last 30 days (rules out creative fatigue)
- Budget stable (rules out budget-driven saturation)
- Platform CPM trend account-wide is +6% (industry effect is small, 13% of the 19% is campaign-specific)
```

[ANNOTATION: The key insight here is that CTR and Hook Rate disagreeing with CPM and Frequency means this isn't creative fatigue. It's audience. The fix is audience expansion, not new creative. That distinction saves the account 2 weeks and $15K of production.]

---

## Compare to ROAS (Trailing)

```
Week       | ROAS  | Current Reading
-----------|-------|----------------
W-3        | 3.28x | Healthy
W-2        | 3.12x | Healthy
W-1        | 3.05x | Healthy (slight drift)
This week  | 2.96x | Healthy (small drift)

LEADING INDICATORS SAY: 2.4-2.6x ROAS coming in 5-7 days if no action.
```

[ANNOTATION: This is the value of leading indicators. Looking only at ROAS, everything is fine. The leading indicator report flags the problem 5-7 days before it would show up in the headline number.]

---

## Historical Pattern

Last time this exact pattern appeared (Q4 2025), the team ignored leading indicators for 10 days. ROAS dropped from 3.2x to 1.9x. Recovery took 3 weeks and $22K of new creative production. This time, expanding audience in 48 hours costs $0 and prevents the drop.
