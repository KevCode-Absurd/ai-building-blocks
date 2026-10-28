---
name: interview-style-doc-building
description: "Build structured strategy documents by asking one question at a time and patching the file."
category: productivity
risk: critical
source: community
source_repo: davidondrej/skills
source_type: community
date_added: "2026-07-07"
author: davidondrej
tags: [documentation, interview, planning]
tools: [claude, codex]
license: "MIT"
license_source: "https://github.com/davidondrej/skills/blob/main/LICENSE"
---

<!-- Licence note: the MIT line in the header above is the original author's licence, and it covers this skill text. LICENSE-CONTENT (CC BY 4.0) from sickn33's collection applies only where no more specific upstream notice exists. -->

# Interview-Style Doc Building

> The `risk: critical` label in the header is the author's. It flags that this skill creates and edits files. Give your AI access to one folder only, and back up any file you want it to patch.

The user's preferred mode for creating durable strategic docs. AI does NOT propose content — AI asks one question, the user answers, AI patches the file, AI asks the next question. The file IS the conversation's output, updated incrementally.

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

- Building a new SSOT file (life priorities, life vision, principles, frameworks, ranked lists).
- Filling out a structured doc the user explicitly wants to author themselves.
- Quarterly/annual reviews where the user's words go into the file.

**NOT for:** day planning (use a day planner), task triage (use a task list), or anything where AI proposes content first.

## The Loop

1. **Create the file** with a skeleton (header, sections, "to be filled in" placeholders). Single `write_file` for the new file. After this, NEVER overwrite — only `patch`.
2. **Ask ONE question.** Concise. Specific. Single-faceted. Open-ended where possible.
3. **Wait for the answer.** Don't ask the next question yet.
4. **Patch the file** with the user's answer in the correct section.
5. **Re-ask** — next question, or follow-up if the answer was incomplete.
6. Repeat until the file is complete.

## Hard Rules

- **One question at a time.** Never dump multiple questions in a single message. The user has flagged this.
- **Patch, don't overwrite.** After the initial skeleton, use `patch` for every update. Never `write_file` to an existing doc.
- **Update the file BEFORE asking the next question.** Order: receive answer → patch file → ask next question. Not the reverse.
- **Lists from the user are UNORDERED SETS.** When the user lists items in response to "which X should we cover?" or "what are the Ys?", that is a SET, not a ranking. Never infer rank, priority, or sequence from the order they typed them. If you need ordering, ask explicitly: "Which of these is #1?"
- **Ask dynamics, not names.** When the user references a person, don't ask "who is X?" — ask about the role/dynamic.
- **No snark, no attitude, no filler.** Concise questions, concise acknowledgments.
- **No speculative additions.** Don't invent sections, edge cases, or "anything else?" prompts unless the user asks.

## Question Design

- **Domain-discovery, not confirmation.** "What wins against everything else?" — not "Is Business #1?"
- **Surface new reality.** Each question should pull out info AI doesn't already have.
- **Engine-move framing where applicable.** "What's the thing that, if true, makes the rest obvious?"
- **Concrete over abstract.** "What's #2 — the domain that wins against everything except #1?" beats "Tell me about your second priority."

## File Patching Pattern

After each answer:
1. Read the relevant section (if not already in context).
2. `patch` with `old_string` = placeholder or previous entry, `new_string` = updated content with the user's words preserved.
3. Confirm the diff. Move on.

For ranked lists, append one rank at a time:
```
1. **[AREA]** — [PERIOD] #1 goal: [THE USER'S WORDS]
2. **[AREA]** — [THE USER'S WORDS]
```
Each rank gets patched in as the user confirms it.

## Common Pitfalls

- **Assuming order from a set.** The user lists "A, B, C, D" → AI writes "1. A, 2. B, 3. C, 4. D" → the user flags it. ALWAYS confirm rank explicitly.
- **Asking too many questions at once.** Even bundling 2 violates the rule.
- **Overwriting the file** instead of patching specific sections — destroys prior content.
- **Adding AI-generated content** to fill out sections. Sections stay empty until the user provides the content.
- **Skipping the file update** between Q&A pairs — the doc falls out of sync.

## Pairing with Other Skills

Next step: when the file is complete, save it where you keep long-lived notes and reopen it at your next review. To turn it into actions, ask your AI for a task list based on it.

These are named only for contrast. None of them are in this library:

- A day planner is a different pattern (task triage), not interview-style.
- A task organizer is a different job.
- Personal preferences belong in your AI's memory settings, not in this document.

## Limitations

- Adapted from `davidondrej/skills`; verify local paths, tools, credentials, and agent features before acting.
- For commands, remote access, scheduling, browser automation, or file-changing workflows, get explicit user approval and confirm the target environment first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Design decision interview planner](https://useaiblocks.com/skills/design-interviewer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
