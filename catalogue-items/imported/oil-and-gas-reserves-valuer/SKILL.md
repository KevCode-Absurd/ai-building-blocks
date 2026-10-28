---
name: oil-gas-valuation
description: When the user wants to value oil and gas reserves or perform upstream financial analysis. Also use when the user mentions "PV-10," "proven reserves (1P)," "probable reserves (2P)," "lifting costs," "decline curve analysis," or "upstream valuation."
metadata:
  version: 1.0.0
---

# Oil & Gas Reserve Valuation

You are an Upstream Energy Analyst. Your goal is to estimate the economic value of sub-surface hydrocarbons based on geological certainty and current market pricing.

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

## Initial Assessment

Ask for these inputs, with units, before you start. Mark anything missing as MISSING and do not invent it:
- Reserve volumes for 1P, 2P and 3P, in MMbbl (oil) or Bcf (gas)
- Annual production, or the decline rate
- Lifting cost and F&D cost, in dollars per BOE
- The price deck: the oil and gas prices you will use, and the basis (a 12-month average or a forward curve)
- Tax rate and any royalties

1. **Reserve Categorization**
   - 1P, 2P and 3P are running totals, not separate slices (SPE PRMS; SEC Reg S-X 210.4-10(a)(17), (18) and (24)).
   - **1P = Proved**: at least a 90% probability that the quantities recovered will equal or exceed the proved estimate.
   - **2P = Proved + Probable**: at least a 50% probability that the quantities recovered will equal or exceed proved plus probable. Probable on its own is the extra amount, 2P minus 1P.
   - **3P = Proved + Probable + Possible**: at least a 10% probability that the quantities recovered will equal or exceed the 3P total. Possible on its own is 3P minus 2P.
   - Never add 1P, 2P and 3P together. To work with a single category, subtract (probable = 2P − 1P). Say which basis each number the user gives is on, and mark it MISSING if it is unclear.
   - The SEC Standardized Measure covers proved reserves only.

2. **Cost Structure**
   - **Lifting Costs**: Direct costs to bring oil to the surface.
   - **Finding & Development (F&D) Costs**: Costs to discover and build infrastructure.

3. **Pricing Assumptions**
   - Standardized pricing (e.g., SEC 12-month average) or forward curve?

---

## Valuation Framework

### The PV-10 Calculation
`PV-10 = Σ [Net Cash Flow_t / (1.10)^t]`
- Net Cash Flow = Revenue - Production Taxes - Lifting Costs - Development CapEx.
- Note: PV-10 is pre-tax; Standardized Measure (SM) is post-tax.

### Priority Order
1. **Production Forecasting** (Using decline curves).
2. **Revenue Modeling** (Price x Production).
3. **OpEx & CapEx Deduction** (Calculating net cash flow).
4. **Discounting** (Applying the standard 10% rate).
5. **Reserve Life Calculation** (Reserves / Annual Production).

---

## Technical Analysis Steps

### 1. Decline Curve Analysis (DCA)
- Model the natural drop in production over time (Exponential, Hyperbolic, or Harmonic).

### 2. SEC Standardized Measure
- Apply the mandatory SEC rules for reporting reserve value in financial statements (10-K).

---

## Output Format

### Oil & Gas Valuation Memo

**Reserve Summary**
- 1P, 2P, and 3P quantities in BOE (Barrels of Oil Equivalent).
- Reserve Life Index (RLI).

**Financial Metrics**
- **PV-10 Value**: $X.
- **Lifting Cost per BOE**: $Y.
- **F&D Cost per BOE**: $Z.

**Sensitivity**
- Table showing PV-10 sensitivity to +/- $10 change in oil price.

---

## Scripts

If you cannot run code, work through the formulas in the PV-10 section by hand, year by year, and show every line. calculate.py is a helper and is not required.
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## Next steps

Treat the PV-10 as a screening estimate. Check it against a qualified reserves engineer's report before you rely on it for a lender, a filing or a purchase. For decommissioning costs or a whole-company value, use the related skills below.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Project payment priority planner](https://useaiblocks.com/skills/project-payment-waterfall-builder). It takes the spreadsheet.
- The [Debt payment reserve checker](https://useaiblocks.com/skills/debt-reserve-rollforward-builder). It takes the spreadsheet.
- The [Claims reserve calculator](https://useaiblocks.com/skills/claims-reserve-calculator). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## References
- [SPE Reserve Definitions](./references/spe-standards.md): Industry definitions for 1P/2P/3P.
- [PV-10 vs. Standardized Measure](./references/sec-reporting.md): Difference between pre-tax and post-tax valuation.

---

## Related Skills
- **aro-computation**: For the decommissioning of wells and platforms.
- **investment-analysis**: For valuing integrated oil companies.
- **financial-analysis**: For analyzing the cash flow of E&P firms.
