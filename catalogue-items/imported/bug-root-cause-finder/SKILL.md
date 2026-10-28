---
name: phase-gated-debugging
description: "Use when debugging any bug. Asks the agent to follow a 5-phase protocol and to make no code edits until you confirm the root cause. Prevents premature fix attempts."
risk: safe
source: community
date_added: "2026-03-28"
---

# Phase-Gated Debugging

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A test report** (yours): what was tested, what passed, what failed and why.
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, your question, a test report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

AI coding agents see an error and immediately edit code. They guess at fixes, get it wrong, and spiral. This skill sets a strict 5-phase protocol: do not edit source code until the root cause is identified and the user confirms it. This copy is a prompt the agent is asked to follow. Nothing technically blocks edits, so watch the agent and stop it if it edits early.

Based on [claude-debug](https://github.com/krabat-l/claude-debug) (full plugin with PreToolUse hook enforcement).

## When to Use
Use this skill when:

- a bug keeps getting "fixed" without resolving the underlying issue
- you need to slow an agent down and force disciplined debugging before code edits
- the failure is intermittent, a regression, performance-related, or otherwise hard to isolate
- you want an explicit user confirmation checkpoint before any fix is applied

If you already have a ranked list of likely causes (an audit report), start Phase 2 from it. It does not replace reproducing the failure in Phase 1.

## The Protocol

### Phase 1: REPRODUCE
Run the failing command/test. Capture the exact error. Run 2-3 times for consistency.
- Do NOT read source code
- Do NOT hypothesize
- Do NOT edit any files

### Phase 2: ISOLATE
Read code. Add diagnostic logging marked `// DEBUG`. Re-run with diagnostics. Binary search to narrow down.
- Only `// DEBUG` marked logging is allowed
- Do NOT fix the bug even if you see it

### Phase 3: ROOT CAUSE
Analyze WHY at the isolated location. Use "5 Whys" technique. Remove debug logging.

State: "This is my root cause analysis: [explanation]. Do you agree, or should I investigate further?"

**WAIT for user confirmation. Do NOT proceed without it.**

### Phase 4: FIX
Remove all `// DEBUG` lines. Apply minimal change addressing confirmed root cause.
- Only edit files related to root cause
- Do NOT refactor unrelated code

### Phase 5: VERIFY
Run original failing test — must pass. Run related tests. For intermittent bugs, run 5+ times.
If verification fails: root cause was wrong, go back to Phase 2.
After a pass, record the root cause in one line (in the commit message or the ticket) and add a regression test for it, so the same bug is caught if it returns.

## Bug-Type Strategies

| Type | Technique |
|------|-----------|
| Crash/Panic | Stack trace backward — trace the bad value to its source |
| Wrong Output | Binary search — log midpoint, halve search space each iteration |
| Intermittent | Compare passing vs failing run logs — find ordering divergence |
| Regression | `git bisect` — find the offending commit |
| Performance | Timing at stage boundaries — find the bottleneck |

## Key Rules

1. NEVER edit source code in phases 1-3 (except `// DEBUG` in phase 2)
2. NEVER proceed past phase 3 without user confirmation
3. ALWAYS reproduce before investigating
4. ALWAYS verify after fixing

## Example

**User request:**

> a bug keeps getting "fixed" without resolving the underlying issue; diagnose it and return the concrete next action.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the code change.
- The [Persistent bug debugger](https://useaiblocks.com/skills/fix-loop-breaker). It takes the code change.
- The [Failed test repairer](https://useaiblocks.com/skills/test-failure-repair-loop).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
