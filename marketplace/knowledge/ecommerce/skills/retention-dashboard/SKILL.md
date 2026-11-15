---
name: retention-dashboard
description: "A monthly retention sheet with eight defined numbers: second-order rate at 60 and 90 days by first-order month, median days to second order, 12-month repeat rate, returning-customer gross profit and its share, gross profit per customer at 90 and 365 days, active and lapsed customer counts, and attributed email and SMS revenue labelled as attributed. Each number has its formula, source export, target and the action when it misses. Replaces Shopify's returning customer rate, which rises when acquisition slows. Use at each month end, when the owner tracks retention with one misleading number, or when setting retention targets for the email and post-purchase teams."
---

# Retention dashboard

**You get:** a one-page monthly sheet of eight retention numbers, each with a written formula, the export it comes from, a target set from the store's own history, a green or red mark, and the action to take when it misses, plus a short data-confidence line.

## When to use

- The owner tracks retention with Shopify's returning customer rate and it moves for the wrong reasons.
- Email, SMS and post-purchase work is running, and nobody can say whether more customers come back.
- The team needs retention targets to plan the month.
- Once a month, at month end, alongside the profit report.

## Not for

- A one-off deep cohort study by first product and channel: use `cohort-repeat-and-ltv-analysis`.
- The weekly numbers that run the whole store: use `build-weekly-kpi-dashboard`.
- The full monthly report with ads, sessions and profit: use `monthly-store-performance-report`.
- Setting the CAC a customer is worth: use `cohort-repeat-and-ltv-analysis`, then `store-meta-math`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, 24 months if available: Name, Email, Phone, Created at, Financial Status, Fulfillment Status, Subtotal, Discount Amount, Shipping, Refunded Amount, Lineitem sku, Lineitem quantity, Cancelled at.
2. **Gross profit per order** from `build-sku-profit-sheet` (landed cost, shipping, fees, returns).
3. **Email and SMS tool report** for the month: attributed revenue from flows and campaigns, recipients, unsubscribes.

Optional: subscription export, failed delivery list (where pay on delivery is offered), marketplace orders by customer.

A store under 12 months old fills the 60 and 90-day rows only and marks the rest "not yet readable". Building the sheet needs read access only; no client approval is needed until actions are taken.

## Before you start: the gates

1. **Gross profit per order.** Pass when known. Fail: fill revenue rows and leave gross profit rows blank with "needs costs", rather than using product margin, which can overstate true gross margin by a wide gap [MEA-0023].
2. **Clean orders.** Cancelled, test, staff and fully refunded orders removed. Failed deliveries removed too: a refused or returned-to-sender parcel is not a purchase.
3. **One customer key.** Email, or phone in one format (with country code) for buyers without email. Duplicate customers make repeat rate look worse than it is.
4. **Cohort age.** Only cohorts that have had the full window count. A 90-day number needs first orders at least 90 days old.

## Steps

### 1. Build the cohort table once

Tag each customer with their first-order month. For each later order, note days since the first order. This one table feeds every number below. Refresh it on the first working day of each month.

### 2. Fill the eight numbers

| # | Number | Formula | Why |
|---|---|---|---|
| 1 | Second-order rate, 60 days | Customers with a second order within 60 days of the first, divided by customers in that first-order month (cohort 60+ days old) | Most second purchases happen within 30 days of the first [EML-0062]; 60 days catches the bulk |
| 2 | Second-order rate, 90 days | Same at 90 days | Fairer for slower products |
| 3 | Median days to second order | Median gap for customers who made a second order in the last 12 months | Sets reminder and win-back timing |
| 4 | 12-month repeat rate | Customers acquired 12 to 24 months ago with 2 or more orders in their first 12 months, divided by all customers acquired then | The honest yearly repeat number |
| 5 | Returning-customer gross profit | Gross profit this month from customers whose first order was before this month; and its share of all gross profit | Returning profit can hide a loss on new customers; split the two [MEA-0055] |
| 6 | Gross profit per customer, 90 and 365 days | Cohort gross profit to day 90 or 365, divided by cohort size, beside first-order gross profit | Shows how much value grows after the first order |
| 7 | Active and lapsed customers | Active: last order within 2 x number 3. Lapsed: beyond that | Size of the base retention works on |
| 8 | Attributed email and SMS revenue from returning customers | From the email tool, labelled "attributed" | Attributed revenue is not proof of extra sales [EML-0056] |

Do not use Shopify's returning customer rate as a retention number. It compares returning orders to all orders in the window, so it rises when new-customer acquisition slows and falls when the store scales [MEA-0014] [MEA-0021]. If the owner wants it on the page, put it in a grey row labelled "not a repeat rate".

Order value for returning customers: use subtotal minus discounts, and note that Shopify's dashboard order value leaves out shipping [MEA-0013].

### 3. Set targets from the store's own history

For numbers 1 to 6: target = the store's own best rolling three-month level in the last 12 months, or the trailing average plus a set step (practitioner default: 10% relative, test it), whichever is lower. Write the target beside the number.

Reference, not target: in one cross-brand data set, 365-day gross profit grew over the first order by about 55% for fashion, about 110% for CPG and supplements, and near zero for furniture and homewares [MEA-0052]. Use it to sanity-check what is possible for the category, not as the store's goal.

Mark seasonal cohorts: November buyers repeated less than February buyers in a 10-brand sample, though not at every brand [MEA-0035]. Compare a November cohort with last November, not with October.

### 4. Write the action for each miss

| Number misses | First thing to check | Hand off to |
|---|---|---|
| 1 or 2 | Post-purchase flow live and triggering; delivery delays; discount-led cohort | `post-purchase-repeat-sequence` |
| 3 rising | Reminder timing, stock-outs on repeat SKUs | `replenishment-reminder-timing` |
| 4 | Product fit, reviews, returns by SKU | `cohort-repeat-and-ltv-analysis` |
| 5 share rising while new customers fall | Acquisition, not retention, is slipping | `monthly-store-performance-report` |
| 6 | Order value of repeat orders, discount depth on repeat sends | `plan-monthly-email-calendar` |
| 7 lapsed rising | Win-back running and sized | `win-back-lapsed-customers` |
| 8 up while 1 to 6 flat | Sends are claiming sales, not adding them | `email-ab-test-plan` with a holdout |

### 5. Add the money view

Improvements in repeat rate pay out over months, so read them on 60 to 180-day cash, not 30 days; in one model, lifting repeat revenue share from 25% to 35% added meaningful monthly net income [FIN-0029]. Put one line at the top: "Gross profit from returning customers this month vs same month last year".

### 6. Data confidence line

At the bottom: date range, orders removed and why, share of customers matched by phone only, months not yet readable, and any number built on revenue because costs were missing.

### 7. Market notes

- **Pay on delivery:** where the store offers it, remove failed deliveries before every calculation, and report repeat rate for prepaid and pay-on-delivery first orders separately; they often repeat differently.
- **Marketplaces (any country):** if the store sells on Amazon or another marketplace too, repeat buyers may reorder there; the Shopify view will under-count them. Say so in the confidence line.

## Checks before you hand it over

- Every number has a written formula and its source export.
- Only cohorts old enough for each window are counted.
- Shopify's returning customer rate is not used as repeat rate.
- Gross profit rows use delivered costs, or say "needs costs".
- Each number has a target from the store's own history and a miss action.
- Attributed revenue is labelled attributed.
- Failed deliveries, test, staff and cancelled orders are out.
- The data-confidence line is filled.

## Output

1. **One-screen summary:** the eight numbers this month against target (green or red), the two that moved most and why, and the one action for next month with an owner.
2. **Dashboard sheet** (`retention-dashboard.xlsx` or Google Sheet) with columns: Number, Definition, Source, This month, Last month, Same month last year, Target, Status, Action if missed, Owner.
3. **Cohort tab:** First-order month, Customers, 60-day second-order rate, 90-day rate, 12-month repeat rate, Gross profit per customer day 0, 90, 365.
4. **Data-confidence line.**

## Common mistakes

- **Using Shopify's returning customer rate.** Step 2 replaces it with cohort numbers.
- **Counting young cohorts.** Gate 4 waits until each window has closed.
- **Revenue in place of gross profit.** Gate 1 says "needs costs" instead.
- **Benchmarks as targets.** Step 3 sets targets from the store's own history.
- **Comparing November with October.** Step 3 compares like with like.
- **Celebrating attributed email revenue.** Number 8 is labelled, and step 4 checks it against real repeat numbers.

## Sources

- MEA-0014, MEA-0021: Shopify's returning customer rate is not a repeat rate.
- MEA-0013: Shopify's dashboard order value leaves out shipping.
- MEA-0023: product margin is not gross margin.
- MEA-0055: split first-time and returning customer profit.
- MEA-0052: 365-day gross profit lift by vertical.
- MEA-0035: November cohorts can repeat less.
- EML-0062: most second purchases happen within 30 days.
- EML-0056: attributed email revenue is not incremental.
- FIN-0029: judge repeat improvements on 60 to 180-day cash.

What makes this skill ours: Shopify's returning customer rate is replaced with cohort numbers that only count windows that have closed; returning-customer gross profit sits beside new-customer profit so one cannot hide the other; targets come from the store's own best months, not borrowed benchmarks; and each miss points to the exact skill that fixes it.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Remove RTO orders before every calculation: a refused COD parcel is not a purchase. Report repeat rate for prepaid and COD first orders separately, since COD first-time buyers often repeat differently.
