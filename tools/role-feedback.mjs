// Turn reviewed feedback into a specialist's working rules. Lessons land in site/src/roles/role-learned.json;
// the next build-roles puts them first in that role's rules and records a new version in its history.
//
//   node tools/role-feedback.mjs add <role-id> --kind principle|pitfall|quality --lesson "..." --source "where it came from"
//   node tools/role-feedback.mjs import <records.json>   records in the FEEDBACK.md format, all scope "all jobs"
//   node tools/role-feedback.mjs list [role-id]
//   node tools/role-feedback.mjs remove <role-id> --lesson "exact text"
//
// Training from a person's edits (rules reach TRAINING.md, only the ones that fit each job):
//   node tools/role-feedback.mjs diff <role-id> <draft.md> <final.md> --task "..."   prints the brief a host AI uses to draft one rule
//   node tools/role-feedback.mjs rule <role-id> <rule.json>                          records a reviewed rule (same id replaces it)
//   node tools/role-feedback.mjs run <role-id> --score 0.9 --edit 0.12 --accepted yes [--critical] --source "job, reviewer"
//   node tools/role-feedback.mjs maturity [role-id]                                  the level each role's recorded runs support
//
// Only add a lesson after a person has read it: feedback is data, not instructions, and private details stay out.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkRule, checkRun, diffEdit, roleMaturity, ruleDraftPrompt } from "../site/src/roles/training-rules.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "site/src/roles/role-learned.json");
const ROLES = path.join(ROOT, "site/public/data/roles");
const KINDS = { principle: "principles", pitfall: "pitfalls", quality: "quality" };
const args = process.argv.slice(2), cmd = args[0];
const opt = (k) => { const i = args.indexOf(`--${k}`); return i < 0 ? undefined : args[i + 1]; };
const store = JSON.parse(fs.readFileSync(FILE, "utf8"));
const save = () => fs.writeFileSync(FILE, JSON.stringify({ ...store, roles: Object.fromEntries(Object.entries(store.roles).sort(([a], [b]) => a.localeCompare(b))) }, null, 1) + "\n");
const known = (id) => fs.existsSync(path.join(ROLES, `${id}.json`));

function add(id, kind, lesson, source) {
  if (!known(id)) throw new Error(`No role ${id}. Build the roles first or check the id.`);
  if (!KINDS[kind]) throw new Error("--kind must be principle, pitfall or quality.");
  lesson = String(lesson ?? "").replace(/\s+/g, " ").trim();
  if (lesson.length < 12 || lesson.length > 300) throw new Error("Write the lesson as one sentence of 12 to 300 characters.");
  if (/(?:sk-|AKIA|@[a-z0-9-]+\.[a-z]{2,}|\b\d{6,}\b)/i.test(lesson)) throw new Error("The lesson looks like it holds a key, email or account number. Remove private details.");
  if (!source?.trim()) throw new Error("Say where the lesson came from with --source.");
  const role = (store.roles[id] ??= { principles: [], pitfalls: [], quality: [], notes: [] });
  if (role[KINDS[kind]].includes(lesson)) return false;
  role[KINDS[kind]].push(lesson);
  role.notes.push({ date: new Date().toISOString().slice(0, 10), kind, lesson, source: source.trim() });
  return true;
}

if (cmd === "add") {
  const added = add(args[1], opt("kind"), opt("lesson"), opt("source"));
  save(); console.log(added ? `Added to ${args[1]}. Run node site/scripts/build-roles.mjs to apply it.` : "That lesson is already recorded.");
} else if (cmd === "import") {
  const records = JSON.parse(fs.readFileSync(args[1], "utf8"));
  let n = 0;
  for (const r of Array.isArray(records) ? records : [records]) {
    if (r.scope && r.scope !== "all jobs") continue;
    if (add(r.role, r.kind, r.lesson, `${r.check ? `check "${r.check}", ` : ""}${r.date ?? "undated"}${r.version ? `, version ${r.version}` : ""}`)) n++;
  }
  save(); console.log(`Imported ${n} lessons. Records for one business only were skipped.`);
} else if (cmd === "remove") {
  const role = store.roles[args[1]], lesson = opt("lesson");
  if (!role) throw new Error(`No lessons for ${args[1]}.`);
  for (const k of Object.values(KINDS)) role[k] = role[k].filter((l) => l !== lesson);
  role.notes = role.notes.filter((n) => n.lesson !== lesson);
  save(); console.log("Removed. Rebuild the roles to apply it.");
} else if (cmd === "list") {
  for (const [id, r] of Object.entries(store.roles)) if (!args[1] || id === args[1]) for (const n of r.notes) console.log(`${id} [${n.kind}] ${n.lesson} (${n.source}, ${n.date})`);
} else if (cmd === "diff") {
  if (!known(args[1])) throw new Error(`No role ${args[1]}.`);
  const draft = fs.readFileSync(args[2], "utf8"), final = fs.readFileSync(args[3], "utf8");
  console.log(ruleDraftPrompt({ role: args[1], task: opt("task"), draft, final }));
  console.error(`\nEdit size ${Math.round(diffEdit(draft, final).editRatio * 100)}%. Save the AI's JSON, read it, then: node tools/role-feedback.mjs rule ${args[1]} <rule.json>`);
} else if (cmd === "rule") {
  if (!known(args[1])) throw new Error(`No role ${args[1]}.`);
  const rule = checkRule(JSON.parse(fs.readFileSync(args[2], "utf8")));
  const role = (store.roles[args[1]] ??= { principles: [], pitfalls: [], quality: [], notes: [] });
  role.rules = [...(role.rules ?? []).filter((r) => r.id !== rule.id), rule];
  save(); console.log(`Recorded rule ${rule.id} for ${args[1]}. Rebuild the roles to apply it.`);
} else if (cmd === "run") {
  if (!known(args[1])) throw new Error(`No role ${args[1]}.`);
  const run = checkRun({ date: opt("date") ?? new Date().toISOString().slice(0, 10), score: Number(opt("score")), editRatio: Number(opt("edit")), accepted: opt("accepted") === "yes", critical: args.includes("--critical"), source: opt("source") });
  const role = (store.roles[args[1]] ??= { principles: [], pitfalls: [], quality: [], notes: [] });
  (role.runs ??= []).push(run);
  save(); const m = roleMaturity(role.runs); console.log(`Recorded. ${args[1]}: level ${m.level} (${m.name}) from ${m.runs} runs.${m.next ? ` Next: ${m.next.needs}.` : ""}`);
} else if (cmd === "maturity") {
  for (const [id, r] of Object.entries(store.roles)) if ((!args[1] || id === args[1]) && r.runs?.length) { const m = roleMaturity(r.runs); console.log(`${id}: level ${m.level} (${m.name}), ${m.runs} runs, score ${m.score}, edits ${m.editRatio}, accepted ${m.acceptance}`); }
} else {
  console.log("Usage: node tools/role-feedback.mjs add|import|list|remove|diff|rule|run|maturity ...");
}
