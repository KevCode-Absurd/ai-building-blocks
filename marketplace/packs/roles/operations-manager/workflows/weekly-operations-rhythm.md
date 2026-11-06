# Weekly operations rhythm

**Cadence:** Every week, on the same day. The first run includes a health check of core routines.

**Trigger:** The client starts weekly reviews, or the owner says things keep slipping.

**Access:** Level 1 (read) on the numbers, task tool and notes is enough to write the review. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "post in #ops, create and assign tasks in the Operations project, no other projects").

## Steps

1. **First week only: health check.** Run the `weekly-ops-review` skill's health check: score each core routine working, shaky or broken, with evidence, and name the five biggest fixes. Build the roles and backups chart with the `roles-chart-and-role-agreements` prompt. *Approval: the owner agrees the five fixes and their order.*
2. **Collect the numbers.** Pull this week's numbers from the tracker or exports. [L3] Update the live tracker and keep the change log.
3. **Check last week's actions.** Mark each done, not done or did not work.
4. **Write the review.** Run the `weekly-ops-review` skill, steps 2 to 7: numbers with guards, causes, fixes with owners, dates and measures, calendar changes and the watch list. [L2] Save the review and the new actions as drafts.
5. **Agree the actions.** *Approval: the owner agrees the fixes and owners before anything is assigned.*
6. **Publish and assign.** [L3] Post the review to the agreed channel, create and assign the actions, and add new routines to the recurring-task calendar. Otherwise send the one-page review to the owner to share.
7. **Pick a process to fix.** If the same problem appears in several reviews, start the `fix-and-document-one-process` workflow for it.
8. **Log and report.** List every live action taken this week (what, where, when, result) at the foot of the review.

## Outputs

- One-page weekly review
- Action list with owners, dates and measures
- Updated recurring-task calendar
- Watch list
- Health check and roles and backups chart (first week)
- Action log (level 3)

## Needs the client's approval

The five first fixes, each week's action list and owners, any new recurring routine, anything that changes someone's workload or role, any spend, and posting to any channel or audience not already agreed. Staff performance, pay and hiring calls stay with the owner and HR.
