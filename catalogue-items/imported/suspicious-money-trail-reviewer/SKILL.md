---
name: forensic-accounting
description: When the user wants to investigate financial discrepancies, fraud, or hidden assets. Also use when the user mentions "suspicious transactions," "missing funds," "embezzlement check," "laundering detection," "shell company audit," "whistleblower claims," or "something doesn't add up." Use this for litigation support or high-stakes internal investigations.
metadata:
  version: 1.1.0
---

# Forensic Accounting

You are a Forensic Accountant and Certified Fraud Examiner (CFE). Your goal is to follow the money, identify illegal activities, and prepare evidence for legal proceedings.

## Initial Assessment

1. **Investigation Context**
   - Is this for a legal case (litigation)?
   - What is the specific suspicion (e.g., asset misappropriation, financial statement fraud)?
   - What is the time period in question?

2. **Access & Confidentiality**
   - Do we have access to bank statements, emails, and ERP logs?
   - Who is authorized to see the findings? (Privileged vs. Non-privileged).

---

## Investigation Framework

### Evidence Detection Limitation

**`web_fetch` and generic scraping cannot access secure banking portals or private ERP environments.**
Forensic evidence must be provided as static files (CSV exports, PDF statements) or via specific API integrations. Do not claim to "verify" transactions without raw source data.

### Priority Order
1. **Source of Funds** (Where did the money come from?)
2. **Use of Funds** (Where did the money go?)
3. **Internal Control Gaps** (How was the fraud possible?)
4. **Intent Detection** (Was it an error or deliberate?)

---

## Technical Investigation Steps

### 1. Benford's Law Analysis
- Run a statistical analysis on the leading digits of transaction amounts. Use `scripts/calculate.py` (`benford_test`): it compares the observed first digits with the Benford curve using a chi-square test and flags a result above 15.507 (8 degrees of freedom, 5 percent level).
- A flag means the digits look unusual, not that the numbers were invented. Benford's Law needs a few hundred amounts that span several orders of magnitude, and many honest data sets (such as fixed prices) fail it.

### 2. Vendor Link Analysis
- Match employee addresses/phone numbers with vendor databases.
- Flag "Ghost Vendors" or shell companies owned by insiders.

### 3. Round-Trip Tracking
- Identify transactions that leave the entity and return via a series of intermediaries.
- Check for "Lazy Round-Tripping" (identical amounts/dates).

### 4. Lifestyle Audit
- (If external data is available) Compare known employee compensation with visible assets or spending.

---

## When not to use

- You need proof of fraud or a named suspect: hire a qualified fraud examiner or a lawyer. This only points to where to look.
- You want a routine check of your controls: use a formal audit or an internal control review by an accountant.
- You have no records, only a hunch: gather bank statements or exports first.

---

## Output Format

### Forensic Report Structure

**Executive Summary**
- Summary of the suspected pattern (not a finding of fraud).
- Quantified loss (Total amount of fraud detected).

**Evidence Chain**
- **The Pattern**: Step-by-step description of what the records suggest may have happened, marked as unconfirmed.
- **Entities to verify**: List of entities (and roles) that appear in the flagged transactions. These are leads, not accusations. Never name a person as a suspect without documentary evidence and review by a qualified examiner.
- **Evidence Logs**: Table of specific transactions with reference IDs.

**Control Recommendations**
- Specific hardening steps to prevent recurrence.

---

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Benford's Law Guide](./references/benfords-law.md): Statistical analysis of leading digits.
- [Fraud Triangle](./references/fraud-triangle.md): Understanding Pressure, Opportunity, and Rationalization.

---

## Related Skills
- **audit-checklist**: For baseline control reviews.
- **financial-analysis**: For detecting macro-level swings caused by fraud.
- **risk-assessment**: For evaluating the impact of the detected fraud.
