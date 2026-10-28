---
name: shopify-admin-bundle-availability-check
role: fulfillment-ops
description: "Read-only: for native bundle products and metafield-defined bundles, verifies every component variant has sufficient stock to fulfill the bundle's effective availability."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - productVariants:query
  - inventoryItems:query
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
Walks every product flagged as a bundle (either via Shopify's native `requiresComponents` mechanic or a `bundle.components` metafield convention), then verifies each component variant has sufficient inventory to back the bundle's quantity ratio. Surfaces bundles that are listed as in-stock on the storefront but cannot actually be fulfilled because one component has run out. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,read_inventory`
- For metafield bundles, the metafield value is a JSON list such as `[{"variantId": "gid://shopify/ProductVariant/[ID]", "quantity": [NUMBER]}]`. Add it in the Shopify admin under Settings, Custom data, Products, then fill it in on each bundle product.
- API scopes: `read_products`, `read_inventory`
- Native bundles (the `requiresComponents` mechanic) need a store where Shopify's bundle feature is available to you. Check this in your Shopify admin or with Shopify support. On any other setup, use the metafield method above.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| metafield_namespace | string | no | bundle | Metafield namespace where bundle component definitions live |
| metafield_key | string | no | components | Metafield key that holds the JSON list of `{variantId, quantity}` |
| safety_stock | integer | no | 0 | Extra units of each component to keep back, taken off the `available` quantity before counting bundles |
| low_units | integer | no | — | Report a bundle as "Constrained (low)" when it can be built at least once but fewer than this many times. If not set, skip the Constrained count and say it was not requested |
| only_listed | bool | no | true | Only check bundle products with status `ACTIVE` |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time. The skill reads inventory and metafields only; it never adjusts component quantities or bundle availability.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `first: 250`, `query: "metafield:<namespace>.<key>:* OR product_type:bundle"`, select `requiresSellingPlan`, `status`, `metafield(namespace, key)`, `variants`, pagination cursor. When `only_listed` is true (the default), add `AND status:active` to the query so only active bundles are checked.
   **Expected output:** Bundle products and their parent variants; paginate until `hasNextPage: false`

2. For each bundle, parse component list. Native bundles use `productVariant.requiresComponents` and `productVariant.productVariantComponents`. Metafield bundles parse JSON value into `[{variantId, quantity}]`.

3. **OPERATION:** `productVariants` — query
   **Inputs:** Batched IDs of all unique component variants (at most 250 IDs per `nodes` call), select `inventoryQuantity`, `inventoryItem { id }`, `product { title }`
   **Expected output:** Component titles and inventory item IDs. Do not use `inventoryQuantity` as the stock figure; step 4 gives the `available` quantity per location

4. **OPERATION:** `inventoryItems` — query
   **Inputs:** Batched component inventory item IDs, select `tracked`, `inventoryLevels(first: 25) { quantities }` with `pageInfo`
   **Expected output:** Per-location `available`, `committed` and `on_hand` for each component

   **Paging inside each item.** `variants(first: 100)`, `productVariantComponents(first: 50)` and `inventoryLevels(first: 25)` each return `pageInfo`. If any of them says `hasNextPage: true`, fetch the rest with `after: <endCursor>` before you count. If you cannot fetch the rest, mark that bundle `INCOMPLETE_DATA`, leave it out of the totals and list it in the report. Never count from a partial list.

5. For each bundle, compute `max_buildable_units = max(0, min over components of floor((component_available - safety_stock) / required_qty))`.
   - `component_available` is the `available` quantity summed across the locations that fulfil the bundle's orders (all locations by default; say which you used). Do not use `on_hand`: Shopify's `on_hand` also counts units that are `committed` to open orders, `reserved`, `damaged`, held as `safety_stock` or in `quality_control`, which you cannot sell (shopify.dev/docs/apps/build/orders-fulfillment/inventory-management-apps#inventory-states).
   - The `max(0, ...)` keeps a component with less stock than the buffer from giving a negative count.
   - Status: `BROKEN` when `max_buildable_units == 0`; `CONSTRAINED` when `low_units` is set and `0 < max_buildable_units < low_units`; otherwise `OK`.
   - Worked check: on_hand 10, committed 8, available 2, 3 needed per bundle gives floor(2 / 3) = 0, so the bundle is BROKEN. Counting on_hand would wrongly give 3. With available 1, safety_stock 2 and 1 needed, (1 - 2) / 1 = -1, so the count is 0 and the bundle is BROKEN.

## GraphQL Operations

The field names below were written for API version 2025-01 and were not run again in this catalogue. Check names such as `inventoryQuantity` and `productVariantComponents` against Shopify's current docs before the first run. If a query fails, fix the field name and say so in the report. Before the full run, test the `products` query on 2 or 3 bundles (or a development store) and confirm the fields come back.

```graphql
# products:query — written for api_version 2025-01, not yet verified on a live store
query BundleProducts($query: String!, $after: String, $namespace: String!, $key: String!) {
  products(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        title
        status
        productType
        metafield(namespace: $namespace, key: $key) {
          id
          value
          type
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              inventoryQuantity
              requiresComponents
              productVariantComponents(first: 50) {
                edges {
                  node {
                    quantity
                    productVariant {
                      id
                      sku
                      inventoryQuantity
                      product {
                        id
                        title
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
          }
          pageInfo {
            hasNextPage
            endCursor
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
# productVariants:query — written for api_version 2025-01, not yet verified on a live store
query ComponentVariantStock($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ProductVariant {
      id
      sku
      inventoryQuantity
      product {
        id
        title
      }
      inventoryItem {
        id
        tracked
      }
    }
  }
}
```

```graphql
# inventoryItems:query — written for api_version 2025-01, not yet verified on a live store
query ComponentInventoryLevels($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on InventoryItem {
      id
      tracked
      inventoryLevels(first: 25) {
        edges {
          node {
            location {
              id
              name
            }
            quantities(names: ["available", "on_hand", "committed"]) {
              name
              quantity
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
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Bundle Availability Check            ║
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
BUNDLE AVAILABILITY CHECK
  Bundles inspected:       <n>
  Fully buildable:         <n>
  Constrained (low):       <n, or "not requested" if low_units is not set>
  Broken (cannot build):   <n>
  Incomplete data:         <n>

  Top broken bundles:
    "<bundle>"  Bottleneck: "<component>"  Need: <n>  Available: <n>
  Output: bundle_availability_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "bundle-availability-check",
  "store": "<domain>",
  "bundles_inspected": 0,
  "fully_buildable": 0,
  "constrained": 0,
  "broken": 0,
  "issues": [],
  "output_file": "bundle_availability_<date>.csv"
}
```

## Output Format
CSV file `bundle_availability_<YYYY-MM-DD>.csv` with columns:
`bundle_product_id`, `bundle_title`, `bundle_variant_sku`, `max_buildable_units`, `bottleneck_component_sku`, `bottleneck_component_title`, `bottleneck_required_qty`, `bottleneck_available`, `status` (`OK`, `CONSTRAINED`, `BROKEN`, `BROKEN_REFERENCE` or `INCOMPLETE_DATA`)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Metafield value is invalid JSON | Malformed configuration | Skip bundle, log warning, include in error count |
| Component variant ID does not resolve | Component product was deleted | Mark bundle as `BROKEN_REFERENCE`, include in output |
| Component is `tracked: false` | Untracked inventory | Do not let it limit the count, but list the bundle under "needs review" and say the count may be too high, because Shopify does not track that part |

## Best Practices
- Run daily for stores with many bundles; surface broken bundles before customers can buy something you cannot ship.
- Use `safety_stock` to keep a buffer for non-bundle sales of the same component — bundles share inventory with standalone variants.
- Pair with `stock-count-updater` or `restock-list-builder` to action a broken bundle into a reorder.
- For native bundles, `requiresComponents: true` is authoritative — prefer it over metafield conventions when both exist.
- A bundle with `max_buildable_units = 0` may need to be unpublished until the bottleneck component is restocked. This skill does not do that. It only reads data. Unpublishing is a manual step you take in your Shopify admin, if you decide to.
