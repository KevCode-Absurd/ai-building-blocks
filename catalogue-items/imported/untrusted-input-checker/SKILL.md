---
name: infinity
description: "Enforces a strict input boundary protocol (detect, classify, filter, verify) to ensure untrusted data never reaches business logic raw."
risk: safe
source: community
date_added: "2026-06-23"
---

# infinity — Input Boundary & Validation Protocol

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Core Philosophy

> Nothing untrusted ever reaches the core — it is stopped before contact. No external data touches the codebase raw. Every boundary where data enters the system must have a filter.

The #1 source of silent bugs, crashes, and vulnerabilities is external data that arrives in an unexpected shape and gets used directly without checking. This skill enforces a filter layer at every entry point, every time.

---

## When to Use This Skill

- Use when you need to handle an API response
- Use when reading user input or adding a form handler
- Use when working with environment variables or CLI arguments
- Use when parsing webhooks or reading from the filesystem
- Use when any code calls `.body`, `.params`, `.query`, `.env`, `fs.read`, or a third-party SDK response

---

## The Four Phases

### PHASE 1 — Boundary Detection

Before writing or modifying any code that involves external data, the AI must identify and list every entry point in scope:

- HTTP request bodies, headers, query params
- User form inputs and UI-submitted data
- Environment variables and config files
- Third-party API responses
- Webhook payloads
- File reads from disk
- CLI arguments
- Database query results from external sources
- WebSocket messages

> **The AI must not write any data-handling logic until every entry point in scope is listed.**

---

### PHASE 2 — Classify Each Input

For every entry point identified, the AI classifies it into one of three trust levels:

| Level | Definition | Examples |
|---|---|---|
| `TRUSTED` | Internal constants, hardcoded values, your own compile-time config | Enum values, hardcoded defaults, internal constants |
| `SEMI-TRUSTED` | Your own internal services, internal APIs, controlled infrastructure | Internal microservice responses, your own database reads |
| `UNTRUSTED` | Anything from users, the internet, third parties, or the filesystem | User input, external API responses, uploaded files, env vars, CLI args |

> **Rule:** `TRUSTED` inputs may be used directly. `SEMI-TRUSTED` and `UNTRUSTED` inputs must pass through a filter layer before any use.

The AI outputs this classification before writing any handling code:

```
INFINITY — BOUNDARY MAP
─────────────────────────────────────────
Entry Point              | Trust Level  | Filter Required
─────────────────────────────────────────
req.body.email           | UNTRUSTED    | ✓ format + sanitize
process.env.API_KEY      | UNTRUSTED    | ✓ presence + non-empty
internalService.getData()| SEMI-TRUSTED | ✓ schema validate
PAGINATION_LIMIT = 20    | TRUSTED      | ✗ none needed
─────────────────────────────────────────
```

---

### PHASE 3 — Mandatory Filter Layer

Every `UNTRUSTED` and `SEMI-TRUSTED` input must pass through validation before it reaches any business logic, storage, or rendering. The AI must apply the right filter type for the right context:

**Type Checking**
- Verify the input is the expected type before using it
- Never assume a string is a string, a number is a number, or an array is an array

**Schema Validation**
- For objects and API responses, validate shape before accessing nested fields
- If a required field is missing, reject — do not use a fallback that hides the problem

**Sanitization**
- Strip or escape content before rendering to UI (prevent XSS)
- Normalize strings before storage (trim whitespace, consistent casing where appropriate)

**Presence & Format Checks**
- Env vars: must exist and be non-empty before use
- IDs and tokens: must match expected format before use

**Rejection Rule**
- On invalid input: reject explicitly and return a clear error
- Never silently use bad data with a fallback
- Never let bad data pass through to fix itself "downstream"

```
// WRONG — using raw input directly
const user = await db.find(req.params.id);

// RIGHT — validate before use
const id = req.params.id;
if (!id || typeof id !== 'string' || !isValidUUID(id)) {
  return res.status(400).json({ error: 'Invalid ID format' });
}
const user = await db.find(id);
```

---

### PHASE 4 — Self-Check Before Done

Before the AI declares any data-handling code complete, it traces each entry point and confirms:

```
INFINITY — VERIFICATION
─────────────────────────────────────────
Entry Point              | Filter Exists | Filter Type
─────────────────────────────────────────
req.body.email           | ✓ YES         | format + sanitize
process.env.API_KEY      | ✓ YES         | presence check
internalService.getData()| ✓ YES         | schema validation
─────────────────────────────────────────
Unfiltered inputs reaching logic: NONE ✓
─────────────────────────────────────────
```

If any `UNTRUSTED` or `SEMI-TRUSTED` input reaches logic, storage, or rendering without a filter — the AI flags it. It does not silently pass.

---

## Hard Rules (Never Violated)

- **No raw external data in business logic.** Ever.
- **No silent fallbacks on bad input.** Reject explicitly.
- **No assuming shape.** Even if the API "always" returns a string — validate it.
- **No skipping env var checks.** Missing env vars must fail loudly at startup, not silently at runtime.
- **No partial filtering.** If you validate presence but not format, it is not filtered.
- **No filtering in the wrong place.** Filters go at the entry point — not somewhere downstream after the data has already been used once.

---

## What This Skill Prevents

- SQL injection via unvalidated query params
- Crashes from unexpected API response shapes
- XSS from unescaped user content rendered to UI
- Silent failures from missing env variables discovered at runtime
- Type errors from assuming external data matches expected shape
- Security vulnerabilities from untrusted data reaching sensitive operations

---

## Quick Reference

| Phase | Action | Writes Code? |
|---|---|---|
| 1 — Detect | List all entry points in scope | ❌ No |
| 2 — Classify | Assign trust level to each input | ❌ No |
| 3 — Filter | Write filter layer for all UNTRUSTED + SEMI-TRUSTED | ✅ Yes |
| 4 — Verify | Trace each input, confirm filter exists | ❌ No |

---

## Limitations

- Does not apply to purely internal logic with no external data involvement.
- May add verbosity to trivial scripts where strict validation is not required.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [API test suite builder](https://useaiblocks.com/skills/api-test-suite-builder). It takes the code change.
- The [Code security reviewer](https://useaiblocks.com/skills/code-security-reviewer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
