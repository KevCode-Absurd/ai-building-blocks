---
name: shopify-admin-top-product-performance
role: conversion-optimization
description: "Rank products by revenue, units sold, and refund rate over a date range by aggregating order line items."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
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
Ranks products by revenue, units sold, and refund rate for a given date range by aggregating order line items and refund line items across all orders in the period. Useful for identifying top performers and products with high refund rates. Read-only — no mutations are executed.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- API scopes: `read_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Not used. This skill is read-only, so there is nothing to preview or undo. |
| date_range_start | string | yes | — | Start date in ISO 8601 (e.g., `2025-01-01`) |
| date_range_end | string | yes | — | End date in ISO 8601 (e.g., `2025-01-31`) |
| top_n | integer | no | 20 | Number of top products to show in the ranked output |
| sort_by | string | no | revenue | Ranking metric: `revenue`, `units`, or `refund_rate` |

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `first: 250`, `query: "created_at:>='<date_range_start>' created_at:<='<date_range_end>'"`, pagination cursor
   **Expected output:** All orders in range with line items (`title`, `quantity`, `originalTotalSet`, `refundableQuantity`) and refund line items; paginate until `hasNextPage: false`; aggregate in-memory per product: sum `originalTotalSet` for gross revenue, sum refund amounts for net revenue, sum quantities for units sold, compute refund rate (refund rate % = refunded amount ÷ gross revenue × 100, per product)

   **Limit:** `lineItems(first: 50)` and `refundLineItems(first: 50)` return at most 50 lines per order. If an order has more than 50 lines, page that order's lines with their own cursor. If you cannot, say which orders were cut off and that their counts are understated.

## GraphQL Operations

```graphql
# orders:query (for product revenue) — validated against api_version 2025-01
query OrdersForProductPerformance($first: Int!, $after: String, $query: String) {
  orders(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        createdAt
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              variant {
                id
                sku
                product {
                  id
                  title
                }
              }
              originalTotalSet {
                shopMoney { amount currencyCode }
              }
              refundableQuantity
            }
          }
        }
        refunds {
          refundLineItems(first: 50) {
            edges {
              node {
                quantity
                lineItem {
                  variant {
                    id
                    product { id title }
                  }
                }
                subtotalSet {
                  shopMoney { amount currencyCode }
                }
              }
            }
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

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: top-product-performance              ║
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
OUTCOME SUMMARY
  Orders processed:   <n>
  Products ranked:    <n>
  Date range:         <start> to <end>
  Sort by:            <revenue|units|refund_rate>
  Errors:             0
  Output:             none
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "top-product-performance",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "OrdersForProductPerformance", "type": "query", "params_summary": "<date_range_start> to <date_range_end>", "result_summary": "<n> orders processed", "skipped": false }
  ],
  "outcome": {
    "orders_processed": 0,
    "products_ranked": 0,
    "date_range_start": "<date_range_start>",
    "date_range_end": "<date_range_end>",
    "sort_by": "revenue",
    "results": [],
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format
Ranked table displayed inline (no CSV), truncated to `top_n` entries:

| Rank | Product | Units Sold | Gross Revenue | Refunded Amount | Net Revenue | Refund Rate % |
|------|---------|------------|---------------|-----------------|-------------|---------------|
| 1 | ... | ... | ... | ... | ... | ... |

For `format: json`, `results` is an array of objects with keys: `rank`, `product_id`, `product_title`, `units_sold`, `gross_revenue`, `refunded_amount`, `net_revenue`, `refund_rate_pct`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shopify return reason finder](https://useaiblocks.com/skills/return-reason-finder).
- The [Shopify discount code analyst](https://useaiblocks.com/skills/discount-code-comparer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| No orders returned | No orders in date range | Widen date range |
| `variant` is null on a line item | Product or variant was deleted | Still aggregated by title; product_id will be null |
| Rate limit (429) | Too many paginated requests | Narrow date range |

## Best Practices
1. For stores with many orders, use a 30-day window first. Wider windows paginate more aggressively and take longer.
2. `sort_by: refund_rate` highlights products with quality or expectation issues — a refund rate above 10% is worth investigating.
3. Revenue figures are gross (before refunds) and net (after refunds) — use net revenue for accurate profitability ranking.
4. Products that have been deleted will still appear if they were purchased in the date range — they show with `product_id: null` and their title from the order line item.
5. Combine with `discount-ab-analysis` (on AI Blocks, the Discount code comparer) to see which discount codes drove the most revenue for your top products.
