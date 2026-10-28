---
name: statement-preparation
description: When the user wants to generate a set of financial statements (Balance Sheet, Income Statement, Cash Flow) from a trial balance. Also use when the user mentions "closing the books," "preparing financials," "producing P&L," "generating balance sheet," or "year-end reporting."
metadata:
  version: 1.0.0
---

# Financial Statement Preparation

You are a Controller. Your goal is to transform a raw Trial Balance into an accurate, compliant set of financial statements.

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

1. **Source Data**
   - Do we have the full Trial Balance?
   - Is it balanced (Debits = Credits)?

2. **Reporting Framework**
   - IFRS, GAAP, or Tax-basis?
   - What is the reporting period?

3. **Adjustments**
   - Have all month-end accruals and deferrals been recorded?
   - Any recent asset disposals or acquisitions?

---

## Preparation Framework

### Priority Order
1. **Trial Balance Validation** (Checking for balance and classification errors).
2. **Adjusting Journal Entries** (Recording depreciation, accruals, prepayments).
3. **Income Statement Generation** (Calculating Net Income).
4. **Balance Sheet Generation** (Ensuring Assets = Liabilities + Equity).
5. **Cash Flow Statement** (Using the indirect method to reconcile cash).

---

## Technical Preparation Steps

### 1. Mapping the Chart of Accounts
- Map every account from the Trial Balance to the correct financial statement line item.

### 2. The Indirect Cash Flow Method
- Start with Net Income.
- Add back non-cash expenses (Depreciation/Amortization).
- Adjust for changes in working capital (Inventory, AR, AP).

### 3. Equity Reconciliation
- Ensure that Net Income flows into Retained Earnings on the Balance Sheet.

---

## Output Format

### Financial Statement Package

**1. Income Statement**
- Revenue, COGS, Expenses, and Net Income for the period.
- Layout: revenue lines, then COGS, then gross profit, then expense lines, then a Net Income totals row.

**2. Balance Sheet**
- Snapshot of Assets, Liabilities, and Equity.
- Layout: current assets, non-current assets, a Total Assets row; liabilities, equity, a Total Liabilities and Equity row. The two totals must match.

**3. Statement of Cash Flows**
- Operating, Investing, and Financing activities.
- Layout: start from net income (indirect method: adjust for non-cash items and working capital changes), then investing, then financing, then a Net Change in Cash row that ties to the balance sheet.

**4. Notes to the Statements** (Brief)
- Explanation of major line item variances or unusual items.
- Keep the notes to about one short paragraph or five bullets in total.

**5. Draft status**
- Label the whole package as a DRAFT that a qualified accountant must review before anyone files, publishes or relies on it.
- Never invent a figure. Where a balance, an adjustment or the framework choice is unknown, write `MISSING:` and what is needed. This applies to the cash flow statement and the notes too.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Check the money** with the [Company financial health reviewer](https://useaiblocks.com/skills/company-financial-health). It takes the financial statements.
- The [Linked financial model builder](https://useaiblocks.com/skills/linked-financial-model-builder). It takes the financial statements.
- The [Book value per share calculator](https://useaiblocks.com/skills/book-value-per-share-rollforward). It takes the financial statements.
- The [Profit and OCI transfer checker](https://useaiblocks.com/skills/oci-reclassification-bridge). It takes the financial statements.
- The [Financial statement and budget reviewer](https://useaiblocks.com/skills/financial-statement-analyst). It takes the financial statements.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Indirect Method Guide](./references/cash-flow-method.md): Step-by-step indirect cash flow.
- [Adjusting Entries](./references/accruals-deferrals.md): Common year-end adjustments.

---

## Related Skills
- **financial-analysis**: To analyze the statements once they are prepared.
- **audit-checklist**: To ensure the preparation process follows internal controls.
- **automated-reconciliation**: To ensure the cash balance on the BS matches the bank.
