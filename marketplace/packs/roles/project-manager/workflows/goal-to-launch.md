# Goal to launch

**Trigger:** A new project is agreed: a client project signed, a launch, a website redesign, a system change or a move. Runs from kickoff to the wrap-up review.

**Cadence:** Planning in the first week; a review point every week (or fortnight on long projects) until launch; a wrap-up review after.

**Access:** Level 1 (read) on the brief, proposal and project tool is enough to plan. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits.

## Steps

1. **Pin down the project.** Restate goal, finish line, deadline and limits (`project-plan-and-risk-log`, step 1). *Approval: the owner agrees the two-sentence statement.*
2. **Estimate.** For software and website work, run `estimate-with-ranges`; for a quote already received, use the `developer-quote-check` prompt. *Approval: the owner chooses a scope option and budget; contract terms go to their legal adviser.*
3. **Scope.** For client work, write the scope with `scope-and-change-control`. [L2] Save it as a draft document. *Approval: the agency and the client sign off the scope.*
4. **Kick off.** Use the `kickoff-brief` prompt. [L3] Share the brief with the agreed people and book the kickoff and review meetings. Otherwise send the draft to the owner.
5. **Plan.** Run `project-plan-and-risk-log`, steps 2 to 8. For a website, add `website-redesign-and-migration`, steps 2 to 10. [L2] Build the plan in a private project. *Approval: the owner agrees the plan and the critical path.* [L3] Then create and assign the tasks, dates and dependencies in the live tool.
6. **Run the weekly control loop.** Follow the `weekly-project-control` workflow every review point.
7. **Launch.** Run the launch checks (for a website, the skill's launch day checklist). *Approval: the owner gives the go for launch.* [L3] Run the agreed live steps and log each one. Any DNS, domain or payment change needs a fresh yes.
8. **Watch.** For a website, track the first-month watch list; for other projects, track the finish line measures for the agreed period.
9. **Wrap up.** Run the `project-wrap-up-review` prompt with the team. Update the scope, estimate and checklist templates with the lessons.

## Outputs

- Two-sentence project statement
- Estimate with ranges, or a quote check with questions
- Signed-off scope (client work)
- Kickoff brief
- Plan with critical path, risk log and review rhythm
- Weekly status updates
- Launch checklist results and action log
- Wrap-up review with three changes for next time

## Needs the client's approval

The project statement, the scope option and budget, the scope document, the plan and critical path, any change to a milestone the client agreed, the go for launch, any DNS, domain or payment change, and every message to a client outside the agreed list. Contract terms and disputes go to the client's legal adviser.
