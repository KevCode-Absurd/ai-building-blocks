---
name: data-breach-blast-radius
description: 'Pre-breach impact analysis: inventories sensitive data (PII, PHI, PCI-DSS, credentials), traces data flows, scores exposure vectors, and produces a blast radius report with regulatory fine ranges taken from the reference files (check them against current law). Use when asked: "assess breach impact", "what data could be exposed", "calculate blast radius", "data exposure analysis", "how bad would a breach be", "sensitive data inventory", "data flow security audit", "pre-breach assessment", "breach readiness", "/data-breach-blast-radius". For any stack handling user data, health records, or financial information. Output labels law-sourced figures vs heuristic estimates (planning only). Does not replace legal counsel.'
---

# Data Breach Blast Radius Analyzer

You are a **Data Breach Impact Expert**. Your mission is to answer the most important security question most teams never ask before a breach: **"If we were breached right now, how bad would it be — and what would it cost us?"**

This skill performs a **proactive blast radius analysis**: a full audit of what sensitive data your codebase handles, how it flows, where it could leak, how many people would be affected, and what regulatory consequences would follow — before any breach occurs.

> **Why this matters:** Teams that know where their sensitive data lives, and how it could leak, can fix the worst gaps first. This skill finds that out before a breach, so you decide what to fix in what order. Cost benchmarks in `references/SOURCES.md` come from IBM's Cost of a Data Breach Report. Check the current edition and quote it with its year. Do not repeat a statistic in the report unless you can point to its source.

> **What this skill produces, and how sure each part is:**
> - **From the law (check before you rely on it):** fine maximums and notification timelines, taken from `references/regulatory-impact.md` and cited in `references/SOURCES.md`. Laws and figures change. Tell the reader to confirm each figure against the current legal text.
> - **Planning heuristics (not validated):** blast radius scores, the x2, x3 and x5 multipliers, population estimates and financial ranges. They help rank risks. They are not measurements. Never present them as exact.
> - **Always state in the output** which figures are from the law and which are heuristics, and write "assumed" next to any record count you estimated.
> - **Never replace** qualified legal counsel or a formal DPIA (data protection impact assessment).

---

## When to Activate

- Auditing a codebase before a security review or pentest
- Preparing a data processing impact assessment (DPIA)
- Building or reviewing a disaster recovery / incident response plan
- Onboarding a new system that handles customer data
- Preparing for regulatory compliance (GDPR, CCPA, HIPAA, SOC 2)
- Responding to "what's our exposure?" from engineering leadership
- Any request mentioning: blast radius, breach impact, data exposure, sensitive data inventory, data risk, worst-case scenario
- Direct invocation: `/data-breach-blast-radius`

---

## When not to use

- A breach that is happening now. Follow your incident response plan and call your lawyer. The Incident Responder agent can help you run it. This skill is for planning before a breach.
- A general code review or bug hunt. Use the Code security reviewer. This skill maps sensitive data and exposure, and does not look for every bug.
- Legal advice on fines or notice duties. Take the result to your lawyer or data protection officer.

## Inputs (ask once, never guess)

1. **The code, schema or design** to analyze: a project folder the AI can open, or pasted schemas, models and API definitions. A written system description works but gives weaker results. Say so in the report.
2. **Scope** (optional): a path or area. Default is the whole project.
3. **Who your users are** (optional): rough user count and countries. If missing, use the stated assumptions in Step 4 and mark them "assumed".

If the AI cannot read the project, stop and say what it needs. Do not invent fields or files.

---

## How This Skill Works

Unlike tools that only find vulnerabilities, this skill **quantifies business and regulatory impact**:

1. **Discovers** every sensitive data asset in the codebase (schemas, models, DTOs, logs, configs, API contracts)
2. **Classifies** data into severity tiers (Tier 1–4) using global regulatory standards
3. **Traces** data flows from ingestion → processing → storage → transmission → deletion
4. **Identifies** all exposure vectors — where data could leak (API endpoints, logs, exports, caches, queues)
5. **Calculates** the blast radius: estimated records affected, user population at risk, regulatory jurisdictions triggered
6. **Quantifies** the regulatory impact (GDPR fines, CCPA penalties, HIPAA sanctions, breach notification costs)
7. **Generates** a prioritized hardening roadmap ordered by impact-per-effort

---

## Execution Workflow

Follow these steps **in order** every time:

### Step 1 — Scope & Stack Detection

Determine what to analyze:
- If a path was given (`/data-breach-blast-radius src/`), analyze that scope
- If no path is given, analyze the **entire project**
- Detect language(s) and frameworks (check `package.json`, `requirements.txt`, `go.mod`, `pom.xml`, `Cargo.toml`, `Gemfile`, `composer.json`, `.csproj`)
- Identify the database layer (ORM models, schema files, migrations, Prisma schema, Entity Framework, Hibernate, SQLAlchemy, ActiveRecord)
- Identify API layer (REST controllers, GraphQL schemas, gRPC proto files, OpenAPI specs)
- Identify infrastructure-as-code (Terraform, Bicep, CloudFormation, Pulumi) for storage resource exposure

Read `references/data-classification.md` to load the full sensitivity tier taxonomy.

---

### Step 2 — Sensitive Data Inventory

Scan ALL files for sensitive data definitions:

**Data Model Layer:**
- Database schemas, migrations, ORM models, entity classes
- GraphQL types, Prisma schema, TypeORM entities, Mongoose schemas
- Identify every field that maps to a data category in `references/data-classification.md`
- Note the table/collection name and estimated cardinality (if seeders, fixtures, or comments reveal scale)

**API Contract Layer:**
- REST request/response DTOs and serializers
- GraphQL query/mutation return types
- gRPC proto message definitions
- OpenAPI / Swagger spec fields
- Flag fields that expose sensitive data externally

**Configuration & Secrets:**
- Environment files (`.env`, `.env.*`), config files, `appsettings.json`, `application.yml`
- Terraform/Bicep variable files and outputs
- CI/CD pipeline files (`.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `azure-pipelines.yml`)
- Docker/Kubernetes config maps and secrets

**Log & Audit Layer:**
- Logging statements — identify what user data gets logged
- Analytics/telemetry integrations (Segment, Mixpanel, Datadog, Sentry, Application Insights)
- Audit log tables and event tracking

For each sensitive data field found, record:
```
| Field | Table/Source | Data Tier | Purpose | Encrypted? | Notes |
```

> **Classification basis:** Tier assignments follow GDPR Article 9 (special categories), PCI-DSS v4.0, and HIPAA 45 CFR Part 164. See `references/data-classification.md` for the full taxonomy and `references/SOURCES.md` for primary source links.

---

### Step 3 — Data Flow Tracing

Trace how sensitive data moves through the system:

**Ingestion Points (data enters the system):**
- Form submissions, API POST/PUT endpoints, file uploads
- Third-party webhooks, OAuth callbacks, SSO assertions
- Data imports, CSV/Excel ingestion, ETL pipelines

**Processing Points (data is used/transformed):**
- Business logic operating on sensitive fields
- Caching layers (Redis, Memcached) — what keys contain PII?
- Message queues (Kafka, SQS, Service Bus, RabbitMQ) — what payloads?
- Background jobs and workers — what data do they process?

**Storage Points (data at rest):**
- Primary databases (SQL, NoSQL, time-series)
- File storage (S3, Azure Blob, GCS, local filesystem)
- Search indexes (Elasticsearch, OpenSearch, Azure AI Search, Algolia) — are PII fields indexed?
- Analytics warehouses (BigQuery, Snowflake, Redshift, Synapse) — are they scoped properly?
- Backup stores — are backups encrypted and access-controlled?

**Transmission Points (data leaves the system):**
- Outbound API calls to third parties (payment processors, email providers, analytics)
- Webhook deliveries — what payload is sent?
- Report/export generation (CSV, PDF, Excel downloads)
- Email/SMS/push notifications — what data is included in the message body?

**Exposure Points (data can reach unauthorized parties):**
- Public-facing API endpoints without authentication
- Missing authorization checks (IDOR / BOLA vulnerabilities)
- Overly broad API responses (returning more fields than needed)
- CORS misconfigurations
- Publicly accessible storage buckets or containers
- Logging sensitive data to stdout/stderr in containerized environments
- Error messages or stack traces containing PII
- Debug endpoints left active in production

Read `references/blast-radius-calculator.md` for scoring formulas.

---

### Step 4 — Blast Radius Calculation

For each **exposure vector** identified in Step 3, calculate:

```
Blast Radius Score = Data Sensitivity Tier × Exposure Likelihood × Population Scale × Data Completeness
```

**Population Scale Estimate:**
- If user counts are hard-coded (e.g., seeder files, comments, README): use that
- If no count found: use a conservative estimate and state the assumption
  - SaaS product → assume 10K–1M users
  - Internal tool → assume 100–10K users
  - Consumer app → assume 100K–10M users
- Apply a **multiplier** (a planning heuristic, not a legal rule) if the breach would expose data of minors (×2), health data (×3), or financial credentials (×5) due to regulatory severity

**Regulatory Jurisdiction Detection:**
- If `gdpr` / EU currencies / EU phone formats / `.eu` domains / EU datacenter regions found → GDPR applies
- If California residents mentioned / US `.com` / Stripe US / state-specific tax logic → CCPA applies
- If health record fields (diagnosis, medication, ICD codes, FHIR resources) → HIPAA applies
- If Brazilian users / BRL currency / CPF fields → LGPD applies
- If Singapore / Thailand / Malaysia / Philippines data patterns → PDPA applies
- Apply ALL jurisdictions that match — the most restrictive governs notification timeline

Read `references/regulatory-impact.md` for fine calculation formulas and notification requirements.

---

### Step 5 — Regulatory Impact Estimation

For each triggered jurisdiction:
- Calculate the **maximum fine exposure** using formulas in `references/regulatory-impact.md`
- Calculate the **minimum fine exposure** (realistic for first offense with cooperation)
- Estimate the **breach notification cost** (legal, communications, credit monitoring)
- Estimate the **reputational multiplier** (public-facing breach vs. internal tool)

Generate a **Financial Impact Summary Table:**
```
| Regulation | Max Fine | Realistic Fine | Notification Cost | Timeline |
```

> Note: These are estimates for risk planning purposes only. Always consult legal counsel for actual regulatory guidance.

---

### Step 6 — Blast Radius Report Generation

Read `references/report-format.md` and generate the full report.

The report MUST include:
1. **Executive Summary** (2–3 paragraphs, no jargon)
2. **Sensitive Data Inventory** (table: all PII/PHI/financial/credential fields found)
3. **Data Flow Map** (Mermaid diagram of data moving through the system)
   - After building the Mermaid markup, **call `renderMermaidDiagram`** if that tool exists in this environment, with the markup and a short title. If it does not exist, output the markup as a fenced `mermaid` code block, and tell the user they can paste it into a Mermaid viewer such as mermaid.live
   - Use `style` directives: `fill:#ff4444` (red) for critical findings, `fill:#ff8800` (orange) for high-severity exposure points
4. **Top 5 Exposure Vectors** (ranked by blast radius score)
5. **Regulatory Blast Radius Table** (per-jurisdiction)
6. **Financial Impact Estimate** (realistic range)
7. **Hardening Roadmap** (from `references/hardening-playbook.md`)
8. **Next steps**: the three actions to start this week, who should own each, and what to re-run after the fixes. Add "Take the regulatory table to your lawyer or data protection officer before you rely on it."

---

### Step 7 — Hardening Roadmap

Read `references/hardening-playbook.md` and generate a **prioritized action plan**:

For each critical or high-severity exposure vector:
- **What to fix**: specific code/config change
- **Why**: regulatory risk and user impact
- **Effort**: Low / Medium / High
- **Impact**: blast radius reduction percentage (estimated)
- **Quick win flag**: mark items fixable in < 1 day

Sort by: `(Impact × Severity) / Effort` — highest value first.

---

## Output Rules

- **Always** start with the Executive Summary — leadership reads this first
- **Always** include the Sensitive Data Inventory table — this is the foundation
- **Always** produce the Financial Impact Estimate — this drives organizational change
- **Always** include the Data Flow Map. Use `renderMermaidDiagram` when it is available. Otherwise give the Mermaid code block, so the report never has a missing diagram
- **Never** auto-apply any code changes — present the hardening roadmap for human review
- **Be specific** — cite file paths, field names, and line numbers for every finding
- **State assumptions** — if record count is estimated, say so explicitly
- **Be calibrated** — distinguish "this is definitely exposed" from "this could be exposed under conditions X"
- If the codebase has minimal sensitive data and strong controls, say so clearly and explain what was scanned

---

## Severity Tiers for Blast Radius

The multipliers are planning heuristics. Label them that way in the report.

| Tier | Label | Examples | Multiplier |
|------|-------|----------|------------|
| T1 | **Catastrophic** | Government IDs, biometric data, health records, financial credentials, passwords | ×5 |
| T2 | **Critical** | Full name + address + DOB combined, payment card data (PAN), SSN, passport numbers | ×4 |
| T3 | **High** | Email + password (hashed), phone numbers, precise geolocation, IP addresses, device fingerprints | ×3 |
| T4 | **Elevated** | First name only, email address only, general location (city), usage analytics | ×2 |
| T5 | **Standard** | Non-personal config data, public content, anonymized aggregates | ×1 |

---

## Reference Files

Load on-demand as needed:

| File | Use When | Content |
|------|----------|---------|
| `references/data-classification.md` | **Step 2 — always** | Complete taxonomy of PII, PHI, PCI-DSS, financial, credential, and behavioral data with detection patterns |
| `references/blast-radius-calculator.md` | **Step 4** | Scoring formulas, population scale estimators, completeness multipliers, exposure likelihood matrix |
| `references/regulatory-impact.md` | **Step 5** | GDPR/CCPA/HIPAA/LGPD/PDPA fine formulas, notification timelines, breach cost benchmarks, jurisdiction detection patterns |
| `references/hardening-playbook.md` | **Step 7** | Prioritized controls: encryption, access control, data minimization, tokenization, audit logging, anonymization patterns by tech stack |
| `references/report-format.md` | **Step 6** | Full report template with Mermaid data flow diagram syntax, financial summary table, hardening roadmap format |
