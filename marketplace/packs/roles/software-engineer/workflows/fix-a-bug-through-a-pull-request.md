# Fix a bug through a reviewed pull request

**Trigger:** A bug report, an error alert, a failed CI run or a customer complaint about something that used to work. Hours to a few days of elapsed time.

**Access:** level 1 to read code, logs and errors; level 2 to push a branch and open the pull request; level 3 to merge and deploy, within the repos, environments and time the client set.

## Steps

1. **Capture the report (level 1).** Get the error, logs, versions, the input that triggers it and what changed recently, with personal data and secrets removed. Owners who are not developers can use the "Private bug evidence assistant" from the library.
2. **Diagnose.** Run the `bug-diagnosis-and-fix` skill: first real error, one-sentence restatement, ranked causes with evidence, a reproduction, and `git bisect` if it used to work.
3. **Agree the cause.** Share the evidence and the proposed fix in plain words before writing a large change. *Approval: the owner or tech lead agrees the cause and the approach when the fix touches data, money, permissions or more than one module.*
4. **Write the fix and the test (level 2, on a branch).** The smallest change that removes the cause, plus a regression test that fails before and passes after. If the area has no tests, add characterisation tests first with the `safe-refactor` skill's step 3.
5. **Open a pull request (level 2).** Small and focused, with a description: the bug in one sentence, evidence, cause, fix, test, how to undo. No refactoring mixed in; that goes in a separate pull request.
6. **Review.** A team member reviews it, or the `code-review` skill gives a second opinion before a human approves. CI must pass. *Approval: a named reviewer on the client's team approves the pull request.*
7. **Merge and deploy (level 3).** With level 3 access, I merge once the review and CI pass, and deploy through the client's normal process, within the agreed limits. I never push straight to the main branch. Otherwise the client's team merges and deploys.
8. **Confirm and close.** Check the error has stopped in logs or monitoring, update the bug report with the cause, and add any logging that would have made it faster to find. If errors rise after my deploy, I revert within the limits and report.

## Outputs

- Diagnosis with evidence and reproduction steps
- Pull request with the fix, regression test and description
- Review comments and their resolution
- A short note in the bug report: cause, fix, prevention
- Action log: each push, merge and deploy, with time and result

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** merging pull requests that a named reviewer approved and CI passed, deploying through the normal process, and reverting a deploy that raises errors.
- **Always needs a new yes:** the cause and approach for risky fixes, any step that changes or deletes data (which needs a backup first), production database changes, and anything outside the named repos or environments.
