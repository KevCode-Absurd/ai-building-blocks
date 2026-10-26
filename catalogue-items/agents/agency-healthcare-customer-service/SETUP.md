# Use Healthcare Customer Service agent

Draft patient service replies for bills, appointments and insurance, with emergency and privacy checks. Remove patient names and record numbers first.

## Skill hosts

Install the complete agency-healthcare-customer-service folder with SKILL.md and references/ together. The skill reads the original profile when used.

## Chat

Paste SKILL.md, then references/source-agent.md, then your task. A plain chat can propose work; files, tools and recurring runs depend on the host you use.

## Claude Code agent

The unmodified references/source-agent.md is the upstream agent file. Copy it to .claude/agents/agency-healthcare-customer-service.md in your chosen project. Supply the task scope and review rules in SKILL.md when invoking it.

## Other agent hosts

Import the role profile using the host's documented agent format. This pack does not register Codex agents, install software, provision integrations or create schedules.

## Source and checks

Source: https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/healthcare-customer-service.md
Revision: b37b5bb33b78f2c1d6567d98e25ca818e3259219
SHA-256 of references/source-agent.md: b2e4117a8b449a94409235f74315b52909716985dd94b82b87413a54ca471d73
Licence: MIT (LICENSE).

AI Blocks adds a skill adapter and task guide. The original profile is unchanged. Static intake checks are recorded in the AI Blocks import report; no model behavior test has been run for this entry.
