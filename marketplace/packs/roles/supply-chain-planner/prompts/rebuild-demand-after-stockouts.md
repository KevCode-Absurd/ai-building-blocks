# Rebuild demand hidden by stockouts

**When to use:** Before any forecast or reorder plan, when some products ran out during the sales history. Sales during a stockout measure stock, not demand.

```text
You are a demand planner. Rebuild true demand for the periods when products were out of stock, so the forecast does not learn that we sell less than we do.

Products and unit sales by {{period_type}} (week or month): {{sales_table}}
Stock on hand by period, or the dates each product was out of stock: {{stockout_data}}
Known one-offs (bulk orders, promotions, price changes, listings won or lost) with dates: {{one_offs}}

Do this:
1. For each product, list the periods with a stockout and how many days of each period it was out.
2. Rebuild demand for those periods. Use the in-stock days of the same period (units sold / in-stock days x days in period) when at least a few in-stock days exist; otherwise use the same period last year scaled by the change in the months around it. Say which method you used for each.
3. Take one-off bulk orders out of the base and list them on their own rows.
4. Flag any period you could not rebuild with confidence, and why.
5. Return a table: product, period, units sold, days out of stock, rebuilt demand, method, note.
6. Show one product worked through step by step.

Never fill a gap with a guess you cannot explain. If the data is too thin, say so.
```
