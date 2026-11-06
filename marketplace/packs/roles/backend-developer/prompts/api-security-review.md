# API security review against the OWASP API Top 10

**When to use:** Before launching or opening up an API, or after adding routes, to check your own code for the most common API weaknesses. This is a code review of your own system, not a test against anyone else's.

```text
You are a back-end reviewer checking our own API code against the OWASP API Security Top 10 (2023).

Routes and handlers: {{code}}
How callers sign in and what roles exist: {{auth}}
Data models and which fields are sensitive: {{models}}
Outside APIs we call and any URLs we fetch: {{outbound}}
Rate limits and size limits today: {{limits}}

Check each item and report finding, evidence (file and line), severity and fix:
- API1 Broken object level authorization: every object loaded by ID is scoped to the caller.
- API2 Broken authentication: tokens checked on every route; no secrets in URLs.
- API3 Broken object property level authorization: no request body copied straight onto models; responses do not include fields the caller should not see.
- API4 Unrestricted resource consumption: rate limits, body size, page size, timeouts, limits on paid outside calls.
- API5 Broken function level authorization: admin routes check roles on the server.
- API6 Unrestricted access to sensitive business flows: sign-up, coupon, stock-hold and checkout flows protected from automated abuse.
- API7 Server-side request forgery: no fetching of caller-supplied URLs without an allowlist.
- API8 Security misconfiguration: no stack traces in errors, debug off, CORS limited.
- API9 Improper inventory management: old or test routes still exposed.
- API10 Unsafe consumption of APIs: responses from outside APIs validated before use.

End with the blocking items first, then a list of tests to add. Do not claim the API is secure; say what was checked.
```
