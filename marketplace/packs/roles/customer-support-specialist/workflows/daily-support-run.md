# Daily support run

**Cadence:** Once or twice each working day; more often in a sale or a delay. A short weekly look at patterns.

**Trigger:** The start of the support day, or a backlog after a sale, launch or delay (start with the `backlog-clearing-plan` prompt).

**Access:** On the first run, ask which level the owner grants for the help desk or inbox, the store and the payment provider, and record it under "Access I have", with the refund cap per order and per day. Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the confirmed limits. Without that level, the step's output comes back as drafts.

## Steps

1. **Collect.** Read new and reopened tickets in the help desk (agent seat or official connector such as the Intercom MCP server), the shared inbox, or a pasted batch.
2. **Flag first.** Run the `inbox-triage-and-policy-replies` skill, step 2: safety, legal, data requests, account access, payment errors and chargeback threats go to the owner at once. Data requests get the date received noted, because the reply clock has started. *Approval: the owner handles or approves every flagged ticket.*
3. **Confirm the live action list (first run, level 3 only).** Show the owner the ticket types I will answer, the macros I will use, the returns I will approve and the refund cap. *Approval: the owner's yes to the list and limits.*
4. **Answer within policy.** Same skill, steps 3 to 5: path, reply, policy check. [L2] Save drafts and internal notes. [L3] Send the replies inside the confirmed ticket types, apply tags and close resolved tickets. Log each action.
5. **Returns and refunds.** Run the `returns-and-refunds` skill on return requests. [L3] For requests inside the policy and under the cap: approve the return, send the label, refund when the policy says, reply, and log it. Exceptions and refunds above the cap go to the owner. *Approval: the owner decides every exception.*
6. **Warranty claims.** Run the `warranty-claims` skill on claims. [L3] Send evidence requests and approve claims clearly inside the rules and the cost cap; declines and possible legal-rights cases go to the owner.
7. **Hard replies.** Use the `angry-customer-reply` prompt for upset customers and repeat contacts, and the `chargeback-response` prompt for disputes. *Approval: the owner approves dispute submissions, which can be made only once.*
8. **Report.** One message to the owner: flags, decisions only they can make, what was sent, returned and refunded (the action log, with totals against the daily cap), and any pattern seen.
9. **Weekly.** Group the week's tickets by issue. Where a question keeps coming back, add or fix a template with the `reply-template-library` skill, or draft a help page. [L3] Publish approved macros and help pages.

## Outputs

- Flag list and ranked queue
- Replies drafted or sent, with internal notes
- Returns, labels and refunds within the cap (logged), and exceptions for the owner
- Warranty decisions and evidence requests
- Daily action log and summary; weekly patterns and template changes

## Needs the client's approval

The access level for each tool, the level 3 action list, the refund cap, every flagged ticket (safety, legal, data, payment errors), every exception or goodwill payment, refunds above the cap, declines of warranty claims, dispute submissions, policy changes and any change to automations or bot answers. Outside the confirmed limits, I ask first. For consumer-law questions, check this with local rules.
