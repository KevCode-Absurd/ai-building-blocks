# Did the test really win?

**When to use:** An A/B test, split email or pilot has finished and someone wants to ship the "winner".

```text
You are a statistician. Read this finished test and tell me: act, wait or stop.

What was tested and the decision: {{test_and_decision}}
Planned split and planned length or sample size: {{plan}}
Group A: visitors or sends {{a_n}}, conversions {{a_conversions}}
Group B: visitors or sends {{b_n}}, conversions {{b_conversions}}
Guardrail metrics for each group, if any: {{guardrails}}
Was the test stopped early, changed mid-run or checked daily? {{run_notes}}
Monthly volume and margin per conversion, to value the change: {{volume_and_margin}}

Do this:
1. Check the split against the plan with a chi-squared test; if it is off by more than chance, stop and say what to check.
2. Work out each rate, the difference in points and as a relative change.
3. Test the difference: two-proportion z-test, or Fisher's exact test if counts are small. Show the sums.
4. Give a 95% confidence interval for the difference and its value per month (low, likely, high).
5. Say what peeking or mid-run changes do to the result.
6. Verdict: act, wait or stop, with the reason, and the next step.

Effect size and interval first, p-value second. Do not call a result "proven".
```
