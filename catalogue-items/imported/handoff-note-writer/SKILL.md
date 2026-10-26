---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

## How to run this skill in a chat

Added by AI Blocks. The original steps are below. This part sets the layout of the note and covers chats that cannot save files.

**Use it when:** a long chat is slowing down, or you stop for now and want a fresh AI to carry on.
**Skip it when:** the chat is short, or the note is for people instead of an AI (write a normal summary).

**Layout of the note** (keep it under one page, plain words):
1. **Goal.** One or two lines on what the work is for.
2. **Done.** What is finished, one line each.
3. **Open.** What is not finished or still undecided, one line each.
4. **Next step.** The first thing the next session should do.
5. **Where things are.** Paths or links to plans, issues, files and commits. Point to them. Do not copy them in.
6. **Suggested skills.** Which skills the next session should use.
7. **Left out.** One line saying that keys, passwords and personal details were removed.

**If you cannot save files** (most chat windows), show the note in the chat and tell the user to copy it into the new chat. Do not make up a path or say a file was saved.
**If the user said what the next session is for,** shape the note around that. If not, ask once, or write a general note.
**Never invent** a file, link, decision or result that is not in the chat. Mark anything you are unsure of as UNCLEAR.

## Original steps

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows) - not the current workspace.

Include a "suggested skills" section in the document, naming which skills the next agent should call the Skill tool for.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
