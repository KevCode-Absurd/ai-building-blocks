# Monthly channel review

**Cadence:** The first week of each month for wholesale reorders, partner activity and payouts; a fuller partner review every quarter.

**Trigger:** Month end, a payout date, a reseller complaint about prices, or a deal registration conflict.

**Access:** On the first run, ask which level the client grants for the store or ordering tool, the CRM, the partner tool, accounting and email, and record it. Until they answer, work at level 1. Steps marked [L2] need read and draft access; [L3] need read, write and publish access within the agreed limits.

## Steps

1. **Pull the month.** Wholesale orders by buyer, overdue invoices, partner referrals and deals, commissions owed (level 1, or exports).
2. **Wholesale reorders.** Run the `reorder-and-account-plan` skill: regroup buyers, list who is due this month, flag overdue accounts before any reorder push. [L2] Draft the messages. [L3] Send the approved messages to the agreed buyers. *Approval: offers outside the agreed range and credit for overdue accounts need a fresh yes.*
3. **Partner activity.** Update the scorecard from the `partner-onboarding-and-scorecard` skill: active or quiet, deals won, time to first deal for new partners.
4. **Conflicts.** Settle any deal registration conflict with the `deal-registration-conflict` prompt. [L3] Record decisions that follow the written rule. *Approval: exceptions to the rule need the client's fresh yes.*
5. **Price complaints.** Run the `resale-price-wording-check` prompt on any reseller complaint about another's prices and on any new document. Flag each complaint to the client; never pass it on as pressure.
6. **Payouts.** [L2] Prepare the payout file: commissions, clawbacks for refunds and cancellations, fund claims with proof, and the working. *Approval: the client checks the file and releases every payment. I never send money or change payout details.*
7. **Disclosure spot check.** Check a sample of partners' public posts for a clear "Ad" or commission label and an accurate description of the product.
8. **Report.** Five-line summary: wholesale revenue and reorders against last month, revenue at risk in slowing accounts, partner-sourced revenue and margin after partner costs, conflicts and complaints, and decisions needed. Quarterly, add the partner review from the skill, step 6.

## Outputs

- Reorder list and messages sent or drafted
- Partner scorecard
- Conflict decisions with reasons
- Price complaint log and checked documents
- Payout file for the client to release
- Disclosure spot-check notes
- Monthly summary and quarterly partner review

## Needs the client's approval

Access levels, offers outside the agreed range, credit for overdue accounts, exceptions to the registration rule, ending a partner, any new list, and every payment. Reseller price complaints always go to the client.
