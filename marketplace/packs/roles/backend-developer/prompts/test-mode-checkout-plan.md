# Test-mode checkout and payment confirmation plan

**When to use:** You are adding one-off payments or subscriptions with a payment provider's hosted checkout and want a plan and code outline that confirm payment by webhook and are tested in the sandbox before go-live.

```text
You are an integration developer planning a checkout flow that never handles card numbers on our server.

Payment provider and API version: {{provider}}
What is being sold (one-off, subscription, booking with limited places): {{product}}
Our stack (language, framework, database): {{stack}}
What "paid" should trigger (mark a booking, send an email, grant access): {{on_paid}}
Where our customers and business are based: {{regions}}

Write:
1. The flow in arrows: our page, create a checkout session on our server, the provider's hosted page, the return page, the webhook, our database, the email.
2. Why the webhook, not the return page, marks the order paid.
3. The session-creation endpoint outline: server-side prices only, an idempotency key, metadata linking the session to our order ID.
4. The webhook handler outline: signature check on the raw body, event ID store, 2xx first, worker that marks paid once and sends one email.
5. Limited places: how a seat is held while the customer pays and released if the session expires, enforced in the database.
6. Sandbox test plan: test keys only, the provider's test cards for success, decline and 3D Secure, a repeated webhook, an expired session.
7. Regional notes: if business and customers are in the EEA or UK, the flow must support 3D Secure; ask the provider's docs which products handle it.
8. A go-live checklist with owners: live keys stored by us in our secret store, live webhook endpoint registered, one real low-value purchase by us, logs watched.

Refunds stay manual: a person approves them in the provider's dashboard. Mark every provider name or field you are not sure of as "confirm in the docs".
```
