# /scaling-plan — Skill Prompt

**Builds a scaling plan for a specific campaign. Runs the 5-point readiness checklist, proposes a phased scale path over 4 weeks, and identifies risks.**

---

## The Prompt

```
You are the Scaling Plan agent. Build a phased 4-week scaling plan for the campaign below. Run the 5-point readiness checklist. Project outcomes at each phase. Flag risks.

INPUTS
Campaign name: [NAME]
Platform: [Meta | Google | Other]
Campaign structure: [CBO / ABO / PMax / Search / etc]
Current daily spend: $[X]
Last 7 days ROAS: [X]
Last 7 days CPA: $[X]
Last 14 days trend (ROAS): [+/- %]
Target ROAS: [X]
Max CPA: $[X]
Top ad frequency: [X]
Top ad CTR 7-day delta: [+/- %]
Audience reach / size: [%]
Available new creative variants (not yet launched): [N]
Inventory available (in days at current velocity): [N days]
Funnel LP CVR (last 7 days): [X%]

WORKFLOW
1. Run the 5-point readiness checklist. Score each point YES / NO / PARTIAL.
2. If any point is NO, do NOT propose scaling. Output a pre-scale fix plan instead.
3. If all points PASS, build a 4-week phased plan: week 1, 2, 3, 4. Each week's budget move is max +30%.
4. Identify the 3 biggest risks specific to this scale.
5. Recommend the creative + audience pipeline needed to sustain the scale.

OUTPUT FORMAT

## Readiness Checklist
| Point | Check | Status |
|---|---|---|
| 1. Efficiency stable | [Current 7d vs prior 7d] | PASS / FAIL / PARTIAL |
| 2. Creative fresh | [Freq, CTR delta] | PASS / FAIL / PARTIAL |
| 3. Audience not exhausted | [Reach %] | PASS / FAIL / PARTIAL |
| 4. Funnel intact | [LP CVR, pixel events] | PASS / FAIL / PARTIAL |
| 5. Inventory + fulfillment | [Days of stock, lead time] | PASS / FAIL / PARTIAL |

Overall readiness: READY / PARTIAL / NOT READY

## Pre-Scale Fix Plan (if NOT READY)
[If any point failed, list the fix + estimated time to fix + re-check date]

## Scaling Plan (if READY)

### Week 1
Target daily spend: $[X] (+[%])
Key action: [...]
Success criteria: ROAS within ±10%, CPA within ±10%
If fail: revert to baseline, diagnose

### Week 2
Target daily spend: $[X] (+[%])
Key action: [...]
Success criteria: [...]
If fail: [...]

### Week 3
Target daily spend: $[X] (+[%])
Key action: [...]
Parallel: horizontal scale / new creative / new audience
If fail: [...]

### Week 4
Target daily spend: $[X] (+[%])
Key action: [...]
If success: plan for next 4-week window
If plateau: maintain, shift focus to new campaign launch

## Creative + Audience Pipeline
To sustain this scale, you need:
- [N] new creative variants by [DATE]
- [Audience expansion plan — new LAL, new interest, new geo]
- [New concept test scheduled for week 3]

## Risks
1. [RISK] — mitigation: [...]
2. [RISK] — mitigation: [...]
3. [RISK] — mitigation: [...]

## Day-Over-Day Monitoring Plan
- Day 1 post-scale: [what to check]
- Day 2: [what to check]
- Day 3: [GO/NO-GO decision criteria]
- Day 7: [Full re-score]

## Total Projected Impact (4 weeks)
Starting daily spend: $[X]
Ending daily spend: $[Y]
Projected monthly revenue lift: $[X] - $[Y]
Confidence: high / medium / low
```

---

## Example run

Input (abbreviated):
```
Campaign: TOF_Cold_Lifestyle_V2
Platform: Meta (CBO)
Current daily spend: $400
Last 7 days ROAS: 3.4
Last 14 days ROAS trend: +22%
Target ROAS: 2.5
Top ad frequency: 2.8
CTR 7-day delta: 0% (stable)
Audience reach: 28%
Available new creative variants: 3 ready for launch
Inventory: 18 days
LP CVR: 2.8% (up from 2.5% two weeks ago)
```

Expected output (abbreviated):

```
## Readiness Checklist
| Point | Check | Status |
|---|---|---|
| 1. Efficiency stable | ROAS 3.4 vs prior 3.2 (+6%) | PASS |
| 2. Creative fresh | Freq 2.8, CTR stable, 3 variants queued | PASS |
| 3. Audience not exhausted | Reach 28% (below 40% ceiling) | PASS |
| 4. Funnel intact | LP CVR up, pixel events clean | PASS |
| 5. Inventory + fulfillment | 18 days of stock, 2-day lead time | PASS |

Overall readiness: READY

## Scaling Plan

### Week 1
Target daily spend: $520 (+30%)
Key action: Single vertical scale on the existing CBO campaign
Success criteria: ROAS ≥ 3.0, CPA ≤ $42, CPM within +15%
If fail: revert to $400/day; investigate if week-over-week ROAS drop is >15%

### Week 2
Target daily spend: $675 (+30% from $520)
Key action: Launch 1 new creative variant in parallel; maintain existing CBO
Success criteria: Blended ROAS ≥ 2.9, frequency < 3.2
If fail: hold at $520 for a week; push new variants to absorb load

### Week 3
Target daily spend: $675 (maintain) + launch horizontal duplicate at $400/day
Key action: Horizontal scale — duplicate campaign with a new lookalike source (LAL-2 from recent purchasers)
Success criteria: Duplicate campaign ROAS ≥ 2.0 in first 7 days; original holds
If fail: kill duplicate, continue with original at $675

### Week 4
Target daily spend: original $875 (+30%) + duplicate at $500 (if winning) = $1,375 total
Key action: Continue scale on winners; prepare next audience expansion (geo / interest)
If success: plan next 4-week window — target $1,750/day by end of following month
If plateau: maintain; shift new spend to brand-new campaign concept

## Creative + Audience Pipeline
To sustain:
- 2 new Lifestyle variants by end of week 2
- 1 new tactical angle variant (Confession tactic) by end of week 3
- LAL-2 audience on recent purchasers by start of week 3
- New geo expansion (CA + TX if currently US national) for week 5 planning

## Risks
1. Frequency climb: at +30% per week, frequency will reach 3.5 by end of week 3 if no new variants launch. Mitigation: enforce variant launch schedule.
2. CPM inflation: CBO concentrates on the winning ad. After horizontal scale, CPM may rise 10-15%. Mitigation: monitor, accept the trade-off for diversification.
3. Attribution drift: higher spend attracts more view-through credit. Mitigation: track against Shopify revenue, not Meta-only ROAS.

## Day-Over-Day Monitoring Plan
- Day 1: spend delivery to 90%+ of target. ROAS noise expected.
- Day 2: spend delivery full target. ROAS still noisy.
- Day 3: make GO/NO-GO. If ROAS < 2.8 or CPA > $48, revert.
- Day 7: full re-score. If score ≥ 80, proceed to week 2. If 60-79, maintain. If <60, revert + diagnose.

## Total Projected Impact (4 weeks)
Starting daily spend: $400
Ending daily spend: $1,375
Projected monthly revenue lift: $29,000 - $38,000
Confidence: medium
Key assumption: efficiency holds within ±15% through the scale path
```

---

## Variations

### Variation A — Single-week scale (tactical)

```
/scaling-plan single-week

[STANDARD INPUTS]

Build only Week 1 of the plan. Deep detail on the single scale move. Skip weeks 2-4.
```

### Variation B — Horizontal scale only

```
/scaling-plan horizontal

Winning campaign: [NAME]
Target new ad set: [NEW AUDIENCE / CREATIVE POOL]

Build a plan for creating a duplicate campaign and running in parallel without killing the original's performance. Include guardrails for when to stop horizontal if it cannibalizes.
```

### Variation C — Phased pause plan (reverse scaling)

```
/scaling-plan reverse

Campaign to wind down: [NAME]
Reason: [fatigue / strategy shift / seasonal]
Target: stop spending by [DATE]

Build a phased REDUCE path over 4 weeks. Preserve efficiency on the way down. Redirect freed budget to the SCALE pool.
```

### Variation D — Launch scaling (from zero to $500/day)

```
/scaling-plan new-campaign

Campaign: [NEW CAMPAIGN NAME]
Starting spend: $100/day
Target: $500/day by week 4
Creative variants available: [N]

Build a launch ramp. Week 1 = learning phase protection ($100/day flat). Week 2-4 = scale path.
```
