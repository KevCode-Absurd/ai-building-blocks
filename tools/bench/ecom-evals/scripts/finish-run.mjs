#!/usr/bin/env node
// Finishes one arm run after `claude -p --output-format stream-json --verbose > run.jsonl`:
// saves the final reply to answer.md (unless the run wrote one), logs usage and cost into meta.json, and audits
// every tool call for reads outside the run folder. A run that touched files outside its folder, or the web,
// is marked contaminated and make-sheets leaves it out of judging.
//
//   node scripts/finish-run.mjs <run folder>
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import { assertRun } from "./asserts.mjs";
import { loadTasks } from "./lib.mjs";

const dir = path.resolve(process.argv[2] ?? ".");
const log = path.join(dir, "run.jsonl");
if (!existsSync(log)) { console.error(`no ${log}`); process.exit(2); }
const events = readFileSync(log, "utf8").split(/\r?\n/).filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const result = [...events].reverse().find(e => e.type === "result") ?? {};
const init = events.find(e => e.type === "system" && e.subtype === "init") ?? {};
const outside = [], web = [], tools = {}, touched = [];
const native = p => p.replace(/^\/([a-zA-Z])\//, (_, d) => `${d.toUpperCase()}:/`);
const slug = dir.replace(/[:\\/]/g, '-').toLowerCase();
const ownHarness = p => { const n = native(p).replace(/\\/g, '/').toLowerCase(); return n.includes(`/${slug}/`) && (n.includes('/.claude/projects/') || n.includes('/appdata/local/temp/claude/')); };
const upIntoRun = p => { const m = /^\.\.[\\/]([^\\/]+)/.exec(p); return !!m && existsSync(path.join(dir, m[1])); };
const inside = p => { if (ownHarness(p) || upIntoRun(p)) return true; const r = path.relative(dir, path.resolve(dir, native(p))); return r === "" || (!r.startsWith("..") && !path.isAbsolute(r)); };
for (const e of events) {
  const content = e.type === "assistant" ? e.message?.content ?? [] : [];
  for (const c of content) {
    if (c.type !== "tool_use") continue;
    tools[c.name] = (tools[c.name] ?? 0) + 1;
    const i = c.input ?? {};
    touched.push(JSON.stringify(i));
    if (/^Web/.test(c.name)) web.push(c.name);
    for (const k of ["file_path", "path", "notebook_path"]) if (typeof i[k] === "string" && !inside(i[k])) outside.push(`${c.name} ${i[k]}`);
    if (typeof i.pattern === "string" && /^([A-Za-z]:|\/|\.\.)/.test(i.pattern) && !inside(i.pattern.replace(/[*?{].*$/, "") || ".")) outside.push(`${c.name} ${i.pattern}`);
    if (c.name === "Bash" && typeof i.command === "string") {
      for (const m of i.command.matchAll(/(?:[A-Za-z]:[\\/]|\/(?:c|d|Users|home|tmp)\/|\.\.[\\/])[^\s"'`;|&)]*/g)) if (!inside(m[0])) outside.push(`Bash ${m[0]}`);
      if (/\b(curl|wget|Invoke-WebRequest)\b/.test(i.command)) web.push("Bash network");
    }
  }
}
const answer = path.join(dir, "answer.md");
if (!existsSync(answer) || !statSync(answer).size) writeFileSync(answer, result.result ?? "");
const metaPath = path.join(dir, "meta.json");
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : {};
// A run that never opens the owner's data answers blind and scores like it (round 2: 4.2 against 8.0). Flag it so
// the round is re-run before judging rather than read as a pack regression. ORG-CONTEXT.md is context, not data.
const seen = touched.join("\n").replace(/\\\\/g, "/");
const ownerFiles = (meta.inputs ?? []).filter(n => n !== "ORG-CONTEXT.md");
const unread = meta.arm === "chat" || seen.includes("inputs/*") || /\binputs\/?[\s"';&|]|\binputs\/\*/.test(seen) ? [] : ownerFiles.filter(n => !seen.includes(n) && !seen.includes(n.slice(0, 20)));
Object.assign(meta, { finished: new Date().toISOString(), model_resolved: init.model ?? null, usage: result.usage ?? null, cost_usd: result.total_cost_usd ?? null, num_turns: result.num_turns ?? null,
  is_error: result.is_error ?? null, tool_calls: tools, audit: { outside_reads: outside, web, contaminated: outside.length > 0 || web.length > 0, inputs_unread: unread } });
writeFileSync(metaPath, JSON.stringify(meta, null, 1));
// Free code checks on the answer (they measure; they never keep a run out of judging).
const asserted = assertRun(dir, loadTasks().find(t => t.id === meta.task));
console.log(`${path.basename(path.dirname(path.dirname(dir)))}/${path.basename(path.dirname(dir))}/${path.basename(dir)}: ${meta.audit.contaminated ? "CONTAMINATED " + JSON.stringify(meta.audit) : "clean"}${unread.length ? ` MISSED ${unread.length} OF ${ownerFiles.length} OWNER FILES: re-run it` : ""}${asserted && !asserted.pass_all ? " (code checks: " + Object.entries(asserted.checks).filter(([, c]) => !c.pass).map(([k]) => k).join(", ") + ")" : ""}`);
