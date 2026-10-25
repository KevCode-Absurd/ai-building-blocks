-- Cost Tracker Dashboard Queries
--
-- Builds a Supabase view set for reporting on agent AI spend. Assumes the
-- `ai_call_logs` table from Course 2 Lesson 16 exists with these columns:
--   id, agent_id, job_id, client_id, operation_tag, model, tokens_in,
--   tokens_out, cost_usd, created_at
--
-- Store as supabase/migrations/<N>_cost_tracker_views.sql

-- ============================================================================
-- VIEW: v_spend_by_agent_daily
-- ============================================================================

create or replace view v_spend_by_agent_daily as
  select
    date_trunc('day', created_at) ::date        as day,
    agent_id,
    count(*)                                    as call_count,
    sum(cost_usd)                               as total_cost_usd,
    avg(cost_usd)                               as avg_cost_per_call,
    sum(tokens_in)                              as tokens_in,
    sum(tokens_out)                             as tokens_out
  from ai_call_logs
  group by 1, 2
  order by 1 desc, 4 desc;

-- ============================================================================
-- VIEW: v_spend_by_agent_operation_7d
-- ============================================================================

create or replace view v_spend_by_agent_operation_7d as
  select
    agent_id,
    operation_tag,
    count(*)                                    as calls,
    round(sum(cost_usd)::numeric, 4)            as cost_usd,
    round(avg(cost_usd)::numeric, 6)            as avg_cost_usd,
    min(created_at)                             as first_call_at,
    max(created_at)                             as last_call_at
  from ai_call_logs
  where created_at > now() - interval '7 days'
  group by agent_id, operation_tag
  order by cost_usd desc;

-- ============================================================================
-- VIEW: v_spend_by_client_daily
-- ============================================================================

create or replace view v_spend_by_client_daily as
  select
    date_trunc('day', created_at) ::date        as day,
    client_id,
    count(*)                                    as calls,
    round(sum(cost_usd)::numeric, 4)            as cost_usd
  from ai_call_logs
  where client_id is not null
  group by 1, 2
  order by 1 desc, 4 desc;

-- ============================================================================
-- VIEW: v_spend_vs_budget_today
-- ============================================================================
-- Joins today's observed spend to the active budget policy for each agent.

create or replace view v_spend_vs_budget_today as
  with today_spend as (
    select agent_id, sum(cost_usd) as observed
    from ai_call_logs
    where created_at > now() - interval '24 hours'
    group by agent_id
  )
  select
    p.scope_id                                  as agent_id,
    p.limit_usd,
    p.warn_percent,
    p.hard_stop,
    coalesce(t.observed, 0)                     as observed_usd,
    round(
      (coalesce(t.observed, 0) / nullif(p.limit_usd, 0))::numeric * 100,
      1
    )                                           as pct_of_limit,
    case
      when coalesce(t.observed, 0) >= p.limit_usd          then 'breach'
      when coalesce(t.observed, 0) >= p.limit_usd * (p.warn_percent / 100.0) then 'warning'
      else 'ok'
    end                                         as state
  from budget_policies p
  left join today_spend t on t.agent_id = p.scope_id
  where p.scope = 'agent'
    and p.window = 'daily'
    and p.status = 'active'
  order by pct_of_limit desc nulls last;

-- ============================================================================
-- VIEW: v_spend_model_mix_7d
-- ============================================================================

create or replace view v_spend_model_mix_7d as
  select
    agent_id,
    model,
    count(*)                                    as calls,
    round(sum(cost_usd)::numeric, 4)            as cost_usd,
    round(
      (sum(cost_usd) / nullif(sum(sum(cost_usd)) over (partition by agent_id), 0))::numeric * 100,
      1
    )                                           as pct_of_agent_cost
  from ai_call_logs
  where created_at > now() - interval '7 days'
  group by agent_id, model
  order by agent_id, cost_usd desc;

-- ============================================================================
-- QUERY: top expensive operations this week
-- ============================================================================
-- Use this one ad-hoc, not as a view. Put it in a dashboard card.

-- select agent_id, operation_tag, calls, cost_usd
-- from v_spend_by_agent_operation_7d
-- order by cost_usd desc
-- limit 20;

-- ============================================================================
-- QUERY: which clients drove the most spend today
-- ============================================================================

-- select c.name as client_name, v.day, v.calls, v.cost_usd
-- from v_spend_by_client_daily v
-- left join clients c on c.id = v.client_id
-- where v.day = current_date
-- order by v.cost_usd desc
-- limit 20;
