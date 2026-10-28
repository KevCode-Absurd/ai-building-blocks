---
name: learn
description: Help a user learn a topic through adaptive tutoring, lesson planning, practice, retrieval checks, explanations, study guides, or exercises. Use when the user asks to learn, understand, practice, drill, review, study, or be tutored on something.
category: "education"
risk: "safe"
source: "official"
source_repo: "dair-ai/dair-academy-plugins"
source_type: "official"
date_added: "2026-06-19"
author: "DAIR.AI"
license: "MIT"
license_source: "https://github.com/dair-ai/dair-academy-plugins/blob/main/README.md#license"
tags:
  - dair-academy
  - ai
  - workflow
tools:
  - claude-code
  - codex-cli
  - cursor
---

> **AI Blocks note (licence):** this copy is credited under the MIT licence in the `license:` line above, the author's own header (see LICENSE). sickn33's collection labels it CC BY 4.0 (LICENSE-CONTENT). Keep the credit to DAIR.AI and sickn33.

> **AI Blocks note (for the person using this):** tell your AI the topic, your goal, your deadline and how much time you have. It starts with a short level check, then teaches in small steps with a question after each one. The rest of this file is written for your AI.

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

## When to Use

Use when this workflow matches the user request: Help a user learn a topic through adaptive tutoring, lesson planning, practice, retrieval checks, explanations, study guides, or exercises. Use when the user asks to learn, understand, practice, drill, review, study, or be tutored on something.


_Source: [dair-ai/dair-academy-plugins](https://github.com/dair-ai/dair-academy-plugins) (MIT)._

Use this skill when the user wants to learn a topic or improve a skill. The output should fit the user's request and the host agent's environment. Do not assume a specific product, delivery format, persistence mechanism, or runtime unless the user asks for one.

## Core Workflow

1. Diagnose the learner's current level and goal.
2. Choose a small next learning objective.
3. Teach with concrete examples before abstractions.
4. Give the learner an active task, question, or exercise.
5. Provide immediate feedback and correction.
6. Record or summarize the next recommended step when useful.

For very small questions, answer directly and include one quick check for understanding. For larger learning requests, create a short learning path and start with the first lesson.

## Diagnostic

Before building a full plan, infer what you can from the user's prompt. Ask at most 1 to 3 short questions only when the missing information would materially change the lesson.

Useful diagnostic dimensions:

- Current familiarity
- Goal or use case
- Preferred depth
- Time available
- Format preference, if the user has one

If the user wants to begin immediately, make a reasonable assumption and state it briefly.

When the user gives a short time window, do not ask broad diagnostic questions unless essential. State one reasonable assumption and begin with the highest-leverage objective.

## Learning Design

Keep the learner in the right difficulty band:

- Beginners need simple vocabulary, worked examples, and frequent checks.
- Intermediate learners need comparison, practice, and common failure modes.
- Advanced learners need compression, edge cases, tradeoffs, and realistic tasks.

Teach one useful concept at a time. Avoid covering a whole subject in one pass unless the user explicitly asks for a survey.

Use active learning:

- Retrieval questions
- Prediction prompts
- Worked examples followed by a similar problem
- Debugging or critique tasks
- Short applied exercises
- Spaced review of earlier ideas

Make feedback specific. Explain why the right answer is right and why tempting wrong answers fail.

## Output Formats

Choose the lightest format that satisfies the request:

- Conversational lesson for quick tutoring
- Study plan for multi-session learning
- Markdown notes for durable reference
- Exercises or quizzes for practice
- Code examples for programming topics
- Diagrams or tables when they clarify relationships
- Files, notebooks, slides, or web pages only when requested or clearly useful

Do not force every learning task into an app, web page, persistent hub, or local file set.

For multi-day plans, include cadence, daily focus, active practice, and review checkpoints. If daily time is unknown and materially changes the plan, ask one question or state an assumed daily commitment.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Overloaded lesson checker](https://useaiblocks.com/skills/overloaded-lesson-checker). It takes the lesson plan and plan.
- The [Assignment AI-use rules planner](https://useaiblocks.com/skills/assignment-ai-boundaries). It takes the lesson plan and plan.
- The [Practice problem set writer](https://useaiblocks.com/skills/practice-problem-set-writer). It takes the lesson plan and plan.
- The [Checklist review planner](https://useaiblocks.com/skills/checklist-upkeep-planner). It takes the plan.
- The [AI claim fact-check lesson builder](https://useaiblocks.com/skills/ai-fact-check-lesson). It takes the lesson plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Lesson Structure

A strong lesson usually includes:

- A short objective
- A concrete example or scenario
- The principle behind the example
- A guided practice step
- A knowledge check
- Feedback or answer key
- A next step

Keep explanations concise. Prefer plain language over jargon, then introduce precise terms after the learner has a handle on the idea.

## Practice And Assessment

Every substantial lesson should include at least one way for the learner to test themselves.

For explicit practice requests, lead with a task before a long explanation, then provide targeted feedback or an answer key.

Good checks include:

- Multiple-choice questions with unambiguous distractors
- Short answer prompts
- Fill-in-the-blank exercises
- Explain-the-mistake questions
- Code tracing or prediction
- Mini projects with clear success criteria

For multiple-choice questions, make only one answer clearly correct unless the question explicitly asks for multiple answers.

For programming topics, avoid pretending to execute arbitrary code unless the environment actually runs it. Use real tool execution when available, or provide fixed snippets with expected outputs and reasoning.

When interactive back-and-forth is available, ask the learner to attempt the exercise before revealing the answer. For self-contained responses, include the answer key after the task.

## Adaptation

Use the learner's answers and mistakes to adjust:

- Slow down and add examples when confusion appears.
- Increase difficulty when answers are consistently correct.
- Revisit misconceptions explicitly.
- Connect new material to the learner's stated goal.

When continuing from earlier work, preserve useful context from existing notes, files, chat history, or user-provided progress. Do not assume a specific persistence mechanism.

## Quality Bar

Before finishing, check that:

- The lesson matches the learner's level and goal.
- The explanation has a concrete example.
- The practice task is solvable from the lesson.
- The answer or feedback is included when appropriate.
- The next step is clear.
- Any generated files or code are actually usable in the target environment.

## Shape of the first reply

The first reply is short. It has three parts: the topic and goal in one line, one to three level-check questions, and a note that the first lesson follows once the learner answers. Ask for the goal, the deadline and the time available if they are missing. Keep each lesson to one idea, then one practice question the learner answers from memory.

## Limitations

- Requires the upstream tool, account, API key, or local setup when the workflow names one.
- Does not authorize destructive, production, paid, or external-message actions without explicit user approval.
- Validate generated artifacts or recommendations against the user's real sources before treating them as final.
