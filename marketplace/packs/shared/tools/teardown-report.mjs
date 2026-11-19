#!/usr/bin/env node
// teardown-report.mjs: check a D2C competitor teardown against its evidence, then render it as a data dashboard.
//
//   node tools/teardown-report.mjs check <dir> [--report report.md] [--you <your-dir>]       exit 1 when a hard rule fails
//   node tools/teardown-report.mjs render <dir> [--report report.md] [--you <your-dir>] [--out report.html] [--embed] [--brand brand.json]
//   node tools/teardown-report.mjs handoffs <dir> [--report report.md] [--you <your-dir>]    writes handoffs/<agent-id>.md
//   node tools/teardown-report.mjs template                                                  prints the report skeleton
//
// Plain Node 18+, no packages. <dir> holds evidence.json from teardown-collect.mjs, shots/ from teardown-shots.mjs and
// report.md written by the analyst. A personalized report also needs the owner's own store collected with the same
// tool, either in <dir>/you or passed with --you. Its evidence is cited as Y1..Yn so their facts and yours never mix.
// --embed puts the logo, product images, screenshots and agent portraits inside the page (one file to share).

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const uniq = (a) => [...new Set(a)];
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const fmtN = (n) => (n == null || !Number.isFinite(+n) ? "–" : Number(n) >= 1000 ? Number(n).toLocaleString("en-US") : String(round(n)));
const SYM = { USD: "$", CAD: "CA$", AUD: "A$", GBP: "£", EUR: "€", INR: "₹", NZD: "NZ$", SGD: "S$", AED: "AED " };
const money = (n, cur) => (n == null || !Number.isFinite(+n) ? "–" : `${SYM[cur || "USD"] ?? `${cur} `}${Number.isInteger(+n) ? Number(n).toLocaleString("en-US") : Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const pct = (x) => (x == null || !Number.isFinite(+x) ? "–" : `${Math.round(x * 100)}%`);
const CITE = /\[((?:[EY]\d+)(?:\s*[,;]\s*[EY]\d+)*)\]/g;

// ---------- the report contract ----------
// Short analysis, lots of data. The page draws the charts from the evidence; the writer adds what the numbers mean.
export const SECTIONS = [
  ["The short version", true], ["10 moves for you", true], ["Their ads", true], ["Their landing pages", true], ["Lessons", true],
  ["Offer and pricing", true], ["Products and launches", true], ["Paid media", true], ["Site and conversion", true],
  ["Retention", true], ["Creators and social", true], ["Search and AI answers", true], ["Where they are weak", true],
  ["You vs them", false], ["Hand-offs to your agents", true], ["Unknowns and how to check", true],
];
const TEMPLATE = `# {Brand}: how they sell, and what to take

**Mode:** personalized for {Your brand} ({your-store.com})   OR   **Mode:** general
**Verdict:** {one plain sentence: the engine, the offer and the moat.}

## The short version
- **{Finding in 4 to 8 words.}** {One or two sentences with the number and [E#].}
{3 to 5 bullets.}

## 10 moves for you
| # | Move | Why (their data) | How | Agent | Effort | Week |
|---|---|---|---|---|---|---|
| 1 | {verb first, one line} | {their number [E#], and in personalized mode yours [Y#]} | {the first concrete step} | {Name} (\`agent-id\`) | S / M / L | 1 |
{10 rows. Weeks 1 to 4. Personalized: at least 5 rows cite your store [Y#].}

## Their ads
{3 to 6 bullets on what the ads in the gallery and the numbers show: angles, offers, formats, who is on screen. Cite.}

## Their landing pages
{3 to 6 bullets on what the page screenshots show: the first screen, the offer, the proof, the path to buy. Cite.}

## Lessons
- **{Lesson in a few words.}** {Why it works for this buyer, with evidence. What it means for a D2C store.}
{5 lessons.}

## Offer and pricing
## Products and launches
## Paid media
## Site and conversion
## Retention
## Creators and social
## Search and AI answers
{Each: 2 to 4 bullets. The page already draws the chart, so say what it means and cite.}

## Where they are weak
{Gaps you can take, each tied to evidence.}

## You vs them
{Personalized mode only: 3 to 5 bullets comparing your store [Y#] with theirs [E#]: where you lead, where you trail.}

## Hand-offs to your agents
### {Agent name} · {lane} ({agent-id})
- **What they do:** {their play in this lane, cited [E#]}
- **Take:** {what to borrow}
- **Beat them:** {where to do better}
- **Brief:** {paste-ready job with numbers and a date. Personalized: your products, prices and voice, cited [Y#]. General: {your hero product} style placeholders, never their product names or claims.}

## Unknowns and how to check
{What could not be seen, why, and the link to check by hand.}
`;

// ---------- markdown ----------
function inline(s, ids) {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>");
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, a, h) => `<a href="${h}" target="_blank" rel="noopener">${a}</a>`);
  t = t.replace(CITE, (_, g) => `<span class="cites">${g.split(/\s*[,;]\s*/).map((id) => ids.has(id) ? `<a class="cite ${id[0] === "Y" ? "you" : ""}" href="#${id}" title="${esc(ids.get(id))}">${id}</a>` : `<span class="cite bad" title="not in evidence">${id}?</span>`).join("")}</span>`);
  return t;
}
function mdBlocks(md, ids) {
  const lines = md.replace(/\r/g, "").split("\n"); const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^#{3,4}\s/.test(l)) { out.push(`<h4>${inline(l.replace(/^#+\s*/, ""), ids)}</h4>`); i++; continue; }
    if (/^\|/.test(l)) { const rows = []; while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]); const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()); const head = cells(rows[0]); const body = rows.slice(/^\|\s*:?-{2,}/.test(rows[1] || "") ? 2 : 1); out.push(`<div class="tablewrap"><table><thead><tr>${head.map((h) => `<th>${inline(h, ids)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c, ids)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); continue; }
    if (/^\s*[-*]\s/.test(l)) { const items = []; while (i < lines.length && (/^\s*[-*]\s/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) { if (/^\s*[-*]\s/.test(lines[i])) items.push(lines[i].replace(/^\s*[-*]\s/, "")); else items[items.length - 1] += " " + lines[i].trim(); i++; } out.push(`<ul>${items.map((x) => `<li>${inline(x, ids)}</li>`).join("")}</ul>`); continue; }
    if (/^\s*\d+[.)]\s/.test(l)) { const items = []; while (i < lines.length && (/^\s*\d+[.)]\s/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) { if (/^\s*\d+[.)]\s/.test(lines[i])) items.push(lines[i].replace(/^\s*\d+[.)]\s/, "")); else items[items.length - 1] += " " + lines[i].trim(); i++; } out.push(`<ol>${items.map((x) => `<li>${inline(x, ids)}</li>`).join("")}</ol>`); continue; }
    if (/^>\s?/.test(l)) { const q = []; while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, "")); out.push(`<blockquote>${inline(q.join(" "), ids)}</blockquote>`); continue; }
    const p = []; while (i < lines.length && lines[i].trim() && !/^(#|\||\s*[-*]\s|\s*\d+[.)]\s|>)/.test(lines[i])) p.push(lines[i++].trim());
    out.push(`<p>${inline(p.join(" "), ids)}</p>`);
  }
  return out.join("\n");
}
const listItems = (body) => { const out = []; for (const l of body.replace(/\r/g, "").split("\n")) { if (/^\s*[-*]\s|^\s*\d+[.)]\s/.test(l)) out.push(l.replace(/^\s*(?:[-*]|\d+[.)])\s/, "")); else if (/^\s{2,}\S/.test(l) && out.length) out[out.length - 1] += " " + l.trim(); } return out; };
const splitLead = (s) => { const m = /^\*\*(.+?)\*\*\s*(.*)$/.exec(s.trim()); return m ? { lead: m[1].replace(/[.:]\s*$/, ""), rest: m[2] } : { lead: null, rest: s }; };

function parseReport(md) {
  const text = md.replace(/\r/g, "");
  const title = /^#\s+(.+)$/m.exec(text)?.[1]?.trim() || "Marketing teardown";
  const verdict = /\*\*Verdict:\*\*\s*(.+)/.exec(text)?.[1]?.trim() || "";
  const modeLine = /\*\*Mode:\*\*\s*(.+)/.exec(text)?.[1]?.trim() || "";
  const mm = /^(personali[sz]ed|general)\b(?:\s+for\s+([^(.\n]+))?\s*(?:\(([^)]+)\))?\s*[.:]?\s*(.*)$/i.exec(modeLine);
  const mode = mm ? { kind: /general/i.test(mm[1]) ? "general" : "personalized", owner: mm[2]?.trim() || null, ownerSite: mm[3]?.trim() || null, note: mm[4]?.trim() || "" } : { kind: null, owner: null, ownerSite: null, note: "" };
  const parts = text.split(/^##\s+/m).slice(1).map((chunk) => { const nl = chunk.indexOf("\n"); return { heading: chunk.slice(0, nl < 0 ? undefined : nl).trim(), body: nl < 0 ? "" : chunk.slice(nl + 1).trim() }; });
  return { title, verdict, mode, modeLine, sections: parts };
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const findSection = (sections, name) => sections.find((s) => norm(s.heading) === norm(name) || norm(s.heading).startsWith(norm(name).split(" ").slice(0, 2).join(" ")));
const AGENT_ID = /([a-z0-9]+(?:-[a-z0-9]+)+)/;
function parseMoves(body) {
  const rows = body.replace(/\r/g, "").split("\n").filter((l) => /^\|/.test(l.trim()));
  if (rows.length < 2) return [];
  const cells = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const head = cells(rows[0]).map((h) => norm(h)); const col = (re) => head.findIndex((h) => re.test(h));
  const ci = { n: col(/^(#|n|no)$/), move: col(/^move/), why: col(/^why/), how: col(/^how/), agent: col(/^(agent|owner|who)/), effort: col(/^effort/), week: col(/^(week|when)/) };
  return rows.slice(1).filter((r) => !/^\|\s*:?-{2,}/.test(r.trim())).map((r, i) => {
    const c = cells(r); const get = (k) => (ci[k] >= 0 ? c[ci[k]] || "" : "");
    const agent = get("agent"); const id = /`([^`]+)`/.exec(agent)?.[1] || /\(([^)]+)\)/.exec(agent)?.[1]?.match(AGENT_ID)?.[1] || null;
    return { n: Number(get("n")) || i + 1, move: get("move"), why: get("why"), how: get("how"), agent: agent.replace(/\s*\(.*\)\s*$/, "").replace(/`[^`]*`/g, "").trim(), id, effort: get("effort"), week: Number(/\d+/.exec(get("week"))?.[0]) || null };
  });
}
function parseHandoffs(body) {
  return body.split(/^###\s+/m).slice(1).map((chunk) => {
    const nl = chunk.indexOf("\n"); const head = chunk.slice(0, nl < 0 ? undefined : nl).trim(); const rest = nl < 0 ? "" : chunk.slice(nl + 1);
    const id = /\(([a-z0-9]+(?:-[a-z0-9]+)+)\)\s*$/.exec(head)?.[1] || null;
    const field = (k) => new RegExp(`^\\s*[-*]\\s*\\*\\*${k}:?\\*\\*:?\\s*([\\s\\S]*?)(?=^\\s*[-*]\\s*\\*\\*|$(?![\\s\\S]))`, "mi").exec(rest)?.[1]?.trim() || "";
    return { head: head.replace(/\s*\([^)]*\)\s*$/, ""), id, does: field("What they do"), take: field("Take"), beat: field("Beat them"), brief: field("Brief"), raw: rest.trim() };
  });
}

// ---------- loading ----------
// The owner's bundle keeps its own numbering, shown as Y#, so a reader always knows whose fact it is.
function asOwner(b) {
  if (!b) return null; const map = (id) => (typeof id === "string" ? id.replace(/^E/, "Y") : id);
  const ids = Object.fromEntries(Object.entries(b.ids || {}).map(([k, v]) => [k, Array.isArray(v) ? v.map(map) : map(v)]));
  return { ...b, ids, evidence: b.evidence.map((e) => ({ ...e, id: map(e.id) })), scorecard: (b.scorecard || []).map((r) => ({ ...r, evidence: (r.evidence || []).map(map) })) };
}
function load(dir) {
  const ev = JSON.parse(fs.readFileSync(path.join(dir, "evidence.json"), "utf8"));
  const rp = opt("report", path.join(dir, "report.md"));
  const md = fs.existsSync(rp) ? fs.readFileSync(rp, "utf8") : null;
  const yp = opt("you", fs.existsSync(path.join(dir, "you", "evidence.json")) ? path.join(dir, "you") : null);
  const you = yp && fs.existsSync(path.join(yp, "evidence.json")) ? asOwner(JSON.parse(fs.readFileSync(path.join(yp, "evidence.json"), "utf8"))) : null;
  const sp = path.join(dir, "shots", "shots.json"); const shots = fs.existsSync(sp) ? JSON.parse(fs.readFileSync(sp, "utf8")).shots || [] : [];
  const lp = path.join(dir, "shots", "look.json"); const look = fs.existsSync(lp) ? JSON.parse(fs.readFileSync(lp, "utf8")) : null;
  return { ev, md, rp, you, shots, look };
}
function knownAgents(ev) { return new Set((ev.lanes || []).flatMap((l) => l.agents)); }
const evData = (b, key) => b?.evidence.find((e) => e.id === b.ids?.[key])?.data;

// ---------- writing checks ----------
// The plain-writing rules every report follows: short sentences, everyday words, no stock AI phrasing.
const BANNED = /\b(leverag(e|es|ed|ing)|utili[sz](e|es|ed|ing)|delve|robust|seamless(ly)?|unlock(s|ed|ing)?|elevat(e|es|ed|ing)|game[- ]chang(er|ing)|landscape|tapestry|supercharg(e|es|ed|ing)|synerg(y|ies)|holistic|cutting[- ]edge|in order to|it'?s worth noting|needle[- ]mover|best[- ]in[- ]class|world[- ]class)\b/gi;
const TELLS = [
  [/\bit'?s not (just )?[^.;:\n]{1,40}[,;:] it'?s\b/i, "\"It's not X, it's Y\""],
  [/\bnot (just|only|merely) [^.\n]{1,50}, but\b/i, "\"not just X, but Y\""],
  [/(^|\n)\s*(?:[-*]\s*)?(In today'?s|In a world|Let'?s dive|Here'?s the thing|The bottom line|In conclusion|At the end of the day)\b/i, "stock opener"],
  [/\?\s+(The answer|Simple|Easy)[:.]/i, "question answered by itself"],
];
function syllables(w) { w = w.toLowerCase().replace(/[^a-z]/g, ""); if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, ""); return Math.max(1, (w.match(/[aeiouy]{1,2}/g) || []).length); }
function grade(text) {
  const clean = text.replace(CITE, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/https?:\/\/\S+/g, "").replace(/[`*_>#|]/g, " ");
  const sentences = clean.split(/[.!?]+(?:\s|$)/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 3);
  const words = clean.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  if (!sentences.length || words.length < 60) return null;
  const syl = words.reduce((a, w) => a + syllables(w), 0);
  return round(0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59, 1);
}

// ---------- check ----------
export function check(ev, md, you = null, shots = []) {
  const errors = [], warnings = [];
  const ids = new Map([...ev.evidence.map((e) => [e.id, e.label]), ...(you ? you.evidence.map((e) => [e.id, e.label]) : [])]);
  if (!md) return { ok: false, errors: ["report.md is missing"], warnings, stats: {} };
  const rep = parseReport(md); const mode = rep.mode.kind;
  if (!rep.verdict) errors.push("No **Verdict:** line under the title.");
  if (!mode) errors.push("No **Mode:** line. Ask the owner first: personalized for their brand, or general? Then write \"**Mode:** personalized for Brand (store.com)\" or \"**Mode:** general\".");
  if (mode === "personalized" && !you) errors.push("Mode is personalized but the owner's store is not collected. Run teardown-collect.mjs on their store into <dir>/you (or pass --you <dir>).");
  for (const [name, required] of SECTIONS) if ((required || (name === "You vs them" && mode === "personalized")) && !findSection(rep.sections, name)) errors.push(`Missing section: ## ${name}`);
  const cited = [...md.matchAll(CITE)].flatMap((m) => m[1].split(/\s*[,;]\s*/));
  const bad = uniq(cited.filter((c) => !ids.has(c))); if (bad.length) errors.push(`Citations not in the evidence: ${bad.join(", ")}`);
  if (mode === "general" && cited.some((c) => c.startsWith("Y"))) errors.push("General mode cites Y# (an owner's store). Remove those or switch to personalized.");
  const unused = ev.evidence.map((e) => e.id).filter((id) => !cited.includes(id));
  // Coverage: claim lines in the analysis sections should cite.
  const skip = /unknowns|hand-offs|10 moves/i; let claims = 0, withCite = 0; const uncited = [];
  for (const s of rep.sections) { if (skip.test(s.heading)) continue; for (const line of s.body.split("\n")) { const t = line.trim(); if (!t || /^\|?\s*:?-{2,}/.test(t) || /^#/.test(t) || t.length < 50) continue; claims++; if (/\[[EY]\d+/.test(t)) withCite++; else uncited.push(`${s.heading}: ${t.slice(0, 90)}`); } }
  const coverage = claims ? withCite / claims : 0;
  if (coverage < 0.7) errors.push(`Only ${pct(coverage)} of claim lines cite evidence (need 70%+). First uncited: ${uncited.slice(0, 3).join(" | ")}`);
  else if (coverage < 0.85) warnings.push(`${pct(coverage)} of claim lines cite evidence. Uncited: ${uncited.slice(0, 3).join(" | ")}`);
  const agents = knownAgents(ev);
  // The 10 moves
  const mv = findSection(rep.sections, "10 moves for you"); const moves = mv ? parseMoves(mv.body) : [];
  if (mv) {
    if (moves.length < 8) errors.push(`"10 moves for you" has ${moves.length} rows in its table; write 10.`); else if (moves.length !== 10) warnings.push(`"10 moves for you" has ${moves.length} rows; 10 reads best.`);
    for (const m of moves) {
      if (!/\[[EY]\d+/.test(m.why)) errors.push(`Move ${m.n} "${m.move.slice(0, 50)}": the Why must cite evidence.`);
      if (!m.id) errors.push(`Move ${m.n}: name the agent with its id, like Lindsey (\`lindsey-meta-media-buyer\`).`); else if (agents.size && !agents.has(m.id)) warnings.push(`Move ${m.n}: agent id "${m.id}" is not in the e-commerce lane map.`);
      if (!m.week || m.week > 4) warnings.push(`Move ${m.n}: give a week from 1 to 4.`);
      if (!m.how || m.how.length < 20) errors.push(`Move ${m.n}: the How is missing or too short to act on.`);
    }
    if (mode === "personalized" && moves.filter((m) => /\[Y\d+/.test(m.why + m.how)).length < 5) errors.push("Personalized mode: at least 5 of the 10 moves must cite the owner's store [Y#], so the plan fits their brand.");
  }
  // Lessons
  const ls = findSection(rep.sections, "Lessons"); if (ls && listItems(ls.body).length < 3) warnings.push("Lessons has fewer than 3 items; write 5.");
  // Hand-offs, with the mode rules
  const ho = findSection(rep.sections, "Hand-offs to your agents");
  const theirProducts = uniq([...(evData(ev, "productList")?.products || []).map((p) => p.title), ...((evData(ev, "bestSellers") || evData(ev, "featured"))?.ranked || []).map((p) => p.title)].filter((t) => t && t.length >= 8 && t.split(/\s+/).length >= 2)).map((t) => t.replace(/[“”"]/g, ""));
  const theirLines = (evData(ev, "adsAngles")?.headlines || []).map((h) => h.text.split(" | ")[0]).filter((t) => t.length >= 14);
  if (ho) {
    const list = parseHandoffs(ho.body);
    if (list.length < 6) errors.push(`Only ${list.length} hand-offs; brief at least 6 agents across different lanes.`);
    for (const h of list) {
      if (!h.id) errors.push(`Hand-off "${h.head}" has no (agent-id) at the end of its heading.`);
      else if (agents.size && !agents.has(h.id)) warnings.push(`Hand-off agent id "${h.id}" is not in the e-commerce lane map; check the spelling.`);
      if (!h.does || !/\[E\d+/.test(h.does)) errors.push(`Hand-off "${h.head}": "What they do" must cite their evidence [E#].`);
      if (!h.brief || h.brief.length < 80) errors.push(`Hand-off "${h.head}": the Brief is missing or too short to act on.`);
      if (h.brief && !/\d/.test(h.brief)) warnings.push(`Hand-off "${h.head}": the Brief has no number (count, cadence, price or date).`);
      const brief = (h.brief || "").toLowerCase().replace(/[“”"]/g, "");
      const named = theirProducts.filter((t) => brief.includes(t.toLowerCase())); const lifted = theirLines.filter((t) => brief.includes(t.toLowerCase()));
      if (mode === "general") {
        if (!/\{[^}]{3,}\}/.test(h.brief || "")) errors.push(`Hand-off "${h.head}": general mode briefs use placeholders for the owner's facts, like {your hero product} or {your price}.`);
        if (named.length) errors.push(`Hand-off "${h.head}": the Brief names their product (${named[0]}). In general mode write {your hero product} instead.`);
      }
      if (mode === "personalized") {
        if (!/\[Y\d+/.test(h.brief || "") && !(rep.mode.owner && brief.includes(rep.mode.owner.toLowerCase()))) errors.push(`Hand-off "${h.head}": a personalized Brief must use the owner's own store, cited [Y#].`);
        if (named.length) warnings.push(`Hand-off "${h.head}": the Brief names their product (${named[0]}). Brief the owner's own product.`);
      }
      if (lifted.length) errors.push(`Hand-off "${h.head}": the Brief reuses their ad line "${lifted[0]}". Study the angle, write your own words.`);
    }
    const lanes = new Set(list.map((h) => (ev.lanes || []).find((l) => l.agents.includes(h.id))?.lane).filter(Boolean));
    if (list.length && lanes.size < 5) warnings.push(`Hand-offs cover ${lanes.size} lanes; aim for 6 or more.`);
  }
  // Invented money and results
  for (const m of md.matchAll(/[^.\n]*(?:spend|spent|budget|revenue|sales of|ROAS|CAC|AOV|conversion rate)[^.\n]*[$£€₹]\s?\d[^.\n]*/gi)) {
    if (!/\[[EY]\d+/.test(m[0]) && !/\b(estimate|likely|probably|assum|your|you |target|test at|cap at)/i.test(m[0])) errors.push(`Money figure on spend, revenue or results without evidence or an estimate label: "${m[0].trim().slice(0, 120)}"`);
  }
  for (const m of md.matchAll(/[^.\n]*\b(?:don't|doesn't|do not|does not|never|no)\s+(?:run|use|have|advertis|email|sell|post|bid|offer)[^.\n]*/gi)) if (!/\[[EY]\d+/.test(m[0]) && !/unknown|could not|not seen|not checked|not visible/i.test(m[0])) warnings.push(`Absence claim without evidence (unknown is not absent): "${m[0].trim().slice(0, 110)}"`);
  // Quotes must exist in the evidence or the screenshot notes
  const hay = (JSON.stringify(ev.evidence) + JSON.stringify(you?.evidence || []) + JSON.stringify(shots)).toLowerCase().replace(/\\u2019|’/g, "'").replace(/\\"/g, '"').replace(/\s+/g, " ");
  const quotes = [];
  for (const line of md.split("\n")) { const marks = [...line.matchAll(/["“”]/g)].map((m) => m.index); for (let i = 0; i + 1 < marks.length; i += 2) { const inner = line.slice(marks[i] + 1, marks[i + 1]); if (inner.length >= 24 && inner.length <= 200) quotes.push(inner); } }
  for (const q0 of quotes) { const q = q0.toLowerCase().replace(/’/g, "'").replace(/\s+/g, " ").replace(/…|\.\.\./g, "").trim(); if (!hay.includes(q.slice(0, 40)) && !/brief|e\.g\.|for example|example/i.test(q)) warnings.push(`Quote not found in evidence (quote exactly, or write it without quote marks): "${q0.slice(0, 80)}"`); }
  // Screenshots: show the ads and the pages
  if (!shots.some((s) => /_ads$/.test(s.kind))) warnings.push("No ad screenshots. Capture 4 to 8 ads from the Ad Library in a browser and add them with teardown-shots.mjs add.");
  if (!shots.some((s) => s.kind === "page")) warnings.push("No landing page screenshots. Run teardown-shots.mjs pages.");
  const unk = findSection(rep.sections, "Unknowns and how to check"); if (unk && (unk.body.match(/https?:\/\//g) || []).length < 3) warnings.push("Unknowns section has fewer than 3 links to check by hand.");
  // Writing
  const prose = rep.sections.filter((s) => !/unknowns/i.test(s.heading)).map((s) => [...listItems(s.body), ...s.body.split("\n").filter((l) => l.trim() && !/^\s*([-*|#>]|\d+[.)])/.test(l))].join("\n")).join("\n");
  const g = grade(prose); if (g != null && g > 10) warnings.push(`Reading grade ${g}. Aim for 8 to 9: shorter sentences, plainer words.`);
  const banned = uniq([...md.matchAll(BANNED)].map((m) => m[0].toLowerCase())); if (banned.length) warnings.push(`Words to swap for plain ones: ${banned.join(", ")}.`);
  for (const [re, name] of TELLS) { const m = re.exec(md); if (m) warnings.push(`AI tell (${name}): "${m[0].trim().slice(0, 80)}"`); }
  const dashes = (md.match(/—/g) || []).length; if (dashes) warnings.push(`${dashes} em dash${dashes > 1 ? "es" : ""}. Use a full stop, comma or colon.`);
  const words = md.split(/\s+/).length; if (words > 5200) warnings.push(`Report is ${words} words. The page is a dashboard: cut prose the charts already show.`); else if (words < 1200) warnings.push(`Report is ${words} words; it is probably missing analysis.`);
  return { ok: errors.length === 0, errors, warnings: uniq(warnings), stats: { mode, owner: rep.mode.owner, words, reading_grade: g, citations: cited.length, coverage: round(coverage, 3), moves: moves.length, evidence_items: ev.evidence.length, owner_evidence_items: you?.evidence.length || 0, evidence_unused: unused, handoffs: ho ? parseHandoffs(ho.body).length : 0, screenshots: shots.length } };
}

// ---------- brand theme (light only) ----------
const hexRgb = (h) => { h = (h || "").replace("#", ""); if (h.length === 3) h = [...h].map((c) => c + c).join(""); return /^[0-9a-f]{6}$/i.test(h) ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) : null; };
const rgbHex = (c) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const cssHex = (c) => { if (!c) return null; if (/^#/.test(c)) return hexRgb(c) ? c.toLowerCase() : null; const m = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/.exec(c); if (!m || (m[4] !== undefined && +m[4] < 0.9)) return null; return rgbHex([+m[1], +m[2], +m[3]]); };
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const L = (h) => lum(hexRgb(h));
const contrast = (a, b) => { const A = L(a), B = L(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); };
const mix = (a, b, t) => rgbHex(hexRgb(a).map((v, i) => v + (hexRgb(b)[i] - v) * t));
const sat = (h) => { const c = hexRgb(h); const mx = Math.max(...c), mn = Math.min(...c); return mx ? (mx - mn) / mx : 0; };
const darken = (h, against, need) => { let c = h; for (let i = 0; i < 12 && contrast(c, against) < need; i++) c = mix(c, "#000000", 0.12); return c; };
function nearestGoogle(f, role, google) {
  const serif = /garamond|serif|caslon|baskerville|didot|bodoni|playfair|canela|tiempos|freight|lora|georgia|times|recoleta|cooper|gt super|ogg|domaine|editorial|ivy|chronicle|publico|lyon|portrait|reckless|alpina/i;
  if (!f) return role === "display" ? "Fraunces" : "Instrument Sans";
  if (google.has(f.toLowerCase()) || /^(inter|inter tight|dm sans|dm serif display|playfair display|lora|poppins|montserrat|work sans|space grotesk|libre baskerville|eb garamond|cormorant garamond|fraunces|instrument sans|instrument serif|manrope|archivo|outfit|figtree|syne|rubik|karla|nunito|bricolage grotesque|newsreader|crimson pro|josefin sans|barlow|barlow condensed|oswald|bebas neue|anton|roboto|roboto condensed|courier prime)$/i.test(f)) return f;
  if (/typewriter|courier/i.test(f)) return "Courier Prime";
  if (/cond|compressed|narrow/i.test(f)) return serif.test(f) ? "Cormorant Garamond" : "Barlow Condensed";
  if (/garamond|caslon|baskerville/i.test(f)) return "EB Garamond";
  if (/didot|bodoni|canela|ogg|domaine|editorial|ivy|portrait|reckless|recoleta|cooper/i.test(f)) return "Fraunces";
  if (serif.test(f)) return "Newsreader";
  if (/mono|plex mono|code/i.test(f)) return "IBM Plex Mono";
  if (/futura|avenir|circular|gilroy|geometric|brandon|sofia|proxima|gotham|graphik|neue montreal|ppneue|apercu/i.test(f)) return role === "display" ? "Outfit" : "Figtree";
  if (/grotesk|grotesque|helvetica|aktiv|suisse|haas|akzidenz|neue/i.test(f)) return "Inter Tight";
  if (/rounded|round|soft|bubble|retail/i.test(f)) return role === "display" ? "Bricolage Grotesque" : "Nunito";
  return role === "display" ? "Bricolage Grotesque" : "Instrument Sans";
}
const generic = (f) => (/typewriter|courier|mono/i.test(f || "") ? "ui-monospace, Menlo, monospace" : /garamond|serif|caslon|baskerville|didot|bodoni|canela|georgia|times|alpina/i.test(f || "") ? `Georgia, "Times New Roman", serif` : `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`);
function theme(ev, look) {
  let b = ev.brand || {};
  const brandPath = opt("brand", null);
  if (brandPath && fs.existsSync(brandPath)) { const j = JSON.parse(fs.readFileSync(brandPath, "utf8")); b = { ...b, ...(j.brand || j), fonts: { ...(b.fonts || {}), ...((j.brand || j).fonts || {}) } }; }
  // Colours: what the browser drew wins over what the CSS files say. The page is always light.
  const lookBgs = (look?.backgrounds || []).map(cssHex).filter(Boolean);
  const roleColors = Object.values(look?.roles || {}).map((r) => cssHex(r.color)).filter(Boolean);
  const lights = [...lookBgs, b.background].filter((h) => hexRgb(h) && L(h) > 0.72);
  const bg = lights[0] || "#ffffff";
  const darks = [cssHex(look?.roles?.p?.color), cssHex(look?.roles?.h3?.color), b.text, ...roleColors].filter((h) => h && hexRgb(h) && L(h) < 0.08);
  const text = darks.find((h) => contrast(h, bg) >= 7) || "#161616";
  const colorful = uniq([...roleColors, ...lookBgs, ...(b.accents || [])].filter((h) => hexRgb(h) && sat(h) > 0.3));
  const strong0 = colorful.find((h) => contrast(h, bg) >= 3) || colorful[0] || mix(text, bg, 0.1);
  const strong = darken(strong0, bg, 3); const strongText = darken(strong, bg, 4.6);
  const highlight = colorful.find((h) => L(h) > 0.3 && h !== strong0) || mix(strong, bg, 0.75);
  const onStrong = contrast("#ffffff", strong) >= 4.5 ? "#ffffff" : "#111111";
  // Type: the families the homepage drew for its biggest heading and its body text.
  const roles = look?.roles || {}; const bodyFam = roles.p?.family || b.fonts?.body || null;
  const heads = ["h1", "h2", "h3"].map((k) => roles[k]).filter(Boolean).sort((x, y) => parseFloat(y.size) - parseFloat(x.size));
  const display = heads.find((h) => h.family !== bodyFam)?.family || heads[0]?.family || b.fonts?.heading || (b.fonts?.families || [])[0] || null;
  const body = bodyFam || b.fonts?.body || display;
  const google = new Set((b.fonts?.google || []).map((f) => f.toLowerCase()));
  const gDisplay = nearestGoogle(display, "display", google); const gBody = body && body !== display ? nearestGoogle(body, "body", google) : (/serif|garamond|alpina/i.test(gDisplay) ? "Instrument Sans" : gDisplay);
  const fams = uniq([gDisplay, gBody, "Inter Tight"]);
  const googleHref = `https://fonts.googleapis.com/css2?${fams.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;700`).join("&")}&display=swap`;
  const faces = (b.fonts?.faces || []).filter((f) => f.src && /\.woff2/i.test(f.src) && [display, body].includes(f.family)).slice(0, 4);
  const dWeight = Number(heads.find((h) => h.family === display)?.weight) >= 600 ? 700 : 400;
  return { name: b.name || ev.target?.host, logo: b.logo || {}, bg, text, strong, strongText, highlight, onHighlight: contrast("#111111", highlight) >= 4.5 ? "#111111" : "#ffffff", onStrong, muted: darken(mix(text, bg, 0.42), bg, 4.6), line: mix(text, bg, 0.85), panel: mix(bg, text, 0.03), you: "#5b6675", youBar: "#aab1bb", display, body, dWeight, googleHref, faces, displayStack: `${display ? `"${display}", ` : ""}"${gDisplay}", ${generic(display)}`, bodyStack: `${body ? `"${body}", ` : ""}"${gBody}", ${generic(body)}` };
}

// ---------- embedding ----------
async function dataUri(url, maxBytes = 900000) {
  if (!url) return null; if (url.startsWith("//")) url = "https:" + url;
  try { const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; AIBlocksTeardown/1.0; +https://agents.useaiblocks.com)" }, signal: AbortSignal.timeout(20000) }); if (!r.ok) return null; const buf = Buffer.from(await r.arrayBuffer()); if (buf.length > maxBytes) return null; const type = r.headers.get("content-type")?.split(";")[0] || (url.match(/\.svg/i) ? "image/svg+xml" : "image/png"); return `data:${type};base64,${buf.toString("base64")}`; } catch { return null; }
}
const fileUri = (f) => { try { const ext = path.extname(f).toLowerCase(); const type = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg"; return `data:${type};base64,${fs.readFileSync(f).toString("base64")}`; } catch { return null; } };
const sized = (u, w) => { if (!u) return u; if (u.startsWith("//")) u = "https:" + u; return /cdn\.shopify\.com|\/cdn\/shop\//.test(u) ? u + (u.includes("?") ? "&" : "?") + `width=${w}` : u; };
const cleanSvg = (svg) => svg.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "").replace(/\s(width|height)="[^"]*"/i, "");

// ---------- charts (inline SVG; their colour is the brand's, yours is slate) ----------
function columns(items, { w = 640, h = 190, label, value, fmt = fmtN } = {}) {
  if (!items.length) return "";
  const max = Math.max(1, ...items.map(value)); const bw = (w - 20) / items.length; const top = 18, bottom = 30;
  const bars = items.map((d, i) => { const v = value(d); const bh = ((h - top - bottom) * v) / max; const x = 10 + i * bw; const y = h - bottom - bh; return `<g><rect x="${x + bw * 0.15}" y="${y}" width="${bw * 0.7}" height="${Math.max(bh, v ? 2 : 0)}" rx="2" class="them"><title>${esc(label(d))}: ${esc(fmt(v))}</title></rect>${v ? `<text x="${x + bw / 2}" y="${y - 5}" text-anchor="middle" class="cv">${esc(fmt(v))}</text>` : ""}${items.length <= 24 || i % 2 === 0 ? `<text x="${x + bw / 2}" y="${h - bottom + 15}" text-anchor="middle" class="cl">${esc(label(d))}</text>` : ""}</g>`; }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="bar chart">${bars}<line x1="10" x2="${w - 10}" y1="${h - bottom}" y2="${h - bottom}" class="axis"/></svg>`;
}
function grouped(labels, them, you, { w = 660, h = 210 } = {}) {
  const max = Math.max(1, ...them, ...(you || [])); const gw = (w - 20) / labels.length; const top = 18, bottom = 30; const n = you ? 2 : 1; const bw = (gw * 0.76) / n;
  const g = labels.map((lab, i) => { const x0 = 10 + i * gw + gw * 0.12; const bar = (v, k, cls) => { const bh = ((h - top - bottom) * v) / max; const y = h - bottom - bh; return `<rect x="${x0 + k * bw}" y="${y}" width="${bw - 2}" height="${Math.max(bh, v ? 2 : 0)}" rx="2" class="${cls}"><title>${esc(lab)}: ${v}</title></rect>${v ? `<text x="${x0 + k * bw + bw / 2 - 1}" y="${y - 4}" text-anchor="middle" class="cv">${v}</text>` : ""}`; }; return `<g>${bar(them[i], 0, "them")}${you ? bar(you[i], 1, "you") : ""}<text x="${10 + i * gw + gw / 2}" y="${h - bottom + 15}" text-anchor="middle" class="cl">${esc(lab)}</text></g>`; }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="grouped bar chart">${g}<line x1="10" x2="${w - 10}" y1="${h - bottom}" y2="${h - bottom}" class="axis"/></svg>`;
}
function hbars(items, { label, value, max: mx } = {}) {
  if (!items.length) return ""; const max = mx || Math.max(1, ...items.map(value));
  return `<div class="hb">${items.map((d) => `<div class="hbr"><div class="hbl" title="${esc(label(d))}">${esc(label(d))}</div><div class="hbt"><i style="width:${Math.max(2, (100 * value(d)) / max).toFixed(1)}%"></i></div><div class="hbv">${fmtN(value(d))}</div></div>`).join("")}</div>`;
}
const legend = (you, ownerName, themName) => `<div class="legend"><span><i class="them"></i>${esc(themName)}</span>${you ? `<span><i class="you"></i>${esc(ownerName || "You")}</span>` : ""}</div>`;
function priceBands(themP, youP) {
  const all = [...themP, ...(youP || [])].sort((a, b) => a - b); if (!all.length) return null;
  const p95 = all[Math.floor(all.length * 0.95)] || all[all.length - 1];
  const step = [5, 10, 15, 20, 25, 50, 100, 200, 500].find((s) => p95 / s <= 7) || 1000; const nb = Math.max(2, Math.ceil(p95 / step));
  const labels = Array.from({ length: nb }, (_, i) => (i === nb - 1 ? `${i * step}+` : `${i * step}–${(i + 1) * step}`));
  const count = (ps) => labels.map((_, i) => ps.filter((p) => (i === nb - 1 ? p >= i * step : p >= i * step && p < (i + 1) * step)).length);
  return { labels, them: count(themP), you: youP ? count(youP) : null };
}

// ---------- the numbers that matter, for them and for you ----------
function metrics(b) {
  if (!b) return {};
  const d = (k) => evData(b, k); const cat = d("catalogue"), lau = d("launches"), ads = d("adsSummary"), gs = d("googleSeen"), ga = d("googleAds"), sm = d("sitemap"), st = d("stack"), off = d("homeOffers");
  const pdps = (b.ids?.pdps || []).map((id) => b.evidence.find((e) => e.id === id)).filter(Boolean);
  const rc = pdps.map((p) => Number(String(p.data?.rating?.count ?? "").replace(/[^\d]/g, ""))).filter((n) => n > 0);
  const subs = pdps.filter((p) => p.data?.subscription_plans?.length).length; const cur = cat?.currency;
  return {
    products: { label: "Products for sale", v: cat?.sellable_products, id: b.ids?.catalogue },
    median: { label: "Median price", v: cat?.price?.median, show: money(cat?.price?.median, cur), id: b.ids?.catalogue },
    range: { label: "Price range", v: null, show: cat ? `${money(cat.price.min, cur)} to ${money(cat.price.max, cur)}` : null, id: b.ids?.catalogue },
    onsale: { label: "Products on sale", v: cat?.on_sale_share, show: pct(cat?.on_sale_share), id: b.ids?.catalogue },
    launch90: { label: "New products in 90 days", v: lau?.last_90_days, id: b.ids?.launches },
    meta: { label: "Live Meta ads", v: ads?.library_live_ads_estimate ?? null, show: ads?.library_live_ads_estimate != null ? `~${fmtN(ads.library_live_ads_estimate)}` : null, id: b.ids?.adsSummary },
    meta30: { label: "Meta ads started in 30 days*", v: ads?.launched_last_30_days, id: b.ids?.adsSummary },
    google: { label: "Google ads on record", v: gs?.ads ?? ga?.google_total_estimate?.low ?? null, show: gs?.ads_label || (ga?.google_total_estimate?.low ? `~${fmtN(ga.google_total_estimate.low)}` : null), id: b.ids?.googleSeen || b.ids?.googleAds },
    reviews: { label: "Reviews on a top product", v: rc.length ? Math.max(...rc) : null, id: (b.ids?.pdps || [])[0] },
    subs: { label: "Subscribe and save on product pages", v: pdps.length ? subs / pdps.length : null, show: pdps.length ? `${subs} of ${pdps.length}` : null, id: (b.ids?.pdps || [])[0] },
    tools: { label: "Marketing tools in the code", v: st?.tools?.length ?? null, id: b.ids?.stack },
    blog90: { label: "Blog posts updated in 90 days", v: sm?.blog_posts_updated_90d ?? null, id: b.ids?.sitemap },
    freeship: { label: "Free shipping from", v: off?.free_shipping_threshold ?? null, show: off?.free_shipping_threshold != null ? money(off.free_shipping_threshold, cur) : null, id: b.ids?.homeOffers },
  };
}
const citeA = (id) => (id ? `<a class="cite ${String(id)[0] === "Y" ? "you" : ""}" href="#${id}">${id}</a>` : "");

// ---------- render ----------
async function render(dir) {
  const { ev, md, you, shots, look } = load(dir); if (!md) throw new Error("report.md is missing; write it first (see: template).");
  const embed = flag("embed"); const T = theme(ev, look); const rep = parseReport(md);
  const ids = new Map([...ev.evidence.map((e) => [e.id, e.label]), ...(you ? you.evidence.map((e) => [e.id, e.label]) : [])]);
  const personal = rep.mode.kind === "personalized" && you; const owner = rep.mode.owner || you?.brand?.name || "You"; const them = T.name;
  const E = (key) => ev.evidence.find((e) => e.id === ev.ids?.[key]); const Y = (key) => you?.evidence.find((e) => e.id === you.ids?.[key]);
  const sec = (name) => findSection(rep.sections, name); const body = (name) => (sec(name) ? mdBlocks(sec(name).body.split(/^###\s+/m)[0], ids) : "");
  const img = async (src, w, max = 400000) => { const s = sized(src, w); return embed ? await dataUri(s, max) : s; };
  const shotSrc = (f) => (embed ? fileUri(path.join(dir, "shots", f)) : `shots/${f}`);

  // logo: on a light page a raster logo sits as drawn; an SVG takes the text colour
  let logoHtml = `<span class="wordmark">${esc(them)}</span>`;
  if (T.logo?.svg) logoHtml = `<span class="logo svg">${cleanSvg(T.logo.svg)}</span>`;
  else { const u = await img(T.logo?.img || T.logo?.jsonld, 600, 900000); if (u) logoHtml = `<img class="logo" src="${u}" alt="${esc(them)} logo">`; }
  const faceCss = T.faces.map((f) => `@font-face{font-family:"${f.family}";src:url("${f.src}") format("woff2");font-weight:${f.weight || 400};font-style:${f.style || "normal"};font-display:swap}`).join("\n");

  // 1. Overview: them vs you, or their numbers alone
  const M = metrics(ev), MY = personal ? metrics(you) : null;
  const has = (m) => m && ((m.show && m.show !== "–") || (m.v !== null && m.v !== undefined && m.v !== false && Number.isFinite(+m.v)));
  const order = ["products", "median", "range", "onsale", "launch90", "meta", "meta30", "google", "reviews", "subs", "tools", "blog90", "freeship"];
  let board;
  if (personal) {
    const rows = order.filter((k) => has(M[k]) || has(MY[k])).map((k) => {
      const a = M[k], y = MY[k]; const av = a?.v, yv = y?.v; const num = Number.isFinite(+av) && Number.isFinite(+yv) && av != null && yv != null; const mx = num ? Math.max(+av, +yv, 1e-9) : 0;
      return `<div class="vs-row"><div class="vs-l">${esc(a?.label || y?.label)}</div><div class="vs-t"><b>${esc(a?.show ?? fmtN(av))}</b>${citeA(a?.id)}</div><div class="vs-bars">${num ? `<i class="them" style="width:${((100 * av) / mx).toFixed(1)}%"></i><i class="you" style="width:${((100 * yv) / mx).toFixed(1)}%"></i>` : ""}</div><div class="vs-y"><b>${esc(y?.show ?? fmtN(yv))}</b>${citeA(y?.id)}</div></div>`;
    }).join("");
    board = `<div class="vs"><div class="vs-row vs-h"><div class="vs-l">Measure</div><div class="vs-t">${esc(them)}</div><div class="vs-bars"></div><div class="vs-y">${esc(owner)}</div></div>${rows}<p class="small">* Meta ad counts come from a sample of up to 50 to 150 ads per brand, newest first. Live totals are the Ad Library's own estimate.</p></div>`;
  } else {
    board = `<div class="tiles">${order.filter((k) => has(M[k])).slice(0, 10).map((k) => `<div class="tile"><div class="tv">${esc(M[k].show ?? fmtN(M[k].v))}</div><div class="tk">${esc(M[k].label)} ${citeA(M[k].id)}</div></div>`).join("")}</div>`;
  }
  const short = sec("The short version") ? listItems(sec("The short version").body) : [];
  const shortHtml = short.length ? `<ol class="insights">${short.map((s) => { const { lead, rest } = splitLead(s); return `<li>${lead ? `<b>${inline(lead, ids)}</b>` : ""}<span>${inline(rest, ids)}</span></li>`; }).join("")}</ol>` : body("The short version");
  const dots = (n) => `<span class="dots" aria-label="${n} of 3">${[0, 1, 2].map((i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</span>`;
  const yourScore = new Map((personal ? you.scorecard : []).map((r) => [r.channel, r]));
  const scoreHtml = `<div class="tablewrap"><table class="score"><thead><tr><th>Channel</th><th>${esc(them)}</th>${personal ? `<th>${esc(owner)}</th>` : ""}<th>What was seen</th></tr></thead><tbody>${(ev.scorecard || []).map((r) => { const y = yourScore.get(r.channel); return `<tr class="${r.status === "unknown" ? "unk" : ""}"><td>${esc(r.channel)}</td><td>${dots(r.strength)}</td>${personal ? `<td class="yc">${y ? dots(y.strength) : "–"}</td>` : ""}<td>${esc(r.saw)} ${r.evidence.map(citeA).join("") || (r.check ? `<a href="${r.check}" target="_blank" rel="noopener">check</a>` : "")}</td></tr>`; }).join("")}</tbody></table></div>`;

  // 2. The 10 moves
  const moves = sec("10 moves for you") ? parseMoves(sec("10 moves for you").body) : [];
  const lanes = ev.lanes || [];
  const nameOf = (id) => { for (const l of lanes) { const i = l.agents.indexOf(id); if (i >= 0) return l.names?.[i] || null; } return null; };
  const portrait = async (id) => (id ? (embed ? await dataUri(`https://agents.useaiblocks.com/agents/${id}.webp`, 200000) : `https://agents.useaiblocks.com/agents/${id}.webp`) : null);
  const portraits = new Map(); for (const id of uniq([...moves.map((m) => m.id), ...(sec("Hand-offs to your agents") ? parseHandoffs(sec("Hand-offs to your agents").body).map((h) => h.id) : [])]).filter(Boolean)) portraits.set(id, await portrait(id));
  const weekStrip = `<div class="weeks">${[1, 2, 3, 4].map((w) => `<div class="wk"><div class="wkh">Week ${w}</div>${moves.filter((m) => m.week === w).map((m) => `<a href="#move-${m.n}" class="wkm"><b>${m.n}</b>${esc(m.move.replace(/\*\*/g, "").slice(0, 48))}${m.move.length > 48 ? "…" : ""}</a>`).join("") || `<span class="small">–</span>`}</div>`).join("")}</div>`;
  const effortCls = (e) => (/^s|low|small/i.test(e) ? "s" : /^l|high|large|big/i.test(e) ? "l" : "m");
  const movesHtml = moves.length ? `${weekStrip}<div class="moves">${moves.map((m) => `<article class="move" id="move-${m.n}"><div class="mn">${m.n}</div><div class="mb"><h3>${inline(m.move, ids)}</h3><p><span class="lbl">Why</span> ${inline(m.why, ids)}</p><p><span class="lbl">How</span> ${inline(m.how, ids)}</p><div class="mf">${m.id ? `<span class="who">${portraits.get(m.id) ? `<img src="${portraits.get(m.id)}" alt="">` : ""}${esc(m.agent || nameOf(m.id) || m.id)} <code>${esc(m.id)}</code></span>` : ""}<span class="pill e-${effortCls(m.effort)}">Effort ${esc(m.effort || "?")}</span><span class="pill">Week ${m.week || "?"}</span></div></div></article>`).join("")}</div>` : body("10 moves for you");

  // 3. Their ads: screenshots first, then the numbers
  const ads = E("adsSummary")?.data; const angles = E("adsAngles")?.data; const win = E("adsWinners")?.data?.ads || [];
  const adShots = shots.filter((s) => /_ads$/.test(s.kind));
  const adCards = adShots.map((s) => { const src = shotSrc(s.file); return src ? `<figure class="shot ad"><a href="${esc(s.source)}" target="_blank" rel="noopener"><img src="${src}" alt="${esc(s.caption)}"></a><figcaption><span class="kind">${s.kind === "google_ads" ? "Google" : s.kind === "tiktok_ads" ? "TikTok" : "Meta"}</span> ${esc(s.caption)}${s.note ? `<span class="note">${esc(s.note)}</span>` : ""}</figcaption></figure>` : ""; }).join("");
  const adStats = [ads?.library_live_ads_estimate != null && [`~${fmtN(ads.library_live_ads_estimate)}`, "live Meta ads", ev.ids.adsSummary], ads && [fmtN(ads.launched_last_7_days), "started in the last 7 days*", ev.ids.adsSummary], ads && [fmtN(ads.launched_last_30_days), "started in 30 days*", ev.ids.adsSummary], ads && [fmtN(ads.launched_last_90_days), "started in 90 days*", ev.ids.adsSummary], E("googleSeen") && [E("googleSeen").data.ads_label || fmtN(E("googleSeen").data.ads), "Google ads on record", ev.ids.googleSeen]].filter(Boolean);
  const heads = Object.values((angles?.headlines || []).reduce((acc, h) => { const t = uniq(h.text.split(" | ").map((x) => x.trim())).join(" | "); if (t.length > 2 && t.length < 140) (acc[t.toLowerCase()] ||= { text: t, ads: 0 }).ads += h.ads; return acc; }, {})).sort((a, b) => b.ads - a.ads).slice(0, 9);
  const adsHtml = `${adCards ? `<div class="gallery ads">${adCards}</div>` : `<p class="small">No ad screenshots yet. Capture them from the Ad Library and add them with teardown-shots.mjs add.</p>`}
<div class="statrow">${adStats.map(([v, k, id]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(k)} ${citeA(id)}</span></div>`).join("")}</div>
<div class="split"><div class="viz">${ads?.launches_by_week?.length ? `<div class="vh">New Meta ads per week in the sample ${citeA(ev.ids.adsSummary)}</div>${columns(ads.launches_by_week.slice(-18), { label: (d) => d.week.slice(5).replace("-", "/"), value: (d) => d.n, w: 680 })}` : ""}${heads.length ? `<div class="vh">Most-used headlines, by number of ads ${citeA(ev.ids.adsAngles)}</div>${hbars(heads, { label: (d) => d.text, value: (d) => d.ads })}` : ""}</div><div class="notes">${body("Their ads")}</div></div>
${win.length ? `<details class="more"><summary>Longest-running live ads (${win.length})</summary><div class="tablewrap"><table><thead><tr><th>Days live</th><th>Started</th><th>Headline</th></tr></thead><tbody>${win.slice(0, 10).map((a) => `<tr><td class="num">${a.days_running}</td><td>${esc(a.started)}</td><td><a href="${esc(a.snapshot)}" target="_blank" rel="noopener">${esc(uniq((a.title || "view ad").split(" | ")).join(" | ").slice(0, 110))}</a></td></tr>`).join("")}</tbody></table></div></details>` : ""}`;

  // 4. Their landing pages
  const pageShots = shots.filter((s) => s.kind === "page"); const phones = pageShots.filter((s) => s.viewport === "phone"); const homeDesk = pageShots.find((s) => s.viewport === "desktop");
  const pagesHtml = `${homeDesk ? `<figure class="shot desk"><img src="${shotSrc(homeDesk.file)}" alt="${esc(homeDesk.caption)} on a laptop"><figcaption>${esc(homeDesk.caption)}, desktop · <a href="${esc(homeDesk.source)}" target="_blank" rel="noopener">${esc(homeDesk.source.replace(/^https?:\/\//, ""))}</a></figcaption></figure>` : ""}
<div class="gallery phones">${phones.map((s) => `<figure class="shot phone"><div class="scroll" tabindex="0" aria-label="${esc(s.caption)}, scroll to see more"><img src="${shotSrc(s.file)}" alt="${esc(s.caption)} on a phone"></div><figcaption><b>${esc(s.caption.replace(/^Product page: /, ""))}</b><span class="note">${esc(s.why || "")}</span><a href="${esc(s.source)}" target="_blank" rel="noopener">${esc(s.source.replace(/^https?:\/\/(www\.)?/, "").slice(0, 60))}</a></figcaption></figure>`).join("")}</div>
<div class="notes wide">${body("Their landing pages")}</div>`;

  // 5. Lessons
  const lessons = sec("Lessons") ? listItems(sec("Lessons").body) : [];
  const lessonsHtml = lessons.length ? `<div class="lessons">${lessons.map((s, i) => { const { lead, rest } = splitLead(s); return `<article class="lesson"><div class="ln">${String(i + 1).padStart(2, "0")}</div>${lead ? `<h3>${inline(lead, ids)}</h3>` : ""}<p>${inline(rest, ids)}</p></article>`; }).join("")}</div>` : body("Lessons");

  // 6. The data, section by section: chart on the left, what it means on the right
  const panels = [];
  const panel = (name, viz) => { if (!sec(name) && !viz) return; panels.push(`<section class="panel" id="p-${norm(name).replace(/ /g, "-")}"><h3>${esc(sec(name)?.heading || name)}</h3><div class="split"><div class="viz">${viz || ""}</div><div class="notes">${body(name)}</div></div></section>`); };
  const cat = E("catalogue")?.data; const ycat = personal ? Y("catalogue")?.data : null;
  const prices = (b) => (evData(b, "productList")?.products || []).filter((p) => p.available !== false && Number.isFinite(+p.price) && p.price > 0).map((p) => +p.price);
  const pb = priceBands(prices(ev), personal ? prices(you) : null);
  const offers = (b) => { const o = evData(b, "homeOffers") || {}; return [o.free_shipping_threshold != null && `Free shipping from ${money(o.free_shipping_threshold, evData(b, "catalogue")?.currency)}`, ...(o.percent_off || []).slice(0, 3).map((x) => `${x}`), ...(o.first_order || []).slice(0, 2), ...(o.gift || []).slice(0, 2), ...(o.urgency || []).slice(0, 2)].filter(Boolean).map((x) => String(x).slice(0, 70)); };
  panel("Offer and pricing", `${pb ? `<div class="vh">Products by price (${esc(cat?.currency || "USD")}) ${citeA(ev.ids.productList || ev.ids.catalogue)}${personal ? ` ${citeA(you.ids.productList || you.ids.catalogue)}` : ""}</div>${legend(personal, owner, them)}${grouped(pb.labels, pb.them, pb.you)}` : ""}
<div class="kv2"><div><span>Median price</span><b>${money(cat?.price?.median, cat?.currency)}</b>${personal ? `<em>${esc(owner)}: ${money(ycat?.price?.median, ycat?.currency)}</em>` : ""}</div><div><span>On sale</span><b>${pct(cat?.on_sale_share)}</b>${personal ? `<em>${esc(owner)}: ${pct(ycat?.on_sale_share)}</em>` : ""}</div><div><span>Deepest discount</span><b>${pct(cat?.max_discount)}</b>${personal ? `<em>${esc(owner)}: ${pct(ycat?.max_discount)}</em>` : ""}</div></div>
${offers(ev).length ? `<div class="vh">On their homepage now ${citeA(ev.ids.homeOffers || ev.ids.home)}</div><div class="chips">${offers(ev).map((o) => `<span class="chip">${esc(o)}</span>`).join("")}</div>` : ""}`);
  const lau = E("launches")?.data; const ylau = personal ? Y("launches")?.data : null;
  const months = lau?.by_month?.map((m) => m.month) || [];
  const best = (E("bestSellers") || E("featured"))?.data?.ranked?.slice(0, 6) || [];
  const cards = async (list, currency) => (await Promise.all(list.map(async (p) => { if (p.compare_at && p.price && p.compare_at > p.price * 2.5) p.compare_at = null; const u = await img(p.image, 360); return `<div class="prod">${u ? `<img src="${u}" alt="${esc(p.title)}">` : `<div class="noimg"></div>`}<div class="pt">${esc(p.title)}</div><div class="pp">${p.price != null ? money(p.price, currency) : ""}${p.compare_at ? ` <s>${money(p.compare_at, currency)}</s>` : ""}</div></div>`; }))).join("");
  const yBest = personal ? (Y("bestSellers") || Y("featured"))?.data?.ranked?.slice(0, 6) || [] : [];
  panel("Products and launches", `${months.length ? `<div class="vh">Products launched per month ${citeA(ev.ids.launches)}${personal ? ` ${citeA(you.ids.launches)}` : ""}</div>${legend(personal && ylau, owner, them)}${grouped(months.map((m) => m.slice(2).replace("-", "/")), lau.by_month.map((m) => m.launches), personal && ylau ? months.map((m) => ylau.by_month.find((x) => x.month === m)?.launches || 0) : null, { w: 720 })}` : ""}
${best.length ? `<div class="vh">${E("bestSellers") ? "Their best sellers" : "What their homepage pushes"}, in order ${citeA(ev.ids.bestSellers || ev.ids.featured)}</div><div class="prods">${await cards(best, cat?.currency)}</div>` : ""}
${yBest.length ? `<div class="vh">Your ${Y("bestSellers") ? "best sellers" : "featured products"} ${citeA(you.ids.bestSellers || you.ids.featured)}</div><div class="prods you">${await cards(yBest, ycat?.currency)}</div>` : ""}`);
  const others = (ads?.other_pages_in_keyword_results || []).filter((o) => o.n >= 1).slice(0, 8);
  panel("Paid media", `${E("googleSeen") || E("googleAds") ? `<div class="kv2"><div><span>Live Meta ads</span><b>${M.meta.show || "–"}</b>${personal ? `<em>${esc(owner)}: ${MY.meta.show || "–"}</em>` : ""}</div><div><span>Google ads on record</span><b>${M.google.show || "–"}</b>${personal ? `<em>${esc(owner)}: ${MY.google.show || "–"}</em>` : ""}</div><div><span>Ad pixels in the code</span><b>${(E("stack")?.data?.by_category?.ads_pixel || []).length}</b>${personal ? `<em>${esc(owner)}: ${(Y("stack")?.data?.by_category?.ads_pixel || []).length}</em>` : ""}</div></div>` : ""}
${(E("stack")?.data?.by_category?.ads_pixel || []).length ? `<div class="vh">Ad pixels installed ${citeA(ev.ids.stack)}</div><div class="chips">${E("stack").data.by_category.ads_pixel.map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</div>` : ""}
${others.length ? `<div class="vh">Other pages running ads that name ${esc(them)} ${citeA(ev.ids.adsSummary)}</div><div class="tablewrap"><table><thead><tr><th>Page</th><th>Ads</th><th>A headline</th></tr></thead><tbody>${others.map((o) => `<tr><td>${esc(o.page)}</td><td class="num">${o.n}</td><td>${esc(uniq(((o.headlines || [])[0] || "").split(" | ")).join(" | ")).slice(0, 90)}</td></tr>`).join("")}</tbody></table></div>` : ""}`);
  const LABELS = { ads_pixel: "Ad pixels", attribution: "Attribution", email_sms: "Email and SMS", subscription: "Subscription", reviews: "Reviews", ugc: "UGC and video", loyalty: "Loyalty", referral: "Referral", affiliate: "Affiliates", creator: "Creators", upsell: "Upsells", testing: "Testing", quiz: "Quiz", search: "Site search", survey: "Post-purchase survey", support: "Support", returns: "Returns and shipping", bnpl: "Pay later", payments: "Payments", popup: "Pop-ups", international: "Cross-border", marketplace: "Marketplaces", retail: "Retail", analytics: "Analytics", tag_manager: "Tag managers", consent: "Consent" };
  const st = E("stack")?.data?.by_category || {}; const yst = personal ? Y("stack")?.data?.by_category || {} : null;
  const matrix = (cats) => { const keys = cats.filter((k) => st[k]?.length || yst?.[k]?.length); if (!keys.length) return ""; return `<div class="tablewrap"><table class="matrix"><thead><tr><th>Job</th><th>${esc(them)}</th>${yst ? `<th>${esc(owner)}</th>` : ""}</tr></thead><tbody>${keys.map((k) => { const a = st[k] || [], y = yst?.[k] || []; const gap = yst && a.length && !y.length; return `<tr class="${gap ? "gap" : ""}"><td>${esc(LABELS[k] || k)}${gap ? ` <span class="flag">gap</span>` : ""}</td><td>${a.map((n) => `<span class="chip">${esc(n)}</span>`).join("") || "<span class=\"small\">not seen</span>"}</td>${yst ? `<td>${y.map((n) => `<span class="chip y">${esc(n)}</span>`).join("") || "<span class=\"small\">not seen</span>"}</td>` : ""}</tr>`; }).join("")}</tbody></table></div>`; };
  const cite2 = (k) => `${citeA(ev.ids[k])}${personal ? ` ${citeA(you.ids[k])}` : ""}`;
  panel("Site and conversion", `<div class="vh">Tools found in the store's code ${cite2("stack")}</div>${matrix(["reviews", "ugc", "upsell", "quiz", "search", "testing", "bnpl", "payments", "popup", "survey", "support", "returns", "attribution", "analytics", "international"])}${(() => { const p = (ev.ids?.pdps || []).map((id) => ev.evidence.find((e) => e.id === id)).filter(Boolean); if (!p.length) return ""; const keys = Object.keys(p[0].data?.sections || {}); return `<div class="vh">What their product pages carry ${p.map((x) => citeA(x.id)).join("")}</div><div class="tablewrap"><table class="pdp"><thead><tr><th>Block</th>${p.map((x) => `<th>${esc((x.data.title || "").slice(0, 28))}</th>`).join("")}</tr></thead><tbody>${keys.map((k) => `<tr><td>${esc(k.replace(/_/g, " "))}</td>${p.map((x) => `<td>${x.data.sections?.[k] ? "<b class=\"yes\">yes</b>" : "<span class=\"small\">–</span>"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`; })()}`);
  const subPlans = (ev.ids?.pdps || []).map((id) => ev.evidence.find((e) => e.id === id)).filter((e) => e?.data?.subscription_plans?.length);
  panel("Retention", `<div class="vh">Retention tools ${cite2("stack")}</div>${matrix(["email_sms", "subscription", "loyalty", "referral"])}${subPlans.length ? `<div class="vh">Subscription plans on product pages</div><div class="chips">${subPlans.flatMap((e) => e.data.subscription_plans.slice(0, 3).map((p) => `<span class="chip">${esc(typeof p === "string" ? p : p.name || JSON.stringify(p)).slice(0, 60)} ${citeA(e.id)}</span>`)).join("")}</div>` : ""}`);
  const soc = E("socials")?.data || {}; const ysoc = personal ? Y("socials")?.data || {} : null;
  panel("Creators and social", `${matrix(["affiliate", "creator"])}<div class="vh">Social profiles linked from the store ${cite2("socials")}</div><div class="chips">${Object.entries(soc).map(([k, v]) => `<a class="chip" href="${esc(v)}" target="_blank" rel="noopener">${esc(k)}</a>`).join("")}</div>${ysoc ? `<div class="chips">${Object.entries(ysoc).map(([k, v]) => `<a class="chip y" href="${esc(v)}" target="_blank" rel="noopener">${esc(owner)}: ${esc(k)}</a>`).join("")}</div>` : ""}${E("youtube")?.data?.videos?.length ? `<div class="vh">Recent YouTube uploads ${citeA(ev.ids.youtube)}</div><ul class="tight">${E("youtube").data.videos.slice(0, 5).map((v) => `<li>${esc(v.published?.slice(0, 10) || "")} · ${esc(v.title)}</li>`).join("")}</ul>` : ""}`);
  const ac = E("autocomplete")?.data; const rb = E("robots")?.data; const yrb = personal ? Y("robots")?.data : null; const sm = E("sitemap")?.data; const ysm = personal ? Y("sitemap")?.data : null;
  const bots = rb ? Object.keys(rb).filter((k) => /bot|agent|extended|user/i.test(k)).slice(0, 8) : [];
  panel("Search and AI answers", `${ac ? `<div class="vh">What shoppers type into Google with their name ${citeA(ev.ids.autocomplete)}</div><div class="stack">${Object.entries(ac.themes || {}).filter(([, v]) => v.length).slice(0, 6).map(([k, v]) => `<div class="sg"><div class="sk">${esc(k.replace(/_/g, " "))}</div>${v.slice(0, 7).map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</div>`).join("")}</div>` : ""}
<div class="kv2"><div><span>Blog posts</span><b>${fmtN(sm?.blog_posts_read)}</b>${personal ? `<em>${esc(owner)}: ${fmtN(ysm?.blog_posts_read)}</em>` : ""}</div><div><span>Updated in 90 days</span><b>${fmtN(sm?.blog_posts_updated_90d)}</b>${personal ? `<em>${esc(owner)}: ${fmtN(ysm?.blog_posts_updated_90d)}</em>` : ""}</div><div><span>llms.txt</span><b>${E("llms")?.data?.present ? "yes" : "no"}</b>${personal ? `<em>${esc(owner)}: ${Y("llms")?.data?.present ? "yes" : "no"}</em>` : ""}</div></div>
${bots.length ? `<div class="vh">AI crawlers in robots.txt ${cite2("robots")}</div><div class="tablewrap"><table><thead><tr><th>Crawler</th><th>${esc(them)}</th>${yrb ? `<th>${esc(owner)}</th>` : ""}</tr></thead><tbody>${bots.map((k) => `<tr><td>${esc(k)}</td><td>${esc(String(rb[k]).replace(" (falls under *)", ""))}</td>${yrb ? `<td>${esc(String(yrb[k] ?? "–").replace(" (falls under *)", ""))}</td>` : ""}</tr>`).join("")}</tbody></table></div>` : ""}`);
  const hist = E("history")?.data?.snapshots || [];
  panel("Where they are weak", hist.length ? `<div class="vh">How their homepage pitch changed ${citeA(ev.ids.history)}</div><div class="timeline">${hist.slice(-6).map((s) => `<div class="tl"><div class="td">${esc(s.date)}</div><div class="tt">${esc((s.h1?.[0] || s.title || "").slice(0, 80))}</div></div>`).join("")}</div>` : "");
  if (personal) panel("You vs them", "");

  // 7. Hand-offs
  const hos = sec("Hand-offs to your agents") ? parseHandoffs(sec("Hand-offs to your agents").body) : [];
  const handHtml = `<div class="agents">${hos.map((h, i) => { const lane = lanes.find((l) => l.agents.includes(h.id)); const pu = portraits.get(h.id); return `<article class="agent"><header>${pu ? `<img src="${pu}" alt="">` : ""}<div><div class="an">${inline(h.head, ids)}</div><div class="al">${esc(lane?.lane || "")}${h.id ? ` · <code>${esc(h.id)}</code>` : ""}</div></div></header>${h.does ? `<p><span class="lbl">They</span> ${inline(h.does, ids)}</p>` : ""}${h.take ? `<p><span class="lbl">Take</span> ${inline(h.take, ids)}</p>` : ""}${h.beat ? `<p><span class="lbl">Beat</span> ${inline(h.beat, ids)}</p>` : ""}${h.brief ? `<div class="brief"><div class="bl">Brief to paste <button type="button" class="copy" data-for="brief-${i}">Copy</button></div><div id="brief-${i}">${inline(h.brief, ids)}</div></div>` : ""}</article>`; }).join("")}</div>`;

  // 8. Unknowns and evidence
  const evList = (list, title) => `<h3>${esc(title)}</h3>${list.map((e) => { const j = JSON.stringify(e.data, null, 1); return `<details id="${e.id}" class="ev"><summary><b>${e.id}</b> ${esc(e.label)} <span class="kind">${esc(e.kind)}</span></summary>${e.url ? `<p class="small"><a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.url.slice(0, 110))}</a> · ${esc((e.observed_at || "").slice(0, 16).replace("T", " "))} UTC</p>` : ""}${e.note ? `<p class="small">${esc(e.note)}</p>` : ""}<pre>${esc(j.length > 3000 ? j.slice(0, 3000) + "\n…" : j)}</pre></details>`; }).join("")}`;
  const date = (ev.updated_at || ev.collected_at).slice(0, 10);
  const modeHtml = personal ? `<span class="mode p">Personalized for ${esc(owner)}</span>` : `<span class="mode g">General playbook</span>`;
  const modeNote = personal ? `Compared with ${esc(owner)}'s own public store${rep.mode.ownerSite ? ` (${esc(rep.mode.ownerSite)})` : ""}, cited as Y#. ${esc(rep.mode.note)}` : `No brand profile was used. Briefs hold placeholders like {your hero product} for you to fill in. ${esc(rep.mode.note)}`;
  const nav = [["overview", "Overview"], ["moves", "10 moves"], ["ads", "Their ads"], ["pages", "Landing pages"], ["lessons", "Lessons"], ["data", "The data"], ["handoffs", "Hand-offs"], ["unknowns", "Unknowns"], ["evidence", "Evidence"]];
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(them)} teardown</title>
<meta name="color-scheme" content="light">
<link rel="stylesheet" href="${T.googleHref}">
<style>
${faceCss}
/* Light, data-first layout in ${esc(them)}'s colours and type: numbers and screenshots first, short notes beside them. */
:root{color-scheme:light;--bg:${T.bg};--text:${T.text};--strong:${T.strong};--strong-text:${T.strongText};--on-strong:${T.onStrong};--hl:${T.highlight};--on-hl:${T.onHighlight};--muted:${T.muted};--line:${T.line};--panel:${T.panel};--you:${T.you};--you-bar:${T.youBar};--display:${T.displayStack};--body:${T.bodyStack};--ui:"Inter Tight",ui-sans-serif,system-ui,sans-serif}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:64px}body{margin:0;background:var(--bg);color:var(--text);font:15.5px/1.55 var(--body);-webkit-font-smoothing:antialiased}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
a{color:inherit;text-decoration-color:var(--strong);text-underline-offset:3px}a:focus-visible,summary:focus-visible,button:focus-visible,.scroll:focus-visible{outline:2px solid var(--strong);outline-offset:2px}
.wrap{max-width:1180px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1,h2,h3{text-wrap:balance}p,li,td,.brief,.small,summary,figcaption{overflow-wrap:anywhere}main,section,article,figure,.viz,.notes{min-width:0}
b,.num,.tv,.vs b,.stat b,.kv2 b{font-variant-numeric:tabular-nums}
.mast{border-top:8px solid var(--strong);padding-block:22px 26px;border-bottom:1px solid var(--line)}
.mtop{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.logo{max-height:40px;max-width:200px;display:block}.logo.svg svg{height:36px;width:auto;max-width:200px;fill:currentColor}.wordmark{font:${T.dWeight} 26px/1 var(--display)}
.tag{font:600 11.5px/1.4 var(--ui);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);text-align:right}
.mode{display:inline-block;font:700 12px/1 var(--ui);padding:7px 10px;border-radius:99px;margin-left:8px;vertical-align:middle;text-transform:none;letter-spacing:0}.mode.p{background:var(--hl);color:var(--on-hl)}.mode.g{border:1.5px solid var(--text);color:var(--text)}
.mast h1{font:${T.dWeight} clamp(32px,5.4vw,60px)/1.02 var(--display);margin:26px 0 10px;letter-spacing:-.01em;max-width:20ch}
.verdict{font-size:clamp(17px,2vw,20px);max-width:66ch;margin:0}
.meta{margin:12px 0 0;font:13px/1.5 var(--ui);color:var(--muted);max-width:90ch}
nav.bar{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
nav.bar .wrap{display:flex;gap:4px;overflow-x:auto;padding-block:8px;scrollbar-width:none}nav.bar a{font:600 13px/1 var(--ui);padding:8px 11px;border-radius:99px;text-decoration:none;white-space:nowrap}nav.bar a:hover{background:var(--panel)}
section.block{padding-block:34px 10px}
h2{font:${T.dWeight} clamp(26px,3.4vw,38px)/1.1 var(--display);margin:0 0 6px}.sub{color:var(--muted);margin:0 0 18px;font-size:14.5px;max-width:80ch}
h3{font:${T.dWeight} 19px/1.25 var(--display);margin:0 0 8px}h4{font:700 15px/1.3 var(--ui);margin:16px 0 6px}
ul,ol{padding-left:20px}li{margin:6px 0}p{margin:8px 0}
.cites{white-space:nowrap}.cite{display:inline-block;font:700 10px/1 ui-monospace,Menlo,monospace;background:var(--strong);color:var(--on-strong);border-radius:4px;padding:3px 4px;margin:0 1px;text-decoration:none;vertical-align:2px}.cite.you{background:var(--you);color:#fff}.cite.bad{background:#b00020;color:#fff}
code{font:12px ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--panel);border:1px solid var(--line);padding:1px 5px;border-radius:4px}
.small{font-size:12.5px;color:var(--muted)}
.lbl{display:inline-block;font:700 10.5px/1 var(--ui);letter-spacing:.08em;text-transform:uppercase;color:var(--strong-text);min-width:38px}
/* overview */
.over{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:22px;align-items:start}
.vs{border:1px solid var(--line);border-radius:14px;padding:6px 14px 10px;background:var(--panel)}
.vs-row{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.9fr) minmax(60px,1fr) minmax(0,.9fr);gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line);font-size:14px}.vs-row:last-of-type{border-bottom:0}
.vs-h{font:700 11.5px/1.2 var(--ui);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}.vs-h .vs-t{color:var(--strong-text)}.vs-h .vs-y{color:var(--you)}
.vs-t b{color:var(--strong-text)}.vs-y b{color:var(--you)}.vs b{font:700 16px/1.2 var(--ui);margin-right:4px}
.vs-bars{display:grid;gap:3px}.vs-bars i{display:block;height:7px;border-radius:4px}.vs-bars i.them{background:var(--strong)}.vs-bars i.you{background:var(--you-bar)}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.tile{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--panel)}.tv{font:700 26px/1.1 var(--ui);color:var(--strong-text)}.tk{font-size:12.5px;color:var(--muted);margin-top:4px}
ol.insights{list-style:none;padding:0;margin:0;counter-reset:i;display:grid;gap:10px}ol.insights li{counter-increment:i;margin:0;padding:12px 14px 12px 52px;position:relative;border:1px solid var(--line);border-radius:12px}ol.insights li::before{content:counter(i);position:absolute;left:14px;top:12px;width:26px;height:26px;border-radius:50%;background:var(--strong);color:var(--on-strong);font:700 13px/26px var(--ui);text-align:center}ol.insights b{display:block;font:${T.dWeight} 17px/1.25 var(--display);margin-bottom:2px}
table{border-collapse:collapse;width:100%;font-size:13.5px}th,td{text-align:left;padding:7px 9px;border-bottom:1px solid var(--line);vertical-align:top}th{font:700 11px/1.3 var(--ui);text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}td.num{font-weight:700}.tablewrap{overflow-x:auto;margin:8px 0}
table.score tr.unk td{color:var(--muted)}.dots{white-space:nowrap}.dots i{display:inline-block;width:10px;height:10px;border-radius:3px;border:1.5px solid var(--strong);margin-right:2px}.dots i.on{background:var(--strong)}td.yc .dots i{border-color:var(--you)}td.yc .dots i.on{background:var(--you)}
/* moves */
.weeks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:16px}.wk{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:6px}.wkh{font:700 11px/1 var(--ui);letter-spacing:.08em;text-transform:uppercase;color:var(--strong-text)}.wkm{font-size:12.5px;line-height:1.3;text-decoration:none;display:flex;gap:6px}.wkm b{flex:0 0 20px;height:20px;border-radius:50%;background:var(--strong);color:var(--on-strong);font:700 11px/20px var(--ui);text-align:center}
.moves{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px}.move{display:grid;grid-template-columns:48px minmax(0,1fr);gap:12px;border:1px solid var(--line);border-radius:14px;padding:14px;background:var(--bg)}.move:target{outline:2px solid var(--strong)}
.mn{font:${T.dWeight} 40px/1 var(--display);color:var(--strong-text)}.move h3{font-size:17.5px;margin-bottom:4px;font-weight:700}.lesson h3,.an,ol.insights b,.panel>h3{font-weight:700}.move p{font-size:14px;margin:6px 0}
.mf{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px}.who{display:inline-flex;align-items:center;gap:6px;font:600 12.5px/1.2 var(--ui)}.who img{width:26px;height:26px;border-radius:50%;object-fit:cover;background:var(--line)}
.pill{font:700 11px/1 var(--ui);padding:5px 8px;border-radius:99px;border:1px solid var(--line)}.pill.e-s{background:var(--hl);color:var(--on-hl);border-color:transparent}.pill.e-l{background:var(--text);color:var(--bg);border-color:transparent}
/* galleries */
.gallery{display:grid;gap:12px}.gallery.ads{grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}.gallery.phones{grid-template-columns:repeat(auto-fill,minmax(210px,1fr));margin-top:14px}
figure.shot{margin:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--panel);display:flex;flex-direction:column}figure.shot img{display:block;width:100%;height:auto}
figure.ad img{max-height:440px;object-fit:cover;object-position:top}figure.shot figcaption{padding:10px 12px;font-size:13px;line-height:1.4;display:flex;flex-direction:column;gap:4px}
.kind{font:700 10px/1 var(--ui);letter-spacing:.08em;text-transform:uppercase;background:var(--strong);color:var(--on-strong);padding:3px 5px;border-radius:4px;align-self:flex-start}.note{color:var(--muted);font-size:12.5px}
figure.desk img{max-height:520px;object-fit:cover;object-position:top}.scroll{height:440px;overflow-y:auto;overscroll-behavior:contain}
.statrow{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:16px 0}.stat{border-left:4px solid var(--strong);padding:4px 10px}.stat b{display:block;font:700 26px/1.1 var(--ui)}.stat span{font-size:12.5px;color:var(--muted)}
.split{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:20px;align-items:start}.notes ul{margin-top:0}.notes.wide{max-width:80ch;margin-top:12px}
.vh{font:700 12px/1.35 var(--ui);letter-spacing:.02em;margin:14px 0 6px}.vh:first-child{margin-top:0}
svg.chart{width:100%;height:auto;display:block}svg.chart .cl{font:10.5px var(--ui);fill:var(--muted)}svg.chart .cv{font:700 10.5px var(--ui);fill:var(--text)}svg.chart .axis{stroke:var(--line)}svg .them{fill:var(--strong)}svg .you{fill:var(--you-bar)}
.legend{display:flex;gap:14px;font:600 12px var(--ui);margin-bottom:4px}.legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:-1px}.legend i.them{background:var(--strong)}.legend i.you{background:var(--you-bar)}
.hb{display:grid;gap:5px}.hbr{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(60px,1fr) 30px;gap:8px;align-items:center;font-size:12.5px}.hbl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hbt{background:var(--line);border-radius:4px;height:10px}.hbt i{display:block;height:10px;border-radius:4px;background:var(--strong)}.hbv{font:700 12px var(--ui);text-align:right}
details.more{margin-top:12px}details.more summary{cursor:pointer;font:700 13px var(--ui)}
/* lessons */
.lessons{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}.lesson{border-top:3px solid var(--text);padding-top:10px}.ln{font:700 12px var(--ui);color:var(--strong-text);letter-spacing:.08em}.lesson h3{margin:4px 0}.lesson p{font-size:14.5px}
/* data panels */
.panel{border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:14px}.panel>h3{font-size:22px;margin-bottom:12px}
.kv2{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin:12px 0}.kv2>div{background:var(--panel);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column}.kv2 span{font-size:11.5px;color:var(--muted)}.kv2 b{font:700 20px/1.2 var(--ui)}.kv2 em{font-style:normal;font-size:12px;color:var(--you);font-weight:600}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.chip{font-size:12px;border:1px solid var(--line);background:var(--bg);border-radius:99px;padding:3px 9px;text-decoration:none}.chip.y{border-color:var(--you);color:var(--you)}
table.matrix tr.gap td:first-child{font-weight:700}.flag{font:700 10px/1 var(--ui);background:var(--hl);color:var(--on-hl);padding:2px 5px;border-radius:4px;text-transform:uppercase}b.yes{color:var(--strong-text)}
.prods{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}.prod img,.noimg{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;background:var(--line)}.prods.you .prod img{outline:2px solid var(--you);outline-offset:-2px}.pt{font-size:12px;font-weight:600;line-height:1.25;margin-top:5px}.pp{font-size:12px;color:var(--muted)}
.stack{display:grid;gap:8px}.sg{display:flex;flex-wrap:wrap;gap:5px;align-items:center}.sk{font:700 11.5px var(--ui);min-width:110px;text-transform:capitalize}
.timeline{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.tl{background:var(--panel);border-radius:10px;padding:8px 10px}.td{font:700 11.5px var(--ui);color:var(--strong-text)}.tt{font-size:13px;line-height:1.3;margin-top:3px}
ul.tight{font-size:13px;padding-left:18px}
/* hand-offs */
.agents{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}.agent{border:1px solid var(--line);border-radius:16px;padding:14px;background:var(--panel)}.agent header{display:flex;gap:10px;align-items:center;margin-bottom:6px}.agent header img{width:46px;height:46px;border-radius:50%;object-fit:cover;background:var(--line)}
.an{font:${T.dWeight} 16px/1.25 var(--display)}.al{font-size:12px;color:var(--muted)}.agent p{font-size:14px;margin:7px 0}
.brief{margin-top:10px;background:var(--bg);border:1.5px dashed var(--strong);border-radius:10px;padding:10px 12px;font-size:13.5px}.bl{display:flex;justify-content:space-between;align-items:center;font:700 10.5px/1 var(--ui);letter-spacing:.08em;text-transform:uppercase;color:var(--strong-text);margin-bottom:6px}
button.copy{font:700 11px/1 var(--ui);border:1px solid var(--strong);background:var(--bg);color:var(--strong-text);border-radius:99px;padding:5px 9px;cursor:pointer;text-transform:none;letter-spacing:0}
.ev{border-bottom:1px solid var(--line);padding:6px 0}.ev summary{cursor:pointer;font-size:13.5px}.ev .kind{background:var(--panel);color:var(--muted);font-weight:600}.ev pre{white-space:pre-wrap;word-break:break-word;font-size:11px;background:var(--panel);padding:10px;border-radius:8px;max-height:340px;overflow:auto}.ev:target{background:var(--panel);outline:2px solid var(--strong);border-radius:8px}
footer{padding-block:30px 50px;font-size:12.5px;color:var(--muted);border-top:1px solid var(--line);margin-top:30px}
@media (max-width:860px){.over,.split{grid-template-columns:minmax(0,1fr)}.weeks{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.vs-row{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr)}.vs-bars{display:none}.moves,.agents{grid-template-columns:minmax(0,1fr)}.move{grid-template-columns:34px minmax(0,1fr)}.mn{font-size:30px}.tag{text-align:left}.scroll{height:380px}}
@media print{nav.bar{display:none}details{display:block}.scroll{height:auto;overflow:visible}}
</style></head><body>
<header class="mast"><div class="wrap"><div class="mtop">${logoHtml}<div class="tag">Independent teardown · ${esc(date)} · not made by or affiliated with ${esc(them)} ${modeHtml}</div></div>
<h1>${esc(rep.title)}</h1>${rep.verdict ? `<p class="verdict">${inline(rep.verdict, ids)}</p>` : ""}
<p class="meta">${modeNote} Built from ${ev.evidence.length} pieces of public evidence about ${esc(ev.target.host)}${personal ? ` and ${you.evidence.length} about ${esc(you.target.host)}` : ""}, ${shots.length} screenshots, and ${ev.unknowns.length} things we could not see (listed at the end). Every [E#] opens its source.</p></div></header>
<nav class="bar" aria-label="Sections"><div class="wrap">${nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join("")}</div></nav>
<main class="wrap">
<section class="block" id="overview"><h2>${personal ? `${esc(them)} vs ${esc(owner)}` : `${esc(them)} in numbers`}</h2><p class="sub">${personal ? `Their public numbers next to yours. Brand colour is ${esc(them)}; slate is ${esc(owner)}.` : "Their public numbers, read from the store, the ad libraries and search."}</p>
<div class="over"><div>${board}</div><div>${shortHtml}</div></div>
<h3 style="margin-top:22px">Where they put their effort</h3>${scoreHtml}</section>
<section class="block" id="moves"><h2>10 moves for you</h2><p class="sub">${personal ? `Ranked for ${esc(owner)}. Each move rests on their data and yours, and names the agent who does it.` : "Ranked for a D2C store in this category. Each move rests on their data and names the agent who does it."}</p>${movesHtml}</section>
<section class="block" id="ads"><h2>Their ads</h2><p class="sub">Their ads as they appear in the public ad libraries. Click a card to open it there.</p>${adsHtml}</section>
<section class="block" id="pages"><h2>Their landing pages</h2><p class="sub">The pages their ads and menus send people to, on a phone. Scroll inside each one.</p>${pagesHtml}</section>
<section class="block" id="lessons"><h2>Lessons</h2><p class="sub">What a D2C store can learn from how they sell.</p>${lessonsHtml}</section>
<section class="block" id="data"><h2>The data</h2><p class="sub">Each chart is drawn from the evidence. The notes say what it means.</p>${panels.join("")}</section>
<section class="block" id="handoffs"><h2>Hand-offs to your agents</h2><p class="sub">${personal ? `Briefs written for ${esc(owner)}, with your products and prices. Copy one into the agent's chat.` : "Briefs with {placeholders} for your own products and prices. Fill them in, then paste into the agent's chat."}</p>${handHtml}</section>
<section class="block" id="unknowns"><h2>Unknowns and how to check</h2>${body("Unknowns and how to check")}${ev.unknowns.length ? `<details class="more"><summary>All ${ev.unknowns.length} gaps the collector logged</summary><ul class="tight">${ev.unknowns.map((u) => `<li><b>${esc(u.what)}</b>: ${esc(u.why)}${u.check_url ? ` <a href="${esc(u.check_url)}" target="_blank" rel="noopener">check</a>` : ""}</li>`).join("")}</ul></details>` : ""}</section>
<section class="block" id="evidence"><h2>Evidence</h2><p class="sub">Every [E#] and [Y#] opens here. Observations were seen directly; derivations were worked out from them. Public sources only.</p>${evList(ev.evidence, `${them} (E#)`)}${personal ? evList(you.evidence, `${owner} (Y#)`) : ""}</section>
</main>
<footer><div class="wrap">Made with the D2C competitor teardown agent from AI Blocks. ${esc(them)}'s name, logo, product images, pages and ads belong to ${esc(them)} and appear here only to analyse them; this report is not made or endorsed by them. Study the strategy and write your own: do not copy their words, images or brand. ${personal ? `${esc(owner)} data comes from its public store and ad library. ` : ""}Method inspired by REM (Reverse Engineer Marketing, MIT).</div></footer>
<script>document.addEventListener("click",function(e){var b=e.target.closest("button.copy");if(!b)return;var t=document.getElementById(b.dataset.for);if(!t)return;var s=t.innerText;var done=function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy"},1500)};if(navigator.clipboard){navigator.clipboard.writeText(s).then(done,function(){var r=document.createRange();r.selectNodeContents(t);var sel=getSelection();sel.removeAllRanges();sel.addRange(r)})}});</script>
</body></html>`;
  const out = opt("out", path.join(dir, "report.html")); fs.writeFileSync(out, html);
  console.log(JSON.stringify({ out, bytes: Buffer.byteLength(html), embedded: embed, mode: rep.mode.kind, owner: personal ? owner : null, theme: { bg: T.bg, text: T.text, strong: T.strong, highlight: T.highlight, display: T.display, body: T.body } }));
}

function handoffs(dir) {
  const { ev, md, you } = load(dir); const rep = parseReport(md); const ho = findSection(rep.sections, "Hand-offs to your agents"); if (!ho) throw new Error("No hand-offs section.");
  const outDir = path.join(dir, "handoffs"); fs.mkdirSync(outDir, { recursive: true }); const written = [];
  const index = new Map([...ev.evidence, ...(you?.evidence || [])].map((e) => [e.id, e]));
  const personal = rep.mode.kind === "personalized";
  for (const h of parseHandoffs(ho.body)) {
    if (!h.id) continue;
    const cites = uniq([...(h.raw.matchAll(/[EY]\d+/g))].map((m) => m[0])).filter((id) => index.has(id));
    const lines = [`# Brief for ${h.head} (${h.id})`, "", `From the ${ev.brand?.name || ev.target.host} teardown, ${(ev.updated_at || ev.collected_at).slice(0, 10)}. ${personal ? `Personalized for ${rep.mode.owner || "your brand"}: Y# items are your own store.` : "General mode: replace each {placeholder} with your own facts before you start."}`, "",
      h.does && `## What ${ev.brand?.name || "they"} do\n${h.does}`, h.take && `## Take\n${h.take}`, h.beat && `## Beat them\n${h.beat}`, h.brief && `## Your job\n${h.brief}`, "",
      "## Evidence to read", ...cites.map((id) => `- ${id}: ${index.get(id).label}${index.get(id).url ? ` (${index.get(id).url})` : ""}`), "",
      "Use your own org context for voice, look and claims. Copy the strategy, never the competitor's words, images or brand."];
    const f = path.join(outDir, `${h.id}.md`); fs.writeFileSync(f, lines.filter((x) => x !== false && x !== "" && x != null).join("\n") + "\n"); written.push(f);
  }
  console.log(JSON.stringify({ written }));
}

const [cmd, dir] = args;
const direct = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (direct) try {
  if (cmd === "template") console.log(TEMPLATE);
  else if (cmd === "check") { const { ev, md, you, shots } = load(dir); const r = check(ev, md, you, shots); console.log(JSON.stringify(r, null, 1)); process.exit(r.ok ? 0 : 1); }
  else if (cmd === "render") await render(dir);
  else if (cmd === "handoffs") handoffs(dir);
  else console.log("teardown-report.mjs: check <dir> [--you dir] | render <dir> [--you dir] [--embed] [--out file] [--brand file] | handoffs <dir> | template");
} catch (e) { console.error(e.stack || e.message); process.exit(1); }
