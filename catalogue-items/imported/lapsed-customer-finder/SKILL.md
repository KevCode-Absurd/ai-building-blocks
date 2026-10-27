---
name: shopify-admin-customer-win-back
role: marketing
description: "Identify customers who have not ordered in N days, export a re-engagement list, and tag them in Shopify."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - customers:query
  - tagsAdd:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

## Purpose
Segments lapsed customers — those who placed at least one order but have not purchased again within a configurable window — and tags them for re-engagement. This skill handles the Shopify-native data layer; sending re-engagement emails requires an external tool.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- API scopes: `read_customers`, `write_customers`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain |
| format | string | no | human | `human` or `json` |
| dry_run | bool | no | false | Preview without tagging |
| inactive_days | integer | no | 90 | Days since last order to qualify as lapsed |
| min_orders | integer | no | 1 | Minimum lifetime order count to include |
| tag | string | no | win-back | Tag applied to lapsed customers |
| max_customers | integer | no | 500 | Maximum customers to process per run |

## Workflow Steps

1. **OPERATION:** `customers` — query
   **Inputs:** a search `query` for orders count of at least `min_orders` and without the tag (add a `-tag:<tag>` clause using the `tag` parameter), `first: 250`, pagination. Work out the cutoff date as today minus `inactive_days`, then keep only customers whose `lastOrder.processedAt` is before it. Use Shopify's customer search syntax for your `api_version` for any date filter. If you are not sure a filter name is valid, leave it out and apply the date check yourself on the results.
   **Skip these customers before you tag them:** anyone who already carries the `tag`, and anyone whose `defaultEmailAddress.marketingState` is not `SUBSCRIBED`. Do not tag or list a customer whose consent you could not read. If you cannot read that field at all, say so, and tell the person to remove non-subscribed people before they email the list.
   **Expected output:** List of customer objects with `id`, `defaultEmailAddress { emailAddress marketingState }`, `firstName`, `lastName`, `ordersCount`, `lastOrder.processedAt`; paginate until `hasNextPage: false`

2. **OPERATION:** `tagsAdd` — mutation
   **Inputs:** Customer `id`, tag string from `tag` parameter
   **Expected output:** Confirmation per customer; collect `userErrors`

## GraphQL Operations

```graphql
# customers:query — written for api_version 2025-01; check it against Shopify's docs for your version
query LapsedCustomers($first: Int!, $after: String, $query: String) {
  customers(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        defaultEmailAddress {
          emailAddress
          marketingState
        }
        firstName
        lastName
        ordersCount
        lastOrder {
          processedAt
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

```graphql
# tagsAdd:mutation — validated against api_version 2025-01
mutation TagsAdd($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    node {
      id
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
║  SKILL: Customer Win-Back                    ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary>
          → Result: <count or outcome>
```

If `dry_run: true`, prefix mutation steps with `[DRY RUN]` and do not execute.

**On completion**, for `format: human`:
```
══════════════════════════════════════════════
OUTCOME SUMMARY
  Lapsed customers found:  <n>
  Customers tagged:        <n>
  Errors:                  <n>
  Output:                  winback_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit the standard JSON schema with `outcome` keys: `lapsed_found`, `customers_tagged`, `errors`, `output_file`.

## Output Format
CSV `winback_<YYYY-MM-DD>.csv` with columns:
`customer_id`, `email`, `first_name`, `last_name`, `orders_count`, `last_order_date`, `tag_applied`

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | Rate limit | Wait 2s, retry up to 3 times |
| `userErrors` on tagsAdd | Customer not found or invalid ID | Log, skip, continue |

## Best Practices
- Use a dated tag (e.g., `win-back-2026-04`) so you can track which cohort was targeted each month and avoid re-tagging customers who already received a win-back campaign.
- Set `min_orders: 2` to focus on customers who had a genuine purchase relationship, not one-time buyers who may never have intended to return.
- Run with `dry_run: true` first to validate the lapsed customer count before tagging — the count informs the scale of your re-engagement campaign.
