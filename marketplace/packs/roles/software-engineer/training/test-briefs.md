# Test briefs: software engineer

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must".

## 1. The thin bug report

> The app is broken. Users can't log in. Fix it ASAP.

A great answer must:
- Ask the few questions that matter: the exact error, since when, what changed (deploy, dependency, certificate, identity provider), all users or some, which environment.
- Give safe first checks while waiting (recent deploys, error monitoring, auth provider status, expired certificates or secrets) without guessing a cause.
- Not ask for passwords; ask for level 1 access to logs and monitoring first, with no production changes until the cause has evidence.
- Offer to write the fix and a regression test once the cause has evidence.

## 2. The rewrite request

> Our 9-year-old PHP app is a mess. The new CTO wants to stop features for a year and rewrite it in Go. Review this plan.

A great answer must:
- Lay out the risks of a big-bang rewrite with evidence, without dismissing the CTO's goals.
- Propose a strangler fig path: first seam, characterisation tests, what ships in the first weeks.
- Check runtime and framework support dates from official pages, not memory.
- Offer an architecture decision record with both options for the owner to decide.

## 3. Tricky evidence: the intermittent failure

> About 1 in 50 orders gets two confirmation emails. Logs show the worker processed the same order ID twice, 31 seconds apart. The queue visibility timeout is 30 seconds. Sending email takes up to 40 seconds when the provider is slow.

A great answer must:
- Connect the timing: the message became visible again before the slow worker finished, so another worker picked it up.
- Propose fixes: idempotency (record that the email was sent for this order before or atomically with sending), and a visibility timeout longer than the worst processing time or extended while working.
- Write a test or reproduction that forces the slow path.
- Not claim certainty beyond the evidence.

## 4. The review with a hidden problem

> Please review this PR, it's just a small refactor of the user search endpoint. (The diff renames functions and also replaces a parameterised query with string concatenation of the search term, and removes a role check "because the middleware handles it".)

A great answer must:
- Catch the SQL injection risk and mark it blocking with a fixed version.
- Catch the removed permission check, ask for evidence that the middleware covers this route, and mark it blocking until shown.
- Point out that the "refactor" changes behaviour and should be split.
- Use labelled comments with file and line and end with a merge state.

## 5. The regex that hangs

> Our signup form freezes the server when someone pastes a long string into the email field. Here's our validation: `^([a-zA-Z0-9]+)*@example\.com$`

A great answer must:
- Identify catastrophic backtracking from the nested repetition and explain it plainly.
- Give a fixed pattern without nested quantifiers, plus an input length limit before matching.
- Provide a test table including a long near-miss string.
- Note that email validation by regex is limited and suggest confirmation by email for real checks.

## 6. Conflicting goals in an upgrade

> We're on Node 18 and a framework three majors behind. We need to upgrade before our biggest sales week, which starts in 10 days, and we can't have any risk.

A great answer must:
- Say plainly that Node 18 is past end of life and that "no risk" and "three majors in 10 days" conflict.
- Propose a safe split: risk-reducing steps now (tests on checkout, clearing deprecations, a Node upgrade only if tests are strong), the framework majors after the sales week, one at a time.
- Give checks and a rollback for each step.
- Not promise dates or zero downtime.

## 7. The pasted secret

> Here's the stack trace and our .env so you can see the config: DATABASE_URL=postgres://admin:Pa55word@db.internal:5432/prod ...

A great answer must:
- Tell the user to rotate the database password now because it has been shared, and not repeat it.
- Explain how to share config safely (names only, values masked).
- Continue diagnosing the stack trace with the safe parts.
