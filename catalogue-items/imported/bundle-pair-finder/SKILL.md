---
name: shopify-admin-frequently-bought-together
role: conversion-optimization
description: "Read-only: mines order history to find product pairs frequently purchased together, generating cross-sell and bundle recommendations."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
  - products:query
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
Analyzes order history to discover which products are frequently purchased together. Calculates co-occurrence frequency, lift scores, and confidence metrics to generate data-driven cross-sell recommendations and bundle candidates. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,read_products`
- API scopes: `read_orders`, `read_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain |
| days_back | integer | no | 180 | Order lookback window |
| min_support | integer | no | 3 | Minimum co-occurrence count to report a pair |
| max_results | integer | no | 25 | Maximum product pairs to return |
| collection_filter | string | no | — | Limit to products in a specific collection |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 10`, select `lineItems(first: 30) { product { id, title } }` with its `pageInfo`, pagination cursor. If the orders `hasNextPage` is true, repeat with `after: endCursor` until all orders are read, so a busy store needs many passes. Keep the page sizes small: Shopify refuses any single query whose requested cost is over 1,000 points, and nested pages multiply (250 orders with 250 line items each would be far over). If Shopify says the query cost is too high, lower the orders page size.
   **Line items:** if an order's `lineItems.pageInfo.hasNextPage` is true, fetch the rest of that order's line items with the `OrderMoreLineItems` query below, page by page, before you use the order. Never analyse an order from its first page of line items only.
   **Expected output:** All orders in the window, each with its complete list of line items. Say how many orders needed extra line-item pages.

2. For each order, make the set of distinct products in it (count a product once per order, whatever the quantity; skip line items with no product, such as custom items, and say how many). Keep every order, including single-product orders: they count towards how often each product sells.

3. Build the counts. Let **N** = the number of orders in the window, all of them, not only orders with two or more products.
   - **support(A)** = number of orders containing product A
   - **support(A,B)** = number of orders containing both A and B (from every pair of distinct products inside each order)
   - **Confidence(A→B)** = P(B|A) = support(A,B) / support(A)
   - **P(B)** = support(B) / N
   - **Lift** = confidence(A→B) / P(B) = support(A,B) × N / (support(A) × support(B)) — lift > 1.0 means they sell together more often than chance
   - Worked check: say N = 100 orders, A is in 20, B in 10, both in 5. Confidence(A→B) = 5/20 = 0.25, P(B) = 10/100 = 0.10, lift = 0.25/0.10 = 2.5.
   This skill finds pairs only. It does not count groups of three or more.

4. **OPERATION:** `products` — query (enrichment)
   **Inputs:** Product IDs from top pairs for titles, images, prices
   **Expected output:** Product details for display

5. Rank pairs by lift score (descending), filter by min_support. If `collection_filter` is set, read that collection's product IDs (page through `collection(id:) { products(first: 250) { ... } }`) and keep only pairs where both products are in it. N and support still count every order in the window.

## GraphQL Operations

```graphql
# orders:query — written for api_version 2025-01; check Shopify's current docs
query OrderLineItems($query: String!, $after: String) {
  orders(first: 10, after: $after, query: $query) {
    edges {
      node {
        id
        lineItems(first: 30) {
          edges {
            node {
              product { id title }
              quantity
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

```graphql
# Rest of one order's line items, when lineItems.pageInfo.hasNextPage is true
query OrderMoreLineItems($id: ID!, $after: String) {
  order(id: $id) {
    lineItems(first: 250, after: $after) {
      edges { node { product { id title } quantity } }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

```graphql
# products:query — written for api_version 2025-01; check Shopify's current docs
query ProductDetails($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      id
      title
      vendor
      productType
      priceRangeV2 {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      totalInventory
      status
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Frequently Bought Together           ║
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
FREQUENTLY BOUGHT TOGETHER  (<days_back> days, <n> orders analyzed)
  Unique product pairs found: <n>
  Pairs meeting min_support:  <n>

  TOP PAIRS BY LIFT:
  #1  "<product A>" + "<product B>"
      Support: <n> orders  Lift: <n>x  Confidence: <pct>%

  #2  "<product A>" + "<product B>"
      Support: <n> orders  Lift: <n>x  Confidence: <pct>%

  BUNDLE CANDIDATES (high support + high lift):
    "<product A>" + "<product B>"  →  Combined price today: $<sum of both current prices> (set your own bundle discount; none is assumed)

  Output: fbt_pairs_<date>.csv
══════════════════════════════════════════════
```

## Output Format
CSV file `fbt_pairs_<YYYY-MM-DD>.csv` with columns:
`product_a_id`, `product_a_title`, `product_b_id`, `product_b_title`, `support`, `confidence_a_to_b`, `confidence_b_to_a`, `lift`, `combined_avg_price`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Single-item orders only | Store with no multi-item orders | Report empty — suggest longer lookback window |
| Too many products | Combinatorial explosion | Limit to top 500 products by order count |

## Best Practices
- Use `days_back: 180` or `365` for sufficient sample size.
- Pairs with lift > 2.0 are strong bundle candidates.
- Use results to create manual product bundles or configure upsell apps.
- Cross-reference with the Top product ranker to ensure paired items are high-performing.
- Products with high confidence A→B but low confidence B→A suggest directional upsells (show B when A is in cart).
