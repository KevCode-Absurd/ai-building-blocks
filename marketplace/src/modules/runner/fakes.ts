// Fake model replies for this module (MODEL_MODE=fake). Register with registerFake from core/models.ts.
// They read the request and details back out of the step prompt and write a specific, believable draft, so the local
// demo and staging show real-looking work. Deterministic: the same prompt always gives the same reply.
// Like the real agents, they only use facts from the brief and put [placeholders] where a fact is missing.
import { registerFake, type ModelRequest } from "../../core/models.ts";

const KNOWN = ["Job", "Plan", "Draft", "Buyer's request", "Details (spec)", "Brand profile", "Rubric", "Earlier version", "Changes asked for", "Checklist", "Request", "Details", "What matters to me"];
const TRAILERS = ["\n\nWrite a short plan", "\n\nRules for this step:", "\n\nGo through each rubric item", "\n\nWrite the full deliverable"];

/** The text under "## <heading>" up to the next known heading or instruction block. */
function section(prompt: string, heading: string): string {
  const marker = `## ${heading}\n`;
  const at = prompt.startsWith(marker) ? 0 : prompt.indexOf(`\n${marker}`);
  if (at < 0) return "";
  const start = at + (at === 0 ? marker.length : marker.length + 1);
  let end = prompt.length;
  for (const h of KNOWN) {
    if (h === heading) continue;
    const i = prompt.indexOf(`\n\n## ${h}\n`, start);
    if (i >= 0 && i < end) end = i;
  }
  for (const t of TRAILERS) {
    const i = prompt.indexOf(t, start);
    if (i >= 0 && i < end) end = i;
  }
  const body = prompt.slice(start, end).trim();
  return /^\((none|not written yet)/.test(body) ? "" : body;
}

interface Brief {
  jobTitle: string; jobTypeId: string; deliverable: string; request: string;
  spec: Record<string, string>; labels: Record<string, string>; feedback: string; rubric: { id: string; text: string }[];
}

function readBrief(req: ModelRequest): Brief {
  const p = req.prompt;
  const job = section(p, "Job");
  const head = /^(.+?) \(job type id: ([a-z0-9-]+)\)/m.exec(job);
  const deliverable = /^Deliverable: (.+)$/m.exec(job)?.[1] ?? "";
  const spec: Record<string, string> = {}, labels: Record<string, string> = {};
  for (const line of (section(p, "Details (spec)") || section(p, "Details")).split("\n")) {
    const m = /^- (.+?) \[([a-z0-9_]+)\]: (.+)$/.exec(line.trim());
    if (m) { spec[m[2]] = m[3].trim(); labels[m[2]] = m[1]; }
  }
  const rubric = section(p, "Rubric").split("\n").map(l => /^- ([a-z0-9_]+)(?: \(must pass\))?: (.+?)(?: Pass rule:.*)?$/.exec(l.trim())).filter(Boolean).map(m => ({ id: m![1], text: m![2] }));
  return {
    jobTitle: head?.[1] ?? "Your project", jobTypeId: head?.[2] ?? "", deliverable,
    request: section(p, "Buyer's request") || section(p, "Request"),
    spec, labels, feedback: section(p, "Changes asked for"), rubric,
  };
}

function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h;
}
const pick = <T>(list: T[], seed: number, offset = 0): T => list[(seed + offset) % list.length];

function sentences(text: string): string[] {
  return text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
}
function cap(text: string): string { return text ? text[0].toUpperCase() + text.slice(1) : text; }
function stripEnd(text: string): string { return text.trim().replace(/[.!?]+$/, ""); }
function words(text: string, n: number): string { const w = text.split(/\s+/); return w.length > n ? `${w.slice(0, n).join(" ")}` : text; }

function first(spec: Record<string, string>, keys: string[]): string {
  for (const k of keys) if (spec[k]?.trim()) return spec[k].trim();
  return "";
}

interface Facts {
  subject: string;   // what the buyer sells or runs: "a $29/month scheduling app for dog groomers"
  audience: string;  // who it is for, or "" when the brief does not say
  who: string;       // audience, or "your customers"
  cta: string;       // the one action: "Start your free trial"
  aim: string;       // what the buyer wants to happen: "double bookings by spring"
  topic: string;     // for articles: the quoted title or the topic field
  facts: string[];   // sentences and listed items from the brief that carry numbers or proof
  count: number | null;
  seed: number;
}

const NOUNS = "company|business|firm|shop|store|practice|agency|app|brand|studio|clinic|service|restaurant|bakery|cafe|salon|platform|tool|product|course|newsletter|podcast";
const PEOPLE = "owners|practices|homeowners|shops|teams|parents|buyers|customers|groomers|founders|managers|students|families|businesses|stores|clinics|firms|agencies|developers|marketers|nurses|teachers|shoppers|users|readers|clients";

function facts(b: Brief): Facts {
  const req = b.request.replace(/\s+/g, " ");
  const lines = sentences(req);
  const quoted = /["“']([^"”']{8,120})["”']/.exec(req)?.[1]?.trim() ?? "";
  const owned = new RegExp(`\\b(?:our|my|a|an)\\s+((?:[\\w$/,-]+\\s+){0,6}?(?:${NOUNS})(?:\\s+(?:for|in)\\s+[\\w\\s-]{3,40}?)?)(?=[.,;:]|\\s(?:called|named|that|which|with|and)\\b|$)`, "i").exec(req)?.[1];
  const sold = /^(?:we|i)\s+(?:sell|make|run|offer|own|build)\s+((?:an?\s+)?[^.]+)/i.exec(lines[0] ?? "")?.[1];
  const subject = stripEnd(first(b.spec, ["product", "business", "offer", "shop", "company", "app", "feature", "service", "event", "client", "organisation", "project", "role_title"]))
    || stripEnd(sold ?? "") || stripEnd(owned ?? "") || clause(lines[0] ?? "") || "your offer";
  const audience = stripEnd(first(b.spec, ["audience", "target", "buyer", "customer", "who", "readers", "users", "candidate_profile", "customer_type"]))
    || /\b(?:readers|customers|buyers|users|clients|visitors|subscribers)\s+(?:are|will be)\s+([^.]+)/i.exec(req)?.[1]?.trim()
    || new RegExp(`\\b(?:to|for)\\s+((?:[\\w-]+\\s+){0,4}(?:${PEOPLE})(?:\\s+in\\s+[A-Z][\\w]+)?)`, "i").exec(req)?.[1]?.trim()
    || "";
  const wish = /\b(?:we want|i want|want to|we need|i need|goal is|the goal is|aim is|looking to|hoping to)\s+(?:to\s+)?([^.]+)/i.exec(req)?.[1]?.trim() ?? "";
  const lower = req.toLowerCase();
  const goal = first(b.spec, ["cta", "goal", "purpose", "promo_goal", "meeting_goal"]);
  const cta = goal ? stripEnd(goal)
    : lower.includes("free trial") ? "Start your free trial"
    : /\b(call|demo|meeting)\b/.test(lower) ? "Book a call"
    : lower.includes("waitlist") ? "Join the waitlist"
    : /\bquote\b/.test(lower) ? "Get a free quote"
    : /\b(buy|order|shop)\b/.test(lower) ? "Order now" : "Get in touch";
  const topic = stripEnd(first(b.spec, ["topic", "keyword", "subject", "question"])) || quoted || subject;
  const listed = ["proof", "facts", "highlights", "results", "features", "strengths", "metrics"].flatMap(k => (b.spec[k] ?? "").split(";").map(s => s.trim()).filter(Boolean));
  // Sentences with numbers are the buyer's facts, except the ones that describe the job itself.
  const numbered = lines.filter(s => /\d|\$|£|€/.test(s) && !/^(?:we|i)\s+(?:want|need|would like)|^(?:the\s+)?(?:goal|aim)\b|\bwords?\b|\d+[- ](?:email|post|message|page|section)s?\b/i.test(s));
  const countText = first(b.spec, ["emails", "touches", "variants", "posts", "templates", "macros", "count"]) || /(\d+)[- ]?(?:emails?|messages?|posts?|touches|templates)\b/i.exec(req)?.[1] || "";
  const count = countText ? Number(/\d+/.exec(countText)?.[0]) || null : null;
  return {
    subject, audience, who: audience || "your customers", cta, aim: stripEnd(wish) || stripEnd(goal) || "", topic,
    facts: [...new Set([...listed, ...numbered])].slice(0, 6), count, seed: hash(b.request + "|" + b.feedback),
  };
}

function lowerFirst(text: string): string {
  return text && !/^[A-Z]{2}/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;
}

const STOP_END = /\s+(?:a|an|the|to|for|of|and|or|in|on|with|doing|by|from|at)$/i;

/** A sentence cut to a readable clause: up to the first comma, at most 16 words, never ending on a small word. */
function clause(sentence: string): string {
  let c = stripEnd(sentence.split(/[,;:]/)[0] ?? "");
  const w = c.split(/\s+/);
  if (w.length > 16) c = w.slice(0, 16).join(" ");
  while (STOP_END.test(c)) c = c.replace(STOP_END, "");
  return c;
}

/** The head noun phrase: "Bookkeeping service" from "Bookkeeping service for Shopify stores doing $20k a month". */
function shortName(subject: string): string {
  const head = subject.split(/\s+(?:for|that|which|doing|with|who|to)\s+/i)[0].replace(/^(?:an?|the|our|my)\s+/i, "").trim();
  return head.split(/\s+/).length >= 2 ? head : subject.replace(/^(?:an?|the|our|my)\s+/i, "");
}

type Family = "page" | "article" | "email" | "role" | "steps" | "doc";

function family(id: string): Family {
  if (/landing|website-page|collection-page|app-store|listing|product-descriptions|microcopy/.test(id)) return "page";
  if (/email|outreach|messages|follow-up|sequence|replies|macros|templates|social|post-pack|ads-copy/.test(id)) return "email";
  if (/blog|guide|white-paper|newsletter|case-study|press-release|show-notes|video-script|article|help-centre/.test(id)) return "article";
  if (/job-description/.test(id)) return "role";
  if (/procedure|process-map|onboarding-plan|test-plan|test-cases|training-plan|project-plan|meeting-notes|workflow-spec/.test(id)) return "steps";
  return "doc";
}

function factList(f: Facts): string {
  return f.facts.length ? f.facts.map(x => `- ${x}`).join("\n") : "- [add one fact a customer would check: a price, a result or a review you can share]";
}

function pageDraft(b: Brief, f: Facts): string {
  const s = cap(shortName(f.subject));
  const head = f.audience
    ? pick([`${s} for ${f.audience}`, `${s} that fits how ${f.audience} already work`], f.seed)
    : pick([`${s}, without the busywork`, `${s}, set up in an afternoon`], f.seed);
  const sub = pick([
    `Built for ${f.who}, so you spend less time on admin and more time on the work you are paid for.`,
    `Everything ${f.who} need in one place. Set it up in an afternoon and see the difference in your first week.`,
  ], f.seed, 1);
  return [
    `# ${head}`, sub, `**${f.cta}**`,
    `## Why ${f.who} pick it`,
    `- It does one job well: ${lowerFirst(f.subject)}.`,
    "- You keep working the way you do now. Nothing to learn before it helps.",
    "- You can see what it costs before you start: [add your price or plan names].",
    "## How it works",
    "1. Tell us about your business in a short form.",
    "2. Set it up the way you like it.",
    `3. Share the link, and let ${f.who} take the next step on their own.`,
    "## What you can count on", factList(f),
    "## Questions people ask",
    "**How long does it take to set up?**\nMost people are ready the same day. [Add your real setup time if you track it.]",
    "**What if it is not right for me?**\n[Add your cancellation or refund terms.]",
    "**Do I need to change how I work?**\nNo. It fits around what you already do.",
    `## Ready when you are`, `Try it with your next customer and see how it feels.`, `**${f.cta}**`,
  ].join("\n\n");
}

function articleDraft(b: Brief, f: Facts): string {
  const t = lowerFirst(f.topic);
  const title = /^(how|what|why|when|which|is|are|can|should|do)\b/i.test(f.topic) ? cap(f.topic)
    : pick([`${cap(f.topic)}: a plain guide for ${f.who}`, `${cap(f.topic)}, explained in ten minutes`], f.seed);
  return [
    `# ${title}`,
    `**Meta description:** A practical guide for ${f.who} on ${t}: the short answer, the signs to look for and when to get help.`,
    `If you are one of the ${f.who} asking about ${t}, you want a straight answer and a clear next step. This guide gives you both, in plain words.`,
    "## The short answer",
    `It comes down to three questions: what you have now, what it costs you to wait, and when to bring in help. The sections below take them one at a time.`,
    "## Start with what you have now",
    "Write down what you have today, how old it is and what has changed lately. [Add one detail from your own work that readers often miss.]",
    "## Signs it is time to act",
    "- The same problem keeps coming back after a quick fix.\n- Keeping things as they are costs more each month.\n- You plan around the problem instead of the other way round.",
    "## What it costs to wait",
    "[Add a typical price range you are happy to share.] Small problems tend to grow, so a check now is usually cheaper than a repair later.",
    ...(f.facts.length ? [`## About ${lowerFirst(f.subject)}`, factList(f)] : []),
    "## Common questions",
    `**How often should I check?**\n[Add the interval you recommend to your own customers.]\n\n**Can I do this myself?**\nYou can do the first checks above. For anything beyond that, talk to someone who does this every day.`,
    "## When to get help",
    `If two or more of the signs above apply, it is time to talk to a professional. ${cap(f.cta)}. [Add the link you want readers to follow.]`,
    `---\n**Internal link ideas:** [link to your main service page], [link to a related guide], [link to your contact page]`,
  ].join("\n\n");
}

function emailDraft(b: Brief, f: Facts): string {
  const count = Math.min(5, Math.max(1, f.count ?? 3));
  const themes = [
    { name: "The problem", subject: pick(["A quicker way through the admin", "Less time on paperwork"], f.seed), body: `Most ${f.who} tell us the same thing: the admin around the work takes longer than the work. We are ${lowerFirst(f.subject)}, and we take that off your plate.` },
    { name: "Proof", subject: "What you can check for yourself", body: f.facts.length ? `A few facts you can check:\n\n${factList(f)}` : "You should not take our word for it. [Add one result, review or number you can share.]" },
    { name: "How it works", subject: "What changes in your first month", body: "Here is what the first month looks like. We set things up with you once, then it runs in the background. You stay in charge of every decision." },
    { name: "Common question", subject: "Is this right for a business my size?", body: `We work with ${f.who}, not big teams with an IT department. If it does not fit, you will know after one short call.` },
    { name: "Last note", subject: "Shall I close your file?", body: "I have not heard back, so I will keep this short. If now is not the right time, reply \"later\" and I will check in next month." },
  ];
  const parts = [`# ${b.jobTitle}: ${count} ${count === 1 ? "email" : "emails"}${f.audience ? ` for ${f.audience}` : ""}`];
  for (let i = 0; i < count; i++) {
    const t = i === count - 1 && count > 2 ? themes[4] : themes[i % 4];
    parts.push(`## Email ${i + 1}: ${t.name}`, `**Subject:** ${t.subject}\n**Preview:** ${stripEnd(sentences(t.body)[0] ?? t.body)}`, `Hi [first name],\n\n${t.body}\n\n**${f.cta}**\n\n[Your name]\n[Your business name]`);
  }
  return parts.join("\n\n");
}

function docDraft(b: Brief, f: Facts): string {
  const told = Object.entries(b.spec).slice(0, 8).map(([k, v]) => `- **${b.labels[k] ?? k}:** ${v}`).join("\n") || sentences(b.request).slice(0, 6).map(s => `- ${s}`).join("\n") || "- [add the facts this plan should rest on]";
  const people = f.audience || "recent customers";
  const rows = [
    ["1", `Agree the one result this must deliver${f.aim ? ` (${lowerFirst(f.aim)})` : ""}`, "Every later choice is checked against it", "[owner]"],
    ["2", `Talk to five ${people} and note their exact words`, "You will use their words in every message", "[owner]"],
    ["3", "Fix the step where most people drop off", "One fix here helps everything after it", "[owner]"],
    ["4", "Set one number to watch each week", "You will know early if it is working", "[owner]"],
  ];
  return [
    `# ${b.jobTitle}: ${lowerFirst(f.subject)}`,
    "## Summary",
    `- The aim: ${f.aim ? lowerFirst(f.aim) : `${lowerFirst(f.cta)}, with ${f.who}`}.`,
    "- The plan starts with what you already have and adds one change at a time.",
    "- Gaps in the facts are marked like [this], so you can fill them before you act.",
    "## What you told us", told,
    "## Facts this rests on", factList(f),
    "## Recommendations",
    `| Priority | What to do | Why it matters | Owner |\n|---|---|---|---|\n${rows.map(r => `| ${r.join(" | ")} |`).join("\n")}`,
    "## The first 30 days",
    "1. Week 1: agree the goal and the one number you will watch.\n2. Week 2: do the interviews and write up what you heard.\n3. Week 3: make the first fix and tell your team what changed.\n4. Week 4: check the number, keep what worked and pick the next fix.",
    "## Open questions",
    "- [What budget is available for this?]\n- [Who signs off each step?]\n- [Which date matters most?]",
  ].join("\n\n");
}

function roleDraft(b: Brief, f: Facts): string {
  const req = b.request.replace(/\s+/g, " ");
  const role = stripEnd(b.spec.role_title ?? "") || /\b(?:need|hiring|looking for|want)\s+(?:an?\s+)?([\w -]{3,40}?)\s+(?:for|at|to join|in)\b/i.exec(req)?.[1]
    || shortName(clause(sentences(req)[0] ?? "")) || "[role title]";
  const company = stripEnd(b.spec.company ?? "") || /\b(?:our|my)\s+([^.,]{3,60}?)(?=[.,]|$)/i.exec(req)?.[1]
    || /\b(?:for|at|join)\s+(an?\s+[^.,]{3,60}?)(?=[.,]|$)/i.exec(req)?.[1] || "";
  const duties = listItems(req);
  const terms = sentences(req).filter(s => /\$|£|€|\bpay\b|salary|hybrid|remote|on-site|in office|days/i.test(s));
  return [
    `# ${cap(role)}${company ? ` at ${lowerFirst(company)}` : ""}`,
    "## About us", company ? `We are ${/^(an?|the)\s/i.test(company) ? company : `a ${company}`}. [Add one line on what it is like to work here.]` : "[Add two lines about your business and what it is like to work here.]",
    "## The role", `As our ${lowerFirst(role)}, you keep the place running so the rest of the team can focus on clients.`,
    "## What you will do", duties.length ? duties.map(d => `- ${cap(d)}`).join("\n") : "- [List the main duties, most time-consuming first]",
    "## What you bring",
    "- [Must-have: for example, two years in a similar role]\n- Clear, friendly writing and a calm manner on the phone\n- [Any tools the team uses every day]",
    "## Pay and where you work", terms.length ? terms.map(t => `- ${t}`).join("\n") : "- [Pay range]\n- [Where and when you work]",
    "## How to apply", "Send [your CV and three lines on why this role suits you] to [email address] by [closing date].",
  ].join("\n\n");
}

/** Items from the first list-like sentence: "Handle reception, supplies and travel." -> ["reception", "supplies", "travel"]. */
function listItems(text: string): string[] {
  const s = sentences(text).find(x => (x.match(/,/g) ?? []).length >= 2) ?? "";
  return s.replace(/^(?:\w+\s+)?(?:includes?|including|covers?|handles?|handle)?\s*/i, "").replace(/[.]$/, "")
    .split(/,\s*(?:and\s+)?|\s+and\s+/).map(x => x.trim()).filter(x => x && x.split(/\s+/).length <= 8);
}

function stepsDraft(b: Brief, f: Facts): string {
  const items = listItems(b.request);
  const steps = items.length >= 2
    ? items.slice(0, 8).map((item, i) => `${i + 1}. **${cap(item)}.** [Describe how, in one or two lines, and who does it.]`)
    : ["1. **Get ready.** [List what you need open or to hand.]", "2. **Do the work.** [Describe the main task in one or two lines.]", "3. **Check it.** [Say what done looks like.]", "4. **Record it.** [Say where the result is saved.]"];
  return [
    `# ${b.jobTitle}: ${lowerFirst(shortName(f.subject))}`,
    "## Purpose", "Follow these steps in order, so anyone on the team gets the same result every time. Where a detail is missing, it is marked [like this] for you to fill in.",
    "## Who does it", "- Owner: [role]\n- Back-up: [role]",
    "## Before you start", "- [Access or tools you need]\n- [Information to have ready]",
    "## Steps", steps.join("\n"),
    "## Checks before you finish", "- Every step above is done and recorded.\n- Anything unusual is noted for the owner.",
    "## If something goes wrong", "Stop, note what happened and tell the owner the same day. [Add who to call outside working hours.]",
  ].join("\n\n");
}

function fakeDraft(b: Brief): string {
  const f = facts(b);
  switch (family(b.jobTypeId)) {
    case "page": return pageDraft(b, f);
    case "article": return articleDraft(b, f);
    case "email": return emailDraft(b, f);
    case "role": return roleDraft(b, f);
    case "steps": return stepsDraft(b, f);
    default: return docDraft(b, f);
  }
}

function fakePlan(b: Brief): string {
  const f = facts(b);
  return [
    `**1. Goal:** ${f.aim ? cap(f.aim) : cap(stripEnd(f.cta))}, for ${f.who}, with ${b.jobTitle.toLowerCase()}.`,
    `**2. Facts I can use:**\n${factList(f)}${Object.entries(b.spec).map(([k, v]) => `\n- ${b.labels[k] ?? k}: ${v}`).join("")}`,
    "**3. Missing facts:** prices, results or reviews that were not given. I will use [placeholders] for them.",
    `**4. Outline:** ${b.deliverable || "the parts listed in the job"}`,
    `**5. Rubric:**\n${b.rubric.map(c => `- ${c.id}: covered in the draft and checked at the end.`).join("\n") || "- Checked item by item at the end."}`,
    `**6. Changes:** ${b.feedback ? b.feedback.split("\n").filter(Boolean).map(l => `\n- ${l}`).join("") : "None"}`,
  ].join("\n\n");
}

function draftFromPrompt(req: ModelRequest): string {
  const draft = section(req.prompt, "Draft");
  return draft || fakeDraft(readBrief(req));
}

function fakeBaseline(req: ModelRequest): string {
  // Plain AI: on topic but general, with less structure and no checks.
  const b = readBrief(req);
  const f = facts(b);
  return [
    `# ${cap(f.subject)}`,
    `Looking for a better way to work? ${cap(f.subject)} could be the answer for ${f.who}.`,
    "## Key benefits",
    "- Saves you time\n- Easy to use\n- Helps you grow your business",
    "## Why choose us",
    `We understand what ${f.who} need, and we are here to help you every step of the way.`,
    `## ${cap(f.cta)}`, "Get started today and see the difference for yourself.",
  ].join("\n\n");
}

registerFake("runner.step.*", req => (req.json ? { data: { ok: true, notes: ["Checked against the brief."] } } : { text: draftFromPrompt(req) }));
registerFake("runner.step.plan", req => ({ text: fakePlan(readBrief(req)) }));
registerFake("runner.step.draft", req => ({ text: fakeDraft(readBrief(req)) }));
registerFake("runner.step.check_and_fix", req => ({ text: draftFromPrompt(req) }));
registerFake("runner.baseline", req => ({ text: fakeBaseline(req) }));
