// E-commerce knowledge reach (round 2, E3): every e-commerce agent carries the whole public card library to search
// offline, with a short library map; role agents outside the vertical whose role an e-commerce agent shares carry the
// store kit (house rules and the compact card index); every other pack gets one AGENTS.md line. Also the retrieval
// upgrades for a library this size: module routing and short-form aliases, measured on a labelled recall set.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { personaVerticalFiles, verticalBundle, type VerticalBundle } from "../src/modules/knowledge/bundle.ts";
import type { Card, Source, Vertical } from "../src/modules/knowledge/cards.ts";
import { KnowledgeIndex, TUNING, aliasesOf, modulePaths, tokens } from "../src/modules/packs/retrieve.ts";
import { buildPack, oneFileText } from "../src/modules/packs/build.ts";
import { housePersonas } from "../src/modules/directory/index.ts";
import type { Persona } from "../src/core/types.ts";
import { FIXTURE_JOB_TYPES, NOVA } from "./fixtures.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "knowledge", "ecommerce");
const VERTICAL = JSON.parse(readFileSync(path.join(DIR, "vertical.json"), "utf8")) as Vertical;
const SOURCES = JSON.parse(readFileSync(path.join(DIR, "sources.json"), "utf8")) as Source[];
const CARDS = readdirSync(path.join(DIR, "cards")).filter(f => f.endsWith(".json")).sort().flatMap(f => JSON.parse(readFileSync(path.join(DIR, "cards", f), "utf8")) as Card[]);
const BUNDLE: VerticalBundle = verticalBundle(VERTICAL, CARDS, SOURCES);
const ECOM = JSON.parse(readFileSync(path.join(ROOT, "src", "modules", "directory", "data", "personas-ecommerce.json"), "utf8")) as Persona[];
const persona = (id: string) => ECOM.find(p => p.id === id)!;
const OPTIONS = { version: "2026.11.13", updated: "2026-11-13" };
const MCP = "https://agents.useaiblocks.com/mcp";
const cardIds = (text: string) => [...text.matchAll(/^Card ([A-Z]{3}-\d{4})\./gm)].map(m => m[1]);

test("an e-commerce agent carries every module of public cards, each card once, and no card from a private source", () => {
  const zara = persona("zara-tiktok-ads");
  const files = personaVerticalFiles(zara, BUNDLE);
  const modules = VERTICAL.modules.map(m => m.code).filter(c => BUNDLE.files[`knowledge/ecommerce/${c}.md`]);
  assert.equal(modules.length, 23);
  for (const c of modules) assert.ok(files.some(f => f.path === `knowledge/ecommerce/${c}.md`), `carries ${c}`);
  assert.ok(!files.some(f => f.path.endsWith("/baseline.md")), "every baseline card is already in a module file");
  const ids = files.flatMap(f => cardIds(f.content));
  assert.equal(ids.length, new Set(ids).size, "no card appears twice in one pack");
  assert.equal(new Set(ids).size, BUNDLE.cards.length, "every public card is in reach");
  const open = new Set(SOURCES.filter(s => s.public).map(s => s.id));
  const hidden = CARDS.filter(c => !c.public || !open.has(c.source)).map(c => c.id);
  assert.ok(hidden.length > 0, "the library has logic-only cards from paid or study-only sources");
  for (const p of ECOM) for (const f of personaVerticalFiles(p, BUNDLE)) for (const id of hidden) assert.ok(!new RegExp(`\\b${id}\\b`).test(f.content), `${p.id} ${f.path} holds non-public ${id}`);
  for (const [p, f] of Object.entries(BUNDLE.files)) for (const id of hidden) assert.ok(!new RegExp(`\\b${id}\\b`).test(f.content), `${p} holds non-public ${id}`);
});

test("a rebuilt zara-tiktok-ads pack finds offer cards, a module it did not carry before", () => {
  const zara = persona("zara-tiktok-ads");
  assert.ok(!(zara.modules ?? []).includes("OFF"));
  const index = new KnowledgeIndex(personaVerticalFiles(zara, BUNDLE).map(f => ({ path: f.path, text: f.content })));
  const a = index.ask("free shipping threshold for bundles", { k: 5 });
  assert.ok(a.enough);
  assert.equal(a.passages[0].path, "knowledge/ecommerce/OFF.md");
  const routed = index.ask("free shipping threshold for bundles", { k: 5, modules: ["MCR"] });
  assert.ok(routed.passages.every(p => p.path.endsWith("/MCR.md")), "a module filter searches only that module");
});

test("the library map is short, lists every module with its scope and count, and marks the agent's own", () => {
  for (const p of ECOM) {
    const map = personaVerticalFiles(p, BUNDLE).find(f => f.path.endsWith("/library-map.md"))!;
    const words = (map.content.match(/\S+/g) ?? []).length;
    assert.ok(words < 4000, `${p.id} library map is ${words} words`);
    assert.equal((map.content.match(/^\| [A-Z]{3}( \(mine\))? \|/gm) ?? []).length, 23, p.id);
    assert.match(map.content, /--module/);
    assert.doesNotMatch(map.content, new RegExp("[\\u2013\\u2014]"), "no en or em dashes");
  }
  const zara = personaVerticalFiles(persona("zara-tiktok-ads"), BUNDLE).find(f => f.path.endsWith("/library-map.md"))!.content;
  assert.match(zara, /\| ADC \(mine\) \|/);
  assert.match(zara, /\| OFF \| Offers \| \d+ \|/);
});

test("any store job gets the store kit: a role an e-commerce agent shares carries it, others get one AGENTS.md line", async () => {
  const roles = new Set(ECOM.map(p => p.role));
  const all = housePersonas();
  const candice = all.find(p => p.id === "candice-email-marketing")!;
  const ankit = all.find(p => p.id === "ankit-help-docs")!;
  assert.ok(!candice.vertical && roles.has(candice.role), "candice's role is shared with an e-commerce agent");
  assert.ok(!ankit.vertical && !roles.has(ankit.role), "ankit's is not");

  const kitPack = await buildPack({ persona: NOVA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, storeKit: BUNDLE, verticals: [BUNDLE], options: { ...OPTIONS, kind: "agent" } });
  const file = (p: string) => kitPack.files.find(f => f.path === p);
  assert.ok(file("knowledge/ecommerce/store-kit.md"));
  assert.ok(file("knowledge/ecommerce/card-index.md"));
  assert.ok(!kitPack.files.some(f => /^knowledge\/ecommerce\/[A-Z]{3}\.md$/.test(f.path)), "the kit is the index, not the full library");
  assert.match(file("knowledge/ecommerce/store-kit.md")!.content, /sells physical goods online/);
  assert.match(file("knowledge/ecommerce/store-kit.md")!.content, /## Rules for every deliverable/);
  assert.equal((file("knowledge/ecommerce/card-index.md")!.content.match(/^- \*\*[A-Z]{3}-\d{4}\*\*/gm) ?? []).length, BUNDLE.cards.length);
  assert.match(file("knowledge.md")!.content, /## E-commerce kit[\s\S]*context\/trace\.md/);
  assert.doesNotMatch(file("AGENTS.md")!.content, /E-commerce briefs/, "a pack with the kit needs no pointer line");

  const plain = await buildPack({ persona: NOVA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, verticals: [BUNDLE], options: { ...OPTIONS, kind: "agent" } });
  assert.ok(!plain.files.some(f => f.path.startsWith("knowledge/")));
  const agents = plain.files.find(f => f.path === "AGENTS.md")!.content;
  assert.equal((agents.match(/\*\*E-commerce briefs\.\*\*/g) ?? []).length, 1);
  assert.match(agents, /ask_vertical_knowledge[^\n]*vertical `ecommerce`/);
  assert.ok(agents.indexOf("E-commerce briefs") < agents.indexOf("## How you work"), "the line sits before the working rules");

  const ecom = await buildPack({ persona: persona("zara-tiktok-ads"), role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, vertical: BUNDLE, verticals: [BUNDLE], options: { ...OPTIONS, kind: "agent" } });
  assert.doesNotMatch(ecom.files.find(f => f.path === "AGENTS.md")!.content, /E-commerce briefs/);
  // The one-file version carries a digest of the agent's own cards; every whole module is named by its path or address.
  const one = oneFileText(ecom, "https://agents.test");
  assert.doesNotMatch(one, /===== FILE: knowledge\/ecommerce\/(MCR|OFF)\.md =====/);
  assert.match(one, /^===== CARD DIGEST/m);
  assert.match(one, /https:\/\/agents\.test\/packs\/knowledge\/ecommerce\/MCR\.md/);
  assert.match(one, /===== FILE: knowledge\/ecommerce\/library-map\.md =====/);
});

test("aliases bridge short forms and their names, and routing keeps to the named modules", () => {
  assert.deepEqual(aliasesOf(tokens("ROAS")), [tokens("return on ad spend").join(" ")]);
  assert.ok(aliasesOf(tokens("cash on delivery")).includes("cod"));
  const files = [
    { path: "knowledge/ecommerce/ADC.md", text: "# Ads\n\n## Judge return on ad spend on store numbers\n\nCard ADC-0001. Read return on ad spend from the store, not the platform.\n" },
    { path: "knowledge/ecommerce/OFF.md", text: "# Offers\n\n## Bundles lift basket size\n\nCard OFF-0001. A two-item bundle lifts average order value.\n" },
  ];
  const index = new KnowledgeIndex(files);
  const roas = index.ask("ROAS on store numbers");
  assert.equal(roas.passages[0].path, "knowledge/ecommerce/ADC.md");
  assert.ok(roas.enough, "ROAS is known through its alias, so the pack does know");
  assert.equal(index.ask("raise AOV").passages[0].path, "knowledge/ecommerce/OFF.md");
  assert.deepEqual(modulePaths(files.map(f => f.path), ["off"]), ["knowledge/ecommerce/OFF.md"]);
});

test("recall on the labelled e-commerce set, with and without aliases and module routing", () => {
  const set = JSON.parse(readFileSync(path.join(ROOT, "test", "fixtures", "ecom-recall.json"), "utf8")) as { pairs: { q: string; card: string }[] };
  assert.ok(set.pairs.length >= 30 && set.pairs.length <= 50);
  const files = Object.entries(BUNDLE.files).filter(([p]) => /^knowledge\/ecommerce\/[A-Z]{3}\.md$/.test(p)).map(([p, f]) => ({ path: p, text: f.content }));
  const index = new KnowledgeIndex(files);
  for (const { card } of set.pairs) assert.ok(BUNDLE.cards.some(c => c.id === card), `${card} is a public card`);
  const run = (aliases: boolean, routed: boolean) => {
    const was = TUNING.aliases;
    TUNING.aliases = aliases;
    try {
      const ranks = set.pairs.map(({ q, card }) => {
        const a = index.ask(q, { k: 10, ...(routed ? { modules: [card.slice(0, 3)] } : {}) });
        // A long card is cut into passages; each carries the card claim as its heading, so any of them counts.
        const claim = BUNDLE.cards.find(c => c.id === card)!.claim.replace(/[*_`]/g, "").trim();
        return a.passages.findIndex(p => p.text.includes(`Card ${card}.`) || p.heading.trim() === claim) + 1;
      });
      return { recall5: ranks.filter(r => r > 0 && r <= 5).length / ranks.length, mrr: ranks.reduce((s, r) => s + (r ? 1 / r : 0), 0) / ranks.length };
    } finally { TUNING.aliases = was; }
  };
  const plain = run(false, false), alias = run(true, false), routed = run(false, true), both = run(true, true);
  const f = (x: { recall5: number; mrr: number }) => `Recall@5 ${x.recall5.toFixed(2)} MRR ${x.mrr.toFixed(2)}`;
  console.log(`ecom recall (${set.pairs.length} pairs): plain ${f(plain)} | aliases ${f(alias)} | routing ${f(routed)} | both ${f(both)}`);
  assert.ok(alias.recall5 >= plain.recall5 && alias.mrr >= plain.mrr - 0.01, "aliases do not hurt");
  assert.ok(both.recall5 >= alias.recall5, "routing to the right module does not hurt");
  assert.ok(alias.recall5 >= 0.85 && alias.mrr >= 0.75, `whole-library Recall@5 ${alias.recall5}, MRR ${alias.mrr}`);
});
