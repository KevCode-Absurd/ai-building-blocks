---
name: shopify-admin-abandoned-cart-recovery
role: marketing
description: "Query checkouts abandoned in the last N days, generate unique discount codes per customer, and tag them for re-engagement."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2026-10"
graphql_operations:
  - abandonedCheckouts:query
  - discountCodeBasicCreate:mutation
  - discountRedeemCodeBulkAdd:mutation
  - discountRedeemCodeBulkCreation:query
  - tagsAdd:mutation
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
Identifies customers who started checkout but did not complete their purchase, generates a unique discount code for each one, and tags them in Shopify so they can be targeted in follow-up campaigns. This skill handles the Shopify-native data layer (querying, discounts, tagging); sending the actual email requires an external tool.

## Prerequisites
- Authenticated Shopify CLI session: `shopify auth login --store <domain>`
- Use one `api_version` for all five operations: the one in the header above (2026-10). AI Blocks checked every operation below against Shopify's Admin GraphQL docs for 2026-10 on 2026-10-28. If your store or app uses a different version, check each operation's docs page for that version first. Do not mix versions. The GraphQL blocks below are written from the Shopify docs and have not been run against a real store.
- API scopes: `read_orders` (abandoned checkouts; the staff login also needs the manage abandoned checkouts permission), `read_customers`, `write_discounts`, `write_customers`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | false | Preview operations without executing mutations |
| days_back | integer | no | 7 | Lookback window for abandoned checkouts |
| min_cart_value | float | no | 0 | Minimum cart total to include (USD) |
| discount_pct | integer | no | 10 | Discount percentage to create per customer |
| code_prefix | string | no | RECOVER | Prefix for generated discount codes |
| tag | string | no | cart-recovery | Tag applied to eligible customers |

## Safety

> ⚠️ Steps 1b, 2 and 3 execute live changes (a code discount, its redeem codes, customer tags). To undo a run, delete the discount it made in Shopify Admin under Discounts. That removes its codes. The tags stay on the customers until you remove them. Run with `dry_run: true` to verify eligible customer count before committing.

## Workflow Steps

**Run order, in one place:** step 1 (read) → step 1a (filter; a dry run stops here and reports the count) → step 1a-check (read-only query test) → mutation check (below) → confirmation gate → step 1b → step 2 → step 3 → step 4. Nothing is written before the confirmation gate.

**Mutation check before the confirmation gate (AI Blocks note).** Older copies of this skill used `priceRuleCreate` and `discountCodeBulkCreate`. On 2026-10-28 we found neither in Shopify's Admin GraphQL docs, so steps 1b and 2 now use `discountCodeBasicCreate`, `discountRedeemCodeBulkAdd` and the `discountRedeemCodeBulkCreation` query, checked against the 2026-10 docs. Before any write, open the docs page for each of these three on your `api_version` (shopify.dev/docs/api/admin-graphql/<version>/mutations/<name>, or /queries/ for the last one). If any of them is missing, or its arguments differ from the blocks below, stop and tell the user. Do not guess a replacement call on a live store; rewrite the step from the docs together with the user, and run the dry run again first.

**Marketing consent.** The codes are for an email. Only shoppers who agreed to marketing emails should get one. Step 1a keeps only shoppers whose Shopify email marketing state is `SUBSCRIBED`. Still tell the user to check their local rules before they send.

**Confirmation gate before step 1b.** Report the eligible shopper count, how many were left out for no marketing consent, the discount percentage, the prefix and the 30-day expiry. Then stop. Do not run step 1b until the user replies with that count and says yes. Tags stay on customers even after the discount is deleted, so this is the last point where a run is easy to undo.

1. **OPERATION:** `abandonedCheckouts` — query (needs `read_orders` and `read_customers`)
   **Inputs:** `first: 250`, `query: "created_at:>='<NOW - days_back days>'"`, pagination cursor
   **Expected output:** List of checkout objects with `customer.id`, `customer.defaultEmailAddress.emailAddress`, `customer.defaultEmailAddress.marketingState`, `totalPriceSet`, `createdAt`, `lineItems`; paginate until `hasNextPage: false`

1a. **FILTER (no API call):** Drop checkouts with no customer email, any checkout whose total is below `min_cart_value`, and any shopper whose `marketingState` is not `SUBSCRIBED` (count these separately for the confirmation gate). The rest are the eligible customers. If one email has more than one eligible checkout, keep only the most recent, so each shopper gets exactly one code. Make each shopper's code now: `{code_prefix}-{UUID[:8].toUpperCase()}`, unique within the run. In `dry_run`, stop after this step and report the count.

1a-check. **READ-ONLY CHECK (before any live step):** Run the `abandonedCheckouts` query on its own with `first: 5`. Confirm every field name in it works on your `api_version`. If the store rejects a field, fix the query and run this check again. Never start step 1b until this read-only query has run cleanly. The fields were checked against the 2026-10 docs, but the query has not been run on a real store, so this check is the test.

1b. **OPERATION:** `discountCodeBasicCreate` — mutation (live; needs `write_discounts`)
   **Inputs:** One code discount for the whole run, in `basicCodeDiscount`: `title` (for example `Cart recovery <YYYY-MM-DD>`), `code` = the first eligible shopper's code, `startsAt` = now, `endsAt` = now + 30 days, `context: { all: ALL }`, `customerGets: { value: { percentage: <discount_pct / 100> }, items: { all: true } }`, `appliesOncePerCustomer: true`. `percentage` is a fraction from 0 to 1, so 10% is `0.1`. Leave `usageLimit` out: it counts uses of the whole discount, so it would cap all codes together. Keep the returned `codeDiscountNode.id`; step 2 needs it as `discountId`. Before step 2, open Shopify Admin under Discounts and confirm the discount shows the right percentage, the 30-day end date and one use per customer. Do not run step 2 until you have confirmed all three.
   **Expected output:** The new `codeDiscountNode.id`; collect `userErrors`. If it fails, stop. Do not run step 2.

2. **OPERATION:** `discountRedeemCodeBulkAdd` — mutation, then `discountRedeemCodeBulkCreation` — query (needs `write_discounts`)
   **Inputs:** `discountId` from step 1b and `codes: [{ code: "<code>" }, ...]` with the codes of every other eligible shopper (the first one is already on the discount; if there is only one shopper, skip step 2). Shopify takes at most 250 codes per call, so send them in batches of 250 or fewer. The discount, expiry and once-per-customer rule come from the discount made in step 1b.
   **Polling:** The add runs in the background. Keep each returned `bulkCreation.id`. Query `discountRedeemCodeBulkCreation(id:)` every 2 seconds until `done` is `true` (give up after 2 minutes and tell the user). Then read `importedCount`, `failedCount` and the `codes` list; a code that failed has `discountRedeemCode: null` and an `errors` entry.
   **Expected output:** For each batch: `codesCount`, `importedCount`, `failedCount`. Collect `userErrors` and per-code `errors`. A shopper whose code failed gets no tag and no CSV row; log them in the summary.

3. **OPERATION:** `tagsAdd` — mutation (needs `write_customers`)
   **Inputs:** Customer `id` (taken from `customer.id` in the step 1 query) for each shopper whose code was created, tag string from `tag` parameter
   **Expected output:** Updated customer tags; collect `userErrors`

4. **WRITE THE CSV (no API call):** Write `recovery_list_<YYYY-MM-DD>.csv` from the step 1a results and the codes created in steps 1b and 2. Use these columns in this order: `customer_email`, `cart_total`, `abandoned_at`, `discount_code`, `discount_pct`, `tag_applied`. One row per eligible shopper who got a code. Then emit the outcome summary.

## GraphQL Operations

```graphql
# abandonedCheckouts:query — use the api_version from the header
query AbandonedCheckouts($first: Int!, $after: String, $query: String) {
  abandonedCheckouts(first: $first, after: $after, query: $query) {
    edges {
      node {
        id
        customer {
          id
          defaultEmailAddress {
            emailAddress
            marketingState
          }
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        createdAt
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              variant {
                price
              }
            }
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
```

```graphql
# discountCodeBasicCreate:mutation — checked against the 2026-10 docs; needs write_discounts
# Variables (example for discount_pct 10, prefix RECOVER):
# { "basicCodeDiscount": {
#     "title": "Cart recovery <YYYY-MM-DD>",
#     "code": "<first shopper's code>",
#     "startsAt": "<now, ISO 8601>",
#     "endsAt": "<now + 30 days, ISO 8601>",
#     "context": { "all": "ALL" },
#     "customerGets": { "value": { "percentage": 0.1 }, "items": { "all": true } },
#     "appliesOncePerCustomer": true } }
# Leave usageLimit out: it caps the whole discount, not each code.
mutation DiscountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
    codeDiscountNode {
      id
    }
    userErrors {
      field
      code
      message
    }
  }
}
```

```graphql
# discountRedeemCodeBulkAdd:mutation — checked against the 2026-10 docs; needs write_discounts
# At most 250 codes per call. Variables:
# { "discountId": "<codeDiscountNode.id from step 1b>", "codes": [{ "code": "RECOVER-1A2B3C4D" }, ...] }
mutation DiscountRedeemCodeBulkAdd($discountId: ID!, $codes: [DiscountRedeemCodeInput!]!) {
  discountRedeemCodeBulkAdd(discountId: $discountId, codes: $codes) {
    bulkCreation {
      id
      done
      codesCount
      importedCount
      failedCount
    }
    userErrors {
      field
      code
      message
    }
  }
}
```

```graphql
# discountRedeemCodeBulkCreation:query — poll until done is true; checked against the 2026-10 docs
query DiscountRedeemCodeBulkCreation($id: ID!) {
  discountRedeemCodeBulkCreation(id: $id) {
    id
    done
    codesCount
    importedCount
    failedCount
    codes(first: 250) {
      edges {
        node {
          code
          discountRedeemCode {
            code
          }
          errors {
            field
            code
            message
          }
        }
      }
    }
  }
}
```

```graphql
# tagsAdd:mutation — use the api_version from the header
mutation TagsAdd($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    node {
      id
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
║  SKILL: Abandoned Cart Recovery              ║
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
  Checkouts found:     <n>
  Eligible customers:  <n>
  Codes created:       <n>
  Customers tagged:    <n>
  Errors:              <n>
  Output:              recovery_list_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "abandoned-cart-recovery",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": false,
  "steps": [
    { "step": 1, "operation": "AbandonedCheckouts", "type": "query", "params_summary": "last 7 days, cart >= $0", "result_summary": "<n> checkouts", "skipped": false },
    { "step": "1b", "operation": "DiscountCodeBasicCreate", "type": "mutation", "params_summary": "10% off, 30 days, once per customer, first code", "result_summary": "discount created", "skipped": false },
    { "step": 2, "operation": "DiscountRedeemCodeBulkAdd", "type": "mutation", "params_summary": "<n> codes in batches of 250, prefix RECOVER", "result_summary": "<n> imported, <n> failed", "skipped": false },
    { "step": 3, "operation": "TagsAdd", "type": "mutation", "params_summary": "tag: cart-recovery", "result_summary": "<n> customers tagged", "skipped": false }
  ],
  "outcome": {
    "checkouts_found": 0,
    "eligible_customers": 0,
    "codes_created": 0,
    "customers_tagged": 0,
    "errors": 0,
    "output_file": "recovery_list_<date>.csv"
  }
}
```

## Output Format
CSV file `recovery_list_<YYYY-MM-DD>.csv` with columns:
`customer_email`, `cart_total`, `abandoned_at`, `discount_code`, `discount_pct`, `tag_applied`

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Cart bundle and gift planner](https://useaiblocks.com/skills/cart-bundle-and-gift-planner). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on `discountCodeBasicCreate` | Invalid input or duplicate code | Stop. Do not add codes or tags |
| `errors` on a code in `discountRedeemCodeBulkCreation` | Duplicate or invalid code | Log error, skip that customer (no tag, no CSV row), continue |
| `done` still `false` after 2 minutes | Shopify is still adding codes | Stop polling and tell the user; check the discount in Shopify Admin |
| `userErrors` on tagsAdd | Customer ID not found | Log error, skip tag, continue |
| No email on checkout | Guest checkout without email | Skip checkout, do not count as eligible |

## Best Practices
- Run with `dry_run: true` first and confirm eligible customer count. To undo a run, delete its discount in Shopify Admin (Discounts).
- Set `min_cart_value` to focus recovery effort on higher-value carts (e.g., 50 for $50+). Small carts often have lower recovery intent and may not justify a discount.
- Use a unique `tag` per run (e.g., `cart-recovery-2026-04-11`) so you can identify exactly which customers were targeted in each campaign and avoid re-targeting them in subsequent runs.
- The `code_prefix` should be meaningful to operators reviewing discount codes in Shopify Admin (e.g., `CART10` for a 10% cart recovery discount).
- This skill produces the data layer. Use Shopify Email or another email tool to send the generated codes to customers.
