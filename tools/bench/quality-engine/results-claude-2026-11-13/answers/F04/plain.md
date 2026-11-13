# Section 5: Data security, residency and compliance

This section explains how Atlassian protects your data in Jira and Confluence Cloud Enterprise: where it is stored, how it is encrypted, which independent audits cover it, how your administrators control access, how third-party apps are vetted, and what happens to your data when the contract ends. Supporting documents (audit reports, certificates and our Data Processing Addendum) are available through the Atlassian Trust Center, and some are shared under NDA.

> **Internal notes for review.** Items marked **[Confirm]** must be checked with Atlassian Security and Compliance before submission. Remove all notes before sending.

## 5.1 Where is data stored, and can it be pinned to the EU?

Atlassian Cloud runs on Amazon Web Services (AWS) infrastructure. By default, data is distributed across AWS regions. Through **data residency**, an organisation can pin in-scope product data to a chosen location. Data residency is available for Jira and Confluence on the Standard, Premium and Enterprise plans.

Current locations include the **EU** and **Germany**, as well as the UK, Switzerland, USA, Canada, Australia, Japan, Singapore, South Korea and India. For a European insurer, we would recommend the EU or Germany location.

**Data that can be pinned includes:**

- **Jira:** issues and field content, comments, attachments, board and sprint data, project configuration and search data.
- **Confluence:** pages and blogs, comments, attachments, whiteboards, databases and search data.
- **Atlassian Guard:** user account information and audit log events.

**Data that is outside the scope of data residency includes:** user account details held in our global identity service (name, email address, avatar), product and user analytics, app, audit and operational logs, cached content and data in transit (each held for up to 30 days), Confluence permission configuration and space keys, and connected DevOps data in Jira (such as commits and builds).

Third-party Marketplace apps store data according to their own architecture. Apps with the "Runs on Atlassian" badge keep customer data on Atlassian infrastructure and support data residency (see 5.5).

> **[Confirm]** The current list of locations and in-scope data types, as both change over time. Also confirm the out-of-scope wording for "user account information", as our documentation lists it both as in scope under Guard and as out of scope for the global identity service.

## 5.2 How is data encrypted at rest and in transit?

**In transit:** Data sent to and from Atlassian Cloud is encrypted using TLS 1.2 or higher, with perfect forward secrecy.

**At rest:** Customer data and attachments in Jira and Confluence are encrypted at rest using AES-256. By default, encryption keys are managed by Atlassian through AWS Key Management Service (KMS).

**Customer-managed keys (CMK):** Enterprise customers can buy CMK as an add-on. CMK lets you encrypt your Jira and Confluence data with keys held in your own AWS KMS account, so you control, rotate and, if needed, revoke access to those keys. CMK can currently be turned on for new Cloud Enterprise sites. Atlassian has said it is building tooling to enable CMK on existing sites.

> **[Confirm]** Whether CMK is included in this proposal and priced. Since this is a migration, check whether CMK can be turned on before data is moved, and the current timeline for existing sites. Also confirm the effect of key revocation on service and backups.

## 5.3 Which certifications do we hold?

Atlassian Cloud is audited by independent third parties. The table below lists the certifications and attestations relevant to Jira and Confluence Cloud. Scope varies by product, so the exact scope is set out in each report or certificate.

| Framework | Status for Jira and Confluence Cloud |
|---|---|
| ISO/IEC 27001 | Certified. The certificate extends the Statement of Applicability to include ISO/IEC 27018 controls for protecting personal data in the cloud. |
| ISO/IEC 27018 | Covered through the combined ISO/IEC 27001 certificate. |
| SOC 2 Type II | Independent attestation, available under NDA. |
| BSI C5:2020 Type 2 | Attestation completed for Jira, Jira Service Management and Confluence Cloud. |
| CSA STAR | Level 1 self-assessment published in the CSA STAR Registry. |
| GDPR | Atlassian offers a Data Processing Addendum, including Standard Contractual Clauses for international transfers. |
| DORA | Atlassian publishes guidance and resources for financial entities subject to the EU Digital Operational Resilience Act. |

> **[Confirm]** Before adding them to the table, check whether we can claim SOC 1, SOC 3, ISO/IEC 27017 or ISO/IEC 27701, and the current certificate dates for each item. Do not list PCI DSS as a product certification: it relates to how Atlassian handles card payments, not to Jira or Confluence data. Ask Legal whether we offer a DORA contract addendum, as an insurer will very likely ask for one. Confirm our current EU–US Data Privacy Framework status.

## 5.4 How do administrators control access?

The Enterprise plan includes **Atlassian Guard Standard**. Administrators manage all of this centrally in Atlassian Administration (admin.atlassian.com).

- **Single sign-on (SSO):** SAML SSO with your identity provider, such as Microsoft Entra ID or Okta. Authentication policies let you apply different rules to different groups of users, for example requiring SSO for staff and two-step verification for others.
- **User provisioning (SCIM):** Users and groups can be created, updated and deactivated automatically from your identity provider. When a person leaves your organisation, their access can be removed as soon as they are deprovisioned.
- **IP allowlisting:** Administrators can restrict access to Jira and Confluence to approved IP address ranges, such as your corporate network or VPN.
- **Domain verification and managed accounts:** Once you verify your company domains, you can manage all accounts that use them, including accounts created before the migration.
- **Audit logs:** Organisation audit logs record administrative and user activity for review and investigation.

**Atlassian Guard Premium** is available as an add-on. It adds features such as data classification and the detection of suspicious user activity.

> **[Confirm]** Whether Guard Premium is in scope for this bid, the audit log retention period for Enterprise, and whether we can name SIEM integrations for audit log export.

## 5.5 How are third-party Marketplace apps vetted?

All cloud apps listed on the Atlassian Marketplace must meet Atlassian's mandatory security requirements, both when they are first listed and with each update.

- **Automated scanning:** Atlassian's Ecoscanner platform checks apps on an ongoing basis for code vulnerabilities, supply-chain risks, malware and misconfigurations. If an app fails a requirement, Atlassian starts remediation with the partner.
- **Partner checks:** App partners go through identity verification, complete security questionnaires, must fix security bugs within set timeframes, and must publish a privacy policy describing how they handle data, their sub-processors and where data is stored.
- **Penetration testing:** Atlassian runs a penetration testing programme with CREST-certified testers. Customers can filter the Marketplace for apps that take part.
- **Trust badges:** "Runs on Atlassian" apps are built on Atlassian's Forge platform, keep customer data on Atlassian infrastructure, limit data leaving it and support data residency. "Atlassian Enterprise Certified" apps meet further requirements for security, compliance, reliability and privacy, and must take part in Atlassian's bug bounty programme.

**Your controls:** Administrators can see and manage every installed app from one place, stop end users from installing apps, require an approval step, block apps entirely, limit an app's access to particular projects or spaces, and review app activity in audit logs.

Third-party apps are provided by their partners under the partners' own terms. We recommend reviewing each app you plan to use, and we can support an app inventory and risk review as part of the migration.

> **[Confirm]** Atlassian's "Cloud Fortified" badge is due to be retired on 31 December 2026. Check how we describe this, and confirm that the current names of the badges and their requirements are correct.

## 5.6 What happens to the data when the contract ends?

**Export:** You can export your data at any time during the subscription. This includes Jira and Confluence backups and exports, and user data from Atlassian Administration. We recommend a final export before the end date.

**Retention after the contract ends:** When a paid subscription ends, the site is deactivated and can no longer be accessed. For paid plans, Atlassian keeps the data for **60 days**. During this time, the site can be reactivated with its data intact. After this, the data is **permanently deleted** and cannot be recovered.

**Earlier deletion:** You can ask Atlassian to delete your data before the 60-day period ends.

**Backups:** Atlassian keeps encrypted backups for disaster recovery, for example daily database snapshots held for 30 days. These are for Atlassian's own recovery use and are deleted on a rolling schedule.

**Marketplace apps:** Data held by third-party apps outside Atlassian infrastructure is deleted under each partner's own terms.

> **[Confirm]** The exact number of days until data is purged from all backups after deletion, and whether we provide a deletion certificate on request. Confirm both against the current Data Processing Addendum before quoting them.
