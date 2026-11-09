---
name: statistical-test-and-analysis
description: Answers "do these numbers really show what we think?" for small and mid-sized businesses - restates the question as a decision, checks the data (missing values, duplicates, outliers, units, how groups were formed), picks the simplest fitting method (difference in proportions, Welch t-test, chi-squared or Fisher, correlation, simple or logistic regression), shows the sums step by step so they can be repeated in a spreadsheet, reports the effect size with a confidence interval rather than a bare p-value, states the limits including what was not controlled, and ends with act, wait for more data, or stop. Use it for a claim like "conversion rose 20%", a dataset that needs a written analysis, or a check of someone else's statistics.
---

# Statistical test and analysis

## When to use

- "Version B got 55 clicks and A got 42. Is B better?"
- "Our sales rose 20% after the new menu. Did the menu do it?"
- A CSV that needs a short written analysis with a test or model.
- A report from someone else that needs checking before a decision.

Not for: medical, clinical or legal conclusions, or any analysis that needs data changed to reach a result.

## What you need

1. **The question and the decision** it feeds.
2. **What was measured, on whom, how many, over what period,** and how the groups were formed (random split, self-selected, before and after).
3. **The data:** counts, or a CSV with one row per person, order or day. IDs instead of names.
4. **Anything that changed in the period:** prices, season, staff, a system change.
5. **Access:** level 1 to read files or reports. Saving the analysis into a shared notebook or sheet is level 2 (a copy) or level 3 (the live one, within your limits).

## Steps

### 1. Restate the question

As a comparison with a number: "Is the share of visitors who order higher on page B than page A, by enough to pay for B?" Name the effect size that would change the decision.

### 2. Check the data first

Rows, missing values, duplicates, odd outliers, units and dates. Report what you found and what you did, with counts. Never drop rows to improve a result; if rows must be excluded (test orders, staff accounts), state the rule before looking at the outcome.

### 3. Check how the groups were formed

- **Random split:** a difference can be read as caused by the change, within the limits of chance.
- **Self-selected or before-and-after:** a difference shows association only. List what else could explain it (season, who chose to take part, other changes) and what comparison would separate them.

### 4. Pick the simplest method that fits

| Question | Data | Method |
|---|---|---|
| Two rates differ? | Counts of yes/no in two groups | Difference in proportions with a z-test; Fisher's exact test when counts are small |
| Two averages differ? | A number per person or order, two groups | Welch's t-test (does not assume equal spread); look at the distribution first |
| Same people before and after? | Paired numbers | Paired t-test on the differences |
| Several groups or categories? | Counts in a table | Chi-squared test; Fisher for small tables |
| Two numbers move together? | Pairs of values | Scatter plot, then correlation with its interval |
| What predicts an outcome? | Several inputs | Simple linear regression for a number, logistic regression for yes/no; few inputs, checked one at a time |

Say in one sentence why the method fits, and what it assumes.

### 5. Show the sums

Each step in a form the client can repeat in a spreadsheet: rates, the difference, the standard error, the test statistic, the p-value, the interval. Give the spreadsheet functions (for example NORM.S.DIST for a z value, T.TEST for two averages).

### 6. Report size and range

Lead with the effect size and its confidence interval in plain units ("between 0.4 and 3.4 more orders per 100 visitors"). Then the p-value, with one line on what it does and does not mean: it is not the chance the result is a fluke, and it says nothing about size.

### 7. If it is not significant, say what the test could have found

Work out the smallest effect the sample could reliably detect. "No difference found" from a test that could only find huge effects is "we do not know yet".

### 8. State the limits

Sample size, how groups were formed, what was not controlled, multiple comparisons (how many things were tested), and whether the period was typical.

### 9. Recommend

Act, wait for more data (and how much), or stop. If the data cannot answer the question, say so and name the data that would.

## Checks

- The question and decision are written first.
- Data checks are reported with counts; no data was changed to fit.
- The method matches the data type and how groups were formed.
- Every figure can be recomputed from the write-up.
- Effect size and interval come before the p-value.
- Causal language is used only for randomised comparisons.
- Limits and the number of tests run are stated.

## Output format

1. **Answer** in one line, then act, wait or stop.
2. **Question and decision.**
3. **Data checks** and what was done.
4. **Method and why.**
5. **Working,** step by step.
6. **Result:** size, interval, p-value, in plain words.
7. **Limits.**
8. **What would settle it,** if unsettled.

## Example of good output (short)

*Illustrative structure, not a real business: a yoga studio. Copy the shape, never the content: every fact comes from the client's own context. Two subject lines, 1,200 emails each, randomly split. Figures only show the shape.*

> **Answer: not settled. B may be better, but the data cannot tell yet. Wait.**
>
> A: 61 bookings from 1,200 (5.08%). B: 79 from 1,200 (6.58%). Difference +1.50 points.
>
> Pooled rate = 140 ÷ 2,400 = 5.83%. Standard error = √(0.0583 × 0.9417 × (1/1,200 + 1/1,200)) = 0.96 points. z = 1.50 ÷ 0.96 = 1.57; two-sided p = 0.12.
>
> 95% interval for the difference: −0.4 to +3.4 points. So B could be slightly worse or more than three points better.
>
> **What would settle it.** With your list of 2,400, resend the same pair to the next two campaigns with the same random split and add up the three. If B still leads, the interval will narrow; decide then.
