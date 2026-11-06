# Audit readiness run

**Trigger:** A customer asks for a SOC 2 report or an ISO/IEC 27001 certificate, or the acquirer asks for PCI DSS validation. How long preparation takes depends on the gaps found; set the target date with the auditor or acquirer. The week numbers below are a planning guide for the order of work, not a promise.

**Access:** Set at the start, per tool (see `access.md`). Until you choose, I work at level 1.

## Steps

1. **Confirm the ask (week 1).** Write the one-line ask (who needs what, for which service, by when). Confirm the scope, report type, period and criteria version with the CPA firm or certification auditor, or the SAQ with the acquirer. Use the `audit-evidence-pack` skill, step 1. *Approval: the owner confirms the scope and budget before any auditor is engaged.*
2. **Map systems and data (week 1 to 2).** List in-scope systems, vendors, admin access and data flows. For card payments, draw the card data flow and note whether payment uses a redirect, an embedded form or a fully outsourced page.
3. **Build the control register (week 2).** One row per control with framework reference, owner, frequency and evidence. Map existing NIST CSF 2.0 or Cyber Essentials work across.
4. **Policies (week 2 to 4).** Run the `policy-gap-check` prompt against the framework. Draft missing policies at level 2 with the business's real tools and roles. *Approval: each policy owner approves before publishing; at level 3 I then publish the approved versions.*
5. **Vendors (week 3).** Check key vendors with the `vendor-data-terms-check` prompt and collect their current SOC 2 reports or ISO/IEC 27001 certificates.
6. **Evidence (week 3 onwards).** Request dated evidence from each control owner. At level 3, send the requests and reminders to the named owners and upload evidence to the compliance platform. Controls that run all year need evidence across the period.
7. **Gap fixes (week 4 onwards).** Track each gap with owner and date. Report weekly to the owner.
8. **Handover to the auditor.** Give the evidence index and the questions for the auditor. *Approval: anything stated or signed for the company to the auditor, acquirer or customer needs the signer's yes.*

## Outputs

- Confirmed scope and timeline
- System and data flow map
- Control register and policy map
- Approved policies
- Vendor reports and certificates on file
- Evidence index and gap list with owners
- Questions for the auditor or acquirer and for a lawyer
- Action log (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation:** publishing approved policies, assigning tasks and sending evidence requests and reminders to named owners, and uploading evidence.

**Always needs a new yes:** engaging an auditor or assessor, management statements, signed questionnaires or attestations of compliance, anything sent to the customer as the company's position, and deleting or overwriting evidence. The CPA firm, certification auditor or acquirer decides the outcome: ask a qualified lawyer or auditor, and never describe the business as compliant or certified before they do.
