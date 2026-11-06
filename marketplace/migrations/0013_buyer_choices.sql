-- Delivery and intake: the buyer's choices about their edits, read marks on in-app messages, and how ops settled
-- a problem report. New tables only, plus new columns on problem_reports (a delivery table, 0005_delivery.sql).

-- Consent per decision. When a buyer accepts or asks for changes with their own edits, they choose whether those
-- edits may be used to improve the agent beyond their own job (scope learn_from_edits). Default: not allowed.
-- The org-wide choice lives in consents (owner_kind 'org', scope 'learn_from_edits'): it is the default for the
-- next decision, and turning it off sets every row here for that org to 0.
-- Reuse rule (src/modules/delivery/consent.ts): this row's granted, else the org's choice, else not allowed.
CREATE TABLE decision_consents (
  decision_id TEXT PRIMARY KEY REFERENCES decisions(id),
  job_id TEXT NOT NULL REFERENCES jobs(id),
  org_id TEXT NOT NULL REFERENCES orgs(id),
  scope TEXT NOT NULL DEFAULT 'learn_from_edits' CHECK (scope IN ('learn_from_edits')),
  granted INTEGER NOT NULL CHECK (granted IN (0,1)),
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX decision_consents_org ON decision_consents(org_id, granted);
CREATE INDEX decision_consents_job ON decision_consents(job_id);

-- Read marks for in-app notifications. No row = unread.
CREATE TABLE notification_reads (
  notification_id TEXT PRIMARY KEY REFERENCES notifications(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  read_at TEXT NOT NULL
);
CREATE INDEX notification_reads_user ON notification_reads(user_id, read_at);

-- How ops settled a problem report. outcome: rerun | accept | credit | cancel | close (report only, job unchanged).
-- credit_cents records a credit toward a future job. Payments are on hold, so no money moves.
ALTER TABLE problem_reports ADD COLUMN outcome TEXT CHECK (outcome IS NULL OR outcome IN ('rerun','accept','credit','cancel','close'));
ALTER TABLE problem_reports ADD COLUMN resolution_note TEXT;
ALTER TABLE problem_reports ADD COLUMN credit_cents INTEGER CHECK (credit_cents IS NULL OR credit_cents >= 0);
