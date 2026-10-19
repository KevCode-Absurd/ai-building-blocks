-- Spaces: each person's skills, prompts, workflows, kits and agents (site/src/server/spaces.ts). Apply with:
--   npx wrangler d1 migrations apply ai-blocks --remote
CREATE TABLE IF NOT EXISTS spaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_hash TEXT NOT NULL UNIQUE,  -- SHA-256 of the owner key; the key itself is never stored
  share_token TEXT NOT NULL UNIQUE, -- the secret in the share link; replacing it turns the old link off
  ip_hash TEXT NOT NULL,            -- salted hash, only to limit how many spaces one visitor makes a day
  created TEXT NOT NULL,
  updated TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS spaces_by_visitor ON spaces (ip_hash, created);

CREATE TABLE IF NOT EXISTS space_items (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces (id) ON DELETE CASCADE,
  kind TEXT NOT NULL,               -- skill, prompt, workflow, kit or agent
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',    -- the SKILL.md, prompt or agent instructions, as plain text
  data TEXT,                        -- JSON: a workflow's steps and links, or a kit's block names
  visibility TEXT NOT NULL DEFAULT 'private', -- private: only through the space's link; public: on "From people"
  hidden INTEGER NOT NULL DEFAULT 0,          -- 1 when the team took a public item down
  created TEXT NOT NULL,
  updated TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS items_by_space ON space_items (space_id, updated);
CREATE INDEX IF NOT EXISTS items_public ON space_items (visibility, hidden, updated);
