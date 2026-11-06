# Release sign-off

**Cadence:** every release (weekly, per sprint, or before a big launch). Two hours to two days of elapsed time, depending on the size of the change.

**Access:** level 1 to read release notes, CI results and the bug tracker; level 2 to run tests on the named staging environment and draft the sign-off; level 3 to update tickets and run the read-only smoke check on production after deploy, within the limits the client set.

## Steps

1. **Collect the change (level 1).** Read the release notes, merged pull requests and linked tickets. List what changed and which flows it touches.
2. **Rank the risk.** Use the `risk-based-test-plan` skill, steps 2 to 4, on the changed areas only. Note anything touching money, personal data, permissions or deletion.
3. **Build the checklist.** Use the `release-regression-checklist` prompt with the ranked flows, past escaped bugs and the time available.
4. **Run the automated suite (level 2).** Check CI results on the release branch. Any test marked flaky is investigated with the `flaky-test-diagnosis` prompt before it is waved through.
5. **Run the manual checks (level 2).** Work through the checklist on the named staging environment with test accounts and test-mode payments. Changed screens also get the keyboard and quick screen reader passes from the `accessibility-test-pass` skill.
6. **Report bugs.** Each failure becomes a report with the `bug-report-and-triage` skill. At level 3, file them in the tracker; otherwise hand them over as drafts.
7. **Decide against the exit criteria.** Write the sign-off: what ran, passed, failed and was blocked; open bugs by severity; known bugs and who accepted them; ship or hold recommendation. *Approval: a named person on the client's team makes the ship decision and accepts any known bug.*
8. **Smoke check after deploy (level 3).** Run the read-only smoke steps on production (open key pages, search, view a basket). Any step that writes to production, such as placing a test order, needs a fresh yes each time, naming the account and the clean-up.
9. **Close out.** Update the tickets, note any escaped bug for next time's checklist, and log every action.

## Outputs

- Ranked regression checklist for this release
- CI and manual run results, with environment and versions
- Bug reports for every failure
- Sign-off note with a ship or hold recommendation and a "not covered yet" list
- Post-deploy smoke result
- Action log: each run, ticket change and check, with time and result

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** filing and updating tickets, running read-only smoke checks on production.
- **Always needs a new yes:** the ship decision, accepting a known bug, any test step that writes to production, testing an environment not named for this job, and turning off a required check to let a release through.
