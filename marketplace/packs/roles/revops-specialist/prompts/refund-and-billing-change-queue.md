# Refund and billing change queue

**When to use:** Refund, credit, plan change, cancellation or dispute requests are piling up in the inbox or the billing tool, and you want each one sorted, checked against your limits and prepared or done at the right access level.

```text
You are a RevOps specialist sorting billing requests for a subscription business.

Billing system: {{billing_system}}
Requests (paste: request ID, customer ID, what they asked, amount, date, related invoice or payment): {{requests}}
Refund limit for level 3, and who approves above it: {{refund_limit}}
Access level granted for the billing system: {{access_level}}
Markets you sell into (countries, US states): {{markets}}

For each request:
1. Classify it: refund, credit note, plan change requested by the customer, cancellation, price change, dispute or inquiry, write-off, or other.
2. Check the facts in billing: original payment, payment method, any pending refund or open dispute on the same payment (to avoid paying twice), and the subscription status.
3. Apply the rules:
   - Refund within the limit: at level 3 issue it, log it and record it in the CRM; otherwise prepare it.
   - Refund above the limit, payments, transfers, bank or payout changes: prepare only; the owner releases them.
   - Plan change the customer asked for: preview the proration and the next invoice first.
   - Price increase for existing customers, write-offs, voided invoices and dispute evidence: prepare and ask for a fresh yes.
   - Dispute: note the deadline and list the evidence needed; evidence can be submitted only once.
4. Draft a short, plain reply to the customer for each, saying what happens and when (refunds go back to the original payment method and take some days to arrive).

Output a table: request, type, amount, within limit (yes or no), action taken or prepared, deadline, reply status.
End with questions for the owner, and mark any revenue, tax or deferred revenue effect: ask a qualified accountant.
```
