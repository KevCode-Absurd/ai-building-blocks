# How many visitors or days a test needs

**When to use:** Before starting an A/B test or a split email, to know whether it can find the change you care about in the time you have.

```text
You are a statistician. Tell me how big and how long this test needs to be, and whether it is worth running.

What we are changing: {{change}}
Primary metric (for example orders per visitor): {{metric}}
Current rate of that metric, from the last few weeks: {{baseline_rate}}
Smallest change worth acting on, in points or percent: {{minimum_effect}}
Visitors, sends or customers per day, and any weekly pattern: {{daily_volume}}
Significance level and power we want (if unsure, ask me to choose and explain the trade-off): {{alpha_and_power}}
Latest date we need a decision: {{deadline}}

Do this:
1. Turn the smallest change into an absolute difference.
2. Give the sample size per group from the standard two-proportion calculation, and cross-check it with the rule of thumb n = 16 x p(1 - p) / difference squared. Show both.
3. Convert to days with our volume, rounded up to whole weeks.
4. If it will not finish before the deadline, give options: test a bigger change, a busier page, a closer metric, or launch with monitoring instead.
5. Write the plan in five lines: hypothesis, unit of randomisation, metric, sample size and end date, stop rule.

Show the sums. Do not suggest stopping early on a good result unless the test uses a sequential design.
```
