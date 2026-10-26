---
name: people-report
description: Generate headcount, attrition, diversity, or org health reports. Use when pulling a headcount snapshot for leadership, analyzing turnover trends by team, preparing diversity representation metrics, or assessing span of control and flight risk across the org.
argument-hint: "<report type — headcount, attrition, diversity, org health>"
---

# /people-report

> If you see unfamiliar placeholders such as ~~HRIS, ignore them unless that tool is connected. A CSV or pasted table works without any connector.

Generate people analytics reports from your HR data. Analyze workforce data to surface trends, risks, and opportunities.

## Usage

```
/people-report $ARGUMENTS
```

## Report Types

**Headcount**: Current org snapshot — by team, location, level, tenure
**Attrition**: Turnover analysis — voluntary/involuntary, by team, trends
**Diversity**: Representation metrics — by level, team, pipeline
**Org Health**: Span of control, management layers, team sizes, flight risk

## Steps

1. Ask which report type and what question the report must answer. If the person gives no question, ask once. Do not guess.
2. Check the data. List the columns you found and the columns you need for this report type (see "What I Need From You"). Name any column that is missing. Do not invent values to fill gaps.
3. Check the basics before counting: duplicate employee IDs, end dates before start dates, blank team or level, and the date the data was pulled. Fix or flag each one in the Methodology section.
4. Work out the metrics for the report type (see "Key Metrics"). Show the formula in words next to each figure, for example "attrition rate = exits in the period / average headcount in the period".
5. Compare with an earlier period only if the data has one. If it does not, mark Trend as "no earlier period" instead of calling it up or down.
6. Apply the privacy rules below. Then write the report in the Output format.
7. End with 2 to 4 recommendations that follow from the numbers, and say which ones need a person to check the facts first.

## Key Metrics

### Retention
- Overall attrition rate (voluntary + involuntary)
- Regrettable attrition rate (only if the data says which exits were regretted)
- Average tenure
- Flight risk indicators (at team level only, see privacy rules)

### Diversity
- Representation by level, team, and function
- Pipeline diversity (hiring funnel by demographic)
- Promotion rates by group
- Pay equity analysis (only with pay data, and have HR and legal review it before anyone acts)

### Engagement
- Survey scores and trends
- eNPS (Employee Net Promoter Score)
- Participation rates
- Open-ended feedback themes

### Productivity
- Revenue per employee
- Span of control efficiency
- Time to productivity for new hires

Only report the metrics the data can support. Say "not enough data" for the rest.

## Privacy rules

- Report groups, not people. Do not name individuals in flight-risk, performance or pay findings.
- Do not show a figure for a group of fewer than 5 people. Merge it into a larger group or mark it "too small to show".
- Demographic and pay analysis is for spotting patterns to look into. It is not a basis for decisions about one person. Tell the reader to have HR and legal review it first.
- Use only the data given. Do not add outside benchmarks. If the reader asks for one, ask for the source or label it "estimate, check before use".

## What I Need From You

Upload a CSV or describe your data. Helpful fields:
- Employee name/ID, department, team
- Title, level, location
- Start date, end date (if applicable)
- Manager, compensation (if relevant)
- Demographics (for diversity reports, if available)

## Output

```markdown
## People Report: [Type] — [Date of data]

### Executive Summary
[2-3 key takeaways]

### Key Metrics
| Metric | Value | Trend |
|--------|-------|-------|
| [Metric] | [Value] | [up/down/flat/no earlier period] |

### Detailed Analysis
[Tables and short narrative by team, level or location for the report type]

### Recommendations
- [Data-driven recommendation]
- [Action item, with who should check it first]

### Methodology
[How each figure was calculated, data problems found, groups left out for privacy, anything missing]
```

## If Connectors Available

If **~~HRIS** is connected:
- Pull live employee data — headcount, tenure, department, level
- Generate reports without needing a CSV upload

If **~~chat** is connected:
- Offer to share the report summary in a relevant channel
