// Founding expert invites. Owner: experts module. Ops invite a named person; the person opens a personal link
// (/experts/invite/<token>), reads what a founding expert does, and applies with the form filled in from the invite.
// Tables: expert_invites (migration 0020) and experts.invite_id. No model calls.
import type { Env } from "../../env.ts";
import { AREAS, type Area } from "../../core/types.ts";
import { all, first, newId, nowIso, parseJson } from "../../core/db.ts";
import { eventStatement } from "../../core/events.ts";
import { fail } from "../../core/http.ts";
import { notify, parseAddress } from "../../core/email.ts";
import { getJobType } from "../catalogue/index.ts";

export const INVITE_LIMITS = { name: { min: 2, max: 80 }, email: 200, areas: 3, jobTypes: 10, note: 2000 } as const;
const TOKEN_RE = /^[A-Za-z0-9_-]{32,64}$/;

export const INVITE_STATUSES = ["created", "opened", "applied", "approved", "rejected", "paused", "revoked"] as const;
export type InviteStatus = (typeof INVITE_STATUSES)[number];

export interface InviteRow {
  id: string; token: string; name: string; email: string | null; areas: string; job_types: string; note: string;
  created_by: string; created_at: string; opened_at: string | null; applied_at: string | null; expert_id: string | null;
  emailed_at: string | null; revoked_at: string | null; updated_at: string;
}
type InviteWithExpert = InviteRow & { expert_status: string | null; expert_name: string | null; reviewed_at: string | null };

/** 24 random bytes as 32 URL-safe characters. */
export function newInviteToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const isInviteToken = (value: unknown): value is string => typeof value === "string" && TOKEN_RE.test(value);

export const inviteLink = (env: Env, token: string) => `${env.APP_ORIGIN.replace(/\/+$/, "")}/experts/invite/${token}`;

export function inviteStatus(r: Pick<InviteWithExpert, "revoked_at" | "expert_id" | "expert_status" | "applied_at" | "opened_at">): InviteStatus {
  if (r.revoked_at) return "revoked";
  if (r.expert_id && (r.expert_status === "approved" || r.expert_status === "rejected" || r.expert_status === "paused")) return r.expert_status;
  if (r.applied_at) return "applied";
  if (r.opened_at) return "opened";
  return "created";
}

export interface OpsInviteView {
  id: string; name: string; email: string | null; areas: string[]; job_types: string[]; note: string;
  status: InviteStatus; link: string;
  created_at: string; opened_at: string | null; applied_at: string | null; decided_at: string | null;
  emailed_at: string | null; revoked_at: string | null;
  expert: { id: string; name: string } | null;
}

function opsView(env: Env, r: InviteWithExpert): OpsInviteView {
  const status = inviteStatus(r);
  return {
    id: r.id, name: r.name, email: r.email, areas: parseJson<string[]>(r.areas, []), job_types: parseJson<string[]>(r.job_types, []), note: r.note,
    status, link: inviteLink(env, r.token),
    created_at: r.created_at, opened_at: r.opened_at, applied_at: r.applied_at,
    decided_at: status === "approved" || status === "rejected" || status === "paused" ? r.reviewed_at : null,
    emailed_at: r.emailed_at, revoked_at: r.revoked_at,
    expert: r.expert_id ? { id: r.expert_id, name: r.expert_name ?? "" } : null,
  };
}

const SELECT_WITH_EXPERT = `SELECT i.*, e.status AS expert_status, e.display_name AS expert_name, e.reviewed_at FROM expert_invites i LEFT JOIN experts e ON e.id = i.expert_id`;

async function inviteById(env: Env, id: string): Promise<InviteWithExpert> {
  return (await first<InviteWithExpert>(env.DB, `${SELECT_WITH_EXPERT} WHERE i.id = ?`, id)) ?? fail(404, "invite_not_found", "We could not find that invite.");
}

// ---------- Ops ----------

export interface InviteInput { name?: unknown; email?: unknown; areas?: unknown; job_types?: unknown; note?: unknown }

function cleanInvite(input: InviteInput): { name: string; email: string | null; areas: Area[]; jobTypes: string[]; note: string } {
  const name = typeof input.name === "string" ? input.name.replace(/\s+/g, " ").trim() : "";
  if (name.length < INVITE_LIMITS.name.min) fail(400, "invalid_input", "Fill in the person's name.");
  if (name.length > INVITE_LIMITS.name.max) fail(400, "invalid_input", `Keep the name under ${INVITE_LIMITS.name.max} characters.`);
  let email: string | null = null;
  if (input.email !== undefined && input.email !== null && input.email !== "") {
    const parsed = typeof input.email === "string" && input.email.length <= INVITE_LIMITS.email ? parseAddress(input.email) : null;
    if (!parsed || parsed.name) fail(400, "invalid_input", "That email address does not look right. Check it, or leave it empty.");
    email = parsed!.email;
  }
  const list = (v: unknown) => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string").map(x => x.trim()).filter(Boolean))] : v === undefined || v === null ? [] : fail(400, "invalid_input", "Areas and jobs must be lists."));
  const areas = list(input.areas);
  if (areas.length > INVITE_LIMITS.areas) fail(400, "invalid_input", `Pick up to ${INVITE_LIMITS.areas} areas.`);
  if (areas.some(a => !AREAS.includes(a as Area))) fail(400, "invalid_input", "Pick areas from the list.");
  const jobTypes = list(input.job_types);
  if (jobTypes.length > INVITE_LIMITS.jobTypes) fail(400, "invalid_input", `Pick up to ${INVITE_LIMITS.jobTypes} jobs.`);
  if (jobTypes.some(id => !getJobType(id))) fail(400, "invalid_input", "One of the jobs is not on the menu. Reload the page and pick again.");
  const note = typeof input.note === "string" ? input.note.trim() : "";
  if (note.length > INVITE_LIMITS.note) fail(400, "invalid_input", `Keep the note under ${INVITE_LIMITS.note} characters.`);
  return { name, email, areas: areas as Area[], jobTypes, note };
}

export async function createInvite(env: Env, input: InviteInput & { actor: string }): Promise<OpsInviteView> {
  const v = cleanInvite(input);
  const db = env.DB, now = nowIso(), id = newId("inv"), token = newInviteToken();
  await db.batch([
    db.prepare(`INSERT INTO expert_invites (id, token, name, email, areas, job_types, note, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(id, token, v.name, v.email, JSON.stringify(v.areas), JSON.stringify(v.jobTypes), v.note, input.actor, now, now),
    eventStatement(db, { actor: input.actor, actorKind: "ops", entity: "expert_invite", entityId: id, type: "expert_invite.created", data: { areas: v.areas, job_types: v.jobTypes, has_email: !!v.email } }, now),
  ]);
  return opsView(env, await inviteById(env, id));
}

export async function listInvites(env: Env): Promise<{ invites: OpsInviteView[]; counts: Record<InviteStatus, number>; total: number }> {
  const rows = await all<InviteWithExpert>(env.DB, `${SELECT_WITH_EXPERT} ORDER BY i.created_at DESC LIMIT 500`);
  const invites = rows.map(r => opsView(env, r));
  const counts = Object.fromEntries(INVITE_STATUSES.map(s => [s, 0])) as Record<InviteStatus, number>;
  for (const i of invites) counts[i.status]++;
  return { invites, counts, total: invites.length };
}

export async function revokeInvite(env: Env, input: { id: string; actor: string }): Promise<OpsInviteView> {
  const row = await inviteById(env, input.id);
  if (row.revoked_at) fail(409, "invite_revoked", "This invite is already revoked.");
  if (row.applied_at) fail(409, "invite_used", "This person has already applied, so the invite cannot be revoked. Review the application instead.");
  const db = env.DB, now = nowIso();
  const res = await db.batch([
    db.prepare("UPDATE expert_invites SET revoked_at = ?, updated_at = ? WHERE id = ? AND revoked_at IS NULL AND applied_at IS NULL").bind(now, now, row.id),
    db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'ops', 'expert_invite', ?, 'expert_invite.revoked', '{}' WHERE changes() = 1`).bind(now, input.actor, row.id),
  ]);
  if (!res[0]?.meta?.changes) fail(409, "invite_changed", "This invite changed just now. Reload and try again.");
  return opsView(env, await inviteById(env, row.id));
}

/** Sends the invite by email, only when ops click "Send invite email". Returns whether it went out. */
export async function emailInvite(env: Env, input: { id: string; actor: string; foundingLeft: number }): Promise<{ invite: OpsInviteView; sent: boolean }> {
  const row = await inviteById(env, input.id);
  if (!row.email) fail(400, "no_email", "This invite has no email address. Copy the link and send it yourself.");
  if (row.revoked_at) fail(409, "invite_revoked", "This invite is revoked, so it cannot be sent.");
  if (row.applied_at) fail(409, "invite_used", "This person has already applied.");
  const firstName = row.name.split(/\s+/)[0]!;
  const spots = input.foundingLeft > 0 ? `${input.foundingLeft} founding spots are left.` : "";
  const id = await notify(env, {
    toEmail: row.email!,
    kind: "expert.invite",
    subject: `${firstName}, you are invited to build an AI agent on AI Blocks`,
    text: `Hi ${firstName},\n\nWe would like you to be a founding expert on AI Blocks. You turn the way you work into an AI agent in our studio. You keep ownership of your method, and businesses can find your agent and you. ${spots}\n\nThis link is just for you. It opens your invite and a short application with your details filled in.`,
    link: `/experts/invite/${row.token}`,
  });
  const sent = (await first<{ status: string }>(env.DB, "SELECT status FROM notifications WHERE id = ?", id))?.status === "sent";
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE expert_invites SET emailed_at = ?, updated_at = ? WHERE id = ?").bind(sent ? now : row.emailed_at, now, row.id),
    eventStatement(db, { actor: input.actor, actorKind: "ops", entity: "expert_invite", entityId: row.id, type: "expert_invite.emailed", data: { sent } }, now),
  ]);
  return { invite: opsView(env, await inviteById(env, row.id)), sent };
}

// ---------- The invited person ----------

export interface PublicInviteView {
  name: string;
  first_name: string;
  areas: string[];
  job_types: string[];
  /** open: they can apply with it. used: an application already came from it. revoked: ops withdrew it. */
  state: "open" | "used" | "revoked";
}

async function inviteByToken(env: Env, token: string): Promise<InviteRow | null> {
  if (!isInviteToken(token)) return null;
  return first<InviteRow>(env.DB, "SELECT * FROM expert_invites WHERE token = ?", token);
}

const NOT_VALID = "This invite link does not work. Check that you copied the whole link from your email, or apply without it.";

/** What the invite page shows. The first visit marks the invite as opened. The email and the note stay private. */
export async function openInvite(env: Env, token: string): Promise<PublicInviteView> {
  const row = await inviteByToken(env, token);
  if (!row) return fail(404, "invite_not_found", NOT_VALID);
  if (!row.opened_at && !row.revoked_at) {
    const db = env.DB, now = nowIso();
    await db.batch([
      db.prepare("UPDATE expert_invites SET opened_at = ?, updated_at = ? WHERE id = ? AND opened_at IS NULL").bind(now, now, row.id),
      db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, 'system', 'system', 'expert_invite', ?, 'expert_invite.opened', '{}' WHERE changes() = 1`).bind(now, row.id),
    ]);
  }
  return {
    name: row.name,
    first_name: row.name.split(/\s+/)[0]!,
    areas: parseJson<string[]>(row.areas, []),
    job_types: parseJson<string[]>(row.job_types, []).filter(id => !!getJobType(id)),
    state: row.revoked_at ? "revoked" : row.applied_at ? "used" : "open",
  };
}

/**
 * Checks an invite token before an application is saved. The invite must exist, not be revoked, and not have been
 * used by someone else (the same expert applying again keeps it). Returns the invite id.
 */
export async function inviteForApplication(env: Env, token: unknown, existingExpertId: string | null): Promise<string> {
  const row = typeof token === "string" ? await inviteByToken(env, token) : null;
  if (!row) return fail(400, "invite_not_valid", NOT_VALID);
  if (row.revoked_at) fail(409, "invite_revoked", "This invite was withdrawn. You can still apply without it.");
  if (row.expert_id && row.expert_id !== existingExpertId) fail(409, "invite_used", "Someone has already applied with this invite. You can still apply without it.");
  return row.id;
}

/** Statements that tie the invite to the expert, for the same batch that saves the application. */
export function claimInviteStatements(db: D1Database, input: { inviteId: string; expertId: string; actor: string; at: string }): D1PreparedStatement[] {
  return [
    db.prepare(`UPDATE expert_invites SET applied_at = COALESCE(applied_at, ?), expert_id = ?, updated_at = ?
      WHERE id = ? AND revoked_at IS NULL AND (expert_id IS NULL OR expert_id = ?) AND EXISTS (SELECT 1 FROM experts WHERE id = ?)`)
      .bind(input.at, input.expertId, input.at, input.inviteId, input.expertId, input.expertId),
    db.prepare("UPDATE experts SET invite_id = ? WHERE id = ? AND EXISTS (SELECT 1 FROM expert_invites WHERE id = ? AND expert_id = ?)")
      .bind(input.inviteId, input.expertId, input.inviteId, input.expertId),
    db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data)
      SELECT ?, ?, 'user', 'expert_invite', ?, 'expert_invite.applied', json_object('expert_id', ?) WHERE changes() = 1`)
      .bind(input.at, input.actor, input.inviteId, input.expertId),
  ];
}
