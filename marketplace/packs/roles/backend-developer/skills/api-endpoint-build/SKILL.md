---
name: api-endpoint-build
description: Builds or fixes one API endpoint in Node.js or Python, contract first - method, path, who may call it, request body and every response code - then validation at the edge, problem-details errors, an ownership check on every object, safe writes with transactions, row locks or unique constraints, idempotency keys for anything that creates or charges, rate limits, and tests for the happy path, each validation error, a permission failure, not-found, a duplicate and a race. Opens a pull request at access level 2; deploys through the client's pipeline only at level 3 after the action list is confirmed. Use it for booking, ordering, stock and search endpoints.
---

# API endpoint build

## When to use

- A new endpoint is needed: create an order, hold stock, book a slot, search, update a profile.
- An endpoint returns wrong data, a 500, or lets two customers buy the last item.
- Routes need input checks, rate limits and consistent errors before more clients use them.

Not for: hosting or running the server, or card handling outside the payment provider's hosted form.

## What you need

1. The brief: what the endpoint does, who may call it, and what should happen if the same request arrives twice.
2. Language, framework and versions (from the dependency and lock files), the validation library (Zod, Pydantic, Joi) and the database and ORM.
3. The relevant schema (DDL or ORM models, no customer rows) and an existing route as a style sample.
4. For a fix: the error, the log lines around it and the request that triggers it, with personal data masked.
5. Access: level 1 to read code and schema. Writing on a branch and running tests needs level 2. Deploying needs level 3 and a yes on the action list.

## Steps

### 1. Write the contract

A table: method, path, who may call it (role and ownership rule), request fields with types and limits, and each response code with its body. Include 400 or 422 for validation, 401 and 403, 404, 409 for conflicts, 429 for rate limits, and the success code. Use only field and table names from the brief; mark anything else "new" or "to confirm".

### 2. List what can go wrong

Missing and wrong-typed fields, values out of range, not found, not allowed, the caller naming someone else's object, duplicates, two requests at the same moment, an outside service down, and very large inputs.

### 3. Split the layers

A thin route handler, a validation schema, a service function with the business rules, and data access. Keep the handler short: parse, validate, call the service, map the result to a response.

### 4. Validate at the edge

Parse the body, query and path with the schema library. Reject unknown fields rather than copying the body onto a row, so callers cannot set fields like `role` or `price`. Return problem details: `type`, `title`, `status`, `detail`, and an `errors` list with one entry per bad field.

### 5. Check ownership on every object

Load the object by ID and the caller together (`WHERE id = $1 AND account_id = $2`), or check after loading. Return 404 rather than 403 when revealing that the object exists would leak information; agree the rule with the client.

### 6. Make writes safe

- **Races:** enforce the rule in the database. Use a unique constraint for "only one" rules (one booking per slot), `SELECT ... FOR UPDATE` when reading and then changing the same rows (stock counts), or a conditional update (`UPDATE stock SET qty = qty - 1 WHERE id = $1 AND qty > 0`) and check the row count.
- **Transactions:** wrap multi-step writes. If the isolation level is Repeatable Read or Serializable, retry on SQLSTATE 40001.
- **Duplicates:** for POSTs that create, charge, book or ship, accept an `Idempotency-Key` header. Store key, request hash, status and response in the same transaction as the work. On a repeat with the same body, return the stored response; with a different body, return 422; while the first is still running, return 409.
- **Events:** if the write must also notify another system, add a row to an outbox table in the same transaction.

### 7. Handle errors and config

One error handler maps known errors to problem details and unknown ones to a plain 500 with a request ID. Never return stack traces. Read config and secrets from environment variables.

### 8. Limit abuse

Per-user or per-key rate limit returning 429 with `Retry-After`; maximum body size and page size; extra limits on flows bots abuse (sign-ups, coupon checks, stock holds).

### 9. Write the tests

Happy path; each validation error; unauthenticated; another account's object; not found; the same idempotency key twice; the same key with a different body; two concurrent requests for the last item (run them in parallel against a real test database, not mocks).

### 10. Write the curl examples

One per response code that matters, including at least one failing request, matching the contract exactly.

### 11. Ship

At level 2, open a pull request with the contract, code, migration if any, tests and curl examples. At level 3, after the client confirms the action list (environment, migration, rollback), merge and deploy through their pipeline, then run the curl examples against the deployed environment and watch error rates.

## Checks before handing over

- Contract, code, tests and curl examples agree.
- Every object lookup is scoped to the caller.
- The duplicate and race tests pass against a real database.
- No stack traces, secrets or personal data in responses or logs.
- Every package has a version; every table and column exists in the brief or is labelled new.
- "What happens twice" is answered for every write.

## Output format

1. Contract table.
2. "What can go wrong" list.
3. Code files in request order: route, validation schema, service, data access, error handler.
4. Migration, if needed (see the `safe-database-migration` skill).
5. Tests.
6. Curl examples.
7. "What happens twice" note.
8. Run and test commands.

## Example of good output (short)

*Illustrative structure, not a real business: a pottery studio that sells 8 seats per class. Copy the shape, never the content: every fact comes from the client's own context.*

> | Method | Path | Who | Codes |
> |---|---|---|---|
> | POST | /classes/{id}/bookings | Signed-in customer | 201 booked; 401; 404 class not found; 409 class full; 422 invalid body; 422 key reused with different body; 429 |
>
> **What happens twice.** The same request with the same `Idempotency-Key` returns the first 201 and the same booking ID. Two customers asking for the last seat at once: the update `SET seats_taken = seats_taken + 1 WHERE id = $1 AND seats_taken < 8` succeeds for one; the other gets 409 `class-full`. A unique constraint on (class_id, customer_id) stops one customer booking twice.
>
> ```
> curl -X POST https://api.example.test/classes/42/bookings \
>   -H "Authorization: Bearer $TOKEN" -H "Idempotency-Key: 6f1c..." \
>   -H "Content-Type: application/json" -d '{"partySize": 1}'
> ```
