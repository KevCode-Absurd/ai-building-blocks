// Safety scan of every catalogue item: malware patterns, prompt injection, hidden characters, opaque files, and what
// each item can do (its capabilities, which become the "Safety guardrails" on its page and SAFETY.md in its download).
// It never runs, imports or fetches an item's code. A match is a candidate; a person decides (catalogue-items/safety-review.yaml).
//
//   node tools/safety-scan.mjs scan          scan everything; write runs/safety/scan.json and print a summary
//   node tools/safety-scan.mjs open          list findings with no review decision yet (critical and high first)
//   node tools/safety-scan.mjs write         apply review decisions; write catalogue-items/_safety.json (each item's
//                                            guardrails and SAFETY.md, and the numbers on /how-we-check-safety) and
//                                            merge withheld items into quarantine.yaml; exit 1 if any critical or high
//                                            finding is still undecided
//
// Review decisions (catalogue-items/safety-review.yaml), keyed by finding id "<slug>|<rule>|<file>|<sha8 of the line>":
//   decision: safe      a false alarm (say why in note)
//             note      real but acceptable; the note is shown on the item's page as a guardrail
//             fixed     we changed the file; the finding is gone on the next scan (kept for the record)
//             block     withheld from the site: the slug goes into catalogue-items/quarantine.yaml
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { CAPABILITIES, GUARD_CONTEXT, IMAGE_FONT_EXT, INVISIBLE, OPAQUE, RULES, RULES_VERSION, SCRIPT_EXT, TEXT_EXT } from "./lib/safety-rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ITEMS = path.join(ROOT, "catalogue-items");
const GROUPS = ["general", "ecommerce", "imported", "orchestrators", "agents", "minds", "ai-tools"];
const OUT_DIR = path.join(ROOT, "runs/safety");
const SCAN = path.join(OUT_DIR, "scan.json");
const REVIEW = path.join(ITEMS, "safety-review.yaml");
const SAFETY = path.join(ITEMS, "_safety.json");
const QUARANTINE = path.join(ITEMS, "quarantine.yaml");
const OWN_FILES = new Set(["item.yaml", "page.yaml", "mind.yaml"]); // our metadata, not part of what ships to the AI
const MAX_BYTES = 3_000_000;
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const SECURITY_THEME = /secur|inject|red-?team|pentest|penetration|threat|malware|phish|attack|exploit|vulnerab|hardening|harden|guardrail|jailbreak|ctf|forensic|incident|siem|soc-|owasp|audit|compliance|privacy|fraud|abuse|safety|hijack/i;

function* walk(dir, rel = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name === "node_modules" || e.name === "__pycache__" || e.name === ".git") continue;
    const r = rel ? `${rel}/${e.name}` : e.name, p = path.join(dir, e.name);
    if (e.isSymbolicLink()) { yield { rel: r, abs: p, symlink: true }; continue; }
    if (e.isDirectory()) yield* walk(p, r); else yield { rel: r, abs: p };
  }
}

const TEST_FILE = /(?:^|\/)(?:tests?|__tests__|fixtures?|examples?|samples?|spec)\/|(?:^|\/)test_[^/]*$|[._-](?:test|spec)\.[a-z]+$/i;
const NOT_A_CALL = /^(?:localhost|[^.]+\.(?:test|invalid|local|localhost|example)|(?:.*\.)?example\.(?:com|org|net)|(?:.*\.)?(?:w3\.org|schema\.org|sitemaps\.org|json-schema\.org|purl\.org|xmlns\.com|openxmlformats\.org|apache\.org\/xml|ogp\.me|api\.w\.org)|schemas\..*|(?:c\d|competitor|yoursite|yourdomain|your-domain|mysite|domain|acme|foo|bar)\.(?:com|org|net|io))$/;
const lineOf = (text, index) => { let n = 1; for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++; return n; };
const lineText = (lines, n) => (lines[n - 1] ?? "").trim().slice(0, 240);
const globalRe = (r) => new RegExp(r.source, r.flags.includes("g") ? r.flags : r.flags + "g");
const GLOBALS = new Map([...RULES, ...INVISIBLE, ...CAPABILITIES].map((r) => [r, globalRe(r.re)]));

/** Fenced code blocks in Markdown, with the line each starts on, so shell commands in a SKILL.md get the script rules. */
function codeBlocks(text) {
  const out = [], fence = /^(```|~~~)[^\n]*\n([\s\S]*?)^\1\s*$/gm; let m;
  while ((m = fence.exec(text))) out.push({ code: m[2], offset: m.index + m[0].indexOf("\n") + 1 });
  return out;
}

function scanText({ text, rel, kind, slug, themed, findings, caps, hosts }) {
  const lines = text.split(/\r?\n/);
  const add = (rule, index, extraOffset = 0) => {
    const line = lineOf(text, index + extraOffset), snippet = lineText(lines, line);
    const near = lines.slice(Math.max(0, line - 3), line + 2).join(" ");
    const context = GUARD_CONTEXT.test(near) || themed ? "guard-or-example" : "plain";
    findings.push({ id: `${slug}|${rule.id}|${rel}|${sha(snippet).slice(0, 8)}`, rule: rule.id, severity: rule.severity, title: rule.title, file: rel, line, snippet, context });
  };
  const run = (rule, body, offset = 0) => { const g = GLOBALS.get(rule); g.lastIndex = 0; let m, n = 0; while ((m = g.exec(body)) && n++ < 20) { add(rule, m.index, offset); if (m[0].length === 0) g.lastIndex++; } };
  const scriptLike = kind === "script";
  for (const rule of RULES) {
    if (rule.where === "any" || rule.where === kind) run(rule, text);
    else if (rule.where === "script" && kind === "doc") for (const b of codeBlocks(text)) run(rule, b.code, b.offset);
  }
  for (const rule of INVISIBLE) run(rule, text);
  if (scriptLike) {
    // Long encoded blobs in code: the usual way to hide a payload. Data URIs for images are left alone.
    const blob = /(?<![A-Za-z0-9+/=]|data:[\w/+.-]+;base64,)[A-Za-z0-9+/]{400,}={0,2}(?![A-Za-z0-9+/=])/g; let m;
    while ((m = blob.exec(text))) add({ id: "encoded-blob", severity: "high", title: "Has a long encoded block that could hide code" }, m.index);
    const hex = /(?:\\x[0-9a-fA-F]{2}){40,}/g;
    while ((m = hex.exec(text))) add({ id: "hex-blob", severity: "high", title: "Has a long run of hex-escaped bytes" }, m.index);
    // The sites a script talks to, for the guardrail. Test fixtures and XML or schema namespaces aren't real calls.
    if (!TEST_FILE.test(rel)) for (const m2 of text.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})(?::\d+)?/gi)) {
      const h = m2[1].toLowerCase().replace(/^www\./, "");
      if (!NOT_A_CALL.test(h)) hosts.add(h);
    }
  }
  for (const cap of CAPABILITIES) {
    if (!(cap.where === "any" || cap.where === kind || (cap.where === "script" && kind === "doc" && codeBlocks(text).length))) continue;
    const g = GLOBALS.get(cap); g.lastIndex = 0;
    const body = cap.where === "script" && kind === "doc" ? codeBlocks(text).map((b) => b.code).join("\n") : text;
    if (g.test(body)) caps.add(cap.id);
  }
}

function scanItem(group, slug) {
  const dir = path.join(ITEMS, group, slug);
  const findings = [], caps = new Set(), hosts = new Set(), scripts = {};
  let files = 0, bytes = 0;
  const meta = (() => { for (const f of ["item.yaml", "mind.yaml"]) { const p = path.join(dir, f); if (fs.existsSync(p)) try { return YAML.parse(fs.readFileSync(p, "utf8")) ?? {}; } catch { return {}; } } return {}; })();
  const themed = SECURITY_THEME.test(`${slug} ${meta.name ?? ""} ${meta.summary ?? ""}`);
  for (const f of walk(dir)) {
    if (f.symlink) { findings.push({ id: `${slug}|symlink|${f.rel}|0`, rule: "symlink", severity: "high", title: "Has a link to a file outside the item", file: f.rel, line: 0, snippet: "", context: "plain" }); continue; }
    if (OWN_FILES.has(f.rel)) continue;
    files++;
    const stat = fs.statSync(f.abs); bytes += stat.size;
    const opaque = OPAQUE.find((o) => o.re.test(f.rel));
    if (opaque) { findings.push({ id: `${slug}|${opaque.id}|${f.rel}|${sha(fs.readFileSync(f.abs)).slice(0, 8)}`, rule: opaque.id, severity: opaque.severity, title: opaque.title, file: f.rel, line: 0, snippet: `${stat.size} bytes`, context: "plain" }); continue; }
    if (IMAGE_FONT_EXT.test(f.rel)) continue;
    if (stat.size > MAX_BYTES) { findings.push({ id: `${slug}|too-large|${f.rel}|0`, rule: "too-large", severity: "medium", title: "A file too large to scan fully", file: f.rel, line: 0, snippet: `${stat.size} bytes`, context: "plain" }); continue; }
    const buf = fs.readFileSync(f.abs);
    const script = SCRIPT_EXT.test(f.rel) || /^#!/.test(buf.subarray(0, 2).toString());
    if (!script && !TEXT_EXT.test(f.rel) && buf.includes(0)) { findings.push({ id: `${slug}|unknown-binary|${f.rel}|${sha(buf).slice(0, 8)}`, rule: "unknown-binary", severity: "high", title: "Includes a file of unknown type that isn't text", file: f.rel, line: 0, snippet: `${stat.size} bytes`, context: "plain" }); continue; }
    const text = buf.toString("utf8");
    if (script) { const ext = (path.extname(f.rel).slice(1) || "script").toLowerCase(); scripts[ext] = (scripts[ext] ?? 0) + 1; }
    if (/\.svg$/i.test(f.rel) && /<script\b|\bon[a-z]+\s*=\s*["']|(?:href|src)\s*=\s*["'](?:javascript:|data:text\/html)/i.test(text))
      findings.push({ id: `${slug}|active-svg|${f.rel}|${sha(text).slice(0, 8)}`, rule: "active-svg", severity: "high", title: "An image file that contains code", file: f.rel, line: 0, snippet: "", context: "plain" });
    scanText({ text, rel: f.rel, kind: script ? "script" : "doc", slug, themed, findings, caps, hosts });
  }
  return { slug, group, origin: meta.origin ?? (group === "imported" ? "imported" : "own"), source: meta.source?.repo ?? null, files, bytes, scripts, capabilities: [...caps].sort(), hosts: [...hosts].sort().slice(0, 25), findings };
}

function loadReview() { return fs.existsSync(REVIEW) ? YAML.parse(fs.readFileSync(REVIEW, "utf8")) ?? {} : {}; }
const RANK = { critical: 0, high: 1, medium: 2 };

const cmd = process.argv[2];
if (cmd === "scan") {
  const started = Date.now(), items = [];
  for (const g of GROUPS) { const dir = path.join(ITEMS, g); if (!fs.existsSync(dir)) continue; for (const slug of fs.readdirSync(dir).sort()) if (fs.statSync(path.join(dir, slug)).isDirectory()) items.push(scanItem(g, slug)); }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const all = items.flatMap((i) => i.findings);
  fs.writeFileSync(SCAN, JSON.stringify({ rules: RULES_VERSION, scanned: new Date().toISOString(), items }, null, 1));
  const tally = {};
  for (const f of all) { const k = `${f.severity.padEnd(8)} ${f.rule.padEnd(26)} ${f.context}`; tally[k] = (tally[k] ?? 0) + 1; }
  console.log(`Scanned ${items.length} items, ${items.reduce((n, i) => n + i.files, 0)} files, ${(items.reduce((n, i) => n + i.bytes, 0) / 1e6).toFixed(1)} MB in ${((Date.now() - started) / 1000).toFixed(1)} s`);
  console.log(`Items with scripts: ${items.filter((i) => Object.keys(i.scripts).length).length}. Findings: ${all.length} in ${items.filter((i) => i.findings.length).length} items`);
  for (const [k, n] of Object.entries(tally).sort((a, b) => RANK[a[0].trim().split(" ")[0]] - RANK[b[0].trim().split(" ")[0]] || b[1] - a[1])) console.log(String(n).padStart(6), k);
} else if (cmd === "open") {
  const { items } = JSON.parse(fs.readFileSync(SCAN, "utf8")), review = loadReview();
  const sev = process.argv.includes("--all") ? 2 : 1;
  const open = items.flatMap((i) => i.findings).filter((f) => !review[f.id] && RANK[f.severity] <= sev).sort((a, b) => RANK[a.severity] - RANK[b.severity] || a.rule.localeCompare(b.rule));
  for (const f of open) console.log(`${f.severity}\t${f.context}\t${f.id}\tL${f.line}\t${f.snippet}`);
  console.error(`${open.length} open`);
} else if (cmd === "write") {
  const scan = JSON.parse(fs.readFileSync(SCAN, "utf8")), review = loadReview();
  const out = { rules: scan.rules, scanned: scan.scanned.slice(0, 10), items: {} }, blocked = {}, undecided = [];
  const stats = { items: scan.items.length, files: 0, withScripts: 0, findings: 0, reviewed: 0, falseAlarms: 0, notes: 0, fixed: 0, blocked: 0, clean: 0 };
  for (const i of scan.items) {
    stats.files += i.files;
    if (Object.keys(i.scripts).length) stats.withScripts++;
    const notes = [], flags = new Set();
    let isBlocked = false;
    for (const f of i.findings) {
      stats.findings++;
      const d = review[f.id];
      // Medium findings need no decision: each becomes a standard guardrail line (tools/lib/safety-guardrails.mjs FLAG).
      if (!d) { if (RANK[f.severity] <= 1) undecided.push(f.id); else flags.add(f.rule); continue; }
      stats.reviewed++;
      if (d.decision === "safe") stats.falseAlarms++;
      else if (d.decision === "note") { stats.notes++; notes.push(d.note || f.title); }
      else if (d.decision === "fixed") stats.fixed++;
      else if (d.decision === "block") { isBlocked = true; blocked[i.slug] = d.note || f.title; }
    }
    if (isBlocked) stats.blocked++;
    else if (!i.findings.length) stats.clean++;
    const entry = {};
    if (Object.keys(i.scripts).length) entry.scripts = i.scripts;
    // Files nobody can read as text (compiled code, binaries, archives): such an item is never called "text only".
    const opaque = i.findings.filter((f) => ["binary-executable", "compiled-code", "pickle-file", "macro-document", "archive", "unknown-binary"].includes(f.rule)).length;
    if (opaque) entry.opaque = opaque;
    if (i.capabilities.length) entry.can = i.capabilities;
    if (i.hosts.length) entry.hosts = i.hosts;
    if (notes.length) entry.notes = [...new Set(notes)];
    if (flags.size) entry.flags = [...flags].sort();
    if (isBlocked) entry.blocked = true;
    out.items[i.slug] = entry;
  }
  out.stats = stats;
  fs.writeFileSync(SAFETY, JSON.stringify(out) + "\n");
  // Withheld items are merged into quarantine.yaml (existing entries kept), so the index build leaves them out.
  const q = fs.existsSync(QUARANTINE) ? YAML.parse(fs.readFileSync(QUARANTINE, "utf8")) ?? {} : {};
  for (const [slug, why] of Object.entries(blocked)) q[slug] = { reason: `Safety scan ${scan.scanned.slice(0, 10)}: ${why}` };
  fs.writeFileSync(QUARANTINE, Object.keys(q).length ? YAML.stringify(q) : "{}\n");
  console.log(JSON.stringify(stats));
  if (undecided.length) { console.error(`${undecided.length} critical or high findings have no decision. Run: node tools/safety-scan.mjs open`); process.exit(1); }
} else {
  console.log("Usage: node tools/safety-scan.mjs scan|open [--all]|write");
  process.exit(2);
}
