# From a test idea to a decision

**Trigger:** Someone wants to test a change (a page, an email, a price, a process) or has finished a test and wants to ship the result.

## Steps

1. **Write the plan before anything runs.** Hypothesis, unit of randomisation, primary metric, guardrails, smallest effect worth acting on. *Approval: the client agrees the metric and the smallest effect.*
2. **Size it.** Run the `sample-size-for-a-test` prompt. If the test cannot finish in time, agree a different test or a monitored launch instead.
3. **Set the stop rule.** Fixed length in whole weeks, or a sequential design in a tool that supports it. Record which statistics engine the tool uses.
4. **Set up (level 2).** Build the test in the testing tool or email platform without launching it. Check both versions on every device and that tracking fires.
5. **Launch (level 3, within limits).** Start the test on the agreed pages or lists and dates. *Approval: the first live action list is confirmed by the client.* No other change goes live on the same pages during the test.
6. **Leave it alone.** No decisions on interim numbers unless the design allows them. Watch only for breakage and guardrail alarms; stop and ask if one fires.
7. **Read it.** Run the `did-the-test-win` prompt or the `experiment-design-and-readout` skill: split check first, then rates, difference, interval and money.
8. **Decide.** Act, wait or stop. *Approval: rolling out the winner is the client's decision; I roll it out at level 3 within the agreed pages.*
9. **Record it.** Plan, result, decision and what was learned, in the client's test log, so later tests are not repeats.

## Outputs

- Written test plan with sample size and stop rule
- Test set up (level 2) and launched (level 3), with the action log
- Readout with split check, interval, money and verdict
- Test log entry

## Needs the client's approval

The access level for each tool; the metric and smallest effect; launching the test; any change to the plan after launch; rolling out a winner; and tests that touch prices, legal wording or customer data. Tests on people's eligibility for services, credit or jobs are not run without a separate review and the client's legal adviser.
