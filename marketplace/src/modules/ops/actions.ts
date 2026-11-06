// Write side of the ops console. Every action records an event with actorKind "ops".
import type { Env } from "../../env.ts";
import type { JobRow } from "../../core/types.ts";
import { getJob, transitionJob, TRANSITIONS } from "../../core/jobs.ts";
import { all, first, newCode, newId, nowIso, sha256Hex } from "../../core/db.ts";
import { eventStatement, recordEvent } from "../../core/events.ts";
import { fail } from "../../core/http.ts";
import { notify } from "../../core/email.ts";
import { neighbours, settingsOpsIds } from "./service.ts";
import type { BetaCodeView, StaffView } from "./types.ts";

const errText = (err: unknown) => (err instanceof Error ? err.message : String(err));
const RERUN_FROM = ["in_review", "failed", "rejected", "disputed"];

async function loadJob(env: Env, jobId: string): Promise<JobRow> {
  const job = await getJob(env, jobId);
  if (!job) return fail(404, "job_not_found", "We could not find that job.");
  return job;
}

const words = (status: string) => status.replace("_", " ");

/** Tell the buyer about an ops decision. A failed message never blocks the decision. */
async function tellBuyer(env: Env, job: JobRow, kind: string, subject: string, text: string): Promise<void> {
  const link = job.status === "draft" || job.status === "quoted" ? `/requests/${job.id}` : `/jobs/${job.id}`;
  try { await notify(env, { userId: job.created_by, kind, subject, text, link }); }
  catch (err) { console.error("ops_buyer_notice_failed", job.id, errText(err)); }
}

const jobName = (job: JobRow) => (job.title?.trim() ? `"${job.title.trim()}"` : "your job");

// ---------- Job actions ----------

export async function releaseJob(env: Env, input: { jobId: string; draftId: string; actor: string }): Promise<JobRow> {
  const job = await loadJob(env, input.jobId);
  if (job.status !== "in_review") fail(409, "not_in_review", `This job is ${words(job.status)}, so there is no draft waiting for your OK.`);
  const draft = await first<{ id: string; released_at: string | null; version: number }>(env.DB, "SELECT id, released_at, version FROM drafts WHERE id = ? AND job_id = ?", input.draftId, job.id);
  if (!draft) fail(404, "draft_not_found", "That draft does not belong to this job. Refresh the page and pick a draft from the list.");
  if (draft!.released_at) fail(409, "already_released", "The buyer can already see this draft.");
  const { releaseDraft } = await neighbours.delivery();
  const updated = await releaseDraft(env, { jobId: job.id, draftId: draft!.id, actor: input.actor, actorKind: "ops" });
  await recordEvent(env.DB, { actor: input.actor, actorKind: "ops", entity: "job", entityId: job.id, type: "ops.draft_released", data: { draft_id: draft!.id, version: draft!.version } });
  return updated;
}

export async function rerunJob(env: Env, input: { jobId: string; feedback: string; actor: string }): Promise<{ runId: string; job: JobRow }> {
  const job = await loadJob(env, input.jobId);
  if (!RERUN_FROM.includes(job.status)) fail(409, "cannot_rerun", `This job is ${words(job.status)}. You can rerun a job that is waiting for your OK, failed, rejected or disputed.`);
  const { startJobRun } = await neighbours.runner();
  const { runId } = await startJobRun(env, { jobId: job.id, actor: input.actor, actorKind: "ops", kind: "rerun", feedback: input.feedback });
  await recordEvent(env.DB, { actor: input.actor, actorKind: "ops", entity: "job", entityId: job.id, type: "ops.rerun_started", data: { run_id: runId, feedback: input.feedback, from: job.status } });
  return { runId, job: await loadJob(env, job.id) };
}

export async function cancelJob(env: Env, input: { jobId: string; reason: string; actor: string; notifyBuyer?: boolean }): Promise<JobRow> {
  const job = await loadJob(env, input.jobId);
  if (!TRANSITIONS[job.status].includes("cancelled")) {
    fail(409, "cannot_cancel", job.status === "checking"
      ? "Checks are running on this job. Wait a minute, refresh, then cancel."
      : `This job is ${words(job.status)}, so it can no longer be cancelled.`);
  }
  const now = nowIso();
  const updated = await transitionJob(env, {
    jobId: job.id, to: "cancelled", actor: input.actor, actorKind: "ops", data: { reason: input.reason, by: "ops" },
    also: [env.DB.prepare("UPDATE runs SET status = 'cancelled', finished_at = COALESCE(finished_at, ?) WHERE job_id = ? AND status IN ('queued', 'running')").bind(now, job.id)],
  });
  if (input.notifyBuyer !== false) {
    await tellBuyer(env, job, "job.cancelled", "Your job was cancelled",
      `We cancelled ${jobName(job)}. You can start a new job any time. If you have questions, contact us at useaiblocks.com/support.`);
  }
  return updated;
}

export async function assignAgent(env: Env, input: { jobId: string; agentId: string; version?: number; actor: string }): Promise<JobRow> {
  const job = await loadJob(env, input.jobId);
  if (job.status === "accepted" || job.status === "cancelled") fail(409, "job_closed", `This job is ${words(job.status)}, so it will not run again.`);
  if (!job.job_type_id) fail(409, "no_job_type", "This request has no job type yet. Agents are matched by job type, so set one first.");
  const agent = await first<{ id: string; job_type_id: string; status: string; live_version: number | null }>(env.DB, "SELECT id, job_type_id, status, live_version FROM agents WHERE id = ?", input.agentId);
  if (!agent) return fail(404, "agent_not_found", "We could not find that agent.");
  if (agent.job_type_id !== job.job_type_id) fail(400, "wrong_job_type", "That agent does a different job type. Pick an agent for this job's type.");
  if (agent.status === "retired") fail(400, "agent_retired", "That agent is retired. Pick another one, or put it live again first.");
  const published = await all<{ version: number }>(env.DB, "SELECT version FROM agent_versions WHERE agent_id = ? AND status = 'published' ORDER BY version DESC", agent.id);
  let version = input.version;
  if (version === undefined) version = agent.live_version ?? published[0]?.version;
  if (version === undefined) fail(400, "no_published_version", "That agent has no published version yet.");
  if (!published.some(p => p.version === version)) fail(400, "version_not_published", `Version ${version} of that agent is not published. Pick a published version.`);
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE jobs SET agent_id = ?, agent_version = ?, updated_at = ? WHERE id = ?").bind(agent.id, version!, now, job.id),
    eventStatement(db, {
      actor: input.actor, actorKind: "ops", entity: "job", entityId: job.id, type: "ops.agent_assigned",
      data: { agent_id: agent.id, version: version!, previous_agent_id: job.agent_id, previous_version: job.agent_version },
    }, now),
  ]);
  return loadJob(env, job.id);
}

export async function addNote(env: Env, input: { jobId: string; body: string; actor: string }): Promise<{ id: string; body: string; created_at: string }> {
  const job = await loadJob(env, input.jobId);
  const db = env.DB, now = nowIso(), id = newId("note");
  await db.batch([
    db.prepare("INSERT INTO notes (id, entity, entity_id, body, created_by, created_at) VALUES (?, 'job', ?, ?, ?, ?)").bind(id, job.id, input.body, input.actor, now),
    eventStatement(db, { actor: input.actor, actorKind: "ops", entity: "job", entityId: job.id, type: "ops.note_added", data: { note_id: id } }, now),
  ]);
  return { id, body: input.body, created_at: now };
}

/** Decide a rejected or disputed job: accept the work as it stands, rerun it with notes, or cancel it. */
export async function resolveJob(env: Env, input: { jobId: string; outcome: "accept" | "rerun" | "cancel"; note: string; actor: string; notifyBuyer?: boolean }): Promise<{ job: JobRow; runId?: string }> {
  const job = await loadJob(env, input.jobId);
  if (job.status !== "rejected" && job.status !== "disputed") fail(409, "nothing_to_resolve", `This job is ${words(job.status)}. Only rejected or disputed jobs need a decision.`);
  let result: { job: JobRow; runId?: string };
  if (input.outcome === "accept") {
    // A rejected job moves to disputed first: the state machine only accepts from delivered or disputed.
    if (job.status === "rejected") {
      await transitionJob(env, { jobId: job.id, to: "disputed", actor: input.actor, actorKind: "ops", data: { via: "ops_resolve" } });
    }
    const now = nowIso();
    const updated = await transitionJob(env, {
      jobId: job.id, to: "accepted", actor: input.actor, actorKind: "ops",
      data: { via: "ops_resolve", note: input.note }, set: { accepted_at: now, auto_accept_at: null },
    });
    if (input.notifyBuyer !== false) {
      await tellBuyer(env, updated, "job.accepted", "Your job is marked as done",
        `We reviewed ${jobName(job)} and marked it as done. Your work stays on the job page. If you have questions, contact us at useaiblocks.com/support.`);
    }
    result = { job: updated };
  } else if (input.outcome === "rerun") {
    const { startJobRun } = await neighbours.runner();
    const { runId } = await startJobRun(env, { jobId: job.id, actor: input.actor, actorKind: "ops", kind: "rerun", feedback: input.note });
    result = { job: await loadJob(env, job.id), runId };
  } else {
    result = { job: await cancelJob(env, { jobId: job.id, reason: input.note, actor: input.actor, notifyBuyer: input.notifyBuyer }) };
  }
  const note = await addNote(env, { jobId: job.id, body: `Decision (${input.outcome}): ${input.note}`, actor: input.actor });
  await recordEvent(env.DB, { actor: input.actor, actorKind: "ops", entity: "job", entityId: job.id, type: "ops.resolved", data: { outcome: input.outcome, from: job.status, note_id: note.id, run_id: result.runId ?? null } });
  // The job is settled, so the buyer's problem report (if any) closes too instead of waiting at /ops/problems.
  try { await (await neighbours.problems()).closeReportsForJob(env, { jobId: job.id, outcome: input.outcome, note: input.note, actor: input.actor }); }
  catch (err) { console.error("ops_close_problem_reports_failed", job.id, errText(err)); }
  return result;
}

// ---------- Beta codes ----------

export async function listBetaCodes(env: Env): Promise<BetaCodeView[]> {
  const codes = await all<any>(env.DB, "SELECT * FROM beta_codes ORDER BY created_at DESC, code LIMIT 500");
  if (!codes.length) return [];
  const redemptions = await all<{ code: string; user_id: string; email: string | null; created_at: string }>(env.DB, `
    SELECT r.code, r.user_id, u.email, r.created_at FROM beta_redemptions r LEFT JOIN users u ON u.id = r.user_id
    WHERE r.code IN (${codes.map(() => "?").join(", ")}) ORDER BY r.created_at`, ...codes.map(c => c.code));
  const now = nowIso();
  return codes.map(c => ({
    code: c.code, note: c.note, max_uses: c.max_uses, uses: c.uses, created_by: c.created_by, created_at: c.created_at, expires_at: c.expires_at,
    state: c.uses >= c.max_uses ? "used_up" : c.expires_at && c.expires_at < now ? "expired" : "active",
    redeemed: redemptions.filter(r => r.code === c.code).map(r => ({ user_id: r.user_id, email: r.email, at: r.created_at })),
  }));
}

/** Accepts "2026-12-01" (end of that day, UTC) or a full ISO time. Must be in the future. */
export function parseExpiry(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return fail(400, "invalid_input", "The expiry date must be a date such as 2026-12-31.");
  const v = value.trim();
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T23:59:59.999Z` : v;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return fail(400, "invalid_input", "The expiry date must be a date such as 2026-12-31.");
  if (t <= Date.now()) return fail(400, "invalid_input", "The expiry date is in the past. Pick a later date, or leave it empty.");
  return new Date(t).toISOString();
}

export async function createBetaCodes(env: Env, input: { count: number; maxUses: number; note: string; expiresAt: string | null; actor: string }): Promise<string[]> {
  const db = env.DB, now = nowIso();
  const codes = new Set<string>();
  while (codes.size < input.count) codes.add(newCode());
  const list = [...codes];
  await db.batch([
    ...list.map(code => db.prepare("INSERT INTO beta_codes (code, note, max_uses, uses, created_by, created_at, expires_at) VALUES (?, ?, ?, 0, ?, ?, ?)")
      .bind(code, input.note, input.maxUses, input.actor, now, input.expiresAt)),
    ...list.map(code => eventStatement(db, {
      actor: input.actor, actorKind: "ops", entity: "beta_code", entityId: code, type: "beta_code.created",
      data: { max_uses: input.maxUses, note: input.note, expires_at: input.expiresAt },
    }, now)),
  ]);
  return list;
}

// ---------- Staff ----------

export async function listStaff(env: Env): Promise<StaffView> {
  const staff = await all<any>(env.DB, `
    SELECT s.user_id, u.email, s.role, s.granted_by, s.created_at FROM staff s LEFT JOIN users u ON u.id = s.user_id
    ORDER BY s.role, s.created_at, s.user_id`);
  const ids = settingsOpsIds(env);
  const emails = ids.length ? await all<{ id: string; email: string | null }>(env.DB, `SELECT id, email FROM users WHERE id IN (${ids.map(() => "?").join(", ")})`, ...ids) : [];
  return { staff, settings_ops: ids.map(id => ({ user_id: id, email: emails.find(e => e.id === id)?.email ?? null })) };
}

export async function changeStaff(env: Env, input: { action: "add" | "remove"; role: "ops" | "reviewer"; userId?: string; email?: string; actor: string }): Promise<{ user_id: string; changed: boolean; still_ops_from_settings: boolean }> {
  let user: { id: string } | null = null;
  if (input.userId) user = await first<{ id: string }>(env.DB, "SELECT id FROM users WHERE id = ?", input.userId);
  else if (input.email) user = await first<{ id: string }>(env.DB, "SELECT id FROM users WHERE lower(email) = lower(?) ORDER BY created_at LIMIT 1", input.email);
  else fail(400, "invalid_input", "Fill in an email or a user id.");
  if (!user) return fail(404, "user_not_found", "We could not find that person. Ask them to sign in to AI Blocks once, then try again.");
  if (input.action === "remove" && input.role === "ops" && user.id === input.actor) fail(400, "cannot_remove_self", "You cannot remove your own ops access. Ask another team member to do it.");
  const db = env.DB, now = nowIso();
  const change = input.action === "add"
    ? db.prepare("INSERT OR IGNORE INTO staff (user_id, role, granted_by, created_at) VALUES (?, ?, ?, ?)").bind(user.id, input.role, input.actor, now)
    : db.prepare("DELETE FROM staff WHERE user_id = ? AND role = ?").bind(user.id, input.role);
  const results = await db.batch([
    change,
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'ops', 'user', ?, ?, ? WHERE changes() = 1")
      .bind(now, input.actor, user.id, input.action === "add" ? "staff.added" : "staff.removed", JSON.stringify({ role: input.role })),
  ]);
  return {
    user_id: user.id,
    changed: (results[0]?.meta?.changes ?? 0) > 0,
    still_ops_from_settings: input.action === "remove" && input.role === "ops" && settingsOpsIds(env).includes(user.id),
  };
}

// ---------- Seeding ----------

export async function seedAll(env: Env, actor: string, actorKind: "ops" | "system" = "ops"): Promise<{ personas: { created: number; updated: number }; agents: { created: number } }> {
  const contentVersion = await houseContentVersion();
  let personas: { created: number; updated: number };
  try { personas = await (await neighbours.directory()).seedPersonas(env, actor); }
  catch (err) { return fail(503, "seed_failed", `We could not add the agent profiles. The directory said: ${errText(err)}`); }
  let agents: { created: number };
  try { agents = await (await neighbours.runner()).seedHouseAgents(env, actor); }
  catch (err) { return fail(503, "seed_failed", `The agent profiles were added, but the house agents were not. The runner said: ${errText(err)}`); }
  await recordEvent(env.DB, { actor, actorKind, entity: "system", entityId: "seed", type: "ops.seeded", data: { personas, agents, content_version: contentVersion } });
  return { personas, agents };
}

/** A fingerprint of the house content in this build: the job menu version plus every house persona. */
export async function houseContentVersion(): Promise<string> {
  const { housePersonas } = await import("../directory/index.ts");
  const { CATALOGUE_VERSION } = await import("../catalogue/index.ts");
  return `${CATALOGUE_VERSION}/${(await sha256Hex(JSON.stringify(housePersonas()))).slice(0, 16)}`;
}

/**
 * Cron: seed when this build's house content differs from the last seed, so a deploy with new agents or job types
 * goes live on its own (seeding is idempotent and publishes changed packages as new versions). Errors are logged.
 */
export async function seedIfContentChanged(env: Env): Promise<"seeded" | "current" | "failed"> {
  const version = await houseContentVersion();
  const last = await first<{ data: string }>(env.DB, "SELECT data FROM events WHERE entity = 'system' AND entity_id = 'seed' AND type = 'ops.seeded' ORDER BY seq DESC LIMIT 1");
  let lastVersion: unknown = null;
  try { lastVersion = last ? JSON.parse(last.data).content_version : null; } catch { /* old or broken row: seed again */ }
  if (lastVersion === version) return "current";
  try { await seedAll(env, "system", "system"); return "seeded"; }
  catch (err) { console.error("auto_seed_failed", errText(err)); return "failed"; }
}
