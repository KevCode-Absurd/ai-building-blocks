# Health Score Rubric: 30 Weighted Checks

Public reference. Each check has a severity multiplier and a category weight. Score is computed as a severity-weighted percentage within each category, then rolled up to an overall score.

---

## Severity Multipliers

| Severity | Multiplier | Meaning |
|----------|-----------|---------|
| Critical | 5.0x | Breaks the account if unfixed |
| High | 3.0x | Significant performance drag |
| Medium | 1.5x | Worth fixing, not urgent |
| Low | 0.5x | Nice to have |

## Point Allocation

| Status | Points Awarded |
|--------|---------------|
| PASS | 100% of weighted points |
| WARNING | 50% |
| FAIL | 0% |
| INSUFFICIENT_DATA | 0% (excluded from max only when uncheckable by structure, not by the user's choice) |

---

## Meta Ads Rubric (30 checks)

### Pixel/CAPI Tracking (30% category weight, 8 checks)

| ID | Check | Severity |
|----|-------|----------|
| P01 | Pixel Installed | Critical |
| P02 | Server-Side Events Active | Critical |
| P03 | Event Deduplication Rate | Critical |
| P04 | Event Match Quality | Critical |
| P05 | Domain Verification | High |
| P06 | Standard Events Used | Medium |
| P07 | Attribution Window | High |
| P08 | Data Freshness | Medium |

### Creative Performance (30%, 10 checks)

| ID | Check | Severity |
|----|-------|----------|
| C01 | Format Diversity | Critical |
| C02 | Creatives per Ad Set | High |
| C03 | Creative Fatigue (CTR decay) | Critical |
| C04 | Video Hook Rate | High |
| C05 | Concept Diversity | Critical |
| C06 | Aspect Ratio Coverage | Medium |
| C07 | UGC / Creator-Led Share | High |
| C08 | Quality Ranking | High |
| C09 | Carousel Use | Medium |
| C10 | Social Proof in Creative | Low |

### Account Structure (20%, 8 checks)

| ID | Check | Severity |
|----|-------|----------|
| S01 | Campaign Count | Low |
| S02 | Budget Adequacy | High |
| S03 | Learning Phase Status | High |
| S04 | Conversion Action Correctness | Critical |
| S05 | Bid Strategy Match | Medium |
| S06 | Naming Convention | Low |
| S07 | Dormant Ad Sets | Low |
| S08 | Budget Pacing | Medium |

### Audience Strategy (20%, 4 checks)

| ID | Check | Severity |
|----|-------|----------|
| A01 | Audience Overlap | High |
| A02 | Purchaser Exclusions | High |
| A03 | Lookalike Quality | Medium |
| A04 | Broad Targeting Share | Medium |

---

## Google Ads (parallel rubric)

The same scoring math (severity x category_weight, PASS / WARNING / FAIL = 100 / 50 / 0) applies to a Google Ads rubric. Build it on the same structure: category weights tuned to where Google performance actually breaks.

A reasonable starting split for Google Ads:

| Category | Weight | Why |
|---|---|---|
| Conversion Tracking | 30% | Wrong conversion action invalidates everything downstream |
| Search Term + Keyword Hygiene | 25% | Where most wasted spend lives |
| Quality Score Health | 20% | Drives auction position and CPC |
| Account Structure | 15% | Campaign count, ad group cohesion, asset coverage |
| Audience + Targeting | 10% | Layered audiences, location, device |

Build out the check inventory as you would for Meta. Start with 25-35 checks. Add more once you have a month of data and know which checks predict outcomes in your accounts.

---

## Scoring Computation Example

Meta Pixel/CAPI category example:

| Check | Status | Severity | Points Earned | Max Points |
|-------|--------|----------|---------------|-----------|
| P01 | PASS | 5x | 100 x 5 = 500 | 500 |
| P02 | FAIL | 5x | 0 | 500 |
| P03 | INSUFFICIENT_DATA | 5x | 0 | 500 |
| P04 | WARNING | 5x | 250 | 500 |
| P05 | PASS | 3x | 300 | 300 |
| P06 | WARNING | 1.5x | 75 | 150 |
| P07 | PASS | 3x | 300 | 300 |
| P08 | PASS | 1.5x | 150 | 150 |

Category score = sum(earned) / sum(max) x 100.

Overall score = weighted sum across all categories using category weights above.

## Critical-Failure Override

If any Critical-severity check FAILS, prepend a "blocked category" warning to the report even when the surrounding checks compensate. Critical checks are designed to dominate. Surfacing the failure explicitly stops a healthy-looking score from masking a foundational break.
