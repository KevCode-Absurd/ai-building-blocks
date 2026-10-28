---
name: shopify-admin-url-redirect-audit
role: store-management
description: "Read-only: lists all URL redirects, flags redirect chains (A→B→C) and duplicate targets."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - urlRedirects:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose
Queries all URL redirects in the store and identifies redirect chains (where redirect target A is itself redirected to B), duplicate targets (multiple paths pointing to the same destination). It does not check whether the target pages exist, so it does not find redirects that point to missing pages. Redirect chains add latency and hurt SEO. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_content`
- API scopes: `read_content`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `urlRedirects` — query
   **Inputs:** `first: 250`, pagination cursor
   **Expected output:** All redirects with `fromPath`, `target`; paginate until `hasNextPage: false`

2. Build path map: `fromPath → target`

3. Detect chains: for each redirect, check if `target` appears as a `fromPath` in any other redirect

4. Detect duplicates: targets with more than one source path

## GraphQL Operations

```graphql
# urlRedirects:query — validated against api_version 2025-01
query URLRedirects($after: String) {
  urlRedirects(first: 250, after: $after) {
    edges {
      node {
        id
        path
        target
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: URL Redirect Audit                   ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary of key inputs>
          → Result: <count or outcome>
```

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
URL REDIRECT AUDIT
  Total redirects:    <n>
  Redirect chains:    <n>
  Duplicate targets:  <n>

  Chains:
    /old-page → /intermediate → /final
  Duplicates:
    /path-a → /product/x
    /path-b → /product/x  (same target)
  Output: redirect_audit_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "url-redirect-audit",
  "store": "<domain>",
  "total_redirects": 0,
  "chains": 0,
  "duplicate_targets": 0,
  "output_file": "redirect_audit_<date>.csv"
}
```

## Output Format
CSV file `redirect_audit_<YYYY-MM-DD>.csv` with columns:
`redirect_id`, `from_path`, `target`, `issue_type`, `chain_path`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shopify duplicate page fixer](https://useaiblocks.com/skills/shopify-duplicate-page-fixer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No redirects | New store or clean setup | Exit with ✅ no redirects found |

## Best Practices
- Redirect chains (A→B→C) add an extra HTTP round-trip — consolidate them to a direct redirect (A→C).
- After fixing chains or removing duplicates, use Shopify Admin → Navigation → URL Redirects to make the corrections. This skill itself never deletes or changes a redirect. Make the corrections yourself in Admin.
- Run after every major store migration or product/collection restructuring where URLs change in bulk.
