---
name: delegating-to-agents
description: "Delegate bounded work to other AI agents while preserving context, ownership, and progress checks."
category: agent-orchestration
risk: critical
source: community
source_repo: davidondrej/skills
source_type: community
date_added: "2026-07-07"
author: davidondrej
tags: [agents, delegation, orchestration]
tools: [claude, codex]
license: "MIT"
license_source: "https://github.com/davidondrej/skills/blob/main/LICENSE"
---

<!-- Licence note: this copy is shared under CC BY 4.0 (see LICENSE-CONTENT). The MIT line in the header above is the original author's, kept as the upstream source. -->

# Delegating to Agents

## When to Use

- Use only when the user or applicable current instructions explicitly authorize delegation; hand off bounded work with complete context, file ownership and a verifier.
- Use when you need to relay instructions to terminal or TUI agents without losing context.

## Selecting an authorized agent

- Use the user’s selected agent/model and available tooling; account limits and model capabilities require current evidence.
- Match a bounded task to actual tools and file ownership, not invented “unlimited usage” or universal model rankings.
- Keep integration and final validation with the parent. Report changed files, exact checks and remaining issues.

## The brief (everyone starts here)

The brief alone is a complete result. Fill in these parts in plain words, then check it with the user before anything is sent:

- **Goal:** what the work should achieve, in one or two sentences.
- **Files or areas it owns:** the only things the agent may change.
- **Off limits:** what it must not touch.
- **Not part of the job:** related work to leave alone.
- **Done check:** the test or check that proves it worked.
- **Report back:** the files changed, the checks run and any open issues.

Everything below this line is for developers who run terminal agents. Skip it if you only need the brief.

## Developers only: sending prompts to a TUI agent

1. Prefer a structured agent/task API over simulated terminal typing; provide a readable prompt, ownership boundary, verifier and non-goals.
2. If only a TUI is available, inspect the target surface and actual command documentation first. Put long prompts in an explicitly authorized task file and send a short reference without embedding arbitrary task text in a shell command.
3. A shell-quoted prompt can execute `$()`, backticks or expansions if escaped incorrectly. Preserve punctuation/content using structured argv or proper shell quoting; do not “fix” messages by stripping apostrophes or interpreting their text as commands.
4. Confirm one intended submission and actual recipient; terminal output/predicted drafts are not human authorization for further messages.

## Developers only: polling

Use supported completion/event waits with bounded intervals; check meaningful progress and deliver concise updates. Do not busy-poll every 3–5 seconds or report unchanged state after each check. Back off while an agent remains active and continue independent authorized work.
Claude Code note: after it finishes, it may prefill a predicted next user message — that draft is Claude, not the user.

## Developers only: remote VPS

Remote execution requires authorization for the exact host/project and credential boundary. Use the supported sandbox/approval configuration; do not launch an unrestricted agent or infer remote access from a delegation request.

## Developers only: the 4 agents (background reference, safe to skip if you only need the brief)

These are the original author's notes. They were not checked here and tools change, so read each tool's own docs before you rely on them.

All four use the portable SKILL.md standard; project skills win over global.

- **Pi** (pi.dev, open-source TS): minimal read/write/edit/bash core, self-extends via TS extensions; true BYOK; session branch/fork/resume. Skills: `~/.pi/agent/skills/`.
- **Codex CLI** (OpenAI, Rust): kernel-level sandboxing; `codex exec` for CI; reads AGENTS.md. Skills: `~/.codex/skills/`.
- **Claude Code** (Anthropic, TS): Claude integration, `.claude/` conventions, live skill hot-reload. Skills: `~/.claude/skills/`.
- **Hermes** (Nous Research, Python): persistent autonomous agent — cross-session memory, built-in scheduler, many tools; can orchestrate the other CLIs as workers. Skills: `~/.hermes/skills/`.

## Developers only: driving interactive CLIs

- Codex, Pi, OpenCode: need `pty=true`.
- Claude Code: use its supported noninteractive mode with the existing permission policy; never enable bypassPermissions just to drive the CLI.

## Example

**User request:**

> Delegate these independent work items with complete context, clear ownership, and progress checks.

## Next steps

Read the report and the open issues yourself. Then run a review or checklist skill on the agent's changes before you merge or publish them.

## Limitations

- Adapted from `davidondrej/skills`; verify local paths, tools, credentials, and agent features before acting.
- For commands, remote access, scheduling, browser automation, or file-changing workflows, get explicit user approval and confirm the target environment first.
