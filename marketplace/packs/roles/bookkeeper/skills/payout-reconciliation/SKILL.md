---
name: payout-reconciliation
description: Reconciles online sales to payouts and bank deposits for one period across Shopify, Stripe, PayPal, Square, Amazon, Etsy and similar platforms. Builds a gross-to-net bridge (gross sales, discounts, refunds, platform and payment fees, chargebacks, reserves, currency), matches each payout to a bank deposit, explains every gap as timing, fee, refund or unexplained, and produces a monthly summary ready to book. Use it for ecommerce month-end, when payouts do not match sales, or when fees look wrong. It never issues refunds, disputes charges or files sales tax.
---

# Payout reconciliation

## When to use

- Month-end for any business paid through a shop, marketplace or payment app.
- Sales in the books equal bank deposits exactly, which means fees and refunds are missing.
- A payout looks too small, a deposit is missing, or fees seem to have jumped.
- Before handing the year to the accountant, so sales are recorded gross with every deduction shown.

Do not use it to decide sales tax, VAT or GST treatment, marketplace tax collection or income tax reporting. Those are questions for the accountant. Check this with local rules and ask a qualified accountant.

## What you need

For each channel and the period, plus a few days either side:
1. Orders export (order number, date, gross amount, discounts, tax collected, shipping charged, refunds, status).
2. Payout or settlement report, itemised if available (for example Stripe's itemised payout reconciliation CSV, Shopify Payments payouts and activity report, Amazon settlement report, PayPal activity download).
3. Bank statement lines for the deposit account.
4. Currency of sales and of payouts.
5. Any reserve, hold or instant payout used in the period.
6. How the books record sales today (gross with fees, or net deposits), and any connector such as A2X.

**Access:** level 1 for the reports and the ledger; level 2 to save the booking summary as a draft journal or an unposted A2X summary; level 3 to post the summary and match the deposits, within your limits (channels, months, a value cap). Refunds and payouts in the payment platform always stay with you.

## Steps

### 1. Set the period rules

Sales belong to the month of the order (or the date the accountant chooses, such as fulfilment). Deposits belong to the month they hit the bank. The gap is money in transit. Stripe groups payouts by estimated arrival date, not bank posting date, so expect payouts near month-end to sit in transit. Instant payouts are not tied to a batch, so reconcile them against the transaction history.

### 2. Build gross sales

From the orders export: remove test and cancelled orders, then total gross sales, shipping charged and tax collected separately. Tax collected is not income; keep it apart for the accountant.

### 3. Walk gross to net, per channel

Gross sales
minus discounts
minus refunds
minus platform fees (subscription, selling and listing fees)
minus payment processing fees
minus chargebacks and dispute fees
minus shipping labels bought through the platform
plus or minus reserves held or released
plus or minus currency conversion
= expected net payouts for the period

Every line comes from a report, not a plug figure.

### 4. Match payouts to deposits

Match each payout to one bank deposit by amount and date. Mark payouts in transit at the period start and end. List any payout without a deposit and any platform deposit without a payout.

### 5. Explain the gap

Expected net minus actual deposits. Split the gap into: timing (in transit), fee differences, refunds or chargebacks after the payout, reserves, currency, and unexplained. The unexplained line goes on the questions list with its amount.

### 6. Check fee rates

For each channel: total fees divided by gross sales, this period and last. Flag sudden changes and any fee type you have not seen before. Do not judge whether a fee is correct under the contract; flag it for the owner to check with the platform.

### 7. Write the booking summary

One table per channel: gross sales, discounts, refunds, each fee type, chargebacks, tax collected, net, deposits, in transit. At level 1 the owner or connector posts it once approved. At level 2 I save it as a draft (level 2). At level 3 I post it and match the deposits within the agreed limits, and log each entry (level 3).

## Checks

- Gross sales tie to the orders export total.
- Each bridge line ties to a platform report total.
- Payouts plus in-transit amounts tie to deposits.
- Tax collected is shown separately, never as income.
- Unexplained gap shown, not plugged.
- Every summary carries: *Check this with local rules and ask a qualified accountant before you file or claim anything.*

## Output format

1. Period and channels covered.
2. Gross-to-net bridge per channel.
3. Payout-to-deposit match table with in-transit items.
4. Gap analysis: timing, fees, refunds, reserves, currency, unexplained.
5. Fee rate table, this period against last.
6. Booking summary per channel (for approval).
7. Questions for the owner, the platform and the accountant.

## Example of good output (short)

Illustrative structure, not a real business: a candle maker selling on its own shop and one marketplace. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.

> **Own shop (card payments), October 2026**
>
> | Line | Amount |
> |---|---|
> | Gross receipts (412 orders, including 1,094.40 sales tax collected) | 18,240.00 |
> | Discounts | -912.00 |
> | Refunds | -384.50 |
> | Payment fees | -561.30 |
> | Chargeback (1) and dispute fee | -62.00 |
> | Expected net | 16,320.20 |
> | Deposits received in October | 15,104.70 |
> | In transit at 31 Oct (payout arriving 2 Nov) | 1,215.50 |
> | Unexplained | 0.00 |
>
> **Fee rate:** 3.08% of gross, against 3.02% in September. No new fee types.
>
> **Booking note:** the 1,094.40 sales tax collected goes to the tax account, not to income, so sales income for October is 17,145.60 before discounts.
>
> **Questions:** How the sales tax collected is reported, and in which states, is for your accountant.
>
> *Check this with local rules and ask a qualified accountant before you file or claim anything.*
