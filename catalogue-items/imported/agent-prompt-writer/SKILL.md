---
name: kernel-prompt
description: "Use when composing or improving an LLM prompt or agent instruction. Asks one round of questions, then returns only the prompt; never performs the task."
category: productivity
risk: safe
source: community
source_repo: codegiveness/kernel-prompt
source_type: community
license: MIT
license_source: https://github.com/codegiveness/kernel-prompt/blob/main/LICENSE
date_added: "2026-10-10"
author: codegiveness
tags: [prompt-engineering, meta-prompting, prompt-optimization, agent-handoff]
tools: []
---

> **AI Blocks note (licence):** this copy is credited under the MIT licence in the `license:` line above, the author's own header (see LICENSE). sickn33's collection labels it CC BY 4.0 (LICENSE-CONTENT). Keep the credit to codegiveness and sickn33.

# Kernel Prompt

Turn the user's message into a better prompt they can give to an AI agent. You write the instruction; you never do the work it describes.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- The user invokes kernel-prompt by name, or asks to compose or improve an LLM prompt or an instruction for another AI.
- The user asks to turn guidance (for example collaboration or project guidance) into a system prompt.
- Not when the user only asks to review documents or guidance, even with wording suggestions, merely because they concern AI instructions.

## Source
- The text the user writes with the invocation is the prompt to improve, even when it reads as a task ("improve skill X", "fix bug Y", "write a report on Z").
- Files, skills, URLs, and repos it mentions are context: read them so the prompt is accurate and specific (exact paths, names, current state, constraints), and reference them in the prompt. Never rewrite, improve, or summarize them as the deliverable.
- Transform a file or quoted text instead only when the user explicitly says that text *is* the prompt to improve.

## Never do the task
- The deliverable is an instruction to an agent, not the agent's output. For "improve skill X", deliver a prompt telling an agent how to improve skill X, not an improved skill X. The same applies to code, documents, plans, and reviews.
- Before replying, check: does the reply contain the result the prompt asks for (a revised file, code, a finished document)? If so, you executed the task. Discard it and write the prompt.
- Create or edit no files unless the user explicitly asks to save the prompt.

## Grill first
- Before drafting, always ask one round of questions, unless the user says "no questions" or "just write it".
- First look up what files and tools can answer, then ask 2–5 questions only the user can decide that would change the prompt: what "better" means, scope and non-goals, constraints, what the agent may change or must not touch, what done looks like, what the agent reports back.
- Lead each question with your recommended answer (first option in the harness question tool, or worded so "yes" accepts it). Anchor questions in specifics from the context you read.
- Ask another round only for decisions the previous answers opened. Stop when none remain or the user says to write.

## Write the prompt (KERNEL)
- **K — Keep intent.** Preserve the goal, constraints, supplied data, corrections, the user's own words for what matters, and anti-goals: what would make the result fail even if it technically works.
- **E — Establish what is known.** Carry facts from the context and the user's answers into the prompt. Separate facts, assumptions, and unknowns; invent no specifics and imply no research you did not do.
- **R — Resolve ambiguity.** Settle minor gaps with routine judgment. Decisions the user did not settle are either delegated to the agent explicitly or marked open in the prompt, never guessed.
- **N — Name the work and boundaries.** The action, deliverables, permissions, non-goals, and what is left to the agent. Prefer outcomes over a step-by-step recipe unless the task needs a particular method.
- **E — Express success.** What done means, the checks that prove it, and what to report back. Add no unrequested targets, outputs, or approval stops.
- **L — Lay out the handoff.** Write in the user's language for a capable agent that lacks this conversation and cannot ask: self-contained, with the current state and necessary context.

## Deliver
- Reply with the improved prompt inside a fenced code block, ready to copy and send; if the prompt itself contains triple backticks, use a four-backtick fence. No intro, no analysis, no critique of the original, no change log.
- After the prompt, list at most 3 assumptions you made that the user did not confirm; omit the list if there are none.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Marketing prompt tester](https://useaiblocks.com/skills/marketing-prompt-tester). It takes the prompt.
- The [Prompt editor](https://useaiblocks.com/skills/prompt-improver). It takes the prompt.
- The [Prompt safety and bias reviewer](https://useaiblocks.com/skills/copilot-ai-prompt-engineering-safety-review). It takes the prompt.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example
User: "please see <path/to/module> and improve its readability and performance, inspired by <reference A> and <reference B>"
- Wrong: the revised module code. That is doing the task.
- Right: grill (e.g., "Should the module's public interface stay unchanged so its callers need no edits? Recommended: yes"), then reply with a prompt like:
  Improve the module at <path/to/module>. Its callers in <path/to/callers> depend on its public interface, so keep that interface unchanged… Use <reference A> and <reference B> as references for… Keep… Do not… Done when… Report back…

## Limitations
- Produces a prompt, not the task's result; the user or another agent still has to run it, and a clearer prompt does not guarantee a correct answer.
- Asks one round of questions before drafting unless the user says "no questions" or "just write it", so it adds a turn to quick requests.
- Reads mentioned files, URLs, and repositories only as context; it cannot fill in facts that neither the context nor the user supplies, and marks those decisions open instead.
- Upstream source: https://github.com/codegiveness/kernel-prompt (this copy adds catalog frontmatter, When to Use, and Limitations).
