---
name: "org-health-diagnostic"
description: "Cross-functional organizational health check combining signals from all C-suite roles. Scores 8 dimensions on a traffic-light scale with drill-down recommendations. Use when assessing overall company health, preparing for board reviews, identifying at-risk functions, or when user mentions org health, health check, or health dashboard."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: c-level
  domain: organizational-health
  updated: 2026-03-05
  python-tools: health_scorer.py
  frameworks: health-benchmarks
---

# Org Health Diagnostic

Eight dimensions. Traffic lights. Stated thresholds, which come from the skill author and are rules of thumb, not an official standard. Surfaces the problems you don't know you have.

## Keywords
org health, organizational health, health diagnostic, health dashboard, health check, company health, functional health, team health, startup health, health scorecard, health assessment, risk dashboard

## Quick Start

```bash
python scripts/health_scorer.py        # Guided CLI — enter metrics, get scored dashboard
python scripts/health_scorer.py --json # Output raw JSON for integration
```

Or describe your metrics in natural language:

> "Run an org health check" — paste your key metrics or answer prompts
> "Score our [financial|revenue|product|engineering|people|ops|security|market] health" — single-dimension deep dive

## The 8 Dimensions

### 1. 💰 Financial Health (CFO)
**What it measures:** Can we fund operations and invest in growth?

Key metrics:
- **Runway** — months at current burn. Thresholds depend on stage: Seed green >18, yellow 12-18 inclusive (exactly 18 is yellow), red <12; Series A and B green >12, yellow 6-12 inclusive, red <6; Series C green >18, yellow 9-18 inclusive, red <9 (see `references/health-benchmarks.md`). Missing or zero runway is Unknown, not Red
- **Burn multiple** — net burn / net new ARR (Green: <1.5x, Yellow: 1.5-2.5x, Red: >2.5x)
- **Gross margin** — SaaS target: >65% (Green: >70%, Yellow: 55-70%, Red: <55%)
- **MoM growth rate** — contextual by stage (see benchmarks)
- **Revenue concentration** — top customer % of ARR (Green: <15%, Yellow: 15-25%, Red: >25%)

### 2. 📈 Revenue Health (CRO)
**What it measures:** Are customers staying, growing, and recommending us?

Key metrics:
- **NRR (Net Revenue Retention)** — Green: >110%, Yellow: 100-110%, Red: <100%
- **Logo churn rate (annualized)** — Green: <5%, Yellow: 5-10%, Red: >10%
- **Pipeline coverage (next quarter)** — Green: >3x, Yellow: 2-3x, Red: <2x
- **CAC payback period** — Green: <12 months, Yellow: 12-18, Red: >18 months
- **Average ACV trend** — directional: growing, flat, declining

### 3. 🚀 Product Health (CPO)
**What it measures:** Do customers love and use the product?

Key metrics:
- **NPS** — Green: >40, Yellow: 20-40, Red: <20
- **DAU/MAU ratio** — engagement proxy (Green: >40%, Yellow: 20-40%, Red: <20%)
- **Core feature adoption** — % of users using primary value feature (Green: >60%)
- **Time-to-value** — days from signup to first core action (lower is better)
- **Customer satisfaction (CSAT)** — Green: >4.2/5, Yellow: 3.5-4.2, Red: <3.5

### 4. ⚙️ Engineering Health (CTO)
**What it measures:** Can we ship reliably and sustain velocity?

Key metrics:
- **Deployment frequency** — Green: daily, Yellow: weekly, Red: monthly or less
- **Change failure rate** — % of deployments causing incidents (Green: <5%, Red: >15%)
- **Mean time to recovery (MTTR)** — Green: <1 hour, Yellow: 1-4 hours, Red: >4 hours
- **Tech debt ratio** — % of sprint capacity on debt (Green: <20%, Yellow: 20-35%, Red: >35%)
- **Incident frequency** — P0/P1 per month (Green: <2, Yellow: 2-5, Red: >5)

### 5. 👥 People Health (CHRO)
**What it measures:** Is the team stable, engaged, and growing?

Key metrics:
- **Regrettable attrition (annualized)** — Green: <10%, Yellow: 10-20%, Red: >20%
- **Engagement score** — (eNPS or similar; Green: >30, Yellow: 0-30, Red: <0)
- **Time-to-fill (avg days)** — Green: <45, Yellow: 45-90, Red: >90
- **Manager-to-IC ratio** — Green: 1:5–1:8, Yellow: 1:3–1:5 or 1:8–1:12, Red: outside
- **Internal promotion rate** — at least 25-30% of senior roles filled internally

### 6. 🔄 Operational Health (COO)
**What it measures:** Are we executing our strategy with discipline?

Key metrics:
- **OKR completion rate** — % of key results hitting target (Green: >70%, Yellow: 50-70%, Red: <50%)
- **Decision cycle time** — days from decision needed to decision made (Green: <48h, Yellow: 48h-1w)
- **Meeting effectiveness** — % of meetings with clear outcome (qualitative)
- **Process maturity** — level 1-5 scale (see COO advisor)
- **Cross-functional initiative completion** — % on time, on scope

### 7. 🔒 Security Health (CISO)
**What it measures:** Are we protecting customers and maintaining compliance?

Key metrics:
- **Security incidents (last 90 days)** — Green: 0, Yellow: 1-2 minor, Red: 1+ major
- **Compliance status** — certifications current/in-progress vs. overdue
- **Vulnerability remediation SLA** — % of critical CVEs patched within SLA (Green: 100%)
- **Security training completion** — % of team current (Green: >95%)
- **Pen test recency** — Green: <12 months, Yellow: 12-24, Red: >24 months

### 8. 📣 Market Health (CMO)
**What it measures:** Are we winning in the market and growing efficiently?

Key metrics:
- **CAC trend** — improving, flat, or worsening QoQ
- **Organic vs paid lead mix** — more organic = healthier (less fragile)
- **Win rate** — % of qualified opportunities closed-won (Green: >25%, Yellow: 15-25%, Red: <15%)
- **Competitive win rate** — against primary competitors specifically
- **Brand NPS** — awareness + preference scores in ICP

---

## Scoring & Traffic Lights

Each metric gets a colour from its threshold, then a score from 1 to 10. A dimension's score is the average of the scores of the metrics you supplied. The dimension colour follows that score:
- 🟢 **Green (7-10):** Healthy — maintain and optimize
- 🟡 **Yellow (4-6):** Watch — trend matters; improving or declining?
- 🔴 **Red (1-3):** Action required — address within 30 days

**Overall Health Score:**
Weighted average by company stage (see `references/health-benchmarks.md` for weights). If a stage-specific threshold in the reference file differs from an example above, the reference file wins. If neither the reference file nor the script is available, use the thresholds on this page for each dimension, say so in the result, and do not give an overall score. Show the dimension scores only, because the stage weights live only in the reference file.

---

## Dimension Interactions (Why One Problem Creates Another)

| If this dimension is red... | Watch these dimensions next |
|-----------------------------|----------------------------|
| Financial Health | People (freeze hiring) → Engineering (freeze infra) → Product (cut scope) |
| Revenue Health | Financial (cash gap) → People (attrition risk) → Market (lose positioning) |
| People Health | Engineering (velocity drops) → Product (quality drops) → Revenue (churn rises) |
| Engineering Health | Product (features slip) → Revenue (deals stall on product) |
| Product Health | Revenue (NRR drops, churn rises) → Market (CAC rises; referrals dry up) |
| Operational Health | All dimensions degrade over time (execution failure cascades everywhere) |

---

## Dashboard Output Format

Every value in this layout is a placeholder. Fill each from the numbers the user supplied, and show [data needed] where none was given.

```
ORG HEALTH DIAGNOSTIC — [Company] — [Date]
Stage: [Seed/A/B/C]   Overall: [Score]/10   Trend: [↑ Improving / → Stable / ↓ Declining]

DIMENSION SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Financial    [colour] [score]  [key metrics and values supplied]
📈 Revenue      [colour] [score]  [key metrics and values supplied]
🚀 Product      [colour] [score]  [key metrics and values supplied]
⚙️  Engineering  [colour] [score]  [key metrics and values supplied]
👥 People       [colour] [score]  [key metrics and values supplied]
🔄 Operations   [colour] [score]  [key metrics and values supplied]
🔒 Security     [colour] [score]  [key metrics and values supplied]
📣 Market       [colour] [score]  [key metrics and values supplied]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOP PRIORITIES
🔴 [1] [Weakest dimension]: [metric and value supplied] — [what it puts at risk]
   Action: [owner] to [specific action] by [date]
🟡 [2] [Next dimension]: [metric and value supplied] — [what it puts at risk]
   Action: [owner] to [specific action] by [date]

WATCH
→ [Knock-on risk from the dimension interactions table]
```

---

## Graceful Degradation

You don't need all metrics to run a diagnostic. The tool handles partial data:
- Missing metric → excluded from score, flagged as "[data needed]"
- Score still valid for available dimensions
- Report flags which gaps to fill for next cycle

## References
- `references/health-benchmarks.md` — benchmarks by stage (Seed, A, B, C)
- `scripts/health_scorer.py` — CLI scoring tool with traffic light output

## Repaired scoring rules

Apply thresholds from the benchmark reference as the single source of truth. For the other dimensions, use the thresholds listed under each dimension in "The 8 Dimensions" above, and show the raw metric, comparison operator and threshold next to every color. Values on a boundary follow the stated inclusive rule. Do not average Unknown into a company total. If a dimension is missing, report it as unscored and show the denominator for any aggregate; never silently reweight. Treat the score as a diagnostic based on supplied inputs, not a prediction. Do not generalize Seed runway thresholds to other stages unless their benchmark is explicitly provided.
