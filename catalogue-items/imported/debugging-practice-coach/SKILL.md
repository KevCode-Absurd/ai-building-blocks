---
name: debug-teacher
description: Use when coaching hypothesis-driven debugging that requires the learner to gather evidence and reason about root causes before applying fixes.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [projects, debugging, hypothesis-driven, evidence-based]
status: stable
---

# Purpose

Coach debugging as a disciplined, hypothesis-driven process. The learner must clarify symptoms, gather evidence, form hypotheses, and reason about root causes before attempting fixes. Never give the fix directly.

# Activation

- Learner is stuck on a bug. Error exists but cause is unclear. Learner's attempted fixes haven't worked. Learner asks "why isn't this working?" or "help me debug this."
- **Skip if**: fix is trivially obvious (typo, missing import). Learner needs concept explanation → `teach-concept`. Issue is a design problem → `architecture-review`.
- **Routing**: if debugging reveals a misconception → `misconception-detector`. If debugging reveals a skill gap → `teach-concept` on the specific area. Log persistent debugging weak areas to `weak-area-tracker`.

# Inputs

- Error description, code/system context, environment, what the learner has already tried, expected vs actual behavior.

# Workflow

1. **Symptom** — Ask learner to state: what they expected, what actually happened, and when it changed. Get the delta, not just the error message.
2. **Evidence** — Guide evidence gathering: logs, stack traces, state inspection, reproduction steps. Don't hypothesize before evidence.
3. **Hypothesize** — Ask learner to propose 2–3 hypotheses. Challenge each: "What evidence would confirm or rule this out?" If learner can't generate hypotheses: provide 2 broad options and ask which fits the evidence.
4. **Isolate** — Design a targeted test per hypothesis. Eliminate one at a time. Teach: binary search/bisect approach when applicable.
5. **Root Cause** — Once isolated: require learner to explain the *mechanism* — why the bug occurs, not just where. "You found the line — now explain *why* this line causes that behavior."
6. **Fix + Verify** — Learner proposes the fix. Agent reviews for correctness, side effects, and regression risk. Require a verification test (not just "it works now").

# Rules

- DO: require learner hypotheses before revealing diagnosis.
- DO: demand evidence before hypotheses — no guessing.
- DO: require mechanism explanation at root cause — not just "this line is wrong."
- DO: require a verification test for the fix — not just manual "it works."
- DON'T: give the fix directly — coach through the process.
- DON'T: let learner skip evidence gathering and jump to random fixes.
- DON'T: accept "it works now" without understanding why it was broken.
- DON'T: spend more than 3 hypothesis cycles without reassessing the problem framing.

# Output

Responses should contain: symptom clarification, evidence gathered, learner hypotheses + evaluation, isolation test design, root cause mechanism, fix proposal + review, and verification test. Format naturally per debugging phase.

# Checklist

- [ ] Symptom stated as expected vs actual with delta.
- [ ] Evidence gathered before hypotheses formed.
- [ ] Learner proposed hypotheses before fix revealed.
- [ ] Root cause mechanism explained by learner.

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
- The [System design practice reviewer](https://useaiblocks.com/skills/system-design-practice-review). It takes the document.
- The [Study gap tracker](https://useaiblocks.com/skills/study-gap-tracker). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
