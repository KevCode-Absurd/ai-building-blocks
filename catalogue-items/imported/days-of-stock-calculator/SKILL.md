---
name: shopify-admin-stock-velocity-report
role: merchandising
description: "Read-only: calculates days-of-supply and sell-through rate per SKU and location for replenishment planning."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2026-10"
graphql_operations:
  - productVariants:query
  - orders:query
  - inventoryItem:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI; Node.js 22.12+ for local scripts
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
Estimates **days of supply** per variant and location from available stock and fulfilled-unit velocity. It also shows a labelled sell-through proxy. The order-creation cohort and data gaps are part of the result.

Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,read_orders,read_inventory`
- API scopes: `read_products`, `read_orders`, `read_inventory`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Order-creation window for fulfilled-unit velocity |
| dos_alert_threshold | integer | no | 14 | Flag SKUs with fewer than this many days of supply |
| vendor_filter | string | no | — | Optional vendor to scope report |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> Read-only store access. The local snapshot and report can contain private business or customer records. Save them only in the owner-approved environment. This skill executes no store mutations.

## Workflow Steps

**AI Blocks correction:** the report uses each location's available stock and its own fulfilled units. It never copies the store total into every location. The queries below were checked against Shopify's 2026-10 documentation on 28 October 2026. They have not been run against a live store by AI Blocks.

1. Fix the store, report end time and look-back window. Use timezone-bearing ISO timestamps and the half-open range `[start, end)`. This is an **order-creation cohort**: orders created in the window, with successful fulfilments created before its end. It is not a count of every shipment made during that period. Record when stock was read; stock is the current available quantity, not historical opening stock.
2. Read every page of variants. Keep variant IDs even when two variants have the same SKU. For each inventory item, read every page of inventory levels. Join by inventory item and location ID. Read the `available` quantity; do not substitute the all-location `inventoryQuantity` or call available stock physical on-hand stock.
3. Read all accessible orders created in the window. Collect each fulfilment's ID, status, creation time and actual `location`. Read every page of `fulfillmentLineItems`, using the separate fulfilment query below when there are more than 10. Count a line once, against its variant ID and fulfilment location. Unfulfilled units are outside this measure. Cancelled or unsuccessful fulfilments are excluded.
4. Check collection coverage. Shopify order access may be limited to recent history. If the requested window is not accessible, or any page is missing, mark the collection incomplete. Never infer an inaccessible period had zero sales. Missing variant or location IDs are gaps, not permission to spread units across locations.
5. Save the collected records as `snapshot.json`, using the local analyser contract below. Set `complete: true` only after checking all pages and the requested history. Otherwise use `false`. Keep this file local; it contains store data.
6. Run the supplied analyser from a separate working folder:

   ```bash
   node "../days-of-stock-calculator/scripts/stock-velocity.mjs" --input snapshot.json --out velocity
   ```

   The quoted path assumes the unzipped skill folder is next to your working folder. Adjust it to the actual installed path. This writes `velocity.json` and `velocity.csv`. It makes no network calls or store changes and refuses to overwrite an existing output. If the scripts are missing, download the full skill folder before claiming the calculation ran.
7. Report the exact cohort, stock read time, exclusions and collection gaps. A location's rate is its fulfilled units divided by the window duration in days. Cover is available stock divided by that rate. No fulfilled units gives an unknown cover value, not a claim of unlimited stock. Negative available stock is flagged. Incomplete collection or unlocated units cannot support a confident cover estimate.

The sell-through field is a **proxy**: fulfilled units from this order cohort divided by those units plus current available stock. It does not use inventory receipts, and it is not a standard period sell-through measure. The 30-day window and 14-day alert are adjustable defaults, not universal reorder rules.

### Local analyser input

Use this shape; the strings in angle brackets are placeholders, not sample store results:

```json
{
  "window": {"start": "<ISO timestamp with timezone>", "end": "<ISO timestamp with timezone>"},
  "complete": false,
  "dos_alert_threshold": 14,
  "variants": [],
  "orders": []
}
```

`variants` holds the variant nodes below. Attach each item's combined `inventoryLevels.nodes` and final `pageInfo` under `variant.inventoryItem.inventoryLevels`. `orders` holds the collected order nodes, including all fulfilment line items. Set each combined connection's `pageInfo.hasNextPage` to `false` only when all its pages were actually collected. An optional `vendor_filter` matches the product's vendor. The analyser's completion field records the collector's declaration; it does not independently prove API coverage.

## GraphQL Operations

```graphql
query VariantsForVelocity($query: String, $after: String) {
  productVariants(first: 250, after: $after, query: $query) {
    nodes {
      id
      sku
      product { id title vendor }
      inventoryItem { id tracked }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

```graphql
query ItemStockByLocation($id: ID!, $after: String) {
  inventoryItem(id: $id) {
    id
    inventoryLevels(first: 250, after: $after) {
      nodes {
        location { id name }
        quantities(names: ["available"]) { name quantity }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

Set `$query` to the confirmed order-creation range. Paginate orders and each nested connection separately. Do not silently cap fulfilments per order.

```graphql
query OrdersForLocationVelocity($query: String!, $after: String) {
  orders(first: 10, after: $after, query: $query) {
    nodes {
      id
      createdAt
      fulfillments {
        id
        status
        createdAt
        location { id name }
        fulfillmentLineItems(first: 10) {
          nodes { id quantity lineItem { variant { id } } }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

```graphql
query MoreFulfillmentLines($id: ID!, $after: String) {
  node(id: $id) {
    ... on Fulfillment {
      id
      fulfillmentLineItems(first: 250, after: $after) {
        nodes { id quantity lineItem { variant { id } } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}
```

Checked sources: [InventoryLevel](https://shopify.dev/docs/api/admin-graphql/2026-10/objects/InventoryLevel), [Fulfillment](https://shopify.dev/docs/api/admin-graphql/2026-10/objects/Fulfillment), and [Order](https://shopify.dev/docs/api/admin-graphql/2026-10/objects/Order). If access or a field differs in the connected store, report the gap instead of inventing a substitute.

## Session Tracking

Report the store, order-creation window, stock read time and collection gaps at the start and end. Log query counts without exposing customer details. For `format: human`, show the analyser summary and flagged rows. For `format: json`, return the actual analyser report. Never present placeholders as completed results.

## Output Format

The local analyser writes `velocity.json` and `velocity.csv`. CSV columns are:
`variant_id`, `sku`, `product_title`, `vendor`, `location_id`, `location_name`, `available_stock`, `fulfilled_units`, `daily_fulfilled_units`, `days_of_supply`, `sell_through_proxy_pct`, `status`, `alert`.

The JSON also records the window and collection diagnostics. A null cover value means it could not be estimated. Keep the location ID with every row.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Dead stock finder](https://useaiblocks.com/skills/dead-stock-finder). It takes the spreadsheet.
- The [Reorder quantity planner](https://useaiblocks.com/skills/reorder-quantity-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Recovery |
|-------|----------|
| API throttling or access failure | Follow the response retry timing; stop after bounded retries and mark collection incomplete. |
| No fulfilled units | Report no fulfilled units in the collected cohort, not unlimited cover or proof of no demand. |
| Missing location, variant or inventory quantity | Report the gap; do not copy store totals or infer zero stock. |
| Incomplete nested pages | Collect the remaining pages or keep the estimate incomplete. |

## Best Practices
- Compare the alert with supplier lead times and the owner's reorder policy. The default is not a purchase instruction.
- Use a longer window only when Shopify grants access to its full order history. Check seasonality before relying on a constant rate.
- Keep available stock separate from physical stock counts and inventory receipts.
- Review incomplete rows before using this report to plan purchases.
