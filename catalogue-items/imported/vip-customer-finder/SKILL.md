---
name: shopify-admin-vip-customer-identifier
role: marketing
description: "Identifies top-spending customers (top N% by lifetime value or order frequency) and exports a VIP candidate list; optionally tags qualified customers as VIPs."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - customers:query
  - orders:query
  - customerUpdate:mutation
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
Ranks customers by lifetime spend and order frequency, identifies the top N% (by value, frequency, or both), and outputs a CSV of VIP candidates. Optionally applies a VIP tag to qualified customers via `customerUpdate`. Used to build loyalty segments, prioritize white-glove support, or seed exclusive-access campaigns. The lifetime spend and order count are pulled directly from Shopify customer aggregates — no external CRM required.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers,read_orders,write_customers`
- API scopes: `read_customers`, `read_orders`, `write_customers` (only if `tag_customers: true`)

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | true | Preview VIP list without applying tags |
| rank_by | string | no | spend | Ranking strategy: `spend` (lifetime value), `frequency` (order count), or `both` (composite score) |
| top_pct | float | no | 5 | Top percentile to qualify as VIP (e.g., 5 = top 5%) |
| min_orders | integer | no | 2 | Minimum lifetime orders to be eligible |
| min_spend | float | no | 0 | Minimum lifetime spend (shop currency) to be eligible |
| tag_customers | bool | no | false | If true, apply VIP tag to qualified customers via `customerUpdate` |
| tag | string | no | vip | Tag string applied when `tag_customers: true` |

## Safety

> ⚠️ When `tag_customers: true`, Step 3 executes `customerUpdate` mutations that mutate customer tag lists. Tags persist until manually removed. Run with `dry_run: true` first to confirm the VIP list and qualifying thresholds. The default is `dry_run: true` — you must explicitly set `dry_run: false` and `tag_customers: true` to apply tags.

## Workflow Steps

1. **OPERATION:** `customers` — query
   **Inputs:** `first: 250`, `query: "orders_count:>=<min_orders>"`, select `id`, `displayName`, `defaultEmailAddress { emailAddress }`, `numberOfOrders`, `amountSpent { amount currencyCode }`, `tags`, pagination cursor
   **Expected output:** All customers meeting `min_orders` threshold; paginate until `hasNextPage: false`

2. **OPERATION:** `orders` — query (only when ranking by frequency, for recency annotation)
   **Inputs:** For each top candidate: `query: "customer_id:<id>"`, `first: 1`, `sortKey: CREATED_AT`, `reverse: true`
   **Expected output:** Most recent order per candidate to annotate the export

3. Filter to `amountSpent.amount >= min_spend`. Score each customer: `spend` → spend; `frequency` → orders; `both` → 0.6 × normalized spend + 0.4 × normalized frequency. Take the top `top_pct%`.

4. **OPERATION:** `customerUpdate` — mutation (only if `tag_customers: true` and `dry_run: false`)
   **Inputs:** `input: { id: <customer_id>, tags: [...existing_tags, <tag>] }`
   **Expected output:** `customer.id`, `customer.tags`, `userErrors`

## GraphQL Operations

```graphql
# customers:query — validated against api_version 2025-01
query VIPCandidateCustomers($first: Int!, $after: String, $query: String) {
  customers(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        displayName
        firstName
        lastName
        defaultEmailAddress {
          emailAddress
        }
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        tags
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

```graphql
# orders:query — validated against api_version 2025-01
query VIPLastOrder($query: String!) {
  orders(first: 1, query: $query, sortKey: CREATED_AT, reverse: true) {
    edges {
      node {
        id
        name
        createdAt
        totalPriceSet {
          shopMoney { amount currencyCode }
        }
      }
    }
  }
}
```

```graphql
# customerUpdate:mutation — validated against api_version 2025-01
mutation CustomerUpdateVipTag($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      displayName
      tags
    }
    userErrors {
      field
      message
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: VIP Customer Identifier              ║
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

If `dry_run: true`, prefix every mutation step with `[DRY RUN]` and do not execute it.

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
VIP CUSTOMER REPORT
  Customers scanned:    <n>
  Eligible (≥ min):     <n>
  VIPs (top <pct>%):    <n>
  Threshold spend:      $<amount>
  Threshold orders:     <n>
  Customers tagged:     <n>  (or "skipped — dry_run")

  Top 10 VIPs by <rank_by>:
    <name>  Spend: $<amount>  Orders: <n>  Last: <date>
  Output: vip_customers_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "vip-customer-identifier",
  "store": "<domain>",
  "dry_run": true,
  "rank_by": "spend",
  "outcome": {
    "customers_scanned": 0,
    "eligible": 0,
    "vips_identified": 0,
    "threshold_spend": 0,
    "customers_tagged": 0,
    "errors": 0,
    "output_file": "vip_customers_<date>.csv"
  }
}
```

## Output Format
CSV file `vip_customers_<YYYY-MM-DD>.csv` with columns:
`customer_id`, `name`, `email`, `lifetime_spend`, `currency`, `orders_count`, `last_order_date`, `composite_score`, `rank`, `tag_applied`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer tag bulk updater](https://useaiblocks.com/skills/customer-tag-bulk-updater). It takes the spreadsheet.
- The [Product title cleaner](https://useaiblocks.com/skills/product-title-cleaner). It takes the spreadsheet.
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on customerUpdate | Customer not found or tag conflict | Log, skip, continue |
| Fewer eligible than `top_pct%` | Small customer base | Lower `min_orders`/`min_spend` |
| Multi-currency stores | `currencyCode` varies | Convert via shop default before ranking |

## Best Practices
- Use `rank_by: both` to balance whales with loyalists — pure spend ranking can over-index on one-time large purchases.
- Re-run quarterly with a date-stamped tag (e.g., `vip-2026-Q2`) so lapsed VIPs roll off rather than accumulating permanently.
- Pair with `customer-win-back` — VIPs who become inactive should be flagged for high-priority re-engagement.
- Run with `dry_run: true` first; review the threshold spend value to confirm the cutoff matches your VIP definition.
