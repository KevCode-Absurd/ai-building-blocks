---
name: hr-risk-management
description: "Help HR teams identify, assess, and mitigate people-related risks across compliance, workforce continuity, conduct, and organizational health. Use when asked to identify HR risks, build an HR risk register, manage compliance risk, develop HR risk mitigation plans, handle employee relations risks, or similar HR risk management tasks."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR risk management

Identify, assess and reduce people-related risks across the organization (compliance, conduct, workforce continuity, data privacy and organizational health) with a risk register and mitigation plans.

This is a planning aid. It is not legal advice. For live disputes, investigations or legal exposure, tell the user to involve employment counsel. Say so in the output.

## Before you start

You need the company size, industry and countries. Optional: any change under way (fast growth, restructuring, a merger), known problems or past incidents, existing policies, and names of people who could own each risk.

If something required is missing, ask once. If it stays missing, write "MISSING: <item>" and carry on using a stated assumption. Never invent incidents, laws, fines or statistics. Where a legal duty depends on place, write "check local law" and name the area, instead of citing a rule you can't verify.

## Steps

1. **Restate the context.** Size, industry, countries, change under way, known issues.
2. **List the risks.** Group them: compliance, employee conduct, key person dependence, workforce continuity, data privacy, workplace safety, and any extra that fits the context. Aim for the 10 to 15 that fit this company, not a full catalogue.
3. **Score each risk.** Likelihood 1 to 5 and impact 1 to 5, with a one-line reason. Priority = likelihood x impact. Say the scale is a judgement, not a measurement.
4. **Assign an owner and a response.** One named role per risk (use the names given, or a role title). One concrete response step and a review date or trigger.
5. **Map key person risk.** List roles or people the business can't easily do without, why, and one step to reduce each.
6. **Write escalation steps.** For serious incidents such as a conduct complaint: who is told, in what order, what is recorded, and when outside counsel is called.
7. **Add a short audit checklist.** Five to eight questions to find gaps in hiring, contracts, policies and records.
8. **Flag.** What was assumed, what needs counsel, and the next three actions.

## Output

```
CONTEXT AND ASSUMPTIONS
RISK REGISTER        # | category | risk | likelihood | impact | priority | owner | response | review by
TOP 5                <the five highest priorities, one line each>
KEY PERSON MAP       <role> | why it matters | step to reduce the risk
ESCALATION STEPS     <incident type> | who is told | order | what is recorded | when to call counsel
AUDIT CHECKLIST      <5 to 8 questions>
FLAGS AND NEXT STEPS <assumptions> | MISSING: <items> | needs counsel: <items>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Action item tracker](https://useaiblocks.com/skills/executive-action-register). It takes the audit report.
- The [Stakeholder update writer](https://useaiblocks.com/skills/stakeholder-update-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Supported tasks

- Identifying and categorizing people-related risks across the organization
- Building HR risk registers with likelihood and impact assessments
- Developing compliance risk monitoring frameworks for labor law and employment regulations
- Creating employee relations risk protocols for misconduct, grievance, and harassment
- Designing workforce continuity and key person dependency risk plans
- Building HR audit frameworks to identify process and documentation gaps
- Developing psychosocial and workplace safety risk assessments
- Creating data privacy and people data governance risk controls
- Writing escalation and crisis response protocols for HR incidents
- Training managers on recognizing and reporting HR risk signals

## Key prompts

### Risk identification and assessment

1. "Identify the top HR risks for a [industry/company stage] organization."
2. "Create an HR risk register template with categories, likelihood, impact, and ownership."
3. "Conduct a people risk assessment for a company undergoing [M&A/restructuring/rapid growth]."
4. "Develop a workforce dependency risk map identifying key person risks."
5. "Write a compliance risk inventory for HR in [country/multi-country] operations."

### Risk mitigation

1. "Create mitigation plans for the top 5 HR risks in [company context]."
2. "Develop a succession planning framework to reduce key person risk."
3. "Design an HR compliance monitoring calendar for [labor law area]."
4. "Build a grievance and misconduct risk response protocol."
5. "Create a data privacy risk control checklist for HR processes."

### Employee relations risk

1. "Write an investigation protocol for handling [harassment/misconduct/grievance] complaints."
2. "Develop an early warning system for identifying flight risk employees."
3. "Create a manager escalation guide for employee relations risk signals."
4. "Design a documentation standard for disciplinary actions and HR conversations."
5. "Write a workplace conflict resolution framework to reduce litigation exposure."

### HR audit and governance

1. "Create an HR audit checklist covering hiring, contracts, policies, and documentation."
2. "Develop an HR controls framework for [specific risk category]."
3. "Design a quarterly HR risk review process for senior leadership."
4. "Write a risk reporting template for the HR dashboard."
5. "Build an HR risk governance policy with roles, escalation, and review cadence."

## Tips

- Categorize HR risks into compliance, operational, people, reputational, and strategic buckets for clearer ownership.
- Prioritize risks by combining likelihood and impact—not all risks need the same mitigation investment.
- Treat employee relations cases as both individual issues and leading indicators of systemic risk.
- Audit HR documentation practices regularly—incomplete records are a major legal and compliance liability.
- Build risk awareness into manager training rather than treating it as a purely HR function.
- Review the risk register after every major organizational change (restructure, acquisition, rapid hiring, market exit).
