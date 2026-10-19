-- Questions and comments on skill pages (site/src/server/comments.ts). Apply with:
--   npx wrangler d1 migrations apply ai-blocks-comments --remote
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,           -- the skill the comment belongs to
  parent TEXT,                  -- the comment it answers, or NULL
  name TEXT NOT NULL,
  body TEXT NOT NULL,           -- plain text, shown as text
  team INTEGER NOT NULL DEFAULT 0,   -- 1 when the AI Blocks team posted it
  hidden INTEGER NOT NULL DEFAULT 0, -- 1 when the team removed it
  ip_hash TEXT NOT NULL,        -- salted hash, only to limit how fast one visitor posts
  at TEXT NOT NULL              -- ISO time
);
CREATE INDEX IF NOT EXISTS comments_by_skill ON comments (slug, at);
CREATE INDEX IF NOT EXISTS comments_by_visitor ON comments (ip_hash, at);
