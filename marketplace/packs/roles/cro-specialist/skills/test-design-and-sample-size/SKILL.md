---
name: test-design-and-sample-size
description: Designs an A/B test before launch - falsifiable hypothesis, one primary metric and guardrails, randomisation unit, sample size per variant worked from the baseline rate and smallest worthwhile change (Evan Miller's rule of thumb and calculator), run time in whole weeks, stop rules (fixed horizon or a sequential method), sample-ratio check, SEO and consent checks, and the decision rule - or says plainly that traffic is too low to test. Use before any A/B test, when someone asks "how long should this test run?", or before launching a test at level 3.
---

# Test design and sample size

A test that is too small cannot tell a real lift from noise, and a test stopped when it "looks good" will often crown a loser. This skill fixes the plan before launch: what we expect, what we measure, how many visitors we need, how long it takes, and what result means what. The conversion copywriter kit's copy-review-and-test-plan skill has a shorter version for copy tests; this one is the full method.

## When to use

- Before launching any A/B test.
- When a client asks how long a test should run.
- When a client has low traffic and wants to "test everything".
- Before granting level 3 to launch tests, so limits and stop rules are written.

## What you need

**Access:** level 1 to read traffic and conversions. Level 2 to build the test in the client's tool without starting it. Level 3 to start it, within the pages, traffic share, run time and stop rules the client approved.

- The change to test and the evidence behind it (from the conversion-research-audit skill).
- The primary metric and its current rate (baseline), from recent whole weeks.
- Eligible weekly traffic to the page or step being tested.
- The smallest change worth detecting, from the client's economics: what lift would pay for the work?
- The client's longest acceptable run time.
- The testing tool and its statistics method (fixed horizon, sequential, Bayesian), from the vendor's docs.

## Steps

1. **Write the hypothesis.** "Because [evidence], changing [element] to [variant] will raise [metric] for [audience]." It must be possible to prove it wrong with the chosen metric.
2. **Pick the metrics.** One primary metric close to money (orders, revenue per visitor, qualified leads). One to three guardrails that must not get worse (refunds, average order value, page speed, error rate).
3. **Pick the unit.** Usually the visitor. Note that cookie-based assignment is unstable over long periods.
4. **Size the test.** Inputs: baseline rate p, smallest absolute change δ, significance level (two-sided 5% is common) and power (80% is common). Quick check with Miller's rule of thumb:
   - n per variant ≈ 16 × p × (1 − p) ÷ δ²
   - The 16 comes from 2 × (1.96 + 0.84)² ≈ 15.7, for a two-sided 5% test at 80% power.
   - Confirm with Miller's calculator or the testing tool's own calculator, and use the larger figure.
   - For more than two variants, apply a Bonferroni correction to the significance level and resize.
5. **Work out run time.** Total sample (n × number of variants) ÷ eligible weekly traffic, rounded up to whole weeks so every weekday counts the same.
6. **Decide feasibility.** If the run time is longer than the client's maximum, do not run the test. Options: test a bolder change (bigger δ), test where traffic is higher (an ad or email), or ship as a dated judgement call and watch the trend. Say this plainly.
7. **Set stop rules.** For a fixed-horizon test: stop at the planned sample, not before. If early looks are needed: use a sequential method fixed in advance (Miller's simple sequential test, or a tool built for continuous looks, such as Optimizely's Stats Engine). Always: stop early for a broken variant or a guardrail breach.
8. **Plan the split check.** After the first day or two, compare actual group sizes with the planned split using a chi-square goodness-of-fit test. A mismatch means stop reading results and find the cause.
9. **Check SEO and consent.** Separate URLs carry rel=canonical to the original, redirects are 302, and test code is removed when done. The testing tool works with the client's consent banner in each region (tracking-and-consent-check skill).
10. **Write the decision rule.** What result ships the variant, what keeps the control, what means rerun. Include the guardrails.
11. **QA (level 2).** Build the test without starting it. Check each variant on mobile and desktop, check events fire once, and run a short A/A or preview check if the tool allows.
12. **Launch (level 3).** Only after the client's yes on the action list and limits. Log the start, traffic share and planned end.

## Checks

- Hypothesis names evidence, change, metric and audience.
- One primary metric, guardrails listed.
- Sample size shows inputs and working, and names the source of the method.
- Run time is in whole weeks and compared with the client's maximum.
- A plain "not feasible" when it is, with alternatives.
- Stop rules and the split check are written before launch.
- SEO and consent checks done.
- Level 3 actions stay within the approved pages, traffic share and dates.

## Output format

1. **Hypothesis.**
2. **Metrics:** primary, guardrails.
3. **Sample size working:** inputs, formula, result, calculator check.
4. **Run time and feasibility.**
5. **Stop rules and split check.**
6. **SEO and consent checks.**
7. **Decision rule.**
8. **Launch checklist** and what needs the client's approval.

## Example of good output (short)

*Hollow Oak Candles is a made-up Shopify candle shop, used only to show the format. Numbers are invented.*

**Hypothesis:** Because 35 of 90 surveyed abandoners named shipping cost as a surprise, showing "Free UK delivery over £30" under the price on product pages will raise orders per product-page visitor.

**Metrics:** primary: orders per product-page visitor. Guardrails: average order value, refund rate.

**Sample size:** baseline p = 2.5%. Smallest worthwhile change: +0.5 points (to 3.0%, a 20% relative lift).
n ≈ 16 × 0.025 × 0.975 ÷ 0.005² = 0.39 ÷ 0.000025 = 15,600 per variant; 31,200 in total.
If the shop wanted to detect +0.25 points instead: n ≈ 62,400 per variant, 124,800 in total.

**Run time:** 6,000 eligible visitors a week. 31,200 ÷ 6,000 = 5.2, so 6 weeks. The client's maximum is 8 weeks: feasible. The +0.25 point version would take 21 weeks: not feasible.

**Stop rules:** fixed horizon, 6 full weeks. Stop early only for a broken variant or if refunds rise clearly. Split check on day 2 and weekly.

**SEO and consent:** same URL, no redirects. The testing app reads the consent banner; EU and UK visitors who decline are not in the test, and the readout will say so.

**Decision rule:** ship if orders per visitor are higher with a 95% interval above zero and guardrails hold; keep the control if the interval includes zero; rerun if the split check fails.
