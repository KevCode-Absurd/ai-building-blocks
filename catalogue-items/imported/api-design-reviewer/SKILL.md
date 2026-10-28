---
name: "api-design-reviewer"
description: "Comprehensive REST API design review with automated linting, breaking-change detection, and design scorecards. Catches inconsistent conventions, missing versioning, and design smells before APIs ship. Use when reviewing a PR that adds or changes API endpoints, auditing an existing API for v2 migration, or establishing API standards for a team."
---

# API Design Reviewer

**Tier:** POWERFUL  
**Category:** Engineering / Architecture  
**Maintainer:** Claude Skills Team  

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your API spec** (yours): the API's endpoints, data shapes, sign-in method and errors, such as an OpenAPI file.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your API spec, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

The API Design Reviewer skill provides comprehensive analysis and review of API designs, focusing on REST conventions, best practices, and industry standards. This skill helps engineering teams build consistent, maintainable, and well-designed APIs through automated linting, breaking change detection, and design scorecards.

## Quick Start — run the tools first

```bash
# 1. Lint an OpenAPI/Swagger spec for convention violations
python3 scripts/api_linter.py openapi.json --format json -o lint.json

# 2. Detect breaking changes between two spec versions (gate: exits non-zero with --exit-on-breaking)
python3 scripts/breaking_change_detector.py openapi-v1.json openapi-v2.json --format json --exit-on-breaking -o breaking.json

# 3. Score overall design quality (gate: --min-grade fails below threshold)
python3 scripts/api_scorecard.py openapi.json --format json --min-grade B -o scorecard.json
```

Review flow: run all three, report linter findings + breaking changes + grade to the user, fix, then re-run until the linter is clean, `--exit-on-breaking` passes (or breaking changes are version-bumped), and the scorecard meets the agreed `--min-grade`. Never sign off an API review on prose alone — attach the tool outputs.

## Core Capabilities

### 1. API Linting and Convention Analysis
- **Resource Naming Conventions**: Enforces kebab-case for resources, camelCase for fields
- **HTTP Method Usage**: Validates proper use of GET, POST, PUT, PATCH, DELETE
- **URL Structure**: Analyzes endpoint patterns for consistency and RESTful design
- **Status Code Compliance**: Ensures appropriate HTTP status codes are used
- **Error Response Formats**: Validates consistent error response structures
- **Documentation Coverage**: Checks for missing descriptions and documentation gaps

### 2. Breaking Change Detection
- **Endpoint Removal**: Detects removed or deprecated endpoints
- **Response Shape Changes**: Identifies modifications to response structures
- **Field Removal**: Tracks removed or renamed fields in API responses
- **Type Changes**: Catches field type modifications that could break clients
- **Required Field Additions**: Flags new required fields that could break existing integrations
- **Status Code Changes**: Detects changes to expected status codes

### 3. API Design Scoring and Assessment
- **Consistency Analysis** (30%): Evaluates naming conventions, response patterns, and structural consistency
- **Documentation Quality** (20%): Assesses completeness and clarity of API documentation
- **Security Implementation** (20%): Reviews authentication, authorization, and security headers
- **Usability Design** (15%): Analyzes ease of use, discoverability, and developer experience
- **Performance Patterns** (15%): Evaluates caching, pagination, and efficiency patterns

> **Background reference.** The three scripts in the Quick Start are this skill's checks. Everything from here to "Tools and Scripts" is general REST guidance (naming, versioning, paging, errors, rate limits, caching). Use it to explain findings, not as extra steps.

## REST Design Principles

### Resource Naming Conventions
```
✅ Good Examples:
- /api/v1/users
- /api/v1/user-profiles
- /api/v1/orders/123/line-items

❌ Bad Examples:
- /api/v1/getUsers
- /api/v1/user_profiles
- /api/v1/orders/123/lineItems
```

### HTTP Method Usage
- **GET**: Retrieve resources (safe, idempotent)
- **POST**: Create new resources (not idempotent)
- **PUT**: Replace entire resources (idempotent)
- **PATCH**: Partial resource updates (not necessarily idempotent)
- **DELETE**: Remove resources (idempotent)

### URL Structure Best Practices
```
Collection Resources: /api/v1/users
Individual Resources: /api/v1/users/123
Nested Resources: /api/v1/users/123/orders
Actions: /api/v1/users/123/activate (POST)
Filtering: /api/v1/users?status=active&role=admin
```

## Versioning Strategies

### 1. URL Versioning (Recommended)
```
/api/v1/users
/api/v2/users
```
**Pros**: Clear, explicit, easy to route  
**Cons**: URL proliferation, caching complexity

### 2. Header Versioning
```
GET /api/users
Accept: application/vnd.api+json;version=1
```
**Pros**: Clean URLs, content negotiation  
**Cons**: Less visible, harder to test manually

### 3. Media Type Versioning
```
GET /api/users
Accept: application/vnd.myapi.v1+json
```
**Pros**: RESTful, supports multiple representations  
**Cons**: Complex, harder to implement

### 4. Query Parameter Versioning
```
/api/users?version=1
```
**Pros**: Simple to implement  
**Cons**: Not RESTful, can be ignored

## Pagination Patterns

### Offset-Based Pagination
```json
{
  "data": [...],
  "pagination": {
    "offset": 20,
    "limit": 10,
    "total": 150,
    "hasMore": true
  }
}
```

### Cursor-Based Pagination
```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTIzfQ==",
    "hasMore": true
  }
}
```

### Page-Based Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 3,
    "pageSize": 10,
    "totalPages": 15,
    "totalItems": 150
  }
}
```

## Error Response Formats

### Standard Error Structure
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid parameters",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email address is not valid"
      }
    ],
    "requestId": "req-123456",
    "timestamp": "2026-02-16T13:00:00Z"
  }
}
```

### HTTP Status Code Usage
- **400 Bad Request**: Invalid request syntax or parameters
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied (authenticated but not authorized)
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (duplicate, version mismatch)
- **422 Unprocessable Entity**: Valid syntax but semantic errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server error

## Authentication and Authorization Patterns

### Bearer Token Authentication
```
Authorization: Bearer <token>
```

### API Key Authentication
```
X-API-Key: <api-key>
Authorization: Api-Key <api-key>
```

### OAuth 2.0 Flow
```
Authorization: Bearer <oauth-access-token>
```

### Role-Based Access Control (RBAC)
```json
{
  "user": {
    "id": "123",
    "roles": ["admin", "editor"],
    "permissions": ["read:users", "write:orders"]
  }
}
```

## Rate Limiting Implementation

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Response on Limit Exceeded
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 3600
  }
}
```

## HATEOAS (Hypermedia as the Engine of Application State)

### Example Implementation
```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "_links": {
    "self": { "href": "/api/v1/users/123" },
    "orders": { "href": "/api/v1/users/123/orders" },
    "profile": { "href": "/api/v1/users/123/profile" },
    "deactivate": { 
      "href": "/api/v1/users/123/deactivate",
      "method": "POST"
    }
  }
}
```

## Idempotency

### Idempotent Methods
- **GET**: Always safe and idempotent
- **PUT**: Should be idempotent (replace entire resource)
- **DELETE**: Should be idempotent (same result)
- **PATCH**: May or may not be idempotent

### Idempotency Keys
```
POST /api/v1/payments
Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
```

## Backward Compatibility Guidelines

### Safe Changes (Non-Breaking)
- Adding optional fields to requests
- Adding fields to responses
- Adding new endpoints
- Making required fields optional
- Adding new enum values (with graceful handling)

### Breaking Changes (Require Version Bump)
- Removing fields from responses
- Making optional fields required
- Changing field types
- Removing endpoints
- Changing URL structures
- Modifying error response formats

## OpenAPI/Swagger Validation

### Required Components
- **API Information**: Title, description, version
- **Server Information**: Base URLs and descriptions
- **Path Definitions**: All endpoints with methods
- **Parameter Definitions**: Query, path, header parameters
- **Request/Response Schemas**: Complete data models
- **Security Definitions**: Authentication schemes
- **Error Responses**: Standard error formats

### Best Practices
- Use consistent naming conventions
- Provide detailed descriptions for all components
- Include examples for complex objects
- Define reusable components and schemas
- Validate against OpenAPI specification

## Performance Considerations

### Caching Strategies
```
Cache-Control: public, max-age=3600
ETag: "123456789"
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```

### Efficient Data Transfer
- Use appropriate HTTP methods
- Implement field selection (`?fields=id,name,email`)
- Support compression (gzip)
- Implement efficient pagination
- Use ETags for conditional requests

### Resource Optimization
- Avoid N+1 queries
- Implement batch operations
- Use async processing for heavy operations
- Support partial updates (PATCH)

## Security Best Practices

### Input Validation
- Validate all input parameters
- Sanitize user data
- Use parameterized queries
- Implement request size limits

### Authentication Security
- Use HTTPS everywhere
- Implement secure token storage
- Support token expiration and refresh
- Use strong authentication mechanisms

### Authorization Controls
- Implement principle of least privilege
- Use resource-based permissions
- Support fine-grained access control
- Audit access patterns

## Tools and Scripts

### api_linter.py
Analyzes API specifications for compliance with REST conventions and best practices.

**Features:**
- OpenAPI/Swagger spec validation
- Naming convention checks
- HTTP method usage validation
- Error format consistency
- Documentation completeness analysis

### breaking_change_detector.py
Compares API specification versions to identify breaking changes.

**Features:**
- Endpoint comparison
- Schema change detection
- Field removal/modification tracking
- Migration guide generation
- Impact severity assessment

### api_scorecard.py
Provides comprehensive scoring of API design quality.

**Features:**
- Multi-dimensional scoring
- Detailed improvement recommendations
- Letter grade assessment (A-F)
- Benchmark comparisons
- Progress tracking

## Integration Examples

### CI/CD Integration
```yaml
- name: "api-linting"
  run: python3 scripts/api_linter.py openapi.json

- name: "breaking-change-detection"
  run: python3 scripts/breaking_change_detector.py openapi-v1.json openapi-v2.json --exit-on-breaking

- name: "api-scorecard"
  run: python3 scripts/api_scorecard.py openapi.json --min-grade B
```

### Pre-commit Hooks
```bash
#!/bin/bash
python3 scripts/api_linter.py openapi.json
if [ $? -ne 0 ]; then
  echo "API linting failed. Please fix the issues before committing."
  exit 1
fi
```

## Best Practices Summary

1. **Consistency First**: Maintain consistent naming, response formats, and patterns
2. **Documentation**: Provide comprehensive, up-to-date API documentation
3. **Versioning**: Plan for evolution with clear versioning strategies
4. **Error Handling**: Implement consistent, informative error responses
5. **Security**: Build security into every layer of the API
6. **Performance**: Design for scale and efficiency from the start
7. **Backward Compatibility**: Minimize breaking changes and provide migration paths
8. **Testing**: Implement comprehensive testing including contract testing
9. **Monitoring**: Add observability for API usage and performance
10. **Developer Experience**: Prioritize ease of use and clear documentation

## Common Anti-Patterns to Avoid

1. **Verb-based URLs**: Use nouns for resources, not actions
2. **Inconsistent Response Formats**: Maintain standard response structures
3. **Over-nesting**: Avoid deeply nested resource hierarchies
4. **Ignoring HTTP Status Codes**: Use appropriate status codes for different scenarios
5. **Poor Error Messages**: Provide actionable, specific error information
6. **Missing Pagination**: Always paginate list endpoints
7. **No Versioning Strategy**: Plan for API evolution from day one
8. **Exposing Internal Structure**: Design APIs for external consumption, not internal convenience
9. **Missing Rate Limiting**: Protect your API from abuse and overload
10. **Inadequate Testing**: Test all aspects including error cases and edge conditions


Regular use of the linting, breaking change detection, and scoring tools ensures continuous improvement and helps maintain API quality throughout the development lifecycle.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change reviewer](https://useaiblocks.com/skills/code-change-reviewer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
