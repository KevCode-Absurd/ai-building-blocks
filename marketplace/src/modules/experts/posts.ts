// Businesses post jobs; matching experts reply; the business picks one. Owner: experts module.
// Tables: job_posts, job_post_replies, expert_post_digests (migration 0022). No prices and no model calls.
//
// Who sees what:
//   the business (the post's owner)  its posts, every reply, each replying expert's name, headline and profile link
//   a matching approved expert       open, visible posts in their areas or jobs (no business identity), and their own reply
//   ops                              everything; ops can hide a post from experts
// Picking a reply emails both sides the other's contact email and closes the post. Text is removed when the business
// deletes a post, and from every post 60 days after it was made (the cron).
import type { Env } from "../../env.ts";
import type { ExpertRow } from "../../core/access.ts";
import { AREAS, type Area } from "../../core/types.ts";
import { all, first, newId, nowIso, parseJson } from "../../core/db.ts";
import { eventStatement } from "../../core/events.ts";
import { fail } from "../../core/http.ts";
import { notify } from "../../core/email.ts";
import { getJobType } from "../catalogue/index.ts";
import { areaLabel } from "../directory/views.ts";
import { looksLikeSecret } from "../studio/package.ts";
import { isHttpsLink } from "./schema.ts";
import { publicProfile } from "./profiles.ts";

export const POST_LIMITS = {
  title: { min: 5, max: 120 }, brief: { min: 40, max: 3000 }, url: 500, reply: { min: 10, max: 600 }, hideNote: 500,
  /** Posts one person may make in 24 hours, and may have open at once. */
  perDay: 3, open: 5,
  /** Days until a post's text is removed. */
  keepDays: 60,
  /** Hours between two new-post digests to one expert. */
  digestHours: 24,
} as const;

export const NEEDED_BY = { asap: "As soon as possible", two_weeks: "Within 2 weeks", month: "Within a month", flexible: "No fixed date" } as const;
export type NeededBy = keyof typeof NEEDED_BY;
export type PostStatus = "open" | "picked" | "closed" | "deleted" | "expired";

export interface PostRow {
  id: string; user_id: string; title: string; brief: string | null; website_url: string | null; area: string; job_type_id: string | null;
  needed_by: NeededBy; status: PostStatus; hidden: number; hidden_note: string; picked_reply_id: string | null; text_deleted_at: string | null;
  created_at: string; updated_at: string; expires_at: string; closed_at: string | null;
}
interface ReplyRow { id: string; post_id: string; expert_id: string; note: string; created_at: string }

const addDays = (iso: string, days: number) => new Date(Date.parse(iso) + days * 86_400_000).toISOString();
const SECRET_WORDS = /\b(?:password|passwd|pwd|api[_ -]?key|secret[_ -]?key|access[_ -]?token)\s*[:=]\s*\S{4,}/i;

// ---------- Views ----------

export interface PostView {
  id: string; title: string; brief: string | null; website_url: string | null;
  area: string; area_label: string; job_type: { id: string; title: string } | null;
  needed_by: NeededBy; needed_by_label: string;
  status: PostStatus; hidden: boolean; hidden_note: string | null; text_deleted: boolean;
  created_at: string; expires_at: string; closed_at: string | null;
  reply_count: number;
}

function postView(p: PostRow, replyCount: number, opts: { showHiddenNote: boolean }): PostView {
  const jt = getJobType(p.job_type_id);
  return {
    id: p.id, title: p.title, brief: p.brief, website_url: p.website_url,
    area: p.area, area_label: areaLabel(p.area), job_type: jt ? { id: jt.id, title: jt.title } : p.job_type_id ? { id: p.job_type_id, title: p.job_type_id } : null,
    needed_by: p.needed_by, needed_by_label: NEEDED_BY[p.needed_by] ?? p.needed_by,
    status: p.status, hidden: !!p.hidden, hidden_note: opts.showHiddenNote && p.hidden ? p.hidden_note : null, text_deleted: !!p.text_deleted_at,
    created_at: p.created_at, expires_at: p.expires_at, closed_at: p.closed_at,
    reply_count: replyCount,
  };
}

export interface ReplyView {
  id: string; note: string; created_at: string; picked: boolean;
  expert: { id: string; name: string; headline: string; areas: string[]; profile_url: string | null };
}

async function replyCounts(env: Env, ids: string[]): Promise<Map<string, number>> {
  if (!ids.length) return new Map();
  const rows = await all<{ post_id: string; n: number }>(env.DB,
    `SELECT post_id, COUNT(*) AS n FROM job_post_replies WHERE post_id IN (${ids.map(() => "?").join(",")}) GROUP BY post_id`, ...ids);
  return new Map(rows.map(r => [r.post_id, r.n]));
}

async function repliesFor(env: Env, post: PostRow): Promise<ReplyView[]> {
  const rows = await all<ReplyRow & { display_name: string; headline: string; areas: string; profile_headline: string | null; slug: string | null }>(env.DB,
    `SELECT r.*, e.display_name, e.headline, e.areas, p.headline AS profile_headline, p.slug
     FROM job_post_replies r JOIN experts e ON e.id = r.expert_id LEFT JOIN expert_profiles p ON p.expert_id = e.id
     WHERE r.post_id = ? ORDER BY r.created_at`, post.id);
  const out: ReplyView[] = [];
  for (const r of rows) {
    const profile = r.slug ? await publicProfile(env, r.slug) : null;
    out.push({
      id: r.id, note: r.note, created_at: r.created_at, picked: post.picked_reply_id === r.id,
      expert: { id: r.expert_id, name: r.display_name, headline: r.profile_headline ?? r.headline, areas: parseJson<string[]>(r.areas, []).map(areaLabel), profile_url: profile ? profile.path : null },
    });
  }
  return out;
}

// ---------- The business ----------

export interface PostInput { title?: unknown; brief?: unknown; area?: unknown; job_type_id?: unknown; website_url?: unknown; needed_by?: unknown }

function cleanPost(input: PostInput): { title: string; brief: string; area: Area; jobTypeId: string | null; website: string | null; neededBy: NeededBy } {
  const L = POST_LIMITS;
  const title = typeof input.title === "string" ? input.title.replace(/\s+/g, " ").trim() : "";
  if (title.length < L.title.min) fail(400, "invalid_input", "Add a short title: what the job is, in a few words.");
  if (title.length > L.title.max) fail(400, "invalid_input", `Keep the title under ${L.title.max} characters.`);
  const brief = typeof input.brief === "string" ? input.brief.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim() : "";
  if (brief.length < L.brief.min) fail(400, "invalid_input", "Say a bit more about what you need done: a few sentences is enough.");
  if (brief.length > L.brief.max) fail(400, "invalid_input", `Keep the description under ${L.brief.max} characters.`);
  if (looksLikeSecret(`${title}\n${brief}`) || SECRET_WORDS.test(`${title}\n${brief}`)) {
    fail(400, "remove_secret", "That looks like it has a password or key in it. Remove it, then post again. Never share logins here.");
  }
  if (typeof input.area !== "string" || !AREAS.includes(input.area as Area)) fail(400, "invalid_input", "Pick the area the job is in.");
  const area = input.area as Area;
  let jobTypeId: string | null = null;
  if (input.job_type_id !== undefined && input.job_type_id !== null && input.job_type_id !== "") {
    const jt = typeof input.job_type_id === "string" ? getJobType(input.job_type_id) : null;
    if (!jt) fail(400, "invalid_input", "That job is not on our menu. Pick another one, or leave it empty.");
    jobTypeId = jt!.id;
  }
  let website: string | null = null;
  if (typeof input.website_url === "string" && input.website_url.trim()) {
    website = input.website_url.trim();
    if (!isHttpsLink(website)) fail(400, "invalid_input", "The website must be a full link that starts with https://, or leave it empty.");
  }
  if (typeof input.needed_by !== "string" || !(input.needed_by in NEEDED_BY)) fail(400, "invalid_input", "Say when you need it.");
  return { title, brief, area, jobTypeId, website, neededBy: input.needed_by as NeededBy };
}

export async function createPost(env: Env, input: PostInput & { userId: string }): Promise<PostView> {
  const v = cleanPost(input);
  const db = env.DB, now = nowIso();
  const counts = await first<{ day: number; open: number }>(db,
    `SELECT (SELECT COUNT(*) FROM job_posts WHERE user_id = ?1 AND created_at >= ?2) AS day,
            (SELECT COUNT(*) FROM job_posts WHERE user_id = ?1 AND status = 'open') AS open`, input.userId, addDays(now, -1));
  if ((counts?.day ?? 0) >= POST_LIMITS.perDay) fail(429, "post_limit", `You can post up to ${POST_LIMITS.perDay} jobs a day. Try again tomorrow.`);
  if ((counts?.open ?? 0) >= POST_LIMITS.open) fail(429, "open_post_limit", `You have ${POST_LIMITS.open} open posts. Close one before you post another.`);
  const id = newId("post");
  await db.batch([
    db.prepare(`INSERT INTO job_posts (id, user_id, title, brief, website_url, area, job_type_id, needed_by, status, created_at, updated_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)`)
      .bind(id, input.userId, v.title, v.brief, v.website, v.area, v.jobTypeId, v.neededBy, now, now, addDays(now, POST_LIMITS.keepDays)),
    eventStatement(db, { actor: input.userId, actorKind: "user", entity: "job_post", entityId: id, type: "job_post.created", data: { area: v.area, job_type_id: v.jobTypeId, needed_by: v.neededBy } }, now),
  ]);
  return postView((await first<PostRow>(db, "SELECT * FROM job_posts WHERE id = ?", id))!, 0, { showHiddenNote: true });
}

export async function myPosts(env: Env, userId: string): Promise<{ posts: PostView[]; limits: { perDay: number; open: number } }> {
  const rows = await all<PostRow>(env.DB, "SELECT * FROM job_posts WHERE user_id = ? AND status != 'deleted' ORDER BY created_at DESC LIMIT 100", userId);
  const n = await replyCounts(env, rows.map(r => r.id));
  return { posts: rows.map(r => postView(r, n.get(r.id) ?? 0, { showHiddenNote: true })), limits: { perDay: POST_LIMITS.perDay, open: POST_LIMITS.open } };
}

async function ownPost(env: Env, userId: string, postId: string): Promise<PostRow> {
  const p = await first<PostRow>(env.DB, "SELECT * FROM job_posts WHERE id = ?", postId);
  if (!p || p.user_id !== userId || p.status === "deleted") return fail(404, "post_not_found", "We could not find that post.");
  return p;
}

/** One post. The owner and ops see the replies; a matching expert sees the post and their own reply only. 404 for anyone else. */
export async function getPost(env: Env, input: { postId: string; userId: string; ops: boolean; expert: ExpertRow | null }): Promise<{ post: PostView; replies: ReplyView[] | null; my_reply: { note: string; created_at: string } | null; owner: boolean }> {
  const p = await first<PostRow>(env.DB, "SELECT * FROM job_posts WHERE id = ?", input.postId);
  const missing = () => fail(404, "post_not_found", "We could not find that post.");
  if (!p) return missing();
  const owner = p.user_id === input.userId;
  const count = (await replyCounts(env, [p.id])).get(p.id) ?? 0;
  if ((owner && p.status !== "deleted") || input.ops) {
    return { post: postView(p, count, { showHiddenNote: true }), replies: await repliesFor(env, p), my_reply: null, owner };
  }
  if (input.expert?.status === "approved") {
    const mine = await first<ReplyRow>(env.DB, "SELECT * FROM job_post_replies WHERE post_id = ? AND expert_id = ?", p.id, input.expert.id);
    if (mine || (p.status === "open" && !p.hidden && matches(input.expert, p))) {
      return { post: postView(p, count, { showHiddenNote: false }), replies: null, my_reply: mine ? { note: mine.note, created_at: mine.created_at } : null, owner: false };
    }
  }
  return missing();
}

export async function closePost(env: Env, input: { userId: string; postId: string }): Promise<PostView> {
  const p = await ownPost(env, input.userId, input.postId);
  if (p.status !== "open") fail(409, "post_not_open", "This post is already closed.");
  const db = env.DB, now = nowIso();
  const res = await db.batch([
    db.prepare("UPDATE job_posts SET status = 'closed', closed_at = ?, updated_at = ? WHERE id = ? AND status = 'open'").bind(now, now, p.id),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'user', 'job_post', ?, 'job_post.closed', '{}' WHERE changes() = 1").bind(now, input.userId, p.id),
  ]);
  if (!res[0]?.meta?.changes) fail(409, "post_changed", "This post changed just now. Reload and try again.");
  return postView((await first<PostRow>(db, "SELECT * FROM job_posts WHERE id = ?", p.id))!, (await replyCounts(env, [p.id])).get(p.id) ?? 0, { showHiddenNote: true });
}

/** Deletes a post: its title, description and website are removed at once, along with the replies' notes. */
export async function deletePost(env: Env, input: { userId: string; postId: string }): Promise<void> {
  const p = await ownPost(env, input.userId, input.postId);
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare(`UPDATE job_posts SET status = 'deleted', title = '', brief = NULL, website_url = NULL, text_deleted_at = COALESCE(text_deleted_at, ?),
      closed_at = COALESCE(closed_at, ?), updated_at = ? WHERE id = ?`).bind(now, now, now, p.id),
    db.prepare("UPDATE job_post_replies SET note = '' WHERE post_id = ?").bind(p.id),
    eventStatement(db, { actor: input.userId, actorKind: "user", entity: "job_post", entityId: p.id, type: "job_post.deleted", data: { from: p.status } }, now),
  ]);
}

/** The business picks one reply: the post closes and both sides get the other's contact email. */
export async function pickReply(env: Env, input: { userId: string; postId: string; replyId: unknown }): Promise<PostView> {
  const p = await ownPost(env, input.userId, input.postId);
  if (p.status !== "open") fail(409, "post_not_open", p.status === "picked" ? "You already picked an expert for this post." : "This post is closed, so you cannot pick an expert now.");
  const reply = typeof input.replyId === "string" ? await first<ReplyRow>(env.DB, "SELECT * FROM job_post_replies WHERE id = ? AND post_id = ?", input.replyId, p.id) : null;
  if (!reply) return fail(404, "reply_not_found", "We could not find that reply. Reload the page and pick again.");
  const db = env.DB, now = nowIso();
  const res = await db.batch([
    db.prepare("UPDATE job_posts SET status = 'picked', picked_reply_id = ?, closed_at = ?, updated_at = ? WHERE id = ? AND status = 'open'").bind(reply.id, now, now, p.id),
    db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'user', 'job_post', ?, 'job_post.picked', json_object('reply_id', ?, 'expert_id', ?) WHERE changes() = 1`)
      .bind(now, input.userId, p.id, reply.id, reply.expert_id),
  ]);
  if (!res[0]?.meta?.changes) fail(409, "post_changed", "This post changed just now. Reload and try again.");

  const business = await first<{ email: string | null; email_verified: number }>(db, "SELECT email, email_verified FROM users WHERE id = ?", p.user_id);
  const expert = await first<{ user_id: string; display_name: string; email: string | null; email_verified: number }>(db,
    "SELECT e.user_id, e.display_name, u.email, u.email_verified FROM experts e JOIN users u ON u.id = e.user_id WHERE e.id = ?", reply.expert_id);
  const contact = (u: { email: string | null; email_verified: number } | null) => (u?.email && u.email_verified ? u.email : null);
  const businessEmail = contact(business), expertEmail = contact(expert);
  const missing = "We do not have a checked email for them yet. Reply to this email and we will put you in touch.";
  const safely = async (fn: () => Promise<unknown>) => { try { await fn(); } catch (err) { console.error("experts.post_pick_notify_failed", err instanceof Error ? err.message : String(err)); } };
  await safely(() => notify(env, {
    userId: p.user_id, kind: "job_post.picked",
    subject: `You picked ${expert?.display_name ?? "an expert"} for "${p.title}"`,
    text: `You picked ${expert?.display_name ?? "an expert"} for your job "${p.title}". ${expertEmail ? `Their email is ${expertEmail}. Write to them to agree the details.` : missing} Your post is now closed, so other experts can no longer reply.`,
    link: `/job-posts/${p.id}`,
  }));
  if (expert) {
    await safely(() => notify(env, {
      userId: expert.user_id, kind: "job_post.picked",
      subject: `A business picked you for "${p.title}"`,
      text: `The business that posted "${p.title}" picked you. ${businessEmail ? `Their email is ${businessEmail}. They may write first, or you can.` : missing}`,
      link: "/expert#exp-posts",
    }));
  }
  return postView((await first<PostRow>(db, "SELECT * FROM job_posts WHERE id = ?", p.id))!, (await replyCounts(env, [p.id])).get(p.id) ?? 0, { showHiddenNote: true });
}

// ---------- Experts ----------

const matches = (expert: ExpertRow, p: Pick<PostRow, "area" | "job_type_id">) =>
  parseJson<string[]>(expert.areas, []).includes(p.area) || (!!p.job_type_id && parseJson<string[]>(expert.job_types, []).includes(p.job_type_id));

/** SQL that is true when post `p` matches the expert's areas or jobs (bound: areas JSON, job types JSON). */
const MATCH_SQL = `(p.area IN (SELECT value FROM json_each(?)) OR (p.job_type_id IS NOT NULL AND p.job_type_id IN (SELECT value FROM json_each(?))))`;

/** Open, visible posts that match an approved expert, newest first, with their own reply on each. */
export async function matchingPosts(env: Env, expert: ExpertRow): Promise<{ posts: (PostView & { my_reply: { note: string; created_at: string } | null })[] }> {
  const rows = await all<PostRow & { my_note: string | null; my_at: string | null }>(env.DB,
    `SELECT p.*, r.note AS my_note, r.created_at AS my_at FROM job_posts p
     LEFT JOIN job_post_replies r ON r.post_id = p.id AND r.expert_id = ?
     WHERE p.status = 'open' AND p.hidden = 0 AND p.user_id != ? AND ${MATCH_SQL}
     ORDER BY p.created_at DESC LIMIT 50`, expert.id, expert.user_id, expert.areas, expert.job_types);
  const n = await replyCounts(env, rows.map(r => r.id));
  return {
    posts: rows.map(r => ({ ...postView(r, n.get(r.id) ?? 0, { showHiddenNote: false }), my_reply: r.my_note !== null ? { note: r.my_note, created_at: r.my_at! } : null })),
  };
}

export async function replyToPost(env: Env, input: { expert: ExpertRow; actor: string; postId: string; note: unknown }): Promise<{ note: string; created_at: string }> {
  const p = await first<PostRow>(env.DB, "SELECT * FROM job_posts WHERE id = ?", input.postId);
  if (!p || p.hidden || p.status === "deleted" || p.status === "expired" || !matches(input.expert, p) || p.user_id === input.expert.user_id) {
    return fail(404, "post_not_found", "We could not find that post. It may have closed.");
  }
  if (p.status !== "open") fail(409, "post_not_open", "This post is closed, so it takes no more replies.");
  const note = typeof input.note === "string" ? input.note.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim() : "";
  if (note.length < POST_LIMITS.reply.min) fail(400, "invalid_input", "Write a short note: why you are a good fit for this job.");
  if (note.length > POST_LIMITS.reply.max) fail(400, "invalid_input", `Keep your note under ${POST_LIMITS.reply.max} characters.`);
  if (looksLikeSecret(note) || SECRET_WORDS.test(note)) fail(400, "remove_secret", "That looks like it has a password or key in it. Remove it, then send again.");
  const db = env.DB, now = nowIso(), id = newId("rep");
  const res = await db.batch([
    db.prepare("INSERT INTO job_post_replies (id, post_id, expert_id, note, created_at) SELECT ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM job_posts WHERE id = ? AND status = 'open' AND hidden = 0) ON CONFLICT(post_id, expert_id) DO NOTHING")
      .bind(id, p.id, input.expert.id, note, now, p.id),
    db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'expert', 'job_post', ?, 'job_post.replied', json_object('expert_id', ?, 'reply_id', ?) WHERE changes() = 1`)
      .bind(now, input.actor, p.id, input.expert.id, id),
  ]);
  if (!res[0]?.meta?.changes) {
    const already = await first(env.DB, "SELECT 1 AS ok FROM job_post_replies WHERE post_id = ? AND expert_id = ?", p.id, input.expert.id);
    fail(409, already ? "already_replied" : "post_not_open", already ? "You have already replied to this post. One reply per expert." : "This post is closed, so it takes no more replies.");
  }
  try {
    await notify(env, {
      userId: p.user_id, kind: "job_post.reply",
      subject: `${input.expert.display_name} replied to "${p.title}"`,
      text: `${input.expert.display_name} replied to your job "${p.title}". Open your post to read the note, see their profile and pick an expert.`,
      link: `/job-posts/${p.id}`,
    });
  } catch (err) { console.error("experts.post_reply_notify_failed", err instanceof Error ? err.message : String(err)); }
  return { note, created_at: now };
}

// ---------- Ops ----------

export async function opsPosts(env: Env, filter: { status?: string } = {}): Promise<{ posts: (PostView & { owner_email: string | null })[]; counts: Record<string, number> }> {
  const where = filter.status && filter.status !== "all" ? (filter.status === "hidden" ? "WHERE p.hidden = 1" : "WHERE p.status = ?") : "";
  const params = filter.status && filter.status !== "all" && filter.status !== "hidden" ? [filter.status] : [];
  const rows = await all<PostRow & { owner_email: string | null }>(env.DB,
    `SELECT p.*, u.email AS owner_email FROM job_posts p LEFT JOIN users u ON u.id = p.user_id ${where} ORDER BY p.created_at DESC LIMIT 200`, ...params);
  const n = await replyCounts(env, rows.map(r => r.id));
  const counts = await all<{ status: string; n: number }>(env.DB, "SELECT status, COUNT(*) AS n FROM job_posts GROUP BY status");
  const hidden = (await first<{ n: number }>(env.DB, "SELECT COUNT(*) AS n FROM job_posts WHERE hidden = 1"))?.n ?? 0;
  return {
    posts: rows.map(r => ({ ...postView(r, n.get(r.id) ?? 0, { showHiddenNote: true }), owner_email: r.owner_email })),
    counts: { ...Object.fromEntries(["open", "picked", "closed", "deleted", "expired"].map(s => [s, counts.find(c => c.status === s)?.n ?? 0])), hidden },
  };
}

export async function hidePost(env: Env, input: { postId: string; actor: string; hidden: boolean; note: string }): Promise<PostView> {
  const p = await first<PostRow>(env.DB, "SELECT * FROM job_posts WHERE id = ?", input.postId);
  if (!p) return fail(404, "post_not_found", "We could not find that post.");
  const note = input.note.trim();
  if (input.hidden && note.length < 3) fail(400, "note_required", "Add a note that says why. The business sees it.");
  if (note.length > POST_LIMITS.hideNote) fail(400, "invalid_input", `Keep the note under ${POST_LIMITS.hideNote} characters.`);
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE job_posts SET hidden = ?, hidden_note = ?, updated_at = ? WHERE id = ?").bind(input.hidden ? 1 : 0, input.hidden ? note : "", now, p.id),
    eventStatement(db, { actor: input.actor, actorKind: "ops", entity: "job_post", entityId: p.id, type: input.hidden ? "job_post.hidden" : "job_post.shown", data: { note } }, now),
  ]);
  return postView((await first<PostRow>(db, "SELECT * FROM job_posts WHERE id = ?", p.id))!, (await replyCounts(env, [p.id])).get(p.id) ?? 0, { showHiddenNote: true });
}

// ---------- Cron ----------

/** Removes the text of every post 60 days after it was made; open ones become expired. */
export async function expirePosts(env: Env): Promise<{ expired: number }> {
  const now = nowIso();
  const due = await all<{ id: string; status: string }>(env.DB, "SELECT id, status FROM job_posts WHERE text_deleted_at IS NULL AND expires_at <= ? LIMIT 200", now);
  const db = env.DB;
  for (const p of due) {
    await db.batch([
      db.prepare(`UPDATE job_posts SET title = '', brief = NULL, website_url = NULL, text_deleted_at = ?, status = CASE WHEN status = 'open' THEN 'expired' ELSE status END,
        closed_at = COALESCE(closed_at, ?), updated_at = ? WHERE id = ? AND text_deleted_at IS NULL`).bind(now, now, now, p.id),
      db.prepare("UPDATE job_post_replies SET note = '' WHERE post_id = ?").bind(p.id),
      eventStatement(db, { actor: "system", actorKind: "system", entity: "job_post", entityId: p.id, type: "job_post.expired", data: { from: p.status } }, now),
    ]);
  }
  return { expired: due.length };
}

/** At most once a day per expert: one email listing new open posts that match them. Never one email per post. */
export async function sendPostDigests(env: Env): Promise<{ sent: number }> {
  const db = env.DB, now = nowIso();
  const cutoff = new Date(Date.parse(now) - POST_LIMITS.digestHours * 3_600_000).toISOString();
  const anyOpen = await first<{ n: number }>(db, "SELECT COUNT(*) AS n FROM job_posts WHERE status = 'open' AND hidden = 0");
  if (!anyOpen?.n) return { sent: 0 };
  const experts = await all<ExpertRow & { last_sent_at: string | null }>(db,
    `SELECT e.*, d.last_sent_at FROM experts e LEFT JOIN expert_post_digests d ON d.expert_id = e.id
     WHERE e.status = 'approved' AND (d.last_sent_at IS NULL OR d.last_sent_at <= ?) LIMIT 500`, cutoff);
  let sent = 0;
  for (const e of experts) {
    const since = e.last_sent_at ?? addDays(now, -7);
    const posts = await all<{ id: string; title: string; area: string }>(db,
      `SELECT p.id, p.title, p.area FROM job_posts p WHERE p.status = 'open' AND p.hidden = 0 AND p.user_id != ? AND p.created_at > ? AND ${MATCH_SQL}
       ORDER BY p.created_at DESC LIMIT 11`, e.user_id, since, e.areas, e.job_types);
    if (!posts.length) continue;
    const res = await db.batch([
      db.prepare(`INSERT INTO expert_post_digests (expert_id, last_sent_at) VALUES (?, ?)
        ON CONFLICT(expert_id) DO UPDATE SET last_sent_at = excluded.last_sent_at WHERE expert_post_digests.last_sent_at <= ?`).bind(e.id, now, cutoff),
    ]);
    if (!res[0]?.meta?.changes) continue;
    const list = posts.slice(0, 10).map(p => `- ${p.title} (${areaLabel(p.area)})`).join("\n");
    try {
      await notify(env, {
        userId: e.user_id, kind: "job_post.digest",
        subject: posts.length === 1 ? "A new job matches your work" : `${posts.length > 10 ? "10+" : posts.length} new jobs match your work`,
        text: `Businesses posted ${posts.length === 1 ? "a job" : "jobs"} in your areas:\n\n${list}\n\nRead ${posts.length === 1 ? "it" : "them"} and reply from your expert dashboard. One short note per job. We send this email at most once a day.`,
        link: "/expert#exp-posts",
      });
      sent++;
    } catch (err) { console.error("experts.post_digest_failed", err instanceof Error ? err.message : String(err)); }
  }
  return { sent };
}
