// The toolbox: everything a job role needs, matched to its tasks once, at build time, and shipped inside the pack.
// Input is packs/roles/<role-id>/toolbox.json (schema "ai-blocks-toolbox/1", written by curators): the role's tasks,
// and for each task the kit files and library items to use, each with a "when". The builder turns it into
//   toolbox.md                   the "when this, use that" list the agent reads right after AGENTS.md
//   toolbox/<type>/<slug>.md     the full text of every listed library item, with a three-line header
// so nothing is searched at job time: the agent picks from the list and opens only the files it chose.
// Pure: no I/O. scripts/build-packs.mjs reads the library (catalogue-items/) and hands the texts in.
import { DELIVERABLE_FAMILIES, type DeliverableFamily, type Persona } from "../../core/types.ts";
import { LIBRARY_ORIGIN, ORIGIN } from "./format.ts";
import { rankRoutes, wordsOf, type RouteCandidate } from "./route.ts";

export const TOOLBOX_SCHEMA = "ai-blocks-toolbox/1";
export const TOOLBOX_SUMMARY_SCHEMA = "ai-blocks-toolbox-summary/1";
export const TOOLBOX_INDEX_SCHEMA = "ai-blocks-toolbox-index/1";
export const LIBRARY_TYPES = ["skill", "workflow", "prompt", "agent", "mind", "tool"] as const;
export type LibraryType = (typeof LIBRARY_TYPES)[number];
export const TOOLBOX_USES = ["brief", "explore", "build", "check", "think"] as const;
export type ToolboxUse = (typeof TOOLBOX_USES)[number];

/** toolbox.md aims to stay under this many words up to its "More" list, so it fits in the first load. */
export const TOOLBOX_WORD_BUDGET = 1500;
/** How many library items the one-file text carries in full; the rest are listed by address. */
export const ONE_FILE_ITEMS = 8;

/** Where each kind of library item lives on useaiblocks.com. */
export const LIBRARY_PATHS: Record<LibraryType, string> = { skill: "skills", workflow: "workflows", prompt: "prompts", agent: "agents", mind: "minds", tool: "ai-tools" };
/** What each kind is called in words an agent or a visitor reads. */
export const TYPE_LABELS: Record<LibraryType | "kit", string> = { kit: "role skill", skill: "skill", workflow: "workflow", prompt: "prompt", agent: "helper agent", mind: "thinking lens", tool: "AI tool guide" };

export interface ToolboxItemRef { ref: string; type?: LibraryType; use: ToolboxUse; when: string }
export interface ToolboxTask { id: string; task: string; kind: DeliverableFamily; items: ToolboxItemRef[] }
export interface ToolboxHelper { role: string; when: string }
export interface ToolboxJson {
  schema: typeof TOOLBOX_SCHEMA;
  role: string;
  reviewed: string;
  tasks: ToolboxTask[];
  always: ToolboxItemRef[];
  helpers: ToolboxHelper[];
  gaps: string[];
}

/** A library item ready to ship: its text already has the header and the fixes (renderLibraryItem, renderToolGuide). */
export interface LibraryItem { slug: string; type: LibraryType; name: string; summary: string; url: string; text: string }
/** A helper role as packs name it: the role, and the agent load_agent returns for it (the role's lead). */
export interface HelperRole { name: string; lead: { id: string; name: string; title: string } | null }

export const toolboxItemPath = (type: LibraryType, slug: string) => `toolbox/${type}/${slug}.md`;
export const libraryUrl = (type: LibraryType, slug: string) => `${LIBRARY_ORIGIN}/${LIBRARY_PATHS[type]}/${slug}`;
export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

// ---------- A small YAML reader ----------
// The library's item.yaml, mind.yaml and AI tool guides use a small part of YAML: maps and lists by indentation,
// inline [lists] and {maps}, quoted or plain text. This app has no YAML package, so this reads just that part.

export type YamlValue = string | YamlValue[] | { [key: string]: YamlValue };

function yamlScalar(raw: string): string {
  const v = raw.trim();
  if (/^"(?:[^"\\]|\\.)*"$/.test(v)) { try { return JSON.parse(v) as string; } catch { return v.slice(1, -1); } }
  if (/^'.*'$/.test(v)) return v.slice(1, -1).replace(/''/g, "'");
  return v.replace(/\s+#.*$/, "");
}

/** Splits "a, "b, c", {d: e}" at its top-level commas. */
function splitFlow(body: string): string[] {
  const out: string[] = [];
  let depth = 0, quote = "", start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quote) { if (c === "\\" && quote === '"') i++; else if (c === quote) quote = ""; continue; }
    if (c === '"' || c === "'") quote = c;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") depth--;
    else if (c === "," && depth === 0) { out.push(body.slice(start, i)); start = i + 1; }
  }
  out.push(body.slice(start));
  return out.map(s => s.trim()).filter(Boolean);
}

function yamlValue(raw: string): YamlValue {
  const v = raw.trim();
  if (v.startsWith("[") && v.endsWith("]")) return splitFlow(v.slice(1, -1)).map(yamlValue);
  if (v.startsWith("{") && v.endsWith("}")) {
    const out: Record<string, YamlValue> = {};
    for (const part of splitFlow(v.slice(1, -1))) {
      const m = /^("[^"]*"|'[^']*'|[^:]+):\s*(.*)$/.exec(part);
      if (m) out[yamlScalar(m[1])] = yamlValue(m[2]);
    }
    return out;
  }
  return yamlScalar(v);
}

const YAML_KEY = /^([A-Za-z0-9_.-]+):(?:\s+(.*))?$/;

/** Reads the YAML subset above into plain values. Anything it cannot read is skipped, never thrown. */
export function yamlLite(text: string): YamlValue {
  // Some library files are written as JSON, which is YAML too.
  if (/^﻿?\s*[{[]/.test(text)) {
    try { return JSON.parse(text.replace(/^﻿/, "")) as YamlValue; } catch { return yamlValue(text.replace(/^﻿/, "").replace(/\s*\n\s*/g, " ")); }
  }
  const lines =text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n")
    .filter(l => l.trim() && !l.trim().startsWith("#") && l.trim() !== "---")
    .map(l => ({ indent: l.length - l.trimStart().length, text: l.trim() }));
  const isItem = (t: string) => t === "-" || t.startsWith("- ");

  function block(i: number, indent: number): [YamlValue, number] {
    if (isItem(lines[i].text)) {
      const list: YamlValue[] = [];
      while (i < lines.length && lines[i].indent === indent && isItem(lines[i].text)) {
        const rest = lines[i].text.slice(1).trim();
        if (!rest) {
          if (i + 1 < lines.length && lines[i + 1].indent > indent) { const [v, next] = block(i + 1, lines[i + 1].indent); list.push(v); i = next; }
          else { list.push(""); i++; }
          continue;
        }
        const key = YAML_KEY.exec(rest);
        // "- id: x" starts a map whose other keys sit two columns in.
        if (key && i + 1 < lines.length && lines[i + 1].indent === indent + 2 && YAML_KEY.test(lines[i + 1].text) && !isItem(lines[i + 1].text)) {
          const first: Record<string, YamlValue> = { [key[1]]: key[2] === undefined ? "" : yamlValue(key[2]) };
          const [more, next] = block(i + 1, indent + 2);
          list.push(typeof more === "object" && !Array.isArray(more) ? { ...first, ...more } : first);
          i = next;
          continue;
        }
        let value = rest;
        i++;
        // A long item may wrap onto deeper lines.
        while (i < lines.length && lines[i].indent > indent && !isItem(lines[i].text)) value += ` ${lines[i++].text}`;
        list.push(yamlValue(value));
      }
      return [list, i];
    }
    const map: Record<string, YamlValue> = {};
    while (i < lines.length && lines[i].indent === indent && !isItem(lines[i].text)) {
      const m = YAML_KEY.exec(lines[i].text);
      if (!m) { i++; continue; }
      const [, key, rest] = m;
      i++;
      if (rest === undefined || rest === "" || /^[|>][+-]?$/.test(rest)) {
        const literal = rest !== undefined && rest !== "";
        if (i < lines.length && lines[i].indent > indent && !literal) { const [v, next] = block(i, lines[i].indent); map[key] = v; i = next; }
        // A list may sit at the same indent as its key.
        else if (i < lines.length && lines[i].indent === indent && isItem(lines[i].text) && !literal) { const [v, next] = block(i, indent); map[key] = v; i = next; }
        else {
          const parts: string[] = [];
          while (i < lines.length && lines[i].indent > indent) parts.push(lines[i++].text);
          map[key] = parts.join(rest?.startsWith("|") ? "\n" : " ");
        }
        continue;
      }
      let value = rest;
      const flow = /^[[{]/.test(rest);
      // Plain or quoted text may wrap onto deeper lines; a quoted one runs until its quote closes.
      const open = () => /^"/.test(value) ? !/^"(?:[^"\\]|\\.)*"$/.test(value) : /^'/.test(value) ? !/^'(?:[^']|'')*'$/.test(value) : true;
      while (!flow && i < lines.length && lines[i].indent > indent && open() && (/^["']/.test(value) || !isItem(lines[i].text))) value += ` ${lines[i++].text}`;
      map[key] = yamlValue(value);
    }
    return [map, i];
  }
  if (!lines.length) return {};
  const [value] = block(0, lines[0].indent);
  return value;
}

const asText = (v: YamlValue | undefined): string => v === undefined ? "" : typeof v === "string" ? v : Array.isArray(v) ? v.map(asText).join(", ") : Object.entries(v).map(([k, x]) => `${k}: ${asText(x)}`).join("; ");
const asList = (v: YamlValue | undefined): string[] => v === undefined || v === "" ? [] : Array.isArray(v) ? v.map(asText).filter(Boolean) : [asText(v)];
const asMap = (v: YamlValue | undefined): Record<string, YamlValue> => v && typeof v === "object" && !Array.isArray(v) ? v : {};

// ---------- Library items as pack files ----------

const normalise = (text: string) => `${text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").replace(/\s+$/, "")}\n`;
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

/** The three lines every toolbox item starts with: its name, what it gives, and where it comes from. */
function itemHeader(name: string, summary: string, url: string): string {
  return [`# ${oneLine(name)}`, "", `What it gives: ${oneLine(summary) || "see below."}`, "", `Source: ${url} (AI Blocks library)`].join("\n");
}

/** Names that mean the reader's own project file far more often than a file of the library item. */
const COMMON_FILE = /^(readme|licen[sc]e|changelog|notice|contributing|agents|claude|skill|package|index|main|config|\.env)\b/i;
const PATH_TOKEN = /(?<![\w/.@:-])((?:\.\/)?[A-Za-z0-9_][A-Za-z0-9_.-]*(?:\/[A-Za-z0-9_.-]+)*\.[A-Za-z0-9]{1,6})(?![\w/-])/g;

/**
 * Points every mention of one of the item's own extra files (references/x.md, scripts/y.py) at its copy in the
 * library, since the pack carries only the item's main file. A command keeps its relative path, so it still runs
 * once the file is fetched, and a note says where to get it. Safe to run twice.
 */
export function resolveItemFiles(text: string, files: Iterable<string>, base: string): string {
  const own = new Set([...files].map(f => f.replace(/^\.\//, "")));
  if (!own.size) return text;
  const hit = (token: string) => { const p = token.replace(/^\.\//, ""); return own.has(p) && (p.includes("/") || !COMMON_FILE.test(p)) ? p : null; };
  const found = (part: string) => [...new Set([...part.matchAll(PATH_TOKEN)].map(m => hit(m[1])).filter((p): p is string => !!p))];
  const urls = (names: string[]) => names.map(n => `${base}/${n}`).join(" and ");
  const code = /(```[\s\S]*?```(?:\n\(Get [^)\n]*\))?|`[^`\n]+`(?: \(get [^)\n]*\))?)/;
  return text.split(code).map((part, i) => {
    if (i % 2 === 0) return part.replace(PATH_TOKEN, (m, token: string, at: number, all: string) => {
      const p = hit(token);
      // A markdown link target or a URL already says where the file is.
      return p && !/\]\($/.test(all.slice(Math.max(0, at - 2), at)) ? `${base}/${p}` : m;
    });
    if (/\)$/.test(part) && /( \(get |\n\(Get )/.test(part)) return part;
    const names = found(part);
    if (!names.length) return part;
    return part.startsWith("```") ? `${part}\n(Get ${urls(names)} first.)` : `${part} (get ${urls(names)} first)`;
  }).join("");
}

export interface LibrarySource {
  slug: string;
  type: Exclude<LibraryType, "tool">;
  name: string;
  summary: string;
  /** The item's main file: SKILL.md. */
  main: string;
  /** The item's other files, as paths inside its folder, so mentions of them can point at the library's copy. */
  files?: string[];
  /** A workflow's step skills (item.yaml `uses`), so each can be found by name. */
  uses?: string[];
}

/**
 * A skill, prompt, workflow, library agent or mind as a pack file: the three-line header, then its SKILL.md without
 * the parts only the website needs (the YAML front matter, the "After this" block that sells other skills, and the
 * site's build markers). Its own extra files and a workflow's step skills are pointed at their library copies.
 */
export function renderLibraryItem(src: LibrarySource): LibraryItem {
  const url = libraryUrl(src.type, src.slug);
  const raw = `${LIBRARY_ORIGIN}/skills/${src.slug}`;
  let body = normalise(src.main).replace(/^---\n[\s\S]*?\n---\n?/, "");
  body = body.replace(/^<!--\s*next\b[^\n]*-->\n[\s\S]*?^<!--\s*\/next\s*-->\n?/gm, "");
  body = body.replace(/^<!--\s*\/?(?:needs|next)\b[^\n]*-->\n?/gm, "");
  // The header carries the name, so the file's own first heading goes.
  body = body.replace(/^\s*#\s+[^\n]*\n/, "");
  body = resolveItemFiles(body, src.files ?? [], raw);
  const notes: string[] = [];
  if ((src.files ?? []).length && body.includes(`${raw}/`)) notes.push(`This item's extra files are in the library: each is linked where it is named, and ${raw}.zip holds them all.`);
  const uses = (src.uses ?? []).filter(s => /^[a-z0-9][a-z0-9-]*$/.test(s) && s !== src.slug);
  if (uses.length) {
    let named = 0;
    for (const slug of uses) {
      const span = new RegExp(`\`${slug}\`(?! \\(${LIBRARY_ORIGIN.replace(/[.]/g, "\\.")})`);
      if (span.test(body)) { body = body.replace(span, `\`${slug}\` (${LIBRARY_ORIGIN}/skills/${slug}/SKILL.md)`); named++; }
    }
    if (named) notes.push("Each step names a library skill. Use your own copy when toolbox.md lists that skill; otherwise read it at the address beside its name.");
  }
  const text = normalise([itemHeader(src.name, src.summary, url), ...(notes.length ? ["", notes.join(" ")] : []), "", body.trim()].join("\n").replace(/\n{3,}/g, "\n\n"));
  return { slug: src.slug, type: src.type, name: oneLine(src.name), summary: oneLine(src.summary), url, text };
}

/** An AI tool guide (catalogue-items/ai-tools/<slug>.yaml) as a pack file: the header, then its facts as short lists. */
export function renderToolGuide(slug: string, yaml: string): LibraryItem {
  const d = asMap(yamlLite(yaml));
  const name = asText(d.name) || slug;
  const summary = asText(d.promise);
  const url = libraryUrl("tool", slug);
  const out: string[] = [itemHeader(name, summary, url), ""];
  const checked = asText(d.checked) || asText(d.last_checked);
  out.push(oneLine(`${name} is a product${d.maker ? ` from ${asText(d.maker)}` : ""}${d.url ? `: ${asText(d.url)}` : ""}. This guide says what it does and how to get a first result.${checked ? ` Its facts were checked on ${checked}; check prices and limits again before you quote them.` : ""}`), "");
  const section = (title: string, items: string[]) => { if (items.length) out.push(`## ${title}`, "", ...items.map(i => `- ${i}`), ""); };
  section("What it does", asList(d.what_it_does));
  section("Why use it", asList(d.benefits));
  section("Best for", asList(d.best_for));
  section("Not for", asList(d.not_for));
  const first = d.first_result;
  if (Array.isArray(first)) section("How to get a first result", asList(first));
  else for (const [where, steps] of Object.entries(asMap(first))) section(`How to get a first result (${where})`, asList(steps));
  section("What you need", asList(d.needs));
  const pricing = asMap(d.pricing);
  section("What it costs", [pricing.model && `Model: ${asText(pricing.model)}`, pricing.from && `From: ${asText(pricing.from)}`, pricing.note && asText(pricing.note)].filter((x): x is string => !!x));
  const example = asMap(d.example);
  section("An example", [example.task && `Task: ${asText(example.task)}`, example.cost && `Cost: ${asText(example.cost)}`, example.reply && `What comes back: ${asText(example.reply)}`].filter((x): x is string => !!x));
  section("Where it fits", [
    asList(d.works_with).length ? `Works with: ${asList(d.works_with).join(", ")}` : "",
    asList(d.runs_in).length ? `Runs in: ${asList(d.runs_in).join(", ")}` : "",
    asList(d.alternatives).length ? `Alternatives: ${asList(d.alternatives).map(a => `${a} (${libraryUrl("tool", a)})`).join(", ")}` : "",
  ].filter(Boolean));
  section("Not verified", asList(d.not_verified));
  section("Sources", asList(d.sources));
  return { slug, type: "tool", name: oneLine(name), summary: oneLine(summary), url, text: normalise(out.join("\n").replace(/\n{3,}/g, "\n\n")) };
}

// ---------- toolbox.json ----------

const KEBAB = /^[a-z0-9][a-z0-9-]*$/;
const REF = /^(kit|library):(.+)$/;

/** The pack path of a kit ref ("kit:skills/x" is skills/x/SKILL.md, "kit:prompts/x" is prompts/x.md), or null. */
export function kitRefPath(ref: string): string | null {
  const m = /^kit:((skills|prompts|workflows)\/[A-Za-z0-9][A-Za-z0-9_.-]*)$/.exec(ref);
  if (!m) return null;
  return m[2] === "skills" ? `${m[1]}/SKILL.md` : `${m[1]}.md`;
}

/** Every library item a toolbox names, once each, with the type the curator gave. */
export function toolboxLibraryRefs(toolbox: ToolboxJson): { slug: string; type: LibraryType }[] {
  const seen = new Map<string, LibraryType>();
  for (const item of [...toolbox.tasks.flatMap(t => t.items), ...toolbox.always]) {
    const m = /^library:(.+)$/.exec(item.ref);
    if (m && item.type && !seen.has(m[1])) seen.set(m[1], item.type);
  }
  return [...seen].map(([slug, type]) => ({ slug, type }));
}

export interface ToolboxCheck { toolbox: ToolboxJson | null; errors: string[]; warnings: string[] }

/**
 * Checks a role kit's toolbox.json. Errors mean the file cannot be used as written (the build stops and names
 * them); warnings are the spec's size and quality rules (TOOLBOX-SPEC), printed so curators can fix them.
 * `kitPaths` are the kit's own files; `roleIds`, when given, are the roles a helper may name.
 */
export function checkToolbox(value: unknown, roleId: string, kitPaths: Iterable<string>, roleIds?: Set<string>): ToolboxCheck {
  const errors: string[] = [], warnings: string[] = [];
  const at = `packs/roles/${roleId}/toolbox.json`;
  const fail = (m: string) => { errors.push(`${at}: ${m}`); };
  const warn = (m: string) => { warnings.push(`${at}: ${m}`); };
  if (!value || typeof value !== "object" || Array.isArray(value)) { fail("must be an object"); return { toolbox: null, errors, warnings }; }
  const v = value as Record<string, unknown>;
  if (v.schema !== TOOLBOX_SCHEMA) fail(`schema must be "${TOOLBOX_SCHEMA}"`);
  if (v.role !== roleId) fail(`role must be "${roleId}", the folder it is in`);
  if (typeof v.reviewed !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v.reviewed)) fail("reviewed must be a date (YYYY-MM-DD)");
  const kit = new Set(kitPaths);
  const str = (x: unknown): x is string => typeof x === "string" && x.trim().length > 0;

  const checkItem = (raw: unknown, where: string): ToolboxItemRef | null => {
    if (!raw || typeof raw !== "object") { fail(`${where} must be an object`); return null; }
    const it = raw as Record<string, unknown>;
    const m = str(it.ref) ? REF.exec(it.ref) : null;
    if (!m) { fail(`${where} needs a ref that starts with kit: or library:`); return null; }
    let ok = true;
    if (m[1] === "kit") {
      const path = kitRefPath(it.ref as string);
      if (!path) { fail(`${where}: ${it.ref} must be kit:skills/<name>, kit:prompts/<name> or kit:workflows/<name>, with no file ending`); ok = false; }
      else if (!kit.has(path)) { fail(`${where}: ${it.ref} names ${path}, which the role kit does not have`); ok = false; }
    } else {
      if (!KEBAB.test(m[2])) { fail(`${where}: ${it.ref} is not a library slug`); ok = false; }
      if (!(LIBRARY_TYPES as readonly unknown[]).includes(it.type)) { fail(`${where}: a library item needs a type (${LIBRARY_TYPES.join(", ")})`); ok = false; }
    }
    if (!(TOOLBOX_USES as readonly unknown[]).includes(it.use)) { fail(`${where}: use must be one of ${TOOLBOX_USES.join(", ")}`); ok = false; }
    if (!str(it.when)) { fail(`${where}: needs a "when"`); ok = false; }
    else if (it.when.length > 120) warn(`${where}: "when" is ${it.when.length} characters; the most is 120`);
    if (!ok) return null;
    return { ref: it.ref as string, ...(m[1] === "library" ? { type: it.type as LibraryType } : {}), use: it.use as ToolboxUse, when: (it.when as string).trim() };
  };

  const tasks: ToolboxTask[] = [];
  if (!Array.isArray(v.tasks) || !v.tasks.length) fail("tasks must be a list with at least one task");
  else {
    const ids = new Set<string>();
    v.tasks.forEach((raw, i) => {
      const where = `task ${i + 1}`;
      if (!raw || typeof raw !== "object") return fail(`${where} must be an object`);
      const t = raw as Record<string, unknown>;
      if (!str(t.id) || !KEBAB.test(t.id)) return fail(`${where} needs a kebab-case id`);
      const name = `task ${t.id}`;
      if (ids.has(t.id)) return fail(`${name}: the id is used twice`);
      ids.add(t.id);
      if (!str(t.task)) return fail(`${name}: needs a task, in plain words`);
      if (t.task.length > 70) warn(`${name}: the task is ${t.task.length} characters; the most is 70`);
      if (!(DELIVERABLE_FAMILIES as readonly unknown[]).includes(t.kind)) return fail(`${name}: kind must be one of ${DELIVERABLE_FAMILIES.join(", ")}`);
      if (!Array.isArray(t.items) || !t.items.length) return fail(`${name}: needs a list of items`);
      const items = t.items.map((it, j) => checkItem(it, `${name}, item ${j + 1}`)).filter((x): x is ToolboxItemRef => !!x);
      if (t.items.length < 2 || t.items.length > 7) warn(`${name}: has ${t.items.length} item(s); the rule is 2 to 7`);
      const refs = items.map(x => x.ref);
      if (new Set(refs).size !== refs.length) warn(`${name}: lists the same item twice`);
      if (["web_page", "ad_creative", "copy", "email"].includes(t.kind as string)) {
        for (const use of ["explore", "check"] as const) if (!items.some(x => x.use === use)) warn(`${name}: a buyer sees this work, but it has no "${use}" item (add one, or write a gap)`);
      }
      tasks.push({ id: t.id, task: t.task.trim(), kind: t.kind as DeliverableFamily, items });
    });
    if (v.tasks.length < 10 || v.tasks.length > 24) warn(`has ${v.tasks.length} task(s); the rule is 10 to 24`);
  }

  const always: ToolboxItemRef[] = [];
  if (v.always !== undefined) {
    if (!Array.isArray(v.always)) fail("always must be a list");
    else {
      always.push(...v.always.map((it, j) => checkItem(it, `always, item ${j + 1}`)).filter((x): x is ToolboxItemRef => !!x));
      if (v.always.length > 6) warn(`always has ${v.always.length} items; the most is 6`);
    }
  }
  const helpers: ToolboxHelper[] = [];
  if (v.helpers !== undefined) {
    if (!Array.isArray(v.helpers)) fail("helpers must be a list");
    else {
      v.helpers.forEach((raw, i) => {
        const h = raw as Record<string, unknown> | null;
        if (!h || typeof h !== "object" || !str(h.role) || !KEBAB.test(h.role) || !str(h.when)) return fail(`helper ${i + 1} needs a role id and a "when"`);
        if (h.role === roleId) return warn(`helper ${h.role} is this role itself, so it is left out`);
        if (roleIds && !roleIds.has(h.role)) return warn(`helper ${h.role} is not a role in packs/roles/, so it is left out`);
        if (helpers.some(x => x.role === h.role)) return warn(`helper ${h.role} is listed twice`);
        helpers.push({ role: h.role, when: h.when.trim() });
      });
      if (v.helpers.length < 2 || v.helpers.length > 6) warn(`has ${v.helpers.length} helper(s); the rule is 2 to 6`);
    }
  }
  const gaps: string[] = [];
  if (v.gaps !== undefined) {
    if (!Array.isArray(v.gaps) || v.gaps.some(g => typeof g !== "string")) fail("gaps must be a list of sentences");
    else gaps.push(...(v.gaps as string[]).map(g => g.trim()).filter(Boolean));
  }
  if (errors.length) return { toolbox: null, errors, warnings };

  const toolbox: ToolboxJson = { schema: TOOLBOX_SCHEMA, role: roleId, reviewed: v.reviewed as string, tasks, always, helpers, gaps };
  const library = toolboxLibraryRefs(toolbox);
  if (library.length < 30 || library.length > 70) warn(`names ${library.length} library item(s); the rule is 30 to 70 (fewer only when the library has fewer good fits, said in gaps)`);
  const minds = library.filter(l => l.type === "mind").length;
  if (minds > 6) warn(`names ${minds} minds; the most is 6`);
  const used = new Set([...tasks.flatMap(t => t.items), ...always].map(i => kitRefPath(i.ref)).filter(Boolean));
  const unused = [...kit].filter(p => (/^skills\/[^/]+\/SKILL\.md$/.test(p) || /^(prompts|workflows)\/[^/]+\.md$/.test(p)) && !used.has(p)).sort();
  if (unused.length) warn(`no task uses ${unused.join(", ")}; every kit skill, prompt and workflow belongs in at least one task`);
  return { toolbox, errors, warnings };
}

// ---------- toolbox.md ----------

/** What files.json carries about a pack's toolbox, for the agent's profile page (and anyone who lists a pack). */
export interface ToolboxSummary {
  schema: typeof TOOLBOX_SUMMARY_SCHEMA;
  /** When a curator last reviewed the role's toolbox.json. */
  reviewed: string;
  /** Words in toolbox.md up to its "More" list. */
  words: number;
  /** Every task of the role, in the order toolbox.md gives them: this agent's own kind of work first (`mine`). */
  tasks: { id: string; task: string; kind: DeliverableFamily; mine: boolean; items: number }[];
  /** How many different items the toolbox holds: the role kit's own files (`kit`), then library items by type. */
  counts: Record<LibraryType | "kit" | "total", number>;
  /** The items by type, each with its plain name. Library items carry the library page; `path` is the file in the pack. */
  items: {
    kit: { name: string; path: string; kind: "skill" | "prompt" | "workflow" }[];
  } & Record<LibraryType, { slug: string; name: string; path: string; url: string }[]>;
  /** Other job roles this agent brings in on a complex job, with the agent load_agent returns for the role. */
  helpers: { role: string; name: string; when: string; agent: { id: string; name: string; title: string } | null }[];
  /** Items toolbox.json names that the build could not ship (a slug the library does not have, say). */
  left_out: string[];
}

export interface ToolboxInput {
  toolbox: ToolboxJson;
  /** Train packs name library items by address instead of carrying them (the studio import takes small text packs). */
  kind: "agent" | "train";
  origin?: string;
  agentName: string;
  /** The agent's own title ("Social media designer"); a title that is just the role's name marks a generalist. */
  agentTitle: string;
  roleName: string;
  /** Plain names of the pack's skills, prompts and workflows, by pack path. Kit refs must be among them. */
  packFiles: { path: string; name: string }[];
  /** The persona's job skills: where each job's gates and craft scores are. */
  jobSkills: { title: string; path: string }[];
  /** Library items by slug, already rendered. A named item that is missing is left out, with a note. */
  library: Record<string, LibraryItem>;
  helpers: Record<string, HelperRole>;
  /** What this agent is hired for, in words (title, tagline, outcomes, job types), to put its own tasks first. */
  personaText: string;
  /** The families of the persona's job types. */
  families: DeliverableFamily[];
}

export interface BuiltToolbox {
  markdown: string;
  /** The library items the pack carries, sorted by path. Empty for a train pack. */
  items: LibraryItem[];
  /** Pack paths of library items, best for this persona first: the one-file text carries the first few in full. */
  top: string[];
  summary: ToolboxSummary;
  notes: string[];
}

interface Line { key: string; use: ToolboxUse; when: string; name: string; path: string; label: string; library: LibraryItem | null; shown: string }

const stripEnd = (s: string) => s.trim().replace(/[.:;,\s]+$/, "");
const upperFirst = (s: string) => s ? s[0].toUpperCase() + s.slice(1) : s;
const kitKind = (path: string) => path.startsWith("prompts/") ? "prompt" as const : path.startsWith("workflows/") ? "workflow" as const : "skill" as const;

/** At most `cap` items of a task: one that explores and one that checks first when the task has them, then by order. */
function keepBest<T extends { use: ToolboxUse }>(items: T[], cap: number): { kept: T[]; rest: T[] } {
  if (items.length <= cap) return { kept: items, rest: [] };
  const keep = new Set<T>();
  for (const use of ["build", "explore", "check"] as const) { const hit = items.find(i => i.use === use); if (hit && keep.size < cap) keep.add(hit); }
  for (const i of items) if (keep.size < cap) keep.add(i);
  return { kept: items.filter(i => keep.has(i)), rest: items.filter(i => !keep.has(i)) };
}

/**
 * How many items a task keeps in the main list, tried in order until toolbox.md fits its word budget: [the agent's
 * own tasks, the other tasks]. No task goes below its best 4: past that, the file runs a little long (the linter
 * notes it) rather than hiding the "when" of items the agent needs to choose well.
 */
export const TASK_ITEMS_FLOOR = 4;
const CAPS: [number, number][] = [[99, 99], [99, TASK_ITEMS_FLOOR], [TASK_ITEMS_FLOOR, TASK_ITEMS_FLOOR]];

/**
 * toolbox.md and the item files for one pack. Tasks that match what this agent is hired for come first; when the
 * list runs past the word budget, every task stays but keeps its best few items, and the rest move to "More".
 */
export function buildToolbox(input: ToolboxInput): BuiltToolbox {
  const { toolbox, kind } = input;
  const origin = (input.origin ?? ORIGIN).replace(/\/+$/, "");
  const notes: string[] = [];
  const leftOut = new Set<string>();
  const names = new Map(input.packFiles.map(f => [f.path, f.name]));

  const line = (item: ToolboxItemRef): Line | null => {
    const kitPath = kitRefPath(item.ref);
    if (kitPath) {
      if (!names.has(kitPath)) { leftOut.add(item.ref); return null; }
      return { key: kitPath, use: item.use, when: item.when, name: names.get(kitPath)!, path: kitPath, label: TYPE_LABELS[kitKind(kitPath)], library: null, shown: `\`${kitPath}\`` };
    }
    const slug = item.ref.slice("library:".length);
    const lib = input.library[slug];
    if (!lib) { leftOut.add(item.ref); return null; }
    const path = toolboxItemPath(lib.type, lib.slug);
    return { key: path, use: item.use, when: item.when, name: lib.name, path, label: TYPE_LABELS[lib.type], library: lib, shown: kind === "agent" ? `\`${path}\`` : `${origin}/packs/${path}` };
  };
  const full = (l: Line) => `- ${upperFirst(stripEnd(l.when))}: **${l.name}** (${l.use}, ${l.label}) ${l.shown}`;
  const short = (l: Line) => `**${l.name}** ${l.shown}`;

  // This agent's own kind of work first: tasks whose words match its title, outcomes and job types (the same word
  // scoring load_agent used to route requests, route.ts). A task counts as its usual work when it scores at least
  // half of the best one. A generalist, whose title is the role's own name, keeps the curator's order: most common first.
  const tasks = toolbox.tasks.map(t => ({ ...t, lines: t.items.map(line).filter((l): l is Line => !!l) })).filter(t => t.lines.length);
  const candidates: RouteCandidate[] = tasks.map(t => ({ path: t.id, kind: "skill", name: t.task, text: t.lines.map(l => `${l.when} ${l.name}`).join(" ") }));
  const score = new Map(rankRoutes(input.personaText, candidates, 0).map(m => [m.candidate.path, m.score]));
  const titleWords = wordsOf(input.agentTitle), roleWords = wordsOf(input.roleName);
  const generalist = [...titleWords].every(w => roleWords.has(w));
  const scored = tasks.map((t, i) => ({
    ...t, i,
    score: (score.get(t.id) ?? 0) + (input.families.includes(t.kind) ? 0.5 : 0) + 1.5 * [...wordsOf(t.task)].filter(w => titleWords.has(w) && !roleWords.has(w)).length,
  }));
  const best = Math.max(0, ...scored.map(t => t.score));
  const mine = generalist ? [] : scored.filter(t => t.score >= Math.max(1.5, best / 2)).sort((a, b) => b.score - a.score || a.i - b.i);
  const mineIds = new Set(mine.map(t => t.id));
  // With nothing to tell the tasks apart, everything stays in the curator's order under one heading.
  const split = mine.length > 0 && mine.length < scored.length;
  const others = scored.filter(t => !split || !mineIds.has(t.id));
  const always = toolbox.always.map(line).filter((l): l is Line => !!l);
  for (const ref of leftOut) notes.push(`packs/roles/${toolbox.role}/toolbox.json: ${ref} is not available to this build, so packs leave it out`);

  const listed = new Set([...tasks.flatMap(t => t.lines), ...always].map(l => l.path));
  const jobPaths = new Set(input.jobSkills.map(j => j.path));
  const extras = input.packFiles.filter(f => !listed.has(f.path) && !jobPaths.has(f.path));
  const helpers = toolbox.helpers.map(h => ({ ...h, info: input.helpers[h.role] })).filter(h => {
    if (h.info?.lead) return true;
    notes.push(`packs/roles/${toolbox.role}/toolbox.json: helper ${h.role} has no live agent yet, so packs leave it out`);
    return false;
  });

  const head = [
    `# ${input.agentName}'s toolbox`,
    "",
    `Everything a ${input.roleName.toLowerCase()} is hired for, and what to use for each task. ${kind === "agent" ? "Every file named here is already in this pack" : "Role files are in this pack, and each library item is one named page at the address given"}: choose what fits the task at your own discretion, open only what you chose, and never search for more.`,
    "",
    "The word in brackets says what an item is for: brief (understand or plan the piece), explore (make clearly different options), build (make the thing), check (test or review it), think (a lens to look through).",
  ];
  const tail: string[] = [];
  if (extras.length) tail.push("", "## Also in this pack", "", ...extras.map(f => `- ${f.name} \`${f.path}\``));
  if (helpers.length) {
    tail.push("", "## Who to bring in", "",
      `On a complex job, hand part of it to a helper: a sub-agent where your app can start one, else a separate pass you run yourself. Load a helper with \`load_agent\` and its \`role_id\` (AI Blocks connector, ${origin}/mcp), or from its pack address; the same address ending \`.txt\` is the one-file version.`, "",
      ...helpers.map(h => `- **${h.info.name}** (\`role_id: "${h.role}"\`, ${origin}/packs/${h.info.lead!.id}.zip): ${stripEnd(h.when)}.`));
  }

  const render = ([capMine, capOther]: [number, number]) => {
    const main: string[] = [...head];
    const more: string[] = [];
    if (input.jobSkills.length) main.push("", "## Your jobs", "", "What to get first, the pass-or-fail gates and the craft scores for each job you are hired for:", "", ...input.jobSkills.map(j => `- ${j.title} \`${j.path}\``));
    if (always.length) main.push("", "## On every job", "", ...always.map(full));
    const group = (title: string, list: typeof scored, cap: number) => {
      if (!list.length) return;
      main.push("", `## ${title}`);
      for (const t of list) {
        const { kept, rest } = keepBest(t.lines, cap);
        main.push("", `### ${stripEnd(t.task)}`, "", ...kept.map(full));
        if (rest.length) more.push(`- ${stripEnd(t.task)}: ${rest.map(short).join("; ")}`);
      }
    };
    if (split) group("Your usual work", mine, capMine);
    group(split ? "Other work in your role" : "Your work, by task", others, capOther);
    const words = wordCount(main.join("\n"));
    if (more.length) main.push("", "## More", "", "More items for the tasks above. Open one when the first choices do not fit.", "", ...more);
    return { markdown: [...main, ...tail].join("\n"), words };
  };
  let out = render(CAPS[0]);
  for (let i = 1; i < CAPS.length && out.words > TOOLBOX_WORD_BUDGET; i++) out = render(CAPS[i]);

  // The best library items for this persona: one from "On every job", then the first item of each task in order, then the second, and so on.
  const top: string[] = [];
  const take = (l: Line | undefined) => { if (l?.library && l.library.type !== "mind" && !top.includes(l.path)) top.push(l.path); };
  const ordered = split ? [...mine, ...others] : others;
  always.slice(0, 2).forEach(take);
  for (let rank = 0; rank < 7; rank++) for (const t of ordered) take(t.lines[rank]);
  always.forEach(take);

  const all = [...tasks.flatMap(t => t.lines), ...always];
  const library = new Map<string, LibraryItem>();
  const kitItems = new Map<string, string>();
  for (const l of all) { if (l.library) library.set(l.path, l.library); else kitItems.set(l.path, l.name); }
  const items = [...library].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).map(([, item]) => item);
  const byType = Object.fromEntries(LIBRARY_TYPES.map(t => [t, items.filter(i => i.type === t).map(i => ({ slug: i.slug, name: i.name, path: toolboxItemPath(i.type, i.slug), url: i.url }))])) as Record<LibraryType, { slug: string; name: string; path: string; url: string }[]>;
  const kitList = [...kitItems].map(([path, name]) => ({ name, path, kind: kitKind(path) }));
  const summary: ToolboxSummary = {
    schema: TOOLBOX_SUMMARY_SCHEMA,
    reviewed: toolbox.reviewed,
    words: out.words,
    tasks: ordered.map(t => ({ id: t.id, task: t.task, kind: t.kind, mine: split && mineIds.has(t.id), items: t.lines.length })),
    counts: { kit: kitList.length, ...Object.fromEntries(LIBRARY_TYPES.map(t => [t, byType[t].length])) as Record<LibraryType, number>, total: kitList.length + items.length },
    items: { kit: kitList, ...byType },
    helpers: helpers.map(h => ({ role: h.role, name: h.info.name, when: h.when, agent: h.info.lead })),
    left_out: [...leftOut].sort(),
  };
  return { markdown: out.markdown, items: kind === "agent" ? items : [], top, summary, notes };
}

/**
 * toolbox.md for a role with no toolbox.json yet: the pack's skills, prompts and workflows as one plain list, so
 * AGENTS.md can always send the agent here. No library items and no "when": that is the curated file's job.
 */
export function fallbackToolbox(input: { agentName: string; roleName: string; jobSkills: { title: string; path: string }[]; files: { path: string; name: string; about: string }[] }): string {
  const out = [
    `# ${input.agentName}'s toolbox`,
    "",
    `The skills, prompts and workflows in this pack for the ${input.roleName.toLowerCase()} role. Choose what fits the task at your own discretion, use the narrowest one, and open only what you chose. Every file named here is already in this pack.`,
  ];
  if (input.jobSkills.length) out.push("", "## Your jobs", "", "What to get first, the pass-or-fail gates and the craft scores for each job you are hired for:", "", ...input.jobSkills.map(j => `- ${j.title} \`${j.path}\``));
  const jobPaths = new Set(input.jobSkills.map(j => j.path));
  for (const [title, prefix] of [["Skills", "skills/"], ["Prompts", "prompts/"], ["Workflows", "workflows/"]] as const) {
    const list = input.files.filter(f => f.path.startsWith(prefix) && !jobPaths.has(f.path));
    if (list.length) out.push("", `## ${title}`, "", ...list.map(f => `- ${f.about ? `${stripEnd(f.about)}: ` : ""}**${f.name}** \`${f.path}\``));
  }
  if (out.length === 3) out.push("", "This role's skills are coming with its researched knowledge. Until then, work from WORK-METHOD.md and playbook.md.");
  return out.join("\n");
}

// ---------- Helpers and the library index ----------

/** The agent load_agent returns for a job role: the live house agent with the lowest sort, a mega agent only when no other. */
export function leadAgentOfRole<T extends Pick<Persona, "id" | "kind" | "status" | "role" | "sort" | "mega">>(personas: T[], roleId: string): T | null {
  const list = personas.filter(p => p.kind === "house" && p.status === "live" && p.role === roleId)
    .sort((a, b) => Number(!!a.mega) - Number(!!b.mega) || a.sort - b.sort || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return list[0] ?? null;
}

export interface ToolboxIndex {
  schema: typeof TOOLBOX_INDEX_SCHEMA;
  /** Library slug -> its type, its name and the job roles whose agents carry it. */
  items: Record<string, { type: LibraryType; name: string; roles: string[] }>;
  /** Job role id -> its name and its live agents, so a library page can link to the agents that carry an item. */
  roles: Record<string, { name: string; agents: { id: string; name: string; title: string }[] }>;
}

/** toolbox-index.json: which job roles carry each library item (only items the build could ship). */
export function toolboxIndex(toolboxes: Iterable<ToolboxJson>, library: Record<string, LibraryItem>, roles: Record<string, { name: string; agents: { id: string; name: string; title: string }[] }>): ToolboxIndex {
  const items: ToolboxIndex["items"] = {};
  const used: ToolboxIndex["roles"] = {};
  for (const toolbox of [...toolboxes].sort((a, b) => (a.role < b.role ? -1 : a.role > b.role ? 1 : 0))) {
    for (const { slug } of toolboxLibraryRefs(toolbox)) {
      const item = library[slug];
      if (!item) continue;
      (items[slug] ??= { type: item.type, name: item.name, roles: [] }).roles.push(toolbox.role);
    }
    if (roles[toolbox.role]) used[toolbox.role] = roles[toolbox.role];
  }
  return { schema: TOOLBOX_INDEX_SCHEMA, items: Object.fromEntries(Object.keys(items).sort().map(k => [k, items[k]])), roles: used };
}
