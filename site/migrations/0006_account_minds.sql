-- Private profile library, scoped exclusively by the verified Clerk subject.
CREATE TABLE IF NOT EXISTS account_minds (
  user_id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL CHECK (revision >= 1),
  profiles TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
