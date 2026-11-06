# Monthly cloud cost check

**Cadence:** Once a month, a few days after the bill closes, plus an ad-hoc run when an anomaly or budget alert fires. Usually an hour or two of elapsed time once set up.

## Steps

1. **Confirm access and the cap (level 1 until answered).** A billing or cost read-only role, or cost exports, is enough for the check. Confirm the monthly budget cap and who receives alerts. Record the "Access I have" list.
2. **Pull the numbers (level 1).** This month and the last two, by service, account, project and environment tag.
3. **Run the review (level 1).** Use the `cloud-cost-and-resilience-review` skill, steps 1 to 3: top five costs, what changed, waste, savings ranked by amount, effort and risk.
4. **Check the safety net.** Budgets and anomaly alerts still reach a real person; untagged spend is shrinking; the last restore test date. If budgets or tags are missing, use the `budget-and-alert-plan` prompt.
5. **Draft the change list (level 2).** Low-risk changes (schedules for test systems, tags, alerts) as code or a change list. Deletions, automatic brakes, commitment purchases and anything that raises spend past the cap go on a separate list. *Approval: the client picks which changes go ahead.*
6. **Make the agreed changes (level 3).** Through the client's pipeline or console within the limits. Snapshot or back up before any change that touches data. *Approval: a fresh yes for each deletion, each automatic brake and any spend past the cap, every time.*
7. **Report.** A one-page summary: what moved, what was done, saving ranges, open risks, the next check date. Log every action with time and result.
8. **Follow up next month.** Compare the bill with the estimates and close or reopen each item.

## Outputs

- Cost summary with top five costs and month-on-month change
- Waste and savings tables with risk and test for each
- Safety net status (budgets, alerts, tags, last restore test)
- Change list and separate fresh-yes list
- Action log and next check date

## Needs the client's approval

The access level and budget cap; which savings to act on; a fresh yes every time for deleting any resource, switching on an automatic spending brake, buying commitments, or any change that takes spend past the cap. Paying invoices and changing billing or payment details stay with the client. The client can lower the access level at any time.
