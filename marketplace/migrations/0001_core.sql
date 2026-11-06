-- AI Blocks marketplace core record. Every module reads and writes these tables.
-- Conventions: ids are '<prefix>_<16 hex>'; times are ISO-8601 UTC strings; JSON columns are checked with json_valid;
-- money is integer US cents. Payments are on hold: prices are quoted and recorded, nothing is charged yet.

-- People. id is the Clerk user id. email is only trusted when email_verified = 1 (read from Clerk with the secret key).
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0,
  name TEXT,
  beta_access INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);

-- Staff roles beyond OPS_USER_IDS (which is configuration). role: ops | reviewer.
CREATE TABLE staff (
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('ops','reviewer')),
  granted_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, role)
);

-- Invite codes for the beta (BETA_MODE=invite). Redeeming one sets users.beta_access = 1.
CREATE TABLE beta_codes (
  code TEXT PRIMARY KEY,
  note TEXT NOT NULL DEFAULT '',
  max_uses INTEGER NOT NULL DEFAULT 1 CHECK (max_uses > 0),
  uses INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT
);
CREATE TABLE beta_redemptions (
  code TEXT NOT NULL REFERENCES beta_codes(code),
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  PRIMARY KEY (code, user_id)
);

-- Buyer organisations. Every user gets a personal org on first sign-in; teams come later.
CREATE TABLE orgs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  personal INTEGER NOT NULL DEFAULT 1,
  brand_profile TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(brand_profile)),
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL
);
CREATE TABLE org_members (
  org_id TEXT NOT NULL REFERENCES orgs(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('owner','member')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (org_id, user_id)
);
CREATE INDEX org_members_user ON org_members(user_id);

-- Experts. One row per user who applies. status: applied | approved | rejected | paused.
CREATE TABLE experts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  status TEXT NOT NULL CHECK (status IN ('applied','approved','rejected','paused')),
  display_name TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  areas TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(areas)),
  job_types TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(job_types)),
  application TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(application)),
  founding INTEGER NOT NULL DEFAULT 0,
  agreement_version TEXT,
  agreement_accepted_at TEXT,
  review_note TEXT NOT NULL DEFAULT '',
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Personas: the named agents buyers browse and hire ("Nova, SEO strategist"). A persona offers several outcomes;
-- each outcome is a catalogue job type served by one agent row (persona x job type).
-- kind 'house' personas come from src/modules/directory/data/personas.json (seeded); 'expert' personas belong to an expert.
-- profile JSON: { bio, outcomes[], capabilities[], good_at[], not_for[], samples[], accent, portrait, source_roles[] }
CREATE TABLE personas (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('house','expert')),
  expert_id TEXT REFERENCES experts(id),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  area TEXT NOT NULL,
  profile TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(profile)),
  status TEXT NOT NULL CHECK (status IN ('live','hidden')),
  sort INTEGER NOT NULL DEFAULT 1000,
  content_hash TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK ((kind = 'house' AND expert_id IS NULL) OR (kind = 'expert' AND expert_id IS NOT NULL))
);
CREATE INDEX personas_area ON personas(status, area, sort);

-- Agents. kind 'house' = built by AI Blocks for a job type with no expert yet; 'expert' = built in the studio.
-- status: draft | testing | live | retired. Only 'live' agents are matched to buyer jobs.
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('house','expert')),
  expert_id TEXT REFERENCES experts(id),
  persona_id TEXT REFERENCES personas(id),
  job_type_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','testing','live','retired')),
  live_version INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK ((kind = 'house' AND expert_id IS NULL) OR (kind = 'expert' AND expert_id IS NOT NULL))
);
CREATE INDEX agents_job_type ON agents(job_type_id, status);
CREATE INDEX agents_expert ON agents(expert_id);
CREATE INDEX agents_persona ON agents(persona_id, job_type_id);

-- Agent versions are immutable once published: a job pins (agent_id, version) and can always be traced to what ran.
CREATE TABLE agent_versions (
  agent_id TEXT NOT NULL REFERENCES agents(id),
  version INTEGER NOT NULL CHECK (version > 0),
  package TEXT NOT NULL CHECK (json_valid(package)),
  sha256 TEXT NOT NULL,
  changelog TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('draft','published')),
  test_results TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(test_results)),
  created_at TEXT NOT NULL,
  published_at TEXT,
  PRIMARY KEY (agent_id, version)
);
CREATE TRIGGER agent_versions_immutable BEFORE UPDATE OF package, sha256 ON agent_versions
WHEN OLD.status = 'published' BEGIN SELECT RAISE(ABORT, 'agent_version_immutable'); END;
CREATE TRIGGER agent_versions_no_delete BEFORE DELETE ON agent_versions
WHEN OLD.status = 'published' BEGIN SELECT RAISE(ABORT, 'agent_version_immutable'); END;

-- Jobs. The unit everything hangs on. Status values and allowed moves live in src/core/jobs.ts.
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES orgs(id),
  created_by TEXT NOT NULL REFERENCES users(id),
  source TEXT NOT NULL DEFAULT 'web' CHECK (source IN ('web','mcp','api','ops')),
  status TEXT NOT NULL CHECK (status IN ('draft','quoted','confirmed','running','checking','in_review','delivered','revising','accepted','rejected','disputed','failed','cancelled')),
  job_type_id TEXT,
  catalogue_version TEXT,
  persona_id TEXT REFERENCES personas(id),
  title TEXT NOT NULL DEFAULT '',
  price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'usd',
  quote TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(quote)),
  quote_expires_at TEXT,
  turnaround_hours INTEGER,
  due_at TEXT,
  agent_id TEXT REFERENCES agents(id),
  agent_version INTEGER,
  revisions_used INTEGER NOT NULL DEFAULT 0,
  revisions_allowed INTEGER NOT NULL DEFAULT 2,
  delivered_at TEXT,
  auto_accept_at TEXT,
  accepted_at TEXT,
  payment_status TEXT NOT NULL DEFAULT 'not_required' CHECK (payment_status IN ('not_required','pending','received','refunded')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX jobs_org ON jobs(org_id, created_at DESC);
CREATE INDEX jobs_status ON jobs(status, updated_at);
CREATE INDEX jobs_agent ON jobs(agent_id, agent_version);

-- The buyer's own words, kept verbatim, plus the structured spec the intake extracted.
CREATE TABLE briefs (
  job_id TEXT PRIMARY KEY REFERENCES jobs(id),
  request_text TEXT NOT NULL,
  spec TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(spec)),
  questions TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(questions)),
  answers TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(answers)),
  attachments TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(attachments)),
  classification TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(classification)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- The rubric the work is judged against. Frozen when the buyer confirms the quote.
CREATE TABLE rubrics (
  job_id TEXT PRIMARY KEY REFERENCES jobs(id),
  criteria TEXT NOT NULL CHECK (json_valid(criteria)),
  frozen_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TRIGGER rubrics_frozen BEFORE UPDATE OF criteria ON rubrics
WHEN OLD.frozen_at IS NOT NULL BEGIN SELECT RAISE(ABORT, 'rubric_frozen'); END;

-- One run = one execution of an agent version (or the plain-AI baseline) on a brief.
-- kind: job | revision | baseline | test (studio test bench) | certification.
CREATE TABLE runs (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES jobs(id),
  kind TEXT NOT NULL CHECK (kind IN ('job','revision','baseline','test','certification')),
  agent_id TEXT REFERENCES agents(id),
  agent_version INTEGER,
  status TEXT NOT NULL CHECK (status IN ('queued','running','succeeded','failed','cancelled')),
  input TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(input)),
  attempt INTEGER NOT NULL DEFAULT 1,
  workflow_id TEXT,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_micro_usd INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT
);
CREATE INDEX runs_job ON runs(job_id, created_at);
CREATE TABLE run_steps (
  run_id TEXT NOT NULL REFERENCES runs(id),
  seq INTEGER NOT NULL,
  step_id TEXT NOT NULL,
  provider TEXT,
  model TEXT,
  status TEXT NOT NULL CHECK (status IN ('running','succeeded','failed')),
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_micro_usd INTEGER NOT NULL DEFAULT 0,
  output TEXT,
  error TEXT,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  PRIMARY KEY (run_id, seq)
);

-- Drafts produced by runs. released_at is set when the buyer can see it.
CREATE TABLE drafts (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES jobs(id),
  run_id TEXT NOT NULL REFERENCES runs(id),
  version INTEGER NOT NULL DEFAULT 1,
  content TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'markdown' CHECK (format IN ('markdown','text','json')),
  fingerprint TEXT NOT NULL,
  released_at TEXT,
  released_by TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX drafts_job ON drafts(job_id, version);

-- Scores on drafts. judge: rubric | policy | baseline | human.
CREATE TABLE scores (
  id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL REFERENCES drafts(id),
  judge TEXT NOT NULL CHECK (judge IN ('rubric','policy','baseline','human')),
  judge_model TEXT,
  passed INTEGER NOT NULL CHECK (passed IN (0,1)),
  score REAL,
  result TEXT NOT NULL CHECK (json_valid(result)),
  cost_micro_usd INTEGER NOT NULL DEFAULT 0,
  created_by TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX scores_draft ON scores(draft_id, judge);

-- The buyer's decision on a released draft. edits holds a diff of the buyer's changes with their reason.
CREATE TABLE decisions (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  draft_id TEXT NOT NULL REFERENCES drafts(id),
  kind TEXT NOT NULL CHECK (kind IN ('accept','revise','reject','auto_accept')),
  reasons TEXT NOT NULL DEFAULT '' ,
  failed_criteria TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(failed_criteria)),
  edits TEXT,
  rating INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX decisions_job ON decisions(job_id, created_at);

-- Blind tests: two unlabelled outputs for one brief; reviewers pick the better one.
-- a_source / b_source say which side is the expert agent and which is plain AI. Never sent to reviewers.
CREATE TABLE blind_tests (
  id TEXT PRIMARY KEY,
  job_type_id TEXT NOT NULL,
  job_id TEXT REFERENCES jobs(id),
  agent_id TEXT REFERENCES agents(id),
  agent_version INTEGER,
  brief TEXT NOT NULL,
  a_draft_id TEXT NOT NULL REFERENCES drafts(id),
  b_draft_id TEXT NOT NULL REFERENCES drafts(id),
  a_source TEXT NOT NULL CHECK (a_source IN ('agent','baseline')),
  b_source TEXT NOT NULL CHECK (b_source IN ('agent','baseline')),
  judgments_needed INTEGER NOT NULL DEFAULT 3,
  status TEXT NOT NULL CHECK (status IN ('open','closed')),
  created_at TEXT NOT NULL,
  closed_at TEXT
);
CREATE INDEX blind_tests_open ON blind_tests(status, created_at);
CREATE TABLE blind_judgments (
  test_id TEXT NOT NULL REFERENCES blind_tests(id),
  reviewer_id TEXT NOT NULL REFERENCES users(id),
  pick TEXT NOT NULL CHECK (pick IN ('a','b','tie')),
  reason TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  PRIMARY KEY (test_id, reviewer_id)
);

-- Consent: nothing a buyer or expert supplies improves anything beyond their own jobs without it.
-- scope: learn_from_edits | show_as_sample.
CREATE TABLE consents (
  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('org','expert')),
  owner_id TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('learn_from_edits','show_as_sample')),
  granted INTEGER NOT NULL CHECK (granted IN (0,1)),
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (owner_kind, owner_id, scope)
);

-- Ops notes on any record.
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX notes_entity ON notes(entity, entity_id, created_at);

-- Email and in-app notifications. status: queued | sent | skipped | failed.
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  to_email TEXT,
  kind TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  link TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued','sent','skipped','failed')),
  error TEXT,
  created_at TEXT NOT NULL,
  sent_at TEXT
);
CREATE INDEX notifications_user ON notifications(user_id, created_at DESC);

-- Model spend, one row per model call. The daily cap is checked against this table before each call.
CREATE TABLE model_calls (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  purpose TEXT NOT NULL,
  job_id TEXT,
  run_id TEXT,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_micro_usd INTEGER NOT NULL DEFAULT 0,
  ok INTEGER NOT NULL CHECK (ok IN (0,1)),
  created_at TEXT NOT NULL
);
CREATE INDEX model_calls_day ON model_calls(day);
CREATE INDEX model_calls_job ON model_calls(job_id);

-- Append-only event log. Every state change in the marketplace writes one row; every metric comes from here.
CREATE TABLE events (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  actor TEXT NOT NULL,
  actor_kind TEXT NOT NULL CHECK (actor_kind IN ('user','ops','system','expert','reviewer','mcp')),
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(data))
);
CREATE INDEX events_entity ON events(entity, entity_id, seq);
CREATE INDEX events_type ON events(type, at);
CREATE TRIGGER events_no_update BEFORE UPDATE ON events BEGIN SELECT RAISE(ABORT, 'events_append_only'); END;
CREATE TRIGGER events_no_delete BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT, 'events_append_only'); END;
