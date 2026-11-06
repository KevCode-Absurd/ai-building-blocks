// Expert applications and status. Owner: experts module.
// Applications, the founding expert agreement, ops review, expert personas and the expert dashboard.
import type { Env } from "../../env.ts";
import type { ExpertRow } from "../../core/access.ts";
import type { Area, PersonaOutcome, PersonaProfile, RubricCriterion } from "../../core/types.ts";
import { all, first, newId, nowIso, parseJson } from "../../core/db.ts";
import type { ActorKind, EventInput } from "../../core/events.ts";
import { fail } from "../../core/http.ts";
import { notify } from "../../core/email.ts";
import { getJobType } from "../catalogue/index.ts";
import { notifyOps } from "../ops/service.ts";
import { winRates } from "../evaluation/service.ts";
import { learnableDecisionIds } from "../delivery/consent.ts";
import { foundingAgreement, type Agreement } from "./agreement.ts";
import { parseApplication, type ValidApplication } from "./schema.ts";

/** The founding-expert agreement version experts accept. The text is a draft until counsel replaces it. */
export const AGREEMENT_VERSION = "founding-draft-2";

/** The first 100 approved experts are founding experts. */
export const FOUNDING_LIMIT = 100;
export const STANDARD_RATE = 0.7;
export const FOUNDING_RATE = 0.75;
export const TAKEDOWN_DAYS = 7;
/** A rejected applicant may apply again this many days after the decision. */
export const REAPPLY_WAIT_DAYS = 30;
/** What we tell applicants about review time. One place to change it. */
export const REVIEW_TIME = "5 working days";
export const DEFAULT_PORTRAIT = "/agents/expert-default.webp";
const ACCENTS = ["#2F6FEB", "#1F8A5B", "#A56A00", "#8E44AD", "#C0392B", "#16808C"];

export interface ExpertApplication {
  display_name: string;
  headline: string;
  areas: string[];            // from AREAS
  job_types: string[];        // catalogue job type ids they want to build agents for
  experience: string;         // years and kind of work, in their words
  claims: { text: string; evidence_url: string }[]; // self-reported, with links
  sample_links: string[];
  country: string;
  agree: boolean;             // accepted AGREEMENT_VERSION
}

/** What is stored in experts.application. */
export type StoredApplication = ValidApplication & { attempt: number; submitted_at: string };

export function agreement(): Agreement {
  return foundingAgreement(AGREEMENT_VERSION, { standard: STANDARD_RATE, founding: FOUNDING_RATE, foundingLimit: FOUNDING_LIMIT, takedownDays: TAKEDOWN_DAYS });
}

export const rateFor = (row: Pick<ExpertRow, "founding">) => (row.founding ? FOUNDING_RATE : STANDARD_RATE);

// ---------- Small helpers ----------

/** An event insert that only writes when guardSql (a SELECT) finds a row, so it commits only with the change it records. */
function eventWhen(db: D1Database, e: EventInput, at: string, guardSql: string, ...guardParams: unknown[]): D1PreparedStatement {
  return db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (${guardSql})`)
    .bind(at, e.actor, e.actorKind, e.entity, e.entityId, e.type, JSON.stringify(e.data ?? {}), ...guardParams);
}

async function safely(what: string, fn: () => Promise<unknown>): Promise<void> {
  try { await fn(); } catch (err) { console.error(`experts.${what}_failed`, err instanceof Error ? err.message : String(err)); }
}

const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const addDays = (iso: string, days: number) => new Date(Date.parse(iso) + days * 86_400_000).toISOString();

/** When a rejected applicant may apply again, or null when they are not rejected. */
export function reapplyAt(row: Pick<ExpertRow, "status" | "reviewed_at">): string | null {
  if (row.status !== "rejected" || !row.reviewed_at) return null;
  return addDays(row.reviewed_at, REAPPLY_WAIT_DAYS);
}

export function slugify(text: string): string {
  const slug = text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/g, "");
  return slug || "expert";
}

function randomHex(chars: number): string {
  const bytes = new Uint8Array(Math.ceil(chars / 2));
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, chars);
}

/** "Conversion copywriter for SaaS founders" -> "Conversion copywriter". */
export function titleFromHeadline(headline: string): string {
  const cut = headline.split(/\s+(?:for|at|who|with|helping)\s+|[,.;:|(]|\s[-–—]\s/i)[0]!.trim();
  const title = cut.length >= 3 ? cut : headline.trim();
  return title.length > 60 ? `${title.slice(0, 59).trimEnd()}…` : title;
}

/** The first two or three sentences of their experience, as the persona bio. */
export function bioFromExperience(experience: string): string {
  const text = experience.replace(/\s+/g, " ").trim();
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [text];
  let bio = "";
  for (const s of sentences.slice(0, 3)) {
    if ((bio + s).length > 600) break;
    bio += s;
  }
  bio = bio.trim() || text.slice(0, 600);
  return bio.length > 600 ? `${bio.slice(0, 599).trimEnd()}…` : bio;
}

// ---------- Views (what the API returns) ----------

export interface ExpertView {
  id: string;
  status: ExpertRow["status"];
  display_name: string;
  headline: string;
  areas: string[];
  job_types: string[];
  application: StoredApplication | null;
  founding: boolean;
  rate: number;
  agreement: { version: string | null; accepted_at: string | null; current_version: string; current: boolean };
  note: string;
  reviewed_at: string | null;
  applied_at: string;
  can_reapply_at: string | null;
  created_at: string;
  updated_at: string;
}

export function expertView(row: ExpertRow): ExpertView {
  const application = parseJson<StoredApplication | null>(row.application, null);
  return {
    id: row.id,
    status: row.status,
    display_name: row.display_name,
    headline: row.headline,
    areas: parseJson<string[]>(row.areas, []),
    job_types: parseJson<string[]>(row.job_types, []),
    application: application && Object.keys(application).length ? application : null,
    founding: !!row.founding,
    rate: rateFor(row),
    agreement: { version: row.agreement_version, accepted_at: row.agreement_accepted_at, current_version: AGREEMENT_VERSION, current: row.agreement_version === AGREEMENT_VERSION },
    note: row.review_note,
    reviewed_at: row.reviewed_at,
    applied_at: application?.submitted_at ?? row.created_at,
    can_reapply_at: reapplyAt(row),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function foundingSpots(env: Env): Promise<{ limit: number; taken: number; left: number }> {
  const row = await first<{ n: number }>(env.DB, "SELECT COUNT(*) AS n FROM experts WHERE founding = 1");
  const taken = row?.n ?? 0;
  return { limit: FOUNDING_LIMIT, taken, left: Math.max(0, FOUNDING_LIMIT - taken) };
}

export async function getExpertForUser(env: Env, userId: string): Promise<ExpertRow | null> {
  return first<ExpertRow>(env.DB, "SELECT * FROM experts WHERE user_id = ?", userId);
}

// ---------- Apply ----------

function assertCanApply(existing: ExpertRow, now: string): void {
  if (existing.status === "applied") fail(409, "already_applied", `You have already applied. We will email you within ${REVIEW_TIME}.`);
  if (existing.status === "approved") fail(409, "already_approved", "You are already an approved expert. Open your expert dashboard to build agents.");
  if (existing.status === "paused") fail(409, "expert_paused", "Your expert account is on hold. Contact us through Help & contact if you have questions.");
  const at = reapplyAt(existing);
  if (at && at > now) fail(409, "reapply_too_soon", `You can apply again from ${longDate(at)}.`);
}

export async function applyAsExpert(env: Env, input: { userId: string; application: ExpertApplication }): Promise<ExpertRow> {
  const app = parseApplication(input.application);
  const db = env.DB, now = nowIso();
  const existing = await getExpertForUser(env, input.userId);
  if (existing) assertCanApply(existing, now);
  const attempt = existing ? (parseJson<Partial<StoredApplication>>(existing.application, {}).attempt ?? 1) + 1 : 1;
  const stored: StoredApplication = { ...app, attempt, submitted_at: now };
  const id = existing?.id ?? newId("exp");
  const event: EventInput = {
    actor: input.userId, actorKind: "user", entity: "expert", entityId: id, type: "expert.applied",
    data: { areas: app.areas, job_types: app.job_types, agreement_version: AGREEMENT_VERSION, attempt },
  };
  const fields = [app.display_name, app.headline, JSON.stringify(app.areas), JSON.stringify(app.job_types), JSON.stringify(stored), AGREEMENT_VERSION, now];

  if (!existing) {
    const res = await db.batch([
      db.prepare(`INSERT INTO experts (id, user_id, status, display_name, headline, areas, job_types, application, founding, agreement_version, agreement_accepted_at, review_note, created_at, updated_at)
        VALUES (?, ?, 'applied', ?, ?, ?, ?, ?, 0, ?, ?, '', ?, ?) ON CONFLICT(user_id) DO NOTHING`).bind(id, input.userId, ...fields, now, now),
      eventWhen(db, event, now, "SELECT 1 FROM experts WHERE id = ?", id),
    ]);
    if (!res[0]?.meta?.changes) fail(409, "already_applied", `You have already applied. We will email you within ${REVIEW_TIME}.`);
  } else {
    const res = await db.batch([
      db.prepare(`UPDATE experts SET status = 'applied', display_name = ?, headline = ?, areas = ?, job_types = ?, application = ?, agreement_version = ?, agreement_accepted_at = ?,
        review_note = '', reviewed_by = NULL, reviewed_at = NULL, updated_at = ? WHERE id = ? AND status = 'rejected' AND updated_at = ?`).bind(...fields, now, id, existing.updated_at),
      eventWhen(db, event, now, "SELECT 1 FROM experts WHERE id = ? AND status = 'applied' AND updated_at = ?", id, now),
    ]);
    if (!res[0]?.meta?.changes) fail(409, "application_changed", "Your application changed while you were sending it. Reload the page and try again.");
  }

  const row = (await first<ExpertRow>(db, "SELECT * FROM experts WHERE id = ?", id))!;
  await safely("notify_ops", () => notifyOps(env, {
    kind: "expert.applied",
    subject: `New expert application: ${app.display_name}`,
    text: `${app.display_name} applied as an expert${attempt > 1 ? ` (application ${attempt})` : ""}.\n${app.headline}\nAreas: ${app.areas.join(", ")}\nJobs: ${app.job_types.join(", ")}\nCountry: ${app.country}\nReview it in the ops console.`,
    link: `/ops/experts?status=applied&expert=${id}`,
  }));
  await safely("notify_applicant", () => notify(env, {
    userId: input.userId,
    kind: "expert.applied",
    subject: "We got your expert application",
    text: `Thanks for applying to build agents on AI Blocks. We read every application and check the links you sent. We will email you within ${REVIEW_TIME}.`,
    link: "/expert",
  }));
  return row;
}

// ---------- Review (ops) ----------

const DECISION_STATUS = { approve: "approved", reject: "rejected", pause: "paused" } as const;
const ALLOWED_FROM: Record<ExpertRow["status"], ExpertRow["status"][]> = {
  approved: ["applied", "paused", "rejected"],
  rejected: ["applied", "paused"],
  paused: ["applied", "approved"],
  applied: [],
};
const CANNOT: Record<string, string> = {
  "approved>approved": "This expert is already approved.",
  "rejected>rejected": "This application is already rejected.",
  "approved>rejected": "This expert is approved. Pause them instead of rejecting.",
  "paused>paused": "This expert is already paused.",
  "rejected>paused": "This application is rejected, so there is nothing to pause.",
};

/** Ops decision. Approving the first 100 sets founding = 1 (75% founding rate if paid work is added later). Emails the expert. */
export async function reviewApplication(env: Env, input: { expertId: string; decision: "approve" | "reject" | "pause"; note: string; actor: string }): Promise<ExpertRow> {
  const to = DECISION_STATUS[input.decision];
  if (!to) return fail(400, "invalid_decision", "Choose approve, reject or pause.");
  const note = (input.note ?? "").trim();
  if (note.length > 2000) fail(400, "invalid_note", "Keep the note under 2000 characters.");
  if (input.decision !== "approve" && note.length < 3) fail(400, "note_required", "Add a note that says why. The expert will see it.");
  const db = env.DB, now = nowIso();
  const row = await first<ExpertRow>(db, "SELECT * FROM experts WHERE id = ?", input.expertId);
  if (!row) return fail(404, "expert_not_found", "We could not find that application.");
  if (!ALLOWED_FROM[to].includes(row.status)) fail(409, "invalid_review", CANNOT[`${row.status}>${to}`] ?? `This application is ${row.status}, so it cannot be ${to} now.`);

  const guard = "SELECT 1 FROM experts WHERE id = ? AND status = ? AND updated_at = ?";
  const stmts: D1PreparedStatement[] = [
    db.prepare(`UPDATE experts SET status = ?,
        founding = CASE WHEN ? = 1 AND founding = 0 AND (SELECT COUNT(*) FROM experts WHERE founding = 1) < ? THEN 1 ELSE founding END,
        review_note = ?, reviewed_by = ?, reviewed_at = ?, updated_at = ?
      WHERE id = ? AND status = ? AND updated_at = ?`)
      .bind(to, input.decision === "approve" ? 1 : 0, FOUNDING_LIMIT, note, input.actor, now, now, row.id, row.status, row.updated_at),
  ];

  let personaId: string | null = null;
  if (input.decision === "approve") {
    const has = await first<{ id: string }>(db, "SELECT id FROM personas WHERE expert_id = ? ORDER BY created_at LIMIT 1", row.id);
    if (!has) {
      const p = await newPersonaFor(env, row);
      personaId = p.id;
      stmts.push(
        db.prepare(`INSERT INTO personas (id, kind, expert_id, name, title, tagline, area, profile, status, sort, content_hash, created_at, updated_at)
          SELECT ?, 'expert', ?, ?, ?, ?, ?, ?, 'hidden', 1000, '', ?, ?
          WHERE NOT EXISTS (SELECT 1 FROM personas WHERE expert_id = ?) AND EXISTS (${guard})`)
          .bind(p.id, row.id, p.name, p.title, p.tagline, p.area, JSON.stringify(p.profile), now, now, row.id, row.id, to, now),
        eventWhen(db, { actor: input.actor, actorKind: "ops", entity: "persona", entityId: p.id, type: "persona.created", data: { kind: "expert", expert_id: row.id, status: "hidden" } },
          now, "SELECT 1 FROM personas WHERE id = ? AND created_at = ?", p.id, now),
      );
    }
  }
  if (input.decision === "pause") {
    stmts.push(db.prepare(`UPDATE personas SET status = 'hidden', updated_at = ? WHERE expert_id = ? AND status = 'live' AND EXISTS (${guard})`).bind(now, row.id, row.id, to, now));
  }
  // The review event reads founding back after the update, so it records what was granted.
  stmts.push(db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data)
      SELECT ?, ?, 'ops', 'expert', e.id, ?, json_object('from', ?, 'note', ?, 'founding', e.founding, 'persona_id', (SELECT p.id FROM personas p WHERE p.expert_id = e.id ORDER BY p.created_at LIMIT 1))
      FROM experts e WHERE e.id = ? AND e.status = ? AND e.updated_at = ?`)
    .bind(now, input.actor, `expert.${to}`, row.status, note, row.id, to, now));

  const res = await db.batch(stmts);
  if (!res[0]?.meta?.changes) fail(409, "application_changed", "Someone changed this application just now. Reload and try again.");

  const updated = (await first<ExpertRow>(db, "SELECT * FROM experts WHERE id = ?", row.id))!;
  if (input.decision === "approve" && !personaId) await safely("sync_persona", () => syncExpertPersona(env, row.id, input.actor, "ops"));
  await safely("notify_expert", () => notify(env, reviewNotice(updated, input.decision, note)));
  return updated;
}

function reviewNotice(row: ExpertRow, decision: "approve" | "reject" | "pause", note: string) {
  const noteLine = note ? `\n\nNote from our team: ${note}` : "";
  if (decision === "approve") {
    const rate = row.founding
      ? `You are one of our first ${FOUNDING_LIMIT} experts. Hiring is free for buyers right now. If we add paid work later, you get the ${Math.round(FOUNDING_RATE * 100)}% founding rate.`
      : `Hiring is free for buyers right now. If we add paid work later, you earn ${Math.round(STANDARD_RATE * 100)}% of the net amount from jobs your agents do.`;
    return {
      userId: row.user_id, kind: "expert.approved", link: "/studio",
      subject: "You are approved as an AI Blocks expert",
      text: `Welcome, ${row.display_name.split(/\s+/)[0]}. Next, build your first agent in the studio. We check it before buyers can hire it. ${rate}${noteLine}`,
    };
  }
  if (decision === "reject") {
    const at = reapplyAt(row);
    return {
      userId: row.user_id, kind: "expert.rejected", link: "/expert",
      subject: "About your AI Blocks expert application",
      text: `Thank you for applying. We cannot approve your application this time.${noteLine}${at ? `\n\nYou can apply again from ${longDate(at)}.` : ""}`,
    };
  }
  return {
    userId: row.user_id, kind: "expert.paused", link: "/expert",
    subject: "Your AI Blocks expert account is on hold",
    text: `We have put your expert account on hold. Your agent page is hidden from buyers for now.${noteLine}\n\nContact us through Help & contact if you have questions.`,
  };
}

// ---------- Expert personas ----------

interface PersonaDraft { id: string; name: string; title: string; tagline: string; area: Area; profile: PersonaProfile }

async function newPersonaFor(env: Env, row: ExpertRow): Promise<PersonaDraft> {
  const app = parseJson<Partial<StoredApplication>>(row.application, {});
  const base = slugify(row.display_name);
  let id = "";
  for (let i = 0; i < 6; i++) {
    id = `${base}-${randomHex(i < 3 ? 4 : 8)}`;
    if (!(await first(env.DB, "SELECT 1 AS ok FROM personas WHERE id = ?", id))) break;
  }
  const areas = parseJson<Area[]>(row.areas, []);
  const accent = ACCENTS[parseInt(randomHex(2), 16) % ACCENTS.length]!;
  return {
    id,
    name: row.display_name.trim().split(/\s+/)[0]!,
    title: titleFromHeadline(row.headline),
    tagline: row.headline.trim(),
    area: areas[0] ?? "marketing",
    profile: {
      bio: bioFromExperience(app.experience ?? row.headline),
      outcomes: [],
      capabilities: [],
      good_at: [],
      not_for: [],
      samples: [],
      accent,
      portrait: DEFAULT_PORTRAIT,
      look: "",
      method: "",
      source_roles: [],
    },
  };
}

/**
 * Keeps an expert's personas in step with their agents: one outcome per job type with a live agent, and status
 * 'live' only while the expert is approved and has at least one live agent. Studio can call this after an agent
 * goes live or is retired; the 15-minute cron also runs it for every expert persona.
 */
export async function syncExpertPersona(env: Env, expertId: string, actor = "system", actorKind: ActorKind = "system"): Promise<{ changed: number }> {
  const db = env.DB;
  const expert = await first<ExpertRow>(db, "SELECT * FROM experts WHERE id = ?", expertId);
  if (!expert) return { changed: 0 };
  const personas = await all<{ id: string; status: string; profile: string; updated_at: string }>(db,
    "SELECT id, status, profile, updated_at FROM personas WHERE expert_id = ? AND kind = 'expert' ORDER BY created_at", expertId);
  const onlyPersona = personas.length === 1;
  let changed = 0;
  for (const p of personas) {
    const live = await all<{ job_type_id: string }>(db,
      `SELECT job_type_id FROM agents WHERE expert_id = ? AND status = 'live' AND (persona_id = ? OR (persona_id IS NULL AND ? = 1))
       GROUP BY job_type_id ORDER BY MIN(created_at)`, expertId, p.id, onlyPersona ? 1 : 0);
    const liveIds = new Set(live.map(a => a.job_type_id));
    const profile = parseJson<PersonaProfile>(p.profile, {} as PersonaProfile);
    const before = profile.outcomes ?? [];
    const outcomes: PersonaOutcome[] = before.filter(o => !o.job_type_id || liveIds.has(o.job_type_id));
    for (const { job_type_id } of live) {
      if (outcomes.some(o => o.job_type_id === job_type_id)) continue;
      const jt = getJobType(job_type_id);
      outcomes.push({ id: job_type_id.replace(/[^a-z0-9]+/gi, "_").toLowerCase(), title: jt?.title ?? job_type_id, deliverable: jt?.deliverable ?? "", job_type_id });
    }
    const status = expert.status === "approved" && outcomes.some(o => o.job_type_id && liveIds.has(o.job_type_id)) ? "live" : "hidden";
    if (status === p.status && JSON.stringify(outcomes) === JSON.stringify(before)) continue;
    const now = nowIso();
    const res = await db.batch([
      db.prepare("UPDATE personas SET profile = ?, status = ?, updated_at = ? WHERE id = ? AND updated_at = ?")
        .bind(JSON.stringify({ ...profile, outcomes }), status, now, p.id, p.updated_at),
      eventWhen(db, { actor, actorKind, entity: "persona", entityId: p.id, type: "persona.synced", data: { status, outcomes: outcomes.map(o => o.job_type_id) } },
        now, "SELECT 1 FROM personas WHERE id = ? AND updated_at = ?", p.id, now),
    ]);
    if (res[0]?.meta?.changes) changed++;
  }
  return { changed };
}

/** Cron: sync every expert persona. */
export async function syncAllExpertPersonas(env: Env): Promise<void> {
  const rows = await all<{ expert_id: string }>(env.DB, "SELECT DISTINCT expert_id FROM personas WHERE kind = 'expert' AND expert_id IS NOT NULL");
  for (const r of rows) await safely("sync_persona", () => syncExpertPersona(env, r.expert_id));
}

// ---------- Ops list ----------

export interface OpsExpertView extends ExpertView {
  user_id: string;
  email: string | null;
  reviewed_by: string | null;
  persona: { id: string; name: string; status: string } | null;
  agents: { total: number; live: number };
}

export async function listApplications(env: Env, filter: { status?: string; area?: string; jobType?: string; q?: string; limit?: number } = {}) {
  const where: string[] = [], params: unknown[] = [];
  if (filter.status && filter.status !== "all") { where.push("e.status = ?"); params.push(filter.status); }
  if (filter.area) { where.push("EXISTS (SELECT 1 FROM json_each(e.areas) WHERE value = ?)"); params.push(filter.area); }
  if (filter.jobType) { where.push("EXISTS (SELECT 1 FROM json_each(e.job_types) WHERE value = ?)"); params.push(filter.jobType); }
  if (filter.q) {
    const like = `%${filter.q.replace(/[\\%_]/g, m => `\\${m}`)}%`;
    where.push("(e.display_name LIKE ? ESCAPE '\\' OR e.headline LIKE ? ESCAPE '\\' OR u.email LIKE ? ESCAPE '\\')");
    params.push(like, like, like);
  }
  const limit = Number.isFinite(filter.limit) ? Math.min(Math.max(Math.trunc(filter.limit!), 1), 500) : 200;
  const rows = await all<ExpertRow & { email: string | null; persona_id: string | null; persona_name: string | null; persona_status: string | null; agents_total: number; agents_live: number }>(env.DB,
    `SELECT e.*, u.email,
       (SELECT p.id FROM personas p WHERE p.expert_id = e.id ORDER BY p.created_at LIMIT 1) AS persona_id,
       (SELECT p.name FROM personas p WHERE p.expert_id = e.id ORDER BY p.created_at LIMIT 1) AS persona_name,
       (SELECT p.status FROM personas p WHERE p.expert_id = e.id ORDER BY p.created_at LIMIT 1) AS persona_status,
       (SELECT COUNT(*) FROM agents a WHERE a.expert_id = e.id) AS agents_total,
       (SELECT COUNT(*) FROM agents a WHERE a.expert_id = e.id AND a.status = 'live') AS agents_live
     FROM experts e LEFT JOIN users u ON u.id = e.user_id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY (e.status = 'applied') DESC, CASE WHEN e.status = 'applied' THEN e.updated_at END ASC, e.updated_at DESC
     LIMIT ${limit}`, ...params);
  const counts = await all<{ status: string; n: number }>(env.DB, "SELECT status, COUNT(*) AS n FROM experts GROUP BY status");
  const experts: OpsExpertView[] = rows.map(r => ({
    ...expertView(r),
    user_id: r.user_id,
    email: r.email,
    reviewed_by: r.reviewed_by,
    persona: r.persona_id ? { id: r.persona_id, name: r.persona_name ?? "", status: r.persona_status ?? "hidden" } : null,
    agents: { total: r.agents_total, live: r.agents_live },
  }));
  return {
    experts,
    counts: Object.fromEntries(["applied", "approved", "rejected", "paused"].map(s => [s, counts.find(c => c.status === s)?.n ?? 0])) as Record<ExpertRow["status"], number>,
    founding: await foundingSpots(env),
  };
}

// ---------- Expert dashboard ----------

export interface WinRateView { tests: number; judgments: number; agent_wins: number; baseline_wins: number; ties: number; rate: number | null }
export interface AgentStats { jobs: number; accepted: number; rejected: number; revision_requests: number; ratings: number; avg_rating: number | null; acceptance_rate: number | null }

export interface ExpertDashboard {
  expert: { id: string; display_name: string; founding: boolean; rate: number };
  personas: { id: string; name: string; title: string; status: string }[];
  agents: {
    id: string; name: string; job_type_id: string; job_type_title: string; status: string; live_version: number | null; persona_id: string | null;
    versions: { version: number; status: string; changelog: string; created_at: string; published_at: string | null }[];
    stats: AgentStats;
    win_rate: WinRateView | null;
  }[];
  jobs: {
    id: string; title: string; job_type_id: string | null; job_type_title: string; agent_id: string; agent_name: string; agent_version: number | null;
    status: string; outcome: "accepted" | "auto_accepted" | "rejected" | "open" | "stopped"; rating: number | null; revisions_used: number;
    created_at: string; delivered_at: string | null; accepted_at: string | null;
  }[];
  feedback: {
    id: string; job_id: string; job_title: string; agent_id: string; kind: "accept" | "revise" | "reject";
    reasons: string; failed_checks: { id: string; text: string }[]; rating: number | null;
    has_edits: boolean; edits_shared: boolean; edits: unknown; at: string;
  }[];
  totals: AgentStats & { agents: number; live_agents: number };
  win_rates_available: boolean;
}

const emptyStats = (): AgentStats => ({ jobs: 0, accepted: 0, rejected: 0, revision_requests: 0, ratings: 0, avg_rating: null, acceptance_rate: null });

function finishStats(s: AgentStats, ratingSum: number): AgentStats {
  const decided = s.accepted + s.rejected;
  return { ...s, avg_rating: s.ratings ? Math.round((ratingSum / s.ratings) * 10) / 10 : null, acceptance_rate: decided ? s.accepted / decided : null };
}

async function agentWinRates(env: Env): Promise<{ ok: boolean; byAgent: (agentId: string) => WinRateView | null }> {
  try {
    const rows = await winRates(env, "agent");
    return {
      ok: true,
      byAgent: agentId => {
        // Keys are agent ids; per-version keys such as "agt_x:2" or "agt_x@2" are summed.
        const mine = rows.filter(r => r.key === agentId || r.key.split(/[:@#/]/)[0] === agentId);
        if (!mine.length) return null;
        const sum = (k: "tests" | "judgments" | "agentWins" | "baselineWins" | "ties") => mine.reduce((n, r) => n + (r[k] ?? 0), 0);
        const agentWins = sum("agentWins"), baselineWins = sum("baselineWins");
        const rate = mine.length === 1 ? mine[0]!.winRate : agentWins + baselineWins ? agentWins / (agentWins + baselineWins) : null;
        return { tests: sum("tests"), judgments: sum("judgments"), agent_wins: agentWins, baseline_wins: baselineWins, ties: sum("ties"), rate };
      },
    };
  } catch (err) {
    console.error("experts.win_rates_failed", err instanceof Error ? err.message : String(err));
    return { ok: false, byAgent: () => null };
  }
}

function shareEdits(raw: string | null): unknown {
  if (!raw) return null;
  const text = raw.length > 20_000 ? raw.slice(0, 20_000) : raw;
  try { return JSON.parse(text); } catch { return text; }
}

export async function expertDashboard(env: Env, expertId: string): Promise<ExpertDashboard> {
  const db = env.DB;
  const expert = await first<ExpertRow>(db, "SELECT * FROM experts WHERE id = ?", expertId);
  if (!expert) return fail(404, "expert_not_found", "We could not find your expert account.");
  const rate = rateFor(expert);

  const personas = await all<{ id: string; name: string; title: string; status: string }>(db,
    "SELECT id, name, title, status FROM personas WHERE expert_id = ? ORDER BY created_at", expertId);
  const agents = await all<{ id: string; name: string; job_type_id: string; status: string; live_version: number | null; persona_id: string | null; created_at: string }>(db,
    "SELECT id, name, job_type_id, status, live_version, persona_id, created_at FROM agents WHERE expert_id = ? ORDER BY created_at", expertId);
  const versions = await all<{ agent_id: string; version: number; status: string; changelog: string; created_at: string; published_at: string | null }>(db,
    `SELECT v.agent_id, v.version, v.status, v.changelog, v.created_at, v.published_at FROM agent_versions v JOIN agents a ON a.id = v.agent_id
     WHERE a.expert_id = ? ORDER BY v.agent_id, v.version DESC`, expertId);
  const jobs = await all<{ id: string; title: string; job_type_id: string | null; status: string; agent_id: string; agent_version: number | null; revisions_used: number; org_id: string; created_at: string; delivered_at: string | null; accepted_at: string | null }>(db,
    `SELECT j.id, j.title, j.job_type_id, j.status, j.agent_id, j.agent_version, j.revisions_used, j.org_id, j.created_at, j.delivered_at, j.accepted_at
     FROM jobs j JOIN agents a ON a.id = j.agent_id WHERE a.expert_id = ? ORDER BY j.created_at DESC`, expertId);
  const decisions = await all<{ id: string; job_id: string; kind: "accept" | "revise" | "reject" | "auto_accept"; reasons: string; failed_criteria: string; edits: string | null; rating: number | null; created_at: string; org_id: string }>(db,
    `SELECT d.id, d.job_id, d.kind, d.reasons, d.failed_criteria, d.edits, d.rating, d.created_at, j.org_id
     FROM decisions d JOIN jobs j ON j.id = d.job_id JOIN agents a ON a.id = j.agent_id
     WHERE a.expert_id = ? ORDER BY d.created_at DESC, d.id DESC`, expertId);
  // Buyer edits are shown only when the buyer agreed that those edits may be used to improve the agent
  // (the decision's own choice, else the org's choice, else no: see src/modules/delivery/consent.ts).
  const sharing = await learnableDecisionIds(env, decisions.filter(d => !!d.edits).map(d => d.id));
  const rubricRows = await all<{ job_id: string; criteria: string }>(db,
    "SELECT r.job_id, r.criteria FROM rubrics r JOIN jobs j ON j.id = r.job_id JOIN agents a ON a.id = j.agent_id WHERE a.expert_id = ?", expertId);
  const rubricText = new Map(rubricRows.map(r => [r.job_id, new Map(parseJson<RubricCriterion[]>(r.criteria, []).map(c => [c.id, c.text]))]));
  const wins = await agentWinRates(env);

  const byJob = new Map<string, typeof decisions>();
  for (const d of decisions) byJob.set(d.job_id, [...(byJob.get(d.job_id) ?? []), d]);
  const agentName = new Map(agents.map(a => [a.id, a.name]));

  const perAgent = new Map<string, { s: AgentStats; ratingSum: number }>();
  const total = { s: emptyStats(), ratingSum: 0 };
  const entryFor = (agentId: string) => {
    let entry = perAgent.get(agentId);
    if (!entry) { entry = { s: emptyStats(), ratingSum: 0 }; perAgent.set(agentId, entry); }
    return entry;
  };

  const jobViews: ExpertDashboard["jobs"] = jobs.map(j => {
    const ds = byJob.get(j.id) ?? [];
    const entry = entryFor(j.agent_id);
    for (const s of [entry.s, total.s]) {
      s.jobs++;
      if (j.status === "accepted") s.accepted++;
      if (j.status === "rejected") s.rejected++;
      s.revision_requests += ds.filter(d => d.kind === "revise").length;
    }
    for (const d of ds) {
      if (d.rating === null) continue;
      entry.s.ratings++; entry.ratingSum += d.rating;
      total.s.ratings++; total.ratingSum += d.rating;
    }
    const jobTypeTitle = getJobType(j.job_type_id)?.title ?? (j.job_type_id ?? "");
    const outcome = j.status === "accepted" ? (ds.some(d => d.kind === "auto_accept") && !ds.some(d => d.kind === "accept") ? "auto_accepted" : "accepted")
      : j.status === "rejected" ? "rejected"
      : ["failed", "cancelled", "disputed"].includes(j.status) ? "stopped" : "open";
    return {
      id: j.id, title: j.title || jobTypeTitle || "Untitled job", job_type_id: j.job_type_id, job_type_title: jobTypeTitle,
      agent_id: j.agent_id, agent_name: agentName.get(j.agent_id) ?? "", agent_version: j.agent_version,
      status: j.status, outcome, rating: ds.find(d => d.rating !== null)?.rating ?? null, revisions_used: j.revisions_used,
      created_at: j.created_at, delivered_at: j.delivered_at, accepted_at: j.accepted_at,
    };
  });

  const jobById = new Map(jobViews.map(j => [j.id, j]));
  const feedback: ExpertDashboard["feedback"] = decisions
    .filter(d => d.kind === "revise" || d.kind === "reject" || (d.kind === "accept" && (!!d.edits || !!d.reasons.trim())))
    .slice(0, 100)
    .map(d => {
      const job = jobById.get(d.job_id)!;
      const shared = sharing.has(d.id);
      const texts = rubricText.get(d.job_id);
      return {
        id: d.id, job_id: d.job_id, job_title: job.title, agent_id: job.agent_id,
        kind: d.kind as "accept" | "revise" | "reject",
        reasons: d.reasons,
        failed_checks: parseJson<string[]>(d.failed_criteria, []).map(id => ({ id, text: texts?.get(id) ?? id.replace(/_/g, " ") })),
        rating: d.rating,
        has_edits: !!d.edits,
        edits_shared: !!d.edits && shared,
        edits: shared ? shareEdits(d.edits) : null,
        at: d.created_at,
      };
    });

  const versionsBy = new Map<string, ExpertDashboard["agents"][number]["versions"]>();
  for (const v of versions) versionsBy.set(v.agent_id, [...(versionsBy.get(v.agent_id) ?? []), { version: v.version, status: v.status, changelog: v.changelog, created_at: v.created_at, published_at: v.published_at }]);

  const agentViews: ExpertDashboard["agents"] = agents.map(a => {
    const entry = perAgent.get(a.id);
    return {
      id: a.id, name: a.name, job_type_id: a.job_type_id, job_type_title: getJobType(a.job_type_id)?.title ?? a.job_type_id,
      status: a.status, live_version: a.live_version, persona_id: a.persona_id,
      versions: versionsBy.get(a.id) ?? [],
      stats: entry ? finishStats(entry.s, entry.ratingSum) : emptyStats(),
      win_rate: wins.byAgent(a.id),
    };
  });

  const totals = { ...finishStats(total.s, total.ratingSum), agents: agents.length, live_agents: agents.filter(a => a.status === "live").length };
  return {
    expert: { id: expert.id, display_name: expert.display_name, founding: !!expert.founding, rate },
    personas,
    agents: agentViews,
    jobs: jobViews.slice(0, 200),
    feedback,
    totals,
    win_rates_available: wins.ok,
  };
}
