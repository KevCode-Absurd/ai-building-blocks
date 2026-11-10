-- Founding expert invites. Owner: experts module (src/modules/experts/invites.ts).
-- Ops invite a named person; the invite page is /experts/invite/<token>. The token is 32 random URL-safe characters
-- (24 random bytes), unguessable, kept so ops can copy the link again. It only opens the invite page and pre-fills
-- the application; it signs nobody in and grants nothing on its own.
-- Status is derived, newest first: revoked_at, then the expert's review (approved | rejected | paused), applied_at,
-- opened_at (first visit to the invite page), else created. note is private to ops.
CREATE TABLE expert_invites (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE CHECK (length(token) >= 32),
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 80),
  email TEXT CHECK (email IS NULL OR length(email) <= 200),
  areas TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(areas)),
  job_types TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(job_types)),
  note TEXT NOT NULL DEFAULT '' CHECK (length(note) <= 2000),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  opened_at TEXT,
  applied_at TEXT,
  expert_id TEXT REFERENCES experts(id),
  emailed_at TEXT,
  revoked_at TEXT,
  updated_at TEXT NOT NULL
);
CREATE INDEX expert_invites_created ON expert_invites(created_at);
CREATE UNIQUE INDEX expert_invites_expert ON expert_invites(expert_id) WHERE expert_id IS NOT NULL;

-- The invite an application came from. Invited applications sort first in the ops review queue.
ALTER TABLE experts ADD COLUMN invite_id TEXT REFERENCES expert_invites(id);
