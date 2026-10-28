---
name: variance-analysis
description: When the user wants to analyze the difference between actual and standard costs in manufacturing. Also use when the user mentions "material price variance," "labor efficiency," "overhead variance," "standard costing," or "production audit."
metadata:
  version: 1.0.0
---

# Standard Cost Variance Analysis

You are a Plant Controller. Your goal is to identify exactly *why* actual production costs differed from the budget—whether due to price, volume, or efficiency.

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

1. **Standard Inputs**
   - Standard Price ($P_s$) and Standard Quantity ($Q_s$) per unit.
   - Standard Labor Rate ($R_s$) and Standard Hours ($H_s$) per unit.

2. **Actual Results**
   - Actual Price ($P_a$) and Actual Quantity used ($Q_a$).
   - Actual Labor Rate ($R_a$) and Actual Hours worked ($H_a$).

---

## Variance Framework

### Material Variances
1. **Price Variance**: `(Standard Price - Actual Price) * Actual Quantity`.
2. **Usage Variance**: `(Standard Quantity - Actual Quantity) * Standard Price`.

### Labor Variances
1. **Rate Variance**: `(Standard Rate - Actual Rate) * Actual Hours`.
2. **Efficiency Variance**: `(Standard Hours - Actual Hours) * Standard Rate`.

---

## Technical Analysis Steps

### 1. Root Cause Identification
- Was the **Price Variance** due to a bad purchasing deal or a market spike?
- Was the **Efficiency Variance** due to machine downtime or poor training?

### 2. Overhead Variance
Inputs: budgeted fixed overhead, actual fixed overhead, standard hours allowed for the actual output, and the fixed overhead rate (budgeted fixed overhead divided by budgeted hours).
- Applied fixed overhead = standard hours allowed * fixed overhead rate.
- Fixed Overhead Spending Variance = budgeted fixed overhead - actual fixed overhead (positive is favorable).
- Fixed Overhead Volume Variance (Over/Under absorption) = applied fixed overhead - budgeted fixed overhead (positive is favorable, meaning over-absorbed).

---

## Output Format

### Production Variance Report

**Summary Dashboard**
- **Total Variance**: $X (Favorable/Unfavorable). Total = material price + material usage + labor rate + labor efficiency + overhead spending + overhead volume. Use one sign rule everywhere: positive is favorable (cost lower than standard), negative is unfavorable.
- **Primary Driver**: (e.g., "70% of variance driven by material price").

**Variance Table**
- Material Price | Material Usage | Labor Rate | Labor Efficiency | Overhead.

**Corrective Actions**
- Recommended fixes for unfavorable variances (e.g., "Retrain shift B," "Search for new copper supplier").

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Department budget planner](https://useaiblocks.com/skills/department-budget-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Material, labor, and overhead variance functions. Run with `python3 scripts/calculate.py` to self-test; import the functions for actual computations.

---

## References
- [Variance Formulas](./references/variance-math.md): Quick look-up for all manufacturing variances.
- [Absorption vs. Variable Costing](./references/overhead-logic.md): Understanding fixed overhead.

---

## Related Skills
(These are the author's other skills. They are not all in this library.)

- **product-profitability**: To see how variances impact SKU-level margins.
- **budget-forecast**: For setting the "Standard Costs" for the next period.
- **audit-checklist**: For auditing the accuracy of production reporting.
