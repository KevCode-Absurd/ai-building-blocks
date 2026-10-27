---
name: shopify-admin-abandoned-cart-recovery
role: marketing
description: "Query checkouts abandoned in the last N days, generate unique discount codes per customer, and tag them for re-engagement."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - abandonedCheckouts:query
  - priceRuleCreate:mutation
  - discountCodeBulkCreate:mutation
  - tagsAdd:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

## Purpose
Identifies customers who started checkout but did not complete their purchase, generates a unique discount code for each one, and tags them in Shopify so they can be targeted in follow-up campaigns. This skill handles the Shopify-native data layer (querying, discounts, tagging); sending the actual email requires an external tool.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- Use one `api_version` for all four operations: the one in the header above (2025-01). If your store rejects it, use 2025-04 for all of them. Do not mix versions. The GraphQL blocks below are written from the Shopify docs and have not been run against your store, so check field names against the docs for your version.
- API scopes: `read_checkouts`, `write_price_rules`, `write_discount_codes`, `write_customers`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Preview operations without executing mutations |
| days_back | integer | no | 7 | Lookback window for abandoned checkouts |
| min_cart_value | float | no | 0 | Minimum cart total to include (USD) |
| discount_pct | integer | no | 10 | Discount percentage to create per customer |
| code_prefix | string | no | RECOVER | Prefix for generated discount codes |
| tag | string | no | cart-recovery | Tag applied to eligible customers |

## Safety

> ⚠️ Steps 1b, 2 and 3 execute live changes (a price rule, discount codes, customer tags). To undo a run, delete the price rule it made in Shopify Admin under Discounts. That removes its codes. The tags stay on the customers until you remove them. Run with `dry_run: true` to verify eligible customer count before committing.

## Workflow Steps

1. **OPERATION:** `abandonedCheckouts` — query
   **Inputs:** `first: 250`, `query: "created_at:>='<NOW - days_back days>'"`, pagination cursor
   **Expected output:** List of checkout objects with `customer.id`, `email`, `totalPrice`, `createdAt`, `lineItems`; paginate until `hasNextPage: false`

1a. **FILTER (no API call):** Drop checkouts with no email, and any checkout whose total is below `min_cart_value`. The rest are the eligible customers. If one email has more than one eligible checkout, keep only the most recent, so each shopper gets exactly one code. In `dry_run`, stop after this step and report the count.

1b. **OPERATION:** `priceRuleCreate` — mutation (live; needs `write_price_rules`)
   **Inputs:** One price rule for the whole run: percentage value `discount_pct`, 30-day expiry, once per customer. Do not set a rule-wide usage limit, because it would cap all codes together. Keep the returned price rule `id`; step 2 needs it as `priceRuleId`.
   **Expected output:** The new price rule `id`; collect `userErrors`. If it fails, stop. Do not run step 2.

2. **OPERATION:** `discountCodeBulkCreate` — mutation
   **Inputs:** The `priceRuleId` from step 1b. For each eligible customer email: a unique code `{code_prefix}-{UUID[:8].toUpperCase()}`. The discount and expiry come from the price rule
   **Expected output:** Confirmation of code creation with `code` and `priceRule.id`; collect `userErrors`

3. **OPERATION:** `tagsAdd` — mutation
   **Inputs:** Customer `id` (taken from `customer.id` in the step 1 query; if it is empty, look the customer up by email first), tag string from `tag` parameter
   **Expected output:** Updated customer tags; collect `userErrors`

## GraphQL Operations

```graphql
# abandonedCheckouts:query — use the api_version from the header
query AbandonedCheckouts($first: Int!, $after: String, $query: String) {
  abandonedCheckouts(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        customer {
          id
          defaultEmailAddress {
            emailAddress
          }
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        createdAt
        lineItems {
          edges {
            node {
              title
              quantity
              variant {
                price
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

```graphql
# priceRuleCreate:mutation — use the api_version from the header
# Variables: title, target LINE_ITEM, allocationMethod ACROSS, itemEntitlements { targetAllLineItems: true },
# customerSelection { forAllCustomers: true }, oncePerCustomer true,
# value { percentageValue: -<discount_pct> }, validityPeriod { start: <now>, end: <now + 30 days> }
mutation PriceRuleCreate($priceRule: PriceRuleInput!) {
  priceRuleCreate(priceRule: $priceRule) {
    priceRule {
      id
    }
    priceRuleUserErrors {
      field
      message
    }
  }
}
```

```graphql
# discountCodeBulkCreate:mutation — use the api_version from the header
mutation DiscountCodeBulkCreate($priceRuleId: ID!, $codes: [DiscountCodeInput!]!) {
  discountCodeBulkCreate(priceRuleId: $priceRuleId, codes: $codes) {
    bulkCreations {
      id
      done
    }
    userErrors {
      field
      message
    }
  }
}
```

```graphql
# tagsAdd:mutation — use the api_version from the header
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
║  SKILL: Abandoned Cart Recovery              ║
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
OUTCOME SUMMARY
  Checkouts found:     <n>
  Eligible customers:  <n>
  Codes created:       <n>
  Customers tagged:    <n>
  Errors:              <n>
  Output:              recovery_list_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "abandoned-cart-recovery",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "AbandonedCheckouts", "type": "query", "params_summary": "last 7 days, cart >= $0", "result_summary": "<n> checkouts", "skipped": false },
    { "step": 2, "operation": "DiscountCodeBulkCreate", "type": "mutation", "params_summary": "<n> codes, 10% off, prefix RECOVER", "result_summary": "<n> created", "skipped": false },
    { "step": 3, "operation": "TagsAdd", "type": "mutation", "params_summary": "tag: cart-recovery", "result_summary": "<n> customers tagged", "skipped": false }
  ],
  "outcome": {
    "checkouts_found": 0,
    "eligible_customers": 0,
    "codes_created": 0,
    "customers_tagged": 0,
    "errors": 0,
    "output_file": "recovery_list_<date>.csv"
  }
}
```

## Output Format
CSV file `recovery_list_<YYYY-MM-DD>.csv` with columns:
`customer_email`, `cart_total`, `abandoned_at`, `discount_code`, `discount_pct`, `tag_applied`

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on discount creation | Invalid price rule or duplicate code | Log error, skip customer, continue |
| `userErrors` on tagsAdd | Customer ID not found | Log error, skip tag, continue |
| No email on checkout | Guest checkout without email | Skip checkout, do not count as eligible |

## Best Practices
- Run with `dry_run: true` first and confirm eligible customer count. To undo a run, delete its price rule in Shopify Admin (Discounts).
- Set `min_cart_value` to focus recovery effort on higher-value carts (e.g., 50 for $50+). Small carts often have lower recovery intent and may not justify a discount.
- Use a unique `tag` per run (e.g., `cart-recovery-2026-04-11`) so you can identify exactly which customers were targeted in each campaign and avoid re-targeting them in subsequent runs.
- The `code_prefix` should be meaningful to operators reviewing discount codes in Shopify Admin (e.g., `CART10` for a 10% cart recovery discount).
- This skill produces the data layer. Use Shopify Email or another email tool to send the generated codes to customers.
