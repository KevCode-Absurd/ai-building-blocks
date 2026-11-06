# Flaky test cleanup

**Cadence:** monthly, or straight away when builds are retried until green or the team starts ignoring red builds. Half a day to a few days.

**Access:** level 1 to read CI history, retry data and test reports; level 2 to fix tests on a branch and open pull requests; level 3 to merge fixes and move tests in or out of quarantine within the client's limits.

## Steps

1. **Measure (level 1).** From CI history, list tests that failed and then passed on retry, or that fail on some runs of the same commit. Playwright labels these "flaky"; Cypress Cloud shows a flaky badge and flake rate. Rank by how often they fail and how much they block.
2. **Prove order and isolation (level 2).** Run the suite shuffled (Playwright's `--shuffle`) and run the top offenders alone, on the named environment. Note any that change result.
3. **Diagnose.** Run the `flaky-test-diagnosis` prompt for each of the top five, with traces, videos and timing.
4. **Fix the cause (level 2).** Replace fixed sleeps with waits for a condition, isolate data per test, freeze time, seed random values, mock outside services. Open one small pull request per cause. *Approval: a named reviewer on the client's team approves each pull request.*
5. **Quarantine what can't be fixed now.** Move it out of the gating suite with an owner, a ticket and a review date. *Approval: the tech lead agrees each quarantine, because a quarantined test no longer protects a release.*
6. **Merge (level 3).** Merge approved fixes within the limits, and return fixed tests to the gating suite.
7. **Report.** One page: flaky tests at start and end, causes found, fixes merged, tests in quarantine with owners and dates.

## Outputs

- Ranked list of flaky tests with failure counts
- Cause for each investigated test, with evidence
- Pull requests with fixes
- Quarantine list with owners and dates
- Monthly flake report
- Action log

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** merging approved fixes and returning fixed tests to the gating suite.
- **Always needs a new yes:** quarantining a test, raising retry counts, deleting a test, and changing which checks are required.
