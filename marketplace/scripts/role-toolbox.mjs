// Writes src/modules/directory/data/role-toolbox.json: what each job role's agents can do and what they bring, for
// the profile pages ("What I can do", "What I bring"), the crawler copy and the directory search.
// Source: every role kit in packs/roles/<role-id>/ (its skills, prompts and workflows, named by each file's first
// heading) and its toolbox.json (tasks in plain words, library items, helper roles). Library items are named from
// catalogue-items/ (page.yaml name, else item.yaml name; minds from mind.yaml; AI tool guides from ai-tools/*.yaml).
// An item with no page on useaiblocks.com is listed under "unpaged", so the site names it without a link.
// A role with no toolbox.json yet still gets its kit, so its agents show real counts of their own files.
// Run by `npm run build` before vite build. Nothing here runs a model or reads the network.
//   node scripts/role-toolbox.mjs           write the file when a kit, a toolbox or the library changed it
//   node scripts/role-toolbox.mjs --check   exit 1 if the file is out of date
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
export const PACKS = path.join(ROOT, "packs");
export const CATALOGUE = path.join(ROOT, "..", "catalogue-items");
export const OUT = path.join(ROOT, "src", "modules", "directory", "data", "role-toolbox.json");
export const SCHEMA = "ai-blocks-role-toolbox/1";

const LIBRARY_TYPES = ["skill", "workflow", "prompt", "agent", "mind", "tool"];
const ITEM_SECTIONS = ["general", "ecommerce", "imported", "orchestrators", "agents"];
const KINDS = ["web_page", "ad_creative", "copy", "email", "audit", "analysis", "strategy", "plan", "code", "ops_doc", "other"];

const read = file => readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const isDir = p => statSync(p, { throwIfNoEntry: false })?.isDirectory() ?? false;
const oneLine = text => String(text ?? "").replace(/\s+/g, " ").trim();
/** A top-level `key: value` line of a YAML file, without its quotes. Enough for slug, name, type and headline. */
const field = (text, key) => {
  const raw = new RegExp(`^${key}:[ \\t]*(.+?)[ \\t]*$`, "m").exec(text)?.[1];
  if (!raw || raw === "|" || raw === ">" || raw === "|-" || raw === ">-") return undefined;
  const quoted = /^(["'])(.*)\1$/.exec(raw);
  if (!quoted) return raw;
  return quoted[1] === '"' ? quoted[2].replace(/\\(["\\])/g, "$1") : quoted[2].replace(/''/g, "'");
};
const frontMatter = md => /^---\n([\s\S]*?)\n---\n?/.exec(md);
const heading = md => { const body = md.slice(frontMatter(md)?.[0].length ?? 0); return oneLine(/^#[ \t]+(.+?)[ \t#]*$/m.exec(body)?.[1] ?? ""); };
/** "print-layout-spec" -> "Print layout spec", for a file with no heading. */
const fromSlug = slug => { const s = slug.replace(/[-_]+/g, " ").trim(); return s.charAt(0).toUpperCase() + s.slice(1); };
const clip = (text, max) => { const t = oneLine(text); return t.length <= max ? t : t.slice(0, max).replace(/\s+\S*$/, ""); };

/** Where the library site puts an item's page, by its own rule (site/scripts/lib/crawl-files.mjs kindPath): the folder
 *  name is the slug, an item in orchestrators/ or of type workflow or routine is a workflow, and so on. */
const pageFolder = (section, type) => type === "mind" ? "minds" : type === "agent" ? "agents" : section === "orchestrators" || type === "workflow" || type === "routine" ? "workflows" : type === "prompt" ? "prompts" : "skills";

/**
 * Looks library items up one at a time, so a run opens only the items some toolbox names (about 2,000 of 5,000).
 * find(type, slug) returns { key, name, paged } or null. key is the page's path on useaiblocks.com without the
 * leading slash ("skills/<slug>", "workflows/<slug>", "prompts/<slug>", "agents/<slug>", "minds/<slug>",
 * "ai-tools/<slug>"); paged is false when the library has no page for the item. Quarantined items are never found.
 */
export function libraryLookup(root = CATALOGUE) {
  const quarantineFile = path.join(root, "quarantine.yaml");
  const quarantined = new Set(existsSync(quarantineFile) ? [...read(quarantineFile).matchAll(/^(?:- +)?["']?([a-z0-9][a-z0-9-]*)["']?:?[ 	]*(?:#.*)?$/gm)].map(m => m[1]) : []);
  const cache = new Map();
  const lookup = (type, slug) => {
    if (quarantined.has(slug) || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;
    if (type === "mind") {
      const file = path.join(root, "minds", slug, "mind.yaml");
      return existsSync(file) ? { key: `minds/${slug}`, name: oneLine(field(read(file), "name")) || fromSlug(slug), paged: true } : null;
    }
    if (type === "tool") {
      const file = path.join(root, "ai-tools", `${slug}.yaml`);
      return existsSync(file) ? { key: `ai-tools/${slug}`, name: oneLine(field(read(file), "name")) || fromSlug(slug), paged: true } : null;
    }
    for (const section of ITEM_SECTIONS) {
      const file = path.join(root, section, slug, "item.yaml");
      if (!existsSync(file)) continue;
      const item = read(file);
      const pageFile = path.join(root, section, slug, "page.yaml");
      const page = existsSync(pageFile) ? read(pageFile) : "";
      return { key: `${pageFolder(section, field(item, "type"))}/${slug}`, name: oneLine(field(page, "name") ?? field(item, "name")) || fromSlug(slug), paged: !!field(page, "headline") };
    }
    return null;
  };
  return { find: (type, slug) => { const id = `${type}:${slug}`; if (!cache.has(id)) cache.set(id, lookup(type, slug)); return cache.get(id); } };
}

/** The kit's own skills, prompts and workflows as { "<folder>/<name>": plain name }, plus a line of search text per skill. */
export function kitFiles(kitDir) {
  const names = {}, skillText = {};
  const skills = path.join(kitDir, "skills");
  if (isDir(skills)) for (const name of readdirSync(skills).sort()) {
    const file = path.join(skills, name, "SKILL.md");
    if (!existsSync(file)) continue;
    const md = read(file);
    names[`skills/${name}`] = heading(md) || fromSlug(name);
    const front = frontMatter(md)?.[1] ?? "";
    skillText[`skills/${name}`] = clip((/^description:[ \t]*([\s\S]*?)(?=\n[A-Za-z_][\w-]*:|\s*$)/m.exec(front)?.[1] ?? "").replace(/^(["'])([\s\S]*)\1$/, "$2"), 220);
  }
  for (const folder of ["prompts", "workflows"]) {
    const dir = path.join(kitDir, folder);
    if (isDir(dir)) for (const file of readdirSync(dir).filter(f => f.endsWith(".md")).sort()) {
      names[`${folder}/${file.slice(0, -3)}`] = heading(read(path.join(dir, file))) || fromSlug(file.slice(0, -3));
    }
  }
  return { names, skillText };
}

/**
 * The whole data file as an object. `problems` lists anything left out (a ref to a file the kit does not hold, a
 * library slug that is not in the library): the profile then simply does not show it. check-toolbox.mjs is the
 * strict checker; this script never stops a build over one bad row.
 */
export function buildRoleToolbox({ packs = PACKS, catalogue = CATALOGUE } = {}) {
  const rolesDir = path.join(packs, "roles");
  const roleIds = isDir(rolesDir) ? readdirSync(rolesDir).filter(id => existsSync(path.join(rolesDir, id, "role.json"))).sort() : [];
  const known = new Set(roleIds);
  const index = libraryLookup(catalogue);
  const library = {}, unpaged = new Set(), roles = {}, problems = [];

  for (const roleId of roleIds) {
    const kitDir = path.join(rolesDir, roleId);
    const { names, skillText } = kitFiles(kitDir);
    const role = { kit: names, skills: {}, tasks: [], items: [], helpers: [], reviewed: null };
    const taskNames = {};
    const file = path.join(kitDir, "toolbox.json");
    let box = null;
    if (existsSync(file)) {
      try { box = JSON.parse(read(file)); } catch (e) { problems.push(`${roleId}: toolbox.json is not valid JSON (${e.message})`); }
    }
    if (box && typeof box === "object" && !Array.isArray(box)) {
      const seen = new Set();
      /** One row's item key: "kit:<path>" for the kit's own file, else the library page's path. null when neither holds it. */
      const keyOf = (item, at) => {
        const ref = item && typeof item.ref === "string" ? item.ref : "";
        if (ref.startsWith("kit:")) {
          if (names[ref.slice(4)]) return ref;
          problems.push(`${roleId}: ${at} names ${ref}, which is not in the kit`);
          return null;
        }
        if (!ref.startsWith("library:") || !LIBRARY_TYPES.includes(item.type)) { problems.push(`${roleId}: ${at} has a row with no usable ref`); return null; }
        const hit = index.find(item.type, ref.slice(8));
        if (!hit) { problems.push(`${roleId}: ${at} names the ${item.type} ${ref.slice(8)}, which is not in the library`); return null; }
        library[hit.key] = hit.name;
        if (!hit.paged) unpaged.add(hit.key);
        return hit.key;
      };
      const keep = key => { if (key && !seen.has(key)) { seen.add(key); role.items.push(key); } };
      for (const task of Array.isArray(box.tasks) ? box.tasks : []) {
        if (!task || typeof task.id !== "string" || typeof task.task !== "string" || !task.task.trim()) continue;
        const text = oneLine(task.task);
        role.tasks.push({ id: task.id, task: text, kind: KINDS.includes(task.kind) ? task.kind : "other" });
        for (const item of Array.isArray(task.items) ? task.items : []) {
          const key = keyOf(item, `task ${task.id}`);
          keep(key);
          if (key?.startsWith("kit:skills/")) (taskNames[key.slice(4)] ??= []).push(text);
        }
      }
      for (const item of Array.isArray(box.always) ? box.always : []) keep(keyOf(item, "always"));
      for (const helper of Array.isArray(box.helpers) ? box.helpers : []) {
        if (helper && known.has(helper.role) && helper.role !== roleId && !role.helpers.includes(helper.role)) role.helpers.push(helper.role);
        else problems.push(`${roleId}: helper ${helper?.role} is not a role kit`);
      }
      role.reviewed = typeof box.reviewed === "string" && /^\d{4}-\d{2}-\d{2}$/.test(box.reviewed) ? box.reviewed : null;
    }
    // What the profile matches an outcome against, to link "See how I do this" to the right skill: the skill's own
    // description, then the tasks that use it.
    for (const key of Object.keys(names).filter(k => k.startsWith("skills/"))) {
      role.skills[key.slice(7)] = clip([skillText[key], ...(taskNames[key] ?? [])].filter(Boolean).join(" | "), 400);
    }
    roles[roleId] = role;
  }
  const sorted = Object.fromEntries(Object.keys(library).sort().map(k => [k, library[k]]));
  return { data: { schema: SCHEMA, library: sorted, unpaged: [...unpaged].sort(), roles }, problems };
}

/** One role per line, so a change to one kit is one changed line. */
export function serialise(data) {
  const lines = obj => Object.entries(obj).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n");
  return `{\n  "schema": ${JSON.stringify(data.schema)},\n  "library": {\n${lines(data.library)}\n  },\n  "unpaged": ${JSON.stringify(data.unpaged)},\n  "roles": {\n${lines(data.roles)}\n  }\n}\n`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes("--check");
  const { data, problems } = buildRoleToolbox();
  const next = serialise(data);
  const current = existsSync(OUT) ? read(OUT) : "";
  const roles = Object.values(data.roles), withBox = roles.filter(r => r.tasks.length).length;
  const summary = `${roles.length} roles, ${withBox} with a toolbox, ${Object.keys(data.library).length} library items`;
  for (const p of problems) console.warn(`role-toolbox: left out: ${p}`);
  if (current === next) console.log(`role-toolbox: ${summary}, up to date.`);
  else if (check) { console.error("role-toolbox: src/modules/directory/data/role-toolbox.json is out of date; run node scripts/role-toolbox.mjs in marketplace/"); process.exit(1); }
  else { writeFileSync(OUT, next); console.log(`role-toolbox: wrote ${summary}.`); }
}
