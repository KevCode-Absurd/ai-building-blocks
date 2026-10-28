---
name: spaced-repetition
description: Use when scheduling and executing review sessions at expanding intervals (a simplified version of the SM-2 method) for long-term retention.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [productivity, spaced-repetition, retention, scheduling]
status: stable
---

# Purpose

Schedule review of previously-learned concepts at expanding intervals to exploit the spacing effect. Manages due dates, adjusts intervals based on recall quality, and surfaces overdue items before they decay.

> Keep the cards and dates in the chat. No other skills are needed. If a card fails three sessions in a row, re-explain that topic in the chat, then restart the card at 1 day.

# Activation

- Review session is due based on schedule. Learner initiates review. Pasted cards have due items. Sustained learning track (3+ sessions) needing interval maintenance.
- **Skip if**: one-shot session with no continuity. Concept not yet learned. Learner declines scheduling.
- **Routing**: overdue items take priority at session start. Show the updated intervals at the end so the learner can paste them back next time.

# Inputs

- Pasted card list with due dates, last interval in days and last recall score.

# Interval Algorithm (Simplified SM2)

Each item has an **interval** (days) and **ease factor** (EF, 1.3–2.5). Initial: 1 day → 3 days → then formula.

| Score | Label | Interval Rule | EF Change |
|---|---|---|---|
| 0 | Failed | Reset to 1 day | EF -= 0.2 (min 1.3) |
| 1 | Hard | Stay at current | EF -= 0.1 |
| 2 | Good | Interval × EF | No change |
| 3 | Easy | Interval × EF × 1.3 | EF += 0.1 (max 2.5) |

Mastery threshold: EF > 2.4, interval > 60 days, 5 consecutive successes → archive.

# Workflow

1. **Detect Due Items** — Check `next_review ≤ today`. Sort by overdue duration (most overdue first). Report count.
2. **Scope Session** — ≤10 due: review all. >10: prioritize by overdue + weak-area overlap, cap at 15. Report deferrals.
3. **Execute Review** — Present front, wait for learner response, reveal back. Self-score: Failed/Hard/Good/Easy. Compute new interval immediately. Never reveal answer before attempt.
4. **Handle Failures** — Score 0: reset to 1 day, re-test at end of current session. Failed 3 sessions in a row: tell the learner, re-explain the topic in the chat, then restart the card at 1 day.
5. **Update Schedule** — Output updated schedule. Show items due in next 7 days. Warn about upcoming review spikes.
6. **Onboard New Items** — Fresh concept → add at interval=1 day. Confirm concept is understood first (not still unclear).

# Rules

- DO: never reveal the answer before learner attempts.
- DO: coach learners on what "Good" vs "Easy" means for self-scoring calibration.
- DO: stagger new item additions to prevent review spikes.
- DO: archive mastered items (meet threshold) — don't review indefinitely.
- DON'T: review items that aren't due — respect the schedule.
- DON'T: let sessions exceed 15 items — defer the rest.
- DON'T: add items to schedule before they're genuinely understood.
- DON'T: frame review sessions as tests — it's memory maintenance.

# Output

Session start: due count + overdue count + estimated time. Per-item: topic, question, learner response, answer, score, next review date. Session close: score distribution (easy/good/hard/failed), failed items list, next 7-day schedule. Format naturally.

# Checklist

- [ ] Overdue items prioritized first.
- [ ] Session capped at 15 items.
- [ ] Answer not revealed before learner attempt.
- [ ] Failed items re-tested within same session.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Study gap tracker](https://useaiblocks.com/skills/study-gap-tracker). It takes the document.
- The [Study session planner and reviewer](https://useaiblocks.com/skills/study-session-planner-and-review). It takes the plan.
- The [Study recall tutor](https://useaiblocks.com/skills/recall-first-study-tutor). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
