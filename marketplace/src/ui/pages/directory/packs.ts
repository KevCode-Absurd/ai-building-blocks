// Agent packs in the browser: reading the built files (dist/packs, made by scripts/build-packs.mjs) and the pure
// helpers the profile, the file viewer and the guides use. No JSX here, so the tests can import it in Node.
// The layout of the built files is in ARCHITECTURE.md ("Agent packs").

export interface PackFile {
  path: string;
  bytes: number;
  purpose: string;
  /** start, identity, work, knowledge, skill, prompt, workflow, training or about; mega agents add team and channel. */
  kind: string;
  /** Where the file is served (shared role files live under /packs/roles/<role-id>/). Else /packs/<agent-id>/<path>. */
  url?: string;
}

export interface PackKnowledge {
  status: "ready" | "pending";
  /** The day the role's sources were last checked, YYYY-MM-DD. */
  updated: string | null;
  sources: number | null;
  review_every_days: number | null;
}

export interface PackFiles {
  agent_id: string;
  version: string;
  updated: string;
  knowledge: PackKnowledge | null;
  files: PackFile[];
}

export interface PackZip { path: string; bytes: number | null }

/** What the profile and the viewer need about one agent's pack. */
export interface PackInfo {
  version: string | null;
  knowledge: PackKnowledge | null;
  files: PackFile[];
  agentZip: PackZip;
  trainZip: PackZip;
}

/** File kinds in the order the viewer shows them, with plain labels. */
export const FILE_KINDS: { kind: string; label: string }[] = [
  { kind: "start", label: "Start here" },
  { kind: "identity", label: "Personality" },
  { kind: "work", label: "How the work is done" },
  { kind: "knowledge", label: "Knowledge" },
  { kind: "skill", label: "Skills" },
  { kind: "prompt", label: "Prompts" },
  { kind: "workflow", label: "Workflows" },
  { kind: "team", label: "Channel team" },
  { kind: "channel", label: "Channels" },
  { kind: "training", label: "Training" },
  { kind: "about", label: "About this pack" },
];
const OTHER_LABEL = "Other files";

export function kindLabel(kind: string): string {
  return FILE_KINDS.find(k => k.kind === kind)?.label ?? OTHER_LABEL;
}

/**
 * Files grouped by kind: known kinds in FILE_KINDS order, then any other kind in the order it first appears.
 * Inside a group, files keep the order files.json gives them.
 */
export function groupPackFiles(files: PackFile[]): { kind: string; label: string; files: PackFile[] }[] {
  const groups = new Map<string, PackFile[]>();
  for (const f of files) {
    const list = groups.get(f.kind);
    if (list) list.push(f); else groups.set(f.kind, [f]);
  }
  const known = FILE_KINDS.filter(k => groups.has(k.kind)).map(k => ({ kind: k.kind, label: k.label, files: groups.get(k.kind)! }));
  const other = [...groups.keys()].filter(k => !FILE_KINDS.some(x => x.kind === k)).map(k => ({ kind: k, label: OTHER_LABEL, files: groups.get(k)! }));
  return [...known, ...other];
}

const SEGMENT = /^[A-Za-z0-9_][A-Za-z0-9._ -]*$/;

/**
 * A file path from the viewer's address, checked before it is looked up: relative, forward slashes only, no empty,
 * "." or ".." parts, no dot folders, no percent signs left after decoding, no control characters. null when unsafe.
 * The viewer also opens only paths that files.json lists.
 */
export function safePackPath(raw: string | null | undefined): string | null {
  if (typeof raw !== "string" || !raw || raw.length > 300) return null;
  if (raw.startsWith("/") || raw.includes("\\") || raw.includes("%") || raw.includes(":") || /[\u0000-\u001f\u007f]/.test(raw)) return null;
  const parts = raw.split("/");
  if (parts.some(p => p === "." || p === ".." || !SEGMENT.test(p) || p.endsWith(" "))) return null;
  return raw;
}

/** A same-site address under /packs/ that is safe to fetch: no other origin, no "..", no backslash. */
export function isPackUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url.startsWith("/packs/") || url.length > 500) return false;
  if (url.includes("\\") || url.includes("//") || /[\u0000-\u001f\u007f\s]/.test(url) || url.includes("?") || url.includes("#")) return false;
  let decoded: string;
  try { decoded = decodeURIComponent(url); } catch { return false; }
  return !decoded.split("/").some(p => p === "." || p === "..") && !decoded.includes("\\");
}

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

/** Where to fetch a pack file: its url when files.json gives a safe one, else /packs/<agent-id>/<path>. */
export function packFileHref(agentId: string, file: Pick<PackFile, "path" | "url">): string {
  return isPackUrl(file.url) ? file.url : `/packs/${encodeURIComponent(agentId)}/${encodePath(file.path)}`;
}

/** The viewer page for one file: /agents/<id>/files/<path>. */
export function viewerHref(agentId: string, path: string): string {
  return `/agents/${encodeURIComponent(agentId)}/files/${encodePath(path)}`;
}

/** The zips as files.json ({ zip, train_zip }) or index.json ({ agent_zip, train_zip }) give them, each with a url or
 *  a path and its bytes. */
export interface ZipsSource { zip?: unknown; agent_zip?: unknown; train_zip?: unknown }

/** True when files.json or index.json names both zips. */
export function hasZips(source: unknown): boolean {
  if (!source || typeof source !== "object") return false;
  const s = source as ZipsSource, named = (z: unknown) => !!z && typeof z === "object";
  return named(s.agent_zip ?? s.zip) && named(s.train_zip);
}

/** The two zips from files.json or index.json when they name them (at safe /packs/ addresses), else the standard ones. */
export function packZips(agentId: string, ...sources: (ZipsSource | null | undefined)[]): { agentZip: PackZip; trainZip: PackZip } {
  const zip = (raws: unknown[], fallback: string): PackZip => {
    for (const raw of raws) {
      if (!raw || typeof raw !== "object") continue;
      const z = raw as { url?: unknown; path?: unknown; bytes?: unknown };
      const at = [z.url, z.path].find((u): u is string => isPackUrl(u) && u.endsWith(".zip"));
      const bytes = typeof z.bytes === "number" && z.bytes > 0 ? z.bytes : null;
      if (at || bytes) return { path: at ?? fallback, bytes };
    }
    return { path: fallback, bytes: null };
  };
  const id = encodeURIComponent(agentId);
  return {
    agentZip: zip(sources.map(s => s?.agent_zip ?? s?.zip), `/packs/${id}.zip`),
    trainZip: zip(sources.map(s => s?.train_zip), `/packs/${id}-train.zip`),
  };
}

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-06" -> "6 Nov 2026". null for anything that is not a real YYYY-MM-DD day. */
export function formatDay(day: string | null | undefined): string | null {
  const m = DAY.exec(day ?? "");
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  return `${d} ${MONTHS[mo - 1]} ${y}`;
}

/** "115 KB", "1.4 MB", "800 bytes". */
export function formatBytes(n: number | null | undefined): string | null {
  if (typeof n !== "number" || !Number.isFinite(n) || n < 0) return null;
  if (n < 1024) return `${n} byte${n === 1 ? "" : "s"}`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** files.json and index.json have said knowledge as "ready" or "pending", and now as an object. Both work. */
export function normalizeKnowledge(raw: unknown): PackKnowledge | null {
  if (raw === "ready" || raw === "pending") return { status: raw, updated: null, sources: null, review_every_days: null };
  if (!raw || typeof raw !== "object") return null;
  const k = raw as Record<string, unknown>;
  if (k.status !== "ready" && k.status !== "pending") return null;
  const count = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : null);
  return { status: k.status as PackKnowledge["status"], updated: typeof k.updated === "string" && formatDay(k.updated) ? k.updated : null, sources: count(k.sources), review_every_days: count(k.review_every_days) || null };
}

/** The knowledge status line on the profile. null when we do not know it. */
export function knowledgeLine(k: PackKnowledge | null): string | null {
  if (!k) return null;
  if (k.status === "pending") return "Role knowledge is being researched";
  const day = formatDay(k.updated);
  const from = k.sources ? ` from ${k.sources} source${k.sources === 1 ? "" : "s"}` : "";
  if (day) return `Role knowledge checked ${day}${from}`;
  return from ? `Role knowledge checked${from}` : "Role knowledge researched from public sources";
}

/** How the file is shown: markdown rendered, JSON pretty-printed, anything else as plain text. */
export function fileFormat(path: string): "markdown" | "json" | "text" {
  const p = path.toLowerCase();
  if (p.endsWith(".md") || p.endsWith(".markdown")) return "markdown";
  if (p.endsWith(".json")) return "json";
  return "text";
}

/** JSON shown with two-space indents; the text as it is when it does not parse. */
export function prettyJson(text: string): string {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

/** A skill's "---" frontmatter (name, description) split from the markdown, so it does not render as a heading. */
export function splitFrontmatter(md: string): { meta: string | null; body: string } {
  const m = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(md);
  return m ? { meta: m[1], body: md.slice(m[0].length) } : { meta: null, body: md };
}

/** The first "# Heading" of a markdown file. */
export function markdownTitle(md: string): string | null {
  const m = /^#[ \t]+(.+?)[ \t#]*$/m.exec(md);
  return m ? m[1].trim() : null;
}

/** The first paragraph after the title, as plain text: links, bold and code marks removed. */
export function markdownSummary(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!out.length && (!t || t.startsWith("#"))) continue;
    if (!t || t.startsWith("#")) break;
    out.push(t);
  }
  return out.join(" ").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]+/g, "").trim();
}

/**
 * True for an address the browser app draws itself, so a click can stay in the app. False for the static files and
 * the Worker's own addresses (/packs, /api, /mcp, /oauth, soul.md), which need a real page load or a download.
 */
export function isAppPath(pathname: string): boolean {
  if (/^\/(packs|api|oauth|\.well-known)(\/|$)/.test(pathname) || /^\/mcp(\/|$)/.test(pathname)) return false;
  if (/^\/agents\/[^/]+\/files\/./.test(pathname)) return true;
  const last = pathname.split("/").pop() ?? "";
  return !/\.[A-Za-z0-9]{1,8}$/.test(last);
}

// ---------- Loading the built files ----------

/** A pack file as JSON, or null when it is missing. Before a build the app's own page answers every address with
 *  200 and HTML, so anything that is not JSON counts as missing. Same site only. */
async function fetchJson(url: string): Promise<unknown | null> {
  if (!url.startsWith("/") || url.startsWith("//")) return null;
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok || /text\/html/i.test(res.headers.get("content-type") ?? "")) return null;
  try { return JSON.parse(await res.text()); } catch { return null; }
}

/** A pack file's text, or null when it is missing (see fetchJson). Same site only. */
export async function fetchPackText(url: string): Promise<string | null> {
  if (!isPackUrl(url)) return null;
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok || /text\/html/i.test(res.headers.get("content-type") ?? "")) return null;
  return res.text();
}

/** files.json, checked: only entries with a safe path are kept. */
export function readFilesJson(raw: unknown): PackFiles | null {
  if (!raw || typeof raw !== "object") return null;
  const j = raw as Record<string, unknown>;
  if (!Array.isArray(j.files)) return null;
  const files: PackFile[] = [];
  for (const f of j.files) {
    if (!f || typeof f !== "object") continue;
    const x = f as Record<string, unknown>;
    const path = safePackPath(typeof x.path === "string" ? x.path : null);
    if (!path) continue;
    files.push({
      path,
      bytes: typeof x.bytes === "number" && x.bytes >= 0 ? x.bytes : 0,
      purpose: typeof x.purpose === "string" ? x.purpose : "",
      kind: typeof x.kind === "string" ? x.kind : "other",
      ...(isPackUrl(x.url) ? { url: x.url } : {}),
    });
  }
  return {
    agent_id: typeof j.agent_id === "string" ? j.agent_id : "",
    version: typeof j.version === "string" ? j.version : "",
    updated: typeof j.updated === "string" ? j.updated : "",
    knowledge: normalizeKnowledge(j.knowledge),
    files,
  };
}

interface IndexEntry { id: string; version?: string; knowledge?: unknown; agent_zip?: unknown; train_zip?: unknown }
let indexPromise: Promise<Map<string, IndexEntry> | null> | null = null;

/** /packs/index.json, read once per visit. */
function packIndex(): Promise<Map<string, IndexEntry> | null> {
  indexPromise ??= fetchJson("/packs/index.json").then(raw => {
    const packs = raw && typeof raw === "object" ? (raw as { packs?: unknown }).packs : null;
    if (!Array.isArray(packs)) return null;
    return new Map(packs.filter((p): p is IndexEntry => !!p && typeof p === "object" && typeof (p as IndexEntry).id === "string").map(p => [p.id, p]));
  }).catch(() => { indexPromise = null; return null; });
  return indexPromise;
}

/** One agent's pack: its files, knowledge and zip sizes. null when there is no pack (an expert's agent, or a local
 *  app before `npm run build`). */
export async function loadPack(agentId: string): Promise<PackInfo | null> {
  const filesRaw = await fetchJson(`/packs/${encodeURIComponent(agentId)}/files.json`).catch(() => null);
  const files = readFilesJson(filesRaw);
  // files.json names the zips and their sizes; index.json (every agent, so larger) is only read when it does not.
  const entry = files && hasZips(filesRaw) ? null : (await packIndex())?.get(agentId) ?? null;
  if (!files && !entry) return null;
  return {
    version: files?.version || (typeof entry?.version === "string" ? entry.version : null),
    knowledge: files?.knowledge ?? normalizeKnowledge(entry?.knowledge),
    files: files?.files ?? [],
    ...packZips(agentId, filesRaw as ZipsSource | null, entry),
  };
}
