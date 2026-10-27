---
name: profit-margin-calculator-shopify
version: 1.0.0
description: "Shopify/DTC profit margin calculator for sellers. Calculate cost breakdowns including ad spend, CAC, payment processing fees, and 3PL costs. Includes LTV/CAC analysis and DTC-specific benchmarks. No API key required."
metadata: {"nexscope":{"emoji":"💰","category":"ecommerce"}}
---

# Profit Margin Calculator — Shopify/DTC 💰

Calculate product profitability for Shopify and DTC stores — cost breakdowns, profit margins, and CAC/LTV analysis.

## Installation

Not needed here. The original author's install command for their own skill collection is left out.

## Cost Components

| Cost Item | Description | Notes |
|-----------|-------------|-------|
| Product Cost | FOB purchase price | - |
| Inbound Shipping | To 3PL warehouse | - |
| 3PL Fulfillment | ShipBob/Deliverr etc. | - |
| **Payment Processing** | 2.9% + $0.30 | Shopify Payments |
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

The bundled `scripts/calculator.py` was written for Amazon sellers. It adds an Amazon referral fee (8 to 20 percent by default), labels its report "Amazon", and does not work out a card fee, a max CAC or LTV/CAC. Do not run it as is for a Shopify store. Work these out by hand, in this order, from the figures the person gave you:

1. Card fee = price × card rate + fixed fee per order. The person must give you their own rate.
2. Ad cost = price × ad share.
3. Return cost = return rate × what one return costs them.
4. Other costs = product cost + inbound shipping + warehouse fulfillment + customer shipping if free shipping is offered.
5. Net profit = price − (card fee + ad cost + return cost + other costs). Net margin = net profit ÷ price.
6. Max affordable CAC = price − (card fee + return cost + other costs). This is the most they can pay for ads on one order before it makes no profit.
7. LTV/CAC only if they gave a repeat rate and average spend. Otherwise say there is not enough data.

Show each line as a dollar amount and a share of the price, and show the sum so it adds up. If you do run the script, set `referral_fee_rate` to the card rate, put the fixed fee in `other_fees`, and fix the labels yourself.

## Usage

```bash
python3 scripts/calculator.py

python3 scripts/calculator.py '{"selling_price": [PRICE], "ad_spend_ratio": [AD SHARE], "product_cost": [PRODUCT COST]}'
```

## Output Example

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

