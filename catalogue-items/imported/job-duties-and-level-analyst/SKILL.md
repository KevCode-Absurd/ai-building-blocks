---
name: hr-job-analysis
description: "Help HR teams, job analysis for compensation analysts, and job design specialists conduct job analysis, define job requirements, and document job content for job evaluation, classification, and workforce planning purposes. Use when asked to conduct a job analysis, define job requirements, write job content, classify a role, evaluate job complexity, run a task analysis, or audit our job structures."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# Job analysis and job content design

Conduct rigorous job analysis and design accurate job content — from gathering task and competency data and documenting job requirements to evaluating job complexity, supporting job classification decisions, and connecting job analysis to compensation and workforce planning.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **The job description** (yours): the role's title, team, duties and level, as a job post or plain notes.

**Makes it better (optional):**
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.
- **A draft** (yours): the ad, page, email or script you want checked or improved.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for the job description, source text, a draft. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** A chat AI can structure your notes. The facts must come from people who do the job.
<!-- /needs -->

## When to use it

Use it to write down what a role really involves and to suggest a fair level.

Skip it when:

- You only need a job post. Use the Job post writer.
- You need a pay range. Use the Pay band builder after this.
- You need skills and levels for many roles. Use the Role skills framework builder.
- You need a legal decision on overtime pay or disability accommodation. Ask an employment lawyer. This skill gathers the facts. It does not decide.

## What to gather first

Ask for anything missing once, in one message. Mark what you still lack as MISSING. Never invent duties, hours or requirements.

1. Role title and department.
2. Notes from people who do the job and from their manager (interview notes, task lists).
3. An existing job description (optional).
4. Your level or pay structure (optional).
5. Your country, if a legal question is involved.

## Steps

1. Plan the analysis in brief: which methods suit this role (interviews, questionnaire, task list, watching the work) and who to ask.
2. List the duties found in the notes, most important first. Mark any duty you inferred as INFERRED.
3. Give each duty a share of time. Say these are estimates from the notes, and make them add up to 100 percent.
4. Mark each duty essential or marginal, with a one-line reason.
5. List the knowledge, skills, abilities and other needs (KSAOs), taken from the duties.
6. Rate how complex the job is. Use the user's level structure if given. If not, use a plain scale and say so.
7. List what to check with the people doing the job, and what to take to HR or legal.

## Output format

1. Analysis plan (methods, people to ask, time needed)
2. Duties table (duty, share of time, essential or marginal, source)
3. KSAO table (need, type, linked duty)
4. Complexity rating and suggested level, with the reasons
5. Gaps and things to check

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [30-60-90 day onboarding planner](https://useaiblocks.com/skills/30-60-90-day-onboarding-planner). It takes the job description.
- The [Hiring interview planner](https://useaiblocks.com/skills/hiring-interview-designer). It takes the job description.
- The [Interview question set maker](https://useaiblocks.com/prompts/interview-question-set-maker). It takes the job description and document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Rules

- Describe the job, not the person who holds it.
- Say that the record supports a decision and is not legal advice.
- If asked about overtime exemption or accommodation, list the facts that matter and tell the user to check with an employment lawyer in their country.

## After you run it

Check the duties list with two people who do the job. Then feed it to the Pay band builder or the Job post writer.

## Supported tasks

- Planning and conducting structured job analysis projects
- Designing job analysis interviews and questionnaires
- Documenting job tasks, duties, and responsibilities
- Defining knowledge, skills, abilities, and other requirements (KSAOs)
- Conducting task analysis for training needs assessment
- Evaluating job complexity for job classification and banding decisions
- Gathering job facts that an employment lawyer or HR can use for FLSA or accommodation decisions
- Designing job analysis frameworks for new role families
- Connecting job analysis to competency frameworks and job architectures
- Running job audits to validate whether job content reflects actual work
- Using job analysis data for workforce planning and skills gap analysis
- Building clear job content documentation that HR or legal can review

## Key prompts

### Job analysis planning and methods

1. "Design a job analysis plan for [role or role family] including methods, data sources, and stakeholders."
2. "What job analysis methods are most appropriate for [technical / managerial / operational] roles?"
3. "How do we conduct a rapid job analysis when we need job content documentation quickly?"
4. "Design a job analysis interview guide for gathering task and requirement data from [incumbents / supervisors]."
5. "What questionnaire design principles produce reliable, complete job analysis data?"
6. "How do we validate job analysis data to ensure it reflects actual work, not idealized work?"

### Job content documentation

1. "Write the job content for a [role title] including essential duties, task frequency, and time allocation."
2. "Document the knowledge, skills, abilities, and other requirements (KSAOs) for [role title]."
3. "How do we distinguish between essential and marginal job functions for [role] for ADA compliance purposes?"
4. "Write a comprehensive job content summary for [role] that can be used for job evaluation, hiring, and performance management."
5. "How do we document the job requirements for a role that varies significantly across different work settings?"

### Job evaluation and classification

1. "Evaluate the complexity of [role] using [point-factor / whole-job / market-based] job evaluation methodology."
2. "What factors should we weight most heavily when evaluating job complexity for [technical / managerial / professional] roles?"
3. "How do we conduct a job evaluation to determine whether [role A] and [role B] should be in the same grade?"
4. "Design a job family classification framework for [function] covering levels from entry to expert."
5. "How do we defend a job classification decision to a manager who disagrees with the outcome?"
6. "What job evaluation criteria apply to roles that combine technical depth with significant people management?"

### Workforce planning integration

1. "How do we use job analysis data to identify which tasks in [role] are at risk of automation?"
2. "Design a skills gap analysis approach using job analysis data as the foundation for [function]."
3. "How do we use job content documentation to identify reskilling opportunities for employees whose roles are changing?"
4. "What job analysis data do we need to build an accurate competency framework for [role family]?"

### Compliance and legal

These prompts gather facts. They are not legal advice. Check with an employment lawyer in your country before you classify a role.

1. "How do we make sure our job analysis process produces documentation that HR or legal can review for [hiring / accommodation / classification] decisions?"
2. "Which job facts should we gather so an employment lawyer can decide FLSA exempt or non-exempt status for [role type]?"
3. "How do we record essential functions so an employment lawyer or HR can decide on an accommodation?"
4. "Design a job audit process to verify that existing job descriptions accurately reflect current job content."

## Tips

- Job analysis data is only as good as the sources — use multiple methods (interviews, observation, surveys, incumbent panels) and triangulate to avoid biased or incomplete job content.
- Distinguish clearly between what the job requires and what the current incumbent does; job analysis captures the job, not the person.
- Involve subject matter experts (incumbents and supervisors) as partners, not just data sources — their buy-in improves data accuracy and acceptance of outputs.
- Keep job content current; roles evolve faster than documentation — build a review cadence to audit job content every 2-3 years or when significant work changes occur.
- Job analysis documentation is most valuable when it integrates across HR uses — compensation, hiring, training, performance, and planning — rather than sitting in a single siloed system.
