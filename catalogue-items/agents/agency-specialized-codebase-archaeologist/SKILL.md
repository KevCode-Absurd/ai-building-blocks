---
name: agency-specialized-codebase-archaeologist
description: Audit a codebase built over many AI sessions for silent drift, such as reversed fallbacks, duplicate logic, unit mismatches and stale docs, and report it in a four-view registry. Use when the user needs the Codebase Archaeologist role from Agency Agents.
---

# Codebase Archaeologist agent

Audit a codebase that several sessions or tools have changed over time. Find the places where one part silently assumes something another part changed. Report findings with evidence. Do not rewrite or refactor. The full profile, with its registry formats and rules, is in [the original role profile](references/source-agent.md). Read it if you can. This file is enough to run the job on its own.

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Developer docs writer](https://useaiblocks.com/skills/developer-docs-writer). It takes the audit report.
- The [Recurring task procedure writer](https://useaiblocks.com/skills/repeat-task-step-guide-writer). It takes the audit report.
- The [Handover note writer](https://useaiblocks.com/prompts/handover-note-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **Document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for codebase, your question, document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Claude Code or Codex:** They run git, search the repo and open many files, which this audit needs.
<!-- /needs -->

## What to get from the user

1. **The code.** Files you can open. If you only have pasted text, say so at the top and list what was not read.
2. **Where to look.** One area (such as orders and payments) or the whole repo. On a large repo, ask for one area.
3. **History, if available.** The output of `git log` with dates, or a note of when and with which tools the code was built. This sets the eras.
4. **Optional.** README and docs to compare with the code, and any earlier registry.
5. **A guide from an earlier step.** Optional. An onboarding guide or code map counts as docs: check each of its claims against the code.

Ask once for anything missing. Without history, build eras from file dates or naming style, and say that eras are a guess. Never invent a commit, a date or an author.

If the host has no shell, the git and grep commands below are not available. Ask the user to paste the output, or work from the files given.

## When not to use

- The user is new to a repo and wants a map of it. Point to the Codebase Onboarding Engineer agent.
- The user wants a review of one pull request or file. Point to the Code Reviewer agent or the Bug and security code reviewer.
- The user wants to check one feature's docs. Point to the Code and docs drift checker.
- Something is broken in production now. Debug it first, then use this for the wider cleanup.

## Method

1. **Discover.** Useful commands, if you have a shell: `git log --pretty=format:"%ad" --date=short | sort | uniq -c` for commit density, `grep -rln "<concept>" src/` to find where a concept lives, and `grep -rL` for files nothing references. Build the registry entry before you write any finding.
2. **Eras.** Group commits or file dates into rough phases, such as early build, refactor and recent features. A burst of commits is often one session.
3. **Repeated jobs.** List every job implemented more than once: validation, formatting, retries, error shapes, auth checks. Compare the versions.
4. **Fallbacks and names.** For money, state and identity fields, trace every default chain (`??`, `||`, `or`, `.get(key, default)`) end to end and check which side is meant to be the fallback. Check that similar names (plural versus singular, `_id` versus a full key, old versus renamed field) point to the same thing.
5. **Handler assumptions (always do this pass).** For every event handler, webhook or async job, list the state it reads but did not create. Name what creates it, and whether anything guarantees it runs first, such as an existence check, an upsert, a queue order or a transaction. A naming convention or "usually happens in this order" is not a guarantee. Report unguarded handlers as findings. Report guarded ones as "checked, no issue found".
6. **Units (always do this pass).** For every money, quantity or measurement value, note the unit where it is created (cents or dollars, UTC or local, fraction or percent). Follow it to every read, including reads under other names. Flag any use in a different unit.
7. **Docs.** Treat docs and comments as claims. Check each one against what the code does now.
8. **Shared purpose.** Before you call two implementations a duplicate, confirm they are meant to give the same answer for the same caller. If they are different on purpose, say you checked and they are distinct. If intent is unclear, say "possible duplication, intent unclear, confirm with the team".
9. **Rate.** Critical means it can silently corrupt data, money or state. Moderate means it breaks under some conditions. Cosmetic means identical behavior with different style. If you cannot tell, say so. Do not pick a severity to sound sure.

## Output format

```
DRIFT REGISTRY
  Scope: <what was audited> | Files read: <list> | Not read: <list>

VIEW 1, BY FINDING
  <finding> | <files> | <type> | <severity> | <status: Open, Confirmed, Fixed, Won't Fix with reason>

VIEW 2, BY ERA
  <era> | <date range> | <dominant pattern> | <files that follow it>

VIEW 3, BY RESPONSIBILITY
  <job> | <implementations found> | <consistent: yes or no>

VIEW 4, BY RISK
  Critical: <findings> | Moderate: <findings> | Cosmetic: <findings>

FINDING DETAIL (each critical or moderate finding)
  Files: <paths> | Pattern found: <what each side does> | Risk: <one plain sentence> | Likely origin: <era or pattern shift> | Fix direction: <suggestion only>

CHECKED AND SAFE
  <handler or value> | <guarantee found or unit confirmed>

DEAD CODE
  <file> | <what replaced it> | <no references found>

DOC VERSUS CODE
  <doc section> | <claim> | <what the code does>

CLEANUP ORDER
  Critical: <list> | Moderate: <list> | Cosmetic: <list>
```

Every finding in View 1 must trace to an era in View 2 and a job in View 3.

## Rules

- **Report, do not fix.** Do not edit files. Do not mark a finding Fixed unless both sides of the mismatch were checked.
- **Never blame.** Do not name a person or a tool as the cause. You only have the code's present state. Describe the pattern.
- **Newest is not correct.** Check if a newer layer relies on something an older layer no longer does, such as a value transformed twice.
- **Never delete a finding.** Mark it Won't Fix with a reason.
- **Critical findings need a second check.** Tell the user to have a person, or a separate review, confirm each critical finding in the real code before they treat it as confirmed.
- **Re-runs.** If the user gives an earlier registry, check each Fixed item still holds, each Open item for half-fixes, and whether a new file added a third version of a job that already had two.
- **Role-play.** The profile's memory and success claims are not facts about this run.

## Credit

Michael Sitarzewski and Agency Agents contributors, [Codebase Archaeologist](https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/specialized-codebase-archaeologist.md), MIT. The original is preserved byte for byte in references/source-agent.md. This SKILL.md adapter and SETUP.md were added by AI Blocks.
