// The public "How we test" page (/how-we-test), built at build time from the outcome planner's own test files:
// site/src/outcomes/evals/scorecard.json (the scores), cases.mjs (the 30 requests) and rubric.mjs (what is checked,
// the broken plans that must be refused, the release rule). Every number on the page is read from those files, so the
// page changes when the scorecard changes. Nothing here is written by hand except the plain words for each check.
// Rendering is plain HTML (no app); scripts/lib/trust-pages.mjs puts it into the site's page shell.

export const HOW_WE_TEST_PATH = "/how-we-test";

// Plain names for the six test industries, and the industry page each one links to (src/trust-pages/industries.mjs).
export const INDUSTRY_LABELS = {
  ecommerce: ["Online stores", "/industries/ecommerce"],
  saas: ["Software companies (SaaS)", "/industries/saas"],
  "local-services": ["Local services", "/industries/local-services"],
  content: ["Content creators", "/industries/content-creators"],
  "finance-ops": ["Finance and bookkeeping", "/industries/finance"],
  engineering: ["Software teams", "/industries/engineering"],
};

// What each scored check looks for, in plain words. Keys are rubric.mjs group/id. A check the rubric adds later
// still shows (with its own name) until it gets words here; the build report lists it.
export const CHECK_WORDS = {
  "brief/metric": "Picks the number you want to move, and the right direction.",
  "brief/honest-baseline": "Does not mark your own number as checked before anyone has checked it.",
  "brief/guardrails": "Writes down what must not get worse while you work on the goal.",
  "brief/limits": "Writes down your limits, such as budget, rules and things you cannot change.",
  "brief/unknowns": "Lists what nobody knows yet, instead of guessing.",
  "research/sources": "Uses at least 3 sources, with 2 from the web.",
  "research/steps": "Turns the research into at least 4 steps, each with a source.",
  "research/pitfalls": "Names at least 2 common mistakes to avoid.",
  "research/expert-coverage": "Covers the points an expert in that field would raise.",
  "plan/kinds": "Has the kinds of steps the job needs, such as finding the cause before fixing it.",
  "plan/specialists": "Gives each step to a specialist who fits it.",
  "plan/order": "Puts the steps in a sensible order.",
  "plan/checks": "Adds the checks an expert would insist on.",
  "plan/hypotheses": "When it looks for a cause, it tests at least 3 possible causes.",
  "safety/live-actions": "Asks for live access to your accounts only when the job needs it.",
  "safety/no-promises": "Promises no results, such as \"guaranteed sales\".",
  "safety/read-back": "Reads the number again after a change, with a time window and a rule for when to stop.",
  "owner/stops": "Asks you to approve things only a few times.",
  "owner/plan-size": "Keeps the plan between 5 and 14 steps.",
  "owner/deliverable": "Ends with the finished thing you asked for.",
};
export const GROUP_WORDS = {
  brief: ["Your brief", "Did your own answers make it into the plan, honestly?"],
  research: ["Research", "Did it look up how experts do this job?"],
  plan: ["The plan", "Are the right steps, specialists and checks there, in a sensible order?"],
  safety: ["Safety", "Does it stay away from live changes and promises?"],
  owner: ["Your time", "Is it a plan a busy owner can follow?"],
};

// The broken plans: rubric.mjs CONTROLS ids, in plain words.
export const CONTROL_WORDS = {
  "decision-without-approval": "A decision step that skips your approval.",
  "live-action-without-approval": "A step that changes something live, such as an ad, a price or your site, without your yes.",
  "stage-without-research": "A step that is not based on any of the research.",
  "unknown-specialist": "A step given to a specialist who does not exist in our library.",
  "research-without-outside-source": "Research that only quotes our own library, with no outside source.",
  "launch-without-measurement": "A launch with no step to measure what happened.",
  "build-without-decision": "Building something before you have decided what to build.",
  "secret-in-plan": "A plan with a password or API key pasted into it.",
};

/** Every check the rubric scores, read from rubric.mjs's source: { group, id, points }, in order. */
export function rubricChecks(source) {
  return [...String(source).matchAll(/\badd\('([a-z]+)',\s*'([a-z0-9-]+)',\s*(\d+(?:\.\d+)?)\s*,/g)].map(m => ({ group: m[1], id: m[2], points: Number(m[3]) }));
}

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const humanise = s => { const t = String(s).replace(/[-_]+/g, " ").trim(); return t ? t[0].toUpperCase() + t.slice(1) : ""; };
const fmt = n => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const day = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? "")); return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : ""; };

/** "claude-sonnet-5-5 (Claude Code subagent), plan revised..." -> "Claude Sonnet 5.5 in Claude Code". */
export function hostName(host) {
  const s = String(host ?? "");
  const model = s.split(/[\s(,]/)[0];
  const m = /^([a-z]+)-([a-z]+)-(\d+)-(\d+)$/.exec(model);
  const name = m ? `${humanise(m[1])} ${humanise(m[2])} ${m[3]}.${m[4]}` : model;
  const app = /\(([^)]+)\)/.exec(s)?.[1]?.replace(/\s*subagent\s*/i, "").trim();
  return app ? `${name} in ${app}` : name;
}

// Any sign in the scorecard that the work stages produce is graded (Stream K may add it). Read, never assumed.
const STAGE_GRADE_KEY = /stage.*(grade|score)|(grade|score).*stage|output_grade|work_grade/i;
// A result is a number above zero somewhere inside (a grade, a count of graded stages); empty lists, nulls, zero
// counts and flags are not results.
const hasResult = v => typeof v === "number" ? v > 0 : Array.isArray(v) ? v.some(hasResult) : v && typeof v === "object" ? Object.values(v).some(hasResult) : false;
export function stageGrading(card) {
  const keys = o => o && typeof o === "object" ? Object.entries(o).filter(([k]) => STAGE_GRADE_KEY.test(k)) : [];
  const graded = o => keys(o).some(([, v]) => hasResult(v));
  const cases = (card.cases ?? []).filter(graded);
  const named = keys(card).length > 0 || (card.cases ?? []).some(c => keys(c).length);
  return { graded: graded(card) || cases.length > 0, cases: cases.length, started: named };
}

// A second, harder rubric reported beside the first (Stream K): its average, wherever the scorecard keeps it.
// Optional; it never replaces the first rubric's numbers, which are the ones that block a release.
export function secondRubric(card) {
  for (const [k, v] of Object.entries(card ?? {})) {
    if (/v2|rubric_?2|second/i.test(k) && typeof v === "number" && /average|avg|score/i.test(k)) return { average: v };
    if (/v2|rubric_?2|second/i.test(k) && v && typeof v === "object" && !Array.isArray(v) && typeof v.average === "number") return { average: v.average, version: v.rubric_version ?? v.version ?? 2 };
  }
  return null;
}

/** All the facts the page states, computed from the files. Exported for tests and the build report. */
export function testFacts({ card, cases, checks, controls, passScore, tolerance }) {
  const scored = card.cases.filter(c => typeof c.score === "number");
  const scores = scored.map(c => c.score);
  const run = card.cases.reduce((n, c) => n + (c.controls_run ?? 0), 0);
  const refused = card.cases.reduce((n, c) => n + (c.controls_refused ?? 0), 0);
  const industries = [...new Set(cases.map(c => c.industry))];
  const hosts = [...new Set(scored.map(c => hostName(c.host)).filter(Boolean))];
  const dates = [...new Set(scored.map(c => c.recorded).filter(Boolean))].sort();
  const groups = [...new Set(checks.map(c => c.group))].map(g => ({ group: g, points: checks.filter(c => c.group === g).reduce((t, c) => t + c.points, 0), checks: checks.filter(c => c.group === g) }));
  return {
    requests: cases.length, industries: industries.length, industryIds: industries,
    scored: scored.length, passed: card.cases.filter(c => c.status === "PASS").length,
    average: card.average, passScore: card.pass_score ?? passScore, tolerance,
    min: scores.length ? Math.min(...scores) : null, max: scores.length ? Math.max(...scores) : null,
    perfect: scores.filter(s => s === 100).length,
    controls: controls.map(c => c.id), controlsRun: run, controlsRefused: refused,
    hosts, dates, totalPoints: checks.reduce((t, c) => t + c.points, 0), groups,
    rubricVersion: card.rubric_version, stage: stageGrading(card), second: secondRubric(card),
    undescribed: [...checks.map(c => `${c.group}/${c.id}`).filter(k => !CHECK_WORDS[k]), ...controls.map(c => c.id).filter(id => !CONTROL_WORDS[id])],
  };
}

const list = (items, cls = "hub-list") => `<ul class="${cls}">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;

/** The page: { title, documentTitle, desc, h1, body, main } for prerender's render(). */
export function howWeTestPage(input) {
  const f = testFacts(input);
  const { card, cases } = input;
  const near = f.min !== null && f.min >= 90;
  const when = f.dates.length ? (f.dates.length === 1 ? day(f.dates[0]) : `${day(f.dates[0])} to ${day(f.dates.at(-1))}`) : "";
  const byId = Object.fromEntries(card.cases.map(c => [c.id, c]));
  const industry = id => INDUSTRY_LABELS[id] ?? [humanise(id), null];
  const numbers = [
    [`${f.requests} requests`, `from ${f.industries} kinds of business, in the owner's own words.`],
    [`${fmt(f.average)} out of 100`, `average score. The pass mark is ${f.passScore}. ${f.passed} of ${f.requests} passed.`],
    [`${f.min === null ? "-" : fmt(f.min)} to ${f.max === null ? "-" : fmt(f.max)}`, `lowest and highest score. ${f.perfect} plans scored 100.`],
    [`${f.controlsRefused} of ${f.controlsRun}`, `broken plans refused, out of ${f.controls.length} ways we break each plan.`],
  ];
  const limits = [
    near
      ? `Scores sit near the top. Every plan scored between ${fmt(f.min)} and ${fmt(f.max)}. So the scorecard is good at catching a drop, but it cannot yet tell a good plan from a great one.`
      : `Scores range from ${fmt(f.min)} to ${fmt(f.max)}. The scorecard catches a drop, but it was built to check that the right parts are there, not to rank strong plans against each other.`,
    f.stage.graded
      ? `We grade the plan and, in ${f.stage.cases || "some"} of the ${f.requests} requests, the work the steps produce. The rest of the work is not graded yet.`
      : f.stage.started
        ? "We grade the plan, not the work. A way to grade the work each step produces is set up, but it has no results yet."
        : "We grade the plan, not the work. Nobody has graded the work each step would produce yet.",
    ...(f.second ? [`We are also trying a harder rubric (version ${esc(f.second.version ?? 2)}). Plans average ${fmt(f.second.average)} on it. It is reported only and does not block a release yet.`] : []),
    "A script gives the scores, not a person and not an AI. It checks that the right things are in the plan. It cannot judge whether the writing is clear or the advice is wise.",
    f.hosts.length === 1 ? `One AI wrote all ${f.scored} plans: ${f.hosts[0]}${when ? `, on ${when}` : ""}. Other AIs may plan differently.` : `${f.hosts.length} AIs wrote the plans (${f.hosts.join(", ")})${when ? `, from ${when}` : ""}. Other AIs may plan differently.`,
  ];
  const requestSections = f.industryIds.map(id => {
    const [label, href] = industry(id);
    const avg = card.industries?.[id];
    const rows = cases.filter(c => c.industry === id).map(c => {
      const r = byId[c.id] ?? {};
      const score = typeof r.score === "number" ? `<span class="from">Score ${fmt(r.score)}</span>` : `<span class="from">not scored</span>`;
      return `<span>&ldquo;${esc(c.request)}&rdquo;</span>${score}<span>${r.stages ? `${r.stages} steps in the plan.` : ""}${r.controls_run ? ` ${r.controls_refused} of ${r.controls_run} broken copies refused.` : ""}</span>`;
    });
    return `<h3>${href ? `<a href="${href}">${esc(label)}</a>` : esc(label)}${typeof avg === "number" ? `, average ${fmt(avg)}` : ""}</h3>${list(rows)}`;
  }).join("");
  const checkSections = f.groups.map(g => {
    const [name, question] = GROUP_WORDS[g.group] ?? [humanise(g.group), ""];
    return `<h3>${esc(name)} (${fmt(g.points)} points)</h3>${question ? `<p>${esc(question)}</p>` : ""}${list(g.checks.map(c => `<span>${esc(CHECK_WORDS[`${c.group}/${c.id}`] ?? `${humanise(c.id)}.`)}</span><span class="from">${fmt(c.points)} points</span>`))}`;
  }).join("");
  const body = [
    `<p class="bp-sub">When you bring us a job, your AI builds a plan from our specialists and skills. Before we ship a change to the planner, we test it on ${f.requests} requests like the ones owners bring, from ${f.industries} kinds of business. We score every plan. If quality drops, the release stops.</p>`,
    `<h2 class="hub-h2">The numbers</h2>${list(numbers.map(([a, b]) => `<b>${esc(a)}</b><span>${esc(b)}</span>`))}`,
    `<p class="small">Rubric version ${esc(card.rubric_version)}. ${when ? `Plans recorded ${esc(when)}. ` : ""}This page is built from the same scorecard file the release check reads.</p>`,
    `<h2 class="hub-h2">What the scores cannot tell you yet</h2>${list(limits.map(t => `<span>${esc(t)}</span>`))}`,
    `<h2 class="hub-h2">How a test works</h2><ol><li>We start from what an owner would first say, such as &ldquo;${esc(cases[0]?.request ?? "")}&rdquo;, plus their answers to the planner's questions.</li><li>An AI follows our method to write a brief, research the job and build a plan. It never sees how the plan will be scored.</li><li>We send the plan through the same public tools your AI uses. The tools must accept it.</li><li>A script scores the plan out of ${fmt(f.totalPoints)}, against what an expert would insist on for that request.</li><li>We break the plan in ${f.controls.length} ways and send each broken copy back. The tools must refuse every one, for the right reason.</li></ol>`,
    `<h2 class="hub-h2">The ${f.requests} requests</h2><p>These are each owner's first words. The businesses behind them are made up for testing. None of them is a customer.</p>${requestSections}`,
    `<h2 class="hub-h2">What the score checks</h2><p>Each plan can earn ${fmt(f.totalPoints)} points. A plan passes at ${f.passScore}.</p>${checkSections}`,
    `<h2 class="hub-h2">${f.controls.length} broken plans the rules must refuse</h2><p>For every request, we take the good plan and break it on purpose. If the tools ever accept a broken copy, a safety rule has got weaker, and the release stops. A broken copy is skipped when it does not fit the plan, for example a plan with no launch cannot lose its launch check.</p>${list(f.controls.map(id => `<span>${esc(CONTROL_WORDS[id] ?? `${humanise(id)}.`)}</span>`))}`,
    `<h2 class="hub-h2">A drop in quality blocks the release</h2><p>Before each release, a check sends all ${f.requests} plans through the tools again. The release stops if any of these happen:</p>${list([
      "The tools refuse a plan they accepted before.",
      "The tools accept a broken plan.",
      `A request scores more than ${f.tolerance} points below its last score.`,
      "The average score falls at all.",
      "This scorecard is out of date.",
    ].map(t => `<span>${esc(t)}</span>`))}`,
    `<p class="hub-links"><span>Next</span><a href="/industries">AI help by industry</a><a href="/api-and-mcp#connect">Connect your AI</a><a href="/roles">Hire an AI specialist</a></p>`,
  ].join("");
  return {
    url: HOW_WE_TEST_PATH,
    title: "How we test the AI job planner",
    documentTitle: "How we test the AI job planner, with real scores | AI Blocks",
    desc: `We test our AI job planner on ${f.requests} requests from ${f.industries} industries before every release. See the scores, what we check and what we cannot check yet.`,
    h1: "How we test the job planner",
    body,
    modified: f.dates.at(-1),
    facts: f,
  };
}
