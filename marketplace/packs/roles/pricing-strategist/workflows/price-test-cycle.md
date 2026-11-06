# Price test cycle

**Cadence:** one test at a time, each as long as the volume check says it needs, run back to back while there is a pricing question worth answering. Check this with local rules before any test that shows different prices to different people.

## Steps

1. **Pick the question.** From the last pricing review or readout: one price, one product or plan, one audience. Write it in one sentence.
2. **Design.** Run the **price-test-and-readout** skill (planning steps): design, volume check, decision rule, stop rule, fairness rule. Use the growth marketer kit for sample size.
3. **Check every claim.** Run the **price-display-check** prompt on each test arm for each market. No arm shows an invented "was" price or deadline.
4. **Approval.** Show the client the plan, the decision rule and the limits. Record their yes.
5. **Build.** Level 2: build the test unstarted in the test tool, store or billing (new prices unused, the variant page saved). Level 3: start it on the approved date within the limits.
6. **Monitor weekly.** Read the guardrails: complaints, refunds, cancellations and profit per visitor or per deal. Stop and ask if a guardrail breaks or anything unexpected happens. Log every action.
7. **End on time.** Stop the test on the planned date, not when a result looks good.
8. **Read out.** Run the **price-test-and-readout** skill (readout steps): verdict on profit, the comparison, how sure we can be, what else changed.
9. **Decide.** Keep, change or roll back, by the rule written in step 2. If keeping a higher price for new buyers, apply it (level 3) after the client's yes.
10. **Existing customers.** A test result never moves existing customers by itself; that runs through the **pricing-review-and-change** workflow with a fresh yes.
11. **Next question.** Record what was learned and pick the next test.

## Outputs

- Test plan with the decision, stop and fairness rules.
- Display check for every arm.
- Weekly guardrail notes and the action log.
- Readout with the verdict and the sums.
- Decision record and the next question.

## What needs the client's approval

- The test plan, decision rule and limits, before building.
- At level 3, the action list before the test starts.
- Keeping a new price after the test.
- A fresh yes before any existing customer's price changes, any new "was" price or deadline, or any discount below the floor.
- Refunds above the client's limit and any compensation stay with the client.
