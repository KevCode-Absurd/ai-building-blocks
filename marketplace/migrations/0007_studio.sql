-- Expert studio: where an approved expert turns how they work into an agent. Owner: studio module.
-- Everything in these tables is private to the expert who owns the agent (and the AI Blocks team).
-- Buyers never see any of it: not the interview, not the examples, not the markup, not the test bench.
-- The agent itself lives in core tables (agents, agent_versions); these tables hold the work that builds it.

-- One row per studio agent: the playbook and the plain-AI draft the expert marks up.
-- playbook_source: none (not written yet) | ai (drafted by the interviewer) | expert (edited by the expert).
CREATE TABLE studio_agents (
  agent_id TEXT PRIMARY KEY REFERENCES agents(id),
  expert_id TEXT NOT NULL REFERENCES experts(id),
  playbook TEXT NOT NULL DEFAULT '' CHECK (length(playbook) <= 20000),
  playbook_source TEXT NOT NULL DEFAULT 'none' CHECK (playbook_source IN ('none','ai','expert')),
  playbook_updated_at TEXT,
  markup_brief_id TEXT,
  markup_brief TEXT,
  markup_run_id TEXT,
  markup_draft_id TEXT,
  markup_draft TEXT,
  markup_made_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX studio_agents_expert ON studio_agents(expert_id);

-- Interview turns. kind 'question' = from the job type's question bank (question_id is the bank id);
-- 'follow_up' = asked by the interviewer about that answer (question_id is the parent bank id). One of each per question.
CREATE TABLE studio_interview_turns (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  seq INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('question','follow_up')),
  question TEXT NOT NULL,
  answer TEXT CHECK (answer IS NULL OR length(answer) <= 6000),
  skipped INTEGER NOT NULL DEFAULT 0 CHECK (skipped IN (0,1)),
  created_at TEXT NOT NULL,
  answered_at TEXT,
  UNIQUE (agent_id, question_id, kind)
);
CREATE INDEX studio_turns_agent ON studio_interview_turns(agent_id, seq);

-- Past work the expert teaches the agent with. Size-limited. rights: own_work | client_permission;
-- rights_statement is the exact sentence the expert confirmed, with the time they confirmed it.
CREATE TABLE studio_examples (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  expert_id TEXT NOT NULL REFERENCES experts(id),
  title TEXT NOT NULL CHECK (length(title) <= 120),
  brief TEXT NOT NULL CHECK (length(brief) <= 4000),
  audience TEXT NOT NULL CHECK (length(audience) <= 300),
  result TEXT NOT NULL CHECK (length(result) <= 20000),
  notes TEXT NOT NULL DEFAULT '' CHECK (length(notes) <= 1000),
  rights TEXT NOT NULL CHECK (rights IN ('own_work','client_permission')),
  rights_statement TEXT NOT NULL,
  rights_confirmed_at TEXT NOT NULL,
  chars INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX studio_examples_agent ON studio_examples(agent_id, created_at);

-- Passages of a plain-AI draft the expert would never ship, and why.
CREATE TABLE studio_marks (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  draft_id TEXT,
  brief_id TEXT,
  passage TEXT NOT NULL CHECK (length(passage) <= 2000),
  reason TEXT NOT NULL CHECK (length(reason) <= 500),
  created_at TEXT NOT NULL
);
CREATE INDEX studio_marks_agent ON studio_marks(agent_id, created_at);

-- Test bench: one row per public sample brief per bench run. The agent's draft and the plain-AI draft sit side by side.
-- Draft text lives in drafts (written by the runner); these rows point to it.
CREATE TABLE studio_tests (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  version INTEGER NOT NULL,
  bench_id TEXT NOT NULL,
  brief_id TEXT NOT NULL,
  brief TEXT NOT NULL,
  agent_run_id TEXT,
  agent_draft_id TEXT,
  baseline_run_id TEXT,
  baseline_draft_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('done','failed')),
  error TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (agent_id, version) REFERENCES agent_versions(agent_id, version)
);
CREATE INDEX studio_tests_agent ON studio_tests(agent_id, version, created_at);

-- The expert's edits to their agent's test drafts, with the reason. Rules are suggested from these.
CREATE TABLE studio_edits (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  test_id TEXT NOT NULL REFERENCES studio_tests(id),
  version INTEGER NOT NULL,
  original TEXT NOT NULL,
  edited TEXT NOT NULL CHECK (length(edited) <= 40000),
  reason TEXT NOT NULL CHECK (length(reason) <= 1000),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX studio_edits_test ON studio_edits(test_id, created_at);

-- Rules suggested from edits. Nothing changes the agent until the expert approves it.
-- Approved rules go into every later build; applied_version is the first version that carried the rule.
CREATE TABLE studio_suggestions (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  edit_id TEXT REFERENCES studio_edits(id),
  target TEXT NOT NULL CHECK (target IN ('style_rules','checklist')),
  text TEXT NOT NULL CHECK (length(text) <= 400),
  why TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('proposed','approved','declined')),
  decided_by TEXT,
  decided_at TEXT,
  applied_version INTEGER,
  created_at TEXT NOT NULL
);
CREATE INDEX studio_suggestions_agent ON studio_suggestions(agent_id, status);
