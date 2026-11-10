// "Agents who use this" on item pages: the named agents (agents.useaiblocks.com) whose job role lists a library item
// in its toolbox. The toolboxes are marketplace/packs/roles/<role>/toolbox.json (schema ai-blocks-toolbox/1) and the
// agents are the personas in marketplace/src/modules/directory/data/personas-*.json, matched by their `role`.
// scripts/build-item-agents.mjs writes the result to public/data/item-agents/<first character>.json; the app
// (src/AgentsForItem.tsx) and the plain pages (scripts/prerender.mjs) read those same files.
// No toolbox files yet means no links: every reader here returns nothing instead of failing.
import fs from "node:fs";
import path from "node:path";

export const ITEM_AGENTS_SCHEMA = "ai-blocks-item-agents/1";
export const AGENTS_TITLE = "Agents who use this";
export const AGENTS_NOTE = "These named agents bring this to their jobs. Open one to see what else they do.";
export const AGENT_URL = (id) => `https://agents.useaiblocks.com/agents/${id}`;
export const MAX_AGENTS = 4;
/** One file per first character of the slug, so an item page fetches a few kilobytes. */
export const SHARDS = [..."abcdefghijklmnopqrstuvwxyz0123456789"];

const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const readJson = (file) => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; } };

/** role id -> Map(library slug -> the earliest task that lists it; 0 is the role's most common task, and an item the
 *  role uses on every job ("always") counts as 0 too). */
export function readToolboxes(rolesDir) {
  const out = new Map(), problems = [];
  if (!rolesDir || !fs.existsSync(rolesDir)) return { toolboxes: out, problems };
  for (const role of fs.readdirSync(rolesDir).sort()) {
    const file = path.join(rolesDir, role, "toolbox.json");
    if (!fs.existsSync(file)) continue;
    const box = readJson(file);
    if (!box || box.schema !== "ai-blocks-toolbox/1" || !Array.isArray(box.tasks)) { problems.push(`${role}/toolbox.json is not a readable ai-blocks-toolbox/1 file`); continue; }
    const slugs = new Map();
    const add = (items, at) => { for (const item of Array.isArray(items) ? items : []) { const slug = /^library:([a-z0-9][a-z0-9-]*)$/.exec(String(item?.ref ?? ""))?.[1]; if (slug && !slugs.has(slug)) slugs.set(slug, at); } };
    add(box.always, 0);
    box.tasks.forEach((task, at) => add(task?.items, at));
    if (slugs.size) out.set(role, slugs);
  }
  return { toolboxes: out, problems };
}

/** role id -> its live agents as [id, name, title], in the directory's own order. */
export function readPersonas(dataDir) {
  const byRole = new Map();
  if (!dataDir || !fs.existsSync(dataDir)) return byRole;
  const rows = fs.readdirSync(dataDir).filter((f) => /^personas-.*\.json$/.test(f)).sort().flatMap((f) => { const list = readJson(path.join(dataDir, f)); return Array.isArray(list) ? list : []; });
  const live = rows.filter((p) => p && ID.test(String(p.id)) && typeof p.name === "string" && p.name.trim() && typeof p.role === "string" && (p.status ?? "live") === "live");
  live.sort((a, b) => (Number(a.sort) || 0) - (Number(b.sort) || 0) || a.id.localeCompare(b.id));
  for (const p of live) (byRole.get(p.role) ?? byRole.set(p.role, []).get(p.role)).push([p.id, p.name.trim(), String(p.title ?? "").trim()]);
  return byRole;
}

/** library slug -> up to `max` agents. Roles that reach for the item in a more common task come first, and each role
 *  gives one agent before any role gives a second, so four links show four different kinds of agent where they exist. */
export function itemAgents({ rolesDir, personasDir, known = null, max = MAX_AGENTS }) {
  const { toolboxes, problems } = readToolboxes(rolesDir);
  const personas = readPersonas(personasDir);
  const rolesBySlug = new Map();
  for (const [role, slugs] of toolboxes) {
    if (!personas.has(role)) continue;
    for (const [slug, at] of slugs) if (!known || known.has(slug)) (rolesBySlug.get(slug) ?? rolesBySlug.set(slug, []).get(slug)).push([role, at]);
  }
  const links = new Map();
  for (const [slug, roles] of rolesBySlug) {
    roles.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
    const picked = [];
    for (let round = 0; picked.length < max; round++) {
      const next = roles.map(([role]) => personas.get(role)[round]).filter(Boolean);
      if (!next.length) break;
      picked.push(...next.slice(0, max - picked.length));
    }
    links.set(slug, picked);
  }
  return { links, problems, roles: toolboxes.size };
}

/** The files the app and the plain pages read: every shard is written, empty or not, so no page fetches a missing file. */
export function writeItemAgents(links, outDir) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (const c of SHARDS) {
    const items = Object.fromEntries([...links].filter(([slug]) => slug[0] === c).sort((a, b) => a[0].localeCompare(b[0])));
    fs.writeFileSync(path.join(outDir, `${c}.json`), JSON.stringify({ schema: ITEM_AGENTS_SCHEMA, items }));
  }
}

/** slug -> [[agentId, name, title], ...] from the written files; empty when they are not there. */
export function loadItemAgents(dataDir = "public/data") {
  const dir = path.join(dataDir, "item-agents"), out = new Map();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const data = readJson(path.join(dir, f));
    if (data?.schema !== ITEM_AGENTS_SCHEMA || !data.items || typeof data.items !== "object") continue;
    for (const [slug, rows] of Object.entries(data.items)) if (Array.isArray(rows)) out.set(slug, rows.filter((r) => Array.isArray(r) && ID.test(String(r[0]))).slice(0, MAX_AGENTS));
  }
  return out;
}

export const agentLabel = ([, name, title]) => (title ? `${name}, ${title}` : name);

/** The block on a plain item page; empty when no agent carries the item. */
export function agentsSection(rows) {
  if (!rows?.length) return "";
  return `<section id="agents" class="bp-next agents-block"><h2>${AGENTS_TITLE}</h2><p>${AGENTS_NOTE}</p><ul>${rows.slice(0, MAX_AGENTS).map((row) => `<li><a href="${esc(AGENT_URL(row[0]))}">${esc(agentLabel(row))}</a></li>`).join("")}</ul></section>`;
}
