---
name: hardening-with-safe-rollout
description: Writes the defensive code and settings small apps often lack - security headers and a Content Security Policy (starting in report-only mode), secure cookie and session settings, password hashing (Argon2id, scrypt, bcrypt or PBKDF2 with OWASP parameters and rehash at next sign-in), sign-in rate limits and lockouts in soft mode, input validation and output encoding, and safe file uploads - each with a one-sentence reason, a defensive test on local or staging, a switch to turn it off, and a rollout plan so real users are not locked out. Drafts changes as pull requests at access level 2; applies them to production at level 3 only with a fresh yes for each change. Use when a review or scanner found missing protections, or before a customer security review.
---

# Hardening with a safe rollout

## When to use

- A review, scanner or customer flagged missing headers, weak password storage, no rate limits or unsafe uploads.
- A small app is preparing for its first enterprise customer.
- After a secure code review, to turn findings into protections.

## What you need

1. The stack and exact versions (for example Django 5.x, Express with Node 22, Laravel 12) and where it is hosted (headers may be set in the app, the web server or the CDN).
2. The relevant code and configuration, with secrets replaced by `XXXX`.
3. What must keep working: payment forms, maps, analytics, embedded videos, single sign-on, mobile apps calling the API.
4. A staging environment, or at least a local one.
5. Access: level 1 to read. Level 2 to open pull requests and apply to staging. Level 3 to apply to production within limits, each production change with a fresh yes.

## Steps

### 1. Write the "not covered" list first

For example: infrastructure, the payment provider's own pages, third-party scripts' internal behaviour.

### 2. Pick the changes that matter for this app

Tie each change to a finding, a line or a setting. Typical set:

- **Content Security Policy.** List every script, style, image, frame and connection source the app really uses (from the code and the browser's network panel on staging). Ship `Content-Security-Policy-Report-Only` first, as a response header (it does not work in a `<meta>` tag), with both `report-to` (plus a `Reporting-Endpoints` header) and `report-uri`, because `report-to` support is incomplete. Collect reports, fix or allow legitimate sources, then switch to the enforcing header.
- **Other headers.** `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, a `Referrer-Policy`, and frame protection (`frame-ancestors` in CSP). Use the framework's own tools (Helmet for Express, Django's security settings, Laravel middleware) where they exist.
- **Cookies and sessions.** `Secure`, `HttpOnly`, `SameSite`, a sensible idle and absolute timeout, a new session ID at sign-in, and server-side logout.
- **Password storage.** Argon2id with at least 19 MiB memory, 2 iterations and parallelism 1; scrypt if Argon2id is unavailable; bcrypt for legacy systems only, work factor 10 or more, with a 72-byte password limit enforced; PBKDF2-HMAC-SHA256 with 600,000 iterations only where FIPS-140 is required. Store the algorithm and parameters with each hash and rehash at the user's next sign-in.
- **Rate limits.** On sign-in, password reset, sign-up and expensive endpoints. Start by logging what would be blocked, then turn on with limits based on the logs, and a clear message for real users.
- **Input and output.** Validation schemas at each route (types, lengths, allowed values), parameterised queries, framework escaping in templates.
- **Uploads.** Allowed types checked by content, not only by name; size limits; random file names; storage outside the web root or in object storage; no execution.

### 3. Write each change in full

For the exact stack and version: the configuration or code, where it goes, and one or two plain sentences on what it stops and what it does not.

### 4. Add a switch

Each blocking change can be turned off by configuration without a new release, so a problem in production is a setting change, not an emergency deploy.

### 5. Write a defensive test for each

On local or staging: a header that should be present, a request without a session that should be refused, a sixth sign-in attempt in a minute that should be slowed, a `.php` file renamed `.jpg` that should be rejected. No attack payloads beyond what proves the protection works on the client's own system. Tests in the app's own test suite, run locally or in CI, are normal development; running checks against a deployed staging site needs the owner's written authorisation and scope first.

### 6. Roll out

Level 2: pull request, apply to staging, run the tests, and watch reports and logs for at least one normal business cycle the client chooses. Level 3: show the production change list with what each stops, the tests, the switch and the rollback; get a fresh yes for each production change; apply; watch error rates and CSP reports; stop and ask if real users are blocked.

## Checks

- Every change is tied to a finding or a line.
- Each change has a reason, a test, a switch and a rollout mode.
- CSP started in report-only mode, sent as a header.
- Password parameters match the current OWASP cheat sheet, with the check date.
- Nothing blocks a must-keep-working feature in staging.
- Production changes had a fresh yes and a rollback.
- Nothing claims the app is now secure.

## Output format

1. Not covered.
2. Change table: change, what it stops, file, test, switch, rollout mode, production status.
3. Code and configuration blocks per change.
4. Rollout plan with dates and watch points.
5. Report or log review after staging.

## Example of good output (short)

*Illustrative structure, not a real business: a letting agency's Django 5.1 tenant portal. Copy the shape, never the content: every fact comes from the client's own context.*

> Not covered: the hosting provider's network settings and the payment provider's hosted page.
>
> | Change | What it stops | Test | Switch | Mode |
> |---|---|---|---|---|
> | CSP report-only allowing self, the payment provider's script and the maps tiles | Reports scripts from anywhere else, so injected scripts are spotted before enforcing | Header present on `/account/`; report arrives for an inline test script on staging | `CSP_REPORT_ONLY=True` | Report-only for two weeks, then enforce |
> | `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `SESSION_COOKIE_SAMESITE="Lax"` | Session cookie sent over plain HTTP or read by page scripts | Cookie flags present in the response | Settings per environment | On in staging now |
> | Argon2 first in `PASSWORD_HASHERS`, old hashers kept | Weak stored hashes; users upgraded at next sign-in | New user's hash starts with `argon2` | Hasher order | Production change waiting for your yes |
