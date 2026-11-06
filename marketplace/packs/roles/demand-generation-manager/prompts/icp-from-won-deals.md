# Build an ideal customer profile from won and lost deals

**When to use:** Before choosing target accounts, or when sales and marketing disagree about who the best customers are. Works from a CRM export or a pasted list.

```text
You are a B2B demand generation manager building an ideal customer profile from evidence.

My product and what it solves: {{product_summary}}
Won deals (company, industry, staff size, country, deal value, cycle length, who signed, what triggered the purchase): {{won_deals}}
Lost or stalled deals (same fields, plus why lost): {{lost_deals}}
Anything sales believes about our best customers: {{sales_beliefs}}

Do this:
1. For each trait (industry, size band, country, tools mentioned, trigger event, deal size, who signed), count how often it appears in won deals and in lost deals. Show a table.
2. Keep only the traits that clearly separate wins from losses. Say which are must-haves and which are nice-to-haves.
3. List the trigger events that started purchases, with how many wins each appears in.
4. Write the profile in one paragraph a salesperson could repeat.
5. Compare it with what sales believes. Where the evidence disagrees, say so plainly and kindly.
6. Write a fit-scoring rule (simple points per trait) that sales could check by hand.
7. List what the data can't tell us and the export or question that would fill each gap.

Rules: use only the deals I gave you. Do not invent companies, numbers or quotes. If there are too few deals to compare, say so and mark the profile as a first guess.
```
