// The prerendered HTML for the owner pages of the outcome orchestrator (/get-it-done, /example, /status), so crawlers
// and link previews read the same words the app shows. Built from the app's own copy and the worked example.
import { OUTCOME_PATHS, BRIEF_QUESTIONS, MCP_URL, humanize, walkthrough } from "../../src/outcomes-site/owner-view.ts";
import { EXAMPLE, SEO, START, STATUS } from "../../src/outcomes-site/outcome-copy.ts";

export const OUTCOME_URLS = Object.values(OUTCOME_PATHS);
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const list = (items, tag = "ul") => (items.length ? `<${tag}>${items.map((x) => `<li>${x}</li>`).join("")}</${tag}>` : "");
const pairs = (rows, tag = "ul") => list(rows.map(([b, t]) => `<b>${esc(b)}</b> ${esc(t)}`), tag);
const tabs = `<p><a href="${OUTCOME_PATHS.start}">Start a job</a> · <a href="${OUTCOME_PATHS.example}">See an example</a> · <a href="${OUTCOME_PATHS.status}">Where my job stands</a></p>`;

function startBody() {
  return [
    `<p class="bp-sub">${esc(START.sub)}</p>`,
    `<h2>What job do you need done?</h2><p>Type the job on this page in your own words. You get a message to paste into your own AI. It starts the job with the AI Blocks MCP server (${esc(MCP_URL)}). <a href="/api-and-mcp">Connect your AI</a> first if you haven't yet.</p>`,
    `<h2>What happens after you paste it</h2>${pairs(START.steps, "ol")}`,
    `<h3>The questions it covers</h3>${list(BRIEF_QUESTIONS.map(esc))}`,
    `<h2>Where it stops for you</h2><p>${esc(START.stopsLead)}</p>${pairs(START.stops)}`,
    `<h2>Who does what</h2>${pairs(START.facts)}`,
    tabs,
  ].join("");
}

function exampleBody({ itemHref, roleHref }) {
  const w = walkthrough(), b = w.brief, m = b.metric;
  const role = (id) => (roleHref(id) ? `<a href="${roleHref(id)}">${esc(humanize(id))}</a>` : esc(humanize(id)));
  const item = (slug) => (itemHref(slug) ? `<a href="${itemHref(slug)}">${esc(humanize(slug))}</a>` : esc(humanize(slug)));
  const source = (s) => (s.kind === "web" ? `<a href="${esc(s.ref)}" rel="noopener noreferrer">${esc(s.title)}</a>` : esc(s.kind === "catalogue" ? `Our library: ${s.title}` : s.title));
  const stage = (s) => `<li><h3>${esc(s.name)}</h3><p><b>${esc(s.kindLabel)}.</b> ${esc(s.goal)}</p><p>${s.owner ? `Specialist: ${role(s.owner)}` : `No specialist in our library fits: ${esc(s.gap)}`}${[...s.support, ...s.reviewers].length ? `, helped by ${[...s.support, ...s.reviewers].map(role).join(", ")}` : ""}.</p>${s.uses.length ? `<p>Uses: ${s.uses.map(item).join(", ")}.</p>` : ""}<p>${esc(s.gateLabel)}</p></li>`;
  return [
    `<p class="bp-sub">${esc(EXAMPLE.sub)}</p><p>${esc(EXAMPLE.note)}</p>`,
    `<h2>The owner's words</h2><blockquote>${esc(w.request)}</blockquote><p>Their AI calls start_outcome with these words, then asks one batch of questions.</p><aside><p><b>Illustrative figures</b></p>${list(b.answers.map((a) => `<b>${esc(a.question)}</b> ${esc(a.answer)}`))}</aside>`,
    `<h2>The brief</h2><p><b>What they want:</b> ${esc(b.outcome)}</p><p><b>What they get at the end:</b> ${esc(b.deliverable)}</p><p><b>Done when:</b></p>${list(b.done.map(esc))}`,
    m ? `<aside><p><b>Illustrative figures</b></p><p>${esc(m.name)}: from ${esc(m.baseline ?? "unknown")} to ${esc(m.target ?? "a target to agree")} (${esc(m.unit)})${b.deadline ? `, by ${esc(b.deadline)}` : ""}.</p>${list([...b.guardrails, ...b.limits].map(esc))}</aside>` : "",
    `<h2>How experts do it</h2><p>${esc(w.research.approach)}</p>${list(w.research.steps.map((s) => `<b>${esc(s.name)}.</b> ${esc(s.why)} (${s.sources.map(source).join(", ")})`), "ol")}<h3>What usually goes wrong</h3>${list(w.research.pitfalls.map((p) => esc(p.text)))}`,
    `<h2>The plan</h2><p>${w.counts.stages} stages, run by ${w.counts.specialists} specialists using ${w.counts.items} skills and tools from our library.</p><ol>${w.stages.map(stage).join("")}</ol>`,
    `<h2>Where it stops for the owner</h2><p>The owner approves the plan first. After that, it stops for them ${w.stops.length - 1} times.</p>${list(w.stops.map((s) => `<b>${esc(s.title)}</b> ${s.n ? `Stage ${s.n}, ${esc(s.stage)}. ` : ""}${esc(s.detail)}`), "ol")}`,
    `<h2>Reading results and learning</h2>${w.measurement ? list([`<b>How long each test runs:</b> ${esc(w.measurement.window)}`, `<b>Enough data to judge:</b> ${esc(w.measurement.min_volume)}`, `<b>When to stop early:</b> ${esc(w.measurement.stop_rule)}`]) : ""}<h3>The ${w.counts.hypotheses} possible causes it tests first</h3>${list(w.hypotheses.map((h) => esc(h.statement)))}`,
    tabs,
  ].join("");
}

function statusBody() {
  return [
    `<p class="bp-sub">${esc(STATUS.sub)}</p><p>${esc(STATUS.folder)}</p><p><b>${esc(STATUS.privacy)}</b></p>`,
    `<h2>What you see</h2>${list(["Which stages are done, and how many are left.", "What waits on you: approving the plan, a choice, work to look over or a live action to approve.", "What your AI works on next, and anything blocked with the reason.", "The data your AI still needs."].map(esc))}`,
    `<p>No job yet? Try the sample job on this page, built from the <a href="${OUTCOME_PATHS.example}">worked example</a>, or <a href="${OUTCOME_PATHS.start}">start a job</a>.</p>`,
    tabs,
  ].join("");
}

const TITLES = { [OUTCOME_PATHS.start]: ["Get a whole job done", START.h1], [OUTCOME_PATHS.example]: ["A whole job, screen by screen", EXAMPLE.h1], [OUTCOME_PATHS.status]: ["Where my job stands", STATUS.h1] };

/** pageFor() data for prerender.mjs, or null for any other address. itemHref and roleHref return a page's address, or null when it has none. */
export function outcomePage(url, { itemHref = () => null, roleHref = () => null } = {}) {
  if (!OUTCOME_URLS.includes(url)) return null;
  const [title, h1] = TITLES[url];
  const [documentTitle, desc] = SEO[url];
  const body = url === OUTCOME_PATHS.start ? startBody() : url === OUTCOME_PATHS.example ? exampleBody({ itemHref, roleHref }) : statusBody();
  return { title, h1, documentTitle, desc, body, crumbs: url === OUTCOME_PATHS.start ? [] : [["Get a whole job done", OUTCOME_PATHS.start]], ld: { "@type": "WebPage" } };
}
