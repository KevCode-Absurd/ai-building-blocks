# Security review: from request to buyer approval

**Trigger:** A buyer asks for security documents or sends a security, privacy or vendor questionnaire (CSA CAIQ, the SIG, a sector form or their own spreadsheet), or an RFP with a security section.

**Cadence:** Per request, against the buyer's deadline. A monthly answer bank check on report periods, certificate expiry dates and policy versions.

**Access:** At the start, ask which level the client grants for documents, the RFP or answer library tool, the CRM, email and the buyer's portal, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; [L3] needs read, write and publish access within the client's limits. Steps marked [Fresh yes] need the client's yes every time, even at level 3.

## Steps

1. **Reply to the request.** Run the `security-review-request-reply` prompt: what can be shared now, under NDA, or is not held, and a date for answers. *Approval: the client approves the reply.* [Fresh yes] Sending an NDA, or sharing a restricted report such as a SOC 2 with this recipient.
2. **Check the evidence is current.** List the SOC 2 report period, SOC 3, ISO/IEC 27001 certificate expiry and scope, Cyber Essentials certificate date, penetration test date and policy versions. Check the client's CSA STAR entry is current if they will point to it. Flag anything expired or out of scope.
3. **Build the matrix and draft.** Run the `security-questionnaire-and-rfp-answers` skill. [L2] Draft answers in the RFP tool or a shared sheet, each marked confirmed, partial or gap with evidence.
4. **Review.** Route security, privacy, legal and uptime answers to the named reviewers. Record approvals. *Approval: each reviewer signs off their rows.*
5. **Route contract questions.** Questions about liability, data processing terms, audit rights, subcontracting or exit (common from EU financial and critical-sector buyers) go to the client's lawyer. The agent drafts factual answers only.
6. **Final check with the client.** Show the gaps, partials, cover note and any declaration or signature the form asks for. [Fresh yes] Sending the answers to the customer, and any declaration.
7. **Submit and log.** After the yes, submit through the buyer's portal or email. [L3] Log the submission, date and contents in the CRM.
8. **Handle follow-up questions.** Draft answers to the buyer's follow-ups the same way; each new send to the customer needs a fresh yes.
9. **Update the answer bank.** [L3] Load reviewed answers into the library with evidence, review date and expiry trigger.
10. **Monthly check.** Flag answers whose evidence expires within the next review cycle and draft updates. *Approval: reviewers approve changed answers.*

## Outputs

- First reply to the buyer and a sharing-terms list.
- Evidence currency check.
- Question matrix with status, answers, evidence and reviewers.
- Cover note.
- Submission log.
- Updated answer bank with review triggers.

## What needs the client's approval

- Every send of answers or documents to a customer: a fresh yes every time.
- Every NDA, declaration or signature on the form: a fresh yes every time.
- Reviewer sign-off on every security, privacy, legal and uptime answer.
- Changes to approved answers in the bank.
