---
name: api-reference-and-quickstart
description: Writes API documentation developers can use on the first try, from an OpenAPI file, code, examples and an error list. Reviews the material for gaps (auth, types, errors, limits, paging), writes a quickstart from getting access to a first successful call, then a reference for each endpoint with purpose, method and path, a parameters table, request and response examples and errors, plus auth, errors, pagination, rate limits and versioning pages. Tests examples on a test account when one is connected. Use when an API is launching, when integrations stall, or when existing API docs need a review.
---

# API reference and quickstart

Developers judge an API by how fast they get a first working call. This skill writes the quickstart that gets them there and the reference they keep open afterwards, both traceable to the spec, with examples that have actually run.

## When to use

- A new or changed HTTP API needs public or partner docs.
- Sign-ups are high but working integrations are low.
- Existing docs disagree with the spec or the changelog.
- A design review of an API spec before it ships (names, data shapes, auth, errors, versions).

Not for: SDK code generation, security testing, or writing a spec for behaviour nobody has confirmed.

## What you need

- **The OpenAPI document** (3.x), or the code, routes and example requests and responses if there is no spec.
- **Who the developer reader is** and the first thing they want to do.
- **Auth details:** how keys or tokens are issued, scopes, expiry.
- **The error list,** rate limits, paging rules, versioning and deprecation policy, changelog.
- **A test account** with test data, if the client can provide one.
- **Access level:** reading the spec and repository needs level 1. Opening a pull request with docs or spec fixes, or drafting in a docs platform, needs level 2. Publishing docs needs level 3 within the client's limits. Running examples uses only the test account the client connects, with its key kept in the client's own tool settings.

## Steps

1. **Gap review first.** Check the material for missing parameters, unclear types, undocumented errors, missing auth description, no examples, no limits, no paging. Write questions before writing docs, and mark anything assumed with "Confirm:".
2. **Design review (if asked).** Per endpoint: method, path and resource naming, input and output shapes, status codes, errors, paging, idempotency, versioning, limits. Auth: who can call what, scopes, expiry. Keys go in headers, never in URLs. Suggest a consistent error format such as RFC 9457 problem details if errors vary.
3. **Write the quickstart:**
   1. Get access (account, key, scopes), with no secrets in the page.
   2. Make one call with a copyable example in curl and one common language.
   3. See the expected response, shown in full.
   4. Next steps: links to the two or three tasks most readers do next.
4. **Write the overview pages:** base URLs and environments, authentication, errors (format, common codes and what to do about each), pagination, rate limits and retries, idempotency, webhooks if any, versioning and deprecation policy.
5. **Write each endpoint page** from the spec:
   - One-line purpose in the reader's terms.
   - Method and path.
   - Parameters table: name, where it goes (path, query, header, body), type, required, default, description.
   - Request example and response example, with realistic placeholder data.
   - Errors this endpoint returns, and what the caller should do.
   - Permissions or scopes needed.
   Use the same word for the same thing everywhere; match field names exactly.
6. **Keep spec and docs as one.** Put descriptions into the OpenAPI document (description fields accept CommonMark) and generate the reference from it, so they cannot drift. Fix errors in the spec, not only in the output.
7. **Write test cases per endpoint:** normal use, missing fields, wrong types, no permission, too many requests, retries.
8. **Run the examples** against the test account where one is connected. Record each result. Mark any example that could not be run.
9. **Release notes and migration.** For changes, write a changelog entry (Added, Changed, Deprecated, Removed, Fixed, Security) and, for breaking changes, a migration note: what changed, who is affected, steps to move over, end date for the old behaviour.
10. **For AI assistant connections (if asked),** list which actions to expose, keep them few and narrow, require a confirm step before any change to data, and document each one as carefully as a public endpoint.
11. **Deliver.** At level 2, open a pull request or a draft. At level 3, publish to the named docs site, log it and report it.

## Checks

- Every endpoint in the spec has a page; every page matches the spec.
- Auth, errors, paging and limits are documented.
- Every example is valid JSON or code and was run, or is marked as not run.
- No real keys, tokens or personal data appear anywhere.
- Terms and field names are consistent across pages.
- The quickstart reaches a successful response in as few steps as the API allows.
- All "Confirm:" items are listed for the API owner.

## Output format

1. **Gap and design review:** ranked issues with suggested fixes.
2. **Quickstart page.**
3. **Overview pages:** auth, errors, pagination, limits, versioning.
4. **Endpoint pages,** or an updated OpenAPI document that generates them.
5. **Test cases** and **example run log.**
6. **Changelog entry and migration note** if anything changed.

## Example of good output (short)

*Illustrative structure, not a real business: a delivery-tracking API for small shops. Copy the shape, never the content: every fact comes from the client's own context.*

**GET /v1/shipments/{shipment_id}**

Gets one shipment and its latest tracking status.

| Name | In | Type | Required | Description |
|---|---|---|---|---|
| shipment_id | path | string | Yes | The ID returned when you created the shipment. |
| include | query | string | No | Set to `events` to add the full tracking history. Default: none. |

```bash
curl https://api.[domain]/v1/shipments/shp_123 \
  -H "Authorization: Bearer $TEST_API_KEY"
```

**Errors**

| Status | When | What to do |
|---|---|---|
| 401 | The key is missing or expired. | Create a new test key in the dashboard. |
| 404 | No shipment has this ID in your account. | Check the ID; shipments from other accounts are not visible. |
| 429 | Too many requests. | Wait for the time in the `Retry-After` header, then retry. |

**Confirm:** does `include=events` work on the v1 sandbox? Not run: the test account has no shipments yet.
