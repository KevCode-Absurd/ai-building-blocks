# EU AI Act (Regulation (EU) 2024/1689) — Chapters I–XIII Walkthrough

**Structure check by AI Blocks, 28 Oct 2026:** chapter and section labels follow the [Commission's current consolidated-text explorer](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-99). See also [Annex II](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-2), [Annex IV](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-4), [Annex XIV](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-14) and [Article 113 dates](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113). This is a guide to selected Articles, not a replacement for the law. Other legal statements still need a case-specific check.

This reference answers exactly one decision: **what does each Chapter of the Act actually require, and which Articles do I cite in compliance artifacts?**

Pair with `scripts/ai_system_risk_classifier.py` to map a system to obligations.

## Structure of the Regulation

The Act has 13 Chapters + 14 Annexes. Adopted as Regulation (EU) 2024/1689 (the "AI Act"); published in OJEU L on 12 July 2024; entered into force 1 August 2024 (Article 113).

## Chapter I — General Provisions (Articles 1–4a)

| Article | Topic | Key requirement |
|---|---|---|
| **1** | Subject matter | Establishes harmonised rules for AI systems placed on EU market, used or put into service |
| **2** | Scope | Applies to providers, deployers, importers, distributors, authorized representatives. Extraterritorial: applies to non-EU providers placing systems on EU market. Excludes military / national security / pure scientific research |
| **3** | Definitions | "AI system" (Article 3(1)): a machine-based system designed to operate with varying levels of autonomy that may exhibit adaptiveness after deployment; infers from input how to generate outputs (predictions, content, recommendations, decisions). Per Commission Feb 2025 Guidelines, excludes simple rule-based systems with no adaptiveness |
| **4** | AI literacy | **Applies from 2 Feb 2025.** Providers and deployers must take measures to support the AI literacy of staff and others operating or using AI systems for them, suited to their knowledge and the context of use. As amended by the Digital Omnibus on AI, no specific level is required of any individual |

Article 4a addresses processing special-category personal data for bias detection and correction; see the current official text before applying it.

## Chapter II — Prohibited AI Practices (Article 5)

**In force from 2 Feb 2025.** Penalty: up to EUR 35M or 7% worldwide annual turnover (Article 99).

Prohibited categories per Article 5(1):

- **(a)** Subliminal techniques beyond awareness causing harm
- **(b)** Exploitation of vulnerabilities (age, disability, socioeconomic situation)
- **(ba)** Generating or manipulating realistic intimate or sexually explicit imagery of an identifiable person without consent — **added by the Digital Omnibus on AI; applies from 2 Dec 2026**
- **(bb)** Generating or manipulating child sexual abuse material — **added by the Digital Omnibus on AI; applies from 2 Dec 2026**
- **(c)** Social scoring (by any operator, not only public authorities) causing detrimental or unfavourable treatment
- **(d)** Predictive policing based solely on profiling natural persons (with narrow law-enforcement exceptions per Article 5(2))
- **(e)** Untargeted scraping of facial images for facial recognition databases
- **(f)** Emotion recognition in workplace and educational institutions
- **(g)** Biometric categorisation by sensitive attributes (race, religion, political opinions, sexual orientation, etc.)
- **(h)** Real-time remote biometric identification in publicly accessible spaces for law-enforcement purposes (with narrow Article 5(2)(d)–(h) exceptions)

## Chapter III — High-Risk AI Systems (Articles 6–49)

The densest part of the regulation. **After the Digital Omnibus on AI (Regulation (EU) 2026/1744), the high-risk rules apply from 2 Dec 2027 for Annex III systems and from 2 Aug 2028 for Annex I systems (Article 113(c)).** Source: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113

### Section 1 — Classification (Articles 6–7)

- **Article 6(1)** + Annex I: AI systems that are safety components of products covered by sectoral law (machinery, toys, medical devices, etc.) are high-risk
- **Article 6(2)** + Annex III: AI systems in 8 categories (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice) are high-risk
- **Article 6(3)**: carve-out — a system in Annex III is NOT high-risk if it performs a narrow procedural task, improves a previously completed human activity, detects decision-making patterns without replacing human assessment, or performs a preparatory task. **Profiling overrides the carve-out** (Article 6(3) last sentence)

See `high_risk_systems_annex_iii.md` for the detailed Annex III walkthrough.

### Section 2 — Requirements for High-Risk Systems (Articles 8–15)

| Article | Requirement |
|---|---|
| **8** | Compliance with all Section 2 requirements |
| **9** | Risk management system across full lifecycle |
| **10** | Data governance: training/validation/test datasets quality + bias examination |
| **11** | Technical documentation per Annex IV |
| **12** | Automatic event logging |
| **13** | Transparency + instructions for use to deployers |
| **14** | Human oversight design |
| **15** | Accuracy, robustness, cybersecurity |

### Section 3 — Obligations of Actors (Articles 16–27)

| Article | Topic | Applies to |
|---|---|---|
| **16** | General provider obligations | Providers |
| **17** | Quality management system | Providers |
| **18–21** | Keeping documentation and logs, corrective action, cooperation with authorities | Providers |
| **22** | Authorized representative | Non-EU providers of high-risk systems must appoint one |
| **23** | Importer obligations | Verify provider conformity assessment before import |
| **24** | Distributor obligations | Verify CE marking before making available |
| **25** | Responsibilities along the value chain | Substantial modification turns deployer into provider |
| **26** | Deployer obligations | Use per instructions; human oversight; input data; logs kept at least six months (26(6)); inform workers (26(7)); tell people a high-risk Annex III system is used to decide about them (26(11)) |
| **27** | Fundamental Rights Impact Assessment (FRIA) | Deployers that are public-law bodies or private entities providing public services, and deployers of Annex III point 5(b) and 5(c) systems (credit scoring, life and health insurance); not Annex III point 2 |

### Section 4 — Notified Bodies (Articles 28–39)

Procedures for designating + monitoring notified bodies (involved in Module H conformity assessment per Annex VII).

### Section 5 — Standards, Conformity Assessment, Certificates, Registration (Articles 40–49)

| Article | Topic |
|---|---|
| **40** | Harmonised standards — presumption of conformity |
| **41** | Common specifications (where standards lacking) |
| **43** | Conformity assessment procedure (Module A internal control vs Module H notified body) |
| **47** | EU declaration of conformity (provider signs; 10-year retention) |
| **48** | CE marking |
| **49** | Registration in EU database (Article 71) for Annex III systems |

## Chapter IV — Transparency Obligations (Article 50)

**Applies from 2 Aug 2026** (Article 113, general date). Article 50(2) marking for systems already on the market before 2 Aug 2026: from 2 Dec 2026 (Article 111(4)). These duties apply at any risk class, high-risk included (Article 50(6)). Sources: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50 and https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-111

| Article 50 paragraph | Who | Requirement |
|---|---|---|
| **50(1)** | Provider | Design systems that interact with people so they are told it is an AI, unless obvious |
| **50(2)** | Provider | Mark synthetic audio, image, video or text output (machine-readable) as AI-generated |
| **50(3)** | Deployer | Tell people exposed to emotion recognition / biometric categorisation (outside Article 5 prohibition) |
| **50(4)** | Deployer | Disclose deepfakes (image/audio/video), and AI text published to inform the public on matters of public interest unless it had human review and editorial responsibility; lighter disclosure for evidently artistic, satirical or fictional work |

## Chapter V — General-Purpose AI Models (Articles 51–56)

**In force from 2 Aug 2025.** See `gpai_obligations.md` for the detailed walkthrough.

| Article | Topic |
|---|---|
| **51** | Classification of GPAI with systemic risk (training compute ≥ 10²⁵ FLOPs) |
| **52** | Procedure for adding/removing systemic-risk designation |
| **53** | Obligations for ALL GPAI providers (technical docs, transparency to downstream, copyright policy, training data summary) |
| **54** | Authorized representative for non-EU GPAI providers |
| **55** | Additional obligations for systemic-risk GPAI (model evaluations, adversarial testing, incident reporting, cybersecurity) |

Article 56 covers codes of practice under Chapter V.

## Chapter VI — Measures in Support of Innovation (Articles 57–63)

| Article | Topic |
|---|---|
| **57** | AI regulatory sandboxes by Member States |
| **58** | Modalities for sandboxes |
| **59** | Further processing of personal data for AI development in sandboxes |
| **60** | Real-world testing of high-risk systems outside sandboxes |
| **62** | SME / start-up specific measures |

## Chapter VII — Governance (Articles 64–70)

| Article | Body |
|---|---|
| **64** | European Artificial Intelligence Office (the "AI Office") |
| **65** | European AI Board |
| **66** | Member State national competent authorities |
| **67** | Advisory Forum (industry + civil society) |
| **68** | Scientific Panel of independent experts |

## Chapter VIII — EU Database (Article 71)

EU-wide database of stand-alone high-risk Annex III AI systems. Provider registration before placing on market.

## Chapter IX — Post-Market Monitoring, Information Sharing, Market Surveillance (Articles 72–94)

| Article | Topic |
|---|---|
| **72** | Provider post-market monitoring system |
| **73** | Serious-incident reporting (provider) — at the latest 15 days after becoming aware; 2 days for a widespread infringement or an Article 3(49)(b) incident (critical infrastructure); 10 days in case of death |
| **74** | Market surveillance + AI Office cooperation |
| **75–84** | Market surveillance powers, enforcement, mutual assistance |
| **85–87** | Complaints, explanations and reporting infringements |
| **88–94** | Supervision and enforcement for general-purpose AI model providers |

## Chapter X — Codes of Conduct and Guidelines (Articles 95–96)

Voluntary codes of conduct extending Chapter III principles to non-high-risk systems. Commission may issue guidelines.

## Chapter XI — Delegation of Power and Committee Procedure (Articles 97–98)

Commission powers to update Annexes (notably Annex III categories) via delegated acts.

## Chapter XII — Penalties (Articles 99–101)

| Article | Topic |
|---|---|
| **99** | Penalties: up to EUR 35M / 7% turnover (Article 5); EUR 15M / 3% (most high-risk); EUR 7.5M / 1% (incorrect info) |
| **100** | Fines on Union institutions, bodies, offices and agencies |
| **101** | Fines for general-purpose AI model providers |

## Chapter XIII — Final Provisions (Articles 102–113)

| Article | Topic |
|---|---|
| **102–110** | Amendments to other Union laws |
| **111** | Transitional rules for existing systems and models |
| **112** | Evaluation and review |
| **113** | Entry into force and application dates |

## Annexes — At a Glance

| Annex | Topic |
|---|---|
| **I** | List of EU sectoral product legislation (machinery, toys, MDR, IVDR, etc.) — Article 6(1) trigger |
| **II** | Criminal offences referred to in Article 5(1)(h)(iii) |
| **III** | High-risk AI systems referred to in Article 6(2) — 8 categories |
| **IV** | Technical documentation referred to in Article 11 (9 points) |
| **V** | EU declaration of conformity (Article 47) |
| **VI** | Conformity assessment Module A — Internal Control |
| **VII** | Conformity assessment Module H — Full Quality Assurance |
| **VIII** | Information to be submitted upon registration in EU database (Article 71) |
| **IX** | Information for testing in real-world conditions (Article 60) |
| **X** | Union legislative acts on large-scale IT systems |
| **XI** | Technical documentation for GPAI providers (Article 53) |
| **XII** | Transparency information for downstream providers (Article 53(1)(b)) |
| **XIII** | Designation of GPAI with systemic risk (Article 51 criteria) |
| **XIV** | Codes and categories defining notified-body designation scope under Article 30 |

## When This Reference Doesn't Help

- **Specific Annex III high-risk system classification.** See `high_risk_systems_annex_iii.md`.
- **GPAI obligations detail.** See `gpai_obligations.md`.
- **Cross-walking to ISO 42001 / NIST AI RMF.** See `cross_framework_mapping_ai_act.md`.

---

**Source authorities (non-exhaustive):**

- **Regulation (EU) 2024/1689** — the AI Act (the binding regulation; published in OJEU L on 12 July 2024)
- **European Commission** — Guidelines on the definition of an AI system (Feb 2025)
- **European Commission** — Guidelines on prohibited AI practices (Feb 2025)
- **European Commission Q&A** — AI Act explanatory materials (continuously updated)
- **European Data Protection Board (EDPB)** — Opinion 28/2024 (Dec 2024) on personal-data processing in AI models
- **European Data Protection Supervisor (EDPS)** — AI Act commentary + GDPR-AI Act interaction
- **ENISA** — Multilayer Framework for Good Cybersecurity Practices for AI (Mar 2023)
- **IAPP** — EU AI Act Tracker (continuously updated practitioner reference)
- **CEN-CENELEC JTC 21** — harmonised standards work programme (Article 40 reference)
