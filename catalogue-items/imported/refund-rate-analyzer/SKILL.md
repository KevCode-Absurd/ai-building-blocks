---
name: shopify-admin-refund-rate-analysis
role: finance
description: "Read-only: calculates refund rate by product, collection, or period — identifies quality and listing issues."
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
Analyzes orders with refunds to calculate refund rates by product, time period, and channel. Surfaces which products or product groups generate the most refund activity. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders`
- API scopes: `read_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Lookback window |
| group_by | string | no | product | Breakdown: `product`, `vendor`, or `period` |
| min_orders | integer | no | 5 | Minimum orders per group to include in rate calculation |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 250`, select `refunds { refundLineItems }`, `lineItems`, pagination cursor
   **Expected output:** All orders with refund data; paginate until `hasNextPage: false`

2. For each refunded line item: record product, vendor, quantity refunded, refund amount

3. Aggregate by `group_by`: calculate `refund_rate = refunded_units / total_units_sold × 100`

## GraphQL Operations

```graphql
# orders:query — validated against api_version 2025-01
query OrdersWithRefunds($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        lineItems(first: 50) {
          edges {
            node {
              id
              quantity
              product {
                id
                title
                vendor
              }
              variant {
                id
                sku
              }
            }
          }
        }
        refunds {
          id
          createdAt
          totalRefundedSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          refundLineItems(first: 50) {
            edges {
              node {
                quantity
                lineItem {
                  product {
                    id
                    title
                    vendor
                  }
                  variant {
                    id
                    sku
                  }
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
║  SKILL: Refund Rate Analysis                 ║
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
REFUND RATE ANALYSIS  (<days_back> days)
  Orders analyzed:       <n>
  Orders with refunds:   <n>
  Overall refund rate:   <pct>%
  Total refunded:        $<amount>

  By <group_by>:
    "<name>"   Sold: <n>  Refunded: <n>  Rate: <pct>%
  Output: refund_rate_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "refund-rate-analysis",
  "store": "<domain>",
  "period_days": 30,
  "orders_analyzed": 0,
  "orders_with_refunds": 0,
  "overall_refund_rate_pct": 0,
  "total_refunded": 0,
  "currency": "USD",
  "output_file": "refund_rate_<date>.csv"
}
```

## Output Format
CSV file `refund_rate_<YYYY-MM-DD>.csv` with columns:
`group`, `group_name`, `total_units_sold`, `refunded_units`, `refund_rate_pct`, `total_refund_amount`, `currency`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shopify return reason finder](https://useaiblocks.com/skills/return-reason-finder).
- The [Repeat partial refund spotter](https://useaiblocks.com/skills/repeat-partial-refund-spotter).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No refunds in window | Clean period | Exit with 0% rate, expected |
| Deleted product on refund line | Product removed after refund | Log as "deleted product" in group |

## Limits

- Each order's line items and refunds are read up to 50 per order, so very large orders may be undercounted.
- The `period_days` and `currency` values in the JSON example are examples. Use the days back the user asked for and the store's real currency.

## Best Practices
- A refund rate that is high compared with your other products may point to a listing, quality, or expectation mismatch issue. What counts as high varies by category, so compare against your own products and past months.
- Use `group_by: vendor` to identify if quality problems are concentrated with a specific supplier.
- Cross-reference high-refund products with the return reason finder from this library (`return-reason-analysis` in the original) to understand whether the issue is product quality, wrong size, or customer expectation.
- Run before quarterly supplier reviews to support data-driven conversations about product quality and chargebacks.
