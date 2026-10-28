---
name: shopify-admin-discount-cost-trend
role: finance
description: "Read-only: tracks total discount dollars given over configurable time buckets (week/month/quarter), broken down by discount type and code."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
  - order:query
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
Tracks how much money the store gave away in discounts over time, bucketed by week, month, or quarter, and broken down by discount code and by discount type (code / automatic / manual / shipping). Answers: "is our discount spend trending up or down, and which campaigns are driving it?" Read-only — no mutations. Complements the Discount payoff calculator (per-discount return) with a longitudinal view of total cost.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders`
- API scopes: `read_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| period | string | no | month | Bucket size: `week`, `month`, or `quarter` |
| periods_back | integer | no | 12 | Number of buckets to report |
| top_codes | integer | no | 10 | Top discount codes to break out individually; remainder grouped as `other` |
| include_shipping_discounts | bool | no | true | Whether to count shipping discounts in the totals |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. Compute window from `period` × `periods_back` (e.g., `month` × 12 → last 12 calendar months starting from the first day of the bucket 11 months ago)

2. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<window_start>' financial_status:paid"`, `first: 20`, select `createdAt`, `discountCodes`, `totalDiscountsSet`, `currentTotalDiscountsSet`, `lineItems(first: 20) { discountAllocations { allocatedAmountSet, discountApplication { ... } }, pageInfo }`, `shippingLines(first: 5) { discountAllocations { allocatedAmountSet, discountApplication { ... } } }`, pagination cursor
   **Expected output:** All paid orders in the window with discount data; paginate the orders until `hasNextPage: false`

3. **OPERATION:** `order` — query, once for each order whose `lineItems.pageInfo.hasNextPage` is true. Fetch the remaining line items (with the same `discountAllocations` fields) until `hasNextPage` is false. Do not total an order until all its line items are in.

4. For each order, attribute discount cost from the **discount allocations**, which are the money amounts Shopify assigned from each discount to each line:
   - For every `discountAllocations` entry on a line item: add `allocatedAmountSet.shopMoney.amount` to the discount named by its `discountApplication` (its `code` for a code discount, its `title` for an automatic or manual discount) and to that discount's type (code, automatic or manual; a Script discount counts as automatic, labelled `script:<title>`). This is `cart_discount`.
   - For every `discountAllocations` entry on a shipping line: add the amount to its discount and to the `shipping` type (only if `include_shipping_discounts: true`). This is `shipping_discount`.
   - `total_discount` = cart_discount + shipping_discount
   - Never split an order's discount using the `value` field of `discountApplications`. That value is a percentage for some discounts and a money amount for others, so the two cannot be compared or used as weights. When an order has two codes, each code gets exactly what its own allocations add up to.
   - Check: compare `totalDiscountsSet.shopMoney.amount` (the amount at the time of the order, before refunds) with the order's line item allocations, and with its line item plus shipping line allocations (Shopify's docs do not say whether that total includes shipping discounts). If neither matches within one cent, list the order under "Unreconciled" with both numbers and do not guess where the gap belongs.
   - Allocations include discounts on items that were later refunded or removed. If the user wants discount cost net of refunds, also report the sum of `currentTotalDiscountsSet` and say the difference comes from refunds and order edits; do not split that difference by code.

5. Bucket each order into its period (week-of-year, year-month, or year-quarter) and aggregate:
   - Total discount cost per bucket
   - Per discount code per bucket
   - Per discount type per bucket (code, automatic, manual, shipping)

6. Identify top codes by total cost across the window; aggregate the rest as `other`. The listed codes and titles plus `other` must add up to the window's total discount; check this before you report.

## GraphQL Operations

Shopify rejects a single query that costs more than 1,000 points, and nested lists multiply the cost. Keep `first` small as below and page the rest; if Shopify still reports the query is too costly, lower `first`. Written for api_version 2025-01. Shopify retires API versions on a schedule, so check these fields against the current Shopify GraphQL Admin API reference (`LineItem.discountAllocations`, `DiscountAllocation.discountApplication`) before you run it.

```graphql
# orders:query
query DiscountCostTrend($query: String!, $after: String) {
  orders(first: 20, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        discountCodes
        totalDiscountsSet { shopMoney { amount currencyCode } }
        currentTotalDiscountsSet { shopMoney { amount currencyCode } }
        lineItems(first: 20) {
          edges {
            node {
              id
              discountAllocations {
                allocatedAmountSet { shopMoney { amount currencyCode } }
                discountApplication {
                  __typename
                  ... on DiscountCodeApplication { code }
                  ... on AutomaticDiscountApplication { title }
                  ... on ManualDiscountApplication { title }
                  ... on ScriptDiscountApplication { title }
                }
              }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
        shippingLines(first: 5) {
          edges {
            node {
              title
              discountAllocations {
                allocatedAmountSet { shopMoney { amount currencyCode } }
                discountApplication {
                  __typename
                  ... on DiscountCodeApplication { code }
                  ... on AutomaticDiscountApplication { title }
                  ... on ManualDiscountApplication { title }
                  ... on ScriptDiscountApplication { title }
                }
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
# order:query — the rest of one order's line items
query DiscountCostMoreLines($id: ID!, $after: String) {
  order(id: $id) {
    lineItems(first: 100, after: $after) {
      edges {
        node {
          id
          discountAllocations {
            allocatedAmountSet { shopMoney { amount currencyCode } }
            discountApplication {
              __typename
              ... on DiscountCodeApplication { code }
              ... on AutomaticDiscountApplication { title }
              ... on ManualDiscountApplication { title }
              ... on ScriptDiscountApplication { title }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Discount Cost Trend                  ║
║  Store: <store domain>                       ║
║  Period: <period> × <periods_back>           ║
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
DISCOUNT COST TREND  (last <periods_back> <period>s)
  Total discount cost:    $<amount>
  Avg per <period>:        $<amount>
  Latest <period>:         $<amount>   (<delta_vs_prev_pct>% vs prior)

  By bucket:
    2025-Q1  $<n>   (cart $<n> / shipping $<n>)
    2025-Q2  $<n>   (cart $<n> / shipping $<n>)

  By discount type:
    code            $<n>   (<pct>%)
    automatic       $<n>   (<pct>%)
    manual          $<n>   (<pct>%)
    shipping        $<n>   (<pct>%)

  Top codes (by total cost):
    "<code>"        $<n>   (<pct>%)
    "<code>"        $<n>   (<pct>%)
    other           $<n>   (<pct>%)

  Output: discount_cost_trend_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "discount-cost-trend",
  "store": "<domain>",
  "period": "month",
  "periods_back": 12,
  "total_discount_cost": 0,
  "by_bucket": [],
  "by_type": { "code": 0, "automatic": 0, "manual": 0, "shipping": 0 },
  "top_codes": [],
  "currency": "USD",
  "output_file": "discount_cost_trend_<date>.csv"
}
```

## Output Format
CSV file `discount_cost_trend_<YYYY-MM-DD>.csv` with columns:
`bucket`, `discount_code_or_title`, `discount_type`, `orders_count`, `cart_discount`, `shipping_discount`, `total_discount`, `currency`

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
| Stacked discount codes | Multiple codes on one order | Credit each code with its own allocated amounts; the allocations already split the order's discount exactly |
| Allocations do not match the order total | Old orders, edits or apps that changed the order | List the order under `Unreconciled` with both amounts; do not spread the gap across codes |
| Manual discount with no title | Cashier-entered with empty title | Group as `manual:untitled` |
| Multi-currency orders | Presentment currency != shop currency | Sum on `shopMoney.amount` (shop currency) for consistency |

## Best Practices
- Use `period: week` for promotional businesses with frequent campaigns; `period: month` for stores with steady evergreen offers; `period: quarter` for board reporting.
- A flat or rising trend with no campaign activity often points to **automatic discount creep** — review automatic discounts that have no end date.
- Cross-reference the latest bucket against the Discount payoff calculator to verify the cost increase is producing matching incremental revenue.
- Set `include_shipping_discounts: false` if your accounting books shipping subsidy separately from product discounts.
- Set up monthly automation: discount spend that drifts above budget should trigger a finance review before it shows up in margin reports.
