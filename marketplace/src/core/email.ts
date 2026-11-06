// Notifications. notify() records every message in the notifications table (so it shows in the app),
// then emails it when an address is known and email sending is set up.
// Owner: delivery module (it implements sendEmail with Cloudflare Email Sending). Other modules only call notify().
import type { Env } from "../env.ts";
import { first, newId, nowIso } from "./db.ts";

export interface Notice {
  userId?: string;        // recipient user; their email is looked up
  toEmail?: string;       // or an explicit address (ops alerts)
  kind: string;           // e.g. "job.delivered", "expert.approved"
  subject: string;
  text: string;           // plain text body, short, plain words
  link?: string;          // path in the app, e.g. "/jobs/job_123"
}

/** Send one email. Returns true when sent, false when skipped (no sender configured). Throws on a send failure. */
export async function sendEmail(env: Env, to: string, subject: string, text: string): Promise<boolean> {
  void env; void to; void subject; void text;
  return false;
}

export async function notify(env: Env, notice: Notice): Promise<string> {
  const id = newId("ntf");
  let to = notice.toEmail ?? null;
  if (!to && notice.userId) {
    const u = await first<{ email: string | null; email_verified: number }>(env.DB, "SELECT email, email_verified FROM users WHERE id = ?", notice.userId);
    to = u?.email && u.email_verified ? u.email : null;
  }
  const link = notice.link ? new URL(notice.link, env.APP_ORIGIN).toString() : null;
  await env.DB.prepare("INSERT INTO notifications (id, user_id, to_email, kind, subject, body_text, link, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', ?)")
    .bind(id, notice.userId ?? null, to, notice.kind, notice.subject, notice.text, link, nowIso()).run();
  let status: "sent" | "skipped" | "failed" = "skipped", error: string | null = null;
  if (to) {
    try { status = (await sendEmail(env, to, notice.subject, link ? `${notice.text}\n\n${link}` : notice.text)) ? "sent" : "skipped"; }
    catch (err) { status = "failed"; error = err instanceof Error ? err.message.slice(0, 300) : "send failed"; }
  }
  await env.DB.prepare("UPDATE notifications SET status = ?, error = ?, sent_at = ? WHERE id = ?")
    .bind(status, error, status === "sent" ? nowIso() : null, id).run();
  return id;
}
