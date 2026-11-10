// Public expert profiles, share links and the onboarding checklist. Owner: experts module.
// Tables: expert_profiles and users.referred_by_expert (migration 0021). No model calls.
//
// Profiles: /experts/<slug> is public only while the expert is approved and has at least one live agent on a live
// persona; otherwise it is a 404. The slug is set once (from the expert's name) and never changes.
// Share links: /e/<slug> (redirects to the profile) or ?via=<slug> on any page. The first such link a browser
// follows sets the first-party aib_via cookie for 90 days (first touch wins). Visits and agent downloads are plain
// counters on expert_profiles; a sign-up stores the referring expert id on the new user row, and nothing else about
// the visitor is kept anywhere.
import type { Env } from "../../env.ts";
import type { ExpertRow } from "../../core/access.ts";
import { REFERRAL_COOKIE, referralCode } from "../../core/access.ts";
import type { PersonaProfile } from "../../core/types.ts";
import { all, first, nowIso, parseJson } from "../../core/db.ts";
import { eventStatement } from "../../core/events.ts";
import { fail } from "../../core/http.ts";
import { getJobType } from "../catalogue/index.ts";
import { areaLabel } from "../directory/views.ts";
import { expertStudioProgress } from "../studio/service.ts";
import { AGREEMENT_VERSION, DEFAULT_PORTRAIT, bioFromExperience, slugify, type StoredApplication } from "./service.ts";

export const PROFILE_LIMITS = { headline: { min: 5, max: 140 }, bio: { min: 40, max: 800 } } as const;
/** Days the share cookie lasts. */
export const SHARE_COOKIE_DAYS = 90;
/** Paths under /experts/ that are not profiles. */
const RESERVED = new Set(["apply", "invite", "me", "new", "profile", "profiles", "share", "e"]);
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/;
const BOT_RE = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|headless/i;

export interface ProfileRow {
  expert_id: string; slug: string; headline: string | null; bio: string | null; edited_at: string | null;
  link_visits: number; link_downloads: number; created_at: string; updated_at: string;
}

export const isProfileSlug = (s: string) => SLUG_RE.test(s) && !RESERVED.has(s);

/** The expert's profile row, made the first time it is needed (approved experts only). */
export async function ensureProfile(env: Env, expert: ExpertRow): Promise<ProfileRow> {
  const have = await first<ProfileRow>(env.DB, "SELECT * FROM expert_profiles WHERE expert_id = ?", expert.id);
  if (have) return have;
  const base = slugify(expert.display_name).replace(/-+$/, "");
  const candidates = [base, ...[2, 3, 4, 5, 6, 7, 8, 9].map(n => `${base}-${n}`)];
  const now = nowIso();
  for (let i = 0; i < candidates.length + 4; i++) {
    const slug = i < candidates.length ? candidates[i]! : `${base}-${crypto.getRandomValues(new Uint8Array(3)).reduce((s, b) => s + b.toString(16).padStart(2, "0"), "")}`;
    if (!isProfileSlug(slug)) continue;
    const res = await env.DB.prepare(`INSERT INTO expert_profiles (expert_id, slug, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`)
      .bind(expert.id, slug, now, now).run();
    const row = await first<ProfileRow>(env.DB, "SELECT * FROM expert_profiles WHERE expert_id = ?", expert.id);
    if (row) {
      if (res.meta?.changes) await env.DB.batch([eventStatement(env.DB, { actor: "system", actorKind: "system", entity: "expert", entityId: expert.id, type: "expert.profile_created", data: { slug } }, now)]);
      return row;
    }
  }
  return fail(500, "profile_failed", "We could not set up your profile. Try again in a minute.");
}

/** Cron: every approved expert has a profile row, so their page and share link work as soon as an agent is live. */
export async function ensureAllProfiles(env: Env): Promise<void> {
  const rows = await all<ExpertRow>(env.DB, "SELECT e.* FROM experts e WHERE e.status = 'approved' AND NOT EXISTS (SELECT 1 FROM expert_profiles p WHERE p.expert_id = e.id) LIMIT 200");
  for (const r of rows) {
    try { await ensureProfile(env, r); } catch (err) { console.error("experts.ensure_profile_failed", err instanceof Error ? err.message : String(err)); }
  }
}

// ---------- The public page ----------

export interface PublicProfile {
  slug: string;
  name: string;
  headline: string;
  bio: string;
  portrait: string;
  accent: string;
  areas: { id: string; label: string }[];
  agents: { persona_id: string; persona_name: string; job_type_id: string; title: string; summary: string; href: string }[];
  path: string;
}

interface PersonaLite { id: string; name: string; title: string; tagline: string; profile: string; created_at: string }

async function liveAgentsOf(env: Env, expertId: string): Promise<{ personas: PersonaLite[]; agents: PublicProfile["agents"] }> {
  const personas = await all<PersonaLite>(env.DB,
    "SELECT id, name, title, tagline, profile, created_at FROM personas WHERE expert_id = ? AND kind = 'expert' AND status = 'live' ORDER BY created_at", expertId);
  if (!personas.length) return { personas, agents: [] };
  const allPersonas = await all<{ id: string }>(env.DB, "SELECT id FROM personas WHERE expert_id = ? AND kind = 'expert' ORDER BY created_at", expertId);
  const onlyPersona = allPersonas.length === 1 ? allPersonas[0]!.id : null;
  const rows = await all<{ job_type_id: string; persona_id: string | null }>(env.DB,
    "SELECT job_type_id, persona_id FROM agents WHERE kind = 'expert' AND expert_id = ? AND status = 'live' ORDER BY created_at", expertId);
  const byId = new Map(personas.map(p => [p.id, p]));
  const seen = new Set<string>();
  const agents: PublicProfile["agents"] = [];
  for (const r of rows) {
    const persona = byId.get(r.persona_id ?? onlyPersona ?? "");
    if (!persona || seen.has(`${persona.id}:${r.job_type_id}`)) continue;
    seen.add(`${persona.id}:${r.job_type_id}`);
    const jt = getJobType(r.job_type_id);
    agents.push({
      persona_id: persona.id, persona_name: persona.name, job_type_id: r.job_type_id,
      title: jt?.title ?? r.job_type_id, summary: jt?.deliverable || jt?.summary || persona.tagline,
      href: `/agents/${persona.id}`,
    });
  }
  return { personas, agents };
}

/** The public profile, or null when there is no page: unknown slug, expert not approved, or no live agent. */
export async function publicProfile(env: Env, slug: string): Promise<PublicProfile | null> {
  if (!isProfileSlug(slug)) return null;
  const row = await first<ProfileRow & { status: string; display_name: string; app_headline: string; areas: string; application: string }>(env.DB,
    `SELECT p.*, e.status, e.display_name, e.headline AS app_headline, e.areas, e.application FROM expert_profiles p JOIN experts e ON e.id = p.expert_id WHERE p.slug = ?`, slug);
  if (!row || row.status !== "approved") return null;
  const { personas, agents } = await liveAgentsOf(env, row.expert_id);
  if (!agents.length) return null;
  const persona = parseJson<Partial<PersonaProfile>>(personas[0]!.profile, {});
  const app = parseJson<Partial<StoredApplication>>(row.application, {});
  return {
    slug: row.slug,
    name: row.display_name,
    headline: row.headline ?? row.app_headline,
    bio: row.bio ?? persona.bio ?? bioFromExperience(app.experience ?? ""),
    portrait: persona.portrait || DEFAULT_PORTRAIT,
    accent: persona.accent || "#2F6FEB",
    areas: parseJson<string[]>(row.areas, []).map(id => ({ id, label: areaLabel(id) })),
    agents,
    path: `/experts/${row.slug}`,
  };
}

/** Every public profile, for the sitemap. */
export async function publicProfileSlugs(env: Env): Promise<string[]> {
  const rows = await all<{ slug: string }>(env.DB,
    `SELECT p.slug FROM expert_profiles p JOIN experts e ON e.id = p.expert_id
     WHERE e.status = 'approved' AND EXISTS (SELECT 1 FROM personas s WHERE s.expert_id = e.id AND s.kind = 'expert' AND s.status = 'live')
       AND EXISTS (SELECT 1 FROM agents a WHERE a.expert_id = e.id AND a.kind = 'expert' AND a.status = 'live')
     ORDER BY p.created_at`);
  return rows.map(r => r.slug).filter(isProfileSlug);
}

// ---------- The expert's own view ----------

export interface MyProfile {
  slug: string;
  headline: string;
  bio: string;
  edited: boolean;
  public: boolean;
  url: string;
  share: { url: string; visits: number; signups: number; downloads: number };
  limits: typeof PROFILE_LIMITS;
}

export async function myProfile(env: Env, expert: ExpertRow): Promise<MyProfile> {
  const p = await ensureProfile(env, expert);
  const origin = env.APP_ORIGIN.replace(/\/+$/, "");
  const persona = await first<{ profile: string }>(env.DB, "SELECT profile FROM personas WHERE expert_id = ? AND kind = 'expert' ORDER BY created_at LIMIT 1", expert.id);
  const app = parseJson<Partial<StoredApplication>>(expert.application, {});
  const signups = (await first<{ n: number }>(env.DB, "SELECT COUNT(*) AS n FROM users WHERE referred_by_expert = ?", expert.id))?.n ?? 0;
  return {
    slug: p.slug,
    headline: p.headline ?? expert.headline,
    bio: p.bio ?? parseJson<Partial<PersonaProfile>>(persona?.profile, {}).bio ?? bioFromExperience(app.experience ?? ""),
    edited: !!p.edited_at,
    public: !!(await publicProfile(env, p.slug)),
    url: `${origin}/experts/${p.slug}`,
    share: { url: `${origin}/e/${p.slug}`, visits: p.link_visits, signups, downloads: p.link_downloads },
    limits: PROFILE_LIMITS,
  };
}

export async function saveProfile(env: Env, input: { expert: ExpertRow; actor: string; headline: unknown; bio: unknown }): Promise<MyProfile> {
  const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim() : "");
  const headline = clean(input.headline).replace(/\s+/g, " ");
  const bio = clean(input.bio);
  const L = PROFILE_LIMITS;
  if (headline.length < L.headline.min) fail(400, "invalid_input", "Add a headline: one line on what you do and who for.");
  if (headline.length > L.headline.max) fail(400, "invalid_input", `Keep your headline under ${L.headline.max} characters.`);
  if (bio.length < L.bio.min) fail(400, "invalid_input", "Add a short bio: two or three sentences on your work.");
  if (bio.length > L.bio.max) fail(400, "invalid_input", `Keep your bio under ${L.bio.max} characters.`);
  if (/<[a-z/!]/i.test(headline + bio)) fail(400, "invalid_input", "Write plain text, without HTML tags.");
  const p = await ensureProfile(env, input.expert);
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE expert_profiles SET headline = ?, bio = ?, edited_at = ?, updated_at = ? WHERE expert_id = ?").bind(headline, bio, now, now, p.expert_id),
    eventStatement(db, { actor: input.actor, actorKind: "expert", entity: "expert", entityId: p.expert_id, type: "expert.profile_updated", data: { headline_chars: headline.length, bio_chars: bio.length } }, now),
  ]);
  return myProfile(env, input.expert);
}

// ---------- Share links and attribution ----------

const cookieHeader = (env: Env, slug: string) =>
  `${REFERRAL_COOKIE}=${slug}; Max-Age=${SHARE_COOKIE_DAYS * 86_400}; Path=/; SameSite=Lax; HttpOnly${env.APP_ORIGIN.startsWith("https:") ? "; Secure" : ""}`;

const isBot = (req: Request) => BOT_RE.test(req.headers.get("user-agent") ?? "");

/**
 * A visit through an expert's share link. Counts it (not for bots, and not again for a browser that already carries
 * this expert's code) and returns the Set-Cookie value when the browser has no code yet (first touch wins), else
 * null. Unknown codes and experts who are not approved are ignored.
 */
export async function recordShareVisit(env: Env, req: Request, code: string): Promise<{ slug: string; setCookie: string | null } | null> {
  if (!isProfileSlug(code)) return null;
  const p = await first<{ slug: string }>(env.DB, "SELECT p.slug FROM expert_profiles p JOIN experts e ON e.id = p.expert_id WHERE p.slug = ? AND e.status = 'approved'", code);
  if (!p) return null;
  const current = referralCode(req);
  if (current !== p.slug && !isBot(req)) await env.DB.prepare("UPDATE expert_profiles SET link_visits = link_visits + 1 WHERE slug = ?").bind(p.slug).run();
  return { slug: p.slug, setCookie: current || isBot(req) ? null : cookieHeader(env, p.slug) };
}

/** GET /e/<slug>: count the visit, set the cookie, and send the visitor to the profile (or home while it has no page). */
export async function shareRedirect(env: Env, req: Request, code: string): Promise<Response | null> {
  const hit = await recordShareVisit(env, req, code);
  if (!hit) return null;
  const to = (await publicProfile(env, hit.slug)) ? `/experts/${hit.slug}` : "/";
  const headers: Record<string, string> = { location: to, "cache-control": "no-store", "referrer-policy": "strict-origin-when-cross-origin", "x-robots-tag": "noindex" };
  if (hit.setCookie) headers["set-cookie"] = hit.setCookie;
  return new Response(null, { status: 302, headers });
}

/**
 * Someone downloaded or loaded one of an expert's agents. Counted for that expert when the browser's share cookie
 * (or, signed in, the account's referring expert) is theirs. `seen` is the list of agents this browser was already
 * counted for (a cookie), so each agent counts once per browser.
 */
export async function recordAgentUse(env: Env, input: { req: Request; personaId: string; referredBy: string | null }): Promise<boolean> {
  const persona = await first<{ expert_id: string | null }>(env.DB, "SELECT expert_id FROM personas WHERE id = ? AND kind = 'expert' AND status = 'live'", input.personaId);
  if (!persona?.expert_id || isBot(input.req)) return false;
  const code = referralCode(input.req);
  const viaCookie = code ? await first<{ expert_id: string }>(env.DB, "SELECT expert_id FROM expert_profiles WHERE slug = ?", code) : null;
  if (viaCookie?.expert_id !== persona.expert_id && input.referredBy !== persona.expert_id) return false;
  const res = await env.DB.prepare("UPDATE expert_profiles SET link_downloads = link_downloads + 1 WHERE expert_id = ?").bind(persona.expert_id).run();
  return !!res.meta?.changes;
}

export const USED_COOKIE = "aib_via_used";
export function usedAgents(req: Request): string[] {
  const m = /(?:^|;\s*)aib_via_used=([a-z0-9.-]{1,1300})(?:;|$)/.exec(req.headers.get("cookie") ?? "");
  return m ? m[1]!.split(".").filter(Boolean).slice(-20) : [];
}
export const usedCookie = (env: Env, ids: string[]) =>
  `${USED_COOKIE}=${ids.slice(-20).join(".")}; Max-Age=${SHARE_COOKIE_DAYS * 86_400}; Path=/; SameSite=Lax; HttpOnly${env.APP_ORIGIN.startsWith("https:") ? "; Secure" : ""}`;

// ---------- Onboarding checklist ----------

export const CHECKLIST = [
  { id: "agreement", label: "Accept the agreement", help: "Read the founding expert agreement and agree to the current version.", href: "/expert#exp-agreement" },
  { id: "profile", label: "Finish your profile", help: "Write your headline and a short bio for your public page.", href: "/expert#exp-profile" },
  { id: "interview", label: "Do the studio interview", help: "Answer the questions about how you work. Your agent's playbook comes from your answers.", href: "/studio" },
  { id: "examples", label: "Add past work", help: "Add a few pieces of work you are proud of, with the brief behind each one.", href: "/studio" },
  { id: "markup", label: "Mark up AI drafts", help: "Mark the parts of a plain AI draft you would never send, and say why.", href: "/studio" },
  { id: "test", label: "Test against plain AI", help: "Run the test bench to compare your agent with plain AI on the same briefs.", href: "/studio" },
  { id: "live", label: "Go live", help: "Publish a tested version. Once we check it, businesses can find your agent.", href: "/studio" },
  { id: "share", label: "Share your link", help: "Send your share link to people you work with. It counts once someone opens it.", href: "/expert#exp-share" },
] as const;
export type ChecklistId = (typeof CHECKLIST)[number]["id"];

export interface ChecklistView { steps: { id: ChecklistId; label: string; help: string; href: string; done: boolean }[]; done: number; total: number }

/** Each step's done/not-done comes from data that already exists; nothing is ticked by hand. */
export async function onboardingChecklist(env: Env, expert: ExpertRow): Promise<ChecklistView> {
  const profile = await ensureProfile(env, expert);
  const studio = await expertStudioProgress(env, expert.id);
  const live = (await first<{ n: number }>(env.DB, "SELECT COUNT(*) AS n FROM agents WHERE kind = 'expert' AND expert_id = ? AND status = 'live'", expert.id))?.n ?? 0;
  const done: Record<ChecklistId, boolean> = {
    agreement: expert.agreement_version === AGREEMENT_VERSION && !!expert.agreement_accepted_at,
    profile: !!profile.edited_at && (profile.headline ?? "").length >= PROFILE_LIMITS.headline.min && (profile.bio ?? "").length >= PROFILE_LIMITS.bio.min,
    interview: studio.interview,
    examples: studio.examples,
    markup: studio.markup,
    test: studio.test,
    live: live > 0,
    share: profile.link_visits > 0,
  };
  const steps = CHECKLIST.map(s => ({ ...s, done: done[s.id] }));
  return { steps, done: steps.filter(s => s.done).length, total: steps.length };
}

/** The expert agrees to the current agreement version (after it changes). */
export async function acceptAgreement(env: Env, input: { expert: ExpertRow; actor: string; version: unknown }): Promise<void> {
  if (input.version !== AGREEMENT_VERSION) fail(409, "agreement_changed", "The agreement changed while you were reading it. Reload the page and read the new version.");
  if (input.expert.agreement_version === AGREEMENT_VERSION && input.expert.agreement_accepted_at) return;
  const db = env.DB, now = nowIso();
  await db.batch([
    db.prepare("UPDATE experts SET agreement_version = ?, agreement_accepted_at = ?, updated_at = ? WHERE id = ?").bind(AGREEMENT_VERSION, now, now, input.expert.id),
    eventStatement(db, { actor: input.actor, actorKind: "expert", entity: "expert", entityId: input.expert.id, type: "expert.agreement_accepted", data: { version: AGREEMENT_VERSION } }, now),
  ]);
}
