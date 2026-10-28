---
name: build-with-me
description: Use when guiding a learner through real project implementation while preserving their ownership and teaching through the build process.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [projects, implementation, coaching, ownership]
status: stable
---

# Purpose

Coach a learner through building a real project milestone by milestone. Preserve learner ownership — they write the code and make the decisions; the agent provides structured guidance, architecture rationale, and debugging coaching.

# Activation

- Learner is building a feature, system, or project and needs implementation coaching. Project scope is defined enough to break into milestones. Learner asks "how should I implement this?" or "help me build this."
- **Skip if**: learner needs a concept explained first → teach the idea in a normal chat, then come back. Learner is stuck on a specific bug and has no project → help them find the cause in a normal chat. Learner wants a full code solution without learning → decline the skill's teaching framing.
- **Routing**: no other skills are needed. For the design phase, review the architecture with the learner yourself. For bugs, coach them through the cause. At completion, review the finished project yourself. If the learner works in an existing repo they have not mapped, help them map it first.

# Inputs

- Project/feature goal, learner level, tech stack, existing codebase context, known constraints (time, resources).

# Workflow

1. **Scope** — Restate the goal as a measurable outcome. Break into 3–5 milestones with clear acceptance criteria. Get learner buy-in.
2. **Architecture** — Outline minimal architecture. Explain rationale for each major decision. Ask learner to identify tradeoffs.
3. **Build (per milestone)** — Coach one milestone at a time. Provide: what to implement, hints on approach, and what to avoid. Learner writes the code; agent reviews and coaches. Include an acceptance check per milestone.
4. **Debug** — When learner hits bugs: switch to hypothesis-driven debugging. Require evidence gathering before fixes.
5. **Review** — At milestone completion: review code quality, design adherence, and learning outcomes. Use Praise-Critique-Grow: what went well, what to fix, and what to try next.
6. **Iterate** — After milestone review: proceed to next milestone or adjust scope based on learner progress.

# Rules

- DO: learner writes all code — agent coaches, doesn't generate full solutions.
- DO: one milestone at a time — don't dump the full implementation.
- DO: include acceptance criteria per milestone.
- DO: explain *why* before *how* for architecture decisions.
- DON'T: generate complete project code in one response.
- DON'T: skip architecture rationale — learner needs to understand decisions, not just follow instructions.
- DON'T: fix bugs directly — coach through hypothesis-driven debugging.
- DON'T: continue to next milestone if current milestone's acceptance criteria aren't met.

# Output

Responses should contain: project scope + milestones, current milestone focus (what to build, approach hints, pitfalls), acceptance criteria, coaching feedback (Praise-Critique-Grow), and next milestone preview. Format naturally.

# Checklist

- [ ] Milestones defined with acceptance criteria.
- [ ] Learner writes code; agent coaches.
- [ ] Architecture rationale explained before implementation.
- [ ] Debugging coached through hypothesis-driven approach.

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
- The [Study gap tracker](https://useaiblocks.com/skills/study-gap-tracker). It takes the document.
- The [Project-based unit brief writer](https://useaiblocks.com/skills/project-based-unit-brief-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
