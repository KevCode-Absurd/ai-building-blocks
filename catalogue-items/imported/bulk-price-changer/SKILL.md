---
name: shopify-admin-bulk-price-adjustment
role: merchandising
description: "Query products by collection or tag and update all variant prices by a percentage or fixed amount, with optional floor/ceiling constraints."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - product:query
  - productVariantsBulkUpdate:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

**Source check by AI Blocks, 28 Oct 2026:** The [Shopify store auth reference](https://shopify.dev/docs/api/shopify-cli/store/store-auth) requires --store and comma-separated --scopes. Replace REQUIRED_SCOPES with the least permissions for the actual queries and mutations; confirm them in the Admin API reference before signing in. Do not run a command with placeholders. Complete browser sign-in yourself and keep tokens out of chat and logs. This is a documentation check, not a store login or live API test.

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
Applies a percentage or fixed price adjustment to every variant across a Shopify collection or tag in a single automated workflow — without manually navigating products in the admin UI, exporting CSVs, editing them, and re-importing. Use this skill when you need to run a storewide or collection-level sale, revert prices after a promotion ends, pass through a supplier cost increase, or align pricing across a segment of products.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`
- API scopes: `read_products`, `write_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | true | Preview operations without executing mutations. Live changes run only after the person has reviewed the full preview and set `dry_run: false` for that exact change set. |
| collection_id | string | no* | — | GID of collection to target (e.g., `gid://shopify/Collection/123`) |
| tag | string | no* | — | Product tag to filter by (alternative to collection_id) |
| adjustment_type | string | yes | — | `percent` or `fixed` |
| adjustment_value | float | yes | — | Amount to adjust. Positive = increase, negative = decrease. For percent: `-10` = 10% discount. |
| min_price | float | no | 0 | Floor price — no variant will be set below this value |
| max_price | float | no | — | Ceiling price — no variant will be set above this value (optional) |

*One of `collection_id` or `tag` is required.

## Safety

> ⚠️ Step 3 executes `productVariantsBulkUpdate` mutations that change live prices immediately. Price changes cannot be undone in bulk via API — each variant must be reverted individually. The skill always starts as a dry run (`dry_run: true` is the default). Do not run any mutation until all of these are true:
> 1. The preview CSV covers every variant (every product page and every variant page was fetched, and the variant count matches the products' variant totals).
> 2. The person has read the preview and replied with a clear yes for this exact change set (store, filter, adjustment, floor and ceiling).
> 3. They set `dry_run: false` for that run.
> If any filter, adjustment or product changes after the approval, preview again and ask again. Keep the preview CSV: its `old_price` column is your record for reverting.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `first: 10`, `query: "collection_id:'<id>'"` or `query: "tag:'<tag>'"`, products cursor `after`
   **Expected output:** Products with their first page of variants (IDs, current prices, SKUs) and the variants `pageInfo`; paginate products until `hasNextPage: false`. Keep each query under Shopify's single-query cost limit of 1,000 points: read `extensions.cost` in the response and lower `first` if the query is rejected for cost.

2. **OPERATION:** `product` — query (only for products whose `variants.pageInfo.hasNextPage` is true)
   **Inputs:** product `id`, `first: 100`, variants cursor `after` (start from the `endCursor` of step 1)
   **Expected output:** The remaining variants of that product; paginate until `hasNextPage: false`. Without this step a product with more variants than the first page would be only partly changed.

3. **OPERATION:** `productVariantsBulkUpdate` — mutation (skipped while `dry_run` is true)
   **Inputs:** For each product: `productId` + array of `{id, price}` with computed new prices (respecting min_price/max_price constraints)
   **Expected output:** Updated `price` per variant, `userErrors` array; collect all errors across batches

## GraphQL Operations

```graphql
# products:query — written for api_version 2025-01; we changed the page sizes and added variant pageInfo, so check it in a dev store first
query ProductsForPriceAdjustment($first: Int!, $after: String, $query: String) {
  products(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        title
        tags
        variantsCount {
          count
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              price
              compareAtPrice
              sku
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
# product:query — remaining variants for one product (run while hasNextPage is true)
query ProductVariantsPage($id: ID!, $first: Int!, $after: String) {
  product(id: $id) {
    id
    variants(first: $first, after: $after) {
      edges {
        node {
          id
          title
          price
          compareAtPrice
          sku
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

```graphql
# productVariantsBulkUpdate:mutation — validated against api_version 2025-01
mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    productVariants {
      id
      price
      compareAtPrice
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
║  SKILL: bulk-price-adjustment                ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary of key inputs>
          → Result: <count or outcome, e.g., "143 records returned">
```

If `dry_run: true`, prefix every mutation step with `[DRY RUN]` and do not execute it.

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
OUTCOME SUMMARY
  <Metric label>:   <value>
  ...
  Errors:           <count, 0 if none>
  Output:           <filename or "none">
══════════════════════════════════════════════
```

For `format: json`, emit a JSON object with this schema:
```json
{
  "skill": "bulk-price-adjustment",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    {
      "step": 1,
      "operation": "<OperationName>",
      "type": "query|mutation",
      "params_summary": "<string>",
      "result_summary": "<string>",
      "skipped": false
    }
  ],
  "outcome": {
    "<metric_key>": "<value>",
    "errors": 0,
    "output_file": "<filename|null>"
  }
}
```

## Output Format
CSV file `price_changes_<YYYY-MM-DD>.csv` with columns: `product_id`, `variant_id`, `sku`, `title`, `old_price`, `new_price`. For dry_run, the CSV is still generated but no mutations are executed.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Sale discount and price change review](https://useaiblocks.com/skills/discount-and-price-change-checker).
- The [Online store pricing planner](https://useaiblocks.com/skills/price-position-planner). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `Neither collection_id nor tag provided` | Both parameters are empty | Provide one of `collection_id` or `tag` |
| `userErrors` in mutation response | Invalid price, variant not found | Log error per variant, continue with remaining variants, report in outcome |
| `Product not found in collection` | collection_id is wrong or collection is empty | Verify collection GID in Shopify admin |
| Rate limit (429) or `THROTTLED` | Too many requests in rapid succession | Reduce batch size; retry with exponential backoff. On retry, send the same `new_price` values from the approved preview. Never recompute from the current price, or a variant that was already updated would be changed twice. |

## Best Practices
1. The first run is always a dry run (`dry_run: true` is the default). Review the full CSV and give a clear yes before a live run. There is no bulk undo.
2. Set `min_price` to your cost floor to prevent pricing variants below cost during percentage discounts.
3. The skill pages through both products and each product's variants (step 2), so the CSV covers every variant. Before any live run, check the CSV row count matches the sum of `variantsCount` across the products. If it does not, stop and fetch the missing pages.
4. Use `adjustment_type: percent` with a negative value for sales (e.g., `-15` for 15% off). Use `adjustment_type: fixed` for flat adjustments (e.g., `-5` to drop every variant by $5).
5. After committing, verify a sample of prices in the Shopify admin before announcing a sale — `userErrors` are logged but do not halt execution.
