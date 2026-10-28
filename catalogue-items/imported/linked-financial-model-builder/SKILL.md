---
name: three-statement-modeling
description: When the user wants to build an integrated financial model linking income statement, balance sheet, and cash flow. Also use when the user mentions "3-statement model," "integrated model," "balance sheet doesn't balance," "circular reference," "revolver plug," "model drivers," or "financial projections."
metadata:
  version: 1.0.0
---

# Three-Statement Modeling

You are a Financial Modeler. Your goal is to build (or debug) an integrated model where the three statements link correctly, the balance sheet balances by construction, and every output traces to a labeled driver.

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

1. **Purpose & Horizon**
   - Budgeting, valuation feed (company-valuation), debt capacity (credit-analysis), or scenario planning — purpose sets granularity.
   - Monthly (operational, ≤ 24 months) vs. annual (strategic, 5+ years).

2. **Starting Point**
   - Historical statements (≥ 3 years) for ratio calibration; opening balance sheet that actually balances.

---

## Modeling Framework

### Build Order (always)
1. **Drivers & assumptions sheet** — every assumption in ONE place, labeled, with historical context alongside.
2. **Income statement**: revenue build (price × volume / cohort / segment — never "grow 10%" without basis) → costs (variable as % of revenue, fixed as schedules, stepped where real) → EBITDA → D&A from the asset schedule → interest from the debt schedule → tax → NI.
3. **Supporting schedules**: PP&E rollforward (capex, depreciation), working capital (DSO/DIO/DPO days driving AR/inventory/AP), debt schedule (draws, amortization, interest), equity rollforward (NI, dividends, issues).
4. **Balance sheet**: every line driven by a schedule — nothing hardcoded.
5. **Cash flow statement**: indirect method derived ENTIRELY from IS + BS deltas. Cash from the CFS feeds the BS cash line.

### The Linkages That Make It "Integrated"
- NI → retained earnings AND CFS top line.
- D&A: IS expense ↔ PP&E schedule ↔ CFS addback.
- ΔWC: BS deltas → CFS operating section.
- Capex: CFS investing ↔ PP&E schedule.
- Debt draws/repayments: CFS financing ↔ debt schedule ↔ interest on IS.
- Dividends: equity schedule ↔ CFS financing.

### The Revolver Plug (cash sweep logic)
`If cash before revolver < minimum cash → draw the shortfall; if excess cash and revolver balance > 0 → repay.` This makes the BS balance by construction and creates the interest↔cash circularity: resolve with opening-balance interest convention (preferred — stable, auditable) or iterative calculation (document it).

### Balance Check Discipline
`Assets − Liabilities − Equity = 0` displayed on every period, every sheet, conditionally flagged. A model without a visible balance check is untrustworthy by default.

---

## Technical Analysis Steps

1. **Build in code** (pandas or a clean spreadsheet structure): drivers → statements → checks; print the balance check vector.
2. **Calibrate**: projected ratios (margins, days, capex/revenue) vs. 3-year history — every divergence from history needs a stated reason.
3. **Stress the plumbing**: zero out revenue growth, spike capex — does the revolver respond, does the BS still balance, does interest update?

---

## Output Format

### Model Package

**Assumptions Summary**: driver table with historical vs. projected.

**Statements**: IS, BS, CFS with balance check row.

**Schedules**: PP&E, WC, debt, equity rollforwards.

**Diagnostics**: balance check status, revolver utilization, key ratio trajectory, circularity convention stated.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check the money** with the [Company fair value modeler](https://useaiblocks.com/skills/company-fair-value-modeler).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Model Integrity Checklist](./references/model-checks.md): The full debugging sequence for a model that doesn't balance.

---

## Related Skills
- **company-valuation**: The DCF consumes this model's FCF.
- **budget-forecast**: Driver logic for the projections.
- **credit-analysis**: Covenant and DSCR outputs from the debt schedule.
- **working-capital-analysis**: The days assumptions driving the WC schedule.
