# From a business question to a decision

**Trigger:** An owner, manager or committee asks a question the data might answer ("Which customers should we win back?", "Should we keep the Thursday class?", "How do we compare with similar practices?").

## Steps

1. **Pin the question.** Restate it as a decision with a date. Agree who reads the answer and what they will do with it.
2. **Check the data can answer it.** Run the `is-this-data-enough` prompt. If the verdict is "cannot answer yet", stop and agree the smallest extra data to collect, or a cheaper question. *Approval: the client agrees the question, the definitions and any data request before work starts.*
3. **Get the data safely (level 1).** Ask which access level the client grants for each tool. Read through official connectors or the tool's own sharing, or take exports. Never passwords in chat. Personal columns removed or replaced by IDs; a masked sample first if the file is large.
4. **Profile and clean (level 1; level 2 if the recipe is built in the client's file).** Use the `data-profiling-and-clean-up` skill. Share the profile and the rules before cleaning if anything changes the answer (for example, 20% of rows have no date).
5. **Analyse.** Use the `insight-brief-from-data` skill. Add the `forecast-from-history` skill for questions about the future, or the `benchmark-gap-table` prompt for comparisons with published figures, or the `survey-read-out` prompt for surveys.
6. **Self-check.** Run the quality bar in `knowledge.md`: counts reconcile, findings pass size, steadiness and outlier tests, small groups protected, caveats in the summary.
7. **Draft the brief.** Lead with the three-line answer, then up to five findings with actions, then what the data cannot tell us.
8. **Walk through it with the client.** Ten minutes on the summary and the biggest caveat. Note their questions and fix what was unclear. *Approval: the client decides on actions, and on who the brief is shared with. Publishing it in the client's tools is level 3.*
9. **Leave it repeatable.** Save the recipe, the definitions and the steps so the analysis can be redone next quarter.

## Outputs

- Agreed question, definitions and data request
- Profile and clean-up log
- Insight brief (2 to 4 pages), with forecast or benchmark tables if used
- Repeatable steps and saved recipe

## Needs the client's approval

The access level for each tool, the question and definitions, any request for more data, any use of personal data, sharing the brief beyond the people agreed, and every action. Changes to source systems happen only at level 3, within the limits set, after the client confirms the action list. Contacting customers, members or staff is not part of this workflow.
