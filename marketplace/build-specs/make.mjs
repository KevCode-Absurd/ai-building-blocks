// make.mjs: builds the build folders an owner unzips and hands to Claude Code.
//   node build-specs/make.mjs            write dist/store/ and dist/agents/<id>/
//   node build-specs/make.mjs --check    fail if dist is out of date or any rule below breaks
// Each folder holds BUILD.md (the steps), files/ (the kit, at the paths it takes in the store folder),
// processes/ (the processes that agent takes part in, and everything they hand off to) and access/
// (the access guides those processes need). Files are copied word for word.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validate, render } from "./kit/process.mjs";

const B = path.dirname(fileURLToPath(import.meta.url));
const rel = p => path.join(B, p);
const read = p => fs.readFileSync(rel(p), "utf8");
const CHECK = process.argv.includes("--check");

// Source, path in the store folder, what it is.
const KIT = [
  ["kit/guard.mjs", "agent/guard.mjs", "decides whether each tool call may run"],
  ["kit/actions.mjs", "agent/actions.mjs", "plans, dry runs, owner-held file changes, run records, schedule"],
  ["kit/board.mjs", "agent/board.mjs", "the job board: stages, checks, sign-offs, hand-offs"],
  ["kit/spend.mjs", "agent/spend.mjs", "generation spend against the signed-off estimate"],
  ["kit/process.mjs", "agent/process.mjs", "checks process files and renders them as pages"],
  ["kit/hooks.mjs", "agent/hooks.mjs", "enforces the gate inside Claude Code"],
  ["kit/kit.test.mjs", "agent/kit.test.mjs", "tests for all of the above"],
  ["kit/gate.test.mjs", "agent/gate.test.mjs", "more gate tests: per-call fields, budgets from the input, pause, fail closed, early stages, swapped files"],
  ["kit/trace.mjs", "agent/trace.mjs", "writes agent-state/trace.jsonl: every stage, check, sign-off, change request, plan, approval, tool call, read back and stop, in order"],
  ["kit/trace-checks.mjs", "agent/trace-checks.mjs", "checks a trace for the rules every job must keep (approved writes only, no retries, read back before done)"],
  ["kit/transitions.mjs", "agent/transitions.mjs", "the failure table: per process, the last step that went well against the first thing that went wrong"],
  ["kit/trace.test.mjs", "agent/trace.test.mjs", "tests for the trace, its checks and the failure table"],
  ["agents.json", "agent/agents.json", "the agents' ids and names, so process pages show names"],
  ...["copy-check.cjs", "check-logo-contrast.cjs", "numbers.cjs", "financial-ledger.cjs", "readability.cjs", "proof.cjs", "leakcheck.cjs", "render.cjs"].map(f =>
    [`../packs/shared/tools/quality/${f}`, `tools/quality/${f}`, "a quality check the processes run (plain Node, no packages)"]),
  ["../packs/shared/tools/quality/FINANCIAL.md", "tools/quality/FINANCIAL.md", "source-pinned financial ledger contract and limits"],
  ["../packs/shared/tools/commerce-math.mjs", "tools/commerce-math.mjs", "deterministic commerce and capacity calculations"],
  ["../packs/shared/tools/verify-patch.mjs", "tools/verify-patch.mjs", "checks an exact patch against an isolated baseline copy"],
  ["../packs/shared/tools/automation-review.mjs", "tools/automation-review.mjs", "reviews outcome visibility and decision boundaries; no live actions"],
  ["../packs/shared/AUTOMATION-PRINCIPLES.md", "AUTOMATION-PRINCIPLES.md", "preserves customer signals, judgment, critical skills and relationships"],
  ["kit/settings.json", ".claude/settings.json", "turns the hooks on (copy it in step 9, not before)"],
  ["kit/limits.example.json", "context/limits.example.json", "example money limits; fill context/limits.json from the owner's answers"],
  ["kit/goals.example.json", "context/goals.example.json", "example goals; fill context/goals.json from the owner's answers"],
  ["kit/warehouse/meta-sync.mjs", "warehouse/meta-sync.mjs", "daily Meta pipeline (read-only token)"],
  ["kit/warehouse/register.mjs", "warehouse/register.mjs", "builds the creative register from the board"],
  ["kit/warehouse/views.sql", "warehouse/views.sql", "the warehouse views every agent reads"],
  ["kit/warehouse/warehouse.test.mjs", "warehouse/warehouse.test.mjs", "tests for the pipeline transform"],
  ["meta-ads-agent/files/tools.json", "agent/tools.meta.json", "the Meta part of agent/tools.json (merge with other connectors)"],
  ["meta-ads-agent/files/AGENT.md", "agents/meta-rules.md", "operating rules for every agent that touches Meta ads"],
  ["meta-ads-agent/files/.claude/agents/meta-plan-reviewer.md", ".claude/agents/meta-plan-reviewer.md", "the reviewer for every Meta plan"],
];

const agents = JSON.parse(read("agents.json"));
const names = Object.fromEntries(agents.map(a => [a.id, a.name]));
const procs = fs.readdirSync(rel("processes")).filter(f => f.endsWith(".json")).sort().map(f => JSON.parse(read(`processes/${f}`)));
const byId = Object.fromEntries(procs.map(p => [p.id, p]));
const agentsIn = p => [...new Set([...p.stages.map(s => s.agent), ...Object.values(p.checks ?? {}).map(c => c.agent).filter(Boolean)])].filter(a => names[a]);
const accessFiles = fs.readdirSync(rel("access")).filter(f => f.endsWith(".md")).sort();
const titleOf = f => (/^# (.+)$/m.exec(read(`access/${f}`)) ?? [, f])[1];

// Which access guides a process needs: the ones it names, plus the platforms its text mentions.
const PLATFORM = [
  [/\bMeta\b|Facebook|Instagram ads|ads_[a-z_]+/, "meta-ads.md"], [/Shopify/, "shopify.md"], [/Klaviyo/, "klaviyo.md"],
  [/Gmail|Outlook|mailbox/i, "gmail-outlook.md"], [/Slack/, "slack.md"], [/Google Drive|\bDrive\b/, "google-drive.md"],
  [/Search Console/, "google-search-console.md"], [/GA4|Google Analytics/, "google-analytics.md"], [/CrUX|PageSpeed|Lighthouse/, "pagespeed-crux.md"],
  [/Google Ads|Merchant Center|Performance Max/, "google-ads.md"], [/TikTok/, "tiktok-ads.md"], [/Pinterest/, "pinterest-ads.md"],
  [/Snapchat/, "snapchat-ads.md"], [/Amazon|Seller Central|SP-API/, "amazon.md"], [/organic|community|Buffer/i, "social-platforms.md"],
];
function accessFor(list) {
  const out = new Set();
  for (const p of list) {
    const text = JSON.stringify(p);
    for (const m of text.matchAll(/access\/([a-z0-9-]+\.md)/g)) out.add(m[1]);
    for (const [re, f] of PLATFORM) if (re.test(text)) out.add(f);
  }
  return [...out].filter(f => accessFiles.includes(f)).sort();
}

// The processes an agent takes part in, plus every process those hand off to.
function processesFor(id) {
  const out = new Set(procs.filter(p => agentsIn(p).includes(id)).map(p => p.id));
  for (let grew = true; grew;) { grew = false; for (const pid of [...out]) for (const t of [].concat(byId[pid]?.then ?? [])) { if (byId[t] && !out.has(t)) { out.add(t); grew = true; } } }
  return procs.filter(p => out.has(p.id));
}

function buildMd(list, access, header) {
  const files = ["| In this folder | Goes to in the store folder | What it is |", "|---|---|---|", ...KIT.map(([, dest, what]) => `| \`files/${dest}\` | \`${dest}\` | ${what} |`)].join("\n");
  const rows = ["| Process | File | Stages | You step in | Then | Agents |", "|---|---|---|---|---|---|", ...list.map(p =>
    `| ${p.name} | \`processes/${p.id}.json\` | ${p.stages.length} | ${p.stages.filter(s => s.gate === "owner" || s.access === "publish").length} | ${[].concat(p.then ?? []).map(t => `\`${t}\``).join(", ")} | ${agentsIn(p).map(a => names[a]).join(", ")} |`)].join("\n");
  const acc = access.map(f => `- \`access/${f}\`: ${titleOf(f)}`).join("\n");
  return (header + read("BUILD-STORE.md"))
    .replace("<!-- kit:files -->", files)
    .replace("<!-- kit:processes -->", rows + "\n\nEach process has a JSON file (the source Claude copies) and a readable page with the same name ending in .md.")
    .replace("<!-- kit:access -->", acc);
}

function folder(list, header) {
  const access = accessFor(list), out = {};
  out["BUILD.md"] = buildMd(list, access, header);
  for (const [src, dest] of KIT) out[`files/${dest}`] = read(src);
  for (const p of list) { out[`processes/${p.id}.json`] = JSON.stringify(p, null, 2) + "\n"; out[`processes/${p.id}.md`] = render(p, names).trimEnd() + "\n"; }
  for (const f of access) out[`access/${f}`] = read(`access/${f}`);
  return out;
}

const problems = [];
for (const p of procs) problems.push(...validate(p, agents.map(a => a.id), procs.map(x => x.id)));
const unplaced = agents.filter(a => !procs.some(p => agentsIn(p).includes(a.id))).map(a => a.id);
if (unplaced.length) problems.push(`agents in no process: ${unplaced.join(", ")}`);

const outputs = {};
for (const [f, t] of Object.entries(folder(procs, ""))) outputs[`dist/store/${f}`] = t;
for (const a of agents) {
  const list = processesFor(a.id);
  const team = [...new Set(list.flatMap(agentsIn))].filter(x => x !== a.id).map(x => names[x]);
  const title = a.title.replace(/\bUGC\b/, "UGC (videos in the style of real customers)").replace(/\bAEO\b/, "AEO (being named in AI answers)");
  const mine = list.filter(p => agentsIn(p).includes(a.id)).map(p => p.name);
  const header = `> **This folder builds ${a.name}, your ${title.charAt(0).toLowerCase() + title.slice(1)}, and the ${team.length} agents ${a.name} hands work to and from.** ${a.name} works on: ${mine.join("; ")}.\n\n<!-- For Claude: in step 1, offer these processes first: ${mine.join("; ")}. The other agents in this folder are ${team.join(", ")}. Every other process is in the full store build. -->\n\n`;
  for (const [f, t] of Object.entries(folder(list, header))) outputs[`dist/agents/${a.id}/${f}`] = t;
}
for (const [f, text] of Object.entries(outputs)) {
  // Owner-facing text only: the shipped checkers contain these characters on purpose, to find them.
  if (/\.(md|json)$/.test(f) && /[–—]/.test(text)) problems.push(`${f}: contains an em or en dash`);
  if (f.endsWith("BUILD.md") && /<!-- kit:/.test(text)) problems.push(`${f}: a kit marker was not filled`);
}
for (const p of procs) fs.writeFileSync(rel(`processes/${p.id}.md`), render(p, names).trimEnd() + "\n");
if (problems.length) { console.log("Problems:\n- " + problems.join("\n- ")); process.exit(1); }

const kb = f => Math.round(Buffer.byteLength(outputs[f]) / 1024);
if (CHECK) {
  const stale = Object.entries(outputs).filter(([f, t]) => !fs.existsSync(rel(f)) || fs.readFileSync(rel(f), "utf8") !== t).map(([f]) => f);
  if (stale.length) { console.log(`Out of date (run node build-specs/make.mjs): ${stale.length} files, for example ${stale[0]}`); process.exit(1); }
  console.log(`Up to date: ${Object.keys(outputs).length} files in ${agents.length + 1} build folders.`);
} else {
  fs.rmSync(rel("dist"), { recursive: true, force: true });
  for (const [f, t] of Object.entries(outputs)) { fs.mkdirSync(path.dirname(rel(f)), { recursive: true }); fs.writeFileSync(rel(f), t); }
  const sizes = agents.map(a => kb(`dist/agents/${a.id}/BUILD.md`));
  console.log(`Wrote ${agents.length + 1} build folders (${Object.keys(outputs).length} files). Store BUILD.md ${kb("dist/store/BUILD.md")} KB; agent BUILD.md ${Math.min(...sizes)} to ${Math.max(...sizes)} KB.`);
}
