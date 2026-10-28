---
name: shopify-admin-product-affinity-cross-sell
role: order-intelligence
description: "Mine order history to find which products are most frequently bought together, then rank pairs by support, confidence, and lift to power bundles and cross-sell recommendations."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
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
Applies market basket analysis to your order history to surface product pairs that customers naturally buy together. For every co-purchased pair it calculates **support** (how often the pair appears), **confidence** (given product A, how likely is B?), and **lift** (how much more likely than chance). The output is actionable input for product bundles, "frequently bought together" widgets, cross-sell email flows, and homepage recommendations. Read-only — no mutations are executed.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`
- API scopes: `read_orders`, `read_products` (validator-confirmed: line item `product` field traverses the product graph)

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Not used by this skill, which only reads data and changes nothing. Ignore it. |
| date_range_start | string | yes | — | Start date in ISO 8601 (e.g., `2025-01-01`) |
| date_range_end | string | yes | — | End date in ISO 8601 (e.g., `2025-03-31`) |
| min_support | integer | no | 5 | Minimum number of orders a pair must co-appear in to be included |
| min_confidence | float | no | 0.1 | Minimum P(B\|A) threshold (0–1) |
| min_lift | float | no | 1.0 | Only include pairs where lift > this value (> 1 means non-random) |
| top_n | integer | no | 20 | Number of top pairs to show in the ranked output |
| sort_by | string | no | lift | Ranking metric: `lift`, `confidence`, or `support` |
| exclude_tags | string | no | — | Comma-separated product tags to exclude (e.g., `gift-wrap,donation`) |

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `first: 250`, `query: "created_at:>='<date_range_start>' created_at:<='<date_range_end>'"`, pagination cursor; select `lineItems` with `product { id, title }`, `quantity` and the line items' `pageInfo`
   **Expected output:** All orders in range, including single-item orders; paginate until `hasNextPage: false`. For any order whose `lineItems.pageInfo.hasNextPage` is true, fetch the rest of its line items with the `OrderLineItemsPage` query below before you count it, so no order is cut short.

2. **Build the counts (keep every order):**
   - `total_orders` = every order in range, single-item orders included.
   - Product frequency map (`product_id → order_count`): count each distinct product once per order, across **all** orders, single-item ones included. Do not drop single-item orders here: they are part of how often A and B sell, and dropping them inflates confidence and lift.
   - Pair frequency map (`(product_a_id, product_b_id) → co_occurrence_count`): only orders with 2 or more distinct products can add a pair. For each, enumerate every unique unordered pair once.

3. **In-memory analysis:**
   - Compute metrics for each pair that meets `min_support`:
     - **Support** = `pair_count / total_orders`
     - **Confidence A→B** = `pair_count / count(orders containing A)`
     - **Confidence B→A** = `pair_count / count(orders containing B)`
     - **Lift** = `support / (P(A) × P(B))`, where `P(A) = count(orders containing A) / total_orders`. This is the same as `pair_count × total_orders / (count_A × count_B)`.
   - Worked check with round numbers: say 1,000 orders, A is in 100, B in 50, both in 20. Support = 0.02, confidence A→B = 20%, confidence B→A = 40%, lift = 20 × 1,000 / (100 × 50) = 4.
   - Filter by `min_confidence` and `min_lift`; sort by `sort_by`; truncate to `top_n`
   - If the user asks to study multi-item baskets only, use multi-item orders for **every** count (total, A, B and pairs) and label the report "multi-item orders only". Never mix the two bases.

## GraphQL Operations

```graphql
# orders:query (basket analysis, all orders kept) — validated against api_version 2025-01
query OrdersForAffinityAnalysis($first: Int!, $after: String, $query: String) {
  orders(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        createdAt
        lineItems(first: 50) { # if hasNextPage is true, fetch the rest with OrderLineItemsPage
          edges {
            node {
              quantity
              product {
                id
                title
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
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Rest of one order's line items, page by page, until hasNextPage is false
query OrderLineItemsPage($id: ID!, $after: String) {
  order(id: $id) {
    lineItems(first: 50, after: $after) {
      edges {
        node {
          quantity
          product {
            id
            title
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
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: product-affinity-cross-sell          ║
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
OUTCOME SUMMARY
  Orders analysed:      <n>
  Unique products:      <n>
  Pairs evaluated:      <n>
  Pairs above threshold:<n>
  Basis:                all orders (or: multi-item orders only)
  Orders with extra line-item pages fetched: <n>
  Orders skipped (over 20 distinct products): <n>
  Date range:           <start> to <end>
  Sort by:              <lift|confidence|support>
  Errors:               0
  Output:               product_affinity_<date>.csv
══════════════════════════════════════════════
```

Followed by an inline ranked table of the top `top_n` pairs:

| Rank | Product A | Product B | Support | Conf A→B | Conf B→A | Lift |
|------|-----------|-----------|---------|----------|----------|------|
| 1 | ... | ... | ... | ...% | ...% | ... |

For `format: json`, emit:
```json
{
  "skill": "product-affinity-cross-sell",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "OrdersForAffinityAnalysis", "type": "query", "params_summary": "<date_range_start> to <date_range_end>", "result_summary": "<n> orders (all kept), <n> multi-item baskets", "skipped": false }
  ],
  "outcome": {
    "orders_analysed": 0,
    "unique_products": 0,
    "pairs_evaluated": 0,
    "pairs_above_threshold": 0,
    "basis": "all_orders",
    "orders_with_extra_line_item_pages": 0,
    "orders_skipped_over_20_products": 0,
    "date_range_start": "<date_range_start>",
    "date_range_end": "<date_range_end>",
    "sort_by": "lift",
    "results": [],
    "errors": 0,
    "output_file": "product_affinity_<date>.csv"
  }
}
```

## Output Format
CSV file `product_affinity_<YYYY-MM-DD>.csv` with one row per qualifying pair:

| Column | Description |
|--------|-------------|
| `rank` | Position in sorted output |
| `product_a_id` | Shopify product GID for the first item |
| `product_a_title` | Product A name |
| `product_b_id` | Shopify product GID for the second item |
| `product_b_title` | Product B name |
| `co_occurrence_count` | Number of orders containing both products |
| `support` | `co_occurrence_count / total_orders` |
| `confidence_a_to_b` | P(B\|A) — likelihood of B given A is in cart |
| `confidence_b_to_a` | P(A\|B) — likelihood of A given B is in cart |
| `lift` | How much more likely than random co-occurrence |
| `recommendation_type` | `bundle_candidate` if lift > 2, else `cross_sell` |

## Next steps
After the ranked table, tell the user: take `bundle_candidate` rows to product bundle setup, and `cross_sell` rows to post-purchase email flows or "frequently bought together" widgets.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product pack and quantity discount planner](https://useaiblocks.com/skills/bundle-and-quantity-break-builder).
- The [Bundle stock checker](https://useaiblocks.com/skills/bundle-stock-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit from paginating large order history | Wait 2 s, retry up to 3 times; narrow date range if persistent |
| `product` is null on line item | Product was deleted after purchase | Skip that item from pair analysis; count the order in the total |
| Zero pairs above threshold | Store has few multi-item orders or thresholds too strict | Lower `min_support` to 2 and `min_confidence` to 0.05, or widen date range |
| Combinatorial explosion | Stores with very large line item counts per order | Read every line item (page with `OrderLineItemsPage`). To cap O(n²) growth, the pair loop may skip pairs from any order with more than 20 distinct products, but that order still counts in `total_orders` and in each product's count. Report how many orders were skipped this way in the outcome summary |
| `MAX_COST_EXCEEDED` | The query asks for too many orders and line items in one call | Shopify rejects any single query that could cost more than 1,000 points, and the cost grows with orders per page × line items per order. Lower both, for example `orders(first: 20)` with `lineItems(first: 20)`, check `extensions.cost` in the response, and keep paginating; `OrderLineItemsPage` picks up the rest of each order |

## Best Practices
1. Use at least 90 days of order history — short windows produce noisy lift scores because the probability denominators are small.
2. **Lift > 2** is a strong bundle signal: customers are buying these products together at least twice as often as chance would predict.
3. **Confidence A→B > 30%** makes for a reliable "frequently bought with" widget: three in ten shoppers who buy A also buy B.
4. Filter out accessories and add-ons (like gift wrap or donation SKUs) with `exclude_tags` before ranking — they inflate support scores without being meaningful cross-sell pairs.
5. Use the `recommendation_type` column to split your output: `bundle_candidate` pairs are best for pre-built bundles or volume discounts; `cross_sell` pairs are better suited to cart upsells and post-purchase email recommendations.
6. Re-run quarterly — seasonal products enter and exit the top pairs list, and ignoring that produces stale recommendations.
