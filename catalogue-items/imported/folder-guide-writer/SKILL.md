---
name: folder-specific-claude-and-agents-md
description: "Create folder-scoped CLAUDE.md and AGENTS.md guidance for future agents working in that area."
category: development
risk: critical
source: community
source_repo: davidondrej/skills
source_type: community
date_added: "2026-07-07"
author: davidondrej
tags: [agents-md, claude-md, documentation]
tools: [claude, codex]
license: "MIT"
license_source: "https://github.com/davidondrej/skills/blob/main/LICENSE"
user-invocable: true
---

# Folder CLAUDE.md Creation

> Licence note (AI Blocks): the skill text below is the author's, under the MIT licence named in the header above. The CC BY 4.0 licence in the LICENSE-CONTENT file covers only the AI Blocks page text around it. Keep the credit to davidondrej.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

- Use when the user asks for folder-specific agent instructions or local context files.
- Use when a subdirectory needs a CLAUDE.md and AGENTS.md handoff for future agents.

Generate a focused `CLAUDE.md` inside a target folder, plus an `AGENTS.md` symlink pointing at it. The file gives any future agent (Claude Code, Codex, etc.) the folder-specific context the global `CLAUDE.md` doesn't cover.

Background reference: `library/claude-code/claude-and-agents-md.md` (the author's file, not in this copy; skip it).

## Process

**Approval gate.** This skill writes files and can run shell commands (`ls`, `ln -s`, and `git` only if asked). Before the first command, confirm the folder with the user and get a clear yes. Ask again before each later command that changes anything.

### Step 1: Confirm the target folder + sanity-check it deserves a file
Ask the user which folder. Use the absolute path of whichever folder the user names (for example `[PATH TO FOLDER]`).

**Only create a file if the folder has context needed across multiple sessions** — active evolving work, specific conventions, ongoing decisions. A folder of static reference files does NOT need one (agents can read on demand). If unsure, ask the user.

### Step 2: Read every file in the folder IN FULL
- Use `ls -la` first to enumerate files and subfolders.
- Read every markdown, config, and key source file.
- For large tldraw/Vite subprojects: read `package.json`, `src/App.tsx`, one representative module file, and the folder's own `module-details.md`-style files.
- Do NOT skim. Do NOT skip. The user's later edits depend on you having full context.

### Step 3: Draft a bullet list of candidate content
Before writing the file, give the user a bullet list grouped by section — let them react first. Candidate sections (skip any that don't apply):

- **Product / Purpose** — what this folder/project is, current state, key metrics
- **Avatar / Audience** — who it's for (if applicable)
- **Essential Files** — one-line role for each important file, including cross-folder references (use `@path/file.md` import syntax)
- **Constraints (MUST NOT)** — explicit hard negatives. Highest-ROI content in the file.
- **Conventions** — the user's lingo, status emojis (✅ 🟡), naming patterns, "usually do" patterns
- **Locked Decisions** — things agreed + dated, must not re-litigate
- **Context** — history, authority, credibility that frames the work
- **How to work with the user** — collaboration style for this specific folder
- **Marketing Angles / Positioning** — if public-facing
- **Top Insights** — 3-5 most glaring signals from research (if research exists)

### Step 4: Iterate with the user
- Keep answers short. The user will edit directly in the IDE.
- When they edit the file, RE-READ it and flag: contradictions, typos, missing rules, wrong categorization.
- Do not revert their edits unless asked.

### Step 5: Write the file
- Path: `<folder>/CLAUDE.md`
- Start with a one-line header explaining the file's purpose.
- **Subdir file marker:** if this is a subdirectory file (parent folder already has its own CLAUDE.md), open with `Apply root CLAUDE.md first, then this file.`
- Use `##` section headers matching the sections the user approved.
- Bullets over prose. Short bullets. Aim for under about 60 lines in total, so the file stays easy to check.
- **Cross-folder references:** use `@relative/path/file.md` import syntax, not prose mentions.
- **Heavy reference docs:** annotate with `**Read when:**` triggers (e.g. "Read when: writing offer copy"). Prevents loading every session.

### Step 6: Create the AGENTS.md symlink
```
cd <folder> && ln -s CLAUDE.md AGENTS.md
```
Verify with `ls -la CLAUDE.md AGENTS.md`.

### Step 7: Commit only when asked
Do NOT stage, commit or push unless the user says to. When they do, tell them first that the push goes to their remote repository and ask them to confirm. Then: `git add -A`, commit with a clear message, push. Prefer adding only the files you wrote over `git add -A` if the folder has other changes.

## Rules

- **Never invent content.** Every bullet must trace back to something you read in the folder or something the user said. No generic boilerplate.
- **Brevity wins.** The user edits aggressively to make things shorter. Start tight.
- **Folder-scoped only.** Don't duplicate the global `CLAUDE.md` (personality, dates, ports, etc.). Only include what's specific to this folder.
- **No file trees, no directory dumps, no stack details the code already shows.** Anything an agent can derive from `ls` or `grep` rots fast and wastes tokens. Pin decisions, rules, and context — not structure.
- **Constraints vs Conventions.** Hard "MUST NOT" rules go in Constraints (explicit negatives). "Usually do X" patterns go in Conventions. Splitting these improves adherence.
- **No absolute ALWAYS/NEVER without explicit exceptions.** Edge cases make absolute rules get ignored. "Never commit secrets EXCEPT `.env.example`" beats "never commit secrets."
- **Never summarize or auto-shorten the file.** Context collapse degrades it. Grow deliberately, prune manually. If the user asks to trim, do it by hand.
- **Maintenance loop.** When the user corrects the agent on something this file should have prevented, add the rule to the file immediately. Don't wait.
- **No emojis unless the user uses them** (status markers ✅ 🟡 are the exception — they're already conventions).
- **Symlink, not copy.** `AGENTS.md` must be a symlink so edits stay in sync.
- **Flag gaps honestly.** If the user's edits introduce contradictions (e.g. "sell X" in one section and "never sell X" in another), call it out before they ask.

## Limitations

- Adapted from `davidondrej/skills`; verify local paths, tools, credentials, and agent features before acting.
- For commands, remote access, scheduling, browser automation, or file-changing workflows, get explicit user approval and confirm the target environment first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Build it** with the [Project design and decision recorder](https://useaiblocks.com/skills/project-memory-keeper).
- The [Project memory builder](https://useaiblocks.com/skills/project-memory-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
