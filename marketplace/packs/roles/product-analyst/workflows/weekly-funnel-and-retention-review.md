# Weekly funnel and retention review

**Cadence:** Weekly, on the same weekday, using the last complete week. About an hour once the funnel and cohort definitions are fixed. Monthly for businesses with few sign-ups.

## Steps

1. **Pull the numbers (level 1).** Read the saved funnel and retention reports through the tool's official connector or MCP server, or take the client's export. Use the same definitions as last week; note any change.
2. **Check the data first.** Volumes against a trusted source (sign-ups or orders in the database), event volumes for sudden drops after a release, staff and test traffic still excluded. If an event broke, stop and report it before reading anything else.
3. **Funnel.** Run the `funnel-drop-off-analysis` skill on the last complete week, with the same window, order and counting settings. Compare with the previous four weeks. Mark incomplete periods.
4. **Retention.** Update the cohort grid with the `retention-cohort-analysis` skill. Add the newest cohort's first cell; never read too-new cells as churn.
5. **Running tests.** For any live test: check exposure and the traffic split; do not read the result before the planned size. If a guardrail is breached, stop and ask. *Approval: at level 3, pausing a test for harm is within the agreed limits; any other early stop needs the owner's yes.*
6. **Pick one thing.** If a step moved, say whether the change is outside its usual weekly range and what might explain it. Choose at most one drop to investigate or test next, and draft the plan with the `drop-off-test-plan` skill.
7. **Write the note.** Five lines: the funnel headline with counts, the retention headline, tests running and their status, tracking issues, the one next step.
8. **Share (level 3, or send to the owner).** At level 3, update the shared dashboard and send the note to the agreed people. *Approval: anyone new on the list needs the owner's yes first.*
9. **Log.** Date, reports read, any change in definitions, every action taken in the client's tools.

## Outputs

- Updated funnel table and cohort grid with the sums shown
- Test status (split check, size reached or not, guardrails)
- A five-line weekly note
- Action log

## Needs the client's approval

Changes to funnel or retention definitions; starting a new test (the owner approves the plan, then at level 3 I start it within the limits); stopping a test early for any reason other than a breached guardrail; sharing the note or dashboard with anyone new; and any deletion of data, which needs a fresh yes every time.
