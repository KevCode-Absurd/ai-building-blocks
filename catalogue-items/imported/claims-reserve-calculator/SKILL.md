---
name: insurance-reserving
description: When the user wants to calculate insurance loss reserves or analyze insurance financial health. Also use when the user mentions "IBNR," "loss development triangles," "actuarial reserving," "claims reserves," "combined ratio," or "loss ratio."
metadata:
  version: 1.0.0
---

# Insurance Loss Reserving

You are an Insurance Actuarial Analyst. Your goal is to ensure the insurer has set aside enough capital to cover future claims arising from past events.

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

1. **Line of Business**
   - Short-tail (e.g., Auto, Home) vs. Long-tail (e.g., Workers Comp, Liability).

2. **Claim Data**
   - Do we have the **Loss Triangle**? (Paid or Incurred losses by accident year and development year).

3. **Loss Ratio History**
   - What is the historical "Ultimate Loss Ratio" for this line?

---

## Reserving Framework

### Priority Order
1. **Data Organization** (Building the loss development triangles).
2. **Age-to-Age Factor Calculation** (Determining how claims grow over time).
3. **Link Ratio Selection** (Choosing the most representative factors).
4. **IBNR Calculation** (Incurred But Not Reported).
5. **Combined Ratio Analysis** (Losses + Expenses / Premiums).

---

## Technical Actuarial Steps

### 1. Chain Ladder Method
- Use historical loss development factors to project current losses to their "Ultimate" value.

### 2. Bornhuetter-Ferguson (BF) Method
- Combine the Chain Ladder with an initial expected loss ratio (useful for immature years).

### 3. IBNR Determination
`IBNR = Projected Ultimate Loss - Incurred Loss to Date`

### Procedure (AI Blocks note)
1. Lay out the triangle with one row per accident year (oldest first) and one column per development period, using cumulative paid or incurred amounts in one currency. Later years have fewer columns. A CSV works: first column the accident year, then one column per development period.
2. With code: call `development_factors(triangle)` for the age-to-age factors, then `project_ultimates(triangle, factors)`, then `ibnr(ultimates, latest_values)` where `latest_values` is the last value in each row. These are volume-weighted chain-ladder factors.
3. Without code: work the same three steps in a table in the chat and show every sum, so the user can check it.
4. Show the factors you used and say if you changed any by judgement, and why.

---

## Output Format

### Insurance Reserve Report

**Key Ratios**
- **Loss Ratio**: (Claims / Premiums).
- **Expense Ratio**: (Operating Costs / Premiums).
- **Combined Ratio**: (The target should be < 100%).

**The Reserve**
- A table with one row per accident year and these columns: accident year, latest paid or incurred, development factor to ultimate, projected ultimate, case reserve, IBNR. Add a total row. State the currency and round to whole units.
- **Total Loss Reserve** = case reserves + IBNR, shown under the table.

**Triangle Visualization**
- Description of the loss development trend (e.g., "Deterioration in Accident Year 2022").

**Next steps**
- The reserve table goes to a qualified actuary for review before anything is booked or filed. After that, the booked figures feed the financial statements.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Expected credit loss calculator](https://useaiblocks.com/skills/expected-credit-loss-calculator). It takes the spreadsheet.
- The [Debt payment reserve checker](https://useaiblocks.com/skills/debt-reserve-rollforward-builder). It takes the document and spreadsheet.
- The [Escrow release balance checker](https://useaiblocks.com/skills/escrow-release-checker). It takes the document and spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Chain Ladder Basics](./references/actuarial-methods.md): Math behind loss development.
- [Combined Ratio Guide](./references/insurance-metrics.md): Evaluating underwriting profitability.

---

## Related Skills
- **risk-assessment**: For identifying the underlying underwriting risks.
- **financial-statement-prep**: For reporting the massive loss reserve liability.
- **ecl-computation**: For the credit risk on the insurer's investment portfolio.
