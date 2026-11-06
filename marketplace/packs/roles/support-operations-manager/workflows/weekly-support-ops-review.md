# Weekly support operations review

**Cadence:** Every Monday morning, covering the previous Monday to Sunday. Daily during a launch, sale or outage.

**Trigger:** The start of the week, or an alert: SLA breaches jump, backlog grows two days running, or a new contact reason appears.

**Access:** On the first run, ask which level the client grants for the help desk, the WFM tool or rota sheet, and the team chat, and record it. Until they answer, work at level 1. Steps marked [L2] need read and draft access; [L3] need read, write and publish access within the agreed limits.

## Steps

1. **Pull the numbers.** Export last week's tickets from the help desk (level 1), or ask for the export. Remove personal data.
2. **KPI pack.** Use the `voice-of-customer-report` skill, steps 3 to 6: volume, median first reply and resolution, backlog by age, reopens, repeat contacts, SLA met by priority, AI resolutions split confirmed and assumed. Same definitions every week.
3. **Staffing against volume.** Compare volume by hour with the rota using the `service-levels-and-staffing` skill, step 5. Note the hours that missed target and why.
4. **Queues and owners.** List the oldest ticket in each queue and its owner. Anything past target without an owner goes in the pack.
5. **Escalations.** List open escalations past their target and complaints with a formal deadline (the date it runs out).
6. **Quality sample.** Pick this week's QA sample with the `support-qa-scorecard` skill, step 5. [L3] Assign the reviews.
7. **New reasons.** Flag any contact reason that grew sharply or is new, with three anonymous quotes.
8. **Proposed changes.** Draft rows for the change list (routing, macros, rota, help pages). These go through the `help-desk-change-release` workflow. *Approval: the client approves each change list.*
9. **Rota for next week.** [L2] Adjust the draft rota for known events and leave. [L3] Publish the agreed rota within the client's rules. *Approval: rota changes that touch contracts, pay or working hours stay with the client; check this with local rules.*
10. **Send the pack.** [L2] Draft the five-line summary and the KPI table. [L3] Post it to the agreed channel. *Approval: new recipients need a fresh yes.*

## Outputs

- Weekly KPI pack with definitions and a five-line summary
- Hours that missed target, with the staffing reason
- Oldest ticket per queue with its owner
- Escalations and complaint deadlines due
- QA sample assigned
- Draft change list and next week's rota

## Needs the client's approval

The access levels, each change list, rota changes affecting contracts, pay or hours, new recipients for the pack, and any decision about individual staff. Reports are never used to judge one agent.
