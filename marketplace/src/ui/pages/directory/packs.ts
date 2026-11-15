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
  /** The whole agent in one .txt file, for chat apps. null when the build that made the pack had none. */
  oneFile: PackZip | null;
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
  { kind: "tool", label: "Capture and check tools" },
  { kind: "training", label: "Training" },
  { kind: "about", label: "About this pack" },
];
const OTHER_LABEL = "Other files";

export function kindLabel(kind: string): string {
  return FILE_KINDS.find(k => k.kind === kind)?.label ?? OTHER_LABEL;
}

/** Files that only repeat other files in one piece (every skill in one file, for chat apps). Listed last in their
 *  group and never counted: six skills and skills.md are six skills, not seven. */
export function isBundleFile(path: string): boolean {
  return path === "skills.md";
}

/**
 * Files grouped by kind: known kinds in FILE_KINDS order, then any other kind in the order it first appears.
 * Inside a group, files keep the order files.json gives them, with a bundle file (isBundleFile) last. `count` is
 * how many things the group holds, leaving bundle files out.
 */
export function groupPackFiles(files: PackFile[]): { kind: string; label: string; files: PackFile[]; count: number }[] {
  const groups = new Map<string, PackFile[]>();
  for (const f of files) {
    const list = groups.get(f.kind);
    if (list) list.push(f); else groups.set(f.kind, [f]);
  }
  const group = (kind: string, label: string) => {
    const all = groups.get(kind)!;
    const own = all.filter(f => !isBundleFile(f.path));
    return { kind, label, files: [...own, ...all.filter(f => isBundleFile(f.path))], count: own.length };
  };
  const known = FILE_KINDS.filter(k => groups.has(k.kind)).map(k => group(k.kind, k.label));
  const other = [...groups.keys()].filter(k => !FILE_KINDS.some(x => x.kind === k)).map(k => group(k, OTHER_LABEL));
  return [...known, ...other];
}

/** Plain names for the files every pack has. A visitor reads these on the profile, not file paths. */
const FILE_NAMES: Record<string, string> = {
  "README.md": "Read me first",
  "AGENTS.md": "Instructions for your AI",
  "CLAUDE.md": "Instructions for Claude Code",
  "WORK-METHOD.md": "How every job is done",
  "context/README.md": "What to capture about your business",
  "soul.md": "Personality",
  "personality.md": "How I talk and write",
  "playbook.md": "Playbook",
  "traction-playbook.md": "Traction playbook",
  "TEAM.md": "Who I work with",
  "knowledge.md": "What I know",
  "access.md": "What I may touch",
  "QUALITY-METHOD.md": "Quality checks",
  "OUTPUT-POLICY.md": "Whose style wins",
  "toolbox.md": "Toolbox: when to use what",
  "skills.md": "Every skill in one file",
  "library.md": "Related items in the library",
  "sources.md": "Sources",
  "LICENSE.md": "Licence",
  "CHANGELOG.md": "What changed",
  "pack.json": "Pack details",
  "tools/capture-brand-dna.mjs": "Brand capture tool",
  "tools/brand-dna-snippet.js": "Brand capture snippet for a browser",
  "tools/check-brand-fidelity.mjs": "Brand match checker",
  "tools/ai-default-patterns.md": "AI habits to avoid",
};

/** Short forms that keep their capitals when a file name is turned into words. */
const UPPER = new Set(["seo", "ai", "cro", "kpi", "faq", "ga4", "roi", "crm", "ugc", "html", "css", "sql", "api", "pdf", "hr", "vat", "b2b", "saas", "sms", "ux", "ui", "pr", "sop", "okr", "qa", "cac", "nps", "ppc", "aeo", "geo", "utm", "csv"]);

/** "keyword-intent-map" -> "Keyword intent map"; "seo-content-brief" -> "SEO content brief". */
export function wordsFromSlug(slug: string): string {
  const words = slug.replace(/\.[A-Za-z0-9]+$/, "").split(/[-_\s]+/).filter(Boolean).map(w => (UPPER.has(w.toLowerCase()) ? w.toUpperCase() : w.toLowerCase()));
  if (!words.length) return slug;
  if (!UPPER.has(words[0].toLowerCase())) words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}

/**
 * A file's name in plain words. `names` holds names we know (the agent's own skills, prompts and workflows, from its
 * profile), keyed by path. Then the files every pack has, then the folder a skill sits in or the file's own name.
 */
export function plainFileName(path: string, names?: Record<string, string> | null): string {
  const known = names?.[path] ?? FILE_NAMES[path];
  if (known) return known;
  const parts = path.split("/");
  const last = parts[parts.length - 1];
  if (/^SKILL\.md$/i.test(last) && parts.length >= 2) return wordsFromSlug(parts[parts.length - 2]);
  return wordsFromSlug(last);
}

/**
 * The names an agent's profile knows for its own files (its skills, prompts and workflows, and the skill behind each
 * outcome), keyed by file path, for plainFileName.
 */
export function fileNames(profile: { brings: { items: { name: string; file: string | null }[] }[]; outcomes: { how: { path: string; name: string } | null }[] }): Record<string, string> {
  const names: Record<string, string> = {};
  for (const g of profile.brings ?? []) for (const item of g.items) if (item.file) names[item.file] = item.name;
  for (const o of profile.outcomes ?? []) if (o.how && !names[o.how.path]) names[o.how.path] = o.how.name;
  return names;
}

/** A purpose line that was cut mid-sentence ("... behaviour from…") ends at its last whole sentence instead, when it has one. */
export function tidyPurpose(purpose: string): string {
  const text = purpose.trim();
  if (!/(?:…|\.\.\.)$/.test(text)) return text;
  const end = Math.max(text.lastIndexOf(". "), text.lastIndexOf("; "));
  return end > 20 ? `${text.slice(0, end)}.` : text;
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
export interface ZipsSource { zip?: unknown; agent_zip?: unknown; train_zip?: unknown; one_file?: unknown }

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

/** The one-file version (<id>.txt) from files.json or index.json, at a safe /packs/ address. null when neither names it. */
export function packOneFile(...sources: (ZipsSource | null | undefined)[]): PackZip | null {
  for (const s of sources) {
    const z = s?.one_file;
    if (!z || typeof z !== "object") continue;
    const { url, bytes } = z as { url?: unknown; bytes?: unknown };
    if (isPackUrl(url) && url.endsWith(".txt")) return { path: url, bytes: typeof bytes === "number" && bytes > 0 ? bytes : null };
  }
  return null;
}

// ---------- Starting the agent in the person's own AI ----------

export type StartApp = "chatgpt" | "claude" | "gemini" | "claude-code" | "coding" | "connector";
const START_APPS: readonly StartApp[] = ["chatgpt", "claude", "gemini", "claude-code", "coding", "connector"];

/** One tab of "Start in your AI": what to get, where to open it and the first message to paste. */
export interface StartGuide {
  id: StartApp;
  label: string;
  /**
   * file: the one-file version (<id>.txt); folder: the zip; connect: the MCP connector, nothing to download;
   * plugin: the job role's Claude Code plugin, installed with the commands in `commands`.
   */
  get: "file" | "folder" | "connect" | "plugin";
  /** For a plugin: the lines to paste into Claude Code, one command each. */
  commands?: string[];
  open: string;
  message: string;
  tip: string | null;
}

/**
 * The Claude Code plugin marketplace, built by scripts/build-claude-plugins.mjs: one plugin per job role, named by the
 * role id, so the agent is "<role-id>:<agent-id>" in Claude Code.
 */
export const CLAUDE_MARKETPLACE_PATH = "/packs/claude/marketplace.json";
export const CLAUDE_MARKETPLACE_NAME = "ai-blocks";

/** Above this many bytes the one file is too long for a single Claude chat, so Claude gets a project instead. */
export const LARGE_ONE_FILE = 300_000;

/**
 * What the agent asks for first, so its first move is to ground the job in the person's real business (WORK-METHOD.md,
 * step 1) rather than a generic hello. Tailored by the agent's area of work: a website, the numbers, the code or the
 * current document.
 */
export function groundingAsk(area?: string): string {
  switch (area) {
    case "finance": case "data":
      return "Before you start, ask me for my business name, the numbers or export to work from, and what I need done.";
    case "engineering":
      return "Before you start, ask me for my business name and website (or the code or repo to work in), and what I need done.";
    case "people": case "operations":
      return "Before you start, ask me for my business name, the document or process we use now, and what I need done.";
    default:
      return "Before you start, ask me for my business name and website (or what I can paste instead), and what I need done.";
  }
}

/**
 * The tabs of "Start in your AI", most used app first. Each first message needs no editing: the agent's first move is
 * to ask for the person's business and what they need (groundingAsk), so the start takes about a minute.
 */
export function startGuides(
  a: { id: string; name: string; title: string; area?: string; role?: { id: string; name: string } | null },
  oneFileBytes: number | null = null,
  origin = "https://agents.useaiblocks.com",
): StartGuide[] {
  const { name, title, role } = a;
  const hello = groundingAsk(a.area);
  const read = "holds your instructions, method and knowledge. Read it and follow it, starting with its AGENTS.md part.";
  const chat = `You are ${name}, ${title}. The file I attached ${read} ${hello}`;
  const large = (oneFileBytes ?? 0) > LARGE_ONE_FILE;
  // Only agents with a job role have a plugin (the plugin is the role's team).
  const claudeCode: StartGuide[] = role ? [{
    id: "claude-code", label: "Claude Code", get: "plugin",
    commands: [
      `/plugin marketplace add ${origin.replace(/\/+$/, "")}${CLAUDE_MARKETPLACE_PATH}`,
      `/plugin install ${role.id}@${CLAUDE_MARKETPLACE_NAME}`,
    ],
    open: `Start a new Claude Code session in your project. ${name} is listed under Custom agents as ${role.id}:${a.id}, with the rest of the ${lowerFirstWord(role.name)} team.`,
    message: `Use the ${role.id}:${a.id} agent. ${hello}`,
    tip: `Claude Code also hands ${name} matching work on its own. To get new versions, run /plugin marketplace update ${CLAUDE_MARKETPLACE_NAME}.`,
  }] : [];
  return [
    { id: "chatgpt", label: "ChatGPT", get: "file", open: "Open ChatGPT and start a new chat. Select + by the message box and add the file.", message: chat,
      tip: `To keep ${name} ready, make a project in ChatGPT and add the file to it. Start each chat there with the same message.` },
    large
      ? { id: "claude", label: "Claude", get: "file", open: `Open Claude and make a project. Add the file to its knowledge, then start a chat in the project. ${name}'s file is too long for a single chat.`,
          message: `You are ${name}, ${title}. The file in this project ${read} ${hello}`, tip: null }
      : { id: "claude", label: "Claude", get: "file", open: "Open Claude and start a new chat. Select + by the message box and add the file.", message: chat,
          tip: `To keep ${name} ready, make a project in Claude and add the file to its knowledge. Start each chat there with the same message.` },
    { id: "gemini", label: "Gemini", get: "file", open: "Open Gemini and start a new chat. Select + by the message box and upload the file.", message: chat,
      tip: `To keep ${name} ready, make a Gem, add the file under Knowledge, and start each chat with the same message.` },
    ...claudeCode,
    { id: "coding", label: "Coding apps", get: "folder", open: "Unzip the folder and open it in Claude Code, Codex or Cursor. They read its AGENTS.md on their own, and the skills are already in place.",
      message: `Read AGENTS.md and follow it. You are ${name}, ${title}. ${hello}`, tip: null },
    { id: "connector", label: "Connector", get: "connect", open: "Start a new chat in the AI you connected.",
      message: `Load ${name} (${a.id}) from AI Blocks and work as ${name}. ${hello}`,
      tip: `Your AI loads the newest version of ${name} each time, with nothing to download.` },
  ];
}

export function isStartApp(v: unknown): v is StartApp {
  return typeof v === "string" && (START_APPS as readonly string[]).includes(v);
}

/** "SEO specialist" stays as it is; "Growth marketer" reads "growth marketer" mid-sentence. */
function lowerFirstWord(s: string): string {
  return /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
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

interface IndexEntry { id: string; version?: string; knowledge?: unknown; agent_zip?: unknown; train_zip?: unknown; one_file?: unknown }
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
    oneFile: packOneFile(filesRaw as ZipsSource | null, entry),
  };
}
