---
name: shopify-admin-fulfillment-location-routing
role: fulfillment-ops
description: "Reassign fulfillment orders from one location to another for warehouse overflow or regional routing."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - fulfillmentOrders:query
  - fulfillmentOrderMove:mutation
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
Queries open fulfillment orders assigned to a source location and moves them to a destination location. Used when a warehouse is at capacity, a location is closing, or regional routing rules change. Replaces manual reassignment in Shopify Admin — this skill handles bulk location transfers for any number of open orders in a single workflow.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders,write_fulfillments`
- API scopes: `read_orders`, `write_fulfillments`
- Both source and destination locations must be active fulfillment locations in Shopify
- Step 1 fetches open fulfillment orders and filters them by location in your code. The optional store-side search filter is unverified. Before the user types yes, they must check that the preview list matches the orders they expect to see at the source location in Shopify Admin. If the list looks wrong, stop.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| source_location_id | string | yes | — | GID of the location to move orders FROM |
| destination_location_id | string | yes | — | GID of the location to move orders TO |
| order_filter | string | no | — | Optional order name filter (e.g., "#1001,#1002") |
| dry_run | bool | no | true | Preview moves without executing mutations |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ⚠️ `fulfillmentOrderMove` reassigns fulfillment responsibility. This affects which warehouse picks and ships the order. Verify destination location has sufficient stock for all products before moving. Run with `dry_run: true` to confirm the order list and destination before committing.

## Workflow Steps

**Step 0: Verify the CLI command.** Before you sign in, run `shopify store auth --help` and check that the command and the scope names match what is written in Prerequisites. If the command differs, tell the user what the help output says and use that instead. Try it on a development or test store first if the user has one. Never run an unconfirmed auth command against a live store.

**Confirm before moving.** Never set `dry_run` to false on your own. After the preview in step 1 and the stock check in step 2, show the user the list of orders and the destination, and wait for the user to type an explicit yes. Only then run step 3.

1. **Preview (always first).** `fulfillmentOrders` — query
   **Default method: fetch and filter.** Query with `query: "status:open"`, `first: 250` and a pagination cursor. Paginate until `hasNextPage: false`. Then keep only the fulfillment orders whose `assignedLocation.location.id` equals `source_location_id`. If `order_filter` is set, also keep only the orders whose name matches. This does not depend on a location search filter.
   **Optional speed-up:** the search string `status:open assigned_location_id:<numeric part of source_location_id>` may do the filtering in the store. It was not run against a live store when this page was written. Use it only after you have tested it on a development store and the list matches the fetch-and-filter result. If the store rejects it, do not guess. Go back to the default method.
   **Expected output:** the list of open fulfillment orders at the source location. Show it to the user as the preview.

2. **Stock check (required).** Before the confirm prompt, list each item in the previewed orders with its quantity. Ask the user to open Shopify Admin and check that the destination location holds at least that quantity of each item. If you can read inventory levels with the user's access, check them yourself and list any item that is short. If neither check can be made, say so, and do not go on to step 3. Do not go on to step 3 while a shortage is unresolved.

3. **Move (only after an explicit yes).** `fulfillmentOrderMove` — mutation
   **Inputs:** `id: <fulfillment_order_id>`, `newLocationId: <destination_location_id>`
   **Expected output:** `movedFulfillmentOrder { id, assignedLocation { name } }`, `userErrors`

## GraphQL Operations

```graphql
# fulfillmentOrders:query — api_version 2025-01. Pass "status:open" as $query and filter by assigned location in code. A location search filter was not run against a live store here, so always check the preview.
query FulfillmentOrdersByLocation($query: String!, $after: String) {
  fulfillmentOrders(
    first: 250
    after: $after
    query: $query
  ) {
    edges {
      node {
        id
        status
        order {
          id
          name
        }
        assignedLocation {
          location {
            id
            name
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
# fulfillmentOrderMove:mutation — validated against api_version 2025-01
mutation FulfillmentOrderMove($id: ID!, $newLocationId: ID!) {
  fulfillmentOrderMove(id: $id, newLocationId: $newLocationId) {
    movedFulfillmentOrder {
      id
      assignedLocation {
        location {
          id
          name
        }
      }
    }
    originalFulfillmentOrder {
      id
      status
    }
    remainingFulfillmentOrder {
      id
      status
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
║  SKILL: Fulfillment Location Routing         ║
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
  Orders at source location:  <n>
  Orders moved:               <n>
  Errors:                     <n>
  Output:                     routing_log_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "fulfillment-location-routing",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": true,
  "outcome": {
    "orders_at_source": 0,
    "orders_moved": 0,
    "errors": 0,
    "output_file": "routing_log_<date>.csv"
  }
}
```

## Output Format
CSV file `routing_log_<YYYY-MM-DD>.csv` with columns:
`order_name`, `fulfillment_order_id`, `source_location`, `destination_location`, `status`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Multi-warehouse route planner](https://useaiblocks.com/skills/multi-warehouse-route-planner).
- The [Revenue by location reporter](https://useaiblocks.com/skills/revenue-by-location-reporter).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on fulfillmentOrderMove | Order already fulfilled or location inactive | Log error, skip order, continue |
| Destination location not stocked | Insufficient inventory at destination | Pause and ask the user whether to skip these orders or stop. Do not move orders to a location that cannot fulfil them |
| No open orders at source | Source has no pending work | Exit with summary: 0 orders found |

## Best Practices
- Always run with `dry_run: true` first — moving a fulfillment order does not move inventory; verify destination stock levels separately in Shopify Admin.
- Use `order_filter` to move specific high-priority orders first rather than the entire queue.
- For location closures, run this skill before the location is deactivated in Shopify Admin.
