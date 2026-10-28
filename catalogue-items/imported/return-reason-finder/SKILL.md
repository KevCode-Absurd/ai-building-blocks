---
name: shopify-admin-return-reason-analysis
role: returns
description: "Read-only: aggregates return reasons across orders to identify product quality or listing issues."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - returns:query
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
Queries all return requests within a date window and aggregates them by return reason code, product, and SKU. Surfaces which products have the highest return rates and which reasons (wrong size, damaged, not as described, etc.) are most common. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,read_returns`
- API scopes: `read_orders`, `read_returns`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Lookback window for return requests |
| min_returns | integer | no | 3 | Minimum returns per product to include in output |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `returns` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 250`, pagination cursor
   **Expected output:** Return objects with `returnLineItems { returnReason, refundableQuantity, fulfillmentLineItem { lineItem { product { title } variant { sku } } } }`; paginate until `hasNextPage: false`

2. Aggregate by: return reason → product → SKU; calculate return count and % of total returns per bucket
   Then apply `min_returns`: leave out of the product and SKU lists any product with fewer returns than `min_returns` (default 3). Totals and the reason counts still include every return. Say how many products were left out.

3. **OPERATION:** `orders` — query (for return rate context)
   **Inputs:** Same date window (`created_at` on orders, matching the returns query), `first: 250`, pagination cursor; page through until `hasNextPage: false` and add up the orders on every page. That total is the denominator for the return rate. Do not stop after the first page.

4. Map each Shopify `returnReason` code to the output label, and keep the raw code in the CSV:
   - `SIZE_TOO_LARGE`, `SIZE_TOO_SMALL` → Wrong size/fit
   - `NOT_AS_DESCRIBED`, `COLOR`, `STYLE` → Not as described
   - `DEFECTIVE` → Damaged/defective
   - `UNWANTED` → Changed mind
   - `WRONG_ITEM`, `OTHER`, `UNKNOWN` and any code not listed → Other

## GraphQL Operations

```graphql
# returns:query — validated against api_version 2025-01
query ReturnsAnalysis($query: String!, $after: String) {
  returns(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        status
        createdAt
        order {
          id
          name
        }
        returnLineItems(first: 50) {
          edges {
            node {
              id
              quantity
              returnReason
              returnReasonNote
              fulfillmentLineItem {
                lineItem {
                  product {
                    id
                    title
                  }
                  variant {
                    id
                    sku
                    title
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

```graphql
# orders:query — validated against api_version 2025-01
query OrderCountForPeriod($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
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
║  SKILL: Return Reason Analysis               ║
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
RETURN REASON ANALYSIS  (<days_back> days)
  Total returns:   <n>
  Total orders:    <n>
  Return rate:     <pct>%

  Top Reasons
  ─────────────────────────────────────────
  Wrong size/fit        <n>  (<pct>%)
  Not as described      <n>  (<pct>%)
  Damaged/defective     <n>  (<pct>%)
  Changed mind          <n>  (<pct>%)
  Other                 <n>  (<pct>%)

  Top Products by Return Volume
  ─────────────────────────────────────────
  <Product Title>   <n> returns  (<SKU>)
  Output: return_reasons_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "return-reason-analysis",
  "store": "<domain>",
  "period_days": 30,
  "total_returns": 0,
  "total_orders": 0,
  "return_rate_pct": 0,
  "by_reason": [],
  "by_product": [],
  "output_file": "return_reasons_<date>.csv"
}
```

## Output Format
The CSV holds customer return notes and order names, which are personal data. Tell the user to keep it private and delete it when the analysis is done.

CSV file `return_reasons_<YYYY-MM-DD>.csv` with columns:
`return_id`, `order_name`, `product_title`, `sku`, `quantity`, `return_reason`, `reason_note`, `created_at`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product returns and refund reviewer](https://useaiblocks.com/skills/monthly-returns-and-refunds-reviewer).
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Exchange and refund split analyst](https://useaiblocks.com/skills/exchange-or-refund-split-reader).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No returns in window | No return requests in period | Exit with summary: 0 returns |
| Missing product/variant on line item | Deleted product | Log as "deleted product", include in reason counts |

## Best Practices
- Cross-reference high-return products with their listing descriptions and images — "not as described" returns often indicate a copy or photography issue.
- Use `min_returns: 10` for larger stores to focus on statistically significant patterns rather than one-off complaints.
- Run monthly and compare period-over-period to track whether merchandising or product quality improvements are reducing specific return reasons.
- To see whether high-return products recover revenue through exchanges, check your Shopify admin by hand. No exchange-ratio item is in this library yet.
