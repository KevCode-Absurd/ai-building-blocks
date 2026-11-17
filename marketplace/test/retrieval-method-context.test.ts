import test from "node:test";
import assert from "node:assert/strict";
import { KnowledgeIndex, questionFacets, answerText, MAX_CONTEXT_CHARS, MAX_METHOD_CHARS } from "../src/modules/packs/retrieve.ts";

test("explicit needs retain contrast and negation; short noun pairs and URL parameters stay whole", () => {
  assert.deepEqual(questionFacets("Compare price and availability"), []);
  assert.deepEqual(questionFacets("Opens rise but clicks stay flat; check sender authentication alignment"), ["Opens rise but clicks stay flat", "check sender authentication alignment"]);
  assert.deepEqual(questionFacets("Do not retry invalid payments. Reconcile warehouse stock reservations"), ["Do not retry invalid payments", "Reconcile warehouse stock reservations"]);
  assert.deepEqual(questionFacets("Inspect https://example.test/path?q=Checkout&lang=en"), []);
  assert.equal(questionFacets(Array.from({ length: 20 }, (_, i) => `inspect separate operational topic${i}`).join("; ")).length, 8);
});

test("retrieving a bounded method retains prerequisites, distant exceptions, table units and exact source span", () => {
  const method = "---\ndescription: Refund review\n---\n# Refund handling\n\n## Start\nInspect refund eligibility and return status.\n\n## Procedure\n" + "Reconcile customer order identifiers before taking action. ".repeat(45) + "\n\n## Exceptions\nDo not refund engraved products without an approved exception.\n\n| Market | Window |\n|---|---|\n| Domestic | 7 days |\n";
  const index = new KnowledgeIndex([{ path: "skills/refund/SKILL.md", text: method }]);
  const a = index.ask("refund eligibility", { k: 5 });
  assert.equal(a.passages.length, 1, "one complete method replaces its repeated excerpts");
  assert.equal(a.passages[0].text, method);
  assert.deepEqual(a.passages[0].lines, [1, method.split("\n").length]);
  assert.equal(a.passages[0].context_expansion?.mode, "full_method");
  assert.match(answerText(a, "Helper"), /Complete bounded method/);
});

test("parent expansion cannot crowd out the other selected evidence at a tight budget", () => {
  const method = "# Refund eligibility\n\nRefund eligibility includes order review.\n\n## Long method\n" + "Record the supplied order reference carefully. ".repeat(100);
  const stock = "# Stock reservations\n\nWarehouse stock reservations must subtract committed inventory before promising delivery.";
  const index = new KnowledgeIndex([{ path: "skills/refund/SKILL.md", text: method }, { path: "stock.md", text: stock }]);
  const a = index.ask("Inspect refund eligibility; reconcile warehouse stock reservations", { k: 2, contextChars: 1000 });
  assert.deepEqual(new Set(a.passages.map(p => p.path)), new Set(["skills/refund/SKILL.md", "stock.md"]));
  assert.equal(a.passages.find(p => p.path.includes("refund"))!.context_expansion?.mode, "excerpt");
  assert.ok(a.context_budget!.used <= 1000);
  assert.equal(a.context_budget!.used, a.passages.reduce((sum, p) => sum + p.text.length, 0));
});

test("large methods remain explicit excerpts and no returned source text exceeds its context budget", () => {
  const large = "# Shipment delay\n\nShipment delay requires checking warehouse status.\n\n## Background\n" + "Background logistics explanation with many unneeded details. ".repeat(500);
  assert.ok(large.length > MAX_METHOD_CHARS);
  const index = new KnowledgeIndex([{ path: "workflows/late-shipment.md", text: large }]);
  const a = index.ask("shipment delay", { k: 10 });
  assert.equal(a.passages[0].context_expansion?.reason, "method_exceeds_source_budget");
  assert.match(answerText(a, "Helper"), /Excerpt only/);
  assert.ok(a.passages.reduce((sum, p) => sum + p.text.length, 0) <= MAX_CONTEXT_CHARS);
  for (const contextChars of [0, -1, 1.5, Infinity, MAX_CONTEXT_CHARS + 1]) assert.throws(() => index.ask("shipment", { contextChars }), /contextChars/);
  const tiny = index.ask("shipment", { contextChars: 1 });
  assert.equal(tiny.passages.length, 0);
  assert.equal(tiny.context_budget?.exhausted, true);
});

test("missing explicit needs cannot be hidden by a strong match to another clause", () => {
  const index = new KnowledgeIndex([{ path: "knowledge.md", text: "# Inventory\n\nReconcile warehouse stock reservations before allocating committed inventory." }]);
  const a = index.ask("Reconcile warehouse stock reservations; explain quantum telescope oscillations");
  assert.ok(a.passages.length);
  assert.equal(a.facets?.length, 2);
  assert.equal(a.facets![1].matched_passages.length, 0);
  assert.equal(a.enough, false);
  assert.match(answerText(a, "Helper"), /Lexical coverage is not proof/);
});

test("facet search and parent expansion respect explicit source scope and metadata exclusions", () => {
  const files = [
    { path: "skills/public/SKILL.md", text: "# Stock policy\n\nReconcile warehouse stock reservations.\n\n## Exceptions\nDo not count committed stock as available." },
    { path: "skills/private/SKILL.md", text: "# Refund policy\n\nRefund eligibility requires confidential account approval." },
  ];
  const index = new KnowledgeIndex(files);
  for (const opts of [{ paths: [files[0].path] }, { adjust: (c: { path: string }, score: number) => c.path === files[1].path ? null : score }]) {
    const a = index.ask("Reconcile warehouse stock reservations; verify refund eligibility approval", opts);
    assert.ok(a.passages.every(p => p.path === files[0].path));
    assert.ok(a.passages.every(p => !p.text.includes("confidential")));
  }
});

test("deeper candidate pools keep their excerpts and leave final budgeting to their caller", () => {
  const files = Array.from({ length: 40 }, (_, i) => ({ path: `skills/item-${i}/SKILL.md`, text: `# Inventory ${i}\n\n${"Inventory reservation fulfillment evidence. ".repeat(30)}` }));
  const a = new KnowledgeIndex(files).ask("inventory reservation", { k: 30, max: 30, uniquePath: true });
  assert.equal(a.passages.length, 30);
  assert.ok(a.passages.every(p => p.context_expansion === undefined));
  assert.equal(a.context_budget, undefined);
});

test("expanded methods resolve citations from the entire returned parent, not just the ranked child", () => {
  const text = "# Warranty\n\nInspect warranty eligibility. [1]\n\n## Exception\nNever infer international coverage from a domestic warranty. [2]";
  const index = new KnowledgeIndex([{ path: "skills/warranty/SKILL.md", text }], { citeFiles: ["skills/warranty/SKILL.md"], sources: [
    { n: 1, title: "Warranty", url: "https://example.test/warranty", checked: "2026-11-17" },
    { n: 2, title: "Markets", url: "https://example.test/markets", checked: "2026-11-17" },
  ] });
  assert.deepEqual(index.ask("warranty eligibility", { k: 1 }).passages[0].cites.map(c => c.n), [1, 2]);
});

test("parent expansion never reinserts a metadata-excluded section of the same source file", () => {
  const text = "# Returns\n\n## Public policy\nReturn eligibility requires the customer's order reference.\n\n## Restricted pilot\nThe unpublished pilot policy permits unusual refunds. This section is restricted.";
  const index = new KnowledgeIndex([{ path: "skills/returns/SKILL.md", text }]);
  const a = index.ask("return eligibility order reference", { k: 3, adjust: (chunk, score) => chunk.heading === "Restricted pilot" ? null : score });
  assert.ok(a.passages.length);
  assert.ok(a.passages.every(p => !p.text.includes("unpublished pilot")));
  assert.equal(a.passages[0].context_expansion?.reason, "method_contains_excluded_evidence");
  assert.match(answerText(a, "Helper"), /excluded source sections remain unavailable/);
  assert.doesNotMatch(answerText(a, "Helper"), /read the full method/);
});
