// What kind of work an agent does, read from its own words: does it make the thing, plan it, or review it?
// Cards and profiles say so in one line ("Makes: ...", "Plans and briefs: ...", "Reviews and advises: ..."), the
// profile groups its task list the same way, and search puts agents who make a thing above agents who only audit it.
// Nothing here rewrites an agent's text: the line is worked out from its outcomes and its "Not for" list.
// No imports, so the browser app can use it too.

export type WorkNature = "make" | "plan" | "review";

/** The start of the line on cards and profiles. */
export const NATURE_LABELS: Record<WorkNature, string> = { make: "Makes", plan: "Plans and briefs", review: "Reviews and advises" };
/** Group headings for the profile's "What I can do", in the agent's own voice. */
export const NATURE_HEADINGS: Record<WorkNature, string> = { make: "Things I make", plan: "Things I plan", review: "Things I check and advise on" };

/** A deliverable whose last word is one of these is a review of something that exists: findings and advice. */
const REVIEW_HEADS = new Set(["audit", "audits", "review", "reviews", "teardown", "teardowns", "check", "checks", "checkup", "check-up", "read-out", "readout", "diagnosis", "analysis", "assessment", "critique", "comparison", "report", "reports", "findings", "benchmark", "watch", "health-check", "debrief", "post-mortem", "postmortem", "retrospective", "read", "verdict", "score", "evaluation", "appraisal"]);
/** A deliverable whose last word is one of these is a plan or brief for someone to build from. */
const PLAN_HEADS = new Set(["plan", "plans", "brief", "briefs", "strategy", "roadmap", "calendar", "checklist", "checklists", "map", "spec", "specs", "specification", "outline", "framework", "schedule", "structure", "agenda", "budget", "timeline", "blueprint", "shortlist", "priorities", "recommendation", "recommendations", "options"]);

const LEAD = /^(?:(?:a|an|the|your|my|our|one|two|three|four|five|six|seven|eight|nine|ten|twelve|\d+)\s+)+/i;
/** Where the name of the thing ends and the detail begins: "A landing page teardown | with ranked fixes". */
const TAIL = /\s+(?:for|with|from|between|that|to|so|you|your|in|on|by|of|before|after|about|across|against|at|per|into|when|where|which|who|using|based|built|ready|as|within|without|over|under|through|if|whether)(?=\s|$)|[,:(]/gi;
/** A trailing "-ed" word is detail too: "Etsy listings rewritten" -> "Etsy listings". */
const DONE = /^(?:[a-z-]+ed|built|rebuilt|split|sent|written|rewritten|drawn|redrawn|done|redone|made|kept|set)$/;
/** Short forms that keep their capitals when a search hint stands in for a title. */
const CAPITALS: Record<string, string> = { ai: "AI", seo: "SEO", kpi: "KPI", kpis: "KPIs", crm: "CRM", faq: "FAQ", faqs: "FAQs", cv: "CV", ppc: "PPC", b2b: "B2B", b2c: "B2C", saas: "SaaS", sms: "SMS", ux: "UX", ui: "UI", pr: "PR", roi: "ROI", sop: "SOP", sops: "SOPs", okr: "OKR", okrs: "OKRs", geo: "GEO", css: "CSS", html: "HTML", sql: "SQL", api: "API", pdf: "PDF", hr: "HR", vat: "VAT", ci: "CI", ugc: "UGC", cro: "CRO", nps: "NPS", gdpr: "GDPR", ebitda: "EBITDA", dax: "DAX", orm: "ORM", bi: "BI", qa: "QA", tiktok: "TikTok", youtube: "YouTube", linkedin: "LinkedIn", google: "Google", shopify: "Shopify", amazon: "Amazon", etsy: "Etsy", meta: "Meta", facebook: "Facebook", instagram: "Instagram", pinterest: "Pinterest", wordpress: "WordPress", whatsapp: "WhatsApp", excel: "Excel", klaviyo: "Klaviyo", hubspot: "HubSpot", salesforce: "Salesforce", quickbooks: "QuickBooks", xero: "Xero", sharepoint: "SharePoint", javascript: "JavaScript", typescript: "TypeScript", jquery: "jQuery", python: "Python", "a/b": "A/B", ab: "A/B" };
/** Names that keep their capital when a title starts with them. */
const PROPER = new Set(["Google", "Shopify", "Amazon", "Etsy", "Meta", "Facebook", "Instagram", "LinkedIn", "Linkedin", "TikTok", "Tiktok", "YouTube", "Youtube", "Pinterest", "Reddit", "Slack", "Notion", "Excel", "Klaviyo", "Mailchimp", "WordPress", "Wordpress", "Webflow", "Wix", "Squarespace", "Stripe", "QuickBooks", "Quickbooks", "Xero", "HubSpot", "Hubspot", "Salesforce", "Zapier", "Airtable", "Figma", "Canva", "Python", "React", "Bullseye", "Substack", "Kickstarter", "Walmart", "Twitch", "Discord", "Telegram", "WhatsApp", "Apple", "Android", "Microsoft", "Zendesk", "Intercom", "Gorgias", "Asana", "Trello", "Jira", "GitHub", "Docker", "Kubernetes", "Postgres", "Supabase", "Vercel", "Cloudflare", "Bing", "Yelp", "Airbnb", "Upwork", "Fiverr", "Gumroad", "Patreon", "Medium", "Quora", "Twitter", "Snapchat", "Spotify", "Zoom", "Calendly", "Typeform", "Looker", "Tableau", "Lighthouse", "English", "Spanish", "French", "German", "Black", "Christmas", "Ramadan", "Diwali", "January", "Monday"]);

const wordsOf = (text: string) => text.split(/\s+/).filter(Boolean);
const bare = (word: string) => word.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");

/** The thing an outcome title names, without its lead-in or detail: "A landing page teardown with ranked fixes" -> "landing page teardown". */
function nameOfThing(title: string): { thing: string; trimmed: boolean } {
  const stripped = title.trim().replace(/[.!?]+$/, "").replace(LEAD, "");
  let thing = stripped;
  // The first break that is not inside a pair such as "before and after".
  for (const cut of stripped.matchAll(TAIL)) {
    if (cut.index === 0 || /\b(?:and|or)$/i.test(stripped.slice(0, cut.index))) continue;
    thing = stripped.slice(0, cut.index).trim();
    break;
  }
  const ws = wordsOf(thing);
  const before = ws.length;
  while (ws.length >= 2 && DONE.test(ws[ws.length - 1])) ws.pop();
  return { thing: ws.join(" "), trimmed: ws.length < before };
}

function headNature(phrase: string): WorkNature | null {
  const ws = wordsOf(phrase).map(bare).filter(Boolean);
  const last = ws[ws.length - 1] ?? "";
  if (REVIEW_HEADS.has(last) || (last === "list" && /^fix(es)?$/.test(ws[ws.length - 2] ?? "")) || (last === "check" && ws[ws.length - 2] === "health")) return "review";
  if (PLAN_HEADS.has(last) || (last === "list" && /^(request|priority|short|to-do|task|action|shot|shopping)$/.test(ws[ws.length - 2] ?? ""))) return "plan";
  return null;
}

/**
 * What an outcome is, from its title: a review (an audit, check or report on something that exists), a plan (a plan,
 * brief or map for someone to build from), or a made thing (everything else: copy, pages, emails, code, files).
 * A title that names two things goes by the first: "A hiring day plan and interview scorecard" is a plan, "Item
 * descriptions and a photo shot list" is a made thing. "A crawl and indexing fix list" names one thing, a fix list.
 * When the title's own name is one bare word ("A month of Meta ads, planned"), the search hint decides ("meta ads plan").
 */
export function outcomeNature(title: string, hint?: string | null): WorkNature {
  const { thing } = nameOfThing(title);
  const pair = /^(.+?)\s+(?:and|or|plus)\s+(.+)$/i.exec(thing);
  if (pair) {
    const first = headNature(pair[1]);
    if (/^(?:a|an|the|\d+)\s/i.test(pair[2])) return first ?? "make";
    if (first && wordsOf(pair[1]).length >= 2) return first;
  }
  const own = headNature(thing);
  if (own) return own;
  return (wordsOf(thing).length < 2 && hint ? headNature(hint.split(":")[0]) : null) ?? "make";
}

const REVIEW_VERBS = new Set(["check", "review", "audit", "diagnose", "test", "analyse", "analyze", "compare", "find", "measure", "assess", "evaluate", "score", "spot", "track", "monitor", "inspect", "verify", "judge", "read", "explain", "investigate", "benchmark", "grade", "rate", "critique", "reconcile", "forecast", "report", "size", "research", "validate", "interpret", "summarise", "summarize", "troubleshoot", "debug", "triage", "screen", "vet"]);
const PLAN_VERBS = new Set(["plan", "brief", "spec", "scope", "map", "outline", "choose", "decide", "prioritise", "prioritize", "pick", "schedule", "budget", "set", "define", "structure", "organise", "organize", "prepare", "position", "name", "price", "rank", "select", "shortlist", "sequence", "strategise", "strategize", "estimate"]);

/** What a toolbox task is, from its first word and its kind: "Check a print file" reviews, "Plan event signs" plans, "Lay out a flyer" makes. */
export function taskNature(task: string, kind: string): WorkNature {
  const verb = bare(wordsOf(task)[0] ?? "");
  if (REVIEW_VERBS.has(verb)) return "review";
  if (PLAN_VERBS.has(verb)) return "plan";
  if (kind === "audit" || kind === "analysis") return "review";
  if (kind === "strategy" || kind === "plan") return "plan";
  return "make";
}

const NATURE_WORD = /\b(?:plans?|briefs?|checks?|reviews?|audits?|reports?|strategy|checklist|map|spec|teardown|analysis|calendar|roadmap|outline|schedule)\b/i;

/**
 * A short name for what an outcome delivers, for the "Makes: ..." line: the title without its lead-in and detail.
 * When that leaves one bare word ("A check of whether the profit is real" -> "check"), the outcome's search hint
 * stands in ("profit quality review"). The hint also stands in when the title says what was done to a thing ("Your
 * bank statement matched to your books" is a "bank reconciliation", not a bank statement). At most six words.
 */
export function outcomeThing(title: string, hint?: string | null): string {
  const started = title.trim().replace(/[.!?]+$/, "");
  const named = nameOfThing(title);
  let thing = named.thing;
  const hintText = (hint ?? "").split(":")[0].replace(/\s+/g, " ").trim();
  const count = wordsOf(thing).length;
  if ((count < 2 || count > 6 || named.trimmed) && hintText) {
    const head = bare(thing);
    const short = wordsOf(hintText).slice(0, 6).map(w => CAPITALS[w.toLowerCase()] ?? w).join(" ");
    thing = count < 2 && head && NATURE_WORD.test(head) && !NATURE_WORD.test(short) ? `${short} ${head}` : short;
  } else if (count > 6) {
    // Too long and no hint: keep the first of two things ("... set-up and lead dispute notes"), else the first six words.
    const first = thing.split(/\s+(?:and|or|plus)\s+/i)[0];
    thing = first !== thing && wordsOf(first).length >= 2 && wordsOf(first).length <= 6 ? first : wordsOf(thing).slice(0, 6).join(" ");
  } else if (thing === started.slice(0, thing.length)) {
    // The title began with this word, so its capital is only sentence case: "Replies to..." -> "replies".
    const [first, second] = wordsOf(thing);
    if (/^[A-Z][a-z]+(?:-[a-z]+)*$/.test(first) && !PROPER.has(first) && !/^[A-Z]/.test(second ?? "")) thing = first.toLowerCase() + thing.slice(first.length);
  }
  return thing.replace(/\s+(?:and|or|&)$/i, "").trim();
}

export interface WorkLine {
  nature: WorkNature;
  /** "Makes", "Plans and briefs" or "Reviews and advises". */
  label: string;
  /** Up to three short names of what the agent delivers of that kind, most important first. */
  things: string[];
  /** The agent's own "Not for" line that says it does not make the finished thing ("Drawing the logo or making files"), or null. */
  does_not: string | null;
}

/** "Drawing the logo or making files": a "Not for" line that says the agent does not make the finished thing. */
const NOT_MAKING = /^(?:drawing|making|designing|building|producing|creating|coding|writing|filming|shooting|recording|editing|illustrating|developing|rendering|animating|printing|photographing|composing)\b[^.]*\b(?:logos?|files?|artwork|designs?|graphics|illustrations?|images?|photos?|videos?|footage|code|apps?|websites?|sites?|pages?|screens?|mock-?ups?|layouts?|animations?|audio|music|tracks?|visuals?|assets?|the (?:final|finished)\b)/i;

/** The first "Not for" line that says the agent does not make the finished thing (it briefs, plans or reviews instead), or null. */
export function notMaking(notFor: readonly string[] | undefined): string | null {
  return (notFor ?? []).map(line => String(line ?? "").trim()).find(line => NOT_MAKING.test(line)) ?? null;
}

/**
 * The honest one-liner for an agent, worked out from its outcomes: what most of them are (made things, plans or
 * reviews), then up to three of them by name. An agent that makes as much as it plans or reviews is a maker; a tie
 * between plans and reviews goes to the first outcome, the agent's lead offer. does_not carries the agent's own
 * "Not for" line when it says the agent does not make the finished thing. null when the agent lists no outcomes.
 */
export function workLine(outcomes: readonly { title: string; job_type_hint?: string | null }[] | undefined, notFor?: readonly string[]): WorkLine | null {
  const list = (outcomes ?? []).filter(o => o && typeof o.title === "string" && o.title.trim());
  if (!list.length) return null;
  const natures = list.map(o => outcomeNature(o.title, o.job_type_hint));
  const counts: Record<WorkNature, number> = { make: 0, plan: 0, review: 0 };
  for (const n of natures) counts[n]++;
  const lead: WorkNature = natures[0] === "make" ? "plan" : natures[0];
  const order: WorkNature[] = ["make", lead, "plan", "review"];
  const nature = order.reduce((best, n) => (counts[n] > counts[best] ? n : best), "make" as WorkNature);
  const things: string[] = [];
  list.forEach((o, i) => {
    if (natures[i] !== nature || things.length >= 3) return;
    const thing = outcomeThing(o.title, o.job_type_hint);
    if (thing && !things.some(t => t.toLowerCase() === thing.toLowerCase())) things.push(thing);
  });
  return { nature, label: NATURE_LABELS[nature], things, does_not: notMaking(notFor) };
}

/** "Makes: landing page copy, product descriptions and email sequences". */
export function workLineText(line: WorkLine): string {
  const t = line.things;
  const listed = t.length <= 1 ? t.join("") : `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}`;
  return listed ? `${line.label}: ${listed}` : line.label;
}

/** Tasks grouped by what they are, groups in the order their first task appears, tasks in the order given. */
export function groupByNature<T extends { nature: WorkNature }>(tasks: readonly T[]): { nature: WorkNature; heading: string; tasks: T[] }[] {
  const groups: { nature: WorkNature; heading: string; tasks: T[] }[] = [];
  for (const task of tasks) {
    let group = groups.find(g => g.nature === task.nature);
    if (!group) groups.push(group = { nature: task.nature, heading: NATURE_HEADINGS[task.nature], tasks: [] });
    group.tasks.push(task);
  }
  return groups;
}

/** How many tasks "What I can do" shows before "Show all". The app and the crawler copy use the same number. */
export const TASKS_SHOWN = 8;

/** "Drawing the logo or making files" -> "drawing the logo or making files", to follow "Not for:" in a sentence. */
export function lowerFirst(text: string): string {
  return /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}
