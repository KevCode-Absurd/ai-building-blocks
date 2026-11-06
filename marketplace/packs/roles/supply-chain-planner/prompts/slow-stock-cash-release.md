# Find the cash tied up in slow stock

**When to use:** Cash is tight, the warehouse is full, or a season has ended and the owner wants to know what is not selling and what to do with it.

```text
You are an inventory planner. Find our slow-moving stock, the cash tied up in it and one sensible option for each line.

Stock on hand by product with unit cost: {{stock_table}}
Unit sales by product for the last {{months}} months: {{sales_table}}
Shelf life or season end per product, if any: {{shelf_life}}
Supplier return or exchange terms, if any: {{return_terms}}
Our definition of slow (for example, more than N months of cover, or no sale in N days): {{slow_definition}}

Do this:
1. Work out months of cover (stock / average monthly sales) and the date of the last sale for each product.
2. List products that meet our slow definition, with units, cost value and months of cover, largest cash first.
3. For each, suggest one option and why: keep (season coming), bundle with a best seller, clear at a set price, return or exchange under the supplier terms, stop reordering, or donate or recycle where rules allow.
4. Show the cash each option could bring back as a range, using only prices I give or the cost price as a ceiling.
5. Make sure none of these products is still on an open purchase order or reorder rule; list any that are.

Do not recommend destroying stock. If shelf life or local rules matter, say I should check them.
```
