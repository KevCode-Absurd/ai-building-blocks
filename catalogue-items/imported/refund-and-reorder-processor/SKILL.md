---
name: shopify-admin-refund-and-reorder
role: customer-support
description: "Process a full or partial refund on an order and optionally create a replacement draft order for the customer."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - order:query
  - refundCreate:mutation
  - draftOrderCreate:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

## Purpose
Processes refunds and creates replacement orders without navigating the Shopify admin UI. This skill handles both the refund and the optional replacement draft order in a single workflow.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- API scopes: `read_orders`, `write_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | true | Preview operations without executing mutations. Set to false only after the user has confirmed the preview |
| order_id | string | yes | — | GID of the order (e.g., `gid://shopify/Order/12345`) |
| refund_line_items | array | no | all refundable | Array of `{line_item_id, quantity}` to refund; if omitted, refunds all refundable quantities |
| reason | string | no | other | Refund reason: `customer`, `fraud`, `inventory`, `declined`, `other` |
| restock_type | string | no | NO_RESTOCK | `RETURN` (items coming back), `CANCEL` (unfulfilled items) or `NO_RESTOCK`. Stays `NO_RESTOCK` unless the user says otherwise |
| create_replacement | bool | no | false | If true, create a draft order with the same line items after refund |
| notify_customer | bool | no | true | Send refund notification email to customer |

## Safety

> ⚠️ Steps 2 and 3 execute irreversible financial mutations. `refundCreate` cannot be undone — once a refund is processed, the payment cannot be re-captured. `draftOrderCreate` creates a new draft order that must be invoiced and paid separately. The run starts as `dry_run: true`. Set `dry_run` to false only after the user has typed an explicit yes to the exact amount you printed. Never skip that yes, in any mode or path. Verify the refund line items and amounts in the preview before committing. Verify `refundableQuantity` per line item from Step 1 before proceeding.

## Workflow Steps

1. **OPERATION:** `order` — query
   **Inputs:** `id: <order_id>`
   **Expected output:** Full order with `displayFinancialStatus`, `lineItems` (with `refundableQuantity`), `transactions`, `customer`, `shippingAddress`; verify order is refundable before proceeding

2. **OPERATION:** `refundCreate` — mutation
   **Preview (query only, always before the mutation):** list each refund line item, its quantity, its unit price (`discountedUnitPriceSet`, the price the customer paid after discounts) and the line total. Add them up to give the exact refund amount. Shipping and tax are not included unless the user asks for them. The amount must not exceed what is left to refund on the original sale transaction.
   **Before this step:** show the user the order name, that list and the total, and wait for an explicit yes to that exact amount. Do not run the mutation without it.
   **Inputs:** `input.orderId`, `input.refundLineItems` (each with `lineItemId`, `quantity` and `restockType`; from parameter or all refundable. `restockType` is one of `RETURN` for items coming back, `CANCEL` for unfulfilled items, or `NO_RESTOCK`. The default is `NO_RESTOCK`. Use `RETURN` or `CANCEL` only if the user says so. If the order's fulfilment status is unclear, stop and ask the user before you run the mutation), `input.transactions` (each with `amount` set to the confirmed total from the preview, `gateway`, `kind: REFUND` and `parentId`, taken from the order's original sale transaction in Step 1; without it Shopify records the refund but does not send money back. If the order has no sale transaction to take it from, stop and tell the user. Do not guess a parentId), `input.notify`, `input.note: <reason>`
   **Expected output:** `refund.id`, `refund.totalRefundedSet`, `userErrors`

3. **OPERATION:** `draftOrderCreate` — mutation (only if `create_replacement: true`)
   **Inputs:** `input.lineItems` (from original order line items), `input.customerId`, `input.shippingAddress`, `input.note: "Replacement for order <name>"`
   **Expected output:** `draftOrder.id`, `draftOrder.name`, `draftOrder.invoiceUrl`, `userErrors`

## GraphQL Operations

```graphql
# order:query — written for api_version 2025-01, not tested by AI Blocks; check it against your store's API version
query OrderForRefund($id: ID!) {
  order(id: $id) {
    id
    name
    displayFinancialStatus
    displayFulfillmentStatus
    totalPriceSet {
      shopMoney { amount currencyCode }
    }
    lineItems(first: 50) {
      edges {
        node {
          id
          title
          quantity
          refundableQuantity
          discountedUnitPriceSet {
            shopMoney { amount currencyCode }
          }
          variant {
            id
            sku
            price
          }
        }
      }
    }
    transactions(first: 10) {
      id
      kind
      status
      amountSet {
        shopMoney { amount currencyCode }
      }
      gateway
    }
    refunds {
      id
      createdAt
      totalRefundedSet {
        shopMoney { amount currencyCode }
      }
    }
    customer {
      id
      defaultEmailAddress {
        emailAddress
      }
      firstName
      lastName
    }
    shippingAddress {
      address1
      city
      province
      country
      zip
    }
  }
}
```

```graphql
# refundCreate:mutation — written for api_version 2025-01, not tested by AI Blocks; check it against your store's API version
mutation RefundCreate($input: RefundInput!) {
  refundCreate(input: $input) {
    refund {
      id
      createdAt
      totalRefundedSet {
        shopMoney { amount currencyCode }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

```graphql
# draftOrderCreate:mutation — written for api_version 2025-01, not tested by AI Blocks; check it against your store's API version
mutation DraftOrderCreate($input: DraftOrderInput!) {
  draftOrderCreate(input: $input) {
    draftOrder {
      id
      name
      invoiceUrl
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
║  SKILL: refund-and-reorder                   ║
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
  Order:               <name>
  Refund ID:           <id>
  Amount refunded:     <amount> <currency>
  Replacement draft:   <draft order name or "none">
  Errors:              0
  Output:              none
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "refund-and-reorder",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": "<true or false, as actually run>",
  "steps": [
    { "step": 1, "operation": "OrderForRefund", "type": "query", "params_summary": "order <id>", "result_summary": "<status>", "skipped": false },
    { "step": 2, "operation": "RefundCreate", "type": "mutation", "params_summary": "<n> line items, reason: <reason>", "result_summary": "refund <id>", "skipped": false },
    { "step": 3, "operation": "DraftOrderCreate", "type": "mutation", "params_summary": "<n> line items, customer <id>", "result_summary": "draft <name>", "skipped": false }
  ],
  "outcome": {
    "order_name": "<name>",
    "refund_id": "<id>",
    "amount_refunded": "<amount>",
    "currency": "<currency>",
    "draft_order_name": "<name or null>",
    "draft_order_invoice_url": "<url or null>",
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format
No CSV output. The session completion summary reports the refund ID and amount. If `create_replacement: true`, the draft order name and invoice URL are included in the output.

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `refundableQuantity` is 0 | Line item already fully refunded | Check order refund history |
| `userErrors` from refundCreate | Invalid refund amounts or order not refundable | Check `displayFinancialStatus` — must not be `REFUNDED` |
| `userErrors` from draftOrderCreate | Invalid line items or customer | Verify product variants still exist |
| Order not found | Invalid order GID | Find the correct order ID in the Shopify admin (open the order and copy its long gid:// ID), or use the order lookup assistant from this library |

## Best Practices
1. Always run `dry_run: true` first, and keep it true until the user types yes to the printed amount — Step 2 is irreversible. Verify `refundableQuantity` per line item in Step 1 output before committing.
2. For partial refunds, specify `refund_line_items` explicitly — omitting it refunds all refundable items, which may not be intended.
3. The `create_replacement` draft order is not automatically invoiced or fulfilled — share `invoiceUrl` with the customer for payment.
4. Use `notify_customer: false` for internal corrections where the customer should not be alerted.
5. Check `displayFinancialStatus` from Step 1 — if it is `REFUNDED`, there is nothing left to refund.
