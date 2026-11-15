#!/usr/bin/env node
// The owner's review page: Kevin labels a sample of a round's tune answers, and those labels are what the judges are
// checked against (scripts/agreement.mjs). Local only: the server listens on 127.0.0.1 and makes no outside calls.
//
//   node scripts/review.mjs pick  --round R1 [--rounds-dir <dir>] [--n 50] [--seed 3]   choose the answers to review
//   node scripts/review.mjs serve --round R1 [--rounds-dir <dir>] [--port 5199]          open http://127.0.0.1:5199
//   node scripts/review.mjs notes --round R1 [--rounds-dir <dir>]                        notes for grouping into failure types
//
// pick    writes rounds/<R>/review/queue.json. Only tune tasks, never held-out. The sample mixes three sources:
//         answers where the judge and the checker disagree, outliers (longest, shortest, best and worst owner score
//         per arm), and random answers. At least half are random, so the sample stays fair.
// serve   shows one answer at a time, as the owner would see it, with the arm hidden and arm tells scrubbed. Each grade
//         is pass or fail at the pass line (7 or more: "I would accept this with light edits"). Then "would you act
//         on this today", and a short note on the first thing that went wrong. The judge's grades stay hidden until
//         the label is saved, so they cannot sway it. Labels go to rounds/<R>/review/owner-labels.jsonl (the newest
//         label for an answer wins). Hotkeys: 1 to 7 flip a grade, y / e / n set "act today", / jumps to the note,
//         Enter saves and goes to the next answer, j and k move without saving.
// notes   writes rounds/<R>/review/notes.md, Kevin's notes with their task and area, for Claude to group into counted
//         failure types in rounds/<R>/review/failure-taxonomy.md. Kevin accepts or changes the groups.
import { createServer } from "node:http";
import { existsSync, readFileSync, readdirSync, appendFileSync } from "node:fs";
import path from "node:path";
import { ROUNDS, GRADES, PASS_LINE, args, loadTasks, loadPersonas, taskInputs, scrub, readJson, ownerScore, rng, shuffle, writeFile, words, splitOf, latestLabels } from "./lib.mjs";

const A = args();
const cmd = A._[0];
if (!["pick", "serve", "notes"].includes(cmd) || !A.round) { console.error("usage: review.mjs pick|serve|notes --round <name> [options]  (see the header)"); process.exit(2); }
const RD = path.join(A["rounds-dir"] ? path.resolve(A["rounds-dir"]) : ROUNDS, A.round);
const REV = path.join(RD, "review");
const tasks = Object.fromEntries(loadTasks().map(t => [t.id, t]));
const personas = loadPersonas();


function loadKey() {
  const p = path.join(RD, "_key", "blind-key.json");
  if (!existsSync(p)) { console.error(`no ${p}; run make-sheets.mjs sheets first`); process.exit(2); }
  return JSON.parse(readFileSync(p, "utf8")).sheets;
}
const verdict = id => { const p = path.join(RD, "verdicts", `${id}.json`); try { return existsSync(p) ? readJson(p) : null; } catch { return null; } };

// ------------------------------------------------------------------ pick
if (cmd === "pick") {
  const key = loadKey();
  const n = Number(A.n ?? 50);
  const r = rng(Number(A.seed ?? 3));
  const byRun = {};
  for (const [id, s] of Object.entries(key)) {
    if (s.type !== "single" && s.type !== "checker") continue;
    if (tasks[s.task]?.split !== "tune") continue;
    const k = `${s.task}|${s.arm}|${s.run}`;
    (byRun[k] ??= { task: s.task, arm: s.arm, run: s.run, area: s.area })[s.type] = id;
  }
  const items = Object.values(byRun).filter(x => x.single && existsSync(path.join(RD, "runs", x.task, x.arm, x.run, "answer.md")));
  for (const x of items) {
    const v = verdict(x.single), c = verdict(x.checker);
    x.owner = v?.grades ? ownerScore(v.grades) : NaN;
    x.act = String(v?.would_act_on_it_today ?? "").toLowerCase();
    x.checkPass = c?.checks ? c.checks.every(k => String(k.result).toLowerCase() === "pass") && !(c.decoys ?? []).some(d => String(d.result).toLowerCase() === "taken") : null;
    x.words = words(readFileSync(path.join(RD, "runs", x.task, x.arm, x.run, "answer.md"), "utf8"));
  }
  const chosen = new Map();
  const add = (x, why) => { const id = `${x.task}-${x.arm}-${x.run}`; if (!chosen.has(id) && chosen.size < n) chosen.set(id, { id, ...x, why }); };
  // 1. judge and checker disagree (the judge would act on it but the checker failed it, or the other way round)
  const disagree = shuffle(items.filter(x => x.checkPass !== null && ((x.act === "yes" && !x.checkPass) || (x.act === "no" && x.checkPass))), r);
  for (const x of disagree.slice(0, Math.floor(n * 0.3))) add(x, "judge and checker disagree");
  // 2. outliers per arm
  const outl = [];
  for (const arm of [...new Set(items.map(x => x.arm))]) {
    const a = items.filter(x => x.arm === arm);
    const by = (f, dir) => [...a].filter(x => Number.isFinite(f(x))).sort((p, q) => dir * (f(p) - f(q)))[0];
    outl.push([by(x => x.words, -1), "longest answer"], [by(x => x.words, 1), "shortest answer"], [by(x => x.owner, -1), "best judged"], [by(x => x.owner, 1), "worst judged"]);
  }
  for (const [x, why] of outl.filter(o => o[0]).slice(0, Math.floor(n * 0.2))) add(x, why);
  // 3. random, stratified by area so every area shows up
  const areas = {}; for (const x of shuffle(items, r)) (areas[x.area] ??= []).push(x);
  while (chosen.size < n && Object.values(areas).some(l => l.length)) for (const l of Object.values(areas)) { const x = l.shift(); if (x) add(x, "random"); }
  const queue = shuffle([...chosen.values()], r).map(x => ({ id: x.id, task: x.task, arm: x.arm, run: x.run, area: x.area, single: x.single, checker: x.checker, why: x.why, split: splitOf(x.id) }));
  writeFile(path.join(REV, "queue.json"), JSON.stringify({ round: A.round, created: new Date().toISOString(), pass_line: PASS_LINE, items: queue }, null, 1));
  const why = queue.reduce((m, q) => ((m[q.why] = (m[q.why] ?? 0) + 1), m), {});
  console.log(`${queue.length} answers queued for review: ${JSON.stringify(why)}`);
  console.log(`next: node scripts/review.mjs serve --round ${A.round}${A["rounds-dir"] ? ` --rounds-dir ${A["rounds-dir"]}` : ""}`);
}

function loadQueue() {
  const p = path.join(REV, "queue.json");
  if (!existsSync(p)) { console.error(`no ${p}; run review.mjs pick first`); process.exit(2); }
  return JSON.parse(readFileSync(p, "utf8")).items;
}

// ------------------------------------------------------------------ notes
if (cmd === "notes") {
  const labels = Object.values(latestLabels(path.join(REV, "owner-labels.jsonl"))).filter(l => String(l.note ?? "").trim());
  const L = [`# Owner notes for round ${A.round}`, "", "Group these into failure types with a count each, in failure-taxonomy.md. One note can belong to one type only: the first thing that went wrong. Kevin accepts or changes the groups.", ""];
  for (const l of labels) L.push(`- ${l.task} (${tasks[l.task]?.area}), act today: ${l.act ?? "n/a"}: ${String(l.note).trim()}`);
  writeFile(path.join(REV, "notes.md"), L.join("\n") + "\n");
  if (!existsSync(path.join(REV, "failure-taxonomy.md")))
    writeFile(path.join(REV, "failure-taxonomy.md"), `# Failure types, round ${A.round}\n\n| Failure type | Count | Areas | Example note |\n|---|---|---|---|\n`);
  console.log(`${labels.length} notes written to ${path.join(REV, "notes.md")}`);
}

// ------------------------------------------------------------------ serve
if (cmd === "serve") {
  const queue = loadQueue();
  const labelsFile = path.join(REV, "owner-labels.jsonl");
  const item = i => {
    const q = queue[i]; const t = tasks[q.task];
    const dir = path.join(RD, "runs", q.task, q.arm, q.run);
    const name = (personas[t.agent]?.name ?? "").split(" ")[0];
    const answer = scrub(readFileSync(path.join(dir, "answer.md"), "utf8"), [name, personas[t.agent]?.name]);
    let inputs = [];
    try { inputs = taskInputs(t).map(f => ({ name: path.basename(f), text: readFileSync(f, "utf8").slice(0, 20000) })); } catch { /* inputs moved */ }
    const meta = existsSync(path.join(dir, "meta.json")) ? JSON.parse(readFileSync(path.join(dir, "meta.json"), "utf8")) : {};
    const labels = latestLabels(labelsFile);
    const v = verdict(q.single), c = verdict(q.checker);
    return { i, total: queue.length, done: queue.filter(x => labels[x.id]).length, id: q.id, task: q.task, area: q.area,
      question: t.question, deliverable: t.deliverable, outcome: t.outcome, inputs, answer, asserts: meta.asserts ?? null,
      label: labels[q.id] ?? null,
      judge: labels[q.id] ? { grades: v?.grades ?? null, critique: v?.critique ?? v?.reasons ?? null, act: v?.would_act_on_it_today ?? null,
        checker: c ? { checks: c.checks, first_failure: c.first_failure ?? null } : null } : null };
  };
  const server = createServer((req, res) => {
    const send = (code, body, type = "application/json") => { res.writeHead(code, { "content-type": type, "cache-control": "no-store" }); res.end(typeof body === "string" ? body : JSON.stringify(body)); };
    const u = new URL(req.url, "http://127.0.0.1");
    if (req.method === "GET" && u.pathname === "/") return send(200, PAGE, "text/html; charset=utf-8");
    const m = /^\/api\/item\/(\d+)$/.exec(u.pathname);
    if (req.method === "GET" && m) { const i = Number(m[1]); return i >= 0 && i < queue.length ? send(200, item(i)) : send(404, { error: "no such item" }); }
    if (req.method === "POST" && u.pathname === "/api/label") {
      let body = ""; req.on("data", d => { body += d; if (body.length > 1e5) req.destroy(); });
      req.on("end", () => {
        try {
          const j = JSON.parse(body); const q = queue.find(x => x.id === j.id); if (!q) return send(400, { error: "unknown id" });
          const grades = Object.fromEntries(GRADES.map(g => [g, ["pass", "fail"].includes(j.grades?.[g]) ? j.grades[g] : "skip"]));
          const act = ["yes", "edits", "no"].includes(j.act) ? j.act : null;
          const rec = { id: q.id, round: A.round, task: q.task, arm: q.arm, run: q.run, single: q.single, checker: q.checker, split: q.split,
            grades, act, note: String(j.note ?? "").slice(0, 2000), labeler: "owner", pass_line: PASS_LINE, ts: new Date().toISOString() };
          appendFileSync(labelsFile, JSON.stringify(rec) + "\n");
          send(200, { ok: true });
        } catch (e) { send(400, { error: String(e.message) }); }
      });
      return;
    }
    send(404, { error: "not found" });
  });
  const port = Number(A.port ?? 5199);
  server.listen(port, "127.0.0.1", () => console.log(`review page: http://127.0.0.1:${port}  (${queue.length} answers; labels go to ${labelsFile}). Ctrl+C to stop.`));
}

const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Owner review</title><style>
:root{--bg:#fbfaf7;--fg:#1d1c1a;--muted:#6b675f;--line:#e2ded5;--pass:#1f7a4d;--fail:#b3261e;--card:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#161513;--fg:#ece9e2;--muted:#a19c91;--line:#34312c;--pass:#4fbf86;--fail:#ef7d74;--card:#1f1d1a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}
main{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:20px;max-width:1300px;margin:0 auto;padding:16px}
@media (max-width:900px){main{grid-template-columns:1fr}}
header{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:2}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:14px}
.ans h1,.ans h2,.ans h3{line-height:1.25;margin:1.1em 0 .4em}.ans table{border-collapse:collapse;display:block;overflow-x:auto}.ans td,.ans th{border:1px solid var(--line);padding:4px 8px}
details summary{cursor:pointer;color:var(--muted)}pre{white-space:pre-wrap;font-size:13px}
.grade{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--line)}
button{font:inherit;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;padding:6px 10px;cursor:pointer}
button.pass{border-color:var(--pass);color:var(--pass);font-weight:600}button.fail{border-color:var(--fail);color:var(--fail);font-weight:600}
.on{outline:2px solid currentColor}textarea{width:100%;min-height:90px;font:inherit;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--card);color:var(--fg)}
.muted{color:var(--muted);font-size:14px}aside{position:sticky;top:64px;align-self:start}
</style></head><body>
<header><strong>Owner review</strong><span id="prog" class="muted"></span></header>
<main><section><div class="card"><div class="muted" id="meta"></div><h2 id="q" style="margin:.2em 0"></h2><p id="deliv"></p>
<details><summary>What a good result does</summary><p id="outcome"></p></details><details><summary>Inputs the specialist had</summary><div id="inputs"></div></details></div>
<div class="card ans" id="answer"></div></section>
<aside><div class="card"><div class="muted">Pass means: I would accept this grade with light edits (${PASS_LINE} or more).</div><div id="grades"></div>
<p style="margin:.8em 0 .3em"><strong>Would you act on this today?</strong></p><div id="act"></div>
<p style="margin:.8em 0 .3em"><strong>First thing that went wrong</strong> <span class="muted">(one line, or blank)</span></p><textarea id="note"></textarea>
<div style="display:flex;gap:8px;margin-top:10px"><button id="prev">Back (k)</button><button id="save" class="pass">Save and next (Enter)</button><button id="next">Skip (j)</button></div>
<p class="muted">Keys: 1 to 7 flip a grade, y / e / n act today, / to the note.</p></div>
<div class="card" id="codechecks"></div><div class="card" id="judge" hidden></div></aside></main>
<script>
const G=${JSON.stringify(GRADES)},NAMES={on_brand:"1 On brand",principles:"2 Principles",logic:"3 Logic",backed:"4 Backed",outcome:"5 Outcome",actionable:"6 Actionable",insight:"7 Insight"};
let cur=null,state={};const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function md(src){const lines=esc(src).split(/\\r?\\n/);let out=[],list=null,tbl=null;const inl=s=>s.replace(/\\*\\*(.+?)\\*\\*/g,"<strong>$1</strong>").replace(/\`([^\`]+)\`/g,"<code>$1</code>");
const flush=()=>{if(list){out.push("</"+list+">");list=null}if(tbl){out.push("</table>");tbl=null}};
for(const l of lines){let m;if(/^\\|.*\\|\\s*$/.test(l)){if(/^\\|[\\s:|-]+\\|\\s*$/.test(l))continue;if(!tbl){flush();out.push("<table>");tbl=1}out.push("<tr>"+l.trim().slice(1,-1).split("|").map(c=>"<td>"+inl(c.trim())+"</td>").join("")+"</tr>");continue}
if(tbl){out.push("</table>");tbl=null}
if(m=/^(#{1,4})\\s+(.*)/.exec(l)){flush();out.push("<h"+(m[1].length+1)+">"+inl(m[2])+"</h"+(m[1].length+1)+">")}
else if(m=/^\\s*[-*]\\s+(.*)/.exec(l)){if(list!=="ul"){flush();out.push("<ul>");list="ul"}out.push("<li>"+inl(m[1])+"</li>")}
else if(m=/^\\s*\\d+\\.\\s+(.*)/.exec(l)){if(list!=="ol"){flush();out.push("<ol>");list="ol"}out.push("<li>"+inl(m[1])+"</li>")}
else if(/^&gt;\\s?/.test(l)){flush();out.push("<blockquote>"+inl(l.replace(/^&gt;\\s?/,""))+"</blockquote>")}
else if(!l.trim()){flush()}else{flush();out.push("<p>"+inl(l)+"</p>")}}flush();return out.join("\\n")}
function render(){const it=cur;$("prog").textContent=(it.i+1)+" of "+it.total+" ("+it.done+" labelled)";$("meta").textContent=it.task+" · "+it.area;
$("q").textContent="“"+it.question+"”";$("deliv").textContent=it.deliverable;$("outcome").textContent=it.outcome;
$("inputs").innerHTML=it.inputs.map(f=>"<details><summary>"+esc(f.name)+"</summary><pre>"+esc(f.text)+"</pre></details>").join("");
$("answer").innerHTML=md(it.answer);
$("grades").innerHTML=G.map((g,k)=>'<div class="grade"><span>'+NAMES[g]+'</span><span><button data-g="'+g+'" data-v="pass">Pass</button> <button data-g="'+g+'" data-v="fail">Fail</button></span></div>').join("");
$("act").innerHTML=["yes","edits","no"].map(v=>'<button data-act="'+v+'">'+({yes:"Yes (y)",edits:"With edits (e)",no:"No (n)"})[v]+"</button>").join(" ");
const a=it.asserts;$("codechecks").innerHTML="<strong>Code checks</strong><br>"+(a?Object.entries(a.checks).map(([k,c])=>(c.pass?"✓ ":"✗ ")+esc(k)+(c.pass?"":": "+esc(c.detail))).join("<br>")+"<br><span class=muted>"+Object.entries(a.advisory||{}).map(([k,c])=>esc(k)+": "+esc(c.detail)).join("<br>")+"</span>":"<span class=muted>not run</span>");
const j=it.judge;$("judge").hidden=!j;if(j){$("judge").innerHTML="<strong>Judge (shown after your label)</strong><br>"+(j.grades?G.map(g=>NAMES[g]+": "+j.grades[g]).join("<br>"):"no verdict")+"<br>Act today: "+esc(j.act)+(j.checker?"<br>Checker first failure: "+esc(j.checker.first_failure):"")+(j.critique?"<details><summary>Critique</summary><pre>"+esc(JSON.stringify(j.critique,null,1))+"</pre></details>":"")}
state=it.label?{grades:{...it.label.grades},act:it.label.act,note:it.label.note}:{grades:{},act:null,note:""};$("note").value=state.note||"";paint();window.scrollTo(0,0)}
function paint(){document.querySelectorAll("[data-g]").forEach(b=>{const on=state.grades[b.dataset.g]===b.dataset.v;b.className=on?b.dataset.v+" on":""});document.querySelectorAll("[data-act]").forEach(b=>b.className=state.act===b.dataset.act?"pass on":"")}
async function load(i){const r=await fetch("/api/item/"+i);if(r.ok){cur=await r.json();render()}}
async function save(){state.note=$("note").value;$("note").blur();const r=await fetch("/api/label",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:cur.id,...state})});if(r.ok)load(Math.min(cur.i+1,cur.total-1));else alert("Could not save: "+(await r.text()))}
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.g){state.grades[b.dataset.g]=state.grades[b.dataset.g]===b.dataset.v?undefined:b.dataset.v;paint()}else if(b.dataset.act){state.act=b.dataset.act;paint()}else if(b.id==="save")save();else if(b.id==="next")load(Math.min(cur.i+1,cur.total-1));else if(b.id==="prev")load(Math.max(cur.i-1,0))});
document.addEventListener("keydown",e=>{if(e.target.tagName==="TEXTAREA"){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();save()}if(e.key==="Escape")e.target.blur();return}
const k=e.key;if(/^[1-7]$/.test(k)){const g=G[k-1];state.grades[g]=state.grades[g]==="pass"?"fail":"pass";paint()}else if(k==="y"||k==="e"||k==="n"){state.act={y:"yes",e:"edits",n:"no"}[k];paint()}
else if(k==="/"){e.preventDefault();$("note").focus()}else if(k==="Enter"){save()}else if(k==="j"){load(Math.min(cur.i+1,cur.total-1))}else if(k==="k"){load(Math.max(cur.i-1,0))}});
load(0);
</script></body></html>`;
