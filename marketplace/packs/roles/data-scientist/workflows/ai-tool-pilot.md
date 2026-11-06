# Pilot an AI tool before you commit

**Trigger:** A vendor offers an AI tool (fraud screening, lead scoring, churn prediction, document checks, CV sorting) and the client is deciding whether to buy, renew or switch.

## Steps

1. **Pin the decision (level 1).** Write what the tool would change, the cost of each kind of mistake, and what "worth it" means in money or time. Ask which access level the client grants for each tool involved, and record it under "Access I have".
2. **Read the claim.** Run the `vendor-ai-claim-questions` prompt on the pitch and send the questions. *Approval: the client sends the questions to the vendor, or approves me sending them from their mailbox at level 3.*
3. **Check the stakes.** If the tool scores or decides about people, run the `responsible-ai-risk-check` skill before any live use and flag rules for the client's legal adviser.
4. **Design the trial.** Use the `experiment-design-and-readout` skill: a comparison group (business as usual, or the tool's flags recorded but not acted on), one primary measure, guardrails, the length from a sample size, and stop rules (for example, pause if false alarms on real customers pass a level the client sets). *Approval: the client agrees the plan, the length and the stop rules before the trial starts.*
5. **Set up (level 2).** Configure the trial in the vendor's sandbox or in "observe only" mode where the tool offers it, so nothing acts on customers yet.
6. **Run (level 3, within limits).** Switch the trial on for the agreed share of cases and period only. Log every change. Stop and ask on errors, complaints or a stop rule.
7. **Read the results.** Use the `model-and-ai-claim-review` skill on the trial's own counts: confusion matrix, rates at the client's volume, money versus business as usual and versus a simple rule, results by group where relevant.
8. **Decide.** One page: buy, buy with a check (manual review, a different threshold), or do not buy; the questions the vendor did not answer; and what to monitor if bought. *Approval: the purchase and any contract stay with the client.*

## Outputs

- Decision note and error costs
- Vendor questions and answers
- Risk check and legal flags (if the tool scores people)
- Trial plan with stop rules, and the change log
- Trial readout with money and a verdict
- One-page decision and monitoring plan

## Needs the client's approval

The access level for each tool; messages to the vendor; the trial plan, length and stop rules; switching the tool on for live cases (level 3, within the agreed share and period); any use of group data; and the decision to buy. Contracts and payments stay with the client. Decisions about individual people stay with the people the client names.
