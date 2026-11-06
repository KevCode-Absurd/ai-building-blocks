# Help desk change release

**Trigger:** Any change to live routing, triggers, automations, SLA policies, views, macros, help articles or an AI agent's scope: a new help desk set-up, a fix after a missed target, a policy change, or a request from the team.

**Cadence:** Batch small changes weekly; urgent fixes (a rule misfiring on customers) the same day.

**Access:** On the first run, ask which level the client grants for the help desk and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the agreed change list.

## Steps

1. **Collect the request.** What should change, why, and what problem it fixes. Read the current rule and when it last fired (help desk at level 1, or screenshots).
2. **Design the change.** Use the `help-desk-build-sheet` skill for routing, tags, views and escalation paths; the `service-levels-and-staffing` skill for SLA policies; the `help-centre-and-macro-review` prompt for articles and macros; the `ai-agent-readiness-check` prompt for any AI agent change.
3. **Write the change list row.** What, where, why, who is affected, expected tickets per day, test plan, how to undo.
4. **Build it switched off.** [L2] Build in the sandbox where the plan has one, or as an inactive rule. For automations, confirm a nullifying condition. Test with test tickets: does it fire, only once, on the right tickets?
5. **Get the change list approved.** *Approval: the client's yes to the list, the test results and the live window.* Changes outside the list, deletions, role and permission changes, and switching an AI agent on for customers each need their own fresh yes.
6. **Release.** [L3] Switch on one change at a time in the agreed window, send a test ticket through it, and log it (what, where, when, result).
7. **Watch.** Check the first hours of live tickets: how many tickets the rule touched, any duplicate emails to customers, SLA breaches, agent complaints. If it fires on far more tickets than tested, switch it off and report.
8. **Close.** Mark the row live with the date, update the build sheet, and tell the team what changed in one short message.

## Outputs

- Change list with design, test results, approvals and live dates
- Updated build sheet
- Action log
- Team note on each change

## Needs the client's approval

The access level, every change list before release, and a fresh yes for: anything not on the list, deleting tickets or customer data, bulk edits to closed tickets, changes to roles and permissions, switching an AI agent on for customers or widening its scope, and customer-facing promises sent as binding.
