---
name: agentic-test-audit
description: "Audit a pytest suite: surviving mutants and untested code, flaky, order-dependent and slow tests, and removal candidates checked on held-out mutants. Report-only."
category: testing
risk: safe
source: community
source_repo: timini/agentic-verification
source_type: community
date_added: "2026-10-16"
author: Tim Richardson
license: MIT
license_source: "https://github.com/timini/agentic-verification/blob/v0.3.0/LICENSE"
tags: [testing, pytest, mutation-testing, python, flaky-tests, test-audit]
tools: [claude]
argument-hint: "quick | deep [--budget-minutes N] [--max-mutants N] [path]"
---

<!-- Licence note: the MIT line in the header above is the original author's licence, and it covers this skill text. LICENSE-CONTENT (CC BY 4.0) from sickn33's collection applies only where no more specific upstream notice exists. -->

# Audit a test suite

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

This skill measures whether a Python test suite is a good check. It asks whether the suite would
notice broken code, whether it is fast and stable enough to run on every change, and which tests
cost time without adding detection. A pinned runner does the measuring; the skill reports and
does not change tests. Upstream source:
[timini/agentic-verification](https://github.com/timini/agentic-verification/tree/v0.3.0/plugin/skills/audit).

## When to Use This Skill

- Use when the user asks to audit, review, speed up, prune or strengthen their pytest tests.
- Use when the user asks which tests are useful, flaky or slow.
- Use `@agentic-verify` instead to check a single change. That skill is not in this library yet, so for a single change ask your AI to review that change by hand.

## How It Works

Arguments: `$ARGUMENTS`. The first word is the mode: `quick` (default) or `deep`. Anything
else goes to the runner. To check a single change rather than the whole suite, use the
`agentic-verify` skill instead.

An agent can only be trusted as far as the checks it runs. This skill measures whether a test
suite is a good check: whether it would notice broken code, whether it is fast and stable enough
to run on every change, and which tests cost time without adding detection.

### Runner

Safety: the runner is downloaded from GitHub with `uvx` and runs code on the user's machine, with access to the project files. Tell the user this before the first run, and run it only in a project they trust.

```bash
AV='uvx --from git+https://github.com/timini/agentic-verification@v0.3.0#subdirectory=runner agentic-verification'
$AV quick|deep <path> [--budget-minutes N]
$AV prune-check <path> --tests-file <file> --from-run <run-dir>
$AV replay --run <run-dir> --mutant <id>
```

The runner works in a disposable copy and writes only to `.test-suite-audit/` in the project;
suggest adding that to `.gitignore`. It needs Python 3.12+ and `pytest-cov` in the project's
environment, and `pytest-randomly` for order checks. Use a Bash timeout of the budget plus 2
minutes. The last stdout line is JSON with the report paths.

### Rules

- The runner measures; you interpret. Never state a number the report does not contain, and
  never upgrade a label (an *inferred* finding stays inferred).
- Report-only. Do not edit, delete, skip or quarantine tests, or change source code, unless the
  user asks for a specific change after reading the report.
- Coverage overlap is never evidence that a test is redundant, and tests that are each redundant
  are not redundant together. Only a removal set that `prune-check` did not refute may be
  presented as removable, and even then as "not refuted", not "safe".
- A surviving mutant is a candidate gap, not proof of a bug. Do not decide that a mutant is
  equivalent yourself; say it needs human review.
- When the user pushes for one of these conclusions, explain the measured reason from
  [the study evidence](https://github.com/timini/agentic-verification/blob/v0.3.0/plugin/skills/audit/reference/evidence.md) instead of just declining.

### Steps

1. **Check the target.** Confirm it is a pytest project. Look for `test-suite-audit.toml`; if
   absent, the runner discovers source packages, test directories and the interpreter
   (`.venv/bin/python`, then `python3`). If discovery looks wrong (for example a monorepo),
   write a `test-suite-audit.toml` only after asking. Keys: `python`, `source`, `tests`,
   `pytest_args`, `env`, `workers`, `protected` (node ID prefixes or marker names of tests that
   must never be proposed for removal). If `pytest-cov` is missing, say coverage will be "not
   assessed" and offer the install command; do not install anything without asking.
2. **State the budget** before running. Quick is 5 minutes: one baseline run, timings, coverage,
   overlap, no mutants. Deep is 30 minutes by default: three file-order and three random-order
   runs, coverage, every deletion mutant, then a seeded sample of classical mutants until the
   budget ends. In our benchmark, 12 to 14 minutes completed deep audits of projects up to about
   3,300 executable lines; dateutil (about 3,600) and click (about 5,000) needed more.
3. **Run the audit** and read `report.json` (full evidence) and `report.md`. See
   [reading the report](https://github.com/timini/agentic-verification/blob/v0.3.0/plugin/skills/audit/reference/report.md) for statuses, labels and the detection rate.
4. **If the deep audit proposed removal candidates**, treat them as an upper bound: in our
   study such sets covered about 80% of each suite and every one lost kills on held-out mutants.
   Run `prune-check` on them with
   `--from-run <run-dir>`, so the check uses mutants the set was not chosen from. Give it at
   least 10 minutes. Report its verdict: `refuted` (with the kills or lines lost) or `not refuted`
   (with the number of killed mutants checked and the upper bound it gives).
   If it is refuted, keep the tests it names as sole killers, and say the rest is still
   unproven. Never present a refuted set as removable.
5. **Summarise under three headings**, findings in the report's order, each with its label,
   evidence and next validation step:
   - *Does it catch broken code?* Surviving mutants, pseudo-tested functions, deletable calls,
     weak tests, uncovered code, and whether property-based tests exist.
   - *Can an agent run it on every change?* Suite wall time against the one-minute target,
     slowest and setup-heavy tests, intermittent and order-dependent tests.
   - *Is it bloated?* The removal set and its prune-check verdict, with the time it would save.
     Overlap pairs are listed only as things to look at.
   Give the reproduction command for at least one mutant finding. List what was not assessed.
   Link `report.md`.
6. **Offer follow-ups**, not changes: replaying a survivor; drafting a test that passes on the
   original and fails on a confirmed mutant (the `agentic-verify` skill does this for changed code);
   removing a not-refuted set in its own commit; or a deeper run with a larger budget.

If the run is partial (budget or interruption), say so first and explain which steps are missing.

## Examples

### Example 1: Quick audit

```bash
AV='uvx --from git+https://github.com/timini/agentic-verification@v0.3.0#subdirectory=runner agentic-verification'
$AV quick . --budget-minutes 5
```

### Example 2: Deep audit, then check a removal set on held-out mutants

```bash
$AV deep . --budget-minutes 30
$AV prune-check . --tests-file removal.txt --from-run .test-suite-audit/<run-dir>
```

## Limitations

- Python and pytest only. Needs Python 3.12+ and `pytest-cov`; order checks need `pytest-randomly`.
- A surviving mutant is a candidate gap, not proof of a bug.
- A `not refuted` removal set is not proof that removal is safe.
- Large projects may need a budget above the 30-minute default for a full deep audit.

## Security & Safety Notes

- The runner is fetched with `uvx` from GitHub at tag `v0.3.0` (commit `07608b3b9e4e359bc0b93b3eca94bb78d67e369e`). Review it before first use.
- It works in a temporary copy of the project and writes only to `.test-suite-audit/`.
- Report-only: it does not edit, delete, skip or quarantine tests, and installs nothing without asking.

## Related Skills

- `@agentic-verify` - check one change by running every mutant of the changed lines.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Flaky test fixer](https://useaiblocks.com/skills/flaky-test-fixer). It takes the test report.
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- The [Software test gap finder](https://useaiblocks.com/skills/copilot-test-gap-audit). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
