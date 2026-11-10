---
name: shopify-admin-repeat-purchase-rate
role: order-intelligence
description: "Read-only: calculates what percentage of customers place 2+ orders within N days, segmented by product or collection."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - customers:query
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
Calculates the repeat purchase rate — the percentage of customers who return to place at least one more order within a defined window — and segments it by first-purchase product or collection. Identifies which products drive the highest repeat purchase behavior. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers,read_orders`
- API scopes: `read_customers`, `read_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 90 | Acquisition window — customers first purchased in this period |
| repeat_window | integer | no | 90 | Days after first purchase to look for a repeat order |
| segment_by | string | no | none | Segment repeat rate by: `product`, `none` |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `customers` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 250`, select `id`, `numberOfOrders`, `createdAt`
   **Expected output:** Customers acquired in window

2. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<acquisition start>'"` where acquisition start = today minus `days_back` days (no end date, so every order from then until today is read), `first: 250`, select `customer { id }`, `createdAt`, `totalPriceSet { shopMoney { amount currencyCode } }` (for `total_spent`), `lineItems { product { id, title } }`, pagination cursor
   **Expected output:** Orders to build per-customer purchase history and first-product mapping

   Keep paging with `hasNextPage` and `endCursor` for both queries until `hasNextPage` is false, so no customer or order is missed.
   Note: `numberOfOrders` counts all orders ever placed, so do not use it for the repeat check. Count the dated orders returned in step 2 that fall inside the window instead. The first product is the first line item of the customer's earliest order. Only the first 5 line items of each order are read.

3. For each acquired customer, find their earliest order in the step 2 data. That first order counts as order 1. They are a repeat purchaser if they placed at least one more order no later than `repeat_window` days after the first order. The window is measured from the first order, not from the start of the acquisition period. Customers whose window is still open today can only count as repeat if they already ordered again; say how many of those there are in the report.

4. Calculate overall rate; if `segment_by: product`, group by first-purchased product

## GraphQL Operations

```graphql
# customers:query — validated against api_version 2025-01
query AcquiredCustomers($query: String!, $after: String) {
  customers(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        createdAt
        numberOfOrders
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
query CustomerOrderHistory($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
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
        lineItems(first: 5) {
          edges {
            node {
              product {
                id
                title
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
║  SKILL: Repeat Purchase Rate                 ║
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
REPEAT PURCHASE RATE
  Acquisition window:  <days_back> days
  Repeat window:       <repeat_window> days
  Customers acquired:  <n>
  Repeat purchasers:   <n>
  Repeat rate:         <pct>%

  By First Product:
    "<product>"  Acquired: <n>  Repeat: <pct>%
  Output: repeat_purchase_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "repeat-purchase-rate",
  "store": "<domain>",
  "acquisition_days": 90,
  "repeat_window_days": 90,
  "customers_acquired": 0,
  "repeat_purchasers": 0,
  "repeat_rate_pct": 0,
  "by_product": [],
  "output_file": "repeat_purchase_<date>.csv"
}
```

## Output Format
CSV file `repeat_purchase_<YYYY-MM-DD>.csv` with columns:
`customer_id`, `first_order_date`, `first_product`, `total_orders`, `is_repeat`, `days_to_repeat`, `total_spent`

`total_orders` is the count of that customer's dated orders in the step 2 data. `total_spent` is the sum of `totalPriceSet` on those orders. The file holds customer IDs, which are personal data. Do not read customer emails: they are not needed. Tell the user to store the file safely and share it only with people who need it.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Sign-up group retention analyst](https://useaiblocks.com/skills/retention-cohort-analyst).
- The [Shopify loyalty customer list builder](https://useaiblocks.com/skills/loyalty-customer-list-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Guest checkout customers | No customer record to link orders | Exclude from analysis |
| Insufficient history | Store newer than window | Analyze available period |

## Best Practices
- Repeat rates differ a lot by category and price. Compare with your own earlier periods, not with a standard figure.
- Products with high repeat rates are your "gateway" products — prioritize them in acquisition campaigns.
- Use `segment_by: product` to identify which products create loyal customers vs. one-time buyers.
- Pair with the retention cohort analyst from this library (`customer-cohort-analysis` in the original) for a deeper view of long-term retention trends.
