// Pure request fields and validation, shared with the existing planner. No catalogue search or workflow codec.
export type Choices = { mode?: string; reference?: string; delivery?: string; automation?: string };
export function validateChoices(raw: unknown): Choices {
  const values: Record<string, string[]> = { mode: ["new", "existing"], reference: ["none", "reference"], delivery: ["code", "shopify", "publish"], automation: ["once", "recurring"] };
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || Object.entries(raw).some(([key, value]) => !Object.hasOwn(values, key) || typeof value !== "string" || !values[key].includes(value))) throw new Error("Choose one of the supplied workflow options.");
  return { ...raw } as Choices;
}

export const QUESTIONS = {
  mode: { text: "Are you creating something new or improving existing work?", options: [["new", "Create from scratch"], ["existing", "Improve existing work"]] },
  reference: { text: "Would you like to use a competitor or design reference?", options: [["none", "Original direction"], ["reference", "Use a URL or screenshot"]] },
  delivery: { text: "What should the landing-page workflow hand back?", options: [["code", "Source code"], ["shopify", "Shopify theme files"], ["publish", "Prepare to publish"]] },
  automation: { text: "How should this run?", options: [["once", "Run once"], ["recurring", "Repeat with an agent"]] },
} as const;
export const LEGACY_REQUEST_LIMIT = 10000;
export const LIMITS = { request: 3000, context: 12000, steps: 16, candidates: 64, output: 5000 };
const STOP = new Set("a an the for my our your of to from and i we want need get make me with that this in on into it some new can do how help please hi hello hey you are is be as have using then also would like just something".split(" "));
export const GENERIC = new Set("build create write plan check improve fix find work use output result workflow skill prompt tool agent".split(" "));
const SYNONYMS: [RegExp, string][] = [
  [/\b(landing\s*page|landingpage|homepage)\b/g, " landing page website"],
  [/\b(adverts?|advertisements?|advertising)\b/g, " ad ads"],
  [/\b(onboarding|welcome)\b/g, " onboarding welcome"],
  [/\b(search engine|google ranking|organic traffic)\b/g, " seo"],
  [/\b(hire|recruit|recruitment)\b/g, " hiring candidate interview"],
  [/\b(dashboard|kpis?|reporting)\b/g, " dashboard report metric"],
  [/\b(automate|automation|recurring|weekly|daily|monitor)\b/g, " automation"],
  [/\b(competitor|rival)\b/g, " competitor reference"],
  [/\b(small business|online store|ecommerce)\b/g, " business store"],
];
const stem = (w: string) => w.length < 5 ? w : w.replace(/ies$/, "y").replace(/(ing|ed|es|s)$/, "");
export function terms(text: string, expand = true): string[] {
  let s = text.toLowerCase().normalize("NFKC").replace(/[’']/g, "");
  if (expand) { const raw = s; for (const [re, extra] of SYNONYMS) if (raw.match(re)) s += extra; }
  return [...new Set(s.replace(/[^\p{L}\p{N}]+/gu, " ").split(/\s+/).filter(w => w.length > 1 && !STOP.has(w)).map(stem))];
}
export function requestError(goal: string): string | null {
  if (goal.length > LIMITS.request) return `Keep the request under ${LIMITS.request} characters.`;
  const t = terms(goal).filter(w => !GENERIC.has(w));
  if (!t.length || /^(how are you|whats up|good morning|thanks|thank you|tell me a joke)[.!?\s]*$/i.test(goal.trim())) return "Describe a result you want, such as a landing page, hiring plan or weekly report.";
  return null;
}

export const LANDING = /\b(landing\s*page|homepage)\b/i;
const RECURRING = /\b(daily|weekly|monthly|recurring|monitor|repeat|schedule|automation|automate)\b/i;
export function questionsFor(goal: string, choices: Choices = {}, context = ""): string[] {
  goal = positiveRequest([goal, context].filter(Boolean).join("\n"));
  const ids: string[] = [];
  if (LANDING.test(goal)) {
    if (!choices.mode && !/\b(existing|current|audit|improve|redesign|from scratch|new page)\b/i.test(goal)) ids.push("mode");
    if (!choices.reference && !/\b(competitor|rival|reference|original|from scratch)\b/i.test(goal)) ids.push("reference");
    if (!choices.delivery && !/\b(code|html|react|shopify|publish|deploy)\b/i.test(goal)) ids.push("delivery");
  }
  if (RECURRING.test(goal) && !choices.automation) ids.push("automation");
  return ids.slice(0, 3);
}

export const ACTIONS = "build|create|write|draft|design|prepare|make|plan|audit|check|review|summari[sz]e|compare|analy[sz]e|translate|organize|organise|produce|generate|turn|develop|deliver|give|export|collect|research|score|test|optimi[sz]e|fix|publish|send";
/** This is a bounded language heuristic, not semantic understanding. Preserve the full original in the pack. */
export function positiveRequest(request: string): string {
  return request.replace(/\b(?:do not|don['’]?t|never|without|no|not(?! only\b))\s+[^.;\n,]+/gi, segment => {
    const resume = segment.search(new RegExp(`\\b(?:but|and)\\s+(?:${ACTIONS})\\b`, "i"));
    return resume >= 0 ? segment.slice(resume).replace(/^(but|and)\s+/i, "") : " ";
  }).trim();
}
