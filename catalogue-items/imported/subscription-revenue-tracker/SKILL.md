---
name: shopify-admin-subscription-mrr-tracker
role: finance
description: "Read-only: for stores with subscription products, calculates MRR, ARR, active subscriber count, and rolling churn rate from subscription contracts."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - subscriptionContracts:query
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
For stores selling subscription products via Shopify's native subscriptions, this skill aggregates active subscription contracts into the standard SaaS-style metrics finance teams care about: monthly recurring revenue (MRR), annualized recurring revenue (ARR), active subscriber count, average revenue per subscriber (ARPU), and a rolling churn rate. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_own_subscription_contracts`
- API scopes: `read_own_subscription_contracts`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| churn_window_days | integer | no | 30 | Rolling window for churn calculation (cancellations / starting subscribers) |
| as_of | string | no | today (UTC) | ISO date for "as of" snapshot label |
| include_paused | bool | no | false | Treat `PAUSED` contracts as active recurring revenue |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. **This skill is only meaningful if the store sells subscription products.** If `subscriptionContracts` returns 0 contracts, the report exits with $0 MRR — that is the correct answer, not an error.

## Recurring Revenue Model

For each subscription contract, the contribution to MRR depends on its billing interval:

```
billing_amount = sum(line.currentPrice × line.quantity) for each line in contract
mrr_contribution =
  billing_amount                       if interval = MONTH and intervalCount = 1
  billing_amount / intervalCount       if interval = MONTH (e.g., every 3 months → /3)
  billing_amount × 4.345               if interval = WEEK (avg weeks per month)
  billing_amount × 4.345 / intervalCount if interval = WEEK with intervalCount > 1
  billing_amount / 12                  if interval = YEAR
  billing_amount × 30 / intervalCount  if interval = DAY
```

Aggregations:
- **MRR** = Σ mrr_contribution for all `ACTIVE` (and `PAUSED` if `include_paused`) contracts
- **ARR** = MRR × 12
- **Active subscribers** = unique `customer.id` count
- **ARPU** = MRR / active subscribers
- **Churn rate (period)** = contracts cancelled inside `churn_window_days` ÷ contracts that were active at the start of the window
- **Net new subscribers** = new contracts inside the window − cancelled contracts inside the window

## Workflow Steps

1. **OPERATION:** `subscriptionContracts` — query
   **Inputs:** `first: 250`, select `id`, `status`, `createdAt`, `updatedAt`, `nextBillingDate`, `customer { id, displayName }`, `currencyCode`, `billingPolicy { interval, intervalCount }`, `lines { edges { node { currentPrice { amount, currencyCode }, quantity, productId, variantId, title } } }`, pagination cursor
   **Expected output:** All subscription contracts; paginate until `hasNextPage: false`

2. Classify each contract by status: `ACTIVE`, `PAUSED`, `CANCELLED`, `EXPIRED`, `FAILED`

3. Compute `mrr_contribution` for each active (and paused if requested) contract using the model above

4. Aggregate MRR / ARR / subscribers / ARPU

5. For churn: count cancellations where `updatedAt` is within `churn_window_days` and status moved to `CANCELLED` (`updatedAt` can also change for reasons other than cancelling, so say in the report that churn is approximate). The query only returns each contract's current status, so you cannot see exactly which contracts were `ACTIVE` at `as_of - churn_window_days`. If the user has a saved CSV from a run at the start of the window, use its `ACTIVE` count as the starting figure. Otherwise estimate it as contracts now `ACTIVE` or `PAUSED` with `createdAt` before the window start, plus the cancellations counted above, and label the churn rate "rough proxy (no starting snapshot)".

6. Build a per-product breakdown so finance can see which subscription SKUs drive MRR. Group by each line's `productId` (show its `title`). Each line's share of MRR is its `currentPrice.amount × quantity`, normalised to a month with the contract's billing interval, so a contract with two products adds to both. Count a subscriber under every product they hold.

## GraphQL Operations

```graphql
# subscriptionContracts:query — validated against api_version 2025-01
query SubscriptionMRR($after: String) {
  subscriptionContracts(first: 250, after: $after) {
    edges {
      node {
        id
        status
        createdAt
        updatedAt
        nextBillingDate
        currencyCode
        customer {
          id
          displayName
          defaultEmailAddress { emailAddress }
        }
        billingPolicy { interval intervalCount minCycles maxCycles }
        deliveryPolicy { interval intervalCount }
        lines(first: 50) {
          edges {
            node {
              id
              productId
              variantId
              title
              quantity
              currentPrice { amount currencyCode }
            }
          }
        }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Subscription MRR Tracker             ║
║  Store: <store domain>                       ║
║  As of: <YYYY-MM-DD>                         ║
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
SUBSCRIPTION MRR REPORT  (as of <date>)
  Active contracts:        <n>
  Paused contracts:        <n>
  Cancelled (last <n>d):   <n>
  ─────────────────────────────
  MRR:                     $<amount>
  ARR:                     $<amount>
  Active subscribers:      <n>
  ARPU:                    $<amount>
  Churn rate (<n>d):       <pct>%
  Net new (<n>d):          <n>

  Top subscription products by MRR:
    "<title>"   Subs: <n>   MRR: $<n>
    "<title>"   Subs: <n>   MRR: $<n>

  Output: subscription_mrr_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "subscription-mrr-tracker",
  "store": "<domain>",
  "as_of": "<YYYY-MM-DD>",
  "active_contracts": 0,
  "paused_contracts": 0,
  "cancelled_in_window": 0,
  "mrr": 0,
  "arr": 0,
  "active_subscribers": 0,
  "arpu": 0,
  "churn_rate_pct": 0,
  "net_new": 0,
  "currency": "USD",
  "by_product": [],
  "output_file": "subscription_mrr_<date>.csv"
}
```

## Output Format
CSV file `subscription_mrr_<YYYY-MM-DD>.csv` with columns:
`contract_id`, `status`, `customer_id`, `created_at`, `next_billing_date`, `interval`, `interval_count`, `billing_amount`, `mrr_contribution`, `currency`, `product_titles`

The query does not fetch customer emails, so the CSV has no email column. Customer IDs still link to real people: tell the user to store the file securely and remove `customer_id` before sharing it outside finance.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Understand your buyers** with the [Customer cancellation risk finder](https://useaiblocks.com/skills/churn-risk-finder).
- **Shape the product** with the [Subscription churn prevention planner](https://useaiblocks.com/skills/churn-reducer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `subscriptionContracts` empty | Store has no subscription products | Exit cleanly — report $0 MRR; this is the correct value, not an error |
| Multi-currency contracts | Different `currencyCode` per contract | Group MRR per currency; do not sum across currencies — surface separately in output |
| Pre-paid contracts (`maxCycles` set) | Customer paid upfront for N cycles | Still contributes to MRR while ACTIVE, but the contract will end after `maxCycles`; flag in output |

## Best Practices
- This skill is only meaningful if the store actually sells subscription products. If you don't run subscriptions, MRR will be $0 — that's correct.
- Run on the **first day of every month** so MRR snapshots align with finance's monthly close cadence.
- Track MRR week-over-week to catch payment-failure spikes early — `FAILED` contracts that don't recover become churn within 30 days.
- Pre-paid annual subscriptions inflate ARR without inflating cash flow in any given month — keep them separate when reporting to investors who want a cash-flow view.
- Pair with `churn-risk-finder` to triangulate subscription churn vs. one-time-purchase churn — they deserve separate retention strategies.
- Multi-currency stores: report MRR per currency; converting via spot FX rates produces a misleading number that fluctuates with exchange rates rather than business performance.
