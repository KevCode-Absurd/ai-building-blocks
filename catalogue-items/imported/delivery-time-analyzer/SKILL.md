---
name: shopify-admin-delivery-time-analysis
role: fulfillment-ops
description: "Read-only: calculates average time from fulfillment creation to delivery by carrier using fulfillment and order data."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2026-10"
graphql_operations:
  - orders:query
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
Compares elapsed time from fulfilment creation to recorded delivery by carrier, with an optional actual fulfilment-location filter. This can include warehouse handling and does not prove a carrier caused a delay. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders`
- API scopes: `read_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Order-creation look-back window |
| min_orders | integer | no | 5 | Minimum orders per carrier to include in averages |
| location_id | string | no | — | Filter by fulfillment location (optional) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> Read-only store access. The local snapshot and report can contain private business or customer records. Save them only in the owner-approved environment. This skill executes no store mutations.

## Workflow Steps

**AI Blocks correction:** filter the actual `Fulfillment.location` before calculating carrier statistics. The former separate fulfilment-order lookup did not filter the measurements. This query was checked against Shopify's 2026-10 documentation on 28 October 2026; AI Blocks has not run it against a live store.

1. Confirm the store, look-back range, optional location ID and minimum number of orders. Use timezone-bearing ISO timestamps for `[start, end)`. The range selects **orders created in the window**, with delivery recorded before its end. It does not include every shipment made during that period, since an older order may ship later. State this cohort in the result.
2. Read every accessible page of orders in that range, including partially fulfilled orders. Keep every returned fulfilment with its actual location, creation time, delivery time and tracking company. Do not silently truncate an order's fulfilments. Record any history or access limit and whether collection was complete.
3. If a location was requested, keep only fulfilments whose `location.id` matches it. Exclude unknown locations and count them as missing. Never fall back to all locations while labelling the result as filtered. If the store cannot supply location data, say the location-specific analysis could not be completed.
4. Save the collected order nodes in a local JSON file:

   ```json
   {
     "window": {"start": "<ISO timestamp with timezone>", "end": "<ISO timestamp with timezone>"},
     "complete": false,
     "min_orders": 5,
     "orders": []
   }
   ```

   The angle-bracket strings are placeholders. Add `location_id` only for a requested filter. Set `complete` to true only when all accessible pages and the requested history were checked; it records the collector's declaration, not independent proof.
5. Run the supplied analyser from a separate working folder:

   ```bash
   node "../delivery-time-analyzer/scripts/delivery-times.mjs" --input snapshot.json --out delivery_analysis
   ```

   The quoted path assumes the unzipped skill folder is next to your working folder. Adjust it to the actual installed path. It writes `delivery_analysis.json` and `delivery_analysis.csv`, makes no network calls or store changes, and refuses to overwrite an existing output. Download the full skill folder if the scripts are missing.
6. For valid dated fulfilments, the measure is `deliveredAt - createdAt`. A missing delivery date is **not proof the parcel is in transit**. Keep it out of averages and report it as a missing date. Exclude invalid or negative time intervals. Unknown or ambiguous carrier names are not attributed to a named carrier.
7. Apply `min_orders` after the location filter and date checks. Count distinct order IDs per carrier, not shipments: one order with two shipments is still one order for this threshold. Average the measured fulfilment durations and show both order and fulfilment counts. Keep the filtered shipment rows in the CSV even when a carrier has too few dated orders for an average.

This measures from Shopify fulfilment creation, which can precede carrier pickup. It can include warehouse handling time and does not prove a carrier caused a delay. Small-sample filters are display settings, not a statistical significance test.

## GraphQL Operations

Set `$query` to the confirmed order-creation range. Paginate until `hasNextPage` is false, and mark gaps honestly.

```graphql
query FulfilledOrders($query: String!, $after: String) {
  orders(first: 10, after: $after, query: $query) {
    nodes {
      id
      name
      createdAt
      fulfillments {
        id
        createdAt
        deliveredAt
        status
        location { id name }
        trackingInfo { company }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

Checked sources: [Fulfillment](https://shopify.dev/docs/api/admin-graphql/2026-10/objects/Fulfillment) and [Order](https://shopify.dev/docs/api/admin-graphql/2026-10/objects/Order). The filter uses where the fulfilment was processed, not an order's current assigned location.

## Session Tracking

Report the store, order-creation window, requested location and collection status. Log query counts without customer details. For `format: human`, show each measured carrier with distinct order count, fulfilment count, average, minimum and maximum days. For `format: json`, return the actual analyser report. Show missing dates and exclusions separately; never call them in-transit parcels without evidence.

## Output Format

The local analyser writes `delivery_analysis.json` and `delivery_analysis.csv`. CSV columns are:
`order_id`, `order_name`, `fulfillment_id`, `location_id`, `carrier`, `fulfilled_at`, `delivered_at`, `transit_days`, `status`.

The JSON includes carrier averages and diagnostics. Keep rows with missing dates in the CSV, with null transit days. Carriers below the distinct-order threshold stay out of averages.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Recovery |
|-------|----------|
| API throttling or access failure | Follow response retry timing; stop after bounded retries and mark collection incomplete. |
| Missing delivery date | Exclude from averages and report a missing date. Do not infer transit status. |
| Missing requested location | Exclude the fulfilment and count the gap. Never silently broaden the filter. |
| No measured fulfilments | Report no valid dated fulfilments in this cohort, with exclusions and coverage. |

## Best Practices
- Treat `min_orders` as a display setting. It does not make a sample statistically significant.
- Compare equivalent order cohorts and report warehouse handling as a possible part of the elapsed time.
- Check missing delivery dates before drawing conclusions about carrier performance.
