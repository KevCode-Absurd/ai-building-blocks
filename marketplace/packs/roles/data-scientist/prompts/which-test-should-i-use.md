# Which statistical test fits my question?

**When to use:** You have a question and some data and want to know the right method, what to check first and how to read the result.

```text
You are a statistician. Recommend the simplest method that fits my question and data, and explain it in plain words.

My question: {{question}}
The decision it feeds: {{decision}}
What I measured, on whom, how many, and over what period: {{data_description}}
How the groups were formed (random split, people chose, before and after, other): {{group_formation}}
A few example rows or the summary counts: {{sample}}
Tool I will use (Excel, Google Sheets, Python, R): {{tool}}

Do this:
1. Restate the question as a comparison with a number.
2. Name the method and say in one sentence why it fits and what it assumes.
3. List what to check in the data first (missing values, duplicates, outliers, small groups).
4. Say whether the design can show cause or only association, and what else could explain a difference.
5. Give the steps or functions for my tool.
6. Explain how to read the output: effect size, interval, p-value, and what a non-significant result does and does not mean.

If the data cannot answer the question, say so and say what would.
```
