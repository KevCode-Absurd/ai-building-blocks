// The pack linter: scripts/build-packs.mjs runs it on every pack it builds and stops on any problem. It catches the
// failures that made packs read as boilerplate (notes/diag-marketplace.md §2, §11): references to files the pack does
// not contain, the same limit set twice with different numbers, paragraphs repeated within a pack, and made-up
// example businesses. Pure: it reads only the built pack.
//
// The toolbox's library items (source "toolbox", toolbox/<type>/<slug>.md) are other people's methods about any
// subject, opened one at a time: they may name files of their own world and share the library's standard
// paragraphs, so the missing-file and repeated-paragraph rules skip them. toolbox.md itself is checked in full:
// every path it names must be in the pack.
import type { BuiltPack, PackFile } from "./build.ts";
import { TOOLBOX_WORD_BUDGET } from "./toolbox.ts";

export type LintRule = "missing_file" | "limit_conflict" | "repeated_paragraph" | "made_up_business" | "price_wording";
export interface LintIssue { rule: LintRule; file: string; message: string }
/** Things worth knowing that do not stop the build, such as a role whose toolbox is not curated yet. */
export type LintNoteRule = "no_toolbox" | "toolbox_left_out" | "toolbox_long";
export interface LintNote { rule: LintNoteRule; file: string; message: string }

/** Made-up firms that examples must never use (DESIGN.md hard rules). "Sprout Social" is a real company. */
export const MADE_UP_BUSINESSES: RegExp[] = [/\bSprout\b(?! Social)/, /\bHarbourside Pottery\b/, /\bTidewell\b/];
/** A paragraph this long, found twice in one pack, is boilerplate. */
export const MIN_REPEATED_PARAGRAPH = 120;

const NUMBER_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 };
const isScript = (p: string) => /\.(mjs|js)$/.test(p);

/** The files the agent reads as one text: what oneFileText holds (each SKILL.md is already in skills.md). */
function readSet(pack: BuiltPack): PackFile[] {
  const bundled = pack.files.some(f => f.path === "skills.md");
  return pack.files.filter(f => !["README.md", "CLAUDE.md", "CHANGELOG.md", "pack.json"].includes(f.path) && !isScript(f.path)
    && f.source !== "toolbox" && !(bundled && /^skills\/[^/]+\/SKILL\.md$/.test(f.path)));
}

/** Files the agent or the training coach writes while it works, so the pack rightly does not hold them. */
const CREATED_FILES = /^training\/(progress|results)\.md$/;

/** Root files of the pack layout: a reference to one of these must point at a file the pack has. */
const ROOT_FILES = /(?<![\w./-])(AGENTS\.md|WORK-METHOD\.md|QUALITY-METHOD\.md|OUTPUT-POLICY\.md|TEAM\.md|CLAUDE\.md|LICENSE\.md|CHANGELOG\.md|EXECUTION-PLAN\.json|JOB-CARD\.json|TEAM\.json|soul\.md|personality\.md|playbook\.md|knowledge\.md|access\.md|sources\.md|library\.md|skills\.md|toolbox\.md|instructions\.md|traction-playbook\.md)\b/g;
/** Pack folders: a path under one of these must exist. context/ holds the client's files, so only its README counts. */
const FOLDER_PATHS = /(?<![\w./-])((?:skills|prompts|workflows|training|tools|toolbox|channels|agents)\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*\.(?:md|json|mjs|js)|context\/README\.md)\b/g;

/**
 * Lines that may name a file the pack does not hold: a line that says so ("not in this pack"), or any line in a
 * section headed "Optional", which is for hosts that bring those files themselves.
 */
function exemptLines(text: string): Set<number> {
  const out = new Set<number>();
  let optional = false;
  text.split("\n").forEach((line, i) => {
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) optional = /^optional\b/i.test(h[2]);
    if (optional || /not in this pack|none of them is in this pack/i.test(line)) out.add(i);
  });
  return out;
}

function missingFiles(pack: BuiltPack): LintIssue[] {
  const have = new Set(pack.files.map(f => f.path));
  const issues: LintIssue[] = [];
  for (const f of pack.files) {
    if (isScript(f.path) || f.path === "pack.json" || f.source === "toolbox") continue;
    const exempt = exemptLines(f.content);
    const seen = new Set<string>();
    f.content.split("\n").forEach((line, i) => {
      if (exempt.has(i)) return;
      const refs = [...line.matchAll(ROOT_FILES)].map(m => m[1]);
      // Role kit files may name the client's own README, LICENSE or CHANGELOG; only the pack's own layout counts there.
      for (const m of line.matchAll(FOLDER_PATHS)) refs.push(m[1]);
      for (const ref of refs) {
        if (have.has(ref) || seen.has(ref)) continue;
        // A skill named by path is in the pack when skills/<name>/SKILL.md exists.
        if (/^skills\/[^/]+$/.test(ref.replace(/\/SKILL\.md$/, "")) && have.has(`${ref.replace(/\/SKILL\.md$/, "")}/SKILL.md`)) continue;
        if (/^examples\//.test(ref) || CREATED_FILES.test(ref)) continue;
        // A tool the pack lacks is fine when the file says where to get it (resolveToolRefs adds that note, after a
        // code span or below a fenced block).
        if (ref.startsWith("tools/") && f.content.includes(`/${ref}`) && /into a tools\/ folder first/.test(f.content)) continue;
        seen.add(ref);
        issues.push({ rule: "missing_file", file: f.path, message: `refers to ${ref}, which this pack does not contain` });
      }
    });
  }
  return issues;
}

/** "five questions at most", "at most 3 questions", "no more than two questions": the noun and the number. */
function limits(text: string): { noun: string; n: number; phrase: string }[] {
  const num = "(\\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve)";
  const noun = "(questions?|directions?|routes?|hypothes[ie]s|references?|options?|revision loops?|rounds of changes)";
  // "Up to 40 questions" describes the size of a deliverable (a quiz); only limits on what the agent asks count.
  const res = [
    new RegExp(`\\b${num}\\s+${noun}\\s+at most\\b`, "gi"),
    new RegExp(`\\b(?:at most|no more than|a maximum of)\\s+${num}\\s+${noun}\\b`, "gi"),
    new RegExp(`\\bask(?:s|ing)?\\s+up to\\s+${num}\\s+${noun}\\b`, "gi"),
    new RegExp(`\\b${num}\\s+${noun}\\s+or fewer\\b`, "gi"),
  ];
  const out: { noun: string; n: number; phrase: string }[] = [];
  for (const re of res) for (const m of text.matchAll(re)) {
    const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUMBER_WORDS[m[1].toLowerCase()];
    out.push({ noun: m[2].toLowerCase().replace(/(e?s)$/, "").replace(/hypothes[ie]/, "hypothes"), n, phrase: m[0] });
  }
  return out;
}

/**
 * Files the builder writes from templates and data (not a role kit's or mega kit's own files). A kit prompt may set
 * its own narrower limit for its task ("at most one question" before writing headlines); the platform text may not
 * contradict itself.
 */
function generated(pack: BuiltPack): PackFile[] {
  const jobSkills = new Set(pack.routes.filter(r => r.kind === "job").map(r => r.path));
  return pack.files.filter(f => !isScript(f.path) && f.path !== "skills.md" && f.path !== "pack.json"
    && (f.source === "agent" || f.source === "job" || f.source === "tools" || jobSkills.has(f.path)));
}

function limitConflicts(pack: BuiltPack): LintIssue[] {
  const byNoun = new Map<string, { n: number; file: string; phrase: string }[]>();
  // toolbox.md carries the curator's own "when" lines, which are a role kit's words like its skills and prompts.
  for (const f of generated(pack).filter(x => x.path !== "toolbox.md")) for (const l of limits(f.content)) {
    const list = byNoun.get(l.noun) ?? [];
    list.push({ n: l.n, file: f.path, phrase: l.phrase });
    byNoun.set(l.noun, list);
  }
  const issues: LintIssue[] = [];
  for (const [noun, list] of byNoun) {
    const values = [...new Set(list.map(l => l.n))];
    if (values.length < 2) continue;
    const where = list.map(l => `"${l.phrase}" in ${l.file}`).join("; ");
    issues.push({ rule: "limit_conflict", file: list[0].file, message: `sets the limit on ${noun}s to ${values.join(" and ")}: ${where}` });
  }
  return issues;
}

/** Blank-line separated blocks outside code fences, with whitespace collapsed. */
function paragraphs(md: string): string[] {
  const out: string[] = [];
  let fence = false, block: string[] = [];
  const flush = () => { if (block.length) out.push(block.join(" ").replace(/\s+/g, " ").trim()); block = []; };
  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; flush(); continue; }
    if (fence) continue;
    if (!line.trim() || /^#{1,6}\s/.test(line) || /^={5} FILE:/.test(line)) flush();
    else block.push(line);
  }
  flush();
  return out;
}

function repeatedParagraphs(pack: BuiltPack): LintIssue[] {
  const seen = new Map<string, string[]>();
  for (const f of readSet(pack)) {
    // toolbox.md is a list by task: two tasks may rightly name the same items in the same words.
    if (f.path === "toolbox.md") continue;
    for (const p of paragraphs(f.content)) {
      if (p.length < MIN_REPEATED_PARAGRAPH) continue;
      const where = seen.get(p) ?? [];
      where.push(f.path);
      seen.set(p, where);
    }
  }
  return [...seen].filter(([, where]) => where.length > 1).map(([p, where]) => ({
    rule: "repeated_paragraph" as const, file: where[0],
    message: `repeats a paragraph ${where.length} times (${[...new Set(where)].join(", ")}): "${p.slice(0, 90)}…"`,
  }));
}

function madeUpBusinesses(pack: BuiltPack): LintIssue[] {
  const issues: LintIssue[] = [];
  for (const f of pack.files) for (const re of MADE_UP_BUSINESSES) {
    const m = re.exec(f.content);
    if (m) issues.push({ rule: "made_up_business", file: f.path, message: `uses the made-up business "${m[0]}"; examples must use real, named businesses with public facts` });
  }
  return issues;
}

/** Packs are free: the builder's own files must not carry wording left from priced jobs. */
const PRICE_WORDING = /\bbase price\b/i;

function priceWording(pack: BuiltPack): LintIssue[] {
  return generated(pack).filter(f => PRICE_WORDING.test(f.content)).map(f => ({
    rule: "price_wording" as const, file: f.path,
    message: `says "${PRICE_WORDING.exec(f.content)![0]}"; packs are free, so say what one job covers instead`,
  }));
}

/** Every problem in one pack. An empty list means the pack is clean. */
export function lintPack(pack: BuiltPack): LintIssue[] {
  return [...missingFiles(pack), ...limitConflicts(pack), ...repeatedParagraphs(pack), ...madeUpBusinesses(pack), ...priceWording(pack)];
}

/** toolbox.md may run a little past its word budget; this far past it, the list needs trimming in toolbox.json. */
export const TOOLBOX_WORDS_WARN = Math.round(TOOLBOX_WORD_BUDGET * 1.2);

/**
 * Notes on one pack that never stop the build: its role has no curated toolbox yet (toolbox.md is then the plain
 * list of the pack's skills, and load_agent still routes requests by keyword), toolbox.json names items the build
 * could not ship, or toolbox.md is long. Agent packs only.
 */
export function lintNotes(pack: BuiltPack): LintNote[] {
  if (pack.kind !== "agent") return [];
  const role = pack.manifest.role ?? "(no role)";
  if (!pack.toolbox) return [{ rule: "no_toolbox", file: "toolbox.md", message: `${role}: no toolbox.json yet, so toolbox.md is the plain list of the pack's skills` }];
  const notes: LintNote[] = [];
  const { summary } = pack.toolbox;
  if (summary.left_out.length) notes.push({ rule: "toolbox_left_out", file: "toolbox.md", message: `${role}: ${summary.left_out.length} item(s) in toolbox.json could not be shipped (${summary.left_out.slice(0, 5).join(", ")}${summary.left_out.length > 5 ? ", ..." : ""})` });
  if (summary.words > TOOLBOX_WORDS_WARN) notes.push({ rule: "toolbox_long", file: "toolbox.md", message: `${role}: toolbox.md is ${summary.words} words before its "More" list; it aims for ${TOOLBOX_WORD_BUDGET}` });
  return notes;
}
