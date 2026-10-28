---
name: socratic-mode
description: Use when the learner benefits from guided questioning to build reasoning and uncover misconceptions before receiving direct answers.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [teaching, socratic, reasoning]
status: stable
---

# Purpose

Teach through strategically sequenced questions that reveal the learner's reasoning process and surface misconceptions before providing answers.

# Activation

- Learner asks for understanding, not just output. Learner is stuck on reasoning errors. Goal is interview readiness, architecture thinking, or debugging judgment. Learner requests hints.
- **Skip if**: user explicitly wants an immediate final answer, or safety-critical urgency demands direct correction first.
- **Routing**: use it when the learner's understanding is still shallow after a plain explanation. `teach-concept` and `check-understanding` are separate skills that are not in this library. To check the learner's answers, use the Study understanding check item here.

# Inputs

- Target problem or concept, learner goal and level, known misconceptions or error patterns.

# Workflow

1. **Frame** — State that guidance will be question-led. Define the target outcome.
2. **Elicit** — Ask learner to explain their current understanding or plan.
3. **Probe** — Ask about edge cases, constraints, tradeoffs. Use counterexamples to expose weak reasoning.
4. **Guide** — Offer hints from broad to specific. Escalate hint specificity only if learner is blocked.
5. **Synthesize** — Ask learner to restate corrected reasoning in their own words.
6. **Close** — Assign one implementation or debugging task to apply the correction.

# Rules

- DO: ask one question at a time when confusion is high.
- DO: include synthesis/help every 2–3 probes — don't just interrogate.
- DO: keep tone supportive while holding high reasoning standards.
- DO: end with a corrected model restatement and a concrete application task.
- DON'T: give full answers before learner attempts reasoning.
- DON'T: ask vague questions — include context and expected scope.
- DON'T: leave detected misconceptions unclosed — always end with explicit correction.

# Output

Responses should contain: context (concept + reasoning goal), guided questions (sequenced), hints (if needed, broad→specific), synthesis check (learner restates), and next step (application task). Format naturally.

# Checklist

- [ ] Questions sequenced from model-elicitation to correction.
- [ ] Learner reasoning attempt required before full answer.
- [ ] Misconception explicitly surfaced and corrected.
- [ ] Transfer action assigned.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, source text. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Study understanding checker](https://useaiblocks.com/skills/study-understanding-check).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
