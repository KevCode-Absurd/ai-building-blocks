// Small, private browser utilities. Shared metadata keeps routes, search and SEO aligned.
import { NEXT_TOOLS } from './next-100-tools.mjs';
import { parseCsv, csvToJson } from './csv-utils.mjs';
export { parseCsv, csvToJson } from './csv-utils.mjs';
export const BROWSER_TOOLS = [
  { slug: "word-counter", short: "Word and reading counter", category: "personal", summary: "Count words, characters and reading time before you send or publish your writing." },
  { slug: "text-cleaner", short: "Text cleaner", category: "personal", summary: "Remove extra spaces and empty lines, and change text case without losing your original." },
  { slug: "contrast-checker", short: "Colour contrast checker", category: "design", summary: "Compare text and background colours against WCAG AA and AAA contrast thresholds." },
  { slug: "json-formatter", short: "JSON formatter", category: "operations", summary: "Validate, format or compact JSON and get a useful error when the input needs fixing." },
  { slug: "csv-to-json", short: "CSV to JSON converter", category: "operations", summary: "Turn a CSV table into JSON, including quoted commas, multiline cells and empty values." },
  { slug: "task-priority-planner", short: "Task priority planner", category: "personal", summary: "Rank tasks by impact, urgency and hours of effort so you can choose what to do next." },
  { slug: "weighted-decision-matrix", short: "Weighted decision matrix", category: "work", summary: "Compare options against criteria you choose, with visible weights and scores." },
  ...NEXT_TOOLS,
].map(t => ({ ...t, name: t.short, headline: t.short, kind: "browser", question: t.summary }));

export function countText(text, wordsPerMinute = 200) {
  if (!Number.isFinite(wordsPerMinute) || wordsPerMinute <= 0) throw Error("Reading speed must be greater than zero.");
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  if (!Number.isFinite(words / wordsPerMinute)) throw Error("Reading speed is too small to calculate a reading time.");
  return { words, characters: [...text].length, withoutSpaces: [...text.replace(/\s/gu, "")].length, paragraphs: text.trim() ? text.trim().split(/\n\s*\n/u).length : 0, minutes: words / wordsPerMinute };
}
export function cleanText(text, mode = "spacing") {
  if (mode === "upper") return text.toUpperCase();
  if (mode === "lower") return text.toLowerCase();
  if (mode === "lines") return text.replace(/\r\n?/g, "\n").split("\n").map(s => s.trim()).filter(Boolean).join("\n");
  return text.replace(/\r\n?/g, "\n").split("\n").map(s => s.replace(/[\t \u00a0]+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
export function contrastRatio(a, b) {
  const luminance = hex => {
    let raw = hex.trim().replace(/^#/, "");
    if (/^[\da-f]{3}$/i.test(raw)) raw = [...raw].map(c => c + c).join("");
    if (!/^[\da-f]{6}$/i.test(raw)) throw Error("Enter a three- or six-digit hex colour, such as #123456.");
    return [0.2126, 0.7152, 0.0722].reduce((sum, weight, i) => {
      const c = parseInt(raw.slice(i * 2, i * 2 + 2), 16) / 255;
      return sum + weight * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    }, 0);
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Validate with JSON.parse, but retain original tokens so numeric precision and duplicate keys survive formatting. */
export function formatJson(text, compact = false) {
  if (!text.trim()) return "";
  JSON.parse(text);
  const tokens = text.match(/"(?:[^"\\]|\\[\s\S])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}\[\]:,]/g) ?? [];
  if (compact) return tokens.join("");
  let result = "", depth = 0;
  const newline = () => { result += `\n${"  ".repeat(depth)}`; };
  for (const [i, token] of tokens.entries()) {
    if (token === "{" || token === "[") {
      result += token; depth++;
      if (tokens[i + 1] !== "}" && tokens[i + 1] !== "]") newline();
    } else if (token === "}" || token === "]") {
      depth--;
      if (tokens[i - 1] !== "{" && tokens[i - 1] !== "[") newline();
      result += token;
    } else if (token === ",") { result += token; newline(); }
    else if (token === ":") result += ": ";
    else result += token;
  }
  return result;
}
export function rankTasks(text) {
  const [headers] = parseCsv(text);
  if (headers && !["task", "impact", "urgency", "hours"].every(key => headers.some(h => h.trim() === key))) throw Error("Use headings task,impact,urgency,hours.");
  return csvToJson(text).map(row => {
    const impact = Number(row.impact), urgency = Number(row.urgency), hours = Number(row.hours);
    if (!row.task?.trim() || !row.impact?.trim() || !row.urgency?.trim() || !row.hours?.trim() || ![impact, urgency, hours].every(Number.isFinite) || impact < 1 || impact > 5 || urgency < 1 || urgency > 5 || hours <= 0) throw Error("Use headings task,impact,urgency,hours. Impact and urgency must be 1–5; hours must be greater than zero.");
    const score = impact * urgency / hours;
    if (!Number.isFinite(score)) throw Error("Hours are too small to calculate a finite task score.");
    return { task: row.task, impact, urgency, hours, score };
  }).sort((a, b) => b.score - a.score);
}
export function scoreOptions(text) {
  const rows = parseCsv(text);
  if (rows.length < 3 || rows[0].length < 3 || rows[0][0].trim().toLowerCase() !== "criterion" || rows[0][1].trim().toLowerCase() !== "weight") throw Error("Start with criterion,weight and at least one option name. Add at least two criteria.");
  const options = rows[0].slice(2).map(s => s.trim());
  if (options.some(s => !s) || new Set(options).size !== options.length) throw Error("Give every option a different name.");
  const totals = options.map(() => 0); let weightTotal = 0;
  for (const [i, row] of rows.slice(1).entries()) {
    const weight = Number(row[1]), scores = row.slice(2).map(Number);
    if (row.length !== options.length + 2 || !row[0].trim() || !row[1]?.trim() || row.slice(2).some(s => !s.trim()) || !Number.isFinite(weight) || weight < 0 || scores.some(s => !Number.isFinite(s) || s < 0 || s > 10)) throw Error(`Check row ${i + 2}: use a criterion, a nonnegative weight and one score from 0 to 10 for every option.`);
    weightTotal += weight; scores.forEach((s, j) => { totals[j] += s * weight; });
  }
  if (!weightTotal) throw Error("At least one criterion needs a weight greater than zero.");
  if (!Number.isFinite(weightTotal) || totals.some(t => !Number.isFinite(t))) throw Error("Weights are too large to calculate a score. Divide all weights by the same number and try again.");
  return options.map((option, i) => ({ option, score: totals[i] / weightTotal })).sort((a, b) => b.score - a.score);
}
