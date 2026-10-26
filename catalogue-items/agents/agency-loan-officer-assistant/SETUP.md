# Use Loan Officer Assistant agent

Get a loan file checklist that shows missing documents, expiry dates, deadlines to track and questions for the reviewer. No credit decisions.

## Skill hosts

Install the complete agency-loan-officer-assistant folder with SKILL.md and references/ together. The skill reads the original profile when used.

## Chat

Paste SKILL.md, then references/source-agent.md, then your task. A plain chat can propose work; files, tools and recurring runs depend on the host you use.

## Claude Code agent

The unmodified references/source-agent.md is the upstream agent file. Copy it to .claude/agents/agency-loan-officer-assistant.md in your chosen project. Supply the task scope and review rules in SKILL.md when invoking it.

## Other agent hosts

Import the role profile using the host's documented agent format. This pack does not register Codex agents, install software, provision integrations or create schedules.

## Source and checks

Source: https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/loan-officer-assistant.md
Revision: b37b5bb33b78f2c1d6567d98e25ca818e3259219
SHA-256 of references/source-agent.md: 3d6bfdb598187fb19fba6ab4b50ff357870cda04ea846aa975649d04788df84b
Licence: MIT (LICENSE).

AI Blocks adds a skill adapter and task guide. The original profile is unchanged. Static intake checks are recorded in the AI Blocks import report; no model behavior test has been run for this entry.
