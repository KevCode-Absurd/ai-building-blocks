// Writes packs/shared/tools/ask-knowledge.mjs from src/modules/packs/retrieve.ts, so the tool every agent pack
// carries and the MCP ask_agent_knowledge tool run the very same retrieval. Node strips the types (the module uses
// erasable syntax only), then the command-line part below is added. test/packs-retrieve.test.ts fails while the
// written file is out of date: run `node scripts/gen-ask-knowledge.mjs` after any change to retrieve.ts.
import { readFileSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCE = path.join(ROOT, "src", "modules", "packs", "retrieve.ts");
export const TARGET = path.join(ROOT, "packs", "shared", "tools", "ask-knowledge.mjs");

const HEADER = `#!/usr/bin/env node
// ask-knowledge.mjs: find what this agent knows about a question, with the sources, in its own pack.
// Plain Node 18 or later, no dependencies, no network, nothing sent anywhere. Run it from the pack folder:
//
//   node tools/ask-knowledge.mjs "how long to wait after a core update before judging a drop"
//   node tools/ask-knowledge.mjs "core update drop" "traffic fell after Google update" --k 8
//   node tools/ask-knowledge.mjs "title rewrite rules" --in knowledge.md --json
//   node tools/ask-knowledge.mjs "free shipping threshold for bundles" --module OFF,MEA
//
// Several quoted phrasings of one need are searched together and their rankings merged (ask it two or three ways
// when the first words may not be the pack's words). It prints the best passages, best first, each with an id to note
// (a library card's own id and tier: each card comes back whole, with its source line), its file and lines, its
// heading trail and the sources it cites (with the date each was checked, and STALE when a source is past twice its
// review window). A passage that repeats one already shown is left out. When the best passage covers too little of the question, it says the pack does not know:
// then ask the client or research it, and never fill the gap from memory.
//
// Generated from the AI Blocks marketplace (src/modules/packs/retrieve.ts by scripts/gen-ask-knowledge.mjs).
// Do not edit by hand.
`;

const CLI = String.raw`
// ---------- Command line ----------

async function main(argv) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const started = Date.now();
  const args = { q: [], k: null, json: false, in: [], modules: [], pack: null, all: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--k") args.k = Number(argv[++i]);
    else if (a === "--json") args.json = true;
    else if (a === "--in") args.in.push(argv[++i]);
    else if (a === "--module" || a === "--modules") { const value = argv[++i]; if (!value || value.startsWith("--")) throw new Error("--module needs module codes."); args.modules.push(...value.split(",")); }
    else if (a === "--all") args.all = true;
    else if (a === "--pack") args.pack = argv[++i];
    else if (a === "-h" || a === "--help") { console.log(HELP); return 0; }
    else args.q.push(a);
  }
  if (!args.q.length || args.k !== null && (!Number.isInteger(args.k) || args.k < 1 || args.k > 10)) { console.error(HELP); return 2; }
  if (args.all && (args.in.length || args.modules.length)) throw new Error("Use --all separately from --in or --module.");
  const here = path.dirname(fileURLToPath(import.meta.url));
  const pack = fs.realpathSync(path.resolve(args.pack ?? (fs.existsSync(path.join(here, "..", "AGENTS.md")) ? path.join(here, "..") : process.cwd())));
  const relative = p => typeof p === "string" && p.length > 0 && !p.includes("\\") && !p.includes(":") && !path.isAbsolute(p) && p.split("/").every(x => x && x !== "." && x !== ".." && !x.startsWith("."));
  const safePath = rel => {
    if (!relative(rel)) throw new Error("Pack paths must be relative and stay inside this pack.");
    let file = pack;
    for (const part of rel.split("/")) { file = path.join(file, part); if (fs.lstatSync(file).isSymbolicLink()) throw new Error("Pack source links are not followed."); }
    return file;
  };
  let metadata = {};
  try { metadata = JSON.parse(fs.readFileSync(path.join(pack, "pack.json"), "utf8")); } catch {}
  const paths = [];
  // Enumerate metadata first. Download manifests prevent output/ and other job
  // artifacts from accidentally becoming the agent's method knowledge.
  if (Array.isArray(metadata.files)) {
    for (const item of metadata.files) if (relative(item.path) && indexedPath(item.path)) {
      const file = safePath(item.path); if (fs.statSync(file).isFile()) paths.push(item.path);
    }
  } else {
    const walk = rel => {
      for (const entry of fs.readdirSync(path.join(pack, rel), { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
        if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.isSymbolicLink()) continue;
        const r = rel ? rel + "/" + entry.name : entry.name;
        if (entry.isDirectory()) walk(r);
        else if (entry.isFile() && indexedPath(r)) paths.push(r);
      }
    };
    walk("");
  }
  const allPaths = [...new Set(paths)].sort();
  if (!allPaths.length) { console.error("No pack files found. Run this from the agent's folder, or pass --pack <folder>."); return 2; }
  for (const p of args.in) if (!relative(p)) throw new Error("--in needs a valid pack-relative file path.");
  const modules = [...new Set(args.modules.map(m => m.trim().toUpperCase()).filter(Boolean))];
  if (modules.some(m => !/^[A-Z]{2,4}$/.test(m))) throw new Error("--module needs comma-separated module codes.");
  let role = null;
  const roleFile = path.join(pack, "role-context.json");
  if (!args.all && !args.in.length && !modules.length && fs.existsSync(roleFile)) {
    try { role = JSON.parse(fs.readFileSync(safePath("role-context.json"), "utf8")); } catch { throw new Error("role-context.json is unreadable or malformed; inspect it or explicitly use --all."); }
    const validCodes = (x, empty = false) => Array.isArray(x) && (empty || x.length > 0) && x.length <= 40 && new Set(x).size === x.length && x.every(m => typeof m === "string" && /^[A-Z]{2,4}$/.test(m));
    if (role.schema !== "ecommerce-role-context/1" || typeof role.agent_id !== "string" || !role.agent_id || !validCodes(role.primary_modules) || role.constraint_modules !== undefined && !validCodes(role.constraint_modules, true) || metadata.agent_id && metadata.agent_id !== role.agent_id) throw new Error("role-context.json has invalid identity or modules; inspect it or explicitly use --all.");
  }
  const k = args.k ?? (role ? 5 : 6);
  const sourcesFile = path.join(pack, "sources.md");
  const sources = fs.existsSync(sourcesFile) ? parseSourcesMd(fs.readFileSync(sourcesFile, "utf8")) : [];
  const reviewDays = metadata.knowledge?.review_every_days ?? 0;
  const synonyms = { groups: [], phrases: [] };
  const lib = path.join(pack, "knowledge");
  if (fs.existsSync(lib)) for (const v of fs.readdirSync(lib)) {
    const rel = "knowledge/" + v + "/synonyms.json";
    if (relative(rel) && fs.existsSync(path.join(pack, rel))) { try { const s = JSON.parse(fs.readFileSync(safePath(rel), "utf8")); synonyms.groups.push(...(s.groups ?? [])); synonyms.phrases.push(...(s.phrases ?? [])); } catch {} }
  }
  const loaded = new Map(); let bytesRead = 0;
  const readPaths = selected => {
    for (const rel of selected) if (!loaded.has(rel)) {
      const bytes = fs.readFileSync(safePath(rel));
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      loaded.set(rel, { path: rel, text }); bytesRead += bytes.length;
    }
    return selected.map(p => loaded.get(p));
  };
  const baseline = p => /^(knowledge\.md|playbook\.md)$/.test(p) || /^(skills|prompts|workflows|toolbox)\//.test(p) || /^tools\/quality\/cards\//.test(p) || /^knowledge\/[^/]+\/(?:baseline|toolkit|store-kit)\.md$/.test(p);
  let mode = args.all ? "all" : role ? "role" : modules.length || args.in.length ? "explicit" : "legacy_all";
  let selected = allPaths, fallbackReason = null;
  const explicitRequested = [...new Set([...args.in, ...modulePaths(allPaths, modules)])];
  if (mode === "explicit") selected = allPaths.filter(p => explicitRequested.includes(p));
  if (role) selected = [...new Set([...allPaths.filter(baseline), ...modulePaths(allPaths, role.primary_modules)])].sort();
  readPaths(selected);
  if (role) {
    // Selected module toolboxes name their full skills. Follow those explicit
    // references; do not read every unrelated vertical skill just to build an index.
    const linked = new Set();
    for (const rel of selected.filter(p => /^knowledge\/[^/]+\/toolbox\/[A-Z]{2,4}\.md$/.test(p))) {
      for (const match of loaded.get(rel).text.matchAll(/\x60([^\x60\r\n]+\.md)\x60/g)) if (allPaths.includes(match[1])) linked.add(match[1]);
    }
    selected = [...new Set([...selected, ...linked])].sort(); readPaths(selected);
  }
  const ask = selectedPaths => new KnowledgeIndex(readPaths(selectedPaths), { sources, reviewDays, synonyms }).ask(args.q, { k, today: new Date().toISOString().slice(0,10), distinct: true });
  let answer = ask(selected);
  const initial = { indexed_files: selected.length, passages: answer.passages.length, enough: answer.enough, modules: role?.primary_modules ?? modules };
  if (role && (!answer.enough || !answer.passages.length) && selected.length < allPaths.length) {
    fallbackReason = modulePaths(allPaths, role.primary_modules).length ? "role_scope_weak_or_empty" : "role_modules_unavailable";
    selected = allPaths; answer = ask(selected); mode = "role_fallback_all";
  }
  answer.retrieval_scope = {
    mode, agent_id: role?.agent_id ?? metadata.agent_id ?? null, requested_modules: role?.primary_modules ?? modules,
    searched_modules: [...new Set(selected.map(p => /^knowledge\/[^/]+\/(?:toolbox\/)?([A-Z]{2,4})\.md$/.exec(p)?.[1]).filter(Boolean))],
    missing_requested_modules: (role?.primary_modules ?? modules).filter(m => !modulePaths(allPaths, [m]).length),
    explicit_paths: args.in, missing_explicit_paths: args.in.filter(p=>!allPaths.includes(p)),
    fallback_reason: fallbackReason, initial, available_indexed_files: allPaths.length,
    indexed_files: selected.length, files_read: loaded.size, source_bytes_read: bytesRead, elapsed_ms: Date.now()-started,
    read_paths: [...loaded.keys()].sort(),
    assurance: "Reference curation, not authorization or proof of exhaustive relevant evidence. Counts cover indexed source bodies, not manifests, synonyms or citation metadata. Role defaults search primary modules plus current role methods; constraint modules expand only through explicit requests or visible weak-result fallback."
  };
  const name = metadata.name || "this agent";
  if (args.json) console.log(JSON.stringify(answer, null, 2));
  else {
    console.log(mode === "explicit" && !answer.passages.length ? "No supporting passage found in the explicitly selected files/modules. This does not establish that the whole pack lacks the evidence." : answerText(answer, name));
    console.log("\nSearch scope: " + mode + "; " + loaded.size + "/" + allPaths.length + " files read; " + bytesRead + " source bytes; modules " + (answer.retrieval_scope.searched_modules.join(", ") || "none") + (fallbackReason ? "; fallback: " + fallbackReason : "") + ".");
    if (answer.retrieval_scope.missing_explicit_paths.length) console.log("Requested paths absent: " + answer.retrieval_scope.missing_explicit_paths.join(", "));
  }
  try { const { logEvent } = await import("./log-event.mjs"); logEvent({ tool: "ask-knowledge", cmd: "ask", args: argv, inputs: [], result: "PASS", counts: { passages: answer.passages.length, enough: answer.enough ? 1 : 0, source_files: loaded.size, source_bytes: bytesRead } }); } catch {}
  return 0;
}

const HELP = 'Usage: node tools/ask-knowledge.mjs "<question>" ["<another phrasing>" ...] [--k 1..10] [--in <file>] [--module CODE,CODE | --all] [--json] [--pack <folder>]. A valid role-context.json defaults to its primary modules and 5 passages; legacy packs keep all-file search and 6. Weak role results visibly expand to the full public pack; explicit --in/--module never silently widens.';

const invoked = typeof process !== "undefined" && !!process.argv?.[1] && (await import("node:path")).resolve(process.argv[1]).toLowerCase() === (await import("node:url")).fileURLToPath(import.meta.url).toLowerCase();
if (invoked) { try { process.exitCode = await main(process.argv.slice(2)); } catch(error) { console.error("ask-knowledge: " + error.message); process.exitCode = 2; } }
`;

export function generate() {
  const ts = readFileSync(SOURCE, "utf8");
  const js = stripTypeScriptTypes(ts, { mode: "strip" })
    // Blank runs left where type-only lines were.
    .replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
  return `${HEADER}\n${js.trimEnd()}\n${CLI}`;
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  if (process.argv.includes("--check")) {
    const now = readFileSync(TARGET, "utf8");
    if (now !== generate()) { console.error("packs/shared/tools/ask-knowledge.mjs is out of date: run node scripts/gen-ask-knowledge.mjs"); process.exit(1); }
    console.log("ask-knowledge.mjs is up to date");
  } else {
    writeFileSync(TARGET, generate());
    console.log(`wrote ${path.relative(ROOT, TARGET)}`);
  }
}
