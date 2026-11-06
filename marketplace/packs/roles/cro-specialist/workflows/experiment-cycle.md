# Experiment cycle

**Trigger:** a ranked fix list has a "test" item on a page or step with enough traffic.

**Cadence:** one cycle per test, lasting the run time worked out in the plan; the test log is reviewed monthly.

## Steps

1. **Pick the test (skill: conversion-research-audit; prompt: ranked-fix-list).** Take the top "test" item, with its evidence.
2. **Check consent and tracking (skill: tracking-and-consent-check).** Make sure the primary metric and guardrails are tracked, and the testing tool works with the consent banner in each region.
3. **Design and size it (skill: test-design-and-sample-size; prompt: sample-size-and-run-time).** Hypothesis, metrics, sample size, run time, stop rules, split check, SEO checks, decision rule. If it is not feasible, stop here and ship as a judgement call or test where traffic is higher.
   **Approval point 1:** the client approves the variant, metrics, run time, traffic share, stop rules and decision rule. At level 3 this is the one-time confirmation of the action list and limits.
4. **Build and QA (level 2; tool: the client's testing tool, such as Shopify Rollouts, VWO, Optimizely or Convert).** Build the test without starting it. Check each variant on mobile and desktop; check events fire once; preview with the consent banner accepted and declined.
5. **Launch (level 3, within limits).** Start the test on the approved pages and traffic share. Log the start time and planned end.
6. **Monitor without peeking.** Split check after the first days and weekly (chi-square goodness-of-fit). Watch guardrails and errors. Pause a clearly broken variant if the limits allow, then tell the client. Do not read the primary metric for a decision before the planned end unless the plan uses a sequential method.
7. **Read the result (skill: test-readout; prompt: test-readout-from-counts).** Split check first, then rates, lift, interval, p-value, money, novelty and segments, and the call.
   **Approval point 2:** if the result meets the decision rule agreed in point 1 and the client agreed that a clear win ships, ship it at level 3 and log it. Any other result goes back to the client.
8. **Clean up.** End the test, remove test code and test URLs, and check the live page.
9. **Log and learn.** One line in the test log: date, hypothesis, counts, result, call, lesson, next idea.

## Outputs

- Test plan with sample size working and decision rule.
- QA notes.
- Action log for every level 3 step.
- Readout with the call first.
- Updated test log.

## Needs the client's approval

- The test plan before launch (point 1).
- Shipping, unless the agreed decision rule says a clear win ships (point 2).
- A fresh yes for anything touching prices, offers, guarantees, the payment step of checkout, consent settings or tracking before consent; for new data tools; for deleting tests or data; and for anything outside the approved pages, traffic share or dates.
