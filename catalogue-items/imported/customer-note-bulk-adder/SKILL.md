---
name: shopify-admin-customer-note-bulk-annotator
role: customer-ops
description: "Adds internal notes to customer records in bulk — useful for post-campaign flags, import annotations, or support context."
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
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose
Queries customers matching a filter (tag, email list, or spend threshold) and appends a note to each customer record. Internal notes are visible to staff in Shopify Admin but not to customers. Used for post-campaign annotation, import source tracking, VIP flags, or support context.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers,write_customers`
- If that command is not found, your Shopify CLI version may use a different sign-in command. Run `shopify --help` or check the Shopify CLI docs, and use the sign-in flow that gives these scopes.
- API scopes: `read_customers`, `write_customers`
- Customer names and emails are protected customer data. If the query is refused or the email comes back empty, the app or token may need protected customer data access in Shopify's app settings. Ask the store owner to approve it. Do not work around it.
- Run your first live pass on a development or test store, or on a filter that matches a handful of customers.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| filter | string | yes | — | Customer filter query (e.g., `tag:vip`, `total_spent:>=500`) |
| note | string | yes | — | Note text to append to matching customers |
| append | bool | no | true | Append to existing note (true) or replace entirely (false) |
| dry_run | bool | no | true | Preview matching customers without executing mutations |
| format | string | no | human | Output format: `human` or `json` |

If you just ran the customer tag bulk updater, give its report. The tag it set can be the filter, and its customer rows are the list that gets the note.

## Safety

> ⚠️ If `append: false`, this overwrites the existing customer note entirely. Existing notes will be lost. Default is `append: true` which safely appends with a timestamp prefix. Run with `dry_run: true` to confirm the customer list before committing.

## Workflow Steps

1. **OPERATION:** `customers` — query
   **Inputs:** `query: <filter>`, `first: 250`, select `id`, `displayName`, `note`, pagination cursor
   **Expected output:** Matching customers with existing notes; paginate until `hasNextPage: false`

2. Construct new note: if `append: true`, put `[YYYY-MM-DD] <note>` at the top of the existing note, with the old note below it (newline-separated); if `append: false`, replace with `<note>`

3. **Dry-run gate:** if `dry_run: true`, do not call `customerUpdate`. For each matching customer, log the planned new note with the `[DRY RUN]` prefix, show the list to the user, and stop. Only go on to the mutation when `dry_run: false` and the user has seen the list.

   **OPERATION:** `customerUpdate` — mutation
   **Inputs:** `id: <customer_id>`, `note: <new_note>`
   **Expected output:** `customer { id, note }`, `userErrors`

## GraphQL Operations

```graphql
# customers:query — validated against api_version 2025-01
query CustomersByFilter($query: String!, $after: String) {
  customers(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        displayName
        defaultEmailAddress {
          emailAddress
        }
        note
        tags
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
mutation CustomerUpdateNote($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      displayName
      note
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
║  SKILL: Customer Note Bulk Annotator         ║
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
  Customers matched:   <n>
  Notes updated:       <n>
  Errors:              <n>
  Output:              annotation_log_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "customer-note-bulk-annotator",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "dry_run": true,
  "filter": "<query>",
  "note": "<text>",
  "append": true,
  "outcome": {
    "matched": 0,
    "updated": 0,
    "errors": 0,
    "output_file": "annotation_log_<date>.csv"
  }
}
```

## Output Format
CSV file `annotation_log_<YYYY-MM-DD>.csv` with columns:
`customer_id`, `name`, `email`, `previous_note`, `new_note`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on customerUpdate | Invalid input or read-only customer | Log error, skip customer, continue |
| No customers match filter | Filter too narrow | Exit with 0 matches |

## Best Practices
- Always use `append: true` unless you explicitly intend to overwrite existing notes — staff notes may contain important history.
- Include a datestamp in the `note` text itself (e.g., `"2026-04-11: Campaign X participant"`) so notes remain interpretable months later.
- Use `dry_run: true` to confirm the customer count before annotating — a broad filter can match thousands of customers unexpectedly.
- For import-source tracking, annotate immediately after the import run to maintain a clear audit trail.
