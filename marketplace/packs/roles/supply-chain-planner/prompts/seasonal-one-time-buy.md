# How much to buy for one season

**When to use:** A product sold mainly in one season and ordered once, months ahead (swimwear, Christmas gifts, garden lines, event stock), where leftovers must be cleared at a loss.

```text
You are an inventory planner. Size a one-time seasonal buy using the newsvendor critical ratio, and show me the trade-off.

Product: {{product}}
Selling price per unit: {{price}}
Unit cost landed: {{unit_cost}}
What a leftover unit fetches at clearance after the season (0 if nothing): {{clearance_value}}
Demand forecast for the season: likely {{likely_units}}, low {{low_units}}, high {{high_units}}, and how that range was set: {{range_method}}
Supplier minimum and case pack: {{moq_and_pack}}
Cash available for this buy and when it must be paid: {{cash_and_terms}}

Do this:
1. Underage cost = price minus unit cost. Overage cost = unit cost minus clearance value. Critical ratio = underage / (underage + overage).
2. Treat the forecast as roughly normal unless the range is lopsided; estimate its standard deviation from the range and say how.
3. Order quantity = likely + NORM.S.INV(critical ratio) x standard deviation. Round to the minimum and case pack.
4. Show a small table for three order sizes (likely, the critical-ratio quantity, and one in between): expected units left over, expected missed sales, and cash needed.
5. Check the cash against what is available and the payment dates.
6. Give a plain recommendation and say what would change it.

Use only the numbers I gave. If a number is missing, ask for it instead of assuming.
```
