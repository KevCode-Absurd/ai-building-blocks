---
name: supply-chain-optimization-shopify
version: 1.0.0
description: "Supply Chain Bottleneck Analyzer for Shopify/DTC stores. Diagnose cash flow, inventory, shipping costs, and customer acquisition efficiency. Includes CAC/LTV analysis, 3PL cost optimization, and ad spend benchmarks. No API key required for basic analysis."
metadata: {"nexscope":{"emoji":"📦","category":"ecommerce"}}
---

# Online store bottleneck finder (Shopify and direct-to-consumer)

Find the one thing holding a Shopify or direct-to-consumer (DTC) store back. Check four areas: cash flow, stock, shipping and logistics cost, and customer acquisition cost against customer value. Name the biggest bottleneck and rank the fixes.

## When to use it and when not to

Use it for a store that already sells and has real numbers: revenue, product cost, shipping, ad spend, stock.

Do not use it for:
- A store with no sales yet. There are no numbers to diagnose.
- A marketplace-only seller (Amazon, Walmart). The fee structure here does not fit.
- A problem inside one warehouse, such as picking methods. Use the Pick, pack and ship improver.
- A full profit-by-product view. Use the Store profit margin calculator.

## What you hand back

One report in the layout under "Output Format". It names the bottleneck, shows the numbers behind it, and ranks the fixes.

## Steps

1. **Collect the inputs.** Use the list under "Input data". Ask once, in one message, for anything missing. The must-haves are selling price (or average order value), product cost, shipping and fulfillment cost per order, and ad spend. Mark every other gap MISSING. Never invent a figure. If the user pastes a Shopify export or a spreadsheet, read the figures from it and say which file each came from.
2. **Work out the cost per order.** Use the cost structure below. Show each line as money per order and as a share of the selling price. Payment fees are the percent plus the fixed amount the user's own payment provider charges. Ask if unsure.
3. **Check the four areas.** For each, work out the figure from the user's data and compare it with the rule of thumb in the table below. Say clearly that these are rough rules of thumb, not facts for every store.
   - Cash flow: how many days from paying for stock to getting paid back.
   - Stock: days of stock on hand, and how much cash it holds.
   - Shipping and logistics: cost per order as a share of the selling price.
   - Customer acquisition: cost to win a customer (CAC), customer lifetime value (LTV), and LTV divided by CAC.
4. **Rate each area** healthy, warning or danger against the rule of thumb. If an area has no data, rate it NOT CHECKED. Do not guess a rating.
5. **Name the one bottleneck.** Pick the area that does the most damage to profit or cash, using the diagnosis list below. Say why in two or three plain sentences, with the numbers.
6. **Rank the fixes.** List 3 to 6 fixes. Order them by likely payoff, with the easiest first when payoff is close. For each, say what to do, what it should change, and what number to watch. Label any gain as an estimate and show the inputs behind it.
7. **Say what you could not check** and what the user could bring next time to close the gaps.

## Input data

```
Sales
- Average selling price: ___
- Average order value (AOV): ___
- Payment fee: ___% + ___ per order

Logistics (your own shipping or a 3PL)
- Fulfillment fee per order: ___
- Storage fee per unit per month: ___
- Receiving fee per case: ___
- Inbound shipping to the warehouse: ___

Stock and cash
- Product cost per unit: ___
- Days of stock on hand: ___
- Days to pay your supplier, and days until you receive sales money: ___

Marketing
- Ad spend as a share of revenue: ___%
- Customer acquisition cost (CAC): ___
- Customer lifetime value (LTV): ___
- Repeat purchase rate: ___%
```

## Cost structure

```
Selling price
- Product cost
- Inbound shipping (to the warehouse)
- 3PL storage fee (for example ShipBob, if you use one)
- 3PL fulfillment fee
- Payment processing (percent plus fixed amount)
- Shopify subscription (spread across orders)
- Advertising (Meta, Google, TikTok): usually the key cost
= Net profit
```

Net profit = price - product cost - shipping - payment fee - ad spend - operating cost.

## Rules of thumb (rough defaults from the original skill, not sourced)

Tell the user these are starting points to check against their own category and margins. Let them replace any of them.

| Measure | Healthy | Warning | Danger |
|---|---|---|---|
| Gross margin | 60% or more | 50% | 40% or less |
| Shipping and 3PL cost as a share of price | 8% or less | 12% | 18% or more |
| Days of stock | 45 or fewer | 60 | 90 or more |
| Cash cycle in days | 45 or fewer | 70 | 100 or more |
| Net margin | 20% or more | 12% | 5% or less |
| CAC as a share of price | 25% or less | 35% | 50% or more |
| LTV divided by CAC | 3 or more | 2 | 1 or less |
| Ad spend as a share of revenue | 25% or less | 35% | 45% or more |

The original skill also says DTC ad spend is often 20 to 40 percent of revenue, and that gross margin needs to be high to pay for ads. Treat these as general ideas to test against the user's own figures. Do not present any ad price (CPM, CPC) or 3PL fee as current. Ask the user for their own.

## Diagnosis list

Common DTC bottlenecks, in the order to check:

1. High CAC: ads cost too much for each customer won.
2. LTV divided by CAC below 3: a customer is not worth enough to cover the cost of winning them.
3. High 3PL or shipping cost: poor logistics choice or rates.
4. Low repeat rate: relying on new customers, which costs more.
5. Low gross margin: not enough room to pay for ads.

## Output Format

### Bottleneck report for <store>

**The bottleneck:** <one area> because <one or two sentences with the user's numbers>.

**Numbers behind it**
| Measure | Your figure | Rule of thumb | Rating |
|---|---|---|---|
| <measure> | <figure or MISSING> | <healthy value> | <healthy / warning / danger / NOT CHECKED> |

**Cost per order**
| Line | Per order | Share of price |
|---|---|---|
| <product cost, shipping, fees, ads, other> | <amount> | <percent> |
| Net profit | <amount> | <percent> |

**Fixes, ranked by payoff**
| Rank | Fix | What it should change | Number to watch | Estimate and inputs |
|---|---|---|---|---|

**What I could not check:** <list of MISSING items>

**Next step:** <one action for this week>

## Data access

No API key is needed. Plain numbers from the user are enough. Reading orders, products and stock straight from a Shopify store, or fees from a 3PL such as ShipBob, needs that account's API access. Offer it only if the user has it and wants it. Otherwise ask for an export or the figures.

The `scripts` folder holds an optional Python calculator and report writers. Use them only if code can run. Run with no input, the calculator uses built-in sample figures, so never report its output unless you passed the user's own figures. If you cannot run code, do the sums in the chat.

---

Method and benchmark defaults from the Nexscope AI skill `supply-chain-optimization-shopify` (MIT licence). See LICENSE.
