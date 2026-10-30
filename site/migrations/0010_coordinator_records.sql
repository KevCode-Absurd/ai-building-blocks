-- Non-content tombstones prevent delayed retries or racing shares from restoring purged data.
CREATE TABLE IF NOT EXISTS coordinator_deleted_records(scope TEXT NOT NULL,record_id TEXT NOT NULL,PRIMARY KEY(scope,record_id));
CREATE TABLE IF NOT EXISTS coordinator_deleted_requests(scope TEXT NOT NULL,request_key TEXT NOT NULL,request_digest TEXT NOT NULL,PRIMARY KEY(scope,request_key));
-- Private versioned workflow and memory records; separate from the 4 MB browser-library blob.
CREATE TABLE IF NOT EXISTS coordinator_versions (
 scope TEXT NOT NULL,
 record_id TEXT NOT NULL,
 version INTEGER NOT NULL CHECK(version > 0),
 business_id TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('workflow','memory','outcome','run')),
 title TEXT NOT NULL,
 digest TEXT NOT NULL,
 contents TEXT NOT NULL,
 request_key TEXT NOT NULL,
 request_digest TEXT NOT NULL,
 created TEXT NOT NULL,
 PRIMARY KEY(scope,record_id,version),
 UNIQUE(scope,request_key)
);
CREATE INDEX IF NOT EXISTS coordinator_scope_records ON coordinator_versions(scope,business_id,kind,record_id,version DESC);
CREATE TABLE IF NOT EXISTS coordinator_supersessions (
 scope TEXT NOT NULL,record_id TEXT NOT NULL,superseded_id TEXT NOT NULL,PRIMARY KEY(scope,record_id,superseded_id)
);
CREATE TRIGGER IF NOT EXISTS coordinator_keep_supersession AFTER INSERT ON coordinator_versions WHEN NEW.kind='memory' AND json_type(NEW.contents,'$.supersedes')='text' BEGIN
 INSERT OR IGNORE INTO coordinator_supersessions(scope,record_id,superseded_id) VALUES(NEW.scope,NEW.record_id,json_extract(NEW.contents,'$.supersedes'));
END;
CREATE TRIGGER IF NOT EXISTS coordinator_keep_deletion BEFORE DELETE ON coordinator_versions BEGIN
 SELECT CASE WHEN EXISTS(SELECT 1 FROM coordinator_versions WHERE scope=OLD.scope AND ((kind='outcome' AND json_extract(contents,'$.decision_id')=OLD.record_id) OR (kind='run' AND json_extract(contents,'$.workflow_id')=OLD.record_id))) THEN RAISE(ABORT,'coordinator_record_in_use') END;
 INSERT OR IGNORE INTO coordinator_deleted_records(scope,record_id) VALUES(OLD.scope,OLD.record_id);
 INSERT OR IGNORE INTO coordinator_deleted_requests(scope,request_key,request_digest) VALUES(OLD.scope,OLD.request_key,OLD.request_digest);
END;
CREATE TRIGGER IF NOT EXISTS coordinator_version_order BEFORE INSERT ON coordinator_versions BEGIN
 SELECT CASE WHEN NEW.kind='run' AND json_extract(NEW.contents,'$.workflow_id') IS NOT NULL AND NOT EXISTS(SELECT 1 FROM coordinator_versions d WHERE d.scope=NEW.scope AND d.business_id=NEW.business_id AND d.record_id=json_extract(NEW.contents,'$.workflow_id') AND d.version=json_extract(NEW.contents,'$.workflow_version') AND d.kind='workflow' AND json_extract(d.contents,'$.plan')=json_extract(NEW.contents,'$.plan')) THEN RAISE(ABORT,'coordinator_workflow_unavailable') END;
 SELECT CASE WHEN NEW.kind='outcome' AND NOT EXISTS(SELECT 1 FROM coordinator_versions d WHERE d.scope=NEW.scope AND d.business_id=NEW.business_id AND d.record_id=json_extract(NEW.contents,'$.decision_id') AND d.version=json_extract(NEW.contents,'$.decision_version') AND d.kind='memory' AND json_extract(d.contents,'$.kind')='decision') THEN RAISE(ABORT,'coordinator_decision_unavailable') END;
 SELECT CASE WHEN EXISTS(SELECT 1 FROM coordinator_deleted_records WHERE scope=NEW.scope AND record_id=NEW.record_id) OR EXISTS(SELECT 1 FROM coordinator_deleted_requests WHERE scope=NEW.scope AND request_key=NEW.request_key) THEN RAISE(ABORT,'coordinator_deleted_record') END;
 SELECT CASE WHEN NEW.version != COALESCE((SELECT MAX(version) FROM coordinator_versions WHERE scope=NEW.scope AND record_id=NEW.record_id),0)+1 THEN RAISE(ABORT,'coordinator_revision_conflict') END;
 SELECT CASE WHEN EXISTS(SELECT 1 FROM coordinator_versions WHERE scope=NEW.scope AND record_id=NEW.record_id AND (business_id!=NEW.business_id OR kind!=NEW.kind)) THEN RAISE(ABORT,'coordinator_scope_conflict') END;
 SELECT CASE WHEN NEW.version>100 OR (SELECT COALESCE(SUM(length(CAST(contents AS BLOB))),0) FROM coordinator_versions WHERE scope=NEW.scope)+length(CAST(NEW.contents AS BLOB))>20000000 THEN RAISE(ABORT,'coordinator_storage_limit') END;
 SELECT CASE WHEN NEW.version=1 AND (SELECT COUNT(DISTINCT record_id) FROM coordinator_versions WHERE scope=NEW.scope)>=500 THEN RAISE(ABORT,'coordinator_storage_limit') END;
END;
CREATE TABLE IF NOT EXISTS coordinator_shares (
 id TEXT PRIMARY KEY,
 scope TEXT NOT NULL,
 record_id TEXT NOT NULL,
 version INTEGER NOT NULL,
 token_hash TEXT NOT NULL UNIQUE,
 public_contents TEXT NOT NULL,
 created TEXT NOT NULL,
 revoked INTEGER NOT NULL DEFAULT 0 CHECK(revoked IN (0,1))
);
CREATE INDEX IF NOT EXISTS coordinator_owned_shares ON coordinator_shares(scope,record_id);

-- Preserve all existing read grants/tokens while allowing separately consented write grants.
-- Rebuild child and parent together rather than disabling foreign-key checks.
CREATE TABLE mcp_oauth_grants_v2 (
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,client_id TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
 resource TEXT NOT NULL,scope TEXT NOT NULL CHECK(scope IN ('company:read','saved:read','company:read company:write','saved:read saved:write')),revoked_at INTEGER
);
CREATE TABLE mcp_oauth_tokens_v2 (
 token_hash TEXT PRIMARY KEY,grant_id TEXT NOT NULL REFERENCES mcp_oauth_grants_v2(id),client_id TEXT NOT NULL REFERENCES mcp_oauth_clients(client_id),
 kind TEXT NOT NULL CHECK(kind IN ('access','refresh')),expires_at INTEGER NOT NULL,consumed_at INTEGER,rotation_target TEXT
);
INSERT INTO mcp_oauth_grants_v2 SELECT * FROM mcp_oauth_grants;
INSERT INTO mcp_oauth_tokens_v2 SELECT * FROM mcp_oauth_tokens;
DROP TABLE mcp_oauth_tokens;
DROP TABLE mcp_oauth_grants;
ALTER TABLE mcp_oauth_grants_v2 RENAME TO mcp_oauth_grants;
ALTER TABLE mcp_oauth_tokens_v2 RENAME TO mcp_oauth_tokens;
CREATE INDEX mcp_oauth_grants_user ON mcp_oauth_grants(user_id);
CREATE INDEX mcp_oauth_tokens_expiry ON mcp_oauth_tokens(expires_at);
CREATE INDEX mcp_oauth_tokens_grant ON mcp_oauth_tokens(grant_id);
