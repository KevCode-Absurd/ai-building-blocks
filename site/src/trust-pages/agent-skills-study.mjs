// The research page "The state of open-source AI agent skills, 2026" (/research/agent-skills-2026), built at build time
// from src/trust-pages/agent-skills-2026.json. Every number on the page is read from that file, which is assembled from
// the study's own findings files (census, clone sample, safety triage, duplication and jobs, our catalogue) and checked
// by an independent recount. The CSVs behind each chart are in public/research/data/agent-skills-2026/.
// scripts/lib/trust-pages.mjs puts the page into the site's plain page shell; charts come from research-charts.mjs.
import { bars, columns, split, stats, table, pct, fmt } from "./research-charts.mjs";

export const STUDY_PATH = "/research/agent-skills-2026";
export const STUDY_DATA = "/research/data/agent-skills-2026";
const SITE = "https://useaiblocks.com";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const day = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? "")); return m ? `${Number(m[3])} ${LONG_MONTHS[Number(m[2]) - 1]} ${m[1]}` : ""; };
const month = (ym) => { const [y, m] = ym.split("-"); return `${MONTHS[Number(m) - 1]} ${y.slice(2)}`; };
const csv = (name) => `${STUDY_DATA}/${name}`;
const h2 = (id, text) => `<h2 class="hub-h2" id="${id}">${esc(text)}</h2>`;
const p = (html) => `<p class="rs-prose">${html}</p>`;
const ul = (items) => `<ul class="hub-list">${items.map((i) => `<li><span>${i}</span></li>`).join("")}</ul>`;
// One rounded share, "35%" or "4.7%": whole numbers from 10% up, one decimal below.
const share = (x) => pct(x, Number(x) >= 10 ? 0 : 1);

/** The sections a reader can jump to, in page order: [id, label]. */
export const SECTIONS = [
  ["key-findings", "Key findings"],
  ["growth", "How fast skills spread"],
  ["who", "Who makes them"],
  ["shape", "What a skill looks like"],
  ["copies", "Copies and near-copies"],
  ["licences", "Licences"],
  ["safety", "Safety and false alarms"],
  ["jobs", "What jobs skills cover"],
  ["advice", "What this means for you"],
  ["method", "How we did it"],
  ["data", "Get the data"],
];

/** The page: { url, title, documentTitle, desc, h1, body, modified, main } for prerender's render(). */
export function studyPage(d) {
  const body = [
    `<p class="bp-sub">${esc(d.lede)}</p>`,
    `<p class="small">Data collected on ${esc(day(d.snapshot))}. Published ${esc(day(d.published))}${d.modified && d.modified !== d.published ? `, updated ${esc(day(d.modified))}` : ""}. By ${esc(d.author)}, AI Blocks.</p>`,
    stats(d.tiles),
    `<nav class="hub-areas" aria-label="Sections of this study">${SECTIONS.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join("")}</nav>`,
    h2("key-findings", "Key findings"),
    `<ol class="rs-findings">${d.findings.map((f) => `<li><b>${esc(f.head)}</b> ${esc(f.text)}</li>`).join("")}</ol>`,
    growth(d),
    who(d),
    shape(d),
    copies(d),
    licences(d),
    safety(d),
    jobs(d),
    advice(d),
    method(d),
    data(d),
    `<p class="hub-links"><span>Related</span><a href="/how-we-check-safety">How we check items for safety</a><a href="/how-it-works">How AI skills work</a><a href="/blog/how-to-use-claude-skills">How to use Claude skills</a></p>`,
  ].join("");
  return {
    url: STUDY_PATH,
    title: d.title,
    documentTitle: d.documentTitle,
    desc: d.description,
    h1: d.title,
    body,
    modified: d.modified ?? d.published,
    main: datasetLd(d),
  };
}

function growth(d) {
  const c = d.census;
  return [
    h2("growth", "How fast skills spread"),
    p(esc(c.growthText)),
    columns(c.byMonth.map(([m, n]) => ({ label: month(m), value: n })), {
      id: "chart-growth", caption: c.growthCaption, note: c.growthNote, csv: csv("new-skill-repos-by-month.csv"), every: 3, valueName: "New repos",
    }),
    p(esc(c.launchText)),
  ].join("");
}

function who(d) {
  const c = d.census;
  return [
    h2("who", "Who makes them"),
    p(esc(c.whoText)),
    bars(c.stars.map(([label, n]) => ({ label, value: (n / c.confirmed) * 100, display: `${fmt(n)} (${share((n / c.confirmed) * 100)})` })), {
      id: "chart-stars", caption: c.starsCaption, note: c.starsNote, unit: "%", csv: csv("skill-repos-10-stars.csv"),
    }),
    p(esc(c.concentrationText)),
    bars(c.where.map(([label, n, pctOf]) => ({ label, value: pctOf, display: `${share(pctOf)} (${fmt(n)})` })), {
      id: "chart-where", caption: c.whereCaption, note: c.whereNote, unit: "%", max: Math.max(...c.where.map((w) => w[2])), csv: csv("where-skills-live.csv"),
    }),
  ].join("");
}

function shape(d) {
  const s = d.corpus;
  if (!s) return "";
  return [
    h2("shape", "What a skill looks like"),
    p(esc(s.text)),
    bars(s.rules.map((r) => ({ label: r.label, value: r.pass, strong: r.pass < 90 })), {
      id: "chart-spec", caption: s.rulesCaption, note: s.rulesNote, unit: "%", csv: csv("format-rules.csv"),
    }),
    ...(s.more ?? []).map((t) => p(esc(t))),
    table(["Rule", "Popular repos", "Small repos"], s.rows, { caption: "Share of distinct skills passing each rule, popular repos against small repos" }),
  ].join("");
}

function copies(d) {
  const s = d.copies;
  if (!s) return "";
  return [
    h2("copies", "Copies and near-copies"),
    p(esc(s.text)),
    s.split ? split(s.split, { id: "chart-copies", caption: s.splitCaption, note: s.splitNote, csv: csv("copies.csv") }) : "",
    ...(s.more ?? []).map((t) => p(esc(t))),
    s.mostCopied ? table(["Skill name", "Repos holding a copy"], s.mostCopied, { caption: s.mostCopiedCaption }) : "",
  ].join("");
}

function licences(d) {
  const c = d.census, s = d.licences;
  return [
    h2("licences", "Licences"),
    p(esc(s.text)),
    bars(c.licences.map(([label, n, pctOf]) => ({ label, value: pctOf, display: `${share(pctOf)} (${fmt(n)})`, strong: label === "No licence" })), {
      id: "chart-licences", caption: s.caption, note: s.note, unit: "%", max: Math.max(...c.licences.map((l) => l[2])), csv: csv("repo-licences.csv"),
    }),
    ...(s.more ?? []).map((t) => p(esc(t))),
  ].join("");
}

function safety(d) {
  const s = d.safety;
  return [
    h2("safety", "Safety and false alarms"),
    p(esc(s.text)),
    s.rules ? bars(s.rules.map((r) => ({ label: r.label, value: r.falseAlarm, display: `${share(r.falseAlarm)} (${fmt(r.fa)} of ${fmt(r.n)})` })), {
      id: "chart-false-alarms", caption: s.rulesCaption, note: s.rulesNote, unit: "%", csv: csv("scanner-false-alarms-by-rule.csv"),
    }) : "",
    ...(s.more ?? []).map((t) => p(esc(t))),
    s.capabilities ? bars(s.capabilities.map((r) => ({ label: r.label, value: r.pct })), { id: "chart-capabilities", caption: s.capabilitiesCaption, note: s.capabilitiesNote, unit: "%", csv: csv("capabilities.csv") }) : "",
    s.themes ? `<h3>What the real risks looked like</h3>${ul(s.themes.map((t) => `<b>${esc(t.label)}</b> ${esc(t.text)}`))}` : "",
    p(esc(s.reviewNote)),
  ].join("");
}

function jobs(d) {
  const s = d.jobs;
  return [
    h2("jobs", "What jobs skills cover"),
    p(esc(s.text)),
    s.groups ? bars(s.groups.map((g) => ({ label: g.label, value: g.pct, strong: g.business }))
      , { id: "chart-jobs", caption: s.groupsCaption, note: s.groupsNote, unit: "%", max: Math.max(...s.groups.map((g) => g.pct)), csv: csv("jobs-by-group.csv") }) : "",
    ...(s.more ?? []).map((t) => p(esc(t))),
    s.gaps ? table(["Small-business job", "Public skills found"], s.gaps.map((g) => [g.job, g.count]), { caption: s.gapsCaption }) : "",
    s.gapsNote ? p(esc(s.gapsNote)) : "",
  ].join("");
}

function advice(d) {
  return [
    h2("advice", "What this means for you"),
    ...d.advice.map((a) => `<h3>${esc(a.who)}</h3>${ul(a.points.map(esc))}`),
  ].join("");
}

function method(d) {
  const m = d.method;
  return [
    h2("method", "How we did it"),
    ...m.steps.map((s) => `<h3>${esc(s.head)}</h3>${p(esc(s.text))}`),
    `<h3>What this study can't tell you</h3>${ul(m.limits.map(esc))}`,
    `<h3>Earlier studies</h3>`,
    p(esc(m.priorText)),
    `<ul class="hub-list">${m.prior.map((w) => `<li><a href="https://arxiv.org/abs/${esc(w.id)}" rel="noopener">${esc(w.name)}</a><span>arXiv ${esc(w.id)}: ${esc(w.finding)}.</span></li>`).join("")}</ul>`,
  ].join("");
}

function data(d) {
  const cite = `${d.author} (${d.published.slice(0, 4)}). ${d.title}. AI Blocks. ${SITE}${STUDY_PATH}`;
  return [
    h2("data", "Get the data"),
    p(esc(d.dataText)),
    `<ul class="hub-list">${d.files.map((f) => `<li><a href="${csv(f.file)}" download>${esc(f.file)}</a><span>${esc(f.text)}</span></li>`).join("")}</ul>`,
    `<h3>How to cite this study</h3><p class="rs-cite">${esc(cite)}</p>`,
    p(esc(d.licenceText)),
    p(`Found a mistake? Tell us on the <a href="/support">help page</a> and we'll fix it and say what changed.`),
  ].join("");
}

/** schema.org Dataset for the page's main entity: what was measured, when, by whom, and the files to download. */
export function datasetLd(d) {
  return {
    "@type": "Dataset",
    name: d.title,
    description: d.description,
    url: `${SITE}${STUDY_PATH}`,
    creator: { "@id": `${SITE}/#org` },
    publisher: { "@id": `${SITE}/#org` },
    author: { "@type": "Person", name: d.author },
    datePublished: d.published,
    dateModified: d.modified ?? d.published,
    temporalCoverage: d.temporalCoverage,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: d.keywords,
    variableMeasured: d.variables,
    measurementTechnique: d.techniques,
    distribution: d.files.map((f) => ({ "@type": "DataDownload", name: f.file, encodingFormat: "text/csv", contentUrl: `${SITE}${csv(f.file)}` })),
  };
}
