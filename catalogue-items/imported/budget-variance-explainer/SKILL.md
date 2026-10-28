---
name: variance-analysis
description: Decompose financial variances into drivers with narrative explanations and waterfall analysis. Use when analyzing budget vs. actual, period-over-period changes, revenue or expense variances, or preparing variance commentary for leadership.
argument-hint: "<line item> <period> vs <comparison>"
---

# Variance Analysis

**Important**: This skill assists with variance analysis workflows but does not provide financial advice. All analyses should be reviewed by qualified financial professionals before use in reporting.

Techniques for decomposing variances, materiality thresholds, narrative generation, waterfall chart methodology, and budget vs actual vs forecast comparisons.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Variance Decomposition Techniques

### Price / Volume Decomposition

The most fundamental variance decomposition. Used for revenue, cost of goods, and any metric that can be expressed as Price x Volume.

**Formula:**
```
Total Variance = Actual - Budget (or Prior)

Volume Effect  = (Actual Volume - Budget Volume) x Budget Price
Price Effect   = (Actual Price - Budget Price) x Actual Volume

Verification:  Volume Effect + Price Effect = Total Variance, exactly.
               (Pricing the price effect at ACTUAL volume puts the
               price x volume interaction inside the price effect, so
               nothing is left over.)
```

**Which method to use:** for a single product, or when you only have totals, use the two-way formula above. When several products (or segments) sell at different prices and you have volume and price for each, use the three-way decomposition below, where mix is its own term.

**Three-way decomposition (separating mix), for products i:**
```
Q        = total volume across products;  share_i = Volume_i / Q
Budget avg price = Sum of (Budget share_i x Budget Price_i)

Volume Effect = (Actual Q - Budget Q) x Budget avg price
Mix Effect    = Actual Q x Sum of ((Actual share_i - Budget share_i) x Budget Price_i)
Price Effect  = Sum of (Actual Volume_i x (Actual Price_i - Budget Price_i))

Verification:  Volume + Mix + Price = Actual revenue - Budget revenue, exactly.
```

Check with one product (mix share 1 in both): budget 100 units x $10 = $1,000; actual 110 units x $12 = $1,320; total variance +$320. Volume = 10 x $10 = +$100. Mix = 0. Price = 110 x $2 = +$220. Sum = +$320. (Pricing the price effect at budget volume would give only +$200 and leave $20 unexplained, so always use actual volume there.)

Check with two products (say A at $10 and B at $20, both prices unchanged): budget 50 A + 50 B = $1,500; actual 40 A + 70 B = $1,800; total +$300. Budget avg price = 0.5 x $10 + 0.5 x $20 = $15. Volume = (110 - 100) x $15 = +$150. Mix = 110 x ((40/110 - 0.5) x $10 + (70/110 - 0.5) x $20) = 110 x (-$1.364 + $2.727) = +$150. Price = 0. Sum = +$300.

**Example — Revenue variance:**
- Budget: 10,000 units at $50 = $500,000
- Actual: 11,000 units at $48 = $528,000
- Total variance: +$28,000 favorable
  - Volume effect: +1,000 units x $50 = +$50,000 (favorable — sold more units)
  - Price effect: -$2 x 11,000 units = -$22,000 (unfavorable — lower ASP)
  - Net: +$28,000

### Rate / Mix Decomposition

Used when analyzing blended rates across segments with different unit economics.

**Formula:**
```
Rate Effect = Sum of (Actual Volume_i x (Actual Rate_i - Budget Rate_i))
Mix Effect  = Sum of (Budget Rate_i x (Actual Volume_i - Expected Volume_i at Budget Mix))
```

**Example — Gross margin variance:**
- Product A: 60% margin, Product B: 40% margin
- Budget mix: 50% A, 50% B → Blended margin 50%
- Actual mix: 40% A, 60% B → Blended margin 48%
- Mix effect explains 2pp of margin compression

### Headcount / Compensation Decomposition

Used for analyzing payroll and people-cost variances.

```
Total Comp Variance = Actual Compensation - Budget Compensation

Decompose into:
1. Headcount variance    = (Actual HC - Budget HC) x Budget Avg Comp
2. Rate variance         = (Actual Avg Comp - Budget Avg Comp) x Actual HC
   (Use ACTUAL headcount here so items 1 and 2 add up to the total when there is
   no mix, timing or attrition effect. Say budget 10 people at $100K and actual 12 at
   $110K: total +$320K = headcount 2 x $100K = +$200K plus rate $10K x 12 = +$120K.)
3. Mix variance          = Difference due to level/department mix shift
4. Timing variance       = Hiring earlier/later than planned (partial-period effect)
5. Attrition impact      = Savings from unplanned departures (partially offset by backfill costs)
```

### Spend Category Decomposition

Used for operating expense analysis when price/volume is not applicable.

```
Total OpEx Variance = Actual OpEx - Budget OpEx

Decompose by:
1. Headcount-driven costs    (salaries, benefits, payroll taxes, recruiting)
2. Volume-driven costs       (hosting, transaction fees, commissions, shipping)
3. Discretionary spend       (travel, events, professional services, marketing programs)
4. Contractual/fixed costs   (rent, insurance, software licenses, subscriptions)
5. One-time / non-recurring  (severance, legal settlements, write-offs, project costs)
6. Timing / phasing          (spend shifted between periods vs plan)
```

## Materiality Thresholds and Investigation Triggers

### Setting Thresholds

Materiality thresholds determine which variances require investigation and narrative explanation. Set thresholds based on:

1. **Financial statement materiality:** Typically 1-5% of a key benchmark (revenue, total assets, net income)
2. **Line item size:** Larger line items warrant lower percentage thresholds
3. **Volatility:** More volatile line items may need higher thresholds to avoid noise
4. **Management attention:** What level of variance would change a decision?

### Recommended Threshold Framework

| Comparison Type | Dollar Threshold | Percentage Threshold | Trigger |
|----------------|-----------------|---------------------|---------|
| Actual vs Budget | Organization-specific | 10% | Either exceeded |
| Actual vs Prior Period | Organization-specific | 15% | Either exceeded |
| Actual vs Forecast | Organization-specific | 5% | Either exceeded |
| Sequential (MoM) | Organization-specific | 20% | Either exceeded |

*Set dollar thresholds based on your organization's size. Common practice: 0.5%-1% of revenue for income statement items.*

### Investigation Priority

When multiple variances exceed thresholds, prioritize investigation by:

1. **Largest absolute dollar variance** — biggest P&L impact
2. **Largest percentage variance** — may indicate process issue or error
3. **Unexpected direction** — variance opposite to trend or expectation
4. **New variance** — item that was on track and is now off
5. **Cumulative/trending variance** — growing each period

## Narrative Generation for Variance Explanations

### Structure for Each Variance Narrative

```
[Line Item]: [Favorable/Unfavorable] variance of $[amount] ([percentage]%)
vs [comparison basis] for [period]

Driver: [Primary driver description]
[2-3 sentences explaining the business reason for the variance, with specific
quantification of contributing factors]

Outlook: [One-time / Expected to continue / Improving / Deteriorating]
Action: [None required / Monitor / Investigate further / Update forecast]
```

### Narrative Quality Checklist

Good variance narratives should be:

- [ ] **Specific:** Names the actual driver, not just "higher than expected"
- [ ] **Quantified:** Includes dollar and percentage impact of each driver
- [ ] **Causal:** Explains WHY it happened, not just WHAT happened
- [ ] **Forward-looking:** States whether the variance is expected to continue
- [ ] **Actionable:** Identifies any required follow-up or decision
- [ ] **Concise:** 2-4 sentences, not a paragraph of filler

### Common Narrative Anti-Patterns to Avoid

- "Revenue was higher than budget due to higher revenue" (circular — no actual explanation)
- "Expenses were elevated this period" (vague — which expenses? why?)
- "Timing" without specifying what was early/late and when it will normalize
- "One-time" without explaining what the item was
- "Various small items" for a material variance (must decompose further)
- Focusing only on the largest driver and ignoring offsetting items

## Waterfall Chart Methodology

### Concept

A waterfall (or bridge) chart shows how you get from one value to another through a series of positive and negative contributors. Used to visualize variance decomposition.

### Data Structure

```
Starting value:  [Base/Budget/Prior period amount]
Drivers:         [List of contributing factors with signed amounts]
Ending value:    [Actual/Current period amount]

Verification:    Starting value + Sum of all drivers = Ending value
```

### Text-Based Waterfall Format

When a charting tool is not available, present as a text waterfall:

```
WATERFALL: Revenue — Q4 Actual vs Q4 Budget

Q4 Budget Revenue                                    $10,000K
  |
  |--[+] Volume growth (new customers)               +$800K
  |--[+] Expansion revenue (existing customers)      +$400K
  |--[-] Price reductions / discounting               -$200K
  |--[-] Churn / contraction                          -$350K
  |--[+] FX tailwind                                  +$50K
  |--[-] Timing (deals slipped to Q1)                 -$150K
  |
Q4 Actual Revenue                                    $10,550K

Net Variance: +$550K (+5.5% favorable)
```

### Bridge Reconciliation Table

Complement the waterfall with a reconciliation table:

| Driver | Amount | % of Variance | Cumulative |
|--------|--------|---------------|------------|
| Volume growth | +$800K | 145% | +$800K |
| Expansion revenue | +$400K | 73% | +$1,200K |
| Price reductions | -$200K | -36% | +$1,000K |
| Churn / contraction | -$350K | -64% | +$650K |
| FX tailwind | +$50K | 9% | +$700K |
| Timing (deal slippage) | -$150K | -27% | +$550K |
| **Total variance** | **+$550K** | **100%** | |

*Note: Percentages can exceed 100% for individual drivers when there are offsetting items.*

### Waterfall Best Practices

1. Order drivers from largest positive to largest negative (or in logical business sequence)
2. Keep to 5-8 drivers maximum — aggregate smaller items into "Other"
3. Verify the waterfall reconciles (start + drivers = end)
4. Color-code: green for favorable, red for unfavorable (in visual charts)
5. Label each bar with both the amount and a brief description
6. Include a "Total Variance" summary bar

## Budget vs Actual vs Forecast Comparisons

### Three-Way Comparison Framework

| Metric | Budget | Forecast | Actual | Bud Var ($) | Bud Var (%) | Fcast Var ($) | Fcast Var (%) |
|--------|--------|----------|--------|-------------|-------------|---------------|---------------|
| Revenue | $X | $X | $X | $X | X% | $X | X% |
| COGS | $X | $X | $X | $X | X% | $X | X% |
| Gross Profit | $X | $X | $X | $X | X% | $X | X% |

### When to Use Each Comparison

- **Actual vs Budget:** Annual performance measurement, compensation decisions, board reporting. Budget is set at the beginning of the year and typically not changed.
- **Actual vs Forecast:** Operational management, identifying emerging issues. Forecast is updated periodically (monthly or quarterly) to reflect current expectations.
- **Forecast vs Budget:** Understanding how expectations have changed since planning. Useful for identifying planning accuracy issues.
- **Actual vs Prior Period:** Trend analysis, sequential performance. Useful when budget is not meaningful (new business lines, post-acquisition).
- **Actual vs Prior Year:** Year-over-year growth analysis, seasonality-adjusted comparison.

### Forecast Accuracy Analysis

Track how accurate forecasts are over time to improve planning:

```
Forecast Accuracy = 1 - |Actual - Forecast| / |Actual|

MAPE (Mean Absolute Percentage Error) = Average of |Actual - Forecast| / |Actual| across periods
```

| Period | Forecast | Actual | Variance | Accuracy |
|--------|----------|--------|----------|----------|
| Jan    | $X       | $X     | $X (X%)  | XX%      |
| Feb    | $X       | $X     | $X (X%)  | XX%      |
| ...    | ...      | ...    | ...      | ...      |
| **Avg**|          |        | **MAPE** | **XX%**  |

### Variance Trending

Track how variances evolve over the year to identify systematic bias:

- **Consistently favorable:** Budget may be too conservative (sandbagging)
- **Consistently unfavorable:** Budget may be too aggressive or execution issues
- **Growing unfavorable:** Deteriorating performance or unrealistic targets
- **Shrinking variance:** Forecast accuracy improving through the year (normal pattern)
- **Volatile:** Unpredictable business or poor forecasting methodology

Changed by AI Blocks (2026-10-28): rebuilt the three-way volume/mix/price formulas so they add up to the total variance, priced the headcount rate variance at actual headcount, and added worked checks.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Budget, forecast and cash gap review](https://useaiblocks.com/skills/monthly-budget-versus-actual-keeper).
- The [Freelancer transaction and cash review](https://useaiblocks.com/skills/monthly-freelancer-books-closer).
- The [Stakeholder update writer](https://useaiblocks.com/skills/stakeholder-update-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
