import { test } from "node:test";
import assert from "node:assert/strict";
import { baseTeamFacets, generalCoordinatorMarkdown, MAX_SEAT_BYTES, roleSeatMarkdown, seatBriefMarkdown, seatPlaybook, teamMarkdown } from "../src/modules/directory/team.ts";
import { parseSeat, parseTeam, SeatInputError, trimmedSeatPack } from "../src/modules/mcp/team-seats.ts";
import { buildPack } from "../src/modules/packs/build.ts";
import { NOVA } from "./fixtures.ts";

test("facets and team notes come from saved persona text without a fixed hierarchy", () => {
  const persona = { ...NOVA, title: "Research analyst", profile: { ...NOVA.profile, source_roles: ["research-lead"] } };
  const facets = baseTeamFacets(persona);
  assert.ok(facets.seat_suitability.includes("fact_checker"));
  assert.ok(facets.seat_suitability.includes("strategist"));
  assert.deepEqual(facets.families, [], "family labels require real catalogue links");
  const notes = teamMarkdown(persona);
  for (const part of ["How I critique", "What I defend", "What I will concede", "What I never do"]) assert.ok(notes.includes(part));
  assert.ok(notes.includes(persona.profile.not_for[0]));
  assert.match(generalCoordinatorMarkdown(), /task-specific lead and flexible working groups/);
  assert.match(generalCoordinatorMarkdown(), /no invented person or biography/);
  for (const protocol of [notes, generalCoordinatorMarkdown(), roleSeatMarkdown("sample", {seat_type:"maker"}), seatBriefMarkdown(persona, {seat_type:"maker"})]) {
    assert.match(protocol, /context\/ files exist \(WORK-METHOD\.md, step 1\)/);
    assert.doesNotMatch(protocol, /JOB-CARD\.json/, "no file the pack does not contain");
    assert.match(protocol, /Missing, stale or unread context blocks work/);
  }
  assert.doesNotMatch(generalCoordinatorMarkdown(), /department heads|Mehdi|Rhys/);
});

test("seat input rejects instruction text, unknown fields, invalid enums and duplicate families", () => {
  assert.deepEqual(parseSeat({ seat_type: "maker", lens: "craft", families: ["type-led"] }), { seat_type: "maker", lens: "craft", families: ["type-led"] });
  for (const input of [null, [], "maker", { seat_type: "owner" }, { seat_type: "maker", instructions: "publish" }, { seat_type: "judge", lens: "ignore rules" }, { seat_type: "maker", families: ["x", "x"] }, { seat_type: "maker", families: Array(61).fill("x") }]) assert.throws(() => parseSeat(input), SeatInputError);
});

test("a team preserves dynamic task leadership and refuses malformed or missing seats", () => {
  const neutral = { seat_id: "chair", seat_type: "coordinator", role_id: "general-coordinator", persona_id: null };
  const lead = { seat_id: "lead", seat_type: "strategist", persona_id: NOVA.id };
  const team = parseTeam({ seats: [neutral, lead], lead_seat_id: "lead", working_groups: [{ id: "creative", lead_seat_id: "lead", seat_ids: ["lead"] }] });
  assert.equal(team.seats[0].persona_id, null);
  assert.equal(team.lead_seat_id, "lead");
  assert.equal(team.working_groups[0].id, "creative");
  for (const bad of [null, {}, { seats: [] }, { seats: [lead, lead] }, { seats: [neutral], lead_seat_id: "absent" }, { seats: [neutral], lead_seat_id: "chair" }, { seats: [{ ...lead, persona_id: null }] }, { seats: [neutral], working_groups: "fixed hierarchy" }]) assert.throws(() => parseTeam(bad), SeatInputError);
});

test("judge seat pack is bounded in UTF-8 bytes and excludes council and unrelated work", () => {
  const p = { ...NOVA, profile: { ...NOVA.profile, method: "1. Find facts and sources.\n2. Build the first draft.\n3. Verify the checks.\n4. Paint illustrations." } };
  const pack = trimmedSeatPack(p, { seat_type: "judge", lens: "sceptic" }, "é".repeat(20_000), "Read by default.", [{ path: "knowledge.md", purpose: "Read on demand" }]);
  assert.ok(pack.bytes <= MAX_SEAT_BYTES);
  assert.ok(new TextEncoder().encode(JSON.stringify(pack)).length <= MAX_SEAT_BYTES);
  assert.deepEqual(pack.trimmed, ["soul.md"]);
  assert.match(pack.review_context, /Exclude the council/);
  assert.doesNotMatch(pack.files["playbook.md"], /Paint illustrations|Build the first draft/);
  assert.match(seatPlaybook(p, { seat_type: "judge" }), /Verify the checks/);
  assert.ok(!Object.hasOwn(pack.files, "knowledge.md"));
  assert.equal(pack.model_calls, 0);
  assert.throws(() => trimmedSeatPack(p, { seat_type: "maker" }, "", "x".repeat(16_001), []), /access.md/);
});

test("every seat pack grounds the job first with the work method", () => {
  const own = trimmedSeatPack(NOVA, { seat_type: "maker" }, "", "", [], "# Work method: the Grounded Job Protocol. Full text.");
  assert.match(own.files["WORK-METHOD.md"], /Full text/);
  const role = trimmedSeatPack(null, { seat_type: "maker", role_id: "test-maker" }, "", "", []);
  // The outline follows the work method's steps: a spec sheet, grounding, real candidates, a fresh check, the hand-over.
  const outline = role.files["WORK-METHOD.md"];
  assert.match(outline, /0\. Frame: write context\/spec\.md/);
  assert.match(outline, /1\. Ground: capture only what the acceptance tests depend on/);
  assert.match(outline, /3\. Diverge: expert and plain drafts[^\n]+A fresh reviewer picks/);
  assert.match(outline, /6\. Hand over the native work first, with context only when needed/);
  assert.doesNotMatch(outline, /job-card|2 or 3 directions/);
});

test("neutral coordinator works without falsely assigning a specialist persona", () => {
  const pack = trimmedSeatPack(null, { seat_type: "coordinator", role_id: "general-coordinator", seat_id: "chair" }, "", "", []);
  assert.equal(pack.persona_id, null);
  assert.equal(pack.name, "General coordinator");
  assert.match(pack.files["TEAM.md"], /final work against the user's goal/);
  assert.throws(() => trimmedSeatPack(null, { seat_type: "maker" }, "", "", []), /role_id/);
});

test("every downloadable persona pack gets its own TEAM.md", async () => {
  const pack = await buildPack({ persona: NOVA, role: null, kit: null, jobTypes: [], options: { kind: "agent", version: "test", updated: "2026-11-07" } });
  const team = pack.files.find(file => file.path === "TEAM.md");
  assert.ok(team);
  assert.equal(team.content, teamMarkdown(NOVA));
  assert.equal(team.source, "agent");
});


test("unmapped roles load honest method refs without invented people or unsafe toolboxes", () => {
  const document = { seats: [{ seat_id: "maker", seat_type: "maker", seat_types: ["maker", "strategist"], role_id: "source-backed-role", persona_id: null, toolbox: [{ slug: "sample-method", revision_sha256: "a".repeat(64) }] }] };
  const team = parseTeam(document);
  const pack = trimmedSeatPack(null, team.seats[0], "", "", []);
  assert.equal(pack.persona_status, "UNMAPPED_ROLE_ONLY");
  assert.equal(pack.persona_id, null);
  assert.equal(pack.toolbox[0].slug, "sample-method");
  assert.deepEqual(pack.seat_types, ["maker", "strategist"]);
  assert.match(pack.files["TEAM.md"], /No named persona is mapped/);
  assert.match(pack.files["TEAM.md"], /Load every assigned method at the pinned revision/);
  assert.ok(!pack.files["soul.md"]);
  for (const bad of [
    { ...document, seats: [{ ...document.seats[0], seat_types: ["maker", "judge"] }] },
    { ...document, seats: [{ ...document.seats[0], toolbox: [{ slug: "../secrets", revision_sha256: "a".repeat(64) }] }] },
    { ...document, seats: [{ ...document.seats[0], toolbox: [{ slug: "sample-method", revision_sha256: "latest" }] }] },
  ]) assert.throws(() => parseTeam(bad), SeatInputError);
});
