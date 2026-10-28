---
name: brain-to-docs
description: "Interview the user to turn project vision and decisions into README and ADR documentation."
category: productivity
risk: critical
source: community
source_repo: davidondrej/skills
source_type: community
date_added: "2026-07-07"
author: davidondrej
tags: [documentation, adr, planning]
tools: [claude, codex]
license: "MIT"
license_source: "https://github.com/davidondrej/skills/blob/main/LICENSE"
---

# brain-to-docs

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- Use when the user wants to extract project vision, decisions, or preferences into durable docs.
- Use when README and ADRs should be built through a back-and-forth interview.

The whole purpose: extract as much of the user's taste, judgment, knowledge, vision,
preferences, and decisions as possible into text — saved as clear, concise
markdown docs for the project. README holds the vision; `docs/adr/` holds the
decisions.

## The loop

1. **Check docs first, every time.** Read `docs/adr/` (and `README.md`) before
   doing anything — other agents and people add/edit ADRs constantly.
2. **Ask a small set of focused questions** through the host's supported question interface or plain text — default 2–3
   unless the user asks for a different number. Make them high-variety: a wide,
   creative spectrum of unique angles, not all the same type (e.g. not all "tech
   stack" or all "product" or all "monetization"). Exception: if the user asks for a
   specific focus area, follow it. The user answers whichever they find most useful.
3. **Integrate confirmed answers into the authorized docs.** Before the first save, confirm the project folder with the user. For every change after that, show the proposed file change and wait for a yes before you write it. Preserve unanswered questions and distinguish tentative ideas from accepted decisions. You decide whether it
   updates `README.md` or becomes a new ADR — whatever makes sense.
4. Repeat until the user says "we're done" (or similar).

## Rules

- All answers & responses during this "brain to docs" process must be VERY
  CONCISE, all sentences should be SHORT, and everything should be written in
  the user's requested language.
- ADRs: short, numbered `NNNN-slug.md`, Status + Context + Decision + Consequences.
- README: preserve existing installation, usage, and contributor sections. Add vision where it fits; detailed decisions go in ADRs.
- Don't challenge the user's thinking unless they ask, or they're making a severe mistake.

## Example

One round, shown with placeholders:

1. The AI reads `README.md` and `docs/adr/`, then asks three different questions, for example: [QUESTION ABOUT WHO THE PROJECT IS FOR], [QUESTION ABOUT A TRADE-OFF], [QUESTION ABOUT WHAT YOU WILL NOT BUILD].
2. You answer the ones you care about, in your own words: [YOUR ANSWERS].
3. The AI adds the vision to `README.md`, or writes `docs/adr/NNNN-slug.md` for a firm decision, and keeps open questions separate.
4. It shows what changed and asks the next round of questions. You say "we're done" to stop.

## Limitations

- If you cannot save files in this chat, print each full file (README.md or the ADR) after each round, say which path it belongs at, and ask the user to save it by hand.
- Adapted from `davidondrej/skills`; verify local paths, tools, credentials, and agent features before acting.
- For commands, remote access, scheduling, browser automation, or file-changing workflows, get explicit user approval and confirm the target environment first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Decision record writer](https://useaiblocks.com/skills/decision-record-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
