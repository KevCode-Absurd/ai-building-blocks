---
name: shopify-admin-traffic-by-page-report
role: conversion-optimization
description: "Report sessions and conversion rate for every product and collection page using Shopify's analytics API — surfaces which pages earn eyeballs and which convert them. Bounce rate is not available from this query."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - shopifyqlQuery:query
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
Queries Shopify's built-in analytics engine (ShopifyQL) to surface session-level traffic data scoped to product and collection pages. Shows which pages are attracting the most traffic, and how many sessions convert to orders — ready input for SEO prioritisation, merchandising focus, and A/B test targeting. Read-only — no mutations are executed.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- API scopes: `read_reports`
- Shopify plan: the store's plan must include Shopify's analytics reports, and session data is not on every plan. If the query is refused for access reasons, tell the user their plan may not include it and stop. Do not guess the numbers.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Not used: this skill only reads data, so there is nothing to preview. Kept for compatibility |
| days_back | integer | no | 30 | Lookback window in days (e.g., `30` = last 30 days) |
| page_type | string | no | both | Filter to: `products`, `collections`, or `both` |
| top_n | integer | no | 25 | Number of pages to show in the ranked output |
| sort_by | string | no | sessions | Ranking metric: `sessions` or `conversion_rate` (bounce rate is not available from this query) |

## Workflow Steps

1. **OPERATION:** `shopifyqlQuery` — query (all landing pages)
   **Inputs:** ShopifyQL string `FROM sessions SHOW sessions, conversion_rate GROUP BY landing_page_path SINCE -<days_back>d UNTIL today ORDER BY sessions DESC LIMIT 250`; `sessions` and `conversion_rate` are the confirmed available metrics for this data source
   **Expected output:** All landing pages with session counts and conversion rates; if the result count equals 250, try paginating with `OFFSET`. If Shopify does not accept `OFFSET`, say that the report shows only the top 250 pages and ask the person to narrow `days_back` instead

> **Query plan, stated once:** one query fetches up to 250 landing pages (try `OFFSET` for more; if it is refused, narrow `days_back` and say the list is capped at 250). Everything after that is done in memory, and only the top `top_n` rows (25 by default) are shown. The CSV file is written to the folder the AI runs from.

2. **In-memory filtering:** Filter rows where `landing_page_path` starts with `/products/` (product pages) or `/collections/` (collection pages); apply `page_type` parameter; sort by `sort_by`; truncate to `top_n`; flag pages with sessions above median and `conversion_rate < 0.02` as `high_traffic_low_conversion`

> **Note:** ShopifyQL does not support `LIKE`, `WHERE` string prefix filters, or aggregate aliases that shadow reserved column names (`sessions`, `conversion_rate`). All page-type filtering must be done in-memory after fetching all rows.

## GraphQL Operations

```graphql
# shopifyqlQuery:query (page traffic) — validated against api_version 2025-01
query TrafficByPage($query: String!) {
  shopifyqlQuery(query: $query) {
    parseErrors
    tableData {
      columns {
        name
        dataType
        displayName
      }
      rows
    }
  }
}
```

The `$query` variable (single call — all landing pages, filtered in-memory):
```
FROM sessions
SHOW sessions, conversion_rate
GROUP BY landing_page_path
SINCE -<days_back>d
UNTIL today
ORDER BY sessions DESC
LIMIT 250
```

Then filter rows in-memory:
- Product pages: `landing_page_path.startsWith('/products/')`
- Collection pages: `landing_page_path.startsWith('/collections/')`
- `conversion_rate` is returned as a decimal (e.g. `0.016` = 1.6%) — multiply by 100 for display

> **Confirmed live against 2025-01:** `sessions` (INTEGER) and `conversion_rate` (PERCENT) are the available metrics. `WHERE … LIKE`, `bounce_rate`, `converted_sessions`, and aggregate aliases that shadow reserved names are not supported in ShopifyQL `FROM sessions`.

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: traffic-by-page-report               ║
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
  Lookback window:      <days_back> days
  Page type:            <products|collections|both>
  Pages analysed:       <n>
  Top session page:     <path> (<n> sessions)
  Top converting page:  <path> (<pct>%)
  Errors:               0
  Output:               traffic_by_page_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "traffic-by-page-report",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "TrafficByPage", "type": "query", "params_summary": "all landing pages, last <days_back> days, up to 250 rows", "result_summary": "<n> landing pages returned", "skipped": false },
    { "step": 2, "operation": "FilterAndRank", "type": "in-memory", "params_summary": "page_type, sort_by, top_n", "result_summary": "<n> product pages and <n> collection pages kept", "skipped": false }
  ],
  "outcome": {
    "days_back": 30,
    "page_type": "both",
    "pages_analysed": 0,
    "results": [],
    "errors": 0,
    "output_file": "traffic_by_page_<date>.csv"
  }
}
```

## Output Format
CSV file `traffic_by_page_<YYYY-MM-DD>.csv` with one row per page:

| Column | Description |
|--------|-------------|
| `page_type` | `product` or `collection` |
| `page_path` | URL path (e.g., `/products/red-sneaker`) |
| `sessions` | Total sessions landing on this page |
| `conversion_rate_pct` | Conversion rate as a percentage (API returns decimal; multiplied by 100) |
| `optimisation_flag` | `high_traffic_low_conversion` if sessions > median and conversion_rate < 2% |

For `format: human`, a ranked table is printed inline truncated to `top_n`, followed by a short list of optimisation candidates flagged with `high_traffic_low_conversion`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Landing page conversion reviewer](https://useaiblocks.com/skills/landing-page-auditor).
- **Write the landing page** with the [Conversion landing page designer](https://useaiblocks.com/skills/conversion-landing-page-designer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `parseErrors` non-empty | Invalid ShopifyQL syntax — each error is a plain string | Log each string, surface to user; common causes: aliasing a reserved column name (`sessions`, `conversion_rate`), using `LIKE`, or referencing a non-existent column like `converted_sessions` or `bounce_rate` |
| `tableData` is null | No analytics data for the period | Extend `days_back`; confirm the store has traffic |
| `ACCESS_DENIED` / `read_reports` scope missing | Scope not granted at auth time | Re-authenticate adding `read_reports` scope |
| `THROTTLED` | Analytics query rate limit | Wait 2 s, retry up to 3 times |
| No product/collection rows after filtering | Dev/test store or no direct landing traffic to catalog pages | Widen `days_back`; note that most traffic may enter via homepage |

## Best Practices
1. A `conversion_rate_pct` below 1% on a high-traffic product page is worth investigating — check whether the product is out of stock, has poor images, or lacks a clear call-to-action.
2. Collection pages with many sessions but a low conversion rate often signal a poor match between the ad or search term that drove the session and the collection content — review the collection SEO title. For bounce rate, use another analytics tool: this query cannot return it.
3. Use `page_type: products` after a new product launch to track early traction without noise from collection traffic.
4. Combine with `top-product-performance` to correlate high-converting pages with the products generating the most actual revenue.
5. Re-run the report weekly after making on-page changes (copy, imagery, pricing) to measure the impact — the 7-day window (`days_back: 7`) isolates post-change behaviour cleanly.
