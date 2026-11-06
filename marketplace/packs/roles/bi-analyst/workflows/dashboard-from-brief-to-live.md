# Dashboard from brief to live

**Trigger:** An owner or manager asks for a new dashboard or report, or asks to move a spreadsheet dashboard into a BI tool. Typical length: one to three weeks, mostly waiting for sign-offs and test totals.

## Steps

1. **Intake and access (level 1).** Ask who opens the dashboard, how often, which decisions it supports and the three to five questions it must answer. Ask which tools hold the data and which access level the client grants for each; record the answers in "Access I have". Until they answer, work from exports and screenshots. No passwords in chat.
2. **Agree the metrics.** Run the `metric-definition-sheet` skill (or the `kpi-tree-from-goal` prompt for a quick start). *Approval: the owner signs off every metric card; disputed metrics need a named decision-maker.*
3. **Read the sources (level 1).** Column lists, sample rows with IDs instead of names, row counts, date ranges. Note the grain of each table and any unclear columns as questions.
4. **Write the build sheet.** Run the `dashboard-build-sheet` skill: model, measures in the tool's syntax, worked check, page layout, refresh, access, licences and test list. Use `write-a-measure-in-my-tool` for any tricky measure.
5. **Check licences and access early.** Confirm who needs which licence to view (for Power BI: Pro on both ends, or an F64-plus capacity for free viewers) and who may see which rows. *Approval: the owner confirms the viewer list and any row-level security rules.*
6. **Build in a copy (level 2).** Build in a development workspace, a Power BI Project file, an unshared Data Studio copy or a sandbox collection. Log each action.
7. **Tie out.** Run the test list: at least three numbers against trusted source totals, a row-count check, and an RLS test per role with a real account. If anything fails, use the `dashboard-review-and-tie-out` skill before going on.
8. **Owner review.** Walk the owner through each question and its chart. Fix wording, order and comparisons. *Approval: the owner approves the test results and the page.*
9. **Go live (level 3).** Show the action list and limits (which workspace, which viewers, which refresh schedule, which delivery emails) and wait for a yes. Then publish, set refresh and failure alerts, share with the agreed people and schedule delivery. Log each action with time and result. Without level 3, hand the client a numbered publish checklist instead.
10. **Two-week follow-up.** Check refreshes ran, usage figures, and any questions readers raised. Adjust and log changes.

## Outputs

- Signed-off metric cards and KPI tree
- Build sheet (model, measures, layout, refresh, access, tests)
- Tie-out results with pass or fail per number
- The dashboard in the client's tool (draft at level 2, live at level 3)
- Action log and a short handover note: owner, refresh, where definitions live, how to request changes

## Needs the client's approval

The access level for each tool; every metric definition; the viewer list and row-level rules; the test results before go-live; the level 3 action list before the first live action; anything outside the agreed limits, such as a new workspace, new viewers, deleting or overwriting an existing report, or changing a definition already in use.
