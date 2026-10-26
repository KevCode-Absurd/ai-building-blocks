---
name: hr-workforce-economics
description: "Help HR and finance leaders model the financial dimensions of workforce decisions — labor cost structure, productivity economics, and the ROI of workforce investments. Use when asked to model the cost of this workforce decision, calculate fully loaded labor cost, build a business case for headcount, analyze workforce productivity economics, or compare the cost of hiring vs. contracting."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# Workforce economics

Model the financial dimensions of workforce decisions — fully loaded labor cost, productivity economics, and the ROI of workforce investments — so HR decisions are grounded in the same financial rigor as other business investments.

## Steps for a headcount business case

1. Ask for what you need. Required: the role, level and location, the pay range, the work the person would do, and the period to compare. Optional: the revenue or output the role would affect. If a required item is missing, ask once. If it is still missing, mark it MISSING and carry on with a labelled assumption. Never invent a figure.
2. Build the loaded cost line by line: base pay, benefits, payroll taxes, equipment and software, overhead, recruiting cost, and ramp-up time (months at part output). Use only figures the person gave. For any line they did not give, write "assumption" next to your number and the rate or rule you used, or leave it blank and ask.
3. Compare hire and contractor over the same period. Use the contractor rate the person gave. If they gave none, show the break-even rate instead: the contractor rate at which both options cost the same.
4. Work out the payback. Say what the role must produce or save, in money, to cover its loaded cost, and how many months that takes. If the person gave no revenue or output figure, say so and show the break-even output instead of guessing a return.
5. Add the cost of not hiring only if the person gave numbers for it, such as overtime or lost orders.
6. Write the case for finance (under 300 words) from the table. Lead with payback and cost, then list assumptions.
7. Finish with the checks: which figures finance must confirm, and which are assumptions.

## Output

```markdown
## Headcount case: <role>, <location>

### Loaded yearly cost
| Line | Amount | Source |
|------|--------|--------|
| Base pay | <amount> | given |
| <benefits, taxes, equipment, overhead, ramp-up> | <amount> | given / assumption |
| Total | <amount> | |

### Hire vs contract (<period>)
| | Hire | Contractor |
|---|---|---|
| Total cost | <amount> | <amount or break-even rate> |
| Hidden costs | <ramp-up, management time> | <handover, rework> |

### Payback
<months to cover cost, or break-even output, and what it depends on>

### Case for finance
<under 300 words, payback first, assumptions listed>

### To confirm with finance
- <figure or assumption>
```

## Benchmarks

Do not state industry benchmarks, peer costs or market rates from memory. Ask for a source or a figure from the person's own data. If a benchmark is still needed, label it "estimate, confirm before use" and say what to check.

## Other tasks this skill can do

- Calculating fully loaded labor cost by role, level, and location
- Comparing the cost economics of hiring, contracting, and outsourcing
- Modeling the ROI of workforce investments (L&D, tools, restructuring)
- Analyzing labor cost as a percentage of revenue
- Modeling the financial impact of turnover and time-to-fill
- Assessing the cost-benefit of geographic labor arbitrage decisions
- Building workforce cost forecasts tied to the annual budget cycle
- Analyzing productivity economics (output per FTE, revenue per employee)
- Translating workforce economics into language finance and executives use

## Key prompts

### Cost modeling

1. "Calculate fully loaded labor cost for a [role] in [location], including base, benefits, taxes, and overhead."
2. "Compare the total cost of hiring a full-time [role] vs. contracting the same work over a [timeframe]."
3. "Model the cost-benefit of relocating [function] work to [location] considering labor cost, productivity, and risk."
4. "How should we account for hidden costs like ramp time and management overhead when comparing offshore versus onshore staffing?"

### Business cases

1. "Build a financial business case for adding [number] headcount to [team], including cost, expected output, and payback period."
2. "Model the ROI of investing in [L&D program / new tool / restructuring initiative] over [timeframe]."
3. "What financial framing will resonate most with our CFO when requesting headcount for [team]?"
4. "Model the payback period for automating [process] versus continuing to staff it manually."

### Analysis

1. "Analyze our labor cost as a percentage of revenue using the figures I give you."
2. "Model the financial impact of our current turnover rate on [team/function], including replacement and productivity-loss costs."
3. "Analyze revenue or output per FTE trends for [function] over the past [timeframe] and flag anything notable."

### Optimization

1. "Identify workforce cost optimization opportunities for [function] that don't materially reduce capability or capacity."
2. "Model the cost implications of each scenario in our workforce scenario plan for [function]."
3. "What is the realistic savings timeline for a workforce cost optimization initiative, accounting for severance and transition costs?"
4. "How do we distinguish a genuinely sustainable cost optimization from one that just defers cost to a future period?"

## Tips

- Use fully loaded cost, not just base salary, in every business case — base-only comparisons systematically understate the real cost of headcount.
- Translate workforce economics into the financial language your CFO already uses (payback period, cost-to-revenue ratio) rather than HR-specific metrics.
- Be explicit about assumptions in every model (productivity ramp time, attrition rate, overhead allocation) so the numbers are defensible under scrutiny.
- Distinguish cost-cutting from cost optimization — the goal is usually better economics per unit of capability, not simply fewer people.
- Revisit workforce economics models regularly; labor cost, market rates, and productivity assumptions shift faster than most models get updated.
