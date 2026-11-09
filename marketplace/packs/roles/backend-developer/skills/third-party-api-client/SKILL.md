---
name: third-party-api-client
description: Builds a client or sync job that calls another service's API - payments, shops, CRMs, messaging, AI models - with timeouts, retries at one layer only using capped exponential backoff with jitter, Retry-After handling, idempotency keys on anything that creates or charges, paging and rate limits, validation of every response, a dedupe key so syncs never create duplicates, logs without personal data, and a local test with recorded sample responses. Builds against sandboxes at access level 2; runs against live accounts only at level 3 within the limits the client set. Use it for shop-to-CRM syncs, order exports, SMS sends and any outbound integration.
---

# Third-party API client

## When to use

- The app must call another service: create a customer in a CRM, send an SMS, export orders, read a shop's products, call a model provider.
- A sync job creates duplicates, misses records, or gets blocked with 429 errors.
- An integration fails silently when the other service is slow or down.

## What you need

1. What moves where, who triggers it (event, schedule, user action), and what "done" means.
2. The provider's API docs link and API version, the SDK if any, and sample responses with keys swapped for XXXX.
3. The provider's rate limits and paging style, from its docs.
4. The field map: source field, target field, change, what to do if blank.
5. Access: level 1 to read code and docs. Building and testing against a sandbox or development account needs level 2. Running against live accounts needs level 3 within the limits the client set (which accounts, how many records, which actions).

## Steps

### 1. Write the flow and the names table

Arrows in text from trigger to final write. Then a table of every endpoint, field, header and ID used, with the doc page and API version. Anything not in the brief or the docs is marked "to confirm".

### 2. Pick the dedupe key

The value that identifies the same record on both sides: an external ID stored on the target, an order number, or an email plus date. Before any create, look up by that key; update if found, create if not. Where the target supports upsert by external ID, use it.

### 3. Set timeouts

A connect timeout and a total request timeout on every call. Base them on the provider's normal response times from logs if available, and keep the total under the time the caller (a web request, a webhook worker) can wait.

### 4. Retry carefully

- Retry only on network errors, 429 and 5xx. Never on other 4xx: fix the request.
- Exponential backoff with a cap and random jitter; a small cap on attempts; honour `Retry-After` as the minimum wait.
- Retry at one layer only. If the SDK retries, do not wrap it in another retry loop, and do not let the queue redeliver on top without a limit.
- Only retry calls that are idempotent. For creates and charges, send an idempotency key that stays the same across retries (Stripe accepts `Idempotency-Key` on POST requests and returns the saved result for a repeat).

### 5. Page and pace

Follow the provider's paging (cursor or page tokens), store the cursor or the last `updated_at` so a crashed job resumes, and keep requests under the rate limit with a small client-side limiter.

### 6. Validate responses

Treat every response as untrusted input: parse it with a schema, check required fields and types, and reject or quarantine records that fail rather than writing bad data. Never follow URLs from responses to internal addresses.

### 7. Handle failure visibly

After the last retry: write the record and error to a failures table and alert a named person. A partial batch records what succeeded so a re-run does not repeat it.

### 8. Log safely

Log request IDs, endpoint, status, timing and record IDs, not full bodies with personal data. Mask tokens in any error output.

### 9. Test locally

Record sample responses (success, 404, 429 with `Retry-After`, 500, a malformed body, an empty page) and replay them in tests: the dedupe path, a retry that then succeeds, a retry that gives up and alerts, and resume after a crash mid-page. Use the provider's sandbox and test keys for an end-to-end run.

### 10. Go live

At level 2, open a pull request and run against the sandbox. At level 3, after the client confirms the action list (accounts, scopes, how many records in the first run, schedule, who gets alerts), run a small first batch, check the results on both sides, then switch on the schedule.

## Checks before handing over

- Every call has a timeout.
- Retries happen at one layer, with backoff, jitter, a cap and `Retry-After`.
- Creates and charges carry an idempotency key or a dedupe lookup.
- Responses are validated before writing.
- Failures land in a table and alert a person.
- No keys in code, tests or logs; sandbox keys only in tests.
- A re-run after a crash causes no duplicates.

## Output format

1. Flow sketch and names-to-confirm table.
2. Field map with dedupe key.
3. Client code in full: config, HTTP wrapper (timeouts, retries, limiter), mapping, sync job.
4. Failures table migration.
5. Tests with recorded responses.
6. Run commands and the go-live checklist.

## Example of good output (short)

*Illustrative structure, not a real business: an interiors business syncing large Shopify orders to a CRM. Copy the shape, never the content: every fact comes from the client's own context.*

> **Flow.** Shopify `orders/create` webhook → worker → find CRM contact by email → create or update contact → create deal with external ID `shopify-order-<id>`.
>
> **What happens twice.** Shopify resends the order webhook: the worker finds a deal with external ID `shopify-order-5512` and updates it instead of creating a second. The CRM times out after creating the contact: the retry looks up the contact by email first, finds it, and moves on.
>
> **Retry rule.** Network errors, 429 and 5xx only; 4 attempts at most; backoff 1 s, 2 s, 4 s plus jitter, or `Retry-After` if longer; then the order goes to `sync_failures` and the office manager gets an email.
>
> **Names to confirm.** CRM deal `external_id` property name and the API version, in the CRM's docs.
