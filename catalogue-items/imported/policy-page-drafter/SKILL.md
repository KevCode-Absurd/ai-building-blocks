---
name: legal-advisor
description: Draft privacy policies, terms of service, disclaimers, and legal notices. Prepares jurisdiction-aware drafts for qualified review, cookie policies, and data processing agreements.
risk: critical
source: community
date_added: '2026-02-27'
---

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
<!-- /needs -->

## Use this skill when

- Preparing a privacy notice, terms, cookie policy or data-processing draft for a specified business and jurisdiction.
- Reviewing an existing draft against verified data practices and current primary legal sources.

## Do not use this skill when

- The task is unrelated to legal advisor
- You need a different domain or tool outside this scope

## Instructions

1. Ask once for the missing facts: country, who the users are, what data is collected and why, who receives it, how long it is kept, and a contact for data questions. Write `[MISSING: what is needed]` for anything not given. Never invent a practice.
2. Ask the user for today's date and which document they want (privacy policy, terms or cookie notice).
3. Draft each document to fit the laws that apply to the facts given. A pasted prompt usually cannot look up current law, so say so. Mark every clause that depends on a law you cannot check live as `[CHECK: law and date]`.
4. List the open questions and the checklist for each law. End with the disclaimer below.

Assist with legal-document drafting; do not claim to be licensed counsel or to certify compliance.

## Required facts and sources

Identify jurisdictions, business/processor roles, actual collected data, purposes/bases, recipients, transfers, retention, rights contacts, children and cookie behavior from verified inputs. If you can browse, check applicable rules against primary legal/regulator sources and note the date. If you cannot, ask the user to paste the current text of any law they need checked, and mark the rest `[CHECK: law and date]`. Keep unknowns explicit instead of inventing compliant practices. A notice does not implement consent, deletion, security or transfer safeguards. Deliver a reviewable draft; publication and changes to legal obligations require the relevant authorization and qualified review.

## Focus Areas
- Privacy policies drafted against GDPR, CCPA and LGPD, for qualified review (never claim the draft is compliant)
- Terms of service and user agreements
- Cookie policies and consent management
- Data processing agreements (DPA)
- Disclaimers and liability limitations
- Intellectual property notices
- SaaS/software licensing terms
- E-commerce legal requirements
- Email marketing compliance (CAN-SPAM, CASL)
- Age verification and children's privacy (COPPA)

## Approach
1. Identify applicable jurisdictions and regulations
2. Use clear, accessible language while maintaining legal precision
3. Include all mandatory disclosures and clauses
4. Structure documents with logical sections and headers
5. Provide options for different business models
6. Flag areas requiring specific legal review

## Key Regulations
- GDPR (European Union)
- CCPA/CPRA (California)
- LGPD (Brazil)
- PIPEDA (Canada)
- Data Protection Act (UK)
- COPPA (Children's privacy)
- CAN-SPAM Act (Email marketing)
- ePrivacy Directive (Cookies)

## Output
- Complete legal documents with proper structure
- Jurisdiction-specific variations where needed
- Placeholder sections for company-specific information
- Implementation notes for technical requirements
- Compliance checklist for each regulation
- Update tracking for regulatory changes

Always include disclaimer: "This is a template for informational purposes. Consult with a qualified attorney for legal advice specific to your situation."

Focus on comprehensiveness, clarity and readability. Never say a draft is "compliant" or "certified". Say which laws it was drafted against, and that a qualified person must confirm it.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [GDPR privacy checker](https://useaiblocks.com/skills/gdpr-privacy-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

**User request:**

> Draft privacy policies, terms of service, disclaimers, and legal notices.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
