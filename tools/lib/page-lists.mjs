// Two page rules that tools/lint-pages.mjs checks and fixes, kept here so the tests can call them.
//  1. A list line must be plain text. "- Check: the totals" is read by YAML as a small map ({ Check: "the totals" }),
//     so the line is lost or garbled on the page. The fix quotes the line.
//  2. A skill that ships scripts, or whose SKILL.md tells the AI to run commands, must say on its page that it needs an
//     AI that can run code. The fix adds one plain line to "Before you start" (output_sample.prerequisites).
import YAML from "../../site/node_modules/yaml/dist/index.js";

// The page fields that are lists of plain lines (how_it_works, tweaks and terms are lists of small maps on purpose).
export const TEXT_LISTS = ["when", "not_for", "you_give", "you_get", "how_to_use", "judge", "test", "improve", "output_sample.input", "output_sample.prerequisites"];
const at = (page, field) => field.split(".").reduce((v, k) => (v && typeof v === "object" ? v[k] : undefined), page);

/** The list lines on a parsed page that are not plain text: [{ field, index }]. */
export function mapItems(page) {
  const out = [];
  for (const field of TEXT_LISTS) {
    const list = at(page, field);
    if (Array.isArray(list)) list.forEach((x, index) => { if (x !== null && typeof x === "object") out.push({ field, index }); });
  }
  return out;
}

const eolOf = (raw) => (raw.includes("\r\n") ? "\r\n" : "\n");
const valueText = (raw, node) => {
  if (node == null) return "";
  if (YAML.isScalar(node)) return typeof node.value === "string" ? node.value : raw.slice(node.range[0], node.range[1]);
  return raw.slice(node.range[0], node.range[1]).replace(/\s*\r?\n\s*/g, " ");
};
// What the writer meant: the line as typed, "Key: value".
const mapText = (raw, map) => map.items.map((p) => {
  const key = valueText(raw, p.key);
  return p.value == null || (YAML.isScalar(p.value) && p.value.value === null && p.value.range[0] === p.value.range[1]) ? `${key}:` : `${key}: ${valueText(raw, p.value)}`;
}).join(" ").trim();

// Where the typed line ends: after its last value, or after the colon of a key with no value. (The map's own range runs
// on to the next line, so replacing it would swallow the line break.)
const mapEnd = (raw, map) => {
  const last = map.items[map.items.length - 1];
  const empty = last.value == null || (YAML.isScalar(last.value) && last.value.value === null && last.value.range[0] === last.value.range[1]);
  return empty ? raw.indexOf(":", last.key.range[1]) + 1 : last.value.range[1];
};

const seqNode = (doc, field) => {
  const node = doc.getIn(field.split("."), true);
  return YAML.isSeq(node) ? node : null;
};

/** Quotes every list line that YAML read as a map. Returns { text, fixed }; text is unchanged when nothing needed fixing. */
export function quoteMapItems(raw) {
  const doc = YAML.parseDocument(raw);
  const edits = [];
  for (const field of TEXT_LISTS) {
    const seq = seqNode(doc, field);
    if (!seq) continue;
    for (const item of seq.items) if (YAML.isMap(item) && item.range) edits.push([item.range[0], mapEnd(raw, item), JSON.stringify(mapText(raw, item))]);
  }
  if (!edits.length) return { text: raw, fixed: 0 };
  let text = raw;
  for (const [start, end, src] of edits.sort((a, b) => b[0] - a[0])) text = text.slice(0, start) + src + text.slice(end);
  const after = YAML.parse(text);
  if (mapItems(after).length) throw new Error("quoteMapItems: a list line is still not plain text");
  return { text, fixed: edits.length };
}

// Commands an AI would have to run, inside a ``` block in SKILL.md. Installing a skill ("npx skills add") does not count.
const CMD = /^\s*(?:\$\s+)?(?:python3?|node|npx(?! skills add)|pip3?|uv|bash|sh|Rscript|docker|cargo|go run|java|deno|bun)\s+\S/;
/** Why a skill needs an AI that can run code ("scripts folder", "scripts", "commands"), or "" when it doesn't. */
export function runsCode(skillText, hasScriptsFolder = false) {
  if (hasScriptsFolder) return "scripts folder";
  const text = String(skillText ?? "").replace(/\r\n?/g, "\n");
  if (/\bscripts\/[\w.-]+\.(?:py|js|mjs|cjs|ts|sh|r|rb|jl|m)\b/i.test(text)) return "scripts";
  let fence = false;
  for (const line of text.split("\n")) {
    if (/^\s*(?:```|~~~)/.test(line)) { fence = !fence; continue; }
    if (fence && CMD.test(line)) return "commands";
  }
  return "";
}

const flat = (v) => (typeof v === "string" ? v : Array.isArray(v) ? v.map(flat).join("\n") : v && typeof v === "object" ? Object.values(v).map(flat).join("\n") : v == null ? "" : String(v));
// Words that tell a reader the AI has to run code: "can run code", "runs the script", "Python", "a terminal" and the like.
const SAYS = new RegExp([
  String.raw`\b(?:run|runs|running|execute|executes)\s+(?:the\s+|your\s+|its\s+|a\s+|this\s+|bundled\s+|included\s+)*(?:code|commands?|scripts?|python|node|terminal|checks? script)\b`,
  String.raw`can run (?:code|commands|scripts|python)`, String.raw`code (?:execution|interpreter|tool)`, String.raw`command line`, String.raw`\bterminal\b`,
  String.raw`\bscripts? (?:needs?|uses?|requires?|runs?)\b`, String.raw`\b(?:install|installed|needs?|requires?)\s+(?:python|node\.js|node)\b`,
  String.raw`\b(?:python|node\.js|node)\s+\d`, String.raw`runs? on your (?:own )?(?:machine|computer)`,
].join("|"), "i");
const READER_FIELDS = ["headline", "subhead", "summary", "explain", "when", "not_for", "you_give", "you_get", "how_to_use", "output_sample"];
/** Whether the page tells the reader the AI has to run code. */
export const saysRunsCode = (page) => SAYS.test(flat(READER_FIELDS.map((f) => page?.[f])));

/** The line the fix adds, in plain words. */
export const codeNote = (why) => (why === "commands" ? "An AI that can run code, to run the commands in this skill" : "An AI that can run code, to use the scripts that come with this skill");

const lineStart = (raw, pos) => raw.lastIndexOf("\n", pos - 1) + 1;
const afterLine = (raw, pos) => { const n = raw.indexOf("\n", pos); return n < 0 ? raw.length : n + 1; };
const plainOk = (s) => /^[A-Za-z][^:#"']*$/.test(s) && !/:\s|\s#/.test(s);
/**
 * Adds `line` to output_sample.prerequisites (creating the list after output_sample.input when there is none).
 * Returns the new text, or null when there is no output_sample.input or the list already has 6 lines.
 */
export function addPrerequisite(raw, line) {
  const doc = YAML.parseDocument(raw);
  const eol = eolOf(raw);
  const item = plainOk(line) ? line : JSON.stringify(line);
  const pre = seqNode(doc, "output_sample.prerequisites");
  const ensureEol = (t, pos) => (pos === t.length && !t.endsWith("\n") ? [t + eol, pos + eol.length] : [t, pos]);
  if (pre && pre.items.length) {
    if (pre.items.length >= 6) return null;
    const last = pre.items[pre.items.length - 1];
    const prefix = raw.slice(lineStart(raw, pre.items[0].range[0]), pre.items[0].range[0]);
    if (!/^\s*-\s+$/.test(prefix)) return null;
    let [text, pos] = ensureEol(raw, afterLine(raw, last.range[1]));
    return text.slice(0, pos) + prefix + item + eol + text.slice(pos);
  }
  if (pre) return null; // an empty list written inline ([]) is left for a person
  const input = seqNode(doc, "output_sample.input");
  const os = doc.get("output_sample", true);
  if (!input || !input.items.length || !YAML.isMap(os)) return null;
  const inputPair = os.items.find((p) => YAML.isScalar(p.key) && p.key.value === "input");
  const keyIndent = raw.slice(lineStart(raw, inputPair.key.range[0]), inputPair.key.range[0]);
  const prefix = raw.slice(lineStart(raw, input.items[0].range[0]), input.items[0].range[0]);
  if (!/^\s*$/.test(keyIndent) || !/^\s*-\s+$/.test(prefix)) return null;
  const last = input.items[input.items.length - 1];
  let [text, pos] = ensureEol(raw, afterLine(raw, last.range[1]));
  return text.slice(0, pos) + `${keyIndent}prerequisites:${eol}${prefix}${item}${eol}` + text.slice(pos);
}
