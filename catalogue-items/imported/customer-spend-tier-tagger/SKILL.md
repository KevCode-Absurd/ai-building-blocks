---
name: shopify-admin-customer-spend-tier-tagger
role: customer-ops
description: "Calculates lifetime spend per customer and applies tier tags (Bronze/Silver/Gold/Platinum) based on configurable thresholds. Previews first. Removes an old tier tag only when it differs from the new one."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - customers:query
  - tagsAdd:mutation
  - tagsRemove:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

## Purpose
Reads every customer's lifetime spend from Shopify and gives each one a spend-tier tag (Bronze, Silver, Gold or Platinum by default). Use the tags for VIP offers, support priority and email lists without a loyalty app. This skill changes live customer records, so it previews first.

## Prerequisites
- An AI tool that can run commands (the Shopify CLI runs on the person's machine).
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_customers,write_customers`
- API scopes: `read_customers`, `write_customers`
- Written against Admin API version `2025-01`. Check field names against Shopify's current docs before a first real run.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | none | Store domain (e.g., mystore.myshopify.com) |
| tiers | object | no | see below | Spend thresholds per tier (in store currency) |
| tag_prefix | string | no | tier | Tag prefix (e.g., `tier:bronze`, `tier:silver`) |
| remove_old_tiers | bool | no | true | Remove a customer's old tier tag when it differs from the new tier |
| dry_run | bool | no | true | Preview without executing mutations |
| format | string | no | human | Output format: `human` or `json` |

Default tiers (store currency). They are a starting point, not a rule. Ask the person to set limits that fit their own store:
```
bronze:   0 to 249
silver:   250 to 999
gold:     1,000 to 4,999
platinum: 5,000 and above
```

## Safety

> `tagsAdd` and `tagsRemove` change tags on customer records. Staff see them and marketing segments or Shopify Flow automations may act on them. Before applying, ask the person if any automation, email flow or discount rule uses tags that start with the prefix. Run with `dry_run: true` first. Do not apply until the person has read the tier counts and said go ahead.

Only touch tags that start with `<tag_prefix>:` and name a tier in this skill's list. Never remove any other tag.

## Workflow Steps

1. **Ask once** for the store, tier limits (or accept the defaults), the tag prefix, and whether customers with no orders should be tagged or skipped. If the person gives no answer, skip customers with no orders and say so.
2. **OPERATION:** `customers` query
   **Inputs:** `first: 250`, select `id`, `amountSpent`, `numberOfOrders`, `tags`, pagination cursor
   **Expected output:** all customers with lifetime spend. Page until `hasNextPage` is false.
3. **Assign a tier** to each customer from `amountSpent.amount` and the limits. If a customer's currency differs from the store currency, do not tier them. List them for the person.
4. **Preview.** Show the count and percent in each tier, how many customers need a tag added, how many have an old tier tag to remove, and ten sample rows (name, spend, old tags, new tag). Stop here when `dry_run` is true and wait for a go-ahead.
5. **OPERATION:** `tagsRemove` mutation, only when `remove_old_tiers` is true and the customer holds a tier tag that is not the new one. Remove just that tag.
6. **OPERATION:** `tagsAdd` mutation for each customer whose new tier tag is not already on them.
7. **Report** the summary below. If anything failed, list the customers so they can be fixed by hand.

To check one customer's spend, open that customer in the Shopify admin and compare the total spent with the figure used. `amountSpent` is Shopify's own total. Tell the person it may differ from a total they work out from orders if they handle refunds in a different way.

## GraphQL Operations

```graphql
# customers:query (written for api_version 2025-01; check current docs)
query CustomerSpendLevels($after: String) {
  customers(first: 250, after: $after) {
    edges {
      node {
        id
        displayName
        defaultEmailAddress {
          emailAddress
        }
        amountSpent {
          amount
          currencyCode
        }
        numberOfOrders
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
# tagsRemove:mutation (written for api_version 2025-01; check current docs)
mutation TagsRemove($id: ID!, $tags: [String!]!) {
  tagsRemove(id: $id, tags: $tags) {
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

```graphql
# tagsAdd:mutation (written for api_version 2025-01; check current docs)
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

## Progress lines

Print one plain line per step:

```
[N/TOTAL] <QUERY|MUTATION> <OperationName> | params: <short summary> | result: <count or outcome>
```

If `dry_run` is true, prefix every mutation step with `[DRY RUN]` and do not run it.

## Output Format

For `format: human` (default), end with:

```
OUTCOME SUMMARY
  Customers read:        <n>
  Bronze:    <n>  (<pct>%)
  Silver:    <n>  (<pct>%)
  Gold:      <n>  (<pct>%)
  Platinum:  <n>  (<pct>%)
  Skipped (no orders or other currency): <n>
  Old tier tags removed: <n>
  Tags added:            <n>
  Errors:                <n>
```

Then give a CSV, as text in the chat, or as `tier_tagging_<YYYY-MM-DD>.csv` if you can write files. Columns:
`customer_id`, `name`, `email`, `lifetime_spend`, `currency`, `tier`, `previous_tags`, `new_tags`

For `format: json`, give the same counts and rows as JSON.

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `userErrors` on tagsAdd or tagsRemove | Invalid customer ID | Log the error, skip that customer, continue |
| No customers | Empty store | Stop with 0 results |

## Best Practices
- Run it again each month so tiers follow spend. Run the preview first each time.
- Keep `remove_old_tiers` on so each customer holds one tier tag.
- Set limits from your own spread of customer spend. Look at the preview counts. If one tier holds almost everyone, move the limits.
- After tagging, build Shopify customer segments from the tags to target each tier in email.
- Use the VIP customer finder if you only want a ranked list of top spenders and no tags written.
