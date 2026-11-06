-- Delivery module. "Report a problem" from a buyer on a delivered job (the job moves to disputed).
-- decisions.kind only allows accept | revise | reject | auto_accept, so reports are kept here instead.
-- status: open | resolved. Ops sets resolved when it settles the dispute.
CREATE TABLE problem_reports (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  draft_id TEXT REFERENCES drafts(id),
  reasons TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved_by TEXT,
  resolved_at TEXT
);
CREATE INDEX problem_reports_job ON problem_reports(job_id, created_at);
CREATE INDEX problem_reports_open ON problem_reports(status, created_at);
