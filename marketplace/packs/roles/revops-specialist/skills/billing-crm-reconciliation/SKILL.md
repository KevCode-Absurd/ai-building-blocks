---
name: billing-crm-reconciliation
description: Maps and reconciles the data flow between the CRM and the billing system (for example HubSpot or Salesforce with Stripe or Chargebee) - closed-won deals against subscriptions and invoices, MRR and churn definitions, plan changes and prorations, failed payments, refunds, credits and disputes - and labels every gap. Use it monthly, before a board or investor report, after a pricing change, or when "the CRM and the accounts don't match". Prepares refunds and billing changes within the client's limits; revenue recognition and tax stay with a qualified accountant.
---

# Billing and CRM reconciliation

## When to use

- Monthly close: does the CRM's closed-won and customer list match billing?
- MRR, churn or customer counts differ between the CRM dashboard and the billing dashboard.
- After a price change, a new plan, a migration or a new billing sync.
- A queue of refund, credit or plan-change requests needs sorting.

## What you need

1. CRM export: closed-won deals with deal ID, company, amount, close date, plan, start date, billing ID if stored, and the customer status field.
2. Billing exports for the same period: customers, subscriptions (status, plan, price, quantity, start, cancel date), invoices, payments, refunds, credit notes and disputes.
3. The billing system's metric settings: in Stripe, whether discounts are subtracted from MRR and when a subscriber counts as active.
4. The client's written rules: when a customer counts as churned (cancelled, unpaid, or past due for how long), and the refund limit for level 3.
5. The list of open requests: refunds, credits, plan changes, cancellations, disputes.

**Access:** level 1 to read both systems; level 2 to build the reconciliation, preview plan changes and write up refunds, credits, write-offs and dispute evidence for approval; level 3 to correct CRM fields from billing (the source of truth for money), apply plan changes the customer requested, and issue refunds up to the client's limit, all within your limits and logged. Refunds above the limit, payments, transfers and bank or payout changes stay with the client. Dispute evidence, write-offs, voided invoices and price increases for existing customers need a fresh yes every time.

## Steps

### 1. Draw the data flow

Write down, for this client:
- Where a customer is first created (CRM deal, checkout, or billing).
- What creates the subscription (a person, a quote tool, a sync, the customer at checkout).
- Which IDs link the systems (CRM company ID stored in billing metadata, billing customer ID stored in the CRM).
- What syncs back to the CRM (subscription status, MRR, last payment, cancellation reason) and how often.
- Who owns each step.

Mark every place where a person retypes data; that is where gaps start.

### 2. Agree definitions before comparing

Write the client's definitions side by side with the billing system's. For Stripe: MRR counts active and past_due subscriptions, excludes tax, free plans and metered usage, and treats cancelled or unpaid subscriptions as churn. If the CRM counts "customers" differently (for example, any company with a closed-won deal ever), say so before showing numbers.

### 3. Match record by record

Join on the shared ID, or on company domain and amount where there is no ID. Label each row:
- **Matched.**
- **Timing:** closed in CRM this month, subscription starts next month.
- **Discount or coupon:** billing price lower than the deal amount.
- **Tax or one-off fees:** included in one system, not the other.
- **Plan change or proration:** mid-cycle change; credits from downgrades are not refunded automatically and upgrade charges may wait for the next invoice.
- **Failed payment:** subscription past due or unpaid after retries.
- **Refund, credit or dispute:** money returned or contested.
- **Cancelled in billing, active in CRM** (or the reverse).
- **No match:** missing record in one system.

### 4. Sort the request queue

For each open request:
- **Refund within the limit:** at level 3, issue it, note the reason, and record it in the CRM. Through Stripe's MCP server, each refund also needs the client's confirmation in the Dashboard within 24 hours. Refunds go back only to the original payment method and take days to arrive, so tell the customer what to expect.
- **Refund above the limit:** prepare it with the reason and evidence, and hand it to the client.
- **Plan change the customer asked for:** preview the proration first; at level 3 apply it and send the approved confirmation.
- **Price increase for existing customers:** prepare the list and the notice draft; flag notice rules (for example, California requires notice before an accepted fee increase) and get a fresh yes.
- **Dispute:** check the deadline (usually 7 to 21 days), gather evidence, check whether a refund is already pending (to avoid paying twice), and get a fresh yes before submitting, because evidence goes in once.
- **Write-off or void:** prepare and get a fresh yes.

### 5. Fix the flow, not just the rows

For each gap type, propose one change: store the billing ID on the CRM company, sync status nightly, make plan and start date required at closed won, or route cancellation reasons into the CRM.

## Checks

- Definitions are written down before any comparison.
- Every unmatched row has a label and an owner.
- No refund above the limit, payment or bank change was made by me.
- Every refund, plan change and CRM correction is logged with what, where, when and result.
- Disputes were not submitted without a fresh yes, and deadlines are listed.
- Revenue recognition, deferred revenue, tax and write-off treatment are marked: ask a qualified accountant, and check this with local rules.

## Output format

1. Summary: totals in each system, the gap, and the three biggest causes.
2. Data flow diagram in words (system, trigger, IDs, owner).
3. Definitions table: client vs billing system.
4. Reconciliation table with labels.
5. Request queue: request, type, amount, limit check, status, next step.
6. Flow fixes with owners.
7. Access I have, actions taken and the action log.
8. Questions for your accountant.

## Example of good output (short)

*Made-up business: Pellow Analytics, a subscription software company using HubSpot and Stripe.*

**Summary.** HubSpot shows 212 active customers; Stripe shows 197 subscribers with positive MRR. Of the 15-customer gap: 9 cancelled in Stripe but still "Customer" in HubSpot, 4 on a 100% coupon (counted as churn in Stripe because discounts are subtracted), 2 with no Stripe record.

| Request | Type | Amount | Limit (200) | Next step |
|---|---|---|---|---|
| R-31 | Refund, duplicate charge | 49 | Within | Issued at level 3, logged; customer told 5 to 10 business days |
| R-34 | Refund, annual plan | 1,188 | Above | Prepared for you to approve and release |
| D-07 | Dispute, "not recognised" | 99 | n/a | Evidence pack ready; due 14 Nov; needs your yes |

**Question for your accountant.** How should the annual plan refund affect deferred revenue this month?
