---
name: "general-counsel-advisor"
description: "General Counsel advisory for startups: contract review (MSA, SaaS, NDA, DPA, employment), IP strategy, term sheet decoding, and regulatory landscape mapping. Use when reviewing any contract or term sheet, deciding when to engage outside counsel, defining IP strategy, evaluating regulatory exposure (HIPAA, GDPR, FDA, fintech), or when user mentions general counsel, GC, legal review, contract risk, term sheet, IP assignment, or regulatory exposure. NOT a substitute for licensed counsel — surfaces questions to bring to qualified attorneys."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: c-level
  domain: general-counsel-leadership
  updated: 2026-05-12
  python-tools: contract_risk_scanner.py, term_sheet_analyzer.py
  frameworks: contract-review, ip-strategy, term-sheet-decoding, regulatory-mapping
---

# General Counsel Advisor

Strategic legal frameworks for startup General Counsels and founders without one. Contract risk, IP strategy, term sheet decoding, regulatory landscape.

This is **not legal advice**. It surfaces the right questions to bring to qualified outside counsel and catches the obvious traps before they reach a signature. Treat every output as a starting point for a conversation with a licensed attorney, not as a substitute for one.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **The contract** (yours): the full agreement or terms, with dates and any changes.

**Makes it better (optional):**
- **The deal terms** (yours): the price, payment terms, discounts, fees and dates of the deal.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for the contract, the deal terms. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Keywords

general counsel, GC, legal review, contract review, MSA, SaaS agreement, NDA, DPA, employment agreement, contractor agreement, IP assignment, invention assignment, open source license, OSS compliance, term sheet, liquidation preference, anti-dilution, option pool, vesting, acceleration, drag-along, pro-rata, board composition, regulatory, HIPAA, GDPR, CCPA, FDA, MDR, fintech, BSA/AML, money transmitter, AI Act, indemnity, liability cap, force majeure, auto-renewal, choice of law, venue, non-compete, non-solicit

## Quick Start

```bash
# Scan a contract for risky clauses (uses bundled sample if no path given)
python scripts/contract_risk_scanner.py
python scripts/contract_risk_scanner.py path/to/contract.txt

# Analyze a term sheet for founder-friendliness
python scripts/term_sheet_analyzer.py
python scripts/term_sheet_analyzer.py path/to/term_sheet.json
```

**When not to use:** not for a signed contract that is in dispute (go to a licensed lawyer) and not a substitute for a lawyer on any binding deal. The figures below (12 months of fees, 5-year renewals, 60-day notice) are common examples. They are not legal norms and change by country and deal.

## Key Questions (ask these first)

- **Who owns the IP being created or shared?** (Founders forget that contractors don't auto-assign IP without a written clause.)
- **What's the liability cap, and what's carved out?** (A common example, not a legal norm: 12 months of fees, with carve-outs for IP infringement, data breach, willful misconduct.)
- **Is there a DPA in place if any personal data flows?** (GDPR, CCPA, state laws — non-negotiable if EU/CA data is touched.)
- **What's the termination right, notice period, and auto-renewal trap?** (5-year auto-renew with 60-day notice is a common founder mistake.)
- **Does this contract or product launch trigger a new regulatory regime?** (Healthcare → HIPAA. Fintech → BSA/AML. Medical device → FDA/MDR.)
- **For term sheets: liquidation preference, pre-money option pool, anti-dilution flavor?** (Three places where founder ownership can quietly shrink.)

## Core Responsibilities

### 1. Contract Review

Standard contracts a startup signs in its first 5 years:

- **Vendor MSA** — Master Service Agreement (cloud, tooling, services)
- **Customer SaaS Agreement** — your standard customer paper + customer redlines
- **NDA** — mutual + one-way, with carve-outs for residuals + independent development
- **DPA** — Data Processing Agreement (required when personal data flows)
- **Employment Agreement** — offer letter, IP assignment, non-compete (where enforceable), arbitration
- **Contractor / 1099 Agreement** — IP assignment is critical; misclassification risk
- **Equity Agreements** — option grants, RSU agreements, advisor grants (FAST template, YC SAFE for advisors)

**Run** `contract_risk_scanner.py` on the text. It flags 12 common founder-risk clauses using simple text-pattern checks. It is a prompt to read closely, not a legal verdict. If you cannot run code, read the text for each of these clauses yourself.

### 2. IP Strategy

- **Invention assignment** — every employee and contractor signs one. No exceptions.
- **Open source license compliance** — track every OSS dependency's license; AGPL and GPL trigger copyleft obligations.
- **Trade secrets** — define what's protected and how (clean room dev, access controls, NDAs).
- **Patents** — file provisional within 12 months of disclosure; PCT for international.
- **Trademarks** — register the word mark first, design mark second; clear before launch.
- **Copyright** — automatic on creation, but register for statutory damages eligibility.

See `references/ip_and_regulatory.md`.

### 3. Term Sheet Decoding

When a term sheet arrives, the difference between a founder-friendly and founder-hostile sheet often hides in three clauses:

- **Liquidation preference** — 1x non-participating is standard; 1x participating or 2x is hostile
- **Pre-money vs post-money option pool** — pre-money pool dilutes founders; post-money dilutes everyone proportionally
- **Anti-dilution** — broad-based weighted average is standard; full ratchet is hostile

**Run** `term_sheet_analyzer.py` to get a 0-100 founder-friendliness score with flags. The score is a rough guide from simple rules, not a legal judgement. If you cannot run code, skip the score and review each clause by hand.

### 4. Regulatory Landscape

When to engage outside counsel **before** committing:

| Trigger | Regime | First Step |
|---|---|---|
| Healthcare data | HIPAA, HITECH, state breach laws | Specialist health-tech counsel |
| Cardholder data | PCI DSS (industry standard, not law, but contractually required) | QSA + counsel |
| Money movement | BSA/AML, state money-transmitter (50-state patchwork) | Fintech specialist |
| Medical device claims | FDA 510(k) / De Novo / PMA, MDR (EU), ISO 13485 | Medical-device specialist |
| EU residents' personal data | GDPR + EU AI Act if AI is deployed | EU privacy counsel |
| California residents | CCPA / CPRA | Privacy generalist |
| Securities (tokens, equity crowdfunding) | SEC rules (Reg D, Reg A+, Reg CF) | Securities counsel |
| Defense / aerospace customers | ITAR, EAR, DFARS, CMMC | Export-control counsel |
| AI in EU | EU AI Act (risk-tiered) | EU privacy + product counsel |
| AI for hiring (NYC, CO, IL) | Local bias-audit laws | Employment counsel |

See `references/ip_and_regulatory.md` for sequencing.

## Workflows

### Workflow 1: Contract Review

(Workflows 1 and 2 need the Python scripts and Python 3, so they need an AI that can run code. Without it, read the document yourself using the questions and clause lists above, and say no scan was run.)
1. Save the contract as plain text
2. Run `contract_risk_scanner.py path/to/contract.txt`
3. For each HIGH risk finding, draft a counter-proposal
4. Bring the redline + counter-proposals to outside counsel
5. Write down the decision and the date, in your own notes

### Workflow 2: Term Sheet Response
1. Save the term sheet as a JSON file with these fields (the script reads them by these exact names; leave out any you do not know and it uses its default):
   - `round` (text), `pre_money` and `raise_amount` (numbers)
   - `liquidation_preference`: `multiple` (number), `participating` (true/false), `cap` (number or null)
   - `anti_dilution`: one of `broad_based_weighted_average`, `narrow_based_weighted_average`, `full_ratchet`, `none`
   - `option_pool`: `size_pct` (number), `pre_money` (true/false)
   - `board_composition`: `investor_seats`, `founder_seats`, `independent_seats` (numbers)
   - `vesting`: `standard_years`, `cliff_months` (numbers), `single_trigger_acceleration`, `double_trigger_acceleration` (true/false)
   - `pro_rata` (true/false); `drag_along`: `exists`, `founder_consent_required` (true/false)
   - `protective_provisions` and `information_rights`: `standard` or `aggressive`; `dividends`: `none`, `non_cumulative_when_declared` or `cumulative`
   Running the script with no file uses its built-in sample, which shows the same shape.
2. Run `python scripts/term_sheet_analyzer.py path/to/term_sheet.json`
3. Review the founder-friendliness score and per-clause flags. The score is a rough pattern check. Never use it as the reason to sign or not sign
4. Pick the worst 3 clauses to raise (don't try to win all 20), and take them to a securities/venture attorney
5. Have that attorney review the whole term sheet before you negotiate, decide or sign
6. Write down the decision and the date, then wait 30 days before you re-open it, so the choice is not undone in the heat of the moment

### Workflow 3: IP Hygiene Audit
1. Confirm every employee and contractor (past 12 months) signed invention assignment
2. Run an OSS license inventory (`pip-licenses`, `license-checker` for npm)
3. Map AGPL/GPL dependencies and confirm compliance (or remove)
4. File provisional patents on novel inventions (12-month deadline from disclosure)
5. Register word-mark trademarks for the product name

### Workflow 4: Regulatory Trigger Assessment
1. List planned product features for the next 12 months
2. Map each feature to the trigger table in this document
3. For any HIPAA / FDA / fintech trigger, engage a specialist counsel **before** building
4. Document the regulatory roadmap and budget alongside the product roadmap
5. Pair with `cs-ciso-advisor` for ISO 27001 / SOC 2 sequencing

## Output Standard

Return these five sections in this order, in under 800 words in total. Add a sixth, "Founder-friendliness score", only for a term sheet and only if the script was run. The Bottom Line is a view to discuss with a lawyer, not a legal verdict.

```
**Bottom Line:** [sign / negotiate / do not sign, in one sentence]
**The Risks:** [3 highest-severity issues, each in plain words]
**Counter-Proposals:** [specific language]
**Outside Counsel Action Items:** [what to bring to the attorney]
**Your Decision:** [the call only the founder can make]
**Founder-friendliness score (term sheets only):** [0-100 and per-clause flags, marked as a rough guide]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Contract plain-language summary writer](https://useaiblocks.com/prompts/plain-words-contract-summary). It takes the audit report.
- The [Contract summary writer](https://useaiblocks.com/skills/contract-plain-summary). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Adjacent Skills

These skills are part of the original package and are not included in this copy.

- `c-level-advisor/skills/ciso-advisor/` — Compliance overlap (SOC 2, ISO 27001, HIPAA technical safeguards)
- `c-level-advisor/skills/cfo-advisor/` — Term sheet → dilution math
- `c-level-advisor/skills/ma-playbook/` — Acquisition agreements, integration playbooks
- `ra-qm-team/` — ISO 13485, MDR, FDA 510(k), GDPR execution
- The original package also had a `/cs:gc-review` slash command. It is not part of this copy. Ask for the Output Standard above in plain words instead.

## References

- [contracts_playbook.md](references/contracts_playbook.md) — Standard contracts, clause checklist, common founder traps
- [ip_and_regulatory.md](references/ip_and_regulatory.md) — IP protection + regulatory landscape mapping
- [term_sheet_decoder.md](references/term_sheet_decoder.md) — Term sheet glossary + founder-friendly defaults + pushback strategies

---

**Version:** 1.0.0
**Status:** Production Ready
**Disclaimer:** Not legal advice. Always engage qualified counsel for binding decisions.
