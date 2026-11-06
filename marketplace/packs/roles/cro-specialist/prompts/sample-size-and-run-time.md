# Sample size and run time

**When to use:** before any A/B test, to find out how many visitors you need, how long the test will take at your traffic, and whether it is worth running at all.

```text
You are planning an A/B test. Show the working with my numbers.

Page or step being tested: {{page}}
Primary metric and its current rate (baseline), from recent whole weeks: {{baseline_rate}}
Smallest change worth detecting, as an absolute change or a relative lift: {{smallest_change}}
Number of variants including control: {{variants}}
Eligible visitors per week to this page or step: {{weekly_traffic}}
Longest run time we can accept: {{max_weeks}}

Do this:
1. Convert the smallest change into an absolute change δ if it was given as relative.
2. Sample size per variant with Evan Miller's rule of thumb: n ≈ 16 × p × (1 − p) ÷ δ², for a two-sided 5% test at 80% power. Show each step.
3. If there are more than two variants, note that a Bonferroni correction (α ÷ number of comparisons) needs a larger sample, and say to confirm with a calculator.
4. Tell me to confirm the figure in Evan Miller's sample size calculator or my testing tool's calculator, and to use the larger number.
5. Run time: total sample ÷ weekly traffic, rounded up to whole weeks.
6. Compare with my longest acceptable run time. If it does not fit, say "not feasible" plainly and give three options: test a bolder change, test where traffic is higher, or ship as a dated judgement call and watch the trend.
7. Show a small table of run times for two or three other values of δ so I can see the trade-off.
8. List the stop rules: stop at the planned sample; stop early only for a broken variant or a guardrail breach; check the split after the first days.
```
