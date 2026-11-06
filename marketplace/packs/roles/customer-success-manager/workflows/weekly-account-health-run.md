# Weekly account health run

**Cadence:** Every week, on the same day. About an hour for up to a few hundred accounts once the rules are set; the first run takes longer.

## Steps

1. **Pull the data.** Export or read accounts, usage, tickets, failed payments and renewal dates from the CRM, billing and support tools (level 1). Note anything missing.
2. **Score.** Apply the health rules from the `health-score-and-save-plan` skill. Show the reason behind every score. Compare with last week and list who moved.
3. **Split out billing.** Accounts whose main signal is a failed payment go to the billing fix list: card update link, retry settings, a plain reminder. *Approval: owner approves retry and reminder settings once; after that, level 3 covers sending the reminders.*
4. **Find causes.** For each red and amber account, read tickets and notes and label the likely cause fact or guess.
5. **Choose actions.** One action per at-risk account with an owner and a date. Use the `check-in-messages-by-stage` prompt for the message. *Approval: any discount, credit or plan change above the agreed cap goes to the owner.*
6. **Act within limits.** At level 2, save messages as drafts and create tasks. At level 3, send the check-ins and log the tasks for the agreed segments. *Approval: the first live run needs the owner's yes on the action list and limits.*
7. **Watch renewals.** List accounts with a renewal inside the notice window and hand them to the `renewal-cycle` workflow.
8. **Report.** One page: counts by health band, who moved, actions taken (from the action log), billing fixes, three patterns worth fixing at the root, data gaps.

## Outputs

- Health table with reasons, causes, actions, owners and dates
- Billing fix list
- Sent or drafted check-ins, and tasks in the CRM
- Weekly one-page report and action log
- Renewals handed to the renewal cycle

## Needs the client's approval

The health rules (once, and when changed), the first live action list and its limits, any offer, credit or plan change above the cap, messages to a new customer group, and anything about contract terms or prices.
