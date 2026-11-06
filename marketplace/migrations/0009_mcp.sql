-- MCP connections: OAuth 2.1 for buyers' own AI apps (Claude, ChatGPT and other MCP clients). Owner: mcp module.
-- Adapted from the library's site/migrations/0008_mcp_oauth.sql. Codes and tokens are stored only as SHA-256 hashes.
-- Times are ISO-8601 UTC strings, like the rest of the marketplace.

-- Apps registered through dynamic client registration (POST /oauth/register). Public clients only: PKCE, no secret.
CREATE TABLE mcp_clients (
  client_id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  redirect_uris TEXT NOT NULL CHECK (json_valid(redirect_uris)),
  created_at TEXT NOT NULL
);

-- A validated authorization request waiting on the consent page (/oauth/consent?request=<id>). Single use.
CREATE TABLE mcp_auth_requests (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES mcp_clients(client_id),
  redirect_uri TEXT NOT NULL,
  scope TEXT NOT NULL,
  state TEXT,
  code_challenge TEXT NOT NULL,
  resource TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX mcp_auth_requests_expiry ON mcp_auth_requests(expires_at);

-- Authorization codes (5 minutes, single use). grant_id is set when the code is exchanged, so a reused code revokes it.
CREATE TABLE mcp_codes (
  code_hash TEXT PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES mcp_clients(client_id),
  user_id TEXT NOT NULL REFERENCES users(id),
  redirect_uri TEXT NOT NULL,
  scope TEXT NOT NULL,
  code_challenge TEXT NOT NULL,
  resource TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  grant_id TEXT
);
CREATE INDEX mcp_codes_expiry ON mcp_codes(expires_at);

-- One grant per connected app. Revoking it stops every token issued under it.
CREATE TABLE mcp_grants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  client_id TEXT NOT NULL REFERENCES mcp_clients(client_id),
  scope TEXT NOT NULL CHECK (scope IN ('marketplace:read', 'marketplace:read marketplace:order')),
  resource TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  revoked_at TEXT
);
CREATE INDEX mcp_grants_user ON mcp_grants(user_id, revoked_at);

-- Access (1 hour) and refresh (30 days) tokens. A refresh token is consumed when rotated; replaced_by is its successor.
CREATE TABLE mcp_tokens (
  token_hash TEXT PRIMARY KEY,
  grant_id TEXT NOT NULL REFERENCES mcp_grants(id),
  client_id TEXT NOT NULL REFERENCES mcp_clients(client_id),
  kind TEXT NOT NULL CHECK (kind IN ('access', 'refresh')),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  replaced_by TEXT
);
CREATE INDEX mcp_tokens_grant ON mcp_tokens(grant_id, kind);
CREATE INDEX mcp_tokens_expiry ON mcp_tokens(expires_at);
