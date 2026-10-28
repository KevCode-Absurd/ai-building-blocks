---
name: shopify-admin-fulfillment-status-digest
role: fulfillment-ops
description: "Generate a daily fulfillment triage digest: all open orders segmented by fulfillment age and flagged for holds or exceptions."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
  - fulfillmentOrders:query
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
Produces a daily ops triage digest of all unfulfilled and partially-fulfilled orders, segmented by how long they've been waiting. Flags orders with active holds. Replaces the manual process of scrolling through the Shopify admin Orders page to find aging orders and exceptions — this skill fetches every open order, computes its age, buckets it into configurable time segments, and surfaces any orders currently on a fulfillment hold, giving the ops team a complete exception queue in a single read-only operation.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`. If that command is not found, check the Shopify CLI docs for the current sign-in.
- API scopes: `read_orders`. Shopify returns only the last 60 days of orders unless the app also has `read_all_orders`. Tell the user if open orders older than that may be missing.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Preview operations without executing mutations |
| aging_thresholds_days | array | no | [1, 3, 7] | Day boundaries for age buckets (e.g., `[1,3,7]` creates: 0–1d, 1–3d, 3–7d, 7d+) |
| include_holds | bool | no | true | Include orders with active fulfillment holds in a separate section |
| limit | integer | no | 250 | Maximum orders to fetch per page |

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `first: <limit>`, `query: "fulfillment_status:unfulfilled OR fulfillment_status:partial"`, sort by `CREATED_AT` ascending (oldest first), paginate until complete
   **Expected output:** All open orders with `createdAt`, `name`, `displayFulfillmentStatus`; compute age = now − `createdAt` in days; bucket into aging_thresholds_days segments

2. **OPERATION:** `fulfillmentOrders` — query (via nested `order.fulfillmentOrders`)
   **Inputs:** For each order from Step 1: `fulfillmentOrders(first: 5)` to check `status` and `requestStatus`; flag any with `status: ON_HOLD`
   If an order shows exactly five fulfillment orders, it may have more. Query that order's `fulfillmentOrders` again with a cursor until `hasNextPage` is false, so a hold on a later one is not missed.
   **Expected output:** Hold status per order. The query returns no hold start date, so show the order's age (days since `createdAt`) in the Holds section instead, and never invent a hold date

## GraphQL Operations

```graphql
# orders:query — validated against api_version 2025-01
query FulfillmentStatusDigest($first: Int!, $after: String, $query: String) {
  orders(first: $first, after: $after, query: $query, sortKey: CREATED_AT) {
    edges {
      node {
        id
        name
        createdAt
        displayFulfillmentStatus
        displayFinancialStatus
        totalPriceSet {
          shopMoney { amount currencyCode }
        }
        customer {
          id
        }
        fulfillmentOrders(first: 5) {
          edges {
            node {
              id
              status
              requestStatus
              fulfillAt
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

Note: `fulfillmentOrders` is a nested field on the `Order` type — the `fulfillmentOrders:query` frontmatter entry documents that this operation accesses fulfillment order data.

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: fulfillment-status-digest            ║
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
  Total open orders:          <n>
  By age bucket (0-1d):       <n>
  By age bucket (1-3d):       <n>
  By age bucket (3-7d):       <n>
  By age bucket (7d+):        <n>
  Orders on hold:             <n>
  Errors:                     0
  Output:                     none
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "fulfillment-status-digest",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "FulfillmentStatusDigest", "type": "query", "params_summary": "limit: <n>, query: fulfillment_status:unfulfilled OR partial", "result_summary": "<n> orders fetched", "skipped": false },
    { "step": 2, "operation": "fulfillmentOrders", "type": "query", "params_summary": "nested per order, first: 5", "result_summary": "<n> orders on hold", "skipped": false }
  ],
  "outcome": {
    "total_open_orders": 0,
    "buckets": [
      { "label": "0-1d", "count": 0 },
      { "label": "1-3d", "count": 0 },
      { "label": "3-7d", "count": 0 },
      { "label": "7d+", "count": 0 }
    ],
    "orders_on_hold": 0,
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format

**Fulfillment Age Digest — `<store>` — `<date>`**
| Age Bucket | Order Count | Oldest Order |
|-----------|-------------|--------------|
| 0–1 days | n | #XXXX |
| 1–3 days | n | #XXXX |
| 3–7 days | n | #XXXX |
| 7+ days  | n | #XXXX (⚠️ review) |

**Orders On Hold** (if `include_holds: true` and holds exist):
| Order | Order Age | Fulfillment Status |
|-------|-----------|-------------------|
| #XXXX | 3 days | ON_HOLD |

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order hold manager](https://useaiblocks.com/skills/order-hold-manager).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| No orders returned | No open orders in system | Store is fully fulfilled — no action needed |
| `fulfillmentOrders` returns empty | Order has no fulfillment assignments yet | Order may not have been assigned to a location |
| Rate limit (429) | Large order volume with pagination | Reduce `limit` to 100 |

## Best Practices
1. Run this digest first thing each morning before processing any orders — it gives you the exception queue in one view.
2. Orders in the 7d+ bucket are your highest priority; investigate and either fulfill or place an explicit hold with a reason.
3. Use `format: json` to pipe the digest into a Slack notification or dashboard script.
4. Combine with `order-hold-manager` to act on exceptions identified in this digest without leaving the CLI. Next step for each held order: decide whether to release it, fix the cause, or contact the customer.
5. For stores with 500+ open orders, set `limit: 100` and expect pagination — the digest will still aggregate correctly across all pages.
