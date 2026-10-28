---
name: shopify-admin-exchange-vs-refund-ratio
role: returns
description: "Read-only: tracks what percentage of returns become exchanges vs. refunds vs. store credit — measures revenue recovery rate."
toolkit: shopify-admin
api_version: "2025-01"
graphql_operations:
  - returns:query
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
Analyzes return resolutions to calculate the split between exchanges (revenue retained), store credit (revenue deferred), and refunds (revenue lost). Tracks this as a revenue recovery metric over time. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,read_returns`
- API scopes: `read_orders`, `read_returns`. Reading returns needs the `read_returns` permission, and what your Shopify plan allows can differ, so check Shopify's docs if the query is refused.

- Run it first on a development store, or with a small `days_back` such as 7, before you use a full live period. The query has not been tested on a live store.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Lookback window for return resolutions |
| compare_days_back | integer | no | 0 | Optional prior period for comparison (0 = no comparison) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `returns` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 250`, pagination cursor
   **Expected output:** Returns with `refunds { totalRefundedSet }`, `exchangeLineItems`, and resolution status

2. Categorize each return resolution:
   - **Exchange**: return has `exchangeLineItems` with quantity > 0
   - **Store credit**: a refund transaction whose `gateway` is a gift card or store credit, read from the `transactions` field in the query below. Common gateway names are `gift_card` and a store credit name, but these are unverified. To get the exact name, open one return you know was paid as store credit in your Shopify admin, look at the payment gateway on its refund transaction, and match that exact text. Ask the user to confirm the name before you count. If the gateway does not say clearly, count the return as a refund and tell the user how many were unclear.
   - **Refund**: return has cash/card refund with no exchange

3. **OPERATION:** `returns` — query again (only if `compare_days_back > 0`)
   **Inputs:** The same query for the prior window: `created_at:>='<NOW - (days_back + compare_days_back) days>' AND created_at:<'<NOW - days_back days>'`. Categorize each return the same way (step 2), then show the prior split and the change next to the current one in the completion block.

## GraphQL Operations

```graphql
# returns:query — written for api_version 2025-01. It has NOT been run against a live store. Before you rely on it, check every field name and argument in Shopify's GraphiQL explorer for your API version, and fix any that fail. Each connection field below (refunds, transactions, exchangeLineItems, returnLineItems) is read through edges and node.
query ReturnResolutions($query: String!, $after: String) {
  returns(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        status
        createdAt
        totalQuantity
        order {
          id
          name
        }
        exchangeLineItems(first: 10) {
          edges {
            node {
              id
              quantity
              lineItem {
                variant {
                  id
                  title
                }
              }
            }
          }
        }
        refunds(first: 5) {
          edges {
            node {
              id
              transactions(first: 5) {
                edges {
                  node {
                    kind
                    gateway
                  }
                }
              }
              totalRefundedSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        returnLineItems(first: 20) {
          edges {
            node {
              refundableQuantity
              returnReason
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
║  SKILL: Exchange vs Refund Ratio             ║
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
EXCHANGE vs REFUND RATIO  (<days_back> days)
  Total returns resolved:  <n>

  Resolution breakdown:
    Exchange (revenue kept):    <n>  (<pct>%)
    Store credit (deferred):    <n>  (<pct>%)
    Refund (revenue lost):      <n>  (<pct>%)
    Unclear gateway (counted as refund): <n>

  Revenue recovery rate: <pct>%
  (exchanges + store credit as % of all returns; counts returns, not money)

  Output: exchange_refund_ratio_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "exchange-vs-refund-ratio",
  "store": "<domain>",
  "period_days": 30,
  "total_returns": 0,
  "exchanges": { "count": 0, "pct": 0 },
  "store_credit": { "count": 0, "pct": 0 },
  "refunds": { "count": 0, "pct": 0 },
  "unclear_gateway_counted_as_refund": 0,
  "revenue_recovery_rate_pct": 0,
  "output_file": "exchange_refund_ratio_<date>.csv"
}
```

## Output Format
CSV file `exchange_refund_ratio_<YYYY-MM-DD>.csv` with columns:
`return_id`, `order_name`, `resolution_type`, `exchange_sku`, `refund_amount`, `currency`, `created_at`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shopify return reason finder](https://useaiblocks.com/skills/return-reason-finder).
- The [Return cost calculator](https://useaiblocks.com/skills/return-cost-calculator).
- The [Refund rate analyzer](https://useaiblocks.com/skills/refund-rate-analyzer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No resolved returns in window | No completed returns in period | Exit with summary: 0 returns |
| Exchange line items empty but status indicates exchange | In-progress exchange | Count as pending. Show the pending count, and leave it out of the split and the recovery rate |

## Best Practices
- There is no trusted benchmark for the recovery rate. Use your own earlier period as the baseline (`compare_days_back`), and do not tell the user a rate is "good" or "bad" against a made-up target.
- Use `compare_days_back` to track whether returns policy changes (e.g., "exchange only" periods) improved the recovery rate.
- Pair with `return-reason-finder` — high "wrong size" return reasons paired with low exchange rates may indicate size guidance issues in product listings.
- Run before and after launching an exchange incentive (e.g., bonus store credit for exchanging instead of refunding) to measure impact.
