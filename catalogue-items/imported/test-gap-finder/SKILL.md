---
name: test-gap-finder
description: Takes a code change (a git diff, a branch or pasted hunks) and the project's tests, lists every behaviour the change adds or alters (new branches, error paths, boundaries, new parameters, removed guards), marks each as Covered (citing the test), Not covered, or Unknown, and proposes concrete test cases for the gaps with inputs and expected results taken from the code. It never states a coverage percentage and never claims a test passes unless it ran. Works with a shell or with pasted diff and test files. Use when the user says "what tests am I missing", "test gaps for this diff", "is this change covered", "what should I test before merging", or provides a diff or branch.
---

# Test Gap Finder

You read a change and the tests around it, and say what the change does that no test checks. The output is a short list of behaviours and the tests to add. You are not a coverage tool.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A test report** (yours): what was tested, what passed, what failed and why.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A test report** with the [Change impact checker](https://useaiblocks.com/skills/change-impact-checker). Bring a codebase, your question (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a code change, a codebase, a test report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Input
- **Required:** a change (a diff, a branch against its base, a commit) **and** access to the project's tests, or the relevant test files pasted.
- **Optional (don't ask; use defaults):** the test framework (default: detect from the repo), what the change is for (default: infer from the diff and the commit message, and say so).

## Step 1: Get the change and the tests
If you have a shell and the repo: `git diff <base>...<head>` (or `git show <commit>`), then find the tests that mention the changed files or functions by searching test directories for the changed names and file paths.
**Fallback.** If you have no shell or repo, ask the user to paste the diff and the test file(s) that sit nearest the changed code, and say which files you could not see. Everything you cannot see is Unknown.

**Stop condition.** If you cannot see both the diff and at least one test file, say which one is missing and stop. Do not mark any behaviour Covered without having read a test.

## Step 2: List the behaviours
Go hunk by hunk. For each, write the behaviour in one plain sentence, in the code's terms. Look for: new or changed branches and conditions; new error paths and thrown errors; boundaries (empty, zero, one, maximum, off by one); new or changed parameters, options and defaults; removed checks or guards; changed return values or side effects; concurrency, ordering and retry changes; and changes to public interfaces.

## Step 3: Check each behaviour against the tests
Search the tests for something that would fail if this behaviour were wrong. Mark:
- **Covered:** a named test exercises this behaviour and asserts on its result. Cite file and test name.
- **Not covered:** you searched and found no test that exercises it. Say what you searched.
- **Unknown:** you could not see the tests that would cover it, or the test touches the code but does not assert on this behaviour.
A test that only calls the function without asserting on the new behaviour is not coverage.

## Step 4: Propose tests
For every Not covered and Unknown behaviour that matters, one test case: a name, the setup, the input, the expected result (from the code, with the line you took it from), and why it matters. Rank by risk: data loss, security, money, public interface first. If the project's framework is clear, give a skeleton in that framework for the top three. Say plainly if a case needs an answer from the author because the code does not say what should happen.

## Output
1. One line: what the change does, as you understood it.
2. A table: behaviour, status, evidence.
3. The proposed tests, ranked.
4. What you could not see.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
- The [Software test gap finder](https://useaiblocks.com/skills/copilot-test-gap-audit). It takes the test report.
- The [Human approval review planner](https://useaiblocks.com/skills/human-review-gate). It takes the test report.
- **Build it** with the [Pull request writer](https://useaiblocks.com/skills/pull-request-writer). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Rules
- Never state coverage as a percentage and never say tests pass unless you ran them.
- Expected results come from the code or its comments, with the line cited. If they come from your assumption, say so.
- Do not edit files or write the tests into the repo unless asked.
