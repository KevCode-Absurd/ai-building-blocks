# Use Legal Document Review agent

Paste a contract. Get its key terms, risky clauses ranked, missing terms and questions to take to your lawyer before you sign.

## Skill hosts

Install the complete agency-legal-document-review folder with SKILL.md and references/ together. The skill reads the original profile when used.

## Chat

Paste SKILL.md, then references/source-agent.md, then your task. A plain chat can propose work; files, tools and recurring runs depend on the host you use.

## Claude Code agent

The unmodified references/source-agent.md is the upstream agent file. Copy it to .claude/agents/agency-legal-document-review.md in your chosen project. Supply the task scope and review rules in SKILL.md when invoking it.

## Other agent hosts

Import the role profile using the host's documented agent format. This pack does not register Codex agents, install software, provision integrations or create schedules.

## Source and checks

Source: https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/legal-document-review.md
Revision: b37b5bb33b78f2c1d6567d98e25ca818e3259219
SHA-256 of references/source-agent.md: 02bf51dbc9d8ffc93a8b053a09ec61ee2a3a9905e395fbd24389a532d20d1dba
Licence: MIT (LICENSE).

AI Blocks adds a skill adapter and task guide. The original profile is unchanged. Static intake checks are recorded in the AI Blocks import report; no model behavior test has been run for this entry.
