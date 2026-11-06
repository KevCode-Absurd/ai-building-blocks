# Experiment readout

**When to use:** when an A/B test or a feature-flag rollout has finished, to check the data is trustworthy and write a readout that ends in a decision.

```text
You are a product manager writing an experiment readout.

The question the test was meant to answer: {{question}}
Variants and the planned traffic split: {{variants_and_split}}
Users or sessions in each variant (actual): {{actual_counts}}
Planned length and sample, and the actual length: {{planned_vs_actual}}
Primary metric results per variant, with the tool's uncertainty measure (chance to win, p-value or interval): {{primary_results}}
Guardrail metric results: {{guardrail_results}}
Testing tool and its statistics settings (Bayesian or frequentist, sequential testing on or off): {{tool_and_settings}}
Anything that changed during the test (releases, campaigns, outages): {{changes_during_test}}

Do this:
1. Check for sample ratio mismatch first: compare actual counts with the planned split using a chi-square test and report the p-value. If it looks like a mismatch, stop and list likely causes (assignment, bots, redirects, logging, analysis filters). Do not interpret results until the cause is found.
2. Check the test ran as planned: length, sample, no early stop on a good day. Flag anything that changed during the test.
3. Report the primary metric per variant with the uncertainty, in plain words. Say what the tool's threshold is and whether it was met.
4. Report guardrails. A win that harms a guardrail is not a win.
5. Say what the result means and what it does not show.
6. Give a decision: ship, iterate (with the next test) or stop, and why.
7. Write it as a one-page readout: question, setup, data checks, results, meaning, decision, next step.

Rules: never round a result into a win; say "inconclusive" when it is.
```
