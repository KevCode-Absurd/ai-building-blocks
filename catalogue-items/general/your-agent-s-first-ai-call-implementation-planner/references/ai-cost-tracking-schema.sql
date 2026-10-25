-- ============================================================================
-- AI COST TRACKING SCHEMA
-- ============================================================================
-- Logs every AI call with operation tag, token counts, and cost.
-- This is what powers "how much did agent X spend on audits today?" queries.
--
-- Depends on: nothing. Standalone. Run in a fresh Supabase project.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: ai_jobs
-- ============================================================================
-- One row per queued job. cost_usd accumulates across all callAI calls made
-- during that job's execution.
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','active','completed','failed','cancelled')),
  priority SMALLINT DEFAULT 3,
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  client_id TEXT,
  client_name TEXT,
  slack_channel_id TEXT,
  slack_thread_ts TEXT,
  requested_by TEXT,
  cost_usd NUMERIC(10, 6) DEFAULT 0,
  prompt_version TEXT,
  error_message TEXT,
  attempt_count SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_jobs_agent_id ON ai_jobs (agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON ai_jobs (status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_client_id ON ai_jobs (client_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created_at ON ai_jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_agent_created ON ai_jobs (agent_id, created_at DESC);

COMMENT ON TABLE ai_jobs IS 'Queued and executed agent jobs. Source of truth for cost attribution.';

-- ============================================================================
-- TABLE: ai_calls
-- ============================================================================
-- Per-call granular log. One row per callAI invocation. Use this to break
-- down spend by operation tag.
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  job_id UUID REFERENCES ai_jobs(id) ON DELETE CASCADE,
  operation TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_usd NUMERIC(10, 6) DEFAULT 0,
  duration_ms INTEGER,
  client_id TEXT,
  prompt_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_calls_agent_id ON ai_calls (agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_calls_job_id ON ai_calls (job_id);
CREATE INDEX IF NOT EXISTS idx_ai_calls_operation ON ai_calls (operation);
CREATE INDEX IF NOT EXISTS idx_ai_calls_created_at ON ai_calls (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_calls_agent_operation_created ON ai_calls (agent_id, operation, created_at DESC);

COMMENT ON TABLE ai_calls IS 'Per-AI-call log. Enables spend breakdowns by agent, operation, and time window.';

-- ============================================================================
-- TABLE: ai_agents (minimal)
-- ============================================================================
-- Stores per-agent budget config. Expand as needed for responsibilities, etc.
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_agents (
  agent_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  daily_budget_usd NUMERIC(10, 4) DEFAULT 5.00,
  monthly_budget_usd NUMERIC(10, 4) DEFAULT 100.00,
  capabilities JSONB DEFAULT '[]',
  cost_config JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ai_agents IS 'Per-agent config including daily and monthly budget caps.';

-- ============================================================================
-- VIEW: spend_by_agent_today
-- ============================================================================

CREATE OR REPLACE VIEW spend_by_agent_today AS
SELECT
  agent_id,
  COUNT(*) AS call_count,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(cost_usd) AS total_cost_usd
FROM ai_calls
WHERE created_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
GROUP BY agent_id
ORDER BY total_cost_usd DESC;

COMMENT ON VIEW spend_by_agent_today IS 'Rolling view: agent-level spend since 00:00 UTC today.';

-- ============================================================================
-- VIEW: spend_by_operation_today
-- ============================================================================

CREATE OR REPLACE VIEW spend_by_operation_today AS
SELECT
  agent_id,
  operation,
  COUNT(*) AS call_count,
  SUM(cost_usd) AS total_cost_usd
FROM ai_calls
WHERE created_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
GROUP BY agent_id, operation
ORDER BY total_cost_usd DESC;

COMMENT ON VIEW spend_by_operation_today IS 'Rolling view: spend grouped by agent + operation tag today.';

-- ============================================================================
-- RLS (service role only; application enforces client scope separately)
-- ============================================================================

ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

-- Service role full access. Add per-user policies in a follow-up migration.
CREATE POLICY IF NOT EXISTS "service role full access" ON ai_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "service role full access" ON ai_calls
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "service role full access" ON ai_agents
  FOR ALL TO service_role USING (true) WITH CHECK (true);
