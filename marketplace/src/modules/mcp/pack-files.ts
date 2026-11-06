// Reads an agent's built pack (dist/packs, served as static assets) for the MCP tools load_agent and get_agent_file,
// so a connected AI can take the agent on in its own chat, on the user's own AI plan. Only paths listed in the
// agent's files.json are read; nothing here runs a model. The layout is in ARCHITECTURE.md ("Agent packs").
import type { Env } from "../../env.ts";

export interface PackIndexFile { path: string; url: string; bytes: number; purpose: string; kind: string }
export interface PackIndex {
  agent_id: string;
  version: string;
  updated: string;
  knowledge: string;
  zip?: { url: string; bytes: number; version: string };
  train_zip?: { url: string; bytes: number; version: string };
  files: PackIndexFile[];
}

/** The files load_agent returns in one go: the entry point, who the agent is, how it works and what it may touch. */
export const CORE_FILES = ["AGENTS.md", "soul.md", "personality.md", "playbook.md", "access.md"] as const;
/** Longest file text a tool returns. Role knowledge stays under about 4,500 words, so this only trims outliers. */
export const MAX_FILE_CHARS = 60_000;

export class PackUnavailable extends Error {}

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
export async function readPackFile(env: Env, file: PackIndexFile): Promise<{ text: string; trimmed: boolean }> {
  if (!file.url.startsWith("/packs/")) throw new PackUnavailable(`${file.path} is not a pack file.`);
  const res = await fetchAsset(env, file.url);
  if (!res) throw new PackUnavailable(`${file.path} could not be read right now.`);
  const text = await res.text();
  return text.length > MAX_FILE_CHARS ? { text: text.slice(0, MAX_FILE_CHARS), trimmed: true } : { text, trimmed: false };
}
