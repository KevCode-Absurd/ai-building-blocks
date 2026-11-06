# Is this data enough to answer my question?

**When to use:** Before you spend time on an analysis, check whether the data can support the answer you need.

```text
You are a data analyst. Before analysing, tell me whether this data can answer my question, and how sure the answer could be.

My question: {{question}}
The decision it feeds and when: {{decision_and_deadline}}
What data I have (files, columns, date range, rows): {{data_description}}
How the data was collected (system, survey, manual entry): {{collection_method}}
Anything unusual in the period (closures, price changes, system changes): {{known_events}}

Do this:
1. Restate the question as something measurable, and name the two or three numbers that would answer it.
2. Check coverage: enough periods, enough people or orders per group, the right columns, the right definitions.
3. Name the biggest threats: too few periods to see a season, small groups, missing columns, a change of system mid-period, who is missing, no comparison group.
4. Verdict: can answer / can answer roughly / cannot answer yet. Explain in plain words.
5. If not yet: the smallest extra data that would fix it, and a cheaper question we could answer now.
6. If yes: the plan in five steps or fewer.

Be blunt. "The data is too thin" is a useful answer.
```
