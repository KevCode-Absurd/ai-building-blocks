---
name: shopify-admin-multi-location-inventory-audit
role: merchandising
description: "Audit inventory levels across all active locations, flagging variants where Available quantity is negative or Committed exceeds On Hand — a signal of inventory sync drift."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - locations:query
  - inventoryItems:query
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

**Tools that do this best:**
- **Claude, ChatGPT or Gemini with a Shopify connection:** Lets the AI read your live stock levels with read-only access.
- **Any good chat AI:** Works on an exported inventory file if you have no connection.
<!-- /needs -->

## Purpose
Surfaces inventory sync discrepancies across locations: variants where `available` is negative or `committed` > `on_hand`. These indicate drift between Shopify's counts and actual physical stock. Common causes: 3PL delays posting returns, WMS deductions stacking with Shopify's committed count, or multi-store sync issues. Read-only: no mutations. Replaces manual inventory reconciliation spreadsheets and the need to open each location separately in the Shopify admin.

## When not to use
- Stores that do not track inventory. Every variant is skipped, so the audit returns nothing. Use a physical stock count or your 3PL's own report instead.
- Fixing the counts. This skill only finds problems. It never changes stock.
- A flagged row is a lead, not proof. Negative stock can be normal during a flash sale. Check order volume before you correct anything.

## Inputs (ask once, never guess)
- Store domain, such as `mystore.myshopify.com`. If it is missing, ask for it. Do not invent one.
- Location IDs to check (optional). Default is all active locations.
- Whether to include untracked variants (optional). Default is no.

## Prerequisites
Pick one way to get the numbers.
- **Live connection (best).** `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>` with API scopes `read_products`, `read_inventory`, `read_locations`. Your AI must be able to run the Shopify CLI or call the Admin API.
- **No connection (fallback).** The user exports their inventory from the Shopify admin (Products, then Inventory, then Export) with columns for available, committed and on hand per location, and pastes or uploads it. Run the same two checks on those rows. Say in the report that this ran on an export, with its date.

If neither is available, stop and say what is missing. Do not make up numbers.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| location_ids | array | no | — | Specific location GIDs to audit (default: all active locations) |
| flag_negative_available | bool | no | true | Flag variants where `available < 0` |
| flag_committed_exceeds_onhand | bool | no | true | Flag variants where `committed > on_hand` |
| include_untracked | bool | no | false | Include variants with inventory tracking disabled |

## Workflow Steps

1. **List locations.** Run the `ActiveLocations` query. Keep active locations only. If `location_ids` was given, keep only those.
2. **Read levels per location.** For each location, run the `LocationInventory` query and follow `pageInfo.endCursor` until `hasNextPage` is false. Each level returns `available`, `committed` and `on_hand` in `quantities`.
3. **Skip untracked variants** (`item.tracked` is false) unless `include_untracked` is true.
4. **Flag.** A variant is flagged when `available < 0` (if `flag_negative_available`) or `committed > on_hand` (if `flag_committed_exceeds_onhand`). One variant can carry both flags.
5. **Report.** Print the summary table and the flagged rows, and write the CSV if you can write files.

## GraphQL Operations

```graphql
# ActiveLocations
query ActiveLocations($first: Int!) {
  locations(first: $first, query: "is_active:true") {
    edges { node { id name isActive } }
  }
}
```

```graphql
# LocationInventory (one location at a time; page with $after)
query LocationInventory($id: ID!, $after: String) {
  location(id: $id) {
    id
    name
    inventoryLevels(first: 100, after: $after) {
      edges {
        node {
          id
          quantities(names: ["available", "committed", "on_hand"]) {
            name
            quantity
          }
          item {
            id
            sku
            tracked
            variant {
              id
              displayName
              product { id title }
            }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

If a rate limit error (429) appears, lower the page size to 50 and retry once. If it fails again, say which location did not finish and report on the rest.

## Session Tracking
Start with one line: store, date and time (UTC), and which locations are in scope.
After each step, print one line: step number, what ran, and the count it returned.
Fill the summary only with numbers you counted. If a step failed or you stopped early, say so in the summary and write `not finished` instead of a count.

## Output Format
Inline summary table:

| Location | Variants scanned | Negative available | Committed > on hand |
|----------|------------------|--------------------|---------------------|

Then the flagged rows as a table, and as a CSV file `inventory-audit-<YYYY-MM-DD>.csv` when you can write files. If you cannot write files, print the CSV in a code block.

CSV columns: `location_name`, `product_title`, `variant_title`, `sku`, `available`, `committed`, `on_hand`, `flag`.

End with a short "where to look first" list: the three locations or products with the most flags, and one line on the likely cause for each (for example, "returns not yet posted by the 3PL"). Mark causes as guesses.

For `format: json`, return the same data as one JSON object with `store`, `started_at`, `completed_at`, `locations`, `flagged` (the CSV rows) and `errors`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product data gaps and catalogue review](https://useaiblocks.com/skills/monthly-catalogue-clean-up-keeper).
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Product listing completeness checker](https://useaiblocks.com/skills/listing-completeness-scorer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| No locations returned | No active locations found | Check that at least one active location exists in the Shopify admin |
| `inventoryLevels` empty for a location | Location has no inventory assigned | Expected for fulfillment-only or virtual locations |
| Rate limit (429) | Large inventory + multiple locations | Lower page size to 50, retry once |
| `item.tracked: false` for all variants | Store uses untracked inventory | Say so and stop, or set `include_untracked: true` |
| Missing scopes | Token lacks a read scope | Name the missing scope and stop |

## Best Practices
1. Run this audit monthly, or weekly on a busy store. Drift grows slowly and is easiest to fix early.
2. A negative `available` value is not always a real problem. It can happen during flash sales. Check order volume before you correct anything.
3. After the audit, fix the counts by hand or with your own adjustment process. This skill does not change stock.
4. Run the audit before and after a 3PL returns batch posts to see whether returns are credited.
5. Filter to one `location_id` for a targeted audit (for example, only your main warehouse) on large catalogs.
