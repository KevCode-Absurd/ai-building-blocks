---
name: "eu-ai-act-specialist"
description: "EU AI Act (Regulation (EU) 2024/1689) operational compliance for compliance teams. Three Article-level decisions: (1) What's the risk class of this AI system — prohibited (Art. 5), high-risk (Art. 6 + Annex III or Annex I), or not high-risk — and which Article 50 transparency and Article 4 AI literacy duties apply on top of it? (2) For high-risk systems, what's the Article 43 conformity assessment route (Module A internal control vs Module H full QMS + notified body) and what goes in the Annex IV technical documentation? (3) Per organizational role (provider / deployer / importer / distributor / authorized representative), what are the active obligations and from which date, with each Article 50 paragraph given to the role it binds? Use during AI system intake review, when planning conformity assessment, or when scoping deployer obligations. Cites Articles + Annexes for every output. NOT executive AI strategy (see chief-ai-officer-advisor). NOT a legal substitute."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: ra-qm-team
  domain: eu-ai-act-compliance
  updated: 2026-05-13
  python-tools: ai_system_risk_classifier.py, conformity_assessment_planner.py, ai_act_obligation_tracker.py
  frameworks: eu-ai-act, gdpr-overlap, iso-42001-mapping, nist-ai-rmf-mapping
---

# EU AI Act Compliance Specialist

Article-cited operational skill for Regulation (EU) 2024/1689. **Three decisions, no executive AI strategy:**

1. **What risk class is this AI system, and which duties apply on top?** — risk class: prohibited (Article 5) / high-risk (Article 6 + Annex III) / not high-risk; plus, separately, Article 50 transparency duties and Article 4 AI literacy, which can apply at any class
2. **For high-risk systems, what's the conformity assessment route + documentation pack?** — Article 43 Module A vs Module H + Annex IV technical documentation
3. **Per organizational role, what are the obligations, and from when?** — provider / deployer / importer / distributor / authorized representative matrix per Articles 16, 22–27. The risk class decides the high-risk duties; the Article 50 and Article 4 duties are added on top, each to the role the Act names: Article 50(1) and 50(2) bind the provider, Article 50(3) and 50(4) bind the deployer. Dates follow the Act as amended by the Digital Omnibus on AI (Regulation (EU) 2026/1744)

This skill is **NOT chief-ai-officer-advisor**. CAIO decides whether to ship the AI feature at all and accepts business risk. This skill operates the conformity work that turns "we'll ship it" into Article-compliant artefacts.

This skill is **NOT a legal substitute**. The Act is binding regulation. For novel cases (Is this a GPAI model? Does Article 6(2) carve-out apply? Is fine-tuning a foundation model "substantial modification"?), engage qualified outside counsel. The skill cites Articles + Annexes and uses Commission/EDPB published interpretation but does not provide binding legal opinion.

This skill is **NOT GDPR**. Many AI systems also trigger GDPR (training data, output processing). See `ra-qm-team/skills/gdpr-dsgvo-expert/` for DPIA + lawful basis work. The Acts interact (Recital 10, Article 10 for high-risk training data).

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

## Keywords

EU AI Act, EU AI Regulation, Regulation 2024/1689, AI Act, AI regulation Europe, high-risk AI, prohibited AI, Article 5 AI Act, Article 6 AI Act, Article 9 AI Act, Article 50 AI Act, Annex III, Annex IV, conformity assessment, CE marking AI, notified body AI, Module A, Module H, technical documentation AI, post-market monitoring AI, fundamental rights impact assessment, FRIA, GPAI, general-purpose AI model, systemic risk GPAI, AI Office, ENISA AI, EDPB AI, AI Act timeline, AI Act penalties, EU AI Act provider, EU AI Act deployer, EU AI Act importer, EU AI Act distributor, EU AI Act fines, AI literacy

## Quick Start

```bash
# Decision A: Classify an AI system per the Act
python scripts/ai_system_risk_classifier.py                       # embedded 5-system sample
python scripts/ai_system_risk_classifier.py path/to/systems.json

# Decision B: Conformity assessment plan for a high-risk system
python scripts/conformity_assessment_planner.py                   # embedded high-risk sample
python scripts/conformity_assessment_planner.py path/to/system.json

# Decision C: Obligation tracker per organizational role
python scripts/ai_act_obligation_tracker.py                       # embedded sample (provider + deployer)
python scripts/ai_act_obligation_tracker.py path/to/roles.json
# Or chain A into C: take risk class and Article 50 duties straight from the classifier
python scripts/ai_system_risk_classifier.py systems.json --output json > classified.json
python scripts/ai_act_obligation_tracker.py --classified classified.json --role deployer
```

The JSON input format for each script is written in the docstring at the top of that script. Open it to see the fields. Without Python, answer the same questions in the chat and the paste-only route still works.

## Key Questions (ask these first)

- **Does this AI system fall under Article 5 (prohibited practices)?** Social scoring, emotion recognition in workplace/education, manipulative subliminal techniques, real-time remote biometric identification in public spaces for law enforcement (narrow exceptions) — any of these are flat-out prohibited. From 2 Dec 2026, so are AI systems that generate non-consensual intimate imagery or child sexual abuse material (Article 5(1)(ba) and (bb)).
- **Does it fall under Annex III (high-risk categories)?** 8 categories: biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice. Triggering Annex III triggers Article 6(2) — unless the Article 6(3) carve-outs apply.
- **What organizational role does the company play?** Provider (placed on market), deployer (uses under own authority), importer (places third-country system on EU market), distributor (makes available in supply chain). Many companies are BOTH provider AND deployer simultaneously.
- **Is this a general-purpose AI model?** GPAI has its own track (Articles 51–55) with stricter rules above 10²⁵ FLOPs training compute (Article 51 systemic risk).
- **For high-risk: have we run Article 9 risk management AND Article 27 FRIA?** Article 9 is the lifecycle risk management; Article 27 is the Fundamental Rights Impact Assessment for public-sector deployers + essential services.
- **What's the conformity assessment Module per Article 43?** Module A (internal control, possible for most Annex III systems) vs Module H (full QMS + notified body). For biometric systems under Annex III point 1, Article 43(1) lets the provider choose Module A or Module H when harmonised standards or common specifications have been applied. Module H is required when they have not. Check the Article text for your case.

## Core Responsibilities

### 1. AI System Risk Classification

**The framework:** The Act takes a risk-based approach (Recital 26). Classify on **two separate axes**, not one tier:

- **Risk class** (one per system): prohibited, high-risk, or not high-risk.
- **Duties on top** (any number): Article 50 transparency duties apply wherever their trigger applies, including to high-risk systems. Article 50(6) says paragraphs 1 to 4 "shall not affect the requirements and obligations set out in Chapter III" (the high-risk rules). Article 4 AI literacy applies to all providers and deployers. GPAI models have their own track (Articles 51 to 55). Source: the Commission's AI Act Service Desk, https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50 and https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-4.

So a high-risk chatbot is high-risk AND has the Article 50(1) duty. Never let the risk class hide a duty. The table below is the usual shorthand; read "limited-risk" as "not high-risk, with Article 50 duties":

| Tier | Source | Examples | Obligations |
|---|---|---|---|
| **Prohibited** | Article 5 | Social scoring; emotion recognition in workplace/education; subliminal manipulation; real-time public biometrics by law enforcement (with narrow exceptions) | Cannot be placed on market or used (penalties up to EUR 35M / 7% turnover) |
| **High-risk** | Article 6 + Annex III; Article 6(1) + Annex I | CV-screening, credit scoring, biometric categorisation, safety components of regulated products | Articles 8–17 (provider) + Article 26 (deployer); conformity assessment; CE marking |
| **Limited-risk (transparency)** | Article 50 | Chatbots, deepfakes, emotion recognition outside Article 5 contexts | Transparency disclosures to natural persons |
| **Minimal-risk** | Default | Spam filters, video-game AI, inventory forecasters | No risk-class duties; Article 4 AI literacy still applies; voluntary codes of conduct (Article 95) |

**Critical carve-outs (Article 6(3)):** an Annex III system is NOT high-risk if it (a) performs a narrow procedural task, (b) improves the result of previously completed human activity, (c) detects decision-making patterns without replacing human assessment, (d) performs a preparatory task. Caveat: profiling of natural persons is always Annex III high-risk regardless of carve-outs.

**Run** `ai_system_risk_classifier.py` with system characteristics. The tool checks Article 5 prohibitions first, then Annex I and Annex III categories, then Article 6(3) carve-outs, to set the risk class. Then, for every system that is not prohibited, it lists Article 50 transparency duties and Article 4 AI literacy separately, on top of the class. Check the Article text for your case: the Act is being phased in and may be amended.

See `references/eu_ai_act_titles.md` for the full Article-by-Article walkthrough.

### 2. Conformity Assessment + Annex IV Technical Documentation

**The framework (Article 43 + Annex VI/VII):** for high-risk AI systems, the provider must demonstrate conformity before placing on market. Two routes:

- **Module A — Internal control** (Annex VI): provider self-assesses against the requirements. Applies to most Annex III systems where the provider has implemented harmonised standards.
- **Module H — Full quality management system + technical documentation** (Annex VII): notified body involvement. Not always required: for biometric systems under Annex III point 1, Article 43(1) allows Module A or Module H if harmonised standards or common specifications were applied, and requires Module H if not.

**Required artifacts per Annex IV — Technical Documentation:**

1. General description of the AI system (intended purpose, identification, version)
2. Detailed description of system elements (architecture, training data, validation procedures)
3. Information about monitoring, functioning and control
4. Description of risk management system (Article 9)
5. Description of changes after placing on market
6. List of harmonised standards applied (or alternative)
7. EU declaration of conformity (Article 47)
8. Description of the post-market monitoring system (Article 72)

**Run** `conformity_assessment_planner.py` to select the Module and produce the Annex IV checklist for a given high-risk system.

See `references/high_risk_systems_annex_iii.md` for which systems require which conformity route.

### 3. Per-Role Obligation Tracker

**The framework (Articles 16, 22, 23, 24, 25, 26):** the Act distinguishes provider obligations (most) from downstream-actor obligations (deployer, importer, distributor, authorized representative). A single company can play multiple roles simultaneously.

| Role | Primary Articles | Key obligations |
|---|---|---|
| **Provider** (Article 3(3)) | 8–17, 43, 47–49, 50(1)–(2), 72, 73 | High-risk: conformity assessment; CE marking; risk management; data governance; technical documentation; registration; post-market monitoring; serious incident reporting (Article 73). Any class: tell people they are talking to an AI (Article 50(1)); machine-readable marking of AI-made content (Article 50(2)) |
| **Deployer** (Article 3(4)) | 26, 27, 50(3)–(4), 86 | High-risk: use according to instructions; human oversight; input data quality; keep logs at least six months (Article 26(6)); inform workers (Article 26(7)); tell people a high-risk system is used to decide about them (Article 26(11)); FRIA for public bodies, private public-service providers and credit or insurance systems (Article 27); explanation on request (Article 86). Any class: emotion recognition / biometric categorisation notice (Article 50(3)); deepfake and public-interest text disclosure (Article 50(4)) |
| **Importer** (Article 3(6)) | 23 | High-risk: verify conformity assessment, CE marking and technical documentation |
| **Distributor** (Article 3(7)) | 24 | High-risk: verify CE marking + documentation before making available |
| **Authorized representative** (Article 22) | 22 | Non-EU providers of high-risk systems must appoint one (Article 54 for GPAI model providers); it keeps the documents for 10 years and cooperates with authorities |

Article 4 AI literacy applies to every provider and deployer, at any risk class.

**When each duty starts** (Article 113 and Article 111, as amended by the Digital Omnibus on AI; check https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113 and the Service Desk timeline before relying on a date):

| Date | What starts |
|---|---|
| 2 Feb 2025 | Article 4 AI literacy; Article 5 prohibitions |
| 2 Aug 2025 | GPAI model duties (Articles 53–55); models already on the market by then have until 2 Aug 2027 (Article 111(3)) |
| 2 Aug 2026 | Article 50 transparency duties, for all risk classes; Article 86 |
| 2 Dec 2026 | New Article 5(1)(ba) and (bb) prohibitions; Article 50(2) marking for systems already on the market before 2 Aug 2026 (Article 111(4)) |
| 2 Dec 2027 | High-risk duties for Annex III systems (Article 113(c)(i)) |
| 2 Aug 2028 | High-risk duties for Annex I systems (Article 113(c)(ii)) |

**Important:** under Article 25, a deployer who substantially modifies a high-risk AI system, or places it on the market under their own name, becomes a **provider** and inherits provider obligations.

**Run** `ai_act_obligation_tracker.py` with the roles JSON, or with `--classified` and the classifier's JSON output, to produce a deadline-sorted obligation matrix. It gives each Article 50 paragraph only to the role it binds, and lists the other paragraphs as notes so a deployer can check that the provider met them.

See `references/gpai_obligations.md` for the separate GPAI Articles 51–55 track.

## Workflows

### Workflow 1: AI System Intake Review (per system, ~2 hours)
**Goal:** classify, identify obligations, scope the conformity work.

```bash
# 1. Document system characteristics: purpose, users, data, autonomy, deployment context
# 2. Run classifier
python scripts/ai_system_risk_classifier.py systems.json
# 3. If high-risk: run planner
python scripts/conformity_assessment_planner.py system.json
# 4. Identify org roles played (provider / deployer / both)
python scripts/ai_act_obligation_tracker.py roles.json
# 5. Cross-check with GDPR DPIA (gdpr-dsgvo-expert) if personal data
# 6. Cross-check with ISO 42001 AIMS evidence (compliance-team-iso42001)
# 7. Output: classification memo + conformity plan + obligation list
```

### Workflow 2: Annex IV Technical Documentation Build (per high-risk system, 2–4 weeks)
**Goal:** assemble the Annex IV pack before conformity assessment.

```bash
# 1. Run conformity assessment planner to get the checklist
python scripts/conformity_assessment_planner.py system.json
# 2. Assemble: system description, architecture, training data, validation, risk management
# 3. Reference ISO 42001 evidence where it satisfies Annex IV items
# 4. Reference ISO 27001 evidence for security controls
# 5. Run Article 9 risk management lifecycle
# 6. Sign EU declaration of conformity (Article 47) AFTER assessment passes
# 7. Affix CE marking (Article 48)
# 8. Register in EU database (Article 71) — high-risk Annex III systems
```

### Workflow 3: Pre-Deployment Obligation Audit (per system, before launch)
**Goal:** confirm all active obligations are in place before EU placement.

```bash
# 1. Confirm classification still correct (re-run classifier if system changed)
# 2. Confirm conformity assessment completed (if high-risk)
# 3. Confirm transparency requirements (Article 50), high-risk systems included: provider for 50(1) chatbots and 50(2) marking; deployer for 50(3) emotion recognition and 50(4) deepfakes
# 4. Confirm post-market monitoring system (Article 72) is live
# 5. Confirm serious-incident reporting procedure (Article 73) is documented
# 6. For deployers: FRIA done (Article 27, if applicable); workers informed (Article 26(7))
# 7. For GPAI: Articles 51-55 obligations met if applicable
```

### Workflow 4: Annual Compliance Refresh (per organization, yearly)
**Goal:** re-verify classifications + obligations as the Act phases in.

1. List all AI systems on or planned for EU market
2. Run classifier for each — Article 5 prohibited list may expand via delegated acts
3. Run obligation tracker — duties phase in from 2025 to 2028 (high-risk: Annex III from 2 Dec 2027, Annex I from 2 Aug 2028, after the Digital Omnibus on AI); re-check the Service Desk, as dates can move again
4. For each high-risk system: verify post-market monitoring data flow + serious incident reporting capacity
5. Update Annex IV technical documentation per Article 11 ongoing requirement
6. Pair with ISO 42001 management review (Clause 9.3) if both operate

## Output Standards

```
**Bottom Line:** [one sentence — risk class + most-significant obligation]
**Duties on top:** [every Article 50 duty that applies, and Article 4; "none found" only after checking each]
**Article Citation:** [Article + paragraph number; do not paraphrase without cite]
**The Decision:** [one of: classify | conformity-route | obligation-scope]
**The Evidence:** [Article + Annex references; classification confidence]
**How to Act:** [3 concrete next steps with owner + deadline aligned to phasing]
**Your Decision:** [the call for compliance officer or legal counsel — risk-class disputes, novel cases, GPAI threshold determinations]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Contract summary writer](https://useaiblocks.com/skills/contract-plain-summary). It takes the audit report.
- The [Privacy policy drift checker](https://useaiblocks.com/skills/privacy-policy-drift-checker). It takes the audit report.
- The [Contract plain-language summary writer](https://useaiblocks.com/prompts/plain-words-contract-summary). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Adjacent Skills

- `ra-qm-team/skills/gdpr-dsgvo-expert/` — GDPR DPIA + lawful basis (most AI systems also trigger GDPR)
- `ra-qm-team/compliance-team-iso42001/` — ISO 42001 AIMS (voluntary management system that satisfies parts of Article 17 QMS for providers)
- `ra-qm-team/skills/information-security-manager-iso27001/` — ISO 27001 for cybersecurity requirements (Article 15)
- `ra-qm-team/skills/risk-management-specialist/` — ISO 14971 risk management (referenced for safety-component AI under Article 6(1))
- `ra-qm-team/skills/mdr-745-specialist/` — MDR 2017/745 (medical-device AI overlap)
- `compliance-os/` — Meta-orchestrator for multi-framework programs
- `c-level-advisor/chief-ai-officer-advisor/` — Executive AI strategy

## References

- [eu_ai_act_titles.md](references/eu_ai_act_titles.md) — Titles I–XII Article-by-Article walkthrough with deployer/provider/importer/distributor obligation breakdown
- [high_risk_systems_annex_iii.md](references/high_risk_systems_annex_iii.md) — Annex III 8 categories detailed + Article 6(2)–(3) interaction + carve-out test
- [gpai_obligations.md](references/gpai_obligations.md) — Articles 51–55 GPAI track + systemic-risk threshold + transparency rules + Code of Practice status
- [cross_framework_mapping_ai_act.md](references/cross_framework_mapping_ai_act.md) — AI Act ↔ ISO 42001 ↔ NIST AI RMF ↔ GDPR control-level mapping

---

**Version:** 1.0.0
**Status:** Production Ready
