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

## Purpose
Queries open fulfillment orders for one location and creates fulfillments with tracking numbers in one run. No third-party app is needed. This skill only records that orders shipped. It does not buy or print shipping labels. Do that in your carrier tool first.

## Prerequisites
- An AI tool that can run commands (the Shopify CLI runs on the person's machine).
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,write_fulfillments`
- API scopes: `read_orders`, `write_fulfillments`
- Written against Admin API version `2025-01`. It has not been run on live orders by us. Before the first real run, check Shopify's current docs for `fulfillmentCreate` and `FulfillmentInput`. If your API version is older, `fulfillmentCreateV2` may be the name to use. Tell the person which version you used.

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

> `fulfillmentCreate` cannot be undone through the API. Fulfilled orders cannot be unfulfilled this way. Always run with `dry_run: true` first. Never run the real batch until the person has read the preview and said go ahead. If `notify_customer` is true, say in the preview how many customers will get an email.

Do not use this skill for orders that ship in parts, or orders with more than 10 line items. List those for the person to check by hand.

## Workflow Steps

1. **Ask once** for the store domain, the location, the tracking list, and whether to email customers. If the tracking list is missing, say orders without tracking will still be marked fulfilled, and ask if that is intended. Do not make up tracking numbers.
2. **OPERATION:** `fulfillmentOrders` query
   **Inputs:** `assignedLocationId: <location_id>`, `status: OPEN`, `first: 250`, pagination cursor
   **Expected output:** open fulfillment orders with `id`, `order { name }` and line items. Page until `hasNextPage` is false.
3. **Match the tracking list.** Join each tracking row to a fulfillment order by order name. List rows that match nothing, and orders that have no tracking row.
4. **Flag orders to skip.** Skip and list any order where the first 10 line items have `hasNextPage: true`, or where a line item's remaining quantity is less than the quantity ordered. These need a person to check, because a partial shipment is not handled here.
5. **Preview.** Show a table: order name, fulfillment order ID, carrier, tracking number, email on or off. Show counts of orders to fulfill, skipped, unmatched. Stop here when `dry_run` is true. Wait for a clear go-ahead.
6. **OPERATION:** `fulfillmentCreate` mutation, once per fulfillment order, after the go-ahead only.
   **Inputs:** `lineItemsByFulfillmentOrder: [{ fulfillmentOrderId }]` (this fulfills every remaining line of that fulfillment order), `trackingInfo { company, number, url }`, `notifyCustomer`
   **Expected output:** `fulfillment { id, status, trackingInfo }`, `userErrors`
7. **Report.** Show results per order and the summary below.

## GraphQL Operations

```graphql
# fulfillmentOrders:query (written for api_version 2025-01; check current docs)
query OpenFulfillmentOrders($locationId: ID!, $after: String) {
  fulfillmentOrders(
    assignedLocationId: $locationId
    first: 250
    after: $after
    query: "status:open"
  ) {
    edges {
      node {
        id
        status
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

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on fulfillmentCreate | Already fulfilled or invalid tracking | Log the message, skip that order, continue |
| Quantity mismatch | Fewer items remain than ordered | Do not retry. Skip the order and list it for manual check. |
| No open orders at location | Location has no pending work | Stop with a summary: 0 orders found |

## Best Practices
- Always run with `dry_run: true` first. Fulfillments cannot be undone through the Admin API.
- Keep `notify_customer: false` while you test, and for B2B orders where customers do not expect an email for each shipment.
- Large batches (100+ orders) may hit rate limits. The retry rule above handles it.
