---
name: mcp-server-security
description: Secure Model Context Protocol (MCP) servers with transport encryption,
  tool authorization, input validation, and audit logging for safe AI agent integrations.
category: security
risk: safe
source: https://github.com/BagelHole/DevOps-Security-Agent-Skills
source_repo: BagelHole/DevOps-Security-Agent-Skills
source_type: community
date_added: '2026-09-20'
license: MIT
license_source: https://github.com/BagelHole/DevOps-Security-Agent-Skills/blob/main/LICENSE
compatibility: Requires the relevant security tooling (scanners, vault CLIs) and an
  authorized scope for any active assessment. Docs-only; helper scripts and templates
  not bundled.
metadata:
  author: devops-skills
  version: '1.0'
---

# MCP Server Security

Comprehensive hardening guide for Model Context Protocol (MCP) servers. MCP is the open
standard for connecting AI agents to external tools, data sources, and services. Because
MCP servers execute real actions on real infrastructure, they are a high-value attack
surface. This skill covers every layer of defense you need before exposing an MCP server
to agents in production.

---

## Before you start

Gather these. If one is missing, write MISSING next to it in your report and give advice that holds either way. Never invent a detail about the user's server.

1. How the server connects: local stdio, or Streamable HTTP or SSE over a network.
2. How users and agents sign in today: none, a shared key, per-user keys or OAuth.
3. The tool list, with what each tool can touch (files, database, outside web, shell).
4. Server config or code (optional) and where it runs (optional).

Work through sections 2 to 11 in order. Rank each finding critical, high, medium or low. Sample code in this skill is a starting point to adapt and test in a non-production copy, not a drop-in fix. This skill cannot test a live server. List what it could not check.

## Report format

End with these sections, in this order:

1. Threats that apply: the threats from section 2 that fit this setup, one line each.
2. Fixes, highest risk first. Each has a priority, a layer (connection, sign-in, access, input, limits, logging, deployment), the finding, and the fix with the section to adapt.
3. Tool access plan: per role, the tools allowed, denied and needing approval.
4. Not checked: anything it could not judge from the details given.

Suggest next: run the checklist in section 11 against a test copy, then send the fix list to whoever owns the server.

---

## 2. MCP Threat Model

Before hardening, understand what you are defending against.

| Threat                        | Vector                                                        | Impact                              |
|-------------------------------|---------------------------------------------------------------|-------------------------------------|
| Unauthorized tool access      | Agent calls tools the user should not have access to          | Privilege escalation, data breach   |
| Prompt injection via resources| Malicious content in MCP resources influences agent behavior  | Arbitrary tool execution            |
| Data exfiltration via results | Tool results leak sensitive data back to an untrusted agent   | Data loss, compliance violation     |
| SSRF via MCP tools            | Agent tricks a tool into making internal network requests      | Internal service compromise         |
| Credential theft              | API keys or tokens stored insecurely on the MCP server        | Full account takeover               |
| Denial of service             | Agent floods server with tool calls or huge payloads          | Service unavailability              |
| Man-in-the-middle             | Unencrypted transport between agent and MCP server            | Eavesdropping, request tampering    |
| Supply chain compromise       | Malicious MCP server package or plugin                        | Arbitrary code execution            |

---

## 3. Transport Security

### 3.1 TLS for Streamable HTTP and SSE Transports

Every MCP server exposed over HTTP must terminate TLS. Never run plain HTTP in
production.

**Nginx reverse proxy with TLS termination for an MCP server:**

```nginx
# /etc/nginx/sites-enabled/mcp-server.conf
server {
    listen 443 ssl http2;
    server_name mcp.internal.example.com;

    ssl_certificate     /etc/ssl/certs/mcp-server.crt;
    ssl_certificate_key /etc/ssl/private/mcp-server.key;
    ssl_protocols       TLSv1.3;
    ssl_ciphers         TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # HSTS header
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;

        # SSE-specific: disable buffering so events stream immediately
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
    }
}
```

### 3.2 mTLS Between Agent and Server

For high-security environments, require the agent (client) to present a certificate.

```nginx
# Add to the server block above
ssl_client_certificate /etc/ssl/certs/agent-ca.crt;
ssl_verify_client on;
ssl_verify_depth 2;
```

**Generate a client certificate for an agent:**

```bash
# Create CA (one-time)
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 \
  -days 365 -noenc -keyout ca-key.pem -out ca-cert.pem \
  -subj "/CN=MCP Agent CA"

# Create agent client cert signed by the CA
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 \
  -noenc -keyout agent-key.pem -out agent-csr.pem \
  -subj "/CN=agent-orchestrator-01"

openssl x509 -req -in agent-csr.pem -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out agent-cert.pem -days 90
```

### 3.3 Securing stdio Transport

For local stdio-based servers, the attack surface is the process boundary itself:

Use an already reviewed, version-pinned local server entrypoint and a separately enforced sandbox. Do not launch a moving `npx -y` package or describe Node flags as a complete host-permission boundary. The server needs runtime/module access in addition to its data root; network, process creation, links and writes need explicit platform controls. A configuration example is not permission to create or replace a user's host entry.

```json
{
  "mcpServers": {
    "reviewed-filesystem": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/reviewed-server/index.js", "/absolute/path/to/approved-data"]
    }
  }
}
```

Replace every path with an existing reviewed runtime, bind its content/version, and test actual denied reads/writes/egress in isolation before enabling it.

---

## 4. Authentication and Authorization

### 4.1 OAuth 2.1 Integration

MCP's Streamable HTTP transport supports OAuth 2.1 for client authentication. Configure
your server to validate bearer tokens on every request.

```typescript
// src/auth.ts - OAuth 2.1 token validation middleware for an MCP server
import express from "express";
import jwt from "jsonwebtoken";

// Middleware only: supply a verified issuer/key/resource binding, revocation policy,
// MCP transport/session wiring and authorization before exposing any endpoint.
const app = express();

// OAuth 2.1 token validation middleware
function validateBearerToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing_token" });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.OAUTH_PUBLIC_KEY!, {
      algorithms: ["RS256"],
      issuer: "https://auth.example.com",
      audience: "mcp-server",
    });
    if (typeof payload !== "object" || typeof payload.sub !== "string" || !payload.sub ||
        typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || !Number.isInteger(payload.exp)) {
      return res.status(403).json({ error: "invalid_token" });
    }
    // Attach scopes for downstream authorization
    (req as any).tokenScopes = typeof payload.scope === "string" ? payload.scope.split(" ") : [];
    (req as any).userId = (payload as any).sub;
    next();
  } catch {
    return res.status(403).json({ error: "invalid_token" });
  }
}

app.use("/mcp", validateBearerToken);
```

Require expiry and a nonempty subject in addition to the verified signature, issuer and resource audience. Session IDs are not authentication. Derive roles/scopes from verified server policy, never caller-supplied role names; wildcard admin examples do not grant blanket execution permission. Validate key revocation/rotation and per-tool resource authorization separately.

### 4.2 API Key Management

For simpler deployments, use hashed API keys stored server-side:

```typescript
// src/apikeys.ts
import { createHash, timingSafeEqual } from "crypto";

interface ApiKeyRecord {
  hashedKey: string;
  userId: string;
  allowedTools: string[];
  rateLimit: number;        // requests per minute
  expiresAt: Date;
}

// Store hashed keys, never plaintext
const apiKeyStore: Map<string, ApiKeyRecord> = new Map();

export function registerApiKey(plainKey: string, record: Omit<ApiKeyRecord, "hashedKey">) {
  const hashed = createHash("sha256").update(plainKey).digest("hex");
  apiKeyStore.set(hashed, { ...record, hashedKey: hashed });
}

export function validateApiKey(plainKey: string): ApiKeyRecord | null {
  const hashed = createHash("sha256").update(plainKey).digest("hex");
  const record = apiKeyStore.get(hashed);
  if (!record) return null;
  if (new Date() > record.expiresAt) {
    apiKeyStore.delete(hashed);
    return null;
  }
  return record;
}
```

---

## 5. Tool Authorization

### 5.1 Allowlist Patterns

Never expose every tool to every user. Define an explicit allowlist:

```yaml
# config/tool-policy.yaml
policies:
  - role: developer
    allowed_tools:
      - "read_file"
      - "search_code"
      - "run_tests"
    denied_tools:
      - "execute_command"
      - "write_file"
      - "delete_file"

  - role: admin
    allowed_tools: ["*"]
    denied_tools: []

  - role: readonly-agent
    allowed_tools:
      - "read_file"
      - "list_directory"
      - "query_database"   # allow the tool, then check for SELECT-only inside the handler
    denied_tools: ["*"]

dangerous_tools:
  - name: "execute_command"
    risk: critical
    requires_approval: true
    max_executions_per_session: 5
  - name: "write_file"
    risk: high
    requires_approval: true
  - name: "query_database"
    risk: medium
    allowed_operations: ["SELECT"]
```

### 5.2 Per-User Tool Access Enforcement

> Note (added by AI Blocks): the code below checks `allowed_tools` and `denied_tools`, and then the `dangerous_tools` rules (`requires_approval`, `max_executions_per_session` and `allowed_operations`). It is a sketch to adapt, not tested code. `context.approved` and the `operation` argument are placeholders for your own approval step and your own tool arguments. Test it on a copy of your server before it goes live. Sections 6 to 11 and the quick checklist are in `references/details.md` (in this item's references folder: paste or upload it with this file).

```typescript
// src/toolAuth.ts
import { readFileSync } from "fs";
import { parse } from "yaml";

interface ToolPolicy {
  role: string;
  allowed_tools: string[];
  denied_tools: string[];
}

const config = parse(readFileSync("config/tool-policy.yaml", "utf-8"));
const policies: ToolPolicy[] = config.policies;

export function isToolAllowed(userRole: string, toolName: string): boolean {
  const policy = policies.find((p) => p.role === userRole);
  if (!policy) return false;

  // Explicit deny takes precedence
  if (policy.denied_tools.includes(toolName)) return false;
  if (policy.denied_tools.includes("*") && !policy.allowed_tools.includes(toolName)) return false;

  // Check allow
  if (policy.allowed_tools.includes("*")) return true;
  if (policy.allowed_tools.includes(toolName)) return true;

  return false;
}

// Checks for the dangerous_tools list in tool-policy.yaml
interface DangerousTool {
  name: string;
  risk: string;
  requires_approval?: boolean;
  max_executions_per_session?: number;
  allowed_operations?: string[];
}
const dangerous: DangerousTool[] = config.dangerous_tools ?? [];
const runCounts = new Map<string, number>(); // key: session id + tool name

// Returns a reason to refuse, or null if the call may go ahead.
export function checkDangerousTool(
  sessionId: string,
  toolName: string,
  approved: boolean,
  operation?: string
): string | null {
  const rule = dangerous.find((d) => d.name === toolName);
  if (!rule) return null;
  if (rule.requires_approval && !approved) return "needs human approval first";
  if (rule.max_executions_per_session !== undefined) {
    const key = sessionId + ":" + toolName;
    const count = (runCounts.get(key) ?? 0) + 1;
    if (count > rule.max_executions_per_session) return "session limit reached";
    runCounts.set(key, count);
  }
  if (rule.allowed_operations && !rule.allowed_operations.includes((operation ?? "").toUpperCase())) {
    return "operation not allowed";
  }
  return null;
}

// MCP server integration: wrap the tool handler
export function authorizedToolHandler(server: any) {
  const originalCallTool = server.callTool.bind(server);

  server.callTool = async (request: any, context: any) => {
    const userRole = context.session?.userRole || "readonly-agent";
    const toolName = request.params.name;

    if (!isToolAllowed(userRole, toolName)) {
      return {
        content: [{ type: "text", text: `Access denied: tool "${toolName}" is not permitted for role "${userRole}".` }],
        isError: true,
      };
    }
    const problem = checkDangerousTool(
      context.session?.id ?? "unknown",
      toolName,
      context.approved === true,
      request.params.arguments?.operation
    );
    if (problem) {
      return {
        content: [{ type: "text", text: `Blocked: tool "${toolName}" ${problem}.` }],
        isError: true,
      };
    }
    return originalCallTool(request, context);
  };
}
```

---


## Contents

- [6. Input Validation](references/details.md)
- [7. Resource Access Control](references/details.md)
- [8. Rate Limiting](references/details.md)
- [9. Audit Logging](references/details.md)
- [10. Deployment Hardening](references/details.md)
- [11. Testing](references/details.md)
- [Quick Reference Checklist](references/details.md)

## When to Use This Skill

Apply this skill whenever you are:

- Deploying an MCP server that exposes tools (filesystem, database, API) to AI agents.
- Connecting an agent runtime (Claude Desktop, Cursor, a custom orchestrator) to one or
  more MCP servers over stdio, SSE, or Streamable HTTP transport.
- Building a multi-tenant platform where multiple users share the same MCP server.
- Passing sensitive data (PII, credentials, internal documents) through MCP resources.
- Operating in a regulated environment (SOC 2, HIPAA, PCI-DSS) where tool invocations
  must be auditable.

If your MCP server only runs locally over stdio for a single developer with no network
exposure, you can relax some transport-layer controls -- but input validation and audit
logging still apply.

---

## Limitations

- Apply guidance only within authorized scope; test destructive steps in non-production first.
- Docs-only import: upstream scripts and templates not bundled.

### Example

```bash
# Read-only first: inventory before any active step.
which <tool> && <tool> --help | head -n 20
```

Licence note: the original skill by BagelHole is MIT licensed. It reaches us through sickn33's collection, which is CC BY 4.0, so both credits are kept. See LICENSE-CONTENT.

> Adapted from [BagelHole/DevOps-Security-Agent-Skills](https://github.com/BagelHole/DevOps-Security-Agent-Skills) (MIT); frontmatter, When to Use/Limitations, and safety boundaries added for upstream compliance. Docs-only import: helper scripts and templates not bundled.
