---
name: shopify-admin-collection-membership-audit
role: merchandising
description: "Read-only: lists orphan products (in zero collections) and over-collected products for catalog hygiene."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - product:query
  - collections:query
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
Identifies products that are not in any collection ("orphans" — no collection page lists them) and products that appear in an unusually high number of collections ("over-collected" — potential merchandising noise). Read-only — no mutations.

What this audit does not prove: being in zero collections does not mean a shopper cannot reach the product. It can still be found through store search, a direct link, the store's all-products page, or a menu item that links straight to the product. Being in a collection does not prove the collection is in a menu or published to the Online Store. This skill does not read menus or sales-channel publishing, so report orphans as "in no collection", never as "invisible" or "unreachable".

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products`
- API scopes: `read_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| max_collections | integer | no | 10 | Flag products in more than this many collections |
| status_filter | string | no | active | Product status to scan: `active`, `draft`, or `all` |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `query: "status:<status_filter>"` (omit `query` when `status_filter` is `all`), `first: 25`, select `collections(first: 25) { edges { node { id title } } pageInfo { hasNextPage endCursor } }`, pagination cursor
   **Expected output:** Products with their collection memberships; paginate products until `hasNextPage: false`. The small page sizes keep each request under Shopify's per-query cost limit; if you get `MAX_COST_EXCEEDED`, lower both `first` values.

2. **OPERATION:** `product` — query (only for products whose `collections.pageInfo.hasNextPage` is true)
   **Inputs:** product `id`, `first: 250`, `after: <collections endCursor>`
   **Expected output:** The rest of that product's collections; repeat until `hasNextPage: false`. Never count from a truncated first page: a product in 45 collections must count as 45, not 25.

3. For each product: count all collections → flag if 0 (orphan) or > `max_collections` (over-collected). If any product's collection list could not be fully paged (for example after repeated throttling), list it as `incomplete` in the report instead of clearing it.

4. **OPERATION:** `collections` — query (for collection names)
   **Inputs:** `first: 250`, select `id`, `title`, `productsCount`
   **Expected output:** Collection metadata for enriching the report

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query ProductCollectionMembership($query: String, $after: String) {
  products(first: 25, after: $after, query: $query) {
    edges {
      node {
        id
        title
        handle
        status
        collections(first: 25) {
          edges {
            node {
              id
              title
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
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
# product:query — page through the rest of one product's collections
query ProductCollectionsPage($id: ID!, $after: String) {
  product(id: $id) {
    id
    collections(first: 250, after: $after) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

```graphql
# collections:query — validated against api_version 2025-01
query CollectionOverview($after: String) {
  collections(first: 250, after: $after) {
    edges {
      node {
        id
        title
        handle
        productsCount {
          count
        }
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
║  SKILL: Collection Membership Audit          ║
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
COLLECTION MEMBERSHIP AUDIT
  Products scanned:      <n>
  Orphan products (0 collections):     <n>
  Over-collected (> <max_collections>): <n>
  Incomplete (collections not fully read): <n>
  Note: in no collection is not the same as unreachable; menus, search and direct links were not checked.

  Orphan products (sample):
    "<title>" — <status>
  Output: collection_audit_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "collection-membership-audit",
  "store": "<domain>",
  "products_scanned": 0,
  "orphan_count": 0,
  "over_collected_count": 0,
  "incomplete_count": 0,
  "output_file": "collection_audit_<date>.csv"
}
```

## Output Format
CSV file `collection_audit_<YYYY-MM-DD>.csv` with columns:
`product_id`, `title`, `handle`, `status`, `collection_count`, `collections`, `issue` (`orphan`, `over_collected` or `incomplete`)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product data gaps and catalogue review](https://useaiblocks.com/skills/monthly-catalogue-clean-up-keeper).
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No orphans found | All products are in collections | Exit with ✅ no orphans found |

## Best Practices
- Orphan active products are missing from every collection page, so shoppers browsing collections will not see them. Before you call one hidden, check your menus (a menu item can link straight to a product), search and sales-channel publishing. Prioritize fixing true gaps.
- The `collections` field counts both manual and automated (smart) collections, so an orphan here is in neither. Automated collection membership changes when tags or product details change, so re-run after bulk edits.
- Use `max_collections: 5` for stores with a tightly curated navigation; use higher thresholds for marketplace-style stores where cross-listing is intentional.
- Run after seasonal catalog refreshes to ensure all new products are assigned to the right collections.
