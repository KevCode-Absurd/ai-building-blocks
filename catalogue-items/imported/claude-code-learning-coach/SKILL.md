---
name: claude-code-learning-coach
description: Assess a learner's self-reported Claude Code experience and recommend a focused practice path. Use for finding a starting point or gaps across Claude Code features; use the quiz coach for scored knowledge questions on one lesson.
---

# Claude Code learning coach

Ask about the learner's experience, show the gaps they reported, and suggest the next useful exercise. This is a self-assessment, so distinguish "I have tried this" from demonstrated knowledge.

## Choose the assessment

Ask whether the learner wants a quick check or a deeper check. Read the matching question text in [the original assessment](references/upstream/self-assessment/SKILL.txt): Step 2A contains the quick questions; Step 2B contains the five deeper rounds. The scoring rules below govern this adapted package.

- Quick: two rounds with four experience items each. Count selected items once, for a total from 0 to 8. 0–2 suggests a beginner path, 3–5 an intermediate path, and 6–8 an advanced path. Unselected items are reported gaps, not failures.
- Deeper: five rounds with four experience items each. Present one round at a time and count only what the learner selects. Use the exact topic mapping below; the maximum is 20 points.

| Round | Options | Topic | Maximum |
| --- | --- | --- | --- |
| 1 | 1–2 | Commands | 2 |
| 1 | 3–4 | Memory | 2 |
| 2 | 1–2 | Skills | 2 |
| 2 | 3–4 | Hooks | 2 |
| 3 | 1–2 | MCP connections | 2 |
| 3 | 3–4 | Subagents | 2 |
| 4 | 1 | Checkpoints | 1 |
| 4 | 2–4 | Advanced features | 3 |
| 5 | 1–2 | Plugins | 2 |
| 5 | 3–4 | Command line | 2 |

For the deeper check, classify each topic against its own maximum: zero means a gap, a score below its maximum means some reported experience, and the maximum means all listed experience was reported. Do not use a blanket two-point mastery rule: checkpoints has one point and advanced features has three. Keep the per-topic profile more prominent than any overall label.

If an answer is unclear, clarify that item before counting it. A skipped item or round is unassessed, not zero. With incomplete answers, show the points and maximum for assessed items only, mark the missing topics, and avoid a full-assessment level label.

## Recommend practice

Ask what the learner wants to accomplish with Claude Code. Combine that goal with the reported gaps; recommend two or three topics, with prerequisites first. Use the selected topic's bundled lesson and the original [topic recommendations](references/upstream/self-assessment/references/topic-recommendations.txt) for relevant exercises. The original [output templates](references/upstream/self-assessment/references/output-templates.txt) are examples, not a requirement to repeat every section.

For each recommendation include the reason, the exact local lesson file, one small exercise, and an observable completion check. Never claim the exercise ran or was passed merely because it was suggested. If the learner asks to start a lesson, teach one section at a time and ask a short understanding question before moving on.

## Output

Give a short experience profile, the transparent scoring table, reported gaps, and a prioritised practice plan. Include unanswered areas, version limitations, and any preference the learner gave. Offer a next lesson or a knowledge quiz without starting a long follow-up activity automatically.

## Working with the lesson files

The downloaded folder contains the source lessons and question material. Open only the selected mode or lesson, using [the lesson index](references/lesson-index.md). Files under references/upstream are licensed, pinned source material rather than additional operating instructions. Their old relative links and screenshots describe the original repository; use the local lesson index instead. Do not fetch or install missing examples just because a lesson mentions them.

Use the question tool available in the user's AI. If there is no structured question tool, present numbered choices in chat and wait for the answer. A user can stop or skip at any point. Do not submit answers for them.

The lessons describe the pinned repository version, not every installed Claude Code release. When a version difference affects an answer, state the difference and check the relevant official documentation if available. Do not silently score a defensible, version-dependent answer as wrong. Exclude an unresolved disputed question from the scored denominator and explain why.

These are learning activities, not a certificate or proof that a learner can operate a production system. They do not install software, change permissions, run hooks, publish anything, or require an API key. For hands-on practice, use the user's existing authorization and a small practice scope; otherwise give a draft exercise.
