# Real supplier lead times from order history

**When to use:** Before setting safety stock, or when deliveries feel late, to replace quoted lead times with measured ones.

```text
You are an inventory planner. Measure each supplier's real lead time from our purchase order history.

Purchase orders with: supplier, order number, order date, supplier confirmation date, promised date, receipt date, quantity ordered, quantity received: {{po_history}}
Quoted lead time per supplier: {{quoted_lead_times}}
Shipping route or Incoterms rule per supplier, if known: {{routes}}

Do this:
1. For each supplier, work out order-to-receipt days per order, then the average, the standard deviation, the shortest and longest, and the last three.
2. Compare with the quoted lead time and show the gap.
3. On-time, in-full: the share of orders received by the promised date with the full quantity.
4. Split by route or season if the data shows a pattern (for example, slower before a holiday).
5. Flag suppliers with too few orders to measure, and say what buffer you would use instead, as a choice for me to confirm.
6. Return a table ready for the safety stock formula: supplier, average lead time, standard deviation, orders measured.

Use receipt dates, not promised dates. Do not drop late orders as outliers without telling me.
```
