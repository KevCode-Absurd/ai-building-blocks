---
name: profit-margin-calculator-shopify
version: 1.0.0
description: "Shopify/DTC profit margin calculator for sellers. Calculate cost breakdowns including ad spend, CAC, payment processing fees, and 3PL costs. Includes LTV/CAC analysis and DTC-specific benchmarks. No API key required."
metadata: {"nexscope":{"emoji":"💰","category":"ecommerce"}}
---

# Profit Margin Calculator — Shopify/DTC 💰

Calculate product profitability for Shopify and DTC stores — cost breakdowns, profit margins, and CAC/LTV analysis.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Org context** (its products part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `foundation/claims.md`, `foundation/dos-donts.md`, `facts.json`, `offers.json`, `voice.md`. Take the claims list with each claim's status, the offer terms word for word, and the real voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your org context. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Installation

Not needed here. The original author's install command for their own skill collection is left out.

## Cost Components

| Cost Item | Description | Notes |
|-----------|-------------|-------|
| Product Cost | FOB purchase price | - |
| Inbound Shipping | To 3PL warehouse | - |
| 3PL Fulfillment | ShipBob/Deliverr etc. | - |
| **Payment Processing** | e.g. 2.9% + $0.30 | Example only: use the rate on your own payment plan |
| **Advertising** | 20-40% | Main cost ⚠️ |
| Return Cost | Return processing | - |
| Customer Shipping | If free shipping offered | Optional |

## DTC Characteristics

- **No platform commission**: Only payment processing fees
- **High ad spend ratio**: 20-40%, main cost driver
- **Requires high margins**: 60%+ gross margin to support ads
- **Focus on LTV/CAC**: Recommended >3

## Key Metrics

> Added by AI Blocks: the ranges in this file (ad spend 20-40%, gross margin 60%+, net margin 15%+, LTV/CAC above 3) are unsourced rules of thumb from the original skill, not facts for every store. Compare them with your own data. Do not state them as benchmarks.

These ranges are unsourced rules of thumb. Never show them as a "recommended" table or as targets. Compare the person's own numbers with their own history instead. A higher repeat rate is better.

## Hand math (use this first)

The bundled `scripts/calculator.py` uses this same cost model (AI Blocks replaced the original Amazon calculator, whose fees and break-even price did not fit a Shopify store). You can run it, or work these out by hand, in this order, from the figures the person gave you:

1. Card fee = price × card rate + fixed fee per order. The person must give you their own rate.
2. Ad cost = price × ad share.
3. Return cost = return rate × what one return costs them.
4. Other costs = product cost + inbound shipping + warehouse fulfillment + customer shipping if free shipping is offered.
5. Net profit = price − (card fee + ad cost + return cost + other costs). Net margin = net profit ÷ price.
6. Max affordable CAC = price − (card fee + return cost + other costs). This is the most they can pay for ads on one order before it makes no profit.
7. LTV/CAC only if they gave a repeat rate and average spend. Otherwise say there is not enough data.

8. Break-even price = (fixed card fee + return cost + other costs) ÷ (1 − card rate − ad share). For a target net margin m, divide by (1 − card rate − ad share − m) instead. If the bottom number is 0 or less, no price works at that ad share: say so.

Show each line as a dollar amount and a share of the price, and show the sum so it adds up.

Check with round numbers: say you sell at $40, product cost $10, inbound $1, fulfillment $4, card 2.9% + $0.30, ads 25%, 5% returns at $8 each. Card fee $1.46, ads $10, returns $0.40, other $15, so net profit is $13.14 (32.9%) and max CAC is $23.14. Break-even price is $15.70 ÷ 0.721 = $21.78; at $21.78 the costs add up to the price.

## Usage

```bash
python3 scripts/calculator.py     # prints the fields and formulas

python3 scripts/calculator.py '{"selling_price": [PRICE], "product_cost": [PRODUCT COST], "card_rate": [CARD RATE], "card_fixed_fee": [FIXED FEE], "ad_spend_ratio": [AD SHARE]}'
```

Shares are decimals (0.25 = 25%). `card_rate` and `card_fixed_fee` are required: use the person's own payment plan. Optional fields: `inbound_shipping`, `fulfillment_fee`, `customer_shipping`, `return_rate`, `cost_per_return`, `other_fees`, `fixed_costs`, `lifetime_orders`, `cac`, `target_margins`.

## Output Example

Show the rows in this order: product cost, fulfillment, card fee, advertising, returns and other costs, then net profit. The rows must add up to the net profit. After the table, add one line for max affordable CAC and one for LTV/CAC. Write "not enough data" for LTV/CAC if the person gave no repeat rate.

```
💰 **Shopify/DTC Profit Analysis Report**

Selling Price         $[PRICE]   100.0%
────────────────────────────────────────
Product Cost          -$[AMOUNT]   [SHARE]%
3PL Fulfillment       -$[AMOUNT]   [SHARE]%
Payment Processing    -$[AMOUNT]   [SHARE]%
Advertising           -$[AMOUNT]   [SHARE]%
Returns and other     -$[AMOUNT]   [SHARE]%
────────────────────────────────────────
Net Profit            $[AMOUNT]   [SHARE]%

💡 Max Affordable CAC: $[AMOUNT]
(All figures are placeholders. Fill them only from the person's own numbers, and make the rows add up to the net profit.)
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Online store pricing planner](https://useaiblocks.com/skills/price-position-planner). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## DTC rules of thumb (the original author's, unsourced)

```
DTC Health Formula:
├── Gross Margin > 60%
├── Ad Spend < 30%
├── Fulfillment < 15%
├── Net Margin > 15%
└── LTV/CAC > 3
```

## vs Amazon (rough figures from the original author; check each platform's current fees)

| Item | Amazon | Shopify/DTC |
|------|--------|-------------|
| Platform fee | 8-15% | 0% |
| Payment fee | Included | 2.9% + $0.30 |
| Ad spend | 10-20% | 20-40% |
| Margin need | 40%+ | 60%+ |
| Traffic | Platform | Self-built |

---

_Vendor footer from the original author (Nexscope AI), an advert that is not part of the answer. Leave it out._

