-- Private expert-agent drafts and capture evidence. Apply only to the separate preview database initially.
CREATE TABLE expert_agent_requests (
  scope TEXT NOT NULL,
  request_key TEXT NOT NULL,
  request_digest TEXT NOT NULL,
  receipt TEXT NOT NULL CHECK(json_valid(receipt)),
  created TEXT NOT NULL,
  PRIMARY KEY(scope, request_key)
);
CREATE TABLE expert_agent_versions (
  scope TEXT NOT NULL,
  record_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK(version BETWEEN 1 AND 1000),
  kind TEXT NOT NULL CHECK(kind IN ('profile','agent','capture')),
  title TEXT NOT NULL,
  digest TEXT NOT NULL,
  contents TEXT NOT NULL CHECK(json_valid(contents) AND length(CAST(contents AS BLOB)) <= 600000),
  request_key TEXT NOT NULL,
  created TEXT NOT NULL,
  PRIMARY KEY(scope, record_id, version),
  FOREIGN KEY(scope, request_key) REFERENCES expert_agent_requests(scope, request_key)
);
CREATE INDEX expert_agent_latest ON expert_agent_versions(scope,kind,record_id,version DESC);
CREATE TRIGGER expert_agent_revision_guard BEFORE INSERT ON expert_agent_versions BEGIN
  SELECT CASE WHEN NEW.version != COALESCE((SELECT MAX(version) FROM expert_agent_versions WHERE scope=NEW.scope AND record_id=NEW.record_id),0)+1
    THEN RAISE(ABORT,'expert_revision_conflict') END;
  SELECT CASE WHEN EXISTS(SELECT 1 FROM expert_agent_versions WHERE scope=NEW.scope AND record_id=NEW.record_id AND kind!=NEW.kind)
    THEN RAISE(ABORT,'expert_kind_conflict') END;
  SELECT CASE WHEN (SELECT COUNT(DISTINCT record_id) FROM expert_agent_versions WHERE scope=NEW.scope)>=500 AND NEW.version=1
    THEN RAISE(ABORT,'expert_storage_limit') END;
  SELECT CASE WHEN COALESCE((SELECT SUM(length(CAST(contents AS BLOB))) FROM expert_agent_versions WHERE scope=NEW.scope),0)+length(CAST(NEW.contents AS BLOB))>20000000
    THEN RAISE(ABORT,'expert_storage_limit') END;
END;
