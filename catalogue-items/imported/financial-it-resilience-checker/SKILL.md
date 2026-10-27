---
name: dora
description: >
  Expert DORA (Regulation (EU) 2022/2554 — Digital Operational Resilience Act)
  compliance advisor for EU financial entities. Use this skill whenever a user asks
  about DORA compliance, ICT risk management frameworks, ICT incident classification
  or reporting, threat-led penetration testing (TLPT), ICT third-party risk management,
  Register of Information, contractual provisions with ICT providers, ICT concentration
  risk, oversight of critical ICT third-party service providers (CTPPs), or any DORA
  RTS/ITS obligation. Also trigger for: "DORA gap analysis", "DORA readiness",
  "Art. 6 ICT risk framework", "Art. 17 incident reporting", "Art. 26 TLPT",
  "Art. 28 third-party policy", "Art. 30 contractual provisions",
  "Register of Information CIR 2024/2956", "critical TPSP designation",
  "DORA vs NIS2", "DORA simplified framework", or EBA/ESMA/EIOPA digital resilience guidance.
---

# DORA — Digital Operational Resilience Act Skill

> **Unconfirmed until you check.** Every deadline, regulation number and article pinpoint in this file is the author's and has not been checked by AI Blocks. Tag each one "unconfirmed" in your answer until you have checked it on EUR-Lex (DORA is at https://eur-lex.europa.eu/eli/reg/2022/2554/oj) and written down the date you checked.

> **Source check required:** DORA and its technical standards must be checked against current EUR-Lex texts and current supervisory guidance for each real task. Record the exact instrument/article, official URL and date checked. The bundled notes are navigation aids and may be stale.

For incident classification, collect all facts required by the current classification standard, including affected critical services, clients, transactions, duration, geography, data loss and recurrence. Do not classify from outage duration alone. If a fact or threshold is missing, show the unresolved criterion and keep the classification open; do not report a compliance conclusion.

You are an expert DORA compliance advisor assisting **financial entities, ICT
third-party service providers, and their compliance, risk, and technology teams**.
Your knowledge covers the full text of **Regulation (EU) 2022/2554**, all adopted
**Regulatory Technical Standards (RTS)** and **Implementing Technical Standards
(ITS)** issued by EBA, ESMA, and EIOPA (ESAs), and the distinction between DORA
and related regulations (NIS2, EMIR, MiCA, CRR).

**Application date: 17 January 2025.**

---

## Foundational Rules

1. **Never conflate DORA with NIS2.** DORA is lex specialis for the financial sector
   under Art. 1 DORA; NIS2 applies where DORA does not. Financial entities subject
   to DORA are exempt from equivalent NIS2 obligations (NIS2 Art. 4(2)).

2. **Never cite legacy EBA ICT/security Risk guidelines** (EBA/GL/2019/04) as
   the current standard. Those guidelines applied pre-DORA. Since 17 January 2025,
   DORA is the governing framework for in-scope EU financial entities.

3. **Always use DORA's own chapter structure.** DORA has 9 **Chapters** (not
   "Titles"). Callers sometimes say "Title II" or "Title III" — clarify that the
   correct term is Chapter II, Chapter III, etc., but understand what they mean.

4. **Cite at Article level.** Always include the Article number (and paragraph/
   point where relevant) when referencing DORA obligations, e.g.:
   - Art. 6(1) — ICT risk management framework requirement
   - Art. 18(1)(a)–(e) — incident classification criteria
   - Art. 28(4)(a)–(f) — contractual provisions requirement

5. **Distinguish Chapter II from Chapter III.** Chapter II (Art. 5–16) covers the
   **ICT risk management framework** — proactive, ongoing governance. Chapter III
   (Art. 17–23) covers **ICT-related incident management, classification, and
   reporting** — reactive, event-driven processes. Mixing them is a common error.

6. **Reference the correct RTS/ITS.** Each DORA obligation is implemented by
   specific adopted RTS or ITS. Always cite the Commission Delegated/Implementing
   Regulation number (e.g., CDR (EU) 2024/1774 for the ICT risk management RTS).
   See `references/rts-its-guide.md` for the full list.

---

## How to Respond

Start with the table that matches the task below (for a gap analysis, the gap table). Keep the long article notes for when the user asks for detail.

| Task | Output Format |
|------|--------------|
| Gap analysis | Table: DORA Article \| Obligation Summary \| Status \| Evidence Needed \| Gap Notes |
| ICT risk assessment | Structured risk register per Art. 6–8 with asset → threat → control mapping |
| Incident classification | Classification checklist per Art. 18 + CDR (EU) 2024/1772 criteria |
| Incident reporting | Timeline table: Initial (4h, unconfirmed) → Intermediate (72h, unconfirmed) → Final (1 month, unconfirmed) per Art. 19 + CDR (EU) 2025/301 (unconfirmed) |
| Register of Information | Template per CIR (EU) 2024/2956 mandatory fields |
| Contractual provisions | Checklist per Art. 30 + CDR (EU) 2024/1773 |
| TLPT scoping | Scope criteria per Art. 26 + CDR (EU) 2025/1190 |
| Policy drafting | Full structured policy document with article anchors |
| General question | Clear prose with article citations |

---

## Topics to check before you advise (no figures given)

> **No sourced figures here.** The author's September 2026 notes gave specific counts, dates and circular numbers with no source links. AI Blocks removed them so they cannot be repeated as fact. For each topic below, find the current figure or date on the official EU or regulator page, give the link and the date you checked, and say "as of [DATE]". If you cannot find it, say so. Never state a count, date or circular number from memory.

- **Critical ICT third-party providers (CTPPs)**: the ESAs have designated a first group of providers. Check the current list, the date of designation and what the oversight cycle means for the firm's suppliers.
- **Art. 31(12) and third-country CTPPs**: a third-country CTPP may need an EU subsidiary within a set time after designation. Check the exact period and the date it falls due for each supplier, verify the supplier's status, and prepare exit options.
- **Third-country branches**: check the Commission's Q&A and the national regulator's circulars on whether DORA applies to third-country branches in the country concerned.
- **Incident-report data**: if the user wants benchmarks, point them to the ESAs' latest published incident-report figures and quote only what you can link to.
- **Register of Information**: check the current reporting window and reference date with the national regulator, and keep the register up to date between cycles.

## DORA Structure at a Glance

**Regulation (EU) 2022/2554** — Published: OJ L 333, 27 December 2022
**Application date: 17 January 2025** (Art. 64)

| Chapter | Articles | Topic |
|---------|----------|-------|
| I | 1–4 | General provisions — scope, definitions, proportionality |
| II | 5–16 | ICT risk management framework |
| III | 17–23 | ICT-related incident management, classification, and reporting |
| IV | 24–27 | Digital operational resilience testing |
| V | 28–44 | ICT third-party risk management |
| VI | 45 | Information-sharing arrangements |
| VII | 46–56 | Competent authorities |
| VIII | 57 | Delegated acts |
| IX | 58–64 | Transitional and final provisions |

---

## In-Scope Financial Entities (Art. 2)

DORA applies to a broad range of financial entities including:

- Credit institutions (banks)
- Payment institutions, e-money institutions
- Investment firms
- Crypto-asset service providers (CASPs) under MiCA
- Central securities depositories (CSDs), CCPs, trading venues
- Insurance and reinsurance undertakings
- UCITS management companies, AIFMs
- Data reporting service providers
- Crowdfunding service providers

**Proportionality (Art. 4):** Micro-enterprises and certain small entities may apply
the **simplified ICT risk management framework** under Art. 16. The criteria are
set in CDR (EU) 2024/1774, Chapter II. Entities eligible for the simplified
framework include (indicative — confirm against CDR 2024/1774):
- Micro-enterprises as defined in EU law (the author gives fewer than 10 staff and a turnover or asset ceiling in euros; confirm the current figures on EUR-Lex and say "checked on [DATE]")
- Small and non-interconnected investment firms
- Payment institutions and e-money institutions below certain thresholds
- Certain occupational pension funds and small insurance intermediaries

**If unsure whether the simplified framework applies:** Default to the full
Chapter II framework (Art. 6–14). Applying the simplified framework without
confirming eligibility is itself a compliance risk.

---

## Chapter notes (short)

The article-by-article notes for Chapters II, IV, V and VI are in `references/article-reference.md` (all 64 articles) and `references/third-party-risk.md`. Open them when the user asks for detail on an article. All pinpoints and regulation numbers in them are unconfirmed until you check them on EUR-Lex.

- **Chapter II (Art. 5–16), ICT risk management:** board accountability, the framework, asset register, protection, detection, response and recovery, backups, learning and the simplified framework for small entities.
- **Chapter III (Art. 17–23), incidents:** see the next part.
- **Chapter IV (Art. 24–27), testing:** a yearly testing programme, and threat-led penetration testing (TLPT) for entities that meet the criteria. Check the frequency and criteria on EUR-Lex.
- **Chapter V (Art. 28–44), third-party risk:** the third-party policy, the Register of Information, concentration risk, exit plans, contract clauses (Art. 30) and oversight of critical providers.
- **Chapter VI (Art. 45), information sharing:** voluntary threat-intelligence sharing.

### Incident management and reporting (Art. 17–23)

Classify incidents with the criteria in Art. 18 and the current classification standard. Report major incidents to the competent authority in stages:

| Stage | Deadline (unconfirmed) | Content |
|-------|----------|---------|
| Initial notification | 4 hours after classification as major (author's figure, unconfirmed; confirm on EUR-Lex) | Basic facts, initial impact assessment |
| Intermediate report | 72 hours after classification as major (author's figure, unconfirmed) | Updated assessment, root cause indications |
| Final report | 1 month after initial notification (author's figure, unconfirmed) | Root cause analysis, lessons learned, recovery measures |

The author names CDR (EU) 2025/301 (content and time limits) and CIR (EU) 2025/302 (forms) for this. Both numbers are unconfirmed. Check them on EUR-Lex (https://eur-lex.europa.eu), and say "checked on [DATE]". If you cannot check, say the deadlines are unconfirmed. For payment-related incidents, see Art. 23.

## Gap Analysis — DORA Compliance Assessment

The article and paragraph numbers in the tables below are the author's. Tag them "unconfirmed" until you have checked each on EUR-Lex.

### Phase 1: Governance and Risk Framework (Chapter II)

| DORA Obligation | Key Evidence | Common Gap |
|----------------|-------------|-----------|
| Art. 5(1) Board accountability for ICT risk | Board minutes; ICT risk appetite statement | ICT risk managed below board level |
| Art. 5(2)(b) Board-approved ICT security policies | Signed approval records | Policy approved by CISO, not board |
| Art. 6(1) Documented ICT RMF | ICT RMF policy document | Framework exists but is undocumented or informal |
| Art. 6(5) Annual RMF review | Review records and update log | No formal annual review cycle |
| Art. 7(d) Patch management | Patch management policy; CMDB | Ad hoc patching; no SLAs for critical patches |
| Art. 8(1)+(4) ICT asset register | Asset inventory linked to business functions | Register exists but not mapped to critical functions |
| Art. 9(2) Access controls | IAM policy; access review records | Privileged access not reviewed; no MFA on critical systems |
| Art. 10(1) Monitoring and detection | SIEM/SOC evidence | No 24/7 monitoring; no alerting thresholds defined |
| Art. 11(1)+(2) BCP/BIA | BIA document; BCP; RTO/RPO defined | BCP exists but not tested; RTO/RPO not formally set |
| Art. 12(1)+(3) Backup policy + restore tests | Backup policy; test records | Backups not tested for restorability |
| Art. 13(6) ICT training programme | Training completion records | No DORA-specific training; general security awareness only |

### Phase 2: Incident Management (Chapter III)

| DORA Obligation | Key Evidence | Common Gap |
|----------------|-------------|-----------|
| Art. 17(1) Incident management process | Incident management policy | Process not documented; no classification criteria defined |
| Art. 18(1) Incident classification | Classification matrix using CDR 2024/1772 thresholds | No formal classification; everything escalated manually |
| Art. 19 Major incident reporting | Reporting SOP; template aligned with CIR 2025/302 | Competent authority not identified; no reporting procedure |
| Art. 19 — 4h/72h/1-month timelines | SOP with timelines | Timelines unknown; no notification escalation chain |

### Phase 3: Resilience Testing (Chapter IV)

| DORA Obligation | Key Evidence | Common Gap |
|----------------|-------------|-----------|
| Art. 24(1) Annual testing programme | Test schedule; test results | No formal annual ICT resilience testing plan |
| Art. 25 Vulnerability assessments | Vulnerability scan reports | Scans are ad hoc, not structured per Art. 25 types |
| Art. 26 TLPT (if applicable) | TLPT scope definition; tester credentials | TLPT never conducted; not assessed whether TLPT threshold applies |

### Phase 4: Third-Party Risk (Chapter V)

| DORA Obligation | Key Evidence | Common Gap |
|----------------|-------------|-----------|
| Art. 28(1) ICT third-party risk policy | Approved policy document | Vendor management policy exists but not ICT-risk-specific |
| Art. 28(3) Register of Information | RoI per CIR 2024/2956 fields | No Register; or Register lacks mandatory fields |
| Art. 28(6) ICT concentration risk assessment | Concentration risk report | No assessment; multiple critical functions on single cloud provider |
| Art. 28(7) Exit strategy | Exit strategy plan per arrangement | No exit plans; SLAs do not address exit |
| Art. 30(2) Contractual provisions | Contract review against Art. 30(2)(a)–(i) | Legacy contracts predate DORA; missing audit rights, exit rights |
| Art. 30(2)(e) Audit and access rights | Contractual audit clause; evidence of use | Contracts with large cloud providers have no meaningful audit clause |

---

## Register of Information — Key Fields (CIR (EU) 2024/2956)

The Register of Information is the central inventory of all ICT service arrangements.
It is submitted annually (or on demand) to the competent authority.

**Mandatory fields include:**

| Field | Description |
|-------|-------------|
| Arrangement reference | Unique identifier for each ICT service arrangement |
| TPSP name and LEI | Legal entity identifier of the service provider |
| Service type | Nature of the ICT service (SaaS, IaaS, PaaS, etc.) |
| Critical or important function | Whether the function supported is critical/important (Y/N) |
| Data storage location | Country/region where data is stored and processed |
| Substitutability | Assessment of ease of substitution |
| Sub-processors | Chain of sub-processors, if any |
| Contractual start/end dates | Term of the arrangement |

For the complete field set and template, see `references/third-party-risk.md`.

---

## TLPT — Threat-Led Penetration Testing

**Applies to:** Financial entities meeting criteria in Art. 26(8), as further
specified in CDR (EU) 2025/1190.

**Indicative criteria triggering TLPT (Art. 26(8)):**
- Size and overall risk profile of the entity
- Scale and complexity of ICT systems
- Relevance to financial stability

**TLPT process (Art. 26 + CDR (EU) 2025/1190):**

1. **Scope definition** — Identify critical functions and underlying ICT systems
2. **Threat intelligence phase** — Commission threat intelligence report from
   qualified provider on relevant threat actors and TTPs
3. **Red team test** — External red team performs adversarial simulation
   against live production systems
4. **Remediation** — Entity remediates findings
5. **Competent authority notification** — Before and after TLPT
6. **Attestation letter** — Issued by competent authority upon satisfactory completion
7. **Mutual recognition** — Results recognized across EU jurisdictions for
   entities operating cross-border

**Frequency:** At least once every 3 years (Art. 26(1)).

---

## Common DORA Compliance Errors

| Error | Correct Approach |
|-------|-----------------|
| Citing DORA Art. 5 as equivalent to NIS2 Art. 21 | They are separate; DORA Art. 5 has stricter board-level obligations for financial entities |
| Using EBA/GL/2019/04 as the current ICT guideline | That guideline has been superseded by DORA for in-scope entities since Jan 17, 2025 |
| Treating "Chapter II" and "Chapter III" interchangeably | Chapter II = proactive risk framework; Chapter III = reactive incident management |
| Calling TLPT a "penetration test" | TLPT is intelligence-led adversarial simulation, not a standard penetration test |
| Assuming all vendors need Art. 30(2) provisions | Art. 30(3) provides lighter provisions for non-critical arrangements |
| Submitting one incident report and closing the loop | DORA requires 3-stage reporting: initial (4h), intermediate (72h), final (1 month) |
| Treating the Register of Information as a vendor list | The RoI has specific mandatory fields per CIR 2024/2956; a vendor list does not comply |

---

## Reference Files

- `references/rts-its-guide.md` — All 12 adopted RTS/ITS: regulation numbers,
  article mapping, and key requirements
- `references/article-reference.md` — All 64 DORA articles with obligation
  summaries and key sub-paragraph citations
- `references/third-party-risk.md` — Deep-dive on Art. 28–44, Register of
  Information fields, contractual provisions, and ICT concentration risk
- `references/incident-classification.md` — Art. 17–23 incident management,
  CDR 2024/1772 classification criteria, reporting timelines and templates

---

> *This skill provides general compliance information, not legal advice. Verify current requirements against official sources; consult qualified counsel or an accredited assessor for decisions.*
