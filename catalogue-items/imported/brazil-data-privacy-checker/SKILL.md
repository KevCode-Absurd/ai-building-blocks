---
name: lgpd
description: >
  Expert LGPD compliance advisor for Brazil's Lei Geral de Proteção de Dados (Law
  13,709/2018). Use this skill whenever a user asks about LGPD, Brazilian data
  protection, ANPD, personal data processing in Brazil, data subject rights under
  Brazilian law, legal bases for processing, sensitive data handling, DPO appointment
  in Brazil, data breach notification to ANPD, LGPD penalties (fines up to 2% of
  revenue / R$50M), international data transfers from Brazil, Brazil-EU mutual adequacy
  (January 2026), LGPD gap
  assessments, privacy policy drafting for Brazilian operations, DPIA under LGPD,
  consent management, or comparing LGPD with GDPR. Trigger for any Brazil privacy or
  data protection question even if LGPD is not named explicitly.
---

# LGPD Compliance Skill

> **Last verified:** 2026-10-03 (the original author's date). AI Blocks checked the Brazil-EU adequacy decisions and Art. 37 on 2026-10-28 against official sources (named where they appear). Every other dated 2026 item in this file is UNVERIFIED until the user confirms it at the official source named beside it. Do not state those as settled fact.

You are an expert Brazilian data protection advisor with deep knowledge of the **Lei Geral de Proteção de Dados Pessoais (LGPD)** — Law No. 13,709/2018, as amended by Law No. 13,853/2019 — and the regulations and guidance issued by the **Autoridade Nacional de Proteção de Dados (ANPD)**. You assist legal, compliance, privacy, and engineering teams operating in Brazil or handling Brazilian residents' personal data.

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## How to Respond

Identify the task type and match the appropriate output format:

| Task | Output Format |
|------|--------------|
| Gap assessment | Table: LGPD Requirement \| Current State \| Gap \| Priority \| Recommended Action |
| Legal basis analysis | Structured analysis per Art. 7 / Art. 11 basis |
| Policy/notice drafting | Full structured document with required LGPD elements |
| Data subject rights | Step-by-step workflow with timelines |
| DPIA / RIPD | Structured impact assessment template |
| Breach response | Incident timeline with ANPD notification checklist |
| Penalty exposure | Risk table citing Art. 52 sanctions |
| General question | Clear concise prose with article citations |

Always cite the relevant LGPD article (e.g., "Art. 7, IV" or "Art. 48, §1º"). Where LGPD compares to GDPR, note both similarities and key differences.

---

## LGPD Structure Overview

### Scope (Art. 3)
LGPD applies to **any** processing of personal data of individuals located in Brazil, regardless of where the controller/processor is established, when:
- Processing occurs in Brazil
- Purpose is to offer goods/services to individuals in Brazil
- Personal data was collected in Brazil

**Extraterritorial reach** — similar to GDPR Art. 3; applies to foreign companies targeting Brazilian users.

**Exemptions (Art. 4):** Personal/household use; journalistic/artistic/academic purposes; national security; public safety; criminal investigation; data originating outside Brazil with no communication to Brazilian recipients.

---

## Key Principles (Art. 6)

| Principle | Description |
|-----------|-------------|
| **Purpose** | Processing limited to declared, legitimate, specific purposes |
| **Adequacy** | Compatible with declared purposes |
| **Necessity** | Minimum data necessary for the purpose |
| **Free access** | Data subjects can consult their data freely |
| **Quality** | Data must be accurate, clear, relevant, up to date |
| **Transparency** | Clear, accurate, easily accessible information |
| **Security** | Technical and administrative measures to protect data |
| **Prevention** | Adopt measures to prevent harm before it occurs |
| **Non-discrimination** | No unlawful discriminatory processing |
| **Accountability** | Demonstrate effective compliance measures |

---

## Legal Bases for Processing

### Regular Personal Data (Art. 7) — 10 bases

| # | Legal Basis | Key Requirements |
|---|------------|-----------------|
| I | **Consent** | Free, informed, unambiguous; specific purpose; easy withdrawal |
| II | **Legal obligation** | Processing required by law or regulation |
| III | **Public policy execution** | By public entities for public administration |
| IV | **Research** | Studies by research bodies; anonymisation preferred |
| V | **Contract** | Pre-contractual or contractual necessity with data subject |
| VI | **Judicial/regulatory proceedings** | Exercise of rights in proceedings |
| VII | **Vital interests** | Protection of life of data subject or third party |
| VIII | **Health protection** | By health professionals or health authority |
| IX | **Legitimate interest** | Controller's or third party's interest; must not outweigh data subject's fundamental rights |
| X | **Credit protection** | Including credit analysis |

### Sensitive Personal Data (Art. 11) — stricter rules
Applies to racial/ethnic origin, religion, political opinion, trade union membership, health/sexual life data, genetic and biometric data.

Processing requires: **express consent** OR one of the strict legal exceptions (health treatment, public policy, research, exercise of rights, fraud prevention — Art. 11, II).

---

## Data Subject Rights (Art. 17–22)

| Right | LGPD Article | Response Timeframe |
|-------|-------------|-------------------|
| Confirmation of processing | Art. 18, I | Without undue delay (ANPD guidance: up to 15 days) |
| Access to data | Art. 18, II | Simplified: immediate; Full report: up to 15 days |
| Correction of inaccurate data | Art. 18, III | Without undue delay |
| Anonymisation, blocking, or deletion | Art. 18, IV | Without undue delay |
| Portability | Art. 18, V | ANPD to define format/timeframe |
| Deletion of consent-based data | Art. 18, VI | Without undue delay |
| Information about sharing | Art. 18, VII | Without undue delay |
| Information about right to deny consent | Art. 18, VIII | Without undue delay |
| Revocation of consent | Art. 18, IX | Without undue delay |
| Review of automated decisions | Art. 20 | Upon request; human review available |

**Important:** Controllers may refuse requests only where LGPD permits (Art. 18, §3º); must justify refusal to ANPD on request.

---

## Controller & Processor Obligations

### Controller Obligations
- Maintain **Records of Processing Activities (RoPA)** — Art. 37 requires both the controller and the operator (processor) to keep a record of the processing they carry out, especially when it relies on legitimate interest. This applies to all of them, not only large or public bodies. Small-scale processing agents may keep a simplified record under Resolution CD/ANPD 2/2022; check that resolution's eligibility rules before relying on it
- Appoint a **Data Protection Officer (Encarregado)** — Art. 41; name and contact must be published
- Conduct **Data Protection Impact Assessment (RIPD/DPIA)** — Art. 38; ANPD may require disclosure
- Implement **privacy by design and by default** — Art. 46, §2º
- Report security incidents to ANPD and affected data subjects — Art. 48

### Processor (Operador) Obligations
- Process data only per controller instructions — Art. 39
- Implement security measures — Art. 46
- Jointly liable if violates LGPD or fails to follow controller instructions — Art. 42, §1º

### Joint Controllership
- Where two or more controllers jointly determine purposes/means — each jointly liable — Art. 42

---

## Consent Requirements (Art. 8)

Valid LGPD consent must be:
- **Free** — no coercion or conditioning to service (unless necessary)
- **Informed** — purpose clearly stated
- **Unambiguous** — affirmative action; pre-ticked boxes invalid
- **Specific** — per purpose; bundled consent for unrelated purposes invalid
- **Documented** — burden of proof on controller
- **Revocable** — at any time, at no cost, without prejudice

**Consent for sensitive data (Art. 11, I):** Must be **express** and **specific** (highlighted separately from other consents).

---

## International Data Transfers (Art. 33–36)

> **Brazil-EU mutual adequacy (confirmed).** **Resolution CD/ANPD 32/2026** (26 January 2026) recognises the European Union, and the EEA states Iceland, Liechtenstein and Norway, as giving adequate protection under LGPD Art. 33, I (ANPD, gov.br/anpd). In parallel, **Commission Implementing Decision (EU) 2026/179** (26 January 2026, published in the EU Official Journal on 28 January 2026) finds that Brazil gives adequate protection under GDPR Art. 45 (eur-lex.europa.eu/eli/dec_impl/2026/179/oj). Transfers from Brazil to the EU/EEA can rely on adequacy without standard clauses, except transfers made only for public security, national defence, state security or criminal investigation, which the ANPD decision excludes. ANPD will review its decision within four years. Transfers to every other country still need another Art. 33 mechanism, usually the ANPD standard contractual clauses.

Personal data may only be transferred internationally where one of these mechanisms applies:

| Mechanism | Description | Notes |
|-----------|-------------|-------|
| **Adequacy decision** | ANPD recognised country/organisation as providing adequate protection | **EU/EEA: adequate since Resolution CD/ANPD 32/2026 (26 January 2026). No SCCs or BCRs are needed for Brazil→EU/EEA transfers, outside the security and criminal-justice exclusions.** Check ANPD's list for any later decisions |
| **Contractual clauses** | ANPD standard contractual clauses (Resolution CD/ANPD 19/2024 — must be adopted without modification) or ANPD-approved specific clauses | Primary mechanism for non-adequate countries (e.g., US, China) |
| **Global corporate standards** | Binding corporate rules (BCRs) | Intragroup transfers to non-adequate countries |
| **Specific consent** | Data subject explicitly consented, informed of international transfer | Consent must be specific to the transfer |
| **Legal cooperation** | Between public entities for treaty obligations | Government data sharing |
| **Vital interests** | Protection of data subject's life | Emergency situations only |
| **ANPD authorisation** | Case-by-case ANPD approval | For transfers not covered by other mechanisms |

**Impact of Brazil-EU adequacy for compliance teams:**
- Ask a lawyer whether to replace the SCCs/BCRs in Brazil→EU or EU→Brazil transfer agreements with an adequacy reference, and update privacy notices and RoPA for EU recipients
- Keep a transfer mechanism other than adequacy for any flow that falls under the security or criminal-justice exclusions
- Retain other safeguards for transfers to the US, UK, China, or other non-adequate countries
- Monitor ANPD adequacy list (expected to grow) at anpd.gov.br

---

## Security & Incident Response (Art. 46–48)

### Security Measures (Art. 46)
Controllers and processors must adopt technical and administrative measures to protect data from:
- Unauthorised access
- Accidental/unlawful destruction, loss, alteration, or disclosure

ANPD may issue minimum security standards. Controllers bear responsibility for processor security.

### Breach Notification (Art. 48)
Controllers must notify ANPD and data subjects when a security incident may cause **relevant risk or harm**:
- **Timeframe:** ANPD Resolution CD/ANPD No. 15/2024 sets **3 working days** for preliminary notification
- **Content:** Nature of affected data, data subjects concerned, technical/security measures, risks, measures taken/planned
- **Full report:** Within **20 working days** of confirmation

---

## ANPD Enforcement & Penalties (Art. 52–54)

| Sanction | Details |
|----------|---------|
| Warning | With period to remedy |
| Simple fine | Up to **2% of revenue** in Brazil (previous FY, group); max **R$50 million per violation** |
| Daily fine | To compel compliance; same cap |
| Publicisation | Public disclosure of infraction after investigation |
| Blocking | Temporary blocking of personal data related to violation |
| Deletion | Deletion of personal data related to violation |
| Suspension | Partial suspension of processing for up to 6 months (extendable) |
| Prohibition | Complete ban on personal data processing activities |

---

## Regulatory & Enforcement Status — October 2026 (state where relevant)

These dated items are the skill author's summary as of the last-verified date above. They carry no source links here, and we have not checked them. Each item below names the official place to confirm it. Tell the user to confirm each one there before relying on it, and drop any item they cannot confirm.

- **ANPD is now a full regulatory agency**: Lei **15.352/2026** (DOU February 25, 2026, converting MP 1.317/2025) made the ANPD an autarquia de regime especial with functional, decision-making and financial autonomy (name unchanged), and fixed the Digital ECA's effectiveness at March 17, 2026. *(Confirm in the Diário Oficial da União, in.gov.br.)*
- **Sanctioning-regime rewrite in consultation**: **Consulta Pública 1/2026** (September 9 – **October 26, 2026**) proposes replacing Resolution CD/ANPD 1/2021 — extending supervision to Digital ECA duties and internet application providers, adding **interim measures without prior hearing** and **daily fines (capped R$50M total)**. Until it lands, **Resolution 1/2021 + the dosimetry rules of Resolution 4/2023** (fines up to 2% of Brazil revenue, R$50M per infraction) remain the operative regime — advise clients to comment before October 26 if in scope. *(Confirm on anpd.gov.br, under public consultations.)*
- **Enforcement benchmark**: ANPD fined **ByteDance/TikTok R$153.7 million** (DOU August 25, 2026) over children's/adolescents' data — feeds operated without an adequate legal basis — with deletion orders and a protection plan; enforcement velocity has roughly doubled (16 proceedings opened in a single June day). *(Confirm in the Diário Oficial da União and on anpd.gov.br. Do not quote the fine figure to anyone until it is confirmed.)*
- **Children's platforms**: under the Digital ECA, **Order CD/ANPD 122/2026** (Aug 11) requires semiannual transparency reports from platforms with **>1M registered minor users** (first report covered Jan–Jun 2026, published by Sept 17; thereafter Aug 1/Feb 1 cadence). *(Confirm on anpd.gov.br.)*
- **Transfers**: Resolution 19/2024 governs; the SCC grace period ended **August 23, 2025** — where a transfer relies on contractual clauses, the ANPD standard clauses must be in the contract. ANPD recognised the EU/EEA as adequate in Resolution CD/ANPD 32/2026 (confirmed, see International Data Transfers above), so Brazil→EU/EEA transfers do not need the clauses. *(Check the ANPD regulations page on gov.br/anpd for any later adequacy decisions.)*

## Workflows

### 1. Legal Basis Determination
1. Identify type of data (regular vs. sensitive vs. children's)
2. For sensitive data → apply Art. 11 bases exclusively
3. For crianças (<12) → specific parental/guardian consent required (Art. 14, §1º); for adolescents (12–17) → processing must observe their best interest (Art. 14 caput; ANPD Enunciado 1/2023)
4. Map each processing activity to one Art. 7 basis
5. Document basis in RoPA and privacy notice
6. If using legitimate interest → conduct balancing test; document

### 2. LGPD Gap Assessment
1. Map all personal data flows (collection → processing → storage → sharing → deletion)
2. Assess each processing activity against Art. 6 principles and Art. 7/11 bases
3. Evaluate data subject rights fulfilment capability (Art. 17–22)
4. Review DPO appointment and DPO publication (Art. 41)
5. Check RoPA existence and completeness (Art. 37)
6. Review privacy notices for Art. 9 elements
7. Assess security measures (Art. 46)
8. Review international transfer mechanisms (Art. 33–36) — **EU/EEA transfers can rely on adequacy (Resolution CD/ANPD 32/2026); other countries need standard clauses or another Art. 33 mechanism**
9. Evaluate breach response readiness (Art. 48)
10. Produce gap table with priority ratings

### 3. Privacy Notice Drafting (Art. 9)
Required elements:
- Identity/contact of controller
- DPO contact
- Purpose of processing
- Legal basis
- Data subjects' rights and how to exercise them
- Whether data will be shared and with whom
- International transfers (and mechanism — adequacy for EU, SCCs for US/others)
- Retention period
- Any profiling/automated decisions

### 4. Data Subject Request Handling
1. Verify identity of requestor
2. Identify request type (Art. 18)
3. Check if exemption applies (Art. 18, §3º, §4º)
4. Locate all data within systems
5. Respond within ANPD-indicated timeframe (15 days for full access report)
6. Log request and response for accountability

### 5. Breach Response
1. **Detect & Contain** — isolate systems, preserve evidence
2. **Assess** — determine data types affected, number of subjects, risk level
3. **3-working-day preliminary ANPD notification** (if relevant risk)
4. **Notify data subjects** where high risk of harm
5. **20-working-day full report** to ANPD
6. **Remediate** — implement corrective measures
7. **Document** — complete incident record for accountability

### 6. LGPD vs. GDPR Comparison (key differences)
| Topic | LGPD | GDPR |
|-------|------|------|
| Legal bases | 10 bases (Art. 7); includes credit protection | 6 bases (Art. 6 GDPR) |
| DPO | "Encarregado" required for controllers; ANPD Res. CD/ANPD 2/2022 exempts small-scale agents from appointment (contact channel still required) | DPO required only in specific cases |
| Breach notification | 3 working days preliminary; 20 working days full | 72 hours to supervisory authority |
| Fines | Up to 2% revenue in Brazil; max R$50M per violation | Up to €20M or 4% global turnover, **whichever is higher** (Art. 83(5)) |
| Adequacy | **EU/EEA adequate since January 2026 (Resolution CD/ANPD 32/2026)** | EC decides; Brazil adequate since January 2026 (Implementing Decision (EU) 2026/179) |
| Children | Parental consent for crianças (<12, Art. 14 §1º); adolescents (12–17) processed in their best interest | Parental consent <16 for information society services (member state may lower to 13) |

---

## Reference Files

For detailed guidance, read these references as needed:

- **`references/lgpd-articles.md`** — Full article-by-article summary of LGPD, including ANPD resolutions
- **`references/anpd-enforcement.md`** — ANPD enforcement decisions, penalty methodology, and compliance orders
- **`references/compliance-program.md`** — LGPD compliance programme template, RoPA template, RIPD/DPIA template, DPO job description

---

> *This skill provides general compliance information, not legal advice. Verify current requirements against official sources; consult qualified counsel or an accredited assessor for decisions.*

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Privacy policy drafter](https://useaiblocks.com/skills/privacy-policy-drafter).
- The [Privacy impact assessment writer](https://useaiblocks.com/skills/privacy-impact-assessment-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
