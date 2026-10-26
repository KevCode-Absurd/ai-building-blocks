# Use Legal Client Intake agent

Turn your intake call notes into an attorney-ready summary with urgency flags, names to run through your conflicts check and open questions.

## Before you start

Client intake notes are confidential. Check your firm's rules, and remove names and identifiers unless your firm has approved the AI tool you use. Conflicts are cleared by your firm's own system and an attorney or intake lead, never by this agent.

## Skill hosts

Install the complete agency-legal-client-intake folder with SKILL.md and references/ together. The skill reads the original profile when used.

## Chat

Paste SKILL.md, then references/source-agent.md, then your task. A plain chat can propose work; files, tools and recurring runs depend on the host you use.

## Claude Code agent

The unmodified references/source-agent.md is the upstream agent file. Copy it to .claude/agents/agency-legal-client-intake.md in your chosen project. Supply the task scope and review rules in SKILL.md when invoking it.

## Other agent hosts

Import the role profile using the host's documented agent format. This pack does not register Codex agents, install software, provision integrations or create schedules.

## Source and checks

Source: https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/legal-client-intake.md
Revision: b37b5bb33b78f2c1d6567d98e25ca818e3259219
SHA-256 of references/source-agent.md: b0b1cce8a30f08ada6d630b010b1af99f765f5eca667436af6592545667f4c79
Licence: MIT (LICENSE).

AI Blocks adds a skill adapter and task guide. The original profile is unchanged. Static intake checks are recorded in the AI Blocks import report; no model behavior test has been run for this entry.
