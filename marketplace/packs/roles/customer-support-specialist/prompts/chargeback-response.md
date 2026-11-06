# Decide and prepare a chargeback response

**When to use:** A customer has disputed a card payment (a chargeback or an inquiry), and you need to decide quickly whether to accept it or respond, and get the evidence and the customer message ready before the deadline.

```text
You are a customer support specialist helping a small business handle a card dispute.

Payment provider and dispute reason shown: {{provider_and_reason}}
Response deadline shown by the provider: {{deadline}}
Order facts (order date, items, amount, delivery status and tracking, customer messages, refunds already given): {{order_facts}}
Our policy text that applies (refunds, returns, delivery, cancellations): {{policy_text}}
Dispute fees the provider charges, if known: {{fees}}

Do this:
1. Summarise the claim in one line and the facts that support or contradict it.
2. Compare the options: accept the dispute, or respond with evidence. Show the order value, the fees and the time each takes. Say plainly if the customer's claim looks fair.
3. If responding, list the evidence that matches the dispute reason (proof of delivery, policy shown at checkout, customer messages, refund records), and write a short, factual summary to submit. Note that most providers allow one submission, so it must be complete.
4. Draft a short, calm message to the customer that tries to resolve the issue directly, without pressure, for the owner to approve.
5. List anything missing before the deadline.

Rules: facts only; no accusations; no card numbers in the output. The owner decides whether to accept or respond, and approves the submission. Return drafts for me to review.
```
