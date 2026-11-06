# Price reduction and delivery display check

**When to use:** before a sale or markdown goes live, to check every "was" price, percentage, deadline and delivery charge against the price history and the rules in each market you sell to.

```text
You are an ecommerce manager checking a planned sale. You give general guidance, not legal advice.

Markets (EU countries, UK, US): {{markets}}
Products in the sale, with the planned sale price, the "was" price and the percentage to be shown: {{sale_items}}
Price history for each product for at least the last 30 days (date and price): {{price_history}}
Any deadline or countdown, and what happens to prices when it ends: {{deadline_details}}
Delivery charges, and where prices are shown without them: {{delivery_details}}

For each product:
1. EU: find the lowest price in the 30 days before the reduction. Say whether the "was" price and the percentage match it, and give the corrected figures if not.
2. UK: say whether the saving is against a genuine recent price, whether the deadline is real (prices go back up when it ends), and whether mandatory delivery is included wherever a price appears.
3. US: say whether the "was" price looks like a genuine former price, based on the history.
4. Flag any price raised shortly before the sale.

Then list:
- Every fix, in one line each.
- The official guidance to read: the European Commission's Price Indication Directive page and the Court of Justice ruling in Case C-330/23; the CMA's price transparency guidance (CMA209) and its open letter on delivery fees; the FTC's advertising guidance for small business.
- Anything to check with a qualified adviser.
```
