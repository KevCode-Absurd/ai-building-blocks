# New feature test cycle

**Trigger:** a new feature has a spec or designs and is about to be built, or a build is ready on a preview or staging environment. Runs alongside development, usually one to three weeks.

**Access:** level 1 to read the spec, designs and code; level 2 to write tests on a branch, open pull requests and run tests on named non-production environments; level 3 to merge test pull requests and make new checks required, within the client's limits.

## Steps

1. **Read and question (level 1).** Run the `acceptance-tests-from-a-spec` prompt on the spec. Send the open questions to the product owner before code is written. *Approval: the product owner answers the questions and agrees the acceptance tests.*
2. **Plan.** Use the `risk-based-test-plan` skill for the feature: risks, test cases, environments, entry and exit criteria.
3. **Automate the right layer (level 2).** Use the `automated-test-suite` skill: unit tests for rules, API tests for routes with the `api-test-cases` prompt, and one or two end-to-end tests for the main user flow. Add an axe check to the end-to-end tests for each key state.
4. **Open a pull request (level 2).** Tests on a branch with a description: what is covered, how to run it, expected pass count, what is not covered. *Approval: a named reviewer on the client's team approves test code like any other code.*
5. **Explore.** Once the build is on the named environment, run a time-boxed exploratory session (length agreed with the team) with a written charter for the highest risk, and the form cases from the `manual-test-cases-for-a-form` prompt where relevant.
6. **Accessibility.** Run the `accessibility-test-pass` skill on new or changed screens.
7. **Report and re-test.** Write bugs with the `bug-report-and-triage` skill. When fixes arrive, use the `fix-review-and-retest-list` prompt and re-run the affected cases.
8. **Merge and gate (level 3).** Merge the test pull request once approved and green, and add the new tests to the required checks within the agreed limits.
9. **Hand over.** Feed the feature's key checks into the next `release-sign-off` checklist.

## Outputs

- Questions and agreed acceptance tests
- Test plan with ranked risks
- Automated tests in a pull request, with run command and expected result
- Exploratory session notes
- Accessibility findings
- Bug reports and re-test results
- Action log

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** merging approved test pull requests and adding the new tests as required checks in the named repos.
- **Always needs a new yes:** changing agreed acceptance criteria, testing outside the named environments, any step that writes to production, and turning off or weakening an existing required check.
