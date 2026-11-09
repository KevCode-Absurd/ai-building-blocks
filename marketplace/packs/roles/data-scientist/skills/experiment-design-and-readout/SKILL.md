---
name: experiment-design-and-readout
description: Designs and reads A/B tests and small trials (site changes, emails, prices, an AI tool pilot) - one primary metric, the smallest effect worth acting on, sample size from a calculator cross-checked with the 16 sigma squared over delta squared rule of thumb, run length in whole weeks, randomisation unit and stop rule set before launch; then checks the traffic split for sample ratio mismatch, compares conversion rates with a two-proportion z-test or Fisher's exact test, reports the difference with a confidence interval and its money value, and ends with act, wait or stop. Setting up tests in a testing tool is level 2; starting or stopping live tests is level 3. Use it before a test starts and when one ends.
---

# Experiment design and readout

## When to use

- "How many visitors or days do we need to test this?"
- "Version B got more clicks. Is it really better?"
- A pilot of a new tool or process against business as usual.
- A test that someone stopped early, or whose numbers look odd.

## What you need

1. **The change and the decision:** what ships if it wins, and what it costs to ship.
2. **One primary metric** (orders per visitor, sign-ups per email sent) and a few guardrail metrics that must not get worse (refunds, unsubscribes, page speed).
3. **The baseline rate** for the primary metric, from recent weeks.
4. **The smallest effect worth acting on,** in the client's terms. A change too small to pay for itself is not worth detecting.
5. **Traffic or volume per day** and any weekly pattern.
6. **The tool:** a testing tool, an email platform's split test, or a manual split.
7. **For the readout:** visitors (or sends) and conversions per group, the planned split, start and end dates, and whether anyone stopped or changed the test mid-run.
8. **Access:** level 1 to read results. Setting up the test in the tool, unlaunched, is level 2. Starting, stopping or rolling out a winner is level 3, within the limits you set.

## Steps

### 1. Write the plan before launch

- Hypothesis in one line: "Changing X will raise Y because Z."
- Unit of randomisation: visitor, session, customer or store. Use the customer when the same person returns, so one person is not in both groups.
- Primary metric, guardrails, and the minimum effect.
- Significance level and power, chosen with the client and written down.

### 2. Size it

Use a sample size calculator (Evan Miller's, or the testing tool's) with the baseline, minimum effect, significance and power. Cross-check with the rule of thumb n = 16 × p(1 − p) ÷ δ² per group, where p is the baseline and δ the absolute change to detect. Turn the sample into days with the client's traffic, and round up to whole weeks so every weekday is counted equally.

If the days needed are longer than the client can wait, say so and offer options: a bigger change, a higher-traffic page, a metric closer to the change, or no test and a careful launch with monitoring.

### 3. Set the stop rule

Fixed length: no decisions before the end date. If the client needs to look early, use a tool with sequential testing switched on, and say which engine the tool uses (Bayesian or frequentist), because the verdict reads differently.

### 4. Launch checks (level 2 or 3)

Both versions work on every device; tracking fires in both; the split is as planned; nothing else launches on the same page at the same time.

### 5. Check the split before the result

Compare the observed split with the planned one with a chi-squared test. If it is off by more than chance (a sample ratio mismatch), stop and find the cause (a redirect, a bot filter, a tracking gap) before reading anything else.

### 6. Read the result

- Conversion rate per group, and the difference in points and as a relative change.
- Large samples: two-proportion z-test with the pooled rate. Small counts: Fisher's exact test.
- A 95% confidence interval for the difference (or the interval the client chose).
- Guardrails: same treatment, and say if any got worse.
- If the test was sized for an effect and the interval includes both zero and that effect, the result is inconclusive, not "no effect".

### 7. Put it in money

Low, likely and high value per month from the interval, using the client's volume and margin, against the cost of shipping and keeping the change.

### 8. Decide

- **Act:** the interval clears the smallest effect worth acting on, or clears zero and shipping is cheap.
- **Wait:** the interval is wide and the decision is costly; run longer with a plan, or re-test.
- **Stop:** the interval excludes any effect worth having.

Note how many metrics and segments were looked at. A single winning segment among many is a lead for the next test, not a result.

## Checks

- The plan, sample size and stop rule were written before launch, or the readout says they were not.
- The split was checked before the result.
- Every rate and the test statistic are shown with the sums.
- The difference has an interval and a money value.
- Peeking, mid-test changes and multiple looks are reported.
- The verdict is act, wait or stop, with a reason.

## Output format

1. **Verdict** (act, wait or stop) in one line.
2. **Plan:** hypothesis, unit, metric, minimum effect, sample size and dates.
3. **Split check.**
4. **Results table:** group, visitors, conversions, rate.
5. **Difference,** test, interval and money.
6. **Guardrails and caveats.**
7. **Next step.**

## Example of good output (short)

*Illustrative structure, not a real business: an online tea shop testing a new checkout page. Copy the shape, never the content: every fact comes from the client's own context. Planned 50/50 split, 14 days, sized to detect a rise from 4.0% to 4.8% (rule of thumb: 16 × 0.04 × 0.96 ÷ 0.008² = 9,600 per group). Figures only show the shape.*

> **Verdict: wait. Likely positive, but a zero effect is not ruled out.**
>
> **Split check.** 9,800 and 9,750 visitors; chi-squared 0.13, well within chance. Fine.
>
> | Group | Visitors | Orders | Rate |
> |---|---|---|---|
> | Old checkout | 9,800 | 392 | 4.00% |
> | New checkout | 9,750 | 445 | 4.56% |
>
> Difference +0.56 points (z = 1.95, two-sided p = 0.051). 95% interval: 0.0 to +1.1 points. At your 40,000 checkout visitors a month and $12 margin per order, that is about $0 to $5,430 a month, most likely around $2,710.
>
> **Why wait.** The test was sized for 0.8 points; the result is smaller and the interval touches zero. The new page costs little to keep, so if you prefer to ship now, ship it with a two-week check against last month. Otherwise run one more fortnight as a fresh, pre-planned test.
