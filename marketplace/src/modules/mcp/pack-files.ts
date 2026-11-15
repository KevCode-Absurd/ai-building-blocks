// Reads an agent's built pack (dist/packs, served as static assets) for the MCP tools load_agent and get_agent_file,
// so a connected AI can take the agent on in its own chat, on the user's own AI plan. Only paths listed in the
// agent's files.json are read; nothing here runs a model. The layout is in ARCHITECTURE.md ("Agent packs").
import type { Env } from "../../env.ts";
import { bestRoute, type RouteCandidate, type RouteMatch } from "../packs/route.ts";
import { KnowledgeIndex, indexedPath, knowledgeExcerpt, parseSourcesMd, type Answer } from "../packs/retrieve.ts";

export interface PackIndexFile { path: string; url: string; bytes: number; purpose: string; kind: string }
export interface PackIndex {
  agent_id: string;
  version: string;
  updated: string;
  knowledge: unknown; // { status, updated, sources, review_every_days } (older packs: "ready" or "pending")
  zip?: { url: string; bytes: number; version: string };
  train_zip?: { url: string; bytes: number; version: string };
  files: PackIndexFile[];
  /** What a request can be routed to (packs built from 9 Nov 2026). Older packs: built from the skill files' purposes. */
  routes?: RouteCandidate[];
  /**
   * The curated toolbox in short (packs/toolbox.ts, ToolboxSummary), when the role has a toolbox.json. With one,
   * toolbox.md says what to use when and the agent picks for itself, so no skill is routed by keyword.
   */
  toolbox?: { tasks?: unknown[]; counts?: Record<string, number> } | null;
}

/**
 * The files load_agent returns in one go, in reading order: the entry point (with the access levels and safety
 * rules), the method, the toolbox (what to use when) and who the agent is. Rules come before menus, the same order
 * as the chat one-file. Files a pack lacks are skipped.
 */
export const CORE_FILES = ["AGENTS.md", "METHOD.md", "toolbox.md", "soul.md"] as const;
/** A pack built before 15 Nov 2026 has no METHOD.md: its WORK-METHOD.md is the method and takes METHOD.md's place. */
export const OLD_METHOD_FILE = "WORK-METHOD.md";
/** One-line pointers to METHOD.md since 15 Nov 2026: left off the list of other files when METHOD.md is loaded. */
export const METHOD_POINTERS: ReadonlySet<string> = new Set([OLD_METHOD_FILE, "tools/quality/QUALITY-ENGINE-v3.md", "tools/quality/INTAKE.md", "tools/quality/ROUTING.md"]);
/**
 * Rule files: sent whole or not at all, and never cut to fit the load budget, so the method and the access rules
 * always arrive complete and early. Everything else in a first load is reference: cut at a section break when the
 * budget runs out, with the sections left out named, and always a get_agent_file away.
 */
export const WHOLE_FILES: ReadonlySet<string> = new Set(["AGENTS.md", "METHOD.md", OLD_METHOD_FILE, "tools/quality/FOUNDATION.md", "access.md", "OUTPUT-POLICY.md", "soul.md", "personality.md"]);

/** A request that means working inside the user's own tools or accounts. */
const ACCESS_WORDS = /\b(access|accounts?|connect\w*|log ?ins?|sign ?ins?|permissions?|publish\w*|schedul\w+|upload\w*|install\w*|deploy\w*|go(?:es|ing)? live|integrat\w+|api|exports?|dashboards?|ads manager|search console|analytics|crm|inbox|shopify|wordpress|klaviyo|mailchimp|hubspot|quickbooks|xero|stripe|send (?:it|them|out)|post (?:it|them))\b/i;
/** A request for something built, published or sent in its real format, not only written in the chat. */
const NATIVE_WORDS = /\b(build|built|go(?:es|ing)? live|publish\w*|deploy\w*|ship|send|print\w*|export\w*|ready to (?:use|send|publish|post|print)|files?|pdf|pptx?|docx?|xlsx?|csv|html|figma|canva|web ?sites?|web ?pages?|landing pages?|apps?|code|scripts?|spreadsheets?|decks?|slides?|videos?|images?)\b/i;

/** A request for work a business's buyers see, or that reads its numbers: the org context comes first. */
const BUSINESS_WORDS = /\b(ads?|advert\w*|creatives?|campaigns?|copy|copywrit\w*|emails?|newsletters?|sms|landing|home ?page|pages?|web ?sites?|stores?|shop\w*|products?|brand\w*|posts?|captions?|social|reels?|carousels?|statics?|banners?|audit\w*|dashboards?|roas|cro|conversion\w*|funnel\w*|customers?|audiences?|launch\w*|offers?|promo\w*|sales?)\b/i;

/**
 * Files the first load leaves out unless the request needs them, so less is read before any work starts (progressive
 * disclosure: the rules whole and first, reference when a step needs it). The rule for each is stated to the AI, and
 * every one stays a get_agent_file away. `after` names the file it follows; when that one is not in the load, it
 * follows that file's own `after`. A one-file text for chat apps (skillOneFile) carries them all, because a chat
 * cannot fetch a file later.
 */
export const ON_DEMAND_FILES: { path: string; after: string; rule: string; needed(request: string | undefined): boolean }[] = [
  { path: "tools/quality/FOUNDATION.md", after: "METHOD.md", rule: "comes when the request is work for a business: gather, then build or check the org context first (METHOD.md step 1)", needed: r => !!r && BUSINESS_WORDS.test(r) },
  { path: "access.md", after: "tools/quality/FOUNDATION.md", rule: "comes when the request means working in the user's tools or accounts", needed: r => !!r && ACCESS_WORDS.test(r) },
  { path: "OUTPUT-POLICY.md", after: "access.md", rule: "comes when the request asks for something built, published or sent in its real format", needed: r => !!r && NATIVE_WORDS.test(r) },
  { path: "personality.md", after: "soul.md", rule: "comes when you load the agent with no request, to talk as it", needed: r => !r },
  { path: "playbook.md", after: "personality.md", rule: "comes when you load the agent with no request; with a request, read it at METHOD.md step 2 (above light depth) for its deliverables, intake per job and rules learned", needed: r => !r },
  { path: "context/README.md", after: "playbook.md", rule: "comes when you capture the client's context: read it at METHOD.md step 1, before you write context/ files", needed: () => false },
];
/** The first-load files in reading order, for a request (or none), or all of them (`full`). */
export function firstLoadFiles(request: string | undefined, full = false): { paths: string[]; held: { path: string; rule: string }[] } {
  const paths: string[] = [...CORE_FILES];
  const held: { path: string; rule: string }[] = [];
  const afterOf = new Map(ON_DEMAND_FILES.map(f => [f.path, f.after]));
  for (const f of ON_DEMAND_FILES) {
    if (!full && !f.needed(request)) { held.push({ path: f.path, rule: f.rule }); continue; }
    let after: string | undefined = f.after;
    while (after && !paths.includes(after)) after = afterOf.get(after);
    if (!after) paths.push(f.path); else paths.splice(paths.indexOf(after) + 1, 0, f.path);
  }
  return { paths, held };
}
/** Longest file text a tool returns. Role knowledge stays under about 4,500 words, so this only trims outliers. */
export const MAX_FILE_CHARS = 60_000;
/**
 * The file parts of load_agent's first payload: rule files whole, then the routed skill, the toolbox and other
 * reference, then knowledge passages. With the header and the list of other files, the tool result stays under about
 * 92,000 characters (about 23,000 tokens): hosts cut MCP results above about 25,000 tokens.
 */
export const MAX_LOAD_CHARS = 80_000;
/** A one-file text for a chat app (skillOneFile) is a file, not a tool result: every first-load file goes in whole. */
export const MAX_ONE_FILE_CHARS = 240_000;
/** At most this much of knowledge.md goes in the first payload; the rest is a get_agent_file away. */
export const MAX_KNOWLEDGE_CHARS = 16_000;
/** A reference file with less room than this is held back whole (and said so) instead of sent as a stub. */
const MIN_REFERENCE_CHARS = 1_500;

/**
 * Cut a reference file at the last section break ("## " or "### " heading) that fits in `max` characters, and name
 * the sections left out, so the agent knows what to fetch. Falls back to a paragraph break. null: nothing useful fits.
 */
export function cutAtSection(text: string, max: number): { text: string; left_out: string[] } | null {
  if (text.length <= max) return { text, left_out: [] };
  if (max < MIN_REFERENCE_CHARS) return null;
  const head = text.slice(0, max);
  let at = -1;
  for (const m of head.matchAll(/\n(?=#{2,3} )/g)) if (m.index! > 0) at = m.index!;
  if (at < max / 4) at = head.lastIndexOf("\n\n");
  if (at < max / 4) return null;
  const left_out = [...text.slice(at).matchAll(/^#{2,3} (.+)$/gm)].map(m => m[1].trim());
  return { text: text.slice(0, at).trimEnd(), left_out };
}

export class PackUnavailable extends Error {}

/**
 * /agents/<id>/skills/<skill>.txt: one job or role skill with everything the agent reads first, in one plain text
 * file for chat apps (smaller than the whole agent, and led by the method). null when the pack has no such skill.
 */
export async function skillOneFile(env: Env, index: PackIndex, name: string, title: string, skill: string): Promise<string | null> {
  const path = `skills/${skill}/SKILL.md`;
  if (!index.files.some(f => f.path === path)) return null;
  const payload = await loadPayload(env, index, undefined, path, MAX_ONE_FILE_CHARS);
  // A chat app cannot fetch a file later, so this text carries every first-load file (loadPayload, named skill).
  const origin = env.APP_ORIGIN.replace(/\/+$/, "");
  const head = [
    `# ${name}, ${title}: ${skill}, in one file`,
    "",
    `For the AI reading this: each part below is one file of ${name}'s pack and starts with a line such as "===== FILE: METHOD.md =====". Start with the AGENTS.md part and follow it; the ${skill} skill is the job. Other files of the pack are at ${origin}/packs/${index.agent_id}/files.json, and the whole agent is at ${origin}/packs/${index.agent_id}.txt.`,
  ].join("\n");
  const parts = payload.parts.map(p => `===== FILE: ${p.path}${p.path === "knowledge.md" ? ` (${p.note})` : ""} =====\n\n${p.text.trim()}${leftOutNote(p, `${origin}/packs/${index.agent_id}/files.json`)}`);
  return `${[head, ...parts].join("\n\n")}\n`;
}

async function fetchAsset(env: Env, url: string): Promise<Response | null> {
  if (!env.ASSETS) return null;
  const res = await env.ASSETS.fetch(new Request(new URL(url, env.APP_ORIGIN)));
  return res.ok ? res : null;
}

/** The agent's files.json, or null when the agent has no pack (an expert's agent) or the site is not built here. */
export async function readPackIndex(env: Env, agentId: string): Promise<PackIndex | null> {
  const res = await fetchAsset(env, `/packs/${encodeURIComponent(agentId)}/files.json`);
  if (!res) return null;
  try {
    const data = await res.json() as PackIndex;
    return Array.isArray(data?.files) ? data : null;
  } catch { return null; }
}

/** One listed file's text, trimmed to MAX_FILE_CHARS. Throws PackUnavailable when it cannot be read. */
export async function readPackFile(env: Env, file: PackIndexFile, max = MAX_FILE_CHARS): Promise<{ text: string; trimmed: boolean }> {
  if (!file.url.startsWith("/packs/")) throw new PackUnavailable(`${file.path} is not a pack file.`);
  const res = await fetchAsset(env, file.url);
  if (!res) throw new PackUnavailable(`${file.path} could not be read right now.`);
  const text = await res.text();
  return text.length > max ? { text: text.slice(0, max), trimmed: true } : { text, trimmed: false };
}

/** Routing candidates of a pack: its own list, or (older packs) every SKILL.md and workflow by path and purpose. */
export function packRoutes(index: PackIndex): RouteCandidate[] {
  if (Array.isArray(index.routes) && index.routes.length) return index.routes.filter(r => r && typeof r.path === "string" && index.files.some(f => f.path === r.path));
  return index.files.filter(f => /^skills\/[^/]+\/SKILL\.md$/.test(f.path) || /^workflows\/.+\.md$/.test(f.path)).map(f => ({
    path: f.path, kind: f.path.startsWith("workflows/") ? "workflow" as const : "skill" as const,
    name: f.path.split("/")[1].replace(/\.md$/, "").replace(/-/g, " "), text: f.purpose,
  }));
}

export interface LoadPart {
  path: string; text: string; trimmed: boolean; note?: string;
  /** A reference file cut at a section break to fit the load: the headings of the sections left out. */
  left_out?: string[];
}
export interface LoadPayload {
  parts: LoadPart[]; route: RouteMatch | null; sections: string[]; chars: number;
  /** Files of the pack left out of this load, each with the rule that brings it in (ON_DEMAND_FILES). */
  held: { path: string; rule: string }[];
  /** The pack has a curated toolbox: the agent picks from toolbox.md, so nothing was routed. */
  curated: boolean;
}

/** The line after a part cut at a section break: which sections are left out and how to read them. "" when whole. */
export function leftOutNote(part: LoadPart, where = `get_agent_file with path ${part.path}`): string {
  if (!part.left_out) return "";
  const names = part.left_out.slice(0, 12).map(s => `"${s}"`).join(", ");
  const more = part.left_out.length > 12 ? ` and ${part.left_out.length - 12} more` : "";
  return `\n\n[Cut here at a section break to fit this load.${names ? ` Left out: ${names}${more}.` : ""} Read the rest with ${where}.]`;
}

/**
 * The first payload of load_agent, deterministic and bounded by `budget` (MAX_LOAD_CHARS): the core files and the
 * on-demand files the request needs, in reading order (AGENTS.md, METHOD.md, the rule files, toolbox.md, soul.md);
 * then the knowledge.md passages most relevant to the request. Rule files (WHOLE_FILES) always go in whole. The
 * budget left after them goes, in this order, to the routed or named skill, toolbox.md and the other reference files,
 * each cut at a section break with the sections left out named, or held back whole when nothing useful fits; then to
 * knowledge. A pack with a curated toolbox gets no routed skill: the agent chooses from toolbox.md and opens each
 * chosen file by name with get_agent_file. A pack without one (its role has no toolbox.json yet) still gets the
 * skill or workflow the request routes to (route.ts, no model). Everything else stays listed for get_agent_file.
 */
export async function loadPayload(env: Env, index: PackIndex, request?: string, skillPath?: string, budget = MAX_LOAD_CHARS): Promise<LoadPayload> {
  const curated = !!index.toolbox;
  const first = firstLoadFiles(request, !!skillPath);
  const held = first.held.filter(h => index.files.some(x => x.path === h.path));
  const fileAt = (path: string) => index.files.find(x => x.path === path)
    ?? (path === "METHOD.md" ? index.files.find(x => x.path === OLD_METHOD_FILE) : undefined);
  // Read every candidate first, so the budget goes to the rule files before any reference file is sized.
  const read: (LoadPart & { order: number })[] = [];
  for (const [order, path] of first.paths.entries()) {
    const f = fileAt(path);
    if (!f) continue;
    const { text, trimmed } = await readPackFile(env, f);
    read.push({ path: f.path, text, trimmed, order });
  }
  // A named skill (the job-specific one-file text) wins over routing.
  const named = skillPath ? packRoutes(index).find(r => r.path === skillPath) : undefined;
  const route = named ? { candidate: named, score: 0, matched: [] } : request && !curated ? bestRoute(request, packRoutes(index)) : null;
  if (route) {
    const f = index.files.find(x => x.path === route.candidate.path)!;
    const { text, trimmed } = await readPackFile(env, f);
    read.push({ path: f.path, text, trimmed, order: first.paths.length, note: named ? "the skill this file is for" : `routed: matches ${route.matched.slice(0, 6).join(", ") || route.candidate.name}` });
  }
  let chars = read.filter(p => WHOLE_FILES.has(p.path)).reduce((n, p) => n + p.text.length, 0);
  const keep = new Set(read.filter(p => WHOLE_FILES.has(p.path)));
  const ranked = read.filter(p => !keep.has(p)).sort((a, b) => (a.note ? -1 : 0) - (b.note ? -1 : 0) || a.order - b.order);
  for (const p of ranked) {
    const cut = cutAtSection(p.text, budget - chars - 600);
    if (!cut) { held.push({ path: p.path, rule: "comes when you read it with get_agent_file: this first load had no room for it" }); continue; }
    if (cut.text !== p.text) { p.text = cut.text; p.trimmed = true; p.left_out = cut.left_out; }
    chars += p.text.length;
    keep.add(p);
  }
  const parts: LoadPart[] = read.filter(p => keep.has(p)).map(({ order: _, ...p }) => p);
  const left = () => budget - chars;
  const add = (path: string, text: string, trimmed: boolean, note?: string) => { parts.push({ path, text, trimmed, ...(note ? { note } : {}) }); chars += text.length; };
  const sections: string[] = [];
  const knowledge = request || named ? index.files.find(x => x.path === "knowledge.md") : undefined;
  if (knowledge && left() > 2_000) {
    const { text } = await readPackFile(env, knowledge);
    // Passages, not whole sections (retrieve.ts): the parts of knowledge.md this request needs, each under its
    // heading trail, plus one passage of each section every job leans on.
    const { passages, headings } = knowledgeExcerpt(text, `${request ?? ""} ${route?.candidate.name ?? ""} ${route?.candidate.text ?? ""}`, Math.min(MAX_KNOWLEDGE_CHARS, left() - 500));
    if (passages.length) {
      sections.push(...headings);
      add("knowledge.md", passages.map(p => `[${p.context}, lines ${p.lines[0]}-${p.lines[1]}]\n${p.text}`).join("\n\n"), true, `passages from: ${sections.join("; ")}`);
    }
  }
  return { parts, route, sections, chars, held, curated };
}

/** Most pack files one knowledge lookup reads, and how many at a time. */
export const MAX_INDEXED_FILES = 160;
const READ_AT_ONCE = 8;
/** Built indexes kept per Worker, by agent and pack version, so a run of questions reads the files once. */
const indexCache = new Map<string, Promise<KnowledgeIndex>>();
const INDEX_CACHE_SIZE = 16;

/** The agent's own knowledge index: every on-demand file of its pack (retrieve.ts indexedPath), with its sources. */
export function packKnowledgeIndex(env: Env, index: PackIndex): Promise<KnowledgeIndex> {
  const key = `${index.agent_id}@${index.version}`;
  const hit = indexCache.get(key);
  if (hit) return hit;
  const build = (async () => {
    const files = index.files.filter(f => indexedPath(f.path)).slice(0, MAX_INDEXED_FILES);
    const texts: { path: string; text: string }[] = [];
    for (let i = 0; i < files.length; i += READ_AT_ONCE) {
      const got = await Promise.all(files.slice(i, i + READ_AT_ONCE).map(async f => ({ path: f.path, text: (await readPackFile(env, f)).text })));
      texts.push(...got);
    }
    const src = index.files.find(f => f.path === "sources.md");
    const sources = src ? parseSourcesMd((await readPackFile(env, src)).text) : [];
    const k = index.knowledge as { review_every_days?: number } | string | null;
    return new KnowledgeIndex(texts, { sources, reviewDays: typeof k === "object" && k ? k.review_every_days ?? 0 : 0 });
  })();
  build.catch(() => indexCache.delete(key));
  indexCache.set(key, build);
  while (indexCache.size > INDEX_CACHE_SIZE) indexCache.delete(indexCache.keys().next().value!);
  return build;
}

/** ask_agent_knowledge: the passages of an agent's pack that answer a question (one or more phrasings). */
export async function askPack(env: Env, index: PackIndex, questions: string[], opts: { k?: number; today?: string; paths?: string[] } = {}): Promise<Answer> {
  return (await packKnowledgeIndex(env, index)).ask(questions, opts);
}
