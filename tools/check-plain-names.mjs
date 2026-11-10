// Plain names check: can a small-business owner tell what each library item is, and what they get, from its name,
// headline, subhead and summary alone? The same words reach two readers: a visitor on useaiblocks.com, and an agent
// picking from its toolbox (marketplace/packs/roles/<role>/toolbox.json lists items as library:<slug>).
//
// Run from anywhere:
//   node tools/check-plain-names.mjs                  every item, worst first, then the counts by reason
//   node tools/check-plain-names.mjs --toolbox-only   only items that a toolbox.json names
//   node tools/check-plain-names.mjs --json           the same report as JSON
//   node tools/check-plain-names.mjs --slug <slug>    one item (repeat for more)
//   node tools/check-plain-names.mjs --min 5          only items scoring 5 or more
//   node tools/check-plain-names.mjs --all            list clean items too
//   node tools/check-plain-names.mjs --root <folder>  read another checkout
// It is a report, not a gate: it always exits 0.
//
// Where the words live (the same order the site uses, site/scripts/build-index.mjs):
//   catalogue-items/display-copy.yaml        approved display edits; they win on the site
//   catalogue-items/<group>/<slug>/page.yaml name, headline, subhead, summary (workflows may use tools/orchestrator-pages)
//   catalogue-items/<group>/<slug>/item.yaml name, summary. Agent packs read these two (marketplace/scripts/build-packs.mjs),
//                                            so when they differ from the site's they are checked as "pack name" and "pack summary".
//   catalogue-items/minds/<slug>/mind.yaml   name (the person), summary, subhead
//   catalogue-items/ai-tools/<slug>.yaml     name (the product), promise
//
// What it flags, with the points each adds to an item's score:
//   acronym        an acronym the field never spells out or explains, and that is not on the short known list
//   insider-term   our own jargon, trade shorthand or a consultancy word with no plain explanation beside it
//   hype-word      a word docs/WRITING.md bans
//   long-name      a name over 6 words or 45 characters (workflows: over 9 words or 60 characters)
//   unclear-name   a name that does not say what the item is or makes (no role, no output, no action)
//   name-format    a colon, a slug or code-like token, or Title Case Throughout in a name
//   no-result      a summary whose opening does not say what you get
//   hard-summary   a summary above reading grade 10 (tools/readability.mjs)
//   hard-subhead   a subhead above reading grade 10
//   banned-claim   an em dash, an exclamation mark, a price, "beta" or a human-review claim
//   pack-name-differs  the pack (item.yaml) shows a different name from the site
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { grade } from "./readability.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---------- The word lists ----------

/** Acronyms a small-business owner already knows. Keep this short: anything else needs spelling out where it is used. */
export const KNOWN_ACRONYMS = new Set([
  "AI", "SEO", "PDF", "FAQ", "FAQS", "URL", "CSV", "HTML", "CRM", "B2B", "B2C", "VAT", "GDPR", "GST",
  "UK", "US", "USA", "EU", "UAE", "USD", "GBP", "EUR", "INR",
  "CEO", "HR", "IT", "PR", "TV", "ID", "OK", "SMS", "DIY", "QR", "CV", "ROI", "LLC", "ATM", "GPS", "Q&A", "PC",
  "PNG", "JPG", "GIF", "MP3", "MP4", "ZIP", "DOCX", "PPTX", "IRS", "HMRC", "DM", "DMS", "AM", "PM", "VIP", "DNA",
]);

/** Plain words that copy sometimes puts in capitals (verdicts, file names). They are not shorthand. */
const PLAIN_CAPITALS = new Set(["NOT", "READY", "FAILED", "FAIL", "PASS", "PASSED", "GO", "NO", "YES", "HOLD", "KILL", "STOP", "NEEDS", "WORK", "CHECKED", "REQUIRED", "MISSING",
  "AND", "OR", "AND/OR", "VS", "DO", "DONE", "TODO", "NEW", "FREE", "STEP", "README", "DESIGN", "AGENTS", "SKILL", "CLAUDE", "NEXT", "NOTE", "DRAFT", "FIX", "KEEP", "CUT", "SCALE", "WATCH"]);

/** Names of products, companies and standards bodies written in capitals. They are names, not shorthand. */
export const NAMED_IN_CAPITALS = new Set([
  "AWS", "IBM", "SAP", "HP", "BBC", "NASA", "IKEA", "NHS", "MIT", "IOS", "GPT", "TED", "IDEO", "BMW", "DHL", "UPS", "USPS",
  "ASOS", "LEGO", "NFL", "NBA", "FIFA", "HBO", "CNN", "ESPN", "AMD", "LVMH", "AT&T", "H&M", "P&G", "3M", "GA4", "DALL", "SQL", "CSS",
  "MATLAB", "QGIS", "VEED", "MUJI", "FBI", "NIH", "NSF", "BGPT", "ESP32", "BI", // "Power BI"
]);

/** Shorthand with its plain meaning, used in the report so the fix is obvious. Not a second allow-list. */
const ACRONYM_MEANINGS = {
  KPI: "the numbers you track", KPIS: "the numbers you track", OKR: "goals with measurable results", OKRS: "goals with measurable results",
  CRO: "getting more visitors to buy", PDP: "product page", UGC: "customer-style video", CTA: "the button or line that asks people to act",
  CAC: "cost to win a customer", LTV: "what a customer is worth over time", CLV: "what a customer is worth over time", AOV: "average order size",
  ROAS: "sales per pound or dollar of ad spend", CPA: "cost per sale or lead", CPC: "cost per click", CPM: "cost per thousand views", CTR: "share of people who click",
  PPC: "pay-per-click ads", SEM: "paid search ads", ICP: "your best-fit customer", TAM: "total market size", SAM: "the market you can serve", SOM: "the market you can win",
  MVP: "first working version", PRD: "product plan document", PMF: "proof people want it", GTM: "launch and sales plan", JTBD: "the job a customer hires a product for",
  API: "a way for software to talk to other software", SDK: "a kit for building on a product", MCP: "a way to connect tools to your AI", LLM: "AI model", RAG: "AI that looks things up in your files",
  UI: "what people see and click", UX: "how easy it is to use", QA: "testing", "CI/CD": "automatic build and release", CI: "automatic checks on code", PR: "code change request",
  SOP: "written steps for a routine job", SOPS: "written steps for routine jobs", SLA: "promised response time", SLAS: "promised response times", RFP: "request for bids", RFPS: "requests for bids",
  "P&L": "profit and loss", COGS: "cost of the goods you sell", EBITDA: "profit before interest, tax and write-downs", ARR: "yearly recurring income", MRR: "monthly recurring income",
  NPS: "would-you-recommend score", CSAT: "customer satisfaction score", SWOT: "strengths, weaknesses, chances and threats", WCAG: "the web accessibility standard",
  SKU: "one product line you stock", SKUS: "product lines you stock", "3PL": "outside warehouse and shipping firm", MOQ: "smallest order a supplier takes",
  ESP: "email sending service", DNS: "the settings that point your web address", SSL: "site security certificate", GEO: "getting named in AI answers", AEO: "getting named in AI answers",
  SERP: "search results page", ABM: "selling to a list of named companies", MQL: "lead marketing passes to sales", SDR: "sales rep who books first calls", BDR: "sales rep who books first calls",
  POC: "small trial", ETL: "moving and cleaning data", ERP: "business management software", POS: "till system", KYC: "identity checks", NDA: "confidentiality agreement", MSA: "main services contract", SOW: "statement of work",
};

/** Insider terms and consultancy words. Each needs a plain phrase instead, or a short explanation in the same field. */
export const INSIDER_TERMS = [
  // Our own jargon (docs/WRITING.md)
  ["brand brain", "your brand file"], ["awareness stage", "how much the buyer already knows"], ["lever snippet", "a setting you can change"],
  ["native ad", "an ad made to look like a normal post"], ["advertorial", "an ad written like an article"], ["static ad", "an image ad"],
  ["orchestrator", "workflow"], ["input type", "what you give it"],
  // Trade shorthand
  ["saas", "software sold by subscription"], ["devops", "running and releasing software"], ["mlops", "running AI models in production"], ["finops", "cloud cost control"],
  ["go-to-market", "launch and sales plan"], ["go to market", "launch and sales plan"], ["north star", "the one number that matters most"], ["flywheel", "a loop where each win feeds the next"],
  ["omnichannel", "every place you sell"], ["touchpoint", "each time a customer meets you"], ["top of funnel", "people who have just heard of you"], ["bottom of funnel", "people close to buying"],
  ["full-funnel", "from first view to sale"], ["full funnel", "from first view to sale"], ["mid-funnel", "people weighing you up"],
  ["lead magnet", "a free item given for an email address"], ["tripwire", "a low-cost first offer"], ["unit economics", "what you make and spend on each sale"],
  ["incrementality", "sales the ads really caused"], ["attribution", "which ad or channel gets credit for a sale"], ["cohort", "a group of customers who joined at the same time"],
  ["churn", "customers who leave"], ["persona", "a picture of a typical customer"], ["ideal customer profile", "your best-fit customer"], ["value proposition", "why someone should buy from you"],
  ["jobs to be done", "the job a customer hires a product for"], ["jobs-to-be-done", "the job a customer hires a product for"], ["moat", "what stops rivals copying you"],
  ["heuristic", "rule of thumb"], ["taxonomy", "a set of categories"], ["ontology", "a map of how things relate"], ["schema markup", "labels that help search engines read a page"],
  ["agentic", "AI that takes steps by itself"], ["multi-agent", "several AIs working together"], ["subagent", "a helper AI"], ["sub-agent", "a helper AI"], ["embedding", "numbers that stand for meaning"], ["embeddings", "numbers that stand for meaning"],
  ["vector database", "a store for searching by meaning"], ["fine-tuning", "training a model on your examples"], ["fine-tune", "train a model on your examples"], ["prompt engineering", "writing instructions for an AI"],
  ["context window", "how much an AI can read at once"], ["token budget", "how much an AI can read at once"], ["guardrails", "safety rules"], ["evals", "tests for AI output"],
  ["product backlog", "the list of work waiting"], ["sprint backlog", "the list of work waiting"], ["scrum", "a way of running work in short rounds"], ["kanban", "a board of work in columns"], ["retrospective", "a look back at what went well and badly"],
  ["postmortem", "a review of what went wrong"], ["post-mortem", "a review of what went wrong"], ["runbook", "written steps for a known problem"], ["idempotent", "safe to run twice"],
  ["refactor", "tidy code without changing what it does"], ["refactoring", "tidying code without changing what it does"], ["linting", "automatic code style checks"], ["monorepo", "one code store for many projects"],
  ["microservices", "an app split into small services"], ["observability", "seeing what a system is doing"], ["telemetry", "usage and health data"], ["middleware", "code that sits between two systems"],
  ["boilerplate", "starter code"], ["scaffold", "starter files"], ["scaffolding", "starter files"], ["codebase", "all the code of a project"], ["tech debt", "shortcuts in code that cost time later"], ["technical debt", "shortcuts in code that cost time later"],
  ["dedupe", "remove repeats"], ["deduplication", "removing repeats"], ["holdout", "a group kept out of a test to compare against"], ["above the fold", "what shows before you scroll"],
  // Consultancy words
  ["stakeholder alignment", "getting the people involved to agree"], ["strategic alignment", "agreeing the plan"], ["deliverable", "the finished piece of work"], ["deliverables", "the finished pieces of work"],
  ["methodology", "method"], ["methodologies", "methods"], ["framework", "method"], ["frameworks", "methods"], ["operationalize", "put into practice"], ["operationalise", "put into practice"],
  ["actionable insights", "findings you can act on"], ["actionable", "you can act on"], ["best practices", "what works"], ["best practice", "what works"], ["learnings", "lessons"], ["cadence", "how often"],
  ["bandwidth", "time"], ["pain points", "problems"], ["pain point", "problem"], ["low-hanging fruit", "quick wins"], ["thought leadership", "expert articles"], ["ideation", "coming up with ideas"],
  ["value-add", "extra value"], ["core competency", "what you do best"], ["core competencies", "what you do best"], ["mission-critical", "essential"], ["end-to-end", "from start to finish"],
  ["enablement", "training and tools"], ["optimization", "improvement"], ["optimisation", "improvement"], ["comprehensive", "full"], ["strategic", ""], ["scalable", "able to grow"],
  ["cross-functional", "across teams"], ["workstream", "line of work"], ["workstreams", "lines of work"], ["synergies", ""], ["mindshare", ""], ["verticals", "industries"], ["evangelist", ""],
  ["upskill", "train"], ["upskilling", "training"], ["ideate", "come up with ideas"], ["impactful", "useful"], ["expert-level", ""], ["production-ready", "ready to use"], ["production-grade", "ready to use"],
  ["enterprise-grade", ""], ["battle-tested", ""], ["state-of-the-art", ""], ["industry-leading", ""], ["data-driven", "based on your numbers"],
];

/** Words docs/WRITING.md bans outright. */
export const HYPE_WORDS = ["delve", "foster", "leverage", "utilize", "utilise", "facilitate", "empower", "streamline", "robust", "cutting-edge", "game changer", "game-changer", "unlock", "supercharge", "harness", "elevate", "seamless", "seamlessly", "effortless", "effortlessly", "transformative", "revolutionize", "revolutionise", "paradigm", "synergy", "holistic", "ecosystem", "best-in-class", "world-class", "next-level", "magic", "ultimate", "10x"];

// A name says what the item is when it carries a role, an output or an action.
const ROLE_WORDS = new Set(("checker writer builder planner finder auditor editor scorer maker reviewer generator calculator tracker analyser analyzer creator designer picker sorter cleaner "
  + "converter extractor summariser summarizer translator rewriter improver fixer tester researcher advisor adviser coach guide helper assistant agent manager organiser organizer scheduler estimator "
  + "forecaster monitor optimiser optimizer mapper matcher grader interviewer explainer drafter responder screener selector simulator validator verifier detector debugger composer curator "
  + "director producer strategist specialist analyst consultant engineer developer architect accountant bookkeeper recruiter negotiator moderator facilitator teacher tutor trainer mentor critic "
  + "investigator inspector scanner scraper importer exporter formatter compiler comparer comparator profiler prioritiser prioritizer router triager scout watcher keeper runner sweeper "
  + "evaluator reader lister labeller labeler tagger namer ranker merger splitter trimmer polisher proofreader copywriter storyteller scriptwriter ghostwriter brainstormer partner expert lead "
  + "officer controller coordinator administrator executive representative rep marketer buyer seller support desk team council panel board crew").split(/\s+/));
const OUTPUT_WORDS = new Set(("plan brief report checklist template email emails letter script scripts prompt prompts post posts ad ads page pages deck slide slides summary audit review test tests check checks "
  + "calendar list table chart dashboard spreadsheet sheet budget forecast model policy contract proposal quote invoice estimate schedule agenda minutes notes outline draft copy headline headlines "
  + "caption captions newsletter article blog story stories video videos image images photo photos logo diagram map roadmap strategy analysis study survey quiz form faq guide handbook manual "
  + "playbook kit pack toolkit library file files document documents doc docs memo pitch résumé resume profile bio description descriptions listing listings catalogue catalog scorecard score "
  + "tracker log register record records workflow routine setup system process procedure rules rulebook standard standards message messages reply replies response responses answer answers "
  + "question questions interview feedback critique comparison breakdown teardown calculator sequence campaign funnel offer bundle price pricing website site app tool code query formula "
  + "statement statements update updates announcement release changelog ticket tickets issue spec specification requirements instructions steps lesson course curriculum workshop session "
  + "ideas names keywords tags titles hooks lines angles concepts themes examples samples mockup wireframe prototype design designs layout styleguide palette storyboard shot shots screenplay "
  + "transcript translation rewrite edit edits fix fixes cleanup conversion export import backup search research lookup finder digest recap round-up roundup brainstorm").split(/\s+/));
const ACTION_WORDS = new Set(("write make build plan find check audit review turn create draft fix clean sort pick choose compare score track run set start launch grow get keep learn test measure read "
  + "answer reply respond send prepare organise organize summarise summarize translate rewrite edit improve design map price sell buy hire train teach explain decide prove show tell share "
  + "give work cut reduce raise lower win recover collect chase close open move change update add remove merge split convert export import research analyse analyze forecast budget schedule book "
  + "handle manage ship pack stock order return refund onboard welcome thank ask name brand film shoot record publish post pitch present negotiate know see spot catch stop avoid protect secure "
  + "back save restore speed think study practise practice rehearse brainstorm interview screen rank shortlist put bring take go do use try help let stay rank host spend bid place file claim "
  + "calculate estimate work-out generate produce extract gather document describe define outline list log verify validate debug deploy install connect automate migrate scan search monitor "
  + "hand size mine reconcile leave reorder trace reach value tailor cost investigate standardize standardise match adapt capture proofread mask count vet model replace submit clarify rebuild "
  + "recheck look notice develop talk group examine separate simplify shape select load switch preview compress sharpen focus listen tag reflect coach pull pause request settle weigh "
  + "stress-test untangle shrink state hold line punch predict finish understand mark slow reproduce apply ease resolve combine trim code tune tighten balance tidy chat inspect act remake "
  + "speak repeat reframe plot embed link point attach paste provide explore cover prioritise prioritize rescue repair retire renew replan relaunch").split(/\s+/));

// Words that end like a role but are not one.
const NOT_ROLES = new Set("customer user offer number paper order error vendor visitor competitor folder computer server browser container cluster power water winter summer matter chapter quarter member employer color colour factor sector behavior behaviour career cover layer router driver trigger corner center centre disaster answer shopper buyer supplier owner founder manager-free other another whether together either neither under over after never ever however".split(" "));
const GIVE_VERBS = /^(share|paste|give|upload|bring|describe|tell|name|enter|provide|send|attach|drop|type|say|feed|hand|supply|state|submit|specify|forward|pass|input|note)\b/i;
// An opening that says what comes back: "Get a ...", "Writes ...", "Turns X into Y", "Find ...", "A plan for ...".
const RESULT_OPENING = /\b(get|gets|receive|receives|you get|you'll get|returns?|produces?|creates?|writes?|drafts?|builds?|makes?|generates?|finds?|checks?|turns?|converts?|gives?|shows?|lists?|scores?|ranks?|plans?|maps?|reviews?|audits?|tests?|fix(?:es)?|rewrites?|edits?|summari[sz]es?|compares?|calculates?|estimates?|tracks?|sorts?|picks?|designs?|explains?|flags?|spots?|catch(?:es)?|tells?|works out|sets up|lays out|breaks down|cleans?|organi[sz]es?|prepares?|answers?|identif(?:y|ies)|measures?|forecasts?|prices?|translates?|extracts?|pulls?|groups?|suggests?|recommends?|decides?|chooses?|helps you|learn|see|know|leave with|walk away with|come away with|end up with|hands? (?:you|back))\b/i;
const VAGUE_OPENING = /^(use (?:this )?when|when (?:you|the|a|an|your)|for (?:when|any|teams|people|anyone)|helps\b|help (?:with|for)\b|expert\b|comprehensive\b|advanced\b|professional\b|a (?:skill|prompt|workflow|framework|tool|guide|system|method|set|collection|library) (?:for|that|to|of)\b|an? (?:expert|senior|specialist|experienced)\b|this (?:skill|prompt|workflow|agent|tool)\b|guidance\b|guide(?:s|lines)? (?:for|to|on)\b|best practices\b|everything\b|all about\b|covers?\b|provides? (?:guidance|expertise|support|a framework)\b|specialist in\b|specializ|specialis|responsible for\b|act(?:s)? as\b|you are\b|i am\b|i help\b)/i;

// ---------- The checks (pure: text in, reasons out) ----------

const wordsIn = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SMALL = new Set(["of", "and", "the", "to", "for", "per", "in", "on", "a", "an", "by", "or", "with", "at", "from"]);

/** The acronyms in a piece of text: two or more capitals, digits and "&" allowed ("B2B", "P&L", "3PL", "KPIs", "CI/CD"). */
export function acronymsIn(text) {
  const found = [];
  const re = /(?<![A-Za-z0-9])(?:[A-Z]{1,4}\/[A-Z]{2,4}|[0-9]?[A-Z][A-Z0-9&]*[A-Z0-9])(s)?(?![A-Za-z0-9])/g;
  for (const m of String(text ?? "").matchAll(re)) {
    const raw = m[0], base = (m[1] ? raw.slice(0, -1) : raw).toUpperCase();
    if ((raw.match(/[A-Z]/g) ?? []).length < 2) continue;
    found.push({ raw, base, index: m.index });
  }
  return found;
}

/** True when the text itself says what the shorthand means: a bracket beside it, or the spelled-out words nearby. */
export function explainedInField(term, text) {
  const t = String(text ?? ""), e = escape(term);
  // "KPI (the numbers you track)", and "a REST API plan (a standard way for software to use yours)".
  if (new RegExp(`(?<![A-Za-z0-9])${e}s?(?:\\s+[\\w.-]+){0,2}\\s*\\((?!s\\))[^)]{3,}\\)`, "i").test(t)) return true;
  // The plain words first, the shorthand in brackets: "key performance indicators (KPIs)", "your sender records (SPF, DKIM and DMARC)".
  if (new RegExp(`[a-z]\\s*\\([^)]*(?<![A-Za-z0-9])${e}s?(?![A-Za-z0-9])[^)]*\\)`, "i").test(t)) return true;
  // Named as an example of a plain thing: "a security standard such as SOC 2 or ISO 27001".
  if (new RegExp(`\\b(?:such as|called|known as|named)\\b[^.;:()]{0,70}(?<![A-Za-z0-9])${e}(?![A-Za-z0-9])`, "i").test(t)) return true;
  if (new RegExp(`${e}s?,? (?:meaning|which means|that is|short for|stands for)\\b`, "i").test(t)) return true;
  // Spelled out: a run of words whose first letters make the acronym ("search engine optimisation" for SEO).
  const letters = term.replace(/[^A-Za-z]/g, "").toLowerCase();
  if (letters.length >= 2 && /^[A-Z0-9&/]+$/.test(term)) {
    const ws = t.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/[\s-]+/).filter((w) => w && !SMALL.has(w));
    for (let i = 0; i + letters.length <= ws.length; i++) if (ws.slice(i, i + letters.length).map((w) => w[0]).join("") === letters) return true;
  }
  return false;
}

/** Flags unexplained shorthand in one field. `also` is other text read with it: a name sits on its card with the
 *  summary, so a term in the name counts as explained when the summary explains it. */
function shorthand(field, text, out, points, also = "", hype = true) {
  const seen = new Set();
  for (const a of acronymsIn(text)) {
    if (KNOWN_ACRONYMS.has(a.base) || NAMED_IN_CAPITALS.has(a.base) || PLAIN_CAPITALS.has(a.base) || /^[IVX]+$/.test(a.base) || seen.has(a.base)) continue;
    seen.add(a.base);
    const term = a.raw === a.base ? a.raw : a.raw.slice(0, -1);
    if (explainedInField(term, text) || (also && explainedInField(term, also))) continue;
    const meaning = ACRONYM_MEANINGS[a.base];
    out.push({ reason: "acronym", field, points, detail: `"${a.raw}" is not explained${also ? " in the name or the summary" : ""}${meaning ? ` (say "${meaning}")` : ""}` });
  }
  const low = ` ${String(text ?? "").toLowerCase()} `;
  const hit = new Set();
  for (const [term, plain] of INSIDER_TERMS) {
    if (!new RegExp(`(^|[^a-z])${escape(term)}([^a-z]|$)`).test(low) || hit.has(term)) continue;
    // A longer term already reported covers its own shorter part ("best practices" over "best practice").
    if ([...hit].some((h) => h.includes(term))) continue;
    hit.add(term);
    if (explainedInField(term, text) || (also && explainedInField(term, also))) continue;
    out.push({ reason: "insider-term", field, points, detail: `"${term}"${plain ? ` (say "${plain}")` : ""}` });
  }
  if (hype) for (const w of HYPE_WORDS) if (new RegExp(`(^|[^a-z0-9])${escape(w)}(s|d|ed|ing)?([^a-z]|$)`).test(low)) out.push({ reason: "hype-word", field, points: 2, detail: `"${w}"` });
}

/** True when a name says what the item is or makes: a role ("checker"), an output ("plan") or an action ("Write ..."). */
export function nameSaysWhat(name) {
  const ws = String(name ?? "").toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/).filter(Boolean);
  if (ws.length < 2) return false;
  if (ACTION_WORDS.has(ws[0])) return true;
  // The last word is the head of the name: "... collector", "... psychologist", "... reconciler" are all roles.
  const last = ws.at(-1).replace(/s$/, "");
  if (last.length >= 5 && /(?:er|or|ist|ian|eer)$/.test(last) && !NOT_ROLES.has(last)) return true;
  return ws.some((w) => { const s = w.replace(/'s$/, ""); return ROLE_WORDS.has(s) || OUTPUT_WORDS.has(s) || ROLE_WORDS.has(s.replace(/s$/, "")) || OUTPUT_WORDS.has(s.replace(/s$/, "")) || s.split("-").some((p) => ROLE_WORDS.has(p) || OUTPUT_WORDS.has(p)); });
}

/** The first sentence of a summary, and the one after it. */
export function firstSentences(text) {
  const parts = String(text ?? "").replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/);
  return [parts[0] ?? "", parts[1] ?? ""];
}

// Openings that are not an action: a topic, an audience or a condition instead of what the item does.
// A list of what comes back ("A renewal brief with deadlines and options.") does say what you get, so articles are not here.
const NOT_AN_ACTION = new Set("this that these those with for when if is are was not after before first your you our it its expert comprehensive advanced professional complete full deep everything all guidance tools tool skill prompt workflow agent helps covers provides specialist senior".split(" "));

/** True when the opening of a summary says what you get. The house card line is "Give X. Get Y." (docs/PAGE-FORMAT.md),
 *  so a "what you give" sentence passes when the result follows straight after it. It fails when the opening is a topic,
 *  an audience or a condition ("Expert guidance on ...", "Use when ...", "A framework for ..."), or says only what you give. */
export function summarySaysResult(summary, kind = "skill") {
  const [first, second] = firstSentences(summary);
  if (!first) return false;
  const says = /\b(get|gets|you get|you'll get|receive|receives|leave with|walk away with|come away with)\b/i;
  if (says.test(first)) return true;
  const opener = (first.match(/^[A-Za-z'-]+/)?.[0] ?? "").toLowerCase();
  if (VAGUE_OPENING.test(first) || NOT_AN_ACTION.has(opener) || !opener) return false;
  // A mind's summary is its advice and a tool's promise is what the product does, so their opening verb is the result.
  if (kind !== "mind" && kind !== "tool" && GIVE_VERBS.test(first)) {
    // "Share your page to see what stops people buying." gives and gets in one sentence.
    if (/\b(and (?:it|this|the skill|the agent|you|see|find|check|learn)\b|then\b|into\b|so (?:you|it|that)\b|to [a-z]+\b|before you\b|for\b)/i.test(first.replace(/^\S+\s+(?:it|me|us)\s+/i, ""))) return true;
    // "Share debt terms and fees. Separate the amount owed from the cash received." The second sentence is the result.
    const next = (second.match(/^[A-Za-z'-]+/)?.[0] ?? "").toLowerCase();
    return RESULT_OPENING.test(second) || (!!next && !VAGUE_OPENING.test(second) && !NOT_AN_ACTION.has(next) && !GIVE_VERBS.test(second));
  }
  return true; // an action verb: "Match supply to demand by date." says what it does
}

const LIMITS = { name: { words: 6, chars: 45 }, workflow: { words: 9, chars: 60 } };

/**
 * Checks one item's words. `kind` is skill, prompt, workflow, agent, mind or tool. Minds are named after people and
 * tools after products, so their names are left alone. `pack` holds the name and summary the agent packs read, when
 * they differ from the site's. Returns the reasons, each with the field and the points it adds.
 */
export function checkCopy({ kind = "skill", name = "", headline = "", subhead = "", summary = "", pack = null } = {}) {
  const out = [];
  const named = kind === "mind" || kind === "tool"; // a person's or a product's name
  const nameChecks = (field, value) => {
    const n = wordsIn(value).length, limit = kind === "workflow" ? LIMITS.workflow : LIMITS.name;
    if (n > limit.words || String(value).length > limit.chars) out.push({ reason: "long-name", field, points: 2 + (n > limit.words + 3 ? 1 : 0), detail: `${n} words, ${String(value).length} characters` });
    if (!nameSaysWhat(value)) out.push({ reason: "unclear-name", field, points: 3, detail: n < 2 ? "one word; it does not say what the item is or makes" : "no role, output or action word; it does not say what the item is or makes" });
    const format = [];
    if (/:/.test(value)) format.push("a colon");
    if (/[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/.test(value) && !/\s/.test(String(value).trim())) format.push("it reads like a slug");
    if (/[_{}<>]|\.(md|py|js|json|yaml)\b/.test(value)) format.push("code-like characters");
    const ws = wordsIn(value).filter((w) => /^[A-Za-z]/.test(w));
    // Every word capitalised ("Test Automation Engineer agent"). A product name inside a sentence-case name is fine ("Power BI report checker").
    const body = ws.slice(1).filter((w) => !SMALL.has(w.toLowerCase()) && w.toLowerCase() !== "agent");
    if (ws.length >= 3 && body.length >= 2 && body.every((w) => /^[A-Z][a-z]/.test(w))) format.push("Title Case; names use sentence case");
    if (format.length) out.push({ reason: "name-format", field, points: 1, detail: format.join("; ") });
  };
  const summaryChecks = (field, value) => {
    if (!String(value ?? "").trim()) { out.push({ reason: "no-result", field, points: 4, detail: "no summary at all" }); return; }
    if (!summarySaysResult(value, kind)) out.push({ reason: "no-result", field, points: 3, detail: `opens with "${wordsIn(firstSentences(value)[0]).slice(0, 8).join(" ")}${wordsIn(firstSentences(value)[0]).length > 8 ? " ..." : ""}", which does not say what you get` });
    const g = grade(value);
    if (g > 10) out.push({ reason: "hard-summary", field, points: g > 13 ? 3 : 2, detail: `reading grade ${g}` });
    const n = wordsIn(value).length;
    if (n > 30) out.push({ reason: "hard-summary", field, points: 1, detail: `${n} words; a card line is 25 at most` });
  };
  const claims = (field, value) => {
    const t = String(value ?? "");
    const hits = [];
    if (/[—–]/.test(t)) hits.push("a dash used as punctuation");
    if (/!/.test(t)) hits.push("an exclamation mark");
    if (/(?:[$£€₹]\s?\d|\b\d+(?:\.\d+)?\s?(?:dollars|pounds|rupees|euros)\b)/i.test(t) && /\b(costs?|price[ds]?|only|just|per month|a month|\/mo|free trial)\b/i.test(t)) hits.push("a price");
    if (/\b(?:in beta|beta (?:version|feature|release of this)|\(beta\)|still beta)\b/i.test(t)) hits.push('"beta" said of the item itself');
    if (/\b(human[- ]reviewed|reviewed by (?:a |our )?(?:human|expert|person|team)s?|expert[- ]reviewed|hand[- ]checked|vetted by)\b/i.test(t)) hits.push("a human-review claim");
    if (hits.length) out.push({ reason: "banned-claim", field, points: 2, detail: hits.join("; ") });
  };

  if (!named) nameChecks("name", name);
  shorthand("name", name, out, 3, `${summary} ${subhead}`, !named);
  claims("name", name);
  if (headline && headline !== name) { shorthand("headline", headline, out, 2); claims("headline", headline); if (wordsIn(headline).length > 12) out.push({ reason: "long-name", field: "headline", points: 1, detail: `${wordsIn(headline).length} words` }); }
  summaryChecks("summary", summary);
  shorthand("summary", summary, out, 2);
  claims("summary", summary);
  if (subhead && subhead !== summary) {
    shorthand("subhead", subhead, out, 1);
    claims("subhead", subhead);
    const g = grade(subhead);
    if (g > 10) out.push({ reason: "hard-subhead", field: "subhead", points: g > 13 ? 2 : 1, detail: `reading grade ${g}` });
  }
  if (pack) {
    if (pack.name && pack.name !== name) {
      out.push({ reason: "pack-name-differs", field: "pack name", points: 1, detail: `agent packs show "${pack.name}"` });
      if (!named) nameChecks("pack name", pack.name);
      shorthand("pack name", pack.name, out, 2, pack.summary || summary);
    }
    if (pack.summary && pack.summary !== summary) { summaryChecks("pack summary", pack.summary); shorthand("pack summary", pack.summary, out, 1); }
  }
  return out;
}

export const scoreOf = (reasons) => reasons.reduce((n, r) => n + r.points, 0);

// ---------- Reading the library ----------

/** Only the named top-level keys of a YAML file, parsed. Page files are long; the first-read copy is a few lines. */
export function pickKeys(text, keys) {
  const want = new Set(keys), lines = String(text).replace(/^\uFEFF/, "").split(/\r?\n/), kept = [];
  let keep = false;
  for (const line of lines) {
    const top = /^([A-Za-z_][\w-]*):/.exec(line);
    if (top) keep = want.has(top[1]);
    else if (/^\S/.test(line) && !/^#/.test(line)) keep = false; // "---", a list item at column 0, anything else that ends the block
    if (keep) kept.push(line);
  }
  const whole = () => { try { const all = YAML.parse(String(text)) ?? {}; return Object.fromEntries(keys.filter((k) => k in all).map((k) => [k, all[k]])); } catch { return {}; } };
  if (!kept.length) return /^\s*\{/.test(text) ? whole() : {};
  try { return YAML.parse(kept.join("\n")) ?? {}; } catch { try { const all = YAML.parse(String(text)) ?? {}; return Object.fromEntries(keys.filter((k) => k in all).map((k) => [k, all[k]])); } catch { return {}; } }
}

const str = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const GROUPS = ["general", "ecommerce", "imported", "agents", "orchestrators"];

/** How many toolboxes name each library slug (marketplace/packs/roles/<role>/toolbox.json). */
export function toolboxCounts(root = ROOT) {
  const counts = new Map(), dir = path.join(root, "marketplace", "packs", "roles");
  if (!fs.existsSync(dir)) return counts;
  for (const role of fs.readdirSync(dir)) {
    const file = path.join(dir, role, "toolbox.json");
    if (!fs.existsSync(file)) continue;
    let box;
    try { box = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "")); } catch { continue; }
    const seen = new Set();
    for (const task of box.tasks ?? []) for (const it of task.items ?? []) {
      const m = /^library:(.+)$/.exec(String(it?.ref ?? ""));
      if (m && !seen.has(m[1])) { seen.add(m[1]); counts.set(m[1], (counts.get(m[1]) ?? 0) + 1); }
    }
  }
  return counts;
}

/** Every item with the words a visitor reads (`site`) and the words an agent pack reads (`pack`). */
export function loadItems(root = ROOT) {
  const items = [], cat = path.join(root, "catalogue-items");
  const read = (f) => fs.readFileSync(f, "utf8");
  const copy = fs.existsSync(path.join(cat, "display-copy.yaml")) ? YAML.parse(read(path.join(cat, "display-copy.yaml"))) ?? {} : {};
  const held = fs.existsSync(path.join(cat, "quarantine.yaml")) ? new Set(Object.keys(YAML.parse(read(path.join(cat, "quarantine.yaml"))) ?? {})) : new Set();
  const seen = new Set();
  for (const group of GROUPS) {
    const dir = path.join(cat, group);
    if (!fs.existsSync(dir)) continue;
    for (const slug of fs.readdirSync(dir).sort()) {
      const itemFile = path.join(dir, slug, "item.yaml");
      if (!fs.existsSync(itemFile) || seen.has(slug) || held.has(slug)) continue;
      seen.add(slug);
      const item = pickKeys(read(itemFile), ["name", "summary", "type", "category"]);
      const pageFile = [path.join(dir, slug, "page.yaml"), path.join(root, "tools", "orchestrator-pages", `${slug}.yaml`)].find((f) => fs.existsSync(f));
      const page = pageFile ? pickKeys(read(pageFile), ["name", "headline", "subhead", "summary"]) : {};
      const edit = copy[slug] ?? {};
      const kind = item.type === "agent" || item.type === "prompt" ? item.type : item.type === "workflow" || item.type === "routine" || item.category === "orchestrator" || group === "orchestrators" ? "workflow" : "skill";
      const name = str(edit.name) || str(page.name) || str(item.name) || slug;
      items.push({ slug, kind, group, files: { item: itemFile, page: pageFile ?? null, displayCopy: !!copy[slug] },
        site: { name, headline: edit.name ? str(edit.name) : str(page.headline), subhead: str(edit.subhead) || str(page.subhead), summary: str(edit.summary) || str(page.summary) || str(item.summary) },
        pack: { name: str(item.name) || slug, summary: str(item.summary) } });
    }
  }
  const minds = path.join(cat, "minds");
  if (fs.existsSync(minds)) for (const slug of fs.readdirSync(minds).sort()) {
    const file = path.join(minds, slug, "mind.yaml");
    if (!fs.existsSync(file) || seen.has(slug) || held.has(slug)) continue;
    seen.add(slug);
    const m = pickKeys(read(file), ["name", "summary", "subhead"]), edit = copy[slug] ?? {};
    const summary = str(edit.summary) || str(m.summary);
    items.push({ slug, kind: "mind", group: "minds", files: { item: file, page: null, displayCopy: !!copy[slug] },
      site: { name: str(m.name) || slug, headline: str(m.name), subhead: str(edit.subhead) || str(m.subhead) || summary, summary },
      pack: { name: str(m.name) || slug, summary: str(m.summary) } });
  }
  const tools = path.join(cat, "ai-tools");
  if (fs.existsSync(tools)) for (const f of fs.readdirSync(tools).filter((x) => x.endsWith(".yaml") && !x.startsWith("_")).sort()) {
    const slug = f.slice(0, -5);
    if (seen.has(slug)) continue;
    seen.add(slug);
    const t = pickKeys(read(path.join(tools, f)), ["name", "promise"]);
    items.push({ slug, kind: "tool", group: "ai-tools", files: { item: path.join(tools, f), page: null, displayCopy: false },
      site: { name: str(t.name) || slug, headline: str(t.name), subhead: "", summary: str(t.promise) }, pack: { name: str(t.name) || slug, summary: str(t.promise) } });
  }
  return items;
}

/** The whole report: every item with its reasons and score, worst first, and the counts by reason. */
export function buildReport({ root = ROOT, toolboxOnly = false, slugs = null } = {}) {
  const used = toolboxCounts(root);
  const all = loadItems(root);
  let items = all;
  if (toolboxOnly) items = items.filter((it) => used.has(it.slug));
  if (slugs?.length) items = items.filter((it) => slugs.includes(it.slug));
  // Names must be unique across the whole library, so a clash is looked for among every item, not only the ones listed.
  const names = new Map();
  for (const it of all) { const k = it.site.name.toLowerCase(); names.set(k, [...(names.get(k) ?? []), it.slug]); }
  const rows = items.map((it) => {
    const reasons = checkCopy({ kind: it.kind, ...it.site, pack: it.pack });
    const twins = (names.get(it.site.name.toLowerCase()) ?? []).filter((s) => s !== it.slug);
    if (twins.length) reasons.push({ reason: "duplicate-name", field: "name", points: 2, detail: `also the name of ${twins.slice(0, 3).join(", ")}` });
    return { slug: it.slug, kind: it.kind, group: it.group, toolboxes: used.get(it.slug) ?? 0, name: it.site.name, summary: it.site.summary, packName: it.pack.name, score: scoreOf(reasons), reasons };
  }).sort((a, b) => b.score - a.score || b.toolboxes - a.toolboxes || a.slug.localeCompare(b.slug));
  const byReason = {}, itemsByReason = {};
  for (const r of rows) {
    for (const x of r.reasons) byReason[x.reason] = (byReason[x.reason] ?? 0) + 1;
    for (const reason of new Set(r.reasons.map((x) => x.reason))) itemsByReason[reason] = (itemsByReason[reason] ?? 0) + 1;
  }
  return { scope: toolboxOnly ? "items named by a toolbox.json" : "every library item", checked: rows.length, flagged: rows.filter((r) => r.score > 0).length, clean: rows.filter((r) => r.score === 0).length, itemsByReason, flagsByReason: byReason, items: rows };
}

// ---------- Command line ----------

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const slugs = args.flatMap((a, i) => (a === "--slug" && args[i + 1] ? [args[i + 1]] : []));
  const min = Number(args[args.indexOf("--min") + 1]) || 0;
  const root = args.includes("--root") ? path.resolve(args[args.indexOf("--root") + 1]) : ROOT; // another checkout, or a test folder
  const report = buildReport({ root, toolboxOnly: args.includes("--toolbox-only"), slugs });
  if (args.includes("--min")) report.items = report.items.filter((r) => r.score >= min);
  if (args.includes("--json")) console.log(JSON.stringify(report, null, 1));
  else {
    for (const r of report.items) {
      if (!r.score && !args.includes("--all")) continue;
      console.log(`${String(r.score).padStart(3)}  ${r.slug}  (${r.kind}, in ${r.toolboxes} toolbox${r.toolboxes === 1 ? "" : "es"})  "${r.name}"`);
      for (const x of r.reasons) console.log(`       ${x.reason} [${x.field}]: ${x.detail}`);
    }
    console.log(`\n${report.checked} items checked (${report.scope}): ${report.flagged} flagged, ${report.clean} clean.`);
    console.log("Items by reason:");
    for (const [reason, n] of Object.entries(report.itemsByReason).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(5)}  ${reason}`);
  }
}
