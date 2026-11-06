---
name: audit-evidence-pack
description: Prepares a small business for an external check - a SOC 2 examination (AICPA), an ISO/IEC 27001 certification audit, or a PCI DSS self-assessment - by scoping, building a control register, mapping policies, collecting dated evidence with owners, and listing gaps to close. Use it when a customer asks for a SOC 2 report or ISO/IEC 27001 certificate, a payment provider asks for PCI DSS validation, or a security questionnaire needs proof. It prepares; the CPA firm, certification auditor or acquirer decides. Ask a qualified lawyer or auditor.
---

# Audit evidence pack

## When to use

- A customer asks for a SOC 2 report or ISO/IEC 27001 certificate before signing.
- The acquirer or payment provider asks for PCI DSS validation.
- A security questionnaire asks for evidence the team cannot find.
- The business wants to know how far it is from an audit before paying for one.

Do not use it to say the business is compliant, certified or ready to pass. The CPA firm, certification auditor or acquirer decides; ask a qualified lawyer or auditor.

## What you need

1. Which report, certificate or validation was asked for, by whom, and by when.
2. The auditor or acquirer, if chosen, and the criteria version they will use.
3. A short description of the product or service, the systems behind it, and the teams that run it.
4. Current policies, any risk register, and any control or evidence list.
5. For PCI DSS: how card payments are taken (redirect, embedded form, terminal, phone) and the payment provider.

**Access:** level 1 to read policies, tool settings and the compliance platform; level 2 to draft policies, control descriptions and evidence requests; level 3 to upload evidence, assign tasks to named owners and send reminders, within your limits. Management statements, signed questionnaires and anything sent to the auditor, acquirer or customer as the company's position need a fresh yes and the signer's approval.

## Steps

### 1. Pin down the ask

Write one line: "[Customer] needs [report or certificate] covering [service] by [date]." Then confirm with the client's CPA firm, certification auditor or acquirer:
- **SOC 2:** which of the five trust services categories (security, availability, processing integrity, confidentiality, privacy) are in scope, which report type and period, and which criteria version (the AICPA published exposure drafts of proposed 2027 criteria on 26 October 2026).
- **ISO/IEC 27001:** the ISMS scope (which sites, teams and services), and the audit stages and dates.
- **PCI DSS:** which SAQ or report the acquirer requires. Note that from 1 April 2025, SAQ A merchants with an embedded payment form must confirm protection against script attacks (Requirements 6.4.3 and 11.6.1) or get confirmation from their provider.

### 2. Map the systems and data

List the systems in scope, where sensitive data (customer data, card data) flows, who has admin access, and which vendors run parts of the service. For card payments, draw the card data flow and note whether payment uses a redirect, an embedded form or a fully outsourced page, because the SAQ A script-attack criterion applies only to embedded forms. The acquirer confirms what is in scope.

### 3. Build the control register

One row per control:

| Control | Framework reference | Risk it addresses | Owner | How it runs (frequency) | Evidence | Last evidence date | Status |
|---|---|---|---|---|---|---|---|

Use the framework's own references (Trust Services Criteria, ISO/IEC 27001 clauses and controls, PCI DSS requirements). Where the business uses NIST CSF 2.0 or Cyber Essentials already, map those controls across rather than starting again.

### 4. Map policies to controls

List each policy, its owner, version and approval date, and the controls it supports. Draft missing policies at level 2 with the business's real tools and roles, never generic ones.

### 5. Collect evidence

For each control, request dated evidence from its owner: a system setting export, an access review record, a training record, a ticket showing a change was approved, a backup test result. Controls meant to run all year need evidence from across the period, not one week. Store evidence in one place with the control reference in the file name.

### 6. List gaps and a plan

For each gap: what is missing, the fix, the owner, the date, and whether it must be fixed before the audit or can be disclosed. Rank by what the auditor or acquirer is likely to test first.

### 7. Hand over

Give the auditor-facing index (control, evidence, location), and a list of questions for the auditor (scope, sampling, report type, period). Choose the CPA firm on its own merits: the AICPA warned in April 2026 that business arrangements between CPA members and SOC tool providers can threaten independence.

## Checks

- The ask (report, scope, period, version) is confirmed with the auditor or acquirer, not assumed.
- Every control has an owner, a frequency and dated evidence or a gap row.
- No document says the business "is SOC 2 compliant", "is ISO 27001 certified" or "is PCI compliant" before the auditor or acquirer says so.
- Policies name the business's real tools, roles and processes.
- Evidence contains no passwords, keys, card numbers or unneeded personal data.
- The pack ends with "Questions for a qualified lawyer or auditor" and the line: this is a readiness document, not an audit opinion.

## Output format

1. One-line ask and confirmed scope.
2. System and data flow summary (card data flow for PCI DSS).
3. Control register.
4. Policy map.
5. Evidence index.
6. Gap list with plan.
7. Questions for the auditor or acquirer; questions for a lawyer.
8. Access I have, actions taken and the action log.

## Example of good output (short)

*Made-up business: Tamsett Scheduling, a 25-person software company asked by a hospital group for a SOC 2 report.*

**Ask.** Pellbrook Hospital Group (also made up) needs a SOC 2 report covering the Tamsett scheduling platform before contract renewal in June 2027. Categories: security and availability (to confirm with the CPA firm). Criteria version: to confirm, given the 2027 exposure drafts.

| Control | Reference | Owner | Frequency | Evidence | Status |
|---|---|---|---|---|---|
| Quarterly access review of production systems | TSC security criteria (reference to confirm with auditor) | Head of engineering | Quarterly | Signed review sheets, Q1 to Q4 | Gap: no Q2 record |
| Security awareness training | TSC security criteria (to confirm) | Ops lead | Yearly and at hire | Training platform export | Ready |

**Questions for a qualified lawyer or auditor**
1. Which report type and period will satisfy the hospital group's contract?
2. Will the 2027 criteria apply to our examination period?

*This is a readiness document, not an audit opinion.*
