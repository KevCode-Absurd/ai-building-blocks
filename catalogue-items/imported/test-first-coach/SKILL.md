---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes that loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns, and the rules of the loop. Every section applies on every cycle: consult them before and during the loop, not after.

When exploring the codebase, read `GLOSSARY.md` (if it exists) so test names and interface vocabulary match the project's domain language, and respect ADRs (written decision records) in the area you're touching.

**Do not use when:** the code cannot run tests in this session, the task is a one-off script, or the user only wants tests added to code that already works (write those after the fact and say so). Say which case applies and stop.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can read your repo, run your tests and show real failures and passes.
- **Any good chat AI:** Works if you run the tests yourself and paste back the result after each step.
<!-- /needs -->

## What you need

Ask once, in one message, for anything missing:

1. The feature or bug, in plain words. For a bug: what happens now and what should happen.
2. Access to the code, and the test framework and command that runs the tests (for example `npm test` or `pytest`).
3. A project glossary (optional).

If you cannot run the tests yourself, write each test and fix as text, then tell the user the exact command to run and ask them to paste the result before you go on. Never say a test passed or failed unless you saw it run.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?" Give each proposed seam a one-line note on what it catches and what it misses.

If the shape of the interface is itself in question (where the boundary belongs, what the module should expose), settle that with the user first, in plain words, before any test. Prefer a small interface with a lot of behavior behind it over many thin ones.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead: one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Steps

1. **Read the code.** Find the area, the existing tests and the glossary. Do not change anything yet.
2. **Agree the seams.** Propose them as above and wait for the user's yes.
3. **List the behaviors.** Write the behaviors to build as short plain lines, in the order you will do them. Show the list. The user may reorder or cut it.
4. **Run one slice at a time**, in this order:
   - **Red:** write one failing test at an agreed seam. Run it. Show the failure and check it fails for the right reason (the behavior is missing, not a typo or an import error).
   - **Green:** write only enough code to make that test pass. Run the whole test file. Show that it passes.
5. **Stop after each slice** and report it in the format below. Continue to the next behavior only when the user says go, or if they said "run them all" up front.
6. **At the end,** list what is covered, what was left out on purpose, and suggest a review pass (see Next steps).

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage, not the red → green implementation cycle. Do not tidy code in the middle of a slice.
- **Never weaken a test to make it pass.** If a test is wrong, say so, fix the test on purpose, and show the change.

## Output

For each slice, return:

1. **Behavior:** the one line from your list.
2. **Seam:** the agreed boundary used.
3. **Red:** the test code, and the failure message.
4. **Green:** the code change (a diff or the changed function), and the passing run.

At the end, return a **test report**:

| Behavior | Seam | Test name | Result |
|---|---|---|---|

followed by **Seams agreed**, **Left out on purpose**, and **Next steps**.

## If something is missing

- No test command or framework: ask. Do not guess one.
- The user will not confirm the seams: do not write tests. Say that no test is written at an unconfirmed seam.
- A test passes before you write code: stop, say so, and check whether the behavior already exists.
- The code does not build: say so first. Fixing the build is not a TDD slice.

## Next steps

After the last slice, suggest a review and cleanup pass as a separate step: use the Code change reviewer to check the change against your standards, and the Code habits reviewer to find repeated or tangled code. Then run the full test suite once.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the test report and code change.
- The [Software test gap finder](https://useaiblocks.com/skills/copilot-test-gap-audit). It takes the test report.
- The [GitHub check failure fixer](https://useaiblocks.com/skills/ci-failure-fixer). It takes the test report and code change.
- **Build it** with the [Pull request writer](https://useaiblocks.com/skills/pull-request-writer). It takes the test report and code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
