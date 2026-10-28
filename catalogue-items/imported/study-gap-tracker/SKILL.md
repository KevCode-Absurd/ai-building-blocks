---
name: weak-area-tracker
description: Use when logging, scoring, and triaging a learner's persistent weak areas to drive intervention selection.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [memory, weak-areas, intervention, personalization]
status: stable
---

# Purpose

Maintain a prioritized, evidence-based log of topics where the learner consistently struggles. Drives which skills to activate next and prevents ignoring recurring problems in favor of always-new content.

> The skills named below (`check-understanding`, `challenge-generator`, `misconception-detector`, `lesson-plan`, `revision-mode`, `teach-concept`, `socratic-mode`) are optional skills from the original collection. They are not in this catalogue. If you do not have one, ask your AI in plain words for the same thing: practice questions, a re-explanation, or a set of "why" questions.

# Activation

- `check-understanding`, `challenge-generator`, or `misconception-detector` flags a repeated error. Returning learner with prior weak areas. Planning a study/revision session. Learner reports a covered topic is still unclear.
- **Skip if**: first encounter with a topic (not a weak area yet). Error is a one-time slip. Learner declines tracking.
- **Routing**: feed into `lesson-plan` and `revision-mode`. Use tracker to decide between `challenge-generator` (reinforce) vs `teach-concept` (re-teach) vs `socratic-mode` (deepen). Mark confirmed improvements and remove from active tracking.

# Inputs

- Error event (topic, type, session date, recurrence count), prior weak-area log, learner's current goals.

# Severity Scoring

Score each weak area 1–5: `score = min(5, recurrence × type_weight + staleness_bonus)` (cap the score at 5, so a Deep error that repeats 3 times still scores 5)
- Type weights: Surface=1, Structural=2, Deep=3
- Staleness: +1 if not addressed in 3+ sessions

Intervention selection: Score 1–2 → more practice questions (`challenge-generator`). Score 3–4 → re-teach the topic (`teach-concept`). Score 5 → question the learner on why, then look for a wrong idea behind the error (`socratic-mode`, then `misconception-detector`). Without those skills, ask for the same thing in plain words.

# Workflow

1. **Ingest** — New error: add to log (recurrence=1) or increment existing entry + update `last_seen`.
2. **Score** — Compute severity from recurrence, type and staleness only, using the formula above. Self-reported confidence is noted but does not change the score.
3. **Triage** — Rank by score. Surface top 2 for current session. Max 2 weak areas per session.
4. **Select Intervention** — Match score to appropriate skill (see above).
5. **Confirm Improvement** — After intervention, spot-check via `check-understanding` or `challenge-generator`. 2 consecutive clean passes → "resolving." 3 consecutive → "resolved" and archived. Regression after resolution → re-open.
6. **Maintain** — Cap active list at 5. Archive resolved items. Warn if topic persists 5+ sessions without resolution.

# Rules

- DO: ground weak areas in observed evidence, not assumptions.
- DO: update scores after every session where the topic appears.
- DO: change intervention strategy after 2 failed attempts with the same approach.
- DO: require 2+ consecutive clean passes for resolution.
- DO: frame output as "what we'll work on" not "what you're bad at."
- DON'T: accumulate unbounded — cap at 5 active items.
- DON'T: mark resolved after one good session — require consecutive passes.
- DON'T: repeat the same intervention 3+ times without changing approach.

# Output

Responses should contain: event details (topic + error type + source skill), action taken (added/incremented), severity score, active weak areas table (topic, type, recurrence, score, recommended intervention), session recommendation (top 1–2 focus areas), and resolution updates if applicable. Format naturally.

# Checklist

- [ ] Active list capped at 5 items.
- [ ] Severity scores computed using recurrence + type + staleness.
- [ ] Intervention matches severity score.
- [ ] Resolution requires 2+ consecutive clean passes.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Study understanding checker](https://useaiblocks.com/skills/study-understanding-check).
- The [Study revision coach](https://useaiblocks.com/skills/study-revision-coach).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
