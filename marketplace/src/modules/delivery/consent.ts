// Consent to learn from a buyer's edits. Owner: delivery module.
// When a buyer accepts a draft or asks for changes, they may edit the text; decisions.edits keeps a line diff of it.
// Those edits always help fix the buyer's own job (the revision run). Using them beyond that job, for example
// showing them to the agent's maker so the agent gets better for everyone, needs the buyer's yes (default: no).
//
// Where the choice lives (migrations/0013_buyer_choices.sql):
//   decision_consents  one row per decision with edits: the buyer's choice for those edits
//   consents           the org's choice (owner_kind 'org', scope 'learn_from_edits'): the default for the next
//                      decision; turning it off also sets every decision of the org to no
// Reuse rule: the decision's own choice, else the org's choice, else no. Every reuse path must ask
// learnableDecisionIds and drop the edits of any decision that is not on the list.
import type { Env } from "../../env.ts";
import { all, first, nowIso } from "../../core/db.ts";
import { eventStatement, type ActorKind } from "../../core/events.ts";
import { fail } from "../../core/http.ts";

export const LEARN_SCOPE = "learn_from_edits";

/** D1 allows at most 100 bound values per statement. */
const CHUNK = 90;

export interface OrgLearnChoice { granted: boolean; set: boolean; updatedAt: string | null }

/** The org's choice. Never set counts as no. */
export async function orgLearnChoice(env: Env, orgId: string): Promise<OrgLearnChoice> {
  const row = await first<{ granted: number; updated_at: string }>(env.DB,
    "SELECT granted, updated_at FROM consents WHERE owner_kind = 'org' AND owner_id = ? AND scope = ?", orgId, LEARN_SCOPE);
  return { granted: row?.granted === 1, set: !!row, updatedAt: row?.updated_at ?? null };
}

/** What the "use my edits" box starts as for a decision in this org: the org's choice, else no. */
export async function learnDefault(env: Env, orgId: string): Promise<boolean> {
  return (await orgLearnChoice(env, orgId)).granted;
}

/** Records the choice for one decision. Put it in the same batch as (and after) the decision row. */
export function decisionConsentStatement(db: D1Database, c: { decisionId: string; jobId: string; orgId: string; granted: boolean; by: string; at: string }): D1PreparedStatement {
  return db.prepare(
    `INSERT INTO decision_consents (decision_id, job_id, org_id, scope, granted, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(decision_id) DO UPDATE SET granted = excluded.granted, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).bind(c.decisionId, c.jobId, c.orgId, LEARN_SCOPE, c.granted ? 1 : 0, c.by, c.at);
}

/** Out of decisionIds, the decisions whose edits may be used to improve an agent. Decisions without edits are never on it. */
export async function learnableDecisionIds(env: Env, decisionIds: string[]): Promise<Set<string>> {
  const ids = [...new Set(decisionIds.filter(id => typeof id === "string" && id))];
  const out = new Set<string>();
  for (let i = 0; i < ids.length; i += CHUNK) {
    const part = ids.slice(i, i + CHUNK);
    const rows = await all<{ id: string }>(env.DB,
      `SELECT d.id FROM decisions d
       JOIN jobs j ON j.id = d.job_id
       LEFT JOIN decision_consents dc ON dc.decision_id = d.id AND dc.scope = ?
       LEFT JOIN consents oc ON oc.owner_kind = 'org' AND oc.owner_id = j.org_id AND oc.scope = ?
       WHERE d.id IN (${part.map(() => "?").join(", ")}) AND d.edits IS NOT NULL AND COALESCE(dc.granted, oc.granted, 0) = 1`,
      LEARN_SCOPE, LEARN_SCOPE, ...part);
    for (const r of rows) out.add(r.id);
  }
  return out;
}

/** The choice for each decision of a job that has edits: decision id -> yes or no. */
export async function decisionChoices(env: Env, jobId: string): Promise<Map<string, boolean>> {
  const rows = await all<{ id: string }>(env.DB, "SELECT id FROM decisions WHERE job_id = ? AND edits IS NOT NULL", jobId);
  const yes = await learnableDecisionIds(env, rows.map(r => r.id));
  return new Map(rows.map(r => [r.id, yes.has(r.id)]));
}

/** The buyer changes the choice for one decision's edits. */
export async function setDecisionConsent(env: Env, input: { jobId: string; decisionId: string; userId: string; granted: boolean; actorKind?: ActorKind }): Promise<void> {
  const db = env.DB;
  const d = await first<{ id: string; job_id: string; edits: string | null; org_id: string }>(db,
    "SELECT d.id, d.job_id, d.edits, j.org_id FROM decisions d JOIN jobs j ON j.id = d.job_id WHERE d.id = ? AND d.job_id = ?", input.decisionId, input.jobId);
  if (!d) return fail(404, "decision_not_found", "We could not find that decision on this job.");
  if (!d.edits) return fail(409, "no_edits", "You did not change the text in this decision, so there is nothing to share.");
  const now = nowIso();
  await db.batch([
    decisionConsentStatement(db, { decisionId: d.id, jobId: d.job_id, orgId: d.org_id, granted: input.granted, by: input.userId, at: now }),
    eventStatement(db, {
      actor: input.userId, actorKind: input.actorKind ?? "user", entity: "decision", entityId: d.id, type: "consent.learn_from_edits",
      data: { job_id: d.job_id, granted: input.granted, via: "decision" },
    }, now),
  ]);
}

/**
 * The buyer changes the org's choice. Yes: new edits start as shared (the buyer can still untick each one).
 * No: every past decision of the org becomes no as well, so nothing is used from now on.
 * Either way, older edits that never had their own choice are set to no, so turning this on never shares them.
 */
export async function setOrgLearnChoice(env: Env, input: { orgId: string; userId: string; granted: boolean; actorKind?: ActorKind }): Promise<OrgLearnChoice & { withdrawn: number }> {
  const db = env.DB, now = nowIso();
  const shared = input.granted ? null : await first<{ n: number }>(db,
    "SELECT COUNT(*) AS n FROM decision_consents WHERE org_id = ? AND scope = ? AND granted = 1", input.orgId, LEARN_SCOPE);
  const withdrawn = shared?.n ?? 0;
  const statements = [
    db.prepare(
      `INSERT INTO consents (owner_kind, owner_id, scope, granted, updated_by, updated_at) VALUES ('org', ?, ?, ?, ?, ?)
       ON CONFLICT(owner_kind, owner_id, scope) DO UPDATE SET granted = excluded.granted, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    ).bind(input.orgId, LEARN_SCOPE, input.granted ? 1 : 0, input.userId, now),
    db.prepare(
      `INSERT OR IGNORE INTO decision_consents (decision_id, job_id, org_id, scope, granted, updated_by, updated_at)
       SELECT d.id, d.job_id, j.org_id, ?, 0, ?, ? FROM decisions d JOIN jobs j ON j.id = d.job_id
       WHERE j.org_id = ? AND d.edits IS NOT NULL AND NOT EXISTS (SELECT 1 FROM decision_consents dc WHERE dc.decision_id = d.id)`,
    ).bind(LEARN_SCOPE, input.userId, now, input.orgId),
  ];
  if (!input.granted) {
    statements.push(db.prepare("UPDATE decision_consents SET granted = 0, updated_by = ?, updated_at = ? WHERE org_id = ? AND scope = ? AND granted = 1")
      .bind(input.userId, now, input.orgId, LEARN_SCOPE));
  }
  statements.push(eventStatement(db, {
    actor: input.userId, actorKind: input.actorKind ?? "user", entity: "org", entityId: input.orgId, type: "consent.learn_from_edits",
    data: { granted: input.granted, withdrawn, via: "org" },
  }, now));
  await db.batch(statements);
  return { granted: input.granted, set: true, updatedAt: now, withdrawn };
}
