---
name: build-13-week-cash-forecast
description: "A thirteen-week cash forecast sheet, one column per week, showing money in (payouts, pay-on-delivery remittances, marketplace settlements, wholesale invoices) and money out (stock deposits and balances, ad spend on its real billing dates, shipping, 3PL, payroll, apps, taxes, loan repayments), with the lowest-cash week and every week below the safety buffer flagged. Times each receipt by the actual payout or remittance lag and each payment by its due date, adds a downside case, and lists the actions that fix each short week before it arrives. Rolls forward every week against actuals. Use when cash feels tight, before a big stock order, a sale, a hire or a financing offer, or when profit is good but the bank balance is not."
---

# Thirteen-week cash forecast

**You get:** a 13-column cash sheet (receipts, payments, closing cash per week) with the lowest week and every week under the buffer flagged, a downside case, and a short action list for each short week, ready to update every Monday.

## When to use

- Profit looks fine but the bank balance keeps running low.
- Before a large stock order, a peak sale, a hire or any financing offer.
- Supplier deposits, ad bills and tax dates bunch up in the same weeks.
- The store is growing fast and buys stock months before it sells.

## Not for

- Monthly profit: use `monthly-store-pnl`. Profit and cash differ; this skill is cash only.
- Next month's revenue: use `forecast-next-month-revenue` (this skill takes it as an input).
- Matching payouts to orders: use `reconcile-payouts-and-payment-fees`.
- Judging a financing offer: use `evaluate-revenue-based-financing` (it uses this forecast).

## What you need

Required (read access, level 1):

1. **Bank balances** today for every operating account, and any credit line limit and amount drawn.
2. **Payout and settlement history**, last 8 weeks: Shopify Payments payouts report (Payout date, Charges, Refunds, Fees, Reserved funds, Total), other gateway settlement reports, marketplace settlement reports, and courier cash-on-delivery remittance reports where the store offers pay on delivery.
3. **Revenue forecast** by week from `forecast-next-month-revenue`, extended to 13 weeks.
4. **Open purchase orders**: supplier, amount, deposit and balance dates, expected arrival.
5. **Fixed bills**: payroll and dates, rent, apps and software, agency retainers, 3PL, insurance.
6. **Ad billing**: how each ad account charges (card on threshold, monthly invoice or prepaid) and planned spend by week.
7. **Taxes and loans**: sales tax, VAT or goods and services tax filing dates and expected amounts, income tax advances, loan and financing repayment schedules.

Optional: supplier payment terms, wholesale invoices due, owner drawings.

If an item is missing, put the owner's best estimate in and mark it "estimate". This skill reads data and builds a sheet. Paying, moving or borrowing money stays with the client.

## Before you start: the gates

1. **Opening cash is real.** Pass when it counts only money the store can spend this week. Reserved or held payout money is not cash yet [FIN-6242]. Fail: split it out.
2. **Receipts use real lags.** Pass when each receipt line is timed by the last 8 weeks' actual lag between sale and money in the bank. Fail: measure it first (step 2).
3. **A buffer is agreed.** Pass when the owner sets a minimum cash level. Practitioner default, test it: four weeks of fixed outflows (payroll, rent, apps, retainers, loan repayments). Fail: use the default and say so.

## Steps

### 1. Set up the sheet

Thirteen columns, one per week starting Monday. Rows: opening cash, receipts by source, payments by type, net flow, closing cash, buffer, gap to buffer. Closing cash becomes next week's opening cash.

### 2. Time the receipts

- **Card and wallet payouts.** Shopify Payments in the US settles in at least 3 business days, groups Friday to Sunday sales into one payout, skips weekends and holidays, and banks can add 1 to 3 days [FIN-6240]. Payouts arrive net of fees, refunds, disputes and reserves [FIN-6241], so forecast the net, not the sales. For other gateways and countries, use the lag seen in the payouts history.
- **Pay-on-delivery remittances.** Where the store offers pay on delivery, the courier pays delivered orders on its own cycle, minus freight and collection fees if netted. Use the actual cycle from the remittance reports and count only orders expected to be delivered (1 minus the failed-delivery rate).
- **Bank transfers, local payment methods and buy now pay later** settle through the provider on its own cycle; use the history.
- **Marketplaces.** Amazon, Walmart, Etsy, eBay, Zalando and others settle on their own schedule after fees, and some deduct taxes at source; use the settlement history.
- **Wholesale invoices** by their due date, pushed back by each buyer's usual delay.

### 3. Time the payments

- **Stock.** Each purchase order's deposit and balance on their dates. Lead time matters: production plus sea freight can run 50 to 70 days door to door [COG-0008], so a stock buy is paid months before it sells. Supplier float is payment terms minus the time from production to the warehouse [FIN-0005]; longer terms move cash later.
- **Ads.** On the date the platform charges, not the date the ad ran. Card-billed accounts charge at thresholds through the week; invoiced accounts charge monthly.
- **Shipping labels and 3PL.** Labels bought in Shopify are charged to the card on file at a billing threshold, not deducted from payouts [SET-0006]; put them on the card's payment date. 3PL invoices on their due date.
- **Refunds** paid out from the gateway reduce payouts; count them once, inside the payout line, not again here.
- **Payroll, rent, apps, retainers** on their dates.
- **Taxes.** US: sales tax by each state's filing frequency; UK and EU: VAT monthly or quarterly by registration; Australia: goods and services tax on the business activity statement cycle; elsewhere, the local filing calendar. Confirm dates with the accountant (`set-up-taxes-gst-and-us-sales-tax`).
- **Loans and financing** repayments, including sales-linked repayments taken from payouts (net them in the payout line if the lender deducts at source).
- **Owner drawings** as a line of their own.

### 4. Find the short weeks

Flag every week where closing cash is under the buffer, and the single lowest week. The lowest point matters more than the ending balance.

Compute summary dates from the same rows: first reserve breach, first negative balance, lowest week, peak funding gap and ending cash. Use `tools/commerce-math.mjs` with operation `cashForecast`, openingCash, reserve and chronologically ordered periods `{period, receipts, payments}`. Payments include each outflow once. Reconcile every date and amount in the narrative against its result. A week exactly at the reserve is not a breach; zero cash is not negative. Report any opening shortfall separately. This checks period-end arithmetic, not intraperiod liquidity or completeness of cash records.

### 5. Run the downside case

Practitioner default, test it: sales 20% below base, cost per new customer 20% higher, one payout delayed a week, the largest inbound shipment two weeks late (so its sales slip, but its balance payment does not), and the failed-delivery rate 5 points higher for stores with pay on delivery. Show the downside closing cash under the base.

### 6. Write actions for each short week

Order actions by cost and by how early they must be decided:

1. **Move supplier dates.** Ask for longer terms or a split balance; suppliers often accept terms when shown a growth plan and paid on time [FIN-0023].
2. **Turn slow stock into cash.** Push slow products through their own funnel at break-even rather than cutting all ad spend; cutting media while stock is piling up can make cash worse [FIN-0026] [FIN-0027]. Hand off to `clear-slow-moving-stock`.
3. **Raise sell-through on stock already bought;** it frees cash with no change in profit [FIN-0028].
4. **Pace ad spend** to what the cash can carry, judged on 60 to 180-day cash return rather than 30 days [FIN-0029].
5. **Delay owner drawings and optional buys.**
6. **Credit line or financing** only after 1 to 5, and only if the forecast shows it can be repaid (`evaluate-revenue-based-financing`).

Each action gets an owner, a decide-by date and the cash effect by week. Every action that pays, moves or borrows money is the client's call; this skill drafts it.

### 7. Roll it every week

Each Monday: replace last week's forecast with actuals, add week 14, record the forecast error for receipts and payments, and update the action list. If the receipts error is above 10% two weeks running, re-measure the lags. Growth funded by stock loans can push profit to near zero once repayments land [FIN-0011]; watch the loan rows in growth months.

### Market notes

- **All markets:** sales tax or VAT collected is not the store's money; keep it out of spendable cash. Courier remittances, failed-delivery deductions and marketplace tax deductions are the usual surprises.
- **US:** peak season reserves on Shopify Payments can hold back part of the busiest weeks' money [FIN-6242].
- **UK and EU:** a VAT bill after a big quarter can be the lowest week; put it in on its due date.

## Checks before you hand it over

- Opening cash excludes reserved and held money.
- Every receipt line is timed by a measured lag, with the source report named.
- Ads, labels and 3PL are on their charge dates, not their activity dates.
- Every open purchase order's deposit and balance appear on their dates.
- Refunds are counted once.
- The lowest week and all weeks below buffer are flagged in base and downside.
- Each short week has at least one action with owner, decide-by date and cash effect.
- No payment, transfer or borrowing was made; the action list is marked for client decision.

## Output

**One-screen summary:** today's cash, lowest projected cash and its week (base and downside), number of weeks below buffer, the top three actions with their cash effect, and up to three assumption lines where an unknown input changes the actions.

**Cash sheet (13 weeks):**

| Row | W1 | W2 | ... | W13 |
|---|---|---|---|---|
| Opening cash | | | | |
| Card and wallet payouts (net) | | | | |
| Pay-on-delivery remittances | | | | |
| Marketplace settlements | | | | |
| Wholesale receipts | | | | |
| Other receipts | | | | |
| **Total receipts** | | | | |
| Stock deposits and balances | | | | |
| Ad spend (charge dates) | | | | |
| Shipping labels and 3PL | | | | |
| Payroll | | | | |
| Rent, apps, retainers | | | | |
| Taxes | | | | |
| Loan and financing repayments | | | | |
| Owner drawings | | | | |
| **Total payments** | | | | |
| Net flow | | | | |
| Closing cash (base) | | | | |
| Closing cash (downside) | | | | |
| Buffer | | | | |
| Below buffer flag | | | | |

**Assumptions tab:** Line, Timing rule, Lag or due date, Source, Estimate (yes or no).

**Action list:** Week affected, Action, Cash effect, Decide by, Owner, Client decision.

**Accuracy log:** Week, Forecast receipts, Actual receipts, Error, Forecast payments, Actual payments, Error.

## Common mistakes

- **Treating sales as cash.** Payouts arrive late and net of fees and refunds [FIN-6241]. Step 2 forecasts the net on the real lag.
- **Counting reserved money.** It is not spendable [FIN-6242]. Gate 1 removes it.
- **Ad spend on the run date.** Charges land on billing dates. Step 3 moves them.
- **Missing labels on the card.** They are not taken from payouts [SET-0006].
- **Watching only the ending balance.** The lowest week decides survival. Step 4 flags it.
- **Cutting all ads to save cash.** It can deepen the drop when stock is the problem [FIN-0027]. Step 6 orders the actions.

## Sources

- FIN-6240 (proposed): Shopify Payments US payout timing.
- FIN-6241 (proposed): payouts are net of fees, refunds, disputes and reserves.
- FIN-6242 (proposed): reserves hold part of sales for a set period.
- COG-0008: production plus freight lead times.
- FIN-0005: supplier float equals terms minus lead time.
- SET-0006: Shopify labels are billed to the card, not payouts.
- FIN-0023: supplier net terms as growth funding.
- FIN-0026: push slow stock at break-even for cash.
- FIN-0027: cutting media can deepen a stock-driven cash squeeze.
- FIN-0028: sell-through lifts cash without changing profit.
- FIN-0029: judge growth moves on 60 to 180-day cash.
- FIN-0011: inventory-loan growth can push profit to near zero.

What makes this skill ours: every receipt is timed by the store's measured payout and remittance lag, not by order date; reserved money and labels on the card are handled the way Shopify actually runs them; the lowest week, not the ending balance, drives the actions; and slow stock is treated as cash to release before any borrowing.

## Selling in India

- COD remittances arrive on the courier's cycle; count only orders expected to be delivered (1 minus RTO rate).
- UPI and prepaid settle on the gateway's cycle. Marketplaces deduct tax collected at source.
- GST is paid monthly or quarterly by the store's scheme; keep GST collected out of spendable cash.
