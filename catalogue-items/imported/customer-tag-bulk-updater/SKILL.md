---
name: shopify-admin-bulk-customer-tag-update
role: customer-support
description: "Adds and/or removes tags across a filtered set of customers — supports query-based selection, explicit ID lists, and union/replace tag modes."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - customers:query
  - customerUpdate:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose
Applies bulk tag changes (add, remove, or both) to customers selected by a query filter (e.g., `total_spent:>=500`, `tag:newsletter`) or by an explicit list of customer GIDs. Tags are how Shopify segments customers for discounts, marketing, and support workflows; this skill makes batch changes safe, dry-runnable, and auditable. Use when migrating from one tag taxonomy to another, when retiring a campaign-specific tag, or when applying a new segment tag identified by an analytics report.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers,write_customers`
- If that sign-in command is not found, check the Shopify CLI docs for the current one that gives these scopes.
- API scopes: `read_customers`, `write_customers`
- Customer names and emails are protected customer data. If the query is refused or emails come back empty, ask the store owner to approve protected customer data access in Shopify's app settings.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | true | Preview matching customers and the planned tag changes without executing mutations |
| filter | string | conditional | — | Customer query filter (e.g., `tag:newsletter`, `total_spent:>=500`); required if `customer_ids` is omitted |
| customer_ids | array | conditional | — | Explicit list of customer GIDs; required if `filter` is omitted |
| add_tags | array | no | [] | Tags to add (union with existing tags) |
| remove_tags | array | no | [] | Tags to remove (set difference) |
| mode | string | no | merge | Tag write mode: `merge` (apply add/remove to existing) or `replace` (overwrite tags entirely with `add_tags` only) |
| max_customers | integer | no | 1000 | Run-size cap; abort if filter matches more than this |

## Safety

> ⚠️ Step 2 executes one `customerUpdate` mutation per customer in the matched set. Tag changes are immediate and visible to staff and to any apps reading customer tags (loyalty, marketing automation, segmentation). `mode: replace` overwrites existing tags entirely — manually-applied operational tags will be lost. The default is `dry_run: true` and `mode: merge`. Always run dry-run first, review the matched count, and confirm `add_tags`/`remove_tags` are spelled correctly — Shopify tags are case-sensitive.

## Workflow Steps

1. **OPERATION:** `customers` — query
   **Inputs:** When `filter` is set: `query: <filter>`, `first: 250`, pagination cursor. When `customer_ids` is set: batch query with `query: "id:<id1> OR id:<id2> ..."` (chunk into batches of 25 IDs). Select `id`, `displayName`, `defaultEmailAddress { emailAddress }`, `tags`.
   **Expected output:** Customer list with current tags. Abort if `match_count > max_customers`.

2. For each matched customer, compute the target tag set:
   - If `mode: merge`: `target = (existing ∪ add_tags) \ remove_tags`
   - If `mode: replace`: `target = add_tags` (remove_tags ignored)
   Skip the customer if `target == existing` (no-op).

   **Approval gate:** Show the preview (match count and a sample of before and after tag sets). Then stop and wait for the user to say yes in chat. Do not run any `customerUpdate` until they do, and do not treat `dry_run: false` in the request as that yes without showing the preview first.

3. **OPERATION:** `customerUpdate` — mutation
   **Inputs:** For each customer with a non-empty diff: `input: { id: <customer_id>, tags: <target_tag_array> }`
   **Expected output:** `customer.id`, `customer.tags`, `userErrors`; collect failures

## GraphQL Operations

```graphql
# customers:query — validated against api_version 2025-01
query CustomersForBulkTagging($query: String!, $after: String) {
  customers(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        displayName
        firstName
        lastName
        defaultEmailAddress {
          emailAddress
        }
        tags
        numberOfOrders
        amountSpent {
          amount
          currencyCode
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
# customerUpdate:mutation — validated against api_version 2025-01
mutation CustomerTagsUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      displayName
      tags
    }
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
║  SKILL: Bulk Customer Tag Update             ║
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
BULK TAG UPDATE OUTCOME
  Filter:           <filter or "<n> explicit IDs">
  Mode:             <merge|replace>
  Add tags:         <list>
  Remove tags:      <list>
  Customers matched: <n>
  Customers updated: <n>  (or "skipped — dry_run")
  No-op (already in state): <n>
  Errors:           <n>
  Output:           bulk_tag_update_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "bulk-customer-tag-update",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": true,
  "mode": "merge",
  "outcome": {
    "matched": 0,
    "updated": 0,
    "noop": 0,
    "errors": 0,
    "add_tags": [],
    "remove_tags": [],
    "output_file": "bulk_tag_update_<date>.csv"
  }
}
```

## Output Format
CSV file `bulk_tag_update_<YYYY-MM-DD>.csv` with columns:
`customer_id`, `name`, `email`, `previous_tags`, `tags_added`, `tags_removed`, `new_tags`, `status`

The `status` column reports `updated`, `noop`, or `error: <message>`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer RFM segment builder](https://useaiblocks.com/skills/customer-segment-builder).
- The [Customer spend tier tagger](https://useaiblocks.com/skills/customer-spend-tier-tagger).
- The [Customer bulk note updater](https://useaiblocks.com/skills/customer-note-bulk-adder). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on customerUpdate | Invalid input or read-only customer | Log error, skip customer, continue |
| `match_count > max_customers` | Filter is too broad | Refine filter or raise `max_customers` deliberately |
| Both `filter` and `customer_ids` empty | No selection | Abort with parameter error |
| Tag is empty string | Whitespace-only entry | Strip and skip empty values |
| Case-mismatched remove_tag | Tags are case-sensitive | Re-run with exact casing |

## Best Practices
- Always run with `dry_run: true` first — review the matched count and a sample of `previous_tags` → `new_tags` diffs before committing.
- Prefer `mode: merge` (the default) for almost all use cases — `mode: replace` is appropriate only when fully resetting a customer's tag taxonomy and you have an audited backup of prior tags.
- Tags are case-sensitive: `VIP` and `vip` are distinct in Shopify. Standardize casing in your taxonomy.
- For ongoing operational segments, prefer date-stamped tag names (e.g., `cohort-2026-Q2`) so historical cohorts remain identifiable as new tags accumulate.
- Pair with `customer-spend-tier-tagger` or `customer-segment-builder` to feed segment tags from analytics outputs into the customer record.
- To undo a `merge` run, run it again with the added tags removed and the removed tags added back. A `replace` run can only be undone from the `previous_tags` column of the CSV, so keep that file.
- Use `remove_tags` as the cleanup pass after a campaign — leaving stale campaign tags clutters segmentation in marketing tools.
- When `customer_ids` is supplied directly (e.g., from another skill's CSV), the run is fully deterministic — no filter ambiguity.
