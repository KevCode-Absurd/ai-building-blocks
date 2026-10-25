-- Delegation Audit Log
--
-- Records every delegation action. Enables later questions like:
--   "How often does Mia delegate to Jordan vs Riley?"
--   "Which agent has the most rejected delegations?"
--   "Show me the delegation chain for issue X."
--
-- Store this migration under supabase/migrations/ with a sequential prefix.

-- ============================================================================
-- TABLE
-- ============================================================================

create table if not exists delegation_audit_log (
  id                  uuid primary key default gen_random_uuid(),
  from_agent_id       text not null,
  to_agent_id         text not null,
  issue_id            uuid not null references issues(id) on delete cascade,
  parent_issue_id     uuid references issues(id) on delete set null,
  delegation_kind     text not null default 'agent'
                      check (delegation_kind in ('agent', 'human-required', 'playbook', 'proposal')),
  depth               int not null default 1,
  success             boolean not null default true,
  failure_reason      text,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists delegation_audit_log_from_agent_idx
  on delegation_audit_log (from_agent_id, created_at desc);

create index if not exists delegation_audit_log_to_agent_idx
  on delegation_audit_log (to_agent_id, created_at desc);

create index if not exists delegation_audit_log_issue_idx
  on delegation_audit_log (issue_id);

create index if not exists delegation_audit_log_parent_idx
  on delegation_audit_log (parent_issue_id);

create index if not exists delegation_audit_log_failed_idx
  on delegation_audit_log (created_at desc)
  where success = false;

-- ============================================================================
-- RLS
-- ============================================================================

alter table delegation_audit_log enable row level security;

-- Service role bypasses RLS. No other role should read or write.
create policy "service_role_all_delegation_audit"
  on delegation_audit_log
  for all
  to service_role
  using (true)
  with check (true);

-- ============================================================================
-- VIEWS
-- ============================================================================

create or replace view v_delegation_volume_by_pair as
  select
    from_agent_id,
    to_agent_id,
    count(*)                                    as total,
    count(*) filter (where success)             as successful,
    count(*) filter (where not success)         as failed,
    count(*) filter (where delegation_kind = 'human-required') as escalations,
    max(created_at)                             as last_delegation_at
  from delegation_audit_log
  group by from_agent_id, to_agent_id;

create or replace view v_delegation_failures_recent as
  select
    id,
    from_agent_id,
    to_agent_id,
    issue_id,
    failure_reason,
    metadata,
    created_at
  from delegation_audit_log
  where not success
    and created_at > now() - interval '7 days'
  order by created_at desc;
