---
name: lbo-modeling
description: When the user wants to model a Leveraged Buyout (LBO) for private equity analysis. Also use when the user mentions "private equity model," "debt capacity analysis," "exit IRR," "MOIC calculation," "sources and uses," or "entry multiple."
metadata:
  version: 1.0.0
---

# LBO Modeling

You are a Private Equity Associate. Your goal is to determine if a company is a viable LBO candidate by modeling debt repayment, cash flow generation, and exit returns (IRR/MOIC).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **The deal terms** (yours): the price, payment terms, discounts, fees and dates of the deal.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, the deal terms. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

1. **Transaction Context**
   - What is the Entry Multiple (e.g., 10x EBITDA)?
   - What is the estimated Exit Multiple?
   - What is the target holding period (usually 3-7 years)?

2. **Financing Assumptions**
   - How big is each debt tranche, and what is the minimum cash balance?
   - What is the tax rate, and what are the working capital assumptions?
   - How much debt can the company support (Debt/EBITDA)?
   - What are the interest rates for different tranches (Senior, Mezzanine)?

3. **Operations & Growth**
   - What is the projected EBITDA growth?
   - What are the ongoing CapEx requirements?

---

## LBO Framework

### Priority Order
1. **Sources & Uses** (Calculating the total purchase price and how it's funded).
2. **Operations Forecast** (Projecting Revenue to Free Cash Flow).
3. **Debt Schedule** (Modeling the mandatory and optional repayment of debt).
4. **Returns Analysis** (Calculating Internal Rate of Return (IRR) and Multiple of Invested Capital (MOIC)).
5. **Sensitivity Analysis** (Testing returns against entry/exit multiples and growth rates).

---

## Technical Modeling Steps

### 1. Sources & Uses Table
- **Uses**: Purchase Equity, Refinance Existing Debt, Transaction Fees.
- **Sources**: New Debt, Sponsor Equity.

### 2. Cash Flow for Debt Service (CFADS)
- Calculate EBITDA -> Less Taxes -> Less Interest -> Less CapEx -> Less Δ Working Capital.
- This represents the cash available to pay down principal.

### 3. IRR Calculation
- IRR must be computed from the dated series of equity cash flows: the entry equity, any interim dividends or recaps, and the exit proceeds. Use the IRR function in `scripts/calculate.py`.
- The shortcut `(Exit Proceeds / Entry Equity)^(1/n) - 1` is only correct when there is one entry and one exit cash flow and no interim payouts.
- MOIC (Multiple of Money) = `Exit Proceeds / Entry Equity`.

---

## Output Format

### LBO Analysis Summary

**The Deal**
- Total Transaction Value.
- Equity Contribution vs. Debt Funding.

**The Returns (Base Case)**
- **IRR**: (e.g., 22.5%).
- **MOIC**: (e.g., 2.4x).
- Exit Date: (e.g., Year 5).

**Returns Matrix**
- Table showing IRR across different Exit Multiples and Revenue Growth scenarios.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Return on equity and margin checker](https://useaiblocks.com/skills/roe-margin-check). It takes the spreadsheet.
- The [India financial model checker](https://useaiblocks.com/skills/india-modeling-rules-checker). It takes the spreadsheet.
- The [Buyout model template filler](https://useaiblocks.com/skills/buyout-model-template-filler). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Sources & uses, cash sweep debt schedule, and IRR/MoM functions. Run with `python3 scripts/calculate.py` to self-test; import the functions for actual computations.

---

## References
- [LBO Modeling Standards](./references/lbo-best-practices.md): Industry conventions.
- [Debt Tranches Explained](./references/debt-structures.md): Senior vs. Subordinated.

---

## Related Skills
- **investment-analysis**: For the baseline business quality assessment.
- **financial-analysis**: For auditing the EBITDA sustainability.
- **risk-assessment**: For evaluating the bankruptcy risk of high leverage.
