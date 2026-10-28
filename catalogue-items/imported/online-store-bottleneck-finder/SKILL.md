---
name: supply-chain-optimization-shopify
version: 1.0.0
description: "Supply Chain Bottleneck Analyzer for Shopify/DTC stores. Diagnose cash flow, inventory, shipping costs, and customer acquisition efficiency. Includes CAC/LTV analysis, 3PL cost optimization, and unsourced ad spend starting lines. No API key required for basic analysis."
metadata: {"nexscope":{"emoji":"📦","category":"ecommerce"}}
---

# Online store bottleneck finder (Shopify and direct-to-consumer)

Find the one thing holding a Shopify or direct-to-consumer (DTC) store back. Check four areas: cash flow, stock, shipping and logistics cost, and customer acquisition cost against customer value. Name the biggest bottleneck and rank the fixes.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** This skill works from numbers you paste, so no special tool is needed.
- **A spreadsheet:** Lets you check cost per order and try what-if changes.
<!-- /needs -->

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
3. **Check the four areas.** For each, work out the figure from the user's data. Compare it with the user's own target first. If they have none, compare it with the starting planning line in the table below, and say each time that the line is an unsourced starting point, not a fact about stores like theirs.
   - Cash flow: how many days from paying for stock to getting paid back.
   - Stock: days of stock on hand, and how much cash it holds.
   - Shipping and logistics: cost per order as a share of the selling price.
   - Customer acquisition: cost to win a customer (CAC), customer lifetime value (LTV), and LTV divided by CAC.
4. **Place each area** against its line: "meets your target" or "misses your target" when the user gave one, and "inside the planning line" or "outside the planning line" when you used the table. Never call a store healthy or in danger from the table alone. If an area has no data, mark it NOT CHECKED. Do not guess.
5. **Name the one bottleneck.** Pick the area that costs the most profit or ties up the most cash, measured in money from the user's own figures (profit lost per order times orders, or cash held in stock and in the cash cycle). Being outside a planning line is a reason to look, not proof. Use the diagnosis list below to know what to check. Say why in two or three plain sentences, with the numbers. If the figures cannot separate two areas, say so and name what would.
6. **Rank the fixes.** List 3 to 6 fixes. Order them by likely payoff, with the easiest first when payoff is close. For each, say what to do, what it should change, and what number to watch. Label any gain as an estimate and show the inputs behind it. Any payoff figure must be marked as an estimate with the input figures beside it, so it cannot read as a measured result.
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

## Starting planning lines (from the original skill, not sourced)

These are not benchmarks. No study or official source stands behind them. Use them only when the user has no target of their own, tell the user they are unsourced starting points, and let them replace any of them. Margins, shipping cost and ad spend differ a lot by product category, price and stage of growth.

| Measure | Inside the line | Near the line | Outside the line |
|---|---|---|---|
| Gross margin | 60% or more | 50% | 40% or less |
| Shipping and 3PL cost as a share of price | 8% or less | 12% | 18% or more |
| Days of stock | 45 or fewer | 60 | 90 or more |
| Cash cycle in days | 45 or fewer | 70 | 100 or more |
| Net margin | 20% or more | 12% | 5% or less |
| CAC as a share of price | 25% or less | 35% | 50% or more |
| LTV divided by CAC | 3 or more | 2 | 1 or less |
| Ad spend as a share of revenue | 25% or less | 35% | 45% or more |

The original skill also says DTC ad spend is often 20 to 40 percent of revenue, and that gross margin needs to be high to pay for ads. These are unsourced ideas, not findings. Test them against the user's own figures and do not quote them as facts. Do not present any ad price (CPM, CPC) or 3PL fee as current. Ask the user for their own.

## Diagnosis list

Common DTC bottlenecks, in the order to check. Each is a question to test with the user's figures, not a conclusion:

1. High CAC: ads may cost too much for each customer won. Check which CAC it is (paid ads only, or all marketing spend divided by all new customers) and over what period.
2. A low LTV divided by CAC. A low ratio alone does not show which side is the problem. Before you say customers are worth too little, check how LTV was worked out: from revenue or from gross profit, and over what time window. Then check CAC (point 1), repeat rate (point 4) and gross margin (point 5). Say which of these drives the low ratio, with numbers. If LTV or CAC was given without its method, mark the ratio as uncertain and ask how it was worked out.
3. High 3PL or shipping cost: the logistics choice or rates may be poor.
4. Low repeat rate: the store may rely on new customers, which usually cost more to win.
5. Low gross margin: there may not be enough room to pay for ads.

## Output Format

### Bottleneck report for <store>

**The bottleneck:** <one area> because <one or two sentences with the user's numbers>.

**Numbers behind it**
| Measure | Your figure | Your target, or planning line (unsourced) | Position |
|---|---|---|---|
| <measure> | <figure or MISSING> | <the user's target, or the planning line marked "unsourced"> | <meets / misses your target, inside / outside the planning line, or NOT CHECKED> |

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

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
- The [Purchase order and reorder drafter](https://useaiblocks.com/skills/purchase-order-reorder). It takes the plan.
- The [Order hold manager](https://useaiblocks.com/skills/order-hold-manager). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Data access

No API key is needed. Plain numbers from the user are enough. Reading orders, products and stock straight from a Shopify store, or fees from a 3PL such as ShipBob, needs that account's API access. Offer it only if the user has it and wants it. Otherwise ask for an export or the figures.

The `scripts` folder holds the original author's optional Python calculator and report writers. They were built for Amazon-style fees (the field names say FBA), so map the user's fulfillment fees onto those fields and say so. They need the user's own figures as JSON, including `payout_days`, and stop if none are given. Their thresholds are the same unsourced planning lines, so describe their output the same way. Their "Top 3" list is ordered by position against those lines, and their net profit adds a fixed 5% "other cost" guess, so re-rank by money lost (step 5) and replace the 5% with the user's real costs before you report. You do not need them: doing the sums in the chat works as well.

---

Method and planning-line defaults from the Nexscope AI skill `supply-chain-optimization-shopify` (MIT licence). See LICENSE.
