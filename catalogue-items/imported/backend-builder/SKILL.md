---
name: "senior-backend"
description: Designs and implements backend systems including REST APIs, microservices, database architectures, authentication flows, and security hardening. Use when the user asks to "design REST APIs", "optimize database queries", "implement authentication", "build microservices", "review backend code", "set up GraphQL", "handle database migrations", or "load test APIs". Covers Node.js/Express/Fastify development, PostgreSQL optimization, API security, and backend architecture patterns.
---

# Senior Backend Engineer

Backend development patterns, API design, database optimization, and security practices.

---

## Quick Start

```bash
# Generate API routes from OpenAPI spec
python scripts/api_scaffolder.py openapi.yaml --framework express --output src/routes/

# Analyze a database schema file and suggest changes (reads a .sql file, not a live database)
python scripts/database_migration_tool.py schema.sql --analyze

# Load test an API endpoint (only one you own or have written permission to test)
python scripts/api_load_tester.py https://api.example.com/users --concurrency 50 --duration 30
```

---

## Tools Overview

### 1. API Scaffolder

Generates API route handlers, middleware, and OpenAPI specifications from schema definitions.

**Input:** OpenAPI spec (YAML/JSON) or database schema
**Output:** Route handlers, validation middleware, TypeScript types

**Usage:**
```bash
# Generate Express routes from OpenAPI spec
python scripts/api_scaffolder.py openapi.yaml --framework express --output src/routes/
# Output: Generated 12 route handlers, validation middleware, and TypeScript types
```

The scaffolder reads an OpenAPI spec file. It does not read a live database or existing route files.

**What it writes:** one route handler file per route in the output folder, a validators file (`src/middleware/validators.ts`) and TypeScript types. Check the route handlers first.

**Supported Frameworks:**
- Express.js (`--framework express`)
- Fastify (`--framework fastify`)
- Koa (`--framework koa`)

---

### 2. Database Migration Tool

Analyzes database schemas, detects changes, and generates migration files with rollback support.

**Input:** A SQL schema file (the tool does not connect to a live database)
**Output:** Migration files, schema diff report, optimization suggestions

**Usage:**
```bash
# Analyze a schema file and suggest optimizations
python scripts/database_migration_tool.py schema.sql --analyze
# Output: Missing indexes, N+1 query risks, and suggested migration files

# Generate migration from schema diff
python scripts/database_migration_tool.py old.sql --compare new.sql --output migrations/

```

**What it writes:** a printed report of missing indexes and slow query risks, plus migration files (for example `migrations/add_indexes.sql`). Read the report first.

The tool writes migration files. It does not apply them. Always try a migration on a copy of your database first, never on live data.

---

### 3. API Load Tester

Performs HTTP load testing with configurable concurrency, measuring latency percentiles and throughput.

**Input:** API endpoint URL and test configuration
**Output:** Performance report with latency distribution, error rates, throughput metrics

**Usage:**
```bash
# Basic load test
python scripts/api_load_tester.py https://api.example.com/users --concurrency 50 --duration 30
# Output: Throughput (req/sec), latency percentiles (P50/P95/P99), error counts, and scaling recommendations

# Test with custom headers and body
python scripts/api_load_tester.py https://api.example.com/orders \
  --method POST \
  --header "Authorization: Bearer [YOUR TEST TOKEN]" \
  --body '{"product_id": 1, "quantity": 2}' \
  --concurrency 100 \
  --duration 60

# Compare two endpoints
python scripts/api_load_tester.py https://api.example.com/v1/users https://api.example.com/v2/users \
  --compare --concurrency 50 --duration 30
```

**What it prints:** a report with requests per second, response time spread (P50, P95, P99) and error counts. Check the error count first.

---

## Backend Development Workflows

### API Design Workflow

Use when designing a new API or refactoring existing endpoints.

**Step 1: Define resources and operations**
```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: User Service API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      parameters:
        - name: "limit"
          in: query
          schema:
            type: integer
            default: 20
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
```

**Step 2: Generate route scaffolding**
```bash
python scripts/api_scaffolder.py openapi.yaml --framework express --output src/routes/
```

**Step 3: Implement business logic**
```typescript
// src/routes/users.ts (generated, then customized)
export const createUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  // Add business logic
  const user = await userService.create({ email, name });

  res.status(201).json(user);
};
```

**Step 4: Add validation middleware**
```bash
# Validation is auto-generated from OpenAPI schema
# src/middleware/validators.ts includes:
# - Request body validation
# - Query parameter validation
# - Path parameter validation
```

**Step 5: Update the OpenAPI spec by hand**
The scaffolder does not read routes back into a spec. Edit `openapi.yaml` to match your routes, then regenerate.

---

### Database Optimization Workflow

Use when queries are slow or database performance needs improvement.

**Before you start:** work on a staging copy of the database, never on live data. Do not touch a database you do not own without written permission.

**Step 1: Analyze current performance**
```bash
python scripts/database_migration_tool.py schema.sql --analyze
```

**Step 2: Identify slow queries**
```sql
-- Check query execution plans
EXPLAIN ANALYZE SELECT * FROM orders
WHERE user_id = 123
ORDER BY created_at DESC
LIMIT 10;

-- Look for: Seq Scan (bad), Index Scan (good)
```

**Step 3: Generate index migrations**
```bash
python scripts/database_migration_tool.py schema.sql --suggest-indexes --output migrations/
```

**Step 4: Review the migration file**
The tool does not run migrations. Read `migrations/add_indexes.sql` and run it on a staging copy of the database first.

**Step 5: Apply and verify**
Apply the migration to the staging copy with your own database tool. Then re-run the analysis on the updated schema file:
```bash
python scripts/database_migration_tool.py schema.sql --analyze
```

---

### Security Hardening Workflow

Use when preparing an API for production or after a security review.

**Step 1: Review authentication setup**
```typescript
// Verify JWT configuration
// Preferred: RS256 signs with a private key and checks with a public key.
// The key file paths come from env, never hardcoded.
const jwtConfig = {
  algorithm: 'RS256',
  privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH),
  publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH),
  expiresIn: '1h'                  // Short-lived tokens
};
// If you use one shared secret instead, set algorithm to 'HS256' and
// read the secret from process.env.JWT_SECRET. Never pair a shared secret with RS256.
```

**Step 2: Add rate limiting**
Install the packages this workflow uses first, and check their versions on npmjs.com: `npm install express-rate-limit helmet zod`.
```typescript
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
```

**Step 3: Validate all inputs**
```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  age: z.number().int().positive().optional()
});

// Use in route handler
const data = CreateUserSchema.parse(req.body);
```

**Step 4: Load test with attack patterns**
```bash
# Only run these against a system you own or have written permission to test, and prefer a staging copy.
# Test rate limiting: look for 429 replies in the status counts
python scripts/api_load_tester.py https://staging.example.com/login \
  --concurrency 200 --duration 10

# Test input validation: look for 400 replies in the status counts
python scripts/api_load_tester.py https://staging.example.com/users \
  --method POST \
  --body '{"email": "not-an-email"}'
```

**Step 5: Review security headers**
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

---

## Reference Documentation

| File | Contains | Use When |
|------|----------|----------|
| `references/api_design_patterns.md` | REST vs GraphQL, versioning, error handling, pagination | Designing new APIs |
| `references/database_optimization_guide.md` | Indexing strategies, query optimization, N+1 solutions | Fixing slow queries |
| `references/backend_security_practices.md` | OWASP Top 10, auth patterns, input validation | Security hardening |

Included in this item: the `scripts/`, `references/` and `profiles/` folders. Not included: the `agents/` file, the `engineering/` sibling skills and the slash commands named in this file. Ignore any step that needs them.

---

## Common Patterns Quick Reference

### REST API Response Format
```json
{
  "data": { "id": 1, "name": "John" },
  "meta": { "requestId": "abc-123" }
}
```

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [{ "field": "email", "message": "must be valid email" }]
  },
  "meta": { "requestId": "abc-123" }
}
```

### HTTP Status Codes
| Code | Use Case |
|------|----------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Validation error |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

### Database Index Strategy
```sql
-- Single column (equality lookups)
CREATE INDEX idx_users_email ON users(email);

-- Composite (multi-column queries)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Partial (filtered queries)
CREATE INDEX idx_orders_active ON orders(created_at) WHERE status = 'active';

-- Covering (avoid table lookup)
CREATE INDEX idx_users_email_name ON users(email) INCLUDE (name);
```

---

## Common Commands

```bash
# API Development
python scripts/api_scaffolder.py openapi.yaml --framework express

# Database Operations
python scripts/database_migration_tool.py schema.sql --analyze
python scripts/database_migration_tool.py old.sql --compare new.sql --output migrations/

# Performance Testing
python scripts/api_load_tester.py https://api.example.com/endpoint --concurrency 50
python scripts/api_load_tester.py https://api.example.com/v1 https://api.example.com/v2 --compare
```

---

## Assumptions and Verifiable Success Criteria (Karpathy discipline)

> **Optional extra, and parts are not included.** The agents and slash commands this section and the next two name are not in this item. For a simple job, skip to the Quick start. Use these three sections only for a big decision such as tenancy or a new data store.

*Short version: before a new system, a data-store change or a tenancy decision, get the four answers below. For a quick route scaffold or a one-off query check, state your assumptions and carry on. The forcing-question and composition files are optional extras.*

Before this skill recommends a pattern or modifies a schema, the following four assumptions MUST be surfaced. If any are unknown for a new system, a data-store change or a tenancy decision, the skill stops and walks the [Forcing-question library](#forcing-question-library-matt-pocock-grill) instead. For a quick route scaffold or a one-off query check, do not stop: say which of the four you are assuming and carry on.

1. **Read/write ratio + one-year p99 QPS** — drives DB, cache, queue, and partitioning choices. Kleppmann, *DDIA* (2017).
2. **Tenancy model** — single-tenant, shared multi-tenant, isolated multi-tenant. Drives data-access pattern.
3. **Data sensitivity tier** — public / internal / PII / PHI / PCI. Drives compliance floor.
4. **SLO + named error-budget consumer** — Google SRE Workbook canon. No SLO = no reliability work prioritization.

**Verifiable success criteria** (Karpathy #4) — every recommendation this skill emits must include:

- Latency targets (p50, p95, p99 in ms)
- Uptime / SLO target
- RPO + RTO

If any of those three is not stated, the recommendation is incomplete — return to Q7 of the forcing-question library.

The `scripts/backend_decision_engine.py` tool encodes these checks: it refuses to recommend a profile without read/write ratio + QPS + tenancy + data sensitivity + pattern preference.

---

## Customization profiles

Four built-in profiles in `profiles/` calibrate every recommendation:

| Profile | When to pick | Pattern | Latency floor (p99) |
|---|---|---|---|
| `node-express` | TS team, < 15 eng, customer-facing SaaS | Modular monolith on Postgres | 600ms |
| `fastapi-python` | Python team, < 20 eng, ML-adjacent | Modular monolith on Postgres (async) | 500ms |
| `django-monolith` | Content-heavy CRUD + admin, < 25 eng | Modular monolith on Postgres | 800ms |
| `go-or-rust-microservice` | Extracted service, ≥ 30 eng, platform team, QPS ≥ 1000 | Extracted service | 200ms |

Pick a profile via:

```bash
python scripts/backend_decision_engine.py \
  --team-size 8 --qps-p99 50 --read-write-ratio 20 \
  --tenancy shared-multi-tenant --data-sensitivity pii \
  --pattern modular-monolith --language-preference typescript
```

The tool returns the best-fit profile, runner-up tradeoff (if within 15%), stack picks, anti-patterns, named approvers, and SLO floor. **This tool never auto-approves.**

To add a custom profile: copy `profiles/node-express.json` to `profiles/<your-org>.json` and adjust `constraints` + `success_thresholds` + `named_approver_chain`.

---

## Composition map

> **Not included in this item.** The sibling skills named below, the `cs-backend-engineer` agent and the `/cs:backend-review` command are not part of it. Skip any step that depends on them. Where a row names a concern, you can use the matching AI Blocks item instead, such as the API design reviewer or the CI/CD pipeline setup.

This skill does NOT reimplement scope owned by the POWERFUL-tier specialists. It forks into them. See `references/composition_map.md` for the full routing table. Key forks:

| Concern | Fork into |
|---|---|
| API contract / breaking-change risk | `engineering/skills/api-design-reviewer/` |
| Schema design + ERD + indexing | `engineering/skills/database-designer/` |
| Zero-downtime schema migration | `engineering/skills/migration-architect/` |
| SLO + SLI + error-budget | `engineering/slo-architect/` |
| Observability / golden signals | `engineering/skills/observability-designer/` |
| CI/CD pipeline | `engineering/skills/ci-cd-pipeline-builder/` |
| Security / threat model | `engineering-team/skills/senior-security/`, `adversarial-reviewer` |
| Compliance evidence (HIPAA / ISO 27001) | `ra-qm-team/` |
| Pre-commit Karpathy review | `engineering/karpathy-coder/` |
| Pre-flight architecture grill | `engineering/grill-me/` |

The `cs-backend-engineer` agent orchestrates these forks via `context: fork`. Invoke it from another agent with `Agent({subagent_type: "cs-backend-engineer", prompt: "..."})` or via `/cs:backend-review <your problem>`.

---

## Forcing-question library (Matt Pocock grill)

Before locking a major backend decision (tenancy, data store, monolith or microservices), walk the seven forcing questions in `references/forcing_questions.md`. For a quick route scaffold or a one-off query check, you can skip them. Discipline:

1. One question per turn. No bundling.
2. Always recommend the answer with cited canon.
3. Track answers in `/tmp/backend-grill-<date>.md`.
4. If a kill criterion trips, stop. Don't scaffold around an unresolved gap.
5. After Q7, run `backend_decision_engine.py` with the seven answers.

Summary:

1. Read/write ratio + p99 QPS forecast?
2. Tenancy model — single / shared / isolated?
3. Sync / async / event-driven — default + exceptions?
4. Data sensitivity tier — PII / PHI / PCI?
5. Monolith / modular monolith / microservices — team-size justification?
6. RPO + RTO?
7. SLO + named error-budget consumer?

---

## Invocation from other agents and skills

> **Only the third surface works here.** The slash command and the agent are not included in this item.

Three surfaces:

1. **Slash command:** `/cs:backend-review <prompt>` — full grill + decision engine + composition routing.
2. **Agent subagent:** `Agent({subagent_type: "cs-backend-engineer", prompt: "..."})` — forks context, returns ≤ 200-word digest.
3. **Direct tool call:** `python scripts/backend_decision_engine.py ...` — deterministic profile match when inputs are known.

See `agents/engineering/cs-backend-engineer.md` for the full invocation contract.
