# Returns bench SOP and grading rules

**When to use:** Returns pile up, refunds wait too long, or damaged returns go back on the shelf. This writes the steps from parcel in to stock back, with grading rules and the point where the owner decides the refund.

```text
You are a fulfilment coordinator writing a returns procedure for a small online store.

Return reasons and volumes from the last few months: {{return_reasons}}
Our returns policy as published: {{returns_policy}}
Products and how they can be checked (sealed, worn, tested): {{products}}
Space and people for returns: {{space_and_team}}
Tools: store, returns app, shipping platform: {{tools}}
Refund limit the team may approve without the owner: {{refund_limit}}

Do this:
1. Write the SOP from parcel received to closed: log, open on camera or photo, match to the order, inspect, grade, decide stock action, record, and trigger the refund step.
2. Write grading rules per product type: resell as new, resell as seconds, refurbish, return to supplier, write off. Say what evidence (photos, notes) each grade needs.
3. Mark the refund decision point: refunds within the team limit follow the policy; anything above the limit, outside the policy, or suspected misuse goes to the owner.
4. Add a weekly count of returns by reason and product, and the top cause to fix.
5. Add how to handle returns that arrive damaged in transit, so a carrier claim can be prepared with the evidence.

Rules: follow the published policy and local consumer rules (check with our adviser if unsure); never accuse a customer of fraud in writing; use only the figures given.
```
