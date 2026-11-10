// Reads an agent's built pack (dist/packs, served as static assets) for the MCP tools load_agent and get_agent_file,
// so a connected AI can take the agent on in its own chat, on the user's own AI plan. Only paths listed in the
// agent's files.json are read; nothing here runs a model. The layout is in ARCHITECTURE.md ("Agent packs").
import type { Env } from "../../env.ts";
import { bestRoute, relevantSections, type RouteCandidate, type RouteMatch } from "../packs/route.ts";

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
 * The files load_agent returns in one go, in reading order: the entry point, the toolbox (what to use when), the
 * work method, what to capture, who the agent is and how it works. Files a pack lacks are skipped.
 */
export const CORE_FILES = ["AGENTS.md", "toolbox.md", "WORK-METHOD.md", "context/README.md", "soul.md", "playbook.md"] as const;

/** A request that means working inside the user's own tools or accounts. */
const ACCESS_WORDS = /\b(access|accounts?|connect\w*|log ?ins?|sign ?ins?|permissions?|publish\w*|schedul\w+|upload\w*|install\w*|deploy\w*|go(?:es|ing)? live|launch\w*|integrat\w+|api|exports?|dashboards?|ads manager|search console|analytics|crm|inbox|shopify|wordpress|klaviyo|mailchimp|hubspot|quickbooks|xero|stripe|send (?:it|them|out)|post (?:it|them))\b/i;
/** A request for something built, published or sent in its real format, not only written in the chat. */
const NATIVE_WORDS = /\b(build|built|launch\w*|publish\w*|deploy\w*|ship|send|print\w*|export\w*|ready to (?:use|send|publish|post|print)|files?|pdf|pptx?|docx?|xlsx?|csv|html|figma|canva|web ?sites?|web ?pages?|landing pages?|apps?|code|scripts?|spreadsheets?|decks?|slides?|videos?|images?)\b/i;

/**
 * Files the first load leaves out unless the request needs them, so less is read before any work starts. The rule
 * for each is stated to the AI, and every one stays a get_agent_file away. A one-file text for chat apps
 * (skillOneFile) carries them all, because a chat cannot fetch a file later.
 */
export const ON_DEMAND_FILES: { path: string; after: string; rule: string; needed(request: string | undefined): boolean }[] = [
  { path: "personality.md", after: "soul.md", rule: "comes when you load the agent with no request, to talk as it", needed: r => !r },
  { path: "access.md", after: "playbook.md", rule: "comes when the request means working in the user's tools or accounts", needed: r => !!r && ACCESS_WORDS.test(r) },
  { path: "OUTPUT-POLICY.md", after: "access.md", rule: "comes when the request asks for something built, published or sent in its real format", needed: r => !!r && NATIVE_WORDS.test(r) },
];
/** The first-load files in reading order, for a request (or none), or all of them (`full`). */
export function firstLoadFiles(request: string | undefined, full = false): { paths: string[]; held: { path: string; rule: string }[] } {
  const paths: string[] = [...CORE_FILES];
  const held: { path: string; rule: string }[] = [];
  for (const f of ON_DEMAND_FILES) {
    if (!full && !f.needed(request)) { held.push({ path: f.path, rule: f.rule }); continue; }
    const at = paths.indexOf(f.after);
    if (at < 0) paths.push(f.path); else paths.splice(at + 1, 0, f.path);
  }
  return { paths, held };
}
/** Longest file text a tool returns. Role knowledge stays under about 4,500 words, so this only trims outliers. */
export const MAX_FILE_CHARS = 60_000;
/** The whole first payload of load_agent: core files, the routed skill and the knowledge sections. */
export const MAX_LOAD_CHARS = 58_000;
/** At most this much of knowledge.md goes in the first payload; the rest is a get_agent_file away. */
export const MAX_KNOWLEDGE_CHARS = 16_000;

export class PackUnavailable extends Error {}

/**
 * /agents/<id>/skills/<skill>.txt: one job or role skill with everything the agent reads first, in one plain text
 * file for chat apps (smaller than the whole agent, and led by the method). null when the pack has no such skill.
 */
export async function skillOneFile(env: Env, index: PackIndex, name: string, title: string, skill: string): Promise<string | null> {
  const path = `skills/${skill}/SKILL.md`;
  if (!index.files.some(f => f.path === path)) return null;
  const payload = await loadPayload(env, index, undefined, path);
  // A chat app cannot fetch a file later, so this text carries every first-load file (loadPayload, named skill).
  const origin = env.APP_ORIGIN.replace(/\/+$/, "");
  const head = [
    `# ${name}, ${title}: ${skill}, in one file`,
    "",
    `For the AI reading this: each part below is one file of ${name}'s pack and starts with a line such as "===== FILE: WORK-METHOD.md =====". Start with the AGENTS.md part and follow it; the ${skill} skill is the job. Other files of the pack are at ${origin}/packs/${index.agent_id}/files.json, and the whole agent is at ${origin}/packs/${index.agent_id}.txt.`,
  ].join("\n");
  const parts = payload.parts.map(p => `===== FILE: ${p.path}${p.path === "knowledge.md" ? ` (${p.note})` : ""} =====\n\n${p.text.trim()}`);
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

export interface LoadPart { path: string; text: string; trimmed: boolean; note?: string }
export interface LoadPayload {
  parts: LoadPart[]; route: RouteMatch | null; sections: string[]; chars: number;
  /** Files of the pack left out of this load, each with the rule that brings it in (ON_DEMAND_FILES). */
  held: { path: string; rule: string }[];
  /** The pack has a curated toolbox: the agent picks from toolbox.md, so nothing was routed. */
  curated: boolean;
}

/**
 * The first payload of load_agent, deterministic and bounded by MAX_LOAD_CHARS: the core files (toolbox.md right
 * after AGENTS.md), plus the on-demand files the request needs; then the knowledge.md sections most relevant to the
 * request. A pack with a curated toolbox gets no routed skill: the agent chooses from toolbox.md and opens each
 * chosen file by name with get_agent_file. A pack without one (its role has no toolbox.json yet) still gets the
 * skill or workflow the request routes to (route.ts, no model) in full. Everything else stays listed for
 * get_agent_file.
 */
export async function loadPayload(env: Env, index: PackIndex, request?: string, skillPath?: string): Promise<LoadPayload> {
  const parts: LoadPart[] = [];
  let chars = 0;
  const left = () => MAX_LOAD_CHARS - chars;
  const add = (path: string, text: string, trimmed: boolean, note?: string) => { parts.push({ path, text, trimmed, ...(note ? { note } : {}) }); chars += text.length; };
  const curated = !!index.toolbox;
  const first = firstLoadFiles(request, !!skillPath);
  const held = first.held.filter(h => index.files.some(x => x.path === h.path));
  for (const path of first.paths) {
    const f = index.files.find(x => x.path === path);
    if (!f) continue;
    const { text, trimmed } = await readPackFile(env, f, Math.max(2_000, Math.min(MAX_FILE_CHARS, left() - 8_000)));
    add(path, text, trimmed);
  }
  // A named skill (the job-specific one-file text) wins over routing.
  const named = skillPath ? packRoutes(index).find(r => r.path === skillPath) : undefined;
  const route = named ? { candidate: named, score: 0, matched: [] } : request && !curated ? bestRoute(request, packRoutes(index)) : null;
  if (route) {
    const f = index.files.find(x => x.path === route.candidate.path)!;
    const { text, trimmed } = await readPackFile(env, f, Math.max(4_000, left() - 4_000));
    add(f.path, text, trimmed, named ? "the skill this file is for" : `routed: matches ${route.matched.slice(0, 6).join(", ") || route.candidate.name}`);
  }
  const sections: string[] = [];
  const knowledge = request || named ? index.files.find(x => x.path === "knowledge.md") : undefined;
  if (knowledge && left() > 2_000) {
    const { text } = await readPackFile(env, knowledge);
    const picked = relevantSections(text, `${request ?? ""} ${route?.candidate.name ?? ""} ${route?.candidate.text ?? ""}`, Math.min(MAX_KNOWLEDGE_CHARS, left() - 500));
    if (picked.length) {
      sections.push(...picked.map(s => s.heading));
      add("knowledge.md", picked.map(s => s.text).join("\n\n"), true, `sections: ${sections.join("; ")}`);
    }
  }
  return { parts, route, sections, chars, held, curated };
}
