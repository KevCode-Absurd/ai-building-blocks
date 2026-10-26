-- Apply to the COMPOSER database. Submissions stay private until a reviewer publishes.
CREATE TABLE IF NOT EXISTS community_submissions (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  status TEXT NOT NULL CHECK (status IN ('draft','pending','published','rejected')),
  content TEXT NOT NULL CHECK (json_valid(content)),
  scan TEXT CHECK (scan IS NULL OR json_valid(scan)),
  note TEXT NOT NULL DEFAULT '',
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
);
CREATE INDEX IF NOT EXISTS community_owner ON community_submissions(owner, updated_at DESC);
CREATE INDEX IF NOT EXISTS community_queue ON community_submissions(status, updated_at);
CREATE TABLE IF NOT EXISTS community_audit (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id TEXT NOT NULL REFERENCES community_submissions(id),
  revision INTEGER NOT NULL,
  status TEXT NOT NULL,
  actor TEXT NOT NULL,
  note TEXT NOT NULL,
  digest TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(submission_id, revision)
);
CREATE TRIGGER IF NOT EXISTS community_created AFTER INSERT ON community_submissions BEGIN
  INSERT INTO community_audit(submission_id,revision,status,actor,note,digest,created_at)
  VALUES (NEW.id,NEW.revision,NEW.status,NEW.actor,NEW.note,json_extract(NEW.scan,'$.digest'),NEW.updated_at);
END;
CREATE TRIGGER IF NOT EXISTS community_changed AFTER UPDATE ON community_submissions BEGIN
  INSERT INTO community_audit(submission_id,revision,status,actor,note,digest,created_at)
  VALUES (NEW.id,NEW.revision,NEW.status,NEW.actor,NEW.note,json_extract(NEW.scan,'$.digest'),NEW.updated_at);
END;
CREATE TABLE IF NOT EXISTS community_stars (
  user_id TEXT NOT NULL,
  target TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, target)
);
CREATE INDEX IF NOT EXISTS community_star_target ON community_stars(target);
