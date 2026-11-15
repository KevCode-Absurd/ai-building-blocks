#!/usr/bin/env node
// Builds a round: the run folders and prompts for each arm, then (after the runs) the blind judge sheets.
// Offline. It never calls a model; it writes the commands for you to run on the Claude plan.
//
//   node scripts/make-sheets.mjs prompts --round R1 [--tasks E01,E04] [--arms plain,chat,code] [--runs 3]
//        [--model opus] [--chat-max-chars 600000] [--packs <dir>] [--force] [--rounds-dir <dir>]
//   node scripts/make-sheets.mjs sheets  --round R1 [--seed 1] [--pairs code:plain,chat:plain,code:chat] [--allow-contaminated]
//   node scripts/make-sheets.mjs image-sheets --round R1 [--seed 1]
//
// prompts      writes rounds/<R>/runs/<task>/<arm>/r<k>/{PROMPT.md, inputs/, meta.json [, pack/ | pack.txt]},
//              rounds/<R>/run-arms.sh (claude -p, one run at a time, skips runs that have answer.md) and
//              rounds/<R>/RUNS.md (the same list for Claude Code subagents).
// sheets       reads every answer.md, scrubs it, and writes blind sheets under rounds/<R>/sheets/:
//              single/S-*.md (one answer), pairwise/P-*.md (A vs B, both orders, each a separate sheet) and
//              checker/C-*.md (one answer plus its key). The unblinding key goes to rounds/<R>/_key/blind-key.json.
//              It also writes run-judges.sh and JUDGES.md. Verdicts go to rounds/<R>/verdicts/<sheet id>.json.
// image-sheets after render-images.mjs, copies the images under neutral ids and writes one sheet per task.
import { existsSync, readFileSync, readdirSync, mkdirSync, copyFileSync, rmSync, statSync, renameSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { SUITE, REPO, ROUNDS, args, list, loadTasks, loadPersonas, taskInputs, copyInto, scrub, grades, rng, shuffle, newId,
  words, sha256File, sha256, keyLines, assertNoKey, writeFile, AGENT_ARMS } from "./lib.mjs";

const A = args();
const cmd = A._[0];
const round = A.round;
if (!["prompts", "sheets", "image-sheets"].includes(cmd) || !round) {
  console.error("usage: make-sheets.mjs prompts|sheets|image-sheets --round <name> [options]  (see the header of this file)");
  process.exit(2);
}
const RD = path.join(A["rounds-dir"] ? path.resolve(A["rounds-dir"]) : ROUNDS, round);
const allTasks = loadTasks();
const personas = loadPersonas();
const pick = list(A.tasks);
const tasks = pick.length ? allTasks.filter(t => pick.includes(t.id)) : allTasks;
const KEYLINES = keyLines(allTasks);
const rules = readFileSync(path.join(SUITE, "arms", "RULES-DELIVERABLE.md"), "utf8").trim();
const sh = s => `'${String(s).replace(/'/g, `'\\''`)}'`;

function inlineFiles(files) {
  return files.map(f => `\n\n----- FILE: ${path.basename(f)} -----\n\n${readFileSync(f, "utf8").trim()}`).join("");
}
function taskHeader(t) {
  return `## The owner's message\n\n> ${t.question}\n\n## What the owner expects\n\n${t.deliverable}\n`;
}

// ------------------------------------------------------------------ prompts
if (cmd === "prompts") {
  const arms = list(A.arms).length ? list(A.arms) : ["plain", "chat", "code"];
  const runs = Number(A.runs ?? 3);
  const model = A.model ?? "opus";
  const chatMax = Number(A["chat-max-chars"] ?? 600000);
  const packs = A.packs ? path.resolve(A.packs) : path.join(REPO, "marketplace", "dist", "packs");
  if (existsSync(path.join(RD, "runs")) && !A.force) { console.error(`${RD}/runs exists; pass --force to rebuild (answers in it would be deleted)`); process.exit(2); }
  if (A.force) rmSync(path.join(RD, "runs"), { recursive: true, force: true });
  const lines = ["#!/usr/bin/env bash", "# Runs every arm on the Claude plan. Never set ANTHROPIC_API_KEY: claude -p would bill the API.", "set -u", `cd "$(dirname "$0")"`, "unset ANTHROPIC_API_KEY", `SUITE=${sh(SUITE.split(path.sep).join("/"))}`, ""];
  const runList = [`# Runs for round ${round}`, "", "Give each line to a fresh Claude Code subagent: \"Your working folder is <folder>. Read PROMPT.md there and do exactly what it says. Do not read anything outside that folder.\" Save its final deliverable to <folder>/answer.md if it did not write it.", ""];
  let n = 0;
  for (const t of tasks) {
    const files = taskInputs(t);
    const persona = personas[t.agent] ?? {};
    const title = persona.title ?? t.agent;
    for (const arm of arms) for (let k = 1; k <= runs; k++) {
      const dir = path.join(RD, "runs", t.id, arm, `r${k}`);
      copyInto(files, path.join(dir, "inputs"));
      const meta = { round, task: t.id, arm, run: k, model, agent: t.agent, created: new Date().toISOString(), inputs: files.map(f => path.basename(f)) };
      let prompt, tools;
      if (arm === "plain") {
        prompt = `# Task\n\nYou are a senior ${title.toLowerCase()}. A store owner sent you the message below and the files in \`inputs/\`.\n\n${taskHeader(t)}\n## How to work\n\nRead every file in \`inputs/\` first. Then do the job.\n\n${rules}\n`;
        tools = "Read,Glob,Grep"; meta.disallowed = "Bash,Write,Edit,NotebookEdit,WebFetch,WebSearch,Task,Skill";
      } else if (arm === "chat") {
        const txt = path.join(packs, `${t.agent}.txt`);
        if (!existsSync(txt)) throw new Error(`missing one-file pack ${txt}`);
        meta.pack_file = path.basename(txt); meta.pack_sha256 = sha256File(txt);
        const packText = readFileSync(txt, "utf8");
        const base = `# Task\n\nYou are the specialist described in the instructions below. A store owner sent you the message below and attached their files.\n\n${taskHeader(t)}\n${rules}\n\n## The owner's files${inlineFiles(files)}\n`;
        if (packText.length + base.length <= chatMax) {
          meta.chat_mode = "inline"; tools = ""; meta.disallowed = "Bash,Read,Glob,Grep,Write,Edit,NotebookEdit,WebFetch,WebSearch,Task,Skill";
          prompt = `# Your instructions\n\n${packText}\n\n${base}`;
        } else {
          meta.chat_mode = "project"; tools = "Read,Grep"; meta.disallowed = "Bash,Glob,Write,Edit,NotebookEdit,WebFetch,WebSearch,Task,Skill";
          copyFileSync(txt, path.join(dir, "pack.txt"));
          prompt = `${base}\n## Your instructions\n\nYour instructions and knowledge are in \`pack.txt\` in this folder, like a chat project's attached knowledge. It is too long to read whole: search it and read the parts you need. Start with its opening sections (how you work), then the parts for this job. You cannot run code.\n`;
        }
      } else if (arm === "code") {
        const zip = path.join(packs, `${t.agent}.zip`);
        if (!existsSync(zip)) throw new Error(`missing pack zip ${zip}`);
        meta.pack_file = path.basename(zip); meta.pack_sha256 = sha256File(zip);
        const tmp = path.join(dir, "_unzip"); mkdirSync(tmp, { recursive: true });
        try { execFileSync("tar", ["-xf", zip, "-C", tmp], { stdio: "ignore" }); }
        catch { execFileSync("unzip", ["-q", zip, "-d", tmp], { stdio: "ignore" }); }
        const inner = readdirSync(tmp).length === 1 && statSync(path.join(tmp, readdirSync(tmp)[0])).isDirectory() ? path.join(tmp, readdirSync(tmp)[0]) : tmp;
        renameSync(inner, path.join(dir, "pack"));
        rmSync(tmp, { recursive: true, force: true });
        prompt = `# Task\n\nYou are taking part in a blind quality test as an AI Blocks agent. Your pack is \`pack/\`. Start with \`pack/CLAUDE.md\` and use the pack as your operating instructions: its method, its skills for this job, its knowledge and its node tools. You may read any file in \`pack/\` and \`inputs/\` and run the pack's node tools. Do not read anything outside this folder.\n\nA store owner sent you the message below and the files in \`inputs/\`.\n\n${taskHeader(t)}\n${rules}\n\nWrite the finished deliverable to \`answer.md\` in this folder, then reply with the same text.\n`;
        tools = "Read,Glob,Grep,Write,Edit,Bash(node:*)"; meta.disallowed = "WebFetch,WebSearch,Task,Skill";
      } else throw new Error(`unknown arm ${arm}`);
      assertNoKey(prompt, KEYLINES, `${t.id}/${arm}/r${k} prompt`);
      writeFile(path.join(dir, "PROMPT.md"), prompt);
      meta.prompt_chars = prompt.length; meta.tools = tools;
      writeFile(path.join(dir, "meta.json"), JSON.stringify(meta, null, 1));
      const rel = path.relative(RD, dir).split(path.sep).join("/");
      const toolFlag = (tools ? `--allowedTools ${sh(tools)} ` : "") + `--disallowedTools ${sh(meta.disallowed)}`;
      lines.push(`if [ ! -s ${sh(rel + "/answer.md")} ]; then echo "run ${rel}"; ( cd ${sh(rel)} && claude -p --model ${sh(model)} --strict-mcp-config --output-format stream-json --verbose ${toolFlag} < PROMPT.md > run.jsonl ); node "$SUITE/scripts/finish-run.mjs" ${sh(rel)}; fi`);
      runList.push(`- ${rel}`);
      n++;
    }
  }
  writeFile(path.join(RD, "run-arms.sh"), lines.join("\n") + "\n");
  writeFile(path.join(RD, "RUNS.md"), runList.join("\n") + "\n");
  const tasksText = readFileSync(path.join(SUITE, "TASKS.json"), "utf8");
  writeFile(path.join(RD, "round.json"), JSON.stringify({ round, created: new Date().toISOString(), model, arms, runs, tasks: tasks.map(t => t.id),
    tasks_sha256: sha256(tasksText), heldout_sha256: sha256(JSON.stringify(allTasks.filter(t => t.split === "heldout"))) }, null, 1));
  console.log(`${n} run folders under ${path.join(RD, "runs")}`);
  console.log(`next: bash ${path.join(RD, "run-arms.sh")}   (or give ${path.join(RD, "RUNS.md")} to subagents)`);
}

// ------------------------------------------------------------------ sheets
if (cmd === "sheets") {
  const r = rng(Number(A.seed ?? 20261115));
  const used = new Set();
  const pairs = (list(A.pairs).length ? list(A.pairs) : ["code:plain", "chat:plain", "code:chat"]).map(p => p.split(":"));
  const answers = {}; // task -> arm -> run -> {text, words}
  for (const t of tasks) {
    const tdir = path.join(RD, "runs", t.id); if (!existsSync(tdir)) continue;
    for (const arm of readdirSync(tdir)) for (const rk of readdirSync(path.join(tdir, arm))) {
      const f = path.join(tdir, arm, rk, "answer.md"); if (!existsSync(f)) continue;
      const raw = readFileSync(f, "utf8"); if (!raw.trim()) continue;
      const mp = path.join(tdir, arm, rk, "meta.json"), m = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : {};
      if (m.audit?.contaminated && !A["allow-contaminated"]) { console.log(`left out (contaminated): ${t.id}/${arm}/${rk} ${JSON.stringify(m.audit)}`); continue; }
      const name = (personas[t.agent]?.name ?? "").split(" ")[0];
      const text = scrub(raw, [name, personas[t.agent]?.name]);
      ((answers[t.id] ??= {})[arm] ??= {})[rk] = { text, words: words(text), scrubbed_chars: raw.length - text.length };
    }
  }
  rmSync(path.join(RD, "sheets"), { recursive: true, force: true });
  const key = { round, created: new Date().toISOString(), sheets: {} };
  const G = grades();
  const single = readFileSync(path.join(SUITE, "judge", "SINGLE.md"), "utf8");
  const pairwise = readFileSync(path.join(SUITE, "judge", "PAIRWISE.md"), "utf8");
  const checker = readFileSync(path.join(SUITE, "judge", "CHECKER.md"), "utf8");
  const jobs = [];
  const context = t => {
    const files = taskInputs(t);
    return `${taskHeader(t)}\n## What a good result does for this store (the outcome)\n\n${t.outcome}\n\n## Principle sets that apply\n\n${t.principles.join(", ")}. Judge by sound practice in these disciplines.\n\n## The inputs the specialist had${inlineFiles(files)}\n`;
  };
  for (const t of tasks) {
    const byArm = answers[t.id]; if (!byArm) continue;
    const ctx = context(t);
    // single-answer sheets and checker sheets, one per answer
    for (const arm of Object.keys(byArm)) for (const rk of Object.keys(byArm[arm])) {
      const a = byArm[arm][rk];
      const sid = newId("S", r, used);
      const s = `${single.replace(/{{GRADES}}/g, G).replace(/{{SHEET_ID}}/g, sid)}\n\n---\n\n# Task ${sid}\n\n${ctx}\n\n## The answer\n\n${a.text}\n`;
      assertNoKey(s, KEYLINES, `single ${sid}`);
      writeFile(path.join(RD, "sheets", "single", `${sid}.md`), s);
      key.sheets[sid] = { type: "single", task: t.id, split: t.split, area: t.area, arm, run: rk, words: a.words };
      jobs.push({ sid, dir: "single" });
      const cid = newId("C", r, used);
      const keyText = readFileSync(path.join(SUITE, "keys", `${t.id}.md`), "utf8");
      const c = `${checker.replace(/{{SHEET_ID}}/g, cid)}\n\n---\n\n# Task ${cid}\n\n${taskHeader(t)}\n## Job checks\n\n${t.checks.map((x, i) => `${i + 1}. ${x}`).join("\n")}\n\n## Known traps\n\n${t.traps.map(x => `- ${x}`).join("\n")}\n\n## Answer key\n\n${keyText}\n\n## The answer\n\n${a.text}\n`;
      writeFile(path.join(RD, "sheets", "checker", `${cid}.md`), c);
      key.sheets[cid] = { type: "checker", task: t.id, split: t.split, area: t.area, arm, run: rk };
      jobs.push({ sid: cid, dir: "checker" });
    }
    // pairwise sheets: run k of arm X vs run k of arm Y, in both orders, each a separate sheet
    for (const [x, y] of pairs) {
      if (!byArm[x] || !byArm[y]) continue;
      for (const rk of Object.keys(byArm[x])) {
        if (!byArm[y][rk]) continue;
        const orders = shuffle([[x, y], [y, x]], r);
        const ids = [];
        for (const [first, second] of orders) {
          const pid = newId("P", r, used); ids.push(pid);
          const s = `${pairwise.replace(/{{GRADES}}/g, G).replace(/{{SHEET_ID}}/g, pid)}\n\n---\n\n# Task ${pid}\n\n${ctx}\n\n## Answer A\n\n${byArm[first][rk].text}\n\n## Answer B\n\n${byArm[second][rk].text}\n`;
          assertNoKey(s, KEYLINES, `pairwise ${pid}`);
          writeFile(path.join(RD, "sheets", "pairwise", `${pid}.md`), s);
          key.sheets[pid] = { type: "pairwise", task: t.id, split: t.split, area: t.area, run: rk, A: first, B: second, pair: `${x}:${y}`,
            words: { [first]: byArm[first][rk].words, [second]: byArm[second][rk].words } };
          jobs.push({ sid: pid, dir: "pairwise" });
        }
        key.sheets[ids[0]].twin = ids[1]; key.sheets[ids[1]].twin = ids[0];
      }
    }
  }
  writeFile(path.join(RD, "_key", "blind-key.json"), JSON.stringify(key, null, 1));
  const order = shuffle(jobs, r);
  const jl = ["#!/usr/bin/env bash", "# One fresh claude -p per sheet, on the Claude plan. Judges may read only their sheet.", "set -u", `cd "$(dirname "$0")"`, "unset ANTHROPIC_API_KEY", "mkdir -p verdicts", ""];
  const md = [`# Judge jobs for round ${round}`, "", "Give each sheet to a fresh Claude subagent: \"Read <sheet> and follow it exactly. Write your JSON to <verdict>. Do not open any other file.\" Never show a judge the _key folder, the runs folder, TASKS.json or keys/.", ""];
  for (const j of order) {
    const sheet = `sheets/${j.dir}/${j.sid}.md`, out = `verdicts/${j.sid}.json`;
    jl.push(`if [ ! -s ${out} ]; then echo ${j.sid}; claude -p --model ${sh(A.model ?? "opus")} --strict-mcp-config --allowedTools 'Read' --disallowedTools 'Bash,Write,Edit,WebFetch,WebSearch,Task,Skill' "Read ${sheet} and follow it exactly. Reply with only the JSON it asks for." > ${out}.raw && node -e 'const fs=require("fs");const t=fs.readFileSync(process.argv[1],"utf8");const m=t.match(/\\{[\\s\\S]*\\}/);if(m)fs.writeFileSync(process.argv[2],m[0]);' ${out}.raw ${out}; fi`);
    md.push(`- ${sheet} -> ${out}`);
  }
  writeFile(path.join(RD, "run-judges.sh"), jl.join("\n") + "\n");
  writeFile(path.join(RD, "JUDGES.md"), md.join("\n") + "\n");
  const counts = Object.values(key.sheets).reduce((m, s) => ((m[s.type] = (m[s.type] ?? 0) + 1), m), {});
  console.log(`sheets: ${JSON.stringify(counts)}  (key kept in ${path.join(RD, "_key")})`);
  console.log(`next: bash ${path.join(RD, "run-judges.sh")}   then  node scripts/score.mjs --round ${round}`);
}

// ------------------------------------------------------------------ image-sheets
if (cmd === "image-sheets") {
  const r = rng(Number(A.seed ?? 20261116));
  const used = new Set();
  const idir = path.join(RD, "images");
  if (!existsSync(idir)) { console.error(`no images in ${idir}; run render-images.mjs first`); process.exit(2); }
  const keyPath = path.join(RD, "_key", "image-key.json");
  const key = { round, sheets: {}, images: {} };
  const tmpl = readFileSync(path.join(SUITE, "judge", "IMAGES.md"), "utf8");
  for (const t of tasks.filter(t => t.image_task)) {
    const tdir = path.join(idir, t.id); if (!existsSync(tdir)) continue;
    const imgs = [];
    for (const arm of readdirSync(tdir)) for (const f of readdirSync(path.join(tdir, arm))) if (/\.(png|jpe?g|webp)$/i.test(f)) imgs.push({ arm, file: path.join(tdir, arm, f) });
    const sid = newId("I", r, used);
    const sdir = path.join(RD, "sheets", "images", sid);
    rmSync(sdir, { recursive: true, force: true }); mkdirSync(sdir, { recursive: true });
    const listing = [];
    for (const im of shuffle(imgs, r)) {
      const iid = newId("IMG", r, used);
      copyFileSync(im.file, path.join(sdir, `${iid}${path.extname(im.file)}`));
      key.images[iid] = { task: t.id, arm: im.arm, source: path.relative(RD, im.file) };
      listing.push(`- ${iid}${path.extname(im.file)}`);
    }
    const org = readFileSync(path.join(SUITE, "brands", t.brand, "ORG-CONTEXT.md"), "utf8");
    const facts = taskInputs(t).filter(f => /product facts/i.test(f)).map(f => readFileSync(f, "utf8")).join("\n\n");
    const s = `${tmpl.replace(/{{SHEET_ID}}/g, sid)}\n\n---\n\n# Sheet ${sid}\n\n## The owner's message\n\n> ${t.question}\n\n## What a good result does\n\n${t.outcome}\n\n## Images in this folder\n\n${listing.join("\n")}\n\n## Product facts\n\n${facts}\n\n## Org context\n\n${org}\n`;
    writeFile(path.join(sdir, "SHEET.md"), s);
    key.sheets[sid] = { type: "images", task: t.id, split: t.split };
  }
  writeFile(keyPath, JSON.stringify(key, null, 1));
  console.log(`image sheets: ${Object.keys(key.sheets).length}; give each sheets/images/<id>/SHEET.md to a fresh judge that can open images; verdicts to verdicts/<id>.json`);
}
