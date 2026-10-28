---
name: shopify-admin-revenue-by-location-report
role: finance
description: "Read-only: breaks down revenue by fulfillment location for multi-warehouse P&L and location performance."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
  - fulfillmentOrders:query
  - locations:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude or ChatGPT with a Shopify connection:** It reads your orders and locations directly.
- **A spreadsheet:** Lets you place each location's costs beside its revenue.
<!-- /needs -->

## Purpose
Attributes order revenue to the fulfillment location that shipped the order. Produces a revenue breakdown by warehouse or fulfillment center, useful for multi-location P&L, location staffing decisions, and understanding where demand is being fulfilled from. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders`
- API scopes: `read_orders`. Shopify returns only the last 60 days of orders unless the access also has `read_all_orders`. If `days_back` is more than 60 and you do not have it, say so before you start.
- **No Shopify access?** Ask once for an orders export for the window that includes the order total and the fulfillment location for each order, then run step 4 on it. If the export has no location column, stop and say the report cannot be made from it. Never guess a location.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Lookback window |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `locations` — query
   **Inputs:** `first: 50`, active only
   **Expected output:** Location IDs and names for enrichment

2. **OPERATION:** `orders` — query
   **Inputs:** `query: "fulfillment_status:shipped created_at:>='<NOW - days_back days>'"`, `first: 250`, select `fulfillments { assignedLocation }`, `totalPriceSet`, pagination cursor
   **Expected output:** Shipped orders with location attribution. Also select `cancelledAt` and leave out any cancelled order.

3. **OPERATION:** `fulfillmentOrders` — query (to fill gaps only)
   **Inputs:** Per location, `status: CLOSED`, `first: 250`
   **Expected output:** Closed fulfillment orders. Use them only to find a location for an order from step 2 that had none, matching on order ID. Never add an order that step 2 did not return, or revenue is counted twice.

4. Aggregate revenue by location:
   - An order shipped from one location goes to that location, at its full total.
   - An order shipped from more than one location goes to a line named "Split across locations", at its full total. Never divide a total by guesswork. Report how many orders fall here.
   - An order with no location data after step 3 goes to "Unknown".
   - Revenue is the order total including tax and shipping, before refunds. Say so in the report.

## GraphQL Operations

```graphql
# locations:query — validated against api_version 2025-01
query LocationsList {
  locations(first: 50, includeInactive: false) {
    edges {
      node {
        id
        name
      }
    }
  }
}
```

```graphql
# orders:query — validated against api_version 2025-01
query RevenueByLocation($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        cancelledAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        fulfillments {
          assignedLocation {
            location {
              id
              name
            }
          }
          status
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
# fulfillmentOrders:query — validated against api_version 2025-01
query ClosedFulfillmentOrders($locationId: ID!, $after: String) {
  fulfillmentOrders(
    assignedLocationId: $locationId
    first: 250
    after: $after
    query: "status:closed"
  ) {
    edges {
      node {
        id
        order {
          id
          name
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
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
║  SKILL: Revenue by Location Report           ║
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
REVENUE BY LOCATION  (<days_back> days)
  Total revenue:   $<amount>
  Orders included: <n>

  Location                Orders   Revenue    Share
  ─────────────────────────────────────────────────
  Warehouse A             <n>      $<n>       <pct>%
  Warehouse B             <n>      $<n>       <pct>%
  Split across locations  <n>      $<n>       <pct>%
  Unknown                 <n>      $<n>       <pct>%
  (Revenue is the order total, including tax and shipping, before refunds)
  Output: revenue_by_location_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "revenue-by-location-report",
  "store": "<domain>",
  "period_days": 30,
  "total_revenue": 0,
  "currency": "USD",
  "by_location": [],
  "output_file": "revenue_by_location_<date>.csv"
}
```

## Output Format
CSV file `revenue_by_location_<YYYY-MM-DD>.csv` with columns:
`location_id`, `location_name`, `order_count`, `total_revenue`, `currency`, `share_pct`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Online order fulfillment planner](https://useaiblocks.com/skills/online-order-fulfillment-planner). It takes the spreadsheet.
- The [Product profit analyst](https://useaiblocks.com/skills/product-profit-analyst). It takes the spreadsheet.
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Order with no fulfillment location | Unfulfilled or POS order | Attribute to "Unknown" |
| Single-location store | All revenue from one location | Report still valid, shows full total |

## Best Practices
- For multi-3PL operations, this report helps identify if one 3PL is handling a disproportionate share and may need capacity relief.
- Use this for stores with two or more locations. With one location, every order lands on that line and the report adds nothing.
- Revenue attribution here is based on fulfillment assignment, not customer shipping address — it reflects operational throughput per location, not geographic demand.
- Revenue is not profit. Place each location's costs (rent, staff, shipping, stock) beside its revenue to judge it. This skill does not know those costs.
- Pair with an inventory value report to work out inventory turns per location (revenue divided by inventory value).
