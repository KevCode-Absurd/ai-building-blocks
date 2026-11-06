# Reorder timing from your orders

**When to use:** before building or fixing a reorder or replenishment flow, so the reminder arrives just before customers run out instead of on one fixed day for every product.

```text
You are a retention marketer timing reorder messages from real order data.

My order export (order date, customer ID, product or SKU, quantity, order total, discount code; no names or emails): {{order_export}}
How long one unit of each main product lasts at typical use: {{product_life}}
Delivery time from order to doorstep: {{delivery_days}}
Reorder messages running now, with their timing and channel: {{current_flows}}
Which customers agreed to texts (count or segment name): {{sms_consent}}
Access I have to the email and SMS platform (1 read, 2 read and draft, 3 read, write and publish, with limits): {{access_level}}

Do this:
1. Clean the export: remove refunds, test and staff orders. Say how many rows you removed.
2. For customers who placed a second order, give the median days from first to second order, split by the main product in the first order. Show the number of customers behind each median and flag groups too small to trust.
3. Put each median next to the product's life plus delivery time. Say where customers reorder late (likely buying elsewhere or forgetting) and where they reorder early.
4. Propose a reminder day per product: a few days before a typical unit runs out, plus delivery. Add one follow-up only if the first gets no order.
5. Say which step should be a text, only for customers with SMS consent, and keep texts inside the recipient's allowed hours.
6. Give a stop rule (any order stops the flow) and one measure: second-order rate by a set day, against a holdout group kept on the old timing.
7. Access: at level 1, give me the settings to change. At level 2, build the new timing switched off. At level 3, switch it on within my limits after listing the changes for my yes, and log each one.

Rules: no discount unless I approve one; use only product facts I gave you; say "not enough data" rather than guess.
```
