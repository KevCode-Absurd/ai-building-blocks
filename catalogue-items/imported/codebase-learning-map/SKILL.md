---
name: repo-understand
description: Use when a learner asks to learn from a repository and the agent must map curriculum structure and prerequisites before teaching.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [onboarding, curriculum-mapping, prerequisite-awareness]
status: stable
---

# Purpose

Create a reliable curriculum map before deep teaching. Prevents shallow file retrieval by forcing the agent to infer learning structure, identify prerequisite dependencies, and recommend coherent starting paths.

# Activation

- User asks to learn a repository, course repo, or technical curriculum. User asks "where should I start?" in a multi-module repo. Agent hasn't established module sequence and prerequisites.
- **Skip if**: user wants a narrow operational task unrelated to learning flow, or repo context is absent and user wants generic theory.
- **Routing**: run before `teach-concept`, `socratic-mode`, `check-understanding`, and `build-with-me` for repo-based learning.

# Inputs

- Repository root and visible structure, high-signal docs (README, syllabus, indexes), learner goal and level signals.

# Workflow

1. **Classify** — Determine repo type: curriculum-first, project-first, reference-first, or hybrid. Identify learning artifacts (lessons, labs, projects, checkpoints).
2. **Map Hierarchy** — Derive module/phase order from folder structure and docs. Produce a phase map with outcomes per phase.
3. **Infer Prerequisites** — For each phase, list conceptual and tooling prerequisites. Mark dependency edges between phases.
4. **Estimate Progression** — Foundational → applied → advanced. Identify transition points where learners often stall.
5. **Synthesize Paths** — Propose 2–3 path variants based on learner goals and level, with tradeoffs and estimated effort.
6. **Checkpoint** — Ask one decision-forcing question to select a path. Do not start deep instruction before the learner selects or confirms.

# Rules

- DO: require a phase map before any deep explanation.
- DO: explain why sequence matters, not just what modules exist.
- DO: provide goal-conditioned paths with tradeoffs — never a single path for all learners.
- DO: surface uncertainty explicitly when repo signals are weak.
- DON'T: quote random files without structural context.
- DON'T: recommend advanced topics before prerequisite chain is visible.
- DON'T: dump long directory trees — cap orientation to phase outcomes and decisions.
- DON'T: invent lessons/modules without evidence — label inferred items as tentative.

# Output

Responses should contain: repo type classification, learner goal/level, curriculum map (phases + outcomes), prerequisite chain, 2–3 recommended paths with tradeoffs, checkpoint question, and next step. Format naturally.

# Checklist

- [ ] Curriculum map includes ordered phases and outcomes.
- [ ] Prerequisite chain is explicit.
- [ ] At least two goal-conditioned paths provided.
- [ ] Checkpoint question asked before deep teaching begins.

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
- The [Skill progression map builder](https://useaiblocks.com/skills/skill-progression-map-builder). It takes the document.
- The [Overloaded lesson checker](https://useaiblocks.com/skills/overloaded-lesson-checker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
