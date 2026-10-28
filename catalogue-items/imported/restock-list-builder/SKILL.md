---
name: shopify-admin-low-inventory-restock
role: merchandising
description: "Query all tracked product variants below a stock threshold and export a restock list grouped by vendor."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - productVariants:query
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
Queries all tracked product variants at or below a configurable stock threshold and exports a restock CSV grouped by vendor. By pulling live inventory counts directly from the Shopify Admin API and sorting results by vendor name, this skill gives procurement teams an immediately actionable reorder list without manual exports from the Shopify admin inventory view.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- API scopes: `read_products`, `read_inventory`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Has no effect. This skill only reads your store and never changes it |
| threshold | integer | no | 10 | Variants at or below this quantity are included |
| include_zero_stock | bool | no | true | Include variants with 0 quantity. If false, variants with 0 are dropped in Step 2 |

## Workflow Steps

1. **OPERATION:** `productVariants` — query
   **Inputs:** `first: 250`, `query: "inventory_quantity:<= <threshold>"`, pagination cursor
   **Expected output:** List of variant objects with inventoryQuantity, product title, vendor, SKU; paginate until `hasNextPage: false`
   **Negative counts:** a variant with a negative count (oversold) is below the limit, so it is included. It is only dropped if it is untracked.

2. Keep only variants where `inventoryItem.tracked` is true. Drop untracked variants, because their count is not meaningful. If `include_zero_stock` is false, also drop variants whose `inventoryQuantity` is 0 (equivalent to adding `inventory_quantity:>0` to the query). Then sort by vendor, then product title, and write the CSV. Variants whose product has no vendor go in one group with the vendor column set to `No vendor`, placed last.

## GraphQL Operations

```graphql
# productVariants:query — validated against api_version 2025-01
query LowInventoryVariants($first: Int!, $after: String, $query: String) {
  productVariants(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        title
        sku
        inventoryQuantity
        product {
          id
          title
          vendor
        }
        inventoryItem {
          id
          tracked
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

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: low-inventory-restock                ║
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
  Variants below threshold:  <n>
  Unique products:            <n>
  Vendors:                    <n>
  Errors:                     0
  Output:                     restock_list_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "low-inventory-restock",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "LowInventoryVariants", "type": "query", "params_summary": "threshold <= 10, store-wide", "result_summary": "<n> variants", "skipped": false }
  ],
  "outcome": {
    "variants_below_threshold": 0,
    "unique_products": 0,
    "vendors": 0,
    "errors": 0,
    "output_file": "restock_list_<date>.csv"
  }
}
```

## Output Format
CSV file `restock_list_<YYYY-MM-DD>.csv` grouped by vendor, sorted by vendor name then product title. Columns: `vendor`, `product_title`, `variant_title`, `sku`, `current_stock`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Supplier order splitter](https://useaiblocks.com/skills/supplier-order-splitter). It takes the spreadsheet.
- The [Purchase order and reorder drafter](https://useaiblocks.com/skills/purchase-order-reorder). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| No variants returned | All variants are above threshold or inventory not tracked | Lower threshold or verify `inventoryItem.tracked: true` |
| Rate limit (429) | Too many paginated requests | Reduce `first` to 100 and retry |

## Best Practices
1. Counts are store-wide totals. This skill cannot filter by location, so use your inventory app for per-warehouse counts.
2. Only variants with `inventoryItem.tracked: true` have meaningful stock counts. Untracked variants may show as 0, so Step 2 drops them. Check those by hand.
3. The restock CSV is sorted by vendor — share the vendor-grouped output directly with your procurement team without reformatting.
4. Set `include_zero_stock: false` to drop variants with a count of 0 and focus on nearly-depleted items. This does not look at back-orders.
5. Schedule this skill to run weekly via cron and pipe the CSV to your purchasing workflow.
