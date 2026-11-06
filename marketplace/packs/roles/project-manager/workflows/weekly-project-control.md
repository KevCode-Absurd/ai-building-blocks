# Weekly project control

**Cadence:** Every review point (weekly by default), on the same day, for every running project.

**Trigger:** A plan exists and work has started.

**Access:** Level 1 (read) on the project tool, timesheets and messages is enough to write the update. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "update tasks and dates in the Website project, post the update in #website, no client emails").

## Steps

1. **Read the board.** Pull this week's done, in-progress and overdue tasks, hours logged and messages. [L3] Update task statuses that the team has reported done but not marked.
2. **Compare with the plan.** Check the critical path: has any task on it slipped? How much of the contingency is used?
3. **Check risks.** For each risk in the log, has its warning sign appeared? If so, start its first response and note it.
4. **Catch changes.** List any new asks from the client or owner. For each one outside scope, run `scope-and-change-control` (change request). [L2] Draft the change request. *Approval: the owner (and for client work, the agency lead) approves the note before it goes.* [L3] Send it to the agreed client contacts and log it.
5. **Check capacity.** If anyone is overbooked next week or a new project is coming, run the `team-capacity-plan` prompt.
6. **Re-plan if needed.** If the critical path no longer fits the deadline, run `project-plan-and-risk-log` (re-planning) and offer options. *Approval: the owner chooses the option; moving a milestone the client agreed needs the client's yes.* [L3] Then move the dates in the live tool and log it.
7. **Write the update.** Use the `weekly-status-update` prompt: on track, at risk or off track; done; next; blocked; decisions needed. [L2] Save as a draft.
8. **Publish.** [L3] Post the update to the agreed channel and list every live action taken this week at the foot. Otherwise send the draft to the owner to share.

## Outputs

- Weekly status update
- Updated risk log
- Change requests and change log entries
- Capacity check (when needed)
- Re-plan with options (when needed)
- Action log (level 3)

## Needs the client's approval

Every change request before it is sent, any new work started, moving a milestone or deadline, booking extra people or spend, and any message to a client or audience outside the agreed list. Anything that cannot be undone needs a fresh yes even at level 3.
