---
name: product-analytics
description: Use when defining product KPIs, building metric dashboards, running cohort or retention analysis, or interpreting feature adoption trends across product stages.
---

# Product Analytics

Define, track, and interpret product metrics across discovery, growth, and mature product stages.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When To Use

Use this skill for:
- Metric framework selection (AARRR, North Star, HEART)
- KPI definition by product stage (pre-PMF, growth, mature)
- Dashboard design and metric hierarchy
- Cohort and retention analysis
- Feature adoption and funnel interpretation

## Workflow

1. Select metric framework
- AARRR for growth loops and funnel visibility
- North Star for cross-functional strategic alignment
- HEART for UX quality and user experience measurement

2. Define stage-appropriate KPIs
- Pre-PMF: activation, early retention, qualitative success
- Growth: acquisition efficiency, expansion, conversion velocity
- Mature: retention depth, revenue quality, operational efficiency

3. Design dashboard layers
- Executive layer: 5-7 directional metrics
- Product health layer: acquisition, activation, retention, engagement
- Feature layer: adoption, depth, repeat usage, outcome correlation

4. Run cohort + retention analysis
- Segment by signup cohort or feature exposure cohort
- Compare retention curves, not single-point snapshots
- Identify inflection points around onboarding and first value moment

5. Interpret and act
- Connect metric movement to product changes and release timeline
- Distinguish signal from noise using period-over-period context
- Propose one clear product action per major metric risk/opportunity

## KPI Guidance By Stage

### Pre-PMF
- Activation rate
- Week-1 retention
- Time-to-first-value
- Problem-solution fit interview score

### Growth
- Funnel conversion by stage
- Monthly retained users
- Feature adoption among new cohorts
- Expansion / upsell proxy metrics

### Mature
- Net revenue retention aligned product metrics
- Power-user share and depth of use
- Churn risk indicators by segment
- Reliability and support-deflection product metrics

## Dashboard Design Principles

- Show trends, not isolated point estimates.
- Keep one owner per KPI.
- Pair each KPI with target, threshold, and decision rule.
- Use cohort and segment filters by default.
- Prefer comparable time windows (weekly vs weekly, monthly vs monthly).

See:
- `references/metrics-frameworks.md`
- `references/dashboard-templates.md`

## Cohort Analysis Method

1. Define cohort anchor event (signup, activation, first purchase).
2. Define retained behavior (active day, key action, repeat session).
3. Build retention matrix by cohort week/month and age period.
4. Compare curve shape across cohorts.
5. Flag early drop points and investigate journey friction.

## Retention Curve Interpretation

- Sharp early drop, low plateau: onboarding mismatch or weak initial value.
- Moderate drop, stable plateau: healthy core audience with predictable churn.
- Flattening at low level: product used occasionally, revisit value metric.
- Improving newer cohorts: onboarding or positioning improvements are working.

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| **Vanity metrics** — tracking pageviews or total signups without activation context | Always pair acquisition metrics with activation rate and retention |
| **Single-point retention** — reporting "30-day retention is 20%" | Compare retention curves across cohorts, not isolated snapshots |
| **Dashboard overload** — 30+ metrics on one screen | Executive layer: 5-7 metrics. Feature layer: per-feature only |
| **No decision rule** — tracking a KPI with no threshold or action plan | Every KPI needs: target, threshold, owner, and "if below X, then Y" |
| **Averaging across segments** — reporting blended metrics that hide segment differences | Always segment by cohort, plan tier, channel, or geography |
| **Ignoring seasonality** — comparing this week to last week without adjusting | Use period-over-period with same-period-last-year context |

## Tooling

### `scripts/metrics_calculator.py`

CLI utility for retention, cohort, and funnel analysis from CSV data. Supports text and JSON output.

```bash
# Retention analysis
python3 scripts/metrics_calculator.py retention events.csv
python3 scripts/metrics_calculator.py retention events.csv --format json

# Cohort matrix
python3 scripts/metrics_calculator.py cohort events.csv --cohort-grain month
python3 scripts/metrics_calculator.py cohort events.csv --cohort-grain week --format json

# Funnel conversion
python3 scripts/metrics_calculator.py funnel funnel.csv --stages visit,signup,activate,pay
python3 scripts/metrics_calculator.py funnel funnel.csv --stages visit,signup,activate,pay --format json
```

**CSV format for retention/cohort:**
```csv
user_id,cohort_date,activity_date
u001,2026-01-01,2026-01-01
u001,2026-01-01,2026-01-03
u002,2026-01-02,2026-01-02
```

**CSV format for funnel:**
```csv
user_id,stage
u001,visit
u001,signup
u001,activate
u002,visit
u002,signup
```

## Cross-References

- Related: `product-team/experiment-designer` — for A/B test planning after identifying metric opportunities
- Related: `product-team/product-manager-toolkit` — for RICE prioritization of metric-driven features
- Related: `product-team/product-discovery` — for assumption mapping when metrics reveal unknowns
- Related: `finance/saas-metrics-coach` — for SaaS-specific metrics (ARR, MRR, churn, LTV)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Build it** with the [Release notes writer](https://useaiblocks.com/skills/release-notes-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
