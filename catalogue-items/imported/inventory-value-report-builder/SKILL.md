---
name: shopify-admin-inventory-valuation-report
role: merchandising
description: "Read-only: calculates total inventory value (quantity × cost) per location and per vendor for accounting and insurance."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - inventoryItems:query
  - locations:query
  - productVariants:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

## Purpose
Calculates the total inventory value (on-hand quantity × unit cost) broken down by location and vendor. Used for periodic balance sheet reconciliation, insurance valuation, and cost-of-goods reporting. Read-only — no mutations.

## Prerequisites
- Shopify CLI installed (a recent version that has the `shopify store auth` command). Check that the auth command below works before the first run.
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,read_inventory`
- API scopes: `read_products`, `read_inventory`
- Unit costs must be set on inventory items for accurate valuation (variants without cost are included at $0)
- **First run check.** Before the full run, run the `locations` query below with `first: 1` and confirm it returns a location name. If the auth command or the query fails, stop and show the error. No GraphQL field name in this skill has been verified against the current Shopify API version, so if a query is rejected, check the field names in Shopify's current docs and fix them.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| breakdown | string | no | both | Breakdown level: `location`, `vendor`, or `both` |
| include_zero_cost | bool | no | true | Include items with no cost set (shown as $0) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

Run the steps in this order. Each step feeds the next: step 1 gives the locations, step 2 gives the variants, SKUs, vendors and unit costs, step 3 gives the quantity at each location, and step 4 turns those into values.

1. **OPERATION:** `locations` — query
   **Inputs:** `first: 50`, active locations only
   **Expected output:** All active location IDs and names. These are used to label step 3's quantities.

2. **OPERATION:** `productVariants` — query
   **Inputs:** `first: 250`, select `sku`, `inventoryQuantity`, `product { vendor }`, `inventoryItem { id, unitCost }`, pagination cursor
   **Expected output:** All variants with SKU, vendor, unit cost and inventory item ID; paginate until `hasNextPage: false`. The total `inventoryQuantity` here is not used in the value calculation. Only the unit cost and the inventory item IDs are carried to step 3.

3. **OPERATION:** `inventoryItems` — query (the `InventoryLevelsByLocation` query below, which reads each inventory item through `nodes(ids:)`)
   **Note:** the `productVariants` query in step 2 returns only a total `inventoryQuantity` with no location, so use this query for all per-location quantities. Run it per batch of inventory item IDs from step 2, then use the on-hand quantity at each location in the value calculation.
   **Inputs:** Batch by inventory item IDs; fetch `inventoryLevels` per location
   **Expected output:** Per-location quantities for each inventory item

4. Calculate: for each (variant, location) pair: `value = quantity × unit_cost`; aggregate by location and vendor

## GraphQL Operations

```graphql
# locations:query — written for api_version 2025-01, not re-tested here. Check field names against your current API version before first use.
query ActiveLocationsForValuation {
  locations(first: 50, includeInactive: false) {
    edges {
      node {
        id
        name
        isActive
      }
    }
  }
}
```

```graphql
# productVariants:query — written for api_version 2025-01, not re-tested here. Check field names against your current API version before first use.
query VariantsForValuation($after: String) {
  productVariants(first: 250, after: $after) {
    edges {
      node {
        id
        sku
        inventoryQuantity
        product {
          id
          title
          vendor
        }
        inventoryItem {
          id
          unitCost {
            amount
            currencyCode
          }
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

```graphql
# inventoryItems:query (step 3, reads InventoryItem nodes by ID) — written for api_version 2025-01, not re-tested here. Check field names against your current API version before first use.
query InventoryLevelsByLocation($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on InventoryItem {
      id
      sku
      inventoryLevels(first: 20) {
        edges {
          node {
            location {
              id
              name
            }
            quantities(names: ["on_hand"]) {
              name
              quantity
            }
          }
        }
      }
    }
  }
}
```

## Session Tracking

Show the final report below at the end. Do not print progress banners at each step.

**At the end**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
INVENTORY VALUATION REPORT
  Total inventory value:  $<amount> <currency>
  SKUs included:          <n>  (of which <n> have no cost)
  Warning: variants with no cost count as $0, so this total may be much too low until you fill in those costs.

  By Location:
    Warehouse A          $<amount>
    Warehouse B          $<amount>

  By Vendor:
    Vendor X             $<amount>
    Vendor Y             $<amount>
  Output: inventory_valuation_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "inventory-valuation-report",
  "store": "<domain>",
  "total_value": 0,
  "currency": "USD",
  "skus_included": 0,
  "zero_cost_skus": 0,
  "by_location": [],
  "by_vendor": [],
  "output_file": "inventory_valuation_<date>.csv"
}
```

## Output Format
CSV file `inventory_valuation_<YYYY-MM-DD>.csv` with columns:
`variant_id`, `sku`, `product_title`, `vendor`, `location`, `quantity_on_hand`, `unit_cost`, `total_value`, `currency`

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No unit cost set | Variants without cost data | Include at $0, flag in report |
| No active locations | Store has no locations configured | Exit with error |

## Best Practices
- Run at month-end for balance sheet reconciliation — compare with your accounting system to identify discrepancies.
- Items with no cost set will appear as $0 and understate total value. Use the output to identify and fill cost gaps before the next run.
- For insurance purposes, the total is a cost baseline only. Confirm the valuation method with your insurer before you use it, since policies differ on cost, replacement or retail value.
- Pair with the Dead stock finder to understand what portion of your inventory value is tied up in slow-moving stock.
