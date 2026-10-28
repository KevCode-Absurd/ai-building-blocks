---
name: shopify-admin-order-notes-and-attributes-report
role: order-intelligence
description: "Read-only: extracts and tabulates order notes and custom attributes for ops review of gift messages and special instructions."
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
Queries recent orders and extracts order-level notes and custom line item attributes (e.g., gift messages, personalization text, special instructions, engraving text). Produces a report for ops and fulfillment teams to act on special requests during pick/pack. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders`
- API scopes: `read_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 1 | Lookback window (default: last 24 hours for daily ops use) |
| attribute_keys | array | no | [] | Specific line item attribute keys to extract (e.g., `["gift_message", "engraving"]`); empty = all |
| only_with_notes | bool | no | false | Only include orders that have an order note, an order attribute, or at least one line item attribute (after the `attribute_keys` filter) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `query: "created_at:>='<NOW - days_back days>'"`, `first: 50`, select `note`, `customAttributes`, `lineItems(first: 10) { customAttributes, pageInfo }`, pagination cursor
   **Expected output:** Orders with notes and custom attributes; paginate the orders until `orders.pageInfo.hasNextPage` is false

2. **OPERATION:** `order` — query, once for each order whose `lineItems.pageInfo.hasNextPage` is true
   **Inputs:** `id: <order id>`, `after: <lineItems.pageInfo.endCursor>`, `first: 100`
   **Expected output:** The rest of that order's line items; repeat until its `lineItems.pageInfo.hasNextPage` is false. Never report an order until all of its line items are collected, or a gift message on a later line can be missed.

3. If `attribute_keys` specified: keep only order and line item attributes whose key matches (match keys exactly, ignoring upper and lower case)

4. If `only_with_notes: true`: keep an order when ANY of these is non-empty after step 3: the order `note`, the order `customAttributes`, or the `customAttributes` of any of its line items. An order whose only special request is a line item attribute (for example a gift message on one product) must stay in the report.

5. Check the counts: `Orders queried` is every order returned in step 1. `Orders with notes` counts orders with a non-empty `note`. `Orders with attributes` counts orders with at least one order or line item attribute. Report how many orders needed extra line item pages in step 2.

## GraphQL Operations

Shopify rejects a single query that costs more than 1,000 points. Nested lists multiply the cost, so keep `first` small (50 orders with 10 line items each) and page the rest. If Shopify still reports the query is too costly, lower `first`. Written for api_version 2025-01. Shopify retires API versions on a schedule, so check these fields against the current version in the Shopify GraphQL Admin API reference before you run it.

```graphql
# orders:query
query OrderNotesAndAttributes($query: String!, $after: String) {
  orders(first: 50, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        displayFulfillmentStatus
        note
        customAttributes {
          key
          value
        }
        lineItems(first: 10) {
          edges {
            node {
              id
              title
              quantity
              variant {
                sku
              }
              customAttributes {
                key
                value
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
        shippingAddress {
          firstName
          lastName
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
# order:query — the rest of one order's line items
query OrderMoreLineItems($id: ID!, $after: String) {
  order(id: $id) {
    id
    lineItems(first: 100, after: $after) {
      edges {
        node {
          id
          title
          quantity
          variant {
            sku
          }
          customAttributes {
            key
            value
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
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
║  SKILL: Order Notes and Attributes Report    ║
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
ORDER NOTES & ATTRIBUTES REPORT  (<days_back> day(s))
  Orders queried:         <n>
  Orders with notes:      <n>
  Orders with attributes: <n>

  #<name>  <customer>  [<status>]
    Note: "<note text>"
    Line: "<product>"  gift_message: "Happy Birthday!"
  Output: order_notes_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "order-notes-and-attributes-report",
  "store": "<domain>",
  "period_days": 1,
  "orders_queried": 0,
  "orders_with_notes": 0,
  "orders_with_attributes": 0,
  "output_file": "order_notes_<date>.csv"
}
```

## Output Format
CSV file `order_notes_<YYYY-MM-DD>.csv` with columns:
`order_name`, `order_id`, `created_at`, `fulfillment_status`, `customer_name`, `order_note`, `line_item_title`, `line_sku`, `attribute_key`, `attribute_value`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Online order fulfillment planner](https://useaiblocks.com/skills/online-order-fulfillment-planner). It takes the spreadsheet.
- The [Purchase order and reorder drafter](https://useaiblocks.com/skills/purchase-order-reorder). It takes the spreadsheet.
- The [3PL bill auditor](https://useaiblocks.com/skills/3pl-bill-auditor). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No orders with notes | Quiet period or no note collection | Exit with 0 results if `only_with_notes: true` |

## Best Practices
- Run at the start of each fulfillment shift (e.g., `days_back: 1`) so pickers/packers have a printed list of special instructions before starting.
- Use `attribute_keys: ["gift_message"]` to focus on just gift orders during holiday season.
- Orders with both a note and line item attributes indicate high-touch fulfillment needs — flag these for senior staff review.
- Print or export the CSV and attach to the pick list for efficient special handling during fulfillment.
