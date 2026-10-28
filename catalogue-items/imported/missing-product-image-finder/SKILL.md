---
name: shopify-admin-product-image-audit
role: merchandising
description: "Read-only: flags products and variants with missing images or fewer than a minimum number of images."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
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
Scans products matching `status_filter` (default `active`; `draft` or `all` also available) and their variants for missing or insufficient images. Flags products with zero images, variants with no assigned image, and products below a minimum image count threshold. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products`
- API scopes: `read_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| min_images | integer | no | 1 | Flag products with fewer than this many images. Use 10 or less: only the first 10 images per product are counted, so a higher number would flag products wrongly |
| check_variants | bool | no | true | Also flag variants with no assigned image |
| status_filter | string | no | active | Product status to scan: `active`, `draft`, or `all` |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `query: "status:<status_filter>"`, `first: 250`, select `images`, `variants { image }`, pagination cursor
   **Expected output:** Products with image counts and variant image assignments. Repeat the query with `endCursor` until `hasNextPage` is false. Only the first 10 images and first 50 variants of each product are counted.

2. Flag products: count the `images.edges` returned (the query fetches up to 10). Flag when that count `< min_images` OR `== 0`

3. If `check_variants`: flag variants where `image` is null

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query ProductImageAudit($query: String!, $after: String) {
  products(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        title
        handle
        status
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              sku
              image {
                id
                url
              }
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

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Product Image Audit                  ║
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
PRODUCT IMAGE AUDIT
  Products scanned:           <n>
  Missing all images:         <n>
  Below min (<min_images>):   <n>
  Variants missing image:     <n>

  Products needing images:
    "<title>" — 0 images
    "<title>" — 1 image (below min <n>)
  Output: image_audit_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "product-image-audit",
  "store": "<domain>",
  "min_images": 1,
  "products_scanned": 0,
  "missing_all_images": 0,
  "below_minimum": 0,
  "variants_missing_image": 0,
  "output_file": "image_audit_<date>.csv"
}
```

## Output Format
CSV file `image_audit_<YYYY-MM-DD>.csv` with columns:
`product_id`, `product_title`, `handle`, `image_count`, `issue`, `variant_id`, `variant_sku`, `variant_has_image`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Marketplace photo rule checker](https://useaiblocks.com/skills/marketplace-photo-rule-checker). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No products match filter | Empty catalog or wrong status filter | Exit with 0 results |

## Best Practices
- Some sales channels, such as Google Shopping, may reject products with no images. Check each channel's rules, and fix the zero-image products first.
- For apparel or products with color/size variants, set `min_images: 3` to ensure at least one front, back, and lifestyle shot per product.
- Run after bulk product imports to catch images that failed to upload in the import batch.
- This skill does not give a full catalogue quality report. The `product-data-completeness-score` skill it used to point to is not in this library. To fill other gaps in your product data, use the Product data gap filler.
