---
name: shopify-admin-order-lookup-and-summary
role: customer-support
description: "Retrieve and summarize full order details for a customer by email, order number, or phone number."
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
Retrieves complete order details for a customer without requiring navigation through the Shopify admin UI. Useful for support agents answering customer queries about order status, shipping tracking, and refunds. This skill operates directly on the Shopify-native data layer, returning full order context in a single operation.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- API scopes: `read_orders`, `read_customers`. Orders older than 60 days also need `read_all_orders`.
- Customer names, emails, phones and addresses will pass through the AI tool you run this in. Use a tool your business already trusts with customer data, and do not paste results into public places.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Has no effect here: this skill runs one read-only query and no mutations |
| lookup_by | string | yes | — | `order_number`, `email`, or `phone` |
| lookup_value | string | yes | — | The value to search for (e.g., `#1001`, `jane@example.com`, `+15551234567`) |
| limit | integer | no | 5 | Maximum number of orders to return |

## Workflow Steps

1. Confirm the Shopify CLI is signed in to the store (`shopify auth login --store <domain>`). If it is not, stop and ask the user to sign in.
2. Build the search text from `lookup_by`: `name:<order_number>`, `email:<email>` or `phone:<phone>`.
3. **OPERATION:** `orders` — query
   **Inputs:** `first: <limit>`, `query:` the search text from step 2
   **Expected output:** Full order objects with financial status, fulfillment status, line items, shipping address, tracking, refunds
4. Format the result as the Output Format section describes. If no order matches, say so and show the Error Handling tips. Never guess an order.

## GraphQL Operations

```graphql
# orders:query — validated against api_version 2025-01
query OrderLookup($first: Int!, $query: String) {
  orders(first: $first, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        processedAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney { amount currencyCode }
        }
        subtotalPriceSet {
          shopMoney { amount currencyCode }
        }
        totalShippingPriceSet {
          shopMoney { amount currencyCode }
        }
        totalRefundedSet {
          shopMoney { amount currencyCode }
        }
        customer {
          id
          defaultEmailAddress {
            emailAddress
          }
          firstName
          lastName
          phone
        }
        shippingAddress {
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              variant {
                sku
                price
              }
              fulfillmentStatus
            }
          }
        }
        fulfillments {
          trackingInfo {
            number
            url
            company
          }
          status
          createdAt
        }
        refunds {
          createdAt
          totalRefundedSet {
            shopMoney { amount currencyCode }
          }
        }
        note
        tags
      }
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: order-lookup-and-summary             ║
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
OUTCOME SUMMARY
  Orders found:   <n>
  Errors:         0
  Output:         none
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "order-lookup-and-summary",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "OrderLookup", "type": "query", "params_summary": "lookup_by: <type>, lookup_value: <value>, limit: <n>", "result_summary": "<n> orders", "skipped": false }
  ],
  "outcome": {
    "orders_found": 0,
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format
Human-readable formatted summary for each order found (not a CSV). For each order, Claude presents: order number, date, financial and fulfillment status, customer details, line items, shipping address, tracking numbers, and any refunds. For `format: json`, the raw order objects array.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Refund and reorder processor](https://useaiblocks.com/skills/refund-and-reorder-processor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| No orders returned | No match for lookup value | Verify lookup value format (order number must include `#`, e.g., `#1001`) |
| `lookup_by` invalid | Value is not `order_number`, `email`, or `phone` | Use one of the three accepted values |
| Rate limit (429) | Too many requests | Reduce `limit` or wait and retry |

## Best Practices
1. Order number lookups require the `#` prefix (e.g., `#1001`), which maps to the `name` field in the GraphQL query.
2. Phone lookups must use E.164 format (e.g., `+15551234567`); partial numbers will not match.
3. Email lookup returns all orders for that customer — set `limit` to retrieve more than the default 5 if the customer has many orders.
4. For `format: json`, pipe the output to `jq` to extract specific fields for downstream scripts.
5. This skill is read-only — use the `refund-and-reorder` skill if you need to process a refund after looking up the order.
