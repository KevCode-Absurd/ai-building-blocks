---
name: shopify-admin-duplicate-sku-barcode-detector
role: merchandising
description: "Read-only: finds duplicate SKUs or barcodes across all product variants."
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
Scans all product variants and identifies duplicate SKUs or barcodes — two or more variants sharing the same identifier. Duplicate SKUs cause inventory sync failures, incorrect order routing, and accounting mismatches. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products`
- API scopes: `read_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| check_skus | bool | no | true | Check for duplicate SKUs |
| check_barcodes | bool | no | true | Check for duplicate barcodes |
| include_blank | bool | no | false | Flag variants with blank/null SKU |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `productVariants` — query
   **Inputs:** `first: 250`, select `sku`, `barcode`, `product { title }`, pagination cursor
   **Expected output:** All variants with SKU and barcode values; paginate until `hasNextPage: false`

2. Build in-memory map of `sku → [variants]` and `barcode → [variants]`

3. Report all keys with more than one variant (duplicates)

4. If `include_blank`: additionally flag variants where `sku` is null or empty string

## GraphQL Operations

```graphql
# productVariants:query — validated against api_version 2025-01
query VariantIdentifiers($after: String) {
  productVariants(first: 250, after: $after) {
    edges {
      node {
        id
        sku
        barcode
        title
        product {
          id
          title
          handle
          status
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
║  SKILL: Duplicate SKU/Barcode Detector       ║
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
DUPLICATE SKU / BARCODE REPORT
  Variants scanned:      <n>
  Duplicate SKUs found:  <n> groups
  Duplicate barcodes:    <n> groups
  Blank SKUs:            <n>

  Duplicate SKU groups:
    SKU "ABC-123"  — used by 2 variants:
      Product A / Blue / L
      Product B / Navy / XL
  Output: duplicates_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "duplicate-sku-barcode-detector",
  "store": "<domain>",
  "variants_scanned": 0,
  "duplicate_sku_groups": 0,
  "duplicate_barcode_groups": 0,
  "blank_skus": 0,
  "output_file": "duplicates_<date>.csv"
}
```

## Output Format
CSV file `duplicates_<YYYY-MM-DD>.csv` with columns:
`issue_type`, `duplicate_value`, `variant_id`, `product_title`, `variant_title`, `sku`, `barcode`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product data gaps and catalogue review](https://useaiblocks.com/skills/monthly-catalogue-clean-up-keeper).
- The [Shopify stock sync error finder](https://useaiblocks.com/skills/stock-sync-error-finder).
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No duplicates found | Clean catalog | Exit with ✅ no issues found |

## Best Practices
- Run this skill after every bulk product import — imports are the most common source of duplicate SKUs.
- A shared SKU across products is only valid if you intentionally use the same SKU for reprints or variants — most cases are data errors.
- Blank SKUs are not duplicates but can cause problems with 3PLs and fulfillment systems that require a SKU for every variant — use `include_blank: true` to surface them.
- After identifying duplicates, use the Shopify Admin UI or the `productVariantsBulkUpdate` mutation to correct SKU values.
