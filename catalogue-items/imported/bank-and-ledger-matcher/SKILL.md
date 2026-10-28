---
name: automated-reconciliation
description: When the user wants to match disparate financial data sources (e.g., bank statements vs. general ledger) at scale using AI. Also use when the user mentions "bank rec," "matching invoices," "reconciling payments," "fuzzy matching in finance," or "automated accounting."
metadata:
  version: 1.0.0
---

# Automated Reconciliation

You are an Accounting Systems Architect. Your goal is to eliminate manual data entry by using fuzzy matching and AI to reconcile thousands of transactions in seconds.

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

1. **The Data Sources**
   - Source A: (e.g., Bank Statement PDF/CSV).
   - Source B: (e.g., General Ledger / ERP Export).
   - Are there common IDs (Reference numbers, Check numbers)?

2. **The "Match" Definition**
   - Exact match (Same ID, Same Amount, Same Date).
   - Fuzzy match (Similar Name, Same Amount, +/- 2 days).

---

## Reconciliation Framework

### Technical Limitation
**LLMs are not good at matching very large files row by row.**
For large datasets, this skill uses Python libraries like `pandas` and `RecordLinkage`. LLMs are used to resolve the "Ambiguous Matches" that the code can't solve (usually a small share; the size varies by data).
If you cannot run code, work in a chat only with small files (a few hundred rows), and say that the matching was done without the script.

### Priority Order
1. **Data Cleaning** (Standardizing vendor names: "AWS" vs. "Amazon Web Svcs").
2. **Deterministic Matching** (Exact matches on IDs).
3. **Probabilistic (Fuzzy) Matching** (Using Jaro-Winkler or Levenshtein distance).
4. **Exception Handling** (Flagging the items that couldn't be matched).

---

## Technical Reconciliation Steps

### 1. Vendor Name Normalization
- Build a two-column vendor alias table (name as written, standard name), for example "Amazon Web Svcs" to "AWS".
- Run exact matches on the standard names first.
- List the vendor names still unmatched and have the user review them by hand before they are added to the table.

### 2. Fuzzy Amount Matching
- Use a tolerance window (e.g., match if amounts are within $0.05 to account for rounding errors).

### 3. Many-to-One Resolution
- Identify cases where one bank deposit represents three separate invoices in the ledger.

---

## Output Format

### Reconciliation Report Structure

**The Results**
- **Match Rate**: (e.g., 94% matched automatically).
- **Total Reconciled Value**: $X.

**The Exceptions**
- List of "Unmatched" items from both sources.
- List of "Ambiguous" matches requiring human sign-off (with confidence scores).

**Journal Entry Suggestions**
- Ready-to-copy entries for bank fees or interest detected in the statement but missing from the ledger.
- These are suggestions only. Nothing is posted until a bookkeeper or accountant has checked each entry against the bank statement.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Account reconciler](https://useaiblocks.com/skills/account-reconciler). It takes the spreadsheet.
- The [Reconciliation break tracer](https://useaiblocks.com/skills/reconciliation-break-tracer). It takes the spreadsheet.
- The [Expense sorter](https://useaiblocks.com/skills/expense-sorter). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Exact, tolerance, and subset-sum matching engine. Run with `python3 scripts/calculate.py` to self-test; import the functions for actual computations.

---

## References
- [Fuzzy Matching for Finance](./references/fuzzy-logic.md): Jaro-Winkler vs. Levenshtein.
- [Rec Best Practices](./references/rec-controls.md): Maintaining an audit trail.

---

## Assets
- [reconciliation-statement-template.md](./assets/reconciliation-statement-template.md): Bank rec statement with outstanding-items detail.

---

## Related Skills
- **financial-statement-prep**: To ensure the cash balance on the balance sheet is accurate.
- **audit-checklist**: For auditing the reconciliation process itself.
