---
name: insight-brief-from-data
description: Turns a cleaned data file into a short, checked insight brief - the question, a three-line answer, up to five findings each with its numbers, a caveat and an action, segment or cohort comparisons, survey read-outs with response counts and small-group warnings, and a plain statement of what the data cannot answer. Use it when an owner, committee or funder needs to know what the numbers say and what to do next.
---

# Insight brief from data

## When to use

- "What does our customer, sales or member data tell us?"
- Comparing groups: regions, products, new versus returning customers, age groups, classes.
- Following cohorts: customers who first bought in the same month, members who joined in the same season.
- Reading out a customer, parent or member survey.
- A season, term or year report for a committee or funder.

Run `data-profiling-and-clean-up` first if the data has not been checked.

## What you need

1. The question and the decision it feeds, in the asker's words.
2. Who reads the brief (owner, committee, funder, staff) and what they will do with it.
3. The clean file, its clean-up log and the date range covered.
4. Definitions: what counts as an active customer, a repeat order, a member, attendance.
5. For surveys: the questions, how people were invited, how many were invited and how many answered.
6. Anything known that bends the numbers: closures, price changes, a big one-off order, a new system.
7. Access: level 1 (read) covers every step. Publishing the brief or a dashboard inside your tools, or sharing it with others there, needs level 3 and your yes on who receives it.

## Steps

### 1. Pin the question

Write it as a decision: "Should we keep the Tuesday class?" beats "Look at attendance." List the two or three numbers that would change the decision.

### 2. Get the base numbers right

Totals by period, counts of customers or members, the main rates (repeat rate, attendance rate, response rate). Show the formula for each rate in words: "repeat rate = customers with 2+ orders in the period / customers with 1+ order".

### 3. Look before you summarise

Plot or tabulate the distribution of each key measure and the trend over time. Look for outliers, gaps and steps that come from system changes. Summary numbers alone can hide very different shapes.

### 4. Compare groups and cohorts

- Segments: show each group's count next to its rate. Flag any group small enough that one person changes the picture, and show small counts as "fewer than 5" if people could be identified.
- Cohorts: follow each starting group through later periods and find where most drop off.
- Check for Simpson's paradox: if the overall pattern differs from every subgroup, show both and say which one fits the decision.

### 5. Read surveys honestly

Report invited, answered and the response rate. Give answer counts and percentages for each question. For subgroups, warn that small groups have much wider margins of error than the headline. Group free-text comments into themes with counts and one or two short anonymised quotes. Say who is likely missing from the answers.

### 6. Test each candidate finding

Keep a finding only if it passes three tests:
- **Size:** large enough to matter for the decision, in money, people or time.
- **Steadiness:** it shows in more than one period or subgroup.
- **Not one outlier:** it survives removing the biggest single customer, order or event.

Then ask: could something else explain it (season, price change, a new system, who answered)? A pattern alone does not prove a cause.

### 7. Choose up to five findings

Rank by how much they bear on the decision. For each: a one-sentence headline that states the finding, the numbers with their base, a table or chart description, one caveat, one action.

### 8. Say what the data cannot answer

Name the missing data and what it would take to get it. If the data is too thin, say so in the summary, not at the end.

### 9. Write the brief

Lead with the three-line answer. Put method and data notes at the back.

## Checks

- Every number traces to the file and shows its base ("42% of 310 customers").
- Each finding passed size, steadiness and outlier tests.
- No causal claim without a comparison that supports it.
- Small groups flagged; nobody identifiable.
- The biggest caveat is in the summary.
- Chart titles state the finding.
- Definitions match the ones the client gave.

## Output format

```
# [Question as a decision]
Data: [files, date range, rows]. Prepared: [date].

## The answer in three lines
## Findings
### 1. [Headline that states the finding]
Numbers: ... (base: ...)
Chart: [type, x, y, what to highlight]
Caveat: ...
Action: ...
## What the data cannot tell us
## Method and data notes
```

## Example of good output (short)

*Made-up organisation: Riverbend Juniors Swim Club, spring and summer term registers, 214 swimmers.*

> **Should we keep the Thursday 6pm squad?**
>
> **The answer in three lines.** Thursday attendance fell from 81% to 64% between spring and summer, while other squads held steady. Most of the drop is in the 11 to 12 age group, which also has the most new joiners. Keep the slot for now, but move new 11 to 12 joiners to Saturday as a trial.
>
> **Finding 1. Thursday attendance fell; other squads did not.** Thursday: 81% of 1,012 possible sessions in spring, 64% of 980 in summer. Other squads: 78% and 77%. Chart: line by week, Thursday highlighted. Caveat: two Thursday sessions were cancelled for pool maintenance and are excluded from both counts. Action: ask Thursday parents why in the end-of-term survey.
>
> **Finding 2. The drop sits in one age group.** 11 to 12s on Thursday: 79% to 52% (26 swimmers). All other Thursday ages: 82% to 72% (41 swimmers). Caveat: 26 is a small group; one family with three swimmers moves the rate by several points.
>
> **What the data cannot tell us.** Why swimmers missed sessions: the register has no reason field.
