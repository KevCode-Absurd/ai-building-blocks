---
name: "codebase-onboarding"
description: "Analyze a codebase and generate onboarding documentation for engineers, tech leads, and contractors. Fast fact-gathering and repeatable onboarding outputs. Use when onboarding a new engineer, writing architecture-overview docs for a new project, or producing tech-lead briefings for unfamiliar repos."
---

# Codebase Onboarding

**Tier:** POWERFUL  
**Category:** Engineering  
**Domain:** Documentation / Developer Experience

---

## Overview

Analyze a codebase and generate onboarding documentation for engineers, tech leads, and contractors. This skill is optimized for fast fact-gathering and repeatable onboarding outputs.

## Core Capabilities

- Architecture and stack discovery from repository signals
- Key file and config inventory for new contributors
- Local setup and common-task guidance generation
- Audience-aware documentation framing
- Debugging and contribution checklist scaffolding

---

## When to Use

- Onboarding a new team member or contractor
- Rebuilding stale project docs after large refactors
- Preparing internal handoff documentation
- Creating a standardized onboarding packet for services

---

## Quick Start

```bash
# 1) Gather codebase facts
python3 scripts/codebase_analyzer.py /path/to/repo

# 2) Export machine-readable output
python3 scripts/codebase_analyzer.py /path/to/repo --json

# 3) Use the template to draft onboarding docs
# See references/onboarding-template.md
```

---

## Recommended Workflow

1. Run `scripts/codebase_analyzer.py` against the target repository.
2. Capture key signals: file counts, detected languages, config files, top-level structure.
3. Fill the onboarding template in `references/onboarding-template.md`.
4. Tailor output depth by audience:
   - Junior: setup + guardrails
   - Senior: architecture + operational concerns
   - Contractor: scoped ownership + integration boundaries

---

## Before You Start (added by AI Blocks)

- The scan reads the whole repository. If the code is confidential, check your company policy first. Do not open, read or copy `.env` files, key files, credential files or other files that hold secrets. The scan script lists file names, sizes and languages only; it does not read file contents. If a secret value still turns up, leave it out of the guide and say where the new person gets it.

## Before You Share the Guide (added by AI Blocks)

- Read the finished guide for secrets and private details copied from config files: passwords, API keys, tokens, internal hostnames and customer data. Remove them, or point to where the new person gets them.
- Setup commands are written from code that the AI has only read. Do not call the guide finished until someone has run the setup steps on a clean machine and fixed what fails.
- Do not state a setup time or a fact you have not checked.

## When Not to Use (added by AI Blocks)

- The repository has no runnable setup, or the code is confidential and your AI is not allowed to see it. Ask a current teammate to write the guide, or have a senior engineer review one.
- You only want to check that a README works. Use the README first-run tester instead.

## Output Format (added by AI Blocks)

One markdown file that follows `references/onboarding-template.md`, in this order: what the project is, quick start, architecture, key files, common developer tasks, debugging guide, contribution checklist and notes for the reader type. Expect about two to four pages. Mark any step you could not verify as "not tested".

## Onboarding Document Template

Detailed template and section examples live in:
- `references/onboarding-template.md`
- `references/output-format-templates.md`

---

## Common Pitfalls

- Writing docs without validating setup commands on a clean environment
- Mixing architecture deep-dives into contractor-oriented docs
- Omitting troubleshooting and verification steps
- Letting onboarding docs drift from current repo state

## Best Practices

1. Keep setup instructions executable and time-bounded.
2. Document the "why" for key architectural decisions.
3. Update docs in the same PR as behavior changes.
4. Treat onboarding docs as living operational assets, not one-time deliverables.
