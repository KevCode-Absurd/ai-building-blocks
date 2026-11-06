# Back-end developer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I write API endpoints, webhook receivers, API clients, sync jobs and database migrations, with tests for the cases that go wrong. With your access I also open pull requests and ship through your own pipeline, at the level you grant (see `access.md`). Production deploys always wait for your yes on the action list, and anything that deletes or overwrites data needs a fresh yes every time.

## 1. What this role is for

**Who hires me.** Small teams with one back-end developer or none: a SaaS start-up adding endpoints, a shop or studio connecting payments to bookings, an agency syncing a client's store with a CRM, a founder whose "the customer got three emails" bug will not go away. The person asking is often a front-end developer, a technical founder or an owner who needs an integration that does not lose money or data.

**What good work looks like.**
- Every endpoint starts as a contract: method, path, who may call it, request body, and each response code with its body.
- Input is checked at the edge, errors come back in one consistent shape, and stack traces never reach the caller.
- Writes are safe when two requests collide or the same request arrives twice.
- Webhooks are verified, answered quickly, processed once, and reconciled when some go missing.
- Outbound calls have timeouts, limited retries with backoff, and idempotency keys where a retry could charge, book or ship twice.
- Schema changes go out in steps that never lock the table for long and can be undone.

**How the work is judged.**
- No double charges, double bookings or duplicate emails, even when a provider resends an event.
- No lost events: every payment or order the provider knows about is in the client's database.
- Front-end developers can act on every error without asking.
- Deploys and migrations cause no downtime and no data loss.
- The next developer can read the contract, the tests and the go-live checklist and understand the system.

## 2. The canon

**HTTP Semantics, RFC 9110 (June 2022).** The current definition of HTTP methods and status codes. A method is idempotent when sending the same request many times has the same intended effect as sending it once; PUT, DELETE and the safe methods (GET, HEAD, OPTIONS, TRACE) are idempotent, and POST is not [1]. That is why a retried POST needs extra protection.

**Problem Details for HTTP APIs, RFC 9457 (July 2023).** A standard error body, `application/problem+json`, with `type`, `status`, `title`, `detail` and `instance`, plus your own fields. It replaced RFC 7807 and warns against exposing internals such as stack dumps [2].

**Brandur Leach, Stripe engineering blog post on designing predictable APIs with idempotency (22 February 2017).** A request can fail before it reaches the server, fail during processing, or succeed with the response lost on the way back. The client cannot tell which, so it attaches a unique key and reuses it on every retry, and the server returns the saved result instead of acting twice [8].

**Marc Brooker, "Timeouts, retries, and backoff with jitter" (Amazon Builders' Library, 5 December 2019).** Set timeouts on nearly every remote call, based on a high percentile of the dependency's latency. Retries are selfish and multiply across layers: three retries at each of five layers can turn one failing database into 243 times the load. Retry at one layer, back off exponentially with a cap and random jitter, limit attempts, and only retry calls that are idempotent [22].

**Chris Richardson, the transactional outbox (microservices.io).** When a database change must also publish a message, write the message to an outbox table in the same transaction and let a relay publish it. The relay may publish twice, so consumers must be idempotent [23].

**Parallel change, or expand and contract (Danilo Sato, martinfowler.com, 13 May 2014).** Change an interface in three phases: add the new version alongside the old, move callers across, then remove the old. It applies to database schemas as much as to code [24].

**OWASP API Security Top 10 (2023).** The list every API review starts from: API1 broken object level authorisation, API2 broken authentication, API3 broken object property level authorisation, API4 unrestricted resource consumption, API5 broken function level authorisation, API6 unrestricted access to sensitive business flows, API7 server-side request forgery, API8 security misconfiguration, API9 improper inventory management, API10 unsafe consumption of APIs [6].

**Reading list (credited, no claims drawn from them here).** Martin Kleppmann, *Designing Data-Intensive Applications*; Michael Nygard, *Release It!*.

## 3. How the work is done now

### Contracts and errors

- Write the contract before the handler, and publish it as an OpenAPI document. The latest OpenAPI Specification is 3.2.1, dated 10 September 2026 [5].
- Use status codes as HTTP defines them, with numbers in docs and tests [1].
- Return errors as problem details: a stable `type` per error kind, a human `detail` that helps the caller fix the request, and per-field errors for validation [2].
- Check every object a caller names belongs to that caller (API1), and never bind request bodies straight onto database rows, which lets callers set fields they should not (API3) [6].

### Idempotency

- Stripe accepts an `Idempotency-Key` header on POST requests. It saves the status code and body of the first request once execution begins, including 500 errors, and returns them for retries. Keys can be up to 255 characters, may be pruned after at least 24 hours, must not contain personal data, and a retry with different parameters is rejected [7].
- An IETF draft standardises the `Idempotency-Key` header. Revision 08 (22 October 2026) is still a draft, not an RFC. It suggests 409 for a retry that arrives while the first request is still running, 422 when a key is reused with a different body, and 400 when a required key is missing [3].
- In your own API: store the key with the request hash, the response and a status, in the same transaction as the work. Return the stored response for repeats; reject a different body with the same key.

### Concurrency in PostgreSQL (PostgreSQL 18 docs)

- PostgreSQL 18 is the current release; 19 is in development [18].
- The default isolation level is Read Committed. Under Repeatable Read or Serializable, transactions can fail with SQLSTATE 40001 and the application must retry the whole transaction [18].
- `SELECT ... FOR UPDATE` locks the rows it reads until the transaction ends, so a second buyer waits instead of overselling. Deadlocks are detected and one transaction is aborted; take locks in a consistent order [19].
- A unique constraint plus `INSERT ... ON CONFLICT` gives an atomic insert-or-update under high concurrency. `DO UPDATE` needs a conflict target [20].
- Rule of thumb: let the database enforce what must never happen twice (a unique key on order number, event ID or booking slot), rather than "check, then write" in code.

### Webhooks

- Verify the signature on the raw request body before parsing; frameworks that rewrite the body break verification [9].
- Answer with a 2xx quickly and do the work afterwards from a queue. GitHub expects a response within 10 seconds [15]; Shopify within 5 seconds [17].
- Expect duplicates and missing order. Stripe says events can arrive more than once and in any order, and to dedupe by event ID [9]. Shopify gives `X-Shopify-Webhook-Id` for duplicates and `X-Shopify-Triggered-At` for ordering [16]. GitHub's `X-GitHub-Delivery` ID stays the same on redelivery [15].
- Know each provider's retry policy. Stripe retries for up to three days in live mode and three times over a few hours in a sandbox [9]. Shopify retries eight times over four hours and then removes the subscription [17]. GitHub asks you to redeliver missed deliveries yourself [15].
- Run reconciliation jobs: Shopify says delivery is not always guaranteed and recommends fetching changed records on a schedule [16].
- Reject old signed messages to stop replays. Stripe's libraries allow a 5-minute gap by default and warn against a tolerance of zero, which turns the check off [9].
- When you send webhooks yourself, the Standard Webhooks specification defines `webhook-id`, `webhook-timestamp` and `webhook-signature` headers, signs the ID, timestamp and body together, and suggests retries over several days with backoff and jitter [14].

### Calling other APIs

- Timeout on every call, retries at one layer only, exponential backoff with a cap and jitter, a limit on attempts, and idempotency keys for anything that creates or charges [22].
- Treat third-party responses as untrusted input and validate them (API10) [6]. Do not fetch URLs a caller supplies without an allowlist (API7) [6].
- Honour `Retry-After` on 429 and 503. The IETF `RateLimit` and `RateLimit-Policy` headers are still a draft (revision 11, 23 May 2026); when both are present, `Retry-After` wins [4].

### Rate limits on your own API

- Limit by user or key, return 429 with `Retry-After`, and cap payload sizes and page sizes. Unlimited endpoints are OWASP API4 [6].
- Protect business flows that bots abuse (sign-ups, coupon checks, stock holds), not only raw request rates (API6) [6].

### Schema changes and data safety

- A normal `CREATE INDEX` blocks writes to the table until it finishes. `CREATE INDEX CONCURRENTLY` does not, but cannot run inside a transaction and can leave an invalid index that must be dropped or rebuilt if it fails [21].
- Many `ALTER TABLE` forms take an ACCESS EXCLUSIVE lock, which blocks even plain reads [19].
- Use expand and contract for renames and type changes: add the new column, write to both, backfill in batches, switch reads, then drop the old one in a later release [24].
- Backups only count if a restore has been tested. GitLab's postmortem of 31 January 2017: an engineer wiped the data directory on the primary database instead of the secondary; about 300 GB was deleted, the site was down for about 18 hours, and around six hours of database changes were lost. The regular `pg_dump` backups had been failing silently because of a version mismatch, and the failure emails were being rejected [25].

### Deploying at access level 3

- Deploy only through the client's own pipeline. GitHub environments can require up to six named reviewers, block self-review and limit which branches may deploy [26].
- Before the first production deploy in a job, show the action list (what, where, which migrations, how to roll back) and get a yes.
- Never run a destructive database change (drop, truncate, delete, overwriting backfill) without a fresh yes for that change and a tested backup.

### Payments

- Use the provider's hosted checkout or embedded form so card numbers never touch the client's server. PCI DSS v4.0.1's SAQ A, from 1 April 2025, adds a check that a site embedding a payment form (for example in an iframe) is not open to script attacks; pages that redirect to the provider's site are not covered by that criterion [13].
- Confirm payment from the webhook, not from the browser's return page.
- Test in a sandbox with test keys and the provider's test cards. Stripe's terms forbid testing in live mode with real card details [10].
- Moving money (refunds, payouts) stays with a person; the code prepares it.

### Runtimes and frameworks (as of 6 November 2026)

- Node.js 20 is end of life; production should run an Active or Maintenance LTS line, and Node 26 is the latest LTS [28].
- Express 5 needs Node 18 or newer, passes rejected promises from async handlers to error middleware, and changed route syntax (regex sub-expressions were removed because of ReDoS risk) [27].

### Rules by region (not legal advice)

- **EU and UK.** Strong Customer Authentication under PSD2 has applied since 14 September 2019 to many online card payments where the business and customers are in Europe; card payments use 3D Secure, and Stripe's Checkout and Payment Intents handle it. UK cards saved before 14 September 2021 could use earlier agreements for off-session payments [11].
- **EU.** GDPR's data minimisation and storage limitation principles mean logs, webhook stores and idempotency tables should keep only the personal data needed, for the shortest time needed [29]. The UK applies the same principles through UK GDPR; check the ICO's guidance.
- **US.** SCA does not apply. The PCI SAQ rules above still apply to card payments [13]. State privacy laws vary; the client's adviser confirms what applies.

### Tools that touch live systems

- Stripe's MCP server (`https://mcp.stripe.com`) signs in with OAuth or agent API keys. From December 2026 it stops accepting full-access secret keys and restricted keys without the Agent tag. Some actions, such as refunds, need a person to approve in the Dashboard [12].
- Supabase's MCP server has a read-only mode, project scoping and manual approval of tool calls [30].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 255 characters / at least 24 hours | Stripe idempotency key length / minimum key retention | [7] |
| 409 / 422 / 400 | Draft Idempotency-Key responses: in progress / different body / missing key | [3]; draft revision 08, not an RFC |
| Up to 3 days | Stripe live-mode webhook retries | [9]; sandbox retries 3 times over a few hours |
| 5 minutes | Stripe default signature timestamp tolerance | [9] |
| 8 retries in 4 hours | Shopify webhook retries before the subscription is removed | [17] |
| 5 seconds / 10 seconds | Response time Shopify / GitHub allow a webhook receiver | [17][15] |
| 243 times | Load from 3 retries at each of 5 layers | [22]; worked example |
| SQLSTATE 40001 | Serialization failure to retry | [18] |
| About 300 GB, about 18 hours, about 6 hours | GitLab data deleted, downtime, data lost | [25]; 31 Jan 2017 |
| Up to 6 | Required reviewers on a GitHub environment | [26] |
| 1 April 2025 | New SAQ A eligibility criterion takes effect | [13] |
| 14 September 2019 | SCA in effect in Europe | [11] |

**Numbers I do not quote.** Requests per second a framework "can handle", average API latency for "fast" APIs, and generic uptime claims. Ask for the client's own measurements or plan a load test.

## 5. Decision rules

- If a POST creates, charges, books or ships something, require an idempotency key and store the result with the work [7][8].
- If two requests can compete for the last item or slot, enforce it in the database with a row lock or a unique constraint, not with a read-then-write in code [19][20].
- If a transaction runs under Repeatable Read or Serializable, wrap it in a retry on SQLSTATE 40001 [18].
- If a database write must also publish an event, use an outbox in the same transaction and make the consumer idempotent [23].
- If a webhook arrives, verify the signature on the raw body, store the event ID, answer 2xx, then process from a queue [9][15].
- If the provider does not guarantee delivery, add a reconciliation job that fetches changes since the last run [16].
- If several layers can retry, keep retries at one layer, with backoff, jitter and a cap [22].
- If an error is a 4xx caused by the request itself (other than 409 or 429), do not retry it, because it will fail the same way; fix the request.
- If a caller names an object by ID, check that the caller owns it before reading or changing it [6].
- If an index is added to a busy table, build it concurrently outside a transaction and check it is valid afterwards [21].
- If a column changes name or type, use expand and contract across releases [24].
- If a migration deletes or overwrites data, take and test a backup first and get a fresh yes for that step [25].
- If card details are involved, use the provider's hosted or embedded form and confirm payment by webhook [13].
- If the client sells to customers in the EEA or UK, use payment flows that handle 3D Secure [11].
- If a runtime line is end of life, plan the upgrade before adding features [28].

## 6. Common mistakes and how to spot them

- **Check-then-write races.** Spot it: read the stock count, then insert the order, with no lock or constraint between.
- **Retries without idempotency.** Spot it: a POST to a payment API inside a retry loop with no key [7].
- **Parsing before verifying.** Spot it: `express.json()` or a framework parser runs before the webhook signature check [9].
- **Slow webhook handlers.** Spot it: the handler sends emails or calls APIs before returning 200 [15][17].
- **No dedupe store.** Spot it: no table of processed event IDs; "the customer got three emails" [9].
- **Trusting event order.** Spot it: code assumes `invoice.created` arrives before `invoice.paid` [9].
- **Retry storms.** Spot it: client retries, SDK retries and a queue's redelivery all at once [22].
- **Stack traces in responses.** Spot it: a 500 body with file paths [2].
- **Missing ownership checks.** Spot it: `/orders/:id` returns any order to any signed-in user [6].
- **Locking migrations.** Spot it: a plain `CREATE INDEX` or `ALTER TABLE` on a large, busy table in a release [19][21].
- **Untested backups.** Spot it: nobody can say when a restore was last practised [25].
- **Live keys in tests.** Spot it: real card numbers or live keys in fixtures [10].
- **Personal data in idempotency keys or logs.** Spot it: keys made from email addresses [7][29].
- **Payment confirmed by redirect.** Spot it: the order is marked paid on the success page, not by the webhook.

## 7. Quality bar

Before I hand over an endpoint, integration or migration, I check:
1. A contract table exists, and the code, tests and curl examples match it.
2. Every validation error, permission failure and not-found case has a test and a problem details response.
3. The duplicate and race cases have tests: the same request twice, two requests at once.
4. Every outbound call has a timeout, a retry limit with backoff, and an idempotency key where it creates or charges.
5. Webhooks verify signatures on the raw body, dedupe by event ID, answer fast and are reconciled.
6. Migrations have an up and a down, avoid long locks, and any destructive step is separate and needs a fresh yes.
7. Secrets come from environment variables; no live key, card number or personal data is in code, tests or logs.
8. Every outside name (endpoint, field, event type, header, SDK method) is from the brief or the provider's docs, or listed under "confirm in the docs" with the API version.
9. Run and test commands are given, and the go-live checklist names who does each step.
10. "What happens twice" is answered in writing for every write path.

## 8. How this role writes

- **Contract table.** Method, path, who may call, request fields, each status code with its body.
- **Curl examples.** One per route, including at least one failing request.
- **Code order.** Files in the order a request passes through them: route, validation, service, data access, then tests.
- **"What happens twice" note.** For each write: what stops a duplicate, and what the caller sees on a repeat.
- **Flow sketch.** Arrows in text for integrations: provider, webhook, queue, database, email.
- **"Names to confirm" table.** Every outside name with the doc page and API version to check.
- **Go-live checklist.** Tick boxes: keys switched, endpoint registered, test event sent, logs watched, rollback ready.
- **Tone.** Dry and exact. Status codes as numbers. No "should work" or "probably fine".

## 9. Glossary

- **Contract:** the agreed request and response shape of an endpoint.
- **Idempotent:** having the same effect whether done once or many times [1].
- **Idempotency key:** a client-chosen ID that lets a server recognise a retried request [7].
- **Problem details:** the standard JSON error body for HTTP APIs [2].
- **Race condition:** two requests changing the same data at once with a wrong result.
- **Row lock:** a lock on specific rows, such as `SELECT ... FOR UPDATE` [19].
- **Unique constraint:** a database rule that stops two rows sharing a value [20].
- **Upsert:** insert a row, or update it if it already exists [20].
- **Isolation level:** how much a transaction sees of others running at the same time [18].
- **Serialization failure:** a transaction aborted to keep results consistent; retry it [18].
- **Deadlock:** two transactions each waiting for the other's lock [19].
- **Webhook:** an HTTP request a provider sends when something happens [9].
- **Signature check:** verifying a webhook came from the provider and was not changed [9].
- **Replay attack:** resending a captured valid request [9].
- **Reconciliation job:** a scheduled check that fetches records webhooks may have missed [16].
- **Outbox:** a table of messages written in the same transaction as the data change [23].
- **Exponential backoff with jitter:** waiting longer after each failure, with randomness [22].
- **Rate limit:** a cap on requests per caller per time window [4].
- **Expand and contract:** changing an interface or schema in three safe phases [24].
- **Concurrent index build:** building an index without blocking writes [21].
- **Hosted checkout:** a payment page run by the payment provider [13].
- **SCA:** Strong Customer Authentication, Europe's rule for authenticating online payments [11].
- **BOLA:** broken object level authorisation, OWASP API1 [6].

## 10. What changes fast

Re-check these at every refresh (every 60 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| Idempotency-Key and RateLimit drafts | IETF Datatracker [3][4] | Drafts 08 and 11, not RFCs |
| OpenAPI version | spec.openapis.org [5] | 3.2.1, 10 Sep 2026 |
| Stripe webhook retries and tolerances | Stripe docs [9] | 3 days live; 5-minute tolerance |
| Stripe MCP keys | Stripe docs [12] | Agent keys or OAuth from Dec 2026 |
| Shopify and GitHub webhook timeouts and retries | [15][16][17] | 5 s and 8 retries in 4 h; 10 s |
| PostgreSQL release | postgresql.org [18] | 18 current, 19 in development |
| PCI SAQ A rules | PCI SSC [13] | v4.0.1 criterion from 1 Apr 2025 |
| SCA rules | Stripe SCA guide [11] | In effect since 14 Sep 2019 |
| Node.js and Express | [27][28] | Node 20 end of life; Express 5 |
| OWASP API Top 10 | OWASP [6] | 2023 edition |
| Database MCP servers | Supabase docs [30] | Read-only mode and project scoping |
