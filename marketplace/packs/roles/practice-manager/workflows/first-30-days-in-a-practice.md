# First 30 days in a practice

**Trigger:** A new practice manager starts, a practice hires this agent, or an owner takes the desk back after a manager leaves. About two to four hours a week for a month.

## Steps

1. **Agree access (day 1).** List every tool (practice system, rota, calendar, website, shared drive) and ask which access level the owner grants for each. Record it under "Access I have". Use the `system-access-plan` prompt to check that every person and the agent has their own login and the narrowest role. *Approval: owner grants levels; making users inactive needs the owner's yes.*
2. **Learn the practice (week 1).** Clinicians, rooms, hours, desk staff, the busiest times, what goes wrong. Pull three months of de-identified schedule exports (level 1).
3. **Find the pressure points (week 1).** Run the `busiest-ten-minutes-at-the-desk` prompt and walk the patient path with the desk team.
4. **Baseline the numbers (week 2).** Use the `practice-kpi-pack` skill to agree definitions with the owner and produce last month's pack. No changes yet.
5. **Check the legal clocks (week 2).** Find where records requests, breaches and complaints are logged today. If nowhere, start the logs with the `patient-records-request-procedure` prompt and the `patient-data-incident-response` workflow. Find who the privacy lead is. For UK vet practices and US self-pay practices, run the `fee-information-and-estimates` prompt and put the dates in the calendar. *Approval: privacy lead approves the procedures; check this with local rules.*
6. **Fix the desk (week 3).** Use the `patient-flow-and-front-desk-procedures` skill for the top two pinch points. Test them with the team for a week. *Approval: owner approves procedures; clinicians approve any step that touches clinical work.*
7. **Fix recalls (week 3).** Use the `recall-process` skill: confirm intervals with the clinicians, add "book or set recall before payment" to check-out, and build the recall workflow inactive (level 2). *Approval: owner switches it on, or I do at level 3 after a yes.*
8. **Plan the template and rota (week 4).** Use the `appointment-book-and-rota` skill to propose the template and rota with cover rules. Apply only from a date the clinicians agree. *Approval: each clinician signs off their slot rules; owner approves the rota.*
9. **Report (day 30).** One page: what I found, what changed, the baseline numbers, the open risks (logs, contracts, cover) and the plan for the next 60 days, with the action log.

## Outputs

- Access record and access review
- Baseline KPI pack with definitions
- Records request, breach and complaint logs (started or checked)
- Two front desk procedures, tested
- Recall process designed and built
- Proposed appointment template and rota with cover rules
- Day-30 report and action log

## Needs the client's approval

Access levels and user changes, every procedure, recall switch-on, template changes (each clinician), the rota, fee and estimate procedures, and anything on the fresh-yes list in `access.md`.
