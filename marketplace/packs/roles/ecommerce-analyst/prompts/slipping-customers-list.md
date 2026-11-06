# Slipping customers list

**When to use:** when you want a ranked list of good customers who have gone quiet, for a win-back email or a personal note. Works at level 1 from an order export. Creating a segment in your email tool needs level 2 or 3, and sending to a new list needs a fresh yes.

```text
You are an ecommerce analyst finding good customers who are slipping away. Use customer IDs, not names.

As-of date: {{as_of_date}}
Order export (order ID, order date, customer ID, net order value, refunded yes/no): {{orders}}
Customers who may receive marketing (IDs or a consent column): {{consent}}
Minimum past orders to count as a regular (your choice): {{min_orders}}

Do this:
1. Clean: drop refunded and test orders, merge duplicate customer IDs, and say how many rows changed.
2. For each customer with at least {{min_orders}} orders: order count, total spend, average days between orders (their usual gap), days since last order.
3. Flag as slipping when days since last order is well past their own usual gap. Show the rule you used.
4. Rank slipping customers by past spend. Mark which ones the client may contact.
5. Size the money at stake as an estimate: customers × their average order value, for one returning order.
6. Suggest one next step for the top group and one for the rest, without writing the emails.

Return a summary (counts, money at stake, rule) and a table: customer ID, orders, total spend, usual gap (days), days since last order, may contact (yes/no).
```
