---
name: secure-code-review
description: Reviews code, configuration and designs that the client owns for the gaps behind most break-ins, in OWASP Top 10:2025 order of value - access control and IDOR, sign-in and sessions, injection and output encoding, secrets, error handling that fails open, misconfiguration and missing logging - and ties every finding to a file and line with how it could be misused (in general terms), severity, a fix and a defensive test. Confirms ownership and scope first, writes a "not covered" list, uses static analysis (CodeQL, Semgrep) only as leads, and never writes exploit code or repeats a secret. Reads at access level 1; opens fix pull requests with tests at level 2; merges at level 3 only with a fresh yes for each production change. Use for a pull request, an API, AI-written code, or before a customer's security review.
---

# Secure code review

## When to use

- Before a release, or on a pull request that touches sign-in, permissions, payments, uploads or personal data.
- When an app or API was written quickly or largely by AI and nobody has checked its security.
- Before a first enterprise customer's security review.
- When a scanner report needs a human to confirm which findings are real.

General code quality (naming, design, tests in general) belongs to the software engineer kit's `code-review` skill. This skill looks only at security.

## What you need

1. Confirmation that the client owns the code, or has written permission from the owner.
2. What the app does, who signs in (customers, staff, admins), and what data it holds.
3. The code to review (repository access or pasted files), with configuration files where secrets are replaced by `XXXX`.
4. Framework, language and versions.
5. Any scanner output (CodeQL, Semgrep, npm audit) or a customer's findings.
6. Access: level 1 to read and run analysis on a copy. Level 2 to open pull requests with fixes and tests. Level 3 to merge within limits, each production change with a fresh yes.

## Steps

### 1. Confirm ownership and scope

First line of the report: who owns the system and what is in scope (repositories, folders, services). Anything I cannot see becomes a question, not a finding. Write the "not covered" list now (for example: infrastructure, third-party services, mobile app).

### 2. Map the attack surface

List the entry points: routes and API endpoints, background jobs, webhooks, file uploads, admin screens, and calls to AI models. For each: who may call it and what data it touches.

### 3. Review in order of value

1. **Access control.** For every route that takes an ID, check the server confirms the signed-in user may access that object. Check admin routes on the server, not only in the menu. Look for checks in the front end only. Deny by default.
2. **Sign-in and sessions.** Password hashing (Argon2id preferred, bcrypt only for legacy with its 72-byte limit), reset flows that cannot be replayed, session expiry, cookie flags (`Secure`, `HttpOnly`, `SameSite`), rate limits on sign-in and reset.
3. **Injection and output.** Queries built from strings, shell commands with user input, templates without escaping, file paths from user input, uploads checked only by extension.
4. **Secrets.** Keys in code, configuration, front-end bundles, Dockerfiles, logs and history. Never repeat the value; name the type and location.
5. **Errors.** Error messages that leak stack traces or queries; `catch` blocks in security checks that let the request continue.
6. **Configuration and logging.** Debug mode, default credentials, permissive CORS, missing security headers; whether failed sign-ins and denied requests are logged and someone is alerted.
7. **AI features.** If the app calls a model: untrusted text reaching the prompt, model output used without checks, and tools that let the model act on user data (excessive agency).

### 4. Use tools as leads

Run or read CodeQL, Semgrep or similar on a copy. Confirm each result in the code; drop false positives with a reason. If the language is not supported (CodeQL does not support PHP, for example), say so rather than reporting "no findings".

### 5. Write each finding

- **Where:** file and line.
- **Issue:** one sentence.
- **How it could be misused:** in general terms, without attack steps or payloads.
- **Severity:** Critical, High, Medium or Low, with the reason (who can reach it, what they get).
- **Fix:** the code change in full, for the stack and version.
- **Test:** a defensive test that fails before the fix and passes after (for example, user B requests user A's order and gets 403).

### 6. Rank and hand over

Rank by ease of abuse and impact: anything that exposes other users' data or needs no sign-in first. At level 2, open a pull request per fix or per area with its tests. At level 3, merge only after the client's fresh yes for each production change, with a rollback ready.

## Checks

- Ownership and scope are stated in the first line.
- Every finding has file, line, severity basis, fix and test.
- No exploit code, payloads or attack steps appear.
- No secret value appears, even partly.
- Tool findings were confirmed or dismissed with a reason.
- The "not covered" list is present.
- Nothing claims the code is secure.

## Output format

1. Ownership and scope line.
2. Not covered.
3. Top three findings in plain words.
4. Findings table: ID, area, file and line, issue, misuse (general), severity and basis, fix, test.
5. Fix code blocks, one per finding.
6. Tool results confirmed or dismissed.
7. Next areas worth checking.

## Example of good output (short)

*Illustrative structure, not a real business: a physio clinic's Express API for patient bookings. Copy the shape, never the content: every fact comes from the client's own context.*

> Owner confirmed: [Business]. Scope: `api/` folder. Not covered: hosting, the SMS provider, the mobile app.
>
> | ID | Area | Where | Issue | Severity | Fix | Test |
> |---|---|---|---|---|---|---|
> | F1 | Access control | `routes/bookings.js:42` | `GET /bookings/:id` returns any booking; no check that it belongs to the signed-in patient | High: any patient can read others' bookings by changing the number | Look up with `{ id, patientId: req.user.id }`; return 404 if none | Patient B requests Patient A's booking and gets 404 |
> | F2 | Errors | `middleware/auth.js:18` | `catch` logs and calls `next()`, so a bad token passes | High: fails open | Return 401 in the `catch` | Malformed token gets 401 |
> | F3 | Secrets | `config.js:7` | SMS provider key in code (value not repeated) | High | Revoke and rotate at the provider; read from the secret store | Startup fails without the variable |
