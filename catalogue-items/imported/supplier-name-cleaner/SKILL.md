---
name: shopify-admin-vendor-consolidation
role: merchandising
description: "Read-only: detects vendor field typos, casing variants, and trailing-whitespace duplicates across the catalog and proposes a canonical merge per cluster."
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
Walks every product in the catalog, normalizes the `vendor` field, and clusters near-duplicates such as `Acme`, `ACME`, `Acme Inc`, and `Acme  ` (trailing whitespace). Surfaces a recommended canonical form per cluster and the count of products that would migrate. Vendor sprawl breaks vendor-based reports, navigation, and supplier reconciliation. Read-only — no mutations; output is the worklist for a follow-up consolidation. The `shopify-admin-execution` label in the toolkit line is not used by this skill: it makes no writes at all.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products`
- API scopes: `read_products`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| similarity_threshold | float | no | 0.88 | Levenshtein-ratio threshold for clustering (0.0–1.0) |
| min_cluster_size | integer | no | 2 | Only emit clusters with at least this many distinct vendor strings |
| ignore_suffixes | string | no | "Inc,LLC,Ltd,Co,Corp" | Comma-separated company suffixes stripped before comparison |
| status_filter | string | no | ALL | Product status to include: `ACTIVE`, `DRAFT`, `ARCHIVED`, or `ALL` |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time. The skill produces a recommendation worklist; consolidation must be applied through a separate, reviewed workflow.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `first: 250`, `query: <built from status_filter>`, select `vendor`, `id`, `title`, `status`, pagination cursor
   **Expected output:** Every product with its vendor string; paginate until `hasNextPage: false`

2. Build a frequency map of distinct vendor strings → product count. Normalize each vendor with: trim whitespace, collapse multiple spaces, strip configured suffixes, lowercase for comparison.

3. Cluster vendor strings whose normalized form has a Levenshtein ratio above `similarity_threshold`. Pick canonical per cluster as the most-used variant; tie-break on shortest, then alphabetical.

4. Filter clusters with fewer than `min_cluster_size` distinct strings. Compute migration impact: number of products that would move to the canonical form.

5. Sort clusters by migration impact descending so the highest-leverage merges surface first.

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query AllVendors($query: String, $after: String) {
  products(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        title
        vendor
        status
        productType
        updatedAt
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
║  SKILL: Vendor Consolidation                 ║
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
VENDOR CONSOLIDATION REPORT
  Products scanned:        <n>
  Distinct vendors:        <n>
  Clusters detected:       <n>
  Products to migrate:     <n>

  Top clusters by impact:
    Canonical: "<name>"  Variants: <n>  Products: <n>
      "<variant 1>"  (<count>)
      "<variant 2>"  (<count>)
  Output: vendor_consolidation_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "vendor-consolidation",
  "store": "<domain>",
  "products_scanned": 0,
  "distinct_vendors": 0,
  "clusters": [
    {
      "canonical": "Acme",
      "variants": [
        { "value": "Acme", "products": 0 },
        { "value": "ACME", "products": 0 },
        { "value": "Acme Inc", "products": 0 }
      ],
      "products_to_migrate": 0
    }
  ],
  "output_file": "vendor_consolidation_<date>.csv"
}
```

## Output Format
CSV file `vendor_consolidation_<YYYY-MM-DD>.csv` with columns:
`cluster_id`, `canonical_vendor`, `variant_vendor`, `is_canonical`, `product_count`, `sample_product_id`, `sample_product_title`, `status`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Empty `vendor` field on product | Vendor never set | Bucket as cluster `(unset)`, surface count separately |
| Two valid distinct vendors collide on similarity | False positive (e.g., `Apple` vs `Appel`) | Lower `similarity_threshold` is unsafe; review cluster manually before applying |
| Unicode-different but visually identical vendors | Smart-quote or non-breaking space | Normalization step strips these before comparison |

## Best Practices
- Start with the default `similarity_threshold: 0.88`. Below 0.85, false positives multiply quickly.
- Manually review every cluster before applying — `ABC Corp` and `ABC Co.` may or may not be the same supplier in your books.
- Use `ignore_suffixes` to absorb legal-entity noise (`Inc`, `LLC`) which rarely changes the actual vendor identity.
- After review, drive consolidation via a separate update workflow (for example, an internal product-update script) and re-run this audit until clusters drop below `min_cluster_size`.
- Pair with `product-data-completeness-score` to track vendor-field cleanliness over time alongside other catalog quality metrics.
