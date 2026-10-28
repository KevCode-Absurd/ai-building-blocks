---
name: hr-analytics
description: "Help HR managers with HR analytics and data management. Use when asked to analyze employee data, create HR metrics, build an HR dashboard, analyze turnover data, develop HR reports, build predictive analytics models, create a data governance strategy, or any HR data and analytics task, or analyze HR data at depth."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR analytics and data

Comprehensive HR analytics support — from defining HR metrics and building dashboards to analyzing turnover, developing predictive models, managing data governance, and reporting to leadership.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Steps for a leadership report

1. Ask what decisions leaders must make in the next 3 to 6 months. If the person has no answer, ask once, then suggest three common ones (keep people, hire faster, control cost) and let them pick. Do not start with metrics.
2. Pick 5 to 8 metrics that answer those decisions. For each, give a one-line definition and formula in words (for example, "turnover rate = people who left in the period / average headcount in the period"). Say who owns the number.
3. Check the data the person gave. List what each metric needs, what is missing, and what looks wrong (duplicates, blank dates, different team names for the same team). Do not fill gaps with made-up numbers.
4. Lay out a dashboard for each reader (executive, HR, recruiter): which metrics, which chart type, how often it updates. Keep each to one screen.
5. If the person gave turnover data, look for patterns by team, tenure and level, and list 2 or 3 likely causes to check. Say which are guesses until someone talks to the teams. Show patterns by group, not by named person.
6. Draft the monthly report: a one-paragraph summary, the metrics table, 2 or 3 things that changed and why, and 2 or 3 actions with owners.
7. Add data rules: who may see what, how long data is kept, and a monthly data quality check.
8. Finish with "Before you share": what HR, legal or the data owner must check.

## Rules for people data

- Use only the data the person gives. Do not add outside benchmarks. If one is wanted, ask for a source, or label it "estimate, check before use".
- Do not build or run flight-risk or other predictive models on named employees. Explain that this needs consent, a privacy check (such as GDPR where it applies) and fairness testing first, and offer group-level patterns instead.
- Do not show figures for groups of fewer than 5 people.
- Diversity and pay findings point to patterns to look into. HR and legal review them before anyone acts.

## Output

```markdown
## HR metrics pack: <company or team>

### Decisions this pack supports
- <decision>

### Metrics
| Metric | Definition | Formula in words | Owner | Data needed |
|--------|------------|------------------|-------|-------------|

### Data check
- <what is missing or wrong>

### Dashboard layout
| Reader | Metrics | Chart | Update |
|--------|---------|-------|--------|

### Turnover findings (if data given)
<patterns by group, likely causes to check, what is a guess>

### Monthly report template
<summary, table, what changed, actions with owners>

### Data rules
<access, keeping, monthly quality check>

### Before you share
- <who checks what>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [People cost budget builder](https://useaiblocks.com/skills/people-cost-budget-builder). It takes the plan and document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Supported tasks

- Analyzing employee data and turnover patterns
- Creating HR metrics, scorecards, and dashboards
- Building HR reports and data visualizations
- Conducting HR data quality audits
- Developing HR data governance and privacy strategies
- Analyzing talent acquisition ROI
- Writing HR audit reports and data management policies
- Creating diversity and inclusion scorecards
- Developing workforce segmentation strategies

## Key prompts

Use these for one task at a time. The folders `prompts/` and `examples/` hold longer versions.

### HR metrics and scorecards

1. "What are the most important HR metrics for measuring [recruiting/retention/engagement/L&D] effectiveness?"
2. "Help me design an HR scorecard that tracks [key metrics] aligned with our business strategy."
3. "What KPIs should I include in a monthly HR dashboard for senior leadership?"
4. "How should I define and calculate [specific metric, for example, time-to-fill, turnover rate, cost-per-hire]?"

### Data analysis and reporting

1. "How should I analyze our employee turnover data to identify the primary drivers of attrition?"
2. "What patterns in team-level data suggest people may be more likely to leave, and how should I act on them?"
3. "Help me analyze our employee satisfaction survey results to identify the top 3 priorities for improvement."
4. "How can I create a monthly HR report for leadership that tells a compelling story with data?"
5. "Write an HR audit report template that covers [key HR processes/compliance areas]."

### Dashboards and visualizations

1. "What should be included in an HR analytics dashboard for a [CHRO/HR business partner/recruiter]?"
2. "How should I design data visualizations that make HR insights easy to understand for non-HR audiences?"
3. "How can I design an HR reporting template that is consistent, scalable, and meaningful?"

### Data governance and privacy

1. "What should a comprehensive HR data governance strategy include for our organization?"
2. "How can I develop HR data standardization procedures that ensure data quality and consistency?"
3. "How should we manage access to sensitive HR data to ensure security and compliance?"
4. "What are best practices for conducting an HR data quality audit?"

### Talent acquisition and D&I analytics

1. "How can I conduct a talent acquisition ROI analysis that demonstrates the value of our recruiting investments?"
2. "What metrics should I track to evaluate the effectiveness of our sourcing channels?"
3. "How can I use data to identify which interview stages have the highest drop-off rates in our funnel?"
4. "How can I create a diversity and inclusion scorecard that tracks representation and inclusion metrics?"

## Tips

- Start with business questions, not data — identify the decisions you need to support before choosing metrics.
- Prioritize data quality over volume — a few accurate, consistent metrics are more valuable than many unreliable ones.
- Combine quantitative data with qualitative insights (survey comments, focus groups) for richer analysis.
- Visualize data to tell a story — use trends and comparisons rather than raw numbers.
- Protect employee privacy in all analytics work — anonymize data and obtain proper consent.
