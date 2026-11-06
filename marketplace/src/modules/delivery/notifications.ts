// In-app messages. Owner: delivery module.
// notify() (src/core/email.ts) records every message in the notifications table; this file lists a person's own
// messages, counts the unread ones and keeps read marks (notification_reads, migrations/0013_buyer_choices.sql).
import type { Env } from "../../env.ts";
import { all, first, nowIso } from "../../core/db.ts";
import { eventStatement } from "../../core/events.ts";
import { fail } from "../../core/http.ts";

export interface NotificationView {
  id: string;
  kind: string;
  subject: string;
  text: string;
  /** The full link as emailed. */
  link: string | null;
  /** The same link as an in-app path, e.g. "/jobs/job_1". */
  path: string | null;
  /** The job the message is about, when the link points at one. */
  jobId: string | null;
  emailed: boolean;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export const NOTIFICATION_PAGE = 50;

/** "https://agents.useaiblocks.com/jobs/job_1" -> "/jobs/job_1" for in-app links. */
export function appPath(link: string | null): string | null {
  if (!link) return null;
  try { const u = new URL(link); return u.pathname + u.search; } catch { return null; }
}

/** The job id in /jobs/:id, /requests/:id or /ops/jobs/:id. */
export function jobIdFromPath(path: string | null): string | null {
  const m = path ? /^\/(?:ops\/jobs|jobs|requests)\/([^/?#]+)/.exec(path) : null;
  return m ? decodeURIComponent(m[1]) : null;
}

interface Row { id: string; kind: string; subject: string; body_text: string; link: string | null; status: string; created_at: string; read_at: string | null }

const UNREAD = "NOT EXISTS (SELECT 1 FROM notification_reads r WHERE r.notification_id = n.id)";

/** The person's latest messages, newest first, with read marks and the unread count. */
export async function listNotifications(env: Env, userId: string, opts: { limit?: number } = {}): Promise<{ notifications: NotificationView[]; unread: number }> {
  const limit = Math.min(Math.max(1, opts.limit ?? NOTIFICATION_PAGE), 200);
  const rows = await all<Row>(env.DB,
    `SELECT n.id, n.kind, n.subject, n.body_text, n.link, n.status, n.created_at, r.read_at
     FROM notifications n LEFT JOIN notification_reads r ON r.notification_id = n.id
     WHERE n.user_id = ? ORDER BY n.created_at DESC, n.rowid DESC LIMIT ?`, userId, limit);
  return {
    notifications: rows.map(r => {
      const path = appPath(r.link);
      return {
        id: r.id, kind: r.kind, subject: r.subject, text: r.body_text, link: r.link, path, jobId: jobIdFromPath(path),
        emailed: r.status === "sent", read: !!r.read_at, readAt: r.read_at, createdAt: r.created_at,
      };
    }),
    unread: await unreadCount(env, userId),
  };
}

export async function unreadCount(env: Env, userId: string): Promise<number> {
  const row = await first<{ n: number }>(env.DB, `SELECT COUNT(*) AS n FROM notifications n WHERE n.user_id = ? AND ${UNREAD}`, userId);
  return row?.n ?? 0;
}

/** Mark one of the person's own messages as read. Safe to repeat. Someone else's message is a 404. */
export async function markNotificationRead(env: Env, userId: string, notificationId: string): Promise<void> {
  const db = env.DB;
  const own = await first<{ id: string }>(db, "SELECT id FROM notifications WHERE id = ? AND user_id = ?", notificationId, userId);
  if (!own) return fail(404, "notification_not_found", "We could not find that message.");
  const now = nowIso();
  await db.batch([
    db.prepare("INSERT OR IGNORE INTO notification_reads (notification_id, user_id, read_at) VALUES (?, ?, ?)").bind(own.id, userId, now),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'user', 'notification', ?, 'notification.read', '{}' WHERE changes() = 1")
      .bind(now, userId, own.id),
  ]);
}

/** Mark all of the person's messages as read. Returns how many were unread. */
export async function markAllNotificationsRead(env: Env, userId: string): Promise<number> {
  const db = env.DB, now = nowIso();
  const before = await unreadCount(env, userId);
  if (!before) return 0;
  await db.batch([
    db.prepare(`INSERT OR IGNORE INTO notification_reads (notification_id, user_id, read_at) SELECT n.id, ?, ? FROM notifications n WHERE n.user_id = ? AND ${UNREAD}`)
      .bind(userId, now, userId),
    eventStatement(db, { actor: userId, actorKind: "user", entity: "user", entityId: userId, type: "notifications.read_all", data: { count: before } }, now),
  ]);
  return before;
}
