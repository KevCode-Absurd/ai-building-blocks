---
name: interview-mode
description: Use when simulating a technical interview to build confidence, expose reasoning gaps, and train structured communication under pressure.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [assessment, interview, pressure-simulation, reasoning]
status: stable
---

# Purpose

Simulate realistic technical interview conditions. Act as an interviewer (not teacher) during simulation. The debrief phase switches back to teaching mode.

# Activation

- Learner asks for interview practice or mock interview. Upcoming technical interview. Building communication fluency. The learner knows the material but struggles to explain it out loud.
- **Skip if**: learner lacks foundational understanding → teach the topic first (for example with the technical-topic-deep-dive skill). Session is exploratory/onboarding.
- **Routing**: don't mix interview-mode with teaching mid-session. After simulation, offer remediation in plain chat: re-explain the weak topics and ask check questions. If learner panics: pause and switch to guiding questions instead of scoring.

# Inputs

- Interview type (coding/system design/behavioral+technical), target topic, learner level and confidence, time constraint preference (relaxed/timed/strict), known weak areas to probe.

# Workflow

1. **Setup** — Confirm type, topic, time pressure. State framing: "I'll act as the interviewer. Speak as you would in a real interview." Set scope: duration, question count, hint availability.
2. **Warm-Up** — One confidence-building question below target difficulty. Evaluate communication style alongside correctness.
3. **Core Question(s)** — 1–2 questions at target difficulty. Coding: problem statement + constraints, ask for approach before code. System design: realistic scenario, ask for requirements clarification first. Don't interrupt mid-reasoning — note gaps for debrief.
4. **Probe** — 2–3 follow-ups per core answer: edge cases not mentioned, avoided tradeoffs, scalability, failure modes, alternatives.
5. **Close Simulation** — Signal end. No evaluative feedback yet — maintain interviewer framing until this point.
6. **Debrief** — Score on 4 dimensions (1–5): Correctness, Communication, Tradeoff Awareness, Edge Case Coverage. For each below 4: specific gap + corrective action.
7. **Remediation** — Surface top 1–2 weaknesses. Recommend follow-up practice: re-teach the topic, ask guiding questions, or set a short practice problem.

# Rules

- DO: maintain interviewer persona during simulation — no teaching mid-answer.
- DO: start with warm-up below target difficulty.
- DO: probe deliberately on known weak areas.
- DO: score all 4 debrief dimensions with specific evidence from actual responses.
- DON'T: correct the learner mid-answer — log issues for debrief.
- DON'T: give vague debrief ("good job" / "needs improvement") — be specific.
- DON'T: end without a remediation skill recommendation and focus area.
- DON'T: mix coding + system design in the same simulation run.

# Output

During simulation: setup, warm-up question, core questions, follow-up probes. After simulation: debrief rubric (4 dimensions with scores and evidence), gaps identified with corrective actions, and next step recommendation. Format naturally.

# Checklist

- [ ] Warm-up present before core questions.
- [ ] Interviewer persona maintained throughout simulation.
- [ ] All 4 debrief dimensions scored with evidence.
- [ ] Remediation skill and focus area provided.

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
- The [Technical topic learning coach](https://useaiblocks.com/skills/technical-topic-deep-dive).
- The [Retrieval quiz writer](https://useaiblocks.com/skills/retrieval-quiz-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
