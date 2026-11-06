# Weekly maintenance review

**Cadence:** Once a week, at the start of the week. About an hour once the system is running.

## Steps

1. **Pull the numbers (level 1).** Open and closed work orders, overdue PMs, check sheet completion and failures, assets out of use, meter readings, contractor visits and costs for last week.
2. **Check safety first.** List every asset out of use and why, every failed safety item and whether it reached the right person, and any asset back in use without a return-to-service record. *Approval: only the competent person returns assets to service.*
3. **Turn requests into work.** Use the `fault-report-to-work-order` prompt for new reports. At level 3, create and assign work orders from approved requests and raise approved jobs to approved contractors within the cap. *Approval: anything above the cap or to a new contractor needs a fresh yes.*
4. **Clear the backlog.** Run the `pm-backlog-review` prompt if overdue PMs are growing. Compliance and safety-critical items first. *Approval: owner approves overtime, extra contractor hours or planned downtime.*
5. **Check the compliance calendar.** Items due in the next 30 days, overdue items and open actions from contractor reports. Send approved reminders and book approved visits (level 3). *Approval: competent persons confirm their dates.*
6. **Close with evidence.** Close work orders where the fix, cost, downtime and evidence are recorded; chase the rest. Update meters and next-due dates.
7. **Spot repeats.** Assets with three or more faults in 12 months go on the list for the `repair-or-replace-review` skill.
8. **Check the check sheets.** Completion rate by asset type and any sheet with no failures ever recorded; ask whether it is being done.
9. **Report.** One page to the owner: assets out of use, work orders opened and closed, overdue PMs and compliance items, downtime and cost this week, repeats, decisions needed, and the action log.

## Outputs

- Safety list (out of use, failed items, returns to service)
- Work orders created, assigned and closed
- Backlog plan for the next four weeks
- Compliance items due and booked
- Repeat-fault list
- Weekly one-page report and action log

## Needs the client's approval

Returns to service (competent person), orders above the cap or to new contractors, overtime, extra contractor hours, planned downtime, and replacing assets.
