---
name: skill-check
description: "Validate Claude Code skills against the agentskills specification. Catches structural, semantic, and naming issues before users do."
category: development
risk: safe
source: https://github.com/olgasafonova/SkillCheck-Free
date_added: "2026-03-11"
author: olgasafonova
tags: [validation, linter, agentskills, skill-authoring, code-quality]
tools: [claude, cursor, windsurf, codex-cli]
license: MIT
allowed-tools: Read Glob
compatibility: claude-code
---

# SkillCheck

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Skill files** (yours): a skill's folder: its SKILL.md and any files it needs.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for skill files. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Validate SKILL.md files against the [agentskills specification](https://agentskills.io) and Anthropic best practices. Catches structural errors, semantic contradictions, naming anti-patterns, and quality gaps in a single read-only pass.

## When to Use This Skill

- Use when user says "check skill", "skillcheck", or "validate SKILL.md"
- Use when reviewing a skill before publishing to a marketplace
- Use when debugging why a skill doesn't trigger correctly
- Use when onboarding a team to skill authoring standards
- Do NOT use for anti-slop detection, security scanning, or token analysis; use [SkillCheck Pro](https://getskillcheck.com) for those

## How It Works

### Step 1: Parse

Read the target SKILL.md file and extract YAML frontmatter.

### Step 2: Validate

Apply all Free tier checks in order:

| Category | Checks | What it catches |
|----------|--------|----------------|
| Structure (1.x) | Name format, description WHAT+WHEN, allowed-tools, categories, XML injection | Malformed frontmatter, missing fields |
| Body (2.x) | Line count, hardcoded paths, stale dates, empty sections, deprecated syntax, MCP tool qualification | Content quality issues |
| Naming (3.x) | Vague terms, single-word names, gerund suggestions | Poor discoverability |
| Semantic (4.x) | Contradictions, ambiguous terms, missing output format, wisdom/platitudes, misplaced triggers | Logical inconsistencies |
| Quality (8.x) | Examples, error handling, triggers, output format, prerequisites, negative triggers | Strengths (positive patterns) |

### Step 3: Score

Calculate overall score (0-100). Penalties: critical = -20, warning = -5, suggestion = -1.

### Step 4: Report

Return structured results: score, grade (Excellent/Good/Needs Work/Poor), issue list with check IDs, line numbers, messages, and fix suggestions.

## Examples

### Example 1: Validating a skill

```
User: check my skill at ~/.claude/skills/weekly-report/SKILL.md

SkillCheck output:
## weekly-report Check Results [FREE]

Score: 85/100 (Good)

### Warnings (2)
  - 1.2-desc-when (line 3): Description missing WHEN clause
  - 4.5-desc-no-triggers (line 3): Description lacks triggering conditions

### Suggestions (1)
  - 3.4-gerund-naming (line 2): Skill name could use gerund form

### Passed Checks: 28
```

### Example 2: Clean skill passes all checks

```
User: skillcheck ~/.claude/skills/processing-pdfs/SKILL.md

Score: 100/100 (Excellent)
All 31 checks passed. No issues found.
```

## Limitations

- Read-only: does not modify any files
- Free tier covers structural, semantic, and naming checks only
- Anti-slop, security, WCAG, token, enterprise, and workflow checks require [SkillCheck Pro](https://getskillcheck.com)
- Semantic checks (contradiction detection, wisdom/platitude) are heuristic with ~5% false positive rate
- Does not validate referenced files or scripts; only checks SKILL.md content
- Single-file validation; does not cross-check against other skills in the same directory

## Best Practices

- Run SkillCheck before submitting skills to any marketplace
- Fix all critical and warning issues; suggestions are optional
- Use the check ID (e.g., `1.2-desc-when`) to find the exact rule in the skill body
- Re-run after fixes to confirm the score improved

## Common Pitfalls

- **Problem:** Score seems low due to many suggestions
  **Solution:** Suggestions cap at -15 points total. Focus on warnings and criticals first.

- **Problem:** False positive on ambiguous terms inside code blocks
  **Solution:** SkillCheck skips code blocks and inline code. If you still see false positives, wrap the term in backticks.

- **Problem:** Wisdom/platitude check flags legitimate instructions
  **Solution:** Rephrase generic advice ("Remember that testing is important") as concrete directives ("Run tests before committing").

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI skill library reviewer](https://useaiblocks.com/skills/monthly-skill-library-keeper).
- The [Skill quality tester](https://useaiblocks.com/skills/skill-quality-tester).
- The [Skill safety checker](https://useaiblocks.com/skills/skill-safety-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
