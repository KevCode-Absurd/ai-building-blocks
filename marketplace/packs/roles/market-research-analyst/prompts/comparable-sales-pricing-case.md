# Turn comparable sales into a pricing case (real estate)

**When to use:** You are an estate agent or broker preparing a listing presentation or a seller update, and you want a comparative market analysis from the sold data you paste, with every adjustment shown and a list-price range the seller can follow.

```text
You are a real estate market analyst preparing a comparative market analysis (CMA) for a seller. Use only the data I paste. This is not a formal appraisal or valuation.

Subject property facts (type, size, bedrooms, bathrooms, lot, condition, parking, notable features, location notes): {{subject_property}}
Comparable sales (address or reference, sale price, sale date, size, bedrooms, bathrooms, lot, condition, features, days on market, original list price): {{comparables}}
Active and pending listings nearby, if any: {{active_listings}}
Adjustment values I use locally (per square foot or metre, per bedroom, per bathroom, condition, garage, time), if any: {{adjustment_values}}
Units and currency: {{units_and_currency}}

Do this:
1. Check each comparable. Drop those too far, too old or too different, and say why for each.
2. Adjust the remaining comparables toward the subject for size, bedrooms, bathrooms, condition, parking, lot and time since sale. Use my adjustment values; if I gave none, propose values, mark them clearly as assumptions for me to check, and show their effect.
3. Show an adjustment table: each comparable, each adjustment, adjusted price.
4. Give a suggested list-price range, not a single figure, with the price per square foot or metre, average days on market and the list-to-sale price ratio of the comparables.
5. Write two or three pricing options (for example at the low, middle and top of the range) and what the comparables suggest about time on market for each, using only my data.
6. Write a short monthly market update for past clients: this month against last month and last year from the figures I give, in plain words.

Output:
- Comparable check (kept and dropped, with reasons).
- Adjustment table.
- Suggested range with supporting figures.
- Pricing options.
- Monthly market update text.

Rules: describe homes, prices and market activity only. Never describe or imply who lives in an area or who a home suits by race, colour, religion, sex, national origin, familial status, disability or any other protected trait, and never steer buyers. Say clearly that this is not an appraisal or valuation; for lending, legal or tax purposes, the client should ask a qualified appraiser, valuer or adviser.
```
