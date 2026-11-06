-- Rate limits for tool calls on /mcp. Owner: mcp module (src/modules/mcp/limits.ts).
-- One row per bucket and fixed time window. A bucket is a connection (grant) or a buyer, plus the kind of tool
-- (any tool, or a costly one that calls a model or starts a run) and the window length,
-- such as "grant:mcg_..:any:60" or "user:user_..:costly:3600".
-- Rows are counters only (no tokens, no request data). The 15-minute cron deletes them once their window is over.
CREATE TABLE mcp_rate_counts (
  bucket TEXT NOT NULL,
  window_start INTEGER NOT NULL,      -- Unix seconds where the window starts
  count INTEGER NOT NULL,
  expires_at TEXT NOT NULL,           -- ISO time the window ends
  PRIMARY KEY (bucket, window_start)
) WITHOUT ROWID;
CREATE INDEX mcp_rate_counts_expiry ON mcp_rate_counts(expires_at);
