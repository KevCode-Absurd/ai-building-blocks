-- Additive only: release upgrades preserve all existing comments, spaces and items.
CREATE TABLE IF NOT EXISTS account_library (
  user_id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  contents TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
ALTER TABLE spaces ADD COLUMN user_id TEXT;
ALTER TABLE spaces ADD COLUMN access_policy TEXT NOT NULL DEFAULT '{"mode":"link","emails":[],"domain":""}';
CREATE UNIQUE INDEX spaces_by_account ON spaces(user_id) WHERE user_id IS NOT NULL;
