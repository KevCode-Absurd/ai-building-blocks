---
name: shopify-admin-automated-order-tagger
role: order-intelligence
description: "Mutation: applies tags to orders based on configurable rules (geography, value, product type, risk level, customer tier)."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
  - orderUpdate:mutation
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
Applies tags to orders based on configurable rule sets — geography-based (domestic/international), value-based (high-value, low-value), product-type-based, customer-tier-based, or custom conditions. Supports dry-run mode for safe preview.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,write_orders`
- API scopes: `read_orders`, `write_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain |
| rules | object[] | yes | — | Array of tagging rules (see Rules Format below) |
| days_back | integer | no | 7 | Lookback window for orders to tag |
| skip_tagged | boolean | no | true | Skip orders that already have the target tag |
| dry_run | boolean | no | true | Preview only — don't apply tags |
| format | string | no | human | Output format: `human` or `json` |

## Rules Format

Each rule has a `condition` and a `tag`:

```json
[
  { "condition": "total_price > 500", "tag": "high-value" },
  { "condition": "total_price < 20", "tag": "low-value" },
  { "condition": "shipping_country != US", "tag": "international" },
  { "condition": "shipping_country = US", "tag": "domestic" },
  { "condition": "line_items_count > 5", "tag": "bulk-order" },
  { "condition": "customer_orders > 3", "tag": "repeat-buyer" },
  { "condition": "customer_orders = 1", "tag": "first-time" },
  { "condition": "risk_level = HIGH", "tag": "needs-review" },
  { "condition": "financial_status = PARTIALLY_REFUNDED", "tag": "partial-refund" },
  { "condition": "fulfillment_status = null", "tag": "unfulfilled" },
  { "condition": "discount_codes contains WELCOME", "tag": "welcome-discount" },
  { "condition": "product_type contains Subscription", "tag": "subscription-order" }
]
```

Rule names map to these query fields (table added by AI Blocks). "Customer tier" in this skill means the customer's order count; it has no other tier field.

| Rule name | GraphQL field |
|-----------|---------------|
| `total_price` | `totalPriceSet.shopMoney.amount` |
| `shipping_country` | `shippingAddress.countryCode` |
| `line_items_count` | number of `lineItems` edges returned |
| `customer_orders` | `customer.numberOfOrders` |
| `risk_level` | `riskLevel` |
| `financial_status` | `displayFinancialStatus` |
| `fulfillment_status` | `displayFulfillmentStatus` |
| `discount_codes` | `discountCodes` |
| `product_type` | `lineItems.product.productType` |

## Safety

> ⚠️ Mutation skill — always run with `dry_run: true` first to preview tag assignments before applying.

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 250`, select `id`, `name`, `tags`, `totalPriceSet`, `shippingAddress { countryCode }`, `customer { numberOfOrders }`, `displayFinancialStatus`, `displayFulfillmentStatus`, `riskLevel`, `lineItems { product { productType } }`, `discountCodes`, pagination cursor
   **Expected output:** All recent orders with data needed for rule evaluation

2. For each order, evaluate all rules:
   - Parse each condition against order data
   - Collect all matching tags
   - If `skip_tagged: true`, exclude tags already present on the order

3. If `dry_run: true`: report matches without applying
   If `dry_run: false`:

4. **OPERATION:** `orderUpdate` — mutation (for each order needing new tags)
   **Inputs:** `{ id: <order_id>, tags: <existing_tags + new_tags> }`
   **Expected output:** Updated order with new tags
   **Batch:** Process in batches of 10 to respect rate limits

## GraphQL Operations

```graphql
# orders:query — validated against api_version 2025-01
query OrdersForTagging($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        tags
        totalPriceSet { shopMoney { amount currencyCode } }
        shippingAddress { countryCode provinceCode }
        customer { id numberOfOrders }
        displayFinancialStatus
        displayFulfillmentStatus
        riskLevel
        discountCodes
        lineItems(first: 20) {
          edges {
            node {
              product { productType }
              quantity
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
# orderUpdate:mutation — validated against api_version 2025-01
mutation TagOrder($input: OrderInput!) {
  orderUpdate(input: $input) {
    order { id name tags }
    userErrors { field message }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Automated Order Tagger               ║
║  Store: <store domain>                       ║
║  Mode: <DRY RUN | LIVE>                      ║
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
ORDER TAGGING REPORT  (<days_back> days, <mode>)
  Orders scanned:    <n>
  Orders matched:    <n>
  Tags applied:      <n>  (or "would apply" in dry run)
  ─────────────────────────────
  RULE MATCHES:
    "high-value"       → <n> orders
    "international"    → <n> orders
    "first-time"       → <n> orders
    "repeat-buyer"     → <n> orders

  Output: order_tags_<date>.csv
══════════════════════════════════════════════
```

## Output Format
CSV file `order_tags_<YYYY-MM-DD>.csv` with columns:
`order_id`, `order_name`, `existing_tags`, `new_tags`, `matched_rules`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product profit analyst](https://useaiblocks.com/skills/product-profit-analyst). It takes the spreadsheet.
- The [3PL bill auditor](https://useaiblocks.com/skills/3pl-bill-auditor). It takes the spreadsheet.
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Invalid rule | Unparseable condition | Skip rule, warn in output |
| `ACCESS_DENIED` | Missing write_orders scope | Switch to read-only mode, report matches only |

## Best Practices
- Always run `dry_run: true` first to preview changes.
- Tags are additive — this skill never removes existing tags.
- Use with `order-risk-report` to auto-tag risk levels. (In the AI Blocks library this is the Fraud review queue builder.)
- Combine with downstream automation tooling for post-tagging actions (e.g., tag "high-value" → assign to VIP fulfillment queue).
- Useful for filtering orders in Shopify admin — tags make complex order segments searchable.
