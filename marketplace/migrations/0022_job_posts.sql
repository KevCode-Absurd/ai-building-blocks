-- Businesses post jobs; matching experts reply; the business picks one. Owner: experts module
-- (src/modules/experts/posts.ts). No prices, no model calls.
-- status: open | picked (the business chose a reply; both got the other's email) | closed (by the business) |
--         deleted (by the business: title, brief and website removed at once) | expired (60 days, by the cron).
-- Every post's text (title, brief, website, reply notes) is removed 60 days after it was made (expires_at), whatever
-- its status; text_deleted_at says when. hidden = ops took it off experts' dashboards (hidden_note says why).
CREATE TABLE job_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL DEFAULT '' CHECK (length(title) <= 120),
  brief TEXT CHECK (brief IS NULL OR length(brief) <= 3000),
  website_url TEXT CHECK (website_url IS NULL OR length(website_url) <= 500),
  area TEXT NOT NULL,
  job_type_id TEXT,
  needed_by TEXT NOT NULL CHECK (needed_by IN ('asap','two_weeks','month','flexible')),
  status TEXT NOT NULL CHECK (status IN ('open','picked','closed','deleted','expired')),
  hidden INTEGER NOT NULL DEFAULT 0 CHECK (hidden IN (0,1)),
  hidden_note TEXT NOT NULL DEFAULT '' CHECK (length(hidden_note) <= 500),
  picked_reply_id TEXT,
  text_deleted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  closed_at TEXT
);
CREATE INDEX job_posts_open ON job_posts(status, hidden, created_at);
CREATE INDEX job_posts_user ON job_posts(user_id, created_at);
CREATE INDEX job_posts_expiry ON job_posts(expires_at) WHERE text_deleted_at IS NULL;

-- One reply per expert per post.
CREATE TABLE job_post_replies (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES job_posts(id),
  expert_id TEXT NOT NULL REFERENCES experts(id),
  note TEXT NOT NULL CHECK (length(note) <= 600),
  created_at TEXT NOT NULL,
  UNIQUE (post_id, expert_id)
);
CREATE INDEX job_post_replies_expert ON job_post_replies(expert_id, created_at);

-- When each expert last got the new-posts digest (at most one a day).
CREATE TABLE expert_post_digests (
  expert_id TEXT PRIMARY KEY REFERENCES experts(id),
  last_sent_at TEXT NOT NULL
);
