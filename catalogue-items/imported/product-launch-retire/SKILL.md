---
name: shopify-admin-product-lifecycle-manager
role: merchandising
description: "Bulk transition products through DRAFT → ACTIVE → ARCHIVED status for seasonal launches and sunsetting."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - productUpdate:mutation
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
Queries products matching a tag, vendor, collection, or status filter and bulk-transitions them to a target status (DRAFT, ACTIVE, or ARCHIVED). Used for seasonal launches (DRAFT → ACTIVE), end-of-season sunsetting (ACTIVE → ARCHIVED), and pre-launch staging (creating as DRAFT, activating on a date).

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,write_products`
- API scopes: `read_products`, `write_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| filter | string | yes | — | Product filter query (e.g., `tag:summer-2026`, `vendor:Nike`, `status:draft`) |
| target_status | string | yes | — | Target status: `ACTIVE`, `DRAFT`, or `ARCHIVED` |
| dry_run | bool | no | true | Preview products without executing mutations |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ⚠️ ARCHIVED products are hidden from all sales channels and cannot be purchased. ACTIVE products are immediately visible to customers. Run with `dry_run: true` to review the product list before committing — especially for ARCHIVED transitions which are hard to reverse in bulk.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `query: <filter>`, `first: 250`, pagination cursor
   **Expected output:** Products with `id`, `title`, `status`, `tags`; paginate until `hasNextPage: false`

2. Filter to products NOT already in `target_status` — skip those already correct

3. **OPERATION:** `productUpdate` — mutation
   **Inputs:** `id: <product_id>`, `status: <target_status>`
   **Expected output:** `product { id, title, status }`, `userErrors`

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query ProductsByFilter($query: String!, $after: String) {
  products(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        title
        status
        vendor
        tags
        publishedAt
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

```graphql
# productUpdate:mutation — validated against api_version 2025-01
mutation ProductUpdateStatus($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
      status
    }
    userErrors {
      field
      message
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Product Lifecycle Manager            ║
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
  Products matched:    <n>
  Already at target:   <n> (skipped)
  Status updated:      <n>
  Errors:              <n>
  Output:              lifecycle_update_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "product-lifecycle-manager",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": true,
  "filter": "<query>",
  "target_status": "ACTIVE",
  "outcome": {
    "matched": 0,
    "skipped_already_correct": 0,
    "updated": 0,
    "errors": 0,
    "output_file": "lifecycle_update_<date>.csv"
  }
}
```

## Output Format
CSV file `lifecycle_update_<YYYY-MM-DD>.csv` with columns:
`product_id`, `title`, `previous_status`, `new_status`, `vendor`, `tags`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product profit analyst](https://useaiblocks.com/skills/product-profit-analyst). It takes the spreadsheet.
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the spreadsheet.
- The [Shopify tracking number fixer](https://useaiblocks.com/skills/tracking-number-fixer). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on productUpdate | Product locked or invalid state | Log error, skip product, continue |
| No products match filter | Filter too narrow | Exit with 0 matches, suggest broadening filter |

## Best Practices
- Use tags to mark seasonal batches before running (e.g., tag products with `launch:2026-05` before activating them) so the filter is precise.
- ARCHIVED status removes products from all channels including the storefront, POS, and buy buttons — confirm this is the intent before running at scale.
- For large catalogs (500+ products), rate limiting will slow execution — the skill retries automatically but large batches may take several minutes.
- Pair with `product-data-completeness-score` before activating DRAFT products to ensure they have all required fields.
