// Map persona outcomes to catalogue job types.
// Every persona outcome with job_type_id null is scored against every job type in src/modules/catalogue/data/*.json,
// using its job_type_hint, title and deliverable against each job type's id, title, keywords, summary and deliverable.
// Scoring is deterministic (IDF-weighted word coverage, led by the hint), so the same data gives the same table.
//
//   node scripts/map-outcomes.mjs                    review table: every unmapped outcome, its best job type and score
//   node scripts/map-outcomes.mjs --write            also set job_type_id in the persona files for matches over the threshold
//   node scripts/map-outcomes.mjs --threshold 0.55   change the threshold (default 0.6; lower maps more, with more wrong matches)
//   node scripts/map-outcomes.mjs --only nova-seo,ada-content    some personas only
//   node scripts/map-outcomes.mjs --skipped          list only the outcomes below the threshold
//   node scripts/map-outcomes.mjs --json             machine-readable results instead of the table
//
// Reads every src/modules/directory/data/personas-*.json. --write keeps the files' formatting (2-space JSON, same line
// endings, same final newline) and touches only job_type_id. Outcomes that already have a job_type_id are never changed;
// ids that are not in the catalogue are listed as warnings.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, "..");
export const PERSONA_DIR = path.join(ROOT, "src/modules/directory/data");
export const CATALOGUE_DIR = path.join(ROOT, "src/modules/catalogue/data");
export const DEFAULT_THRESHOLD = 0.6;
/** Below this gap to the runner-up, a match is flagged "close" in the table so a person checks it. */
export const CLOSE_GAP = 0.04;

const STOP = new Set(`a an and the of for to in on with your you my our we i me us is are be it its this that these those
from by as at or into out up about can will what how who which when where than then so per each every one two three all
any more most new your yours their them they he she his her get gets got make makes made use used using do does done
ready plain short clear full list set based give gives written write writes draft drafts page pages
not no without own also just only like over under before after`.split(/\s+/).filter(Boolean));

/** Light stemmer: enough to match "invoices"/"invoice", "categorising"/"categorizing"/"categorisation". */
export function stem(word) {
  let w = word.toLowerCase().replace(/is(e|ed|es|ing|ation|ations)$/, "iz$1");
  if (w.length > 5 && w.endsWith("ization")) w = w.slice(0, -7) + "ize";
  if (w.length > 5 && w.endsWith("ations")) w = w.slice(0, -6) + "ate";
  if (w.length > 5 && w.endsWith("ation")) w = w.slice(0, -5) + "ate";
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ies")) w = w.slice(0, -3) + "y";
  else if (w.length > 4 && /(ss|sh|ch|x)es$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
  if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  if (w.length > 3 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

/** Words of a text, stop words dropped, stemmed. "13-week" stays one word. */
export function tokens(text) {
  return String(text ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ").split(/[^a-z0-9-]+/).flatMap(w => w.includes("-") && !/^\d+-[a-z]+$/.test(w) ? w.split("-") : [w])
    .filter(w => w.length > 1 && !STOP.has(w)).map(stem).filter(w => w.length > 1);
}

const phrase = text => tokens(text).join(" ");
const uniq = text => [...new Set(tokens(text))];

/** Everything the scorer needs from the catalogue, built once. */
export function indexJobTypes(jobTypes) {
  const docs = jobTypes.map(jt => {
    const names = [jt.id.replace(/-/g, " "), jt.title, ...(jt.keywords ?? [])];
    const name = new Set(names.flatMap(tokens));
    return {
      jt, name,
      titleWords: [...new Set([...tokens(jt.title), ...tokens(jt.id.replace(/-/g, " "))])],
      full: new Set([...name, ...tokens(jt.summary), ...tokens(jt.deliverable)]),
      phrases: new Set(names.map(phrase).filter(Boolean)),
    };
  });
  const df = new Map();
  for (const d of docs) for (const t of d.full) df.set(t, (df.get(t) ?? 0) + 1);
  // A word no job type uses weighs the most: the outcome is about something the catalogue does not cover.
  const idf = t => Math.log(1 + docs.length / (df.get(t) ?? 0.5));
  return { docs, idf };
}

/** Share of a text's word weight (IDF) that the set contains. 0 when the text has no words. */
function coverage(words, set, idf) {
  let have = 0, all = 0;
  for (const t of words) { const w = idf(t); all += w; if (set.has(t)) have += w; }
  return all ? have / all : 0;
}

/**
 * Score one outcome against every job type, best first. Mostly the hint against the job type's id, title and keywords,
 * then the outcome title and deliverable against everything the job type says, then how much of the job type's
 * name the outcome mentions. Roughly 0 to 1.3.
 */
export function scoreOutcome(index, outcome, personaArea) {
  const hint = (outcome.job_type_hint ?? "").trim() || outcome.title;
  const hintWords = uniq(hint), titleWords = uniq(outcome.title), delivWords = uniq(outcome.deliverable);
  const hintPhrase = phrase(hint);
  const said = new Set([...hintWords, ...titleWords, ...delivWords]);
  const scored = index.docs.map(d => {
    let score = 0.40 * coverage(hintWords, d.name, index.idf)
      + 0.30 * coverage(titleWords, d.full, index.idf)
      + 0.15 * coverage(delivWords, d.full, index.idf)
      // Reverse: how much of the job type's own name the outcome says. Keeps "launch email sequence" off "late payment email sequence".
      + 0.15 * coverage(d.titleWords, said, index.idf);
    if (hintPhrase && d.phrases.has(hintPhrase)) score += 0.25; // the hint is the job type's title, id or a keyword
    if (personaArea && d.jt.area === personaArea) score += 0.03;
    return { id: d.jt.id, title: d.jt.title, score: Math.round(score * 1000) / 1000 };
  });
  return scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

export function personaFiles(dir = PERSONA_DIR) {
  return fs.readdirSync(dir).filter(f => /^personas-.*\.json$/.test(f)).sort().map(f => path.join(dir, f));
}

export function loadJobTypes(dir = CATALOGUE_DIR) {
  return fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort().flatMap(f => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}

/**
 * Plan the mappings for a set of persona lists. Pure: reads nothing, writes nothing.
 * Returns one row per unmapped outcome (with its best and runner-up job type) and warnings for unknown job type ids.
 */
export function planMappings(files, jobTypes, { threshold = DEFAULT_THRESHOLD, only } = {}) {
  const index = indexJobTypes(jobTypes);
  const known = new Set(jobTypes.map(j => j.id));
  const rows = [], warnings = [];
  for (const { file, personas } of files) {
    for (const p of personas) {
      if (only && !only.includes(p.id)) continue;
      for (const o of p.profile?.outcomes ?? []) {
        if (o.job_type_id) {
          if (!known.has(o.job_type_id)) warnings.push(`${p.id}.${o.id}: job_type_id "${o.job_type_id}" is not in the catalogue`);
          continue;
        }
        const [best, second] = scoreOutcome(index, o, p.area);
        const ok = !!best && best.score >= threshold;
        rows.push({
          file: path.basename(file), persona: p.id, outcome: o.id, hint: o.job_type_hint ?? "", title: o.title,
          job: ok ? best.id : null, best: best ?? null, second: second ?? null,
          close: ok && !!second && best.score - second.score < CLOSE_GAP,
        });
      }
    }
  }
  return { rows, warnings };
}

/** Set job_type_id for the planned rows in one file's text. Keeps indentation, line endings and the final newline. */
export function applyMappings(text, rows) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const finalNewline = /\r?\n$/.test(text);
  const list = JSON.parse(text);
  let changed = 0;
  const want = new Map(rows.filter(r => r.job).map(r => [`${r.persona}\u0000${r.outcome}`, r.job]));
  for (const p of list) for (const o of p.profile?.outcomes ?? []) {
    const job = want.get(`${p.id}\u0000${o.id}`);
    if (job && !o.job_type_id) { o.job_type_id = job; changed++; }
  }
  let out = JSON.stringify(list, null, 2);
  if (eol !== "\n") out = out.replace(/\n/g, eol);
  return { text: finalNewline ? out + eol : out, changed };
}

const pad = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n); };

export function formatTable(rows, threshold) {
  const lines = [
    `${pad("persona.outcome", 40)} ${pad("hint", 26)} ${pad("best job type", 34)} ${pad("score", 6)} ${pad("runner-up", 34)} note`,
    "-".repeat(150),
  ];
  for (const r of rows) {
    const note = !r.job ? `below ${threshold}, left null` : r.close ? "close: check" : "";
    lines.push(`${pad(`${r.persona}.${r.outcome}`, 40)} ${pad(r.hint || r.title, 26)} ${pad(r.best ? r.best.id : "-", 34)} ${pad(r.best ? r.best.score.toFixed(2) : "-", 6)} ${pad(r.second ? `${r.second.id} ${r.second.score.toFixed(2)}` : "-", 34)} ${note}`);
  }
  return lines.join("\n");
}

function main(argv) {
  const flag = n => argv.includes(`--${n}`);
  const val = n => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
  const threshold = val("threshold") !== undefined ? Number(val("threshold")) : DEFAULT_THRESHOLD;
  if (!Number.isFinite(threshold)) { console.error("--threshold needs a number, like 0.3"); process.exit(1); }
  const only = val("only")?.split(",").map(s => s.trim()).filter(Boolean);
  const jobTypes = loadJobTypes();
  const files = personaFiles().map(file => ({ file, text: fs.readFileSync(file, "utf8") }))
    .map(f => ({ ...f, personas: JSON.parse(f.text) }));
  const { rows, warnings } = planMappings(files, jobTypes, { threshold, only });

  if (flag("json")) {
    console.log(JSON.stringify({ threshold, rows, warnings }, null, 2));
  } else {
    const shown = flag("skipped") ? rows.filter(r => !r.job) : rows;
    console.log(formatTable(shown, threshold));
    const mapped = rows.filter(r => r.job).length, close = rows.filter(r => r.close).length;
    console.log(`\n${rows.length} unmapped outcomes in ${files.length} files, ${jobTypes.length} job types. ` +
      `${mapped} over the threshold ${threshold} (${close} close calls), ${rows.length - mapped} left null.`);
    for (const w of warnings) console.log(`warning: ${w}`);
  }

  if (flag("write")) {
    let total = 0;
    for (const f of files) {
      const mine = rows.filter(r => r.file === path.basename(f.file) && r.job);
      if (!mine.length) continue;
      // Read again just before writing, so edits made since the plan are kept (only job_type_id is touched).
      const { text, changed } = applyMappings(fs.readFileSync(f.file, "utf8"), mine);
      if (changed) { fs.writeFileSync(f.file, text); total += changed; console.log(`wrote ${changed} job_type_id values to ${path.relative(ROOT, f.file)}`); }
    }
    console.log(total ? `Done: ${total} outcomes mapped. Run the persona data test next.` : "Nothing to write.");
  } else if (!flag("json")) {
    console.log("Review the table, then run again with --write to save the matches.");
  }
}

// Runs only as a script, never on import (tests import the functions above).
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main(process.argv.slice(2));
