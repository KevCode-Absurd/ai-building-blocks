// The top block of an item page, worked out once for the app (BlockPage.tsx) and the plain page
// (scripts/lib/item-top.mjs): what you give it, what you get back and how long it takes. Plus the small wording
// fixes both share: one name for saved brand details, a plain level label and the file a prompt downloads as.

const text = (x) => (typeof x === "string" ? x : x && typeof x === "object" ? Object.entries(x).map(([k, v]) => (v == null ? k : `${k}: ${text(v)}`)).join(" ") : String(x ?? ""));

/** One name for saved brand details: "brand file". Older item data still says "brand brain". */
export function plainWords(value) {
  return text(value).replace(/\bbrand brain(s?)\b/gi, (m, s) => `${m[0] === "B" ? "Brand" : "brand"} file${s}`);
}

const LEVELS = { beginner: "Good for beginners", advanced: "Some experience needed", expert: "For experts" };
/** A level a newcomer can read without a key, or "" when the item has none. */
export const levelLabel = (level) => LEVELS[String(level ?? "").toLowerCase()] ?? "";

/** How long a run takes, said as messages and steps. The library has no timed runs, so it never gives minutes. */
export function howLong(kind, steps = 0) {
  const n = Number.isInteger(steps) && steps > 1 ? steps : 0;
  if (kind === "prompt") return "One message and one reply.";
  if (kind === "workflow") return n ? `One session with ${n} steps, one after another.` : "One session with several steps, one after another.";
  if (kind === "agent") return n ? `One session. Your AI works through ${n} steps on its own.` : "One session. Your AI works through the steps on its own.";
  if (kind === "mind") return "One question, or a whole conversation.";
  return n ? `One chat. Your AI works through ${n} steps.` : "One chat. Your AI may ask you a question first.";
}

const lines = (value) => (Array.isArray(value) ? value : []).map(plainWords).map((s) => s.trim()).filter(Boolean);
const portName = (port) => String(typeof port === "string" ? port : port?.type ?? "").replace(/\?$/, "").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

/**
 * The inputs (all of them, listed once on the page), the first results and the time line.
 * `kind` is the format id; `steps` is how many steps a workflow or agent runs.
 * @param {{ kind: string, block?: { inputs?: unknown[], outputs?: unknown[] }, page?: any, steps?: number, maxGet?: number }} options
 * @returns {{ give: string[], get: string[], more: number, time: string }}
 */
export function itemBrief({ kind, block = {}, page = null, steps = 0, maxGet = 3 }) {
  const needed = (page?.plan?.needed ?? []).map((n) => (n.what ? `${n.label}: ${n.what}` : n.label));
  const give = [lines(page?.you_give), lines(needed), (block.inputs ?? []).map(portName).filter(Boolean)].find((list) => list.length) ?? [];
  const sample = (Array.isArray(page?.output_sample?.output) ? page.output_sample.output : []).map((o) => (o?.name && o?.contains ? `${o.name}: ${o.contains}` : ""));
  const got = [lines(page?.you_get), lines(sample), (block.outputs ?? []).map(portName).filter(Boolean)].find((list) => list.length) ?? [];
  const count = steps || (kind === "skill" ? (page?.how_it_works?.length ?? 0) : 0);
  return { give: give.slice(0, 9), get: got.slice(0, maxGet), more: Math.max(0, got.length - maxGet), time: howLong(kind, count) };
}

/** A prompt downloads as one text file named for what it is, without the settings block a skill file starts with. */
export const promptFileName = (slug) => `${slug}-prompt.md`;
export function promptFileText(skillFile) {
  return String(skillFile ?? "").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, "").trimStart();
}

/** A few words on what an optional extra is: the first clause of its description, so the line stays short. */
export function shortGloss(what) {
  const first = plainWords(what).split(/[.:;]\s/)[0].trim().replace(/[.:;]$/, "");
  return first.length > 90 ? `${first.slice(0, 90).replace(/\s+\S*$/, "")}…` : first;
}
