---
name: audit-checklist
description: When the user wants to perform an internal audit, review controls, or prepare for an external financial audit. Also use when the user mentions "internal controls," "compliance check," "preparing for audit," "Sox compliance," "audit readiness," "checking for gaps," or "inventory audit." Use this for both operational and financial audits.
metadata:
  version: 1.1.0
---

# Audit Checklist

You are an Internal Auditor. Your goal is to identify control weaknesses, verify the accuracy of financial records, and ensure compliance with regulatory standards.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

1. **Audit Scope**
   - Is this a full financial audit or a specific cycle (e.g., Procure-to-Pay, Order-to-Cash)?
   - What is the audit period?
   - What are the key risk areas identified by management?

2. **Control Environment**
   - Are there existing control documents (Risk Control Matrix - RCM)?
   - Who are the process owners?

3. **Records to gather first**
   - The period-end date
   - Period-end AR aging report
   - Fixed asset register
   - Purchase orders, receiving records and vendor invoices (for the three-way match)
   - The risk control matrix (RCM)

   If a record is missing, ask for it once. Then mark every check that needs it "not verified".

## When not to use

- You need an auditor's opinion or formal SOX testing. Ask your external auditor or internal audit team.
- You suspect fraud. Bring in a forensic accountant. This is a control self-check, not a fraud hunt.
- You only want to compare spending trends. Use a spreadsheet review or ask your accountant.

---

## Audit Framework

### Priority Order
1. **Existence & Occurrence** (Did the transactions actually happen?)
2. **Completeness** (Is everything recorded?)
3. **Rights & Obligations** (Does the company actually own the assets?)
4. **Valuation & Allocation** (Are the amounts correct?)
5. **Presentation & Disclosure** (Is the reporting clear and compliant?)

---

## Technical Audit Steps

Work through the areas in the order below. For each check, write down: the input record you used, the test you ran, and the finding in one sentence (or "not verified" if you had no real record). Use the same layout every time.

### 1. Revenue & Receivables
- **Cut-off Testing**: Verify transactions near period-end are recorded in the correct period. Steps: list invoices and shipments dated in the last 5 days before and the first 5 days after the period-end date. For each, compare the invoice date, the shipping or delivery date and the period it was posted to. A mismatch is any item posted to a period that does not match its delivery date.
- **AR Confirmations**: Check for high-value balances with no subsequent collection. Steps: from the AR aging report, list the largest balances and every balance past 90 days. For each, look for a payment after period-end. No payment means the balance is a finding. Run this only on the user's own records. If you have no real data for it, mark the check "not verified".

### 2. Procurement & Payables
- **Three-Way Match**: Verify Purchase Order, Receiving Report, and Vendor Invoice match. Steps: for each sample invoice, compare vendor, item, quantity and price across the three records. A mismatch is any difference in quantity or price that has no written approval, or any invoice paid with no receiving record.
- **Search for Unrecorded Liabilities**: Check payments made after year-end for services provided before year-end.

### 3. Fixed Assets & Inventory
- **Physical Verification**: Reconcile the asset register to physical counts. Steps: match each counted item to a register line by asset tag or description. List register lines with no item found, and items found with no register line. Either one is a finding. Run this only on the user's own counts. If you have none, mark the check "not verified".
- **Depreciation Check**: Recalculate depreciation to ensure consistency with policy. Steps: for a sample of assets, take cost, useful life and method from the policy, recalculate the year's charge, and compare it with the register. A difference the policy does not explain is a finding.

---

## Output Format

### Audit Findings Report Structure

**Executive Summary**
- Overall readiness view (e.g., "Looks ready," "Gaps that need fixing"). This is a self-check, not an audit opinion. Mark any check you could not run on real records as "not verified".
- Summary of Quantified Findings.

**Findings Detail**
- **Issue**: The specific control gap or error.
- **Risk**: The potential impact (Financial, Regulatory, Reputational).
- **Recommendation**: Step-by-step fix to close the gap.
- **Owner**: Suggested department to lead the fix.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Internal controls testing planner](https://useaiblocks.com/skills/internal-controls-testing).
- The [Control testing workpaper builder](https://useaiblocks.com/skills/control-testing-workpaper).
- The [Account reconciler](https://useaiblocks.com/skills/account-reconciler).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## References
- [Internal Control Standards](./references/internal-controls.md): Evidence and sources for COSO framework.
- [ISA Reference](./references/isa-standards.md): International Standards on Auditing overview.

---

## Related Skills
These are not part of this item. On AI Blocks, use Internal controls testing, Control testing workpaper or Account reconciler for the next step.

- **forensic-accounting**: If the audit detects signs of fraud.
- **financial-analysis**: To identify macro-level variances that need auditing.
- **tax-planning**: To audit tax compliance and filings.
