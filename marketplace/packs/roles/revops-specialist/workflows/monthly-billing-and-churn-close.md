# Monthly billing and churn close

**Cadence:** The first working days of each month, before finance closes the books or the owner sends a board or investor update.

**Access:** Set at the start, per tool (see `access.md`). Until you choose, I work at level 1.

## Steps

1. **Freeze the period.** Agree the cut-off date and time zone with finance (billing reports may use UTC while dashboards use the account's time zone).
2. **Reconcile CRM and billing.** Run the `billing-crm-reconciliation` skill for the month: closed-won vs new subscriptions, cancellations vs CRM status, MRR by the agreed definition. Label every gap. At level 3, correct CRM status and MRR fields from billing within your limits and log each change.
3. **Failed payments.** List subscriptions past due or unpaid, with retry status and hard declines that need a new payment method. Draft the customer reminders. At level 3, send the approved reminder templates to the customers' known billing contacts.
4. **Refunds, credits and disputes.** Clear the queue with the `refund-and-billing-change-queue` prompt. Refunds within the limit at level 3; everything else prepared for you. List open disputes with deadlines.
5. **Churn and cancellation reasons.** Group the month's cancellation reasons from billing and CRM notes. Every quarter, run the `win-loss-review` prompt across lost deals and cancellations together.
6. **Metrics pack.** One page: new, expansion, contraction and churned MRR; customer counts; failed-payment recovery; refunds; open disputes. Each figure with its definition and source.
7. **Questions for the accountant.** List revenue recognition, deferred revenue, tax and write-off questions raised during the close.

## Outputs

- Reconciliation table with labelled gaps
- Failed-payment list and reminder drafts (sent at level 3)
- Cleared request queue with actions done or prepared
- Cancellation reason summary
- One-page metrics pack with definitions
- Questions for a qualified accountant
- Action log (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation:** correcting CRM fields from billing, sending approved payment reminders to known billing contacts, and refunds up to your limit.

**Always needs a new yes:** refunds above the limit, dispute evidence, write-offs and voided invoices, price changes for existing customers, and any message to a new audience. Payments, transfers and bank or payout changes stay with you; I prepare them at level 2.
