---
name: stakeholder-reporting
description: This skill should be used when the user asks to "create a sourcing report", "build a dashboard", "generate a pipeline update", "update for hiring manager", "stakeholder report", "sourcing metrics", "pipeline report", "weekly sourcing update", "market insights report", "talent map presentation", or needs to compile sourcing data into structured reports or visual dashboards for stakeholders.
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your data** (yours): the data files, with their format and where they came from.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your data. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Supporting material availability

This copy includes `references/market-insights-template.md`, `references/dashboard-templates.md` and `references/chart-examples.md`. It does not include a brand guide PDF, and no PDF or brand build scripts. Do not say you read or ran anything that is not in the folder. Give a plain markdown report. For a chart page, use `references/dashboard-templates.md` and `references/chart-examples.md`, or write a simple standalone HTML file with Chart.js yourself.

Every figure in a report must come from the user's data, or be labelled as an estimate with its source. Never make one up. The numbers in the templates below are placeholders.

# Stakeholder Reporting for Recruiting Sourcing

## Purpose

Compile sourcing data, insights, and progress into structured reports and visual dashboards for hiring managers and leadership. Effective reporting transforms sourcing activity into clear, actionable narratives that build stakeholder confidence and drive hiring decisions.

## Report Types

### 1. Sourcing Pipeline Report

Regular update on sourcing progress for a specific role.

**Audience:** Hiring manager
**Frequency:** Weekly or bi-weekly
**Format:** Markdown summary + optional HTML dashboard

**Contents:**
- Candidates identified this period
- Outreach status and response rates
- Pipeline stage breakdown
- Key candidate highlights
- Blockers and recommendations

### 2. Market Insights Report

Research-driven report on the talent market for a role or function.

**Audience:** Hiring manager + leadership
**Frequency:** At search kickoff, updated monthly
**Format:** Markdown report + HTML dashboard with charts

**Contents:**
- Compensation landscape (use only pay and market figures the user supplies; for any outside figure, name the source and date, and label estimates as estimates; never make up a figure)
- Talent supply & demand analysis
- Competitive landscape
- Hiring difficulty assessment
- Strategic recommendations

### 3. Talent Map Report

Visual representation of the talent landscape.

**Audience:** Hiring manager + leadership
**Frequency:** At search kickoff
**Format:** Markdown + HTML with interactive tables

**Contents:**
- Target company matrix (concentric circles)
- Pool size estimates by segment (label each as an estimate and name the source; if there is none, write "not found")
- Geographic distribution
- Key individual highlights
- Recommended approach per segment

### 4. Search Retrospective

Post-search analysis of what worked and what didn't.

**Audience:** Recruiting team + hiring manager
**Frequency:** After role is filled
**Format:** Markdown report

**Contents:**
- Search timeline and milestones
- Channel effectiveness analysis
- Funnel conversion rates
- Lessons learned
- Recommendations for future searches

## Markdown Report Structure

### Standard Report Template

```markdown
# [Report Type]: [Role Title]
**Date:** [Date]  |  **Author:** [Name]  |  **Status:** [Active/Closed]

## Executive Summary
[3-5 bullet points with key findings and recommendations]

## [Section 1]
[Content with supporting data]

## [Section 2]
[Content with supporting data]

## Key Metrics
| Metric | Value | Trend |
|--------|-------|-------|
| [Metric 1] | [Value] | [↑/↓/→] |
| [Metric 2] | [Value] | [↑/↓/→] |

## Recommendations
1. [Actionable recommendation]
2. [Actionable recommendation]

## Next Steps
- [ ] [Action item with owner]
- [ ] [Action item with owner]
```

### Pipeline Metrics Table

```markdown
## Pipeline Overview

| Stage | Count | This Week | Conversion |
|-------|-------|-----------|------------|
| Identified | [COUNT] | [+THIS WEEK] | - |
| Contacted | [COUNT] | [+THIS WEEK] | [%] |
| Responded | [COUNT] | [+THIS WEEK] | [%] |
| Interested | [COUNT] | [+THIS WEEK] | [%] |
| Screened | [COUNT] | [+THIS WEEK] | [%] |
| Submitted to HM | [COUNT] | [+THIS WEEK] | [%] |
```

## HTML Dashboard Generation

For visual dashboards, generate standalone HTML files using Chart.js for charts. Dashboards should be self-contained (no external dependencies beyond CDN) and openable in any browser.

### Dashboard Template

Start from `references/dashboard-templates.md`, or build a simple standalone page with HTML structure, CSS, Chart.js setup, KPI cards, a pipeline funnel, a source channel doughnut, and a candidate table. Fill it only with the user's own numbers.

### Chart Types for Sourcing

**Pipeline funnel** - Horizontal bar chart showing conversion through stages
**Source effectiveness** - Pie or doughnut chart of candidates by source channel
**Timeline** - Line chart of pipeline growth over time
**Talent map** - Table with color-coded priority indicators
**Compensation** - Box plot or range chart for salary data

### Dashboard Best Practices

- Use **4-6 KPI cards** at the top (total identified, response rate, pipeline health, time-in-stage)
- Include **2-3 charts** maximum per dashboard
- Keep **one actionable table** (top candidates, target companies, or pipeline)
- Use one consistent color scheme (the user's own, if they give one)
- Ensure all data has context (comparisons, benchmarks, trends)
- Include **last updated** timestamp prominently
- Make it printable (reasonable page breaks, no horizontal scroll)

## Report Writing Guidelines

### For Hiring Managers

- Lead with insights, not activity metrics
- Frame data around decisions they need to make
- Use comparisons only when the user supplies the baseline: "This search is performing [X]% above [BASELINE]"
- Highlight blockers clearly with recommended solutions
- Keep reports scannable: bullets, tables, bold key numbers

### For Leadership

- Focus on strategic insights over tactical details
- Include market context (supply/demand, compensation trends)
- Frame recommendations in business terms
- Quantify trade-offs only from the user's data or a named source: "Expanding budget by [AMOUNT] increases pool by [%]". Label it an estimate otherwise.
- Keep to one page / one screen when possible

### Data Integrity

- Always cite data sources
- Note data recency and limitations
- Distinguish between hard data and estimates
- Flag where sample sizes are small
- Use ranges rather than false precision

## File Organization

Store reports in the role-based directory structure:

```
roles/
└── senior-backend-engineer/
    └── reports/
        ├── pipeline-week-NN.md            ← e.g., pipeline-week-06.md
        ├── market-insights-YYYY-MM.md     ← e.g., market-insights-2026-02.md
        ├── dashboard.html                 ← updated in place
        └── retrospective.md
```

## Brand and PDF export

This copy gives two outputs only: a plain markdown report and a simple HTML chart page. Branding and PDF export are not part of it. Use the user's own brand guide only if they paste its colours and fonts. The original author's brand name and colours are not used here.

## Additional Resources

### Reference Files

- **`references/market-insights-template.md`** - HTML template for market insights reports, with neutral placeholder colours and no logo. Swap in the user's own colours, fonts or logo only if they supply them; PDF export is optional
- **`references/dashboard-templates.md`** - Complete HTML dashboard templates for pipeline dashboards
- **`references/chart-examples.md`** - Chart.js code snippets for common sourcing visualizations

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Applicant evidence and hiring reply drafts](https://useaiblocks.com/skills/hiring-pipeline-runner).
- The [Team size, hiring plan and budget review](https://useaiblocks.com/skills/quarterly-headcount-plan-keeper).
- The [People cost budget builder](https://useaiblocks.com/skills/people-cost-budget-builder). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
