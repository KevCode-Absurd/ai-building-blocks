// Response shapes of the ops API. The ops pages import these as types only.
import type { JobRow, JobStatus, RubricCriterion } from "../../core/types.ts";

/** Work queues on /ops. */
export type Queue = "review" | "problems" | "requests" | "active" | "done";
export const QUEUES: Queue[] = ["review", "problems", "requests", "active", "done"];

/** checks_failed: the latest draft failed the rubric or policy check. overdue: past due_at and not delivered. over_cost: model spend above JOB_COST_CAP_USD. */
export type JobFlag = "checks_failed" | "overdue" | "over_cost" | "revised";

export interface JobSummary {
  id: string;
  title: string;
  status: JobStatus;
  queue: Queue;
  source: JobRow["source"];
  buyer_id: string;
  buyer_email: string | null;
  persona_id: string | null;
  persona_name: string | null;
  job_type_id: string | null;
  job_type_title: string | null;
  agent_id: string | null;
  agent_version: number | null;
  revisions_used: number;
  flags: JobFlag[];
  cost_usd: number;
  /** Hours since the job was created. */
  age_hours: number;
  /** Hours since the job last changed. */
  waiting_hours: number;
  due_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScoreView {
  id: string;
  judge: "rubric" | "policy" | "baseline" | "human";
  judge_model: string | null;
  passed: boolean;
  score: number | null;
  result: any;
  cost_usd: number;
  created_by: string | null;
  created_at: string;
}

export interface DraftView {
  id: string;
  run_id: string;
  version: number;
  content: string;
  format: string;
  fingerprint: string;
  released_at: string | null;
  released_by: string | null;
  created_at: string;
  checks_failed: boolean;
  scores: ScoreView[];
}

export interface RunStepView {
  seq: number; step_id: string; provider: string | null; model: string | null; status: string;
  input_tokens: number; output_tokens: number; cost_usd: number; output: string | null; error: string | null;
  started_at: string; finished_at: string | null;
}

export interface RunView {
  id: string; kind: string; agent_id: string | null; agent_version: number | null; status: string; attempt: number;
  input: Record<string, unknown>; input_tokens: number; output_tokens: number; cost_usd: number; model_calls: number;
  error: string | null; created_at: string; started_at: string | null; finished_at: string | null;
  steps: RunStepView[];
}

export interface AgentOption { id: string; name: string; persona_name: string | null; kind: string; status: string; live_version: number | null; versions: number[] }

export interface JobRecord {
  job: JobSummary & { quote: Record<string, unknown>; turnaround_hours: number | null; delivered_at: string | null; auto_accept_at: string | null; accepted_at: string | null; revisions_allowed: number; catalogue_version: string | null; quote_expires_at: string | null };
  buyer: { id: string; email: string | null };
  brief: { request_text: string; spec: Record<string, unknown>; questions: unknown[]; answers: Record<string, unknown>; attachments: unknown[]; classification: Record<string, unknown>; created_at: string; updated_at: string } | null;
  rubric: { criteria: RubricCriterion[]; frozen_at: string | null } | null;
  agent: AgentOption | null;
  agent_options: AgentOption[];
  runs: RunView[];
  drafts: DraftView[];
  decisions: { id: string; draft_id: string; kind: string; reasons: string; failed_criteria: string[]; edits: unknown; rating: number | null; created_by: string; created_at: string }[];
  events: { seq: number; at: string; actor: string; actor_kind: string; entity: string; entity_id: string; type: string; data: Record<string, unknown> }[];
  notes: { id: string; body: string; created_by: string; created_by_email: string | null; created_at: string }[];
  notifications: { id: string; user_id: string | null; to_email: string | null; kind: string; subject: string; body_text: string; link: string | null; status: string; error: string | null; created_at: string; sent_at: string | null }[];
  cost: { total_usd: number; calls: number; cap_usd: number; by_purpose: { purpose: string; usd: number; calls: number }[] };
  actions: { release: boolean; rerun: boolean; cancel: boolean; assign: boolean; resolve: boolean };
}

export interface AgentSummary {
  id: string;
  name: string;
  kind: "house" | "expert";
  status: "draft" | "testing" | "live" | "retired";
  persona_id: string | null;
  persona_name: string | null;
  expert_id: string | null;
  expert_name: string | null;
  job_type_id: string;
  job_type_title: string | null;
  live_version: number | null;
  latest_version: number | null;
  jobs: number;
  accepted: number;
  /** Accepted jobs out of jobs the buyer decided on (accepted, rejected or disputed). */
  acceptance_rate: number | null;
  win_rate: number | null;
  blind_tests: number;
  updated_at: string;
}

/** One row of blind-test results (same shape as evaluation's WinRate, with a label to show). */
export interface WinRateView {
  key: string; label: string; tests: number; judgments: number; agentWins: number; baselineWins: number; ties: number;
  /** Agent wins out of tests with a clear winner (ties left out). */
  winRate: number | null;
}
export interface PassRateView { checks: number; passed: number; rate: number | null }

/** /ops/review: blind tests against plain AI, reviewer work, and how often job drafts pass the checks. */
export interface ReviewReport {
  /** The invite gate's blind win-rate target. */
  target: number;
  overall: WinRateView;
  byAgent: (WinRateView & { agent_id: string; version: number | null })[];
  byJobType: (WinRateView & { rubric: PassRateView | null; policy: PassRateView | null })[];
  /** How often the AI pairwise judge picked the same winner as the reviewers. */
  agreement: { tests: number; agree: number; rate: number | null };
  queue: { open: number; closed: number; judgments: number; openJudgments: number; stillNeeded: number; reviewers: number; oldestOpenAt: string | null };
  checks: { rubric: PassRateView & { averageScore: number | null }; policy: PassRateView; drafts: number; allPassed: number; allRate: number | null };
}

export interface CostReport {
  today: { day: string; usd: number; calls: number; cap_usd: number; share: number };
  days: { day: string; usd: number; calls: number; failed: number }[];
  purposes: { purpose: string; usd: number; calls: number; input_tokens: number; output_tokens: number }[];
  jobs: { job_id: string; title: string; status: string | null; usd: number; calls: number }[];
  since: string;
}

export interface BetaCodeView {
  code: string; note: string; max_uses: number; uses: number; created_by: string; created_at: string; expires_at: string | null;
  state: "active" | "used_up" | "expired";
  redeemed: { user_id: string; email: string | null; at: string }[];
}

export interface StaffView {
  staff: { user_id: string; email: string | null; role: "ops" | "reviewer"; granted_by: string; created_at: string }[];
  /** Ops access from the OPS_USER_IDS setting; cannot be changed here. */
  settings_ops: { user_id: string; email: string | null }[];
}
