---
name: shopify-admin-payout-reconciliation
role: finance
description: "Read-only: reconciles Shopify Payments payouts against the balance transactions Shopify assigned to each payout, and flags amount discrepancies."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - shopifyPaymentsAccount:query
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
Checks each Shopify Payments payout against the balance transactions (charges, refunds, adjustments, fees and others) that Shopify itself assigned to that payout. For each payout, it adds up the `net` of those transactions and compares the total to the payout's reported `net` amount. Membership comes from Shopify's own link (`associatedPayout`), never from order dates. Discrepancies are flagged with a delta and the suspected cause. Read-only — no mutations.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_shopify_payments_payouts,read_orders`
- API scopes: `read_shopify_payments_payouts`, `read_orders`. The staff account also needs permission to view payouts (Shopify's balance transaction docs say it requires the `view_payouts` permission).
- Store must use Shopify Payments. If the store uses only third-party gateways, this skill exits cleanly with a message.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Lookback window covering payouts issued in this period |
| tolerance | number | no | 0.01 | Acceptable delta in store currency before flagging a discrepancy |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Reconciliation output is informational; do not treat flagged discrepancies as confirmed errors before reviewing the underlying transactions in the Shopify admin.

## Workflow Steps

1. **OPERATION:** `shopifyPaymentsAccount` — query
   **Inputs:** select `payouts(first: 100, query: "issued_at:>='<NOW - days_back days>'")` with `id`, `issuedAt`, `status`, `net`, `gross`, `summary { chargesGross, chargesFee, refundsFeeGross, refundsFee, adjustmentsGross, adjustmentsFee, retriedPayoutsGross, retriedPayoutsFee }`
   **Expected output:** All payouts in the window. If account is null, exit — store does not use Shopify Payments. **Pagination:** this query returns at most 100 payouts per page. If `pageInfo.hasNextPage` is true, run it again with `$payoutAfter` set to `endCursor`, and repeat until `hasNextPage` is false, so no payout in the window is missed. Say how many pages you read.

2. **OPERATION:** `shopifyPaymentsAccount.balanceTransactions` — query, once per payout
   **Inputs:** `query: "payments_transfer_id:<payout number>"` (the number at the end of the payout's `gid://shopify/ShopifyPaymentsPayout/<number>`), `hideTransfers: true` (leaves out the transfer line that is the payout itself), `first: 250`. Page with `pageInfo` until `hasNextPage` is false.
   **Membership check:** keep a transaction only if its `associatedPayout.id` equals this payout's `id`. If any returned transaction points to a different payout, or none come back for a paid payout, stop and tell the user: the filter did not select this payout's transactions, so the payout cannot be reconciled this way. Do not fall back to orders picked by date.

3. For each payout, compute the expectation from its own transactions:
   ```
   expected_net = sum of net.amount over the payout's balance transactions (transfers left out)
   delta        = reported_net - expected_net
   ```
   **Signs:** use each `net` exactly as Shopify returns it, with its own sign (refunds and fees normally reduce the balance). Never take absolute values or flip signs to make the numbers fit. Positive `delta` means the payout paid more than its transactions add up to; negative means less.

   **Breakdown (for the report only).** Also show the payout's `summary` fields as Shopify returns them: charges, refunds, adjustments (including disputes), reserved funds and retried payouts, each gross and fee. Do not combine them into a second formula: Shopify's docs do not state the sign of each summary field, so a hand-built sum can be wrong.

   **Sign check, before the full run.** Do steps 2 and 3 for ONE sample payout first. Compare the result with the reported net and with the payout detail in the Shopify admin. If the delta is large, stop. Tell the user what you found, such as a transaction type you did not expect, and ask them to confirm before you run the full window. If you cannot explain a large delta, report the gap as it is. Do not report every payout as a discrepancy.

   **Orders behind a payout.** For a flagged payout, list the orders from each transaction's `associatedOrder` (name and id) and its `sourceOrderTransactionId`. These are the orders Shopify linked to that payout. Transactions with no order (for example adjustments or reserves) are listed by `type` and `adjustmentReason`.

4. Classify each payout:
   - `ok` if `|delta| <= tolerance`
   - `discrepancy` otherwise — record sign (positive: payout overpaid us; negative: payout underpaid)

5. Aggregate totals across the window: total payouts, total reconciled, total discrepancies, sum of absolute deltas, and payouts that could not be reconciled (and why)

## GraphQL Operations

```graphql
# shopifyPaymentsAccount:query — validated against api_version 2025-01
query PayoutReconciliation($payoutQuery: String!, $payoutAfter: String) {
  shopifyPaymentsAccount {
    id
    payoutSchedule { interval }
    payouts(first: 100, after: $payoutAfter, query: $payoutQuery) {
      edges {
        node {
          id
          issuedAt
          status
          net { amount currencyCode }
          gross { amount currencyCode }
          summary {
            chargesGross { amount currencyCode }
            chargesFee { amount currencyCode }
            refundsFeeGross { amount currencyCode }
            refundsFee { amount currencyCode }
            adjustmentsGross { amount currencyCode }
            adjustmentsFee { amount currencyCode }
            retriedPayoutsGross { amount currencyCode }
            retriedPayoutsFee { amount currencyCode }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

```graphql
# shopifyPaymentsAccount.balanceTransactions — fields from Shopify's ShopifyPaymentsBalanceTransaction reference
# (https://shopify.dev/docs/api/admin-graphql/latest/objects/ShopifyPaymentsBalanceTransaction).
# Check it runs on your api_version before the full run.
query PayoutTransactions($txQuery: String!, $txAfter: String) {
  shopifyPaymentsAccount {
    balanceTransactions(first: 250, after: $txAfter, query: $txQuery, hideTransfers: true) {
      edges {
        node {
          id
          type
          test
          transactionDate
          amount { amount currencyCode }
          fee { amount currencyCode }
          net { amount currencyCode }
          adjustmentReason
          sourceType
          sourceOrderTransactionId
          associatedPayout { id status }
          associatedOrder { id name }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

The payout `summary` also has `reservedFundsGross` and `reservedFundsFee` (and, in newer API versions, advance and rebate fields). Add the ones your api_version supports to the breakdown.

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Payout Reconciliation                ║
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
PAYOUT RECONCILIATION  (<days_back> days)
  Payouts in window:    <n>
  Reconciled (ok):      <n>
  Discrepancies:        <n>   ⚠️
  Sum of abs deltas:    $<amount>

  Top discrepancies:
    Payout <date>  Reported: $<n>  Expected: $<n>  Δ: $<n>

  Output: payout_reconciliation_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "payout-reconciliation",
  "store": "<domain>",
  "period_days": 30,
  "payouts_count": 0,
  "reconciled_count": 0,
  "discrepancy_count": 0,
  "sum_abs_delta": 0,
  "currency": "USD",
  "output_file": "payout_reconciliation_<date>.csv"
}
```

## Output Format
CSV file `payout_reconciliation_<YYYY-MM-DD>.csv` with columns:
`payout_id`, `issued_at`, `status`, `reported_net`, `expected_net` (sum of the payout's balance transaction `net`), `delta`, `currency`, `transaction_count`, `charges_gross`, `charges_fee`, `refunds_gross` (this is the `refundsFeeGross` field, the gross amount refunded), `refunds_fee`, `adjustments_gross`, `adjustments_fee`, `verdict` (`ok`, `discrepancy`, `currency_mismatch` for a payout in a different currency than the account, or `not_reconciled` when its transactions could not be read). The summary columns are copied as Shopify returns them, for reference only.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Account reconciler](https://useaiblocks.com/skills/account-reconciler).
- The [Books reconciler and P&L narrator](https://useaiblocks.com/skills/books-reconciliation-pl).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| `shopifyPaymentsAccount` is null | Store does not use Shopify Payments | Exit cleanly; suggest reconciling via the third-party gateway dashboard |
| Currency mismatch within payout | Multi-currency store | Reconcile only payouts in the presentment currency that matches account currency; flag others as `currency_mismatch` |
| Payout still `IN_TRANSIT` | Not yet final | Skip — reconcile after status moves to `PAID` |

## Best Practices
- Run weekly on the morning after a payout is scheduled — same-day reconciliation catches discrepancies while transactions are easy to investigate.
- For any flagged discrepancy, drill in on that payout's own balance transactions. A refund belongs to the payout Shopify assigned it to, which may be a later payout than the order's; trust `associatedPayout`, not dates.
- Use this skill alongside your accounting export — these numbers should match your bookkeeping software's deposit records to the cent.
- Tolerance > $0.01 should be used cautiously: anything above a few cents typically reflects a real fee or adjustment that deserves an explanation.
- This skill does not detect fraud; it detects accounting deltas. If you suspect fraud, escalate via the Shopify admin's payout detail view.
