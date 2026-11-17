// Illustrative software fixtures, not merchant claims or performance data.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
const load = (rel: string): Promise<any> => import(rel);
const org = "../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs";
const creative = "../../catalogue-items/general/brand-dna-capture/scripts/check-creative-set.mjs";
const now = new Date("2026-11-17T12:00:00Z");
function fixture() {
  const root = fs.mkdtempSync(path.join(tmpdir(), "brand-integrity-"));
  const ctx = path.join(root, "context"), dir = path.join(ctx, "org-context");
  const put = (file: string, text: string) => { const f = path.join(dir, file); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
  put("facts.json", JSON.stringify({ checked_at: "2026-11-17", facts: [] }));
  put("offers.json", JSON.stringify({ checked_at: "2026-11-17", offers: [] }));
  put("look.json", JSON.stringify({ captured_at: "2026-11-17", palette: [] }));
  put("voice.md", '# Voice\n## Brand lines\n- "Everyday things" | headline | fixture | 2026-11-17\n');
  return { root, ctx, dir, put };
}
async function fillFoundation(f: ReturnType<typeof fixture>) {
  const m = await load(org);
  for (const p of m.PARTS.filter((p: any) => p.layer === "foundation" && p.id !== "sources")) {
    const lines = Array.from({ length: p.min }, (_, i) => p.id === "customers" ? `## AVATAR_${i}` : ["voice-bank", "customer-words"].includes(p.id) ? `- "${p.id}_MARKER_${i}" | source fixture` : `- ${p.id}_MARKER_${i} | source fixture`);
    f.put(p.file, `# ${p.id}\nUpdated 2026-11-17\n${lines.join("\n")}\n`);
  }
  return m;
}
test("full slice preserves every v3 foundation and task slices retain restrictions", async () => {
  const f = fixture(), m = await fillFoundation(f);
  f.put("foundation/dos-donts.md", '# Rules\nUpdated 2026-11-17\n- Never "FORBIDDEN_PHRASE"\n- rule 2\n- rule 3\n- rule 4\n- rule 5\n');
  const full = m.sliceText(f.ctx, "full", { now, kind: "ad_creative" });
  for (const marker of ["voice-bank_MARKER", "customer-words_MARKER", "claims_MARKER", "AVATAR_", "design_MARKER", "FORBIDDEN_PHRASE", "markets_MARKER", "customer-talk_MARKER"]) assert.ok(full.text.includes(marker), marker);
  for (const level of ["facts", "voice", "look", "full"]) {
    const r = m.sliceText(f.ctx, level, { now, kind: "email" });
    assert.match(r.text, /FORBIDDEN_PHRASE/); assert.match(r.text, /claims_MARKER/);
    assert.ok(r.coverage.included.includes("foundation/dos-donts.md"));
  }
  assert.equal(m.gateBrain(f.ctx, { now, kind: "ads" }).ok, true);
});
test("stale, undated, future-dated and thin foundation never clears readiness", async () => {
  for (const stamp of ["Updated 2025-01-01", "", "Updated 2030-01-01", "Updated 2026-11-17"]) {
    const f = fixture(), m = await fillFoundation(f);
    f.put("foundation/claims.md", `# Claims\n${stamp}\n- one insufficient rule\n`);
    const gate = m.gateBrain(f.ctx, { now, kind: "copy" });
    assert.equal(gate.ok, false, stamp); assert.ok(gate.blocking.some((p: any) => p.id === "claims"));
    assert.equal(m.sliceText(f.ctx, "voice", { now, kind: "copy" }).ok, false);
  }
});
test("large restriction packets fail visibly and retain the last rule", async () => {
  const f = fixture(), m = await fillFoundation(f);
  f.put("foundation/dos-donts.md", `# Rules\nUpdated 2026-11-17\n${"- retain every required restriction for this business\n".repeat(300)}- FINAL_REQUIRED_RESTRICTION\n`);
  const r = m.sliceText(f.ctx, "full", { now, kind: "ad_creative" });
  assert.equal(r.ok, false); assert.equal(r.overflow, true);
  assert.match(r.text, /FINAL_REQUIRED_RESTRICTION/); assert.match(r.text, /CONTEXT OVERFLOW/);
});
test("voice checks inspect tables, one-word headlines and zero-copy coverage", async () => {
  const f = fixture(), m = await fillFoundation(f);
  f.put("foundation/dos-donts.md", '- Never "Forbidden"\n- Never say "FORBIDDEN_PHRASE"\n');
  for (const draft of ["Forbidden", "# Forbidden", "| Headline | Copy |\n| --- | --- |\n| H1 | Forbidden |", "**Forbidden**", "| Headline | FORBIDDEN_PHRASE |"]) {
    const r = m.voiceCheck(f.ctx, draft, { ads: true }); assert.equal(r.ok, false, draft); assert.ok(r.results.length);
  }
  const empty = m.voiceCheck(f.ctx, "\n| --- | --- |\n"); assert.equal(empty.ok, false); assert.equal(empty.status, "NOT_RUN");
});
test("a duration-only ad observation cannot become a performance result", async () => {
  const f = fixture(), m = await load(org);
  const r = m.ingestAds(f.ctx, [{ id: "fixture", body: "Plain fixture copy", start_date: "2026-01-01" }], { now });
  assert.equal(r.patterns.proven, 0); assert.equal(r.patterns.long_running, 1); assert.equal(r.patterns.performance_status, "unknown");
  const text = fs.readFileSync(path.join(f.dir, "foundation/voice-bank.md"), "utf8");
  assert.doesNotMatch(text, /PROVEN|likely winners/); assert.match(text, /performance unknown/);
});
test("absolute claims resolve reviewed copy and scope against exact source bytes", async () => {
  const f = fixture(), m = await load(creative);
  const source = "Fixture evidence: all fixture products are waterproof in the approved test conditions.";
  fs.writeFileSync(path.join(f.root, "source.txt"), source);
  const headline = "All products are waterproof in the approved test conditions.";
  const record = { id: "waterproof", status: "approved", approved_by: "fixture reviewer", approved_text: [headline], products: ["fixture SKU"], market: "fixture market", checked_at: "2026-11-17", source_file: "source.txt", source_sha256: createHash("sha256").update(source).digest("hex"), source_quote: source };
  const ledger = path.join(f.root, "claims.json"); fs.writeFileSync(ledger, JSON.stringify({ claims: [record] }));
  const evidence = m.loadClaimEvidence(ledger, { today: now }); assert.deepEqual(evidence.errors, []);
  const entry = { headline, claim_id: "waterproof", product: "fixture SKU", market: "fixture market" };
  assert.deepEqual(m.claimIssues(entry, evidence).fails, []);
  for (const change of [{ market: "different" }, { product: "other SKU" }, { headline: "All products are guaranteed waterproof." }, { claim_id: "missing" }]) assert.ok(m.claimIssues({ ...entry, ...change }, evidence).fails.length);
  assert.ok(m.claimIssues({ headline, claim_source: "arbitrary words" }).fails.length);
  assert.ok(m.claimIssues(entry, { claims: [record] }).fails.length, "unloaded manifest records cannot impersonate verified source linkage");
  fs.appendFileSync(path.join(f.root, "source.txt"), " changed");
  assert.match(m.loadClaimEvidence(ledger, { today: now }).errors[0], /SHA-256/);
});
test("claim evidence rejects stale review and source traversal", async () => {
  const f = fixture(), m = await load(creative), ledger = path.join(f.root, "claims.json");
  const base = { id: "x", status: "approved", approved_by: "fixture reviewer", approved_text: ["All products work."], products: ["*"], checked_at: "2026-11-17", source_file: "../outside.txt" };
  fs.writeFileSync(ledger, JSON.stringify({ claims: [base] })); assert.match(m.loadClaimEvidence(ledger, { today: now }).errors[0], /inside/);
  fs.writeFileSync(ledger, JSON.stringify({ claims: [{ ...base, checked_at: "2025-01-01" }] })); assert.match(m.loadClaimEvidence(ledger, { today: now }).errors[0], /stale/);
});
