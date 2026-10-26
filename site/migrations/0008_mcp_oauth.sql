-- Read-only OAuth delegation. Opaque authorization/access/refresh values are stored only as SHA-256 hashes.
CREATE TABLE IF NOT EXISTS mcp_oauth_clients (
  client_id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  redirect_uris TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS mcp_oauth_codes (
  code_hash TEXT PRIMARY KEY,
  contents TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS mcp_oauth_codes_expiry ON mcp_oauth_codes(expires_at);
CREATE TABLE IF NOT EXISTS mcp_oauth_grants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
  resource TEXT NOT NULL,
  scope TEXT NOT NULL CHECK(scope IN ('company:read','saved:read')),
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS mcp_oauth_grants_user ON mcp_oauth_grants(user_id);
CREATE TABLE IF NOT EXISTS mcp_oauth_tokens (
  token_hash TEXT PRIMARY KEY,
  grant_id TEXT NOT NULL REFERENCES mcp_oauth_grants(id),
  client_id TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
  kind TEXT NOT NULL CHECK(kind IN ('access','refresh')),
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  rotation_target TEXT
);
CREATE INDEX IF NOT EXISTS mcp_oauth_tokens_expiry ON mcp_oauth_tokens(expires_at);
CREATE INDEX IF NOT EXISTS mcp_oauth_tokens_grant ON mcp_oauth_tokens(grant_id);
