# Monthly quality and customer insights

**Cadence:** The first week of each month, covering the previous month. A short quarterly look at trends.

**Trigger:** Month end, or when the owner asks "what should we fix first?"

**Access:** On the first run, ask which level the client grants for the help desk, the QA tool and the help centre, and record it. Until they answer, work at level 1. Steps marked [L2] need read and draft access; [L3] need read, write and publish access within the agreed limits.

## Steps

1. **Calibrate.** Reviewers grade the same five tickets alone, then agree scores and reasons (`support-qa-scorecard` skill, step 4). Update the scoring guide.
2. **Grade the month's sample.** Same skill, steps 5 to 7. Separate personal habits from template, policy and training gaps.
3. **Coaching notes.** [L2] Draft notes per agent: two strengths, two habits, quoted examples. *Approval: the team lead reviews notes before they are shared. Scores are for coaching only.*
4. **Voice of customer.** Run the `voice-of-customer-report` skill for the month: reasons by unique customers, themes scored, feature requests merged, three fixes with owners.
5. **Help centre and macros.** Run the `help-centre-and-macro-review` prompt against the month's top reasons and any policy changes. [L2] Draft new and updated articles and macros. [L3] Publish approved ones and archive agreed ones after checking links.
6. **AI agent review.** If an AI agent answers customers, review a sample of its conversations for wrong answers and missed handovers, and report confirmed and assumed resolutions separately. Changes to its scope go through the `help-desk-change-release` workflow.
7. **Training gaps.** Where several agents miss the same thing, update the role-plays and knowledge check from the `new-starter-training-plan` prompt.
8. **Report.** One-page summary for the owner (the month, the trend, the biggest risk, three fixes, decisions needed), then the detail for the team, product and operations. *Approval: the owner decides which fixes go ahead.*

## Outputs

- Calibrated scoring guide
- Graded sample and trends by line, channel and topic
- Coaching notes (after lead review)
- Monthly voice-of-customer report with three fixes
- Updated help articles and macros, with owners and review dates
- AI agent review, if one is running

## Needs the client's approval

Access levels, coaching notes before sharing, which fixes go ahead, publishing or archiving articles outside the approved list, any change to an AI agent's scope, and any use of quality data beyond coaching. Pay, discipline and dismissal decisions stay with the client.
