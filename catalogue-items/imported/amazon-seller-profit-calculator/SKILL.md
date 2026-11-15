---
name: profit-margin-calculator-amazon
description: "Amazon profit margin calculator for sellers. Calculate cost breakdowns, profit margins, break-even points, and get pricing recommendations. Supports single product analysis and batch calculations. Input product cost, shipping, FBA fees, and get instant profitability analysis. No API key required. Use when: (1) evaluating new product profitability before sourcing, (2) diagnosing existing product margins, (3) adjusting pricing strategy, (4) analyzing multiple SKUs at once."
metadata: {"nexscope":{"emoji":"💰","category":"ecommerce"}}
---

# Profit Margin Calculator — Amazon 💰

Calculate product profitability for Amazon FBA sellers — cost breakdowns, profit margins, break-even analysis, and pricing recommendations. No API key required.

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

```bash
npx skills add nexscope-ai/eCommerce-Skills --skill profit-margin-calculator-amazon -g
```

## Use Cases

| Scenario | What You'll Get |
|----------|-----------------|
| **New product evaluation** | Profitability forecast before sourcing |
| **Existing product diagnosis** | Margin analysis with cost breakdown |
| **Pricing adjustment** | Recommended prices for target margins |
| **Batch SKU analysis** | Multi-product comparison table |

## Usage Examples

### Single Product Analysis

```
Calculate profit for my Amazon product:
- Selling price: $29.99
- Product cost: $6
- Shipping to FBA: $1.50
- FBA fulfillment fee: $5.50
- FBA storage: $0.30/month
- Ad spend: 10% of sales
- Category: Kitchen
```

### Quick Analysis

```
Is this product profitable?
Price $19.99, cost $5, FBA fee $4.50, shipping $1
```

### Batch Analysis

```
Analyze these SKUs:
A001, Yoga Mat, $29.99, cost $6, shipping $1.5, FBA $5.5
A002, Resistance Bands, $19.99, cost $3, shipping $0.8, FBA $4
A003, Foam Roller, $24.99, cost $8, shipping $2, FBA $6
```

---

## Input Parameters

### Required

| Parameter | Description | Example |
|-----------|-------------|---------|
| `selling_price` | Amazon listing price | $29.99 |
| `product_cost` | FOB/sourcing cost per unit | $6.00 |
| `fba_fee` | FBA fulfillment fee | $5.50 |

### Recommended

| Parameter | Description | Default |
|-----------|-------------|---------|
| `shipping_cost` | Inbound shipping per unit | $0 |
| `storage_fee` | Monthly FBA storage per unit | $0.30 |
| `ad_ratio` | PPC spend as % of sales | 10% |
| `category` | Product category for referral fee | default (15%) |

### Optional

| Parameter | Description | Default |
|-----------|-------------|---------|
| `return_rate` | Expected return rate | 3% |
| `other_fees` | Packaging, labels, etc. | $0 |

---

## Cost Components

| Cost Item | Description | Calculation |
|-----------|-------------|-------------|
| **Product Cost** | FOB purchase price | User input |
| **Inbound Shipping** | Sea/air freight to FBA | User input |
| **FBA Fulfillment** | Amazon pick, pack, ship | User input |
| **FBA Storage** | Monthly warehouse fee | User input |
| **Referral Fee** | Amazon commission (8-20%) | Auto × category rate |
| **Advertising** | PPC spend | Price × ad ratio |
| **Returns** | Return processing loss | Return rate × (return handling fee + half the product cost, an assumed loss per returned unit) |
| **Other Fees** | Packaging, labels, prep | User input |

---

## Referral Fee Rates by Category

| Category | Rate |
|----------|------|
| Electronics / Computers | 8% |
| Camera / Photo | 8% |
| Automotive / Industrial | 12% |
| **Most Categories (default)** | **15%** |
| Clothing / Apparel | 17% |
| Jewelry | 20% |

These are simplified flat rates. Amazon charges the greater of the category percentage or a per-item minimum fee, and some categories are tiered by price. Check the current rates in Amazon's Selling on Amazon fee schedule (https://sellercentral.amazon.com/gp/help/external/200336920) and pass the right rate as `referral_fee_rate`.

---

## Output Format

### Cost Breakdown

```
Selling Price         $29.99   100.0%
───────────────────────────────────────
Product Cost          -$6.00    20.0%
Inbound Shipping      -$1.50     5.0%
FBA Fulfillment       -$5.50    18.3%
FBA Storage           -$0.30     1.0%
Referral Fee (15%)    -$4.50    15.0%
Advertising (10%)     -$3.00    10.0%
Returns (3%)          -$0.15     0.5%
Other Fees            -$0.50     1.7%
───────────────────────────────────────
Total Cost            $21.45    71.5%
Net Profit            $8.54     28.5%
```

### Break-Even Analysis

```
Break-even Price:     $18.60
Current Margin:       +61.2% above break-even
Safety Margin:        38.0%
```

How it is worked out: the referral fee and ad spend are both a share of the price, so the break-even price is the flat per-unit cost divided by what is left after those shares. Flat cost here = $6.00 + $1.50 + $5.50 + $0.30 + $0.50 + $0.15 returns = $13.95. Break-even = $13.95 ÷ (1 − 15% − 10%) = $18.60. At $18.60 the referral fee is $2.79 and ads are $1.86, so profit is $0.00.

### Pricing Recommendations

Price for a target net margin = flat cost ÷ (1 − target margin − referral rate − ad rate). For 20%: $13.95 ÷ 0.55 = $25.36.

```
| Target Margin | Recommended Price | Profit/Unit |
|---------------|-------------------|-------------|
| 15%           | $23.25            | $3.49       |
| 20%           | $25.36            | $5.07       |
| 25%           | $27.90            | $6.98       |
| 30%           | $31.00            | $9.30       |
```

If the referral rate plus ad rate is 100% or more of the price, no price breaks even and the calculator says so.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Amazon product viability scorer](https://useaiblocks.com/skills/amazon-product-viability-scorer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Profitability Status

| Net Margin | Status | Recommendation |
|------------|--------|----------------|
| >20% | ✅ **Healthy** | Maintain current strategy |
| 5-20% | ⚠️ **Warning** | Optimize costs or raise price |
| 0-5% | 🔴 **Danger** | Needs adjustment |
| <0% | 💀 **Loss** | Stop or restructure |

---

## Batch Input Format

### CSV

```csv
sku,name,selling_price,product_cost,shipping_cost,fba_fee,storage_fee,ad_ratio,category
A001,Yoga Mat,29.99,6,1.5,5.5,0.3,0.1,sports
A002,Resistance Bands,19.99,3,0.8,4,0.2,0.12,sports
A003,Foam Roller,24.99,8,2,6,0.3,0.1,sports
```

### Natural Language

```
Batch calculate:
SKU A001: Yoga Mat, $29.99, cost $6, shipping $1.5, FBA $5.5
SKU A002: Bands, $19.99, cost $3, shipping $0.8, FBA $4
```

---

## Script Usage

```bash
# Default demo
python3 scripts/calculator.py

# Custom input
python3 scripts/calculator.py '{"selling_price": 29.99, "product_cost": 6, "fba_fee": 5.5}'

# Batch analysis
python3 scripts/calculator.py '[{"sku": "A001", ...}, {"sku": "A002", ...}]'
```

---

## Handling Incomplete Input

If user doesn't provide enough info, ask:

```
To calculate your profit margin, I need:

**Required:**
- Selling price
- Product cost (FOB)
- FBA fulfillment fee

**Recommended (more accurate):**
- Inbound shipping cost per unit
- FBA storage fee per unit/month
- Ad spend ratio (% of sales)
- Product category (for referral fee)

Example:
"Price $25, cost $5, FBA $4.50, shipping $1, ads 10%, category: kitchen"
```

---

## Integration with Other Skills

Looking for more e-commerce tools? Check out our other skill collections:

- **[Amazon Skills](https://github.com/nexscope-ai/Amazon-Skills)** — Specialized tools for Amazon sellers: keyword research, listing optimization, PPC campaigns
- **[eCommerce Skills](https://github.com/nexscope-ai/eCommerce-Skills)** — Cross-platform tools for all e-commerce businesses

---

## Limitations

This skill calculates margins based on user-provided costs. For real-time FBA fee lookups, exact category rates, and advanced analytics, check out **[Nexscope](https://nexscope.ai)**.

---

**Part of [Nexscope AI](https://www.nexscope.ai/?co-from=skill) — AI tools for e-commerce sellers.**

