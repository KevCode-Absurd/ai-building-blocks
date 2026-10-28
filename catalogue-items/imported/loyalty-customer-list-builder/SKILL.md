---
name: shopify-admin-loyalty-segment-export
role: marketing
description: "Identify high-LTV customers by order count and lifetime spend, tag them, and export a loyalty-ready contact list."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - customers:query
  - tagsAdd:mutation
  - tagsRemove:mutation
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
Segments your highest-value customers by order count and total lifetime spend, tags them in Shopify, and exports a list ready for loyalty program enrollment or VIP campaign targeting. This skill handles the data layer; managing rewards points or sending loyalty emails requires an external tool.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`
- API scopes: `read_customers`, `write_customers`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain |
| format | string | no | human | `human` or `json` |
| dry_run | bool | no | true | Preview without tagging. Set it to false only after the user has seen the preview and says to tag for real |
| min_orders | integer | no | 3 | Minimum lifetime order count |
| min_spend | float | no | 200 | Minimum lifetime spend (store currency) |
| tag | string | no | loyalty-vip | Tag applied to qualifying customers |

## Workflow Steps

0. **CHECK (required before a live run):** confirm every customer field name in the query below against Shopify's Admin API docs for the API version the store uses (see the AI Blocks note under GraphQL Operations). Fix any renamed field before step 2 runs live.

1. **OPERATION:** `customers` — query
   **Inputs:** filter `orders_count:>=(min_orders)`, `total_spent:>=(min_spend)`, `-tag:(tag)` (so customers who already have the tag are skipped), `first: 250`, pagination
   **Expected output:** List with `id`, `defaultEmailAddress { emailAddress }`, `firstName`, `lastName`, `ordersCount`, `totalSpentV2`; paginate until `hasNextPage: false`

2. **OPERATION:** `tagsAdd` — mutation
   **Inputs:** Customer `id`, tag from `tag` parameter. Write the CSV (see Output Format) from step 1's results first, before any `tagsAdd` call, so the user can review the exact list. Then run this once for every customer id step 1 returned, so tell the user how many records it will change before a live run
   **Expected output:** Confirmation per customer; collect `userErrors`

3. **OPERATION (undo, only if asked):** `tagsRemove` — mutation
   **Inputs:** Customer `id` values from the CSV and the same tag. Use this only when the user says the wrong customers were tagged, and show the count before running it
   **Expected output:** Confirmation per customer; collect `userErrors`

## GraphQL Operations

```graphql
# customers:query — written for api_version 2025-01; check it against Shopify's docs for your version
query LoyaltyCustomers($first: Int!, $after: String, $query: String) {
  customers(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        defaultEmailAddress {
          emailAddress
        }
        firstName
        lastName
        ordersCount
        totalSpentV2 {
          amount
          currencyCode
        }
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
# tagsAdd:mutation — written for api_version 2025-01; check it against Shopify's docs for your version
mutation TagsAdd($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    node { id }
    userErrors { field message }
  }
}
```

```graphql
# tagsRemove:mutation — added by AI Blocks for undoing a wrong tag; check it against Shopify's docs for your version
mutation TagsRemove($id: ID!, $tags: [String!]!) {
  tagsRemove(id: $id, tags: $tags) {
    node { id }
    userErrors { field message }
  }
}
```

> Note from AI Blocks: before a live run, check every field name above against the current Shopify Admin API docs for your API version. Newer versions rename some customer fields (for example `numberOfOrders` and `amountSpent` in place of `ordersCount` and `totalSpentV2`), and an old name can fail or return wrong totals.

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Loyalty Segment Export               ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary>
          → Result: <count or outcome>
```

If `dry_run: true`, prefix mutation steps with `[DRY RUN]` and do not execute.

**On completion**, for `format: human`:
```
══════════════════════════════════════════════
OUTCOME SUMMARY
  VIP customers found:  <n>
  Customers tagged:     <n>
  Errors:               <n>
  Output:               loyalty_segment_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit the standard JSON schema with `outcome` keys: `vip_customers_found`, `customers_tagged`, `errors`, `output_file`.

## Output Format
CSV `loyalty_segment_<YYYY-MM-DD>.csv` with columns:
`customer_id`, `email`, `first_name`, `last_name`, `orders_count`, `total_spent`, `currency`, `tag_applied`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer churn risk scorer](https://useaiblocks.com/skills/customer-churn-risk-scorer). It takes the customer list.
- The [3PL bill auditor](https://useaiblocks.com/skills/3pl-bill-auditor). It takes the customer list.
- The [Repeat order bottleneck finder](https://useaiblocks.com/skills/repeat-order-bottleneck-finder). It takes the customer list.
- The [Top-customer outreach planner](https://useaiblocks.com/skills/top-customer-touch-planner). It takes the customer list.
- The [Loyalty and VIP program designer](https://useaiblocks.com/skills/loyalty-and-vip-program-designer). It takes the customer list.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | Rate limit | Wait 2s, retry up to 3 times |
| `userErrors` on tagsAdd | Invalid customer ID | Log, skip, continue |

## Best Practices
- The export holds customer names and emails. Tell the user to store and share it under their own privacy rules and customer consent terms.
- The list reflects your customers on the day you run it. Running it later adds new customers who now qualify, but it never removes the tag from people who no longer do. To refresh the list, remove the old tag first or use a new tag name.
- The query in step 1 already skips customers who have the tag. Remove that filter only if the user wants to re-export people already tagged.
- Export and review the customer list before tagging if you're unsure about the threshold values — use `dry_run: true` to see the count, then adjust `min_orders` and `min_spend` before committing.
- Combine with `customer-win-back`: tag high-LTV lapsed customers with both `loyalty-vip` and a win-back tag to identify your highest-priority re-engagement targets.
