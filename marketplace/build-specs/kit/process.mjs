// process.mjs: checks a process file and turns it into a page an owner can read.
//   node agent/process.mjs check processes/*.json      every rule below, for every file
//   node agent/process.mjs check --partial processes/*.json   the same, but a hand-off to a process this store
//                                                      has not installed is a warning (that hand-off is skipped)
//   node agent/process.mjs render processes/video-ad.json > processes/video-ad.md
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BLOCK_REASONS } from "./trace.mjs";

const GATES = new Set(["none", "owner"]);
const ACCESS = new Set(["read", "draft", "publish"]);

// Returns a list of problems. agents: the known agent ids; others: ids of all processes.
export function validate(proc, agents = null, others = null) {
  const p = [];
  const need = (cond, msg) => { if (!cond) p.push(`${proc?.id ?? "?"}: ${msg}`); };
  need(/^[a-z0-9-]+$/.test(proc?.id ?? ""), "id must be lower-case words joined by hyphens");
  need(String(proc?.name ?? "").length >= 8, "needs a name an owner understands");
  need(String(proc?.goal ?? "").length >= 20, "needs a goal: what the owner gets at the end");
  need(Array.isArray(proc?.stages) && proc.stages.length, "needs stages");
  if (!Array.isArray(proc?.stages)) return p;
  const ids = new Set();
  proc.stages.forEach((s, i) => {
    const at = `stage ${i + 1} (${s.id})`;
    need(s.id && !ids.has(s.id), `${at}: stage ids must be unique`); ids.add(s.id);
    need(String(s.say ?? "").length >= 20, `${at}: say what happens, in plain words`);
    need(s.agent, `${at}: name the agent that does it`);
    if (agents && s.agent && s.agent !== "owner") need(agents.includes(s.agent), `${at}: unknown agent ${s.agent}`);
    need(GATES.has(s.gate ?? "none"), `${at}: gate is none or owner`);
    need(ACCESS.has(s.access ?? "read"), `${at}: access is read, draft or publish`);
    need(Array.isArray(s.makes) && (s.makes.length || s.access === "publish"), `${at}: list the files it makes`);
    need(String(s.done_when ?? "").length >= 15, `${at}: say when it counts as done`);
    for (const c of s.checks ?? []) need(proc.checks?.[c], `${at}: check ${c} is not defined under checks`);
    if (s.spends) need(s.gate === "owner" || s.access === "publish", `${at}: it spends money, so the owner signs off first`);
    if (s.budget_from) {
      const from = proc.stages.findIndex(x => x.id === s.budget_from);
      need(from >= 0 && from < i && proc.stages[from].gate === "owner", `${at}: budget_from must name an earlier stage the owner signs off`);
      need((proc.checks ?? {})["spend-within-budget"] && (s.checks ?? []).includes("spend-within-budget"), `${at}: spending stages run the spend-within-budget check`);
    }
    if (s.access === "publish") need(String(s.publish ?? "").length >= 15, `${at}: say what goes live and through which connector`);
    // A stage can say when it stops instead of carrying on. The job is then blocked with that reason
    // (node agent/board.mjs block), and the orchestrator asks the owner or sends the work elsewhere.
    if (s.blocked_when !== undefined) {
      need(s.blocked_when && typeof s.blocked_when === "object" && !Array.isArray(s.blocked_when) && Object.keys(s.blocked_when).length, `${at}: blocked_when maps a reason to when it applies`);
      for (const [reason, when] of Object.entries(s.blocked_when ?? {})) {
        need(BLOCK_REASONS.includes(reason), `${at}: blocked_when reason ${reason} is not one of ${BLOCK_REASONS.join(", ")}`);
        need(String(when ?? "").length >= 15, `${at}: blocked_when ${reason}: say when it applies, in plain words`);
      }
    }
  });
  need(proc.stages[0]?.id === "intake" || ["recurring", "setup", "continuation"].includes(proc.kind), "a making process starts with an intake stage");
  if (proc.stages[0]?.id === "intake") need((proc.stages[0].needs ?? []).some(n => /context\/org/.test(n)), "intake reads the Org context (context/org/)");
  for (const [name, c] of Object.entries(proc.checks ?? {})) {
    need(["script", "reviewer"].includes(c.kind), `check ${name}: kind is script or reviewer`);
    if (c.kind === "script") need(String(c.run ?? "").length > 3, `check ${name}: give the command`);
    if (c.kind === "reviewer") { need(c.agent, `check ${name}: name the reviewer`); if (agents && c.agent) need(agents.includes(c.agent) || /reviewer$/.test(c.agent), `check ${name}: unknown reviewer ${c.agent}`); }
    need(String(c.passes_when ?? "").length >= 15, `check ${name}: say when it passes`);
  }
  for (const t of [].concat(proc.then ?? [])) if (others) need(others.includes(t), `hands off to unknown process ${t}`);
  if (Array.isArray(proc.then)) need(proc.stages[0]?.makes?.includes("channels.json") || proc.stages.some(s => s.makes?.includes("channels.json")), "a process that can hand off to several processes makes channels.json to say which");
  return p;
}

export function render(proc, names = {}) {
  const who = id => id === "owner" ? "You" : names[id] ? `${names[id]} (${id})` : id;
  const L = [`# ${proc.name}`, "", proc.goal, ""];
  if (proc.starts_from) L.push(`**Starts from:** ${proc.starts_from}`, "");
  L.push("| # | Stage | Who | Makes | Checked by | You sign off | Access |", "|---|---|---|---|---|---|---|");
  proc.stages.forEach((s, i) => L.push(`| ${i + 1} | ${s.name ?? s.id} | ${who(s.agent)} | ${(s.makes ?? []).join(", ") || "live change"} | ${(s.checks ?? []).join(", ") || "none"} | ${s.gate === "owner" ? "yes" : s.access === "publish" ? "yes, the plan" : "no"} | ${s.access ?? "read"} |`));
  L.push("", "## Stage by stage", "");
  proc.stages.forEach((s, i) => {
    L.push(`### ${i + 1}. ${s.name ?? s.id}`, "", s.say, "");
    if (s.needs?.length) L.push(`- **Needs:** ${s.needs.join("; ")}`);
    if (s.makes?.length) L.push(`- **Makes:** ${s.makes.join(", ")}`);
    if (s.checks?.length) L.push(`- **Checks:** ${s.checks.map(c => `${c} (${proc.checks[c].passes_when})`).join("; ")}`);
    if (s.spends) L.push(`- **Costs money:** ${s.spends}`);
    if (s.budget_from) L.push(`- **Costs money:** only inside the budget you approved at ${s.budget_from}; it stops before going over.`);
    if (s.publish) L.push(`- **Goes live:** ${s.publish}`);
    if (s.blocked_when) L.push(`- **Stops and asks when:** ${Object.entries(s.blocked_when).map(([r, w]) => `${w} (${r.replace(/_/g, " ")})`).join("; ")}`);
    L.push(`- **Done when:** ${s.done_when}`);
    if (s.gate === "owner") L.push(`- **You sign off:** ${s.signoff ?? "you look at what it made and reply yes with the code"}`);
    L.push("");
  });
  const humans = proc.stages.filter(s => s.gate === "owner" || s.access === "publish");
  L.push("## Where you step in", "", ...humans.map(s => `- **${s.name ?? s.id}:** ${s.gate === "owner" ? s.signoff ?? "sign off what it made" : "approve the exact plan of live changes"}`), "");
  if (Array.isArray(proc.then)) L.push(`## Then`, "", `When the last stage is done, the work moves, with the same folder, to each process named in channels.json: ${proc.then.map(t => `**${t}**`).join(", ")}. One launch job per channel.`, "");
  else if (proc.then) L.push(`## Then`, "", `When the last stage is done, the work moves to **${proc.then}** with the same folder.`, "");
  if (proc.metrics?.length) L.push("## How we judge it", "", ...proc.metrics.map(m => `- ${m}`), "");
  return L.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [cmd, ...rest] = process.argv.slice(2);
  const partial = rest.includes("--partial"), files = rest.filter(f => f !== "--partial");
  const procs = files.map(f => JSON.parse(fs.readFileSync(f, "utf8")));
  const here = path.join(path.dirname(fileURLToPath(import.meta.url)), "agents.json");
  const agentsFile = process.env.AGENTS_FILE || (fs.existsSync(here) ? here : null);
  const agentList = agentsFile ? JSON.parse(fs.readFileSync(agentsFile, "utf8")) : null;
  const ids = agentList ? agentList.map(a => a.id) : null, names = Object.fromEntries((agentList ?? []).map(a => [a.id, a.name]));
  if (cmd === "check") {
    const found = procs.flatMap(p => validate(p, ids, procs.map(x => x.id)));
    const warn = partial ? found.filter(m => /hands off to unknown process/.test(m)) : [];
    const all = found.filter(m => !warn.includes(m));
    if (warn.length) console.log(warn.map(m => `note: ${m} (not installed here, so that hand-off will be skipped)`).join("\n"));
    console.log(all.length ? all.join("\n") : `${procs.length} processes pass.`);
    process.exit(all.length ? 1 : 0);
  } else if (cmd === "render") console.log(procs.map(p => render(p, names)).join("\n\n"));
  else console.log("Commands: check <files...> | render <files...>   (AGENTS_FILE=agents.json to check agent ids)");
}
