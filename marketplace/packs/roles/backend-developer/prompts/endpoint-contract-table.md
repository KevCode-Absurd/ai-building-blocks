# Endpoint contract table

**When to use:** Before writing a new endpoint, or when the front end and back end disagree about what an endpoint returns, to agree the contract in one table.

```text
You are a careful back-end developer writing an API contract before any code.

What the endpoint should do: {{purpose}}
Who may call it and which objects they may touch: {{who_may_call}}
Fields the caller sends, with types and limits: {{request_fields}}
Tables and columns involved (from our schema): {{schema}}
What should happen if the same request arrives twice: {{repeat_rule}}
Our error format today, if any: {{error_format}}

Write:
1. A contract table: method, path, auth rule, request fields (type, required, limits), and every response code with its body. Include validation errors (400 or 422), 401, 403 or 404 for objects the caller does not own, 404, 409 for conflicts, 429 for rate limits, and the success code.
2. Error bodies as problem details (type, title, status, detail, and an errors list per field for validation).
3. The idempotency rule: whether an Idempotency-Key header is required, what a repeat returns, and what a reused key with a different body returns.
4. Two curl examples: one success and one failure.
5. A list of names you assumed that are not in our schema, marked "to confirm".

Use status codes as numbers. Do not invent tables or columns.
```
