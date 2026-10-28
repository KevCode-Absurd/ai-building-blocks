---
name: openapi-spec-generator
description: "Generate complete, production-ready OpenAPI 3.x and Swagger 2.0 specifications from natural language descriptions, code, or partial specs."
risk: critical
source: https://github.com/LambdaTest/agent-skills/tree/main/api-skill/openapi-spec-generator
source_repo: LambdaTest/agent-skills
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/LambdaTest/agent-skills/blob/main/LICENSE
---

> **AI Blocks note (licence):** this copy is shared under CC BY 4.0, as the LICENSE-CONTENT file in this folder says. The `license:` line in the front matter above is the original author's own label (MIT). The LICENSE-CONTENT file governs here. Keep the credit to the author. The `source:` line above is the author's original (LambdaTest). This copy comes from sickn33's collection: https://github.com/sickn33/agentic-awesome-skills/tree/main/skills/openapi-spec-generator

# OpenAPI / Swagger Specification Generator
<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **A test report** (yours): what was tested, what passed, what failed and why.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A test report** with the [API test suite builder](https://useaiblocks.com/skills/api-test-suite-builder). Bring a codebase, a code change (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase, a test report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

Use this skill when you need generate complete, production-ready OpenAPI 3.x and Swagger 2.0 specifications from natural language descriptions, code, or partial specs. Use this skill whenever the user mentions OpenAPI, Swagger, API spec, REST API documentation, YAML/JSON API schema, endpoint documentation, API...


Generate complete, valid OpenAPI 3.x or Swagger 2.0 specifications from descriptions, code, or partial specs.

## Workflow

### Step 1 — Gather Context

Before writing any YAML/JSON, ask (or infer from context) the following:

| Question | Why it matters |
|---|---|
| OpenAPI 3.x or Swagger 2.0? | Different `info`, `servers`/`host`, `components`/`definitions` structure |
| Output format: YAML or JSON? | YAML default unless user specifies JSON |
| What does this API do? | Sets `info.title`, `info.description`, tags |
| List of endpoints (or code to extract from)? | Core paths object |
| Authentication type(s)? | `securitySchemes` — see reference |
| Common data models or entities? | `components/schemas` / `definitions` |
| Any existing partial spec to extend? | Merge rather than overwrite |

If the user provides code (Express routes, FastAPI, Django URLs, Spring controllers, etc.), **extract endpoints automatically** — do not ask what the user already told you. If the user has an API design plan, take the endpoints, models and errors from it instead of asking again.

### Step 2 — Build the Spec

Follow the structure guide for the chosen version. Always produce a **complete, valid spec** — never leave placeholder comments like `# TODO: add schema`. Replace every `<...>` in the skeletons below with the user's answers. If the user gave no value for something you cannot know, such as a contact email or server URL, use a clearly marked example value and list it under a short "Fill in before publishing" note. Never invent real-looking details.

#### OpenAPI 3.x Skeleton

```yaml
openapi: "3.1.0"
info:
  title: <API Title>
  version: "1.0.0"
  description: <Short description>
  contact:
    name: <Team or Author>
    email: <contact@example.com>
servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging
tags:
  - name: <Tag>
    description: <Tag description>
paths:
  /resource:
    get:
      summary: List resources
      operationId: listResources
      tags: [<Tag>]
      parameters: []
      responses:
        "200":
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ResourceList"
              example:
                items: []
                total: 0
        "401":
          $ref: "#/components/responses/Unauthorized"
        "500":
          $ref: "#/components/responses/InternalError"
      security:
        - BearerAuth: []
components:
  schemas: {}
  responses:
    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    InternalError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
  securitySchemes: {}
```

#### Swagger 2.0 Skeleton

```yaml
swagger: "2.0"
info:
  title: <API Title>
  version: "1.0.0"
  description: <Short description>
host: api.example.com
basePath: /v1
schemes: [https]
consumes: [application/json]
produces: [application/json]
tags: []
paths: {}
definitions: {}
securityDefinitions: {}
```

### Step 3 — Schemas and Models

- **Always use `$ref`** for any schema used in more than one place.
- Include `example` or `examples` on every schema and response body.
- Mark required fields with the `required` array.
- Use `nullable: true` (OAS 3.0) or `x-nullable: true` (Swagger 2.0) for optional nullable fields.
- Prefer `format` keywords: `int32`, `int64`, `float`, `date`, `date-time`, `uuid`, `email`, `uri`, `byte`, `binary`.

**Common schema patterns:**

```yaml
# Pagination wrapper
PagedResult:
  type: object
  required: [items, total, page, pageSize]
  properties:
    items:
      type: array
      items:
        $ref: "#/components/schemas/Resource"
    total:
      type: integer
      format: int64
      example: 100
    page:
      type: integer
      format: int32
      example: 1
    pageSize:
      type: integer
      format: int32
      example: 20

# Standard error
Error:
  type: object
  required: [code, message]
  properties:
    code:
      type: string
      example: RESOURCE_NOT_FOUND
    message:
      type: string
      example: The requested resource was not found.
    details:
      type: object
      additionalProperties: true

# Timestamps mixin (use allOf)
Timestamps:
  type: object
  properties:
    createdAt:
      type: string
      format: date-time
    updatedAt:
      type: string
      format: date-time
```

### Step 4 — Security Schemes

Read `reference/security-schemes.md` for detailed patterns. Quick reference:

| Scheme | OAS 3.x type | Notes |
|---|---|---|
| Bearer JWT | `http`, scheme `bearer` | Most common for REST APIs |
| API Key (header) | `apiKey`, in `header` | e.g. `X-API-Key` |
| API Key (query) | `apiKey`, in `query` | Avoid — leaks in logs |
| OAuth 2 | `oauth2` | Use `flows` to define grant types |
| Basic Auth | `http`, scheme `basic` | Only over HTTPS |
| OpenID Connect | `openIdConnect` | Provide `openIdConnectUrl` |

Apply security **globally** at the root and **override per-operation** only where it differs (e.g., public endpoints use `security: []`).

### Step 5 — Parameters

**Path parameters** — always `required: true`:
```yaml
parameters:
  - name: userId
    in: path
    required: true
    schema:
      type: string
      format: uuid
    example: 123e4567-e89b-12d3-a456-426614174000
```

**Query parameters** — document defaults and enums:
```yaml
  - name: status
    in: query
    schema:
      type: string
      enum: [active, inactive, pending]
      default: active
```

**Headers** — include `X-Request-ID`, correlation IDs, etc. as common parameters defined under `components/parameters`.

### Step 6 — Response Codes

Always include at minimum:

| Code | When |
|---|---|
| `200` | Successful GET, PUT, PATCH |
| `201` | Successful POST that creates a resource |
| `204` | Successful DELETE (no body) |
| `400` | Validation / bad request |
| `401` | Missing or invalid auth |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Conflict (duplicate, state mismatch) |
| `422` | Unprocessable entity (semantic errors) |
| `429` | Rate limited |
| `500` | Internal server error |

Use `$ref` to `components/responses` for `401`, `403`, `404`, `429`, `500` to avoid repetition.

### Step 7 — Quality Checklist

Before delivering the spec, verify:

- [ ] `openapi` or `swagger` version field present
- [ ] Every path has at least one operation
- [ ] Every operation has `operationId` (camelCase, unique)
- [ ] Every operation has at least one `200`/`201`/`204` response
- [ ] `4xx` and `5xx` responses defined for all operations
- [ ] All `$ref` targets exist in `components/` or `definitions/`
- [ ] Required fields listed in `required` array for all request/response bodies
- [ ] Security schemes defined AND applied
- [ ] At least one `example` per schema or response body
- [ ] Tags defined at root level to match operation tags
- [ ] No orphaned schemas (everything in `components/schemas` is referenced)

### Step 8 — Output

1. Emit the complete YAML (or JSON) spec in a code block labeled `yaml` or `json`.
2. After the spec, provide a brief **summary table** of endpoints generated.
3. Offer to:
   - Export as `.yaml` / `.json` file
   - Validate against Spectral or swagger-parser
   - Generate mock server config (Prism)
   - Generate client SDK stubs (language of choice)

---

## Extracting from Code

When the user provides source code, extract:

**Express / Koa / Fastify (Node.js)**
- Look for `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()` calls
- Route params `:param` → path parameter `{param}`
- Middleware like `authenticate` → note security requirement
- `req.body`, `req.query`, `req.params` usage → infer request schema

**FastAPI / Flask (Python)**
- Decorators: `@app.get()`, `@router.post()`, etc.
- Pydantic models → translate directly to JSON Schema
- `Query()`, `Path()`, `Body()` → map to parameter location

**Spring Boot (Java)**
- `@GetMapping`, `@PostMapping`, etc.
- `@PathVariable`, `@RequestParam`, `@RequestBody`
- DTO classes → schemas

**Django REST Framework**
- `ViewSet` and `Router` → CRUD endpoints
- `Serializer` fields → schema properties

**Rails**
- `routes.rb` resource routes → standard REST endpoints
- Strong params → request body schema

---

## Reference Files

- `reference/security-schemes.md` — Detailed security scheme examples for all auth types
- `reference/common-patterns.md` — Pagination, HATEOAS, problem+json, webhooks, file upload patterns

Read these when the user asks about a specific pattern or when generating complex auth/pagination setups.


---

## After Completing the OpenAPI/Swagger Specification design

Once the OpenAPI/Swagger Specification output is delivered, ask the user:

"Would you like me to generate API test cases for this design? (yes/no)"

If the user says **yes**:
- Check if the API Test Case Generator skill is available in the installed skills list
- If the skill **is available**:
  - Read and follow the instructions in the API Test Case Generator skill
  - Use the specification output above as the input
- If the skill **is NOT available**:
  - Inform the user: "It looks like the API Test Case Generator skill isn't installed.
    You can install it and re-run." Then stop. (That skill is not part of this item. The API test suite builder item on AI Blocks writes tests too.)

If the user says **no**:
- End the task here

---

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [API test suite builder](https://useaiblocks.com/skills/api-test-suite-builder).
- The [API contract tester](https://useaiblocks.com/skills/api-contract-tester). It takes the API spec.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
