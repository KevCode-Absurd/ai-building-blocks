---
name: product-margin-analysis
description: Shows which products, orders, channels and discounts really make money after every cost a sale causes, from sales, cost, fee and returns exports. Builds a cost stack per unit and per order, contribution margin by product and channel, a price floor check, the extra sales a discount needs to break even, a list of order types that lose money, and a keep, fix or cut call for each product. Use it for online sellers, wholesalers, makers and food businesses before a price change, a sale, a range review or a new channel. General management accounting practice, not tax or pricing advice.
---

# Product margin analysis

## When to use

- Sales are growing but profit is not.
- A sale, discount code or free-shipping offer is planned.
- The range has grown and the owner suspects some products lose money.
- A new channel (a marketplace, wholesale, a retailer) is on the table.
- The shop's own profit report looks better than the bank balance.

Do not use it to change prices or listings by yourself, to agree prices with competitors, or to decide how stock is valued in the accounts. This is general management accounting practice: check this with local rules and ask a qualified accountant before margins are used for stock valuation, tax or a lender.

## What you need

1. Sales export by order line: date, order ID, product or SKU, quantity, price, discount, shipping charged, channel, refunds.
2. Product costs: purchase cost or bill of materials, inbound freight and duty, packaging. Note the date each cost was last updated.
3. Fees: payment processing, marketplace or platform fees, fulfilment fees, from the fee or payout reports.
4. Outbound shipping cost paid per order, and returns cost (return shipping, items written off).
5. Ad spend by channel or product, if the owner wants contribution after marketing.
6. Fixed costs for the period (rent, salaries, software), for break-even only.

Access: level 1 (read) is enough. A shop or marketplace export plus the fee report is a good start.

## Steps

### 1. Confirm the frame

Period, currency, channels, and whether prices include sales tax or VAT. Strip tax out of prices before any margin work and say so.

### 2. Build the cost stack per unit

For each product, the same order every time: product cost, inbound freight and duty, packaging, payment fee, platform or marketplace fee, fulfilment, outbound shipping paid (net of shipping charged), returns allowance, and ad cost per sale if included. Mark each line as actual, from a fee table, or estimated. Shop profit reports often use only the recorded product cost, so check what yours includes before trusting it.

### 3. Compute contribution per unit and per order

Contribution per unit = net price minus every variable cost in the stack. Contribution margin = contribution / net price. Then per order: small orders, free-shipping orders, discounted orders and returned orders behave differently from the average. Show the maths for three sample orders so the owner can check.

### 4. Rank by total contribution

Rank products by total contribution for the period, not by margin percentage. A low-margin, high-volume product can pay the rent; a high-margin product that sells twice a year cannot.

### 5. Price floor check

For any price being considered: the lowest price that still covers every variable cost, and the price that hits the owner's target contribution. Mark pass or fail and show the gap.

### 6. Discount and sale check

New contribution per unit after the discount, and the sales volume needed to earn the same total contribution as today:
required units = current units x current contribution per unit / new contribution per unit.
If the new contribution per unit is zero or negative, no volume makes it pay. Suggest cheaper levers: a bundle, a spend threshold, a gift with purchase, or a smaller discount on a narrower range.

### 7. Find the order types that lose money

Group orders by size band, shipping method, discount code and return status. Show which groups have negative contribution and how many orders fall in each.

### 8. Keep, fix or cut

One line per product: keep, fix (raise price, cut a cost, change pack size, change minimum order) or cut. Before "cut", check which fixed costs would really go and whether customers buy it with other products.

### 9. Optional: set up the tracking

At level 2, I can add a draft margin report or a draft cost-per-item update for the owner to review. At level 3, and only within the limits the client set, I can update cost fields or report settings in the shop or accounting tool. Price and listing changes stay with the owner unless they explicitly include them in the level 3 limits. I log every action.

## Checks

- Prices are net of sales tax or VAT, and the period and currency are stated.
- Every product uses the same cost stack in the same order.
- Each cost line is marked actual, fee table or estimate; no missing cost is filled in silently.
- Totals tie to sales and cost of sales in the profit and loss, with any gap shown.
- Ranking is by total contribution; margin percentage is shown beside it.
- Discount maths shows current and required volume.
- The report carries the line: *General management accounting practice: check this with local rules and ask a qualified accountant before margins are used for stock valuation, tax or a lender.*

## Output format

1. Summary: total contribution, the three products and two order types that matter most, and the biggest fix.
2. Cost stack table per product with sources for each line.
3. Contribution table ranked by total contribution.
4. Price floor and discount checks for any price or offer being considered.
5. Order types that lose money, with counts.
6. Keep, fix or cut list with one reason each.
7. Missing costs and questions.

## Example of good output (short)

Made-up business for illustration: Kettle & Crumb, an online tea shop.

> **Loose-leaf tin, 100 g, net price 12.00.** Cost stack: tea and tin 3.10 (supplier invoice, Sep), packaging 0.45, payment fee 0.42 (fee report), platform fee 0.24, shipping paid net of shipping charged 1.10, returns allowance 0.15 (estimate). Contribution 6.54 per unit, 54.5%.
>
> **Planned 25% off sale.** Net price 9.00, payment fee falls to 0.32 with the lower price: contribution 3.64. Last month 800 tins earned 5,232. To earn the same at 3.64 you need 1,438 tins, 80% more. Alternative: 10% off for email subscribers only. Net price 10.80, payment fee 0.38, contribution 5.38; you need 973 tins (22% more) to match.
>
> **Order type that loses money.** Single-sachet orders under 8.00 with free shipping: 312 orders, contribution -1.80 each. Fix: a minimum order for free shipping.
>
> *General management accounting practice: check this with local rules and ask a qualified accountant before margins are used for stock valuation, tax or a lender.*
