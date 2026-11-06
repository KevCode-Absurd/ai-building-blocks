---
name: webhook-receiver
description: Builds or fixes a webhook receiver for payment providers, shops, CRMs or messaging tools - signature check on the raw body, timestamp tolerance, a fast 2xx answer, an event-ID store so repeats never charge, email or ship twice, queue-based processing that does not depend on event order, logged failures, a reconciliation job for missed events, and replay tests with sample payloads, a duplicate and a bad signature. Builds and tests against the provider's sandbox at access level 2; registers the live endpoint only at level 3 after the go-live list is confirmed. Use it for Stripe, Shopify, GitHub and similar webhooks, and for "the customer got three emails" bugs.
---

# Webhook receiver

## When to use

- A provider (Stripe, PayPal, Shopify, GitHub, Twilio, HubSpot) must tell the app that something happened: a payment succeeded, an order was placed, a message arrived.
- Customers get duplicate emails, orders are created twice, or some payments never show up.
- A checkout confirms payment from the browser's return page and needs to move to the webhook.

## What you need

1. The flow in words: what starts it, which provider sends what, what the code does, what "done" means.
2. A sample payload for each event type, with keys swapped for XXXX, and the provider's API version.
3. Language, framework and versions, the database, and whether a queue exists.
4. For a fix: delivery logs from the provider's dashboard and the app's logs around a failure.
5. Access: level 1 to read code and delivery logs. Building and testing against the sandbox needs level 2. Registering the live endpoint and deploying needs level 3 and a yes on the go-live list.

## Steps

### 1. Draw the flow

Arrows in text: provider → webhook → event store → queue → worker → database → email. Mark what the customer sees at each point.

### 2. Make the names table

Every event type, header, field and ID used, with the provider doc page and API version to confirm. Nothing invented: anything not in the brief or the docs goes in this table.

### 3. Read the raw body

Configure the route so the framework does not parse or change the body before the signature check (for example, a raw body parser on this route only). Exempt the route from CSRF checks if the framework applies them.

### 4. Verify the signature

Use the provider's official library where it exists (Stripe's `constructEvent`, for example). Otherwise follow the provider's scheme exactly: build the signed string, compute the HMAC with the endpoint's secret, compare in constant time, and reject timestamps outside the tolerance (Stripe's libraries default to 5 minutes; never set zero). Return 400 on failure and log it without the payload.

### 5. Store the event, then answer

Insert the event ID (Stripe event `id`, `X-Shopify-Webhook-Id`, `X-GitHub-Delivery`, or `webhook-id` under Standard Webhooks) into an events table with a unique constraint, plus type, received time and status. If the insert conflicts, it is a repeat: answer 200 and stop (if the stored event is marked failed, put it back on the queue instead of processing it inline). Otherwise answer 2xx straight away. GitHub expects an answer within 10 seconds and Shopify within 5, so no emails or API calls before answering.

### 6. Process from a queue

A worker picks up new events. For each: fetch the current object from the provider's API if order matters (do not trust that `created` arrives before `paid`), apply the change in a transaction, and make every side effect idempotent: send the confirmation email only if `confirmation_sent_at` is empty, set in the same transaction as the email job.

### 7. Handle failures

Retry the worker a few times with backoff and jitter, then mark the event failed and alert a named person. Never retry forever. Know the provider's own retries: Stripe retries for up to three days in live mode; Shopify retries eight times in four hours and then removes the subscription; GitHub expects you to redeliver missed deliveries.

### 8. Reconcile

A scheduled job lists objects changed since the last run from the provider's API (for example, Shopify's `updated_at` filter or Stripe's event list) and processes any that are missing locally. This catches events lost to downtime.

### 9. Keep money with a person

Payment confirmation comes from the webhook. Refunds and payouts are prepared for a person to approve, never sent by the handler.

### 10. Test

Feed the sample payloads to the handler: a valid event; the same event twice (one side effect only); a bad signature (400); an old timestamp (400); events out of order; the worker failing once then succeeding. For Stripe, use `stripe listen --forward-to` and `stripe trigger` against a sandbox, with test keys only.

### 11. Go live

At level 2, open a pull request and test against the sandbox endpoint. At level 3, after the client confirms the go-live list (live endpoint URL, event types, secret stored in their secret store, test event, who watches the logs, rollback), register the live endpoint, send a test event and watch deliveries for the first day.

## Checks before handing over

- Signature checked on the raw body before any parsing or work.
- Unique constraint on the event ID; repeat deliveries cause no second side effect.
- 2xx is returned before slow work.
- No step depends on event order.
- Failures alert a named person; retries are capped.
- A reconciliation job exists with a schedule.
- No live keys, secrets or card numbers in code or tests.

## Output format

1. Flow sketch.
2. Names-to-confirm table.
3. Handler, event store migration, worker and reconciliation job, in full.
4. Tests with sample payloads.
5. Local test commands.
6. Go-live checklist with tick boxes and owners.

## Example of good output (short)

*Made-up business for illustration: "Saltmarsh Yoga", which sells class passes through Stripe Checkout.*

> **Flow.** Stripe → POST /webhooks/stripe (verify, store `evt_...`, 200) → queue → worker: fetch the Checkout Session, mark the pass paid, queue one confirmation email → email provider.
>
> **Why customers got three emails.** The old handler sent the email before answering, took about 12 seconds when the email provider was slow, and Stripe treated the timeouts as failures and retried. Each retry sent another email. Fix: store the event ID with a unique constraint, answer 200 first, send the email from the worker only if `confirmation_sent_at` is empty.
>
> **Go-live checklist.**
> - [ ] Live endpoint registered for `checkout.session.completed` only (client)
> - [ ] Signing secret saved in the secret store (client)
> - [ ] Test purchase made and one email received (client and me)
> - [ ] Delivery log watched for 24 hours (me)
