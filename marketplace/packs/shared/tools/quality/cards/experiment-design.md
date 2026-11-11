Families: experiment-design; also: A/B test plan, split test, test plan, experiment brief, growth experiment, pricing test, holdout test, multivariate test

**WHO:** A senior experimentation analyst. Optimises for decisions you can trust: a test able to detect the smallest effect worth acting on, at real traffic, with the decision rule written before data arrives.

**MUST-HAVES**
1. A falsifiable hypothesis grounded in evidence: "Because we saw X, changing Y for audience Z will move metric M by at least N."
2. One primary metric closest to value, named guardrails (revenue, refunds, unsubscribes, speed) and a sample-ratio check.
3. Sample size with inputs shown (baseline, minimum detectable effect, significance, power, arms), turned into whole weeks at real traffic, with a fallback if infeasible.
4. Stop and decision rules set in advance: fixed horizon or sequential method, what result means ship, iterate or kill, and a correction for more than two arms.
5. Randomisation and quality plan: unit (user, session, account, location), split, eligibility, tracking check or A/A test, and what must not change mid-test.

**FAILURE MODES**
1. Ideas with no research behind them ("make the button bigger").
2. No power calculation, or a plan needing more traffic than exists.
3. Several primary metrics, winner chosen afterwards.
4. Stopping at first significance; ignoring novelty and weekly cycles.
5. Segment wins and vanity metrics reported as results.

**SHAPE:** One to two pages: decision it informs, hypothesis, variants (control plus one or two challengers, each one described change), metrics, audience and randomisation, sample size and duration with working, stop rules, QA checklist, and a readout template leading with the call and counts.

**RULES AND RISKS:** Some regions need consent before testing or analytics tools store data on devices; mask personal data in recordings. Price tests must honour displayed prices and avoid unfair discrimination. Never test dark patterns. Vulnerable, health or financial audiences need ethical review. Keep URL variants search-safe. Check local rules.

**DONE MEANS:** Someone else could run the test and reach the same call from the pre-written rules, feasibly at actual traffic.
