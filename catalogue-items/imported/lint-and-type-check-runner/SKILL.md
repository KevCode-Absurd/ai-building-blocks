---
name: lint-and-validate
description: "Run configured lint and type checks, distinguish failures from checks that did not run, and report concrete validation results."
risk: critical
source: community
date_added: "2026-02-27"
---

# Lint and Validate

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, a code change. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

Use after behavior or configuration changes when a repository has relevant lint or type checks. Read the repository's instructions and package scripts first. Run focused checks during development and the required checks before completion.

## Procedure

Phase A (check) is meant to be read-only: steps 1 to 3 and the report in step 5. It is read-only only once the user has approved each project script and what it may write or fetch, because a script named lint can change files or use the network. Phase B (fix) is step 4. It writes files, so it starts only after the user says yes to the specific change.

1. Identify the changed languages, configured commands, and installed tools. Inspect package scripts before executing them: a script named `lint` can modify files or run arbitrary project code. Show the user what the scripts do and get their approval before you run any command that could change files or use the network.
2. Phase A: run the project's read-only lint/type-check commands. For Node projects, prefer declared scripts such as `npm run lint` and `npm run typecheck`. Do not use `npx` to silently fetch an absent checker.
3. For Python, use configured, already installed tools such as `ruff check .` or `mypy .`. Do not assume every `pyproject.toml` configures both. Never add `--fix` without inspecting the proposed changes and the task's authorization.
4. Phase B: only after the user approves, fix relevant failures without deleting user work, weakening rules, or raising timeouts just to pass. Show each proposed change first. Re-run the checks in Phase A afterwards. If a required tool is unavailable, report the exact check that did not run.
5. Report commands, exit results, scope and remaining limitations. Passing lint does not prove the absence of runtime or security defects.

## Example

After correcting a TypeScript behavior, inspect `package.json`, run the configured focused regression test, then `npm run lint` and `npm run typecheck` if those scripts exist. If TypeScript is declared but not installed, report the missing local checker; do not substitute a downloaded package or call the result a pass.

## Bundled helpers

The helpers are optional. Before you run either one, show the user the exact command and get a yes. Run a helper only on a project the user trusts, because it starts the project's own commands.

- `python scripts/lint_runner.py /absolute/project`: runs a conservative set of candidate checks. Node fallback checkers must exist in local `node_modules/.bin`; Python candidates must be installed. Inspect the project scripts first. A missing command or failing check exits 1; no configured checks or invalid project metadata exits 2. Exit 0 means the invoked checks passed, not that every needed check was discovered. Python detection is heuristic and may suggest unconfigured Ruff/MyPy commands.
- `python scripts/type_coverage.py /absolute/project`: read-only annotation inventory, despite its retained compatibility filename. Samples at most 30 files per language, skips links and build/dependency directories, and bounds file reads. Python uses AST nodes to avoid double-counting functions. TypeScript reports lexical `: any` occurrences, including possible comments and strings. No quality percentage or pass/fail threshold is inferred. Exit 2 means no applicable files; parse/read errors exit 1.

## Limitations

The runner executes trusted project commands, which may mutate files or access the network. It does not install dependencies, detect every monorepo configuration, or replace the project's CI contract. The inventory is a bounded source sample, not semantic type coverage; inferred types, generics, decorator behavior and correctness require the actual type checker. Do not label unrun checks as successful.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Failed test repairer](https://useaiblocks.com/skills/test-failure-repair-loop). It takes the test report.
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
