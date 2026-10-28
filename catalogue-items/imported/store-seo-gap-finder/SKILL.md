---
name: shopify-admin-seo-metadata-audit
role: merchandising
description: "Read-only: scans products, collections, and pages for missing SEO titles or meta descriptions."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - collections:query
  - pages:query
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
Scans all active products, collections, and pages and flags records with missing or short SEO titles (`seo.title`) and meta descriptions (`seo.description`). Produces a list of SEO gaps grouped by type (products, then collections, then pages). It does not read sales or traffic data, so it cannot rank by traffic; the user can sort the CSV by product sales themselves. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,read_content`
- API scopes: `read_products`, `read_content`
- API versions: the products and collections queries use 2025-01. The pages query uses 2025-04. Run each query with its own version.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| min_title_length | integer | no | 10 | Flag SEO titles shorter than this (characters) |
| min_description_length | integer | no | 50 | Flag meta descriptions shorter than this (characters) |
| scope | string | no | all | What to scan: `products`, `collections`, `pages`, or `all` |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `products` — query (if `scope` includes products)
   **Inputs:** `query: "status:active"`, `first: 250`, select `seo { title, description }`, pagination cursor
   **Expected output:** All active products with SEO fields; paginate until `hasNextPage: false`

2. **OPERATION:** `collections` — query (if `scope` includes collections)
   **Inputs:** `first: 250`, select `seo { title, description }`, pagination cursor
   **Expected output:** All collections with SEO fields

3. **OPERATION:** `pages` — query (if `scope` includes pages)
   **Inputs:** `first: 250`, select the metafields `global.title_tag` and `global.description_tag` (pages read their search text from metafields, not the `seo` field, and use API version 2025-04), pagination cursor
   **Expected output:** All pages with SEO fields. A blank value means no custom search text is set; Shopify may then use the page title, so report it as "check" rather than a sure gap

4. Flag records: missing title, missing description, title < `min_title_length`, description < `min_description_length`

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query ProductSEO($after: String) {
  products(first: 250, after: $after, query: "status:active") {
    edges {
      node {
        id
        title
        handle
        seo {
          title
          description
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
# collections:query — validated against api_version 2025-01
query CollectionSEO($after: String) {
  collections(first: 250, after: $after) {
    edges {
      node {
        id
        title
        handle
        seo {
          title
          description
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
# pages:query — validated against api_version 2025-04
query PageSEO($after: String) {
  pages(first: 250, after: $after) {
    edges {
      node {
        id
        title
        handle
        seoTitle: metafield(namespace: "global", key: "title_tag") { value }
        seoDescription: metafield(namespace: "global", key: "description_tag") { value }
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
║  SKILL: SEO Metadata Audit                   ║
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
SEO METADATA AUDIT
  Products scanned:     <n>  |  Missing SEO: <n>
  Collections scanned:  <n>  |  Missing SEO: <n>
  Pages scanned:        <n>  |  Missing SEO: <n>

  Top gaps (products):
    "<title>" — missing: description
    "<title>" — title too short (<n> chars)
  Output: seo_audit_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "seo-metadata-audit",
  "store": "<domain>",
  "summary": {
    "products": { "scanned": 0, "missing_title": 0, "missing_description": 0, "short_title": 0, "short_description": 0 },
    "collections": { "scanned": 0, "missing_title": 0, "missing_description": 0 },
    "pages": { "scanned": 0, "missing_title": 0, "missing_description": 0 }
  },
  "output_file": "seo_audit_<date>.csv"
}
```

## Output Format
CSV file `seo_audit_<YYYY-MM-DD>.csv` with columns:
`type`, `id`, `title`, `handle`, `seo_title`, `seo_description`, `issue`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [On-page SEO tuner](https://useaiblocks.com/skills/on-page-seo-tuner). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| Empty store | No products/collections/pages | Exit with summary: 0 records |

## Best Practices
- Fix missing meta descriptions on your best-selling products first. This skill does not read sales data, so sort the CSV by sales yourself. Descriptions appear in search result snippets and affect click-through rate.
- A good SEO title length is 50–60 characters; meta descriptions should be 120–160 characters. Adjust `min_title_length` and `min_description_length` to match these targets.
- Run monthly as part of a catalog hygiene routine, especially after bulk product imports which often omit SEO fields.
- After fixing gaps, pair with `product-data-completeness-score` for a comprehensive catalog quality view.
