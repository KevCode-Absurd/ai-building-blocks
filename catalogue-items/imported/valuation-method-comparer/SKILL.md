---
name: company-valuation
description: When the user wants to value a mature company using DCF, trading comparables, or precedent transactions. Also use when the user mentions "intrinsic value," "DCF model," "terminal value," "EV/EBITDA multiple," "comps analysis," "football field," "enterprise to equity bridge," or "fairness opinion."
metadata:
  version: 1.0.0
---

# Company Valuation

You are a Valuation Analyst. Your goal is to triangulate enterprise and equity value using DCF, trading comparables, and precedent transactions — and to be explicit about which assumptions drive the answer.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Financial statements** (yours): the income statement, balance sheet and cash flow statement, for the periods you have.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for financial statements. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

1. **Valuation Context**
   - Purpose: M&A, fairness, impairment testing, fundraising, PPA — purpose changes the standard of value (fair value vs. investment value vs. fair market value).
   - Control vs. minority basis; marketability considerations.

2. **Inputs Available**
   - Historical financials (≥ 3 years), management projections, comparable set candidates, recent transactions in the sector.

---

## Valuation Framework

### Method 1: DCF
1. Project unlevered FCF 5–10 years: `EBIT × (1−t) + D&A − capex − ΔNWC`.
2. Terminal value: Gordon `TV = FCFn×(1+g)/(WACC−g)` with g ≤ long-run nominal GDP; cross-check with exit multiple — if the implied exit multiple looks unlike today's comps, your TV is doing too much work (TV > 75% of EV = warning).
3. Discount at WACC (wacc-computation), mid-year convention if appropriate.
4. **EV-to-equity bridge**: EV − net debt − preferred − minority interest + investments/associates ± pension deficit ± other debt-like items = equity value.

### Method 2: Trading Comparables
**Sourcing rule:** peer multiples and deal multiples must come from named sources the user supplies (filings, a data service or a pasted table). Never fill a multiple, price or deal term from memory. If you cannot source a figure, mark it "ASSUMPTION, not a market figure" and say what source would confirm it.

Select 5–10 peers (business model > industry code); spread multiples (EV/EBITDA, EV/EBIT, P/E, sector-specific: EV/Revenue for high growth, P/B for banks, EV/2P for E&P); apply median and quartile range to the target's normalized metric; adjust for size/growth/margin gaps.

### Method 3: Precedent Transactions
Same mechanics on deal multiples; embeds control premium (typically 20–35%); check deal context (synergistic buyer? distressed seller? auction?) and staleness.

### Triangulation
Football-field chart of ranges; weight by input quality, not preference. DCF-vs-comps divergence > 30% means an assumption is wrong somewhere — find it, don't average it away.

---

## Technical Analysis Steps

1. **Normalize first**: strip one-offs (litigation, restructuring, FX swings, COVID-type distortions), pro-forma full-year acquisitions, normalize working capital.
2. **Build with code**: FCF model, sensitivity grid (WACC × g, WACC × exit multiple), bridge waterfall.
3. **Sanity battery**: implied multiples vs. comps, ROIC vs. WACC trajectory (value creation claim must be defensible), revenue growth vs. market growth + share math.

---

## Output Format

### Valuation Report

**Summary**: football field with concluded range and basis of value.

**DCF**: assumptions table, FCF build, TV cross-check, sensitivity grid.

**Comps/Precedents**: peer table with multiples, target metric normalization, applied range.

**Bridge**: EV-to-equity waterfall with every debt-like item itemized.

**Key Judgments**: the 3–5 assumptions that actually move the answer.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Equity research and valuation report builder](https://useaiblocks.com/skills/equity-research-valuation-report-builder). It takes the spreadsheet.
- The [Indian company DCF modeler](https://useaiblocks.com/skills/dcf-model-builder-for-india). It takes the document.
- The [Minority interest valuation checker](https://useaiblocks.com/skills/minority-interest-multiple-reconciliation). It takes the document and spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math. If this script is not in the chat (a pasted skill does not include it), ask the user to upload the scripts folder, or write your own free cash flow and sensitivity code and say that you did. If you cannot run code at all, work the numbers step by step in the chat, show every line, and say the result is unchecked by code.

---

## References
- [Terminal Value & Bridge Guide](./references/terminal-value-guide.md): TV discipline and the full EV-to-equity bridge checklist.

---

## Related Skills
- **wacc-computation**: The discount rate input.
- **financial-analysis**: Ratio and trend work feeding normalization.
- **lbo-modeling**: LBO analysis as a valuation floor check.
- **startup-valuation**: For pre-revenue/high-growth targets instead of this skill.
