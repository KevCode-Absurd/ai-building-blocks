---
name: hr-ai-privacy
description: "Help HR and compliance teams protect employee data privacy in AI-driven HR systems, including GDPR compliance, data minimization, employee consent design, and privacy risk assessment for HR AI tools. Use when asked to protect employee data in AI systems, design HR AI privacy policies, assess privacy risks of AI tools, build employee consent for AI, comply with GDPR for HR AI, or audit HR data privacy."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# Employee data privacy in AI-driven HR

Protect employee data privacy in AI-powered HR systems — from assessing privacy risks of AI tools and designing data minimization practices to building employee consent frameworks, ensuring regulatory compliance, and governing responsible data use across the HR tech stack.

## How to run this skill

1. **Warn first.** Tell the user not to paste real staff names, ID numbers or health details. They should describe data types instead ("performance scores", "interview recordings"). They should also check their AI tool's data settings. If they have already pasted personal data, say so and carry on without repeating it.
2. **Ask once for what is missing.** You need: the AI tool and what it does, where the staff are, and the data it collects. Optional: the vendor's privacy documents. If the user does not know what the tool collects, list the fields to ask the vendor and mark them `UNKNOWN`. Do not guess what a vendor does.
3. **Map the data.** For each field, ask if the tool needs it for its stated purpose. Mark each yes, no or unsure. Give an action: keep, cut, or ask the vendor.
4. **Rate the risks** and say if a full privacy impact assessment (DPIA) is likely needed. Name only the laws the user gave or that match the places they named (such as GDPR, PDPA or PIPL). Say what each law is about in a line. Do not state that a tool is legal or illegal. Put those points under "For your lawyer to confirm".
5. **Write the pieces:** vendor questions (storage, sharing, transfers outside the region, deletion), a plain staff notice, retention and deletion rules, access controls, a breach outline, and steps for a staff request to see their data. Use `[BRACKETS]` for names, dates and contacts. Never invent retention periods as legal facts. Offer a suggested period and mark it as a choice.
6. **Stop and say so** if the user needs a binding legal answer. Send them to a lawyer or data protection officer.

### Output format

```
## Tool and purpose
## Data map
| Data field | Needed for the purpose? (yes, no, unsure) | Action (keep, cut, ask vendor) |
## Privacy risks
## Questions for the vendor
## Staff notice (draft)
## Retention and access rules
## Breach outline
## Staff data request steps
## For your lawyer to confirm
```

This is general guidance, not legal advice.

## Supported tasks

- Conducting privacy impact assessments for HR AI tools
- Designing data minimization practices for HR data collection
- Building employee consent and transparency frameworks for AI use
- Assessing GDPR and local privacy law compliance for HR AI systems
- Defining data retention and deletion policies for HR AI data
- Evaluating vendor data privacy practices before adoption
- Designing access controls for sensitive employee data in AI systems
- Training HR teams on employee data privacy responsibilities
- Managing employee data subject access requests
- Building privacy-by-design into HR technology implementations
- Developing incident response processes for HR data breaches
- Governing cross-border employee data transfers in global HR systems

## Key prompts

### Privacy impact assessment

1. "Conduct a privacy impact assessment (PIA) for our [AI hiring tool / performance management AI / employee monitoring system]."
2. "What privacy risks should we assess when adopting an AI-powered [recruitment / analytics / engagement] platform?"
3. "Design a vendor privacy due diligence checklist for evaluating HR technology that processes employee data."
4. "How do we assess whether an AI vendor's data processing practices comply with [GDPR / PDPA / PIPL] requirements?"
5. "What privacy risk indicators suggest we should require a Data Protection Impact Assessment (DPIA) before deploying [HR AI tool]?"

### Data minimization and collection

1. "What employee data does our [AI tool] actually need versus what it collects, and how do we reduce unnecessary collection?"
2. "Design data minimization principles for our HR AI stack that balance analytical utility with privacy protection."
3. "How do we evaluate whether the data [AI vendor] collects from our employees is proportionate to the stated purpose?"
4. "What data fields in our [HRIS / ATS / engagement platform] create unnecessary privacy risk and should be eliminated?"
5. "Design a data inventory for our HR AI systems that maps what employee data is collected, stored, processed, and shared."

### Employee consent and transparency

1. "Write an employee privacy notice for [AI-powered hiring / performance / monitoring] systems that is clear and honest."
2. "Design an employee consent framework for AI tools that use personal data for [profiling / analysis / decision-making]."
3. "What transparency obligations do we have to employees when we use AI to make or influence decisions about them?"
4. "How do we handle employee objections to AI-based data processing under data protection law?"
5. "Write an FAQ for employees explaining what data we collect in [HR AI system] and how it is used."

### Regulatory compliance

1. "Assess whether our [HR AI tool] complies with GDPR requirements for automated decision-making under Article 22."
2. "What legal bases apply to processing employee data with AI under [GDPR / local law] and which is most appropriate for [use case]?"
3. "How do we manage data subject access requests from employees who want to know what AI data we hold about them?"
4. "What cross-border data transfer mechanisms apply when our HR AI vendor processes employee data outside [region]?"
5. "Design a data retention schedule for employee data processed by AI tools in our HR systems."

### Incident response and governance

1. "Design an incident response process for an HR data breach involving employee personal data in an AI system."
2. "What governance structures ensure ongoing employee data privacy compliance as our HR AI footprint grows?"
3. "How do we build privacy-by-design into new HR AI implementations from the requirements stage?"
4. "Design a regular privacy audit process for our HR AI systems covering data use, access controls, and retention."

## Tips

- Employee data in HR systems is among the most sensitive personal data organizations hold — it includes health information, performance assessments, financial data, and behavioral patterns that require the strongest protections.
- Data minimization is the most effective privacy protection: if the data isn't collected, it can't be breached, misused, or create compliance risk.
- Consent is rarely the right legal basis for employee data processing in employment relationships due to power imbalance — consult legal counsel on appropriate bases under applicable law.
- Privacy notices and disclosures are only effective if employees read and understand them; test your privacy communications for comprehension before publication.
- Cross-border data transfers are a significant compliance risk for global HR systems — map your HR data flows across jurisdictions before deploying AI tools with international data processing.
