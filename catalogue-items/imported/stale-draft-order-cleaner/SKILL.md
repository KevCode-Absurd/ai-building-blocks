---
name: shopify-admin-draft-order-cleanup
role: store-management
description: "Finds stale draft orders older than N days and optionally deletes them to reduce admin clutter."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - draftOrders:query
  - draftOrderDelete:mutation
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
Queries open draft orders older than a configurable age and optionally deletes them. Draft orders accumulate from abandoned B2B quotes, incomplete manual orders, or old integrations and clutter the admin. Stale drafts also inflate pending revenue metrics.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_draft_orders,write_draft_orders`
- API scopes: `read_draft_orders`, `write_draft_orders`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| older_than_days | integer | no | 30 | Delete drafts older than this many days |
| dry_run | bool | no | true | Preview drafts to delete without executing mutation |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ⚠️ `draftOrderDelete` permanently deletes draft orders. Deleted drafts cannot be recovered. Run with `dry_run: true` to review the list before committing. Check that no stale drafts represent active B2B quotes awaiting customer approval before deleting.

## Workflow Steps

1. **OPERATION:** `draftOrders` — query
   **Inputs:** `query: "status:open created_at:<='<NOW - older_than_days days>'"`, `first: 250`, pagination cursor
   **Expected output:** Stale open draft orders; paginate until `hasNextPage: false`

2. **Filter before any delete:** the tag question must be answered before the first dry run. Ask the user which tag marks live B2B quotes (default `b2b-quote`). Remove every draft with that tag from the delete list, and show how many were kept out. Drafts without that tag go in a separate "review by hand" list, not the delete list, because they may be live B2B quotes that were never tagged. Only move a draft to the delete list when the user picks it. The cutoff uses `created_at`, so a draft made long ago but edited recently can still match: show `updatedAt` for every draft in the dry-run list and flag any edited in the last 30 days. The first run is always a dry run. Show the full list and wait for a clear yes. Run the delete step only after that yes.

3. **OPERATION:** `draftOrderDelete` — mutation
   **Inputs:** `id: <draft_order_id>`
   **Expected output:** `deletedId`, `userErrors`

4. Write the CSV `draft_cleanup_<YYYY-MM-DD>.csv` of what was kept out and what was deleted.

## GraphQL Operations

```graphql
# draftOrders:query — validated against api_version 2025-01
query StaleDraftOrders($query: String!, $after: String) {
  draftOrders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        status
        createdAt
        updatedAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
          defaultEmailAddress {
            emailAddress
          }
        }
        tags
        note
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
# draftOrderDelete:mutation — validated against api_version 2025-01
mutation DraftOrderDelete($input: DraftOrderDeleteInput!) {
  draftOrderDelete(input: $input) {
    deletedId
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
║  SKILL: Draft Order Cleanup                  ║
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
  Stale drafts found:   <n>
  Drafts deleted:       <n>
  Total value cleared:  $<amount>
  Errors:               <n>
  Output:               draft_cleanup_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "draft-order-cleanup",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "older_than_days": 30,
  "dry_run": true,
  "outcome": {
    "drafts_found": 0,
    "drafts_deleted": 0,
    "value_cleared": 0,
    "currency": "USD",
    "errors": 0,
    "output_file": "draft_cleanup_<date>.csv"
  }
}
```

## Output Format
CSV file `draft_cleanup_<YYYY-MM-DD>.csv` with columns:
`draft_id`, `draft_name`, `customer_name`, `customer_email`, `created_at`, `total_value`, `currency`, `action`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Purchase order and reorder drafter](https://useaiblocks.com/skills/purchase-order-reorder). It takes the spreadsheet and plan.
- The [Online order fulfillment planner](https://useaiblocks.com/skills/online-order-fulfillment-planner). It takes the spreadsheet.
- The [3PL bill auditor](https://useaiblocks.com/skills/3pl-bill-auditor). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on delete | Draft already completed or cancelled | Log as skipped, continue |
| No stale drafts | All drafts are recent or none exist | Exit with 0 results |

## Best Practices
- Set `older_than_days: 60` or higher for B2B stores where quotes may have longer sales cycles.
- Review the dry-run list for drafts with notes or high value before deleting — these may be legitimate pending quotes.
- For B2B scenarios, consider filtering out drafts tagged with `b2b-quote` or similar before running the delete step.
- Run monthly as a routine admin hygiene task.
