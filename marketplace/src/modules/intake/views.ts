// What buyers see of a request: no baseline prompt, no hidden briefs, no model reasoning.
// The MCP module can reuse requestView so every surface shows the same thing.
import type { Env } from "../../env.ts";
import type { RubricCriterion, SpecFieldType } from "../../core/types.ts";
import { first, nowIso, parseJson } from "../../core/db.ts";
import { STATUS_LABELS } from "../../core/jobs.ts";
import { getJobType } from "../catalogue/index.ts";
import { priceFor, rushAvailable } from "./pricing.ts";
import { IN_REQUEST, isEmpty } from "./spec.ts";
import type { IntakeState, StoredQuote } from "./service.ts";

export interface RequestQuestion {
  field_id: string;
  question: string;
  label: string;
  type: SpecFieldType;
  required: boolean;
  help?: string;
  options?: string[];
  max?: number;
}

export interface RequestView {
  id: string;
  status: string;
  status_label: string;
  title: string;
  created_at: string;
  request_text: string;
  persona: { id: string; name: string; title: string } | null;
  job_type: { id: string; title: string; summary: string; deliverable: string; area: string; turnaround_hours: number; price_from_usd: number; rush_available: boolean } | null;
  /** True when we could not match the request to a job type yet; the AI Blocks team follows up. */
  open_request: boolean;
  /** Other job types that may fit, for "not the right job?". */
  alternatives: { id: string; title: string; summary: string }[];
  /** What we took from the buyer's words and answers, in field order. */
  details: { field_id: string; label: string; value: unknown; in_request: boolean }[];
  questions: RequestQuestion[];
  ready: boolean;
  quote: {
    price_cents: number;
    currency: string;
    breakdown: { label: string; cents: number }[];
    turnaround_hours: number;
    rush: boolean;
    expires_at: string;
    expired: boolean;
    goals: string;
    checklist: { id: string; text: string; source: RubricCriterion["source"]; critical: boolean }[];
    /** The same job with rush switched the other way, when rush is offered. */
    rush_option: { rush: boolean; price_cents: number; turnaround_hours: number } | null;
  } | null;
  goals: string;
  revisions_allowed: number;
  due_at: string | null;
  /** Where the buyer follows the job once it is ordered. */
  job_url: string;
}

export async function requestView(env: Env, state: IntakeState): Promise<RequestView> {
  const { job } = state;
  const jt = getJobType(job.job_type_id);
  const persona = job.persona_id ? await first<{ id: string; name: string; title: string }>(env.DB, "SELECT id, name, title FROM personas WHERE id = ?", job.persona_id) : null;

  const questions: RequestQuestion[] = [];
  if (jt) {
    for (const q of state.questions) {
      const f = jt.spec_fields.find(x => x.id === q.field_id);
      if (!f) continue;
      questions.push({
        field_id: f.id, question: q.question, label: f.label, type: f.type, required: f.required,
        ...(f.help ? { help: f.help } : {}), ...(f.options ? { options: [...f.options] } : {}), ...(f.max ? { max: f.max } : {}),
      });
    }
  }
  const details = jt
    ? jt.spec_fields.filter(f => !isEmpty(state.spec[f.id])).map(f => ({ field_id: f.id, label: f.label, value: state.spec[f.id], in_request: state.spec[f.id] === IN_REQUEST }))
    : [];

  const stored = parseJson<Partial<StoredQuote>>(job.quote, {});
  let quote: RequestView["quote"] = null;
  if (job.status !== "draft" && typeof stored.price_cents === "number" && stored.expires_at) {
    const other = jt && rushAvailable(jt) && stored.spec ? priceFor(jt, stored.spec, !stored.rush) : null;
    // The job row is what confirmOrder checks, so it decides whether the quote has expired.
    const expiresAt = job.quote_expires_at ?? stored.expires_at;
    quote = {
      price_cents: stored.price_cents,
      currency: stored.currency ?? "usd",
      breakdown: stored.breakdown ?? [],
      turnaround_hours: stored.turnaround_hours ?? job.turnaround_hours ?? 0,
      rush: stored.rush === true,
      expires_at: expiresAt,
      expired: job.status === "quoted" && expiresAt <= nowIso(),
      goals: stored.goals ?? "",
      checklist: (stored.rubric ?? []).map(c => ({ id: c.id, text: c.text, source: c.source, critical: c.critical })),
      rush_option: other ? { rush: other.rush, price_cents: other.price_cents, turnaround_hours: other.turnaround_hours } : null,
    };
  }

  const alternatives = state.classification.alternatives
    .filter(id => id !== job.job_type_id)
    .map(id => getJobType(id))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .map(x => ({ id: x.id, title: x.title, summary: x.summary }));

  return {
    id: job.id,
    status: job.status,
    status_label: STATUS_LABELS[job.status],
    title: job.title,
    created_at: job.created_at,
    request_text: state.requestText ?? "",
    persona,
    job_type: jt ? { id: jt.id, title: jt.title, summary: jt.summary, deliverable: jt.deliverable, area: jt.area, turnaround_hours: jt.turnaround_hours, price_from_usd: jt.price.min_usd, rush_available: rushAvailable(jt) } : null,
    open_request: !jt,
    alternatives,
    details,
    questions,
    ready: state.ready,
    quote,
    goals: state.goals ?? "",
    revisions_allowed: job.revisions_allowed,
    due_at: job.due_at,
    job_url: `/jobs/${job.id}`,
  };
}
