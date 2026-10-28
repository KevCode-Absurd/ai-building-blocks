---
name: shopify-admin-product-data-completeness-score
role: merchandising
description: "Read-only: scores each product on data completeness across description, images, SEO, weight, barcode, cost, and metafields."
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
Calculates a data completeness score (0–100) for each active product based on the presence of key fields: description, images, SEO title, SEO description, variant weight, barcode, cost, and specified metafields. Produces a ranked list of products needing the most data work. Read-only — no mutations. Catalog health report in a single pass.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products`
- API scopes: `read_products`, plus `read_inventory` for the cost check (the query reads `unitCost`). Without `read_inventory`, skip the cost check, mark the `has_cost` column `not checked`, and score the other fields out of the points left.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| status_filter | string | no | active | Product status to score: `active`, `draft`, or `all` |
| required_metafields | array | no | [] | List of `namespace.key` metafields that are required (e.g., `["custom.material"]`) |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Scoring Rubric

| Field | Points |
|-------|--------|
| Description present (non-empty) | 15 |
| At least 1 image | 15 |
| SEO title present | 10 |
| SEO description present | 10 |
| At least 1 variant with barcode | 10 |
| At least 1 variant with cost | 10 |
| At least 1 variant with weight | 10 |
| All required metafields present | 20 (split evenly) |
| **Total** | **100** |

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `query: "status:<status_filter>"`, `first: 250`, select all completeness fields, pagination cursor
   **Expected output:** Products with all scored fields; paginate until `hasNextPage: false`

2. Score each product per rubric; rank ascending by score. Barcode, cost and weight each count for the product if at least one of its variants has a non-empty value, as the rubric says. In the CSV, `has_barcode`, `has_cost` and `has_weight` are true when any variant has the value, false otherwise. Only the first 10 variants are fetched, so for a product with more, say the variant checks were partial. For `missing_metafields`, compare each `namespace.key` in `required_metafields` with the `namespace` and `key` pairs returned in `metafields`, and list the ones that are absent or empty. If a required metafield is not among the first 20 returned, say it could not be checked.

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query ProductCompleteness($query: String!, $after: String) {
  products(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        title
        handle
        descriptionHtml
        images(first: 1) {
          edges {
            node {
              id
            }
          }
        }
        seo {
          title
          description
        }
        variants(first: 10) {
          edges {
            node {
              id
              barcode
              weight
              inventoryItem {
                unitCost {
                  amount
                }
              }
            }
          }
        }
        metafields(first: 20) {
          edges {
            node {
              namespace
              key
              value
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
║  SKILL: Product Data Completeness Score      ║
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
PRODUCT DATA COMPLETENESS REPORT
  Products scored:  <n>
  Avg score:        <pct>/100
  Score < 50:       <n> products (need urgent attention)
  Score 50–79:      <n> products
  Score ≥ 80:       <n> products

  Lowest scoring products:
    "<title>"  Score: <n>/100  Missing: description, SEO title
  Output: completeness_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "product-data-completeness-score",
  "store": "<domain>",
  "products_scored": 0,
  "avg_score": 0,
  "below_50_count": 0,
  "output_file": "completeness_<date>.csv"
}
```

## Output Format
CSV file `completeness_<YYYY-MM-DD>.csv` with columns:
`product_id`, `title`, `score`, `has_description`, `image_count`, `has_seo_title`, `has_seo_description`, `has_barcode`, `has_cost`, `has_weight`, `missing_metafields`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product data gaps and catalogue review](https://useaiblocks.com/skills/monthly-catalogue-clean-up-keeper).
- The [Product sales channel availability checker](https://useaiblocks.com/skills/sales-channel-gap-finder).
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No products match filter | Empty catalog or wrong filter | Exit with 0 results |

## Best Practices
- Use this skill as a pre-launch gate — run before activating DRAFT products to ensure all required fields are filled.
- Tune `required_metafields` to your store's specific needs (e.g., `custom.material` for apparel, `custom.ingredients` for food).
- A score below 50 typically means a product is missing foundational content (description or images) and should be deprioritized from launch until fixed.
- Run monthly to track catalog quality trends over time; improvements after a content sprint should be visible in the average score.
