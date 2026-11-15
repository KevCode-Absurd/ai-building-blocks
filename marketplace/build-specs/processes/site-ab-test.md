# Store A/B test, from data to a rolled-out winner

One change on one page or step of your store, tested against the current version with a sample size and decision rule fixed before launch, built unpublished, launched by you, read only at the planned end, and rolled out only if it wins and you say yes.

**Starts from:** A test item on a ranked fix list, a day 28 readout from the site results process, or you asking to test a change on your store.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Gretchen (gretchen-store-testing) | intake.md | intake-complete | no | read |
| 2 | Evidence and hypothesis | Gretchen (gretchen-store-testing) | research.md, hypothesis.md, numbers.json | research-numbers, research-review, consent-review | no | read |
| 3 | Sample size and decision rule | Gretchen (gretchen-store-testing) | test-plan.md | plan-numbers, sample-size-check | yes | draft |
| 4 | Design the variant | Larissa (larissa-store-ux) | variant-spec.md | variant-review | no | draft |
| 5 | Build the variant, unpublished | Yaroslav (yaroslav-shopify-dev) | build-record.md | theme-check | yes, the plan | publish |
| 6 | Check both versions before launch | Larissa (larissa-store-ux) | qa/control.html, qa/variant.html, qa.md | render, tracking-qa | no | read |
| 7 | Launch sheet for you | Gretchen (gretchen-store-testing) | launch-sheet.md | sheet-review | yes | draft |
| 8 | Check the test as you set it up | Gretchen (gretchen-store-testing) | launch-check.md | launch-match | no | read |
| 9 | Sample ratio check | Callum (callum-reporting) | results/split-check.md, results/numbers.json | split-numbers | no | read |
| 10 | Readout at the planned end | Gretchen (gretchen-store-testing) | results/readout.md | numbers-check, readout-review | no | read |
| 11 | Ship, stop or rerun | Gretchen (gretchen-store-testing) | results/decision.md | decision-review | yes | draft |
| 12 | Roll out the winner | Yaroslav (yaroslav-shopify-dev) | results/rollout.md | none | yes, the plan | publish |
| 13 | Log the test and the lesson | Callum (callum-reporting) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects the facts before any idea is chosen: the page or step to test, why it matters in money, the buyers who see it, past tests and lessons, and the evidence that points at this spot. It also writes down what we can reach: GA4 through Google's read-only Analytics MCP, ShopifyQL reports through the Shopify connector or CLI, Microsoft Clarity's data export if it is installed and allowed by your consent rules, and which test tool you have. Shopify's own Experiments need the Grow plan or higher; if you use a test app instead, it names it.

- **Needs:** context/org-context/ (customers, voice, design, do's and don'ts); context/goals.json; context/experiments.md; context/learnings.md; the task, fix list or readout that started this job
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, the test tool and plan are confirmed, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the page or step, its money at stake, the buyer, the evidence so far, the test tool and plan, the access we have, and the questions you answered.

### 2. Evidence and hypothesis

Builds the funnel for this page by device and source from GA4 and ShopifyQL for recent whole weeks, adds behaviour patterns from Clarity with session counts (its export gives only the last 1 to 3 days, 10 requests a day, so it pulls them on several days), and checks that analytics and the test tool respect consent in each region. From that it writes one hypothesis: because we saw this, changing that for these buyers will move this number.

- **Needs:** intake.md; GA4 through the Analytics MCP; ShopifyQL (read_reports and Level 2 protected customer data); Clarity Data Export API token in the host's secret store, if used
- **Makes:** research.md, hypothesis.md, numbers.json
- **Checks:** research-numbers (every funnel rate and total in research.md recomputes from its counts in numbers.json); research-review (the funnel numbers match GA4 and ShopifyQL for the stated whole weeks, behaviour patterns carry session counts, and the hypothesis follows from a finding); consent-review (analytics, Clarity and the test tool collect nothing before consent where the region requires it, and recordings mask personal data)
- **Done when:** research.md shows the funnel with counts and dates, the behaviour patterns with session counts, the consent findings, and hypothesis.md states one change, one audience and one number, each tied to a finding.

### 3. Sample size and decision rule

Fixes everything before launch: the primary metric and guardrails, the baseline rate, the smallest lift worth acting on, the visitors needed per version (about 16 times p times one minus p, divided by the lift squared), the run time in whole weeks, the end date, the traffic split, and the decision rule for ship, stop or rerun. It also writes the sample ratio check (chi-square, a mismatch below p of 0.0005 stops the test). If the store does not have the traffic, it says so and offers the change as a judgement call instead. The plan is copied into context/experiments.md.

- **Needs:** hypothesis.md; research.md; numbers.json; context/experiments.md
- **Makes:** test-plan.md
- **Checks:** plan-numbers (the sample size, run time and baseline rate in test-plan.md recompute from their inputs in numbers.json); sample-size-check (the sample size recomputes from the baseline and the smallest worthwhile lift, the run time is whole weeks and reaches that size, and the decision rule names one primary metric)
- **Done when:** test-plan.md has the sample size with its working, the run time in whole weeks, a fixed end date, the split, the sample ratio rule and the decision rule, and the same plan is in context/experiments.md.
- **You sign off:** You read the change, the metric, the run time, the end date, the split and the decision rule. Reply yes with the code to fix them. They cannot change after launch. If the plan says the test is not feasible, your yes means ship it as a judgement call or stop.

### 4. Design the variant

Writes the variant as a wireframe in words: exactly what changes, with its words and every state, and nothing else, so the test answers one question. It checks the change can be built the way Shopify Rollouts allows: theme editor changes to the current theme, or a whole duplicate theme used as the replacement. Rollouts cannot change Liquid templates as part of a rollout, so a code change goes into a duplicate theme. For a test app, it follows that app's rules.

- **Needs:** test-plan.md (signed off); hypothesis.md; context/org-context/ design rules
- **Makes:** variant-spec.md
- **Checks:** variant-review (the variant changes only what the hypothesis names and can be built in the chosen test tool)
- **Done when:** variant-spec.md shows control and variant side by side, changes only what the hypothesis names, and states how it will be built for the chosen test tool.

### 5. Build the variant, unpublished

Shows you a build plan, then on your yes builds the variant on an unpublished theme copy (or as a draft in the test app), keeping a copy of every file. Nothing is shown to shoppers and the test does not start.

- **Needs:** variant-spec.md; an unpublished copy of the live theme; Shopify connector at level 2, or the Shopify CLI in Claude Code
- **Makes:** build-record.md
- **Checks:** theme-check (Theme Check reports no errors on the variant files)
- **Goes live:** Nothing goes live. Through the Shopify connector or the Shopify CLI (shopify theme push --unpublished, or to the named unpublished theme): the variant files are written to an unpublished theme copy. No experiment is created.
- **Done when:** Every step of the build plan ran once and was read back, and build-record.md lists the theme copy id and every file changed.

### 6. Check both versions before launch

Renders the control and the variant at phone and desktop sizes from saved local copies, and checks the variant matches the spec and nothing else moved. Then checks in GA4 that page view, add-to-cart and purchase events fire once each on the variant, with the consent banner accepted and with it declined.

- **Needs:** build-record.md; variant-spec.md; preview link of the theme copy; GA4 through the Analytics MCP (realtime report)
- **Makes:** qa/control.html, qa/variant.html, qa.md
- **Checks:** render (both versions render at phone and desktop sizes and neither reports HORIZONTAL OVERFLOW); tracking-qa (each key event fires once per action on the variant, and nothing fires before consent where the region requires it)
- **Done when:** qa.md shows both versions at both sizes with no horizontal overflow, the only difference is the planned change, and each event fires once with consent accepted and is held back when declined.

### 7. Launch sheet for you

Writes the exact clicks and values for you to start the test, because Shopify's Rollouts API is read-only and the agents cannot create or start an experiment. For Shopify: Markets, then Rollouts, then Create rollout, type Experiment, the theme change, the traffic allocation, the split, the start date and the end date from the plan. For a test app, the same values in that app's own screens.

- **Needs:** test-plan.md (signed off); qa.md; build-record.md
- **Makes:** launch-sheet.md
- **Checks:** sheet-review (every value on the launch sheet matches the signed-off test plan, including split, allocation and dates)
- **Done when:** launch-sheet.md lists every field with its value from the plan, and nothing in it differs from test-plan.md.
- **You sign off:** You read the sheet. Reply yes with the code, then create and schedule the experiment in your admin exactly as written. Tell the agent when it is saved so it can check it.

### 8. Check the test as you set it up

Reads the experiment back and compares it with the plan: the treatment, the traffic allocation, the split, the start and end dates. For Shopify it reads the Rollout through the Admin API with the read_rollouts scope (shopify store execute, no mutations), or from your screenshot if that access is not set up. Any difference is shown to you to fix in the admin before the start date.

- **Needs:** launch-sheet.md; Shopify CLI with read_rollouts, or your screenshot
- **Makes:** launch-check.md
- **Checks:** launch-match (the experiment as read back uses the built variant, and its allocation, split and dates match the plan)
- **Done when:** launch-check.md shows each setting as read back next to its planned value, all matching, with the start time and planned end logged.

### 9. Sample ratio check

Three days after the start, checks that visitors are split as planned (chi-square goodness of fit) and that guardrails show no breakage, such as checkout errors. It does not look at the main number. If the split is broken, it tells you at once and drafts the steps for you to end the test in the admin, because a broken split makes any result untrustworthy.

- **Needs:** test-plan.md; launch-check.md; visitor counts per version from Rollouts analytics or the test app; GA4 through the Analytics MCP
- **Makes:** results/split-check.md, results/numbers.json
- **Checks:** split-numbers (visitor counts, shares and the expected split in split-check.md recompute from their inputs)
- **Done when:** split-check.md gives visitors per version, the chi-square p-value, and the guardrail read, with a stop note if the split failed.

### 10. Readout at the planned end

Reads the result only after the planned end plus 3 days for the data to settle. If the plan runs longer than two weeks, it schedules itself for that date and does not read early, because peeking raises false wins. Split check first, then rates with counts, absolute and relative lift, the 95% interval, the p-value, money per 1,000 visitors, guardrails, and a note on novelty and segments. Then the call the rule gives.

- **Needs:** test-plan.md; results/split-check.md; counts per version from Rollouts analytics or the test app; GA4 and ShopifyQL for the same dates
- **Makes:** results/readout.md
- **Checks:** numbers-check (every rate, lift and total recomputes from its counts, and no column mixes two date ranges); readout-review (the counts match the test tool for the stated dates, the split check came first, the readout was not before the planned end, and the call follows the rule written before launch)
- **Done when:** readout.md starts with the call, quotes the deciding number with counts and interval, and shows the split check, guardrails and the rule it met.

### 11. Ship, stop or rerun

Writes the decision and what follows from it. Ship: the rollout plan for the winner, with a backup copy of the live theme kept first. Stop: the steps for you to end the test and keep the current version. Rerun: why, and what changes. The test code and test theme are cleaned up in every case.

- **Needs:** results/readout.md
- **Makes:** results/decision.md
- **Checks:** decision-review (the next steps match the call, a ship plan keeps a backup copy of the live theme, and clean-up of test code and test themes is listed)
- **Done when:** decision.md gives the call, the deciding number, and the exact next steps for ship, stop or rerun, including clean-up.
- **You sign off:** You read the call and the next steps. Reply yes with the code to accept it. A ship call still needs your yes on the exact rollout plan in the next stage.

### 12. Roll out the winner

Only for a ship call. You end the experiment in Rollouts. Then the agent shows you the rollout plan: keep a backup copy of the live theme, then publish the winning theme copy, or push only the changed files to the live theme. On your yes it runs those steps and checks the live page straight after. If you only use the Shopify connector, which cannot publish a theme, you publish the copy yourself from the theme library and the agent checks it.

- **Needs:** results/decision.md (signed off); Shopify CLI in Claude Code, or you for the publish step
- **Makes:** results/rollout.md
- **Goes live:** Through the Shopify CLI: shopify theme publish for the winning theme id after a backup copy exists, or shopify theme push to the live theme with --only, --nodelete and --allow-live for the changed files. Shoppers see the winner from this step.
- **Done when:** rollout.md records the plan code, the backup theme id, what was published, and a live check of the page at phone and desktop sizes.

### 13. Log the test and the lesson

Adds one line to the test log in context/experiments.md (date, hypothesis, counts, result, call, lesson, next idea) and a dated lesson to context/learnings.md. A flat or stopped test is still a lesson. The next test intake must read these.

- **Needs:** results/readout.md; results/decision.md; context/experiments.md; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (the lesson is supported by the counts, its confidence fits the result, and the next idea follows from it)
- **Done when:** learning.md holds the log line and one lesson with its evidence and confidence, and both are appended to context/experiments.md and context/learnings.md.

## Where you step in

- **Sample size and decision rule:** You read the change, the metric, the run time, the end date, the split and the decision rule. Reply yes with the code to fix them. They cannot change after launch. If the plan says the test is not feasible, your yes means ship it as a judgement call or stop.
- **Build the variant, unpublished:** approve the exact plan of live changes
- **Launch sheet for you:** You read the sheet. Reply yes with the code, then create and schedule the experiment in your admin exactly as written. Tell the agent when it is saved so it can check it.
- **Ship, stop or rerun:** You read the call and the next steps. Reply yes with the code to accept it. A ship call still needs your yes on the exact rollout plan in the next stage.
- **Roll out the winner:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json. For most store tests this is conversion rate per visitor, with revenue per visitor beside it.
- Guardrails: average order value, checkout errors, refund rate and page speed, each named in the test plan before launch.
- Test quality: the sample ratio check passed, and the readout happened at the planned end, not before.
