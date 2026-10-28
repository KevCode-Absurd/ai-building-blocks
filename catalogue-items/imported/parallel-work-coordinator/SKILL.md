---
name: orchestrate
description: "Coordinate focused subagents on substantial work, keep their ownership non-overlapping, and integrate verified results. Use for large-scope Codex tasks; keep trivial work with the coordinator."
category: agent-orchestration
risk: safe
source: https://github.com/provencher/codex-skills/tree/8aa6c42b73781c905c55f8a1253a18127079ac21/orchestrate
source_repo: provencher/codex-skills
source_type: community
date_added: "2026-07-26"
author: provencher
tags: [codex, orchestration, multi-agent, delegation, subagents]
tools: [codex]
license: MIT
license_source: https://github.com/provencher/codex-skills/blob/8aa6c42b73781c905c55f8a1253a18127079ac21/LICENSE
---

# Orchestrate

Coordinate substantial work across focused subagents while remaining available
to the user and retaining responsibility for the integrated result.

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

**Tools that do this best:**
- **Codex:** The skill was written for it and uses its helper agents.
- **Claude Code:** It can also run helper agents in parallel.
<!-- /needs -->

## When to Use

- Use when a task has multiple independent research, review, or implementation lanes.
- Use when parallel work will materially reduce elapsed time or improve coverage.
- Use when a coordinator must synthesize several bounded outputs into one verified result.

Keep trivial tasks with the coordinator.

## When Not to Use

- The task is small or has one step: just do it.
- The parts depend on each other, so one cannot start until another finishes: run them in order instead.
- Several helpers would need to edit the same files: give those files to one helper.
- Your AI tool cannot start helper agents. See "No helper agents" below.

## What You Give It

Ask once for any that are missing. If one is still missing, write MISSING and say what it changes. Never invent the goal or the limits.

1. The large task and the result the person wants.
2. Which files, folders or areas the helpers may touch (optional). Default: read-only.
3. Rules and limits: what must not change, what needs the person's approval, a deadline (optional).
4. How to check the result: tests to run, or a checklist (optional).

## Workflow

1. Decompose the task into distinct, bounded assignments with explicit outputs.
2. Run narrow, read-only scouts in parallel with low reasoning effort and no
   inherited conversation when the runtime supports those controls. Give each
   scout all scoped context and evidence required to complete its assignment.
3. Use medium reasoning effort for routine implementation and high reasoning
   effort for difficult work.
4. Give each subagent distinct ownership. Prevent overlapping assignments, and
   instruct leaf workers not to delegate.
5. Integrate the outputs, resolve conflicts, and verify the combined result. If a scout comes back with no usable facts, say so in the scout findings, name the gap, and either re-run that scout with a narrower question or ask the person. Never fill the gap with a guess.
6. Keep approvals and externally consequential decisions with the user.

## Output

Return these in order. Keep the whole answer to about one page.

1. **Task table**: `<lane>` | `<owner>` | `<what they may touch>` | `<output expected>` | `<status>`. One row per helper. Files must not repeat across owners.
2. **Scout findings**: one short block per read-only scout, with the facts they found and where they found them.
3. **Merged result**: the combined work, with every conflict between helpers named and how it was settled.
4. **Verification note**: what you checked (tests run, files re-read, claims compared) and what you could not check.
5. **Open questions for the person**: anything that needs their approval or a decision.
6. **Next steps**: what the person should do now, such as reading the changes, running the tests or approving the next stage.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Parallel code reviewer](https://useaiblocks.com/skills/parallel-code-reviewer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## No Helper Agents

If your tool cannot start helper agents, still use the plan. Write the task table, then do each lane one after another in the same chat, keep each lane's output in its own labelled section, and merge them at the end. It is slower, but the structure and the checks still help.

## Examples

- For a repository-wide feature, assign non-overlapping agents to architecture
  inspection, implementation, and test review, then integrate their findings
  and run the final verification from the coordinator.
- For a research brief, assign independent sources or questions to read-only
  scouts, reconcile disagreements, and keep the final judgment with the
  coordinator.

## Limitations

- Requires a runtime that exposes subagent or delegation tools; otherwise keep
  the work with the coordinator.
- Delegation does not authorize file mutations, public actions, purchases, or
  other consequential operations beyond the user's original scope.
- Parallel agents can add cost and coordination overhead, so use them only when
  the task is substantial enough to benefit.
- The coordinator remains responsible for checking claims, changes, tests, and
  the final answer.
