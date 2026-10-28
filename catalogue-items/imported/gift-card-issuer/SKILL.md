---
name: shopify-admin-gift-card-issuance
role: conversion-optimization
description: "Issue Shopify gift cards (store credit) to customers as a goodwill gesture, post-return incentive, or loyalty reward."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2026-10"
graphql_operations:
  - customer:query
  - giftCardCreate:mutation
  - tagsAdd:mutation
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

**Source check by AI Blocks, 28 Oct 2026:** The [Shopify store auth reference](https://shopify.dev/docs/api/shopify-cli/store/store-auth) requires --store and comma-separated --scopes. Replace REQUIRED_SCOPES with the least permissions for the actual queries and mutations; confirm them in the Admin API reference before signing in. Do not run a command with placeholders. Complete browser sign-in yourself and keep tokens out of chat and logs. This is a documentation check, not a store login or live API test.

**Source check by AI Blocks, 28 Oct 2026:** [Shopify's giftCardCreate payload](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/giftCardCreate) returns the new code as giftCardCode, beside giftCard. The [GiftCard object](https://shopify.dev/docs/api/admin-graphql/2026-10/objects/GiftCard) exposes maskedCode and lastCharacters, not code. Read the issued code from giftCardCreate.giftCardCode. The [tagsAdd reference](https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/tagsAdd) supports a Customer ID with id and tags arguments. No gift card or customer tag was created during this check.

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
Issues Shopify native gift cards to customers programmatically — as goodwill for a delayed shipment, as store credit instead of a cash refund, or as a loyalty reward. Uses Shopify's built-in gift card system; no 3rd-party app required. Gift cards issued here are redeemable at checkout exactly like manual gift cards. Note: gift card availability depends on your Shopify plan and store settings. Whether `giftCardCreate` works on every plan is not verified here. Check that your plan supports gift cards and that they are turned on in settings. If the call fails with a plan or permission error, stop and tell the user.

## Prerequisites
- `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>`
- API scopes: `read_customers`, `write_gift_cards`
- Gift cards must be enabled in Shopify admin → Settings → Gift cards

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| format | string | no | human | Output format: `human` or `json` |
| dry_run | bool | no | true | Preview operations without executing mutations. Set to false only after the user has seen the preview and says to go ahead |
| customer_email | string | yes* | — | Customer email to look up and associate with the gift card |
| customer_id | string | yes* | — | Customer GID (alternative to email) |
| amount | float | yes | — | Gift card value in the store's default currency |
| reason | string | no | — | Internal note logged on the gift card (e.g., `"Goodwill: delayed shipment #1042"`) |
| expires_on | string | no | — | Expiry date in ISO 8601 (e.g., `2026-12-31`); if omitted, gift card does not expire |
| tag_customer | string | no | — | Optional tag to add to the customer record (e.g., `goodwill-issued`) |

*One of `customer_email` or `customer_id` is required.

## Safety

> ⚠️ Step 2 executes `giftCardCreate` which issues real monetary value against your store. Gift cards cannot be deleted once created — they can only be disabled. Run with `dry_run: true` to confirm the customer, amount, and expiry before committing. Verify the amount carefully — issued value is immediately redeemable at checkout.
>
> `dry_run` defaults to true. Always run the preview first, show the user the customer, amount and expiry, and set `dry_run: false` and issue live cards only after the user says to go ahead.

## Workflow Steps

1. **OPERATION:** `customer` — query
   **Inputs:** Look up by `customer_email` with the `customers` query shown below (pass the email as the `$query` search text), or directly by `customer_id`
   **Expected output:** Customer `id`, `firstName`, `lastName`, `email`; confirm customer exists before issuing

2. **OPERATION:** `giftCardCreate` — mutation
   **Inputs:** `input.initialValue`, `input.customerId`, `input.expiresOn` (optional), `input.note` (reason)
   **Expected output:** `giftCard.id`, `giftCard.code`, `giftCard.balance`, `giftCard.expiresOn`, `userErrors`

3. **OPERATION:** `tagsAdd` — mutation (only when `tag_customer` is set)
   **Inputs:** `id` = the customer GID from step 1, `tags` = `[tag_customer]`. Needs write access to customers. In a dry run, list the tag in the preview and do not run this step.
   **Expected output:** `node.id`, `userErrors`. If it fails, say the gift card was still issued but the tag was not added.

## GraphQL Operations

```graphql
# customer:query — field names checked against 2026-10 docs; not run on a store
query CustomerByEmail($query: String!) {
  customers(first: 1, query: $query) {
    edges {
      node {
        id
        firstName
        lastName
        defaultEmailAddress {
          emailAddress
        }
        tags
      }
    }
  }
}
```

```graphql
# giftCardCreate:mutation — response shape checked against 2026-10 docs; not run on a store
mutation GiftCardCreate($input: GiftCardCreateInput!) {
  giftCardCreate(input: $input) {
    giftCard {
      id
      balance {
        amount
        currencyCode
      }
      expiresOn
      note
      customer {
        id
      }
    }
    giftCardCode
    userErrors {
      field
      message
    }
  }
}
```

```graphql
# tagsAdd:mutation — Customer target and arguments checked against 2026-10 docs; not run on a store
mutation TagCustomer($id: ID!, $tags: [String!]!) {
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
║  SKILL: shopify-admin-gift-card-issuance     ║
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
  Customer:        <name> (<email>)
  Gift card code:  <code>
  Amount:          <amount> <currency>
  Expires:         <date or "Does not expire">
  Errors:          0
  Output:          none
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "shopify-admin-gift-card-issuance",
  "store": "<domain>",
  "started_at": "<ISO8601>",
  "completed_at": "<ISO8601>",
  "dry_run": true,
  "steps": [
    { "step": 1, "operation": "CustomerByEmail", "type": "query", "params_summary": "email <email>", "result_summary": "customer <id>", "skipped": false },
    { "step": 2, "operation": "GiftCardCreate", "type": "mutation", "params_summary": "amount <amount>, customer <id>", "result_summary": "gift card <code>", "skipped": false }
  ],
  "outcome": {
    "customer_id": "<id>",
    "customer_email": "<email>",
    "gift_card_id": "<id>",
    "gift_card_code": "<code>",
    "amount": "<amount>",
    "currency": "<currency>",
    "expires_on": "<date or null>",
    "errors": 0,
    "output_file": null
  }
}
```

## Output Format
No CSV. The session summary reports the gift card code and amount inline. The support agent copies the code to share with the customer.

```
Gift card issued:
  Customer:  Jane Smith (jane@example.com)
  Code:      ABCD-EFGH-IJKL-MNOP
  Value:     $25.00 USD
  Expires:   2026-12-31 (or "Does not expire")
  Note:      Goodwill: delayed shipment #1042
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Gift card liability calculator](https://useaiblocks.com/skills/gift-card-liability-calculator).
- The [Shopify loyalty customer list builder](https://useaiblocks.com/skills/loyalty-customer-list-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| Customer not found | Email doesn't match any customer | Verify email; guest checkout customers may not have a customer record |
| `userErrors` from giftCardCreate | Invalid amount (≤ 0) or missing required field | Verify `amount` is a positive number |
| Gift cards not enabled | Store settings don't allow gift cards | Enable in Shopify admin → Settings → Gift cards |
| `write_gift_cards` scope missing | Auth was done without this scope | Re-run `shopify store auth --store <domain> --scopes <REQUIRED_SCOPES>` and approve the `write_gift_cards` scope |

## Best Practices
1. Always run `dry_run: true` to confirm customer lookup succeeds and amount is correct before issuing.
2. Always include a `reason` note — it appears in the gift card record and helps your team audit issuances later.
3. Set `tag_customer: goodwill-issued` to track which customers have received goodwill gift cards — combine with the Loyalty customer list builder (`loyalty-customer-list-builder`) to monitor their subsequent purchase behavior.
4. Use `expires_on` for promotional gift cards (e.g., holiday campaigns) to create urgency; omit for goodwill issuances so the customer feels the gesture is genuine.
5. For batch issuances (e.g., a service outage affecting 100 customers), loop through a customer list using `format: json` to capture each gift card code for your records.
