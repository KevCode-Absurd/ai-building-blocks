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
//
// Several quoted phrasings of one need are searched together and their rankings merged (ask it two or three ways
// when the first words may not be the pack's words). It prints the best passages, best first, each with its file and
// lines, its heading trail and the sources it cites (with the date each was checked, and STALE when a source is past
// twice its review window). When the best passage covers too little of the question, it says the pack does not know:
// then ask the client or research it, and never fill the gap from memory.
//
// Generated from the AI Blocks marketplace (src/modules/packs/retrieve.ts by scripts/gen-ask-knowledge.mjs).
// Do not edit by hand.
`;

const CLI = `
// ---------- Command line ----------

async function main(argv) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const args = { q: [], k: 6, json: false, in: [], pack: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--k") args.k = Number(argv[++i]) || 6;
    else if (a === "--json") args.json = true;
    else if (a === "--in") args.in.push(argv[++i]);
    else if (a === "--pack") args.pack = argv[++i];
    else if (a === "-h" || a === "--help") { console.log(HELP); return 0; }
    else args.q.push(a);
  }
  if (!args.q.length) { console.error(HELP); return 2; }
  const here = path.dirname(fileURLToPath(import.meta.url));
  const pack = path.resolve(args.pack ?? (fs.existsSync(path.join(here, "..", "AGENTS.md")) ? path.join(here, "..") : process.cwd()));
  const files = [];
  const walk = rel => {
    for (const name of fs.readdirSync(path.join(pack, rel)).sort()) {
      if (name.startsWith(".") || name === "node_modules") continue;
      const r = rel ? rel + "/" + name : name;
      if (fs.statSync(path.join(pack, r)).isDirectory()) walk(r);
      else if (indexedPath(r)) files.push({ path: r, text: fs.readFileSync(path.join(pack, r), "utf8") });
    }
  };
  walk("");
  if (!files.length) { console.error("No pack files found in " + pack + ". Run this from the agent's folder, or pass --pack <folder>."); return 2; }
  let reviewDays = 0;
  try { reviewDays = JSON.parse(fs.readFileSync(path.join(pack, "pack.json"), "utf8")).knowledge?.review_every_days ?? 0; } catch {}
  const sourcesFile = path.join(pack, "sources.md");
  const sources = fs.existsSync(sourcesFile) ? parseSourcesMd(fs.readFileSync(sourcesFile, "utf8")) : [];
  const index = new KnowledgeIndex(files, { sources, reviewDays });
  const today = new Date().toISOString().slice(0, 10);
  const answer = index.ask(args.q, { k: args.k, today, paths: args.in });
  let name = "this agent";
  try { name = JSON.parse(fs.readFileSync(path.join(pack, "pack.json"), "utf8")).name || name; } catch {}
  console.log(args.json ? JSON.stringify(answer, null, 2) : answerText(answer, name));
  return 0;
}

const HELP = 'Usage: node tools/ask-knowledge.mjs "<question>" ["<another phrasing>" ...] [--k 6] [--in <file>] [--json] [--pack <folder>]';

const invoked = typeof process !== "undefined" && !!process.argv?.[1] && (await import("node:path")).resolve(process.argv[1]).toLowerCase() === (await import("node:url")).fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = await main(process.argv.slice(2));
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
