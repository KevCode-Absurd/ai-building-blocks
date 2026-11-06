---
name: bug-diagnosis-and-fix
description: Diagnoses a crash, error message, wrong result, "works locally but fails on the server" problem or intermittent bug from logs, stack traces and code, using a scientific method (restate, ask what changed, rank causes by evidence, reproduce, test one hypothesis at a time, bisect if it used to work), then writes the smallest fix, a regression test that fails before and passes after, a fallback and an undo step. Works across Python, JavaScript and TypeScript, PHP, C# and Java. Use it for any bug where the cause is not yet proven.
---

# Bug diagnosis and fix

## When to use

- A crash, exception or cryptic error message.
- Code that works on one machine and fails on another, or in CI, or in production.
- A bug that happens only sometimes.
- Something broke after an update or deploy.
- A second opinion on a fix someone else proposed.

Not for recovering deleted data or running a live outage. I work from what you send, or from your tools at the level you grant.

## What you need

1. The full error and stack trace, plus the log lines from just before it. Remove personal data, tokens and keys first.
2. The code at the lines the trace names, and the function that calls it.
3. Versions: language runtime, framework, key packages (the lock file helps), operating system or container image.
4. What should happen and what happens instead, with the input that triggers it.
5. What changed recently: deploys, dependency updates, config, data, time zone, traffic.
6. For "works here, not there": the differences you know of between the two environments.

**Access:** level 1 to read the code, logs and errors; level 2 to reproduce on a branch, push the fix and its test, and open a pull request; level 3 to merge and deploy it, within your limits.

## Steps

### 1. Read the whole error first

Find the first real error, not the last line. In chained exceptions, the root cause is often printed first or under "caused by". Note the file, line, function and the versions involved.

### 2. Restate the bug in one sentence

"When a customer with no saved address checks out, the order service throws `TypeError: Cannot read properties of undefined (reading 'postcode')`, but it should use the billing address." If you cannot write this sentence, ask for more detail before going on.

### 3. Ask what changed

Changes are the best clues. A deploy, dependency bump, new data shape, new device, daylight saving change or a new region. If it used to work, find the last known good version.

### 4. List causes, ranked by evidence

| Cause | Evidence for | Evidence against | How to test |
|---|---|---|---|

Tie each cause to a log line or code line. A cause that needs code or config you have not seen becomes a question.

Common families: null or missing data, type or encoding mismatch, time zone and date handling, rounding, race conditions and shared state, environment differences (versions, environment variables, file paths, permissions, locale), caching, and dependency changes.

### 5. Reproduce on demand

Describe the smallest input and steps that make the bug happen every time. For intermittent bugs, look for timing (concurrency, retries, timeouts), data that only some users have, or time-based logic, and add logging that would separate the hypotheses.

### 6. Bisect if it used to work

If there is a known good commit, use `git bisect` with a test script: exit 0 for good, 1 for bad, 125 to skip commits that do not build. The first bad commit narrows the search fast.

### 7. Test one hypothesis at a time

Predict what you should see if the hypothesis is true, then check. If the prediction fails, drop the hypothesis and move to the next. Do not change several things at once.

### 8. Write the smallest fix

Fix the cause, not the symptom. Do not swallow the error. Show the whole function with the changed lines marked. If the right fix is larger (for example a data migration), give a safe short-term fix and a plan for the real one.

### 9. Write the regression test

A test, in the project's test tool, that fails before the fix and passes after. Name it after the behaviour, not the ticket number. **Level 2:** commit the fix and the test on a branch and open a pull request.

### 10. Add a fallback and an undo

What to log or check next if the fix does not work, and how to revert the change (the commit to revert, the config to restore). Any step that deletes or resets data needs a backup first.

## Checks before handing over

- Every cause cites evidence or is marked as a question.
- Nothing claims the code was run unless you shared the output.
- The fix addresses the cause named, not a different symptom.
- The test would fail on the old code.
- No error is silently swallowed.
- Data-changing steps have a backup first.
- Jargon is explained once for non-developers.
- The fix is proposed as a pull request or patch for your review.

## Output format

1. The bug in one sentence.
2. Evidence: the log and code lines that matter.
3. Causes ranked, with evidence and how each was tested or can be tested.
4. Reproduction steps.
5. The fix (whole function, changed lines marked).
6. Regression test and the command to run it.
7. Fallback logging and undo steps.
8. Pull request title and description.

## Example of good output (short)

*Made-up business for illustration: "Tidewell Laundry", a pickup and delivery app.*

> **Bug.** Since the deploy on 3 November, pickups booked after 11 pm UK time show the next day's date in the confirmation email.
>
> **Evidence.** `email/confirm.py:42` formats `booking.pickup_at.date()`; `pickup_at` is stored in UTC (`models.py:18`). The deploy changed the email server's container image, whose time zone is UTC; the old one was set to Europe/London (`Dockerfile` diff).
>
> | Cause | For | Against | Test |
> |---|---|---|---|
> | Date taken from UTC, not the customer's time zone | Only late-evening bookings affected; container time zone changed | None found | Book at 23:30 London time in staging |
> | Daylight saving change on 26 Oct | Timing | Bug started 3 Nov, after the deploy | Check bookings 26 Oct to 2 Nov |
>
> **Fix.** Convert to the customer's time zone before formatting: `booking.pickup_at.astimezone(ZoneInfo(customer.tz)).date()`.
>
> **Test.** `test_confirmation_date_uses_customer_timezone` books at 23:30 Europe/London and expects that day's date. Fails on main, should pass with the fix (not run by me).
