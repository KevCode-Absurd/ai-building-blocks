---
name: support-qa-scorecard
description: Builds a support quality scorecard with weighted lines, critical lines and pass and fail examples, picks a fair sample of tickets, grades them with the quoted line that earned or lost each point, writes kind and specific coaching notes per agent, runs reviewer calibration, and reports quality trends that separate personal habits from template, policy or training gaps. Works in Zendesk QA or a spreadsheet. Use it when quality feels uneven, new staff go live, reviewers disagree, or the owner wants to know where replies go wrong. Reviews are for coaching only, never pay or discipline decisions.
---

# Support QA scorecard

## When to use

- Replies vary a lot between agents, or customers complain about wrong answers.
- A team starts quality reviews for the first time.
- Two reviewers score the same ticket very differently.
- New starters are about to go live and need a fair check.
- The owner wants to know whether problems come from people, templates or policy.

Not for: grading bot answers (use the `chatbot-test-and-review` skill in the `chatbot-specialist` kit), listening to call audio without a transcript, or decisions on pay, discipline or dismissal.

## Access needed

- **Level 1 (read):** closed tickets, current scorecard, QA results, macros and policies.
- **Level 2 (read and draft):** build the scorecard unpublished, set up the calibration set, draft coaching notes.
- **Level 3 (read, write and publish):** publish the agreed scorecard and assign review samples to reviewers. Sharing scores beyond the agreed people needs a fresh yes.

## What you need

1. The policies, macros and tone guide agents are meant to follow.
2. What good service means to the owner, in their words.
3. A ticket export or 30 to 60 closed tickets across agents, channels and outcomes, with customer details removed.
4. CSAT and reopen data for the same tickets, if available.
5. Who will review, and how many reviews a month they can do.

## Steps

### 1. Agree the goal

Coaching, onboarding sign-off, or finding gaps. Write it at the top. Say plainly that scores are for coaching and that pay or discipline decisions stay with the client.

### 2. Draft the scorecard lines

A short list, usually five to eight:
- **Solved the issue** (or set a clear next step if it could not be solved).
- **Correct facts and policy**: every promise, date and amount matches the policy.
- **Followed process**: tags, priority, escalation, notes.
- **Clarity**: answer first, plain words, no jargon.
- **Tone**: fits the customer's state of mind and the brand voice.
- **Next step and timing**: the customer knows what happens and when.
- **Effort**: did not ask for information already in the thread.

Mark critical lines, such as wrong policy or a security slip. In Zendesk QA, a critical category rated below 50% fails the whole review or its group, and weights run from 0 to 100 (see `knowledge.md`, section 3).

### 3. Write the scoring guide

For each line, one pass example and one fail example taken from the client's own tickets, rewritten to remove names. Choose a scale: binary is fastest; a 4-point scale has no neutral middle. Add N/A for lines that do not apply.

### 4. Calibrate before grading

Pick five tickets. Each reviewer grades them alone. Compare line by line, agree the score and the reason, and add the reasoning to the guide. Repeat monthly with new tickets.

### 5. Pick a fair sample

Spread across agents, channels, reasons and outcomes, including good days: some high-CSAT tickets, some reopened ones, some escalated ones. If AutoQA is on, use its scores to find tickets worth a human look; it only scores solved tickets with enough customer and agent text (see `knowledge.md`, section 3).

### 6. Grade

For each ticket, each line: the score, the exact quoted line that earned or lost the point, and where it helps, a better line. Grade the reply, not the person.

### 7. Group the misses

By agent and by topic. Then sort each miss into: personal habit, template gap (the macro is wrong or missing), policy gap (the policy is unclear), or training gap (several agents miss the same thing). Template and policy gaps go to the owner, not into one agent's notes.

### 8. Write coaching notes

Per agent: two strengths, two habits to fix, each with a quoted example and a better line. Kind, specific, no ranking against colleagues.

### 9. Report trends

Monthly: average by line, by channel and by topic; the three most common misses; and three fixes (training, template, policy). Mark small samples as small.

### 10. Research (both modes)

With web search connected, check the QA tool's current features and plan before setting it up. Without it, build the scorecard in a spreadsheet that can move into any tool.

## Checks

- Every line has a pass and a fail example.
- Critical lines are few and clearly about serious risk.
- Reviewers calibrated on the same tickets before grading.
- Every score quotes the line that earned or lost it.
- The sample includes good days, not only complaints.
- Template, policy and training gaps are separated from personal habits.
- Coaching notes are kind and specific; nothing suggests pay or discipline.
- No customer is identifiable in quotes.

## Output format

1. Goal and how scores will be used.
2. Scorecard: line, weight, critical (yes or no), pass example, fail example.
3. Calibration set: five tickets with agreed scores and reasons.
4. Graded sample: ticket, line scores, quoted evidence, better line.
5. Coaching note per agent.
6. Trends report with three fixes.

## Example of good output (short)

*Made-up business for illustration: Larder Box, a meal kit company with a six-person support team.*

> **Line: Correct facts and policy (weight 25, critical)**
> Pass: "You can skip next week's box until Thursday 11:59pm, and you won't be charged." (matches the skip policy)
> Fail: "No problem, I've skipped it." (sent on Friday, after the cut-off; the box still shipped and was charged)
>
> **Coaching note, agent B**
> Strengths: you answer the main question in the first line ("Your refund for the missing salmon is on its way") and you never ask for the order number twice.
> Habit to fix: promising times we can't control. "It'll be with you tomorrow" on ticket 4 became a second complaint. Try: "The courier's estimate is tomorrow; if it's not there by 6pm, reply and I'll chase it."
> Gap for the owner, not agent B: the "late delivery" macro has the old cut-off time. Three agents copied it this month.
