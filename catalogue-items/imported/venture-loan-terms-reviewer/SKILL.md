---
name: venture-debt
description: When the user wants to evaluate or structure debt for high-growth, venture-backed startups. Also use when the user mentions "startup loan," "warrants," "venture lending," "debt covenants for tech," "non-dilutive funding," or "growth capital debt."
metadata:
  version: 1.0.0
---

# Venture Debt Analysis

You review a venture debt term sheet **for the borrower** (the startup), not for the lender. You know how venture lenders think: they give non-dilutive capital to startups by structuring debt that accounts for high growth but lacks traditional collateral. Use that knowledge to protect the borrower.

**On AI Blocks the user is usually the borrower** who has a term sheet from a lender. Use the lender's method below to review the offer from the borrower's side: what it costs, what the borrower gives up, where the lender can stop funding, and what to ask the lender. If a term is missing (warrant coverage, strike price or valuation), write `MISSING: <what>` and tell the user to ask the lender to state it in writing before you run the numbers. Never invent a term. This is not legal advice.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **The deal terms** (yours): the price, payment terms, discounts, fees and dates of the deal.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for the deal terms. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

1. **The Equity Context**
   - Who are the lead VC investors? (Lender follows the equity).
   - How much equity capital has been raised to date?
   - What is the current "Cash Runway"?

2. **The Traction**
   - Monthly Recurring Revenue (MRR) and growth rate.
   - Gross Margins (Software vs. Hardware matters).

3. **Use of Funds**
   - Is this for runway extension, equipment financing, or acquisition?

---

## Venture Debt Framework

### Priority Order
1. **Underwriting** (Assessing how likely the next equity round is, as a low, medium or high judgement, not a percentage).
2. **Structuring** (Determining the loan amount, interest, and warrants).
3. **Covenant Design** (Setting growth/liquidity markers).
4. **Monitoring** (Tracking burn rate and traction post-funding).

---

## Technical Lending Steps

### 1. Warrant Calculation
- Determine the "Warrant Coverage" (e.g., 10% of the loan amount). 
- Calculate the number of shares the lender can buy at the current valuation.

### 2. Debt Service Coverage (DSCR)
- Unlike traditional companies, startups often have negative DSCR. The underwriter looks at "Runway Extension"—does the debt add 6-9 months to the zero-cash date?

### 3. "MAC" Clause Review
- Evaluate the "Material Adverse Change" clauses that allow the lender to freeze the line of credit if the startup's health deteriorates.

---

## Output Format

### Venture Debt Term Sheet

**The Terms**
- Loan Amount and Interest Rate (usually Prime + Margin).
- Repayment Period (Interest-only vs. Amortizing).
- Warrant Coverage and Strike Price.

**Covenants**
- Minimum Cash requirements.
- Minimum MRR targets.

**Risk Assessment**
- Refinance risk, rated low, medium or high (can they raise the next equity round in time to repay?). Base the rating on the runway and traction figures the user gave you, and say which figures drove it. This is a judgement, not a numeric probability. Do not give a percentage.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Convertible loan interest calculator](https://useaiblocks.com/skills/convertible-note-interest-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Venture Debt 101](./references/venture-lending.md): Warrants and covenants.
- [SaaS Lending Metrics](./references/saas-debt-metrics.md): Underwriting based on MRR.

---

## Related Skills
- **predictive-burn-rate**: To see if the debt provides enough runway.
- **startup-valuation**: To determine the value of the warrants.
- **risk-assessment**: For evaluating the default risk.
