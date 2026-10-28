---
name: shopify-admin-duplicate-customer-finder
role: customer-ops
description: "Read-only: finds likely duplicate customer records by matching email, phone, or name combinations."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - customers:query
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
Scans the customer database for likely duplicate records using email, phone, and name matching. Duplicate customer records cause split order history, incorrect LTV calculations, and incorrect marketing segmentation. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers`
- API scopes: `read_customers`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| match_on | string | no | email | Match strategy: `email`, `phone`, `name`, or `all` |
| min_orders | integer | no | 0 | Only flag duplicates where at least one record has this many orders |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time. Duplicate merging is not supported by the Shopify Admin API — flagged duplicates must be merged manually in Shopify Admin.

## Workflow Steps

1. **OPERATION:** `customers` — query
   **Inputs:** `first: 250`, select `email`, `phone`, `firstName`, `lastName`, `numberOfOrders`, `totalSpentV2`, pagination cursor
   **Expected output:** All customers with contact and order data; paginate until `hasNextPage: false`

2. Build in-memory lookup maps:
   - `email → [customer_ids]`
   - `phone → [customer_ids]` (if `match_on` includes phone)
   - `"firstName lastName" → [customer_ids]` (if `match_on` includes name)

3. Report groups with > 1 customer per key as likely duplicates

## GraphQL Operations

```graphql
# customers:query — validated against api_version 2025-01
query CustomersForDeduplication($after: String) {
  customers(first: 250, after: $after) {
    edges {
      node {
        id
        displayName
        firstName
        lastName
        defaultEmailAddress {
          emailAddress
        }
        phone
        numberOfOrders
        amountSpent {
          amount
          currencyCode
        }
        createdAt
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
║  SKILL: Duplicate Customer Finder            ║
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
DUPLICATE CUSTOMER REPORT
  Customers scanned:       <n>
  Duplicate groups found:  <n>
  Customers affected:      <n>

  Duplicate groups (sample):
    Email: user@example.com
      Customer A — <n> orders, $<n> spent, created <date>
      Customer B — <n> orders, $<n> spent, created <date>
  Output: duplicate_customers_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "duplicate-customer-finder",
  "store": "<domain>",
  "customers_scanned": 0,
  "duplicate_groups": 0,
  "customers_affected": 0,
  "output_file": "duplicate_customers_<date>.csv"
}
```

## Output Format
CSV file `duplicate_customers_<YYYY-MM-DD>.csv` with columns:
`duplicate_group_id`, `match_key`, `match_type`, `customer_id`, `name`, `email`, `phone`, `number_of_orders`, `total_spent`, `created_at`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Stock count updater](https://useaiblocks.com/skills/stock-count-updater). It takes the audit report.
- The [Product field bulk editor](https://useaiblocks.com/skills/product-field-bulk-editor). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No duplicates found | Clean customer database | Exit with ✅ no duplicates found |

## Best Practices
- Shopify does not provide a native merge API — flagged duplicates must be resolved manually in Shopify Admin (Customers → Merge).
- `match_on: email` finds the most reliable duplicates; `match_on: name` produces more false positives (common names).
- Prioritize duplicates where at least one record has orders — these affect LTV and marketing segmentation most.
- Common causes of duplicates: guest checkout followed by account creation, manual customer imports, or customers using multiple email addresses.
