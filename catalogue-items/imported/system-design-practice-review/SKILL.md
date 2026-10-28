---
name: architecture-review
description: Use when critiquing a system design across correctness, scalability, reliability, maintainability, and observability using probe-first questioning.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [projects, architecture, design-critique, tradeoffs]
status: stable
---

# Purpose

Evaluate a system design through structured probing that surfaces the learner's reasoning before prescribing corrections. Review across five dimensions: correctness, scalability, reliability, maintainability, observability.

# Activation

- Learner proposes a design or architecture. `build-with-me` reaches architecture phase. Learner asks "is this design good?" Interview prep on system design. Pre-deployment review.
- **Skip if**: no design exists yet → use `teach-concept` or `build-with-me` to help create one. Design is a simple script with no architectural decisions.
- **Routing**: if foundational concept gap blocks review → pause and route to `teach-concept` first. After review, hand off to `build-with-me` for implementation or `challenge-generator` for design alternatives.

# Inputs

- Design proposal (diagram, description, or code), system constraints (scale, latency, team), learner level and goals.

# Review Dimensions

- **Correctness**: does it solve the stated problem? Data integrity? Security?
- **Scalability**: bottlenecks at 10×, 100× current load?
- **Reliability**: single points of failure? Failure recovery? Data loss risk?
- **Maintainability**: complexity growth? Team onboarding? Testing surface?
- **Observability**: monitoring, alerting, debugging at runtime?

# Workflow

1. **Strengths** — Identify and state 2–3 things the design does well. Never start with criticism.
2. **Probe** — 2–3 targeted questions exposing untested assumptions. Focus on the dimension where the design is weakest. Require learner reasoning before revealing issues.
3. **Issues** — After learner responds: list issues priority-ordered by severity (Critical → Major → Minor). Each issue: dimension, description, severity.
4. **Alternatives** — For each Critical/Major issue: propose 2 options with tradeoffs. Ask learner to choose with rationale.
5. **Revision** — Summarize the agreed changes. Provide a short checklist of concrete next steps.

# Rules

- DO: probe before prescribing — require learner reasoning first.
- DO: strengths first — never open with criticism.
- DO: alternatives with tradeoffs, not single "correct" answers.
- DO: pause review and route to `teach-concept` if a foundational concept gap blocks understanding.
- DON'T: rewrite the design for the learner — coach them to revise it.
- DON'T: skip Critical issues to keep the session positive.
- DON'T: grade every dimension equally — focus on the weakest 2–3.
- DON'T: continue review when a fundamental security or correctness flaw needs conceptual teaching first.

# Output

Responses should contain: design summary, strengths (2–3), probe questions, issues (priority-ordered with dimension + severity), alternatives with tradeoffs, learner choice prompt, and revision checklist. Format naturally.

# Checklist

- [ ] Strengths stated before any criticism.
- [ ] Probe questions asked before issues revealed.
- [ ] Issues priority-ordered with severity.
- [ ] Alternatives provided for Critical/Major issues with tradeoffs.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Study practice progress reviewer](https://useaiblocks.com/skills/study-plan-progress-review-assistant). It takes the notes.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
