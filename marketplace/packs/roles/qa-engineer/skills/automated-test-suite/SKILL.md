---
name: automated-test-suite
description: Writes automated tests that catch real bugs and do not fail at random, from a case table of rules, boundaries and error cases, at the right level (unit, API or integration, or a few end-to-end browser tests in Playwright or Cypress), with isolated data, frozen time, mocked outside services, role-based locators and web-first waits, plus the run command, the expected pass and fail count and a "not covered yet" list. Use it for unit tests on pasted functions, end-to-end tests of sign-up, booking or checkout on a named local or staging site, tests that pin behaviour before a refactor, a starter setup for an untested project, or fixing flaky tests.
---

# Automated test suite

## When to use

- A function, route or flow has no tests and must not break again.
- A key flow (sign-up, booking, checkout) needs end-to-end browser tests on a local or staging site.
- Code is about to be refactored and its current behaviour must be pinned first.
- A project has no test setup at all.
- The suite fails at random and nobody trusts it.

Reading code and existing tests needs level 1. Writing tests on a branch, running them against the environments you name and opening a pull request needs level 2. Merging and adding tests as required checks needs level 3, within your limits. Tests never point at production unless you give a fresh yes for a read-only smoke check; anything that writes to production needs a fresh yes each time.

## What you need

1. The code (or repository access), and the rules it should follow. If there are no written rules, say so.
2. The language, framework and existing test tools, from the dependency file.
3. One existing test, if any, so new tests match its style.
4. For browser tests: the URL of the named environment, test accounts you created, and how test data is reset.
5. For payment flows: the provider's test mode and test cards. Never live keys or real cards.
6. The run command and CI setup, if any.

## Steps

### 1. Write the rules as sentences

One sentence per behaviour, starting with "it": "it charges £4 for deliveries under 3 miles". If the code has no written rules, describe what it does now and ask which parts are right. Never write a test that locks in a bug as if it were the plan; mark it as a known bug instead.

### 2. Build the case table

For each rule: valid input, empty input, values just below, on and above each limit, wrong types, repeated input, very large input, and dates near month and year ends or clock changes. Columns: rule, input, expected result, test name. Mark known bugs as expected to fail until fixed (Playwright `test.fail()`, pytest `xfail`).

### 3. Pick the level for each case

- Logic (prices, dates, validation): unit tests.
- Routes, database and service calls: integration or API tests. Playwright's request API can call your server directly, set up data before a browser test and check results after it [Playwright API testing docs]. Where services depend on each other, suggest contract tests (Pact) rather than more end-to-end tests.
- Only the few user flows that matter most: end-to-end browser tests.

Push every case as low as it can go; browser tests are the slowest and most brittle.

### 4. Write each test in three parts

Set up, act, check. One behaviour per test, named in plain words. For browser tests:

- **Playwright (1.65 as of November 2026):** `getByRole`, `getByLabel` or `getByTestId` locators; web-first assertions such as `await expect(locator).toBeVisible()`; isolated contexts; `page.route` to mock outside services; traces on first retry in CI.
- **Cypress (16.2.1 as of November 2026):** `data-*` attributes or `cy.getByRole()`; set state with `cy.request()` instead of clicking through the UI; route aliases instead of fixed waits; a `baseUrl`. Cypress 16 needs Node.js 22 or newer.

Match the version in your lock file. With web search connected, I check the framework's release notes live before using a newer feature (`cy.getByRole()` arrived in Cypress 16.2.0). Without it, I stick to features your installed version has and mark anything version-specific.

### 5. Remove causes of random failure

- No fixed sleeps (`waitForTimeout`, `cy.wait(2000)`, `sleep`). Wait for an element, a response or a state.
- Freeze time and seed random values.
- Each test creates and cleans its own data; clean before a test rather than after it.
- No test depends on another or on run order. Run with Playwright's `--shuffle` or in random order to prove it.
- Mock only what sits outside your code (email, payments, other APIs) and name each mock. Use the payment provider's test mode for real checkout runs, with a different test card for each independent scenario.

### 6. Fix flaky tests from evidence

Collect the failure trace or video, the retry history and the timing. Classify the cause: asynchronous wait, shared data or order, time, outside service, concurrency or resource leak. Fix that cause. If it can't be fixed today, quarantine it with an owner and a date; never just raise the retry count.

### 7. Run and report

Level 2: run the tests where my AI tool can run commands, against the named environment, and share the output. Otherwise give the exact install and run commands. State how many tests should pass and which should fail (known bugs). Open a pull request with the tests and a short description.

### 8. Self-check

Every function, route, selector and fixture used exists in the code shared. Every import is real for the stated versions. No secrets or real customer data in tests.

## Checks before handing over

- Test names are plain sentences; each test checks one behaviour.
- Boundary cases sit just below, on and just above every limit.
- No fixed sleeps; time and randomness are controlled.
- Tests pass alone and in any order.
- Selectors are role-based or dedicated test attributes, not styling classes.
- The environment is one the client named; no production writes.
- The expected pass and fail count is stated, and known bugs are marked.
- A "not covered yet" list closes the hand-over.

## Output format

1. Rules as sentences, with questions for unclear ones.
2. Case table: rule, input, expected, test name, level.
3. Test files in code blocks, with file paths.
4. Setup: install command, config, fixtures, how data is reset.
5. Run command and expected result ("14 pass, 1 expected failure: BUG-23").
6. Flaky-risk notes, if any.
7. Not covered yet.

## Example of good output (short)

*Illustrative structure, not a real business: a bike courier with a delivery fee function: £4 under 3 miles, £6 from 3 up to 6 miles, free for orders over £40, no deliveries over 10 miles. Copy the shape, never the content: every fact comes from the client's own context.*

> **Question:** the rules don't say what happens between 6 and 10 miles. The code charges £6. Is that right?
>
> Excerpt from the 12-case table:
>
> | Rule | Input | Expected | Test name |
> |---|---|---|---|
> | Under 3 miles | 2.99 mi, £20 | £4 | it charges £4 just under 3 miles |
> | From 3 miles | 3.00 mi, £20 | £6 | it charges £6 at exactly 3 miles |
> | Free over £40 | 5 mi, £40.01 | £0 | it is free just over £40 |
> | Not free at £40 | 5 mi, £40.00 | £6 | it charges at exactly £40 |
> | Limit | 10.01 mi, £20 | error "Out of range" | it refuses just over 10 miles |
>
> ```python
> def test_it_charges_six_pounds_at_exactly_three_miles():
>     assert delivery_fee(miles=3.00, order_total=20.00) == 6.00
> ```
>
> **Run:** `pytest tests/test_delivery_fee.py` should give 11 passed, 1 skipped (the 6 to 10 mile test waits for your answer).
>
> **Not covered yet:** rounding of distances from the maps service; currency other than pounds.
