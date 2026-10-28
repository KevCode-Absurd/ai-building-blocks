---
name: report-generation
description: Generate professional reports — sprint retrospectives, financial summaries, analytics dashboards, and incident postmortems — from structured data with templates, charts, and multi-format output. Use when the user requests report generation or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Report Generation

This skill enables an AI agent to produce polished, data-driven reports from structured input. The agent accepts data in JSON, CSV, or API response format, applies a report template, generates narrative insights alongside tables and chart specifications, and outputs the final report in Markdown, HTML, or PDF. It supports common report types including sprint retrospectives, financial summaries, analytics dashboards, and incident postmortems.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Ingest and validate the source data.** Accept the input data file or payload in JSON, CSV, YAML, or raw API response format. Validate the schema — check for required fields, correct data types, missing values, and outliers. If the data is incomplete (e.g., a sprint retro JSON missing the velocity field), flag the gap and either request the missing value or leave it blank and list it under Data gaps in the report. Never infer a value. Normalize date formats, currency symbols, and units for consistency.

2. **Select or customize the report template.** Match the data to a report template based on the report type specified by the user. Built-in templates include: `sprint_retrospective`, `financial_summary`, `analytics_dashboard`, `incident_postmortem`, and `weekly_status`. Each template defines the section order, required data mappings, chart types, and tone (analytical for financial reports, constructive for retros, urgent for postmortems). Users can customize templates by overriding sections, adding fields, or changing the visual theme.

3. **Compute metrics and generate insights.** Derive computed metrics from the raw data — percentage changes, averages, rankings, trend directions, and anomaly flags. For a sprint retro, calculate velocity variance and commitment accuracy. For an analytics report, compute conversion rates and segment-level breakdowns. Then generate narrative insights: not just "conversion rate was [RATE]" but "conversion rate changed by [CHANGE]pp from last period". **State a cause only when the source data shows it** (for example, a mobile traffic column that fell by [PERCENT]). If the data does not show a cause, say the cause is not in the data and list it as a question for the owner.

4. **Populate the report structure.** Fill the template sections with the computed metrics, narrative insights, and formatted data tables. Generate chart specifications (bar, line, pie, or table) for each visualization slot in the template. Use Markdown table syntax for inline tables and a chart spec format (e.g., Mermaid, Vega-Lite, or Chart.js JSON) for visual charts. Add section headers, executive summary, and any appendices.

5. **Format and render the output.** Produce the final report in the requested format. For Markdown, output a clean `.md` file with tables and chart code blocks. For HTML, wrap the Markdown output in a styled template with CSS for print-friendly rendering. For PDF, convert the HTML version using a headless browser or a tool like Puppeteer or WeasyPrint. Ensure charts render correctly in all formats and that tables don't break across pages in PDF.

6. **Review and finalize.** Run a quality check: verify all data points in the report trace back to the source data, ensure no template variables remain unresolved (e.g., `{{quarter}}`), confirm that insights are supported by the numbers, and check that the report length matches the expected range for its type. Deliver the report with a brief summary of what was generated.

## Usage

Provide the agent with the report type, source data, any customization preferences, and the desired output format. The agent returns a complete, formatted report.

**Prompt format:**

~~~
Generate a [report type] report.
Data source: [path to JSON/CSV file, or inline data]
Time period: [date range or sprint number]
Template: [built-in template name or "custom"]
Output format: [markdown / html / pdf]
~~~

## Examples

*All names, figures, quotes and dates in the examples below are made up to show the shape of a report. They are not real output. Do not copy them. A real report uses only what is in the data you supply.*

### Example 1: Sprint Retrospective Report from Structured Data

**Input data (JSON):**

~~~json
{
  "sprint": {
    "number": 14,
    "start_date": "2026-01-27",
    "end_date": "2026-02-07",
    "goal": "Ship checkout flow redesign and analytics instrumentation"
  },
  "velocity": {
    "committed": 34,
    "completed": 29,
    "previous_sprints": [31, 28, 33, 30]
  },
  "stories": {
    "total": 12,
    "completed": 10,
    "carried_over": 2,
    "carried_over_items": [
      "CHECKOUT-142: Edge case handling for international addresses",
      "ANALYTICS-89: Cross-domain tracking for subdomain events"
    ]
  },
  "what_went_well": [
    "Checkout redesign shipped 2 days early",
    "Zero P1 bugs in production release",
    "Effective pairing sessions between frontend and backend teams"
  ],
  "what_could_improve": [
    "Sprint scope increased mid-sprint with 3 unplanned tickets",
    "QA bottleneck on Thursday caused idle time for 2 developers",
    "Standup meetings ran over 15 minutes on 3 of 10 days"
  ],
  "action_items": [
    { "owner": "Priya", "action": "Add a mid-sprint scope freeze policy" },
    { "owner": "James", "action": "Schedule a dedicated QA window on Wednesdays" },
    { "owner": "Dana", "action": "Timekeeper rotation for standups" }
  ]
}
~~~

**Output (Markdown report):**

~~~markdown
# Sprint 14 Retrospective

**Sprint dates:** January 27 – February 7, 2026
**Sprint goal:** Ship checkout flow redesign and analytics instrumentation

---

## Executive Summary

Sprint 14 delivered 85% of committed story points (29 of 34), below
the average of the four earlier sprints (30.5 completed). The primary sprint goal was
partially met: the checkout redesign shipped 2 days early, but two
stories carried over. Mid-sprint scope changes and a QA bottleneck were
noted. Zero P1 bugs were reported in the production release.

## Velocity

| Metric               | Sprint 14 | 4-Sprint Average |
|----------------------|-----------|------------------|
| Committed            | 34 pts    | [not in the data] |
| Completed            | 29 pts    | 30.5 pts         |
| Commitment accuracy  | 85%       | [not in the data] |

The team completed 5 points less than it committed. 3 unplanned tickets
were added mid-sprint. Their size in points is [not in the data].

## Story Completion

- **Completed:** 10 of 12 stories (83%)
- **Carried over:** 2 stories
  - CHECKOUT-142: Edge case handling for international addresses
  - ANALYTICS-89: Cross-domain tracking for subdomain events

Estimates and the plan for the next sprint: [not in the data].

## What Went Well

- Checkout redesign shipped 2 days ahead of the sprint end date.
- Zero P1 bugs in the production release.
- Effective pairing sessions between frontend and backend teams.

## What Could Improve

- **Mid-sprint scope creep:** 3 unplanned tickets were added after sprint
  planning. The data does not say whether they caused the 2 carried-over stories: ask the team.
- **QA bottleneck:** A QA bottleneck on Thursday caused idle time for 2
  developers.
- **Standup duration:** Standups exceeded 15 minutes on 3 of 10 days.

## Action Items

| Owner | Action                                           | Target Date   |
|-------|--------------------------------------------------|---------------|
| Priya | Add a mid-sprint scope freeze policy             | [not in data] |
| James | Schedule a dedicated QA window on Wednesdays     | [not in data] |
| Dana  | Timekeeper rotation for standups                 | [not in data] |

---

*Report generated from sprint data. Source: sprint-14-retro.json*
~~~

### Example 2: Analytics Report with Insights and Recommendations

**Input:**

~~~
Generate an analytics report for the marketing website.
Data source: /data/website-analytics-jan-2026.json
Time period: January 2026
Output format: markdown
~~~

**Output (shape only, every [BRACKET] is filled from the data file, never invented):**

~~~markdown
# Website Analytics Report — [MONTH YEAR]

**Reporting period:** [START DATE] to [END DATE]
**Compared to:** [PREVIOUS PERIOD, or "not in the data"]

---

## Executive Summary

[ONE PARAGRAPH: the main change in [METRIC] versus [COMPARISON], the main
cause only if the data shows it, and the one thing to do about it.]

## Traffic Overview

| Metric         | [PERIOD] | [PREVIOUS PERIOD] | Change   |
|----------------|----------|-------------------|----------|
| Total sessions | [N]      | [N]               | [+/-N%]  |
| Bounce rate    | [N%]     | [N%]              | [+/-Npp] |

## Traffic by Channel

| Channel   | Sessions | Share | Change   |
|-----------|----------|-------|----------|
| [CHANNEL] | [N]      | [N%]  | [+/-N%]  |

**Insight:** [WHAT THE TABLE SHOWS. Say "cause not in the data" when the data
does not explain it.]

## Conversion Funnel

| Stage   | Visitors | Rate | Change   |
|---------|----------|------|----------|
| [STAGE] | [N]      | [N%] | [+/-Npp] |

## Recommendations

1. [ACTION that follows from a number in the tables above, with that number named.]
2. [ACTION ...]

## Data gaps

- [FIELD OR COMPARISON NOT IN THE DATA]

---

*Report generated from [SOURCE FILE]. Data: [SOURCE SYSTEM, only if named in the data].*
~~~

## Best Practices

- **Lead with the executive summary.** Decision-makers read the first paragraph and skim the rest. Put the most important finding and recommendation at the top, not buried in the middle of the report.
- **Show comparisons, not just numbers.** Raw metrics lack context. Always include a comparison baseline — previous period, target, industry benchmark, or historical average — so the reader knows whether a number is good or bad.
- **Generate narrative insights, not just data dumps.** A table of numbers requires the reader to do analytical work. Pair every data table with a sentence explaining what the data means and why it matters.
- **Use consistent formatting throughout.** Align table columns, use the same date format everywhere, and maintain a uniform heading hierarchy. Inconsistent formatting erodes trust in the data.
- **Keep reports scannable.** Use section headers, bullet points, bold key numbers, and whitespace generously. A wall of prose in a report is as ineffective as a wall of text in an email.
- **Cite your data sources.** Include a footer or appendix noting where the data came from, when it was pulled, and any filters or exclusions applied. This makes the report auditable and reproducible.

## Edge Cases

- **Incomplete or missing data fields.** When the source data is missing expected fields, note the gap explicitly in the report (e.g., "Velocity data unavailable — commitment accuracy not calculated") rather than silently omitting the section or inventing numbers.
- **Data with outliers or anomalies.** Flag unusual data points (e.g., a 10x traffic spike from a bot attack) and note whether they were included or excluded from aggregate calculations.
- **Multiple data sources that conflict.** When two sources disagree (e.g., CRM shows 120 deals closed, finance shows 118), note the discrepancy, state which source was used, and recommend a reconciliation.
- **Very large datasets.** For data files with thousands of rows, summarize at the appropriate granularity (daily, weekly, by segment) rather than listing every row. Offer to generate a detailed appendix on request.
- **Sensitive financial or personnel data.** Apply access controls to the generated report. Redact individual compensation figures in team-level reports. Flag reports containing PII or financial data for restricted distribution.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [PowerPoint editable chart rebuilder](https://useaiblocks.com/skills/powerpoint-chart-data-rebuilder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
