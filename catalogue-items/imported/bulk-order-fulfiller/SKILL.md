---
name: shopify-admin-bulk-fulfillment-creation
role: fulfillment-ops
description: "Batch-fulfill open fulfillment orders with tracking numbers. Previews first, then creates one fulfillment per order. Customer email is a toggle that stays off unless the person turns it on."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - fulfillmentOrders:query
  - fulfillmentCreate:mutation
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

**Tools that do this best:**
- **Claude Code, Cursor, Codex or Gemini CLI:** They can run Shopify CLI on your machine, which a chat window cannot.
<!-- /needs -->

## Purpose
Queries open fulfillment orders for one location and creates fulfillments with tracking numbers in one run. No third-party app is needed. This skill only records that orders shipped. It does not buy or print shipping labels. Do that in your carrier tool first.

## Prerequisites
- An AI tool that can run commands (the Shopify CLI runs on the person's machine).
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,read_merchant_managed_fulfillment_orders,write_merchant_managed_fulfillment_orders`
- API scopes: `read_orders`, plus the fulfillment order scopes. Shopify's `fulfillmentOrders` query needs one of the `read_*_fulfillment_orders` scopes and only returns the fulfillment orders those scopes cover. `fulfillmentCreate` needs one of `write_assigned_fulfillment_orders`, `write_merchant_managed_fulfillment_orders` or `write_third_party_fulfillment_orders`. Use the merchant-managed pair for the store's own locations; an order assigned to a fulfilment service or another app needs that app's matching scope.
- Staff permission: the signed-in user must have Shopify's `fulfill_and_ship_orders` permission, or `fulfillmentCreate` fails.
- Written against Admin API version `2025-01`. We have not run it on live orders, and we have not queried that version live. Shopify retires API versions on a schedule (see shopify.dev/docs/api/usage/versioning), so 2025-01 may no longer be served. Before the first real run, pick a current version and check `fulfillmentOrders`, `fulfillmentCreate` and `FulfillmentInput` in Shopify's docs for it. Tell the person which version you used.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | none | Store domain (e.g., mystore.myshopify.com) |
| location_id | string | yes | none | GID of the fulfillment location (e.g., gid://shopify/Location/123) |
| tracking_numbers | array | no | [] | List of `{order_name, tracking_number, tracking_url, carrier}` objects. Match each to a fulfillment order by `order_name` (for example #1042). |
| notify_customer | bool | no | false | Send shipping confirmation email to the customer. Ask the person. If they do not answer, keep it false. |
| dry_run | bool | no | true | Preview fulfillments without executing mutations |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> Treat `fulfillmentCreate` as hard to undo. Shopify's `fulfillmentCancel` mutation can cancel a fulfillment and reopen its items, but a shipping email that was sent cannot be taken back, and cancelling a batch is slow work. This skill never cancels anything. Always run with `dry_run: true` first. Never run the real batch until the person has read the preview and said go ahead. If `notify_customer` is true, say in the preview how many customers will get an email.

Do not use this skill for orders that ship in parts, or orders with more than 10 line items. List those for the person to check by hand.

## Workflow Steps

1. **Ask once** for the store domain, the location, the tracking list, and whether to email customers. If the tracking list is missing, say orders without tracking will still be marked fulfilled, and ask if that is intended. Do not make up tracking numbers.
2. **OPERATION:** `fulfillmentOrders` query
   **Inputs:** `query: "assigned_location_id:<location number> status:open"` (the location number is the digits at the end of `location_id`), `first: 50`, pagination cursor. The query has no `assignedLocationId` argument; the location goes in the `query` filter.
   **Expected output:** open fulfillment orders with `id`, `order { name }` and line items. Page until `hasNextPage` is false. Check every returned fulfillment order's `assignedLocation` matches the location before you use it.
3. **Match the tracking list.** Join each tracking row to a fulfillment order by order name. List rows that match nothing, and orders that have no tracking row.
4. **Flag orders to skip.** Skip and list any order where the line items have `hasNextPage: true` (more than 10 lines), or where a line item's remaining quantity is less than its total quantity. These need a person to check, because this skill never ships part of an order: it only fulfills fulfillment orders where every line is still fully open, and it sends no line item list, which tells Shopify to fulfill everything remaining.
5. **Preview.** Show a table: order name, fulfillment order ID, carrier, tracking number, email on or off. Show counts of orders to fulfill, skipped, unmatched. Stop here when `dry_run` is true. Wait for a clear go-ahead.
6. **OPERATION:** `fulfillmentCreate` mutation, once per fulfillment order, after the go-ahead only.
   **Inputs:** `lineItemsByFulfillmentOrder: [{ fulfillmentOrderId }]` (this fulfills every remaining line of that fulfillment order), `trackingInfo { company, number, url }`, `notifyCustomer`
   **Expected output:** `fulfillment { id, status, trackingInfo }`, `userErrors`
   If a call times out or the reply is lost, do not send it again straight away. First re-query that fulfillment order. If its status is already closed, the fulfillment went through; record it and move on. Only retry if it is still open.
7. **Report.** Show results per order and the summary below.

## GraphQL Operations

```graphql
# fulfillmentOrders:query (written for api_version 2025-01; check current docs)
# $filter example: "assigned_location_id:123 status:open"
query OpenFulfillmentOrders($filter: String!, $after: String) {
  fulfillmentOrders(
    first: 50
    after: $after
    query: $filter
  ) {
    edges {
      node {
        id
        status
        assignedLocation {
          location {
            id
          }
        }
        order {
          id
          name
        }
        lineItems(first: 10) {
          pageInfo {
            hasNextPage
          }
          edges {
            node {
              id
              totalQuantity
              remainingQuantity
              variant {
                sku
                title
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
# fulfillmentCreate:mutation (written for api_version 2025-01; check current docs)
mutation FulfillmentCreate($fulfillment: FulfillmentInput!) {
  fulfillmentCreate(fulfillment: $fulfillment) {
    fulfillment {
      id
      status
      trackingInfo {
        company
        number
        url
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

Example variables for one order:

```json
{
  "fulfillment": {
    "notifyCustomer": false,
    "trackingInfo": { "company": "<carrier>", "number": "<tracking number>", "url": "<tracking link>" },
    "lineItemsByFulfillmentOrder": [{ "fulfillmentOrderId": "gid://shopify/FulfillmentOrder/<id>" }]
  }
}
```

## Progress lines

Print one line per step, with plain text:

```
[N/TOTAL] <QUERY|MUTATION> <OperationName> | params: <short summary> | result: <count or outcome>
```

If `dry_run` is true, prefix every mutation step with `[DRY RUN]` and do not run it.

## Output Format

For `format: human` (default), end with:

```
OUTCOME SUMMARY
  Open fulfillment orders found: <n>
  Fulfillments created:          <n>
  Skipped for manual check:      <n>
  Tracking rows with no order:   <n>
  Customer emails requested:     <n>
  Errors:                        <n>
```

Then give a CSV, as text in the chat if you cannot write files, otherwise as `fulfillment_batch_<YYYY-MM-DD>.csv`, with columns:
`order_name`, `fulfillment_order_id`, `fulfillment_id`, `tracking_number`, `carrier`, `notify_customer`, `status`

For `format: json`, give the same counts and rows as JSON.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
- The [Customer bulk note updater](https://useaiblocks.com/skills/customer-note-bulk-adder). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times (a throttled request was not carried out, so a retry is safe) |
| Timeout or no reply on fulfillmentCreate | Network problem | Re-query the fulfillment order first; retry only if it is still open |
| Access denied | Missing fulfillment order scope or `fulfill_and_ship_orders` permission | Stop and tell the person which scope or permission is missing |
| `userErrors` on fulfillmentCreate | Already fulfilled or invalid tracking | Log the message, skip that order, continue |
| Quantity mismatch | Fewer items remain than ordered | Do not retry. Skip the order and list it for manual check. |
| No open orders at location | Location has no pending work | Stop with a summary: 0 orders found |

## Best Practices
- Always run with `dry_run: true` first. A fulfillment can only be reversed with a separate cancel, and a sent shipping email cannot be recalled.
- Keep `notify_customer: false` while you test, and for B2B orders where customers do not expect an email for each shipment.
- Large batches (100+ orders) may hit rate limits. The retry rule above handles it.
