---
name: shopify-admin-discount-roi-calculator
role: conversion-optimization
description: "Read-only: compares the revenue from orders that used each discount code and automatic discount against what the discount cost. It does not include product cost or work out which sales would have happened anyway."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - discountNodes:query
  - orders:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

## Purpose
Compares, for each discount code and automatic discount, the revenue from orders that used it against what the discount cost. It also measures number of orders, average order value with vs. without discount, the share of new customers, and a simple flag for possible cannibalization (customers who would have bought anyway). The revenue counted is the total of all orders that used the code, not only the extra sales the discount caused, so it overstates the gain. Product cost is not included. Goes beyond the Old discount code cleaner (which finds broken/unused codes) to answer "did this discount earn more than it cost?" Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session with the three scopes below. The author gave `shopify store auth --store <domain> --scopes read_orders,read_discounts,read_customers`, but that command has not been checked against the current Shopify CLI. Confirm the sign-in command in the current Shopify CLI docs before you run it. Shopify may return only the last 60 days of orders unless the app also has `read_all_orders`, so tell the user if the window is longer than that.
- API scopes: `read_orders`, `read_discounts`, `read_customers` (needed to read `customer.numberOfOrders` for the new-customer share)

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain |
| days_back | integer | no | 90 | Lookback window |
| min_uses | integer | no | 3 | Minimum uses for a discount to be analyzed |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `discountNodes` — query
   **Inputs:** `first: 250`, select discount details (title, code, type, value, asyncUsageCount, startsAt, endsAt), pagination cursor
   **Expected output:** All discount codes and automatic discounts

2. Filter to discounts with `asyncUsageCount >= min_uses` and active within lookback window

3. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>' discount_code:<code>"`, `first: 250` for each active discount code. This finds code discounts only. For automatic discounts, query all orders in the window and match each order's `discountApplications` title to the automatic discount's title (exact text match) instead. Select `totalPriceSet`, `totalDiscountsSet`, `subtotalPriceSet`, `customer { id, numberOfOrders }`, pagination cursor
   **Expected output:** All orders using each discount

4. Also query orders WITHOUT any discount in same period for baseline AOV comparison

5. For each discount, calculate:
   - **Total Discount Cost** = Σ(totalDiscountsSet for orders with this code)
   - **Revenue Generated** = Σ(totalPriceSet for orders with this code)
   - **Discounted AOV** = revenue / orders
   - **Baseline AOV** = AOV of non-discounted orders in same period
   - **AOV Lift/Drop** = discounted AOV - baseline AOV
   - **New Customer %** = orders where customer.numberOfOrders == 1 / total
   - **Revenue against discount cost** (called ROI below) = (revenue - discount_cost) / discount_cost × 100. This is not profit, because product cost is not included
   - **Cannibalization check** = flag if discount AOV < baseline AOV and new customer % < 20%. The 20% cut-off is a rule of thumb, not a measured result. The flag is a prompt to look closer, not proof that buyers would have bought anyway

## GraphQL Operations

```graphql
# discountNodes:query — validated against api_version 2025-01
query AllDiscounts($after: String) {
  discountNodes(first: 250, after: $after) {
    edges {
      node {
        id
        discount {
          ... on DiscountCodeBasic {
            title
            codes(first: 1) { edges { node { code } } }
            usageLimit
            asyncUsageCount
            startsAt
            endsAt
            customerGets {
              value {
                ... on DiscountPercentage { percentage }
                ... on DiscountAmount { amount { amount currencyCode } }
              }
            }
          }
          ... on DiscountCodeFreeShipping {
            title
            codes(first: 1) { edges { node { code } } }
            asyncUsageCount
            startsAt
            endsAt
          }
          ... on DiscountAutomaticBasic {
            title
            asyncUsageCount
            startsAt
            endsAt
            customerGets {
              value {
                ... on DiscountPercentage { percentage }
                ... on DiscountAmount { amount { amount currencyCode } }
              }
            }
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

```graphql
# orders:query — validated against api_version 2025-01
query OrdersByDiscount($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        totalPriceSet { shopMoney { amount currencyCode } }
        totalDiscountsSet { shopMoney { amount currencyCode } }
        subtotalPriceSet { shopMoney { amount currencyCode } }
        customer {
          id
          numberOfOrders
        }
        discountCodes
        discountApplications(first: 10) {
          edges { node { __typename ... on AutomaticDiscountApplication { title } } }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Discount ROI Calculator              ║
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
DISCOUNT ROI REPORT  (<days_back> days)
  Discounts analyzed:   <n>
  Total discount spend:  $<amount>
  Total attributed rev:  $<amount>
  ─────────────────────────────
  TOP PERFORMERS (by ROI):
    "<code>"  ROI: <n>%  Revenue: $<n>  Cost: $<n>  New customers: <pct>%

  UNDERPERFORMERS:
    "<code>"  ROI: <n>%  Revenue: $<n>  Cost: $<n>  ⚠️ Check: buyers may have bought anyway

  BASELINE COMPARISON:
    Non-discount AOV: $<n>  |  Avg discount AOV: $<n>  |  Δ: $<n>

  Output: discount_roi_<date>.csv
══════════════════════════════════════════════
```

## Output Format
CSV file `discount_roi_<YYYY-MM-DD>.csv` with columns:
`discount_id`, `code_or_title`, `type`, `uses`, `revenue`, `discount_cost`, `roi_pct`, `aov`, `baseline_aov`, `aov_delta`, `new_customer_pct`, `cannibalization_check`

Note: `roi_pct` means revenue against discount cost. It is not profit and not a true return on investment, because product cost is not included.

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Automatic discounts | No code to query by | Match via order discount data |
| Stacked discounts | Multiple codes per order | Do not split the order. Count it under each code it used and mark those rows "multi-discount", so the reader knows the revenue overlaps |

## Best Practices
- The figure is (revenue − discount cost) ÷ discount cost × 100. Below 0% means the revenue was less than the discount cost. Between 0% and 100% means revenue was less than twice the discount cost. Neither is a loss on its own, because product cost is not included. Check your product costs before you retire a code.
- High new-customer % with positive ROI = great acquisition tool — keep running.
- Low new-customer % with a drop in order size may mean customers would have bought anyway. This is a rule of thumb (the 20% cut-off is not measured), so use it as a prompt to check the code, not as proof.
- To compare two codes side by side, use Discount code comparer.
- To find broken or unused codes, use the Old discount code cleaner.
