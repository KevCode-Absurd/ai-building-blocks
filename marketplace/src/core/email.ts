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

// ---------- Sending (Cloudflare Email Service, "Email Sending") ----------
// The Worker's `send_email` binding (env.EMAIL) sends to any address from a domain onboarded in
// Compute > Email Service > Email Sending (useaiblocks.com). It takes a plain object, so no "cloudflare:" import is needed:
//   await env.EMAIL.send({ to, from: { name, email }, subject, text, html })  ->  { messageId }
// Failures throw an Error with a `code` such as E_SENDER_NOT_VERIFIED, E_RECIPIENT_SUPPRESSED or E_RATE_LIMIT_EXCEEDED.

const DEFAULT_FROM = "AI Blocks <agents@useaiblocks.com>";
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

/** "AI Blocks <agents@useaiblocks.com>" or "agents@useaiblocks.com" -> { name, email }. Null when it is not one address. */
export function parseAddress(value: string): { name: string; email: string } | null {
  const v = (value ?? "").trim();
  if (/[\r\n]/.test(v)) return null;
  const m = /^(.*?)\s*<([^<>]+)>$/.exec(v);
  const name = (m ? m[1] : "").trim().replace(/^"(.*)"$/, "$1").trim();
  const email = (m ? m[2] : v).trim().toLowerCase();
  return EMAIL_RE.test(email) ? { name, email } : null;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The plain text as simple HTML: paragraphs, line breaks and clickable links. */
export function textToHtml(text: string): string {
  const paragraphs = text.replace(/\r\n?/g, "\n").trim().split(/\n{2,}/).map(p =>
    escapeHtml(p).replace(/https?:\/\/[^\s<]+/g, url => `<a href="${url}">${url}</a>`).replace(/\n/g, "<br>"));
  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:16px;line-height:1.5;color:#0a0a0a;max-width:560px">${paragraphs.map(p => `<p style="margin:0 0 16px">${p}</p>`).join("")}</div>`;
}

/** Send one email. Returns true when sent, false when skipped (no sender configured). Throws on a send failure. */
export async function sendEmail(env: Env, to: string, subject: string, text: string): Promise<boolean> {
  if (!env.EMAIL) return false;
  const from = parseAddress(env.EMAIL_FROM || DEFAULT_FROM);
  if (!from) throw new Error("EMAIL_FROM is not a valid sender. Use an address on the onboarded domain, such as AI Blocks <agents@useaiblocks.com>.");
  const recipient = parseAddress(to);
  if (!recipient) throw new Error("That email address is not valid.");
  const cleanSubject = subject.replace(/[\r\n]+/g, " ").trim().slice(0, 200) || "A message from AI Blocks";
  const replyTo = env.EMAIL_REPLY_TO ? parseAddress(env.EMAIL_REPLY_TO) : null;
  try {
    await env.EMAIL.send({
      to: recipient.email,
      from: from.name ? { name: from.name, email: from.email } : from.email,
      ...(replyTo ? { replyTo: replyTo.email } : {}),
      subject: cleanSubject,
      text,
      html: textToHtml(text),
    });
  } catch (err) {
    const code = typeof (err as { code?: unknown })?.code === "string" ? (err as { code: string }).code : "";
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(code && !message.includes(code) ? `${code}: ${message}` : message || code || "send failed");
  }
  return true;
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
