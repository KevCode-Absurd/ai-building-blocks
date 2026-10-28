---
name: analysis-planning
description: Structure analysis approach before starting work. Use when receiving new analysis requests, breaking down complex questions into steps, or planning iterative analysis workflows.
---

# When to use

After requirements are gathered and before any data is touched. Planning is especially important when the analysis involves multiple steps, uncertain data availability, or a tight deadline where sequencing matters. A 15-minute planning session prevents hours of wrong-direction work.

# Process

1. **Decompose the question** — break the business question into sub-questions using `references/scoping_framework.md`; each sub-question should be answerable with a single data pull or calculation.
2. **Identify data dependencies** — for each sub-question, list the required tables/datasets and assess availability (confirmed / likely / unknown); flag blockers early.
3. **Sequence the work** — order sub-questions so that each output feeds the next; identify which steps can run in parallel.
4. **Estimate effort** — use `references/effort_estimation.md` to assign time estimates per step; sum to a total and compare against the deadline.
5. **Log risks and dependencies** — use `references/risks_dependencies.md` to document anything that could delay or invalidate the plan (data gaps, external approvals, methodology uncertainty).
6. **Produce the plan** — fill in `assets/analysis_plan_template.md`; for projects with stakeholder kickoffs use `assets/kickoff_doc_template.md`.

# Inputs the skill needs

- Analysis brief or requirements doc (from `stakeholder-requirements-gathering` skill)
- Available data sources
- Deadline and resource constraints

# Output

- Completed analysis plan with sequenced steps and time estimates (`analysis_plan_template.md`)
- Kickoff doc for stakeholder alignment (optional, `kickoff_doc_template.md`)
- Risk / dependency log

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Decide what to do** with the [Requirements interviewer](https://useaiblocks.com/skills/requirements-question-asker).
- The [Project kickoff brief writer](https://useaiblocks.com/skills/project-kickoff-brief-writer).
- The [Stakeholder update writer](https://useaiblocks.com/skills/stakeholder-update-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
