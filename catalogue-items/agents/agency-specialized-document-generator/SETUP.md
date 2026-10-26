# Use Document generator agent for PDF, Word, slides and Excel

Get a script that builds a PDF, Word, slide or Excel file from your data, with the right library for the format and a template you can reuse.

## Skill hosts

Install the complete agency-specialized-document-generator folder with SKILL.md and references/ together. The skill reads the original profile when used.

## Chat

Paste SKILL.md, then references/source-agent.md, then your task. A plain chat can propose work; files, tools and recurring runs depend on the host you use.

## Claude Code agent

The unmodified references/source-agent.md is the upstream agent file. Copy it to .claude/agents/agency-specialized-document-generator.md in your chosen project. Supply the task scope and review rules in SKILL.md when invoking it.

## Other agent hosts

Import the role profile using the host's documented agent format. This pack does not register Codex agents, install software, provision integrations or create schedules.

## Source and checks

Source: https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/specialized/specialized-document-generator.md
Revision: b37b5bb33b78f2c1d6567d98e25ca818e3259219
SHA-256 of references/source-agent.md: cd2ca961e0f7baa18942aaaa315e333ea4315604bbb6a182d7daa31b76dfc3a3
Licence: MIT (LICENSE).

AI Blocks adds a skill adapter and task guide. The original profile is unchanged. Static intake checks are recorded in the AI Blocks import report; no model behavior test has been run for this entry.
