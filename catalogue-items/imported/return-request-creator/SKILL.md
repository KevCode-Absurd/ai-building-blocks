---
name: shopify-admin-return-initiation
role: customer-support
description: "Create a formal Shopify Return record for an order, specifying line items, quantities, and return reason — the first step in the native returns workflow."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - order:query
  - returnCreate:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

**Source check by AI Blocks, 28 Oct 2026:** The [Shopify store auth reference](https://shopify.dev/docs/api/shopify-cli/store/store-auth) requires --store and comma-separated --scopes. Replace REQUIRED_SCOPES with the least permissions for the actual queries and mutations; confirm them in the Admin API reference before signing in. Do not run a command with placeholders. Complete browser sign-in yourself and keep tokens out of chat and logs. This is a documentation check, not a store login or live API test.

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
Initiates a formal Shopify Return on a delivered order — specifying which line items to return, quantities, and reason. This creates the return record in Shopify's native returns system (distinct from simply issuing a refund). Used by support agents when a customer contacts them to return delivered items. The return record enables tracking, warehouse inspection, and exchange/refund resolution downstream. Note: `returnCreate` requires the order to be in `FULFILLED` status. For orders that haven't shipped yet, cancel the order in Shopify admin instead (Orders, open the order, More actions, Cancel order, and tick restock). To pay the customer back once the item has arrived, use Refund on the order in Shopify admin. Those steps are not part of this item.

## Prerequisites
- `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`
- API scopes: `read_orders`, `write_returns`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | true | Preview operations without executing mutations. Set to false only after the user has confirmed the preview |
| order_id | string | yes | — | GID of the order (e.g., `gid://shopify/Order/12345`) |
| return_line_items | array | no | all fulfilled | Array of `{fulfillment_line_item_id, quantity, reason, reason_note}` to return |
| return_reason | string | no | `OTHER` | Default return reason for all items if not specified per-item: `SIZE_TOO_SMALL`, `SIZE_TOO_LARGE`, `WRONG_ITEM`, `NOT_AS_DESCRIBED`, `DEFECTIVE`, `STYLE`, `COLOR`, `UNWANTED`, `OTHER` |
| notify_customer | bool | no | true | Send return initiation notification email to customer. Tell the user this before the live run and ask whether to keep it on |

## Safety

> ⚠️ Show the dry-run preview and wait for the user's explicit yes before setting `dry_run` to false. Never turn it off, create the return or email the customer without that yes.

> ⚠️ Step 2 executes `returnCreate` which creates a formal return record and — if `notify_customer: true` — sends an email to the customer. This is appropriate only after verifying with the customer that a return is expected. Run with `dry_run: true` to preview the return line items and quantities before committing.

## Workflow Steps

1. **OPERATION:** `order` — query
   **Inputs:** `id: <order_id>`
   **Expected output:** Order `name`, `displayFulfillmentStatus` (must be `FULFILLED` — abort if not), `fulfillments` with `fulfillmentLineItems` including `id`, `quantity`, `discountedTotalSet`

2. **OPERATION:** `returnCreate` — mutation
   **Inputs:** `returnInput.orderId`, `returnInput.returnLineItems` array (each with `fulfillmentLineItemId`, `quantity`, `reason`, `customerNote`)
   **Expected output:** `return.id`, `return.status: OPEN`, `userErrors`

## GraphQL Operations

```graphql
# order:query — validated against api_version 2025-01
query OrderForReturn($id: ID!) {
  order(id: $id) {
    id
    name
    displayFulfillmentStatus
    displayFinancialStatus
    customer {
      id
      defaultEmailAddress {
        emailAddress
      }
      firstName
      lastName
    }
    fulfillments {
      id
      status
      fulfillmentLineItems(first: 50) {
        edges {
          node {
            id
            quantity
            lineItem {
              title
              variant {
                id
                sku
              }
            }
            discountedTotalSet {
              shopMoney { amount currencyCode }
            }
          }
        }
      }
    }
  }
}
```

```graphql
# returnCreate:mutation — validated against api_version 2025-01
mutation ReturnCreate($returnInput: ReturnInput!) {
  returnCreate(returnInput: $returnInput) {
    return {
      id
      status
      order {
        id
        name
      }
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
║  SKILL: return-initiation                    ║
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
  Return ID:           <id>
  Line items included: <count>
  Return status:       <status>
  Customer notified:   <yes/no>
  Errors:              0
  Output:              none
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "return-initiation",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "OrderForReturn", "type": "query", "params_summary": "order <id>", "result_summary": "<status>", "skipped": false },
    { "step": 2, "operation": "ReturnCreate", "type": "mutation", "params_summary": "<n> line items, reason: <reason>", "result_summary": "return <id>", "skipped": false }
  ],
  "outcome": {
    "order_name": "<name>",
    "return_id": "<id>",
    "return_status": "<status>",
    "line_items_count": "<count>",
    "customer_notified": "<true/false>",
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format
No CSV output. The session summary reports the return ID and status. Line items included in the return are listed in the step 2 output.

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
| `displayFulfillmentStatus` not `FULFILLED` | Order hasn't shipped yet | Cancel the order and restock in Shopify admin (Orders, open the order, More actions, Cancel order) |
| `fulfillmentLineItemId` not found | Line item ID doesn't belong to this order's fulfillments | Re-query the order to get correct fulfillment line item IDs |
| `userErrors` from returnCreate | Invalid quantity or reason | Check `quantity` doesn't exceed `fulfillmentLineItem.quantity` |
| Return already exists | A return was already created for these items | Check order returns in Shopify admin |

## Best Practices
1. Always run `dry_run: true` first — confirm the fulfillment line item IDs and quantities before creating the return record.
2. The `return-initiation` skill creates the return record only — it does not issue a refund. After inspecting the returned item, open the order in Shopify admin and use Refund to pay the customer back.
3. Set `reason` per line item when items have different return reasons — this improves your returns analytics in Shopify.
4. For exchanges (not refunds), create the return record here. Then make the replacement order yourself in Shopify admin (Orders, Create order). This item does not make replacement orders.
5. The return `status` will be `OPEN` after creation — it moves to `IN_PROGRESS` when a return label is generated and `CLOSED` when the refund is processed.
