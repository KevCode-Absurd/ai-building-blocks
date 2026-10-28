---
name: shopify-admin-discount-ab-analysis
role: conversion-optimization
description: "Compare redemption rates and revenue performance across two or more discount codes over a specified date range."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - discountNodes:query
  - orders:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
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
Compares how different discount codes perform against each other by redemption count and revenue generated. Useful for A/B testing promotional offers without a dedicated analytics app — provide two or more codes and a date range, and the skill queries Shopify for discount metadata and order revenue, then produces a side-by-side comparison table. Read-only: no mutations are executed.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`
- API scopes: `read_discounts`, `read_orders`, and `read_all_orders` if the date range goes back more than about 60 days (without it Shopify returns only recent orders, so older totals come back short)

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Preview operations without executing mutations |
| discount_codes | array | yes | — | Array of 2 or more discount code strings to compare (e.g., `["SAVE10", "WELCOME15"]`) |
| date_range_start | string | yes | — | Start date in ISO 8601 (e.g., `2025-01-01`) |
| date_range_end | string | yes | — | End date in ISO 8601 (e.g., `2025-01-31`) |

## Workflow Steps

1. **OPERATION:** `discountNodes` — query
   **Inputs:** `first: 50`, `query: "code:<code>"` (one query per code in `discount_codes`)
   **Expected output:** Discount metadata: title, code strings, `asyncUsageCount`, status, `startsAt`, `endsAt` per code

2. **OPERATION:** `orders` — query (one paginated query per discount code)
   **Inputs:** `first: 250`, `query: "discount_code:<code> created_at:>='<date_range_start>' created_at:<='<date_range_end>'"`, pagination cursor
   **Expected output:** Orders containing the discount code with `totalPriceSet`; paginate until `hasNextPage: false`; aggregate: count, sum revenue, compute avg order value

## GraphQL Operations

```graphql
# discountNodes:query — validated against api_version 2025-01
query DiscountNodes($first: Int!, $query: String) {
  discountNodes(first: $first, query: $query) {
    edges {
      node {
        id
        discount {
          ... on DiscountCodeBasic {
            title
            codes(first: 10) {
              edges {
                node {
                  code
                  asyncUsageCount
                }
              }
            }
            usageLimit
            status
            startsAt
            endsAt
          }
          ... on DiscountCodeBxgy {
            title
            codes(first: 10) {
              edges {
                node {
                  code
                  asyncUsageCount
                }
              }
            }
            status
          }
          ... on DiscountCodeFreeShipping {
            title
            codes(first: 10) {
              edges {
                node {
                  code
                  asyncUsageCount
                }
              }
            }
            status
          }
        }
      }
    }
  }
}
```

```graphql
# orders:query (by discount code) — validated against api_version 2025-01
query OrdersByDiscountCode($first: Int!, $after: String, $query: String) {
  orders(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        createdAt
        totalPriceSet {
          shopMoney { amount currencyCode }
        }
        discountCodes
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
║  SKILL: discount-ab-analysis                 ║
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
  Codes analyzed:   <n>
  Date range:       <start> to <end>
  Errors:           0
  Output:           none
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "discount-ab-analysis",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "DiscountNodes", "type": "query", "params_summary": "<n> codes queried", "result_summary": "<n> discount nodes found", "skipped": false },
    { "step": 2, "operation": "OrdersByDiscountCode", "type": "query", "params_summary": "date range <start> to <end>", "result_summary": "<n> orders aggregated", "skipped": false }
  ],
  "outcome": {
    "codes_analyzed": 0,
    "date_range_start": "<start>",
    "date_range_end": "<end>",
    "results": [
      {
        "code": "SAVE10",
        "async_usage_count": 0,
        "orders_in_range": 0,
        "total_revenue": "0.00",
        "avg_order_value": "0.00",
        "revenue_per_use": "0.00"
      }
    ],
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format

A comparison table per code (displayed inline):

| Code | Uses (asyncUsageCount) | Orders in Range | Total Revenue | Avg Order Value | Revenue per Use |
|------|------------------------|-----------------|---------------|-----------------|-----------------|
| SAVE10 | ... | ... | ... | ... | ... |
| WELCOME15 | ... | ... | ... | ... | ... |

Revenue per Use = Total Revenue in the date range ÷ Orders in Range. `asyncUsageCount` is the code's lifetime count, so never use it in this calculation; show it only as context.

For `format: json`, the `results` array contains one object per code with keys: `code`, `async_usage_count`, `orders_in_range`, `total_revenue`, `avg_order_value`, `revenue_per_use`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| Discount code not found | Code doesn't exist or was deleted | Verify code in Shopify admin |
| No orders returned for a code | No orders used this code in the date range | Widen date range or verify code was active |
| `discount_codes` has fewer than 2 entries | Can't do A/B with 1 code | Provide at least 2 codes |
| Rate limit (429) | Too many paginated orders queries | Wait and retry; reduce date range |

## Best Practices
1. `asyncUsageCount` is the lifetime usage count from the discount object — `orders_in_range` is what was redeemed in your date window. Both are reported for full context.
2. For codes with high usage, the orders query will paginate — larger date ranges may produce many API calls. Consider narrowing the date range for faster results.
3. Revenue per use is the best signal for comparing codes with different usage volumes.
4. Run this analysis at the end of a campaign period before deciding which discount strategy to repeat.
5. If `asyncUsageCount` is 0 for a code, check that the code was active during the date range and correctly applied at checkout.
