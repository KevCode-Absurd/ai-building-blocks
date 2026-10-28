---
name: shopify-admin-agentic-product-taxonomy
role: agentic
description: "Assign every product a Shopify Standard Product Taxonomy category so AI agents can map a shopper's intent to the right category and surface the store's products."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - taxonomy:query
  - productUpdate:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
audit_signals:
  - category-taxonomy-api
  - catalog-intent-alignment
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

**Tools that do this best:**
- **Claude Code:** Can run the Shopify CLI and keep your approval step between reading and writing.
<!-- /needs -->

## When not to use (added by AI Blocks)

- You want to rewrite product titles or descriptions. Use the Product title cleaner or the Product description enricher.
- Your categories were set by hand and each one was chosen on purpose. Review a few by eye first; run this only on products with no category.
- Your products are very niche or one of a kind, and no standard category fits. It will put them on a "needs review" list rather than guess.
- You do not use Shopify. The category list and the live updates are built for Shopify only.

## Before you run it (added by AI Blocks)

Ask once for anything missing. Never guess.

1. The store domain, such as mystore.myshopify.com. If it is missing, stop and ask.
2. Which products to check: the whole catalog, one collection or one tag.
3. Whether to review products that already have a category. Default: only products with none (`only_missing: true`).

**No Shopify access.** If the person cannot give an authenticated Shopify CLI session, ask for a product export (CSV) instead. Propose a category for each product from its title, type and tags, label every row "not checked against the live category list", and write nothing to a store.

## Approval rule (added by AI Blocks)

This overrides any default below: `dry_run` is **true** unless the person has said, after seeing the list, to apply it.

1. Run steps 1 to 3 only. Show the proposed table: product, current category, proposed category, confidence.
2. Show the "needs review" list (below the confidence floor) separately. Never write those.
3. Stop. Ask: "Apply these N changes to your live store?" Wait for a clear yes.
4. Only then run step 4, for the approved rows, and report any `userErrors`.

## Output (added by AI Blocks)

Return these parts, in this order:

1. **Proposed categories.** A table with `product, old_category, new_category, confidence`, also saved as a CSV.
2. **Needs review.** Products below the confidence floor, with the closest category you found and why you did not apply it.
3. **Applied changes.** After approval only: how many products were updated, and any errors.

Then give a next step: spot-check five updated products in the Shopify admin, and re-run the AI shopping readiness checker to see whether the category score improved.

## Purpose
AI shopping agents resolve a query ("running shoes", "office chair", "sustainable sneakers") to a taxonomy node, then retrieve products in that node. Products with no Standard Product Taxonomy category are invisible to that mapping — they only surface on exact keyword luck. This skill finds uncategorized (or mis-categorized) products and assigns the correct Shopify standard taxonomy category, inferred from title/type/tags and confirmed against the live taxonomy tree. Fixes `category-taxonomy-api` and lifts `catalog-intent-alignment`.

## Prerequisites
- Authenticated Shopify CLI session (`shopify auth login --store <domain>`)
- Required API scopes: `read_products`, `write_products`

## Parameters
All skills accept these universal parameters:

| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| store     | string | yes      | —       | Store domain (e.g., mystore.myshopify.com) |
| format    | string | no       | human   | Output format: `human` (default) or `json` |
| dry_run   | bool   | no       | true    | Preview mutations without executing. Set to false only after the person approves the proposed list |

Skill-specific parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| collection_id | string | no | — | Limit to a collection GID |
| tag | string | no | — | Limit to a product tag |
| only_missing | bool | no | true | If true, only assign products with no category; if false, also review mismatches |
| confidence_floor | float | no | 0.7 | Skip products whose best taxonomy match scores below this |

## Safety

> ⚠️ Step 4 (`productUpdate`) sets the `category` on live products, which affects storefront facets, marketplaces, and tax. A wrong category mis-files a product everywhere. Run `dry_run: true`, review the proposed `product → category` mapping, and only assign matches above `confidence_floor` that the person has approved; queue the rest for human review.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `first: 250`, optional filter; fields `title`, `productType`, `tags`, `category{ id fullName }`; paginate.
   **Expected output:** Products with their current category (or null).

2. **OPERATION:** `taxonomy` — query
   **Inputs:** search the standard taxonomy tree by candidate terms derived from each product's type/title.
   **Expected output:** Candidate taxonomy category nodes (id + fullName) to match against.

3. **COMPUTE (no API):** score each product against candidate nodes; pick the best ≥ `confidence_floor`. Emit the proposed mapping.

3b. **APPROVAL (no API):** show the proposed mapping and the needs-review list. Stop and wait for the person to approve before any write.

4. **OPERATION:** `productUpdate` — mutation (approved rows only)
   **Inputs:** `{ id, category: <taxonomyCategoryId> }` per confident match.
   **Expected output:** Updated product category; collect `userErrors`.

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query TaxonomyProducts($first: Int!, $after: String, $query: String) {
  products(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        title
        productType
        tags
        category { id fullName }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

```graphql
# taxonomy:query — validated against api_version 2025-01
query TaxonomySearch($search: String) {
  taxonomy {
    categories(first: 20, search: $search) {
      edges { node { id fullName isLeaf level } }
    }
  }
}
```

```graphql
# productUpdate:mutation — validated against api_version 2025-01
mutation TaxonomyAssign($input: ProductInput!) {
  productUpdate(input: $input) {
    product { id category { id fullName } }
    userErrors { field message }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: <skill name>                         ║
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
OUTCOME SUMMARY
  <Metric label>:   <value>
  Errors:           0
  Output:           <filename or "none">
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "<skill-slug>",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    {
      "step": 1,
      "operation": "<OperationName>",
      "type": "query",
      "params_summary": "<string>",
      "result_summary": "<string>",
      "skipped": false
    }
  ],
  "outcome": {
    "metric_key": 0,
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format
`human`: count categorized + a CSV (`product, old_category, new_category, confidence`) and a "needs review" list below the floor. `json`: `{ categorized, needs_review, errors, output_file }`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Shopify AI crawler access editor](https://useaiblocks.com/skills/ai-crawler-access-editor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit | Wait 2s, retry up to 3 times |
| No taxonomy match | Niche/ambiguous product | Add to needs-review list, do not guess |
| `userErrors` on update | Invalid category id | Log, skip, continue |

## Best Practices
- Pick the most specific (leaf) node you're confident in — agents match deeper categories more precisely than top-level ones.
- Keep `only_missing: true` for the first pass; re-categorizing existing assignments is higher-risk and best reviewed.
- Aligning the category with your storefront collections compounds the benefit: agents and on-site filters then agree.
- Re-run `shopify-admin-agentic-readiness-audit` to confirm the Matchable pillar improved.
