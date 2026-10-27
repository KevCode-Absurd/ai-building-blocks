---
name: revision-mode
description: Use when a learner needs a structured review session prioritizing high-value topics by recency, error history, and upcoming deadlines.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [productivity, revision, exam-prep, retention]
status: stable
---

# Purpose

Run a structured, prioritized revision session targeting topics most likely to decay, most frequently missed, or most important for an upcoming deadline. Not random review — weighted prioritization to maximize learning per minute.

# Activation

- Upcoming deadline (interview, exam, demo) within 1–5 sessions. Learner requests review after a learning period. The learner has weak areas from earlier sessions to paste in (or says so). 3+ sessions since last review.
- **Skip if**: learner needs new material first. Goal is project implementation → work through the project step by step instead. Only one topic to review → ask a few direct check questions on it.
- **Routing**: in a plain chat, ask the learner to paste last session's weak areas and session summary. Write your own short check questions and practice exercises. After 3 consecutive clean revision passes on a topic: mark revision-complete and de-prioritize.

# Inputs

- Topics covered (asked for in chat, or pasted from last session's summary), active weak areas, upcoming deadline + type, session time budget, self-assessed confidence per topic (optional).

# Priority Scoring (1–10)

- Weak area severity: 0–3 (0 = no repeated mistakes, 1 = one mistake, 2 = repeated, 3 = repeated and unfixed). Recency (days since last review): 0–3 (0 = under 3 days, 1 = 3 to 7, 2 = 8 to 14, 3 = over 14). Deadline relevance: 0–2 (0 = not needed, 1 = likely, 2 = certain). Low self-reported confidence: 0–2 (0 = sure, 1 = mixed, 2 = lost). Ask the learner for these ratings if they are not given.
- Score 7+ = must-revise. Score 4–6 = should-revise. Below 4 = defer.

# Workflow

1. **Scope** — Gather topics + weak areas. Ask: "Deadline? Least confident topics?" Apply priority scoring.
2. **Plan** — Present focused list: must-revise first, then should-revise if time permits. Cap at 4–5 topics max. State approach per topic: concept check / challenge / flashcard drill.
3. **Recap** — For each topic: ask learner to summarize in 2–3 sentences. Don't re-explain unless summary reveals a gap. 2–3 min cap per recap.
4. **Test** — 1–2 exercises per topic by writing short check questions or practice exercises. Mix modes. Run 3–5 due flashcards per topic if available.
5. **Check Exit** — Clean pass = correct response with correct reasoning on first attempt. After 3 clean passes across sessions: exit rotation. Below 50% pass rate this session: stop testing, find the wrong idea behind the errors, and re-teach that part.
6. **Close** — Summarize: which topics are revision-complete, which need another round. Give the learner an updated weak-areas list to save for next time. Recommend next session if deadline still approaching.

# Rules

- DO: revision is active — learner produces answers, not just reads.
- DO: include weak areas in every revision session until resolved.
- DO: state clean-pass criteria before the session, not after.
- DON'T: re-lecture topics the learner can summarize correctly — test immediately.
- DON'T: pack more than 5 topics per session.
- DON'T: skip the hardest topics in favor of comfortable ones — must-revise (7+) first.
- DON'T: let same topics appear indefinitely — enforce exit criteria.

# Output

Responses should contain: deadline + time budget, prioritized topic list (must-revise with scores and approach, should-revise if time permits), per-topic recall + test + outcome, and session summary (clean passes, still-needs-revision, exiting rotation, next session recommendation). Format naturally.

# Checklist

- [ ] Priority scoring applied before session plan.
- [ ] Must-revise topics addressed first.
- [ ] Every topic has at least one active retrieval exercise.
- [ ] Updated weak-areas list handed back at session close.
