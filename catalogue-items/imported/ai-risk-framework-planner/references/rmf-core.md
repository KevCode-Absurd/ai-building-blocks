# NIST AI RMF 1.0 — Full Category and Subcategory Reference

Source: NIST AI 100-1 (January 2023), Part 2 "Core", Tables 1–4. Official text: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/ (PDF: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf).

The Core has **4 functions, 19 categories and 72 subcategories**: GOVERN 6 / 19, MAP 5 / 18, MEASURE 4 / 22, MANAGE 4 / 13.

The subcategory descriptions below are short summaries of the official outcomes. Quote the official text when a stakeholder needs exact wording. The "Suggested actions" lines are practical examples written for this skill. They are not the text of the NIST AI RMF Playbook; for the Playbook's own suggested actions see https://airc.nist.gov/airmf-resources/playbook/.

---

## GOVERN Function (6 Categories, 19 Subcategories)

GOVERN is cross-cutting. It sets the culture, policies and accountability that the other three functions run inside.

### GOVERN 1: Policies, processes, procedures and practices for mapping, measuring and managing AI risk are in place, transparent and implemented effectively

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| GOVERN 1.1 | Legal and regulatory requirements involving AI are understood, managed and documented |
| GOVERN 1.2 | The characteristics of trustworthy AI are integrated into organizational policies, processes, procedures and practices |
| GOVERN 1.3 | Processes are in place to set the needed level of risk management activity based on the organization's risk tolerance |
| GOVERN 1.4 | The risk management process and its outcomes are established through transparent policies, procedures and other controls based on risk priorities |
| GOVERN 1.5 | Ongoing monitoring and periodic review of the risk management process are planned, with roles and review frequency defined |
| GOVERN 1.6 | Mechanisms are in place to inventory AI systems, resourced according to risk priorities |
| GOVERN 1.7 | Processes are in place to decommission and phase out AI systems safely, without increasing risk or reducing trustworthiness |

**Suggested actions:**
- Keep a register of AI laws and rules that apply to you (GOVERN 1.1)
- Publish an AI risk management policy signed by senior leadership that names the trustworthiness characteristics (GOVERN 1.2)
- Tie the depth of review to risk tier, so high-stakes systems get more scrutiny (GOVERN 1.3)
- Set a review cycle (at least yearly) and name who runs it (GOVERN 1.5)
- Keep an AI system inventory (GOVERN 1.6) and a decommissioning checklist (GOVERN 1.7)

---

### GOVERN 2: Accountability structures are in place so the right teams and people are empowered, responsible and trained for mapping, measuring and managing AI risk

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| GOVERN 2.1 | Roles, responsibilities and lines of communication for AI risk are documented and clear across the organization |
| GOVERN 2.2 | Personnel and partners receive AI risk management training so they can perform their duties consistent with policies and agreements |
| GOVERN 2.3 | Executive leadership takes responsibility for decisions about risks from AI system development and deployment |

**Suggested actions:**
- Define a RACI for AI development, deployment and monitoring decisions (GOVERN 2.1)
- Run role-based AI risk training for staff and key partners (GOVERN 2.2)
- Name an executive who signs off high-risk deployments and residual risk (GOVERN 2.3)

---

### GOVERN 3: Workforce diversity, equity, inclusion and accessibility processes are prioritized in mapping, measuring and managing AI risk throughout the lifecycle

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| GOVERN 3.1 | Decisions about AI risk across the lifecycle are informed by a diverse team (demographics, disciplines, experience, expertise, backgrounds) |
| GOVERN 3.2 | Policies define and differentiate roles and responsibilities for human-AI configurations and oversight of AI systems |

**Suggested actions:**
- Put legal, privacy, security, domain and affected-user perspectives on AI risk reviews (GOVERN 3.1)
- Document who oversees each AI system, when a human must review, and who can override it (GOVERN 3.2)

---

### GOVERN 4: Organizational teams are committed to a culture that considers and communicates AI risk

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| GOVERN 4.1 | Policies foster a critical-thinking, safety-first mindset in design, development, deployment and use, to minimize negative impacts |
| GOVERN 4.2 | Teams document the risks and potential impacts of the AI they design, develop, deploy, evaluate and use, and communicate about impacts more broadly |
| GOVERN 4.3 | Practices are in place to enable AI testing, identification of incidents, and information sharing |

**Suggested actions:**
- Make it safe and expected to raise AI risk concerns; give a clear escalation path (GOVERN 4.1)
- Require a model or system card for each system (GOVERN 4.2)
- Keep an incident log and a process for sharing lessons (GOVERN 4.3)

---

### GOVERN 5: Processes are in place for robust engagement with relevant AI actors

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| GOVERN 5.1 | Policies collect, consider, prioritize and integrate feedback from people outside the team that built or deployed the system about individual and societal impacts |
| GOVERN 5.2 | Mechanisms let the team regularly incorporate adjudicated feedback from relevant AI actors into system design and implementation |

**Suggested actions:**
- Run a feedback channel for users and affected people, and review it on a schedule (GOVERN 5.1)
- Track which feedback led to design changes (GOVERN 5.2)

---

### GOVERN 6: Policies and procedures address AI risks and benefits from third-party software, data and other supply chain issues

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| GOVERN 6.1 | Policies address AI risks from third-party entities, including risk of infringing a third party's intellectual property or other rights |
| GOVERN 6.2 | Contingency processes handle failures or incidents in third-party data or AI systems deemed high-risk |

**Suggested actions:**
- Add AI terms to vendor contracts: change notification, audit rights, IP and data-use terms (GOVERN 6.1)
- Keep a fallback plan for each high-risk vendor model or dataset (GOVERN 6.2)

---

## MAP Function (5 Categories, 18 Subcategories)

MAP sets the context so the right risks get measured and managed.

### MAP 1: Context is established and understood

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MAP 1.1 | Intended purposes, beneficial uses, context-specific laws, norms and expectations, and deployment settings are understood and documented |
| MAP 1.2 | Interdisciplinary AI actors with diverse demographics and broad domain and user expertise take part in establishing context, and their participation is documented |
| MAP 1.3 | The organization's mission and relevant goals for AI are understood and documented |
| MAP 1.4 | The business value or context of business use is clearly defined or, for existing systems, re-evaluated |
| MAP 1.5 | Organizational risk tolerances are determined and documented |
| MAP 1.6 | System requirements are elicited from and understood by relevant AI actors, and design decisions take socio-technical implications into account |

**Suggested actions:**
- Write a system description per AI system: purpose, users, inputs, outputs, decision authority, prohibited uses, applicable laws (MAP 1.1)
- Record the business value and the risk tolerance for this system (MAP 1.4, MAP 1.5)

---

### MAP 2: Categorization of the AI system is performed

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MAP 2.1 | The specific tasks and methods the system uses are defined (for example classifier, generative model, recommender) |
| MAP 2.2 | The system's knowledge limits, and how its output may be used and overseen by humans, are documented |
| MAP 2.3 | Scientific integrity and TEVV considerations are identified and documented, including experimental design, data collection and selection, trustworthiness and construct validation |

**Suggested actions:**
- Record the model type, training data sources, known limits and performance bounds in a model card (MAP 2.1, MAP 2.2)
- Plan how the system will be tested before it is built (MAP 2.3)

---

### MAP 3: AI capabilities, targeted usage, goals, and expected benefits and costs compared with appropriate benchmarks are understood

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MAP 3.1 | Potential benefits of intended functionality and performance are examined and documented |
| MAP 3.2 | Potential costs, including non-monetary costs, from expected or realized AI errors are examined and documented, connected to risk tolerance |
| MAP 3.3 | Targeted application scope is specified and documented based on capability, context and categorization |
| MAP 3.4 | Processes for operator and practitioner proficiency with system performance and trustworthiness, and relevant standards and certifications, are defined, assessed and documented |
| MAP 3.5 | Processes for human oversight are defined, assessed and documented in line with GOVERN policies |

**Suggested actions:**
- Build a stakeholder benefit/cost matrix: rows = stakeholder groups, columns = benefits and costs (MAP 3.1, MAP 3.2)
- State in writing what the system must not be used for (MAP 3.3)
- Train operators and define when a human reviews or overrides (MAP 3.4, MAP 3.5)

---

### MAP 4: Risks and benefits are mapped for all components of the AI system, including third-party software and data

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MAP 4.1 | Approaches for mapping the technology and legal risks of components, including third-party data or software and IP infringement risk, are in place and documented |
| MAP 4.2 | Internal risk controls for components, including third-party AI technologies, are identified and documented |

**Suggested actions:**
- List every model, dataset, library and API the system depends on, with its owner and licence (MAP 4.1)
- Record the control that covers each component (MAP 4.2)

---

### MAP 5: Impacts to individuals, groups, communities, organizations and society are characterized

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MAP 5.1 | Likelihood and magnitude of each identified impact (beneficial and harmful) are identified and documented, using expected use, past uses in similar contexts, public incident reports, external feedback or other data |
| MAP 5.2 | Practices and personnel for regular engagement with relevant AI actors, and for integrating feedback about positive, negative and unanticipated impacts, are in place and documented |

**Suggested actions:**
- Score each risk for likelihood and magnitude; treat harm to protected groups, legal exposure or irreversibility as high (MAP 5.1)
- Use red-team results and public incident reports as evidence (MAP 5.1)

---

## MEASURE Function (4 Categories, 22 Subcategories)

MEASURE uses quantitative, qualitative or mixed methods, including TEVV (test, evaluation, verification and validation), to analyze and track the risks found in MAP.

### MEASURE 1: Appropriate methods and metrics are identified and applied

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MEASURE 1.1 | Approaches and metrics for the risks found in MAP are selected, starting with the most significant; risks that will not or cannot be measured are documented |
| MEASURE 1.2 | Appropriateness of metrics and effectiveness of existing controls are regularly assessed and updated, including error reports and impacts on affected communities |
| MEASURE 1.3 | Internal experts who were not front-line developers, and/or independent assessors, take part in regular assessments and updates |

**Suggested actions:**
- Pick a metric per trustworthiness characteristic (see rmf-profiles.md) and note what you cannot measure (MEASURE 1.1)
- Use an independent reviewer for high-risk systems (MEASURE 1.3)

---

### MEASURE 2: AI systems are evaluated for trustworthy characteristics

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MEASURE 2.1 | Test sets, metrics and details about TEVV tools are documented |
| MEASURE 2.2 | Evaluations involving human subjects meet applicable requirements (including human subject protection) and are representative of the relevant population |
| MEASURE 2.3 | Performance or assurance criteria are measured and demonstrated for conditions similar to deployment, and documented |
| MEASURE 2.4 | Functionality and behavior of the system and its components are monitored in production |
| MEASURE 2.5 | The system is demonstrated to be valid and reliable; limits on generalizing beyond development conditions are documented |
| MEASURE 2.6 | The system is evaluated regularly for safety risks; it is shown to be safe, residual negative risk does not exceed risk tolerance, and it can fail safely |
| MEASURE 2.7 | Security and resilience are evaluated and documented |
| MEASURE 2.8 | Risks related to transparency and accountability are examined and documented |
| MEASURE 2.9 | The model is explained, validated and documented, and output is interpreted within its context |
| MEASURE 2.10 | Privacy risk is examined and documented |
| MEASURE 2.11 | Fairness and bias are evaluated and results documented |
| MEASURE 2.12 | Environmental impact and sustainability of training and management are assessed and documented |
| MEASURE 2.13 | Effectiveness of the TEVV metrics and processes used is evaluated and documented |

**Suggested actions:**
- Write a pre-deployment evaluation report covering all seven trustworthiness characteristics (MEASURE 2.3, 2.5–2.11)
- Test performance by subgroup and record disparities (MEASURE 2.11)
- Test robustness against adversarial input and, for LLMs, prompt injection (MEASURE 2.7)
- Record explanation methods used for high-stakes individual decisions (MEASURE 2.9)

---

### MEASURE 3: Mechanisms for tracking identified AI risks over time are in place

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MEASURE 3.1 | Approaches, personnel and documentation regularly identify and track existing, unanticipated and emergent risks based on intended and actual performance |
| MEASURE 3.2 | Risk tracking approaches are considered where risks are hard to assess with current techniques or metrics are not yet available |
| MEASURE 3.3 | Feedback processes for end users and impacted communities to report problems and appeal outcomes are established and integrated into evaluation metrics |

**Suggested actions:**
- Monitor accuracy, subgroup gaps and input drift, with alert thresholds that trigger human review (MEASURE 3.1)
- Offer a way for affected people to report problems and appeal decisions (MEASURE 3.3)

---

### MEASURE 4: Feedback about efficacy of measurement is gathered and assessed

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MEASURE 4.1 | Measurement approaches are connected to deployment context and informed by domain experts and end users; approaches are documented |
| MEASURE 4.2 | Measurement results in deployment are informed by domain experts and relevant AI actors to validate the system performs as intended; results are documented |
| MEASURE 4.3 | Measurable performance improvements or declines, based on consultation with relevant AI actors (including affected communities) and field data, are identified and documented |

**Suggested actions:**
- Review measurement results with domain experts before acting on them (MEASURE 4.2)
- Log performance changes from field data and update the risk register (MEASURE 4.3)

---

## MANAGE Function (4 Categories, 13 Subcategories)

MANAGE puts resources against the mapped and measured risks.

### MANAGE 1: AI risks based on MAP and MEASURE outputs are prioritized, responded to and managed

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MANAGE 1.1 | A decision is made on whether the system achieves its intended purposes and whether development or deployment should proceed |
| MANAGE 1.2 | Treatment of documented risks is prioritized by impact, likelihood and available resources or methods |
| MANAGE 1.3 | Responses to high-priority risks are developed, planned and documented; options include mitigating, transferring, avoiding or accepting |
| MANAGE 1.4 | Negative residual risks (all unmitigated risks) to downstream acquirers and end users are documented |

**Suggested actions:**
- Hold a go/no-go decision before deployment (MANAGE 1.1)
- Give every register entry an owner, target date and response type (MANAGE 1.2, MANAGE 1.3)
- Document residual risk and have an accountable executive accept it (MANAGE 1.4, GOVERN 2.3)

---

### MANAGE 2: Strategies to maximize AI benefits and minimize negative impacts are planned, prepared, implemented, documented and informed by input from relevant AI actors

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MANAGE 2.1 | Resources required to manage risks are considered, along with viable non-AI alternatives, to reduce the magnitude or likelihood of impacts |
| MANAGE 2.2 | Mechanisms are in place and applied to sustain the value of deployed systems |
| MANAGE 2.3 | Procedures are followed to respond to and recover from a previously unknown risk when it is identified |
| MANAGE 2.4 | Mechanisms and assigned responsibilities exist to supersede, disengage or deactivate systems whose performance or outcomes are inconsistent with intended use |

**Suggested actions:**
- Compare the AI option with a non-AI option before committing resources (MANAGE 2.1)
- Define a kill switch and who may use it (MANAGE 2.4)

---

### MANAGE 3: AI risks and benefits from third-party entities are managed

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MANAGE 3.1 | Risks and benefits from third-party resources are regularly monitored, and risk controls are applied and documented |
| MANAGE 3.2 | Pre-trained models used for development are monitored as part of regular monitoring and maintenance |

**Suggested actions:**
- Review vendor validation reports and benchmark vendor models against an internal comparison model (MANAGE 3.1)
- Re-test pre-trained or foundation models after each version change (MANAGE 3.2)

---

### MANAGE 4: Risk treatments, including response and recovery, and communication plans are documented and monitored regularly

| Subcategory | Summary of the official outcome |
|-------------|-------------|
| MANAGE 4.1 | Post-deployment monitoring plans are implemented, including user input, appeal and override, decommissioning, incident response, recovery and change management |
| MANAGE 4.2 | Measurable continual-improvement activities are integrated into system updates, with regular engagement of interested parties |
| MANAGE 4.3 | Incidents and errors are communicated to relevant AI actors, including affected communities; tracking, response and recovery processes are followed and documented |

**Suggested actions:**
- Keep an AI incident log with severity levels and notification thresholds (MANAGE 4.3)
- Run post-incident reviews that update the risk register and GOVERN policies (MANAGE 4.2, MANAGE 4.3)
- Schedule periodic programme reviews; consider an independent audit for high-risk systems (MANAGE 4.1, MEASURE 1.3)

