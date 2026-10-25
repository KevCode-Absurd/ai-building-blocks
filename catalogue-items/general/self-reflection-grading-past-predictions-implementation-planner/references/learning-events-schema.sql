-- Learning Events
--
-- Two tables:
--   agent_outcomes     — one row per graded prediction. Math-only. No LLM.
--   reflection_events    — lessons generated from outcomes or human feedback.
--
-- Store as supabase/migrations/<N>_learning_events.sql

-- ============================================================================
-- agent_outcomes
-- ============================================================================

create table if not exists agent_outcomes (
  id                       uuid primary key default gen_random_uuid(),

  prediction_id            uuid not null,             -- fk to expected_outcomes (your table)
  agent_id                 text not null,
  client_id                uuid references clients(id) on delete set null,

  recommendation_type      text not null,             -- e.g., 'pause_creative', 'increase_budget'
  metric                   text not null,             -- e.g., 'roas', 'cpa', 'frequency'
  predicted_direction      text not null
                           check (predicted_direction in ('up','down','stable')),
  predicted_magnitude_pct  numeric(6,4) not null,     -- 0.1500 = 15%
  horizon_days             int not null,

  observed_before          numeric(14,4) not null,
  observed_after           numeric(14,4) not null,
  actual_change_pct        numeric(6,4) not null,

  score                    numeric(4,3) not null,      -- 0.000 - 1.000
  classification           text not null
                           check (classification in ('correct','partial','incorrect','stable')),

  graded_at                timestamptz not null default now(),
  predicted_at             timestamptz not null
);

create index if not exists agent_outcomes_agent_idx
  on agent_outcomes (agent_id, graded_at desc);

create index if not exists agent_outcomes_rec_type_idx
  on agent_outcomes (agent_id, recommendation_type, graded_at desc);

create index if not exists agent_outcomes_client_idx
  on agent_outcomes (client_id, graded_at desc);

-- ============================================================================
-- reflection_events
-- ============================================================================

create table if not exists reflection_events (
  id                   uuid primary key default gen_random_uuid(),

  agent_id             text not null,
  lesson_text          text not null,

  lesson_type          text not null
                       check (lesson_type in ('correction', 'reinforcement', 'threshold-adjustment')),

  scope                text not null default 'agent-specific'
                       check (scope in ('agent-specific', 'client-specific', 'shared')),
  scope_client_id      uuid references clients(id) on delete cascade,

  context_tags         text[] not null default '{}',

  relevance_score      numeric(3,2) not null default 0.70
                       check (relevance_score between 0 and 1),

  maturity             text not null default 'draft'
                       check (maturity in ('draft', 'validated', 'trusted', 'archived')),

  generated_by         text not null default 'reflection'
                       check (generated_by in ('reflection', 'feedback', 'manual')),

  validation_count     int not null default 0,
  contradiction_count  int not null default 0,

  last_applied_at      timestamptz,
  archived_at          timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists reflection_events_agent_idx
  on reflection_events (agent_id, maturity, relevance_score desc);

create index if not exists reflection_events_scope_idx
  on reflection_events (scope, scope_client_id);

create index if not exists reflection_events_tags_idx
  on reflection_events using gin (context_tags);

create index if not exists reflection_events_source_idx
  on reflection_events (generated_by, maturity);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================

create or replace function reflection_events_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists reflection_events_touch_trigger on reflection_events;
create trigger reflection_events_touch_trigger
  before update on reflection_events
  for each row execute function reflection_events_touch_updated_at();

-- ============================================================================
-- RLS
-- ============================================================================

alter table agent_outcomes enable row level security;
alter table reflection_events enable row level security;

create policy "service_role_all_outcomes"
  on agent_outcomes for all to service_role using (true) with check (true);

create policy "service_role_all_learnings"
  on reflection_events for all to service_role using (true) with check (true);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Accuracy by agent x recommendation type (last 30 days)
create or replace view v_agent_accuracy_30d as
  select
    agent_id,
    recommendation_type,
    count(*)                                               as instances,
    round(avg(score)::numeric, 3)                          as mean_score,
    round(
      (count(*) filter (where classification = 'correct')::numeric / count(*)),
      3
    )                                                      as accuracy
  from agent_outcomes
  where graded_at > now() - interval '30 days'
  group by agent_id, recommendation_type
  having count(*) >= 5
  order by accuracy asc;

-- Trusted lessons active in prompt injection
create or replace view v_active_lessons as
  select
    agent_id,
    lesson_type,
    generated_by,
    scope,
    relevance_score,
    lesson_text
  from reflection_events
  where maturity in ('validated', 'trusted')
    and archived_at is null
  order by relevance_score desc;
