---
name: project-review
description: Use when evaluating a completed or in-progress project across scope, correctness, quality, testing, and learning outcomes using structured Praise-Critique-Grow feedback.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [projects, review, feedback, assessment]
status: stable
---

# Purpose

Provide structured, constructive review of a learner's project at a milestone or completion checkpoint. Combines technical evaluation with learning-outcome assessment. Uses Praise-Critique-Grow to maintain learner motivation while surfacing real issues.

# Activation

- Milestone reached in `build-with-me`. Feature or project completed. Learner asks for feedback on their work. Pre-submission review (assignment, portfolio, interview take-home).
- **Skip if**: project hasn't started. Learner needs concept help → `teach-concept`. Active debugging in progress → `debug-teacher`.
- **Routing**: issues found → use `challenge-generator` for targeted practice. Concept gaps → `teach-concept`. Design issues → `architecture-review`. Log weak areas to `weak-area-tracker`.

# Inputs

- Project/feature code and documentation, original requirements/scope, learner's stated goals, relevant assessment criteria.

# Review Dimensions

- **Scope**: does it meet stated requirements? Scope creep? Missing features?
- **Correctness**: does it produce correct results? Edge cases handled?
- **Code Quality**: readability, naming, structure, DRY, separation of concerns.
- **Testing**: test coverage, test quality, edge case testing.
- **Learning Outcomes**: what did the learner demonstrate they understand? What gaps remain?

# Workflow

1. **Self-Assessment** — Ask learner first: "What do you think went well? What would you change?" This surfaces their self-awareness before external feedback.
2. **Review** — Evaluate across all 5 dimensions. Note strengths and issues with specific code/design references.
3. **Praise** — Start with 2–3 specific strengths. Reference actual decisions/code, not generic compliments.
4. **Critique** — List issues priority-ordered. Each: dimension, description, severity, specific code reference. Max 5 issues per review — more overwhelms.
5. **Grow** — For each major issue: one concrete next action. Frame as growth opportunity, not failure. Include a learning recommendation (skill or concept to revisit).
6. **Retrospective** — Ask one synthesis question: "What's the most important thing you learned from building this?" Record answer for `learning-memory`.

# Rules

- DO: require self-assessment before giving feedback.
- DO: praise specific decisions, not generic effort.
- DO: limit critique to top 5 issues — prioritize by impact.
- DO: frame growth actions as opportunities, not failures.
- DO: end with a retrospective question and record the answer.
- DON'T: start with criticism — always Praise first.
- DON'T: give vague feedback ("good job" / "needs work").
- DON'T: rewrite the learner's code — point to issues and let them fix.
- DON'T: skip the self-assessment — it builds metacognitive skill.

# Output

Responses should contain: self-assessment prompt, praise (2–3 specific strengths), critique (issues with dimension + severity + code reference), grow (next actions + learning recommendations), and retrospective question. Format naturally.

# Checklist

- [ ] Self-assessment requested before external feedback.
- [ ] Praise references specific code/decisions.
- [ ] Critique limited to top 5 issues, priority-ordered.
- [ ] Retrospective question asked and answer recorded.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Student confidence task planner](https://useaiblocks.com/skills/confidence-building-task-ladder). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
