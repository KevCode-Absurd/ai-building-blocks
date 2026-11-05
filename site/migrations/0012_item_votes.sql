-- Apply to the COMMENTS database. "Did it work?" answers: one row per visitor per item (src/server/votes.ts).
-- voter is a salted hash of the visitor's address; the address itself is never stored.
CREATE TABLE IF NOT EXISTS item_votes (
  slug TEXT NOT NULL,
  voter TEXT NOT NULL,
  worked INTEGER NOT NULL CHECK (worked IN (0, 1)),
  at TEXT NOT NULL,
  PRIMARY KEY (slug, voter)
);
CREATE INDEX IF NOT EXISTS item_votes_voter ON item_votes(voter, at);
