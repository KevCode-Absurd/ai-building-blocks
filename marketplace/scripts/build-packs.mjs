// Builds the agent packs into dist/packs after `vite build` (npm run build runs both), or rewrites the version lock.
//
//   node scripts/build-packs.mjs [--only=id,id] [--out=dist/packs]        build (fails when packs/versions.json is stale)
//   node scripts/build-packs.mjs --lock [--date=YYYY-MM-DD] [--only=id,id] rewrite packs/versions.json (npm run packs:lock)
//
// Versions come from packs/versions.json, not the build day: each pack ("<id>" and "<id>-train") has a content hash
// (packContentHash: every file rendered with a placeholder version) and the version and date of its last change.
// --lock keeps the entry while the hash is the same and gives a changed or new pack the day's date (--date, else
// PACK_DATE, else today in UTC). The build refuses to run on a stale lock, so an unchanged pack always comes out
// byte-identical and a deploy does not upload it again.
//
// For every live house persona the build writes (URLs are the same paths under the site):
//   dist/packs/<id>.zip                    "Download this agent"
//   dist/packs/<id>-train.zip              "Train your own"
//   dist/packs/<id>.txt                    the whole agent in one file, for chat apps ("Start in your AI")
//   dist/packs/<id>/<path>                 the agent's own files of its pack (browsable copy)
//   dist/packs/<id>/files.json             every file of the pack with its url, bytes, purpose and kind, plus the zips
//   dist/packs/roles/<role-id>/<path>      each ready role kit, once: its files as they stand, plus sources.md and
//                                          library.md as built for the packs
//   dist/packs/jobs/<skill-slug>/SKILL.md  each job skill, once
//   dist/packs/index.json                  every agent: versions, knowledge status, zips and files.json url
//   dist/packs/toolbox/<type>/<slug>.md    each library item a toolbox names, once, as the packs carry it
//   dist/packs/toolbox-index.json          library slug -> the job roles (and their agents) that carry it, for the
//                                          library site to link an item to its agents
//
// Toolboxes: a role kit with a toolbox.json (src/modules/packs/toolbox.ts) gets a curated toolbox.md and the full text
// of every library item it names, read here from ../catalogue-items. Nothing is searched when an agent works: the
// curator did the matching, and this build ships the result. A role with no toolbox.json builds as before, with a
// note. An item that cannot be shipped (unknown slug, quarantined, a made-up business in its text) is left out of the
// packs with a note, so one bad line never stops the build.
//
// Inputs: personas and job types from the app, roles from src/modules/directory/data/roles.json, role kits from
// packs/roles/<role-id>/, shared templates from packs/shared/ (the builder's fallback templates fill any gap).
// A role kit counts only once it has role.json and knowledge.md; until then its agents' knowledge is "pending".
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { housePersonas } from "../src/modules/directory/index.ts";
import { listJobTypes } from "../src/modules/catalogue/index.ts";
import { checkRoleKitJson, getRole, listRoles, personasWithUnknownRole } from "../src/modules/directory/roles.ts";
import {
  buildPack, fileUrl, filesIndex, lockKey, lockText, nextLockEntry, normalizeText, oneFileText, packContentHash, packZip, PackBuildError,
  RESERVED_PACK_PATHS, validateRoleKit,
} from "../src/modules/packs/build.ts";
import { validateMegaKit } from "../src/modules/packs/mega.ts";
import { lintNotes, lintPack, MADE_UP_BUSINESSES } from "../src/modules/packs/lint.ts";
import { checkToolbox, leadAgentOfRole, renderLibraryItem, renderToolGuide, toolboxIndex, toolboxLibraryRefs, yamlLite } from "../src/modules/packs/toolbox.ts";
import { TOOL_FILES } from "../src/modules/packs/build.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(process.argv.slice(2).map(a => { const m = /^--([a-z]+)(?:=(.*))?$/.exec(a); return m ? [m[1], m[2] ?? "true"] : [a, "true"]; }));
const LOCK_MODE = args.lock === "true";
// --packs=<dir> reads templates, kits and the lock from another folder (for trying a kit before it lands).
const PACKS = path.resolve(ROOT, args.packs ?? "packs");
const LOCK_FILE = path.join(PACKS, "versions.json");
const day = args.date ?? process.env.PACK_DATE ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) fatal(`--date must be YYYY-MM-DD, not ${day}`);
const OUT = path.resolve(ROOT, args.out ?? "dist/packs");
const only = args.only ? new Set(args.only.split(",").map(s => s.trim()).filter(Boolean)) : null;
const TEXT = /\.(md|json|txt|csv|ya?ml)$/i;

function fatal(message) {
  console.error(`build-packs: ${message}`);
  process.exit(1);
}

/** Every file under dir, as posix paths relative to dir, sorted. */
function walk(dir) {
  const out = [];
  const visit = rel => {
    for (const name of readdirSync(path.join(dir, rel)).sort()) {
      const r = rel ? `${rel}/${name}` : name;
      if (statSync(path.join(dir, r)).isDirectory()) visit(r);
      else out.push(r);
    }
  };
  if (existsSync(dir)) visit("");
  return out;
}

function readTextFiles(dir, warnings, label) {
  const files = {};
  for (const rel of walk(dir)) {
    if (/(^|\/)\.[^/]*$/.test(rel)) continue; // dotfiles such as .DS_Store
    // Tool fallbacks in packs/shared/tools/ may be scripts (see "Capture and check tools" below).
    const toolScript = label === "packs/shared" && /^tools\/[^/]+\.(mjs|js)$/i.test(rel);
    if (!TEXT.test(rel) && !toolScript) { warnings.push(`${label}/${rel}: not a text file, left out`); continue; }
    files[rel] = readFileSync(path.join(dir, rel), "utf8");
  }
  return files;
}

/** A few at a time (zipping and hashing are async); results keep the input order. */
async function pool(items, fn, size = 8) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) { const i = next++; results[i] = await fn(items[i]); }
  }));
  return results;
}

// ---------- Templates and role kits ----------

const warnings = [];
const templates = readTextFiles(path.join(PACKS, "shared"), warnings, "packs/shared");

const kits = new Map();      // role id -> { role, files } (files without role.json)
const kitFilesAsTheyStand = new Map(); // role id -> every text file of the kit, role.json included
const kitErrors = [];
const rolesDir = path.join(PACKS, "roles");
/** Every role folder: the roles a toolbox may name as helpers. */
const roleFolders = new Set(existsSync(rolesDir) ? readdirSync(rolesDir).filter(f => statSync(path.join(rolesDir, f)).isDirectory()) : []);
for (const folder of existsSync(rolesDir) ? readdirSync(rolesDir).sort() : []) {
  const dir = path.join(rolesDir, folder);
  if (!statSync(dir).isDirectory()) continue;
  const files = readTextFiles(dir, warnings, `packs/roles/${folder}`);
  if (!files["role.json"] || !files["knowledge.md"]?.trim()) {
    warnings.push(`packs/roles/${folder}: not ready yet (needs role.json and knowledge.md), so its agents' knowledge stays pending`);
    continue;
  }
  let roleJson;
  try { roleJson = JSON.parse(files["role.json"].replace(/^\uFEFF/, "")); } catch { kitErrors.push(`packs/roles/${folder}/role.json: not valid JSON`); continue; }
  const roleErrors = checkRoleKitJson(roleJson, folder);
  if (roleErrors.length) { kitErrors.push(...roleErrors); continue; }
  const all = { ...files };
  delete files["role.json"];
  const kit = { role: roleJson, files };
  const checked = validateRoleKit(kit, roleFolders);
  kitErrors.push(...checked.errors);
  warnings.push(...checked.warnings);
  if (!checked.errors.length) { kits.set(folder, kit); kitFilesAsTheyStand.set(folder, all); }
}
if (kitErrors.length) fatal(`role kits have problems:\n  ${kitErrors.join("\n  ")}`);

// Mega kits (packs/mega/<kit>/). A missing or incomplete kit never fails the build: its mega agents build without it
// (knowledge pending) and a note says why, so builds keep working while research runs.
const megaKits = new Map();             // kit id -> { json, files } (files without kit.json)
const megaFilesAsTheyStand = new Map(); // kit id -> every text file of the kit, kit.json included
const megaDir = path.join(PACKS, "mega");
for (const folder of existsSync(megaDir) ? readdirSync(megaDir).sort() : []) {
  const dir = path.join(megaDir, folder);
  if (!statSync(dir).isDirectory()) continue;
  const files = readTextFiles(dir, warnings, `packs/mega/${folder}`);
  let json = null;
  try { json = files["kit.json"] ? JSON.parse(files["kit.json"].replace(/^\uFEFF/, "")) : null; } catch { json = null; }
  const checked = validateMegaKit(folder, { json, files });
  warnings.push(...checked.warnings);
  if (checked.errors.length) {
    warnings.push(`packs/mega/${folder}: not ready yet, so its mega agents build without it (${checked.errors.length} problem${checked.errors.length === 1 ? "" : "s"}; first: ${checked.errors[0]})`);
    continue;
  }
  const rest = { ...files };
  delete rest["kit.json"];
  megaKits.set(folder, { json, files: rest });
  megaFilesAsTheyStand.set(folder, files);
}

// ---------- Capture and check tools ----------
// The library owns them (catalogue-items/general/<skill>/, any depth); --tools=<dir> reads them from one folder
// instead. packs/shared/tools/ holds fallbacks for files the library does not have yet. A tool found nowhere is
// left out, and the packs link to its public address (/tools/<file>) instead. The library names the defaults list
// ai-default-patterns/patterns.md; packs carry it as tools/ai-default-patterns.md.
const LIBRARY = path.resolve(ROOT, "..", "catalogue-items", "general");
const TOOL_HOMES = ["brand-dna-capture", "brand-fidelity-check", "ai-default-patterns", "grounded-job-protocol", "make-three-first-screens"];
const tools = {};
const toolFrom = {};
for (const { name } of TOOL_FILES) {
  const dirs = args.tools ? [path.resolve(ROOT, args.tools)] : TOOL_HOMES.map(h => path.join(LIBRARY, h));
  const found = dirs.flatMap(d => walk(d).filter(r => r.split("/").pop() === name || (name === "ai-default-patterns.md" && r === "patterns.md" && path.basename(d) === "ai-default-patterns")).map(r => path.join(d, r)))[0];
  if (found) { tools[name] = readFileSync(found, "utf8"); toolFrom[name] = path.relative(path.resolve(ROOT, ".."), found).replace(/\\/g, "/"); }
  else if (templates[`tools/${name}`]?.trim()) { tools[name] = templates[`tools/${name}`]; toolFrom[name] = `marketplace/packs/shared/tools/${name} (fallback)`; }
  else warnings.push(`tool ${name} is not in the library yet (${TOOL_HOMES.join(", ")}), so packs link to /tools/${name} instead of carrying it`);
}

// ---------- Toolboxes and the library items they name ----------
// Each item is read once from ../catalogue-items and rendered once (toolbox.ts), so every pack that carries it holds
// the same text and the browsable copy is one file: /packs/toolbox/<type>/<slug>.md.

const CATALOGUE = path.resolve(ROOT, "..", "catalogue-items");
const ITEM_GROUPS = ["general", "ecommerce", "imported", "agents", "orchestrators"];
const toolboxes = new Map(); // role id -> the checked toolbox.json
for (const [roleId, kit] of kits) {
  if (!kit.files["toolbox.json"]) continue;
  const { toolbox } = checkToolbox(JSON.parse(kit.files["toolbox.json"].replace(/^\uFEFF/, "")), roleId, Object.keys(kit.files), roleFolders);
  if (toolbox) toolboxes.set(roleId, toolbox);
}

let itemDirs = null;
/** The folder of a skill, prompt, workflow or library agent, by slug. */
function itemDir(slug) {
  if (!itemDirs) {
    itemDirs = new Map();
    for (const group of ITEM_GROUPS) {
      const dir = path.join(CATALOGUE, group);
      if (!existsSync(dir)) continue;
      for (const name of readdirSync(dir)) if (!itemDirs.has(name)) itemDirs.set(name, path.join(dir, name));
    }
  }
  return itemDirs.get(slug) ?? null;
}
const readIf = file => (existsSync(file) ? readFileSync(file, "utf8") : null);
const quarantined = (() => {
  const q = yamlLite(readIf(path.join(CATALOGUE, "quarantine.yaml")) ?? "");
  return new Set(Array.isArray(q) ? q.map(x => (typeof x === "string" ? x : x?.slug)).filter(Boolean) : Object.keys(q ?? {}));
})();

// The name and summary a visitor sees on the site: catalogue-items/display-copy.yaml wins, then page.yaml, then
// item.yaml (site/scripts/build-index.mjs applies them in that order), so a pack names an item as its page does.
const displayCopy = yamlLite(readIf(path.join(CATALOGUE, "display-copy.yaml")) ?? "") ?? {};
const shownAs = (slug, ...metas) => {
  const pick = key => [displayCopy[slug], ...metas].map(m => (m && typeof m[key] === "string" ? m[key].trim() : "")).find(Boolean) || "";
  return { name: pick("name") || slug, summary: pick("summary") };
};

/** One library item as packs carry it, or a plain reason it cannot be shipped. */
function readLibraryItem(slug, type) {
  if (quarantined.has(slug)) return { skip: "is quarantined in the library" };
  const toolFile = path.join(CATALOGUE, "ai-tools", `${slug}.yaml`);
  const mindDir = path.join(CATALOGUE, "minds", slug);
  const dir = itemDir(slug);
  // The curator's type says where to look first; an item filed under another type is still found.
  const kinds = type === "tool" ? ["tool", "item", "mind"] : type === "mind" ? ["mind", "item", "tool"] : ["item", "mind", "tool"];
  for (const kind of kinds) {
    if (kind === "tool" && existsSync(toolFile)) return { item: renderToolGuide(slug, readFileSync(toolFile, "utf8")) };
    if (kind === "mind" && existsSync(path.join(mindDir, "SKILL.md"))) {
      const meta = yamlLite(readIf(path.join(mindDir, "mind.yaml")) ?? "");
      return { item: renderLibraryItem({ slug, type: "mind", ...shownAs(slug, meta), main: readFileSync(path.join(mindDir, "SKILL.md"), "utf8") }) };
    }
    if (kind === "item" && dir && existsSync(path.join(dir, "SKILL.md"))) {
      const meta = yamlLite(readIf(path.join(dir, "item.yaml")) ?? "") ?? {};
      const page = yamlLite(readIf(path.join(dir, "page.yaml")) ?? "") ?? {};
      const actual = meta.type === "agent" || meta.type === "prompt" ? meta.type : meta.type === "workflow" || meta.type === "routine" || meta.category === "orchestrator" ? "workflow" : "skill";
      const files = walk(dir).filter(f => !["SKILL.md", "item.yaml", "page.yaml"].includes(f));
      return { item: renderLibraryItem({ slug, type: actual, ...shownAs(slug, page, meta), main: readFileSync(path.join(dir, "SKILL.md"), "utf8"), files, uses: Array.isArray(meta.uses) ? meta.uses.filter(u => typeof u === "string") : [], packTools: packToolsOf[slug] ?? {} }) };
    }
  }
  return { skip: "is not in the library (catalogue-items)" };
}

// A library item's own script that also ships in every brand-facing pack's tools/ folder (the capture, check and
// compare tools come from the library): item slug -> { path in the item's folder: file name under tools/ }.
const packToolsOf = {};
for (const [name, from] of Object.entries(toolFrom)) {
  const m = /^catalogue-items\/[^/]+\/([^/]+)\/(.+)$/.exec(from);
  if (m) (packToolsOf[m[1]] ??= {})[m[2]] = name;
}

const library = {};       // slug -> the rendered item
const libraryNotes = [];  // items left out, and why
const typeNotes = [];
for (const [roleId, toolbox] of toolboxes) {
  for (const { slug, type } of toolboxLibraryRefs(toolbox)) {
    if (!(slug in library)) {
      const got = readLibraryItem(slug, type);
      const madeUp = got.item ? MADE_UP_BUSINESSES.map(re => re.exec(got.item.text)).find(Boolean) : null;
      library[slug] = got.item && !madeUp ? got.item : null;
      if (!library[slug]) libraryNotes.push(`library item ${slug} ${got.skip ?? `uses the made-up business "${madeUp[0]}"`}, so packs leave it out (first named by packs/roles/${roleId}/toolbox.json)`);
    }
    const item = library[slug];
    if (item && item.type !== type) typeNotes.push(`packs/roles/${roleId}/toolbox.json: library:${slug} is a ${item.type} in the library, not a ${type}; packs carry it as a ${item.type}`);
  }
}
for (const slug of Object.keys(library)) if (!library[slug]) delete library[slug];
warnings.push(...libraryNotes, ...typeNotes);

// ---------- Personas ----------

const jobTypes = listJobTypes();
// The roles a toolbox may bring in as helpers, each with the agent load_agent returns for its role_id (the lead).
const helpers = Object.fromEntries(listRoles().map(r => {
  const lead = leadAgentOfRole(housePersonas(), r.id);
  return [r.id, { name: r.name, lead: lead ? { id: lead.id, name: lead.name, title: lead.title } : null }];
}));
const personas = housePersonas().filter(p => p.kind === "house" && p.status === "live" && (!only || only.has(p.id)));
if (!personas.length) fatal("no live house personas to build");
for (const p of personas) if (RESERVED_PACK_PATHS.has(p.id)) fatal(`persona id "${p.id}" is a reserved name under /packs; rename the persona`);
for (const u of personasWithUnknownRole(personas)) warnings.push(`persona ${u.id}: role "${u.role}" is not in directory/data/roles.json, so it builds without a role`);
const inputFor = (persona, kind, version) => {
  const role = getRole(persona.role);
  const mega = persona.mega ? megaKits.get(persona.mega.kit) ?? null : null;
  return { persona, role, kit: role ? kits.get(role.id) ?? null : null, mega, jobTypes, templates, tools, library, helpers, options: { kind, ...version } };
};
const started = Date.now();

// ---------- Content hashes and the version lock ----------

let lock = {};
if (existsSync(LOCK_FILE)) {
  try { lock = JSON.parse(readFileSync(LOCK_FILE, "utf8")); } catch { fatal("packs/versions.json is not valid JSON. Run npm run packs:lock to rewrite it."); }
}
let hashes;
try {
  hashes = new Map((await pool(personas.flatMap(p => [[p, "agent"], [p, "train"]]), async ([p, kind]) =>
    [lockKey(p.id, kind), await packContentHash(inputFor(p, kind, { version: "", updated: "" }))])));
} catch (err) {
  if (err instanceof PackBuildError) fatal(err.message);
  throw err;
}

if (LOCK_MODE) {
  const next = only ? { ...lock } : {};
  let kept = 0, changed = 0;
  for (const [key, hash] of hashes) {
    const entry = nextLockEntry(lock[key], hash, day);
    if (entry === lock[key]) kept++; else changed++;
    next[key] = entry;
  }
  const removed = only ? 0 : Object.keys(lock).filter(k => !hashes.has(k)).length;
  mkdirSync(path.dirname(LOCK_FILE), { recursive: true });
  writeFileSync(LOCK_FILE, lockText(next));
  console.log(`build-packs: wrote packs/versions.json: ${hashes.size} packs, ${kept} unchanged, ${changed} new or changed (version ${day.replace(/-/g, ".")}), ${removed} removed; ${((Date.now() - started) / 1000).toFixed(1)}s`);
  process.exit(0);
}

const stale = [...hashes].filter(([key, hash]) => lock[key]?.hash !== hash).map(([key]) => key);
const gone = only ? [] : Object.keys(lock).filter(k => !hashes.has(k));
if (stale.length || gone.length) {
  const list = xs => `${xs.slice(0, 8).join(", ")}${xs.length > 8 ? ` and ${xs.length - 8} more` : ""}`;
  fatal(`packs/versions.json is out of date: ${stale.length ? `${stale.length} pack(s) are new or changed (${list(stale)})` : ""}${stale.length && gone.length ? "; " : ""}${gone.length ? `${gone.length} are no longer built (${list(gone)})` : ""}. Run npm run packs:lock, then commit packs/versions.json.`);
}

// ---------- Build ----------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

let zipBytes = 0, browseBytes = 0, fileCount = 0, pending = 0;
const shared = new Map(); // url -> content, for the role and job copies written once
// Packs are under the AI Blocks Agent Pack Licence 1.0 (not CC BY): flag old licence wording in the files that come
// from the shared templates or the builder. Researched role kit content may rightly cite a source's own CC licence.
const OLD_LICENCE = /CC[ -]BY|creativecommons\.org|Creative Commons/i;
const buildNotes = new Set();
/** Pack linter findings (src/modules/packs/lint.ts). Any finding stops the build; --lint=report prints them and goes on. */
const lintIssues = [];
/** Pack linter notes (lintNotes): printed once each, never a failure. message -> rule */
const lintNoteSet = new Map();
let toolboxPacks = 0, toolboxItemFiles = 0;

function writeAt(url, content) {
  const target = path.join(OUT, ...url.replace(/^\/packs\//, "").split("/"));
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content);
  browseBytes += Buffer.byteLength(content);
  fileCount++;
}
function writeShared(url, content) {
  const before = shared.get(url);
  if (before === undefined) { shared.set(url, content); writeAt(url, content); }
  else if (before !== content) fatal(`two packs need different text at ${url}; the builder should give them different paths`);
}

writeAt("/packs/coordinator/TEAM.md", readFileSync(path.join(PACKS, "coordinator/TEAM.md"), "utf8"));

// Each ready role kit once, as it stands (text files with LF endings and a final newline, as packs carry them).
for (const [roleId, files] of kitFilesAsTheyStand) {
  for (const [p, text] of Object.entries(files)) writeShared(`/packs/roles/${roleId}/${p}`, normalizeText(text));
}
// Each ready mega kit once, as it stands, for its agents' channel, specialist, prompt and workflow files.
for (const [kitId, files] of megaFilesAsTheyStand) {
  for (const [p, text] of Object.entries(files)) writeShared(`/packs/mega/${kitId}/${p}`, normalizeText(text));
}

async function buildOne(persona) {
  const agentLock = lock[lockKey(persona.id, "agent")], trainLock = lock[lockKey(persona.id, "train")];
  const agent = await buildPack(inputFor(persona, "agent", { version: agentLock.version, updated: agentLock.updated }));
  const train = await buildPack(inputFor(persona, "train", { version: trainLock.version, updated: trainLock.updated }));
  for (const pack of [agent, train]) {
    for (const f of pack.files) {
      if ((f.source === "agent" || f.source === "job") && OLD_LICENCE.test(f.content)) buildNotes.add(`${pack.kind} pack file ${f.path} still mentions CC BY; packs use the AI Blocks Agent Pack Licence 1.0 (fix its template)`);
    }
    for (const n of pack.notes) buildNotes.add(n);
    for (const issue of lintPack(pack)) lintIssues.push({ pack: `${persona.id}${pack.kind === "train" ? "-train" : ""}`, ...issue });
    for (const note of lintNotes(pack)) lintNoteSet.set(note.message, note.rule);
  }
  if (agent.toolbox) { toolboxPacks++; toolboxItemFiles += agent.files.filter(f => f.source === "toolbox").length; }
  const [agentZip, trainZip] = await Promise.all([packZip(agent), packZip(train)]);
  writeFileSync(path.join(OUT, `${persona.id}.zip`), agentZip);
  writeFileSync(path.join(OUT, `${persona.id}-train.zip`), trainZip);
  const oneFile = Buffer.from(oneFileText(agent), "utf8");
  writeFileSync(path.join(OUT, `${persona.id}.txt`), oneFile);
  fileCount += 3;
  zipBytes += agentZip.length + trainZip.length;
  for (const f of agent.files) {
    const url = fileUrl(agent, f);
    if (f.source === "agent") writeAt(url, f.content);
    else writeShared(url, f.content);
  }
  const zips = {
    zip: { url: `/packs/${persona.id}.zip`, bytes: agentZip.length, version: agent.manifest.version },
    train_zip: { url: `/packs/${persona.id}-train.zip`, bytes: trainZip.length, version: train.manifest.version },
    one_file: { url: `/packs/${persona.id}.txt`, bytes: oneFile.length, version: agent.manifest.version },
  };
  writeAt(`/packs/${persona.id}/files.json`, `${JSON.stringify(filesIndex(agent, zips), null, 2)}\n`);
  if (agent.manifest.knowledge.status === "pending") pending++;
  return {
    id: persona.id,
    name: persona.name,
    title: persona.title,
    role: agent.manifest.role,
    ...(agent.manifest.mega ? { mega: agent.manifest.mega } : {}),
    version: agent.manifest.version,
    updated: agent.manifest.updated,
    knowledge: agent.manifest.knowledge,
    files: agent.files.length,
    files_url: `/packs/${persona.id}/files.json`,
    agent_zip: zips.zip,
    train_zip: zips.train_zip,
    one_file: zips.one_file,
  };
}

let index;
try {
  index = await pool(personas, buildOne);
} catch (err) {
  if (err instanceof PackBuildError) fatal(err.message);
  throw err;
}
if (lintIssues.length) {
  // Grouped by rule and message, so one broken template shows once with the packs it hits, not 505 times.
  const groups = new Map();
  for (const i of lintIssues) {
    const key = `${i.rule}: ${i.file} ${i.message}`;
    const g = groups.get(key) ?? [];
    g.push(i.pack);
    groups.set(key, g);
  }
  const lines = [...groups].sort((a, b) => b[1].length - a[1].length).map(([k, packs]) => `${k} [${packs.length} pack${packs.length === 1 ? "" : "s"}: ${packs.slice(0, 4).join(", ")}${packs.length > 4 ? ", ..." : ""}]`);
  const byRule = {};
  for (const i of lintIssues) byRule[i.rule] = (byRule[i.rule] ?? 0) + 1;
  const summary = `the pack linter found ${lintIssues.length} problem(s) (${Object.entries(byRule).map(([r, n]) => `${r} ${n}`).join(", ")}) in ${new Set(lintIssues.map(i => i.pack)).size} pack(s)`;
  if (args.lint === "report") {
    console.warn(`build-packs: ${summary}:\n  ${lines.join("\n  ")}`);
  } else {
    fatal(`${summary}. Fix the template, role kit or job type named in each line (run with --lint=report to see all and keep going):\n  ${lines.slice(0, 40).join("\n  ")}${lines.length > 40 ? `\n  ...and ${lines.length - 40} more` : ""}`);
  }
}
writeAt("/packs/index.json",`${JSON.stringify({ schema: "ai-blocks-pack-index/1", count: index.length, packs: index }, null, 2)}\n`);
// Which job roles (and their live agents) carry each library item. Built from every role kit, also with --only.
const roleAgents = Object.fromEntries([...toolboxes.keys()].map(roleId => [roleId, {
  name: getRole(roleId)?.name ?? roleId,
  agents: housePersonas().filter(p => p.kind === "house" && p.status === "live" && p.role === roleId)
    .sort((a, b) => a.sort - b.sort || (a.id < b.id ? -1 : 1)).map(p => ({ id: p.id, name: p.name, title: p.title })),
}]));
writeAt("/packs/toolbox-index.json", `${JSON.stringify(toolboxIndex(toolboxes.values(), library, roleAgents), null, 2)}\n`);

const mb = n => (n / 1024 / 1024).toFixed(1);
for (const w of [...warnings, ...buildNotes]) console.warn(`build-packs: note: ${w}`);
// Roles with no toolbox yet come as one line, not one per role.
const withoutToolbox = [...lintNoteSet].filter(([, rule]) => rule === "no_toolbox").map(([m]) => m.split(":")[0]).sort();
for (const [message, rule] of lintNoteSet) if (rule === "toolbox_left_out") console.warn(`build-packs: note: ${message}`);
// A long toolbox.md comes as one line per role, with its longest agent.
const longest = new Map();
for (const [message, rule] of lintNoteSet) {
  const m = rule === "toolbox_long" ? /^([^:]+): toolbox\.md is (\d+) words/.exec(message) : null;
  if (m && Number(m[2]) > (longest.get(m[1])?.words ?? 0)) longest.set(m[1], { words: Number(m[2]), message });
}
for (const { message } of longest.values()) console.warn(`build-packs: note: ${message}`);
if (withoutToolbox.length) console.warn(`build-packs: note: ${withoutToolbox.length} role(s) have no toolbox.json yet, so their toolbox.md is the plain list of the pack's skills: ${withoutToolbox.slice(0, 12).join(", ")}${withoutToolbox.length > 12 ? `, and ${withoutToolbox.length - 12} more` : ""}`);
const sharedCount = prefix => [...shared.keys()].filter(u => u.startsWith(prefix)).length;
console.log(`build-packs: ${index.length} agents: ${index.length * 2} zips (${mb(zipBytes)} MB), browsable copies ${mb(browseBytes)} MB (shared: ${sharedCount("/packs/roles/")} role files, ${sharedCount("/packs/jobs/")} job skills, ${sharedCount("/packs/mega/")} mega kit files); ${fileCount} files in ${path.relative(ROOT, OUT) || "."}`);
console.log(`build-packs: mega kits ready: ${megaKits.size}; mega agents: ${index.filter(p => p.mega).length}`);
console.log(`build-packs: toolboxes: ${toolboxes.size} of ${kits.size} role kits; ${toolboxPacks} agents carry one (${toolboxItemFiles} item files inside their zips); ${sharedCount("/packs/toolbox/")} library items stored once under toolbox/; ${libraryNotes.length} left out`);
console.log(`build-packs: tools: ${TOOL_FILES.map(t => `${t.name} ${toolFrom[t.name] ? `from ${toolFrom[t.name]}` : "not available"}`).join("; ")}`);
console.log(`build-packs: role kits ready: ${kits.size} of ${listRoles().length} roles; knowledge pending for ${pending} of ${index.length} agents; ${((Date.now() - started) / 1000).toFixed(1)}s`);
