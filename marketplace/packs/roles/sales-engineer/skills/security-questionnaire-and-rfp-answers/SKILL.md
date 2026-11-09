---
name: security-questionnaire-and-rfp-answers
description: Answers security questionnaires (CSA CAIQ, the SIG, a buyer's own spreadsheet) and the technical sections of RFPs from the seller's own evidence. Builds a requirement or question matrix, maps each item to a policy, report or certificate, marks every answer confirmed, partial or gap, routes security, privacy, legal and uptime answers to a named reviewer, and keeps a dated answer bank. Never turns a gap into a yes. Sending answers to a customer needs the client's fresh yes every time. Use when a questionnaire or RFP arrives, or to build the answer bank before the next one.
---

# Security questionnaire and RFP technical answers

A buyer's security team reads answers to decide whether the seller is a risk. A wrong "yes" can later be quoted back as a contract warranty. This skill answers from evidence only, shows gaps plainly, and makes the next questionnaire faster.

## When to use

- A buyer sends a security, privacy or vendor questionnaire: the CSA CAIQ, the SIG, a sector form or their own spreadsheet.
- An RFP has a technical, integration, hosting or security section.
- The client wants an answer bank and a short "trust pack" (what can be shared and on what terms) before the next request.

For the full bid process (bid or no-bid, colour team reviews, public tender rules) use the `proposal-writer` kit. For getting ready for a SOC 2 examination or ISO/IEC 27001 audit, use the `compliance-specialist` kit.

## What you need

**Access:** level 1 to read the questionnaire, RFP, policies, reports and past answers. Level 2 to draft answers in the client's RFP tool (such as Loopio or Responsive) or a shared sheet. Level 3 to load reviewed answers into the answer library and log status in the CRM within the client's limits. Sending answers to the customer, and sharing a restricted report such as a SOC 2 with a new recipient, need a fresh yes from the client every time.

- The questionnaire or RFP in full, with the deadline and any instructions on format.
- The client's evidence: security and privacy policies, SOC 2 report and period, SOC 3 if any, ISO/IEC 27001 certificate with its scope, Cyber Essentials certificate (UK), penetration test summary, business continuity plan, sub-processor list, data hosting locations.
- Past approved answers, with dates.
- The named reviewers for security, privacy, legal and uptime answers.

## Steps

1. **Read the instructions.** Format, answer options (yes, no, N/A, free text), word limits, whether evidence must be attached, deadline. Note anything that asks for a signature or declaration: that commits the client and needs a fresh yes.
2. **Build the matrix.** One row per question or requirement: ID, the question, category (access control, encryption, hosting, incident response, privacy, continuity, AI use, legal), answer status, answer text, evidence, reviewer, notes. For an RFP, add whether it is mandatory or scored.
3. **Reuse before writing.** Match each row to the answer bank. Reuse an approved answer only if its evidence is still current (report period, certificate expiry, policy version).
4. **Answer from evidence.** For each row, find the policy section, report section or certificate that supports it. Write the shortest answer that is literally true. Cite the evidence by name and section.
5. **Mark the status.** Confirmed: true, documented and in operation. Partial: true for some systems, sites or customers; say which. Gap: not true today. Where the client has a dated plan they have committed to, add it; otherwise leave the gap as a gap.
6. **Handle framework questions carefully.**
   - "Do you have SOC 2?" Answer only with a CPA firm's report, its criteria categories and period. A compliance tool dashboard is not a report.
   - "Are you ISO 27001 certified?" Give the certificate number, issuer, expiry and scope. If the scope does not cover the product being bought, say so.
   - CAIQ questions map to the CSA Cloud Controls Matrix. Where the client has published a STAR entry, check it is current before pointing to it.
   - EU buyers in finance or critical sectors may ask DORA- or NIS2-driven questions about subcontracting, data location, incident help and exit. Answer the facts; route contract terms to the client's lawyer.
   - AI questions: what models or providers are used, whether customer data trains models, where data is processed. Answer only what the client's documented setup shows.
7. **Route to reviewers.** Every security, privacy, legal and uptime answer goes to the named reviewer, with the evidence beside it. Record who approved what and when.
8. **Write the cover note.** A short summary for the buyer: what is attached, which documents are available on request and under what terms, and the gaps with any committed plans. Honest gaps build more trust than a wall of yeses.
9. **Get the fresh yes and send.** Show the client the final answers, gaps and cover note. Only after their yes for this send, submit through the buyer's portal or email. [L3] Log the submission in the CRM.
10. **Update the bank.** [L3] Load reviewed answers into the library with the evidence, the review date and an expiry trigger (the next report period, certificate renewal, policy review).

## Checks

- No row says yes without named evidence.
- Every gap is visible in the answer and the cover note.
- Report periods, certificate expiry dates and scopes are current and match the evidence.
- Product names, hosting regions and sub-processors are the same in every answer.
- No marketing words: "best-in-class", "military-grade", "fully compliant".
- Declarations, signatures and restricted documents are flagged for a fresh yes.
- Every answer has a named reviewer and approval date.

## Output format

1. The question matrix (as above), sorted by status: gaps, then partials, then confirmed.
2. Cover note draft.
3. List of documents requested by the buyer and the terms for sharing each.
4. Reviewer sign-off log.
5. New or changed answers for the bank, each with evidence and a review trigger.

## Example of good output

*Illustrative structure, not a real business: a small SaaS note-taking tool answering a hospital's questionnaire. Copy the shape, never the content: every fact comes from the client's own context.*

| ID | Question | Status | Answer | Evidence |
|---|---|---|---|---|
| AC-04 | Is MFA enforced for all staff access to production? | Confirmed | Yes. MFA is enforced through our identity provider for all staff accounts with production access. | Access Control Policy v3.2, section 4; SOC 2 report, period ending 30 June, access control section |
| DR-02 | Are backups tested at least annually? | Partial | Database restores are tested quarterly. File storage restores have not yet been tested; a test is planned for Q1. | Backup Procedure v1.4; restore test log |
| CE-01 | Do you hold ISO/IEC 27001 certification? | Gap | No. We hold a SOC 2 report (see attached cover note for sharing terms) and Cyber Essentials. We have no ISO/IEC 27001 certificate today. | SOC 2 report; Cyber Essentials certificate |
| AI-03 | Is customer data used to train AI models? | Confirmed | No. Our AI summary feature uses a third-party model under terms that exclude training on our customers' data. | AI Use Policy v1.0; provider terms, section 5 |

**Cover note (draft):** "Attached are our answers. One item is partial and one is a gap; each says so with any planned date. Our SOC 2 report is available under NDA; our SOC 3 can be shared now."
