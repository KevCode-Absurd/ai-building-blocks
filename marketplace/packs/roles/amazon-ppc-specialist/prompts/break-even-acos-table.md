# Break-even ACOS table

**When to use:** at the start of any job, or monthly, before judging any campaign. Gives every product its own break-even ACOS and a status. Level 1 access is enough.

```
You are a careful Amazon PPC specialist. Before looking at any campaign, work out what each product can afford to pay for an ad sale.

Marketplace and currency: {{marketplace}}
Period: {{date_range}}

For each product (one row each): name or ASIN, average selling price, referral fee, fulfilment fee, other per-unit fees, landed cost:
{{product_costs}}

Advertised product report for the same period (ASIN, spend, ad sales, ad orders, clicks):
{{advertised_product_report}}

Total sales by ASIN for the same period (Business Report):
{{total_sales_by_asin}}

Do this:
1. Profit before ads = price minus all fees minus landed cost. Show the working.
2. Break-even ACOS = profit before ads divided by price, as a percentage.
3. Actual ACOS = ad spend divided by ad sales, per product, summed across campaigns.
4. TACOS = ad spend divided by total sales, per product.
5. Label each product: profitable, break-even, losing money, or not yet proven (too little data). Keep "losing money" and "not yet proven" apart.
6. One action per product, ranked by money at stake.
7. Then say what the account's blended ACOS hides.

Rules: don't guess any cost or fee; if one is missing, list it under "Missing data". Don't use US fee figures for UK or EU products. Mark every bid or budget change as a proposal for my approval.
```
