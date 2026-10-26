---
name: gdpr-compliant
description: 'Apply GDPR-compliant engineering practices across your codebase. Use this skill whenever you are designing APIs, writing data models, building authentication flows, implementing logging, handling user data, writing retention/deletion jobs, designing cloud infrastructure, or reviewing pull requests for privacy compliance. Trigger this skill for any task involving personal data, user accounts, cookies, analytics, emails, audit logs, encryption, pseudonymization, anonymization, data exports, breach response, CI/CD pipelines that process real data, or any question framed as "is this GDPR-compliant?". Inspired by CNIL developer guidance and GDPR Articles 5, 25, 32, 33, 35.'
---

# GDPR Engineering Skill

Actionable GDPR reference for engineers, architects, DevOps, and tech leads.
Inspired by CNIL developer guidance and GDPR Articles 5, 25, 32, 33, 35.

> **Golden Rule:** Collect less. Store less. Expose less. Retain less.

For deep dives, read the reference files in `references/`:
- `references/data-rights.md` — user rights endpoints, DSR workflow, RoPA
- `references/Security.md` — encryption, hashing, secrets, anonymization, plus cloud, CI/CD, incident response and architecture patterns (this one file covers security and operations)

> **Not legal advice.** This is an engineering checklist, not a full compliance review. Findings need review by a data protection officer or a lawyer. It does not replace a DPIA (data protection impact assessment) or a record of processing (RoPA).

## When not to use

- A legal opinion on whether you comply. Ask a lawyer or data protection officer.
- A map of what sensitive data you hold and how it could leak. Use the Sensitive data exposure mapper.
- Preparing answers for an auditor. Use the GDPR audit prep coach. For a scan that also drafts an impact assessment and tracks data requests, use the GDPR privacy checker.
- Code that handles no personal data.

## Inputs (ask once, never guess)

1. **What to review:** a project folder, a pull request diff, a schema, an API design or a cloud setup, as files the AI can open or text pasted in. If the AI cannot open files, ask the user to paste the relevant parts.
2. **The goal:** review existing work, or design something new. If missing, ask.
3. **Where your users live and your legal basis** (optional). If missing, write `MISSING` in the report. Do not assume a legal basis.

No scanner or special tool is needed. You read the files and check them against the rules below. If you cannot read part of the system (for example the cloud setup), say so in the report. Do not mark it compliant.

## How to run a review

1. Read the inputs. Ask for anything missing, once.
2. Go through sections 1 to 14 and the PR Review Checklist in section 15 that apply to the code in front of you.
3. For each gap, record the file and line, the rule it breaks, the change to make and a priority.
4. For areas with no gap, write "No gap found" and what you looked at. Do not leave areas out silently.
5. Deliver the report in the format below.

## Output Format

Deliver a **Privacy Engineering Review** with these parts, in order.

1. **Scope.** What was reviewed, what was not, and any `MISSING` input.
2. **Gaps found.**

   | # | File and line | What is wrong | Rule broken (section) | Suggested change | Priority |
   |---|---------------|---------------|-----------------------|------------------|----------|

   Priority is High, Medium or Low. High means personal data can reach someone who should not see it, or data is kept with no limit.
3. **Checked, no gap.** Each area you reviewed with no problem, with one line on what you checked.
4. **Needs a person.** Items only a lawyer, a data protection officer or the team can decide: legal basis, retention periods, sub-processor contracts, whether a DPIA is needed.
5. **Next steps.** The three most important changes, in order.
6. **Reminder line:** "This is an engineering review, not legal advice."

---

---

## 1. Core GDPR Principles (Article 5)

| Principle | Engineering obligation |
|---|---|
| Lawfulness, fairness, transparency | Document legal basis for every processing activity in the RoPA |
| Purpose limitation | Data collected for purpose A **MUST NOT** be reused for purpose B without a new legal basis |
| Data minimization | Collect only fields with a documented business need today |
| Accuracy | Provide update endpoints; propagate corrections to downstream stores |
| Storage limitation | Define TTL at schema design time — never after |
| Integrity & confidentiality | Encrypt at rest and in transit; restrict and audit access |
| Accountability | Maintain evidence of compliance; RoPA ready for DPA inspection at any time |

---

## 2. Privacy by Design & by Default

**MUST**
- Add `CreatedAt`, `RetentionExpiresAt` to every table holding personal data at creation time.
- Default all optional data collection to **off**. Users opt in; they never opt out of a default-on setting.
- Conduct a **DPIA** before building high-risk processing (biometrics, health data, large-scale profiling, systematic monitoring).
- Update the **RoPA** with every new feature that introduces a processing activity.
- Sign a **DPA** with every sub-processor before data flows to them.

**MUST NOT**
- Ship a new data collection feature without a documented legal basis.
- Enable analytics, tracking, or telemetry by default without explicit consent.
- Store personal data in a system not listed in the RoPA.

---

## 3. Data Minimization

**MUST**
- Map every DTO/model field to a concrete business need. Remove undocumented fields.
- Use **separate DTOs** for create, read, and update — never reuse the same object.
- Return only what the caller is authorized to see — use response projections.
- Mask sensitive values at the edge: return `****1234` for card numbers, never the full value.
- Exclude sensitive fields (DOB, national ID, health) from default list/search projections.

**MUST NOT**
- Log full request/response bodies if they may contain personal data.
- Include personal data in URL path segments or query parameters (CDN logs, browser history).
- Collect `dateOfBirth`, national ID, or health data without an explicit legal basis.

---

## 4. Purpose Limitation

**MUST**
- Document the purpose of every processing activity in code comments and in the RoPA.
- Obtain a new legal basis or perform a compatibility analysis before reusing data for a secondary purpose.

**MUST NOT**
- Share personal data collected for service delivery with advertising networks without explicit consent.
- Use support ticket content to train ML models without a separate legal basis and user notice.

---

## 5. Storage Limitation & Retention

**MUST**
- Every table holding personal data **MUST** have a defined retention period.
- Enforce retention automatically via a scheduled job (Hangfire, cron) — never a manual process.
- Anonymize or delete data when retention expires — never leave expired data silently in production.

**Recommended defaults**

| Data type | Max retention |
|---|---|
| Auth / audit logs | 12–24 months |
| Session / refresh tokens | 30–90 days |
| Email / notification logs | 6 months |
| Inactive user accounts | 12 months after last login → notify → delete |
| Payment records | As required by tax law (7–10 years), minimized |
| Analytics events | 13 months |

**SHOULD**
- Add `RetentionExpiresAt` column — compute at insert time.
- Use soft-delete (`DeletedAt`) with a scheduled hard-delete after the erasure request window (30 days).

**MUST NOT**
- Retain personal data indefinitely "in case it becomes useful later."

---

## 6. API Design Rules

**MUST**
- MUST NOT include personal data in URL paths or query parameters.
  - Wrong: `GET /users/john@example.com`
  - Right: `GET /users/{userId}` where the ID is opaque
- Authenticate all endpoints that return or accept personal data.
- Extract the acting user's identity from the JWT — never from the request body.
- Validate ownership on every resource: `if (resource.OwnerId != currentUserId) return 403`.
- Use UUIDs or opaque identifiers — never sequential integers as public resource IDs.

**SHOULD**
- Rate-limit sensitive endpoints (login, data export, password reset).
- Set `Referrer-Policy: no-referrer` and an explicit `CORS` allowlist.

**MUST NOT**
- Return stack traces, internal paths, or database errors in API responses.
- Use `Access-Control-Allow-Origin: *` on authenticated APIs.

---

## 7. Logging Rules

**MUST**
- Anonymize IPs in application logs — mask last octet (IPv4) or last 80 bits (IPv6).
  - Example result: `192.168.1.xxx`
- MUST NOT log: passwords, tokens, session IDs, credentials, card numbers, national IDs, health data.
- MUST NOT log full request/response bodies where PII may be present.
- Enforce log retention — purge automatically after the defined period.

**SHOULD**
- Log **events** not data: `"User {UserId} updated email"` not `"Email changed from a@b.com to c@d.com"`.
- Use structured logging (JSON) with `userId` as an internal identifier, not the email address.
- Separate audit logs (sensitive access, admin actions) from application logs — different retention and ACLs.

---

## 8. Error Handling

**MUST**
- Return generic error messages — never expose stack traces, internal paths, or DB errors.
  - Wrong: `"Column 'email' violates unique constraint on table 'users'"`
  - Right: `"A user with this email address already exists."`
- Use **Problem Details (RFC 7807)** for all error responses.
- Log the full error server-side with a correlation ID; return only the correlation ID to the client.

**MUST NOT**
- Include file paths, class names, or line numbers in error responses.
- Include personal data in error messages (e.g., "User john@example.com not found").

---

## 9. Encryption (summary — see `references/Security.md` for full detail)

| Scope | Minimum standard |
|---|---|
| Standard personal data | AES-256 disk/volume encryption |
| Sensitive data (health, financial, biometric) | AES-256 **column-level** + envelope encryption via KMS |
| In transit | TLS 1.2+ (prefer 1.3); HSTS enforced |
| Keys | HSM-backed KMS; rotate DEKs annually |

**MUST NOT** allow TLS 1.0/1.1, null cipher suites, or hardcoded encryption keys.

---

## 10. Password Hashing

**MUST**
- Use **Argon2id** (recommended) or **bcrypt** (cost ≥ 12). Never MD5, SHA-1, or SHA-256.
- Use a unique salt per password. Store only the hash.

**MUST NOT**
- Log passwords in any form. Transmit passwords in URLs. Store reset tokens in plaintext.

---

## 11. Secrets Management

**MUST**
- Store all secrets in a KMS: Azure Key Vault, AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault.
- Use pre-commit hooks (`gitleaks`, `detect-secrets`) to prevent secret commits.
- Rotate secrets on developer offboarding, annual schedule, or suspected compromise.

**`.gitignore` MUST include:** `.env`, `.env.*`, `*.pem`, `*.key`, `*.pfx`, `*.p12`, `secrets/`

**MUST NOT**
- Commit secrets to source code. Store secrets as plain-text environment variable defaults.

---

## 12. Anonymization & Pseudonymization (summary — see `references/Security.md`)

- **Anonymization** = irreversible → falls outside GDPR scope. Use for retained records after erasure.
- **Pseudonymization** = reversible with a key → still personal data, reduced risk.
- When erasing a user, anonymize records that must be retained (financial, audit) rather than deleting them.
- Store the pseudonymization key in the KMS — never in the same database as the pseudonymized data.

**MUST NOT** call data "anonymized" if re-identification is possible through linkage attacks.

---

## 13. Testing with Fake Data

**MUST**
- MUST NOT use production personal data in dev, staging, or CI environments.
- MUST NOT restore production DB backups to non-production without scrubbing PII first.
- Use synthetic data generators: `Bogus` (.NET), `Faker` (JS/Python/Ruby).
- Use `@example.com` for all test email addresses.

---

## 14. Anti-Patterns

| Anti-pattern | Correct approach |
|---|---|
| PII in URLs | Opaque UUIDs as public identifiers |
| Logging full request bodies | Log structured event metadata only |
| "Keep forever" schema | TTL defined at design time |
| Production data in dev/test | Synthetic data + scrubbing pipeline |
| Shared credentials across teams | Individual accounts + RBAC |
| Hardcoded secrets | KMS + secret manager |
| `Access-Control-Allow-Origin: *` on auth APIs | Explicit CORS allowlist |
| Storing consent with profile data | Dedicated consent store |
| PII in GET query params | POST body or authenticated session |
| Sequential integer IDs in public URLs | UUIDs |
| "Anonymized" data with quasi-identifiers | Apply k-anonymity, test linkage resistance |
| Mixing backup regions outside EEA | Explicit region lockdown on backup jobs |

---

## 15. PR Review Checklist

### Data model
- Every new PII column has a documented purpose and retention period.
- Sensitive fields (health, financial, national ID) use column-level encryption.
- No sequential integer PKs as public-facing identifiers.

### API
- No PII in URL paths or query parameters.
- All endpoints returning personal data are authenticated.
- Ownership checks present — user cannot access another user's resource.
- Rate limiting applied to sensitive endpoints.

### Logging
- No passwords, tokens, or credentials logged.
- IPs anonymized (last octet masked).
- No full request/response bodies logged where PII may be present.

### Infrastructure
- No public storage buckets or public-IP databases.
- New cloud resources tagged with `DataClassification`.
- Encryption at rest enabled for new storage resources.
- New geographic regions for data storage are EEA-compliant or covered by SCCs.

### Secrets & CI/CD
- No secrets in source code or committed config files.
- New secrets added to KMS and secrets inventory document.
- CI/CD secrets masked in pipeline logs.

### Retention & erasure
- Retention enforcement job or policy covers new data store or field.
- Erasure pipeline updated to cover new data store.

### User rights & governance
- Data export endpoint includes any new personal data field.
- RoPA updated if a new processing activity is introduced.
- New sub-processors have a signed DPA and a RoPA entry.
- DPIA triggered if the change involves high-risk processing.

---

> **Golden Rule:** Collect less. Store less. Expose less. Retain less.
>
> Every byte of personal data you do not collect is a byte you cannot lose,
> cannot breach, and cannot be held liable for.

---

*Inspired by CNIL developer GDPR guidance, GDPR Articles 5, 25, 32, 33, 35,
ENISA, OWASP, and NIST engineering best practices.*
