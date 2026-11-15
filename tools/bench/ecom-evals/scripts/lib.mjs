// Shared helpers for the eval scripts. Plain Node 18+, no packages, no network.
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SUITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO = path.resolve(SUITE, "..", "..", "..");
export const ROUNDS = path.join(SUITE, "rounds");
export const GRADES = ["on_brand", "principles", "logic", "backed", "outcome", "actionable", "insight"];
export const WEIGHTS = { on_brand: 0.20, principles: 0.15, logic: 0.15, backed: 0.15, outcome: 0.15, actionable: 0.12, insight: 0.08 };
export const IMAGE_GRADES = ["on_brand", "design", "persona", "product", "errors"];
export const AGENT_ARMS = ["chat", "code"];

export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) { const k = a.slice(2); const v = argv[i + 1]; if (v === undefined || v.startsWith("--")) out[k] = true; else { out[k] = v; i++; } }
    else out._.push(a);
  }
  return out;
}
export const list = v => (typeof v === "string" ? v.split(",").map(s => s.trim()).filter(Boolean) : []);

export function loadTasks() { return JSON.parse(readFileSync(path.join(SUITE, "TASKS.json"), "utf8")).tasks; }
export function loadPersonas() {
  const p = path.join(REPO, "marketplace", "src", "modules", "directory", "data", "personas-ecommerce.json");
  if (!existsSync(p)) return {};
  const arr = JSON.parse(readFileSync(p, "utf8"));
  return Object.fromEntries((Array.isArray(arr) ? arr : Object.values(arr)).map(x => [x.id, x]));
}

export function sha256File(p) { return createHash("sha256").update(readFileSync(p)).digest("hex"); }
export function sha256(s) { return createHash("sha256").update(s).digest("hex"); }

export function rng(seed) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
export function shuffle(a, r) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
export function newId(prefix, r, used) { let id; do { id = `${prefix}-${Math.floor(r() * 1e6).toString(36).padStart(4, "0").toUpperCase()}`; } while (used.has(id)); used.add(id); return id; }

export const words = t => (t.match(/\S+/g) || []).length;

// Expand a task's input list (files, or folders meaning every file in them) to absolute paths.
export function taskInputs(task) {
  const out = [];
  for (const rel of task.inputs) {
    const p = path.join(SUITE, rel);
    if (!existsSync(p)) throw new Error(`${task.id}: missing input ${rel}`);
    if (statSync(p).isDirectory()) for (const f of readdirSync(p).sort()) { const q = path.join(p, f); if (statSync(q).isFile()) out.push(q); }
    else out.push(p);
  }
  for (const p of out) if (path.relative(path.join(SUITE, "keys"), p).split(path.sep)[0] !== "..") throw new Error(`${task.id}: an input points into keys/`);
  return out;
}

export function copyInto(files, dir) {
  mkdirSync(dir, { recursive: true });
  for (const f of files) copyFileSync(f, path.join(dir, path.basename(f)));
}

// Remove anything that could reveal the arm before a judge sees an answer.
export function scrub(text, personaNames = []) {
  let t = text
    .replace(/\s*\[(?:[A-Z]{2,4}-\d{3,5}(?:\s*,\s*)?)+\]/g, "")
    .replace(/\s*\((?:[A-Z]{2,4}-\d{3,5}(?:,\s*)?)+\)/g, "")
    .replace(/\bAI Blocks\b/gi, "")
    .replace(/`?[\w./\\-]*\.(?:mjs|cjs|js|json|md|txt|csv)`?/g, m => (/^\W*\d/.test(m) ? m : "[file]"))
    .replace(/\b(?:SKILL|toolkit|toolbox|WORK-METHOD|knowledge card|card id|the pack)\b/gi, "")
    .replace(/[—–]/g, ", ");
  for (const n of personaNames) if (n && n.length > 2) t = t.replace(new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g"), "");
  return t.trim();
}

export function grades() {
  const s = readFileSync(path.join(SUITE, "RUBRIC.md"), "utf8");
  const a = s.indexOf("<!-- grades:start -->"), b = s.indexOf("<!-- grades:end -->");
  return s.slice(a + 21, b).trim();
}

export function ownerScore(g) {
  let w = 0, x = 0;
  for (const k of GRADES) { const v = Number(g?.[k]); if (Number.isFinite(v) && v > 0) { w += WEIGHTS[k]; x += WEIGHTS[k] * v; } }
  return w ? x / w : NaN;
}

export function readJson(p) {
  const raw = readFileSync(p, "utf8").trim();
  try { return JSON.parse(raw); } catch {
    const m = raw.match(/\{[\s\S]*\}/); if (!m) throw new Error(`no JSON in ${p}`);
    return JSON.parse(m[0]);
  }
}

export const mean = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
export const r2 = x => (Number.isFinite(x) ? Math.round(x * 100) / 100 : null);
export function pct(x) { return Number.isFinite(x) ? `${Math.round(x * 1000) / 10}%` : "n/a"; }

// Long lines from the keys and the job checks; no sheet or prompt may contain one of these.
export function keyLines(tasks) {
  const out = new Set();
  const kdir = path.join(SUITE, "keys");
  if (existsSync(kdir)) for (const f of readdirSync(kdir)) if (/^E\d+\.md$/.test(f))
    for (const l of readFileSync(path.join(kdir, f), "utf8").split(/\r?\n/)) { const s = l.replace(/^[\s#*\-\d.]+/, "").trim(); if (s.length >= 60) out.add(s); }
  for (const t of tasks) for (const c of [...t.checks, ...t.traps]) if (c.length >= 60) out.add(c);
  return [...out];
}
export function assertNoKey(text, lines, where) {
  for (const l of lines) if (text.includes(l)) throw new Error(`key leak in ${where}: "${l.slice(0, 70)}..."`);
}

export function writeFile(p, s) { mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); }

// The fenced image-prompts JSON block an arm writes for image tasks.
export function extractPrompts(answer) {
  const blocks = [...answer.matchAll(/```([^\n`]*)\n([\s\S]*?)```/g)];
  for (const [, info, body] of blocks) {
    let b = body;
    if (/image-prompts/i.test(info)) { /* info string names it */ }
    else if (/^\s*image-prompts\s*\n/i.test(b)) b = b.replace(/^\s*image-prompts\s*\n/i, "");
    else continue;
    try { const j = JSON.parse(b.trim()); if (Array.isArray(j)) return j.filter(x => x && typeof x.prompt === "string"); } catch { /* try next */ }
  }
  return [];
}
