---
name: shopify-admin-customer-cohort-analysis
role: customer-ops
description: "Read-only: groups customers by first-purchase month and tracks repeat purchase rate and revenue per cohort."
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
Groups customers by the month of their first purchase and tracks how each cohort performs over time: how many customers repurchase, how many orders they place, and how much revenue each cohort generates in subsequent months. Cohort analysis is the gold standard for measuring retention and the health of a subscription or loyalty program. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers,read_orders,read_all_orders`
- API scopes: `read_customers`, `read_orders`, `read_all_orders`. Without `read_all_orders`, Shopify returns only about the last 60 days of orders, so older cohort months come back incomplete. If the scope is missing, say so and limit the report to the last 60 days.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| cohort_months | integer | no | 6 | Number of months of cohorts to analyze |
| follow_months | integer | no | 3 | Number of months to follow each cohort after acquisition |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `customers` — query
   **Inputs:** `query: "created_at:>='<NOW - cohort_months months>'"`, `first: 250`, select `id`, `createdAt`, `numberOfOrders`, pagination cursor
   **Expected output:** Customers acquired in the cohort window

2. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<START>'"` where START is the first day of the month that is cohort_months months before today (the same start date as the customers query, so every order after a cohort's first order is included), `first: 250`, select `customer { id }`, `createdAt`, `totalPriceSet`, pagination cursor
   **Expected output:** All orders to build per-customer purchase timeline

3. Assign each customer to the cohort of the calendar month of their first order (customers with no customer record, such as guest checkouts, are skipped). A repeat buyer is a customer with at least one more order after the first. For each cohort, count repeat buyers and add up order revenue at month offsets 1, 2 and 3+ after the first-order month. Month offset = (order year - first-order year) x 12 + (order month - first-order month), so an order in the same calendar month as the first order is offset 0. Assign each order's totalPriceSet amount to its offset; offset 0 holds the first order plus any same-month repeats. Use one calendar-month boundary for every cohort. Do not count months that have not finished yet.

## GraphQL Operations

```graphql
# customers:query — validated against api_version 2025-01
query CohortCustomers($query: String!, $after: String) {
  customers(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        createdAt
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        defaultEmailAddress {
          emailAddress
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
query CohortOrders($query: String!, $after: String) {
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
║  SKILL: Customer Cohort Analysis             ║
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
CUSTOMER COHORT ANALYSIS
  Cohort months analyzed:  <n>
  Total customers tracked: <n>

  Cohort      Acquired  M+1 Repeat  M+2 Repeat  M+3 Repeat
  ──────────────────────────────────────────────────────────
  2026-01     <n>       <pct>%       <pct>%       <pct>%
  2026-02     <n>       <pct>%       <pct>%       <pct>%
  Output: cohort_analysis_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "customer-cohort-analysis",
  "store": "<domain>",
  "cohorts": [],
  "output_file": "cohort_analysis_<date>.csv"
}
```

## Output Format
CSV file `cohort_analysis_<YYYY-MM-DD>.csv` with columns:
`cohort_month`, `customers_acquired`, `repeat_purchasers`, `repeat_rate_pct`, `total_revenue`, `revenue_per_customer`, `month_offset`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer spend tier tagger](https://useaiblocks.com/skills/customer-spend-tier-tagger).
- The [Sign-up group retention analyst](https://useaiblocks.com/skills/retention-cohort-analyst).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Insufficient history | Store newer than cohort window | Analyze available months only |
| Guest checkout orders | No customer record | Exclude from cohort tracking |

## Best Practices
- Compare cohorts with each other first. Any outside repeat-rate figure (some people quote 20–40% within 90 days) is an unsourced rule of thumb, so do not judge your store against it.
- Declining repeat rates in recent cohorts may signal product quality issues, CX friction, or increased competition.
- Use `follow_months: 6` for subscription-oriented businesses where the repeat window is longer.
- Pair with `customer-spend-tier-tagger` — customers from high-repeat cohorts are your best candidates for the Gold/Platinum tier.
