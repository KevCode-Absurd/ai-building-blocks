---
name: saas-metrics-pack
description: Turns a subscription billing export (Stripe, Paddle, Chargebee or CSV) into trusted recurring revenue metrics - MRR movement (new, expansion, contraction, churn, reactivation), logo and revenue churn, net and gross revenue retention, cohort tables, CAC payback and LTV with stated assumptions - plus a one-page metrics sheet with written definitions and three actions. Use it for monthly SaaS or membership reporting, a board pack, before comparing with benchmarks, or when the billing tool's numbers do not match the accounts. It never logs in to billing systems and gives no valuation or fundraising advice.
---

# SaaS metrics pack

## When to use

- Monthly reporting for a software, app or membership business.
- The billing dashboard, the spreadsheet and the accounts show three different MRR numbers.
- Before a board meeting or investor update (the owner sends it).
- Before comparing the business with a published benchmark.
- To find where and when customers leave.

It is management reporting, not revenue recognition for the accounts or investment advice. Check this with local rules and ask a qualified accountant if the question is how revenue is recognised.

## What you need

1. A subscription export: customer ID, plan, price, billing interval, start date, end or cancel date, status, discounts, currency. Or the billing tool's MRR-by-customer-by-month report.
2. Refunds and failed payments for the period.
3. Test and internal accounts to exclude.
4. Sales and marketing spend by month, and new customers by month, if CAC and payback are wanted.
5. Gross margin, or the cost of serving customers, if LTV is wanted.
6. How the business wants to treat discounts, trials, annual plans and usage charges.

**Access:** level 1 is enough for the whole skill: a billing export or read access to the billing or metrics tool. Level 2 lets me save views and segments in the metrics tool; level 3 lets me update the shared metrics dashboard within your limits. Changing plans, prices or subscriptions is not part of this skill.

## Steps

### 1. Write the definitions first

At the top of the sheet: what counts in MRR (monthly-normalised recurring price after or before discounts, excluding tax, one-off fees and usage unless the owner decides otherwise), when a customer is active (start of subscription or first payment), when they have churned (cancelled, or unpaid after the business's grace period), and how trials count. Billing tools differ: Stripe, for example, excludes tax, free plans, metered items and items in trial, counts cancelled or unpaid subscriptions as churn, and lets you choose whether discounts reduce MRR. Match the business's chosen rules and say which tool's defaults differ.

### 2. Clean the data

Remove test accounts and internal users. Mark refunds and chargebacks. Separate failed payments that recovered from real cancellations. Normalise annual and quarterly plans to monthly. Convert currencies at a stated rate. Show what was removed and why.

### 3. Build MRR movement by month

For each month: opening MRR, plus new, plus expansion, plus reactivation, minus contraction, minus churn, equals closing MRR. Opening plus movements must equal closing every month; if not, find the customer causing it.

### 4. Compute churn and retention

- **Logo churn:** customers lost in the month divided by customers at the start (state the denominator; some tools add new customers to it).
- **Revenue churn:** churned plus contraction MRR divided by opening MRR.
- **Net revenue retention (NRR):** MRR now from customers who were active a year ago, divided by their MRR a year ago (includes expansion).
- **Gross revenue retention (GRR):** the same without expansion, so it cannot pass 100%.

### 5. Build cohorts

Rows by signup month, columns by months since signup, showing customers retained and revenue retained. Note where the drop is steepest: the first month, the first renewal, or after a price change.

### 6. Split by group

Plan, price point, billing interval, acquisition channel, country. Find the groups that leave fastest and those that expand.

### 7. CAC, payback and LTV

- **CAC:** sales and marketing spend in a period divided by new customers in that period. State what spend is included.
- **Payback months:** CAC divided by (new customer monthly revenue times gross margin).
- **LTV:** average monthly revenue per customer times gross margin divided by monthly revenue churn, or the owner's chosen method. Mark it as an estimate that is very sensitive to churn.
Show each input and its source.

### 8. Compare carefully

If the owner wants benchmarks, match the definition and segment (contract length, price point, company size) before comparing, name the source and date, and say what differs.

### 9. Three actions

Three actions, each with the metric it should move, by how much the owner hopes, and how to check next month.

## Checks

- Definitions written at the top and applied the same way every month.
- MRR roll-forward ties every month.
- Removals listed.
- Annual plans normalised; tax excluded.
- GRR never above 100%.
- CAC, payback and LTV show inputs and say "estimate".
- Benchmarks matched by definition and segment, with source and date.
- The sheet carries: *Management metrics, not accounting or investment advice. Check this with local rules and ask a qualified accountant about revenue recognition.*

## Output format

1. Definitions box.
2. MRR movement table by month.
3. Churn and retention table.
4. Cohort tables (customers and revenue).
5. Group split: where customers leave and expand.
6. CAC, payback and LTV with inputs.
7. Three actions.
8. Data notes: removals, currency, gaps.

## Example of good output (short)

Made-up business for illustration: Tidepool Bookings, booking software for small studios.

> **Definitions:** MRR after recurring discounts, excluding tax and one-off set-up fees. Annual plans divided by 12. A customer churns when cancelled or unpaid after 14 days (the business's own grace period).
>
> | Month | Opening | New | Expansion | Contraction | Churn | Closing |
> |---|---|---|---|---|---|---|
> | Sep | 41,200 | 2,900 | 800 | -300 | -1,700 | 42,900 |
> | Oct | 42,900 | 3,100 | 600 | -200 | -2,600 | 43,800 |
>
> **Where they leave:** 61% of October's churned MRR came from monthly-plan customers in their first 60 days.
>
> **Action:** test a guided set-up call in the first week for new monthly customers; check first-60-day churn in December.
>
> *Management metrics, not accounting or investment advice. Check this with local rules and ask a qualified accountant about revenue recognition.*
