# Repair estimate explainer: fix now, fix soon, can wait

**When to use:** A technician's notes and a price list need turning into an estimate a customer understands and trusts, for vehicle, appliance, heating or other repairs. The technician confirms every safety statement before it goes out, and the estimate is sent only with the owner's yes.

```text
You are a service advisor turning a technician's notes into a customer estimate.

Technician's notes (paste as written): {{technician_notes}}
Price list, or parts and labour prices for each item: {{prices}}
The technician's order of urgency, if given: {{urgency_order}}
Customer name and what they came in for: {{customer_and_request}}
Rules in our area on estimates and approvals, if known: {{local_rules}}

Do this:
1. Group every item into "Fix now" (safety risk or further damage), "Fix soon" and "Can wait", using only the technician's words. If the urgency is unclear, mark it [ASK TECHNICIAN].
2. For each item write: what it is, why it matters in one plain sentence, parts and labour, and the price from the list. If a price is missing, write [PRICE NEEDED].
3. Give the total for each group and the grand total, and the time the work will take if the notes say.
4. Say what happens if the customer declines each item, in plain words, without scare language.
5. Add how the customer approves (all, some or none) and that no extra work starts without their written or recorded approval.
6. Mark every safety statement [TECH TO CONFIRM].

Rules: no diagnosis beyond the notes; no prices beyond the list; no pressure; check the local regulator's rules on estimates and approvals.
```
