// Writes packs/shared/tools/prepare-job.mjs from src/modules/packs/retrieve.ts and src/modules/knowledge/prepare.ts,
// so the tool every agent pack carries and the repo's eval (scripts/eval-prepare.mjs) run the very same code. Node
// strips the types (both modules use erasable syntax only), the import between them is dropped, and the command-line
// part below is added. test/prepare-job.test.ts fails while the written file is out of date: run
// `node scripts/gen-prepare-job.mjs` after any change to either module.
import { readFileSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCES = [path.join(ROOT, "src", "modules", "packs", "retrieve.ts"), path.join(ROOT, "src", "modules", "knowledge", "prepare.ts")];
export const TARGET = path.join(ROOT, "packs", "shared", "tools", "prepare-job.mjs");

const HEADER = `#!/usr/bin/env node
// prepare-job.mjs: read the brief once and put the library cards this job needs in front of you, before drafting.
// Plain Node 18 or later, no dependencies, no network, nothing sent anywhere. Run it from the pack folder:
//
//   node tools/prepare-job.mjs context/brief.md
//   node tools/prepare-job.mjs "We sell cotton bedsheets in India on Shopify. Write a 5-email win-back series..."
//   node tools/prepare-job.mjs context/brief.md --k 20 --json
//   node tools/prepare-job.mjs context/brief.md --keep MCR-0022,ADC-0034,MEA-0025
//
// It reads what the brief asks for, what its data says (the standout row of each table, the biggest item of each
// list of shares, the funnel step that drops most) and the facts it states, searches the pack's library once per
// request, signal and fact, keeps only cards for this market, marketplace and store platform, ranks them, drops
// near-duplicates and lists gaps. It writes the digest to context/knowledge-brief.md: its best 15 cards, then more
// candidates up to about 40, with a short grading step for you, the AI reading it. Grade them against the store, then
// run it again with --keep and your ids, best first: the digest then holds only those cards. Each run adds its
// lookups to context/trace.md. Use a card only where its "holds when" fits; check its "fails when". Card ids stay in
// your notes, never in the deliverable.
//
// Generated from the AI Blocks marketplace (src/modules/knowledge/prepare.ts by scripts/gen-prepare-job.mjs).
// Do not edit by hand.
`;

const CLI = `
// ---------- Command line ----------

async function main(argv) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const args = { brief: null, k: 15, pool: 40, keep: null, json: false, pack: null, out: "context/knowledge-brief.md", trace: "context/trace.md" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--k") args.k = Number(argv[++i]) || 15;
    else if (a === "--pool") args.pool = Number(argv[++i]) || 40;
    else if (a === "--keep") args.keep = String(argv[++i] ?? "").split(/[\\s,]+/).filter(Boolean);
    else if (a === "--json") args.json = true;
    else if (a === "--pack") args.pack = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--trace") args.trace = argv[++i];
    else if (a === "-h" || a === "--help") { console.log(HELP); return 0; }
    else args.brief = args.brief ? args.brief + " " + a : a;
  }
  if (!args.brief) { console.error(HELP); return 2; }
  const brief = fs.existsSync(args.brief) && fs.statSync(args.brief).isFile() ? fs.readFileSync(args.brief, "utf8") : args.brief;
  const here = path.dirname(fileURLToPath(import.meta.url));
  const pack = path.resolve(args.pack ?? (fs.existsSync(path.join(here, "..", "AGENTS.md")) ? path.join(here, "..") : process.cwd()));
  const cards = [];
  const lib = path.join(pack, "knowledge");
  if (fs.existsSync(lib)) for (const v of fs.readdirSync(lib)) {
    const dir = path.join(lib, v);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      const m = /^([A-Z]{2,4})\\.md$/.exec(f);
      if (m) cards.push(...cardsFromModuleMarkdown(m[1], fs.readFileSync(path.join(dir, f), "utf8")));
    }
  }
  if (!cards.length) { console.log("This pack carries no library cards, so there is nothing to prepare. Use tools/ask-knowledge.mjs for the pack's own knowledge."); return 0; }
  let prepared = new JobPrep(cards).prepare(brief, { k: args.k, pool: args.pool });
  if (args.keep) {
    const kept = keepPicks(prepared, args.keep, cards);
    if (kept.unknown.length) { console.error("No card with id " + kept.unknown.join(", ") + " in this pack. Copy the ids from context/knowledge-brief.md."); return 2; }
    if (!kept.prepared.picks.length) { console.error("--keep needs at least one card id, best first, for example --keep MCR-0022,ADC-0034"); return 2; }
    prepared = kept.prepared;
  }
  const md = preparedMarkdown(prepared);
  const write = (rel, text, append) => {
    const file = path.resolve(process.cwd(), rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (append) fs.appendFileSync(file, text); else fs.writeFileSync(file, text);
  };
  write(args.out, md + "\\n", false);
  const traceFile = path.resolve(process.cwd(), args.trace);
  const rows = prepared.graded
    ? ["| Graded shortlist: cards kept, best first | " + prepared.picks.map(p => p.card.id).join(", ") + " | to settle in the draft |"]
    : prepared.queries.filter(q => q.kind === "ask" || q.kind === "signal").map(q => {
      const ids = prepared.picks.filter(p => p.via.includes(q.text)).map(p => p.card.id);
      return "| " + q.text.replace(/\\|/g, "/").replace(/\\s+/g, " ").slice(0, 160) + " | " + (ids.join(", ") || "none: a gap") + " | to settle in the draft |";
    });
  write(args.trace, (fs.existsSync(traceFile) ? "\\n" : "# Knowledge trace\\n\\nWorking file, never shipped. Fill in the call each card supports as you draft.\\n\\n") + "| Question | Cards | Call it supports |\\n|---|---|---|\\n" + rows.join("\\n") + "\\n", true);
  const card = p => ({ id: p.card.id, claim: p.card.claim, tier: p.card.tier, holds: p.card.holds, fails: p.card.fails, via: p.via, score: p.score });
  console.log(args.json ? JSON.stringify({ facts: prepared.facts, queries: prepared.queries, gaps: prepared.gaps, graded: !!prepared.graded, picks: prepared.picks.map(card), shortlist: prepared.shortlist.map(card) }, null, 2) : md);
  console.error("prepare-job: " + (prepared.graded ? prepared.picks.length + " kept cards" : prepared.picks.length + " cards and " + (prepared.shortlist.length - prepared.picks.length) + " more to grade") + " from " + cards.length + "; wrote " + args.out + " and " + args.trace);
  // One line in context/job-log.jsonl (hashes only), when the job folder exists; it never stops the tool.
  try { const { logEvent } = await import("./log-event.mjs"); logEvent({ tool: "prepare-job", cmd: args.keep ? "keep" : "prepare", args: argv, inputs: [brief === args.brief ? null : args.brief], result: "PASS", counts: { cards: prepared.picks.length, shortlist: prepared.shortlist.length, gaps: prepared.gaps.length } }); } catch {}
  return 0;
}

const HELP = 'Usage: node tools/prepare-job.mjs <brief file or "brief text"> [--k 15] [--pool 40] [--keep ID,ID,...] [--out context/knowledge-brief.md] [--trace context/trace.md] [--json] [--pack <folder>]';

const invoked = typeof process !== "undefined" && !!process.argv?.[1] && (await import("node:path")).resolve(process.argv[1]).toLowerCase() === (await import("node:url")).fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = await main(process.argv.slice(2));
`;

export function generate() {
  const parts = SOURCES.map(f => stripTypeScriptTypes(readFileSync(f, "utf8"), { mode: "strip" })
    .replace(/^import [^;]+ from "\.\.\/packs\/retrieve\.ts";\n/m, "")
    .replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trimEnd());
  return `${HEADER}\n${parts.join("\n\n")}\n${CLI}`;
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  if (process.argv.includes("--check")) {
    if (readFileSync(TARGET, "utf8") !== generate()) { console.error("packs/shared/tools/prepare-job.mjs is out of date: run node scripts/gen-prepare-job.mjs"); process.exit(1); }
    console.log("prepare-job.mjs is up to date");
  } else {
    writeFileSync(TARGET, generate());
    console.log(`wrote ${path.relative(ROOT, TARGET)}`);
  }
}
