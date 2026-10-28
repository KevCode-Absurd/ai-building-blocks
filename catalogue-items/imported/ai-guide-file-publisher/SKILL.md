---
name: shopify-admin-agentic-llms-txt
role: agentic
description: "Generate and publish an /llms.txt guide (brand summary, flagship products, key policies, contact) via a theme template so AI assistants get a curated, machine-readable map of the store."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - shop:query
  - products:query
  - themeFilesUpsert:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
audit_signals:
  - llms-txt
  - well-known-llms-txt
  - agents-md
---

**Source check by AI Blocks, 28 Oct 2026:** The [Shopify store auth reference](https://shopify.dev/docs/api/shopify-cli/store/store-auth) requires --store and comma-separated --scopes. Replace REQUIRED_SCOPES with the least permissions for the actual queries and mutations; confirm them in the Admin API reference before signing in. Do not run a command with placeholders. Complete browser sign-in yourself and keep tokens out of chat and logs. This is a documentation check, not a store login or live API test.

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
`llms.txt` is the emerging convention for telling AI assistants, in plain text, what a site is and where the important pages live — a curated front door for models. This skill assembles an `llms.txt` from the store's own data (brand one-liner, top collections, flagship products with URLs, shipping/returns policy links, contact) and publishes it through a theme template so it's served at a stable path. Fixes `llms-txt` / `well-known-llms-txt` and the related `agents-md` discovery signals.

## Prerequisites
- Authenticated Shopify CLI session (`shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`)
- Required API scopes: `read_products`, `read_themes`, `write_themes`

## Parameters
All skills accept these universal parameters:

| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| store     | string | yes      | —       | Store domain (e.g., mystore.myshopify.com) |
| format    | string | no       | human   | Output format: `human` (default) or `json` |
| dry_run   | bool   | no       | true    | Preview the generated llms.txt without writing (defaults ON — edits the live theme) |

Skill-specific parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| theme_id | string | no | — | Theme GID (defaults to published MAIN theme) |
| flagship_count | int | no | 12 | How many top products to list |
| flagship_collection_id | string | no | — | Collection to draw the flagship list from (else best-sellers/recent) |
| brand_summary | string | no | — | Override the brand one-liner (else inferred from shop + homepage) |

## Safety

> ⚠️ Step 4 (`themeFilesUpsert`) writes a new template to the LIVE theme. The content is additive (a new file/route) and low-risk, but it is published immediately. Defaults `dry_run: true` so you review the generated `llms.txt` first. Before any `themeFilesUpsert` call, ask the user to duplicate the live theme in Shopify Admin and to confirm in chat that the copy exists. Do not write until they confirm.

## Workflow Steps

1. **OPERATION:** `shop` — query
   **Inputs:** none
   **Expected output:** Shop name, domain, contact email, policy URLs — the header + contact + policy section of llms.txt.

2. **OPERATION:** `products` — query
   **Inputs:** `first: flagship_count`, optional `query: "collection_id:'<id>'"` (when `flagship_collection_id` is set — the curated set is your flagship list), `sortKey: UPDATED_AT, reverse: true` otherwise; fields `title`, `onlineStoreUrl`, `description`.
   **Expected output:** Flagship product list with URLs for the "Key products" section. (Top-level `products` has no best-selling sort — use the curated collection for true bestsellers, else most-recently-updated as the proxy.)

3. **COMPUTE (no API):** render the `llms.txt` markdown: `# <Brand>` + one-liner, `## Key products` (title — URL — one line), `## Policies` (shipping/returns/privacy URLs), `## Contact`. Emit the full text.

4. **OPERATION:** `themeFilesUpsert` — mutation
   **Inputs:** `themeId`, write `templates/page.llms.liquid` (a page template that outputs the text as `text/plain`); skipped when `dry_run`. This skill gives no ready-made Liquid source, so draft the template and show its full text to the user with the `llms.txt` preview. Write it only after they approve that exact text and confirm the theme copy. Do not write an `assets/llms.txt` file unless the user asks for one.
   **Expected output:** Upserted theme file(s); collect `userErrors`. (Note: surface a one-line instruction to create a Page using the `llms` template, or to add a redirect from `/llms.txt`.)

## GraphQL Operations

```graphql
# shop:query — validated against api_version 2025-01
query LlmsTxtShop {
  shop {
    name
    primaryDomain { url }
    contactEmail
    shopPolicies { type url }
  }
}
```

```graphql
# products:query — validated against api_version 2025-01
# Top-level `products` has no BEST_SELLING sort key. Pass a `collection_id:'…'`
# query filter to use a curated flagship set, otherwise fall back to the most
# recently updated products.
query LlmsTxtFlagship($first: Int!, $query: String) {
  products(first: $first, query: $query, sortKey: UPDATED_AT, reverse: true) {
    edges {
      node { id title onlineStoreUrl description }
    }
  }
}
```

```graphql
# themeFilesUpsert:mutation — validated against api_version 2025-01
mutation LlmsTxtUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: $themeId, files: $files) {
    upsertedThemeFiles { filename }
    userErrors { filename code message }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: <skill name>                         ║
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

If `dry_run: true`, prefix every mutation step with `[DRY RUN]` and do not execute it.

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
OUTCOME SUMMARY
  <Metric label>:   <value>
  Errors:           0
  Output:           <filename or "none">
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "<skill-slug>",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    {
      "step": 1,
      "operation": "<OperationName>",
      "type": "query",
      "params_summary": "<string>",
      "result_summary": "<string>",
      "skipped": false
    }
  ],
  "outcome": {
    "metric_key": 0,
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format
`human`: the full generated `llms.txt` + the post-publish step (create a Page on the `llms` template, or add a `/llms.txt` → page redirect). `json`: `{ theme_id, llms_txt, wrote: true|false, follow_up, errors }`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [llms.txt writer](https://useaiblocks.com/skills/llms-txt-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit | Wait 2s, retry up to 3 times |
| `ACCESS_DENIED` | Missing `write_themes` | Abort; output the generated llms.txt so it can be added manually |
| No flagship products | Empty/new catalog | Publish header + policies + contact only |

## Best Practices
- Keep it short and high-signal — `llms.txt` is a map, not a dump; link to canonical pages rather than pasting content.
- Regenerate when the flagship lineup or policies change (the `agentic-readiness-monitor` routine can schedule this).
- Pair with `shopify-admin-agentic-crawler-access` — an llms.txt only helps if crawlers are allowed in.
- After publishing, add a storefront redirect `/llms.txt` → the page so it sits at the conventional path.
