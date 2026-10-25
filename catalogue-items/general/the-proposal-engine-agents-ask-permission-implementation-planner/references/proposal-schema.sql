-- Proposals
--
-- The human-agent contract. Agents detect problems, propose solutions, and
-- wait for Slack button approval before anything happens.
--
-- Lifecycle:
--   draft (written but not posted to Slack)
--   posted (live in Slack with Approve/Reject/Elaborate buttons)
--   elaborating (human clicked Elaborate; agent is adding detail)
--   approved (human clicked Approve; downstream worker can pick it up)
--   rejected (human clicked Reject; logged as a learning event)
--   expired (TTL hit, nobody clicked, auto-cancel)

-- ============================================================================
-- TABLE
-- ============================================================================
--
-- This is the minimum viable proposal table. You will likely want to add a
-- richer "delegation plan" column once your agents start coordinating
-- multi-step work, plus a structured "evidence" column to back up the
-- proposal. Both are out of scope for the starter.

create table if not exists proposals (
  id                    uuid primary key default gen_random_uuid(),
  agent_id              text not null,
  client_id             uuid,

  proposal_type         text not null
                        check (proposal_type in ('action', 'investigation', 'strategy-change')),

  title                 text not null,
  body                  text not null,

  impact_estimate       jsonb,                       -- { metric, current, projected, confidence, horizon_days }

  urgency               text not null default 'normal'
                        check (urgency in ('normal', 'high', 'emergency')),

  status                text not null default 'draft'
                        check (status in ('draft', 'posted', 'elaborating', 'approved', 'rejected', 'expired')),

  target_channel_id     text not null,
  slack_message_ts      text,

  approver_user_id      text,
  approved_at           timestamptz,
  rejected_at           timestamptz,
  rejection_reason      text,

  expires_at            timestamptz default (now() + interval '48 hours'),

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists proposals_status_idx
  on proposals (status, created_at desc);

create index if not exists proposals_agent_idx
  on proposals (agent_id, created_at desc);

create index if not exists proposals_client_idx
  on proposals (client_id, created_at desc);

create index if not exists proposals_slack_msg_idx
  on proposals (target_channel_id, slack_message_ts);

create index if not exists proposals_expiring_idx
  on proposals (expires_at)
  where status in ('posted', 'elaborating');

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================

create or replace function proposals_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists proposals_touch_updated_at_trigger on proposals;
create trigger proposals_touch_updated_at_trigger
  before update on proposals
  for each row execute function proposals_touch_updated_at();

-- ============================================================================
-- IMPACT ESTIMATE SHAPE (reference)
-- ============================================================================
--
-- {
--   "metric": "ROAS",
--   "current": 1.8,
--   "projected_low": 2.1,
--   "projected_high": 2.3,
--   "confidence": "moderate",
--   "horizon_days": 7
-- }
