-- Permanently erase selected private record histories without allowing retries to resurrect them.
CREATE TABLE expert_agent_deleted_records (
  scope TEXT NOT NULL,
  record_id TEXT NOT NULL,
  PRIMARY KEY(scope,record_id)
);
CREATE TRIGGER expert_agent_deleted_guard BEFORE INSERT ON expert_agent_versions BEGIN
  SELECT CASE WHEN EXISTS(SELECT 1 FROM expert_agent_deleted_records WHERE scope=NEW.scope AND record_id=NEW.record_id)
    THEN RAISE(ABORT,'expert_record_deleted') END;
END;
-- Service reads and the final atomic commit are separate awaits. Check parents
-- inside the write transaction too, so a concurrent deletion cannot orphan a child.
CREATE TRIGGER expert_agent_parent_guard BEFORE INSERT ON expert_agent_versions BEGIN
  SELECT CASE WHEN NEW.kind='agent' AND NOT EXISTS(
    SELECT 1 FROM expert_agent_versions p WHERE p.scope=NEW.scope AND p.kind='profile'
      AND p.record_id='profile:'||json_extract(NEW.contents,'$.profile_id')
  ) THEN RAISE(ABORT,'expert_parent_unavailable') END;
  SELECT CASE WHEN NEW.kind='capture' AND NOT EXISTS(
    SELECT 1 FROM expert_agent_versions p WHERE p.scope=NEW.scope AND p.kind='agent'
      AND p.record_id='agent:'||json_extract(NEW.contents,'$.agent_id')
  ) THEN RAISE(ABORT,'expert_parent_unavailable') END;
END;
CREATE TRIGGER expert_agent_delete_guard BEFORE DELETE ON expert_agent_versions BEGIN
  SELECT CASE WHEN EXISTS(
    SELECT 1 FROM expert_agent_versions v WHERE v.scope=OLD.scope AND v.record_id!=OLD.record_id AND (
      (OLD.kind='profile' AND v.kind='agent' AND 'profile:'||json_extract(v.contents,'$.profile_id')=OLD.record_id) OR
      (OLD.kind='agent' AND v.kind='capture' AND 'agent:'||json_extract(v.contents,'$.agent_id')=OLD.record_id)
    )
  ) THEN RAISE(ABORT,'expert_record_in_use') END;
  INSERT OR IGNORE INTO expert_agent_deleted_records(scope,record_id) VALUES(OLD.scope,OLD.record_id);
  UPDATE expert_agent_requests SET receipt='{"deleted":true}' WHERE scope=OLD.scope AND request_key=OLD.request_key;
END;
