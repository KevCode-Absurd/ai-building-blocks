# Audit support: audit-sample-output.md

Use the complete thirty-check registry and scoring procedure in SKILL.md. Missing evidence is INSUFFICIENT_DATA, excluded from the score denominator and retained in coverage. NOT_APPLICABLE is excluded from both. There is no validated percentile or guaranteed revenue effect.

### Historical configurable check registry

### Category 1: Pixel/CAPI Tracking (Weight: 30%)

| Check | ID | What To Evaluate | PASS | WARNING | FAIL |
|-------|-----|-------------------|------|---------|------|
| Pixel Installed | P01 | Is pixel firing site-wide? | Active site-wide | Partial pages | Not active |
| Server-Side Events | P02 | Are server events present in last 7d? | Active | Sparse | Not active |
| Event Deduplication | P03 | Dedup rate | >=90% | 70-89% | <70% |
| Event Match Quality | P04 | EMQ score (Purchase) | >=8.0 | 6.0-7.9 | <6.0 |
| Domain Verification | P05 | Domain verified? | Yes | Pending | No |
| Standard Events Used | P06 | Are Purchase, ATC, IC firing as standard? | Standard | Mixed | All custom |
| Attribution Window | P07 | Window setting | 7-click / 1-view | 1-click only | Default not set |
| Data Freshness | P08 | Lag between event and report | <60 min | 60-180 min | >180 min |

**Severity: P01-P04 = CRITICAL (5x), P05 + P07 = HIGH (3x), P06 + P08 = MEDIUM (1.5x)**

### Category 2: Creative Performance (Weight: 30%)

| Check | ID | What To Evaluate | PASS | WARNING | FAIL |
|-------|-----|-------------------|------|---------|------|
| Format Diversity | C01 | Unique active formats | >=3 | 2 | 1 |
| Creatives per Ad Set | C02 | Avg active per ad set | >=5 | 3-4 | <3 |
| Creative Fatigue | C03 | CTR decay vs baseline | <=10% below | 10-25% below | >25% below |
| Video Hook Rate | C04 | Weak hooks (P25 <50% of reach) | <30% weak | 30-50% | >50% weak |
| Concept Diversity | C05 | Unique concepts + spend spread | >=4 concepts, top <=40% | 2-3 concepts or top <=70% | 1 concept or top >70% |
| Aspect Ratio Coverage | C06 | Unique active aspect ratios | 3+ ratios | 2 ratios | 1 ratio |
| UGC / Creator-Led Share | C07 | Spend share | >=30% | 15-29% | <15% |
| Quality Ranking | C08 | % of ads above average | >50% | Avg majority | Below avg on >50% |
| Carousel Use | C09 | Spend share | >=10% | 1-9% | 0% |
| Social Proof in Creative | C10 | % of ads with proof element | >=25% | 10-24% | <10% |

**Severity: C01, C03, C05 = CRITICAL (5x). C02, C04, C07, C08 = HIGH (3x). C06, C09 = MEDIUM (1.5x). C10 = LOW (0.5x).**

**Creative Fatigue Detection Algorithm:**
```
decayRate = 1 - (currentCTR / baselineCTR)
>25% decay = possible fatigue warning; validate evidence before a change
10-25%     = FATIGUING (refresh soon)
<=10%      = HEALTHY
```

**Concept Classification (use these 6 generic categories when tagging ads):**
1. Hook
2. Offer
3. Social Proof
4. Objection-Handler
5. Benefit-Led
6. Lifestyle

### Category 3: Account Structure (Weight: 20%)

| Check | ID | What To Evaluate | PASS | WARNING | FAIL |
|-------|-----|-------------------|------|---------|------|
| Campaign Count | S01 | Active campaigns | 3-8 | 9-15 | >15 or <3 |
| Budget Adequacy | S02 | Daily budget vs target CPA | >=10x | 5-9x | <5x |
| Learning Phase Status | S03 | % of ad sets in Learning Limited | <20% | 20-40% | >40% |
| Conversion Action | S04 | Primary event type | Purchase | Close-match | Wrong event |
| Bid Strategy Match | S05 | Strategy fits goal | Matches | Partial | Mismatched |
| Naming Convention | S06 | Taxonomy consistency | Consistent | Partial | None |
| Dormant Ad Sets | S07 | % zero-spend ad sets | <5% | 5-15% | >15% |
| Budget Pacing | S08 | Spend vs daily budget | On pace | Under | >30% off |

**Severity: S04 = CRITICAL (5x). S02, S03 = HIGH (3x). S05, S08 = MEDIUM (1.5x). S01, S06, S07 = LOW (0.5x).**

### Category 4: Audience Strategy (Weight: 20%)

| Check | ID | What To Evaluate | PASS | WARNING | FAIL |
|-------|-----|-------------------|------|---------|------|
| Audience Overlap | A01 | Overlap between ad sets | <15% | 15-30% | >30% |
| Purchaser Exclusions | A02 | Active on prospecting | All prospecting | Some | None |
| Lookalike Quality | A03 | Seed recency + size | <180d, 1k+ | 180-365d | Stale or under 1k |
| Broad Targeting Share | A04 | Broad spend share | 40-70% | 20-39% or 71-85% | <20% or >85% |

**Severity: A01, A02 = HIGH (3x). A03, A04 = MEDIUM (1.5x).**

---


## Fictional scoring example

Two equal-weight applicable checks are planned. One PASS is evaluated; the other lacks evidence. Score100for the evaluated check, coverage50percent, reliability limited. Do not count the missing check as a failed check or claim a complete audit.
