---
name: shopify-admin-average-order-value-trends
role: finance
description: "Read-only: tracks AOV over time buckets and segments by new vs. returning customers."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
  - customers:query
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
Calculates Average Order Value (AOV) over configurable time buckets (daily, weekly, monthly) and segments results by new vs. returning customers. Tracks AOV trends to measure the impact of upsell programs, bundle offers, or free shipping thresholds. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,read_customers`
- API scopes: `read_orders`, `read_customers` (add `read_all_orders` for windows longer than 60 days)

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 90 | Total lookback window |
| bucket | string | no | week | Time bucket: `day`, `week`, or `month` |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 250`, select `totalPriceSet`, `customer { id }`, `customerJourneySummary { customerOrderIndex }`, `createdAt`, pagination cursor
   **Expected output:** All orders in window; paginate until `hasNextPage: false`
   **Note:** with only `read_orders`, Shopify returns the last 60 days of orders. A longer window (such as the 90-day default) needs the `read_all_orders` scope as well, which may need Shopify's approval (see https://shopify.dev/docs/api/usage/access-scopes). If you lack it, say the window was cut to 60 days.

2. Classify each order by its place in that customer's history **at the time of the order**, not by today's count:
   - `customerJourneySummary.customerOrderIndex == 1` → new customer order
   - `customerOrderIndex >= 2` → returning customer order
   - `customerOrderIndex` missing (null) → `unknown`. Do not guess. Report how many orders are unknown.
   - Never use `customer.numberOfOrders` for this. Shopify defines it as the number of orders the customer has made in their lifetime (https://shopify.dev/docs/api/admin-graphql/latest/objects/Customer). Once a customer orders again, their first order would wrongly turn "returning".
   - Check with a two-order case: a customer orders $20 in January and $40 in February. January must be new ($20) and February returning ($40). Lifetime count would put both in returning.

3. **OPERATION:** `customers` — query (optional; skip it if you only need the order-based split)
   **Inputs:** Recent customers, used only for context such as how many customers placed orders. It cannot settle new vs. returning on its own, because `numberOfOrders` is a lifetime count.

4. Group orders by time bucket; calculate AOV per bucket and per customer segment. AOV is the mean of `totalPriceSet`, which includes tax and shipping.

## GraphQL Operations

```graphql
# orders:query — check the fields against your api_version before running
query AOVData($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
        }
        customerJourneySummary {
          customerOrderIndex
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
# customers:query — validated against api_version 2025-01
query NewVsReturningCustomers($query: String!, $after: String) {
  customers(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        numberOfOrders
        createdAt
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
║  SKILL: Average Order Value Trends           ║
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
AOV TRENDS  (<days_back> days, bucket: <bucket>)
  Orders analyzed:   <n>
  Overall AOV:       $<amount>
  New customer AOV:  $<amount>
  Returning AOV:     $<amount>

  Period      Orders   AOV     New AOV  Returning AOV
  ────────────────────────────────────────────────────
  2026-W14    <n>      $<n>    $<n>     $<n>
  Output: aov_trends_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "average-order-value-trends",
  "store": "<domain>",
  "period_days": 90,
  "overall_aov": 0,
  "new_customer_aov": 0,
  "returning_customer_aov": 0,
  "by_period": [],
  "output_file": "aov_trends_<date>.csv"
}
```

## Output Format
CSV file `aov_trends_<YYYY-MM-DD>.csv` with columns:
`period`, `order_count`, `aov`, `new_customer_orders`, `new_customer_aov`, `returning_orders`, `returning_aov`, `unknown_orders`, `currency`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shopify dashboard reader](https://useaiblocks.com/skills/shopify-dashboard-reader).
- The [Price test results reviewer](https://useaiblocks.com/skills/price-test-keeper).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Guest checkout orders | No customer record | Count in totals but exclude from new/returning segmentation |
| `customerOrderIndex` is null | Shopify has no order-history position for that order | Count in totals, report as `unknown`, never as new |
| Orders older than 60 days missing | No `read_all_orders` scope | Say the window was cut to 60 days; do not present it as the full window |
| No orders in window | New store or quiet period | Exit with 0 AOV |

## Best Practices
- A free shipping threshold increase or bundle introduction should show up as an AOV lift in the week/month it launched — use this report to measure the impact.
- Compare the new and returning split with your own store's earlier periods. A shrinking gap against your own history is worth a look.
- `bucket: week` is best for campaign measurement; `bucket: month` for long-term trend tracking.
- Guest checkout orders cannot be segmented as new vs. returning — for stores with high guest checkout rates, the segmentation will under-count new customers.
