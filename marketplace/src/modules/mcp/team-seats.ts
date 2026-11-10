import type { Persona, TeamSeatType } from "../../core/types.ts";
import {qualityMethodMarkdown} from '../directory/execution.ts';
import {outputPolicyMarkdown} from '../runner/output-policy.ts';
import { generalCoordinatorMarkdown, MAX_SEAT_BYTES, personaTeam, roleSeatMarkdown, seatBriefMarkdown, seatPlaybook, TEAM_SEAT_TYPES, teamMarkdown, type SeatRequest } from "../directory/team.ts";

const SLUG = /^[a-z0-9][a-z0-9_-]{0,127}$/;
const plain = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
export class SeatInputError extends Error {}
const fail = (message: string): never => { throw new SeatInputError(message); };
const validId = (value: unknown, path: string): string => typeof value === "string" && SLUG.test(value) ? value : fail(`${path} must be a plain id of up to 128 characters.`);

export function parseSeat(value: unknown, path = "as_seat", extras = false): SeatRequest {
  if (!plain(value)) return fail(`${path} must be an object with seat_type, and optional lens and families.`);
  if (!extras && Object.keys(value).some(key => !["seat_type", "lens", "families"].includes(key))) fail(`${path} has an unknown field. Use seat_type, lens and families.`);
  if (!(TEAM_SEAT_TYPES as readonly unknown[]).includes(value.seat_type)) fail(`${path}.seat_type must be one of: ${TEAM_SEAT_TYPES.join(", ")}.`);
  const lens = value.lens === undefined ? undefined : validId(value.lens, `${path}.lens`);
  let families: string[] | undefined;
  if (value.families !== undefined) {
    if (!Array.isArray(value.families) || value.families.length > 60) fail(`${path}.families must list up to 60 family ids.`);
    families = (value.families as unknown[]).map((id, i) => validId(id, `${path}.families[${i}]`));
    if (new Set(families).size !== families.length) fail(`${path}.families has duplicate ids.`);
  }
  return { seat_type: value.seat_type as TeamSeatType, ...(lens ? { lens } : {}), ...(families ? { families } : {}) };
}

export interface PinnedMethod { slug: string; revision_sha256: string }
export interface SeatAssignment extends SeatRequest { seat_id?: string; role_id?: string; seat_types?: TeamSeatType[]; toolbox?: PinnedMethod[] }
export interface TeamSeat extends SeatAssignment { seat_id: string; persona_id: string | null }
export interface TeamInput { seats: TeamSeat[]; proposal_id?: string; lead_seat_id?: string; working_groups: Record<string, unknown>[] }

/** Only roster fields are used here. The library validates the full plan and phase contracts. */
export function parseTeam(value: unknown): TeamInput {
  if (!plain(value)) fail("document must be a TEAM.json object containing seats.");
  const doc = value as Record<string, unknown>;
  if (new TextEncoder().encode(JSON.stringify(doc)).length > 256 * 1024) fail("document is too large (max 256 KB).");
  if (!Array.isArray(doc.seats) || doc.seats.length < 1 || doc.seats.length > 12) fail("document.seats must list 1 to 12 seats.");
  const seats = (doc.seats as unknown[]).map((value, i): TeamSeat => {
    if (!plain(value)) fail(`document.seats[${i}] must be an object.`);
    const row = value as Record<string, unknown>;
    const seat = parseSeat(row, `document.seats[${i}]`, true);
    const seat_id = validId(row.seat_id, `document.seats[${i}].seat_id`);
    const role_id = row.role_id === undefined ? undefined : validId(row.role_id, `document.seats[${i}].role_id`);
    // A neutral general coordinator is a real protocol, never a renamed specialist persona.
    const neutral = !!role_id && (row.persona_id === undefined || row.persona_id === null);
    const persona_id = neutral ? null : validId(row.persona_id, `document.seats[${i}].persona_id`);
    let seat_types = [seat.seat_type];
    if (row.seat_types !== undefined) {
      if (!Array.isArray(row.seat_types) || !row.seat_types.length || row.seat_types.length > 8 || row.seat_types.some(type => !(TEAM_SEAT_TYPES as readonly unknown[]).includes(type))) fail(`document.seats[${i}].seat_types must list valid seat duties.`);
      seat_types = [...new Set([seat.seat_type, ...(row.seat_types as TeamSeatType[])])];
    }
    if (seat_types.includes("maker") && seat_types.some(type => ["coordinator", "judge", "fact_checker"].includes(type))) fail(`document.seats[${i}] cannot combine maker with coordinator, judge or fact checker.`);
    let toolbox: PinnedMethod[] = [];
    if (row.toolbox !== undefined) {
      if (!Array.isArray(row.toolbox) || row.toolbox.length > 300) fail(`document.seats[${i}].toolbox must list up to 300 pinned method refs.`);
      toolbox = (row.toolbox as unknown[]).map((ref, j) => {
        if (!plain(ref) || typeof ref.slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(ref.slug) || typeof ref.revision_sha256 !== "string" || !/^[a-f0-9]{64}$/.test(ref.revision_sha256)) fail(`document.seats[${i}].toolbox[${j}] needs a safe slug and SHA-256 revision.`);
        return { slug: (ref as Record<string, string>).slug, revision_sha256: (ref as Record<string, string>).revision_sha256 };
      });
      if (new Set(toolbox.map(ref => ref.slug)).size !== toolbox.length) fail(`document.seats[${i}].toolbox has duplicate methods.`);
    }
    return { ...seat, seat_id, persona_id, seat_types, toolbox, ...(role_id ? { role_id } : {}) };
  });
  if (new Set(seats.map(s => s.seat_id)).size !== seats.length) fail("document.seats has duplicate seat ids.");
  const proposal_id = doc.proposal_id === undefined ? undefined : validId(doc.proposal_id, "document.proposal_id");
  const lead_seat_id = doc.lead_seat_id === undefined ? undefined : validId(doc.lead_seat_id, "document.lead_seat_id");
  if (lead_seat_id && !seats.some(s => s.seat_id === lead_seat_id)) fail("document.lead_seat_id must name a seat in this team.");
  if (lead_seat_id && seats.find(s => s.seat_id === lead_seat_id)?.seat_type === "coordinator") fail("The task lead must be separate from the general coordinator.");
  if (doc.working_groups !== undefined && (!Array.isArray(doc.working_groups) || doc.working_groups.length > 12 || doc.working_groups.some(v => !plain(v)))) fail("document.working_groups must be a list of up to 12 group objects.");
  return { seats, ...(proposal_id ? { proposal_id } : {}), ...(lead_seat_id ? { lead_seat_id } : {}), working_groups: (doc.working_groups ?? []) as Record<string, unknown>[] };
}

const encoder = new TextEncoder();
export interface TrimmedSeatPack { seat_id?: string; persona_id: string | null; persona_status: "MAPPED" | "NEUTRAL_COORDINATOR_ROLE" | "UNMAPPED_ROLE_ONLY"; role_id?: string; name: string; title: string; seat_type: TeamSeatType; seat_types: TeamSeatType[]; lens?: string; families?: string[]; toolbox: PinnedMethod[]; files: Record<string, string>; other_files: { path: string; purpose: string }[]; facets?: Persona["team"]; model_calls: 0; bytes: number; trimmed: string[]; review_context: string }

/** Trim at UTF-8 boundaries and report every omission. Access and seat rules are never truncated. */
function clip(value: string, bytes: number): { text: string; cut: boolean } {
  const encoded = encoder.encode(value);
  if (encoded.length <= bytes) return { text: value, cut: false };
  return { text: `${new TextDecoder("utf-8", { fatal: false }).decode(encoded.slice(0, bytes - 100)).replace(/\uFFFD$/, "")}\n[Excerpt cut here. Load the full file with get_agent_file.]`, cut: true };
}

/** Every seat grounds the job first: the outline is used when the pack's own WORK-METHOD.md is not passed. */
export const SEAT_WORK_METHOD = "# Work method\n\n0. Frame: write context/spec.md, one screen: the job (who must do what after seeing this), the deliverables, 5 to 7 acceptance tests, mode (patch whenever something exists) and the brand context the job needs.\n1. Ground: capture only what the acceptance tests depend on into context/, each fact with its source and date. Check the buyer can act today.\n2. Taste and tools: for work a buyer sees, note the brand codes to keep and the defaults to avoid. Pick what fits from toolbox.md.\n3. Diverge: make about 3 real candidates of the part that decides the outcome; a fresh reviewer picks.\n4. Build: new framing of true facts, never new facts. Decide, be specific, finish the format.\n5. Check: a fresh reviewer gets the brief, the deliverable and the facts, and tests each acceptance test and each claim. Gates pass or fail.\n6. Hand over the work first, opened by 3 to 5 lines; nothing internal reaches the client. Keep working notes in DECISIONS.md.\n";

export function trimmedSeatPack(persona: Persona | null, seat: SeatAssignment, soul: string, access: string, other_files: { path: string; purpose: string }[], work_method = ""): TrimmedSeatPack {
  const trimmed: string[] = [];
  const files: Record<string, string> = {'QUALITY-METHOD.md':qualityMethodMarkdown(),'OUTPUT-POLICY.md':outputPolicyMarkdown()};
  { const wm = clip(work_method || SEAT_WORK_METHOD, 8_000); files["WORK-METHOD.md"] = wm.text; if (wm.cut) trimmed.push("WORK-METHOD.md"); }
  const seat_types = seat.seat_types ?? [seat.seat_type];
  const neutralCoordinator = !persona && seat.seat_type === "coordinator" && seat.role_id === "general-coordinator";
  if (!persona) {
    const role_id = seat.role_id ?? fail("An unmapped seat needs a role_id for its role-only pack.");
    files["TEAM.md"] = neutralCoordinator ? generalCoordinatorMarkdown() : roleSeatMarkdown(role_id, seat, seat_types);
  } else {
    files["SEAT.md"] = seatBriefMarkdown(persona, seat);
    if (seat_types.length > 1) files["DUTIES.md"] = roleSeatMarkdown(seat.role_id ?? persona.role ?? persona.id, seat, seat_types).replace("No named persona is mapped to this seat.", `Persona: ${persona.name} (${persona.id}).`);
    files["TEAM.md"] = teamMarkdown(persona);
    for (const [path, body, limit] of [["soul.md", soul, 12_000], ["playbook.md", seatPlaybook(persona, seat), 12_000]] as const) {
      const part = clip(body, limit); files[path] = part.text; if (part.cut) trimmed.push(path);
    }
  }
  // The role pack is small and immutable; never silently cut safety/access rules.
  if (encoder.encode(access).length > 16_000) fail("access.md exceeds the seat pack limit. Load the full agent before using it as a seat.");
  files["access.md"] = access || "Read by default. This seat grants no new access. Ask before any action outside the user's granted limits.";
  const result: TrimmedSeatPack = {
    ...(seat.seat_id ? { seat_id: seat.seat_id } : {}), persona_id: persona?.id ?? null,
    persona_status: persona ? "MAPPED" : neutralCoordinator ? "NEUTRAL_COORDINATOR_ROLE" : "UNMAPPED_ROLE_ONLY",
    ...(seat.role_id ? { role_id: seat.role_id } : {}), name: persona?.name ?? (neutralCoordinator ? "General coordinator" : "Role-only seat"), title: persona?.title ?? (neutralCoordinator ? "General coordinator" : seat.role_id!),
    seat_type: seat.seat_type, seat_types, toolbox: seat.toolbox ?? [], ...(seat.lens ? { lens: seat.lens } : {}), ...(seat.families ? { families: seat.families } : {}),
    files, other_files: other_files.slice(0, 80), ...(persona ? { facets: personaTeam(persona) } : {}), model_calls: 0, bytes: 0, trimmed,
    review_context: seat.seat_type === "judge" ? "Fresh context: job card, rubric, artifacts and producer notes only. Exclude the council and prior rankings." : "Use an isolated seat context when the host supports it.",
  };
  if (other_files.length > 80) trimmed.push("other_files");
  // A stable upper bound includes the bytes field itself, so even large family names cannot exceed it.
  result.bytes = encoder.encode(JSON.stringify({ ...result, bytes: MAX_SEAT_BYTES })).length;
  if (result.bytes > MAX_SEAT_BYTES) fail("This seat exceeds 60 KB. Reduce assigned families or linked files, then load it again.");
  return result;
}
