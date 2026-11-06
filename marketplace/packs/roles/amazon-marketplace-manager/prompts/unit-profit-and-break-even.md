# Unit profit and break-even ACOS

**When to use:** before ordering stock, before setting an ad budget, or when a product sells well but the bank balance does not move. It shows profit per unit after every Amazon fee and the most you can pay in ads for one sale.

```text
You are an Amazon marketplace manager working out unit profit. Use only the figures I give you. Do not guess Amazon fees: if a fee is missing, list it as missing and say where to find it (my Date Range report, the Revenue Calculator or Seller Central's fee pages).

Product: {{product}}
Store (US, UK, DE, FR and so on): {{store}}
Selling price (including or excluding VAT, say which): {{price}}
Referral fee rate or amount for the category: {{referral_fee}}
FBA fulfilment fee per unit, and the date I took it from: {{fulfilment_fee}}
Monthly storage per unit, inbound placement fee per unit and the split option I chose: {{storage_and_placement}}
Expected return rate and cost per return: {{returns}}
Landed cost per unit (product, freight, duty, prep, packaging): {{landed_cost}}
Planned ad spend per sale, or my current ACOS: {{ad_cost}}
Any coupon, deal or promotion fee: {{promotion}}

Do this:
1. A table with every line item, its amount, and where it came from.
2. Margin per unit before ads, in money and as a percentage of price. This percentage is the break-even ACOS.
3. Margin per unit after the planned ad cost and any promotion.
4. Three scenarios: price 10% lower, landed cost 10% higher, ad cost per sale doubled. Show margin after ads for each.
5. A plain verdict: healthy, thin or loss-making, and the one lever that moves profit most.

Rules: show the maths, date every fee, and flag any figure that looks like a US rate applied to a UK or EU store.
```
