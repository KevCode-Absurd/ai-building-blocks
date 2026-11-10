-- Public expert profiles and share links. Owner: experts module (src/modules/experts/profiles.ts).
-- One row per approved expert. slug is the public address (/experts/<slug>) and the share code (/e/<slug>,
-- ?via=<slug>); it never changes once set. headline and bio are the expert's own words (NULL until they edit them,
-- then the application's headline and the persona bio stand in). The page is public only while the expert is
-- approved and has at least one live agent.
-- link_visits and link_downloads are plain counters: nothing about a visitor is stored here.
CREATE TABLE expert_profiles (
  expert_id TEXT PRIMARY KEY REFERENCES experts(id),
  slug TEXT NOT NULL UNIQUE CHECK (length(slug) BETWEEN 2 AND 60),
  headline TEXT CHECK (headline IS NULL OR length(headline) <= 140),
  bio TEXT CHECK (bio IS NULL OR length(bio) <= 800),
  edited_at TEXT,
  link_visits INTEGER NOT NULL DEFAULT 0,
  link_downloads INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- First-touch attribution: the expert whose share link brought this person, set once when their account is made
-- here (from the first-party aib_via cookie, 90 days). The only thing stored about a referred visitor.
ALTER TABLE users ADD COLUMN referred_by_expert TEXT REFERENCES experts(id);
CREATE INDEX users_referred_by_expert ON users(referred_by_expert) WHERE referred_by_expert IS NOT NULL;
