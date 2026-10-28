---
name: shopify-admin-metafield-bulk-update
role: merchandising
description: "Bulk set or delete metafields on products, variants, or customers filtered by tag or collection."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - products:query
  - metafieldsSet:mutation
  - metafieldsDelete:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

**Makes it better (optional):**
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose
Queries products (or variants, or customers) matching a filter and bulk-sets or bulk-deletes metafield values. Used for structured data updates like material composition, care instructions, product specifications, or custom attributes that power storefront features.

If you have an audit report from an earlier step, such as a list of unused or missing fields, use it to choose the filter, namespace and key.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_products,write_products`
- API scopes: `read_products`, `write_products`
- Metafield namespace and key must already exist or be created on first set

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| resource_type | string | no | product | Resource to update: `product`, `variant`, or `customer` |
| filter | string | yes | — | Filter query (e.g., `tag:summer-2026`, `vendor:Nike`) |
| namespace | string | yes | — | Metafield namespace (e.g., `custom`) |
| key | string | yes | — | Metafield key (e.g., `material`) |
| value | string | no | — | Value to set. If omitted and `action: delete`, metafield is deleted |
| value_type | string | no | single_line_text_field | Metafield type (e.g., `single_line_text_field`, `boolean`, `number_integer`) |
| action | string | no | set | `set` or `delete` |
| dry_run | bool | no | true | Preview without executing mutations |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ⚠️ `metafieldsSet` overwrites existing metafield values — there is no merge. `metafieldsDelete` permanently removes the metafield value from the resource. Run with `dry_run: true` to confirm the affected product list and verify namespace/key are correct before committing.

## Scope

The workflow steps below query and update products only. The `resource_type` values `variant` and `customer` are listed, but no query steps are given for them. Use products unless the user supplies the matching queries, and test on one record first.

## Undo

Every run saves a CSV with the `old_value` of each field. To undo a `set`, re-run `metafieldsSet` with the `old_value` from the CSV for each row. For rows that had no old value, run `metafieldsDelete` on the field. To undo a `delete`, re-run `metafieldsSet` with the `old_value`. Keep the CSV until the storefront has been checked. Always test on a small set first.

## Workflow Steps

1. **OPERATION:** `products` — query
   **Inputs:** `query: <filter>`, `first: 250`, select metafield values for the target namespace/key, pagination cursor
   **Expected output:** Products with existing metafield values (for reference); paginate until `hasNextPage: false`

2. **OPERATION:** `metafieldsSet` — mutation (if `action: set`)
   **Inputs:** Array of `{ ownerId, namespace, key, value, type }` objects
   **Expected output:** `metafields { id, key, value }`, `userErrors`

3. **OPERATION:** `metafieldsDelete` — mutation (if `action: delete`)
   **Inputs:** Array of `{ ownerId, namespace, key }` objects
   **Expected output:** `deletedMetafields { ownerId }`, `userErrors`

## GraphQL Operations

```graphql
# products:query — validated against api_version 2025-01
query ProductsWithMetafield($query: String!, $namespace: String!, $key: String!, $after: String) {
  products(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        title
        metafield(namespace: $namespace, key: $key) {
          id
          value
          type
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
# metafieldsSet:mutation — validated against api_version 2025-01
mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      id
      namespace
      key
      value
      type
      owner {
        ... on Product {
          id
          title
        }
      }
    }
    userErrors {
      field
      message
      code
    }
  }
}
```

```graphql
# metafieldsDelete:mutation — validated against api_version 2025-01
mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
  metafieldsDelete(metafields: $metafields) {
    deletedMetafields {
      ownerId
      namespace
      key
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
║  SKILL: Metafield Bulk Update                ║
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
  Resources matched:      <n>
  Metafields set/deleted: <n>
  Errors:                 <n>
  Output:                 metafield_update_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "metafield-bulk-update",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": true,
  "namespace": "<ns>",
  "key": "<key>",
  "action": "set",
  "outcome": {
    "matched": 0,
    "updated": 0,
    "errors": 0,
    "output_file": "metafield_update_<date>.csv"
  }
}
```

## Output Format
CSV file `metafield_update_<YYYY-MM-DD>.csv` with columns:
`resource_type`, `resource_id`, `title`, `namespace`, `key`, `old_value`, `new_value`, `action`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer tag bulk updater](https://useaiblocks.com/skills/customer-tag-bulk-updater). It takes the spreadsheet.
- The [Shopify tracking number fixer](https://useaiblocks.com/skills/tracking-number-fixer). It takes the spreadsheet.
- The [Order hold manager](https://useaiblocks.com/skills/order-hold-manager). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` — invalid type | `value` doesn't match `value_type` | Log error, skip resource, continue |
| `userErrors` — namespace/key not found on delete | Metafield doesn't exist | Log as skipped (already absent) |
| No products match filter | Filter too narrow | Exit with 0 matches |

## Best Practices
- `metafieldsSet` is batched — the mutation accepts up to 25 metafields per call. The skill automatically batches large product sets.
- Always verify the `namespace` and `key` match your store's metafield definitions — typos create orphaned metafields that don't connect to any theme feature.
- For storefront-powered metafields (e.g., displayed in product templates), confirm the theme reads the correct namespace/key before running at scale.
- Use `dry_run: true` to preview exactly which products and current values will be affected before overwriting.
