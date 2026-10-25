-- ============================================================================
-- tasks (the unit of agent work)
--
-- The single table your control plane needs to start. Every heartbeat,
-- every delegation, every proposal eventually resolves to a row here.
--
-- Keep it small at first. Eight columns is enough to teach the pattern.
-- Add comments, relations, and approval flow later when you actually need them.
--
-- Apply with: psql $DATABASE_URL -f tasks-table-schema.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Status enum
-- ----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM (
    'todo',         -- queued for work
    'in_progress',  -- an agent has it checked out
    'in_review',    -- waiting on human approval
    'done',         -- completed
    'cancelled'     -- closed without completion
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- tasks
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- what
  title TEXT NOT NULL,
  description TEXT,

  -- who and when
  agent_id TEXT,                -- the agent currently responsible (nullable: unassigned backlog)
  status task_status NOT NULL DEFAULT 'todo',
  priority SMALLINT NOT NULL DEFAULT 2, -- 0 urgent, 1 high, 2 normal, 3 low

  -- atomic checkout (prevents two agent runs grabbing the same task)
  checkout_agent_id TEXT,
  checkout_expires_at TIMESTAMPTZ,

  -- timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for the common "what does this agent need to do next?" query.
CREATE INDEX IF NOT EXISTS idx_tasks_agent_status
  ON public.tasks (agent_id, status, priority ASC, created_at ASC)
  WHERE status NOT IN ('done', 'cancelled');

-- Index for finding stale checkouts to release.
CREATE INDEX IF NOT EXISTS idx_tasks_checkout_expiry
  ON public.tasks (checkout_expires_at)
  WHERE checkout_agent_id IS NOT NULL;

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- Atomic checkout pattern
--
-- The whole point of putting tasks in a database (rather than a queue) is
-- this query. Two agent runs hitting the same task at the same time is a
-- common bug. SELECT ... FOR UPDATE SKIP LOCKED solves it cleanly.
--
-- Usage from your worker:
--
--   BEGIN;
--   SELECT id FROM tasks
--     WHERE status = 'todo' AND agent_id = $1
--     ORDER BY priority ASC, created_at ASC
--     LIMIT 1
--     FOR UPDATE SKIP LOCKED;
--
--   -- if a row came back:
--   UPDATE tasks
--     SET status = 'in_progress',
--         checkout_agent_id = $2,           -- this run's id
--         checkout_expires_at = NOW() + INTERVAL '30 minutes'
--     WHERE id = $row_id;
--   COMMIT;
--
-- Two parallel runs cannot grab the same row. The second one gets a different
-- task (or none, if the queue is empty).
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- What you will add next (after the lesson lands)
-- ----------------------------------------------------------------------------
--
-- Once you have agents reliably picking up and completing tasks, add:
--
--   - task_comments       (audit log of what the agent did, what it found)
--   - task_relations      (parent/child, blocks/blocked_by)
--   - task_approvals      (human gate for high-impact actions)
--   - identifier sequence (human-friendly TASK-001234 ids)
--   - foreign keys back to your finding/proposal/goal tables once those exist
--
-- Resist adding all of this in week one. The bigger the schema, the slower
-- you iterate. Earn each new column.
