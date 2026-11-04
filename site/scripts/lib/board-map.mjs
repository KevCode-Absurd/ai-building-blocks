// Puts every catalogue item, specialist and mini tool on the business boards (src/trust-pages/boards.mjs), at one
// stage of the journey. Pure functions: build-index uses boardsOf() for each item page's "For:" links, prerender
// uses mapAll() for the board pages, and tools/map-boards.mjs prints the review sheet.
//
// An entry is "made for" a board when its words say that kind of business, its task only fits there, or a hand fix
// in catalogue-items/boards.yaml adds it. It is "useful to any business" when its task is general business work.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { BOARDS, LIMITED_TASKS, MIXED_TASKS, NOT_FOR_OWNERS, STAGE_HINTS, STAGES, TASK_STAGE } from "../../src/trust-pages/boards.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const FIXES_FILE = path.join(ROOT, "catalogue-items", "boards.yaml");
const BOARD_IDS = new Set(BOARDS.map((b) => b.slug));
const STAGE_IDS = new Set(STAGES.map((s) => s.id));
// Business money items inside money-and-investing (valuing a business, a loan, fees); personal investing stays off.
// Names that belong to a trade with no board (building, law, hospitals, schools): they rank last as "any business".
const OTHER_TRADE = /\b(construction|building site|legal|law firm|lawyers?|clinical|hospital|pharma\w*|insurance|banking|government|public sector|school|capstone|students?|classroom|nonprofit|charity|grants?|mining|aviation|civil|structural|payroll|hotel|restaurant|catering|clinic|executive)\b/i;
const BUSINESS_MONEY = /\b(business|company|companies|cash|loans?|debt|revenue|profit|margins?|fees?|costs?|valuation|deals?|pricing|invoices?)\b/i;

/** The hand fixes: { add: {board: [slug]}, remove: {board: [slug]}, stage: {slug: stage}, off: [slug] }. Checked. */
export function readFixes(file = FIXES_FILE) {
  const raw = fs.existsSync(file) ? YAML.parse(fs.readFileSync(file, "utf8")) ?? {} : {};
  const fixes = { add: raw.add ?? {}, remove: raw.remove ?? {}, stage: raw.stage ?? {}, off: new Set(raw.off ?? []) };
  const problems = [];
  for (const k of ["add", "remove"]) for (const b of Object.keys(fixes[k])) if (!BOARD_IDS.has(b)) problems.push(`boards.yaml ${k}: unknown board "${b}"`);
  for (const [slug, st] of Object.entries(fixes.stage)) if (!STAGE_IDS.has(st)) problems.push(`boards.yaml stage: ${slug} has unknown stage "${st}"`);
  fixes.addOf = new Map(); fixes.removeOf = new Map();
  for (const [b, slugs] of Object.entries(fixes.add)) for (const s of slugs ?? []) fixes.addOf.set(s, [...(fixes.addOf.get(s) ?? []), b]);
  for (const [b, slugs] of Object.entries(fixes.remove)) for (const s of slugs ?? []) fixes.removeOf.set(s, [...(fixes.removeOf.get(s) ?? []), b]);
  return { fixes, problems };
}

/** The stage an entry sits at, from its task, moved by a word in its name for tasks that mix stages. */
export function stageOf(e, fixes) {
  if (fixes?.stage?.[e.slug]) return fixes.stage[e.slug];
  const base = TASK_STAGE[e.task];
  if (!base) return null;
  if (MIXED_TASKS.has(e.task)) for (const [st, re] of STAGE_HINTS) if (re.test(e.name ?? "")) return st;
  return base;
}

/**
 * Where one entry goes: { stage, made: [board slugs], general }. `e` has slug, name, summary, headline, cues, task,
 * category, type, and for specialists `extra` (keywords and deliverables).
 */
export function placeEntry(e, fixes) {
  const none = { stage: null, made: [], general: [] };
  if (e.type === "mind" || NOT_FOR_OWNERS.test(e.slug) || fixes?.off?.has(e.slug)) return none;
  if (e.task === "money-and-investing" && !BUSINESS_MONEY.test(`${e.name} ${e.summary ?? ""}`)) return none;
  const stage = stageOf(e, fixes);
  if (!stage) return none;
  const text = [e.name, e.headline, e.summary, ...(e.cues ?? []), e.extra ?? ""].join(" ");
  const byWords = BOARDS.filter((b) => b.words.test(text)).map((b) => b.slug);
  const byTask = BOARDS.filter((b) => b.tasks.includes(e.task)).map((b) => b.slug);
  // A task that fits a few boards: when the words pick one of them (an iPhone crash fix), keep just that one.
  const allowed = LIMITED_TASKS[e.task];
  const taskPicked = allowed ? byWords.filter((b) => allowed.includes(b)) : [];
  const byCategory = BOARDS.filter((b) => b.categories?.includes(e.category)).map((b) => b.slug);
  let made = new Set([...byWords, ...(taskPicked.length ? taskPicked : byTask), ...byCategory, ...(fixes?.addOf?.get(e.slug) ?? [])]);
  for (const b of fixes?.removeOf?.get(e.slug) ?? []) made.delete(b);
  made = BOARDS.map((b) => b.slug).filter((b) => made.has(b));
  // Useful to any business: every board, or only the boards its task allows.
  // A hand removal takes it off that board completely.
  const removed = fixes?.removeOf?.get(e.slug) ?? [];
  // An item whose words name one kind of business (a hotel booking checker) is not "any business" elsewhere.
  const general = byWords.length && !allowed ? [] : (allowed ?? BOARDS.map((b) => b.slug)).filter((b) => !removed.includes(b) && !made.includes(b));
  return { stage, made, general, byWords: byWords.filter((b) => made.includes(b)) };
}

const itemEntry = (b) => ({ slug: b.slug, name: b.name, summary: b.summary, headline: b.headline, cues: b.cues, task: b.task, category: b.category, type: b.type });
const roleEntry = (r) => ({ slug: `role:${r.id}`, id: r.id, name: r.name, summary: r.summary, task: r.family, type: "role", extra: [...(r.keywords ?? []), ...(r.deliverables ?? [])].join(" ") });
const toolEntry = (t) => ({ slug: `tool:${t.slug}`, name: t.name, summary: `${t.summary} ${t.headline ?? ""}`, type: "tool" });

/** A mini tool's stage: from its words, money when nothing else says. */
const toolStage = (t) => { for (const [st, re] of STAGE_HINTS) if (re.test(`${t.name} ${t.summary}`)) return st; return "money"; };

/** The boards an item is made for (its page shows these as "For:" links). */
export function boardsOf(item, fixes) {
  return placeEntry(itemEntry(item), fixes).made;
}

const kindOf = (b) => (b.type === "agent" ? "agent" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflow" : b.type === "prompt" ? "prompt" : "skill");

/**
 * Every board, stage by stage: { [board]: { [stage]: { made: [items], general: [items], roles: [...], tools: [...] } } },
 * plus counts and what went nowhere. Items keep their catalogue order inside each list, ranked by score.
 */
export function mapAll({ blocks, roles, tools, fixes }) {
  const boards = Object.fromEntries(BOARDS.map((b) => [b.slug, Object.fromEntries(STAGES.map((s) => [s.id, { made: [], general: [], roles: [], generalRoles: [], tools: [] }]))]));
  const unplaced = [];
  const boardOf = Object.fromEntries(BOARDS.map((b) => [b.slug, b]));
  const near = (board, e) => [...`${e.name} ${e.summary ?? ""}`.matchAll(new RegExp(board.near.source, "gi"))].length;
  const score = (board, e, p, b) => (p.byWords?.includes(board.slug) ? 100 : 40) + (b?.tested ? 10 : 0) + (kindOf(b ?? {}) === "workflow" ? 6 : kindOf(b ?? {}) === "agent" ? 3 : 0) + Math.min(5, near(board, e)) * 2;
  for (const b of blocks) {
    if (b.type === "mind" || b.headline === "") continue;
    const e = itemEntry(b), p = placeEntry(e, fixes);
    if (!p.stage) { unplaced.push(b.slug); continue; }
    for (const slug of BOARDS.map((x) => x.slug)) {
      const at = boards[slug][p.stage];
      if (p.made.includes(slug)) at.made.push({ ...b, kind: kindOf(b), score: score(boardOf[slug], e, p, b) });
      else if (p.general.includes(slug)) at.general.push({ ...b, kind: kindOf(b), score: score(boardOf[slug], e, p, b) - 40 - (OTHER_TRADE.test(b.name) ? 30 : 0) });
    }
  }
  for (const r of roles) {
    const e = roleEntry(r), p = placeEntry(e, fixes);
    if (!p.stage) { unplaced.push(e.slug); continue; }
    for (const slug of BOARDS.map((x) => x.slug)) {
      const at = boards[slug][p.stage];
      const s = score(boardOf[slug], e, p, null);
      if (p.made.includes(slug)) at.roles.push({ ...r, score: s }); else if (p.general.includes(slug) && near(boardOf[slug], e) >= 2 && !OTHER_TRADE.test(r.name)) at.generalRoles.push({ ...r, score: s - 40 }); // a general specialist must sound close to the board
    }
  }
  for (const t of tools) {
    const e = toolEntry(t), stage = toolStage(t);
    const ecommerceShelf = t.shelf?.includes("ecommerce");
    const words = BOARDS.filter((b) => b.words.test(`${t.name} ${t.summary}`)).map((b) => b.slug);
    for (const board of BOARDS) {
      const listed = board.tools.includes(t.slug);
      const fits = listed || words.includes(board.slug) || (ecommerceShelf && ["ecommerce", "amazon-sellers", "wholesale-and-brands"].includes(board.slug)) || (Array.isArray(t.shelf) && !ecommerceShelf && t.category !== "personal" && t.category !== "design");
      if (fits) boards[board.slug][stage].tools.push({ ...t, score: (listed ? 100 : words.includes(board.slug) ? 60 : 0) + (stage === "money" ? 0 : 5), made: listed || words.includes(board.slug) });
    }
    void e;
  }
  const byScore = (a, z) => z.score - a.score || String(a.name).localeCompare(String(z.name));
  for (const st of Object.values(boards)) for (const at of Object.values(st)) for (const k of Object.keys(at)) at[k].sort(byScore);
  return { boards, unplaced };
}

export { STAGES, BOARDS, kindOf };
