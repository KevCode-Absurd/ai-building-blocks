---
name: reconcile-payouts-and-payment-fees
description: "A reconciliation sheet that matches every order to its payment, every payment to a payout or COD remittance, and every payout to the bank, with each gap listed by type, amount and the action that recovers it. Covers card and UPI gateways, Shopify Payments, wallets, marketplace settlements and courier COD remittances; checks the fee rate actually charged against the agreed rate; catches refunds paid twice or not at all, unremitted delivered COD orders, held reserves, chargebacks and courier deductions; and drafts claims for the client to send. Use monthly, when the bank balance does not match sales, after changing gateway or courier, or before closing the books."
---

# Reconcile payouts and payment fees

**You get:** a gap register listing every unmatched or short amount by type, with order, payout and bank references, the total money at stake, the effective fee rate per gateway against the agreed rate, and draft claims ready for the client to approve.

## When to use

- Every month, before closing the books or building the P&L.
- The bank balance does not match what the store sold.
- After switching payment gateway, courier or COD partner.
- COD orders show delivered but the money has not arrived.
- Fees feel higher than the rate the gateway quoted.

## Not for

- Choosing or setting up gateways and COD rules: use `set-up-payments-and-cod-rules`.
- Courier overcharges on freight weight as part of a returns study: `returns-and-rto-cost-analysis` covers RTO and return costs.
- Forecasting future payouts: use `build-13-week-cash-forecast`.
- Fighting individual chargebacks: the store's dispute process; this skill only lists them and their deadlines.

## What you need

Required (read access, level 1):

1. **Shopify order export** for the month plus 15 days either side: Name, Created at, Financial Status, Total, Refunded Amount, Payment Method, Payment Reference, Cancelled at.
2. **Shopify Payments exports**: payouts (Payout date, Status, Charges, Refunds, Adjustments, Reserved funds, Fees, Total) and balance transactions (Transaction date, Type, Order, Amount, Fee, Net, Payout date, Payout ID).
3. **Other gateway settlement reports** (for example Razorpay, PayU, Cashfree, Stripe or PayPal, whichever the store uses): payment ID, order reference, amount, fee, tax on fee, settlement ID, settlement date.
4. **COD remittance reports** from each courier or aggregator: order, AWB, status, COD amount, freight and COD charges deducted, amount remitted, remittance reference, date.
5. **Bank statement** for the same period, as a CSV.
6. **Agreed fee rates** for each gateway and courier (contract, pricing page saved on a date, or email).

Optional: marketplace settlement reports, the returns log.

If a gateway report is missing, reconcile what is available and list that gateway as "not checked". Every step here is read-only. Sending a claim to a gateway, courier or marketplace is a message on the client's behalf: draft it, and send only with the client's yes.

## Before you start: the gates

1. **Every payment route is listed.** Pass when each payment method in the order export (card, UPI, wallet, buy now pay later, COD, marketplace) maps to a report. Fail: ask once for the missing report.
2. **Periods overlap.** Pass when reports cover 15 days before and after the month, so orders near the edges can find their payouts.
3. **Agreed rates known.** Without them, report the effective rate only and mark fee checks "no contract on file".

## Steps

### 1. Match orders to payments

Join the order export to gateway transactions on payment reference or order name. Each order should have one charge equal to its total. Flag:

- **Paid order, no charge** (possible test, manual or fraudulent order).
- **Charge, no order** (a payment with no order behind it).
- **Amount differs** beyond rounding.
- **Cancelled order still charged** with no refund.

### 2. Match refunds

Every refund in Shopify should appear once in the gateway as a refund. Flag refunds missing at the gateway (the buyer was not paid; a dispute risk) and refunds paid twice. Card fees on refunded Shopify Payments orders are not returned [FIN-6243]; that is expected, not a gap, but count it as a refund cost.

### 3. Match payments to payouts

Sum each payout's transactions: charges minus refunds minus fees minus disputes and dispute fees, plus or minus adjustments, minus reserves and holds [FIN-6241]. The sum must equal the payout. Flag payouts that do not add up and transactions with no payout after the normal lag. Reserved money released later should be matched to its original hold, so it is not counted twice [FIN-6242].

### 4. Match payouts to the bank

Each payout should land in the bank within the usual lag; for Shopify Payments in the US that is at least 3 business days from capture, with weekend sales in one payout and 1 to 3 more days at the bank [FIN-6240]. Use each gateway's own lag from history. Flag payouts marked paid but not in the bank after the lag plus 3 business days.

### 5. Reconcile COD remittances (India and other COD markets)

For every order the courier marks delivered: COD amount minus agreed deductions should equal the amount remitted. Flag:

- **Delivered, not remitted** after the courier's stated cycle.
- **Remitted short:** deductions above the agreed freight or COD fee.
- **Marked RTO but remitted** or **marked delivered but customer says not received.**
- **Weight disputes:** billed weight above the declared weight.

Courier and 3PL bills are often wrong; one operator estimates 30 to 40% of the brands he mentors are overcharged [OPS-0012].

### 6. Check fee rates

For each gateway: **effective fee rate = total fees and tax on fees / total charges**, split by method where the report allows (domestic card, international card, UPI, wallet, buy now pay later). Compare with the agreed rate. A gap above 0.1 percentage point on a method is worth a query (practitioner default, test it). Also list fixed fees (per transaction, payout or currency conversion) and dispute fees.

India: UPI and RuPay debit cards often carry lower or zero rates under current rules; check the gateway is charging what its pricing says for those methods. US: international cards and currency conversion usually cost more; check the store is not converting currency twice.

### 7. Check the other deductions

- **Chargebacks:** list each with amount, fee, reason and response deadline. Work out the chargeback rate (disputes / card transactions). Most processors flag merchants above about 0.9% and can stop accepting cards above 1% [SEC-0004].
- **Reserves and holds:** amount held, start date, expected release.
- **Shipping labels:** labels bought in Shopify are billed to the card on file, not taken from payouts [SET-0006]; check them on the card statement, not here.
- **Marketplace settlements (India):** Amazon, Flipkart and other marketplaces deduct fees and tax collected at source before paying. List the tax deducted per month so the accountant can claim it.

### 8. Classify every gap

Each gap gets one type: timing (will clear), fee overcharge, missing refund, double refund, chargeback, reserve or hold, unremitted COD, short COD remittance, courier overbilling, unmatched payment, unmatched order, tax deduction to claim. Mark timing gaps and recheck them next month rather than chasing them.

### 9. Draft the claims

For each recoverable gap above a floor (practitioner default: the larger of 10 dollars or 500 rupees, or any gap in a repeated pattern), draft a claim: who to send it to, the evidence (order, AWB, payment ID, payout ID, contract rate), and the amount. The client approves and sends. Log what was claimed and recovered next month.

## Checks before you hand it over

- Every payment method in the order export is matched or listed as "not checked".
- Order, refund, payout and bank totals each tie within rounding, or the gap is in the register.
- Every delivered COD order is matched to a remittance or flagged.
- Effective fee rate per gateway and method is shown beside the agreed rate.
- Chargeback rate is shown, with deadlines for open disputes.
- Every gap has one type, an amount, references and an action.
- No claim, refund or message was sent without the client's yes.

## Output

**One-screen summary:** total sales, total received in the bank, total gap split into timing and real money; the five largest real gaps; effective fee rate per gateway against agreed; chargeback rate; money recoverable through claims; and a short "To confirm" list.

**Gap register:**

| Gap ID | Type | Order | Payment or AWB ID | Payout or remittance ID | Bank date | Expected | Actual | Difference | Evidence | Action | Claim drafted | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Fee check:** Gateway, Method, Charges, Fees and tax on fees, Effective rate, Agreed rate, Difference, Overcharge amount.

**COD remittance check:** Courier, Delivered orders, COD due, Deductions agreed, Deductions taken, Remitted, Unremitted orders, Short amount.

**Chargebacks and reserves:** ID, Type, Amount, Fee, Reason, Deadline or release date, Status.

**Draft claims:** To (gateway, courier or marketplace), Gaps covered, Amount, Evidence attached, Ready for client approval.

## Common mistakes

- **Matching payouts to the day's sales.** A payout bundles several days, net of fees, refunds and disputes [FIN-6241]. Step 3 matches transactions to payout IDs.
- **Treating timing as loss.** Weekend and holiday batching delays money [FIN-6240]. Step 8 separates timing gaps.
- **Counting a released reserve twice.** Step 3 matches the release to its hold [FIN-6242].
- **Trusting courier remittances.** Step 5 checks every delivered COD order [OPS-0012].
- **Chasing small gaps one by one.** Step 9 sets a floor and looks for patterns.
- **Looking for labels in payouts.** They are on the card [SET-0006].

## Sources

- FIN-6240 (proposed): Shopify Payments US payout timing and batching.
- FIN-6241 (proposed): what is netted out of a payout.
- FIN-6242 (proposed): fixed and percentage reserves and their release.
- FIN-6243 (proposed): card fees are not returned on refunds.
- SEC-0004: chargeback thresholds and cost per chargeback.
- SET-0006: Shopify labels are billed to the card.
- OPS-0012: audit courier and 3PL invoices monthly.

What makes this skill ours: it reconciles at four levels (order, payment, payout, bank) instead of comparing two totals; every delivered COD order is traced to its remittance; fee rates are checked by payment method against the contract; and each gap is typed so timing differences are not chased as losses while real money gets a ready claim.
