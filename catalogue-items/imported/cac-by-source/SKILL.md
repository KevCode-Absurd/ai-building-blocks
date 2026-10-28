---
name: shopify-admin-customer-acquisition-cost-by-source
role: customer-ops
description: "Read-only: estimates customer acquisition cost (CAC) per traffic source by joining order count per landing site / referrer with configurable ad spend."
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
Estimates customer acquisition cost (CAC) for each traffic source by combining the number of new-customer orders attributed to a landing page / referrer with a configurable ad spend input per source. Output answers: "for every dollar spent on source X, how many new customers did we acquire and at what unit cost?" Read-only — no mutations. Provides the data foundation for paid-media budget reallocation.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,read_customers`
- API scopes: `read_orders`, `read_customers`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Lookback window for orders to attribute |
| ad_spend | object | no | {} | Map of source name → spend in store currency, e.g. `{"google": 4500, "meta": 3200, "tiktok": 1800}` |
| new_customers_only | bool | no | true | Count only first-order customers as "acquired" |
| min_orders_per_source | integer | no | 5 | Minimum orders for a source to be reported |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time. Ad spend values are caller-provided; this skill does not pull from any ad platform.

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 250`, select `customer { id, numberOfOrders }`, `customerJourneySummary { firstVisit { landingPage referrerUrl source } }`, `landingPageUrl`, `referrerUrl`, `totalPriceSet`, pagination cursor
   **Expected output:** All orders in the window with referral and customer attribution; paginate until `hasNextPage: false`

2. Group orders by normalized source. Resolution order:
   - `customerJourneySummary.firstVisit.source` if present
   - Else parse domain from `referrerUrl`
   - Else parse `landingPageUrl` UTM params (utm_source)
   - Else bucket as `direct`

3. If `new_customers_only: true`, count each customer once, by `customer.id`:
   - A customer is **new** when their first-ever order falls inside the window. `numberOfOrders` is a lifetime count, so compare it with the number of that customer's orders you found in the window: if they are equal, every order they have ever placed is in the window, so they are new. If the lifetime count is higher, they ordered before the window and are returning.
   - Count a new customer **once**, however many orders they placed in the window, and attribute them to the source of their **earliest** order in the window. Never drop a new customer because they placed a second order. (Check: two new buyers from one source, each with two orders in the window, and $200 spend gives 2 new customers and a CAC of $100, not $200.)
   - Do not use `customer.createdAt` to decide: a customer record can be created before the first order (for example by a newsletter sign-up or an import).
   - Orders with no `customer` (some guest or deleted-customer orders) cannot be de-duplicated. Count them in `orders_count`, leave them out of `new_customers_count`, and report how many there were.

4. Aggregate per source: `orders_count`, `new_customers_count`, `revenue_attributed`, and `orders_without_customer`

5. Join with `ad_spend` map: `cac = ad_spend[source] / new_customers_count`. Sources without spend data report `cac: null` (organic / unattributed)

6. Filter to sources with `orders_count >= min_orders_per_source`

## GraphQL Operations

```graphql
# orders:query — validated against api_version 2025-01
query OrdersWithAttribution($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        landingPageUrl
        referrerUrl
        customerJourneySummary {
          firstVisit {
            landingPage
            referrerUrl
            source
            sourceType
            utmParameters {
              source
              medium
              campaign
            }
          }
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          createdAt
          numberOfOrders
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
║  SKILL: Customer Acquisition Cost by Source  ║
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
CAC BY SOURCE  (<days_back> days)
  Orders analyzed:        <n>
  New customers acquired: <n>
  Total ad spend (input): $<amount>
  Blended CAC:            $<amount>

  By Source (sorted by CAC ascending):
    google      Customers: <n>  Spend: $<n>   CAC: $<n>
    meta        Customers: <n>  Spend: $<n>   CAC: $<n>
    direct      Customers: <n>  Spend: —      CAC: organic
    referral    Customers: <n>  Spend: —      CAC: organic

  Output: cac_by_source_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "customer-acquisition-cost-by-source",
  "store": "<domain>",
  "period_days": 30,
  "orders_analyzed": 0,
  "new_customers": 0,
  "blended_cac": 0,
  "currency": "USD",
  "by_source": [],
  "output_file": "cac_by_source_<date>.csv"
}
```

## Output Format
CSV file `cac_by_source_<YYYY-MM-DD>.csv` with columns:
`source`, `orders_count`, `new_customers_count`, `orders_without_customer`, `revenue_attributed`, `ad_spend`, `cac`, `currency`

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
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Empty `ad_spend` | No spend provided | Report orders / customers per source with `cac: null` |
| Missing `customerJourneySummary` | Older orders or guest checkout | Fall back to `referrerUrl` → `landingPageUrl` → `direct` |
| All orders from `direct` | No referrer captured | Likely tracking misconfiguration — surface as warning |
| Lifetime `numberOfOrders` lower than orders found in window | Cancelled, deleted or test orders counted differently | Treat that customer as new, and list the mismatch as a warning |

## Best Practices
- Provide ad spend for the **same window** as `days_back` — mismatched windows produce misleading CAC numbers.
- Pair with `customer-cohort-analysis` to validate that low-CAC sources also produce high-LTV customers.
- Sources reported as `direct` often hide attribution leakage — investigate UTM tagging and referrer policies before drawing conclusions.
- Treat output as **estimated CAC** — Shopify's first-touch attribution does not capture cross-device journeys, so sources that rely on view-through (display, video) will be undercounted.
- Re-run weekly to catch CAC drift before campaigns become unprofitable.
