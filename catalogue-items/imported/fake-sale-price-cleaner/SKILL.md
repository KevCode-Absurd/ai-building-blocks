---
name: shopify-admin-compare-at-price-cleanup
role: merchandising
description: "Removes stale compareAtPrice values where current price >= compareAtPrice (no real discount) or compareAtPrice has been set for over a configurable age threshold."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - productVariants:query
  - productVariantsBulkUpdate:mutation
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
Identifies variants with a `compareAtPrice` that no longer represents a genuine discount and clears it, so storefront strikethrough pricing reflects real savings rather than legacy noise. Two conditions are flagged: (a) `compareAtPrice <= price` (no discount, often left over from a price increase), and (b) `compareAtPrice` set for longer than `max_age_days` (stale "always on sale" optics that hurt long-term price perception and may matter under local fair-pricing rules; check yours). Defaults to dry-run.

Limit: the "stale" rule is off by default. When it is turned on, it uses the variant's `updatedAt` date as a stand-in for when the compare-at price was set. Any product edit resets that date, so a live sale price can be cleared by mistake. Tell the user this before every run, and to keep `clean_stale` off during sales. Restoring a cleared price is manual: the CSV is the only record, and the user must enter the old value by hand in Shopify admin.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,write_products`
- API scopes: `read_products`, `write_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| dry_run | bool | no | true | Preview the cleanup without executing mutations |
| clean_no_discount | bool | no | true | Clear `compareAtPrice` when `price >= compareAtPrice` |
| clean_stale | bool | no | **false** | Opt-in. Clear `compareAtPrice` set longer than `max_age_days`. Turn it on on purpose, only after you have read the dry-run CSV |
| max_age_days | integer | no | 90 | Age threshold in days for the stale rule (uses variant `updatedAt` as proxy) |
| collection_id | string | no | — | Optional collection GID to scope the cleanup |
| tag_filter | string | no | — | Optional product tag to scope the cleanup |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ⚠️ Step 3 executes `productVariantsBulkUpdate` mutations that overwrite `compareAtPrice` to null. The original strikethrough value is not preserved server-side — record the dry-run CSV before committing if you want a restore path. Always start with `dry_run: true` and review the CSV before running with `dry_run: false`.

## Workflow Steps

1. **OPERATION:** `productVariants` — query
   **Inputs:** `first: 250`, `query: <built from collection_id or tag_filter>`, select `price`, `compareAtPrice`, `updatedAt`, `product { id, title, vendor }`, `sku`, pagination cursor
   **Expected output:** All variants in scope with current pricing; paginate until `hasNextPage: false`

2. Filter to variants that meet either rule, with the grouping written out: `(clean_no_discount AND compareAtPrice != null AND parseFloat(compareAtPrice) <= parseFloat(price)) OR (clean_stale AND compareAtPrice != null AND (now - updatedAt) > max_age_days)`. `clean_stale` is false unless the user turned it on. Group by `product.id` for batched mutation.

3. **OPERATION:** `productVariantsBulkUpdate` — mutation (skipped when `dry_run: true`)
   **Inputs:** Per product, `productId` plus `[{ id: variantId, compareAtPrice: null }]`
   **Expected output:** Updated variants with `compareAtPrice` set to null; collect `userErrors` per batch

4. Write the CSV (always, even on dry run) for audit trail and revert capability.

The filter in step 2 is the only check before a live run in step 3. Do not set `dry_run` to false until the user has reviewed the CSV row by row and said yes.

## GraphQL Operations

```graphql
# productVariants:query — validated against api_version 2025-01
query VariantsForCompareAtCleanup($query: String, $after: String) {
  productVariants(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        sku
        price
        compareAtPrice
        updatedAt
        product {
          id
          title
          vendor
          tags
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
# productVariantsBulkUpdate:mutation — validated against api_version 2025-01
mutation ClearCompareAtPrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
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
║  SKILL: Compare-At Price Cleanup             ║
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
COMPARE-AT PRICE CLEANUP  (<dry-run|live>)
  Variants inspected:      <n>
  No-discount cleared:     <n>
  Stale (>= <days>d):      <n>
  Total cleared:           <n>
  Errors:                  <n>
  Output: compare_at_cleanup_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "compare-at-price-cleanup",
  "store": "<domain>",
  "dry_run": true,
  "variants_inspected": 0,
  "cleared_no_discount": 0,
  "cleared_stale": 0,
  "total_cleared": 0,
  "errors": 0,
  "output_file": "compare_at_cleanup_<date>.csv"
}
```

## Output Format
CSV file `compare_at_cleanup_<YYYY-MM-DD>.csv` with columns:
`variant_id`, `product_id`, `product_title`, `vendor`, `sku`, `price`, `original_compare_at_price`, `rule_matched`, `variant_updated_at`, `mutation_status`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Discount consistency checker](https://useaiblocks.com/prompts/discount-sanity-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `userErrors` in mutation response | Variant locked or in active subscription contract | Log per-variant error, continue with remaining variants |
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `compareAtPrice` already null mid-run | Another process cleared it concurrently | Skip, count as no-op success |
| `updatedAt` newer than expected | Concurrent edit during the audit | Re-query single variant before mutation; skip if rule no longer matches |

## Best Practices
1. Always run with `dry_run: true` first and review the CSV. There is no bulk undo for compareAtPrice clearing.
2. Leave `clean_stale` off (its default is `false`) during long planned promotions — your "stale" sale is actually intentional.
3. Use `collection_id` to scope the cleanup to evergreen products and exclude an active sale collection.
4. After running live, spot-check 5–10 variants in the storefront to confirm strikethrough pricing is gone.
5. Schedule a quarterly run as part of catalog hygiene.
