---
name: hr-contingent-workforce
description: "Help HR and procurement teams manage contractors, freelancers, and temporary staff, including classification, vendor management, and program design. Use when asked to set up a contingent workforce program, classify a worker as contractor or employee, manage a VMS/MSP program, draft a statement of work, or similar contingent workforce tasks."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR contingent workforce

Helps HR, procurement, and legal teams manage the non-employee workforce — contractors, freelancers, temporary staff, and staffing agency workers — including classification, vendor management, and program governance.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** This is a planning and writing job. Claude, ChatGPT or Gemini all do it well.
<!-- /needs -->

## How to run this skill

1. **Ask once for what is missing.** You need: what work the contractors do, how they are directed and paid, how long they have stayed, and the country or state. Optional: current vendors, the contractor agreement. Ask the user to describe roles, not names or ID numbers. If the country or state is missing, say the check is general and mark `MISSING: country or state`.
2. **Check the classification factors** against the description: control over how the work is done, tools and equipment, schedule, exclusivity, integration into normal business, tenure, and whether the person runs their own business. Rate each factor low, medium or high risk and give one action. Judge the real working relationship, not the label in the contract.
3. **Never decide a worker's status.** Do not write "this person is a contractor" or "is an employee". Give risk ratings and say which points to take to an employment lawyer who knows local law. Do not state a country's legal test as fact unless the user supplied it. If you describe a test, say it is general and should be checked.
4. **Design the program:** sourcing, onboarding, offboarding (including system access removed on the contract end date), access rules kept apart from employee systems, and a yearly review of long-running engagements.
5. **Plan vendors:** roles, service levels, what to report (spend and headcount by department), and how to review staffing agencies. Use a vendor management system (VMS) or managed service provider (MSP) only if the user has one or wants one.
6. **Write the statement of work outline** and, if asked, the steps to convert a contractor to an employee. Leave `[BRACKETS]` for names, dates and fees. Never invent amounts or legal clauses.

### Output format

```
## Risk check
| Factor | What you told us | Risk (low, medium, high) | Action |
## Onboarding checklist
## Offboarding checklist
## Vendor plan
## Statement of work outline
## Converting a contractor to staff
## Common mistakes
## Questions for your lawyer
## MISSING (anything you could not fill)
```

This is guidance for HR and buying teams, not legal advice.

## Supported tasks

- Assessing worker classification (employee vs. independent contractor)
- Designing a contingent workforce management program
- Drafting statements of work (SOWs) for contractor engagements
- Managing vendor management system (VMS) and managed service provider (MSP) relationships
- Building onboarding and offboarding processes for contingent workers
- Designing policies for converting contractors to full-time employees
- Auditing contingent workforce spend and headcount
- Creating co-employment risk mitigation guidance
- Drafting contractor agreement templates and renewal processes
- Building reporting on contingent workforce composition and cost
- Designing access and security policies for non-employee workers
- Creating a tiered staffing agency vendor evaluation process

## Key prompts

### Classification and compliance

1. "Assess the classification risk of engaging a worker as an independent contractor for [work description]."
2. "Summarize the key factors used to distinguish employees from contractors in [jurisdiction]."
3. "Create a co-employment risk checklist for managing staffing agency workers."
4. "Draft a policy defining when a contractor engagement should be reviewed for reclassification."
5. "Design an audit process to review contractor classifications annually."

### Program and vendor management

1. "Design a contingent workforce management program covering sourcing, onboarding, and offboarding."
2. "Draft an evaluation framework for selecting staffing agency vendors."
3. "Create a VMS/MSP program governance structure with clear roles and SLAs."
4. "Build a dashboard spec to track contingent workforce spend and headcount by department."
5. "Draft a statement of work template for a project-based contractor engagement."

### Onboarding, offboarding, and conversion

1. "Create an onboarding checklist for contingent workers, distinct from full-time employee onboarding."
2. "Draft an offboarding process ensuring system access is revoked when a contract ends."
3. "Design a policy for converting a long-term contractor to a full-time employee."
4. "Write access and security guidelines for non-employee workers using company systems."
5. "Draft a contract renewal review checklist for ongoing contingent engagements."

## Tips

- Review contractor classification against local legal tests, not just the label used in the contract.
- Track contractor tenure carefully. A "temporary" engagement that runs a year or more in the same role is worth a proactive review. This is a prompt to check, not a legal limit, and the rules depend on local law.
- Keep contingent worker onboarding and system access separate from full-time employee processes to manage co-employment risk.
- Centralize contingent workforce spend visibility, which is often scattered across department budgets.

## Common mistakes

- Relying solely on a contractor agreement's label without assessing actual working relationship factors.
- Allowing contractor engagements to run indefinitely without periodic reclassification review.
- Granting contractors the same system access and benefits-adjacent perks as employees, increasing co-employment risk.
- Lacking centralized visibility into total contingent workforce spend across departments and vendors.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Contractor invoice and terms reviewer](https://useaiblocks.com/skills/monthly-contractor-roster-keeper).
- The [People cost budget builder](https://useaiblocks.com/skills/people-cost-budget-builder). It takes the plan and audit report.
- The [Employee termination risk reviewer](https://useaiblocks.com/skills/termination-risk-checker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
