-- Agent packs: the trained packs an expert uploaded to start or update a studio agent (POST /api/studio/import).
-- Owner: studio module (src/modules/studio/import.ts). Private to the expert and the AI Blocks team, like the rest of
-- the studio. The playbook built from the latest upload lives in studio_agents.playbook; each upload keeps its own
-- row here, so re-uploading for the same agent adds a row (the newest is the current pack).
-- files:    JSON [{ "path", "bytes", "sha256", "content" }] for every file except examples/, paths relative to the
--           pack folder, in upload order. bytes and sha256 are worked out on upload; the pack's own hashes are never
--           trusted. The zip's .agents/skills and .claude/skills copies are left out when they match skills/.
-- examples: the same shape for examples/ only: the expert's past work, kept apart for review and testing. It is never
--           part of a public download or file viewer.
-- examples_rights: 1 when the upload confirmed (examples_rights=1) that the expert owns the examples or may use them,
--           and that they are anonymised; only then were they also added as studio examples.
-- sha256 and bytes describe the uploaded zip. The import caps the unzipped pack at 1.5 MB, so a row stays under D1's
-- 2 MB row limit.
CREATE TABLE studio_pack_imports (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  files TEXT NOT NULL,
  examples TEXT NOT NULL DEFAULT '[]',
  examples_rights INTEGER NOT NULL DEFAULT 0 CHECK (examples_rights IN (0,1)),
  sha256 TEXT NOT NULL CHECK (length(sha256) = 64),
  bytes INTEGER NOT NULL CHECK (bytes > 0),
  created_at TEXT NOT NULL
);
CREATE INDEX studio_pack_imports_agent ON studio_pack_imports(agent_id, created_at);
