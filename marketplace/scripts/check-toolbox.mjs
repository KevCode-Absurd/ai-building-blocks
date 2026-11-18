// Checks every role kit's toolbox.json (marketplace/packs/roles/<role-id>/toolbox.json) against the toolbox spec:
// the shape and field limits, that every kit: ref is a file in that kit and every library: slug is a real item of
// the stated type that is not quarantined, that every kit skill, prompt and workflow is used in a task, the task and
// item counts, helper role ids and duplicate task ids. Run from the repo root:
//
//   node marketplace/scripts/check-toolbox.mjs                  every role that has a toolbox.json
//   node marketplace/scripts/check-toolbox.mjs --role <role-id> one role
//   node marketplace/scripts/check-toolbox.mjs --require-all    a role with no toolbox.json is an error too
//
// Errors exit 1. Softer things are warnings and exit 0: fewer than 30 library items, more than 6 minds, and a task
// that makes something a buyer sees with no explore or check item and no gap written for it.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ITEM_TYPES, kitItems, libraryTypes, MARKETPLACE, roleIds } from "./toolbox-candidates.mjs";

export const SCHEMA = "ai-blocks-toolbox/1";
export const KINDS = ["web_page", "ad_creative", "copy", "email", "audit", "analysis", "strategy", "plan", "code", "ops_doc", "other"];
export const USES = ["brief", "explore", "build", "check", "think"];
export const LIMITS = { tasks: [10, 24], items: [2, 7], always: [0, 6], helpers: [2, 6], library: [30, 70], minds: 6, task: 70, when: 120 };
/** Kinds whose result a buyer sees. A design, video or deck has no kind of its own, so "other" counts when the task builds something. */
const BUYER_FACING = new Set(["web_page", "ad_creative", "copy", "email"]);
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KIT_REF = /^kit:(skills|prompts|workflows)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NOT_A_VERB = /^(?:a|an|the|how|when|what|why|for|to|my|our|your|this|that|some|any|all|new)$/i;
const length = text => [...text].length;
const isObject = v => v !== null && typeof v === "object" && !Array.isArray(v);
const text = v => typeof v === "string" && v.trim().length > 0;

/**
 * Checks one parsed toolbox.json. `ctx`:
 *   roleId    the kit folder's name
 *   kitRefs   every kit: ref the kit really has (kit:skills/x, kit:prompts/y, kit:workflows/z)
 *   roleIds   every role id in packs/roles
 *   typesOf   slug => the library types that slug exists as ([] when it does not exist)
 *   quarantined  slugs left out of the library for safety
 */
export function validateToolbox(box, ctx) {
  const errors = [], warnings = [];
  const stats = { tasks: 0, library: 0, minds: 0, kitUsed: 0, kitTotal: ctx.kitRefs.size, helpers: 0, gaps: 0 };
  if (!isObject(box)) return { errors: ["toolbox.json must hold one object"], warnings, stats };
  const known = new Set(["schema", "role", "reviewed", "tasks", "always", "helpers", "gaps"]);
  for (const key of Object.keys(box)) if (!known.has(key)) errors.push(`unknown field "${key}"`);
  if (box.schema !== SCHEMA) errors.push(`schema must be "${SCHEMA}"`);
  if (box.role !== ctx.roleId) errors.push(`role must be "${ctx.roleId}", the kit folder's name`);
  if (typeof box.reviewed !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(box.reviewed) || Number.isNaN(Date.parse(box.reviewed)) || new Date(box.reviewed).toISOString().slice(0, 10) !== box.reviewed) errors.push("reviewed must be a real date written YYYY-MM-DD");

  const library = new Map(); // "type:slug" -> where it was first used
  const kitInTasks = new Set();
  const quarantined = ctx.quarantined ?? new Set();

  /** One item row, in a task or in `always`. Returns its ref when the row is well formed. */
  const checkItem = (item, at) => {
    if (!isObject(item)) { errors.push(`${at}: must be an object with ref, use and when`); return null; }
    for (const key of Object.keys(item)) if (!["ref", "type", "use", "when"].includes(key)) errors.push(`${at}: unknown field "${key}"`);
    if (!USES.includes(item.use)) errors.push(`${at}: use must be one of ${USES.join(", ")}`);
    if (!text(item.when)) errors.push(`${at}: needs a "when" line`);
    else {
      if (length(item.when) > LIMITS.when) errors.push(`${at}: "when" is ${length(item.when)} characters; the limit is ${LIMITS.when}`);
      if (/\b(?:kit|library):/.test(item.when)) errors.push(`${at}: "when" must not name a ref; say the situation in plain words`);
    }
    if (typeof item.ref !== "string") { errors.push(`${at}: needs a "ref"`); return null; }
    if (item.ref.startsWith("kit:")) {
      if (item.type !== undefined) errors.push(`${at}: a kit ref takes no "type"`);
      if (!KIT_REF.test(item.ref)) errors.push(`${at}: "${item.ref}" must look like kit:skills/<name>, kit:prompts/<name> or kit:workflows/<name>, with no file extension`);
      else if (!ctx.kitRefs.has(item.ref)) errors.push(`${at}: "${item.ref}" is not in this kit`);
      return item.ref;
    }
    if (!item.ref.startsWith("library:") || !KEBAB.test(item.ref.slice(8))) { errors.push(`${at}: "${item.ref}" must be kit:<path> or library:<slug>`); return null; }
    const slug = item.ref.slice(8);
    if (!ITEM_TYPES.includes(item.type)) errors.push(`${at}: a library ref needs a "type": one of ${ITEM_TYPES.join(", ")}`);
    const types = ctx.typesOf(slug);
    if (quarantined.has(slug)) errors.push(`${at}: "${slug}" is quarantined and must not be used`);
    else if (!types.length) errors.push(`${at}: no library item has the slug "${slug}"`);
    else if (ITEM_TYPES.includes(item.type) && !types.includes(item.type)) errors.push(`${at}: "${slug}" is a ${types.join(" and a ")}, not a ${item.type}`);
    if (item.type === "mind" && USES.includes(item.use) && item.use !== "think") warnings.push(`${at}: a mind is a lens, so its use is normally "think"`);
    if (text(item.when) && slug.includes("-") && item.when.toLowerCase().includes(slug)) warnings.push(`${at}: "when" repeats the slug; say what the item gives in plain words`);
    if (!library.has(`${item.type}:${slug}`)) library.set(`${item.type}:${slug}`, at);
    return item.ref;
  };
  const checkRows = (rows, at, [min, max], what) => {
    if (!Array.isArray(rows)) { errors.push(`${at} must be a list`); return []; }
    if (rows.length < min || rows.length > max) errors.push(`${at} has ${rows.length} ${what}; the spec asks for ${min} to ${max}`);
    const refs = rows.map((item, i) => checkItem(item, `${at} item ${i + 1}`));
    const seen = new Set();
    for (const ref of refs) { if (ref && seen.has(ref)) errors.push(`${at}: "${ref}" is listed twice`); if (ref) seen.add(ref); }
    return rows;
  };

  const ids = new Set(), holes = [];
  if (!Array.isArray(box.tasks)) errors.push("tasks must be a list");
  else {
    stats.tasks = box.tasks.length;
    if (box.tasks.length < LIMITS.tasks[0] || box.tasks.length > LIMITS.tasks[1]) errors.push(`${box.tasks.length} tasks; the spec asks for ${LIMITS.tasks[0]} to ${LIMITS.tasks[1]}`);
    box.tasks.forEach((task, i) => {
      const at = `task ${i + 1}${isObject(task) && typeof task.id === "string" ? ` (${task.id})` : ""}`;
      if (!isObject(task)) { errors.push(`${at}: must be an object`); return; }
      for (const key of Object.keys(task)) if (!["id", "task", "kind", "foundation_kind", "items"].includes(key)) errors.push(`${at}: unknown field "${key}"`);
      if (typeof task.id !== "string" || !KEBAB.test(task.id)) errors.push(`${at}: id must be kebab-case`);
      else if (ids.has(task.id)) errors.push(`${at}: the id "${task.id}" is used twice`);
      else ids.add(task.id);
      if (!text(task.task)) errors.push(`${at}: needs a "task" line`);
      else {
        if (length(task.task) > LIMITS.task) errors.push(`${at}: "task" is ${length(task.task)} characters; the limit is ${LIMITS.task}`);
        const first = task.task.trim().split(/\s+/)[0];
        if (NOT_A_VERB.test(first) || /ing$/i.test(first) || !/^[A-Z]/.test(first)) warnings.push(`${at}: "task" should start with a verb, such as "Make", "Check" or "Plan" (it starts "${first}")`);
      }
      if (!KINDS.includes(task.kind)) errors.push(`${at}: kind must be one of ${KINDS.join(", ")}`);
      if (task.foundation_kind !== undefined && (!['support', 'proposal'].includes(task.foundation_kind) || !['copy', 'email'].includes(task.kind))) errors.push(`${at}: foundation_kind must be support or proposal on a copy or email task`);
      const rows = checkRows(task.items, at, LIMITS.items, "items");
      for (const item of rows) if (isObject(item) && typeof item.ref === "string" && item.ref.startsWith("kit:")) kitInTasks.add(item.ref);
      const uses = new Set(rows.filter(isObject).map(item => item.use));
      if (BUYER_FACING.has(task.kind) || task.kind === "other" && uses.has("build")) {
        const lacks = ["explore", "check"].filter(use => !uses.has(use));
        if (lacks.length) holes.push(`${task.id ?? i + 1} (no ${lacks.join(" or ")})`);
      }
    });
  }
  // A kit item listed only under "always" does not count as used: the spec asks for each one in a task.
  if (box.always !== undefined) checkRows(box.always, "always", LIMITS.always, "items");

  if (!Array.isArray(box.helpers)) errors.push("helpers must be a list");
  else {
    stats.helpers = box.helpers.length;
    if (box.helpers.length < LIMITS.helpers[0] || box.helpers.length > LIMITS.helpers[1]) errors.push(`${box.helpers.length} helpers; the spec asks for ${LIMITS.helpers[0]} to ${LIMITS.helpers[1]}`);
    const seen = new Set();
    box.helpers.forEach((helper, i) => {
      const at = `helper ${i + 1}`;
      if (!isObject(helper)) { errors.push(`${at}: must be an object with role and when`); return; }
      for (const key of Object.keys(helper)) if (!["role", "when"].includes(key)) errors.push(`${at}: unknown field "${key}"`);
      if (typeof helper.role !== "string" || !ctx.roleIds.has(helper.role)) errors.push(`${at}: "${helper.role}" is not a role id in packs/roles`);
      else if (helper.role === ctx.roleId) errors.push(`${at}: a role cannot be its own helper`);
      else if (seen.has(helper.role)) errors.push(`${at}: "${helper.role}" is listed twice`);
      seen.add(helper.role);
      if (!text(helper.when)) errors.push(`${at}: needs a "when" line`);
      else if (length(helper.when) > LIMITS.when) errors.push(`${at}: "when" is ${length(helper.when)} characters; the limit is ${LIMITS.when}`);
    });
  }

  if (!Array.isArray(box.gaps)) errors.push("gaps must be a list (it may be empty)");
  else {
    stats.gaps = box.gaps.length;
    box.gaps.forEach((gap, i) => { if (!text(gap)) errors.push(`gap ${i + 1}: must be a plain sentence`); });
  }

  const unused = [...ctx.kitRefs].filter(ref => !kitInTasks.has(ref)).sort();
  stats.kitUsed = ctx.kitRefs.size - unused.length;
  if (unused.length) errors.push(`kit items used in no task: ${unused.join(", ")}`);
  stats.library = library.size;
  stats.minds = [...library.keys()].filter(key => key.startsWith("mind:")).length;
  if (stats.library > LIMITS.library[1]) errors.push(`${stats.library} distinct library items; the limit is ${LIMITS.library[1]}`);
  else if (stats.library < LIMITS.library[0]) warnings.push(`${stats.library} distinct library items; the spec asks for ${LIMITS.library[0]} to ${LIMITS.library[1]}. Fine only if the library truly has fewer good fits and gaps says so`);
  if (stats.minds > LIMITS.minds) warnings.push(`${stats.minds} minds; the spec asks for at most ${LIMITS.minds}`);
  if (holes.length > stats.gaps) warnings.push(`${holes.length} tasks that make something a buyer sees lack an explore or check item, but only ${stats.gaps} gaps are written: ${holes.join(", ")}. Add the item, or write a gap for each`);
  return { errors, warnings, stats };
}

/** Reads and checks one role's toolbox.json. Returns null when the role has none. `library` is libraryTypes(). */
export function checkRole(roleId, { packs = path.join(MARKETPLACE, "packs"), library, allRoleIds } = {}) {
  const kitDir = path.join(packs, "roles", roleId), file = path.join(kitDir, "toolbox.json");
  if (!existsSync(file)) return null;
  let box;
  try { box = JSON.parse(readFileSync(file, "utf8").replace(/^﻿/, "")); } catch (e) {
    return { errors: [`toolbox.json is not valid JSON (${e.message})`], warnings: [], stats: { tasks: 0, library: 0, minds: 0, kitUsed: 0, kitTotal: 0, helpers: 0, gaps: 0 } };
  }
  return validateToolbox(box, {
    roleId, kitRefs: new Set(kitItems(kitDir).map(k => k.ref)), roleIds: new Set(allRoleIds ?? roleIds(packs)),
    typesOf: slug => library.types.get(slug) ?? [], quarantined: library.quarantined,
  });
}

export function checkAll({ packs = path.join(MARKETPLACE, "packs"), catalogue, only, requireAll = false } = {}) {
  const all = roleIds(packs);
  if (only && !all.includes(only)) return { lines: [], missing: [], checked: 0, failed: 1, errors: 1, warnings: 0, fatal: `"${only}" is not a role id in packs/roles` };
  const targets = only ? [only] : all, withFile = targets.filter(id => existsSync(path.join(packs, "roles", id, "toolbox.json")));
  const library = withFile.length ? libraryTypes(catalogue) : null;
  const out = { lines: [], missing: targets.filter(id => !withFile.includes(id)), checked: withFile.length, failed: 0, errors: 0, warnings: 0 };
  for (const id of withFile) {
    const { errors, warnings, stats } = checkRole(id, { packs, library, allRoleIds: all });
    out.errors += errors.length; out.warnings += warnings.length; if (errors.length) out.failed++;
    out.lines.push(`${errors.length ? "FAIL" : warnings.length ? "warn" : "ok  "} ${id}: ${stats.tasks} tasks, ${stats.library} library items (${stats.minds} minds), ${stats.kitUsed}/${stats.kitTotal} kit items used, ${stats.helpers} helpers, ${stats.gaps} gaps` +
      `${errors.length ? `, ${errors.length} errors` : ""}${warnings.length ? `, ${warnings.length} warnings` : ""}`, ...errors.map(e => `       error: ${e}`), ...warnings.map(w => `       warning: ${w}`));
  }
  if (requireAll && out.missing.length) { out.errors += out.missing.length; out.failed += out.missing.length; }
  return out;
}

function main(argv) {
  let only, requireAll = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--require-all") requireAll = true;
    else if (argv[i] === "--role" && argv[i + 1]) only = argv[++i];
    else if (argv[i].startsWith("--role=")) only = argv[i].slice(7);
    else { console.error(`check-toolbox: unexpected argument "${argv[i]}". Use --role <id> and --require-all.`); return 1; }
  }
  const result = checkAll({ only, requireAll });
  if (result.fatal) { console.error(`check-toolbox: ${result.fatal}`); return 1; }
  for (const line of result.lines) console.log(line);
  if (result.missing.length) console.log(`${requireAll ? "FAIL" : "    "} missing (${result.missing.length}): ${result.missing.join(", ")}`);
  console.log(`check-toolbox: ${result.checked} checked, ${result.checked - (result.failed - (requireAll ? result.missing.length : 0))} ok, ${result.missing.length} missing; ${result.errors} errors, ${result.warnings} warnings`);
  return result.errors ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv.slice(2)));
