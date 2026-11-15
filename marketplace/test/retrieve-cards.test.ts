// One card, one passage (src/modules/packs/retrieve.ts): a library card comes back whole with its id, tier and source
// line, while its small parts still do the ranking; near-duplicates are skipped when asked; the text answer gives
// every passage an id to note.
import { test } from "node:test";
import assert from "node:assert/strict";
import { KnowledgeIndex, answerText, chunkMarkdown, CARD_MAX_WORDS } from "../src/modules/packs/retrieve.ts";

const filler = (n: number, w: string) => Array.from({ length: n }, (_, i) => `${w}${i % 11}`).join(" ");
const cardMd = (id: string, claim: string, body: string, asks: string) => `## ${claim}\n\nCard ${id}. Tier 3, growth, meta.\n\n${body}\n\n**Holds when:** Meta accounts at $10,000 a month and up.\n\n**Fails when:** Very small accounts.\n\n**Numbers:** 1 new ad per $1,000 a month\n\n**Asked as:** ${asks}\n\n**Source:** A creative strategy talk, An Agency, 2026-10-04 (https://example.com/talk).\n`;
const MODULE = `# E-commerce knowledge: Paid social creative (MCR)\n\nIntro line about the module.\n\n${cardMd("MCR-0001", "Launch about one new ad per $1,000 of monthly Meta spend.", `${filler(150, "volume")} creative volume rule.`, "How many new ads should I make each month? | How many creatives at my spend?")}\n${cardMd("MCR-0002", "Open video ads with the buyer's problem in the first two seconds.", `${filler(150, "hook")} hooks matter.`, "What should the first seconds of my ad say?")}`;

test("a library card is one passage with its id, tier and source line, however long its body", () => {
  const chunks = chunkMarkdown("knowledge/ecommerce/MCR.md", MODULE).filter(c => c.card);
  assert.equal(chunks.length, 2);
  for (const c of chunks) {
    assert.match(c.text, /^Card MCR-000\d\. Tier 3/);
    assert.match(c.text, /\*\*Source:\*\* A creative strategy talk/);
    assert.match(c.text, /\*\*Holds when:\*\*[\s\S]*\*\*Fails when:\*\*/);
  }
  assert.deepEqual(chunks.map(c => c.card), [{ id: "MCR-0001", tier: 3 }, { id: "MCR-0002", tier: 3 }]);
  // The cut the rankers use still splits a long card into its usual units.
  const units = chunkMarkdown("knowledge/ecommerce/MCR.md", MODULE, { wholeCards: false }).filter(c => c.heading.startsWith("Launch"));
  assert.ok(units.length >= 2, "a 200-word card is two ranking units");
  assert.ok(CARD_MAX_WORDS >= 500);
});

test("an owner question that matches only the card's Asked as still finds the whole card, once", () => {
  const index = new KnowledgeIndex([{ path: "knowledge/ecommerce/MCR.md", text: MODULE }]);
  const a = index.ask("how many creatives at my spend", { k: 5 });
  assert.equal(a.passages[0].card?.id, "MCR-0001");
  assert.equal(new Set(a.passages.map(p => p.id)).size, a.passages.length, "one place per card");
  assert.match(a.passages[0].text, /\*\*Source:\*\*/);
  const text = answerText(a, "Lindsey");
  assert.match(text, /--- 1\. card MCR-0001, tier 3 \| knowledge\/ecommerce\/MCR\.md:\d+-\d+ \|/);
  assert.doesNotMatch(text, /Asked as/, "the search questions are not shown to the reader");
  assert.match(text, /Source:\*\* A creative strategy talk/);
});

test("non-card passages carry their passage id, and distinct skips a near-duplicate", () => {
  const kb = `# Role knowledge\n\n## 5. Decision rules\n\n- Wait for a core update to finish before you compare pages.\n`;
  const twin = `${MODULE}\n${cardMd("MCR-0003", "Launch about one new ad per $1,000 of monthly Meta spend, as a rule of thumb.", `${filler(150, "volume")} creative volume rule.`, "How many new ads should I make each month?")}`;
  const index = new KnowledgeIndex([{ path: "knowledge.md", text: kb }, { path: "knowledge/ecommerce/MCR.md", text: twin }]);
  assert.match(answerText(index.ask("core update compare pages"), "Nova"), /--- 1\. id knowledge\.md#5-decision-rules \|/);
  const both = index.ask("how many new ads each month", { k: 5 }).passages.map(p => p.card?.id);
  assert.ok(both.includes("MCR-0001") && both.includes("MCR-0003"));
  const one = index.ask("how many new ads each month", { k: 5, distinct: true }).passages.map(p => p.card?.id);
  assert.equal(one.filter(id => id === "MCR-0001" || id === "MCR-0003").length, 1, one.join(","));
});
