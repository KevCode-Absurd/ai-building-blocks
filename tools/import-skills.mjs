// Imports skills from a cloned skills repo (folders with a SKILL.md) into catalogue-items/imported/<slug>/.
// Copied as they are, with their licence and credit; we only give each one a plain job-title name on our site.
// A dry run writes a report and changes nothing. Add --write to copy the skills in.
//
//   node tools/import-skills.mjs --from <cloned repo> --by Anthropic --repo anthropics/skills [--path skills] [--exclude .gemini] [--chunk 2/5] [--write] [--only pdf,xlsx]
//
// Names, jobs and summaries come from tools/import-map.yaml (one entry per skill, keyed "<repo>:<folder>").
// A skill with no entry still gets a dry-run row, so the report shows what to add before --write.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { grade } from "./readability.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const FROM = arg("from"), BY = arg("by"), REPO = arg("repo");
const WRITE = process.argv.includes("--write");
const ONLY = arg("only")?.split(",");
// Only look in one folder of the repo, for repos that also keep copies of each skill elsewhere (like plugin bundles).
const SCAN = arg("path", ".");
// Folders to leave out, like a repo's copies of every skill for another AI (--exclude .gemini,plugins).
const EXCLUDE = new Set((arg("exclude") ?? "").split(",").filter(Boolean));
if (!FROM || !BY || !REPO) { console.error("Usage: node tools/import-skills.mjs --from <repo dir> --by <maker> --repo <owner/name> [--write] [--only a,b]"); process.exit(1); }

const ROOT = path.resolve(import.meta.dirname, "..");
const CAT = path.join(ROOT, "catalogue-items");
const OUT = path.join(CAT, "imported");
// The map is import-map.yaml plus one file per repo (or per slice of a big repo) in import-map/, so several people can write at once.
const MAP_DIR = path.join(import.meta.dirname, "import-map");
const mapFiles = [path.join(import.meta.dirname, "import-map.yaml"), ...(fs.existsSync(MAP_DIR) ? fs.readdirSync(MAP_DIR).filter((f) => f.endsWith(".yaml")).sort().map((f) => path.join(MAP_DIR, f)) : [])];
const MAP = {};
const nameUse = new Map();
// A broken map file (someone mid-edit, or a stray colon) is reported and left out, so it never stops everyone else's run.
const parseMap = (f) => { try { return YAML.parse(fs.readFileSync(f, "utf8")) ?? {}; } catch (e) { console.error(`map file ${path.basename(f)} has a YAML error, left out: ${e.message.split(/\r?\n/)[0]}`); return {}; } };
for (const f of mapFiles) for (const [k, v] of Object.entries(parseMap(f))) {
  MAP[k] = v;
  if (v?.name && !v.skip) nameUse.set(v.name.toLowerCase(), [...(nameUse.get(v.name.toLowerCase()) ?? []), k]);
}
// --chunk 2/5 takes the second of five equal slices of the repo's skills (by folder path), for sharing a big repo out.
const [CHUNK, CHUNKS] = (arg("chunk") ?? "1/1").split("/").map(Number);
const TYPES = new Set(Object.values(YAML.parse(fs.readFileSync(path.join(CAT, "_types.yaml"), "utf8"))).flatMap((g) => Object.keys(g)));
const TASKS = [...fs.readFileSync(path.join(ROOT, "site/src/lib/data.ts"), "utf8").matchAll(/\{ id: "([a-z-]+)", name: "[^"]+" \}/g)].map((m) => m[1]);
const BANNED = ["delve", "foster", "leverage", "utilize", "facilitate", "empower", "streamline", "robust", "cutting-edge", "game changer", "unlock", "supercharge", "harness", "elevate", "seamless", "effortless", "transformative", "revolutionize", "paradigm", "synergy", "holistic", "journey", "ecosystem", "best-in-class", "world-class", "next-level"];
const commit = (() => { try { return execSync("git rev-parse --short HEAD", { cwd: FROM }).toString().trim(); } catch { return "unknown"; } })();
const today = new Date().toISOString().slice(0, 10);

// Licences we can copy and share with credit. Anything else is skipped and listed with its reason.
// A skill's own licence file wins; otherwise the nearest one up to the repo root (where a content licence beats the code one).
function licenceOf(dir, given) {
  if (given) {
    if (!fs.existsSync(given)) return { id: null, file: null, why: `licence_file ${path.relative(FROM, given)} not found` };
    const t = fs.readFileSync(given, "utf8").slice(0, 3000);
    // A README whose own "License" section says just MIT counts too (realkimbarrett has no LICENSE file); that README then goes with the skill.
    const id = /Apache License[\s\S]{0,80}Version 2\.0/i.test(t) ? "Apache-2.0" : /Permission is hereby granted, free of charge/i.test(t) || /^#+\s*Licen[cs]e\s*\r?\n\s*MIT\s*$/im.test(fs.readFileSync(given, "utf8")) ? "MIT" : null;
    return id ? { id, file: path.relative(dir, given).split(path.sep).join("/") } : { id: null, file: null, why: "licence not recognised" };
  }
  let at = dir, f;
  for (;;) {
    const names = fs.readdirSync(at, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name);
    const all = names.filter((n) => /^licen[cs]e/i.test(n));
    f = names.find((n) => /^licen[cs]e-content/i.test(n)) ?? all.find((n) => /^licen[cs]e(\.(txt|md))?$/i.test(n)) ?? (all.length === 1 ? all[0] : null);
    // Several licence files side by side (one per original author) and no main one: we don't guess which covers a skill.
    if (!f && all.length > 1) return { id: null, file: null, why: `several licence files (${all.join(", ")}): set licence_file for it in import-map.yaml` };
    if (f || path.resolve(at) === path.resolve(FROM)) break;
    at = path.dirname(at);
  }
  if (!f) return { id: null, file: null, why: "no licence file" };
  const t = fs.readFileSync(path.join(at, f), "utf8").slice(0, 3000);
  f = path.relative(dir, path.join(at, f)).split(path.sep).join("/");
  // Riders that take away an open licence's freedoms (like the Commons Clause, which bans selling it) win over the licence under them.
  if (/Commons Clause|NonCommercial|non-commercial use only/i.test(t)) return { id: null, file: f, why: "open licence with a no-selling rider (Commons Clause or non-commercial)" };
  if (/Apache License[\s\S]{0,80}Version 2\.0/i.test(t)) return { id: "Apache-2.0", file: f };
  if (/Permission is hereby granted, free of charge/i.test(t)) return { id: "MIT", file: f };
  // Share-alike is fine for a copy kept as it is; anything we rebuild from it has to stay CC BY-SA too (docs/IMPORTING-SKILLS.md).
  if (/Attribution-ShareAlike 4\.0|CC BY-SA 4\.0/i.test(t) && !/NonCommercial|NoDerivatives/i.test(t)) return { id: "CC-BY-SA-4.0", file: f };
  if (/Creative Commons Attribution 4\.0|CC BY 4\.0/i.test(t) && !/NonCommercial|NoDerivatives/i.test(t)) return { id: "CC-BY-4.0", file: f };
  // BSD licences open with "All rights reserved" too, so they're checked first.
  if (/Redistribution and use in source and binary forms/i.test(t)) return { id: /Neither the name/i.test(t) ? "BSD-3-Clause" : "BSD-2-Clause", file: f };
  if (/all rights reserved/i.test(t)) return { id: null, file: f, why: "all rights reserved" };
  if (/Developer Terms|Terms of Service/i.test(t)) return { id: null, file: f, why: "covered by the maker's own terms, not an open licence" };
  return { id: null, file: f, why: "licence not recognised" };
}

const frontOf = (text) => { const m = text.replace(/\r\n?/g, "\n").match(/^---\n([\s\S]*?)\n---/); try { return m ? YAML.parse(m[1]) ?? {} : {}; } catch { return {}; } };
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const STOP = new Set("a an and the of to for in on with your you it its or by from as is are be that this when use using can into any make makes help helps get gets".split(" "));
const bag = (s) => new Set(String(s).toLowerCase().match(/[a-z][a-z0-9]+/g)?.filter((w) => !STOP.has(w)).map((w) => w.replace(/ing$/, "").replace(/([^s])s$/, "$1")) ?? []);
// Repeats are found by shared words weighted by how rare they are (tf-idf cosine), so "copy" and "landing" count more than "page".
const df = new Map();
const vec = (words) => { const v = new Map(); for (const w of words) v.set(w, Math.log(1 + (docs + 1) / ((df.get(w) ?? 0) + 1))); let n = 0; for (const x of v.values()) n += x * x; return { v, n: Math.sqrt(n) || 1 }; };
const cosine = (a, b) => { let s = 0; for (const [w, x] of a.v) { const y = b.v.get(w); if (y) s += x * y; } return s / (a.n * b.n); };
let docs = 0;

// Everything already in the library, to catch skills we'd be adding twice.
const existing = [];
for (const cat of ["general", "ecommerce", "imported"]) {
  const dir = path.join(CAT, cat);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    const f = path.join(dir, slug, "item.yaml");
    if (!fs.existsSync(f)) continue;
    const it = YAML.parse(fs.readFileSync(f, "utf8"));
    const pf = path.join(dir, slug, "page.yaml");
    const pg = fs.existsSync(pf) ? YAML.parse(fs.readFileSync(pf, "utf8")) ?? {} : {};
    const sk = path.join(dir, slug, "SKILL.md");
    const desc = fs.existsSync(sk) ? frontOf(fs.readFileSync(sk, "utf8")).description ?? "" : "";
    existing.push({ slug, cat, name: it.name ?? slug, words: bag(`${it.name} ${it.name} ${it.summary} ${pg.subhead ?? ""} ${desc}`), src: it.source ? `${it.source.repo}:${it.source.path}` : null });
  }
}

// Every SKILL.md in the repo, hidden folders included (OpenAI keeps theirs under skills/.curated and skills/.system).
function* skillDirs(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === ".git" || e.name === "node_modules" || EXCLUDE.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (fs.existsSync(path.join(p, "SKILL.md"))) yield p; else yield* skillDirs(p);
  }
}

for (const e of existing) { docs++; for (const w of e.words) df.set(w, (df.get(w) ?? 0) + 1); }
for (const e of existing) e.vec = vec(e.words);
const rows = [];
const batch = [];
// A repo can also be one skill, with its SKILL.md at the top.
const top = path.join(FROM, SCAN);
const found = [...(fs.existsSync(path.join(top, "SKILL.md")) ? [top] : []), ...skillDirs(top)].sort();
const per = Math.ceil(found.length / CHUNKS);
for (const dir of found.slice((CHUNK - 1) * per, CHUNK * per)) {
  const rel = path.relative(FROM, dir).split(path.sep).join("/") || ".";
  const folder = path.basename(dir);
  if (ONLY && !ONLY.includes(folder)) continue;
  if (/(^|\/)template$/.test(rel)) continue;
  const front = frontOf(fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"));
  const key = `${REPO}:${rel}`;
  const m = MAP[key] ?? {};
  // The map can name the licence file that covers a skill (a path from the repo root), for repos that keep several.
  const lic = m.licence_file ? licenceOf(dir, path.join(FROM, m.licence_file)) : licenceOf(dir);
  const name = m.name ?? folder.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
  const slug = m.slug ?? slugify(name);
  const summary = m.summary ?? "";
  const words = bag(`${name} ${summary} ${front.name ?? ""} ${front.description ?? ""}`);
  const flags = [];
  if (!MAP[key]) flags.push("no map entry: name and summary not written yet");
  if (m.name && (nameUse.get(m.name.toLowerCase())?.length ?? 0) > 1) flags.push(`name also used by ${nameUse.get(m.name.toLowerCase()).filter((x) => x !== key).join(", ")}`);
  const author = front.author ?? front.metadata?.author ?? null;
  // Collections gather other people's skills: the map names the original author (author, author_url) so both get credit.
  if (author && !m.author && !String(author).toLowerCase().includes(BY.toLowerCase().split(" ")[0])) flags.push(`names ${author} as its author: add author (and author_url) to its map entry`);
  if (m.task && !TASKS.includes(m.task)) flags.push(`unknown task "${m.task}"`);
  for (const p of [...(m.inputs ?? []), ...(m.outputs ?? [])]) if (!TYPES.has(p.type ?? p)) flags.push(`unknown type "${p.type ?? p}"`);
  if (summary) {
    if (summary.split(/\s+/).length > 22) flags.push("summary over 22 words");
    if (grade(summary) > 10) flags.push(`summary grade ${grade(summary).toFixed(1)}`);
    if (/—/.test(summary + name)) flags.push("em dash");
    for (const w of BANNED) if (new RegExp(`\\b${w}\\b`, "i").test(summary)) flags.push(`banned word "${w}"`);
  }
  // Closest skills we already have, and other skills in this batch with the same name.
  const near = existing.filter((e) => e.src !== key).map((e) => ({ ...e, score: cosine(vec(words), e.vec) })).filter((e) => e.score >= 0.06).sort((a, b) => b.score - a.score).slice(0, 2);
  if (process.env.NEAR_DEBUG === folder) console.log([...words].join(" "), existing.map((e) => [e.name, cosine(vec(words), e.vec).toFixed(2)]).sort((x, y) => y[1] - x[1]).slice(0, 8));
  if (existing.some((e) => e.slug === slug && e.src !== key)) flags.push(`slug "${slug}" is taken`);
  const twin = front.name ? batch.find((b) => b.front.name === front.name) : null;
  let decision = m.skip ? `skip: ${m.skip}` : !lic.id ? `skip: ${lic.why}` : twin ? `skip: same skill as ${twin.rel}` : "import";
  if (decision === "import" && near[0]?.score >= 0.15) decision = "check: may repeat a skill we have";
  const row = { rel, folder, key, front, m, lic, name, slug, summary, near, flags, decision };
  rows.push(row);
  if (decision !== "import" && !decision.startsWith("check")) continue;
  batch.push(row);
}

// Copy a skill folder as it is, then add our item.yaml and page.yaml next to it.
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b);
  }
}
const url = (rel) => (rel === "." ? `https://github.com/${REPO}` : `https://github.com/${REPO}/tree/main/${rel}`);
let written = 0;
if (WRITE) for (const r of batch) {
  if (r.flags.length) { console.log(`not written, fix first: ${r.rel}: ${r.flags.join("; ")}`); continue; }
  const to = path.join(OUT, r.slug);
  fs.rmSync(to, { recursive: true, force: true });
  copyDir(path.join(FROM, r.rel), to);
  if (r.lic.file.startsWith("..")) fs.copyFileSync(path.join(FROM, r.rel, r.lic.file), path.join(to, path.basename(r.lic.file)));
  // Notes a skill reads from outside its own folder (map field `bring`: [{from: <path from repo root>, to: <path in the skill>, link: <how the skill links to it>}]).
  const bring = (r.m.bring ?? []).map((b) => (typeof b === "string" ? { from: b, to: path.basename(b) } : b));
  for (const b of bring) {
    const src = path.join(FROM, b.from), dst = path.join(to, b.to);
    if (!fs.existsSync(src)) { console.log(`bring: ${b.from} not found for ${r.rel}`); continue; }
    if (fs.statSync(src).isDirectory()) copyDir(src, dst); else { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); }
  }
  const item = {
    slug: r.slug, name: r.name, summary: r.summary, category: "general", boards: [], type: "skill",
    role: r.m.role ?? "make", job: "ops", level: r.m.level ?? "intermediate",
    inputs: r.m.inputs ?? [], outputs: r.m.outputs ?? [], uses: [],
    origin: "imported",
    // Kevin's call (2026-10-21): skills that scrape may come in, but say so plainly on the card and the page.
    // Kevin's call (2026-10-21): skills that need a paid service come in too, labelled with the service (map field `paid: "<service>"`).
    ...(r.m.scrapes || r.m.paid ? { warnings: [...(r.m.scrapes ? ["scrapes"] : []), ...(r.m.paid ? [`paid:${r.m.paid}`] : [])] } : {}),
    source: { by: BY, repo: REPO, path: r.rel, url: url(r.rel), licence: r.lic.id, licence_file: path.basename(r.lic.file), commit, original_name: String(r.front.name ?? r.folder), ...(r.m.author ? { author: String(r.m.author) } : {}), imported: today },
    version: "1.0.0",
    credits: [{ title: `${r.front.name ?? r.folder} skill`, by: BY, url: url(r.rel), used: `Copied as it is, under the ${r.lic.id.replace("-", " ")} licence. We gave it a plain name.` },
      ...(r.m.author ? [{ title: "Original author", by: String(r.m.author), url: r.m.author_url ?? "", used: `Wrote the skill; ${BY} shared it in their collection.` }] : [])],
  };
  const page = {
    thinking: r.m.thinking ?? "medium", thinking_why: r.m.thinking_why ?? "It follows a set method with a few checks.",
    new_slug: r.slug, name: r.name, summary: r.summary, job: r.m.task ?? "set-up-ai",
    headline: r.name, subhead: r.m.subhead ?? r.summary,
    ...(r.m.when ? { when: r.m.when } : {}),
    how_to_use: [
      "Add it to your AI once: download it and add the folder to Claude, ChatGPT or Codex as a skill.",
      "Ask for the job in your own words. Your AI opens the skill when it fits.",
      ...(r.m.needs ? [`It works best when your AI can ${r.m.needs}.`] : []),
      ...bring.filter((b) => b.link).map((b) => `Where the skill points to ${b.link}, use the ${b.to} folder inside it. We copied it in so the skill works on its own.`),
    ],
  };
  fs.writeFileSync(path.join(to, "item.yaml"), YAML.stringify(item, { lineWidth: 0 }));
  fs.writeFileSync(path.join(to, "page.yaml"), YAML.stringify(page, { lineWidth: 0 }));
  written++;
}

// Credits in NOTICE.md: one section per repo, rewritten each run so it always matches what's imported.
if (WRITE && written) {
  const notice = path.join(ROOT, "NOTICE.md");
  const mine = fs.readdirSync(OUT).map((s) => path.join(OUT, s, "item.yaml")).filter((f) => fs.existsSync(f)).map((f) => YAML.parse(fs.readFileSync(f, "utf8"))).filter((i) => i.source?.repo === REPO).sort((a, b) => a.slug.localeCompare(b.slug));
  const head = `## Imported from ${REPO}`;
  const section = [head, "", `Copied as they are from https://github.com/${REPO} (commit ${commit}), each with its own licence file. We changed nothing in the skill files; we gave each a plain name on our site.`, "", "| Block | Original | Licence |", "|---|---|---|", ...mine.map((i) => `| \`imported/${i.slug}\` | ${i.source.original_name}, ${i.source.url} | ${i.source.licence} |`), ""].join("\n");
  let text = fs.readFileSync(notice, "utf8");
  const re = new RegExp(`${head.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}\\n[\\s\\S]*?(?=\\n## |$)`);
  text = re.test(text) ? text.replace(re, section) : `${text.trimEnd()}\n\n${section}`;
  fs.writeFileSync(notice, text);
}

// The report: every skill found, what we'd do with it and why.
const mark = (r) => (r.decision === "import" ? (r.flags.length ? "fix first" : "import") : r.decision);
const lines = [
  `# Import from ${REPO}, ${today}`, "",
  `${rows.length} skills found at commit ${commit}. ${rows.filter((r) => r.decision === "import" && !r.flags.length).length} ready to import, ${rows.filter((r) => r.decision.startsWith("check")).length} to check against a skill we have, ${rows.filter((r) => r.decision === "import" && r.flags.length).length} to fix first, ${rows.filter((r) => r.decision.startsWith("skip")).length} skipped.${WRITE ? ` Written: ${written}.` : " Dry run: nothing written."}`, "",
  "| Skill | Our name | Job | Licence | Decision | Closest we have | Notes |", "|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| \`${r.rel}\` | ${r.summary ? r.name : "-"} | ${r.m.task ?? "-"} | ${r.lic.id ?? r.lic.why} | ${mark(r)} | ${r.near.map((n) => `${n.name} (${Math.round(n.score * 100)}%)`).join(", ") || "-"} | ${r.flags.join("; ") || "-"} |`),
  "",
];
const reportFile = path.join(ROOT, "reports", `${today}-import-${slugify(REPO)}${CHUNKS > 1 ? `-part-${CHUNK}-of-${CHUNKS}` : ""}.md`);
fs.writeFileSync(reportFile, lines.join("\n"));
console.log(`${rows.length} found, ${batch.length} to import${WRITE ? `, ${written} written` : " (dry run)"}. Report: ${path.relative(ROOT, reportFile)}`);
