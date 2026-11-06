# Annual learning plan cycle

**Trigger:** The business sets next year's goals or budget, or a board asks what training should buy.

**Cadence:** One planning round a year (usually 8 to 12 weeks before the financial year), a short review each quarter, and a results report at year end.

**Access:** At the start, ask which level the client grants for the HR system, learning system, survey tool and document store, and the limits; record them under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Without that level, the output comes back as files and text.

## Steps

1. **Collect goals and evidence.** Read next year's goals, last year's plan, spend and results, survey exports (team level), review themes with names removed, error, incident and ticket counts, and known changes (new systems, new sites, new rules). Note missing data as [needed].
2. **Run the analysis.** Use the `training-needs-analysis` skill, steps 1 to 4: goals as measures, counted gaps, the "is training the fix?" sort and the ranking. For any single disputed request, run the `is-it-a-training-problem` prompt.
3. **Check skills data.** Where the gaps are about who can do what, use the `skills-matrix-and-career-ladder` skill to build or refresh the matrix and find single points of failure. [L2] Draft the rating form; [L3] send it to the approved teams. *Approval: the client approves the rating form and who receives it.*
4. **Add required training.** List training the client must provide (safety, sector rules, EU AI literacy where it applies), from the client's own rules and the official pages. Mark each "check this with local rules" and name the client's competent person.
5. **Design programmes.** `training-needs-analysis` step 5. For on-the-job items use `sop-to-on-the-job-training`; for new-hire paths, the `onboarding-learning-path` prompt; for workshops, the `workshop-agenda-and-facilitator-guide` prompt; for system changes, the `software-rollout-training-pack` prompt; for trainees, the `apprentice-skills-log-and-weekly-plan` prompt.
6. **Plan evaluation.** Use the `training-evaluation-plan` skill for each major programme: the Level 4 measure and baseline, critical behaviours, and when each level is checked.
7. **Calendar and budget.** `training-needs-analysis` steps 6 and 7: month by month around busy seasons, costs only from the client, providers compared on the same criteria. [L2] Save the calendar and budget as drafts. *Approval: the client approves the plan, calendar and budget.*
8. **Confirm the live action list.** [L3] Show the actions and limits: which courses to publish, which groups to enrol, which surveys to send and when, until what date. *Approval: the client's yes before the first live action.* Provider bookings and contracts need a separate yes each time; payment stays with the client.
9. **Run and log.** [L3] Publish sessions, enrol the agreed groups, send reminders and the agreed surveys. Log every action. Stop and ask if something unexpected happens.
10. **Quarterly review.** Compare delivery and early evaluation data with the plan. Move money and time from programmes that are not changing behaviour to ones that are. *Approval: the client approves any change to the plan or budget.*
11. **Year-end report.** `training-evaluation-plan` step 8: results by level against baselines, what the evidence can and cannot show, and recommendations for next year.

## Outputs

- Training needs analysis with counted gaps and a non-training issues list
- Skills matrix and gap report (team level)
- Annual plan, programme cards and month-by-month calendar
- Budget and provider comparison
- Evaluation plan per major programme
- Quarterly review notes and the year-end results report
- Action log of every live change

## Needs the client's approval

The rating form and its audience; the plan, calendar and budget; the level 3 action list and limits; every provider booking, contract or quote sent as binding (a fresh yes each time); any change to the plan or budget; and anything outside the limits, such as a new team or audience, deleting or overwriting training records, or sharing results with someone new. Funding, levy, pay and legal questions go to the client's adviser; check this with local rules.
