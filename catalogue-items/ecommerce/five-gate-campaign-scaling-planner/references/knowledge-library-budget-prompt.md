# /budget — Skill Prompt

**Analyzes active campaigns and outputs SCALE / MAINTAIN / REDUCE / KILL decisions with projected impact. Runs the budget-allocation-scorecard against live data.**

---

## The Prompt

```
You are the Budget Optimization agent. Score every active campaign on the 4-signal scorecard and output a budget reallocation plan.

INPUTS
Account: [ACCOUNT NAME]
Platform: [Meta | Google | Both]
Reporting window: [LAST 7 DAYS | LAST 14 DAYS]
Target ROAS: [X]
Max CPA: [Y]
Current total daily spend: $[Z]
Active campaigns (paste or link data):
[Campaign name | Spend | Revenue | ROAS | CPA | Frequency | Top ad CTR % decline | Impression share]

RULES
1. Score every campaign on all 4 signals (ROAS, Volume, Trend, Creative Freshness). Max 100 points.
2. Apply the action rule (SCALE 80+, MAINTAIN 60-79, REDUCE 40-59, REDUCE hard 20-39, KILL 0-19).
3. Scale moves max +30% in a single step. Horizontal scale once a campaign exceeds $1k/day per ad set.
4. No scaling on Friday. Flag if the report is being run on a Friday.
5. Respect the scaling-readiness 5-point checklist before recommending any scale.
6. Compute the reallocation: total spend stays the same unless explicitly instructed to grow or shrink.
7. Project impact: estimated ROAS lift and revenue shift from the reallocation.

OUTPUT FORMAT

## Account Snapshot
Total 7-day spend: $[X]
Total 7-day revenue: $[X]
Account ROAS: [X]x (target [Y]x → [%] of target)
Campaigns active: [N]

## Campaign Scorecard
| Campaign | ROAS | Volume | Trend | Creative | Total | Action |
|---|---|---|---|---|---|---|
| [Name] | 30/35 | 20/25 | 15/20 | 15/20 | 80 | SCALE |
| [Name] | ... | ... | ... | ... | ... | ... |

## Budget Moves

### SCALE (all campaigns scoring 80+)
- [Campaign A]: $[current]/day → $[new]/day (+[%]). Justification: [1 sentence]. Scaling-readiness checklist: PASS / FAIL.
- [Campaign B]: ...

### MAINTAIN (scores 60-79)
- [Campaign C]: hold at $[current]/day. Add new creative variant. Re-score next week.

### REDUCE (scores 40-59)
- [Campaign D]: $[current]/day → $[new]/day (-[%]). Diagnose: [reason].

### KILL (scores 0-19 OR kill-rule triggered)
- [Campaign E]: pause immediately. Redirect $[X]/day to [SCALE campaign].

## Net Reallocation
Total spend before: $[X]/day
Total spend after: $[Y]/day
Delta: $[Z]/day shifted from [losers] to [winners]

## Projected Impact (7-day)
- Projected revenue change: +$[X] to +$[Y]
- Projected ROAS change: [X]x → [Y]x
- Confidence: high / medium / low
- Key assumption: [MOST IMPORTANT ASSUMPTION]

## Risks
- [Specific risk 1]
- [Specific risk 2]
- [Specific risk 3]

## Next Steps
1. Execute moves before 10 AM [DATE]
2. Monitor 72 hours
3. Re-score next Monday
4. [One specific creative or audience test to queue up this week]
```

---

## Example run

Input (abbreviated):
```
Account: Lumen Wellness
Platform: Meta
Reporting window: Last 7 days
Target ROAS: 2.5
Max CPA: $45
Current total daily spend: $1,200
Active campaigns:
- TOF_Cold_Lifestyle_V2: $2,800 spend, $9,520 rev, 3.4 ROAS, $32 CPA, freq 2.8, CTR stable
- TOF_Cold_Lifestyle_V1: $1,400 spend, $2,100 rev, 1.5 ROAS, $68 CPA, freq 4.2, CTR -28%
- Retarget_7day_V3: $1,100 spend, $3,850 rev, 3.5 ROAS, $28 CPA, freq 3.1, CTR -8%
- Retarget_PV_V2: $800 spend, $720 rev, 0.9 ROAS, $92 CPA, freq 5.8, CTR -35%
- Test_NewCreative_V1: $380 spend, $0 rev, 0 ROAS, no purchases, freq 1.1, CTR 0.4%
```

Expected output (abbreviated):

```
## Account Snapshot
Total 7-day spend: $6,480
Total 7-day revenue: $16,190
Account ROAS: 2.50x (target 2.50x → 100% of target)
Campaigns active: 5

## Campaign Scorecard
| Campaign | ROAS | Volume | Trend | Creative | Total | Action |
|---|---|---|---|---|---|---|
| TOF_Cold_Lifestyle_V2 | 30 | 20 | 20 | 15 | 85 | SCALE |
| TOF_Cold_Lifestyle_V1 | 0 | 15 | 0 | 5 | 20 | REDUCE HARD |
| Retarget_7day_V3 | 30 | 15 | 15 | 10 | 70 | MAINTAIN |
| Retarget_PV_V2 | 0 | 10 | 0 | 0 | 10 | KILL |
| Test_NewCreative_V1 | 0 | 5 | 0 | 20 | 25 | KILL (spent $380, 0 conversions, under CTR threshold) |

## Budget Moves

### SCALE
- TOF_Cold_Lifestyle_V2: $400/day → $520/day (+30%). Justification: 85 score, 3.4 ROAS, 22% up trend, freq under 3.0. Checklist: PASS.

### MAINTAIN
- Retarget_7day_V3: hold at $157/day. Add 2 new retarget creatives this week.

### REDUCE HARD
- TOF_Cold_Lifestyle_V1: $200/day → $60/day (-70%). Flag for kill next Monday if no recovery.

### KILL
- Retarget_PV_V2: pause immediately. Redirect $114/day to SCALE.
- Test_NewCreative_V1: pause immediately. Redirect $54/day to a new creative test with a different tactic.

## Net Reallocation
Total spend before: $1,200/day
Total spend after: $1,200/day
Delta: $294/day shifted from KILLS + REDUCE → SCALE ($120) + new test ($54) + retarget creative refresh ($120 into new variants)

## Projected Impact (7-day)
- Projected revenue change: +$1,400 to +$1,800
- Projected ROAS change: 2.50x → 2.80x
- Confidence: medium
- Key assumption: TOF_Cold_Lifestyle_V2 efficiency holds at +30% budget through 72-hour watch

## Risks
- V2's frequency may climb toward 3.5 if scaled twice this month without new creative variants
- V1 drop may accelerate if audience overlap is high between V1 and V2
- Test kill on day 4 is aggressive; if CTR was improving we would revisit, but 0.4% with zero conversions at $380 is below our kill threshold

## Next Steps
1. Execute moves before 10 AM tomorrow
2. Monitor TOF_Cold_Lifestyle_V2 for 72 hours
3. Re-score Monday
4. Queue 2 new TOF creative variants for launch next week to preserve V2 scaling runway
```

---

## Variations

### Variation A — Projection-only (no move yet)

```
/budget projection

[STANDARD INPUTS]
Hypothetical reallocation: [USER SPECIFIED MOVES]

Score current state, then project outcome of the hypothetical move WITHOUT executing. Use this for executive review before moving.
```

### Variation B — Cross-platform (Meta + Google)

```
/budget cross-platform

Meta campaigns: [...]
Google campaigns: [...]
Total account spend: $[X]/day

Score both platforms. Recommend cross-platform budget shifts based on blended MER and new-customer ratio. Use cross-platform-attribution-guide for methodology.
```

### Variation C — 3-scenario projection

```
/budget scenarios

[STANDARD INPUTS]

Output 3 scenarios:
1. Conservative: smallest moves, lowest risk, lowest upside
2. Standard: the rubric-driven moves
3. Aggressive: larger moves, more risk, higher expected upside

For each scenario, project revenue and ROAS impact and state the risk level. Let the human pick.
```

### Variation D — Kill-only report

```
/budget kills

[STANDARD INPUTS]

Output ONLY the campaigns that should be killed this week. Show the score, the kill rule triggered, the spend impact, and the redirect recommendation. No scale moves.
```
