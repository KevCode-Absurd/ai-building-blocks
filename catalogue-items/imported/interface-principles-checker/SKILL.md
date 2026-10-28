---
name: uxui-principles
description: "Evaluate interfaces against 168 research-backed UX/UI principles, detect antipatterns, and inject UX context into AI coding sessions."
category: design
risk: safe
source: community
date_added: "2026-04-03"
author: uxuiprinciples
tags: [ux, ui, design, evaluation, principles, antipatterns, accessibility]
tools: [claude, cursor, windsurf]
---

# UX/UI Principles

A collection of 5 agent skills for evaluating interfaces against 168 research-backed UX/UI principles, detecting antipatterns, and injecting UX context into AI-assisted design and coding sessions.

**Source:** https://github.com/uxuiprinciples/agent-skills

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **An image** (yours): a finished picture.
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, an image, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** A chat AI that reads screenshots can review your screen without any code or files.
<!-- /needs -->

## Skills

| Skill | Purpose |
|-------|---------|
| `uxui-evaluator` | Evaluate interface descriptions against 168 research-backed principles |
| `interface-auditor` | Detect UX antipatterns using the uxuiprinciples smell taxonomy |
| `ai-interface-reviewer` | Audit AI-powered interfaces against 44 AI-era UX principles |
| `flow-checker` | Check user flows against decision, error, and feedback principles |
| `vibe-coding-advisor` | Inject UX context into vibe coding sessions before implementation |

## About this copy

This file is the overview of the collection. It does not contain the list of 168 principles or the five skill files. Those live in the source repository above.

- If the five skills are installed, use them and cite their principle names.
- If they are not, run the steps below using well-known, named UX principles from your own knowledge, such as Nielsen's usability heuristics, Hick's law, Fitts's law, Miller's law and Jakob's law. Say at the top of your answer that you used general principles and not the 168-principle list. Never invent a principle number, a study or a citation.

## When to Use
- Auditing an existing interface for UX issues
- Checking if a UI follows research-backed best practices
- Detecting antipatterns and UX smells in designs
- Reviewing AI-powered interfaces for trust, transparency, and safety
- Getting UX guidance before or during implementation

## When NOT to Use
- To learn what real users do. This is an expert-style review of what you describe, not a usability test with people. Suggest a small test with 5 users for anything important.
- To judge brand look, taste or the words on the screen. Say so and stop.
- To review code for bugs, speed or security.
- When you have nothing to look at yet. Ask for a description, screenshot, code or flow first.

## Inputs
Ask once, in one message, for anything not given:
- The interface: a description, screenshot, code or flow steps (required)
- Who uses it and what they are trying to do (required)
- The flow to check, from first screen to goal (optional)
- Whether it has AI features such as chat, suggestions or auto-written content (optional)

If the interface is missing, ask for it and stop. If something else is missing, write MISSING next to it and continue. Do not guess what a screen shows. Review only what you were given and name anything you could not see.

## Steps
1. Pick the mode or modes that fit: evaluate (all principles), antipatterns, AI interface, flow, or a pre-build UX brief. If the user does not say, run evaluate, and add the others when the input fits (a flow gets the flow check, AI features get the AI review).
2. State the interface and the user goal in two lines, so the user can correct your reading.
3. For each problem, name the principle it breaks, point to the exact screen, element or step, say what a user will do wrong, and give a fix. Skip principles that do not apply.
4. Rate each finding high (users fail or leave), medium (users slow down or doubt) or low (polish).
5. For antipatterns, list the common UX mistakes you can see, such as hidden primary actions, no feedback after a click, crowded forms or confirm-shaming text. Each one needs a place and a fix.
6. For a flow, check each step for the decision it asks of the user, the errors that can happen and the feedback given. Name the first step where users are likely to drop.
7. For AI features, check trust and safety: does it say it is AI, show what it used, show its limits, let the user correct or undo, and handle wrong answers.
8. For a pre-build UX brief, write 5 to 8 short rules the coding session should follow, taken from the findings.
9. End with the top 3 fixes in order, and what to test with real users.

## Output format
```
Reviewed: <interface, user, goal, mode used, principle source>
What works: <1 to 3 points>
Findings (high first)
| # | Principle | Where | What users will do | Severity | Fix |
Antipatterns (if asked or seen)
| Pattern | Where | Fix |
Flow problems (if a flow was given)
| Step | Problem (decision, error or feedback) | Fix |
AI interface checks (if AI features)
| Check | Pass, partly or fail | Fix |
UX brief (pre-build mode only)
- <rule>
Fix first: 1. <fix> 2. <fix> 3. <fix>
Test with users: <what to watch for>
MISSING: <anything not given>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product-specific interface designer](https://useaiblocks.com/skills/product-true-ui-designer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Install
This is optional and runs in a terminal on your computer. It needs Node.js.

```
npx skills add uxuiprinciples/agent-skills
```

The upstream README also mentions an optional uxuiprinciples.com API for richer output with full citations. It does not say whether that needs an account, an API key or a paid plan. Check their site before relying on it. The steps above work without it.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
