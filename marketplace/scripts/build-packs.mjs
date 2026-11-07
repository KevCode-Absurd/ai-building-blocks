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
    if (!TEXT.test(rel)) { warnings.push(`${label}/${rel}: not a text file, left out`); continue; }
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
  const checked = validateRoleKit(kit);
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

// ---------- Personas ----------

const jobTypes = listJobTypes();
const personas = housePersonas().filter(p => p.kind === "house" && p.status === "live" && (!only || only.has(p.id)));
if (!personas.length) fatal("no live house personas to build");
for (const p of personas) if (RESERVED_PACK_PATHS.has(p.id)) fatal(`persona id "${p.id}" is a reserved name under /packs; rename the persona`);
for (const u of personasWithUnknownRole(personas)) warnings.push(`persona ${u.id}: role "${u.role}" is not in directory/data/roles.json, so it builds without a role`);
const inputFor = (persona, kind, version) => {
  const role = getRole(persona.role);
  const mega = persona.mega ? megaKits.get(persona.mega.kit) ?? null : null;
  return { persona, role, kit: role ? kits.get(role.id) ?? null : null, mega, jobTypes, templates, options: { kind, ...version } };
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
  }
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
writeAt("/packs/index.json", `${JSON.stringify({ schema: "ai-blocks-pack-index/1", count: index.length, packs: index }, null, 2)}\n`);

const mb = n => (n / 1024 / 1024).toFixed(1);
for (const w of [...warnings, ...buildNotes]) console.warn(`build-packs: note: ${w}`);
const sharedCount = prefix => [...shared.keys()].filter(u => u.startsWith(prefix)).length;
console.log(`build-packs: ${index.length} agents: ${index.length * 2} zips (${mb(zipBytes)} MB), browsable copies ${mb(browseBytes)} MB (shared: ${sharedCount("/packs/roles/")} role files, ${sharedCount("/packs/jobs/")} job skills, ${sharedCount("/packs/mega/")} mega kit files); ${fileCount} files in ${path.relative(ROOT, OUT) || "."}`);
console.log(`build-packs: mega kits ready: ${megaKits.size}; mega agents: ${index.filter(p => p.mega).length}`);
console.log(`build-packs: role kits ready: ${kits.size} of ${listRoles().length} roles; knowledge pending for ${pending} of ${index.length} agents; ${((Date.now() - started) / 1000).toFixed(1)}s`);
